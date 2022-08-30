<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_finder
 *
<<<<<<< HEAD
 * @copyright   (C) 2011 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Link table class for the Finder package.
 *
 * @since  2.5
 */
class FinderTableLink extends JTable
{
	/**
	 * Constructor
	 *
	 * @param   JDatabaseDriver  $db  JDatabaseDriver connector object.
	 *
	 * @since   2.5
	 */
	public function __construct(&$db)
	{
		parent::__construct('#__finder_links', 'link_id', $db);
	}
}
