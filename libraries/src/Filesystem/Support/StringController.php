<?php
/**
 * Joomla! Content Management System
 *
<<<<<<< HEAD:libraries/src/Filesystem/Support/StringController.php
 * @copyright  (C) 2008 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090:libraries/joomla/filesystem/support/stringcontroller.php
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\CMS\Filesystem\Support;

defined('JPATH_PLATFORM') or die;

/**
 * String Controller
 *
 * @since  1.7.0
 */
class StringController
{
	/**
	 * Defines a variable as an array
	 *
	 * @return  array
	 *
	 * @since   1.7.0
	 */
	public function _getArray()
	{
		static $strings = array();

		return $strings;
	}

	/**
	 * Create a reference
	 *
	 * @param   string  $reference  The key
	 * @param   string  &$string    The value
	 *
	 * @return  void
	 *
	 * @since   1.7.0
	 */
	public function createRef($reference, &$string)
	{
		$ref = &self::_getArray();
		$ref[$reference] = & $string;
	}

	/**
	 * Get reference
	 *
	 * @param   string  $reference  The key for the reference.
	 *
	 * @return  mixed  False if not set, reference if it exists
	 *
	 * @since   1.7.0
	 */
	public function getRef($reference)
	{
		$ref = &self::_getArray();

		if (isset($ref[$reference]))
		{
			return $ref[$reference];
		}
		else
		{
			return false;
		}
	}
}
