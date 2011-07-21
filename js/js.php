<?php

// ESSA GAMBIARRA EH TEMPORARIA
// O MELHOR JEITO EH CRIAR UM ARQUIVO .BIZ DE VERDADE
// E FALAR PRO APACHE COMPRIMIR ELE

function print_gzipped_page() {

    global $HTTP_ACCEPT_ENCODING;
    if( headers_sent() ){
        $encoding = false;
    }elseif( strpos($HTTP_ACCEPT_ENCODING, 'x-gzip') !== false ){
        $encoding = 'x-gzip';
    }elseif( strpos($HTTP_ACCEPT_ENCODING,'gzip') !== false ){
        $encoding = 'gzip';
    }else{
        $encoding = false;
    }

    if( $encoding ){
        $contents = ob_get_contents();
        ob_end_clean();
        header('Content-Encoding: '.$encoding);
        print("\x1f\x8b\x08\x00\x00\x00\x00\x00");
        $size = strlen($contents);
        $contents = gzcompress($contents, 9);
        $contents = substr($contents, 0, $size);
        print($contents);
        exit();
    }else{
        ob_end_flush();
        exit();
    }
}

// At the beginning of each page call these two functions
ob_start();
ob_implicit_flush(0);

$jsfiles = array("jquery-1.6.1.min.js",
"jquery-ui-1.8.13.custom.min.js",
"oop.js",
'jquery.scrollTo-min.js',
'jquery.tools.expose.min.js',
'clickorenter.js',
'center.js',
'animation.js',
'tabs.js',
'controller.js',
'view.js',
'model.js',
'util.js',
'jquery.cookie.js',
'jquery.address-1.4.min.js');

$js = '';

for ($i = 0; $i < count($jsfiles); $i++)
{
	if ($i==1)
		$js .= "jQuery.noConflict();\n";
	$js .= "\n//@FILE@" . $jsfiles[$i] . "@FILE@\n" . file_get_contents($jsfiles[$i]);
}

header('Cache-Control: max-age=2592000');
header('Expires-Active: On');
header('Expires: Fri, 1 Jan 2500 01:01:01 GMT');
header('Pragma:');
header('Content-type: text/javascript; charset=utf-8');

echo $js;

// Call this function to output everything as gzipped content.
print_gzipped_page();

?>
