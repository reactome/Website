<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_admin
 *
<<<<<<< HEAD
 * @copyright   (C) 2015 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 *
 * This file contains post-installation message handling for the checking minimum PHP version support
 */

defined('_JEXEC') or die;

/**
 * Alerts the user we are collecting anonymous data as of Joomla 3.5.0.
 *
 * @return  boolean
 *
 * @since   3.5
 */
function admin_postinstall_statscollection_condition()
{
	return true;
}
