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

class TListUser{

	private $qtd;
	//private $sorting;
	private $with_email;
	private $listType;
	private $comefrom;

	public function __construct(){
	//	$this->sorting="data desc";
		$this->with_email=false;
		$this->comefrom=0;
	}

	function setListType($param){ $this->listType=$param; }
	function setWithEmail($param){ $this->with_email=$param; }
	function setCameFrom($param){ $this->comefrom=$param; }

	//public function setSorting($param) { $this->sorting=$param; }
	public function setQtd($param) { $this->qtd=$param; }

	function getJsonTags(){
		//if ($this->listType=='cloneLastCameFrom')		
			$query = RegUser::cloneLastCameFrom($this->comefrom, $this->qtd);

		$result = array();
		if ($query!=null){
			foreach ($query as $user){
				$tmp = $user->getJsonTags();
				if (!$this->with_email)
						unset($tmp['email']);
				array_push($result, $tmp);
			}
		}
		return $result;
	}
}

?>
