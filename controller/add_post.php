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

require_once("class/Post.php");
require_once("class/Topic.php");
require_once("conf/session.php");
require_once("tool/utility.php");

function add_post()
{
	global $CONF;
	$user = $_SESSION['user'];

	if ($user->getBanned()>0){
		return array('ok'=>false, 'error'=>'banned '.$user->getBanned());
	}

	if (isset($_SESSION['post_last_flood_time'])){

		if ((time() - $_SESSION['post_last_flood_time']) < $CONF['post_time_to_wait_flood']){
			$time_to_wait = $CONF['post_time_to_wait_flood'] - (time() - $_SESSION['post_last_flood_time']);
			return array('ok'=>false, 'error'=>'flood '.$time_to_wait);
		}

	}

	$post = new Post();

	$topic = new Topic(); $topic->setId($_GET['topicid_add_post']);

	if (!$topic->getChannel()->canIPost())
		return array('ok'=>false, 'error'=>'you cant create post in this channel');

	$post->setTopic($topic);
	$post->setUser($user);

	$msg = unescape_ampersand($_POST['msg']);
	if (strlen(str_replace(' ', '', strip_tags($msg))) < $CONF['min_msg_chars'])
		return array('ok'=>false, 'error'=>'too short message');

	$msg = strip_tags($msg, $CONF['permitted_tags_msg']);
	//$msg = ereg_replace("[[:alpha:]]+://[^<>[:space:]]+[[:alnum:]/]","<a target=\"_BLANK\" href=\"\\0\">\\0</a>", $msg); //detectando URLs
	$msg = text_linkify($msg);
	$post->setPost($msg);

	if ($post->save()=='ok'){
		$_SESSION['post_last_flood_time']=time();	

		$topic->follow();
		$topic->setId($topic->getId());	$topic->load(); //update topic->counter
		$topic->visit();
		return array('ok'=>true, 'error'=>'');
	}
	else
		return array('ok'=>false, 'error'=>'Problem with this post.');
}
?>
