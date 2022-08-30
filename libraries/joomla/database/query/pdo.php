<?php
/**
 * @package     Joomla.Platform
 * @subpackage  Database
 *
<<<<<<< HEAD
 * @copyright   (C) 2012 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('JPATH_PLATFORM') or die;

/**
 * PDO Query Building Class.
 *
 * @since  3.0.0
 */
class JDatabaseQueryPdo extends JDatabaseQuery
{
	/**
	 * Casts a value to a char.
	 *
	 * Ensure that the value is properly quoted before passing to the method.
	 *
	 * Usage:
	 * $query->select($query->castAsChar('a'));
	 * $query->select($query->castAsChar('a', 40));
	 *
	 * @param   string  $value  The value to cast as a char.
	 *
	 * @param   string  $len    The length of the char.
	 *
	 * @return  string  Returns the cast value.
	 *
	 * @since   1.7.0
	 */
	public function castAsChar($value, $len = null)
	{
		if (!$len)
		{
			return $value;
		}
		else
		{
			return ' CAST(' . $value . ' AS CHAR(' . $len . '))';
		}
	}
}
