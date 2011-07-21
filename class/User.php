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

interface User
{
//	private $id;
//	private $nickname;
//	private $preferedlang;

	function getId();
	function getNickname();
	function getLang();
	function isAnon();

	function setId($param);
	function setNickname($param);
	function setLang($param);

	function save();	//Salva o objeto no BD (se ja foi salvo faz update)
	function load();	//Abre o objeto do BD (pega o topico com o ID informado)
}

class RegUser implements User{

	private $_new;
	private $_flush;

	private $id;
	private $email;
	private $password;
	private $encPassword;
	private $nickname;
	private $avatar_update_time;
	private $date;
	private $unixdate;
	private $credits;
	private $hasavatar;
	private $avatarFile;
	private $signature; private $_update_signature;
	private $lang;
	private $camefrom;
	private $camefrom_name;
	private $banned;
	private $email_mytopics;
	private $email_mychannels;
	private $email_followedtopics;
	private $email_followedchannels;

	public function getBanned(){ return $this->banned; }

	private function _check_get(){
		if ( (!isset($this->_new)) || ($this->_new == true) ){
			$this->load();
		}
	}
	private function _unflush(){
		$this->_flush=false;
	}

	private function constructFromRow($row){
		$this->id = $row['id'];
		$this->email= $row['email'];
		$this->encPassword = $row['password'];
		$this->nickname = trim($row['nickname']);
		$this->date = $row['date'];
		$this->unixdate = $row['unixdate'];
		$this->credits = $row['credits'];
		$this->hasavatar = ($row['hasavatar']=='t')?true:false;
		$this->avatar_update_time = $row['unix_avatar_update_time'];
		$this->banned = $row['banned'];
		$this->signature = $row['signature'];
		$this->lang = $row['lang'];
		$this->firsttime = ($row['firsttime']=='t')?true:false;
		$this->emailvalidated = ($row['emailvalidated']=='t')?true:false;
		$this->camefrom = $row['camefrom'];
		$this->camefrom_name = $row['camefrom_name'];
		$this->email_mytopics=$row['email_mytopics'];
		$this->email_mychannels=$row['email_mychannels'];
		$this->email_followedtopics=$row['email_followedtopics'];
		$this->email_followedchannels=$row['email_followedchannels'];
		$this->_flush=true;
		$this->_new=false;

	}

	public function getJsonTags(){

		global $CONF;

		$r=array();
		$r['id'] = $this->getId();
		$r['email'] = $this->getEmail();
		$r['nickname'] = $this->getNickname();
		$r['credits'] = $this->getCredits();
		$r['hasavatar'] = $this->hasAvatar();
		$r['avatar_update_time'] = $this->getAvatarUpdateTime();
		$r['signature'] = $this->getSignature();
		$r['timeago'] = $this->getTimeAgo();
		$r['camefrom_name'] = $this->getCameFromName();
		$r['lang'] = $this->getLang();
		$r['anon'] = false;
		$r['email_mytopics']=$this->getEmailMyTopics();
		$r['email_mychannels']=$this->getEmailMyChannels();
		$r['email_followedtopics']=$this->getEmailFollowedTopics();
		$r['email_followedchannels']=$this->getEmailFollowedChannels();
		//$r['upped'] = $this->isUpped();
		$r['firsttime'] = $this->getFirstTime();

		return $r;
	}

	public function __construct(){
		global $CONF;
		$this->credits=3;
		$this->camefrom=0;
		$this->email_mytopics=1;
		$this->email_mychannels=2;
		$this->email_followedtopics=1;
		$this->email_followedchannels=2;
		//$this->firsttime=true;
		if (isset($_SERVER["HTTP_ACCEPT_LANGUAGE"])){
			require_once('tool/utility.php');
			$this->lang = get_HTTP_ACCEPTED_LANGUAGE($_SERVER["HTTP_ACCEPT_LANGUAGE"]);
		}
		else
			$this->lang = $CONF['DEFAULT_LANG'];
	}

