<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_admin
 *
<<<<<<< HEAD
 * @copyright   (C) 2006 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
JHtml::_('behavior.tabstate');

// No access check.

$controller = JControllerLegacy::getInstance('Admin');
$controller->execute(JFactory::getApplication()->input->get('task'));
$controller->redirect();
