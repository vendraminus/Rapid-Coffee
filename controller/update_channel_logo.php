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
	require_once('conf/session.php');
	require_once("class/Channel.php");

function update_channel_logo($file, $x1, $y1, $x2, $y2){

	preg_match('/\/(\d+\.png)$/', $file, $matches); // this is for security reasons
	$file = 'imgs/temp/'.$matches[1];

	global $_FILES;
	global $_USER;
	global $CONF;

	if (!isset($_GET['channelid_update_channel_logo']))
		return array('ok'=>false, 'error'=>"no id");
	$channel=new Channel();
	$channel->setId($_GET['channelid_update_channel_logo']);
	$channel->load();

	$result='ok';

	$image = imagecreatefrompng($file);

	$thumbb = imagecreatetruecolor($CONF['channel_logo_width_big'], $CONF['channel_logo_width_big']); setTransparency($thumbb,$image); 
	$thumbm = imagecreatetruecolor($CONF['channel_logo_width_med'], $CONF['channel_logo_width_med']);	setTransparency($thumbm,$image); 
	$thumbs = imagecreatetruecolor($CONF['channel_logo_width_small'], $CONF['channel_logo_width_small']);setTransparency($thumbs,$image); 

	$index = imagecolorexact($thumbb, 255, 255, 255); imagecolortransparent($thumbb, $index);
	$index = imagecolorexact($thumbm, 255, 255, 255); imagecolortransparent($thumbm, $index);
	$index = imagecolorexact($thumbs, 255, 255, 255); imagecolortransparent($thumbs, $index);

	imagecopyresampled($thumbb, $image, 0, 0, $x1, $y1, $CONF['channel_logo_width_big'], $CONF['channel_logo_width_big'], $x2-$x1, $y2-$y1);
	imagepng($thumbb,$file."-big");
	imagecopyresampled($thumbm, $image, 0, 0, $x1, $y1, $CONF['channel_logo_width_med'], $CONF['channel_logo_width_med'], $x2-$x1, $y2-$y1);
	imagepng($thumbm,$file."-med");
	imagecopyresampled($thumbs, $image, 0, 0, $x1, $y1, $CONF['channel_logo_width_small'], $CONF['channel_logo_width_small'], $x2-$x1, $y2-$y1);
	imagepng($thumbs,$file."-small");

	$channel->setLogoFile($file);
	$result = $channel->save();

	unlink($file);
	unlink($file."-big");
	unlink($file."-med");
	unlink($file."-small");

	if ($result=='ok') return array('ok'=>true, 'error'=>'');
	else return array('ok'=>false, 'error'=>"$result");
}
?>
