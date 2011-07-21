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
function checkEmail($email) {
  $result = TRUE;
  if(!eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$", $email)) {
    $result = FALSE;
  }
  return $result;
}


	require_once('conf/location.php');

	global $LANG;
	global $CONF;

	if (isset($_GET['email_add_email']) && (checkEmail($_GET['email_add_email']))){
		$db = clone $GLOBALS['maindb'];
		global $user;
		$db->query("INSERT INTO emails(email,lang) VALUES ('{$_GET['email_add_email']}','{$user->getLang()}');");

		$check=hash('sha512',$_GET['email_add_email']."f/ch/ec)`\kΘ");

		eval($LANG['addemail_body']);
		//system("echo \"".$body."\" > email.html");

		$headers  = "MIME-Version: 1.0\r\n";
		$headers .= "Content-type: text/html; charset=UTF-8\r\n";

		/* headers adicionais */
		$headers .= "From: {$CONF['email_from']}\r\n";
		$headers .= "To: {$_GET['email_add_email']} <{$_GET['email_add_email']}>\r\n";
		
			//print_r($body);
 			mail($_GET['email_add_email'], "Rapidcoffee", $body, $headers);

	}
	header( 'Location: '.$CONF['url_path'].'home.php' ) ;
?>
