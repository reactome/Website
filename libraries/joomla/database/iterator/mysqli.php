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
 * MySQLi database iterator.
 *
 * @since  3.0.0
 */
class JDatabaseIteratorMysqli extends JDatabaseIterator
{
	/**
	 * Get the number of rows in the result set for the executed SQL given by the cursor.
	 *
	 * @return  integer  The number of rows in the result set.
	 *
	 * @since   3.0.0
	 * @see     Countable::count()
	 */
	public function count()
	{
		return mysqli_num_rows($this->cursor);
	}

	/**
	 * Method to fetch a row from the result set cursor as an object.
	 *
	 * @return  mixed   Either the next row from the result set or false if there are no more rows.
	 *
	 * @since   3.0.0
	 */
	protected function fetchObject()
	{
		return mysqli_fetch_object($this->cursor, $this->class);
	}

	/**
	 * Method to free up the memory used for the result set.
	 *
	 * @return  void
	 *
	 * @since   3.0.0
	 */
	protected function freeResult()
	{
		mysqli_free_result($this->cursor);
	}
}
