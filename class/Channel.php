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

class Channel{

	private $_new;
	private $_flush;

	private $user;
	private $id;
	private $name;
	private $urlname;
	private $description;
	private $asktofollow;
	private $perm_member;
	private $perm_reguser;
	private $perm_anon;
	private $date;
	private $haslogo;
	private $logo_update_time;
	private $logoFile;
	private $lang;

	private function _check_get(){
		if ( (!isset($this->_new)) || ($this->_new == true) ){
			$this->load();
		}
	}
	private function _unflush(){
		$this->_flush=false;
	}

	private function constructFromRow($row){

		$this->user=new RegUser();
		$this->user->setId($row['userid']);
		$this->id = $row['id'];
		$this->name=$row['name'];
		$this->urlname=$row['urlname'];
		$this->description=$row['description'];
		$this->date=substr($row['date'],0,10);
		$this->lang=$row['lang'];
		$this->asktofollow=($row['asktofollow']=='t')?true:false;
		$this->perm_member=$row['perm_member'];
		$this->perm_reguser=$row['perm_reguser'];
		$this->perm_anon=$row['perm_anon'];
		$this->haslogo = ($row['haslogo']=='t')?true:false;
		$this->logo_update_time = $row['unix_logo_update_time'];
		$this->_flush=true;
		$this->_new=false;

	}

	public function __construct()
	{
		$this->asktofollow='false';
		$this->setPermMember(3);
		$this->setPermReguser(3);
		$this->setPermAnon(1);
	}

	public function getJsonTags(){

		$r=array();
		$r['id'] = $this->getId();
		$r['name'] = $this->getName();
		$r['urlname'] = $this->getUrlname();
		$r['description'] = $this->getDescription();
		$r['subsumeddescription'] = $this->getSubsumedDescription();
		$r['date'] = $this->getDate();
		$r['author'] = $this->getUser()->getNickname();
		$r['asktofollow'] = $this->getAsktofollow();
		$r['perm_member'] = $this->getPermMember();
		$r['perm_reguser'] = $this->getPermReguser();
		$r['perm_anon'] = $this->getPermAnon();
		$r['haslogo'] = $this->hasLogo();
		$r['logo_update_time']=$this->getLogoUpdateTime();
		$r['isfollowing'] = $this->isFollowing();
		$r['lang'] = $this->getLang();
		//$r['upped'] = $this->isUpped();

		return $r;
	}

	public function getId(){
		if (empty($this->id) && (!empty($this->name) || !empty($this->urlname)) ){
			$this->_check_get(); 
		}
		return $this->id;
	}
	public function getUser(){$this->_check_get(); return $this->user;}
	public function getName(){
		if (empty($this->name) &&(!empty($this->id) || !empty($this->urlname)) ) {
			$this->_check_get(); 
		}		
		return $this->name;
	}
	public function getUrlname(){
		if (empty($this->urlname) &&(!empty($this->id) || !empty($this->name)) ) {
			$this->_check_get(); 
		}		
		return $this->urlname;
	}
	public function getDescription(){$this->_check_get(); return $this->description;}
	public function getDate(){$this->_check_get(); return $this->date;}
	public function getAsktofollow(){ $this->_check_get(); return $this->asktofollow; }
	public function getPermMember(){ $this->_check_get(); return $this->perm_member; }
	public function getPermReguser(){ $this->_check_get(); return $this->perm_reguser; }
	public function getPermAnon(){ $this->_check_get(); return $this->perm_anon; }
	public function hasLogo(){ $this->_check_get(); return $this->haslogo; }
	public function getLogoUpdateTime(){ $this->_check_get(); return $this->logo_update_time; }
	public function getLogoFile($size)
	{
		$this->_check_get();
		if ($this->haslogo)
			return 'imgs/channel_logo/'.$this->id.'-'.$size.'-'.$this->logo_update_time.'.png';
		else
			return 'imgs/default-clogo-'.$size.'.png';
	}
	public function getLang(){ $this->_check_get(); return $this->lang; }
	public function getCounter(){ return 1; }
	public function getAuthor(){ $this->_check_get(); return $this->user->getNickname(); }

