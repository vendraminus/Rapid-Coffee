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

require_once('conf/location.php');

function ob_h(){
		ob_start();
}
function ob_f(){
	$result = ob_get_contents();
	ob_end_clean();
	return $result;
}
function get_HTTP_ACCEPTED_LANGUAGE($lang){
	if (strpos(strtolower($lang),'pt-br')!==false) return 'pt_br';
	if (strpos(strtolower($lang),'pt_br')!==false) return 'pt_br';
	return 'en_us';
}

function text_linkify($string){
return $string;
//TA COM PAU AINDA!!!!

	/*** make sure there is an http:// on all URLs ***/
	//$string = preg_replace("/([^\w\/])(www\.[a-z0-9\-]+\.[a-z0-9\-]+)/i", "$1http://$2",$string);
	/*** make all URLs links ***/
	//"<a target=\"_blank\" href=\"$1\">$1</A>"
	/*preg_match_all("/([\w]+:\/\/[\w-?&;#~=\.\/\@]+[\w\/])/i",$string,$matches);
	echo "<pre>";
	foreach ($matches[0] as $val){
		print_r($val);
	}
//	print_r($matches);
	*/
/*	$string = ereg_replace("[[:alpha:]]+://[^<>[:space:]]+[[:alnum:]/]","<a target=\"_BLANK\" href=\"\\0\">\\0</a>", $string);
	$string = str_replace('<a href="<a target="_BLANK" href="','<a href="',$string);
	$string = str_replace('</a>"','"',$string);
	$string = str_replace('</a></a>','</a>',$string);
	return $string;*/
}

function cleanQuery($string)
{
  if(get_magic_quotes_gpc())  // prevents duplicate backslashes
  {
    $string = stripslashes($string);
  }
 	$string = pg_escape_string($string);
  return $string;
 //return treatVar($string);
}

function treatVar($x){
    $x = ereg_replace('\\\\','\\\\',$x);    
    $x = ereg_replace('\\\\\\\\','',$x);    
    $x = ereg_replace("\'","\\'",$x);
    $x = ereg_replace("\"","\\\"",$x);
    $x = ereg_replace(";"," ",$x);
    $x = str_replace('\"',"\'\'",$x);
    return $x;
  }

function unescape_ampersand($text)
{
	return str_replace('[a_mp]', '&', $text);
}

/*
function replace_multiple_spaces($string)
{
	// tabs, new lines and carriages are also replaced
	$string = ereg_replace("[ \t\n\r]+", " ", $string);

	return $string;
}

function norm_subject_to_useas_url($subject)
{
	global $CONF;

	$l = $CONF['maxsublen_in_url'];

	if (strlen($subject) > $l)
		$subject = substr($subject,0,50);

	$subject = str_replace($CONF['allow_spec_chars_subject'], ' ', $subject);

	$subject = replace_multiple_spaces($subject);
	$subject = str_replace(' ', '-', $subject);
	
	return strtolower($subject);
}
*/
/* Works out the time since the entry post, takes a an argument in unix time (seconds) */
function time_since($original) {
	global $LANG;
    // array of time period chunks
    $chunks = array(
        array(60 * 60 * 24 * 365 , $LANG['year']),
        array(60 * 60 * 24 * 30 , $LANG['month']),
        array(60 * 60 * 24 * 7, $LANG['week']),
        array(60 * 60 * 24 , $LANG['day']),
        array(60 * 60 , $LANG['hour']),
        array(60 , $LANG['minute']),
	array(1 , $LANG['second']),
    );
    
    $today = time(); /* Current unix time  */
    $since = $today - $original;
    if ($since<0) return "1 ".$LANG['second']."s";
    // $j saves performing the count function each time around the loop
    for ($i = 0, $j = count($chunks); $i < $j; $i++) {
        
        $seconds = $chunks[$i][0];
        $name = $chunks[$i][1];
        
        // finding the biggest chunk (if the chunk fits, break)
        if (($count = floor($since / $seconds)) != 0) {
            // DEBUG print "<!-- It's $name -->\n";
            break;
        }
    }
    
    $print = ($count == 1) ? '1 '.$name : "$count {$name}s";
    
    /*if ($i + 1 < $j) {
        // now getting the second item
        $seconds2 = $chunks[$i + 1][0];
        $name2 = $chunks[$i + 1][1];
        
        // add second item if it's greater than 0
        if (($count2 = floor(($since - ($seconds * $count)) / $seconds2)) != 0) {
            $print .= ($count2 == 1) ? ', 1 '.$name2 : ", $count2 {$name2}s";
        }
    }*/
    return $print;
}

