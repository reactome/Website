<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_random_image
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
<div class="random-image<?php echo $moduleclass_sfx; ?>">
<?php if ($link) : ?>
<a href="<?php echo htmlspecialchars($link, ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
	<?php echo JHtml::_('image', $image->folder . '/' . htmlspecialchars($image->name, ENT_COMPAT, 'UTF-8'), htmlspecialchars($image->name, ENT_COMPAT, 'UTF-8'), array('width' => $image->width, 'height' => $image->height)); ?>
<?php if ($link) : ?>
</a>
<?php endif; ?>
</div>
