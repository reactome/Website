<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_templates
 *
<<<<<<< HEAD
 * @copyright   (C) 2015 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

JLoader::register('TemplatesHelper', JPATH_ADMINISTRATOR . '/components/com_templates/helpers/templates.php');

JFormHelper::loadFieldClass('list');

/**
 * Template Location field.
 *
 * @since  3.5
 */
class JFormFieldTemplateLocation extends JFormFieldList
{
	/**
	 * The form field type.
	 *
	 * @var	   string
	 * @since  3.5
	 */
	protected $type = 'TemplateLocation';

	/**
	 * Method to get the field options.
	 *
	 * @return  array  The field option objects.
	 *
	 * @since   3.5
	 */
	public function getOptions()
	{
		$options = TemplatesHelper::getClientOptions();

		return array_merge(parent::getOptions(), $options);
	}
}
