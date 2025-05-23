<?php
/**
 * @package         Modals
 * @version         12.6.1
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            https://regularlabs.com
 * @copyright       Copyright © 2023 Regular Labs All Rights Reserved
 * @license         GNU General Public License version 2 or later
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\Language\Text as JText;

$user = JFactory::getApplication()->getIdentity() ?: JFactory::getUser();
?>
<nav class="navbar">
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

                <?php if (JFactory::getApplication()->isClient('administrator') && $user->authorise('core.admin', 1)) : ?>
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
