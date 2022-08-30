<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_redirect
 *
<<<<<<< HEAD
 * @copyright   (C) 2015 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

?>
<button type="button" class="btn" data-dismiss="modal" onclick="document.getElementById('batch_urls').value='';">
	<?php echo JText::_('JCANCEL'); ?>
</button>
<button type="submit" class="btn btn-success" onclick="Joomla.submitbutton('links.batch');return false;">
	<?php echo JText::_('JGLOBAL_BATCH_PROCESS'); ?>
</button>