	function getId(){ 
		if (empty($this->id) && (!empty($this->email) || !empty($this->nickname)) ) {
			$this->_check_get(); 
		}
		return $this->id; 
	}
	function getEmail(){ 
		if (empty($this->email) &&(!empty($this->id) || !empty($this->nickname)) ) {
			$this->_check_get(); 
		}
		return $this->email; 
	}
	function getPassword(){ $this->_check_get(); return $this->password; }
	function getEncPassword(){ $this->_check_get(); return $this->encPassword; }
	function getNickname(){ 
		if (empty($this->nickname) &&(!empty($this->id) || !empty($this->email)) ) {
			$this->_check_get(); 
		}
		return $this->nickname; 
	}
	public function getTimeAgo(){		//retorna a data em tanto tempo atras
		global $CONF;
		$this->_check_get();
		require_once('tool/utility.php');
		return time_since($this->unixdate);
	}
	function getDate(){ $this->_check_get(); return $this->date; }
	function getCredits(){ $this->_check_get(); return $this->credits; }
	function getAvatarUpdateTime(){ $this->_check_get(); return $this->avatar_update_time; }
	function getAvatarFile(){ $this->_check_get(); return $this->avatarFile; }
	function hasAvatar(){ $this->_check_get(); return $this->hasavatar; }
	function getSignature(){ $this->_check_get(); return $this->signature; }
	function getLang(){ $this->_check_get(); return 'pt_br'; }//return $this->lang; }
	function getFirstTime(){$this->_check_get(); return $this->firsttime; }
	function getEmailValidated(){$this->_check_get(); return $this->emailvalidated; }
	function getCameFrom(){ $this->_check_get(); return $this->camefrom; }
	function getCameFromName(){ $this->_check_get(); return $this->camefrom_name; }
	function getEmailMyTopics(){ $this->_check_get(); return $this->email_mytopics; }
	function getEmailMyChannels(){ $this->_check_get(); return $this->email_mychannels; }
	function getEmailFollowedTopics(){ $this->_check_get(); return $this->email_followedtopics; }
	function getEmailFollowedChannels(){ $this->_check_get(); return $this->email_followedchannels; }

	function setId($param){ $this->_new=true; $this->_unflush(); $this->id=$param; }
	function setEmail($param){ $this->_unflush(); $this->email=trim($param); }
	function setPassword($param){ $this->_unflush(); $this->password=$param; $this->encPassword=hash('sha512',$this->password."`\Θℑ");}
	//function setEncPassword(){}
	function setNickname($param){ $this->_unflush(); $this->nickname=trim($param); }
	function setDate($param){ $this->_unflush(); $this->date=$param; }
	function setCredits($param){ $this->_unflush(); $this->credits=$param; }
	//function setAvatar(){}
	function setAvatarFile($param){ $this->_unflush(); $this->avatarFile=$param; }
	function setSignature($param){ global $CONF; $this->_unflush(); $this->_update_signature=true; $this->signature=strip_tags($param,$CONF['user_signature_allowedtags']); }
	function setLang($param){ $this->_unflush(); $this->lang=$param; }
	function setFirstTime($param){$this->_unflush(); $this->firsttime=$param; }
	function setEmailValidated($param){$this->_unflush(); $this->emailvalidated=$param; }
	function setCameFrom($param){$this->_unflush(); $this->camefrom=$param;}
	function setEmailMyTopics($param){$this->_unflush(); $this->email_mytopics=$param; }
	function setEmailMyChannels($param){$this->_unflush(); $this->email_mychannels=$param; }
	function setEmailFollowedTopics($param){$this->_unflush(); $this->email_followedtopics=$param; }
	function setEmailFollowedChannels($param){$this->_unflush(); $this->email_followedchannels=$param; }

	function stopReceiveEmail(){
		$db = clone $GLOBALS['maindb'];
		$db->query("UPDATE \"user\" SET email_mytopics=0, email_mychannels=0, email_followedtopics=0, email_followedchannels=0, email_receive=0 WHERE email='{$this->getEmail()}';");
	}

