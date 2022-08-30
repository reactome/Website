<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_messages
 *
<<<<<<< HEAD
 * @copyright   (C) 2016 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

JLoader::register('MessagesHelper', JPATH_ADMINISTRATOR . '/components/com_messages/helpers/messages.php');

JFormHelper::loadFieldClass('list');

/**
 * Message States field.
 *
 * @since  3.6.0
 */
class JFormFieldMessageStates extends JFormFieldList
{
	/**
	 * The form field type.
	 *
	 * @var     string
	 * @since   3.6.0
	 */
	protected $type = 'MessageStates';

	/**
	 * Method to get the field options.
	 *
	 * @return  array  The field option objects.
	 *
	 * @since   3.6.0
	 */
	protected function getOptions()
	{
		// Merge state options with any additional options in the XML definition.
		return array_merge(parent::getOptions(), MessagesHelper::getStateOptions());
	}
}
