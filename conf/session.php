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

	require_once('config.php');
	require_once("class/User.php");
	require_once('controller/signin.php');
	require_once('controller/signout.php');
	require_once('controller/kill_cookies.php');


	if (!session_start())
		die('Sorry, but we could not start a session.');


	function set_anon_user()
	{
		$user = new AnonUser();
		if (isset($_POST['nickname']))
			$user->setNickname(trim($_POST['nickname']));
		else
			$user->setNickname("Anon");
		//$user->setFingerprint("12345");
		$user->loadorsave();
		$_SESSION['user'] = $user;
		return $user;
	}
	
	if (isset($_SESSION['user'])){
		$user = $_SESSION['user'];
		$user->load(true);
	}
	else if (isset($_COOKIE['nickname']) && isset($_COOKIE['password']))
	{
		$result = signin($_COOKIE['nickname'], $_COOKIE['password'], true, 'yes');
		if (isset($_SESSION['user']) && $result['ok']==true)
			$user = $_SESSION['user'];
		else {
			kill_cookies();
			$user = set_anon_user();
		}

	} else
		$user = set_anon_user();
?>
