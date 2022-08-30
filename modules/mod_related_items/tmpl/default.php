<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_related_items
 *
<<<<<<< HEAD
 * @copyright   (C) 2006 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
?>
<ul class="relateditems<?php echo $moduleclass_sfx; ?> mod-list">
<?php foreach ($list as $item) : ?>
<li>
	<a href="<?php echo $item->route; ?>">
		<?php if ($showDate) echo JHtml::_('date', $item->created, JText::_('DATE_FORMAT_LC4')) . ' - '; ?>
		<?php echo $item->title; ?></a>
</li>
<?php endforeach; ?>
</ul>
