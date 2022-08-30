<?php
/**
 * @package     Joomla.Plugin
 * @subpackage  Fields.Radio
 *
<<<<<<< HEAD
 * @copyright   (C) 2017 Open Source Matters, Inc. <https://www.joomla.org>
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

$value   = (array) $value;
$texts   = array();
$options = $this->getOptionsFromField($field);

foreach ($options as $optionValue => $optionText)
{
	if (in_array((string) $optionValue, $value))
	{
		$texts[] = JText::_($optionText);
	}
}


echo htmlentities(implode(', ', $texts));
