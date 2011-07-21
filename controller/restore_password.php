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

	global $LANG;
	global $CONF;

	$db = clone $GLOBALS['maindb'];

	if (!isset($_GET['b']))
		return array("ok"=>false, error=>"no email");

	$user = new RegUser();
	$user->setEmail($_GET['b']); $user->load();
	$user_id=$user->getId();
	if (empty($user_id))
		return array("ok"=>false, "error"=>"no email");

	$check=hash('sha512',$user->getEmail().$user->getEncPassword()."Θ");

	if ($check==$_GET['c']){

		require_once('tool/utility.php');
		$newpassword=generateRandomPassword();
		$user->setPassword($newpassword);
		eval($LANG['restoreemail_body']);
		//system("echo \"".$body."\" > email.html");

		/*$headers  = "MIME-Version: 1.0\r\n";
		$headers .= "Content-type: text/html; charset=UTF-8\r\n";

		$headers .= "From: {$CONF['email_from']}\r\n";
		$headers .= "To: {$user->getNickname()} <{$user->getEmail()}>\r\n";
		*/
		
		require_once('class/Mail.php');
		$a=new Mail();
		$a->setEmailTo($user->getEmail());
		$a->setNicknameTo($user->getNickname());
		$a->setSubject("Nova senha");
		$a->setSubjectMsg("");
		$a->setMsg($body);
	 	if ($a->send()){
			$user->save();
			$msg=$LANG['restoreemail_message_ok'];
			$msgclass="info";
		} else {
			$msg=$LANG['error'];
			$msgclass="error";
		}
	} else {
		$msg=$LANG['error_intrusion'];
		$msgclass="error";
	}
	$header='Location: '.$CONF['url_path'].'home.php?msg='.urlencode($msg).'&msgclass='.urlencode($msgclass);
	header( $header ) ;
?>
