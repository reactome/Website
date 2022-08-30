<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_random_image
 *
<<<<<<< HEAD
 * @copyright   (C) 2005 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Include the random image functions only once
JLoader::register('ModRandomImageHelper', __DIR__ . '/helper.php');

$link   = $params->get('link');
$folder = ModRandomImageHelper::getFolder($params);
$images = ModRandomImageHelper::getImages($params, $folder);

if (!count($images))
{
	echo JText::_('MOD_RANDOM_IMAGE_NO_IMAGES');

	return;
}

$image           = ModRandomImageHelper::getRandomImage($params, $images);
$moduleclass_sfx = htmlspecialchars($params->get('moduleclass_sfx', ''), ENT_COMPAT, 'UTF-8');

require JModuleHelper::getLayoutPath('mod_random_image', $params->get('layout', 'default'));
