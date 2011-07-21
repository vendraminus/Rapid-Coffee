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
require_once("class/Message.php");

class TListMessage{

	private $qtd;
	private $lastid;
	private $sorting;
	private $onlysubsumed;
	private $listType;

	public function __construct(){
		$this->sorting="date desc";
		$this->onlysubsumed=false;
		$this->lastid=-1;
	}

	function setListType($param){ $this->listType=$param; }
	function setOnlySubsumed($param){ $this->onlysubsumed=$param; }
	function setLastId($param) { $this->lastid=$param; }

	public function setSorting($param) { $this->sorting=$param; }
	public function setQtd($param) { $this->qtd=$param; }

	function getJsonTags(){
		//if ($this->listType=='cloneFollowed')
		//	$query = Channel::cloneFollowed($this->sorting, $this->qtd);
		//elseif ($this->listType=='cloneMy')
			$query = Message::cloneMy($this->qtd, $this->lastid,$this->sorting);
		//else
		//	$query = Channel::cloneAll($this->sorting, $this->qtd);

		$result = array();
		if ($query!=null){
			foreach ($query as $message){
				$tmp = $message->getJsonTags();
				if ($this->onlysubsumed)
						unset($tmp['msg']);
				array_push($result, $tmp);
			}
		}
		return $result;
	}
}

?>
