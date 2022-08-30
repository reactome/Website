<?php
/**
 * @package     Joomla.Libraries
 * @subpackage  HTML
 *
<<<<<<< HEAD
 * @copyright   (C) 2016 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Layout variables
 * ---------------------
 *
 * @var  integer  $level  The level of the item in the tree like structure.
 *
 * @since  3.6.0
 */

extract($displayData);

if ($level > 1)
{
	echo '<span class="muted">' . str_repeat('&#9482;&nbsp;&nbsp;&nbsp;', (int) $level - 2) . '</span>&ndash;&nbsp;';
}
