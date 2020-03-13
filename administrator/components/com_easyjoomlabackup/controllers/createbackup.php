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

use Joomla\CMS\{Factory, Router\Route, Language\Text, Session\Session, Response\JsonResponse, MVC\Controller\BaseController};

class EasyJoomlaBackupControllerCreatebackup extends BaseController
{
    protected $input;

    /**
     * EasyJoomlaBackupControllerCreatebackup constructor.
     *
     * @throws Exception
     */
    function __construct()
    {
        parent::__construct();

        $this->input = Factory::getApplication()->input;
    }

    /**
     * Loads the full backup template
     *
     * @throws Exception
     */
    public function fullbackup()
    {
        if (!Factory::getUser()->authorise('easyjoomlabackup.fullbackup', 'com_easyjoomlabackup')) {
            throw new Exception(Text::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        $this->input->set('view', 'createbackup');
        $this->input->set('hidemainmenu', 1);
        parent::display();
    }

    /**
     * Loads the database backup template
     *
     * @throws Exception
     */
    public function databasebackup()
    {
        if (!Factory::getUser()->authorise('easyjoomlabackup.databasebackup', 'com_easyjoomlabackup')) {
            throw new Exception(Text::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        $this->input->set('view', 'createbackup');
        $this->input->set('hidemainmenu', 1);
        parent::display();
    }

    /**
     * Loads the file backup template
     *
     * @throws Exception
     */
    public function filebackup()
    {
        if (!Factory::getUser()->authorise('easyjoomlabackup.filebackup', 'com_easyjoomlabackup')) {
            throw new Exception(Text::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        $this->input->set('view', 'createbackup');
        $this->input->set('hidemainmenu', 1);
        parent::display();
    }

    /**
     * Discovers backup files without database entries or database entries without corresponding backup archives
     *
     * @throws Exception
     */
    public function discover()
    {
        Session::checkToken() || jexit('Invalid Token');

        if (!Factory::getUser()->authorise('easyjoomlabackup.discover', 'com_easyjoomlabackup')) {
            throw new Exception(Text::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        /* @var EasyJoomlaBackupModelEasyJoomlaBackup $model */
        $model = $this->getModel('easyjoomlabackup');

        $msg = Text::_('COM_EASYJOOMLABACKUP_DISCOVER_SUCCESS');
        $type = 'message';

        if (!$model->discover()) {
            $msg = Text::_('COM_EASYJOOMLABACKUP_DISCOVER_NOTICE');
            $type = 'notice';
        }

        $this->setRedirect(Route::_('index.php?option=com_easyjoomlabackup', false), $msg, $type);
    }

    /**
     * Deletes selected entries and the corresponding backup archives
     *
     * @throws Exception
     */
    public function remove()
    {
        Session::checkToken() || jexit('Invalid Token');

        if (!Factory::getUser()->authorise('core.delete', 'com_easyjoomlabackup')) {
            throw new Exception(Text::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        /* @var EasyJoomlaBackupModelCreatebackup $model */
        $model = $this->getModel('createbackup');

        $msg = Text::_('COM_EASYJOOMLABACKUP_BACKUP_DELETED');
        $type = 'message';

        if (!$model->delete()) {
            $msg = Text::_('COM_EASYJOOMLABACKUP_BACKUP_DELETED_ERROR');
            $type = 'error';
        }

        $this->setRedirect(Route::_('index.php?option=com_easyjoomlabackup', false), $msg, $type);
    }

    /**
     * Calls the download screen for the selected backup entry
     *
     * @throws Exception
     */
    public function download()
    {
        if (!Factory::getUser()->authorise('easyjoomlabackup.download', 'com_easyjoomlabackup')) {
            throw new Exception(Text::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        /* @var EasyJoomlaBackupModelCreatebackup $model */
        $model = $this->getModel('createbackup');

        if (!$model->download()) {
            $msg = Text::_('COM_EASYJOOMLABACKUP_DOWNLOAD_ERROR');
            $type = 'error';
            $this->setRedirect(Route::_('index.php?option=com_easyjoomlabackup', false), $msg, $type);
        }
    }

    /**
     * Aborts the selected backup process
     */
    public function cancel()
    {
        $msg = Text::_('COM_EASYJOOMLABACKUP_BACKUP_CANCELLED');
        $this->setRedirect('index.php?option=com_easyjoomlabackup', $msg, 'notice');
    }

    /**
     * Starts the full backup process with an ACL check
     *
     * @throws Exception
     * @deprecated Use backupCreateFullbackup() instead
     */
    public function backup_create_fullbackup()
    {
        $this->backupCreateFullbackup();
    }

    /**
     * Starts the full backup process with an ACL check
     *
     * @throws Exception
     */
    public function backupCreateFullbackup()
    {
        if (!Factory::getUser()->authorise('easyjoomlabackup.' . EasyJoomlaBackupHelper::BACKUP_TYPE_FULL, 'com_easyjoomlabackup')) {
            throw new Exception(Text::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        $this->backupCreate(EasyJoomlaBackupHelper::BACKUP_TYPE_FULL);
    }

    /**
     * Creates the backup archive in dependence on the submitted type
     *
     * @param string $backupType
     *
     * @throws Exception
     */
    private function backupCreate(string $backupType)
    {
        Session::checkToken('get') || jexit('Invalid Token');

        // Try to increase all relevant settings to prevent timeouts on big sites
        @ini_set('memory_limit', '512M');
        @ini_set('error_reporting', 0);
        @set_time_limit(3600);

        /* @var EasyJoomlaBackupModelCreatebackup $model */
        $model = $this->getModel('createbackup');

        $hash = $this->input->get('hash', '');
        $result = $model->createBackupAjax($backupType, $hash);

        if ($result['finished']) {
            EasyJoomlaBackupHelper::addMessage(Text::_('COM_EASYJOOMLABACKUP_BACKUP_SAVED'));

            // Remove unneeded backup files
            if ($model->removeBackupFilesMax()) {
                EasyJoomlaBackupHelper::addMessage(Text::_('COM_EASYJOOMLABACKUP_MAXNUMBERBACKUPS_REMOVED'), EasyJoomlaBackupHelper::MESSAGE_TYPE_NOTICE);
            }
        }

        echo new JsonResponse($result);
    }

    /**
     * Starts the database backup process with an ACL check
     *
     * @throws Exception
     * @deprecated Use backupCreateDatabasebackup() instead
     */
    public function backup_create_databasebackup()
    {
        $this->backupCreateDatabasebackup();
    }

    /**
     * Starts the database backup process with an ACL check
     *
     * @throws Exception
     */
    public function backupCreateDatabasebackup()
    {
        if (!Factory::getUser()->authorise('easyjoomlabackup.' . EasyJoomlaBackupHelper::BACKUP_TYPE_DATABASE, 'com_easyjoomlabackup')) {
            throw new Exception(Text::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        $this->backupCreate(EasyJoomlaBackupHelper::BACKUP_TYPE_DATABASE);
    }

    /**
     * Starts the file backup process with an ACL check
     *
     * @throws Exception
     * @deprecated Use backupCreateFilebackup() instead
     */
    public function backup_create_filebackup()
    {
        $this->backupCreateFilebackup();
    }

    /**
     * Starts the file backup process with an ACL check
     *
     * @throws Exception
     */
    public function backupCreateFilebackup()
    {
        if (!Factory::getUser()->authorise('easyjoomlabackup.' . EasyJoomlaBackupHelper::BACKUP_TYPE_FILE, 'com_easyjoomlabackup')) {
            throw new Exception(Text::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        $this->backupCreate(EasyJoomlaBackupHelper::BACKUP_TYPE_FILE);
    }
}
