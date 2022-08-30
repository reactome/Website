<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_fields
 *
<<<<<<< HEAD
 * @copyright   (C) 2016 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

/**
 * Fields list controller class.
 *
 * @since  3.7.0
 */
class FieldsControllerFields extends JControllerAdmin
{
	/**
	 * The prefix to use with controller messages.
	 *
	 * @var    string
	 *
	 * @since   3.7.0
	 */
	protected $text_prefix = 'COM_FIELDS_FIELD';

	/**
	 * Proxy for getModel.
	 *
	 * @param   string  $name    The model name. Optional.
	 * @param   string  $prefix  The class prefix. Optional.
	 * @param   array   $config  The array of possible config values. Optional.
	 *
	 * @return  FieldsModelField|boolean
	 *
	 * @since   3.7.0
	 */
	public function getModel($name = 'Field', $prefix = 'FieldsModel', $config = array('ignore_request' => true))
	{
		return parent::getModel($name, $prefix, $config);
	}
}
