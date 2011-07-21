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

function like_dislike_this()
{
	global $user;
	if ($_GET['op']=='topic'){
		$topic = new Topic(); $topic->setId($_GET['topicid']);
		if ($_GET['liked']=='yes')
			$result = $topic->like();
		else
			$result = $topic->dislike();
	} else {
		$post = new Post(); $post->setId($_GET['postid']);
		if ($_GET['liked']=='yes')
			$result = $post->like();
		else
			$result = $post->dislike();
	}

	if ($result=='ok')
		$result = array('ok'=>true,'error'=>'');
	else
		$result = array('ok'=>false,'error'=>$result);
	return $result;
}
?>
