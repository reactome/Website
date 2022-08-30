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

// JLayout for standard handling of metadata fields in the administrator content edit screens.
$form = $displayData->get('form');
?>
<fieldset>
	<div class="control-group">
		<?php echo $form->getLabel('metadesc'); ?>
		<div class="controls">
			<?php echo $form->getInput('metadesc'); ?>
		</div>
	</div>
	<div class="control-group">
		<?php echo $form->getLabel('metakey'); ?>
		<div class="controls">
			<?php echo $form->getInput('metakey'); ?>
		</div>
	</div>
	<?php if ($form->getLabel('xreference')):?>
		<div class="control-group">
			<?php echo $form->getLabel('xreference'); ?>
			<div class="controls">
				<?php echo $form->getInput('xreference'); ?>
			</div>
		</div>
	<?php endif; ?>
	<?php foreach ($form->getGroup('metadata') as $field) : ?>
		<?php if ($field->name != 'jform[metadata][tags][]') :?>
			<div class="control-group">
				<?php if (!$field->hidden) : ?>
					<?php echo $field->label; ?>
				<?php endif; ?>
				<div class="controls">
					<?php echo $field->input; ?>
				</div>
			</div>
		<?php endif; ?>
	<?php endforeach; ?>
</fieldset>
