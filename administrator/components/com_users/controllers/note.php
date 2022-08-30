<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_users
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
 * User note controller class.
 *
 * @since  2.5
 */
class UsersControllerNote extends JControllerForm
{
	/**
	 * The prefix to use with controller messages.
	 *
	 * @var    string
	 * @since  2.5
	 */
	protected $text_prefix = 'COM_USERS_NOTE';

	/**
	 * Gets the URL arguments to append to an item redirect.
	 *
	 * @param   integer  $recordId  The primary key id for the item.
	 * @param   string   $key       The name of the primary key variable.
	 *
	 * @return  string  The arguments to append to the redirect URL.
	 *
	 * @since   2.5
	 */
	protected function getRedirectToItemAppend($recordId = null, $key = 'id')
	{
		$append = parent::getRedirectToItemAppend($recordId, $key);

		$userId = JFactory::getApplication()->input->get('u_id', 0, 'int');

		if ($userId)
		{
			$append .= '&u_id=' . $userId;
		}

		return $append;
	}
}
