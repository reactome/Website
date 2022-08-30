<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_config
 *
<<<<<<< HEAD
 * @copyright   (C) 2012 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
?>
<div class="width-100">
	<fieldset class="adminform">
		<legend><?php echo JText::_('COM_CONFIG_SYSTEM_SETTINGS'); ?></legend>
		<ul class="adminformlist">
			<?php foreach ($this->form->getFieldset('system') as $field): ?>
				<li>
					<?php echo $field->label; ?>
					<?php echo $field->input; ?>
				</li>
			<?php endforeach; ?>
		</ul>
	</fieldset>
</div>
