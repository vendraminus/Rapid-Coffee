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
<?
/*
	if ( !($_GET['where']=='beta' || $_GET['where']=='health') )
	{
		header("HTTP/1.0 404 Not Found");
		header("Status: 404 Not Found");
		$_SERVER['REDIRECT_STATUS'] = 404;
		die();
	}
*/
	require_once('conf/location.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"> 
	<head> 
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<script type="text/javascript">
			if(!window.console)
				var console = {log:function(o){}};
		</script>

		<?php echo '<link rel="stylesheet" type="text/css" href="css/'.md5(`ls -l css`).'.biz" />'; ?>
		<?php echo '<script type="text/javascript" src="js/'.md5(`ls -l js`).'.biz"></script>'; ?>
		<script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4d7a3f5021a8ddf5" async></script>
		<script type="text/javascript" src="js/tiny_mce.3.4.2/tiny_mce.js" async></script>
		<script type="text/javascript" src="js/tiny_mce.3.4.2/TinyMCEExtensions.2009.js" async></script>
		<script type='text/javascript'>
			jQuery(document).ready(function()
			{
				Engine.initialize();
			});
		</script>

		<!--[if lt IE 9]>
			<link rel="stylesheet" href='css/ie8.css' />
		<![endif]-->
		<!--[if IE 7]>
			<link rel="stylesheet" href='css/ie7.css' />
		<![endif]-->

<!--		<script type="text/javascript">document.write(unescape("%3Cscript src='" + (("https:" == document.location.protocol) ? "https" : "http") + "://c.mouseflow.com/projects/3c8f2798-df19-4f0d-8988-a886287dca41.js' type='text/javascript'%3E%3C/script%3E"));</script>-->

		<title>Rapid Coffee</title>
	</head>
	<body>

<?php
	if (isset($_GET['fromid'])){
		echo "<span id='fromid' style='display:none'>{$_GET['fromid']}</span>";
		echo "<script>jQuery.cookie('visitnumber', 0, {expires:365*10});</script>";
	}
?>
		<span id='welcome'></span>
		<div>
<?php
	$uagent = $_SERVER['HTTP_USER_AGENT'];
	if (!preg_match('/MSIE 7.0/i',$uagent))
	{

?>
<style type="text/css">
div.holder
{
	display:inline-block;
}
</style>
<?php
	}
?>
</div>

		<span id='window1-wrap'></span>
		<div id='toolbar-wrap'>
		</div>
		<div id='banners'></div>
		<div id='tip-banner' class='tip tip-floating'>
			<img class='tip32' src="/imgs/tip32.png" />
			<div class='text'>Sempre que estiver confuso quanto a sua localização no site, leia esse aviso. Ele ficará sempre visível para que você nunca se perca durante a navegação.</div>
			<div class='buttons'>
				<input type='button' class='tip-button-bad' value='cancela dicas' />
				<input type='button' class='tip-button-good' value=' fechar ' />
			</div>
			<div class='talk-arrow-up-1'></div>
		</div>
		<div id="big-wrapper">
			<div id='content-body'>
				<div id='tip-first-tab' class='tip tip-floating'>
					<img class='tip32' src="/imgs/tip32.png" />
					<div class="text">Você acaba de abrir a sua primeira aba. É possível abrir diversas abas, cada qual apresentando uma página diferente. Observe que no canto superior direito da aba existe um <b>x</b>. Clique nele caso queira fechá-la.</div>
					<div class='buttons'>
						<input type='button' class='tip-button-bad' value='cancela dicas' />
						<input type='button' class='tip-button-good' value=' fechar ' />
					</div>
					<div class='talk-arrow-up-2'></div>
				</div>
				<ul id='maintab-items' class='maintab-items'>
					<li id='maintab-item-0' class='maintab-item active'>
						<div class='tab-title'>
							<a href='#maintab-item-0'>Main</a>
						</div>
					</li>
				</ul>
				<div id='maintab-container' class='maintab-container'>
					<div id='maintab-cont-0' class='tab-body'>
						<div class='main-head'>
							Principal
						</div>
						<div id='main-tip-tour' class='tip'>
							<img src="/imgs/tip48.png" />
							<div class="text"></div>
							<div class='buttons'>
								<input type='button' class='tip-button-bad' value='cancelar dicas' />
								<input type='button' class='tip-button-good' value='próxima dica' />
							</div>
						</div>
						<div id='main-left-col' class='fl'>
						</div>
						<div id='main-right-col' class='fr'>
	
						</div>
						<div class='clear'></div>
					</div>
				</div>
			</div>
		</div>
		<div id='preloada'></div><div id='preloadb'></div><div id='preloadc'></div><div id='preloadd'></div><div id='preloade'></div><div id='preloadf'></div><div id='preloadg'></div><div id='preloadh'></div><div id='preloadi'></div><div id='preloadj'></div>
		<div id='preload-big-but-ac'></div>
	</body>
</html>
