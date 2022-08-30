<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_tags
 *
<<<<<<< HEAD
 * @copyright   (C) 2013 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

JLoader::register('TagsHelperRoute', JPATH_COMPONENT . '/helpers/route.php');

$controller = JControllerLegacy::getInstance('Tags');
$controller->execute(JFactory::getApplication()->input->get('task'));
$controller->redirect();
