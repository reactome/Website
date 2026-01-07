<?php

/**
 * @copyright
 * @package    Easy Joomla Backup - EJB for Joomal! 3.x
 * @author     Viktor Vogel <admin@kubik-rubik.de>
 * @version    3.4.1.0-FREE - 2021-09-09
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

use EasyJoomlaBackup\Helper;
use Joomla\CMS\MVC\View\HtmlView;
use Joomla\CMS\{Factory, Language\Text, Toolbar\Toolbar, HTML\HTMLHelper, Toolbar\ToolbarHelper};

/**
 * Class EasyJoomlaBackupViewCreatebackup
 *
 * @since 3.0.0-FREE
 */
class EasyJoomlaBackupViewCreatebackup extends HtmlView
{
    /**
     * @var string $backupTask
     * @since 3.0.0-FREE
     */
    protected $backupTask = '';

    /**
     * @var string $donationCodeMessage
     * @since 3.0.0-FREE
     */
    protected $donationCodeMessage;

    /**
     * @param null|string $tpl
     *
     * @return Exception|mixed|string|void
     * @throws Exception
     * @since   3.0.0-FREE
     * @version 3.4.0.0-FREE
     */
    public function display($tpl = null)
    {
        $task = Factory::getApplication()->input->get('task');

        if ($task === 'fullbackup') {
            ToolbarHelper::title(Text::_('COM_EASYJOOMLABACKUP') . ' - ' . Text::_('COM_EASYJOOMLABACKUP_CREATEBACKUP_FULLBACKUP'), 'easyjoomlabackup-add');
        } elseif ($task === 'databasebackup') {
            ToolbarHelper::title(Text::_('COM_EASYJOOMLABACKUP') . ' - ' . Text::_('COM_EASYJOOMLABACKUP_CREATEBACKUP_DATABASEBACKUP'), 'easyjoomlabackup-add');
        } elseif ($task === 'filebackup') {
            ToolbarHelper::title(Text::_('COM_EASYJOOMLABACKUP') . ' - ' . Text::_('COM_EASYJOOMLABACKUP_CREATEBACKUP_FILEBACKUP'), 'easyjoomlabackup-add');
        }

        $buttonText = '<span class="icon-new icon-white"></span> ' . Text::_('COM_EASYJOOMLABACKUP_CREATEBACKUP_BUTTON');
        $buttonModal = HTMLHelper::_('link', '#create-backup-modal', $buttonText, ['id' => 'create-backup', 'class' => 'btn btn-small button-new btn-success', 'data-toggle' => 'modal']);
        $bar = Toolbar::getInstance();
        $bar->appendButton('Custom', $buttonModal);

        ToolbarHelper::cancel();

        $this->backupTask = 'backupCreate' . ucwords($task);

        Factory::getDocument()->addStyleSheet('components/com_easyjoomlabackup/css/easyjoomlabackup.css');

        Helper::showMessages();
        $this->donationCodeMessage = Helper::getDonationCodeMessage();

        parent::display($tpl);
    }
}
