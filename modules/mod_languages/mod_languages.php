<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_languages
 *
<<<<<<< HEAD
 * @copyright   (C) 2010 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Include the languages functions only once
JLoader::register('ModLanguagesHelper', __DIR__ . '/helper.php');

$headerText      = $params->get('header_text');
$footerText      = $params->get('footer_text');
$list            = ModLanguagesHelper::getList($params);
$moduleclass_sfx = htmlspecialchars($params->get('moduleclass_sfx', ''), ENT_COMPAT, 'UTF-8');

require JModuleHelper::getLayoutPath('mod_languages', $params->get('layout', 'default'));
