<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_menus
 *
<<<<<<< HEAD
 * @copyright   (C) 2016 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Load the required admin language files
$lang   = JFactory::getLanguage();
$app    = JFactory::getApplication();

if ($app->input->get('view') === 'items' && $app->input->get('layout') === 'modal')
{
	if (!JFactory::getUser()->authorise('core.create', 'com_menus'))
	{
		$app->enqueueMessage(JText::_('JERROR_ALERTNOAUTHOR'), 'warning');

		return;
	}
}

$lang->load('com_menus', JPATH_ADMINISTRATOR);

// Trigger the controller
$controller = JControllerLegacy::getInstance('Menus');
$controller->execute($app->input->get('task'));
$controller->redirect();
