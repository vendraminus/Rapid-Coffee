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
require_once('class/User.php');

function update_user(){

	$u = $_SESSION['user'];
	if ($u->isAnon()) $result=array("ok"=>false, "error"=>"anonymous cannot change account");
	else {
		if (isset($_GET['password_update_user']) && !empty($_GET['password_update_user'])) $u->setPassword($_GET['password_update_user']);
		if (isset($_GET['lang_update_user'])) $u->setLang($_GET['lang_update_user']);
		if (isset($_GET['signature_update_user'])) $u->setSignature(strip_tags($_GET['signature_update_user']));
		if (isset($_GET['email_mytopics_update_user'])) $u->setEmailMyTopics($_GET['email_mytopics_update_user']);
		if (isset($_GET['email_mychannels_update_user'])) $u->setEmailMyChannels($_GET['email_mychannels_update_user']);
		if (isset($_GET['email_followedtopics_update_user'])) $u->setEmailFollowedTopics($_GET['email_followedtopics_update_user']);
		if (isset($_GET['email_followedchannels_update_user'])) $u->setEmailFollowedChannels($_GET['email_followedchannels_update_user']);
		$result=$u->save();
		if ($result=='ok')
			$result=array("ok"=>true, "error"=>"");
		else
			$result=array("ok"=>false, "error"=>"$result");
				
	}
	return $result;
}
?>
