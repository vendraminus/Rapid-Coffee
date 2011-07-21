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
//*******************************************************************************************************************
//************ CUIDADO AO ATUALIZAR NO SITE!!!! LEMBRE-SE DE COPIAR AS LINHAS DE CONF do BD ABAIXO!!! ***************
//*******************************************************************************************************************
$CONF['dbname'] = 'openheart';
$CONF['dbport'] = '5432';
$CONF['dbuser'] = 'openheart';
$CONF['dbpassword'] = 'dbpasswd';
$CONF['dbhost'] = '127.0.0.1';
$CONF['url_path'] = 'http://localhost/';
//*******************************************************************************************************************
//************ CUIDADO AO ATUALIZAR NO SITE!!!! LEMBRE-SE DE COPIAR AS LINHAS DE CONF do BD ACIMA!!!  ***************
//*******************************************************************************************************************

$CONF['topic_summary_len']=200;
$CONF['channel_summary_len']=200;
$CONF['message_summary_len']=200;
$CONF['user_list_qt']=10;
$CONF['topic_list_qt']=20;
$CONF['channel_list_qt']=200;
$CONF['channel_list_qt_search']=200;
$CONF['message_list_qt']=10;
$CONF['post_list_qt']=999999;
$CONF['post_best_qt']=1;
$CONF['topic_time_to_wait_flood']=15; //secs
$CONF['message_time_to_wait_flood']=15; //secs
$CONF['channel_time_to_wait_flood']=60; //secs
$CONF['post_time_to_wait_flood']=15;

$CONF['ban_time']=60*10; //10 minutos de ban

$CONF['user_avatar_maximgsize']= 5*1024*1204;
$CONF['user_avatar_width_big']=142;
$CONF['user_avatar_width_med']=52;
$CONF['user_avatar_width_small']=22;

$CONF['user_temp_avatar_max_width'] = 450;
$CONF['user_temp_avatar_max_height'] = 250;

$CONF['max_channel_per_user']=500;

$CONF['channel_logo_maximgsize']= 5*1024*1204;
$CONF['channel_logo_width_big']=142;
$CONF['channel_logo_width_med']=52;
$CONF['channel_logo_width_small']=22;

$CONF['channel_temp_logo_max_width'] = 450;
$CONF['channel_temp_logo_max_height'] = 250;


$CONF['channel_min_name'] = 3;
$CONF['min_msg_chars'] = 0;
$CONF['permitted_tags_msg'] = '<abbr><acronym><big><caption><center><cite><code><del><dd><dfn><dl><h1><h2><h3><h4><h5><h6><dt><object><embed><iframe><table><tbody><tr><td><th><div><span><a><li><ul><ol><b><p><i><em><br><strong><blockquote><img><ins><kbd><label><legend><link><q><small><sub><sup><tfoot><thead><title><tt><var>';
$CONF['user_signature_allowedtags']='<a>';

$CONF['user_avatar_path'] = 'imgs/avatar';
$CONF['channel_logo_path'] = 'imgs/channel_logo';

$CONF['accents'] = "çãâäàáêëèéïîìíûùüúöòóôÿñ";
$CONF['nickname_chars'] = "a-z0-9 :;\\-+\\!#$%&*()=_{}\\]\\[\\|\"\\/?<>,.\\\\" . $CONF['accents'];

$CONF['DEFAULT_LANG']='en_us';

$CONF['email_from']="service@rapidcoffee.com";

$hundreddays = 60*60*60*24*100;
$CONF['cookie_lifetime'] = time()+$hundreddays;
$CONF['cookie_rememberme_lifetime'] = time()+$hundreddays;

//$CONF['path'] = $_SERVER['DOCUMENT_ROOT'] . '/rc/';
$CONF['site_url'] = $CONF['url_path'];

if (isset($_GET['where'])){
	$CONF['userfriendly_topic']=$CONF['site_url'].$_GET['where'].'/';
	$CONF['userfriendly_listtopic']=$CONF['site_url'].$_GET['where'].'/';
} else {
	$CONF['userfriendly_topic']=$CONF['site_url'].'/';
	$CONF['userfriendly_listtopic']=$CONF['site_url'].'/';
}

require_once('conf/DB.php');
$maindb = new DB();
$GLOBALS['maindb'] = $maindb;

?>
