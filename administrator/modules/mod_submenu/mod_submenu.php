<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  mod_submenu
 *
<<<<<<< HEAD
 * @copyright   (C) 2006 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$list    = JSubMenuHelper::getEntries();
$filters = JSubMenuHelper::getFilters();
$action  = JSubMenuHelper::getAction();

$displayMenu    = count($list);
$displayFilters = count($filters);

$hide = JFactory::getApplication()->input->getBool('hidemainmenu');

if ($displayMenu || $displayFilters)
{
	require JModuleHelper::getLayoutPath('mod_submenu', $params->get('layout', 'default'));
}
