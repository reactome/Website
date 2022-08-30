<?php
/**
 * @package     Joomla.Plugin
 * @subpackage  Fields.URL
 *
<<<<<<< HEAD
 * @copyright   (C) 2016 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

$value = $field->value;

if ($value == '')
{
	return;
}

$attributes = '';

if (!JUri::isInternal($value))
{
	$attributes = ' rel="nofollow noopener noreferrer" target="_blank"';
}

echo sprintf('<a href="%s"%s>%s</a>',
	htmlspecialchars($value),
	$attributes,
	htmlspecialchars($value)
);
