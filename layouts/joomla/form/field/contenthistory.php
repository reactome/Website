<?php
/**
 * @package     Joomla.Site
 * @subpackage  Layout
 *
<<<<<<< HEAD
 * @copyright   (C) 2015 Open Source Matters, Inc. <https://www.joomla.org>
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
 * @var  string   $item The item id number
 * @var  string   $link The link text
 * @var  string   $label The label text
 */
extract($displayData);

JHtml::_('behavior.modal', 'button.modal_' . $item);
?>
<button class="btn modal_<?php echo $item; ?>" title="<?php echo $label; ?>" href="<?php echo $link; ?>" rel="{handler: 'iframe', size: {x: 800, y: 500}}">
	<span class="icon-archive" aria-hidden="true"></span><?php echo $label; ?>
</button>
