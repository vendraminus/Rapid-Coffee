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
require_once("class/Channel.php");

class TListChannel{

	private $qtd;
	private $sorting;
	private $onlysubsumed;
	private $listType;
	private $search;
	private $signed;

	public function __construct(){
		$this->sorting="name asc";
		$this->onlysubsumed=false;
		$this->signed=0;
	}

	function setListType($param){ $this->listType=$param; }
	function setOnlySubsumed($param){ $this->onlysubsumed=$param; }
	function setSearch($param){ $this->search=$param; }

	public function setSorting($param) { $this->sorting=$param; }
	public function setQtd($param) { $this->qtd=$param; }
	public function setSigned($param) { $this->signed=$param; }

	function getJsonTags(){
		if ($this->listType=='cloneFollowed')
			$query = Channel::cloneFollowed($this->sorting, $this->qtd);
		elseif ($this->listType=='cloneMy')
			$query = Channel::cloneMy($this->sorting, $this->qtd);
		elseif ($this->listType=='cloneRecommended')
			$query = Channel::cloneRecommended($_SESSION['user'], $this->qtd);
		elseif ($this->listType=='cloneSearch')
			$query = Channel::cloneSearch($this->search, $this->qtd);
		elseif ($this->listType=='cloneMostVisited')
			$query = Channel::cloneMostVisited($this->signed,$this->qtd);
		else
			$query = Channel::cloneAll($this->sorting, $this->qtd);

		$result = array();
		if ($query!=null){
			foreach ($query as $channel){
				$tmp = $channel->getJsonTags();
				if ($this->onlysubsumed)
						unset($tmp['description']);
				array_push($result, $tmp);
			}
		}
		return $result;
	}
}

?>
