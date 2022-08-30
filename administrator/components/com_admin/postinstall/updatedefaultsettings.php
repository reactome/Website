<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_admin
 *
<<<<<<< HEAD
 * @copyright   (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 *
 * This file contains post-installation message handling for notifying users of a change
 * in various default settings.
 */

defined('_JEXEC') or die;

/**
 * Notifies users of a change in various default settings
 *
 * This check returns true regardless of condition.
 *
 * @return  boolean
 *
 * @since   3.8.8
 */
function admin_postinstall_updatedefaultsettings_condition()
{
	return true;
}
