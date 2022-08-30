<?php
/**
 * @package    Joomla.Administrator
 *
<<<<<<< HEAD
 * @copyright  (C) 2007 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Joomla! Administrator Application helper class.
 * Provide many supporting API functions.
 *
 * @since       1.5
 *
 * @deprecated  4.0 Deprecated without replacement
 */
class JAdministratorHelper
{
	/**
	 * Return the application option string [main component].
	 *
	 * @return  string  The component to access.
	 *
	 * @since   1.5
	 */
	public static function findOption()
	{
		$app = JFactory::getApplication();
		$option = strtolower($app->input->get('option'));

		$app->loadIdentity();
		$user = $app->getIdentity();

		if ($user->get('guest') || !$user->authorise('core.login.admin'))
		{
			$option = 'com_login';
		}

		if (empty($option))
		{
			$option = 'com_cpanel';
		}

		$app->input->set('option', $option);

		return $option;
	}
}
