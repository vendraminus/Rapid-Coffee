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

function update_channel()
{
	global $user;
	global $CONF;

	$_SESSION['channel_last_flood_time']=time();

	$user = $_SESSION['user'];	

	$channel = new Channel();
	if (isset($_GET['channelid_update_channel'])){
		$channel->setId($_GET['channelid_update_channel']);
		$channel->load();
		if ( ($user->getId()!=$channel->getUser()->getId()) || ($user->isAnon()) )
			return array('ok'=>false, 'error'=>'you are not the owner');
	} else {
		return array('ok'=>false, 'error'=>'no id');
	}

	$description = unescape_ampersand($_POST['description']);
	$description = strip_tags($description, $CONF['permitted_tags_msg']);
	$description = text_linkify($description);
	$description = str_replace('&nbsp;',' ',$description);
	$channel->setDescription($description);

	//system("echo \"$description\" > log.txt");

	if (isset($_POST['lang']) && !empty($_POST['lang']))
		$channel->setLang($_POST['lang']);

	if (isset($_POST['asktofollow'])) $channel->setAsktofollow($_POST['asktofollow']);
	if (isset($_POST['perm_member'])) $channel->setPermMember($_POST['perm_member']);
	if (isset($_POST['perm_reguser'])) $channel->setPermReguser($_POST['perm_reguser']);
	if (isset($_POST['perm_anon'])) $channel->setPermAnon($_POST['perm_anon']);

	if ($channel->save()=='ok'){
		return array('ok'=>true, 'error'=>'');
	}
	else
		return array('ok'=>false, 'error'=>'problems with this channel');
}

?>
