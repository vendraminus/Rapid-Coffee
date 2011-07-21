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
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"> 
	<head> 
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<?php
	if (isset($OG['topic_title']))
	{

		echo "<meta property='og:title' content='{$OG['topic_title']}' />";
		echo "<meta property='og:description' content='{$OG['topic_msg']}' />";
		echo "<meta property='og:image' content='{$OG['channel_logo']}' />";
	} else {
		echo "<meta property='og:title' content='{$OG['channel_name']}' />";
		echo "<meta property='og:description' content='{$OG['channel_desc']}' />";
		echo "<meta property='og:image' content='{$OG['channel_logo']}' />";
	}
?>
		<script type="text/javascript">
			window.onload = function()
			{
				window.location="/";
			};
		</script>
	</head>
	<body></body>
</html>
