<?php
/**
 * @package     Joomla.Plugin
 * @subpackage  Fields.User
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

$value = (array) $value;
$texts = array();

foreach ($value as $userId)
{
	if (!$userId)
	{
		continue;
	}

	$user = JFactory::getUser($userId);

	if ($user)
	{
		// Use the Username
		$texts[] = $user->name;
		continue;
	}

	// Fallback and add the User ID if we get no JUser Object
	$texts[] = $userId;
}

echo htmlentities(implode(', ', $texts));
