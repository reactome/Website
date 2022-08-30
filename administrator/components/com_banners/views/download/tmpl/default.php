<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_banners
 *
<<<<<<< HEAD
 * @copyright   (C) 2009 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

JHtml::_('bootstrap.tooltip', '.hasTooltip', array('placement' => 'bottom'));
?>
<div class="container-popup">
	<form
		class="form-horizontal form-validate"
		id="download-form"
		name="adminForm"
		action="<?php echo JRoute::_('index.php?option=com_banners&task=tracks.display&format=raw&' . JSession::getFormToken() . '=1'); ?>"
		method="post">

		<?php foreach ($this->form->getFieldset() as $field) : ?>
			<?php echo $this->form->renderField($field->fieldname); ?>
		<?php endforeach; ?>

		<button class="hidden"
			id="closeBtn"
			type="button"
			onclick="window.parent.jQuery('#modal-download').modal('hide');">
		</button>
		<button class="hidden"
			id="exportBtn"
			type="button"
			onclick="this.form.submit();window.top.setTimeout('window.parent.jQuery(\'#downloadModal\').modal(\'hide\')', 700);">
		</button>
	</form>
</div>
