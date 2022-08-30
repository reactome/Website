<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_categories
 *
<<<<<<< HEAD
 * @copyright   (C) 2005 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
JHtml::_('behavior.tabstate');

$input = JFactory::getApplication()->input;

// If you have a URL like this: com_categories&view=categories&extension=com_example.example_cat
$parts = explode('.', $input->get('extension'));
$component = $parts[0];

if (!JFactory::getUser()->authorise('core.manage', $component))
{
	throw new JAccessExceptionNotallowed(JText::_('JERROR_ALERTNOAUTHOR'), 403);
}

JLoader::register('JHtmlCategoriesAdministrator', JPATH_ADMINISTRATOR . '/components/com_categories/helpers/html/categoriesadministrator.php');

$controller = JControllerLegacy::getInstance('Categories');
$controller->execute($input->get('task'));
$controller->redirect();
