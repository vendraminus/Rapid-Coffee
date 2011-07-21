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

function new_topic_previews(){

	if (!isset($_GET['orderid_new_topic_previews']) || empty($_GET['orderid_new_topic_previews']))
		return array();

	require_once("template/TListTopic.php");
	$tlisttopic = new TListTopic();	$tlisttopic->setListType("cloneNew"); $tlisttopic->setOnlySubsumed(true);

	if (isset($_GET['qtd_new_topic_previews'])) $tlisttopic->setQtd($_GET['qtd_new_topic_previews']);

	if (isset($_GET['idchannel_new_topic_previews']) && isset($_GET['orderid_new_topic_previews'])){
		$chids = explode(",",$_GET['idchannel_new_topic_previews']);
		$orderids = explode(",",$_GET['orderid_new_topic_previews']);
	} else
		return array();

	$result=array();
	for ($i=0;$i<count($chids);$i++){
		$tlisttopic->setIdChannel($chids[$i]);
		$tlisttopic->setLastId($orderids[$i]);
		$result[$i]=$tlisttopic->getJsonTags();
	}
	return $result;
}
?>
