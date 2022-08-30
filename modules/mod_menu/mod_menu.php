<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_menu
 *
<<<<<<< HEAD
 * @copyright   (C) 2009 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Include the menu functions only once
JLoader::register('ModMenuHelper', __DIR__ . '/helper.php');

$list       = ModMenuHelper::getList($params);
$base       = ModMenuHelper::getBase($params);
$active     = ModMenuHelper::getActive($params);
$default    = ModMenuHelper::getDefault();
$active_id  = $active->id;
$default_id = $default->id;
$path       = $base->tree;
$showAll    = $params->get('showAllChildren', 1);
<<<<<<< HEAD
$class_sfx  = htmlspecialchars($params->get('class_sfx', ''), ENT_COMPAT, 'UTF-8');
=======
$class_sfx  = htmlspecialchars($params->get('class_sfx'), ENT_COMPAT, 'UTF-8');
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090

if (count($list))
{
	require JModuleHelper::getLayoutPath('mod_menu', $params->get('layout', 'default'));
}
