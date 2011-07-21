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

require_once("class/Channel.php");
require_once("conf/session.php");
require_once("tool/utility.php");

function add_channel()
{
	global $CONF;
	global $LANGALL;
	$user = $_SESSION['user'];

	if ($user->getBanned()>0){
		return array('ok'=>false, 'error'=>'banned '.$user->getBanned());
	}

	if (isset($_SESSION['channel_last_flood_time'])){

		if ((time() - $_SESSION['channel_last_flood_time']) < $CONF['channel_time_to_wait_flood']){
			$time_to_wait = $CONF['channel_time_to_wait_flood'] - (time() - $_SESSION['channel_last_flood_time']);
			//return array('ok'=>false, 'error'=>'flood '.$time_to_wait);
		}

	}

	$_SESSION['channel_last_flood_time']=time();

	$user = $_SESSION['user'];	
	if ($user->isAnon())
		return array('ok'=>false, 'error'=>'anonymous cannot create channel');

	$channel = new Channel();
	$channel->setUser($user);

	$name = strip_tags($_POST['name']);
	if (strlen(str_replace(' ', '', $name)) < $CONF['channel_min_name'])
		return array('ok'=>false, 'error'=>'too short name');
	$channel->setName($name);

	$description = $_POST['description'];
	$description = strip_tags($description, $CONF['permitted_tags_msg']);
	$description = text_linkify($description);
	$description = str_replace('&nbsp;',' ',$description);
	$channel->setDescription($description);

	if (isset($_POST['lang']) && !empty($_POST['lang']))
		$channel->setLang($_POST['lang']);

	if (!isset($_POST['urlname']))
		$channel->setUrlname( Channel::prettyUrlAvailable($_POST['name']) );
	else {
		if ($_POST['urlname']!=Channel::prettyUrlAvailable($_POST['urlname']))
			return array('ok'=>false, 'error'=>'invalid urlname');
		else
			$channel->setUrlname($_POST['urlname']);
	}

	if (isset($_POST['asktofollow'])) $channel->setAsktofollow($_POST['asktofollow']);
	if (isset($_POST['perm_member'])) $channel->setPermMember($_POST['perm_member']);
	if (isset($_POST['perm_reguser'])) $channel->setPermReguser($_POST['perm_reguser']);
	if (isset($_POST['perm_anon'])) $channel->setPermAnon($_POST['perm_anon']);

	$result=$channel->save();
	if ($result=='ok'){
		$channel->follow();

		/*if ($channel->getLang()=='pt_br'){
			$title=$LANGALL['pt_br']['addchannel_welcome_title'];
			$message=$LANGALL['pt_br']['addchannel_welcome_message'];
		} else {
			$title=$LANGALL['en_us']['addchannel_welcome_title'];
			$message=$LANGALL['en_us']['addchannel_welcome_message'];
		}
		require_once('class/Topic.php');
		require_once('class/User.php');
		$user=new RegUser();
		$user->setId(1);
		$topic=new Topic();
		$topic->setSubject($title);
		$topic->setMsg($message);
		$topic->setChannel($channel);
		$topic->setUser($user);
		$topic->save();*/
		
		return array('ok'=>true, 'error'=>'', 'id'=>$channel->getId());
	}
	elseif ($result=='error channel already exists'){
		return array('ok'=>false, 'error'=>'error channel already exists','id'=>null);
	} elseif ($result=='error you created many channels'){
		return array('ok'=>false, 'error'=>'error you created many channels','id'=>null);
	} elseif ($result=='error user anon'){
		return array('ok'=>false, 'error'=>'error user anon','id'=>null);
	} else
		return array('ok'=>false, 'error'=>'problems with this channel - '.$result,'id'=>null);
}

?>
