<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_syndicate
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
<a href="<?php echo $link; ?>" class="syndicate-module<?php echo $moduleclass_sfx; ?>">
	<?php echo JHtml::_('image', 'system/livemarks.png', 'feed-image', null, true); ?>
	<?php if ($params->get('display_text', 1)) : ?>
		<span>
		<?php if (str_replace(' ', '', $text) !== '') : ?>
			<?php echo $text; ?>
		<?php else : ?>
			<?php echo JText::_('MOD_SYNDICATE_DEFAULT_FEED_ENTRIES'); ?>
		<?php endif; ?>
		</span>
	<?php endif; ?>
</a>