	function save(){	//Salva o objeto no BD (se ja foi salvo faz update)
		global $CONF;
		$this->_new=false;
		$db = clone $GLOBALS['maindb'];

		if (empty($this->email))
			return 'error null email';

		if (empty($this->nickname))
			return 'error null nickname';
		
		if (empty($this->encPassword))
			return 'error null password';

		$db->query("SELECT count(*) as count FROM user_camefrom WHERE id = '{$this->camefrom}';");
		$row = $db->fetch();
		if ($row['count']<=0)
			$this->camefrom=0;

		if (!isset($this->id) || ($this->id==null)){	//Insert

			$db->query("SELECT count(*) as count FROM \"user\" WHERE lower(email) = lower('{$this->email}') or lower(nickname) = lower('{$this->nickname}');");
			$row = $db->fetch();
			if ($row['count']>0)
				return "user already exists";

			$db->query("SELECT nextval('user_id_seq') as id;");
			$_gotid_req = $db->fetch();
			$_gotid = $_gotid_req['id'];

			if (!empty($this->avatarFile)) $_hasavatar='t';
			else $_hasavatar='f';

			$db->query("INSERT INTO \"user\"(id, email, password, nickname, credits, signature, lang, hasavatar, avatar_update_time, camefrom, email_mytopics, email_mychannels, email_followedtopics, email_followedchannels) VALUES('{$_gotid}','{$this->email}','{$this->encPassword}','{$this->nickname}','{$this->credits}', '{$this->signature}', '{$this->lang}','{$_hasavatar}',now(),{$this->camefrom},'{$this->email_mytopics}','{$this->email_mychannels}','{$this->email_followedtopics}','{$this->email_followedchannels}');");

			$this->id = $_gotid;
		} else {					//Update

			$db->query("SELECT count(*) as count FROM \"user\" WHERE id!='{$this->id}' and (lower(email) = lower('{$this->email}') or lower(nickname) = lower('{$this->nickname}') );");
			$row = $db->fetch();
			if ($row['count']>0)
				return "error";

			$_alsoupdate='';
			if ($this->_update_signature==true) $_alsoupdate.=",signature='{$this->signature}'";

			$_firsttime=($this->firsttime)?'t':'f';
			$_emailvalidated=($this->emailvalidated)?'t':'f';
			if (!empty($this->avatarFile)){

				$_hasavatar='t';
				$db->query("UPDATE \"user\" set email='{$this->email}',password='{$this->encPassword}',nickname='{$this->nickname}',credits='{$this->credits}', lang='{$this->lang}',hasavatar='{$_hasavatar}',avatar_update_time=now(),firsttime='{$_firsttime}',emailvalidated='{$_emailvalidated}',camefrom={$this->camefrom}, email_mytopics='{$this->email_mytopics}',email_mychannels='{$this->email_mychannels}',email_followedtopics='{$this->email_followedtopics}',email_followedchannels='{$this->email_followedchannels}' {$_alsoupdate} WHERE id='{$this->id}';");
			} else {
			
				$_hasavatar=($this->hasAvatar())?'t':'f';
				$db->query("UPDATE \"user\" set email='{$this->email}',password='{$this->encPassword}',nickname='{$this->nickname}',credits='{$this->credits}', lang='{$this->lang}', hasavatar='{$_hasavatar}',firsttime='{$_firsttime}',emailvalidated='{$_emailvalidated}',camefrom={$this->camefrom}, email_mytopics='{$this->email_mytopics}',email_mychannels='{$this->email_mychannels}',email_followedtopics='{$this->email_followedtopics}',email_followedchannels='{$this->email_followedchannels}' {$_alsoupdate} WHERE id='{$this->id}';");

			}
			//$row = $db->fetch();
		}
		if (!empty($this->avatarFile)){
			$db->query('SELECT floor(extract(epoch from avatar_update_time)) AS aut FROM "user" WHERE id='.$this->id);
			$row = $db->fetch();
			foreach (glob($CONF['user_avatar_path']."/".strtolower($this->nickname)."-*.png") as $oldavatar) {
				if (is_file($oldavatar)){
					unlink($oldavatar);
				}
			} 
			$_file = $CONF['user_avatar_path']."/".strtolower($this->nickname)."-big-{$row['aut']}.png";copy($this->avatarFile."-big",$_file);
			$_file = $CONF['user_avatar_path']."/".strtolower($this->nickname)."-med-{$row['aut']}.png";copy($this->avatarFile."-med",$_file);
			$_file = $CONF['user_avatar_path']."/".strtolower($this->nickname)."-small-{$row['aut']}.png";copy($this->avatarFile."-small",$_file);
		}
		unset($this->avatarFile);
		//$this->_flush=true;
		$this->load();
		return "ok";
	}
	function load($forcing=false){	//Abre o objeto do BD (pega o usuario com o ID informado)
		if (!isset($this->_flush) || $this->_flush==false || $this->_new==true || $forcing){
			global $CONF;
			$db = clone $GLOBALS['maindb'];
			if (!empty($this->id))
				$db->query("SELECT *,ceil( (2^(bancounter-1)*${CONF['ban_time']} + extract (epoch from lastban_time) - extract (epoch from now()))/60 ) as banned FROM \"vw_user\" WHERE id='{$this->id}';");
			elseif (!empty($this->email))
				$db->query("SELECT *,ceil( (2^(bancounter-1)*${CONF['ban_time']} + extract (epoch from lastban_time) - extract (epoch from now()))/60 ) as banned FROM \"vw_user\" WHERE lower(email)=lower('{$this->email}');");
			elseif (!empty($this->nickname))
				$db->query("SELECT *,ceil( (2^(bancounter-1)*${CONF['ban_time']} + extract (epoch from lastban_time) - extract (epoch from now()))/60 ) as banned FROM \"vw_user\" WHERE lower(nickname)=lower('{$this->nickname}');");
			else
				return "error cannot load this user";
			$row = $db->fetch();
			$this->constructFromRow($row);
			$this->_flush=true;
			$this->_new=false;
		}
		return "ok";
	}

