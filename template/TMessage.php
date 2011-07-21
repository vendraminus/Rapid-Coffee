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
require_once("tool/utility.php");
require_once("class/Message.php");

class TMessage{

	private $message;	

	public function getMessage(){ return $this->message; }
	public function setMessage($param){ $this->message = $param; }

	function getJsonTags(){

		$user = $_SESSION['user'];

		if ($this->message!=null){
			if (!$user->isAnon()){
				if ($this->message->getUserTo()->getId() == $user->getId()){
					return $this->message->getJsonTags();
				}
			}
		}
		return array();
	}

}	

?>
