<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_newsfeeds
 *
<<<<<<< HEAD
 * @copyright   (C) 2005 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

JLoader::register('NewsfeedsHelperRoute', JPATH_COMPONENT . '/helpers/route.php');
JTable::addIncludePath(JPATH_COMPONENT_ADMINISTRATOR . '/tables');

$controller = JControllerLegacy::getInstance('Newsfeeds');
$controller->execute(JFactory::getApplication()->input->get('task'));
$controller->redirect();
