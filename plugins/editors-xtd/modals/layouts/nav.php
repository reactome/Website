<?php
/**
 * @package         Modals
 * @version         9.12.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2018 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die;
?>
<nav class="navbar navbar-fixed-top">
	<div class="navbar-inner">
		<div class="container-fluid">
			<div class="btn-toolbar" id="toolbar">
				<div class="btn-wrapper" id="toolbar-apply">
					<button onclick="if(RegularLabsModalsPopup.insertText()){window.parent.SqueezeBox.close();}" class="btn btn-small btn-success">
						<span class="icon-apply icon-white"></span> <?php echo JText::_('RL_INSERT') ?>
					</button>
				</div>
				<div class="btn-wrapper" id="toolbar-cancel">
					<button onclick="if(confirm('<?php echo JText::_('RL_ARE_YOU_SURE'); ?>')){window.parent.SqueezeBox.close();}" class="btn btn-small">
						<span class="icon-cancel "></span> <?php echo JText::_('JCANCEL') ?>
					</button>
				</div>

				<?php if (JFactory::getApplication()->isAdmin() && JFactory::getUser()->authorise('core.admin', 1)) : ?>
					<div class="btn-wrapper" id="toolbar-options">
						<button onclick="window.open('index.php?option=com_plugins&filter_folder=system&filter_search=<?php echo JText::_('MODALS') ?>');" class="btn btn-small">
							<span class="icon-options"></span> <?php echo JText::_('JOPTIONS') ?>
						</button>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</div>
</nav>
