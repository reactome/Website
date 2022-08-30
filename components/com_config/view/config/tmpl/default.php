<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_config
 *
<<<<<<< HEAD
 * @copyright   (C) 2013 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Load tooltips behavior
JHtml::_('behavior.formvalidator');
JHtml::_('bootstrap.tooltip');
JHtml::_('formbehavior.chosen', 'select');

JFactory::getDocument()->addScriptDeclaration("
	Joomla.submitbutton = function(task)
	{
		if (task == 'config.cancel' || document.formvalidator.isValid(document.getElementById('application-form'))) {
			Joomla.submitform(task, document.getElementById('application-form'));
		}
	}
");
?>

<form action="<?php echo JRoute::_('index.php?option=com_config'); ?>" id="application-form" method="post" name="adminForm" class="form-validate">

	<div class="row-fluid">
		<!-- Begin Content -->

		<div class="btn-toolbar" role="toolbar" aria-label="<?php echo JText::_('JTOOLBAR'); ?>">
			<div class="btn-group">
				<button type="button" class="btn btn-primary" onclick="Joomla.submitbutton('config.save.config.apply')">
					<span class="icon-ok"></span> <?php echo JText::_('JSAVE') ?>
				</button>
			</div>
			<div class="btn-group">
				<button type="button" class="btn" onclick="Joomla.submitbutton('config.cancel')">
					<span class="icon-cancel"></span> <?php echo JText::_('JCANCEL') ?>
				</button>
			</div>
		</div>

		<hr class="hr-condensed" />

		<div id="page-site" class="tab-pane active">
			<div class="row-fluid">
				<?php echo $this->loadTemplate('site'); ?>
				<?php echo $this->loadTemplate('metadata'); ?>
				<?php echo $this->loadTemplate('seo'); ?>
			</div>
		</div>

		<input type="hidden" name="task" value="" />
		<?php echo JHtml::_('form.token'); ?>

		<!-- End Content -->
	</div>

</form>
