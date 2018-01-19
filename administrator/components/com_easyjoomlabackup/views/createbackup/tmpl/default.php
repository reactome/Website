<?php
/**
 * @package    EJB - Easy Joomla Backup for Joomal! 3.x
 * @author     Viktor Vogel <admin@kubik-rubik.de>
 * @version    3.2.5 - 2017-10-09
 * @link       https://joomla-extensions.kubik-rubik.de/ejb-easy-joomla-backup
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
defined('_JEXEC') or die('Restricted access');
JHtml::_('behavior.framework');
JHtml::_('behavior.tooltip');
JHtml::_('behavior.formvalidation');
?>
	<script type="text/javascript">
		Joomla.submitbutton = function (task)
		{
			if (task == 'cancel' || document.formvalidator.isValid(document.id('easyjoomlabackup-form')))
			{
				Joomla.submitform(task, document.getElementById('easyjoomlabackup-form'));
			}
			else
			{
				alert('<?php echo $this->escape(JText::_('JGLOBAL_VALIDATION_FORM_FAILED')); ?>');
			}
		};

		// Load the loading animation after a click on the create button
		window.addEvent('domready', function ()
		{
			var loading = document.id('loading');
			var backup_notice = document.id('backup_notice');
			var backup_comment = document.id('backup_comment');

			document.id('toolbar-new').addEvent('click', function (event)
			{
				loading.setStyle('display', '');
				backup_notice.setStyle('opacity', '0.3');
				backup_comment.setStyle('opacity', '0.3');
			});
		});
	</script>

	<form action="<?php echo JRoute::_('index.php?option=com_easyjoomlabackup'); ?>" method="post" name="adminForm"
	      id="easyjoomlabackup-form" class="form-validate">
		<div class="row-fluid">
			<div class="span12 form-horizontal">
				<fieldset class="adminform">
					<div id="loading" style="display: none; text-align: center; margin">
						<h2><?php echo JText::_('COM_EASYJOOMLABACKUP_PLEASE_WAIT'); ?></h2>
						<img src="components/com_easyjoomlabackup/images/loading.gif" style="float: none;"
						     alt="Loading..."/><br/><br/>
						<?php echo JText::_('COM_EASYJOOMLABACKUP_CREATEBACKUPWAIT'); ?>
					</div>
					<div id="backup_comment">
						<label for="comment">
							<h4><?php echo JText::_('COM_EASYJOOMLABACKUP_COMMENT'); ?></h4>
						</label>
						<textarea rows="5" cols="140" maxlength="" id="comment" name="comment"
						          placeholder="<?php echo JText::_('COM_EASYJOOMLABACKUP_COMMENT_PLACEHOLDER'); ?>"></textarea>
					</div>
					<div id="backup_notice" style="display: inherit;">
						<?php echo JText::_('COM_EASYJOOMLABACKUP_CREATEBACKUPNOTES'); ?>
					</div>
				</fieldset>
			</div>
		</div>
		<input type="hidden" name="option" value="com_easyjoomlabackup"/>
		<input type="hidden" name="id" value=""/>
		<input type="hidden" name="task" value=""/>
		<input type="hidden" name="controller" value="createbackup"/>
		<?php echo JHtml::_('form.token'); ?>
	</form>
<?php echo $this->donation_code_message; ?>