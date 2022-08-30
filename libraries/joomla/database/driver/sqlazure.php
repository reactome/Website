<?php
/**
 * @package     Joomla.Platform
 * @subpackage  Database
 *
<<<<<<< HEAD
 * @copyright   (C) 2011 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('JPATH_PLATFORM') or die;

/**
 * SQL Server database driver
 *
 * @link   https://azure.microsoft.com/en-us/documentation/services/sql-database/
 * @since  3.0.0
 */
class JDatabaseDriverSqlazure extends JDatabaseDriverSqlsrv
{
	/**
	 * The name of the database driver.
	 *
	 * @var    string
	 * @since  3.0.0
	 */
	public $name = 'sqlazure';
}