	function isAnon(){ return false; }
	function validatePassword($passwd){
		if (hash('sha512',$passwd."`\Θℑ")==$this->getEncPassword())
			return true;
		else
			return false;
	}
	function validateEncPassword($passwd){
		if ($passwd==$this->getEncPassword())
			return true;
		else
			return false;
	}
	function mustValidateEmailFirst(){
		$firsttime = $this->getFirstTime();
		$validated = $this->getEmailValidated();
		if (empty($this->id) || $this->id<0)
			return false; //Nao encontrou o usuario
		if ($firsttime)
			return false;
		return !$validated;
	}

	public function sendEmail(){
		global $CONF;
		global $LANG;
		$check=substr(hash('sha512',"`\Θℑ ♣  check".$this->getId()),0,8);

		$body='';
		eval($LANG['useremail_body']);
		//system("echo \"".$body."\" > email.html");

		require_once('class/Mail.php');
		$a=new Mail();
		$a->setEmailTo($this->email);
		$a->setNicknameTo($this->nickname);
		$a->setSubject("Confirmação de e-mail");
		$a->setSubjectMsg("");
		$a->setMsg($body);
		return $a->send();
 		//return mail($this->email, "Rapidcoffee", $body, $headers);
	}

	function confirm($checkCode){	//COnfirma usuario --> Vira usuario registrado
		$check=substr(hash('sha512',"`\Θℑ ♣  check".$this->getId()),0,8);

		if ($check==$checkCode){
			$db = clone $GLOBALS['maindb'];
			$db->query("UPDATE \"user\" SET emailvalidated='t' WHERE id='{$this->id}';");

			return "ok";
		} else {
			return "error invalid check code";
		}
		return "error";
	}


//---------------------------------
//STATIC
//---------------------------------



