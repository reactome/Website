<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  mod_sampledata
 *
<<<<<<< HEAD
 * @copyright   (C) 2017 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Include dependencies.
JLoader::register('ModSampledataHelper', __DIR__ . '/helper.php');

$items = ModSampledataHelper::getList();

// Filter out empty entries
$items = array_filter($items);

require JModuleHelper::getLayoutPath('mod_sampledata', $params->get('layout', 'default'));
