<?php
/**
 * @package     Joomla.Plugin
 * @subpackage  Fields.Usergrouplist
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

JLoader::register('UsersHelper', JPATH_ADMINISTRATOR . '/components/com_users/helpers/users.php');

$value  = (array) $value;
$texts  = array();
$groups = UsersHelper::getGroups();

foreach ($groups as $group)
{
	if (in_array($group->value, $value))
	{
		$texts[] = htmlentities(trim($group->text, '- '));
	}
}

echo htmlentities(implode(', ', $texts));
