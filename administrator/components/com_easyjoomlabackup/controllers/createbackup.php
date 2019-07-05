<?php
/**
 * @package    EJB - Easy Joomla Backup for Joomal! 3.x
 * @author     Viktor Vogel <admin@kubik-rubik.de>
 * @version    3.2.6 - 2019-06-30
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

class EasyJoomlaBackupControllerCreatebackup extends JControllerLegacy
{
    protected $input;

    function __construct()
    {
        parent::__construct();

        $this->input = JFactory::getApplication()->input;
    }

    /**
     * Loads the full backup template
     *
     * @throws Exception
     */
    public function fullbackup()
    {
        if (!JFactory::getUser()->authorise('easyjoomlabackup.fullbackup', 'com_easyjoomlabackup')) {
            throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 404);
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
        if (!JFactory::getUser()->authorise('easyjoomlabackup.databasebackup', 'com_easyjoomlabackup')) {
            throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 404);
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
        if (!JFactory::getUser()->authorise('easyjoomlabackup.filebackup', 'com_easyjoomlabackup')) {
            throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 404);
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
        JSession::checkToken() || jexit('Invalid Token');

        if (!JFactory::getUser()->authorise('easyjoomlabackup.discover', 'com_easyjoomlabackup')) {
            throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        $model = $this->getModel('easyjoomlabackup');

        $message = JText::_('COM_EASYJOOMLABACKUP_DISCOVER_SUCCESS');
        $type = 'message';

        if (!$model->discover()) {
            $message = JText::_('COM_EASYJOOMLABACKUP_DISCOVER_NOTICE');
            $type = 'notice';
        }

        $this->setRedirect(JRoute::_('index.php?option=com_easyjoomlabackup', false), $message, $type);
    }

    /**
     * Deletes selected entries and the corresponding backup archives
     *
     * @throws Exception
     */
    public function remove()
    {
        JSession::checkToken() || jexit('Invalid Token');

        if (!JFactory::getUser()->authorise('core.delete', 'com_easyjoomlabackup')) {
            throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        $model = $this->getModel('createbackup');

        $message = JText::_('COM_EASYJOOMLABACKUP_BACKUP_DELETED');
        $type = 'message';

        if (!$model->delete()) {
            $message = JText::_('COM_EASYJOOMLABACKUP_BACKUP_DELETED_ERROR');
            $type = 'error';
        }

        $this->setRedirect(JRoute::_('index.php?option=com_easyjoomlabackup', false), $message, $type);
    }

    /**
     * Calls the download screen for the selected backup entry
     *
     * @throws Exception
     */
    public function download()
    {
        if (!JFactory::getUser()->authorise('easyjoomlabackup.download', 'com_easyjoomlabackup')) {
            throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        $model = $this->getModel('createbackup');

        if (!$model->download()) {
            $message = JText::_('COM_EASYJOOMLABACKUP_DOWNLOAD_ERROR');
            $type = 'error';
            $this->setRedirect(JRoute::_('index.php?option=com_easyjoomlabackup', false), $message, $type);
        }
    }

    /**
     * Aborts the selected backup process
     */
    public function cancel()
    {
        $message = JText::_('COM_EASYJOOMLABACKUP_BACKUP_CANCELLED');
        $this->setRedirect('index.php?option=com_easyjoomlabackup', $message, 'notice');
    }

    /**
     * Starts the full backup process with an ACL check
     *
     * @return object
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
     * @return object
     * @throws Exception
     */
    public function backupCreateFullbackup()
    {
        if (!JFactory::getUser()->authorise('easyjoomlabackup.fullbackup', 'com_easyjoomlabackup')) {
            throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        $this->backupCreate('fullbackup');
    }

    /**
     * Creates the backup archive in dependence on the submitted type
     *
     * @param string $backupType
     */
    private function backupCreate($backupType)
    {
        JSession::checkToken() || jexit('Invalid Token');

        // Try to increase all relevant settings to prevent timeouts on big sites
        @ini_set('memory_limit', '512M');
        @ini_set('error_reporting', 0);
        @set_time_limit(3600);

        $model = $this->getModel('createbackup');

        $message = JText::_('COM_EASYJOOMLABACKUP_BACKUP_SAVED_ERROR');
        $type = 'error';

        if ($model->createBackup($backupType)) {
            $message = JText::_('COM_EASYJOOMLABACKUP_BACKUP_SAVED');
            $type = 'message';

            // Remove unneeded backup files
            if ($model->removeBackupFilesMax()) {
                $message .= ' ' . JText::_('COM_EASYJOOMLABACKUP_MAXNUMBERBACKUPS_REMOVED');
            }
        }

        $this->setRedirect('index.php?option=com_easyjoomlabackup', $message, $type);
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
        if (!JFactory::getUser()->authorise('easyjoomlabackup.databasebackup', 'com_easyjoomlabackup')) {
            throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        $this->backupCreate('databasebackup');
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
        if (!JFactory::getUser()->authorise('easyjoomlabackup.filebackup', 'com_easyjoomlabackup')) {
            throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        $this->backupCreate('filebackup');
    }
}
