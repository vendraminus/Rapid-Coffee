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
require_once("conf/session.php");

function signin($nickname, $password, $encrypted, $staysignedin)
{
	global $user, $CONF;

	$u = new RegUser();
	if (strpos($nickname,'@')===false)
		$u->setNickname($nickname);
	else
		$u->setEmail($nickname);
	
	if ($u->mustValidateEmailFirst()){
		$u->sendEmail();
		return array('nickname'=>$u->getNickname(), 'ok'=>false, 'error'=>'must validate email first');
	}

	if ($encrypted)
		$valid = $u->validateEncPassword($password);
	else
		$valid = $u->validatePassword($password);

	if ($valid){
		$user = $u;
		$user->load();
		if ($user->getFirstTime())
		{
			$user->setFirstTime(false);
			$la=$user->save();
		}
		$_SESSION['user'] = $user;
		if ($staysignedin=='true')
		{
			setcookie('nickname', $user->getNickname(), $CONF['cookie_rememberme_lifetime']);
			setcookie('password', $user->getEncPassword(), $CONF['cookie_rememberme_lifetime']);
		}
		$result = array('user'=> array('nickname'=>$user->getNickname(),'anon'=>false),
		                          'ok'=>true, 'error'=>'');
	} else {
		$result = array('nickname'=>'', 'ok'=>false, 'error'=>'invalid password');
	}

	return $result;
}
?>
