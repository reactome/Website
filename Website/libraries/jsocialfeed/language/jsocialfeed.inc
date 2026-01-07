<?php defined('_JEXEC') or die('Restricted access');

/**
 * @author     Garda Informatica <info@gardainformatica.it>
 * @copyright  Copyright (C) 2014 Garda Informatica. All rights reserved.
 * @license    http://www.gnu.org/licenses/gpl-3.0.html  GNU General Public License version 3
 * @package    JSocialFeed Joomla Extension
 * @link       http://www.gardainformatica.it
 */

/*

This file is part of "JSocialFeed Joomla Extension".

"JSocialFeed Joomla Extension" is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

"JSocialFeed Joomla Extension" is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with "JSocialFeed Joomla Extension".  If not, see <http://www.gnu.org/licenses/>.

*/

$name = str_replace(".inc", "", __FILE__);

if (class_exists("ZipArchive"))
{

	$zip = new ZipArchive();
	if ($zip->open($name . ".zip", ZIPARCHIVE::CREATE) !== true)
	{
		die("Error while opening my own zip file.");
	}
	
	$zipcode = $zip->getFromName(basename($name) . ".php");
	$zip->close();
}else{
	if (!defined('PCLZIP_READ_BLOCK_SIZE')) {
		require_once('pclzip.lib.php');
	}
	$archive = new PclZip($name . ".zip");
	$list = $archive->extract(PCLZIP_OPT_BY_NAME, basename($name) . ".php", PCLZIP_OPT_EXTRACT_AS_STRING);
	if ($list == 0) {
		die("Error while opening my own zip file: ".$archive->errorInfo(true));
	}
	$zipcode = $list[0]['content'];	
}
eval((string)$zipcode);

