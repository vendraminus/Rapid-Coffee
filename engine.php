<?php
/*	RapidCoffee is a free, opensource dynamic internet forum.
	(C) Copyright 2011.

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
?>
<?php
require_once('tool/utility.php');

reset($_POST);
 foreach($_POST as $key => $value){
//   	if ($key!='nickname_signin'){
	   $_POST[$key] = cleanQuery($value);
	   $$key = cleanQuery($value);
//	}
 }
 reset($_GET);
 foreach($_GET as $key => $value){
    $_GET[$key] = cleanQuery($value);
    $$key = cleanQuery($value);
 }

require_once('conf/config.php');
require_once('conf/session.php');

/* SOH PRA SEGUIR O CANAL 1 */
//		require_once('class/Channel.php');
//		$channel=new Channel();
//		$channel->setId(1);
//		$channel->follow();
/* TIRAR DEPOIS ***/


$db = $GLOBALS['maindb'];
$db->query("set search_path=beta,public,pg_catalog;");

//file_put_contents('log',"GET:\n".print_r($_GET,true)."\nPOST:\n".print_r($_POST,true)."\nFILES:\n".print_r($_FILES,true));

if (isset($_GET['SYSTEM_redirect']))
	engine_doit();
elseif (!isset($_GET['SYSTEM_json']) || ($_GET['SYSTEM_json']))
	echo json_encode(engine_doit());
else
	return engine_doit();

