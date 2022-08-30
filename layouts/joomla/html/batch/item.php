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
 * @var  string   $extension The extension name
 */

extract($displayData);

// Create the copy/move options.
$options = array(
	JHtml::_('select.option', 'c', JText::_('JLIB_HTML_BATCH_COPY')),
	JHtml::_('select.option', 'm', JText::_('JLIB_HTML_BATCH_MOVE'))
);
?>
<label id="batch-choose-action-lbl" for="batch-choose-action"><?php echo JText::_('JLIB_HTML_BATCH_MENU_LABEL'); ?></label>
<div id="batch-choose-action" class="control-group">
	<select name="batch[category_id]" class="inputbox" id="batch-category-id">
		<option value=""><?php echo JText::_('JLIB_HTML_BATCH_NO_CATEGORY'); ?></option>
		<?php echo JHtml::_('select.options', JHtml::_('category.options', $extension)); ?>
	</select>
</div>
<div id="batch-copy-move" class="control-group radio">
	<?php echo JText::_('JLIB_HTML_BATCH_MOVE_QUESTION'); ?>
	<?php echo JHtml::_('select.radiolist', $options, 'batch[move_copy]', '', 'value', 'text', 'm'); ?>
</div>
