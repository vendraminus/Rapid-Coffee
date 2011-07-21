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
 require_once('conf/location.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"> 
	<head> 
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<meta name="Description" content="A dynamic forum for people needing help and advice over a variety of subjects. We are currently in the beta phase, but you can aid us to improve this website by using it.">
		<style type="text/css">

body
{
	margin:0;
	padding:0;
	background-color:#e0e0e0;
	font-family: 'Helvetica Neue', arial, tahoma, verdana, sans-serif;
	font-size:16px;
	color: #4c4c4c;
}
#content
{
	width:800px;
	margin:6em auto 0;
	text-align:center;
}

.message
{
	width:800px;
	margin:3em auto 0;
	text-align:center;
}


.h1 {
	font-size:120%;
}
.h2 {
	font-size:90%;
	margin-top:2em;
}
form.bellow {
	margin-top:1em;
	height:40px;
	padding:0 245px;
}
input.text {
	padding:8px;
	border: 1px solid #bbb;
	-moz-border-radius: 4px; -webkit-border-radius: 4px; border-radius: 4px;
	-webkit-transition: border 0.2s linear;
	outline:none;
	width:200px;
	float:left;
	margin:0;
}
input.text:focus {
	border: 1px solid #333;;
	display:inline-block;
}
input.submit {
	margin:0;
	height:32px;
	width:88px;
	border-width:0;
	-moz-border-radius: 4px; -webkit-border-radius: 4px; border-radius: 4px;
	outline:none;
	background: url(imgs/button-submit.png) no-repeat center center;
	display:inline-block;
	float:right;
}
img:hover {cursor:pointer;}
a {
	color:#1D4088;
	text-decoration:none;
}
a:hover {text-decoration:underline;}
a:visited {color:#1D4088;}

		</style>
		<title>Rapid Coffee</title>
	</head>

<?php
	if (isset($_GET['msg'])) $msg=urldecode($_GET['msg']);
	else $msg='';
	
?>
	<body>
		<div class='message'><?=$msg?></div>
		<div id='content'>
			<div id='letter-logo'><img onclick='location.href="games"' src='imgs/rapidcoffee.png' /></div>
			<div class='h1'><?=$LANG['home_anewkindof']?></div>
			<div class='h2'><?=$LANG['contact_msg']?></div>
			<div class='h2'><?=$LANG['home_msg_forum']?> <?=$LANG['home_msg_forum_list']?></div>
		</div>
	</body>
</html>

