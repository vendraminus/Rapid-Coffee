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
require_once('tool/utility.php');

function upload_temp_logo()
{
	global $_FILES;
	global $_USER;
	global $CONF;

	if (!isset($_FILES['tmp-clogo-to-upload']))
		$result = '_FILES not set';
	elseif ($_FILES['tmp-clogo-to-upload']['error'])
		$result = upload_error_msg($_FILES['tmp-clogo-to-upload']['error']);
	else{
		$file = 'imgs/temp/'.rand().'.png';
		move_uploaded_file($_FILES['tmp-clogo-to-upload']['tmp_name'], $file);

		$image = create_image($file);

		if ($image==null || file_update_user_avatar_is_GIF_animated($file))
			$result='invalid type';
		else {

			if ($_FILES['tmp-clogo-to-upload']['size']>$CONF['channel_logo_maximgsize'])
				$result="invalidsize";
			else {

				$image = set_reasonable_image_size($image, $file);
				$result = 'ok';
				imagepng($image,$file);
			}
		}
	}
	if ($result=='ok') return array('ok'=>true, 'error'=>'', 'filename'=>$file);
	else return array('ok'=>false, 'error'=>"$result");
}

function set_reasonable_image_size($image, $filename)
{
	global $CONF;
	list($width, $height) = getimagesize($filename);
	if ($width <= $CONF['channel_temp_logo_max_width'] && $height <= $CONF['channel_temp_logo_max_height'])
		return $image;
	$size = resize_dimensions($CONF['channel_temp_logo_max_width'],$CONF['channel_temp_logo_max_height'],$width,$height);

	$fwidth = $size['width'];
	$fheight = $size['height'];

	$thumb = imagecreatetruecolor($fwidth, $fheight); setTransparency($thumb,$image); 
	$index = imagecolorexact($thumb, 255, 255, 255); imagecolortransparent($thumb, $index);
	imagecopyresampled($thumb, $image, 0, 0, 0, 0, $fwidth, $fheight, $width, $height);
	imagepng($thumb,$filename);
	return $thumb;
}

function resize_dimensions($goal_width,$goal_height,$width,$height)
{ 
    $return = array('width' => $width, 'height' => $height); 
    
    // If the ratio > goal ratio and the width > goal width resize down to goal width 
    if ($width/$height > $goal_width/$goal_height && $width > $goal_width) { 
        $return['width'] = $goal_width; 
        $return['height'] = $goal_width/$width * $height; 
    } 
    // Otherwise, if the height > goal, resize down to goal height 
    else if ($height > $goal_height) { 
        $return['width'] = $goal_height/$height * $width; 
        $return['height'] = $goal_height; 
    } 
    
    return $return; 
}
?>
