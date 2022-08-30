<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  mod_sampledata
 *
<<<<<<< HEAD
 * @copyright   (C) 2017 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Helper for mod_sampledata
 *
 * @since  3.8.0
 */
abstract class ModSampledataHelper
{
	/**
	 * Get a list of sampledata.
	 *
	 * @return  mixed  An array of sampledata, or false on error.
	 *
	 * @since  3.8.0
	 */
	public static function getList()
	{
		JPluginHelper::importPlugin('sampledata');
		$dispatcher = JEventDispatcher::getInstance();
		$data = $dispatcher->trigger('onSampledataGetOverview', array('test', 'foo'));

		return $data;
	}
}
