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


class com_jsocialfeedInstallerScript
{
	protected $component_name;
	protected $extension_name;
	protected $event;


	function install($parent)
	{
		$this->event = "install";
		$this->chain_install($parent);
		$this->logo($parent);
	}


	function uninstall($parent)
	{
		$this->event = "uninstall";
		$this->results = array();
		//$this->logo($parent);
	}


	function update($parent)
	{
		$this->event = "update";

		$this->chain_install($parent);
		$this->logo($parent);

		$db = JFactory::getDBO();

		// Fixes a Joomla bug, wich adds a second repository rather than overwrite the first one if they are different
		$query = "DELETE FROM `#__update_sites` WHERE `name` = '" . $this->extension_name . " update site';";
		$db->setQuery($query);
		$db->query();

		// Clear updates cache related to this extension
		$query = "DELETE FROM `#__updates` WHERE `name` = '" . $this->extension_name . "';";
		$db->setQuery($query);
		$db->query();

	}


	function preflight($type, $parent)
	{
		$this->component_name = $parent->get("element");
		$this->extension_name = substr($this->component_name, 4);
	}


	function postflight($type, $parent)
	{
	}


	private function chain_install(&$parent)
	{
		$manifest = $parent->get("manifest");
		if (!isset($manifest->chain->extension)) return;

		$result = array();
		foreach($manifest->chain->extension as $extension)
		{
			// We absolutely need to create a new installer instance each cycle,
			// otherwise the first failing extension would roll-back previuosly installed extensions.
			// Note that the library is the first in install chain and it contains the language files.
			$installer = new JInstaller();

			$attributes = $extension->attributes();
			$item = $parent->getParent()->getPath("source") . '/' . $attributes["directory"] . '/' . $attributes["name"];
			$result["type"] = (string)$attributes["type"];
			$result["result"] = $installer->install($item) ? "INSTALLED" : "NOT_INSTALLED";
			$this->results[(string)$attributes["name"]] = $result;
		}
		// If Installscript is running, the component is already installed
		$result["type"] = "COMPONENT";
		$result["result"] = "INSTALLED";
		$this->results[$this->component_name] = $result;

		// Language files are installed within the library
		$result["type"] = "LANGUAGES";
		$result["result"] = $this->results["lib_" . $this->extension_name]["result"];
		$this->results["lan_" . $this->extension_name] = $result;

		if ($this->event=='install'){
			$params=array();
			$params["rss_atom_url1"]="http://www.fifa.com/newscentre/news/rss.xml";
			$params["rss_atom_url2"]="http://community.joomla.org/blogs/community.feed?type=rss";

			$table = JTable::getInstance('Module');
			if ($table->load(array('module'=> 'mod_jsocialfeed'))) {
				$dbParameter = new JRegistry;
				$dbParameter->loadString($table->params);
				
				$parameter = new JRegistry;
				$parameter->loadArray($params);
				
				$parameter->merge($dbParameter);
				
				$table->params = (string)$parameter;				
				
				if (!$table->store()) {
					//echo $table->getError().'<br />';
					//return;
				}
			}		
		}
	}


	private function logo(&$parent)
	{
		JFactory::getLanguage()->load($this->extension_name . ".admin", JPATH_ROOT . "/libraries/" . $this->extension_name);
		$manifest = $parent->get("manifest");
		echo(
		'<style type="text/css">' .
		'@import url("' . JURI::base(true) . "/components/" . $this->component_name . "/css/install.css" . '");' .
		'</style>' .
		'<img ' .
		'class="install_logo" width="128" height="128" ' .
		'src="' . (string)$manifest->authorUrl . 'logo/' . $this->extension_name . "-" . $this->event . '-logo.jpg" ' .
		'alt="' . JText::_((string)$manifest->name) . ' Logo" ' .
		'/>' .
		'<div class="install_container">' .
		'<div class="install_row">' .
		'<h2 class="install_title">' . JText::_((string)$manifest->name) . '</h2>' .
		'</div>');

		foreach ($this->results as $name => $extension)
		{
			echo(
			'<div class="install_row">' .
			'<div class="install_' . strtolower($extension["type"]) . ' install_icon">' . JText::_(strtoupper($this->extension_name) . "_" . $extension["type"]) . '</div>' .
			'<div class="install_' . strtolower($extension["result"]) . ' install_icon">' . JText::_(strtoupper($this->extension_name) . "_" . $extension["result"]) . '</div>' .
			'</div>'
			);

		}
		echo('</div>');
	}

}

