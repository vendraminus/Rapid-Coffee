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
	require_once('conf/location.php');
	require_once('conf/session.php');
	require_once("class/User.php");
	require_once("class/Channel.php");
	require_once("class/Topic.php");

	//require_once("class/Addthis.php");

	global $CONF;

	$user=$_SESSION['user'];	

	if (isset($_GET['topicid']))
	{
		$topic = new Topic();
		$topic->setId($_GET['topicid']);		

		$channel = $topic->getChannel();
		$channel->load();

		$OG['topic_title'] = $topic->getSubject();
		$OG['topic_msg'] = $topic->getSubsumedMsg();

		if ($channel->getId()>0)
		{
			$OG['request'] = 'openchannel';
			$OG['channel_name'] = $channel->getName();
			$OG['channel_desc'] = $channel->getDescription();
			$OG['channel_logo'] = $CONF['url_path'] . $channel->getLogoFile('big');

		}

		if (isset($_GET['sms_ss'])){
			$db = clone $GLOBALS['maindb'];
			$_anon=($user->isAnon())?'true':'false';
			$_channelid=($channel->getId()>0)?$channel->getId():0;
			$db->query("INSERT INTO addthis(channelid,topicid,sms_ss,at_xt,userid,anon,ip) values ('{$_channelid}','{$topic->getId()}','".$_GET['sms_ss']."','".$_GET['at_xt']."','{$user->getId()}','{$_anon}','".$_SERVER['REMOTE_ADDR']."');");
		}

		
		$_newcookie=(isset($_COOKIE['autoopentopic']))?$_COOKIE['autoopentopic'].'_':'';
		$_newcookie.=$topic->getId();
		setcookie("autoopentopic", $_newcookie, time()+60);

	}

	if (isset($_GET['fromid']))
		setcookie("visitnumber", 0, time()-1);

	//$header='Location: '.$CONF['url_path'];
	//header( $header ) ;
	include_once('facebook-redirect.php');
?>
