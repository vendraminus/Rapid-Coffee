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
	background-color:#a1b3c4;
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

.info, .success, .warning, .error, .validation {
    border: 1px solid;
    margin: 10px 0px;
    padding:15px 10px 15px 50px;
    background-repeat: no-repeat;
    background-position: 10px center;
}
.info {
    color: #00529B;
    background-color: #BDE5F8;
    background-image: url('imgs/info.png');
}
.success {
    color: #4F8A10;
    background-color: #DFF2BF;
    background-image:url('imgs/success.png');
}
.warning {
    color: #9F6000;
    background-color: #FEEFB3;
    background-image: url('imgs/warning.png');
}
.error {
    color: #D8000C;
    background-color: #FFBABA;
    background-image: url('imgs/error.png');
}

.h1 {
	font-size:120%;
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
	if (isset($_GET['msgclass'])) $msgclass=$_GET['msgclass'];
	else $msgclass='success';
	
?>
	<body>
		<div id='content'>
			<div class="<?=$msgclass?>"><?=$msg?></div>
			<div id='letter-logo' class='h1'><a href='/'><img src='imgs/logo-big.png' width="80" style="vertical-align:middle;" border="0"/></a> <?=$LANG['home_anewkindof']?></div>
		</div>
		<div id='preloadmario'></div>
		<div id='preloadhealth'></div>
	</body>
</html>

