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
	<fieldset class="adminform" title="<?php echo JText::_('COM_LANGUAGES_FTP_TITLE'); ?>">
		<legend><?php echo JText::_('COM_LANGUAGES_FTP_TITLE'); ?></legend>

		<?php echo JText::_('COM_LANGUAGES_FTP_DESC'); ?>

		<?php if ($ftp instanceof Exception) : ?>
			<p class="warning"><?php echo JText::_($ftp->message); ?></p>
		<?php endif; ?>

		<div>
			<label for="username"><?php echo JText::_('JGLOBAL_USERNAME'); ?></label>
			<input type="text" id="username" name="username" value="" />
		</div>
		<div>
			<label for="password"><?php echo JText::_('JGLOBAL_PASSWORD'); ?></label>
			<input type="password" id="password" name="password" value="" />
		</div>
	</fieldset>
