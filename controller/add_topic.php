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

require_once("class/Topic.php");
require_once("class/Channel.php");
require_once("conf/session.php");
require_once("tool/utility.php");

function add_topic()
{
	global $CONF;
	$user = $_SESSION['user'];

	if ($user->getBanned()>0){
		return array('ok'=>false, 'error'=>'banned '.$user->getBanned());
	}

	if (isset($_SESSION['topic_last_flood_time'])){

		if ((time() - $_SESSION['topic_last_flood_time']) < $CONF['topic_time_to_wait_flood']){
			$time_to_wait = $CONF['topic_time_to_wait_flood'] - (time() - $_SESSION['topic_last_flood_time']);
			return array('ok'=>false, 'error'=>'flood '.$time_to_wait);
		}

	}

	$user = $_SESSION['user'];	

	$topic = new Topic();

	if (isset($_GET['channelid_add_topic'])){
		$channel = new Channel();
		$channel->setId($_GET['channelid_add_topic']);
		if (!$channel->canITopic())
			return array('ok'=>false, 'error'=>'you cant create topic in this channel');
		$topic->setChannel($channel);
	}

	$topic->setUser($user);

	$subject = strip_tags($_POST['subject']);
	if (strlen(str_replace(' ', '', $subject)) < $CONF['min_msg_chars'])
		return array('ok'=>false, 'error'=>'too short subject');
	$topic->setSubject($subject);

	$msg = $_POST['msg'];
	if (strlen(str_replace(' ', '', strip_tags($msg))) < $CONF['min_msg_chars'])
		return array('ok'=>false, 'error'=>'too short message');

	$msg = strip_tags($msg, $CONF['permitted_tags_msg']);
	//$msg = ereg_replace("[[:alpha:]]+://[^<>[:space:]]+[[:alnum:]/]","<a target=\"_BLANK\" href=\"\\0\">\\0</a>", $msg); //detectando URLs
	$msg = text_linkify($msg);
	$msg = str_replace('&nbsp;',' ',$msg);
	$topic->setMsg($msg);

	if ($topic->save()=='ok'){

		$_SESSION['topic_last_flood_time']=time();

		$topic->follow();


		$headers  = "MIME-Version: 1.0\r\n";
		$headers .= "Content-type: text/html; charset=UTF-8\r\n";
		$headers .= "From: {$CONF['email_from']}\r\n";
		$headers .= "To: YOU <you>\r\n";
		$_pretty=Topic::prettyUrl($topic->getSubject());
		$body='Acesse: <a href="http://rapidcoffee.com//'.$topic->getId().'/'.$_pretty.'">http://rapidcoffee.com//'.$topic->getId().'/'.$_pretty.'</a>';
		//system("echo \"".$body."\" > email.html");
		//mail('lucasvendramin85@gmail.com, danilo.horta@gmail.com', "Rapidcoffee-NOVO TOPICO", $body, $headers);
		return array('ok'=>true, 'error'=>'');
	}
	else
		return array('ok'=>false, 'error'=>'Problems with this topic.');
}

?>