	static function cloneLastCameFrom($camefrom=0, $qtd=-1){	//Retorna um array com os ultimos usuarios que vieram de camefrom
		global $CONF;

		if ($qtd<=0) $qtd=$CONF['user_list_qt'];

		$addwhere='';
		if ($camefrom>=0)
			$addwhere.=" AND camefrom in ($camefrom)";

		$db = clone $GLOBALS['maindb'];
		$db->query("SELECT *,ceil( (2^(bancounter-1)*${CONF['ban_time']} + extract (epoch from lastban_time) - extract (epoch from now()))/60 ) as banned FROM vw_user WHERE 1=1 {$addwhere} ORDER BY date desc LIMIT $qtd;");

		if ($db->number_rows()<=0) return null;

		$stArr = array($db->number_rows());

		$i = 0;
		while ($row = $db->fetch())
		{
			$tmp = new RegUser();
			$tmp->constructFromRow($row);
			$stArr[$i]=$tmp;
			$i++;
		}
		return $stArr;
	}


}

class AnonUser implements User{
	private $_new;
	private $_flush;

	private $id;
	//private $nickname;
	//private $lang;
	private $fingerprint;
	private $fingerprintdebug;
	private $ip;
	private $banned;

	public function __construct(){
		//$this->lang='en_us';
		$this->ip=$_SERVER['REMOTE_ADDR'];
		$this->fingerprint="0000000000";
		$fingertmp="";
		if (isset($_SERVER["HTTP_ACCEPT"])) $fingertmp.=$_SERVER["HTTP_ACCEPT"];
		if (isset($_SERVER["HTTP_ACCEPT_CHARSET"])) $fingertmp.=$_SERVER["HTTP_ACCEPT_CHARSET"];
		if (isset($_SERVER["HTTP_ACCEPT_LANGUAGE"])) $fingertmp.=$_SERVER["HTTP_ACCEPT_LANGUAGE"];
		if (isset($_SERVER["HTTP_ACCEPT_ENCODING"])) $fingertmp.=$_SERVER["HTTP_ACCEPT_ENCODING"];
		if (isset($_SERVER["HTTP_CONNECTION"])) $fingertmp.=$_SERVER["HTTP_CONNECTION"];
		if (isset($_SERVER["HTTP_USER_AGENT"])) $fingertmp.=$_SERVER["HTTP_USER_AGENT"];

		$this->fingerprint = md5($fingertmp);
		$this->fingerprintdebug = $fingertmp;
	}


	private function _check_get(){
		if ( (!isset($this->_new)) || ($this->_new == true) ){
			$this->load();
		}
	}
	private function _unflush(){
		$this->_flush=false;
	}

	private function constructFromRow($row){
		$this->id = $row['id'];
		//$this->nickname = trim($row['nickname']);
		//$this->lang = $row['lang'];
		global $CONF;
		$this->fingerprint = $row['fingerprint'];
		$this->ip = $row['ip'];
		$this->banned = $row['banned'];
		$this->_flush=true;
		$this->_new=false;
	}


	public function getJsonTags(){

		$r=array();
		$r['id'] = $this->getId();
		$r['nickname'] = $this->getNickname();
		$r['lang'] = $this->getLang();
		$r['signature'] = $this->getSignature();
		$r['anon'] = true;
		//$r['upped'] = $this->isUpped();

		return $r;
	}

	function getId(){ 
		return $this->id; 
	}
	function getNickname(){ 
		return "Anon"; 
	}
	public function getBanned(){ return $this->banned; }
	function getAvatarUpdateTime() { return null; }
	function getLang(){ 
		global $CONF;
		/*if (isset($_COOKIE['lang']))
			return $_COOKIE['lang'];
		elseif (isset($_SERVER["HTTP_ACCEPT_LANGUAGE"])){
			require_once('tool/utility.php');
			return get_HTTP_ACCEPTED_LANGUAGE($_SERVER["HTTP_ACCEPT_LANGUAGE"]);
		}
		else
			return $CONF['DEFAULT_LANG'];*/
		return 'pt_br';

	}
	function getSignature(){ return ''; }
	function getFingerprint(){ $this->_check_get(); return $this->fingerprint; }
	function getIp(){ $this->_check_get(); return $this->ip; }

