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

require_once('class/Mail.php');
require_once('conf/config.php');

class ETTU{
	private $to_id;
	private $to_email;
	private $to_nickname;
	private $to_avatar_update_time;
	private $addsubject;
	private $body;
	private $topic_ids;

	function __construct(){
		$addsubject='';
		$body='';
		$topic_ids='';
		$to_avatar_update_time=null;
	}

	function setAddSubject($param){ $this->addsubject=$param; }
	function setToEmail($param){ $this->to_email=$param; }
	function setToNickname($param) { $this->to_nickname=$param; }
	function setToId($param){ $this->to_id=$param; }
	
	//function addSeparator(){
	//	$this->body.="<br/>-<br/>";
	//}

	function addTitle($title){
		$this->body.="<p style='border-top: 10px solid #c0c0c0; text-align:center'>$title</p>";
	}

	function addTopic($channelname, $channelid, $logo_update_time, $topicid, $subject, $msg, $from_nickname, $counter){
		global $CONF;
		$this->body.="<p style='border-top: 1px solid #c0c0c0;'>";
			$this->body.="<div style='float:left;text-align: left;width: 58px; height:58px;float: left;display: inline-block;margin: 2px 10px'>";

				if ($logo_update_time)
					$this->body.="<img style='text-align:left;width: 58px; height:58px;' src='".$CONF['site_url']."imgs/channel_logo/".$channelid."-med-".$logo_update_time.".png'/>";
				else 
					$this->body.="<img style='text-align:left;width: 58px; height:58px;' src='".$CONF['site_url']."imgs/default-clogo-med.png'/>";


			$this->body.="</div>";

			$this->body.="<a target='_BLANK' href='".$CONF['site_url']."topic/$topicid'>$subject</a>";
			$this->body.='<br/>';
			$this->body.=$this->getSubsumedMsg($msg);
			$this->body.='<br/>';
			$this->body.="<div style='color:#4d4d4d;'>canal: #{$channelname} - postador por: ".$from_nickname."</div>";
			$this->body.='<br/>';
		$this->body.='</p>';
		$this->topic_ids.=$topicid.',';

		$db = clone $GLOBALS['maindb'];
		$db->query("SELECT F_topic_email({$topicid},{$this->to_id},{$counter});");

	}

	private function getSubsumedMsg($msg){	//retorna topico resumido
		global $CONF;

		$msg = str_replace('<br />', ' ', $msg);
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

	function send(){

		require_once('class/Mail.php');
		$a=new Mail();

		//SOMENTE TESTE!!! DEPOIS TROCAR A LINHA DE BAIXO PELO COMENTARIO ABAIXO!!!
		//$a->setEmailTo("e.rapidcoffee@gmail.com");
		$a->setEmailTo($this->to_email);
		$a->setNicknameTo($this->to_nickname);
		$tmpsubject="Notificação de tópicos";
		if (!empty($this->addsubject)) $tmpsubject.=" - ".$this->addsubject;
		$a->setSubject($tmpsubject);
		$a->setSubjectMsg("Existem atualiza&ccedil;&otilde;es de t&oacute;picos para voc&ecirc;.");
		$a->setMsg($this->body);
		$a->send();

		/*echo $this->topic_ids;
		echo "Para: {$this->to_nickname} {$this->to_email}<br/>";
		echo $this->body;
		echo "*********************";*/

	}
}

?>
