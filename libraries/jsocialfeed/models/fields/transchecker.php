<?php defined('JPATH_PLATFORM') or die();
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


jimport('joomla.form.formfield');

class JFormFieldTranschecker extends JFormField
	{
	protected $type = 'Transchecker';

	protected function getInput()
		{
		return "";
		}

	protected function getLabel()
		{
		$lang = JFactory::getLanguage();

		$name = basename(realpath(dirname(__FILE__) . "/../.."));
		$direction = intval($lang->get("rtl", 0));
		$left  = $direction ? "right" : "left";
		$right = $direction ? "left" : "right";
		$image = '<img style="margin:0; float:' . $left . ';" src="' . JURI::base() . '../media/' . $name . '/images/translations.png">';
		// ff8080
		$style = 'background:#ffffcc; border:1px solid silver; padding:5px; margin:5px 0;';
		$msg_skel =
			'<div style="' . $style . '">' .
			$image .
			'<span style="padding-' . $left . ':5px; line-height:16px;">' .
			'Language files for %s language are still %s. If you want to collaborate in the translation, please send an email to info@gardainformatica.it' .
			'</span>' .
			'</div>';
		//GID


		if (intval(JText::_(strtoupper($name) . '_PARTIAL')))
			{
			return sprintf($msg_skel, $lang->get("name"), "incomplete");
			}

		if (!file_exists(JPATH_ROOT . "/libraries/" . $name . "/language/" . $lang->get("tag")))
			{
			return sprintf($msg_skel, $lang->get("name"), "missing");
			}

		return "";
		}
	}