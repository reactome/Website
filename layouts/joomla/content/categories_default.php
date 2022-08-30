<?php
/**
 * @package     Joomla.Site
 * @subpackage  Layout
 *
<<<<<<< HEAD
 * @copyright   (C) 2013 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

?>
<?php if ($displayData->params->get('show_page_heading')) : ?>
<h1>
	<?php echo $displayData->escape($displayData->params->get('page_heading')); ?>
</h1>
<?php endif; ?>

<?php if ($displayData->params->get('show_base_description')) : ?>
	<?php // If there is a description in the menu parameters use that; ?>
	<?php if ($displayData->params->get('categories_description')) : ?>
		<div class="category-desc base-desc">
			<?php echo JHtml::_('content.prepare', $displayData->params->get('categories_description'), '',  $displayData->get('extension') . '.categories'); ?>
		</div>
	<?php else : ?>
		<?php // Otherwise get one from the database if it exists. ?>
		<?php if ($displayData->parent->description) : ?>
			<div class="category-desc base-desc">
				<?php echo JHtml::_('content.prepare', $displayData->parent->description, '', $displayData->parent->extension . '.categories'); ?>
			</div>
		<?php endif; ?>
	<?php endif; ?>
<?php endif; ?>
