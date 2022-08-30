<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_login
 *
<<<<<<< HEAD
 * @copyright   (C) 2005 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$input = JFactory::getApplication()->input;
$task = $input->get('task');

if ($task != 'login' && $task != 'logout')
{
	$input->set('task', '');
	$task = '';
}

$controller = JControllerLegacy::getInstance('Login');
$controller->execute($task);
$controller->redirect();
