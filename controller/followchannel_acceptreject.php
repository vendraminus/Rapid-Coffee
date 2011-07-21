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

	require_once('conf/location.php');
	require_once("class/Channel.php");
	require_once("class/User.php");

	require_once("class/Message.php");

	global $LANGALL;
	global $LANG;
	global $CONF;

	$db = clone $GLOBALS['maindb'];

	if (!isset($_GET['b']))
		return array("ok"=>false, error=>"no following");

	$check=hash('sha512',"00`Θ^*' ♣  hk".chr(11)."1".$_GET['b']);

	if ($check==$_GET['c']){
		
		$ufc_=Channel::confirmFollow($_GET['b'],$_GET['a']=='accept');
		if (count($ufc_)>0){
			$userto=new RegUser();
			$userto->setId($ufc_['userid']);$userto->load();
			$channel=new Channel();
			$channel->setId($ufc_['channelid']);
			$message = new Message();
			$message->setUserFrom($_SESSION['user']);
			$message->setUserTo($userto);
			if ($_GET['a']=='accept'){
				$msg=$LANG['channel_confirmfollow_accepted'];
				if ($userto->getLang()=='pt_br'){
					$message->setSubject($LANGALL['pt_br']['channel_asktofollow_subject']);
					$message->setMsg('#'.$channel->getName().'\n<br/>'.$LANGALL['pt_br']['channel_confirmfollow_accepted']);
				} else {
					$message->setSubject($LANGALL['en_us']['channel_asktofollow_subject']);
					$message->setMsg('#'.$channel->getName().'\n<br/>'.$LANGALL['en_us']['channel_confirmfollow_accepted']);
				}
			} else {
				$msg=$LANG['channel_confirmfollow_rejected'];
				if ($userto->getLang()=='pt_br'){
					$message->setSubject($LANGALL['pt_br']['channel_asktofollow_subject']);
					$message->setMsg('#'.$channel->getName().'\n<br/>'.$LANGALL['pt_br']['channel_confirmfollow_rejected']);
				} else {
					$message->setSubject($LANGALL['en_us']['channel_asktofollow_subject']);
					$message->setMsg('#'.$channel->getName().'\n<br/>'.$LANGALL['en_us']['channel_confirmfollow_rejected']);
				}
			}
			$message->save();
		} else 
			$msg=$LANG['channel_confirmfollow_already'];
		$msgclass="info";
	} else {
		$msg=$LANG['error_intrusion'];
		$msgclass="error";
	}
	$header='Location: '.$CONF['url_path'].'home.php?msg='.urlencode($msg).'&msgclass='.urlencode($msgclass);
	header( $header ) ;
?>
