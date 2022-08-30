<?php
/**
 * Joomla! Content Management System
 *
<<<<<<< HEAD
 * @copyright  (C) 2017 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\CMS\Form\Field;

defined('JPATH_PLATFORM') or die;

use Joomla\CMS\Form\FormHelper;

FormHelper::loadFieldClass('predefinedlist');

/**
 * Plugin Status field.
 *
 * @since  3.5
 */
class PluginstatusField extends \JFormFieldPredefinedList
{
	/**
	 * The form field type.
	 *
	 * @var    string
	 * @since  3.5
	 */
	public $type = 'Plugin_Status';

	/**
	 * Available statuses
	 *
	 * @var  array
	 * @since  3.5
	 */
	protected $predefinedOptions = array(
		'0'  => 'JDISABLED',
		'1'  => 'JENABLED',
	);
}