function upload_error_msg($errcode)
{
	switch($errcode)
	{
	
		case '1':
			$error = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
			break;
		case '2':
			$error = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
			break;
		case '3':
			$error = 'The uploaded file was only partially uploaded';
			break;
		case '4':
			$error = 'No file was uploaded.';
			break;
		case '6':
			$error = 'Missing a temporary folder';
			break;
		case '7':
			$error = 'Failed to write file to disk';
			break;
		case '8':
			$error = 'File upload stopped by extension';
			break;
		case '999':
			default:
			$error = 'No error code avaiable';
	}
	return $error;
}

function normalize_chars($text)
{
$normalizeChars = array(
    'Š'=>'S', 'š'=>'s', 'Ð'=>'Dj','Ž'=>'Z', 'ž'=>'z', 'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 
    'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E', 'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 
    'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O', 'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U', 'Ú'=>'U', 
    'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss','à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 
    'å'=>'a', 'æ'=>'a', 'ç'=>'c', 'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i', 
    'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o', 'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 
    'ú'=>'u', 'û'=>'u', 'ý'=>'y', 'ý'=>'y', 'þ'=>'b', 'ÿ'=>'y', 'ƒ'=>'f'
);

	return strtr($text, $normalizeChars);

}

function create_image($file)
{
	if (exif_imagetype($file)==IMAGETYPE_GIF)
		return imagecreatefromgif($file);
	elseif (exif_imagetype($file)==IMAGETYPE_JPEG)
		return imagecreatefromjpeg($file);
	elseif (exif_imagetype($file)==IMAGETYPE_PNG)
		return imagecreatefrompng($file);
	elseif (exif_imagetype($file))
		return imagecreatefrombmp($file);
	else
		return null;
}
function file_update_user_avatar_is_GIF_animated($filename)
{
	if(!($fh = fopen($filename, 'rb')))
	        return false;
	$count = 0;
	//an animated gif contains multiple "frames", with each frame having a
	//header made up of:
	// * a static 4-byte sequence (\x00\x21\xF9\x04)
	// * 4 variable bytes
	// * a static 2-byte sequence (\x00\x2C)
	   
	// We read through the file til we reach the end of the file, or we've found
	// at least 2 frame headers
	while(!feof($fh) && $count < 2)
		$chunk = fread($fh, 1024 * 100); //read 100kb at a time
		$count += preg_match_all('#\x00\x21\xF9\x04.{4}\x00\x2C#s', $chunk, $matches);
	   
	fclose($fh);
	return $count > 1;
}

function setTransparency($new_image,$image_source)
{
	$transparencyIndex = imagecolortransparent($image_source);
	$transparencyColor = array('red' => 255, 'green' => 255, 'blue' => 255);
	
	if ($transparencyIndex >= 0) {
	    $transparencyColor    = imagecolorsforindex($image_source, $transparencyIndex);   
	}
	
	$transparencyIndex    = imagecolorallocate($new_image, $transparencyColor['red'], $transparencyColor['green'], $transparencyColor['blue']);
	imagefill($new_image, 0, 0, $transparencyIndex);
	imagecolortransparent($new_image, $transparencyIndex);
} 

function generateRandomPassword($length=9, $strength=0) {
	$vowels = 'aeuy';
	$consonants = 'bdghjmnpqrstvz';
	if ($strength & 1) {
		$consonants .= 'BDGHJLMNPQRSTVWXZ';
	}
	if ($strength & 2) {
		$vowels .= "AEUY";
	}
	if ($strength & 4) {
		$consonants .= '23456789';
	}
	if ($strength & 8) {
		$consonants .= '@#$%';
	}
 
	$password = '';
	$alt = time() % 2;
	for ($i = 0; $i < $length; $i++) {
		if ($alt == 1) {
			$password .= $consonants[(rand() % strlen($consonants))];
			$alt = 0;
		} else {
			$password .= $vowels[(rand() % strlen($vowels))];
			$alt = 1;
		}
	}
	return $password;
}
 
?>
