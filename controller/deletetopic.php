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

function deletetopic()
{
	global $CONF;
	$user = $_SESSION['user'];

	if (!isset($_GET['topicid_deletetopic']) || empty($_GET['topicid_deletetopic']))
		return array('ok'=>'false','error'=>'no id');
	elseif ($user->isAnon())
		return array('ok'=>false,'error'=>'anon cannot delete topic');
	else {

		$topic = new Topic();
		$topic->setId($_GET['topicid_deletetopic']);
		$topic->load();
		if (
		    (!$topic->getUser()->isAnon() && $topic->getUser()->getId() == $user->getId()) ||
		    ($topic->getChannel()->getUser()->getId() == $user->getId())
		   )
		{
			$topic->delete();
			return array('ok'=>true,'error'=>'');
		}
		return array('ok'=>false,'error'=>'you cannot delete this topic');
	}
}
?>
