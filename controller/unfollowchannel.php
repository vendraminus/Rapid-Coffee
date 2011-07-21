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

require_once('class/Channel.php');

function unfollowchannel(){

	if ($_SESSION['user']->isAnon())
		return array("ok"=>false, "error"=>"you have to login");

	$channel = new Channel();
	if (!isset($_GET['channelid_unfollowchannel']))
		return array("ok"=>false, "error"=>"no id");
	$channel->setId($_GET['channelid_unfollowchannel']);

	if ($channel->getUser()->getId()==$_SESSION['user']->getId())
		return array("ok"=>false, "error"=>"channel owner cant unfollow");

	if ($channel->unfollow())
		return array("ok"=>true, "error"=>"");
	else
		return array("ok"=>false, "error"=>"cant unfollow");

}
?>
