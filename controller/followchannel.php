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

function followchannel($channelid){

	if ($_SESSION['user']->isAnon())
		return array("ok"=>false, "error"=>"you have to login");

	global $LANGALL;
	global $CONF;

	$channel = new Channel();
	if (!isset($channelid))
		return array("ok"=>false, "error"=>"no id");
	$channel->setId($channelid);
	if ($channel->getAsktofollow()){
		if ($_SESSION['user']->isAnon())
			return array("ok"=>false, "error"=>"anon cant follow");

		require_once('class/Message.php');
		$message = new Message();
		$message->setUserFrom($_SESSION['user']);
		$message->setUserTo($channel->getUser());

		$__ufid = $channel->unconfirmed_follow();
		$check=hash('sha512',"00`Θ^*' ♣  hk".chr(11)."1".$__ufid);

		if ($channel->getUser()->getLang()=='pt_br'){
			$message->setSubject($LANGALL['pt_br']['channel_asktofollow_subject']);
			eval($LANGALL['pt_br']['channel_asktofollow_msg']);
			$msg = '#'.$channel->getName().'\n<br/>'.'@'.$_SESSION['user']->getNickname().'\n<br/>'.$body;
			if (isset($_GET['msg_followchannel']))
				$msg.=$_GET['msg_followchannel'];
			$message->setMsg($msg);
		} else {
			$message->setSubject($LANGALL['en_us']['channel_asktofollow_subject']);
			eval($LANGALL['pt_br']['channel_asktofollow_msg']);
			$msg = '#'.$channel->getName().'\n<br/>'.'@'.$_SESSION['user']->getNickname().'\n<br/>'.$body;
			if (isset($_GET['msg_followchannel']))
				$msg.=$_GET['msg_followchannel'];
			$message->setMsg($msg);
		}
		$result=$message->save();
		if ($result=='ok')
			return array("ok"=>false, "error"=>"asked for permission", "msg"=>"asked for permission");
		else
			return array("ok"=>false, "error"=>"error cant send message: ".$result, "msg"=>"");
		
	} else {
		if ($channel->follow())
			return array("ok"=>true, "error"=>"");
		else
			return array("ok"=>false, "error"=>"cant follow");
	}

}
?>
