<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_config
 *
<<<<<<< HEAD
 * @copyright   (C) 2014 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$fieldSets = $this->form->getFieldsets('params');

echo JHtml::_('bootstrap.startAccordion', 'collapseTypes');
$i = 0;

foreach ($fieldSets as $name => $fieldSet) :

$label = !empty($fieldSet->label) ? $fieldSet->label : 'COM_MODULES_' . $name . '_FIELDSET_LABEL';
$class = isset($fieldSet->class) && !empty($fieldSet->class) ? $fieldSet->class : '';


if (isset($fieldSet->description) && trim($fieldSet->description)) :
echo '<p class="tip">' . $this->escape(JText::_($fieldSet->description)) . '</p>';
endif;
?>
<?php echo JHtml::_('bootstrap.addSlide', 'collapseTypes', JText::_($label), 'collapse' . ($i++)); ?>

<ul class="nav nav-tabs nav-stacked">
<?php foreach ($this->form->getFieldset($name) as $field) : ?>

	<li>
		<?php // If multi-language site, make menu-type selection read-only ?>
		<?php if (JLanguageMultilang::isEnabled() && $this->item['module'] === 'mod_menu' && $field->getAttribute('name') === 'menutype') : ?>
			<?php $field->readonly = true; ?>
		<?php endif; ?>
		<?php echo $field->renderField(); ?>
	</li>

<?php endforeach; ?>
</ul>

<?php echo JHtml::_('bootstrap.endSlide'); ?>
<?php endforeach; ?>
<?php echo JHtml::_('bootstrap.endAccordion'); ?>
