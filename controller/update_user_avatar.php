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
	require_once("class/User.php");

function update_user_avatar($file, $x1, $y1, $x2, $y2){

	//file_put_contents('aa.txt',$file);
	preg_match('/\/(\d+\.png)$/', $file, $matches); // this is for security reasons
	$file = 'imgs/temp/'.$matches[1];

	global $_FILES;
	global $_USER;
	global $CONF;

	$user = $_SESSION['user'];

	$result='ok';

	$image = imagecreatefrompng($file);

	$thumbb = imagecreatetruecolor($CONF['user_avatar_width_big'], $CONF['user_avatar_width_big']); setTransparency($thumbb,$image); 
	$thumbm = imagecreatetruecolor($CONF['user_avatar_width_med'], $CONF['user_avatar_width_med']);	setTransparency($thumbm,$image); 
	$thumbs = imagecreatetruecolor($CONF['user_avatar_width_small'], $CONF['user_avatar_width_small']);setTransparency($thumbs,$image); 

	$index = imagecolorexact($thumbb, 255, 255, 255); imagecolortransparent($thumbb, $index);
	$index = imagecolorexact($thumbm, 255, 255, 255); imagecolortransparent($thumbm, $index);
	$index = imagecolorexact($thumbs, 255, 255, 255); imagecolortransparent($thumbs, $index);

	imagecopyresampled($thumbb, $image, 0, 0, $x1, $y1, $CONF['user_avatar_width_big'], $CONF['user_avatar_width_big'], $x2-$x1, $y2-$y1);
	imagepng($thumbb,$file."-big");
	imagecopyresampled($thumbm, $image, 0, 0, $x1, $y1, $CONF['user_avatar_width_med'], $CONF['user_avatar_width_med'], $x2-$x1, $y2-$y1);
	imagepng($thumbm,$file."-med");
	imagecopyresampled($thumbs, $image, 0, 0, $x1, $y1, $CONF['user_avatar_width_small'], $CONF['user_avatar_width_small'], $x2-$x1, $y2-$y1);
	imagepng($thumbs,$file."-small");

	$user->setAvatarFile($file);
	$result = $user->save();

	unlink($file);
	unlink($file."-big");
	unlink($file."-med");
	unlink($file."-small");

	if ($result=='ok') return array('ok'=>true, 'error'=>'');
	else return array('ok'=>false, 'error'=>"$result");
}
/*
function update_user_avatar(){

	global $_FILES;
	global $_USER;
	global $CONF;

	$user = $_SESSION['user'];

	$result='ok';

	if (!isset($_FILES['avatar-to-upload']))
		$result = '_FILES not set';
	elseif ($_FILES['avatar-to-upload']['error'])
		$result = upload_error_msg($_FILES['avatar-to-upload']['error']);
	else{
		move_uploaded_file($_FILES['avatar-to-upload']['tmp_name'], $_FILES['avatar-to-upload']['tmp_name']."2");

		if (exif_imagetype($_FILES['avatar-to-upload']['tmp_name']."2")==IMAGETYPE_GIF)
			$image = imagecreatefromgif($_FILES['avatar-to-upload']['tmp_name']."2");
		elseif (exif_imagetype($_FILES['avatar-to-upload']['tmp_name']."2")==IMAGETYPE_JPEG)
			$image = imagecreatefromjpeg($_FILES['avatar-to-upload']['tmp_name']."2");
		elseif (exif_imagetype($_FILES['avatar-to-upload']['tmp_name']."2")==IMAGETYPE_PNG)
			$image = imagecreatefrompng($_FILES['avatar-to-upload']['tmp_name']."2");
		elseif (exif_imagetype($_FILES['avatar-to-upload']['tmp_name']."2")==IMAGETYPE_BMP)
			$image = imagecreatefrombmp($_FILES['avatar-to-upload']['tmp_name']."2");
		else
			$result='invalid type';

		if ($result!='ok' || file_update_user_avatar_is_GIF_animated($_FILES['avatar-to-upload']['tmp_name']."2"))
			$result='invalid type';
		else {

			if ($_FILES['avatar-to-upload']['size']>$CONF['user_avatar_maximgsize'])
				$result="invalidsize";
	
			list($width, $height) = getimagesize($_FILES['avatar-to-upload']['tmp_name']."2");
			$thumbb = imagecreatetruecolor($CONF['user_avatar_width_big'], $CONF['user_avatar_width_big']); setTransparency($thumbb,$image); 
			$thumbm = imagecreatetruecolor($CONF['user_avatar_width_med'], $CONF['user_avatar_width_med']);	setTransparency($thumbm,$image); 
			$thumbs = imagecreatetruecolor($CONF['user_avatar_width_small'], $CONF['user_avatar_width_small']);setTransparency($thumbs,$image); 

			$index = imagecolorexact($thumbb, 255, 255, 255); imagecolortransparent($thumbb, $index);
			$index = imagecolorexact($thumbm, 255, 255, 255); imagecolortransparent($thumbm, $index);
			$index = imagecolorexact($thumbs, 255, 255, 255); imagecolortransparent($thumbs, $index);
	
			imagecopyresampled($thumbb, $image, 0, 0, 0, 0, $CONF['user_avatar_width_big'], $CONF['user_avatar_width_big'], $width, $height);
			imagepng($thumbb,$_FILES['avatar-to-upload']['tmp_name']."2-big");
			imagecopyresampled($thumbm, $image, 0, 0, 0, 0, $CONF['user_avatar_width_med'], $CONF['user_avatar_width_med'], $width, $height);
			imagesavealpha($thumbm, true);
			imagepng($thumbm,$_FILES['avatar-to-upload']['tmp_name']."2-med");
			imagecopyresampled($thumbs, $image, 0, 0, 0, 0, $CONF['user_avatar_width_small'], $CONF['user_avatar_width_small'], $width, $height);
			imagesavealpha($thumbs, true);
			imagepng($thumbs,$_FILES['avatar-to-upload']['tmp_name']."2-small");
		
			$user->setAvatarFile($_FILES['avatar-to-upload']['tmp_name']."2");
			$result = $user->save();
	
	
			unlink($_FILES['avatar-to-upload']['tmp_name']."2-big");
			unlink($_FILES['avatar-to-upload']['tmp_name']."2-med");
			unlink($_FILES['avatar-to-upload']['tmp_name']."2-small");
		}
		unlink($_FILES['avatar-to-upload']['tmp_name']."2");
	}

	if ($result=='ok') return array('ok'=>true, 'error'=>'');
	else return array('ok'=>false, 'error'=>"$result");

}*/

?>
