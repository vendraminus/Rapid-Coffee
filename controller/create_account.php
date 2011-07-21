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

require_once("class/User.php");
require_once("class/Channel.php");
require_once("conf/config.php");
require_once("controller/add_topic.php");

function create_account()
{
	global $CONF;
	$user = new RegUser();

	if (!preg_match("/^[".$CONF['nickname_chars']."]+$/i", $_POST['nickname_create_account']))
		return array('ok'=>false, 'error'=>'invalid nickname');

	if (trim($_POST['password_create_account'])=='')
		return array('ok'=>false, 'error'=>'no password');

	$user->setEmail($_POST['email_create_account']);
	$user->setNickname($_POST['nickname_create_account']);
	$user->setPassword($_POST['password_create_account']);
	if (isset($_POST['signature_create_account']))
		$user->setSignature($_POST['signature_create_account']);

	if (isset($_POST['camefrom_create_account']))
		$user->setCameFrom($_POST['camefrom_create_account']);

	$r = $user->save();
	if ($r=='ok')
	{
		$channel=new Channel();
		$channel->setId(1);
		$channel->forceFollow($user);
		$r = $user->sendEmail();
		if (!$r)
			return array('ok'=>false, 'error'=>'we could not send the e-mail.');
		else{
			$GLOBALS['user'] = $user;
			$rc = new RegUser();
			$rc->setNickname("RapidCoffee");
			$rc->load();
			$topic = new Topic();
			$topic->setChannel($channel);
			$topic->setUser($rc);
			$topic->setSubject("Dêem boas vindas ao usuário " . $user->getNickname() . "!");
			$msg = "Seja bem-vindo(a), <b>" . $user->getNickname() . "</b>. Criamos este tópico para que você possa se apresentar e conhecer um pouco dos usuários do site. Boa estadia =)<br /><br />Equipe Rapid Coffee.";
			$msg = str_replace('&nbsp;',' ',$msg);
			$topic->setMsg($msg);
			$topic->save();
			$topic->follow();
			return array('ok'=>true, 'error'=>'');
		}
	}
	return array('ok'=>false, 'error'=>$r);
}


/*
require_once("class/User.php");
require_once("conf/config.php");
	
function create_account()
{
	global $CONF;
	$user = new UnconfirmedUser();

	if (!preg_match("/^[".$CONF['nickname_chars']."]+$/i", $_POST['nickname_create_account']))
		return array('ok'=>false, 'error'=>'invalid nickname');

	$user->setEmail($_POST['email_create_account']);
	$user->setNickname($_POST['nickname_create_account']);
	$user->setPassword($_POST['password_create_account']);
	if (isset($_POST['signature_create_account']))
		$user->setSignature($_POST['signature_create_account']);

	$r = $user->save();

	if ($r=='ok')
		return array('ok'=>true, 'error'=>'');
	else
		return array('ok'=>false, 'error'=>'We could not create this account. Reason: ' . $r . '.');
}
*/
?>
