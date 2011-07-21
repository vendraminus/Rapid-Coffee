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
require_once("class/Topic.php");
require_once("template/TTopic.php");

class TListTopic{

	private $listType;	//cloneLast, cloneUFLast, cloneSearch, cloneUpdated, cloneNew, cloneByUser, cloneByDate
	private $ids;
	private $counters;
	private $search;	//se usar o cloneSearch
	private $qtd;
	private $orderid;
	private $lastorderid;
	private $year;
	private $month;
	private $day;
	private $with_posts;
	private $onlysubsumed;
	private $lastid;
	private $user;
	private $sorting;
	private $channel;
	private $idchannel;

	function __construct(){
		$this->with_posts=false;
		$this->onlysubsumed=false;
		$this->year=null;
		$this->month=null;
		$this->day=null;
		$this->sorting="orderid DESC";
		$this->idchannel=0;
	}

	function setListType($param){ $this->listType=$param; }
	function setSearch($param){ $this->search=$param; }
	function setIds($param){ $this->ids=$param; }
	function setCounters($param){ $this->counters=$param; }
	function setWithPosts($param) { $this->with_posts=$param; }
	function setOnlySubsumed($param){ $this->onlysubsumed=$param; }
	function setLastId($param){ $this->lastid = $param; }
	function setLastOrderId($param){ $this->lastorderid = $param; }
	function setUser($param){ $this->user = $param; }
	function setOrderId($param){ $this->orderid = $param; }
	function setYear($param){ $this->year = $param; }
	function setMonth($param){ $this->month = $param; }
	function setDay($param){ $this->day = $param; }
	function setSorting($param) { $this->sorting = $param; }
	function setIdChannel($param){ $this->idchannel = $param; }
	function setQtd($param){ $this->qtd = $param; }

	function getJsonTags(){
		if ( (empty($this->idchannel) || $this->idchannel<=0) ) {
			if (isset($_GET['channel']) && !empty($_GET['channel'])) { 
				require_once("class/Channel.php");
				$tmp = new Channel(); $tmp->setUrlname($_GET['channel']);
				$this->idchannel=$tmp->getId();
				if (empty($this->idchannel)) $this->idchannel=-1;
			}
		}
		if ($this->listType=='cloneUFLast')
			$query = Topic::cloneUFLast($this->qtd, $this->lastorderid, $this->idchannel);
		elseif ($this->listType=='cloneFollowed')
			$query = Topic::cloneFollowed($this->qtd, $this->lastorderid, $this->idchannel);
		elseif ($this->listType=='cloneSearch')
			$query = Topic::cloneSearch($this->search, $this->qtd, $this->orderid);
		elseif ($this->listType=='cloneUpdated')
			$query = Topic::cloneUpdated($this->ids, $this->counters, $this->qtd, $this->orderid, $this->idchannel);
		elseif ($this->listType=='cloneNew')
			$query = Topic::cloneNew($this->lastid, $this->qtd, $this->orderid, $this->idchannel);
		elseif ($this->listType=='cloneByUser')
			$query = Topic::cloneByUser($this->user, $this->qtd, $this->orderid, $this->sorting, $this->idchannel);
		elseif ($this->listType=='cloneByUserPost')
			$query = Topic::cloneByUserPost($this->user, $this->qtd, $this->orderid, $this->sorting, $this->idchannel);
		elseif ($this->listType=='cloneByDate')
			$query = Topic::cloneByDate($this->user, $this->year, $this->month, $this->day);
		elseif ($this->listType=='cloneChannelFollowed')
			$query = Topic::cloneChannelFollowed($this->qtd, $this->orderid, $this->lastorderid, $this->sorting);
		else
			$query = Topic::cloneLast($this->qtd, $this->orderid, $this->sorting, $this->idchannel);

		$result = array();

		if ($query!=null){
			global $CONF;
			if ($this->with_posts){
				require_once('template/TListPost.php');
				foreach ($query as $topic){
					$tlistpost = new TListPost(); $tlistpost->setTopic($topic);
					$ttopic = new TTopic(); $ttopic->setTopic($topic);
					array_push($result, array('topic'=>$ttopic->getJsonTags(), "posts"=>$tlistpost->getJsonTags()) );
				}
			} else {
				foreach ($query as $topic){
					$tmp=$topic->getJsonTags();
					if ($this->onlysubsumed)
						unset($tmp['msg']);
					array_push($result, $tmp);
				}
			}
		}

		return $result;
	}

}

?>
