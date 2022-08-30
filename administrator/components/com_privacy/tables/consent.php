<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_privacy
 *
<<<<<<< HEAD
 * @copyright   (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Table interface class for the #__privacy_consents table
 *
 * @property   integer  $id       Item ID (primary key)
 * @property   integer  $remind   The status of the reminder request
 * @property   string   $token    Hashed token for the reminder request
 * @property   integer  $user_id  User ID (pseudo foreign key to the #__users table) if the request is associated to a user account
 *
 * @since  3.9.0
 */
class PrivacyTableConsent extends JTable
{
	/**
	 * The class constructor.
	 *
	 * @param   JDatabaseDriver  $db  JDatabaseDriver connector object.
	 *
	 * @since   3.9.0
	 */
	public function __construct(JDatabaseDriver $db)
	{
		parent::__construct('#__privacy_consents', 'id', $db);
	}

	/**
	 * Method to store a row in the database from the Table instance properties.
	 *
	 * @param   boolean  $updateNulls  True to update fields even if they are null.
	 *
	 * @return  boolean  True on success.
	 *
	 * @since   3.9.0
	 */
	public function store($updateNulls = false)
	{
		$date = JFactory::getDate();

		// Set default values for new records
		if (!$this->id)
		{
			if (!$this->remind)
			{
				$this->remind = '0';
			}

			if (!$this->created)
			{
				$this->created = $date->toSql();
			}
		}

		return parent::store($updateNulls);
	}
}
