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

jimport('joomla.log.log');

abstract class SmartLoaderJSF
{
	abstract protected function type();
	abstract protected function http_headers();
	abstract protected function content_header();
	abstract protected function content_footer();


	public function Show()
	{
		$this->headers();
		$this->http_headers();
		$this->content_header();
		$this->load();
		$this->content_footer();

		//die();
		JFactory::getApplication()->close();
	}


	private function headers()
	{
		// Prepare some useful headers
		header("Expires: " . gmdate("D, d M Y H:i:s") . " GMT");
		header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
		// must not be cached by the client browser or any proxy
		header("Cache-Control: no-store, no-cache, must-revalidate");
		header("Cache-Control: post-check=0, pre-check=0", false);
		header("Pragma: no-cache");
	}


	protected function load()
	{
		// Complete the script name with its path
		$filename = JRequest::getVar("filename", "", "GET");
		// Only admit lowercase a-z, underscore and minus. Forbid numbers, symbols, slashes and other stuff.
		// For your security, *don't* touch the following regular expression.
		preg_match('/^[a-z_-]+$/', $filename) or $filename = "invalid";
		
		
		if (!in_array($filename,array('jsocialfeed'))){
			die("smartloader wrong filename");
		}
		
		$local_name = realpath(dirname(__FILE__) . "/../" . $this->type() . "/" . $filename . ".php");

		require $local_name;
	}

}


class jsSmartLoaderJSF extends SmartLoaderJSF
{
	protected function type()
	{
		return "js";
	}

	protected function http_headers()
	{
		header('content-type: application/javascript');
	}

	protected function content_header()
	{
		echo "//<![CDATA[\n";
	}

	protected function content_footer()
	{
		echo "\n//]]>";
	}

}


class cssSmartLoaderJSF extends SmartLoaderJSF
{
	protected function type()
	{
		return "css";
	}

	protected function http_headers()
	{
		header('content-type: text/css');
	}

	protected function content_header()
	{
		echo "/* css generator begin */\n";
	}

	protected function content_footer()
	{
		echo "\n/* css generator end */";
	}
}


class jsonSmartLoaderJSF extends SmartLoaderJSF
{
	protected function type()
	{
		return "json";
	}

	protected function http_headers()
	{
		header('content-type: application/javascript');
		//header('content-type: application/json');
	}

	protected function content_header()
	{
		echo "var jsf_data_" . JRequest::getVar("mod_owner", "", "GET") . "_" . intval(JRequest::getVar("mod_id", 0, "GET")) . "={\n";
	}

	protected function content_footer()
	{
		echo "\n}";
	}
}

