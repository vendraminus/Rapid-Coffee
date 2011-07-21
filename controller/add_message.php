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

require_once("class/Message.php");
require_once("class/User.php");
require_once("conf/session.php");
require_once("tool/utility.php");

function add_message()
{
	global $CONF;
	$user = $_SESSION['user'];

	if ($user->getBanned()>0){
		return array('ok'=>false, 'error'=>'banned '.$user->getBanned());
	}

	if (isset($_SESSION['message_last_flood_time'])){

		if ((time() - $_SESSION['message_last_flood_time']) < $CONF['message_time_to_wait_flood']){
			$time_to_wait = $CONF['message_time_to_wait_flood'] - (time() - $_SESSION['message_last_flood_time']);
			return array('ok'=>false, 'error'=>'flood '.$time_to_wait);
		}

	}

	$_SESSION['message_last_flood_time']=time();

	$user = $_SESSION['user'];
	$userto=new RegUser();
	if (isset($_POST['user_to_id'])) $userto->setId($_POST['user_to_id']);
	elseif (isset($_POST['user_to_email'])) $userto->setEmail($_POST['user_to_email']);
	elseif (isset($_POST['user_to_nickname'])) $userto->setNickname($_POST['user_to_nickname']);
	else return array('ok'=>false, 'error'=>'undefined user to send');

	$message = new Message();

	$message->setUserFrom($user);
	$message->setUserTo($userto);

	$subject = strip_tags($_POST['subject']);
	if (strlen(str_replace(' ', '', $subject)) < $CONF['min_msg_chars'])
		return array('ok'=>false, 'error'=>'too short subject');
	$message->setSubject($subject);

	$msg = unescape_ampersand($_POST['msg']);
	if (strlen(str_replace(' ', '', strip_tags($msg))) < $CONF['min_msg_chars'])
		return array('ok'=>false, 'error'=>'too short message');

	$msg = strip_tags($msg, $CONF['permitted_tags_msg']);
	//$msg = ereg_replace("[[:alpha:]]+://[^<>[:space:]]+[[:alnum:]/]","<a target=\"_BLANK\" href=\"\\0\">\\0</a>", $msg); //detectando URLs
	$msg = text_linkify($msg);
	$msg = str_replace('&nbsp;',' ',$msg);
	$message->setMsg($msg);

	$result = $message->save();
	if ($result=='ok'){
		return array('ok'=>true, 'error'=>'');
	}
	else
		return array('ok'=>false, 'error'=>'problems with this message: '.$result);
}

?>
