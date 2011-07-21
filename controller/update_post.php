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

function update_post()
{
	global $user;	
	global $CONF;

	$post = new Post();

	if (isset($_GET['postid_update_post'])){
		$post->setId($_GET['postid_update_post']);
		$post->load();
		if ( ($user->getId()!=$post->getUser()->getId()) || ($user->isAnon()!=$post->getUser()->isAnon()) )
			return array('ok'=>false, 'error'=>'you are not the owner');
	} else {
		return array('ok'=>false,error=>'no id');
	}

	$msg = unescape_ampersand($_POST['msg_update_post']);
	if (strlen(str_replace(' ', '', strip_tags($msg))) < $CONF['min_msg_chars'])
		return array('ok'=>false, 'error'=>'Too short message.');

	$msg = strip_tags($msg, $CONF['permitted_tags_msg']);
	$post->setPost($msg);

	if ($post->save()=='ok'){
		return array('ok'=>true, 'error'=>'');
	}
	else
		return array('ok'=>false, 'error'=>'Problem with this post.');
}
?>