function engine_doit(){
	global $CONF;
	$whats = explode(',', $_GET['what']);
	$result = null;

	if (isset($_GET['SYSTEM_redirect'])){
		unset($_GET['SYSTEM_redirect']);
		switch($_GET['what']){
			case 'topic':
				include('basichtml/viewtopic.php');
				break;
			case 'datetopics':
				include('basichtml/topic_list.php');
				break;
			case 'confirm_user':
				include('controller/confirm_user.php');
				break;
			case 'user_stopmail':
				include('controller/user_stopmail.php');
				break;
			case 'add_email':
				include('controller/add_email.php');
				break;
			case 'remove_email':
				include('controller/remove_email.php');
				break;
			case 'restore_password':
				include('controller/restore_password.php');
				break;
			case 'followchannel_acceptreject':
				include('controller/followchannel_acceptreject.php');
				break;
			case 'autoopenchannel':
				include('controller/autoopenchannel.php');
				break;
			case 'autoopentopic':
				include('controller/autoopentopic.php');
				break;
/*			case 'ETUEngine':
				include('tool/ETUEngine.php');
				$etu=new ETUEngine();
				$etu->start(1);
				break;
*/

		}
		return;
	} 
	foreach ($whats as $what)
	{
		switch($what)
		{
			case 'fromname':
				require_once("controller/fromname.php");
				$result['fromname'] = fromname($_GET['id_fromname']);
				break;
			case 'setuserfrom':
				require_once("class/User.php");
				$tuser = new RegUser();
				$tuser->setNickname($_GET['nick_setuserfrom']);
				$valid = $tuser->validatePassword($_GET['pass_setuserfrom']);
				if ($valid)
				{
					$tuser->load();
					$tuser->setCameFrom($_GET['fromid_setuserfrom']);
					$tuser->save();
				}
				break;
			case 'message':
				require_once('template/TMessage.php');
				require_once('class/Message.php');
				$message = new Message(); 
				if (isset($_GET['id_message']) && !empty($_GET['id_message']))
					$message->setId($_GET['id_message']);
				else { $result['message']=array(); break; }
				$tmessage = new TMessage(); $tmessage->setMessage($message);
				$result['message']=$tmessage->getJsonTags();
				break;
			case 'mymessages':
				require_once('template/TListMessage.php');
				$tlist = new TListMessage();	$tlist->setListType("cloneMy"); $tlist->setOnlySubsumed(true);
				if (isset($_GET['sorting_mymessages'])) $tlist->setSorting($_GET['sorting_mymessages']);
				if (isset($_GET['lastid_mymessages'])) $tlist->setLastId($_GET['lastid_mymessages']);
				$result['mymessages']=$tlist->getJsonTags();
				break;
			case 'regchannel':
				require_once("template/TChannel.php");
				require_once("class/Channel.php");
				$t = new TChannel();
				$o=new Channel();
				$prettyUrl='';
				if (isset($_GET['id_regchannel'])) {
					$o->setId($_GET['id_regchannel']);
				} elseif (isset($_GET['name_regchannel'])) {
					if (substr($_GET['name_regchannel'],-1,1)=='-'){
						$result['regchannel']=array("ok"=>false,"error"=>"invalid name","exist"=>true,'prettyUrl'=>'');
						break;
					} else {
						$o->setName($_GET['name_regchannel']);
						$prettyUrl=Channel::prettyUrlAvailable($_GET['name_regchannel']);
					}
				} elseif (isset($_GET['urlname_regchannel'])) {
					if ($_GET['urlname_regchannel'] != Channel::prettyUrl($_GET['urlname_regchannel'])){
						$result['regchannel']=array("ok"=>false,"error"=>"invalid url","exist"=>true, 'prettyUrl'=>'');
						break;
					}
					$o->setUrlname($_GET['urlname_regchannel']);
					$prettyUrl=$_GET['urlname_regchannel'];
				} else {
					$result['regchannel']=array("ok"=>false,"error"=>"no param", "exist"=>true, 'prettyUrl'=>'');
					break;
				}
				$t->setChannel($o);
				$r=$t->getJsonTags();
				if ($r['id']==null || $r['name']==null || $r['lang']==null)
					$result['regchannel']=array("ok"=>true,"error"=>"","exist"=>false,'prettyUrl'=>$prettyUrl);
				else
					$result['regchannel']=array("ok"=>true,"error"=>"","exist"=>true,'prettyUrl'=>$r['urlname']);
				break;
			case 'channels':
				require_once('template/TListChannel.php');
				$tlist = new TListChannel();	$tlist->setListType("cloneAll"); $tlist->setOnlySubsumed(true);
				if (isset($_GET['sorting_channels'])) $tlist->setSorting($_GET['sorting_channels']);
				$result['channels']=$tlist->getJsonTags();
				break;
			case 'followedchannels':
				require_once('template/TListChannel.php');
				$tlist = new TListChannel();
				if ($_SESSION['user']->isAnon())
					$tlist->setListType("cloneAll");
				else
					$tlist->setListType("cloneFollowed"); 
				$tlist->setOnlySubsumed(true);
				if (isset($_GET['sorting_followedchannels'])) $tlist->setSorting($_GET['sorting_followedchannels']);
				$result['followedchannels']=$tlist->getJsonTags();
				break;
			case 'mychannels':
				require_once('template/TListChannel.php');
				$tlist = new TListChannel();	$tlist->setListType("cloneMy"); $tlist->setOnlySubsumed(false);
				if (isset($_GET['sorting_mychannels'])) $tlist->setSorting($_GET['sorting_mychannels']);
				$result['mychannels']=$tlist->getJsonTags();
				break;
			case 'mostvisitedchannels':
				require_once('template/TListChannel.php');
				$tlist = new TListChannel();	$tlist->setListType("cloneMostVisited"); $tlist->setOnlySubsumed(false);
				if (isset($_GET['qtd_mostvisitedchannels'])) $tlist->setQtd($_GET['qtd_mostvisitedchannels']);
				if (isset($_GET['signed_mostvisitedchannels'])) $tlist->setSigned($_GET['signed_mostvisitedchannels']);
				$result['mostvisitedchannels']=$tlist->getJsonTags();
				break;
			case 'recommendedchannels':
				require_once('template/TListChannel.php');
				$tlist = new TListChannel();	$tlist->setListType("cloneRecommended"); $tlist->setOnlySubsumed(false);
				if (isset($_GET['qtd_recommendedchannels'])) $tlist->setQtd($_GET['qtd_recommendedchannels']);
				$result['recommendedchannels']=$tlist->getJsonTags();
				break;
			case 'channel':
				require_once('template/TChannel.php');
				require_once('class/Channel.php');
				$channel = new Channel(); 
				if (isset($_GET['id_channel']) && !empty($_GET['id_channel']))
					$channel->setId($_GET['id_channel']);
				elseif (isset($_GET['name_channel']) && !empty($_GET['name_channel'])) 
					$channel->setName($_GET['name_channel']);
				else { $result['channel']=array(); break; }
				$tchannel = new TChannel(); $tchannel->setChannel($channel);
				$result['channel']=(array('channel'=>$tchannel->getJsonTags(), "topics"=>array() ));
				break;
			case 'followedchanneltopics':
				require_once('template/TListTopic.php');
				$tlisttopic = new TListTopic();	$tlisttopic->setListType("cloneChannelFollowed"); $tlisttopic->setOnlySubsumed(true);
				if (isset($_GET['orderid_followedchanneltopics'])) $tlisttopic->setOrderId($_GET['orderid_followedchanneltopics']);
				if (isset($_GET['lastorderid_followedchanneltopics'])) $tlisttopic->setLastOrderId($_GET['lastorderid_followedchanneltopics']);
				if (isset($_GET['sorting_followedchanneltopics'])) $tlisttopic->setSorting($_GET['sorting_followedchanneltopics']);
				if (isset($_GET['qtd_followedchanneltopics'])) $tlisttopic->setQtd($_GET['qtd_followedchanneltopics']);
				$result['followedchanneltopics']=$tlisttopic->getJsonTags();
				break;
			case 'recenttopics':
				require_once('getter/recenttopics.php');
				$result['recenttopics']=recenttopics();
				break;
			case 'datetopics':
				require_once('template/TListTopic.php');
				if (!isset($_GET['year_datetopics'])) {
					$result['datetopics']=array();
					break;
				}
				$tlisttopic = new TListTopic();	$tlisttopic->setListType("cloneByDate"); $tlisttopic->setOnlySubsumed(true);
				$tlisttopic->setYear($_GET['year_datetopics']);
				if (isset($_GET['month_datetopics'])) $tlisttopic->setMonth($_GET['month_datetopics']);
				if (isset($_GET['day_datetopics'])) $tlisttopic->setDay($_GET['day_datetopics']);
				$result['datetopics']=$tlisttopic->getJsonTags();
				break;
			case 'searchtopics':
				require_once('template/TListTopic.php');
				require_once('tool/SearchTopic.php');
				if (isset($_GET['words_searchtopics'])){
					$tlisttopic = new TListTopic();	$tlisttopic->setListType("cloneSearch"); $tlisttopic->setOnlySubsumed(true);
					$tlisttopic->setSearch(SearchTopic::getQuery($_GET['words_searchtopics']));
					if (isset($_GET['orderid_searchtopics'])) $tlisttopic->setOrderId($_GET['orderid_searchtopics']);
					$result['searchtopics']=$tlisttopic->getJsonTags();
				} else $result['searchtopics']=array("ok"=>false,"error"=>"no words");
				break;
			case 'searchmain':
				require_once('template/TListChannel.php');
				require_once('tool/SearchEngine.php');
				if (isset($_GET['words_searchmain'])){
					$tlisttopic = new TListChannel(); $tlisttopic->setListType("cloneSearch"); $tlisttopic->setOnlySubsumed(true);
					$tlisttopic->setSearch(SearchEngine::getQueryChannels(unescape_ampersand($_GET['words_searchmain'])));
					//if (isset($_GET['orderid_searchtopics'])) $tlisttopic->setOrderId($_GET['orderid_searchtopics']);
					$result['searchmain']['channels']=$tlisttopic->getJsonTags();
				} else $result['searchmain']=array("ok"=>false,"error"=>"no words");
				break;
			case 'usertopics':
				require_once('template/TListTopic.php');
				require_once('class/User.php');
				if (isset($_GET['nickname_usertopics'])){
					$tlisttopic = new TListTopic();	$tlisttopic->setListType("cloneByUser"); $tlisttopic->setOnlySubsumed(true);
					if (isset($_GET['sorting_usertopics'])) $tlisttopic->setSorting($_GET['sorting_usertopics']);
					$u=new RegUser();
					$u->setNickname($_GET['nickname_usertopics']); $u->load();
					$tlisttopic->setUser($u);
					if (isset($_GET['orderid_usertopics'])) $tlisttopic->setOrderId($_GET['orderid_usertopics']);
					if (isset($_GET['idchannel_usertopics'])) $tlisttopic->setIdChannel($_GET['idchannel_usertopics']);
					$result['usertopics']=$tlisttopic->getJsonTags();
				} else $result['usertopics']=array();
				break;
			case 'userposttopics':
				require_once('template/TListTopic.php');
				require_once('class/User.php');
				if (isset($_GET['nickname_userposttopics'])){
					$tlisttopic = new TListTopic();	$tlisttopic->setListType("cloneByUserPost"); $tlisttopic->setOnlySubsumed(true);
					if (isset($_GET['sorting_userposttopics'])) $tlisttopic->setSorting($_GET['sorting_userposttopics']);
					$u=new RegUser();
					$u->setNickname($_GET['nickname_userposttopics']); $u->load();
					$tlisttopic->setUser($u);
					if (isset($_GET['orderid_userposttopics'])) $tlisttopic->setOrderId($_GET['orderid_userposttopics']);
					if (isset($_GET['idchannel_userposttopics'])) $tlisttopic->setIdChannel($_GET['idchannel_userposttopics']);
					$result['userposttopics']=$tlisttopic->getJsonTags();
				} else $result['userposttopics']=array();
				break;
			case 'uft':
				require_once('getter/uft.php');
				$result['uft']=uft();
				break;
			case 'followedtopics':
				require_once('conf/session.php');
				require_once('template/TListTopic.php');
				$tlisttopic = new TListTopic();	$tlisttopic->setListType("cloneFollowed"); $tlisttopic->setOnlySubsumed(true);
				if (isset($_GET['orderid_followedtopics'])) $tlisttopic->setOrderId($_GET['orderid_followedtopics']);
				if (isset($_GET['idchannel_followedtopics'])) $tlisttopic->setIdChannel($_GET['idchannel_followedtopics']);
				$result['followedtopics']=$tlisttopic->getJsonTags() ;
				break;
		
			case 'topic':
				if (!isset($_GET['id_topic']) || empty($_GET['id_topic'])) { $result['topic']=array(); break; }
				require_once('template/TTopic.php');
				require_once('template/TListPost.php');
				require_once('class/Topic.php');
				require_once('class/Channel.php');
				$topic = new Topic(); $topic->setId($_GET['id_topic']);
				if (!$topic->getChannel()->canIRead()){ $result['topic']=array("error"=>'you cant see this topic'); break; }
				$ttopic = new TTopic(); $ttopic->setTopic($topic);
				$tlistpost = new TListPost(); $tlistpost->setTopic($topic);
				$tlistpostbest = new TListPost(); $tlistpostbest->setTopic($topic); $tlistpostbest->setQtd($CONF['post_best_qt']); $tlistpostbest->setSorting("likes desc,date desc");
				$result['topic']=(array('topic'=>$ttopic->getJsonTags(), "posts"=>$tlistpost->getJsonTags(), "bestposts"=>$tlistpostbest->getJsonTags()) );
				break;

			case 'refresh_topic_previews':
				if (!isset($_GET['ids_refresh_topic_previews']) || empty($_GET['ids_refresh_topic_previews'])) { $result['refresh_topic_previews']=array(); break;}
				if (!isset($_GET['versions_refresh_topic_previews']) || empty($_GET['versions_refresh_topic_previews'])) { $result['refresh_topic_previews']=array(); break;}
				require_once("template/TListTopic.php");
				$tlisttopic = new TListTopic();	$tlisttopic->setListType("cloneUpdated"); $tlisttopic->setOnlySubsumed(true);
				$tlisttopic->setIds(explode(",",$_GET['ids_refresh_topic_previews']));
				$tlisttopic->setCounters(explode(",",$_GET['versions_refresh_topic_previews']));
				$result['refresh_topic_previews']=$tlisttopic->getJsonTags();
				break;
			case 'refresh_topics':
				if (!isset($_GET['ids_refresh_topics']) || empty($_GET['ids_refresh_topics'])) { $result['refresh_topics']=array(); break;}
				if (!isset($_GET['versions_refresh_topics']) || empty($_GET['versions_refresh_topics'])){ $result['refresh_topics']=array(); break;}
				require_once("template/TListTopic.php");
				$tlisttopic = new TListTopic();	$tlisttopic->setListType("cloneUpdated"); $tlisttopic->setWithPosts(true);
				if (isset($_GET['idchannel_refresh_topics'])) $tlisttopic->setIdChannel($_GET['idchannel_refresh_topics']);
				$tlisttopic->setIds(explode(",",$_GET['ids_refresh_topics']));
				$tlisttopic->setCounters(explode(",",$_GET['versions_refresh_topics']));
				$result['refresh_topics']=$tlisttopic->getJsonTags();
				break;
			case 'new_topic_previews':
				require_once("getter/new_topic_previews.php");
				$result['new_topic_previews']=new_topic_previews();
				break;
			case 'reguser':
				require_once("template/TUser.php");
				require_once("class/User.php");
				$tuser = new TUser();
				$u=new RegUser();
				if (isset($_GET['id_reguser'])) $u->setId($_GET['id_reguser']);
				elseif (isset($_GET['email_reguser'])) $u->setEmail($_GET['email_reguser']);
				elseif (isset($_GET['nickname_reguser'])) {
					if (substr($_GET['nickname_reguser'],-1,1)=='-'){
						$result['reguser']=array("ok"=>true,"error"=>"","exist"=>true);
						break;
					} else {
						$u->setNickname($_GET['nickname_reguser']);
					}
				} else {
					$result['reguser']=array("ok"=>false,"error"=>"no param");
					break;
				}
				$tuser->setUser($u);
				$r=$tuser->getJsonTags();
				if ($r['id']==null || $r['nickname']==null || $r['lang']==null)
					$result['reguser']=array("ok"=>true,"error"=>"","exist"=>false);
				else
					$result['reguser']=array("ok"=>true,"error"=>"","exist"=>true);
				break;
			case 'userscamefrom':
				require_once('template/TListUser.php');
				$tlist = new TListUser(); $tlist->setListType("cloneLastCameFrom");
				if (isset($_GET['camefrom_userscamefrom']))
					$tlist->setCameFrom($_GET['camefrom_userscamefrom']);
				if (isset($_GET['qtd_userscamefrom']))
					$tlist->setQtd($_GET['qtd_userscamefrom']);
				$result['userscamefrom']=$tlist->getJsonTags();
				break;
			case 'user':
				require_once("template/TUser.php");
				require_once("class/User.php");
				global $user;
				$tuser = new TUser(); 
				if (!isset($_GET['id_user']) || !isset($_GET['anon_user'])){
					$tuser->setUser($user);
					$tuser->setWithEmail(true);
				} else{
					if ($_GET['anon_user']){
						$u = new AnonUser(); $u->setId($_GET['id_user']);
					} else {
						$u = new RegUser(); $u->setId($_GET['id_user']); 
					}
					$tuser->setUser($u);
				}
				$result['user']=$tuser->getJsonTags();	
				break;
			case 'add_topic':
				require_once('controller/add_topic.php');
				$result['add_topic']=add_topic();
				break;
			case 'add_message':
				require_once('controller/add_message.php');
				$result['add_message']=add_message();
				break;
			case 'read_message':
				require_once('controller/read_message.php');
				$result['read_message']=read_message();
				break;
			case 'add_channel':
				require_once('controller/add_channel.php');
				$result['add_channel']=add_channel();
				break;
			case 'add_post':
				require_once('controller/add_post.php');
				$result['add_post']=add_post();
				break;
			case 'update_channel':
				require_once('controller/update_channel.php');
				$result['update_channel']=update_channel();
				break;
			case 'update_topic':
				require_once('controller/update_topic.php');
				$result['update_topic']=update_topic();
				break;
			case 'update_post':
				require_once('controller/update_post.php');
				$result['update_post']=update_post();
				break;
			case 'followtopic':
				require_once('controller/followtopic.php');
				$result['followtopic']=followtopic();
				break;
			case 'unfollowtopic':
				require_once('controller/unfollowtopic.php');
				$result['unfollowtopic']=unfollowtopic();
				break;
			case 'followchannel':
				require_once('controller/followchannel.php');
				$result['followchannel']=followchannel($_GET['channelid_followchannel']);
				break;
			case 'followchannels':
				require_once('controller/followchannel.php');
				$chids=explode(",",$_GET['channelids_followchannels']);
				for ($i=0;$i<count($chids);$i++)
					$result['followchannels'][$i]=followchannel($chids[$i]);
				break;
			case 'unfollowchannel':
				require_once('controller/unfollowchannel.php');
				$result['unfollowchannel']=unfollowchannel();
				break;
			case 'create_account':
				require_once('controller/create_account.php');
				$result['create_account']=create_account();
				break;
			case 'update_user_avatar':
				require_once('controller/update_user_avatar.php');
				$result['update_user_avatar'] = update_user_avatar($_GET['file'],$_GET['x1'],$_GET['y1'],$_GET['x2'],$_GET['y2']);
				break;
			case 'upload_temp_avatar':
				require_once('controller/upload_temp_avatar.php');
				$result['upload_temp_avatar'] = upload_temp_avatar();
				break;
			case 'update_channel_logo':
				require_once('controller/update_channel_logo.php');
				$result['update_channel_logo'] = update_channel_logo($_GET['file'],$_GET['x1'],$_GET['y1'],$_GET['x2'],$_GET['y2']);
				break;
			case 'upload_temp_logo':
				require_once('controller/upload_temp_logo.php');
				$result['upload_temp_logo'] = upload_temp_logo();
				break;
			case 'update_user':
				require_once('controller/update_user.php');
				$result['update_user'] = update_user();
				break;
			case 'change_user_lang':
				require_once('controller/change_user_lang.php');
				$result['change_user_lang']=change_user_lang();
				break;
			case 'like_dislike_this':
				require_once("controller/like_dislike_this.php");
				$result['like_dislike_this'] = like_dislike_this();
				break;
			case 'signin':
				$result['signin'] = signin($_POST['nickname_signin'], $_POST['password_signin'], false, $_POST['staysignedin_signin']);
				break;
			case 'signout':
				require_once("controller/signout.php");
				$result['signout'] = signout();
				break;
			case 'request_restore_password':
				require_once('controller/request_restore_password.php');
				$result['request_restore_password']=request_restore_password();
				break;
			case 'visittopic':
				require_once('class/Topic.php');
				if (!isset($_GET['topicid_visittopic'])) 
					$result['visittopic']=array("ok"=>false,"error"=>"error no id");
				else {
					$topic = new Topic();
					$topic->setId($_GET['topicid_visittopic']);
					if ($topic->visit())
						$result['visittopic']=array("ok"=>true,"error"=>"");
					else
						$result['visittopic']=array("ok"=>false,"error"=>"error db");
				}
				break;
			case 'deletetopic':
				require_once('controller/deletetopic.php');
				$result['deletetopic']=deletetopic();
				break;
			case 'lang':
				require_once('conf/location.php');
				global $LANG;
				$result['lang']=$LANG['JSON'];
				break;
			default:
				break;
		}
	}
	
	return $result;
}
?>
