<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_menus
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
 * Menu table
 *
 * @since  1.6
 */
class MenusTableMenu extends JTableMenu
{
	/**
	 * Method to delete a node and, optionally, its child nodes from the table.
	 *
	 * @param   integer  $pk        The primary key of the node to delete.
	 * @param   boolean  $children  True to delete child nodes, false to move them up a level.
	 *
	 * @return  boolean  True on success.
	 *
	 * @since   2.5
	 */
	public function delete($pk = null, $children = false)
	{
		$return = parent::delete($pk, $children);

		if ($return)
		{
			// Delete key from the #__modules_menu table
			$db = JFactory::getDbo();
			$query = $db->getQuery(true)
				->delete($db->quoteName('#__modules_menu'))
				->where($db->quoteName('menuid') . ' = ' . $pk);
			$db->setQuery($query);
			$db->execute();
		}

		return $return;
	}
}
