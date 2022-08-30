<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_syndicate
 *
<<<<<<< HEAD
 * @copyright   (C) 2006 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Include the syndicate functions only once
JLoader::register('ModSyndicateHelper', __DIR__ . '/helper.php');

$params->def('format', 'rss');

$link = ModSyndicateHelper::getLink($params);

if ($link === null)
{
	return;
}

$moduleclass_sfx = htmlspecialchars($params->get('moduleclass_sfx', ''), ENT_COMPAT, 'UTF-8');
$text            = htmlspecialchars($params->get('text', ''), ENT_COMPAT, 'UTF-8');

require JModuleHelper::getLayoutPath('mod_syndicate', $params->get('layout', 'default'));
