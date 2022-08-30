<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  mod_menu
 *
<<<<<<< HEAD
 * @copyright   (C) 2006 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\Registry\Registry;

// Include the module helper classes.
JLoader::register('MenusHelper', JPATH_ADMINISTRATOR . '/components/com_menus/helpers/menus.php');
JLoader::register('ModMenuHelper', __DIR__ . '/helper.php');
JLoader::register('JAdminCssMenu', __DIR__ . '/menu.php');

/** @var  Registry  $params */
$lang    = JFactory::getLanguage();
$user    = JFactory::getUser();
$input   = JFactory::getApplication()->input;
$enabled = !$input->getBool('hidemainmenu');

$menu = new JAdminCssMenu($user);
$menu->load($params, $enabled);

// Render the module layout
require JModuleHelper::getLayoutPath('mod_menu', $params->get('layout', 'default'));
