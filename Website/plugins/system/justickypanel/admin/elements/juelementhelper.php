<?php
/**
 * ------------------------------------------------------------------------
 * JU Backend Toolkit for Joomla 2.5/3.x
 * ------------------------------------------------------------------------
 * Copyright (C) 2010-2013 JoomUltra. All Rights Reserved.
 * @license - GNU/GPL, http://www.gnu.org/licenses/gpl.html
 * Author: JoomUltra Co., Ltd
 * Websites: http://www.joomultra.com
 * ------------------------------------------------------------------------
 */

// no direct access
defined('_JEXEC') or die ;
class JUElementHelper
{
	/**
	* Return module name
	*/
	public static function getModuleName() {
		$path = dirname(dirname(dirname(__FILE__)));
		return basename ($path);
	}
	
	 /**
	 * Get tamplate actived current
	 * @return string template name
	 */
	public static function getActiveTemplate() {
		$db = JFactory::getDBO();

		// Get the current default template
		$query = ' SELECT template '
				.' FROM #__template_styles '
				.' WHERE client_id = 0'
				.' AND home = 1 ';
		$db->setQuery($query);
		$template = $db->loadResult();

		return $template;
	}
}
?>