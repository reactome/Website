<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_breadcrumbs
 *
<<<<<<< HEAD
 * @copyright   (C) 2005 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Include the breadcrumbs functions only once
JLoader::register('ModBreadCrumbsHelper', __DIR__ . '/helper.php');

// Get the breadcrumbs
$list  = ModBreadCrumbsHelper::getList($params);
$count = count($list);

// Set the default separator
$separator = ModBreadCrumbsHelper::setSeparator($params->get('separator'));
$moduleclass_sfx = htmlspecialchars($params->get('moduleclass_sfx', ''), ENT_COMPAT, 'UTF-8');

require JModuleHelper::getLayoutPath('mod_breadcrumbs', $params->get('layout', 'default'));
