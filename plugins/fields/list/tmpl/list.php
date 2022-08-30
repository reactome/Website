<?php
/**
 * @package     Joomla.Plugin
 * @subpackage  Fields.List
 *
<<<<<<< HEAD
 * @copyright   (C) 2017 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

$fieldValue = $field->value;

if ($fieldValue == '')
{
	return;
}

$fieldValue = (array) $fieldValue;
$texts      = array();
$options    = $this->getOptionsFromField($field);

foreach ($options as $value => $name)
{
	if (in_array((string) $value, $fieldValue))
	{
		$texts[] = JText::_($name);
	}
}


echo htmlentities(implode(', ', $texts));
