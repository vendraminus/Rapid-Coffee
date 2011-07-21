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

	$msg=$LANG['removeemail_ok'];

	if ( isset($_GET['b']) && isset($_GET['c']) ) {

		$db = clone $GLOBALS['maindb'];
		global $user;

		$check=hash('sha512',$_GET['b']."f/ch/ec)`\kΘ");

		if ($check==$_GET['c']){
			$db->query("DELETE FROM emails WHERE email = '{$_GET['b']}'; ");
			$msgclass="success";
		} else {
			$msg=$LANG['error'];
			$msgclass="error";
		}

	}
	$header='Location: '.$CONF['url_path'].'home.php?msg='.urlencode($msg).'&msgclass='.urlencode($msgclass);
	header( $header ) ;
?>
