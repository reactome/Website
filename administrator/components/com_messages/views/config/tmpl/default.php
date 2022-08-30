<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_messages
 *
<<<<<<< HEAD
 * @copyright   (C) 2009 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Include the HTML helpers.
JHtml::addIncludePath(JPATH_COMPONENT . '/helpers/html');

JHtml::_('behavior.formvalidator');
JHtml::_('behavior.keepalive');
JHtml::_('bootstrap.tooltip', '.hasTooltip', array('placement' => 'bottom'));

JFactory::getDocument()->addScriptDeclaration(
	"
		Joomla.submitbutton = function(task)
		{
			if (task == 'config.cancel' || document.formvalidator.isValid(document.getElementById('config-form')))
			{
				Joomla.submitform(task, document.getElementById('config-form'));
			}
		};
	"
);
?>
<div class="container-popup">
	<form action="<?php echo JRoute::_('index.php?option=com_messages&view=config'); ?>" method="post" name="adminForm" id="message-form" class="form-validate form-horizontal">
		<fieldset>
			<?php echo $this->form->renderField('lock'); ?>
			<?php echo $this->form->renderField('mail_on_new'); ?>
			<?php echo $this->form->renderField('auto_purge'); ?>
		</fieldset>
		<button id="saveBtn" type="button" class="hidden" onclick="Joomla.submitform('config.save', this.form);"></button>

		<input type="hidden" name="task" value="" />
		<?php echo JHtml::_('form.token'); ?>
	</form>
</div>
