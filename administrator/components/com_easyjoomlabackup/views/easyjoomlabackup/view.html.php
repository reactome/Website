<?php

/**
 * @copyright
 * @package    Easy Joomla Backup - EJB for Joomal! 3.x
 * @author     Viktor Vogel <admin@kubik-rubik.de>
 * @version    3.4.0.0-FREE - 2021-08-02
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
use Joomla\CMS\{Factory, Language\Text, Toolbar\ToolbarHelper};

/**
 * Class EasyJoomlaBackupViewEasyJoomlaBackup
 *
 * @since 3.0.0-FREE
 */
class EasyJoomlaBackupViewEasyJoomlaBackup extends HtmlView
{
    /**
     * @var string $dbType
     * @since 3.0.0-FREE
     */
    protected $dbType;

    /**
     * @var bool $downloadAllowed
     * @since 3.0.0-FREE
     */
    protected $downloadAllowed;

    /**
     * @var array $items
     * @since 3.0.0-FREE
     */
    protected $items;

    /**
     * @var object $pagination
     * @since 3.0.0-FREE
     */
    protected $pagination;

    /**
     * @var array $pluginState
     * @since 3.0.0-FREE
     */
    protected $pluginState;

    /**
     * @var string $sessionHandler
     * @since 3.0.0-FREE
     */
    protected $sessionHandler;

    /**
     * @var object $state
     * @since 3.0.0-FREE
     */
    protected $state;

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
        ToolbarHelper::title(Text::_('COM_EASYJOOMLABACKUP') . ' - ' . Text::_('COM_EASYJOOMLABACKUP_SUBMENU_ENTRIES'), 'easyjoomlabackup');

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

        $this->items = $this->get('Data');
        $this->pagination = $this->get('Pagination');
        $this->state = $this->get('State');
        $this->pluginState = $this->get('PluginStatus');
        $this->downloadAllowed = Factory::getUser()->authorise('easyjoomlabackup.download', 'com_easyjoomlabackup');
        $this->dbType = Factory::getConfig()->get('dbtype');
        $this->sessionHandler = Factory::getConfig()->get('session_handler');

        Factory::getDocument()->addStyleSheet('components/com_easyjoomlabackup/css/easyjoomlabackup.css');

        Helper::showMessages();
        $this->donationCodeMessage = Helper::getDonationCodeMessage();

        parent::display($tpl);
    }
}
