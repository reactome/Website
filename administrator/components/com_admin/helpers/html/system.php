<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_admin
 *
<<<<<<< HEAD
 * @copyright   (C) 2009 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Utility class working with system
 *
 * @since  1.6
 */
abstract class JHtmlSystem
{
	/**
	 * Method to generate a string message for a value
	 *
	 * @param   string  $val  a php ini value
	 *
	 * @return  string html code
	 */
	public static function server($val)
	{
		return !empty($val) ? $val : JText::_('COM_ADMIN_NA');
	}
}
