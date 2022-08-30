<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_articles_archive
 *
<<<<<<< HEAD
 * @copyright   (C) 2005 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Include the archive functions only once
JLoader::register('ModArchiveHelper', __DIR__ . '/helper.php');

$params->def('count', 10);
$moduleclass_sfx = htmlspecialchars($params->get('moduleclass_sfx', ''), ENT_COMPAT, 'UTF-8');
$list            = ModArchiveHelper::getList($params);

require JModuleHelper::getLayoutPath('mod_articles_archive', $params->get('layout', 'default'));
