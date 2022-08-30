<?php

/**
 * @copyright
 * @package    Easy Joomla Backup - EJB for Joomal! 3.x
 * @author     Viktor Vogel <admin@kubik-rubik.de>
<<<<<<< HEAD
 * @version    3.4.1.0-FREE - 2021-09-09
=======
 * @version    3.4.0.0-FREE - 2021-08-02
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @link       https://kubik-rubik.de/ejb-easy-joomla-backup
 *
 * @license    GNU/GPL
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
defined('_JEXEC') || die('Restricted access');

use Joomla\CMS\{HTML\HTMLHelper, Router\Route, Language\Text};
use EasyJoomlaBackup\Helper;

HTMLHelper::_('behavior.framework');
HTMLHelper::_('behavior.tooltip');
HTMLHelper::_('behavior.formvalidation');
?>
<script type="text/javascript">
    Joomla.submitbutton = function(task) {
        if (task === 'cancel' || document.formvalidator.isValid(document.id('easyjoomlabackup-form'))) {
            Joomla.submitform(task, document.getElementById('easyjoomlabackup-form'));
        } else {
            alert('<?php echo $this->escape(Text::_('JGLOBAL_VALIDATION_FORM_FAILED')); ?>');
        }
    };

    jQuery(document).ready(function() {
        jQuery('a#create-backup').click(function() {
            jQuery(this).attr('href', '#create-backup-modal');
        });
    });
</script>
<form action="<?php echo Route::_('index.php?option=com_easyjoomlabackup'); ?>" method="post" name="adminForm" id="easyjoomlabackup-form" class="form-validate">
    <div class="row-fluid">
        <div class="span12 form-horizontal">
            <fieldset class="adminform">
                <div id="backup_comment">
                    <label for="comment">
                        <p><strong><?php echo Text::_('COM_EASYJOOMLABACKUP_COMMENT'); ?></strong></p>
                    </label>
                    <textarea rows="5" cols="140" maxlength="" id="comment" name="comment" placeholder="<?php echo Text::_('COM_EASYJOOMLABACKUP_COMMENT_PLACEHOLDER'); ?>"></textarea>
                </div>
                <div id="backup_notice" style="display: inherit;">
                    <?php echo Text::_('COM_EASYJOOMLABACKUP_CREATEBACKUPNOTES'); ?>
                </div>
            </fieldset>
        </div>
    </div>
    <?php $params = ['title' => Text::_('COM_EASYJOOMLABACKUP_BACKUPMODAL_TITLE'), 'backdrop' => 'static', 'closeButton' => false, 'footer' => Text::_('COM_EASYJOOMLABACKUP_BACKUPMODAL_FOOTER')]; ?>
    <?php $body = $this->loadTemplate('modal'); ?>
    <?php echo HTMLHelper::_('bootstrap.renderModal', 'create-backup-modal', $params, $body); ?>
    <input type="hidden" name="option" value="com_easyjoomlabackup"/>
    <input type="hidden" name="id" value=""/>
    <input type="hidden" name="task" value=""/>
    <input type="hidden" name="controller" value="createbackup"/>
    <?php echo HTMLHelper::_('form.token'); ?>
</form>
<div style="text-align: center; margin-top: 10px;">
    <p><?php echo Text::sprintf('COM_EASYJOOMLABACKUP_VERSION', Helper::EASYJOOMLABACKUP_VERSION); ?></p>
</div>
<?php echo $this->donationCodeMessage; ?>
