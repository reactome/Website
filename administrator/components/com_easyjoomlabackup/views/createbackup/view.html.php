<?php
/**
 * @package    Easy Joomla Backup - EJB for Joomal! 3.x
 * @author     Viktor Vogel <admin@kubik-rubik.de>
 * @version    3.3.0-FREE - 2020-01-03
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

use Joomla\CMS\{MVC\View\HtmlView, Factory, Language\Text, Toolbar\Toolbar, HTML\HTMLHelper, Toolbar\ToolbarHelper};

class EasyJoomlaBackupViewCreatebackup extends HtmlView
{
    protected $backupTask = '';
    protected $donationCodeMessage;

    /**
     * @param null|string $tpl
     *
     * @return mixed|void
     * @throws Exception
     */
    public function display($tpl = null)
    {
        $task = Factory::getApplication()->input->get('task');

        if ($task == 'fullbackup') {
            ToolbarHelper::title(Text::_('COM_EASYJOOMLABACKUP') . ' - ' . Text::_('COM_EASYJOOMLABACKUP_CREATEBACKUP_FULLBACKUP'), 'easyjoomlabackup-add');
        } elseif ($task == 'databasebackup') {
            ToolbarHelper::title(Text::_('COM_EASYJOOMLABACKUP') . ' - ' . Text::_('COM_EASYJOOMLABACKUP_CREATEBACKUP_DATABASEBACKUP'), 'easyjoomlabackup-add');
        } elseif ($task == 'filebackup') {
            ToolbarHelper::title(Text::_('COM_EASYJOOMLABACKUP') . ' - ' . Text::_('COM_EASYJOOMLABACKUP_CREATEBACKUP_FILEBACKUP'), 'easyjoomlabackup-add');
        }

        $buttonText = '<span class="icon-new icon-white"></span> ' . Text::_('COM_EASYJOOMLABACKUP_CREATEBACKUP_BUTTON');
        $buttonModal = HTMLHelper::_('link', '#create-backup-modal', $buttonText, ['id' => 'create-backup', 'class' => 'btn btn-small button-new btn-success', 'data-toggle' => 'modal']);
        $bar = Toolbar::getInstance('toolbar');
        $bar->appendButton('Custom', $buttonModal);

        ToolbarHelper::cancel('cancel');

        $this->backupTask = 'backupCreate' . ucwords($task);

        $document = Factory::getDocument();
        $document->addStyleSheet('components/com_easyjoomlabackup/css/easyjoomlabackup.css');

        EasyJoomlaBackupHelper::showMessages();
        $this->donationCodeMessage = EasyJoomlaBackupHelper::getDonationCodeMessage();

        parent::display($tpl);
    }
}