	function setId($param){ $this->_new=true; $this->_unflush(); $this->id=$param; }
	function setNickname($param){ }
	function setLang($param){ 
		global $CONF;
		setcookie("lang", $param, $CONF['cookie_lifetime']);
	}
	function setIp($param){ $this->_unflush(); $this->ip=$param; }
	function setFingerprint($param){ $this->_unflush(); $this->fingerprint=$param; }

	function isAnon(){ return true; }
	function hasAvatar(){ return false; }

	function save(){	//Salva o objeto no BD (se ja foi salvo faz update)
		$this->_new=false;
		$db = clone $GLOBALS['maindb'];

		//if (empty($this->nickname))
			//return 'error null nickname';

		if (empty($this->ip)) $this->ip=$_SERVER['REMOTE_ADDR'];

		if (!isset($this->id) || ($this->id==null)){	//Insert
			$db->query("SELECT nextval('anon_id_seq') as id;");
			$_gotid_req = $db->fetch();
			$_gotid = $_gotid_req['id'];
			$db->query("INSERT INTO \"anon\"(id,lang,fingerprint,fingerprintdebug,ip) VALUES('{$_gotid}','{$this->getLang()}','{$this->fingerprint}','{$this->fingerprintdebug}','{$this->ip}');");
			$row = $db->fetch();
			$this->id = $_gotid;
		} else {					//Update
			$db->query("UPDATE \"anon\" set lang='{$this->getLang()}',fingerprint='{$this->fingerprint}',ip='{$this->ip}' WHERE id='{$this->id}';");
			$row = $db->fetch();
		}
		$this->_flush=true;
		return "ok";
	}
	function load($forcing=false){	//Abre o objeto do BD (pega o topico com o ID informado)
		if (!isset($this->_flush) || $this->_flush==false || $this->_new==true || $forcing){
			global $CONF;
			if (empty($this->ip)) $this->ip=$_SERVER['REMOTE_ADDR'];
			$db = clone $GLOBALS['maindb'];
			if (!empty($this->id))
				$db->query("SELECT *,ceil( (2^(bancounter-1)*${CONF['ban_time']} + extract (epoch from lastban_time) - extract (epoch from now()))/60 ) as banned FROM \"anon\" WHERE id='{$this->id}';");
			else
				$db->query("SELECT *,ceil( (2^(bancounter-1)*${CONF['ban_time']} + extract (epoch from lastban_time) - extract (epoch from now()))/60 ) as banned FROM \"anon\" WHERE fingerprint='{$this->fingerprint}' and ip='{$this->ip}';");
			if ($db->number_rows()<=0)
				return $db->number_rows();
			$row = $db->fetch();
			$this->constructFromRow($row);
			$this->_flush=true;
			$this->_new=false;
			return $db->number_rows();
		}
		return -1;
	}

	function loadorsave(){
		if ($this->load()<=0)
			$this->save();
	}

}

