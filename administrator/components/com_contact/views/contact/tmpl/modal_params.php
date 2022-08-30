<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_contact
 *
<<<<<<< HEAD
 * @copyright   (C) 2013 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$fieldSets = $this->form->getFieldsets('params');
foreach ($fieldSets as $name => $fieldSet) :
	$paramstabs = 'params-' . $name;
	echo JHtml::_('bootstrap.addTab', 'myTab', $paramstabs, JText::_($fieldSet->label));

	if (isset($fieldSet->description) && trim($fieldSet->description)) :
		echo '<p class="alert alert-info">' . $this->escape(JText::_($fieldSet->description)) . '</p>';
	endif;
	?>
		<?php foreach ($this->form->getFieldset($name) as $field) : ?>
			<div class="control-group">
				<div class="control-label"><?php echo $field->label; ?></div>
				<div class="controls"><?php echo $field->input; ?></div>
			</div>
		<?php endforeach; ?>
	<?php echo JHtml::_('bootstrap.endTab'); ?>
<?php endforeach; ?>
