<?php
/**
 * @package     Joomla.Plugin
 * @subpackage  Fields.Repeatable
 *
<<<<<<< HEAD
 * @copyright   (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$fieldValue = $field->value;

if ($fieldValue === '')
{
	return;
}

// Get the values
$fieldValues = json_decode($fieldValue, true);

if (empty($fieldValues))
{
	return;
}

$html = '<ul>';

foreach ($fieldValues as $value)
{
	$html .= '<li>' . implode(', ', $value) . '</li>';
}

$html .= '</ul>';

echo $html;
