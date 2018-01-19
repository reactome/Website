<?php defined("_JEXEC") or die("Restricted access");

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

jimport("joomla.application.component.view");

class JSocialFeedViewSmartLoader extends JViewLegacy
{
	function display($tpl = null)
	{
		//		parent::display($tpl);

		// Load module || component || plugin parameters. Defaults to module
		$owner = JRequest::getVar("mod_owner", "", "GET");
		
		if (!in_array($owner,array('module'))){
			die("smartloader wrong owner");
		}

		$db = JFactory::getDbo();
		jimport("joomla.database.databasequery");
		$query = $db->getQuery(true);
		$this->$owner($query);
		$db->setQuery($query);

		// Load parameters from database
		$json = $db->loadResult();
		// Convert to JRegistry
		$params = new JRegistry($json);
		// $params = $params->toArray();

		// Import appropriate library
		jimport("jsocialfeed.smartloader.smartloader") or die("smartloader library not found");
		// Type could be css, js or markers
		$type = JRequest::getVar("type", "", "GET");
		
		if (!in_array($type,array('js','css','json'))){
			die("smartloader wrong type");
		}
		
		// Instantiate the loader
		$classname = $type . "SmartLoaderJSF";
		$loader = new $classname();
		$loader->Params = &$params;
		$loader->Show();
	}


	private function module(&$query)
	{
		$query->select('`params`');
		$query->from('`#__modules`');
		$query->where("`id` = " . intval(JRequest::getVar("mod_id", 0, "GET")));
		$query->where("`module` = 'mod_jsocialfeed'");
	}


	private function plugin(&$query)
	{
		$query->select("`params`");
		$query->from("`#__extensions`");
		$query->where("`element` = 'jsocialfeed'");
		$query->where("`client_id` = 0");
		$query->where("`type` = 'plugin'");
	}


	private function component(&$query)
	{
	}


	private function article(&$query)
	{
		$query->select('`metadata`');
		$query->from('`#__content`');
		$query->where("`id` = " . intval(JRequest::getVar("mod_id", 0, "GET")));
	}

}
