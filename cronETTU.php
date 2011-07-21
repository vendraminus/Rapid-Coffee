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

echo "BEGIN\n";

$db = $GLOBALS['maindb'];
$db->query("set search_path=beta,public,pg_catalog;");

if ($argc==3){

	$CRONID = $argv[1];
	if ($argv[2]=='SoHpRaEvItArInVaSaOdEaLgUmAfOrMa'){

		if ($CRONID>0){
	
			include('tool/ETUEngine.php');
			$etu=new ETUEngine();
			$etu->start($CRONID);
		
		}

	} else
		echo "Invasion!!! IP Detected!!!\n";

} else
	echo "Wrong Parameters\n";

echo "END";
