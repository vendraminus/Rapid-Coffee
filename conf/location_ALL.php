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
//=========== PT_BR
$LANGALL['pt_br']['channel_asktofollow_subject']='Permissão para assinar canal';
$LANGALL['pt_br']['channel_asktofollow_msg']='$body = "Este usu&aacute;rio est&aacute; pedindo autoriza&ccedil;&atilde;o para assinar este canal.\n<br/><a target=\\\'_blank\\\' href=\\\'".$CONF[\'site_url\']."engine.php?SYSTEM_redirect=1&what=followchannel_acceptreject&a=accept&b=".$__ufid."&c=$check\\\'>Aceitar</a> - <a target=\\\'_blank\\\' href=\\\'".$CONF[\'site_url\']."engine.php?SYSTEM_redirect=1&what=followchannel_acceptreject&a=reject&b=".$__ufid."&c=$check\\\'>Recusar</a>\n<br/>---\n<br/>";';

$LANGALL['pt_br']['channel_confirmfollow_accepted']='Pedido aceito';
$LANGALL['pt_br']['channel_confirmfollow_rejected']='Pedido negado';

$LANGALL['pt_br']['addchannel_welcome_title']='Bem vindo';
$LANGALL['pt_br']['addchannel_welcome_message']='Bem vindo ao seu canal!<br/>Esta &eacute; uma mensagem de boas vindas. Agora &eacute; poss&iacute;vel criar t&oacute;picos em seu canal.<br/><br/>Aproveite e divulgue aos seus amigos. ;-)';



//========== EN_US
$LANGALL['en_us']['channel_asktofollow_subject']='Permission to sign channel';
$LANGALL['en_us']['channel_asktofollow_msg']='$body = "This user is requesting authorization to sign this channel.\n<br/><a target=\\\'_blank\\\' href=\\\'".$CONF[\'site_url\']."engine.php?SYSTEM_redirect=1&what=followchannel_acceptreject&a=accept&b=".$__ufid."&c=$check\\\'>Accept</a> - <a target=\\\'_blank\\\' href=\\\'".$CONF[\'site_url\']."engine.php?SYSTEM_redirect=1&what=followchannel_acceptreject&a=reject&b=".$__ufid."&c=$check\\\'>Reject</a>\n<br/>---\n<br/>";';

$LANGALL['en_us']['channel_confirmfollow_accepted']='Ask accepted';
$LANGALL['en_us']['channel_confirmfollow_rejected']='Ask rejected';

$LANGALL['en_us']['addchannel_welcome_title']='Welcome';
$LANGALL['en_us']['addchannel_welcome_message']='Welcome to your channel!<br/>This is a welcome message. Now you can create topics in your channel.<br/><br/>Send this channel to your friends. ;-)';

?>
