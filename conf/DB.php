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

class DB
{
	private $resource;
	private $result;
	private $canclose;

	function __construct()
	{
		global $CONF;

		$con = "host=" . $CONF['dbhost'] . " dbname=" . $CONF['dbname'] . " port=" . $CONF['dbport'] . " user=" . $CONF['dbuser'] . " password=" . $CONF['dbpassword'];
		
		$this->resource = pg_connect($con);
		if (!$this->resource)
			die();

		$this->canclose = true;
		//pg_query($this->resource, "set search_path={$CONF['dbschema']},public,pg_catalog;");

	}

	function __clone() { $this->result = null; $this->canclose = false; }

	function query($query)
	{
		/*$fp = fopen('log.log', 'a');
		fwrite($fp,date('Y-m-d h-i-s: '));
		fwrite($fp, $query);
		fwrite($fp,"\n");
		fclose($fp);*/
		$this->result = pg_query($this->resource, $query);
		if (!$this->result)
			die();

		return $this->result;
	}

	function fetch($result=-1)
	{
		if ($result==-1)
			return pg_fetch_array($this->result,NULL,PGSQL_ASSOC);
		
		return pg_fetch_array($result,NULL,PGSQL_ASSOC);
	}

	function number_rows()
	{
		return pg_num_rows($this->result);
	}

	function close()
	{
		if (!$this->canclose)
			die('You cannot close a db connection from a clonned object.');
		pg_close($this->resource);
	}
	
	function escape($string)
	{
		return pg_escape_string($string);
	}

	function lo_import($file){
		return pg_lo_import($this->resource, $file);
	}
}

?>
