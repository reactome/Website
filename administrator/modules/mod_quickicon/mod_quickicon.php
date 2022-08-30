<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  mod_quickicon
 *
<<<<<<< HEAD
 * @copyright   (C) 2005 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

JLoader::register('ModQuickIconHelper', __DIR__ . '/helper.php');

$buttons = ModQuickIconHelper::getButtons($params);

require JModuleHelper::getLayoutPath('mod_quickicon', $params->get('layout', 'default'));
