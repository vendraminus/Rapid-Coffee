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
	global $LANG;
	require_once('conf/location.php');
	require_once('engine.php');

	if (!isset($_GET['year_datetopics'])) $_GET['year_datetopics']=date("Y");

	$result = engine_doit();
	$result=$result['datetopics'];

	$year = $_GET['year_datetopics'];
	
	if (!isset($_GET['month_datetopics']))
		$month='**';
	else
		$month=$_GET['month_datetopics'];
	if (!isset($_GET['day_datetopics']))
		$day='**';
	else
		$day=$_GET['day_datetopics'];


		$inminus1_href = $CONF['userfriendly_listtopic'].($year-1);
		$inminus1 = ($year-1);
		if ($inminus1<2011) {
			$inminus1=''; 
			$inminus1_href="#";
		}
		$inmore1_href = $CONF['userfriendly_listtopic'].($year+1);
		$inmore1 = ($year+1);
		if ($inmore1>date("Y")){
			$inmore1="";
			$inmore1_href="#";
		}


?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"> 
	<head> 
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<link rel="stylesheet" type="text/css" href="<?=$CONF['url_path']?>css/rc.css" />
		<title>Rapid Coffee - Topic list (<?=$day?>/<?=$month?>/<?=$year?>)</title>
	</head>
	<body>
		<div id='beta-info'><?=preg_replace('/<a>([^<]+)<\/a>/', "<a href='/{$_GET['where']}'>$1</a>", $LANG['access_fullversion'])?></div>
		<div id='content-body'>
			<div id='tab-container'>
				<div class='unit'>
					<div class='unit-head'>
						<span class='unit-title'><?=$LANG['topic_topicspostedin']?> <?=$year?>/<?=$month?>/<?=$day?> - <?=$LANG['topic_seetopicin']?> <a href='<?=$inminus1_href?>'><?=$inminus1?></a> - <a href='<?=$inmore1_href?>'><?=$inmore1?></a></span>
					</div>
					<ol class='topic-previews'>
						<? foreach($result as $topic) { ?>
							<li class="topic-stop topic-preview id-<?=$topic['id']?> version-<?=$topic['version']?> orderid-<?=$topic['orderid']?>">
								<a href="<?=$CONF['userfriendly_topic'].'archive/'.$topic['id']?>/<?=Topic::prettyUrl($topic['subject']);?>" class="topic-title"><?=$topic['subject']?></a>
								<div class="topic-summary"><?=$topic['subsumedmsg']?></div>
								<div class="info-bar">
									<div class="fl postedby"><?=$LANG['topic_postedby']?> <?=$topic['author']?></div>
									<div class="fr viewslikes"> 
										<span class="cb"><?=$topic['replies']?></span> <?=$LANG['topic_replies']?> ::
										<span class="co"><?=$topic['views']?></span> <?=$LANG['topic_views']?> ::
										<span class="cg"><?=$topic['likes']?></span> <?=$LANG['topic_likes']?> ::
										<span class="cr"><?=$topic['dislikes']?></span> <?=$LANG['topic_dislikes']?>
									</div>
								</div>
							</li>
						<? } ?>
					</ol>
				</div>
			</div>
		</div>
		<div id='bottom-bar-wrap'>
			<?php include('html/bottom_bar.php'); ?>
		</div>
	</body>
</html>
