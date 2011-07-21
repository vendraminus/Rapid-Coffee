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

class Post{

	private $_new;
	private $_flush;

	private $user;
	private $topic;
	private $id;
	private $post;
	private $date;
	private $updatetime;
	private $unixdate;
	private $unixupdatetime;
	private $likes;
	private $dislikes;
	private $isoff;

	private function _check_get(){
		if ( (!isset($this->_new)) || ($this->_new == true) ){
			$this->load();
		}
	}
	private function _unflush(){
		$this->_flush=false;
	}

	private function constructFromRow($row){

		if ($row['anon']=='t')
			$this->user=new AnonUser();
		else 
			$this->user=new RegUser();
		$this->user->setId($row['userid']);
		$this->id = $row['id'];
		$this->topic=new Topic(); $this->topic->setId($row['topicid']);
		$this->post=$row['post'];
		$this->date=$row['date'];
		$this->updatetime=$row['updatetime'];
		$this->unixdate = $row['unixdate'];
		$this->unixupdatetime=$row['unixupdatetime'];
		$this->likes = $row['likes'];
		$this->dislikes = $row['dislikes'];
		$this->isoff=$row['isoff'];
		$this->_flush=true;
		$this->_new=false;

	}


	public function getJsonTags(){

		$r=array();
		$r['id'] = $this->getId();
		$r['topicid'] = $this->topic->getId();
		$r['post'] = $this->getPost();
		$r['author'] = $this->getAuthor();
		$r['signature'] = $this->getUser()->getSignature();
		$r['likes'] = $this->getNumLikes();
		$r['dislikes'] = $this->getNumDislikes();
		$r['timeago'] = $this->getTimeAgo();
		$r['updatetimeago'] = $this->getUpdateTimeAgo();
		$r['ldvote'] = $this->getUserLDVote($_SESSION['user']);
		$r['author_hasavatar'] = $this->getUser()->hasAvatar();
		$r['author_avatar_update_time'] = $this->getUser()->getAvatarUpdateTime();
		//$r['upped'] = $this->isUpped();

		return $r;
	}

	public function getId(){return $this->id;}
	public function getUser(){$this->_check_get(); return $this->user;}
	public function getTopic(){$this->_check_get(); return $this->topic;}
	public function getComment(){$this->_check_get(); return $this->comment;}
	public function getDate(){$this->_check_get(); return $this->date;}
	public function getIsOff(){$this->_check_get(); return $this->isoff;}
	public function getPost(){$this->_check_get(); return $this->post; }
	public function getNumLikes(){ $this->_check_get(); return $this->likes; }
	public function getNumDislikes(){ $this->_check_get(); return $this->dislikes; }
	public function getTimeAgo(){		//retorna a data em tanto tempo atras
		global $CONF;
		$this->_check_get();
		require_once('tool/utility.php');
		return time_since($this->unixdate);
	}
	public function getUpdateTimeAgo(){		//retorna a data em tanto tempo atras
		if ($this->unixupdatetime==null) return null;
		global $CONF;
		$this->_check_get();
		require_once('tool/utility.php');
		return time_since($this->unixupdatetime);
	}
	public function getAuthor(){ $this->_check_get(); return $this->user->getNickname(); }

	public function getUserLDVote($user)
	{
		$db = clone $GLOBALS['maindb'];
		$db->query('SELECT liked FROM postld WHERE userid='.$user->getId().' AND postid='.$this->getId());
		if ($db->number_rows() == 0)
			return 'none';
		$row = $db->fetch();
		if ($row['liked']=='t')
			return 'liked';
		else
			return 'disliked';
	}

	public function setUser($param){
		$this->_unflush();
		$this->user=$param;
	}
	public function setId($param){
		$this->_new=true;
		$this->_unflush();
		$this->id=$param;
	}
	public function setTopic($param){
		$this->_unflush();
		$this->topic=$param;
	}
	//public function setTopicId($param){}
	//public function setUserId($param){}
	//public function setAnon($param){}
	public function setPost($param){ $this->_unflush(); $this->post=$param; }
	public function setDate($param){ $this->_unflush(); $this->date=$param; }
	public function setIsOff($param){ $this->_unflush(); $this->isoff=$param; }

	public function save(){	//Salva o objeto no BD (se ja foi salvo faz update)
		$this->_new=false;
		$db = clone $GLOBALS['maindb'];

		if (empty($this->post))
			return 'error null post';
		
		$isanon=$this->getUser()->isAnon();
		if (!($isanon))
			$isanon = 'FALSE';
		else
			$isanon = 'TRUE';

		if (!isset($this->id) || ($this->id==null)){	//Insert
			$db->query("SELECT nextval('post_id_seq') as id;");
			$_gotid_req = $db->fetch();
			$_gotid = $_gotid_req['id'];

			$db->query("INSERT INTO post(id,post,topicid,anon,userid) VALUES('{$_gotid}','{$this->getPost()}','{$this->getTopic()->getId()}','$isanon', '{$this->getUser()->getId()}')");
			$row = $db->fetch();
			$this->id = $_gotid;
		} else {					//Update
			$db->query("UPDATE post set post='{$this->getPost()}',topicid='{$this->getTopic()->getId()}',anon='$isanon', userid='{$this->getUser()->getId()}' WHERE id='{$this->id}';");
			$row = $db->fetch();
		}
		$this->_flush=true;
		return "ok";
	}
	public function load(){	//Abre o objeto do BD (pega o topico com o ID informado)
		if (!isset($this->_flush) || $this->_flush==false || $this->_new==true){
			$db = clone $GLOBALS['maindb'];
			$db->query("SELECT *,extract(epoch from date) as unixdate,extract(epoch from updatetime) as unixupdatetime FROM post WHERE id='{$this->id}';");
			$row = $db->fetch();
			$this->constructFromRow($row);
			$this->_flush=true;
			$this->_new=false;
		}
		return "ok";
	}
	public function like(){	//Faz o usuario da sessao gostar
		global $user;
		if ($user->isAnon())
			return 'error anonymous cannot like';
		$db = clone $GLOBALS['maindb'];
		$result = $db->query("INSERT INTO postld(postid,userid,date,liked) VALUES({$this->id},{$user->getId()},now(),'true')");

		if ($result==false)
			return 'error db';

		return 'ok';
	}
	public function dislike(){	//Faz o usuario da sessao nao gostar
		global $user;
		if ($user->isAnon())
			return 'error anonymous cannot dislike';
		$db = clone $GLOBALS['maindb'];
		$result = $db->query("INSERT INTO postld(postid,userid,date,liked) VALUES({$this->id},{$user->getId()},now(),'false')");

		if ($result==false)
			return 'error db';

		return 'ok';
	}


	
	//----------------------- ================ STATIC ================== ---------------------------------


	//static function cloneLast($qtd, $page){}		//Retorna um array com os ultimos comments
	static function cloneByTopic($topicid, $sorting="date desc", $qtd=-1){ //Retorna um array com os ultimos comments do topicos
		global $CONF;

		if (!isset($qtd)) $qtd=-1;

		if ($qtd<=0) $qtd=$CONF['post_list_qt'];

		$db = clone $GLOBALS['maindb'];

		$db->query("SELECT *,extract(epoch from date) as unixdate,extract(epoch from updatetime) as unixupdatetime FROM post where topicid='{$topicid}' and isoff=0 ORDER BY {$sorting} LIMIT $qtd;");

		if ($db->number_rows()<=0) return null;

		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Post();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}
}
?>