	public function getSubsumedDescription(){	//retorna channel descriptionresumido
		$this->_check_get();
		global $CONF;

		$msg = strip_tags($this->description);
		$len = strlen($msg);
		$msg = substr($msg, 0, min($len,$CONF['channel_summary_len']) );
		$msg = trim($msg);
		
		if ($len > $CONF['channel_summary_len'])
			$msg .= '...';

		return $msg;
	}
	public function isFollowing(){		//retorna se o usuario da SESSION esta seguindo
		global $user;
		if (empty($this->id)) return false;
		if ($user->isAnon()){
			$_cook='followingchannels';
			if (!isset($_COOKIE[$_cook])) return false;
			else {
				return isset($_COOKIE[$_cook]["{$this->id}"]);
			}
		} else {
			$db = clone $GLOBALS['maindb'];
			$useranon=($user->isAnon())?'true':'false';
			$db->query("SELECT count(*) as number FROM follow_channel_user WHERE userid='{$user->getId()}' and anon={$useranon} and channelid={$this->getId()};");
			$row = $db->fetch();
			return ($row["number"]>0);
		}
	}

	public function canITopic(){
		$user = $_SESSION['user'];
		if ($user->isAnon())
			return $this->getPermAnon()>=3;
		else {
			if ($this->getUser()->getId() == $user->getId())
				return true;
			if ($this->isFollowing())
				return $this->getPermMember()>=3;
			else
				return $this->getPermReguser()>=3;
		}
	}
	public function canIPost(){
		$user = $_SESSION['user'];
		if ($user->isAnon())
			return $this->getPermAnon()>=2;
		else {
			if ($this->getUser()->getId() == $user->getId())
				return true;
			if ($this->isFollowing())
				return $this->getPermMember()>=2;
			else
				return $this->getPermReguser()>=2;
		}
	}
	public function canIRead(){
		$user = $_SESSION['user'];
		if ($user->isAnon())
			return $this->getPermAnon()>=1;
		else {
			if ($this->getUser()->getId() == $user->getId())
				return true;
			if ($this->isFollowing())
				return $this->getPermMember()>=1;
			else
				return $this->getPermReguser()>=1;
		}
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
	public function setName($param){ $this->_unflush(); $this->name=$param; }
	public function setUrlname($param) { $this->_unflush(); $this->urlname=$param; }
	public function setDescription($param){ $this->_unflush(); $this->description=$param; }
	public function setAsktofollow($param){ $this->_unflush(); $this->asktofollow=$param; }
	public function setPermMember($param){ $this->_unflush(); $this->perm_member=$param; }
	public function setPermReguser($param){ $this->_unflush(); $this->perm_reguser=$param; }
	public function setPermAnon($param){ $this->_unflush(); $this->perm_anon=$param; }
	public function setLang($param){ $this->_unflush(); $this->lang=$param; }
	public function setLogoFile($param){ $this->_unflush(); $this->logoFile=$param; }

	public function forceFollow($user){	//Faz o usuario da sessao seguir
		if ($user->isAnon()){
			global $CONF;
			$_cook='followingchannels';
			setcookie($_cook."[{$this->id}]", $this->getCounter(), $CONF['cookie_lifetime']);
		} else {
			$db = clone $GLOBALS['maindb'];
			$db->query("INSERT INTO follow_channel_user(channelid,userid,anon) VALUES ('{$this->getId()}','{$user->getId()}','false');");
		}
		return true;
	}

	public function follow(){	//Faz o usuario da sessao seguir
		global $user;
		if ($user->isAnon()){
			global $CONF;
			$_cook='followingchannels';
			setcookie($_cook."[{$this->id}]", $this->getCounter(), $CONF['cookie_lifetime']);
		} else {
			$db = clone $GLOBALS['maindb'];
			$db->query("INSERT INTO follow_channel_user(channelid,userid,anon) VALUES ('{$this->getId()}','{$user->getId()}','false');");
		}
		return true;
	}
	public function unfollow(){	//Faz o usuario da sessao nao seguir
		global $user;

		if ($user->isAnon()){
			
			$_cook='followingchannels';
			setcookie($_cook."[{$this->id}]","",time()-1);

		} else {

			$db = clone $GLOBALS['maindb'];
			$useranon=($user->isAnon())?'true':'false';
			$db->query("DELETE FROM follow_channel_user WHERE channelid='{$this->getId()}' and userid='{$user->getId()}' and anon='{$useranon}';");
		
		}
		return true;
	}

	public function unconfirmed_follow(){	//Faz o usuario da sessao seguir
		global $user;
		$db = clone $GLOBALS['maindb'];
		$db->query("SELECT nextval('unconfirmed_follow_channel_user_id_seq') as id;");
		$_gotid_req = $db->fetch();
		$_gotid = $_gotid_req['id'];
		$db->query("INSERT INTO unconfirmed_follow_channel_user(id,channelid,userid,anon) VALUES ('{$_gotid}','{$this->getId()}','{$user->getId()}','false');");
		return $_gotid;
	}

	public function save(){	//Salva o objeto no BD (se ja foi salvo faz update)
		global $CONF;
		$this->_new=false;
		$db = clone $GLOBALS['maindb'];

		if (empty($this->name))
			return 'error null name';
		if (empty($this->urlname))
			return 'error null url';
		if ($this->getUser()->isAnon())
			return 'error user anon';	

		$_asktofollow = $this->asktofollow;
		if ($_asktofollow=='') $_asktofollow='false';

		require_once('tool/utility.php');
		$pp_name=normalize_chars($this->getName());
		$pp_description=normalize_chars(pg_escape_string($this->getDescription()));

		if (!isset($this->id) || ($this->id==null)){	//Insert

			$db->query("SELECT count(*) as count FROM channel where lower(name)=lower('{$this->getName()}') or lower(urlname)=lower('{$this->getUrlname()}');");
			$row = $db->fetch();
			if ($row['count']>0) return "error channel already exists";

			$db->query("SELECT count(*) as count FROM channel where userid='{$this->getUser()->getId()}';");
			$row = $db->fetch();
			if ($row['count']>=$CONF['max_channel_per_user']) return "error you created many channels";


			$db->query("SELECT nextval('channel_id_seq') as id;");
			$_gotid_req = $db->fetch();
			$_gotid = $_gotid_req['id'];

			if (!empty($this->logoFile)) $_haslogo='t';
			else $_haslogo='f';

			$db->query("INSERT INTO channel(id,name,urlname,description,userid,asktofollow,perm_member, perm_reguser, perm_anon, lang,haslogo, pp_name, pp_description) VALUES('{$_gotid}','{$this->getName()}','{$this->getUrlname()}','{$this->getDescription()}', '{$this->getUser()->getId()}','{$_asktofollow}', '{$this->getPermMember()}','{$this->getPermReguser()}','{$this->getPermAnon()}', '{$this->getLang()}', '{$_haslogo}', '{$pp_name}', '{$pp_description}')");
			$row = $db->fetch();
			$this->id = $_gotid;
		} else {					//Update
			$_haslogo=($this->hasLogo())?'t':'f';
			if (!empty($this->logoFile)) {
				$_addupdate=", logo_update_time=now()";
				$_haslogo='t';
			}
			else $_addupdate="";

			//Start Horta Edition
			$name = pg_escape_string($this->getName());
			$description = pg_escape_string($this->getDescription());

			$db->query("UPDATE channel set description='{$description}', userid='{$this->getUser()->getId()}', asktofollow='{$_asktofollow}', perm_member='{$this->getPermMember()}', perm_reguser='{$this->getPermReguser()}', perm_anon='{$this->getPermAnon()}', lang='{$this->getLang()}', haslogo='{$_haslogo}', pp_description='{$pp_description}' {$_addupdate} WHERE id='{$this->id}';");
			//End Horta Edition
			$row = $db->fetch();
		}
		if (!empty($this->logoFile)){
			global $CONF;
			$db->query('SELECT floor(extract(epoch from logo_update_time)) AS aut FROM channel WHERE id='.$this->id);
			$row = $db->fetch();
			foreach (glob($CONF['channel_logo_path']."/".strtolower($this->id)."-*.png") as $oldlogo) {
				if (is_file($oldlogo)){
					unlink($oldlogo);
				}
			} 
			$_file = $CONF['channel_logo_path']."/".strtolower($this->id)."-big-{$row['aut']}.png";copy($this->logoFile."-big",$_file);
			$_file = $CONF['channel_logo_path']."/".strtolower($this->id)."-med-{$row['aut']}.png";copy($this->logoFile."-med",$_file);
			$_file = $CONF['channel_logo_path']."/".strtolower($this->id)."-small-{$row['aut']}.png";copy($this->logoFile."-small",$_file);
		}
		unset($this->logoFile);
		//$this->_flush=true;
		$this->load();
		return "ok";
	}
	public function load(){	//Abre o objeto do BD (pega o topico com o ID informado)
		if (!isset($this->_flush) || $this->_flush==false || $this->_new==true){
			$db = clone $GLOBALS['maindb'];
			if (!empty($this->id))
				$db->query("SELECT * FROM vw_channel WHERE id='{$this->id}';");
			elseif (!empty($this->urlname))
				$db->query("SELECT * FROM vw_channel WHERE lower(urlname)=lower('{$this->urlname}');");
			elseif (!empty($this->name))
				$db->query("SELECT * FROM vw_channel WHERE lower(name)=lower('{$this->name}');");
			else
				return "no key to select";
			$row = $db->fetch();
			$this->constructFromRow($row);
			$this->_flush=true;
			$this->_new=false;
		}
		return "ok";
	}

	
	//----------------------- ================ STATIC ================== ---------------------------------

	static function cloneAll($sorting="name ASC",$qtd=-1){	//Retorna um array com os ultimos topicos
		global $CONF;

		if ($qtd<=0) $qtd=$CONF['channel_list_qt'];

		$db = clone $GLOBALS['maindb'];

		$db->query("SELECT * FROM vw_channel where isoff=0 ORDER BY {$sorting} LIMIT $qtd;");

		if ($db->number_rows()<=0) return null;

		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Channel();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}

	static function cloneFollowed($sorting="name ASC",$qtd=-1){
		global $CONF;
		global $user;

		if ($qtd<=0) $qtd=$CONF['channel_list_qt'];

		$addwhere='';

		$db = clone $GLOBALS['maindb'];

		if ($user->isAnon()){
			$_cook='followingchannels';
			if (!isset($_COOKIE[$_cook])) return null;
			$uftwhere=" 1=2 ";
			foreach ($_COOKIE[$_cook] as $name => $value) {
				$name = htmlspecialchars($name);
				$value = htmlspecialchars($value);
				$uftwhere.="OR (id='$name')";
			}
			//echo "SELECT *,extract(epoch from date) as unixdate, utdate>date as upped FROM topic where {$uftwhere} {$addwhere} ORDER BY orderid DESC LIMIT $qtd;";
			$db->query("SELECT * FROM vw_channel where {$uftwhere} {$addwhere} ORDER BY {$sorting} LIMIT $qtd;");
		} else {

			$db->query("SELECT * FROM vw_channel where id IN (SELECT channelid FROM follow_channel_user WHERE userid='{$user->getId()}' and anon='false') {$addwhere} ORDER BY {$sorting} LIMIT $qtd;");

		}

		if ($db->number_rows()<=0) return null;
		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Channel();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}

	static function cloneMy($sorting="name ASC",$qtd=-1){
		global $CONF;
		global $user;

		if ($qtd<=0) $qtd=$CONF['channel_list_qt'];

		$addwhere='';

		$db = clone $GLOBALS['maindb'];

		if ($user->isAnon()){
			return array(); //Anonimo nao eh dono de canal
		} else {
			$db->query("SELECT * FROM vw_channel where userid = '{$user->getId()}' {$addwhere} ORDER BY {$sorting} LIMIT $qtd;");
		}

		if ($db->number_rows()<=0) return null;
		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Channel();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}

	static function cloneMostVisited($signed=0, $qtd=-1){
		global $CONF;
		global $user;

		if ($qtd<=0) $qtd=$CONF['channel_list_qt'];


		$db = clone $GLOBALS['maindb'];
		
		$_anon=($user->isAnon())?'true':'false';


		$addwhere='';
		if ($signed)
			$addwhere="left join follow_channel_user on follow_channel_user.channelid=vw_channel.id WHERE follow_channel_user.userid='{$user->getId()}' and follow_channel_user.anon='{$_anon}'";
		

		$db->query("SELECT vw_channel.*,((select count(*) from topicview left join topic on topic.id=topicview.topicid where topic.channelid=vw_channel.id AND topicview.userid = '{$user->getId()}' and topicview.anon='{$_anon}')+(select count(*) from topic where topic.channelid=vw_channel.id AND topic.userid = '{$user->getId()}' and topic.anon='{$_anon}')) QUERY_qt_visit FROM vw_channel {$addwhere} ORDER BY QUERY_qt_visit desc LIMIT $qtd;");

		if ($db->number_rows()<=0) return null;
		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Channel();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}

	static function cloneRecommended($user, $qtd=-1){
		global $CONF;

		if ($qtd<=0) $qtd=$CONF['channel_list_qt'];

		$addwhere='';

		$db = clone $GLOBALS['maindb'];

//		if ($user->isAnon()){
//
//		} else {
//
//		}

		//system("echo \"{$user->getId()} {$user->isAnon()}\" > foi.txt");

		$_anon= ($user->isAnon())?'true':'false';
		$addwhere='';if (!($user->isAnon())) $addwhere.=" and userid!='{$user->getId()}'";
		$db->query("select vw_channel.*,((CASE haslogo WHEN 'true' THEN 1 ELSE 0 END)*100+qt_followers*random()) as QUERY_rank from vw_channel  where vw_channel.id not in (select channelid from follow_channel_user where userid='{$user->getId()}' and anon='{$_anon}') {$addwhere}  order by QUERY_rank desc LIMIT $qtd;");
		//$db->query("select * from vw_channel where vw_channel.id not in (select channelid from follow_channel_user where userid='{$user->getId()}' and anon='{$_anon}') {$addwhere} ORDER BY vw_channel.haslogo desc, vw_channel.qt_followers desc LIMIT $qtd;");

		if ($db->number_rows()<=0) return null;
		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Channel();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}


	static function cloneSearch($search, $qtd){	//Retorna um array com os topicos que match a seach
		global $CONF;
		$db = clone $GLOBALS['maindb'];

		if ($qtd<=0) $qtd=$CONF['channel_list_qt_search'];
		//if (isset($lastorderid) && $lastorderid>0) $addwhere=" and orderid>$lastorderid ";
		//else $addwhere="";

		$db->query($search." LIMIT $qtd;");
		if ($db->number_rows()<=0) return null;

		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new Channel();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}


	static function prettyUrl($name)
	{
		require_once('tool/utility.php');
		$url = normalize_chars($name);
		$url = strtolower($url);
		$url = preg_replace('/[^a-zA-Z0-9]/','-',$url);
		$url = preg_replace('/-+/','-',$url);
		return $url;
	}

	static function prettyUrlAvailable($name)
	{
		require_once('tool/utility.php');
		$url = normalize_chars($name);
		$url = strtolower($url);
		$url = preg_replace('/[^a-zA-Z0-9]/','-',$url);
		$url = preg_replace('/-+/','-',$url);

		$ok=false;
		$url_prefix=$url;
		$cnt=1;
		while ($ok==false){
			$tmpc = new Channel();
			$tmpc->setUrlname($url); $tmpc->load();
			$_id=$tmpc->getId();
			$_lang=$tmpc->getLang();
			if (empty($_id) && empty($_lang))
				$ok=true;
			else
				$url=$url_prefix."_".($cnt);
			$cnt++;
		}
		return $url;
	}

	static function confirmFollow($id,$savefollowing=true){

		$db = clone $GLOBALS['maindb'];

		$db->query("SELECT * FROM unconfirmed_follow_channel_user where id='$id';");
		if ($db->number_rows()<=0) return null;
		$row = $db->fetch();

		if ($savefollowing){

			$db->query("SELECT * FROM follow_channel_user where channelid='{$row['channelid']}' and userid='{$row['userid']}' and anon='{$row['anon']}';");
			if ($db->number_rows()>0) return null;

			$db->query("INSERT INTO follow_channel_user(channelid,userid,anon) values ('{$row['channelid']}','{$row['userid']}','{$row['anon']}');");
		}
		return $row;

	}

}
?>
