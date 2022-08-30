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

use Joomla\CMS\{Language\Text, Factory, Session\Session};

?>
    <div class="container-fluid">
        <div class="row-fluid">
            <div class="span12">
                <div class="progress progress-striped active">
                    <div id="backupProgress" class="bar bar-info" style=""></div>
                    <div id="backupProgressQueue" class="bar bar-info" style="width: 100%; opacity: 0.4;"></div>
                </div>
                <div id="backupFileInformation">
                    <span id="backupLastFile"><?php echo Text::_('COM_EASYJOOMLABACKUP_BACKUPMODAL_INITIALISE'); ?></span>
                </div>
            </div>
        </div>
    </div>

<?php
$linkAjax = 'index.php?option=com_easyjoomlabackup&controller=createbackup&task=' . $this->backupTask . '&format=json&' . Session::getFormToken() . '=1';
$js = "!function(a){a(function(){let e=a('#backupProgress'),t=a('#backupProgressQueue'),o=a('#backupLastFile'),n=document.title;a('#create-backup-modal').on('shown',function(){s()}).on('hidden',function(){e.width('0%'),t.width('100%'),e.removeClass('bar-danger').addClass('bar-info')});var s=function(d){let c='" . $linkAjax . "&comment='+a('#comment').val();void 0!==d&&(c+='&hash='+d),a.getJSON(c).done(function(a){a.success&&(e.width(a.data.percent+'%'),t.width(100-a.data.percent+'%'),o.html(a.data.message),document.title=a.data.percent+'% - '+n,a.data.finished?(e.removeClass('bar-info').addClass('bar-success'),o.html('" . Text::_('COM_EASYJOOMLABACKUP_BACKUPMODAL_BACKUPDONE') . "'),location.href='index.php?option=com_easyjoomlabackup'):s(a.data.hash))}).fail(function(){console.log(JSON.stringify(data.data)),e.removeClass('bar-info').addClass('bar-danger'),a('#create-backup-modal').modal('hide')})}})}(jQuery);";

Factory::getDocument()->addScriptDeclaration($js);
