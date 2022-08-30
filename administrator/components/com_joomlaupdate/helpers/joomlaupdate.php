<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_joomlaupdate
 *
<<<<<<< HEAD
 * @copyright   (C) 2012 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Joomla! update helper.
 *
 * @since  2.5.4
 */
class JoomlaupdateHelper
{
	/**
	 * Gets a list of the actions that can be performed.
	 *
	 * @return  JObject
	 *
	 * @since	2.5.4
	 * @deprecated  3.2  Use JHelperContent::getActions() instead
	 */
	public static function getActions()
	{
		// Log usage of deprecated function
		try
		{
			JLog::add(
				sprintf('%s() is deprecated. Use JHelperContent::getActions() with new arguments order instead.', __METHOD__),
				JLog::WARNING,
				'deprecated'
			);
		}
		catch (RuntimeException $exception)
		{
			// Informational log only
		}

		// Get list of actions
		return JHelperContent::getActions('com_joomlaupdate');
	}
}
