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
	require_once('conf/location.php');
	require_once('engine.php');

	$_GET['what']='topic';
	$result = engine_doit();
	$result=$result['topic'];

	global $LANG;

	$LANG['click_here_javascript_version'] = preg_replace('/<a>([^<]+)<\/a>/', "<a href='/{$_GET['where']}/index.php?topic_id={$_GET['id_topic']}'>$1</a>", $LANG['click_here_javascript_version']);
	$LANG['access_fullversion'] = preg_replace('/<a>([^<]+)<\/a>/', "<a href='/{$_GET['where']}/{$_GET['id_topic']}/{$result['topic']['subject_for_url']}'>$1</a>", $LANG['access_fullversion']);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"> 
	<head> 
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<link rel="stylesheet" type="text/css" href="<?=$CONF['url_path']?>css/rc.css" />
		<title>Rapid Coffee - <?=$result['topic']['subject']?></title>
	</head>
	<body>
		<div id='beta-info'><?=$LANG['access_fullversion']?></div>
		<div id='content-body'>
			<div id='tab-container'>
				<div class='topic-col fl topic-stop topic-entire'>
					<div class='topic-head'>
						<?php if ($result['topic']['author_hasavatar']) { ?>
							<img class='avatar-med fl' src='<?=$CONF['site_url']?>imgs/avatar/<?=strtolower($result['topic']['author'])?>-med-<?=$result['topic']['author_avatar_update_time']?>.png'/>
						<?php } else { ?>
							<img class='avatar-med fl' src='<?=$CONF['site_url']?>imgs/default-avatar-med.png'/>
						<?php } ?>
						<div class='topic-title'><?=$result['topic']['subject']?></div>
						<div class='topic-msg'><?=$result['topic']['msg']?></div>
						<div class='info-bar'>
							<div class='fl postedby'><?=$LANG['topic_postedby']?> <a class='author'><?=$result['topic']['author']?></a></div>
							<div class='fr viewslikes'> 
								<span class="cb"><?=$result['topic']['replies']?></span> <?=$LANG['topic_replies']?> ::
								<span class="co"><?=$result['topic']['views']?></span> <?=$LANG['topic_views']?> ::
								<span class="cg"><?=$result['topic']['likes']?></span> likes ::
								<span class="cr"><?=$result['topic']['dislikes']?></span> dislikes
							</div>
						</div>
					</div>
					<div class='posts'>
						<div class='title'><?=count($result['posts'])?> replies</div>

						<? foreach($result['posts'] as $post) { ?>

							<div class='post post-stop'>
								<div class='post-content'>
								<?php if ($post['author_hasavatar']) { ?>
									<img class='avatar-small fl' src='<?=$CONF['site_url']?>imgs/avatar/<?=strtolower($post['author'])?>-small-<?=$post['author_avatar_update_time']?>.png'/>
								<?php } else { ?>
									<img class='avatar-small fl' src='<?=$CONF['site_url']?>imgs/default-avatar-small.png'/>
								<?php } ?>
									<span class='msg'><?=$post['post']?></span>
								</div>
								<div class='info-bar'>
									<div class='fl postedby'><?=$LANG['topic_postedby']?> <a class='author'><?=$post['author']?></a></div>
									<div class='fr viewslikes'> 
										<span class="cg"><?=$post['likes']?></span> likes ::
										<span class="cr"><?=$post['dislikes']?></span> dislikes
									</div>
								</div>
							</div>
						
						<? } ?>

					</div>
				</div>
				<div class='clear'></div>
			</div>
		</div>
		<div id='bottom-bar-wrap'>
			<?php include('html/bottom_bar.php'); ?>
		</div>
	</body>
</html>
