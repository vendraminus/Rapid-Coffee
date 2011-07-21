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
require_once('class/Channel.php');
class Topic{

	//getS setS

	//public function save(){}	//Salva o objeto no BD (se ja foi salvo faz update)
	//public function load(){}	//Abre o objeto do BD (pega o topico com o ID informado)
	//public function like(){}	//Faz o usuario da sessao gostar
	//public function dislike(){}	//Faz o usuario da sessao nao gostar
	//public function visite(){}	//Faz o usuario da sessao visitar
	//public function follow(){}	//Faz o usuario da sessao seguir
	//public function unfollow(){}	//Faz o usuario da sessao nao seguir
	//public function up(){}		//Da UP no topico (reaparece no topo)

	//public function isFollowing(){}		//retorna se o usuario da SESSION esta seguindo
	//public function getSubsumedMsg(){}	//retorna topico resumido
	//public function getTimeAgo(){}		//retorna a data em tanto tempo atras
	//public function getNumReplies(){}	//numero de respostas
	//public function getNumViews(){}		//n. visitas
	//public function getNumLikes(){}		//n. likes
	//public function getNumDislikes(){}	//n. dislikes

	//static function cloneLast($qtd, $page){}	//Retorna um array com os ultimos topicos
	//static function cloneUFLast($qtd, $page){}	//Retorna um array com os ultimos topicos followed que nao foram vistos ainda
	//static function cloneSearch($search, $qtd, $page){}	//Retorna um array com os topicos que match a seach

	private $_new;
	private $_flush;

