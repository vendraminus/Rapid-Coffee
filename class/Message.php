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
require_once('class/User.php');
class Message{

	private $_new;
	private $_flush;

	private $user_to;
	private $user_from;
	private $id;
	private $subject;
	private $msg;
	private $date;
	private $unixdate;
	private $read_date;
	private $unixread_time;
	private $read;

	private function _check_get(){
		if ( (!isset($this->_new)) || ($this->_new == true) ){
			$this->load();
		}
	}
	private function _unflush(){
		$this->_flush=false;
	}

	private function constructFromRow($row){

		if ($row['user_from_anon']=='t'){
			$this->user_from=new AnonUser();
			$this->user_from->setId($row['user_from_id']);
		} elseif ($row['user_from_anon']=='f') {
			$this->user_from=new RegUser();
			$this->user_from->setId($row['user_from_id']);
		} else
			$this->from_user=null;

		$this->user_to = new RegUser();
		$this->user_to->setId($row['user_to_id']);

		$this->id = $row['id'];
		$this->subject = $row['subject'];
		$this->msg = $row['msg'];
		$this->date = $row['date'];
		$this->unixdate = $row['unixdate'];
		$this->read_time = $row['read_time'];
		$this->read = ($row['read']=='t')?true:false;
		$this->unixread_time = $row['unixread_time'];
		$this->_flush=true;
		$this->_new=false;
	}

	/*private function _flush(){
		$this->_flush=true;
	}
	private function _unnew(){
		$this->_new=false;
	}*/

	function __construct(){
		$this->_new=true;
		$this->_flush=false;
	}

	public function getJsonTags(){

		$r=array();
		$r['id'] = $this->getId();
		$r['subject'] = $this->getSubject();
		$r['msg'] = $this->getMsg();
		$r['nickuserto'] = $this->getNickUserTo();
		$r['nickuserfrom'] = $this->getNickUserFrom();
		$r['subsumedmsg'] = $this->getSubsumedMsg();
		$r['timeago']=$this->getTimeAgo();
		$r['read']=$this->getRead();
		return $r;
	}

	public function getId(){ return $this->id; }
	public function getUserTo(){ $this->_check_get(); return $this->user_to; }
	public function getUserFrom() { $this->_check_get(); return $this->user_from; }
	public function getSubject(){ $this->_check_get(); return $this->subject; }
	public function getMsg(){ $this->_check_get(); return $this->msg; }
	public function getDate(){ $this->_check_get(); return $this->date; }
	public function getNickUserTo(){ $this->_check_get(); return $this->user_to->getNickname(); }
	public function getNickUserFrom(){ 
		$this->_check_get(); 
		if (empty($this->user_from) || $this->user_from==null)
			return '';
		else
			return $this->user_from->getNickname(); 
	}
	public function getRead(){ $this->_check_get(); return $this->read; }	
	public function getTimeAgo(){		//retorna a data em tanto tempo atras
		global $CONF;
		$this->_check_get();
		require_once('tool/utility.php');
		return time_since($this->unixdate);
	}
	public function getSubsumedMsg(){	//retorna topico resumido
		$this->_check_get();
		global $CONF;

		$msg = strip_tags($this->msg);
		$len = strlen($msg);
		$msg = substr($msg, 0, min($len,$CONF['message_summary_len']) );
		$msg = trim($msg);
		
		if ($len > $CONF['message_summary_len'])
			$msg .= '...';

		return $msg;
	}



	public function setUserTo($param){
		$this->_unflush();
		$this->user_to=$param;
	}
	public function setUserFrom($param){
		$this->_unflush();
		$this->user_from=$param;
	}
	public function setId($param){
		$this->_new=true;
		$this->_unflush();
		$this->id=$param;
	}
	public function setSubject($param){ $this->_unflush(); $this->_update_subject=true; $this->subject=$param; }
	public function setMsg($param){ $this->_unflush(); $this->msg=$param; }

	public function read(){		//Abre o objeto do BD (pega o topico com o ID informado)
		$db = clone $GLOBALS['maindb'];
		$db->query("UPDATE message SET read_time=now() WHERE id='{$this->id}';");
		$this->read=true;
		$row = $db->fetch();
		return "ok";
	}


	public function save(){		//Salva o objeto no BD (se ja foi salvo faz update)
		$this->_new=false;
		$db = clone $GLOBALS['maindb'];

		if (empty($this->subject))
			return 'error null subject';
		
		if (empty($this->msg))
			return 'error null message';

		$isanon=$this->getUserTo()->isAnon();
		if ($isanon)
			return 'error you cannot send messages to an anonymous user';

		if (empty($this->user_from) || $this->user_from==null){
			$_from_userid='null';
			$_from_anon='null';
		} else {
			$_from_userid=$this->user_from->getId();
			$_from_anon= ($this->user_from->isAnon())?'true':'false';
		}

		if (!isset($this->id) || ($this->id==null)){	//Insert
			$db->query("SELECT nextval('message_id_seq') as id;");
			$_gotid_req = $db->fetch();
			$_gotid = $_gotid_req['id'];

			$db->query("INSERT INTO message(id,subject,msg,user_to_id,user_from_id, user_from_anon) VALUES('{$_gotid}','{$this->getSubject()}','{$this->getMsg()}', '{$this->getUserTo()->getId()}', {$_from_userid}, {$_from_anon});");
			$row = $db->fetch();
			$this->id = $_gotid;
		} else {					//Update
			$db->query("UPDATE message set msg='{$this->getMsg()}', user_to_id='{$this->getUserTo()->getId()}',user_from_id={$_from_userid}, user_from_anon={$_from_anon}  WHERE id='{$this->id}';");
			$row = $db->fetch();
		}

		
		$this->setId($this->getId()); $this->load();

		require_once('class/Mail.php');
		$a=new Mail();
		$a->setEmailTo($this->getUserTo()->getEmail());
		$a->setNicknameTo($this->getUserTo()->getNickname());
		$a->setSubject($this->getSubject());
		$a->setSubjectMsg("");
		$a->setMsg($this->getMsg());
		$a->send();

		//mail($this->getUserTo()->getEmail(), '[RapidCoffee] '.$this->getSubject(), $this->getMsg(), $headers);

		$this->_flush=true;
		return "ok";
	}

	public function load(){		//Abre o objeto do BD (pega o topico com o ID informado)
		if (!isset($this->_flush) || $this->_flush==false || $this->_new==true){
			$db = clone $GLOBALS['maindb'];
			$db->query("SELECT * FROM vw_message WHERE id='{$this->id}';");
			$row = $db->fetch();
			$this->constructFromRow($row);
			$this->_flush=true;
			$this->_new=false;
		}
		return "ok";
	}


	//----------------------- ================ STATIC ================== ---------------------------------

	static function cloneMy($qtd=-1, $lastid=-1, $sorting='date DESC'){
		global $CONF;
		$user = $_SESSION['user'];

		if ($user->isAnon()) return array();

		if ($qtd<=0) $qtd=$CONF['message_list_qt'];
		if (isset($lastid) && $lastid>0) $addwhere=" and id<$id ";
		else $addwhere="";

		$db = clone $GLOBALS['maindb'];

		$db->query("SELECT * FROM vw_message WHERE user_to_id='{$user->getId()}' {$addwhere} ORDER BY {$sorting} LIMIT $qtd;");

		if ($db->number_rows()<=0) return null;

		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Message();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}
}
?>
