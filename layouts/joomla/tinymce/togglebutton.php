<?php
/**
 * @package     Joomla.Site
 * @subpackage  Layout
 *
<<<<<<< HEAD
 * @copyright   (C) 2013 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$name = $displayData;

?>
<div class="toggle-editor btn-toolbar pull-right clearfix">
	<div class="btn-group">
		<a class="btn" href="#"
			onclick="tinyMCE.execCommand('mceToggleEditor', false, '<?php echo $name; ?>');return false;"
			title="<?php echo JText::_('PLG_TINY_BUTTON_TOGGLE_EDITOR'); ?>"
		>
			<span class="icon-eye" aria-hidden="true"></span> <?php echo JText::_('PLG_TINY_BUTTON_TOGGLE_EDITOR'); ?>
		</a>
	</div>
</div>