<?php
/**
 * @package    EJB PRO - Easy Joomla Backup PRO for Joomal! 3.x
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

use Joomla\CMS\{Factory, Language\Text, MVC\View\HtmlView, Toolbar\ToolbarHelper};

class EasyJoomlaBackupViewEasyJoomlaBackup extends HtmlView
{
    protected $state;
    protected $pluginState;
    protected $items;
    protected $pagination;
    protected $downloadAllowed;
    protected $dbType;
    protected $sessionHandler;
    protected $donationCodeMessage;

    /**
     * @param null|string $tpl
     *
     * @return mixed|void
     */
    function display($tpl = null)
    {
        ToolbarHelper::title(Text::_('COM_EASYJOOMLABACKUP') . " - " . Text::_('COM_EASYJOOMLABACKUP_SUBMENU_ENTRIES'), 'easyjoomlabackup');

        if (Factory::getUser()->authorise('easyjoomlabackup.fullbackup', 'com_easyjoomlabackup')) {
            ToolbarHelper::custom('fullbackup', 'new', 'new', Text::_('COM_EASYJOOMLABACKUP_FULLBACKUP'), false);
        }

        if (Factory::getUser()->authorise('easyjoomlabackup.databasebackup', 'com_easyjoomlabackup')) {
            ToolbarHelper::custom('databasebackup', 'new', 'new', Text::_('COM_EASYJOOMLABACKUP_DATABASEBACKUP'), false);
        }

        if (Factory::getUser()->authorise('easyjoomlabackup.filebackup', 'com_easyjoomlabackup')) {
            ToolbarHelper::custom('filebackup', 'new', 'new', Text::_('COM_EASYJOOMLABACKUP_FILEBACKUP'), false);
        }

        if (Factory::getUser()->authorise('easyjoomlabackup.discover', 'com_easyjoomlabackup')) {
            ToolbarHelper::custom('discover', 'refresh', 'refresh', Text::_('COM_EASYJOOMLABACKUP_DISCOVER'), false);
        }

        if (Factory::getUser()->authorise('core.delete', 'com_easyjoomlabackup')) {
            ToolbarHelper::deleteList();
        }

        if (Factory::getUser()->authorise('core.admin', 'com_easyjoomlabackup')) {
            ToolbarHelper::preferences('com_easyjoomlabackup', '500');
        }

        $downloadAllowed = false;

        if (Factory::getUser()->authorise('easyjoomlabackup.download', 'com_easyjoomlabackup')) {
            $downloadAllowed = true;
        }

        $items = $this->get('Data');
        $pagination = $this->get('Pagination');
        $this->state = $this->get('State');
        $this->pluginState = $this->get('PluginStatus');

        $document = Factory::getDocument();
        $document->addStyleSheet('components/com_easyjoomlabackup/css/easyjoomlabackup.css');

        $this->items = $items;
        $this->pagination = $pagination;
        $this->downloadAllowed = $downloadAllowed;

        $this->dbType = Factory::getConfig()->get('dbtype');
        $this->sessionHandler = Factory::getConfig()->get('session_handler');

        EasyJoomlaBackupHelper::showMessages();
        $this->donationCodeMessage = EasyJoomlaBackupHelper::getDonationCodeMessage();

        parent::display($tpl);
    }
}