	private $user;
	private $id;
	private $channel;
	private $orderid;
	private $subject; private $_update_subject;
	private $msg;
	private $date;
	private $updatetime;
	private $unixdate;
	private $unixupdatetime;
	private $utdate;
	private $isoff;
	private $lang;
	private $likes;
	private $dislikes;
	private $views;
	private $replies;
	private $counter;
	private $upped;

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
		$this->channel = new Channel(); $this->channel->setId($row['channelid']);
		$this->id = $row['id'];
		$this->subject = $row['subject'];
		$this->msg = $row['msg'];
		$this->date = $row['date'];
		$this->updatetime = $row['updatetime'];
		$this->unixdate = $row['unixdate'];
		$this->unixupdatetime = $row['unixupdatetime'];
		$this->utdate = $row['utdate'];
		$this->isoff=$row['isoff'];
		$this->lang=$row['lang'];
		$this->counter=$row['counter'];
		$this->likes=$row['likes'];
		$this->dislikes=$row['dislikes'];
		$this->views=$row['views'];
		$this->replies=$row['replies'];
		$this->upped=($row['upped']=='t')?true:false;
		$this->orderid=$row['orderid'];
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
		$this->counter=1;
		$this->_new=true;
		$this->_flush=false;
	}

	public function getJsonTags(){

		$r=array();
		$r['id'] = $this->getId();
		$r['subject'] = $this->getSubject();
		$r['msg'] = $this->getMsg();
		$r['author'] = $this->getAuthor();
		$r['channel'] = $this->channel->getName();
		$r['channelid'] = $this->channel->getId();
		$r['channel_urlname'] = $this->channel->getUrlname();
		$r['channel_logo_update_time'] = $this->channel->getLogoUpdateTime();
		$r['signature'] = $this->getUser()->getSignature();
		$r['author_hasavatar'] = $this->getUser()->hasAvatar();
		$r['author_avatar_update_time'] = $this->getUser()->getAvatarUpdateTime();
		$r['channel_haslogo']=$this->getChannel()->hasLogo();
		$r['author_logo_update_time'] = $this->getChannel()->getLogoUpdateTime();
		$r['replies'] = $this->getNumReplies();
		$r['views'] = $this->getNumViews();
		$r['likes'] = $this->getNumLikes();
		$r['dislikes'] = $this->getNumDislikes();
		$r['timeago'] = $this->getTimeAgo();
		$r['updatetimeago'] = $this->getUpdateTimeAgo();
		$r['version'] = $this->getCounter();
		$r['subsumedmsg'] = $this->getSubsumedMsg();
		$r['lang'] = $this->getLang();
		$r['ldvote'] = $this->getUserLDVote();
		$r['isfollowing'] = $this->isFollowing();
		$r['upped'] = $this->isUpped();
		$r['orderid'] = $this->getOrderId();
		$r['subject_for_url'] = Topic::prettyUrl($this->getSubject());

		return $r;
	}

	public function getId(){ return $this->id; }
	public function getUser(){ $this->_check_get(); return $this->user; }
	public function getSubject(){ $this->_check_get(); return $this->subject; }
	public function getMsg(){ $this->_check_get(); return $this->msg; }
	public function getDate(){ $this->_check_get(); return $this->date; }
	public function getUtdate(){ $this->_check_get(); return $this->utdate; }
	public function getCounter(){ $this->_check_get(); return $this->counter; }
	public function getIsOff(){ $this->_check_get(); return $this->isoff; }
	public function getLang(){ $this->_check_get(); return $this->lang; }
	public function getAuthor(){ $this->_check_get(); return $this->user->getNickname(); }
	public function getOrderId(){ $this->_check_get(); return $this->orderid; }
	public function getNumReplies(){ $this->_check_get(); return $this->replies; }
	public function getNumViews(){ $this->_check_get(); return $this->views; }
	public function getNumLikes(){ $this->_check_get(); return $this->likes; }
	public function getNumDislikes(){ $this->_check_get(); return $this->dislikes; }
	public function getChannel(){ $this->_check_get(); return $this->channel; }


	public function isUpped(){ $this->_check_get(); return $this->upped; }		//retorna se o topico foi upado!
	public function isFollowing(){		//retorna se o usuario da SESSION esta seguindo
		global $user;

		if ($user->isAnon()){
			$_cook='followingtopics';
			if (!isset($_COOKIE[$_cook])) return false;
			else {
				return isset($_COOKIE[$_cook]["{$this->id}"]);
			}
		} else {
			$db = clone $GLOBALS['maindb'];
			$useranon=($user->isAnon())?'true':'false';
			$db->query("SELECT count(*) as number FROM follow_topic_user WHERE userid='{$user->getId()}' and anon={$useranon} and topicid={$this->getId()};");
			$row = $db->fetch();
			return ($row["number"]>0);
		}
	}
	public function getSubsumedMsg(){	//retorna topico resumido
		$this->_check_get();
		global $CONF;

		$msg = str_replace('<br />', ' ', $this->msg);
		$msg = str_replace('<br/>', ' ', $msg);
		$msg = str_replace('<br>', ' ', $msg);
		$msg = strip_tags($msg);
		$len = strlen($msg);
		$msg = substr($msg, 0, min($len,$CONF['topic_summary_len']) );
		$msg = trim($msg);
		
		if ($len > $CONF['topic_summary_len'])
			$msg .= '...';

		return $msg;
	}
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

	public function setUser($param){
		$this->_unflush();
		$this->user=$param;
	}
	public function setId($param){
		$this->_new=true;
		$this->_unflush();
		$this->id=$param;
	}
	public function setSubject($param){ $this->_unflush(); $this->_update_subject=true; $this->subject=$param; }
	public function setMsg($param){ $this->_unflush(); $this->msg=$param; }
	public function setDate($param){ $this->_unflush(); $this->date=$param; }
	public function setUtdate($param){ $this->_unflush(); $this->utdate=$param; }
	//----- public function setUserId($param){}
	//----- public function setAnon($param){}
	//----- public function setNickname($param){}
	public function setIsOff($param){ $this->_unflush(); $this->isoff=$param; }
	public function setLanguage($param){ $this->_unflush(); $this->language=$param; }
	public function setChannel($param) { $this->_unflush(); $this->channel=$param; }


	public function save(){		//Salva o objeto no BD (se ja foi salvo faz update)
		$this->_new=false;
		$db = clone $GLOBALS['maindb'];

		if (empty($this->subject))
			return 'error null subject';
		
		if (empty($this->msg))
			return 'error null message';
		$isanon=$this->getUser()->isAnon();
		if (!($isanon))
			$isanon = 'FALSE';
		else
			$isanon = 'TRUE';

		if (!isset($this->id) || ($this->id==null)){	//Insert
			$db->query("SELECT nextval('topic_id_seq') as id;");
			$_gotid_req = $db->fetch();
			$_gotid = $_gotid_req['id'];
			$lang = $this->getLang();
			if (empty($lang)){
				$this->lang = $this->getUser()->getLang();
			}
			if (!empty($this->channel))
				$_channelid=$this->channel->getId();
			elseif (isset($_GET['channel'])){
				require_once('class/Channel.php');
				$tmpchannel=new Channel();
				$tmpchannel->setUrlname($_GET['channel']);
				$tmpchannel->load();
				$_channelid = $tmpchannel->getId();
			} else 
				$_channelid = 'null';
			if (empty($_channelid)) $_channelid = 'null';

			$db->query("INSERT INTO topic(id,subject,msg,anon,userid,lang, channelid) VALUES('{$_gotid}','{$this->getSubject()}','{$this->getMsg()}','$isanon', '{$this->getUser()->getId()}', '{$this->getLang()}', {$_channelid});");
			$row = $db->fetch();
			$this->id = $_gotid;
		} else {					//Update
			$_alsoupdate='';
			if ($this->_update_subject==true) $_alsoupdate.=",subject='{$this->getSubject()}'";
			$db->query("UPDATE topic set msg='{$this->getMsg()}',anon='$isanon', userid='{$this->getUser()->getId()}' {$_alsoupdate} WHERE id='{$this->id}';");
			$row = $db->fetch();
		}
		$this->_flush=true;
		return "ok";
	}

	public function load(){		//Abre o objeto do BD (pega o topico com o ID informado)
		if (!isset($this->_flush) || $this->_flush==false || $this->_new==true){
			$db = clone $GLOBALS['maindb'];
			$db->query("SELECT * FROM vw_topic WHERE id='{$this->id}';");
			$row = $db->fetch();
			$this->constructFromRow($row);
			$this->_flush=true;
			$this->_new=false;
		}
		return "ok";
	}

	public function getUserLDVote()
	{
		$db = clone $GLOBALS['maindb'];
		global $user;
		$db->query('SELECT liked FROM topicld WHERE userid='.$user->getId().' AND topicid='.$this->getId());
		if ($db->number_rows() == 0)
			return 'none';
		$row = $db->fetch();
		if ($row['liked']=='t')
			return 'liked';
		else
			return 'disliked';
	}

	public function like(){		//Faz o usuario da sessao gostar
		global $user;
		if ($user->isAnon())
			return 'error anonymous cannot like';
		$db = clone $GLOBALS['maindb'];
		$result = $db->query("INSERT INTO topicld(topicid,userid,date,liked) VALUES({$this->id},{$user->getId()},now(),'true')");

		if ($result==false)
			return 'error db';

		return 'ok';
	}
	public function dislike(){	//Faz o usuario da sessao nao gostar
		global $user;
		if ($user->isAnon())
			return 'error anonymous cannot dislike';
		$db = clone $GLOBALS['maindb'];
		$result = $db->query("INSERT INTO topicld(topicid,userid,date,liked) VALUES({$this->id},{$user->getId()},now(),'false')");

		if ($result==false)
			return 'error db';

		return 'ok';
	}
	public function visit(){	//Faz o usuario da sessao visitar
		global $user;
		$db = clone $GLOBALS['maindb'];
		
		$isanon=$user->isAnon();
		if ($isanon){
			$_cook='followingtopics';
			if (isset($_COOKIE[$_cook])){
				if (isset($_COOKIE[$_cook]["{$this->id}"])){
					global $CONF;
					setcookie($_cook."[{$this->id}]", $this->getCounter(), $CONF['cookie_lifetime']);
				}
			}
		}
		$_anon=($isanon)?'true':'false';
		//system("echo \"SELECT F_topic_visit({$this->getId()},{$user->getId()},$_anon,{$this->getCounter()});\" > foi.txt");
		return $db->query("SELECT F_topic_visit({$this->getId()},{$user->getId()},$_anon,{$this->getCounter()});");

	}
	public function follow(){	//Faz o usuario da sessao seguir
		global $user;
		if ($user->isAnon()){
			global $CONF;
			$_cook='followingtopics';
			setcookie($_cook."[{$this->id}]", $this->getCounter(), $CONF['cookie_lifetime']);
		} else {
			$db = clone $GLOBALS['maindb'];
			$db->query("INSERT INTO follow_topic_user(topicid,userid,anon,counter) VALUES ('{$this->getId()}','{$user->getId()}','false','{$this->getCounter()}');");
		}
		return true;
	}
	public function unfollow(){	//Faz o usuario da sessao nao seguir
		global $user;

		if ($user->isAnon()){
			
			$_cook='followingtopics';
			setcookie($_cook."[{$this->id}]","",time()-1);

		} else {

			$db = clone $GLOBALS['maindb'];
			$useranon=($user->isAnon())?'true':'false';
			$db->query("DELETE FROM follow_topic_user WHERE topicid='{$this->getId()}' and userid='{$user->getId()}' and anon='{$useranon}';");
		
		}
		return true;
	}

	public function delete($removefromDB=false){
		$db = clone $GLOBALS['maindb'];
		if ($removefromDB)
			$db->query("DELETE FROM topic WHERE id='{$this->getId()}';");
		else
			$db->query("UPDATE topic SET isoff=24 WHERE id='{$this->getId()}';");
		$this->isoff=true;
	}

	public function up(){		//Da UP no topico (reaparece no topo)
		$db = clone $GLOBALS['maindb'];
		$db->query("UPDATE topic SET utdate=now() WHERE id='{$this->getId()}';");
		$this->upped=true;
	}

	



	//----------------------- ================ STATIC ================== ---------------------------------

	static function cloneByUser($user, $qtd=-1, $lastorderid=-1, $sorting='orderid DESC', $channel){	//Retorna um array com os ultimos topicos
		global $CONF;

		if ($qtd<=0) $qtd=$CONF['topic_list_qt'];
		if (isset($lastorderid) && $lastorderid>0) $addwhere=" and orderid<$lastorderid ";
		else $addwhere="";
		if (isset($channel) && !empty($channel) && $channel!=0) { 
			$addwhere.=" and channelid='$channel' "; 
		}

		$db = clone $GLOBALS['maindb'];

		$anon=($user->isAnon())?'true':'false';

		$db->query("SELECT * FROM vw_topic_notoff WHERE userid='{$user->getId()}' and anon='{$anon}' {$addwhere} ORDER BY {$sorting} LIMIT $qtd;");

		if ($db->number_rows()<=0) return null;

		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Topic();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}

	static function cloneByUserPost($user, $qtd=-1, $lastorderid=-1, $sorting='orderid DESC', $channel){	//Retorna um array com os ultimos topicos
		global $CONF;

		if ($qtd<=0) $qtd=$CONF['topic_list_qt'];
		if (isset($lastorderid) && $lastorderid>0) $addwhere=" and orderid<$lastorderid ";
		else $addwhere="";
		if (isset($channel) && !empty($channel) && $channel!=0) { 
			$addwhere.=" and channelid='$channel' "; 
		}

		$db = clone $GLOBALS['maindb'];

		$anon=($user->isAnon())?'true':'false';

		$db->query("SELECT * FROM vw_topic_notoff WHERE EXISTS (select 1 from post where topicid=vw_topic_notoff.id and userid='{$user->getId()}' and anon='{$anon}') {$addwhere} ORDER BY {$sorting} LIMIT $qtd;");

		if ($db->number_rows()<=0) return null;

		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Topic();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}


	static function cloneByDate($user, $year, $month, $day){	//Retorna um array com os topicos postados na data fornecida
		global $CONF;

		$db = clone $GLOBALS['maindb'];

		$query = "SELECT * FROM vw_topic_notoff WHERE extract(year from date)=$year";
		if ($month!=null)
			$query .= " AND extract(month from date)=$month";
		if ($day!=null)
			$query .= " AND extract(day from date)=$day";

		$query .= ' ORDER BY date DESC';

		$db->query($query);

		if ($db->number_rows()<=0) return null;

		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Topic();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}

	static function cloneLast($qtd=-1, $lastorderid=-1, $sorting="orderid DESC",$channel){	//Retorna um array com os ultimos topicos
		global $CONF;

		global $SESSION;
		$user=$_SESSION['user'];

		if ($qtd<=0) $qtd=$CONF['topic_list_qt'];
		if (isset($lastorderid) && $lastorderid>0) $addwhere=" and orderid<$lastorderid ";
		else $addwhere="";
		if (isset($channel) && !empty($channel) && $channel!=0) { 
			require_once("class/Channel.php");
			$_channel = new Channel();
			$_channel->setId($channel);
			if (!$_channel->canIRead()) return array();
			$addwhere.=" and channelid='$channel' "; 
		} else {
			return array();
		}

		$db = clone $GLOBALS['maindb'];

		$db->query("SELECT * FROM vw_topic_notoff WHERE 1=1 {$addwhere} ORDER BY {$sorting} LIMIT $qtd;");

		if ($db->number_rows()<=0) return null;

		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Topic();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}

	static function cloneNew($lastid, $qtd=-1, $lastorderid=-1,$channel){	//Retorna um array com os ultimos topicos
		global $CONF;

		if (!isset($lastid) || empty($lastid)) return;
		if ($qtd<=0) $qtd=$CONF['topic_list_qt'];
		if (isset($lastorderid) && $lastorderid>0) $addwhere=" and orderid<$lastorderid ";
		else $addwhere="";

		if (isset($channel) && !empty($channel) && $channel!=0) { 
			require_once("class/Channel.php");
			$_channel = new Channel();
			$_channel->setId($channel);
			if (!$_channel->canIRead()) return array();
			$addwhere.=" and channelid='$channel' "; 
		} else {
			return array();
		}

		if (isset($channel) && !empty($channel) && $channel!=0) { 
			$addwhere.=" and channelid='$channel' "; 
		}

		$db = clone $GLOBALS['maindb'];
		$user = $_SESSION['user'];
		$db->query("SELECT * FROM vw_topic_notoff WHERE orderid>{$lastid} {$addwhere}  ORDER BY orderid DESC LIMIT $qtd;");

		if ($db->number_rows()<=0) return null;

		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Topic();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}


	static function cloneUpdated($ids_to_check, $counters, $qtd=-1, $lastorderid=-1, $channel){	//Retorna um array com os ultimos topicos
		global $CONF;

		if ($qtd<=0) $qtd=$CONF['topic_list_qt'];
		if (isset($lastorderid) && $lastorderid>0) $addwhere=" and orderid>$lastorderid ";
		else $addwhere="";
		if (isset($channel) && !empty($channel) && $channel!=0) { 
			$addwhere.=" and channelid='$channel' "; 
		}

		if (!isset($ids_to_check) || !isset($counters)) return;
		if (empty($ids_to_check) || empty($counters)) return;
		if (count($ids_to_check)<=0 || count($counters)<=0) return;
		if (count($ids_to_check)!=count($counters)) return;
		if (!is_numeric($ids_to_check[0]) || !is_numeric($counters[0])) return;
		if ($qtd<=0) $qtd=$CONF['topic_list_qt'];
		if (!isset($page)) $page=1;
		$offset=$qtd*($page-1);

		$db = clone $GLOBALS['maindb'];

		$user = $_SESSION['user'];

		$query = "SELECT * FROM vw_topic_notoff WHERE  (1=2";
		$query.="or (id='{$ids_to_check[0]}' and counter>{$counters[0]})";
		for ($i=1; $i< count($ids_to_check); $i++) {
			if (!empty($ids_to_check[$i]) && !empty($counters[$i]))
				$query.="or (id='{$ids_to_check[$i]}' and counter>{$counters[$i]})";
		}
		$query.=") {$addwhere} ORDER BY orderid DESC LIMIT $qtd;";

		$db->query($query);

		if ($db->number_rows()<=0) return null;

		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Topic();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}

	static function cloneUFLast($qtd, $lastorderid, $channel){	//Retorna um array com os ultimos topicos followed que nao foram vistos ainda
		global $CONF;
		global $user;

		if ($qtd<=0) $qtd=$CONF['topic_list_qt'];
		if (isset($lastorderid) && $lastorderid>0) $addwhere=" and orderid>$lastorderid ";
		else $addwhere="";
		if (isset($channel) && !empty($channel) && $channel!=0) { 
			$addwhere.=" and channelid='$channel' "; 
		}

		$db = clone $GLOBALS['maindb'];

		if ($user->isAnon()){
			$_cook='followingtopics';
			if (!isset($_COOKIE[$_cook])) return null;
			$uftwhere=" 1=2 ";
			foreach ($_COOKIE[$_cook] as $name => $value) {
				$name = htmlspecialchars($name);
				$value = htmlspecialchars($value);
				$uftwhere.="OR (id='$name' and counter>'$value')";
			}
			//echo "SELECT *,extract(epoch from date) as unixdate, utdate>date as upped FROM topic where {$uftwhere} {$addwhere} ORDER BY orderid DESC LIMIT $qtd;";
			$db->query("SELECT * FROM vw_topic_notoff where ({$uftwhere}) {$addwhere} ORDER BY orderid DESC LIMIT $qtd;");
		} else {

			$db->query("SELECT * FROM vw_topic_notoff where id IN (SELECT topicid FROM follow_topic_user WHERE userid='{$user->getId()}' and anon='false' and counter<vw_topic_notoff.counter) {$addwhere} ORDER BY orderid DESC LIMIT $qtd;");

		}

		if ($db->number_rows()<=0) return null;

		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Topic();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}

	static function cloneFollowed($qtd, $lastorderid, $channel){	//Retorna um array com os ultimos topicos followed que nao foram vistos ainda
		global $CONF;
		global $user;

		if ($qtd<=0) $qtd=$CONF['topic_list_qt'];
		if (isset($lastorderid) && $lastorderid>0) $addwhere=" and orderid>$lastorderid ";
		else $addwhere="";
		if (isset($channel) && !empty($channel) && $channel!=0) { 
			$addwhere.=" and channelid='$channel' "; 
		}

		$db = clone $GLOBALS['maindb'];

		if ($user->isAnon()){
			$_cook='followingtopics';
			if (!isset($_COOKIE[$_cook])) return null;
			$uftwhere=" 1=2 ";
			foreach ($_COOKIE[$_cook] as $name => $value) {
				$name = htmlspecialchars($name);
				$value = htmlspecialchars($value);
				$uftwhere.="OR (id='$name')";
			}
			//echo "SELECT *,extract(epoch from date) as unixdate, utdate>date as upped FROM topic where {$uftwhere} {$addwhere} ORDER BY orderid DESC LIMIT $qtd;";
			$db->query("SELECT * FROM vw_topic_notoff where ({$uftwhere}) {$addwhere} ORDER BY orderid DESC LIMIT $qtd;");
		} else {

			$db->query("SELECT * FROM vw_topic_notoff where id IN (SELECT topicid FROM follow_topic_user WHERE userid='{$user->getId()}' and anon='false') {$addwhere} ORDER BY orderid DESC LIMIT $qtd;");

		}

		if ($db->number_rows()<=0) return null;

		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Topic();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}

	static function cloneChannelFollowed($qtd, $orderid, $lastorderid, $sorting='orderid DESC'){	//Retorna um array com os ultimos topicos followed que nao foram vistos ainda
		global $CONF;
		global $user;

		if ($qtd<=0) $qtd=$CONF['topic_list_qt'];
		$addwhere="";
		if (isset($lastorderid) && $lastorderid>0) $addwhere.=" and orderid>$lastorderid ";
		if (isset($orderid) && $orderid>0) $addwhere.=" and orderid<$orderid ";

		//system("echo \"SORTING: $sorting\" > foi.txt");

		$db = clone $GLOBALS['maindb'];

		if ($user->isAnon()){
			/*$_cook='followingchannels';
			if (!isset($_COOKIE[$_cook])) return null;
			$uftwhere=" 1=2 ";
			foreach ($_COOKIE[$_cook] as $name => $value) {
				$name = htmlspecialchars($name);
				$value = htmlspecialchars($value);
				$uftwhere.="OR (channelid='$name')";
			}
			$db->query("SELECT * FROM vw_topic where {$uftwhere} {$addwhere} ORDER BY {$sorting} LIMIT $qtd;");*/
			$db->query("SELECT vw_topic_notoff.* FROM vw_topic_notoff LEFT JOIN channel ON vw_topic_notoff.channelid=channel.id WHERE channel.perm_anon>=1 {$addwhere} ORDER BY {$sorting} LIMIT $qtd");
		} else {
			$db->query("SELECT * FROM vw_topic_notoff where channelid IN (SELECT channelid FROM follow_channel_user WHERE userid='{$user->getId()}' and anon='false') {$addwhere} ORDER BY {$sorting} LIMIT $qtd;");

		}

		if ($db->number_rows()<=0) return null;

		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Topic();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}


	static function cloneSearch($search, $qtd, $lastorderid){	//Retorna um array com os topicos que match a seach
		global $CONF;
		$db = clone $GLOBALS['maindb'];

		if ($qtd<=0) $qtd=$CONF['topic_list_qt'];
		if (isset($lastorderid) && $lastorderid>0) $addwhere=" and orderid>$lastorderid ";
		else $addwhere="";

		$db->query($search." LIMIT $qtd;");
		if ($db->number_rows()<=0) return null;

		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Topic();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}

	static function prettyUrl($subject)
	{
		$url = normalize_chars($subject);
		$url = strtolower($url);
		$url = preg_replace('/[^a-zA-Z0-9]/','-',$url);
		$url = preg_replace('/-+/','-',$url);
		$ok = (substr($url, -1)!='-');
		while (!$ok){
			$url = substr($url, 0, -1);
			$ok = (substr($url, -1)!='-');
		}
		return $url;
	}

}
?>
