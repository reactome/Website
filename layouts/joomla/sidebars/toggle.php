<?php
/**
 * @package     Joomla.Site
 * @subpackage  Layout
 *
<<<<<<< HEAD
 * @copyright   (C) 2014 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Set the tooltips
JText::script('JTOGGLE_HIDE_SIDEBAR');
JText::script('JTOGGLE_SHOW_SIDEBAR');
?>
<div
	id="j-toggle-sidebar-button"
	class="j-toggle-sidebar-button hidden-phone hasTooltip"
	onclick="toggleSidebar(false); return false;"
	>
		<span id="j-toggle-sidebar-icon" class="icon-arrow-left-2" aria-hidden="true"></span>
</div>
