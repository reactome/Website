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

/**
 * $text  string  infotext to be displayed
 */
extract($displayData);

// Closing the opening .control-group and .control-label div so we can add our info text on own line ?>
</div></div>
<div class="controls"><?php echo $text; ?></div>
<?php // Creating new .control-group and .control-label for the actual field ?>
<div class="control-group"><div class="control-label">
