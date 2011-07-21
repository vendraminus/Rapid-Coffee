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
require_once("conf/session.php");

function update_topic()
{
	global $user;
	global $CONF;

//	if (isset($_SESSION['topic_last_flood_time'])){
//
//		if ((time() - $_SESSION['topic_last_flood_time']) < $CONF['topic_time_to_wait_flood']){
//			$time_to_wait = $CONF['topic_time_to_wait_flood'] - (time() - $_SESSION['topic_last_flood_time']);
//			return array('ok'=>false, 'error'=>'flood '.$time_to_wait);
//		}
//
//	}

	$_SESSION['topic_last_flood_time']=time();

	$user = $_SESSION['user'];	

	$topic = new Topic();
	if (isset($_GET['topicid_update_topic'])){
		$topic->setId($_GET['topicid_update_topic']);
		$topic->load();
		if ( ($user->getId()!=$topic->getUser()->getId()) || ($user->isAnon()!=$topic->getUser()->isAnon()) )
			return array('ok'=>false, 'error'=>'you are not the owner');
	} else {
		return array('ok'=>false, 'error'=>'no id');
	}

	//$subject = strip_tags($_POST['subject']);
	//if (strlen(str_replace(' ', '', $subject)) < $CONF['min_msg_chars'])
	//	return array('ok'=>false, 'error'=>'Too short subject.');
	//$topic->setSubject($subject);

	$msg = unescape_ampersand($_POST['msg_update_topic']);
	if (strlen(str_replace(' ', '', strip_tags($msg))) < $CONF['min_msg_chars'])
		return array('ok'=>false, 'error'=>'Too short message.');

	$msg = strip_tags($msg, $CONF['permitted_tags_msg']);
	$topic->setMsg($msg);

	if ($topic->save()=='ok'){
		//$topic->follow();
		return array('ok'=>true, 'error'=>'');
	}
	else
		return array('ok'=>false, 'error'=>'problems with this topic');
}

?>
