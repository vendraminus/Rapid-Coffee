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

	require_once('conf/config.php');
	require_once("class/User.php");
	require_once('conf/location.php');

	global $LANG;

	if (!isset($_GET['b']) || !isset($_GET['c'])){
		$msg=$LANG['error'].": ".$LANG['error_intrusion'];
		$msgclass="error";
	} else {
	
		$user = new RegUser();
		$user->setEmail(urldecode($_GET['b']));

		$check=substr(hash('sha512',"i want".$user->getEmail()."Θ never 咖啡 receive email食物"),0,8);

		if ($check==urldecode($_GET['c'])) {
			$user->stopReceiveEmail();
			$msg=$LANG['user_stopmail'];
			$msgclass="success";
		} else {
			$msg=$LANG['error']."<br/>".$LANG['error_intrusion'];
			$msgclass="error";
		}
	}

	$header='Location: '.$CONF['url_path'].'home.php?msg='.urlencode($msg).'&msgclass='.urlencode($msgclass);
	header( $header ) ;
?>
