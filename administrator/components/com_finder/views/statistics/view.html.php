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
 * Statistics view class for Finder.
 *
 * @since  2.5
 */
class FinderViewStatistics extends JViewLegacy
{
	/**
	 * The index statistics
	 *
	 * @var  JObject
	 *
	 * @since  3.6.1
	 */
	protected $data;

	/**
	 * Method to display the view.
	 *
	 * @param   string  $tpl  A template file to load. [optional]
	 *
	 * @return  mixed  A string if successful, otherwise a JError object.
	 *
	 * @since   2.5
	 */
	public function display($tpl = null)
	{
		// Load the view data.
		$this->data = $this->get('Data');

		// Check for errors.
		if (count($errors = $this->get('Errors')))
		{
			throw new Exception(implode("\n", $errors), 500);
		}

		return parent::display($tpl);
	}
}
