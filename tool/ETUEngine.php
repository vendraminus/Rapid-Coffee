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
require_once('class/ETTU.php');
//require_once('class/Mail.php');

class ETUEngine{

	private $LIST;
	function __construct(){
		$this->LIST=array();
	}
	function process($title,$query){
		global $CONF;
		$db = clone $GLOBALS['maindb'];

		$db->query($query);

		$lastid=0;
		while ($row = $db->fetch())
		{
			if (!isset($this->LIST[$row['to_id']])) {
				$this->LIST[$row['to_id']] = new ETTU();
				$this->LIST[$row['to_id']]->setToId($row['to_id']);
				$this->LIST[$row['to_id']]->setToEmail($row['to_email']);
				$this->LIST[$row['to_id']]->setToNickname($row['to_nickname']);
			}
			if ($lastid!=$row['to_id'])
				$this->LIST[$row['to_id']]->addTitle($title);
			$lastid=$row['to_id'];
			$this->LIST[$row['to_id']]->addTopic($row['channel_name'],$row['channel_id'],$row['channel_logo_update_time'],$row['id'],$row['subject'],$row['msg'],$row['from_nickname'],$row['counter']);
		}
	}

	function send($cronID){
		$addsubject='';
		if ($cronID>1) $addsubject='Diária - ';
		$addsubject.=date("Y/m/d");
		foreach($this->LIST as $l){
			$l->setAddSubject($addsubject);
			$l->send();
		}
	}
	
	function start($cronID){
		//Avisa os donos dos topicos de suas respostas
		$this->process('Seus T&oacute;picos com Novos Coment&aacute;rios',"SELECT usr.id as to_id, usr.email as to_email, usr.nickname as from_nickname, usr.nickname as to_nickname, channel.name as channel_name, channel.id as channel_id, floor(extract(epoch from channel.logo_update_time)) as channel_logo_update_time, topic.id, topic.subject, substring(topic.msg,1,300) as msg, topic.counter FROM topic LEFT JOIN channel ON channel.id=topic.channelid LEFT join \"user\" as usr ON topic.userid=usr.id AND topic.anon=false LEFT JOIN topicview ON topicview.topicid=topic.id AND topicview.userid=usr.id AND topicview.anon=false LEFT JOIN follow_topic_user ON follow_topic_user.topicid=topic.id AND follow_topic_user.userid=usr.id AND follow_topic_user.anon='false' LEFT JOIN email_topic_user ON email_topic_user.topicid=topic.id AND email_topic_user.userid=usr.id WHERE  topic.counter>COALESCE(email_topic_user.counter,0) AND COALESCE(follow_topic_user.counter,COALESCE(topicview.counter,0))<topic.counter AND topic.counter>1 AND usr.email_mytopics='{$cronID}' ORDER BY usr.nickname, channel.name, topic.orderid;");
	
		//Avisa os donos dos canais de novos topicos
		$this->process('Seus Canais com Novos T&oacute;picos',"SELECT usr2.id as to_id, usr2.email as to_email, usr2.nickname as to_nickname, COALESCE(usr.nickname,'Anon') as from_nickname, channel.name as channel_name,channel.id as channel_id, floor(extract(epoch from channel.logo_update_time)) as channel_logo_update_time, topic.id, topic.subject, substring(topic.msg,1,300) as msg, topic.counter FROM topic LEFT join \"user\" as usr ON topic.userid=usr.id AND topic.anon=false LEFT JOIN channel ON channel.id=topic.channelid LEFT JOIN \"user\" as usr2 ON channel.userid=usr2.id LEFT JOIN topicview ON topicview.topicid=topic.id AND topicview.userid=usr2.id AND topicview.anon=false WHERE NOT EXISTS (SELECT 1 FROM email_topic_user WHERE email_topic_user.topicid=topic.id AND email_topic_user.userid=usr2.id) AND COALESCE(usr.id,-1)!=usr2.id AND COALESCE(topicview.counter,0)<=0 AND usr2.email_mychannels='{$cronID}' ORDER BY usr2.nickname,channel.name,topic.orderid;");

		//Avisa as pessoas que seguem topicos das atualizacoes
		$this->process('T&oacute;picos seguidos n&atilde;o lidos',"SELECT usr2.id as to_id, usr2.email as to_email, usr2.nickname as to_nickname, COALESCE(usr.nickname,'Anon') as from_nickname, channel.name as channel_name,channel.id as channel_id, floor(extract(epoch from channel.logo_update_time)) as channel_logo_update_time, topic.id, topic.subject, substring(topic.msg,1,300) as msg, topic.counter FROM topic LEFT join \"user\" as usr ON topic.userid=usr.id AND topic.anon=false LEFT JOIN channel ON channel.id=topic.channelid LEFT JOIN follow_topic_user ON follow_topic_user.topicid=topic.id INNER JOIN \"user\" as usr2 ON follow_topic_user.userid=usr2.id LEFT JOIN topicview ON topicview.topicid=topic.id AND topicview.userid=usr2.id AND topicview.anon=false LEFT JOIN email_topic_user ON email_topic_user.topicid=topic.id AND email_topic_user.userid=usr2.id WHERE topic.counter>COALESCE(email_topic_user.counter,0) AND COALESCE(topicview.counter,0)<topic.counter AND topic.userid!=usr2.id AND follow_topic_user.anon='false' and follow_topic_user.counter<topic.counter AND usr2.email_followedtopics='{$cronID}' ORDER BY usr2.nickname, channel.name, topic.orderid;");

		//Aivsa as pessoas que assinam canais de topicos novos
		$this->process('Novos t&oacute;picos dos canais assinados',"SELECT usr2.id as to_id, usr2.email as to_email, usr2.nickname as to_nickname, COALESCE(usr.nickname,'Anon') as from_nickname, channel.name as channel_name,channel.id as channel_id, floor(extract(epoch from channel.logo_update_time)) as channel_logo_update_time, topic.id, topic.subject, substring(topic.msg,1,300) as msg, topic.counter FROM topic LEFT join \"user\" as usr ON topic.userid=usr.id AND topic.anon=false LEFT JOIN channel ON channel.id=topic.channelid LEFT JOIN follow_channel_user ON follow_channel_user.channelid=channel.id INNER JOIN \"user\" as usr2 ON follow_channel_user.userid=usr2.id LEFT JOIN topicview ON topicview.topicid=topic.id AND topicview.userid=usr2.id AND topicview.anon=false WHERE NOT EXISTS (SELECT 1 FROM email_topic_user WHERE email_topic_user.topicid=topic.id AND email_topic_user.userid=usr2.id) AND topic.userid!=usr2.id AND channel.userid!=usr2.id AND follow_channel_user.anon='false' AND follow_channel_user.date<topic.date AND COALESCE(topicview.counter,0)<=0 AND usr2.email_followedchannels='{$cronID}' ORDER BY usr2.nickname, channel.name, topic.orderid;");


//PRECISA TIRAR ESSE COMENTARIO DA LINHA ABAIXO DEPOIS DE RODAR A PRIMEIRA VEZ.
//ISSO PRA EVITAR DE MANDAR EMAILS COM OS TOPICOS ANTIGOS (DESDE 1900 E BOLINHA) PRA GALERA.
		$this->send($cronID);
	}

}
?>
