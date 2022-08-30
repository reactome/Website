<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  mod_menu
 *
<<<<<<< HEAD
 * @copyright   (C) 2009 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$doc       = JFactory::getDocument();
$direction = $doc->direction == 'rtl' ? 'pull-right' : '';
$class     = $enabled ? 'nav ' . $direction : 'nav disabled ' . $direction;

// Recurse through children of root node if they exist
$menuTree = $menu->getTree();
$root     = $menuTree->reset();

if ($root->hasChildren())
{
	echo '<ul id="menu" class="' . $class . '">' . "\n";

	// WARNING: Do not use direct 'include' or 'require' as it is important to isolate the scope for each call
	$menu->renderSubmenu(JModuleHelper::getLayoutPath('mod_menu', 'default_submenu'));

	echo "</ul>\n";

	echo '<ul id="nav-empty" class="dropdown-menu nav-empty hidden-phone"></ul>';

	if ($css = $menuTree->getCss())
	{
		$doc->addStyleDeclaration(implode("\n", $css));
	}
}
