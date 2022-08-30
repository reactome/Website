<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  Template.hathor
 *
<<<<<<< HEAD
 * @copyright   (C) 2010 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
?>
<fieldset class="adminform" title="<?php echo JText::_('COM_INSTALLER_MSG_DESCFTPTITLE'); ?>">
	<legend><?php echo JText::_('COM_INSTALLER_MSG_DESCFTPTITLE'); ?></legend>

	<?php echo JText::_('COM_INSTALLER_MSG_DESCFTP'); ?>

	<?php if ($this->ftp instanceof Exception) : ?>
		<p><?php echo JText::_($this->ftp->getMessage()); ?></p>
	<?php endif; ?>

	<ul class="adminformlist">
		<li><label for="username"><?php echo JText::_('JGLOBAL_USERNAME'); ?></label>
		<input type="text" id="username" name="username" value="" /></li>

		<li><label for="password"><?php echo JText::_('JGLOBAL_PASSWORD'); ?></label>
		<input type="password" id="password" name="password" class="input_box" value="" /></li>
	</ul>

</fieldset>
