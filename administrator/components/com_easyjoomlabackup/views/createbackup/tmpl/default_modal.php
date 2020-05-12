<?php

/**
 * @copyright
 * @package    Easy Joomla Backup - EJB for Joomal! 3.x
 * @author     Viktor Vogel <admin@kubik-rubik.de>
 * @version    3.3.1-FREE - 2020-05-03
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

use Joomla\CMS\{Factory, Session\Session, Language\Text};

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
$js = "
	;(function($)
	{
		$(function()
		{
			let progress = $('#backupProgress');
			let progressQueue = $('#backupProgressQueue');
			let backupLastFile = $('#backupLastFile');
			let windowTitle = document.title;
			
			$('#create-backup-modal').on('shown', function()
			{
				generateDump();
			})
			.on('hidden', function()
			{
				progress.width('0%');
				progressQueue.width('100%');
				progress.removeClass('bar-danger').addClass('bar-info');
			});
			
			var generateDump = function(hash)
			{
			    let comment = $('#comment').val();
				let link = '" . $linkAjax . "&comment=' + comment;
				
				if (typeof hash !== 'undefined')
				{
					link += '&hash=' + hash;
				}
				
				$.getJSON(link)
				.done(function(data)
				{
					if (data.success)
					{
						progress.width(data.data.percent + '%');
						progressQueue.width((100 - data.data.percent) + '%');
						backupLastFile.html(data.data.message);
						document.title = data.data.percent + '% - ' + windowTitle;
						
						if (!data.data.finished)
						{
							generateDump(data.data.hash);
						}
						else
						{
							progress.removeClass('bar-info').addClass('bar-success');
							backupLastFile.html('" . Text::_('COM_EASYJOOMLABACKUP_BACKUPMODAL_BACKUPDONE') . "');
							location.href = 'index.php?option=com_easyjoomlabackup';
						}
					}
				})
				.fail(function()
				{
					console.log(JSON.stringify(data.data));
					progress.removeClass('bar-info').addClass('bar-danger');
					$('#create-backup-modal').modal('hide');
				});
			};
		});
	})(jQuery);
";

Factory::getDocument()->addScriptDeclaration($js);
