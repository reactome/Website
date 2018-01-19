<?php

defined('_JEXEC') or die;

$base_dir = dirname(__FILE__);

// Library path, where svg, xml, png reside.
$ehld_main_folder = "ehld-icons";
$ehld_dir_full_path = JPATH_BASE . '/' . $ehld_main_folder . '/lib';

$path = $_GET["d"];

// Something has to be requested and '../' are not allowed to avoid directory traversal attack
if (($path == '') || (strpos($path, '../') !== false)) exit('Invalid Request');

$filename            = basename($path);
$attachment_location = $ehld_dir_full_path. "/" . $path;

if (file_exists($attachment_location))
{
	$contentType = "application/svg";
	$file_parts  = pathinfo($attachment_location);

	if ($file_parts['extension'] == "png")
	{
		$contentType = "image/png";
	}
	else if ($file_parts['extension'] == "emf")
	{
		$contentType = "application/emf";
	}

	header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
	header("Cache-Control: public"); // needed for internet explorer
	header("Last-Modified: " . gmdate("D, d M Y H:i:s", filemtime($attachment_location)) . " GMT");
	header("Accept-Ranges: bytes");  // For download resume
	header("Content-Type: " . $contentType);
	header("Content-Encoding: none");
	header("Content-Transfer-Encoding: Binary");
	header("Content-Length:" . filesize($attachment_location));
	header("Content-Disposition: attachment; filename=" . $filename);

	ob_clean();
	flush();
	readfile($attachment_location);
	exit;
}
else
{
	die("Error: File not found.");
}
?>