//class UnconfirmedUser implements User{
//
//	private $_new;
//	private $_flush;
//
//	private $id;
//	private $email;
//	private $password;
//	private $encPassword;
//	private $nickname;
//	private $date;
//	private $credits;
//	//private $avatarFile;
//	private $signature;
//	private $lang;
//
//	private function _check_get(){
//		if ( (!isset($this->_new)) || ($this->_new == true) ){
//			$this->load();
//		}
//	}
//	private function _unflush(){
//		$this->_flush=false;
//	}
//
//	private function constructFromRow($row){
//		$this->id = $row['id'];
//		$this->email= $row['email'];
//		$this->encPassword = $row['password'];
//		$this->nickname = trim($row['nickname']);
//		$this->date = $row['date'];
//		$this->credits = $row['credits'];
//		//$this->avatar = $row['avatar'];
//		//$this->avatar_update_time = $row['avatar_update_time'];
//		$this->signature = $row['signature'];
//		$this->lang = $row['lang'];
//		$this->_flush=true;
//		$this->_new=false;
//
//	}
//
//	public function __construct(){
//		global $CONF;
//		$this->credits=3;
//		if (isset($_SERVER["HTTP_ACCEPT_LANGUAGE"])){
//			require_once('tool/utility.php');
//			$this->lang = get_HTTP_ACCEPTED_LANGUAGE($_SERVER["HTTP_ACCEPT_LANGUAGE"]);
//		}
//		else
//			$this->lang = $CONF['DEFAULT_LANG'];
//	}
//
//	public function getJsonTags(){
//
//		$r=array();
//		$r['id'] = $this->getId();
//		//$r['email'] = $this->getEmail();
//		$r['nickname'] = $this->getNickname();
//		$r['credits'] = $this->getCredits();
//		//$r['avatar'] = $this->getAvatar();
//		$r['lang'] = $this->getLang();
//		$r['signature'] = $tihs->getSignature();
//		$r['anon']=true;
//		//$r['upped'] = $this->isUpped();
//
//		return $r;
//	}
//
//	function getId(){ 
//		if (empty($this->id) && (!empty($this->email) || !empty($this->nickname)) ) {
//			$this->_check_get(); 
//		}
//		return $this->id; 
//	}
//	function getEmail(){ 
//		if (empty($this->email) &&(!empty($this->id) || !empty($this->nickname)) ) {
//			$this->_check_get(); 
//		}
//		return $this->email; 
//	}
//	function getPassword(){ $this->_check_get(); return $this->password; }
//	function getEncPassword(){ $this->_check_get(); return $this->encPassword; }
//	function getNickname(){ 
//		if (empty($this->nickname) &&(!empty($this->id) || !empty($this->email)) ) {
//			$this->_check_get(); 
//		}
//		return $this->nickname; 
//	}
//	function getDate(){ $this->_check_get(); return $this->date; }
//	function getCredits(){ $this->_check_get(); return $this->credits; }
//	//function getAvatar(){ $this->_check_get(); return $this->avatar; }
//	//function getAvatarFile(){ $this->_check_get(); return $this->avatarFile; }
//	function getLang(){ $this->_check_get(); return $this->lang; }
//	function getSignature(){ $this->_check_get(); return $this->signature; }
//
//	function setId($param){ $this->_new=true; $this->_unflush(); $this->id=$param; }
//	function setEmail($param){ $this->_unflush(); $this->email=$param; }
//	function setPassword($param){ $this->_unflush(); $this->password=$param; $this->encPassword=hash('sha512',$this->password."`\Θℑ");}
//	//function setEncPassword(){}
//	function setNickname($param){ $this->_unflush(); $this->nickname=$param; }
//	function setDate($param){ $this->_unflush(); $this->date=$param; }
//	function setCredits($param){ $this->_unflush(); $this->credits=$param; }
//	//function setAvatar(){}
//	//function setAvatarFile($param){ $this->_unflush(); $this->avatarFile=$param; }
//	function setLang($param){ $this->_unflush(); $this->lang=$param; }
//	function setSignature($param){ global $CONF; $this->_unflush(); $this->signature=strip_tags($param,$CONF['user_signature_allowedtags']); }
//
//	function hasAvatar(){ return false; }
//
//	function save(){	//Salva o objeto no BD (se ja foi salvo faz update)
//		$this->_new=false;
//		$db = clone $GLOBALS['maindb'];
//
//		if (empty($this->email))
//			return 'error null email';
//
//		if (empty($this->nickname))
//			return 'error null nickname';
//		
//		if (empty($this->encPassword))
//			return 'error null password';
//
//		//if (!empty($this->avatarFile)){
//		//	$data = file_get_contents($tmpfile);
//		//	$this->avatar = pg_escape_bytea($data);
//		//}
//
//		if (!isset($this->id) || ($this->id==null)){	//Insert
//			$db->query("SELECT nextval('unconfirmed_user_id_seq') as id;");
//			$_gotid_req = $db->fetch();
//			$_gotid = $_gotid_req['id'];
//			$db->query("INSERT INTO \"unconfirmed_user\"(id,email,password,nickname,credits,lang,signature) VALUES('{$_gotid}','{$this->email}','{$this->encPassword}','{$this->nickname}','{$this->credits}', '{$this->lang}', '{$this->signature}');");
//			$row = $db->fetch();
//			$this->id = $_gotid;
//		} else {					//Update
//			$db->query("UPDATE \"unconfirmed_user\" set email='{$this->email}',password='{$this->encPassword}',nickname='{$this->nickname}',credits='{$this->credits}', lang='{$this->lang}', signature='{$this->signature}' WHERE id='{$this->id}';");
//			$row = $db->fetch();
//		}
//		$this->_flush=true;
//	
//		if ($this->sendEmail())	return "ok";
//		else return "error sending email";
//	}
//
//	private function sendEmail(){
//		global $CONF;
//		global $LANG;
//		$check=hash('sha512',"`\Θℑ ♣  check".$this->getId());
//
//		eval($LANG['useremail_body']);
//		//system("echo \"".$body."\" > email.html");
//
//		$headers  = "MIME-Version: 1.0\r\n";
//		$headers .= "Content-type: text/html; charset=UTF-8\r\n";
//
//		/* headers adicionais */
//		$headers .= "From: {$CONF['email_from']}\r\n";
//		$headers .= "To: {$this->nickname} <{$this->email}>\r\n";
//		
// 			return mail($this->email, "Rapidcoffee", $body, $headers);
//			//	system("echo FOI > foi.txt");
//			//} else {
//			//	system("echo NAOFOI > foi.txt");
//			//}
//	}
//
//	function load(){	//Abre o objeto do BD (pega o usuario com o ID informado)
//		if (!isset($this->_flush) || $this->_flush==false || $this->_new==true){
//			$db = clone $GLOBALS['maindb'];
//			if (!empty($this->id))
//				$db->query("SELECT * FROM \"unconfirmed_user\" WHERE id='{$this->id}';");
//			elseif (!empty($this->email))
//				$db->query("SELECT * FROM \"unconfirmed_user\" WHERE email='{$this->email}';");
//			else
//				$db->query("SELECT * FROM \"unconfirmed_user\" WHERE lower(nickname)=lower('{$this->nickname}');");
//			$row = $db->fetch();
//			$this->constructFromRow($row);
//			$this->_flush=true;
//			$this->_new=false;
//		}
//		return "ok";
//	}
//
//	function confirm($checkCode){	//COnfirma usuario --> Vira usuario registrado
//		$check=hash('sha512',"`\Θℑ ♣  check".$this->getId());
//
//		if ($check==$checkCode){
//			$db = clone $GLOBALS['maindb'];
//
//			$db->query("SELECT count(*) as count FROM \"user\" where email='{$this->getEmail()}' or lower(nickname)=lower('{$this->getNickname()}');");
//			$row = $db->fetch();
//			if ($row['count']>0) return "error user already exists";
//
//			$db->query("SELECT nextval('user_id_seq') as id;");
//			$_gotid_req = $db->fetch();
//			$_gotid = $_gotid_req['id'];
//			$db->query("INSERT INTO \"user\"(id,email,password,nickname,credits,date,signature,lang)  (SELECT $_gotid, email,password,nickname,credits,date,signature,lang FROM unconfirmed_user WHERE id='$this->id');");
//			$row = $db->fetch();
//			$userid = $_gotid;
//
//			return "ok";
//		} else {
//			return "error invalid check code";
//		}
//		return "error";
//	}
//
//	function isAnon(){ return true; }
//}
?>
