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

use Joomla\CMS\MVC\Model\BaseDatabaseModel;
use Joomla\CMS\{Plugin\CMSPlugin, Factory, Uri\Uri};

/**
 * Class PlgSystemEasyJoomlaBackupCronjob
 *
 * @since   3.0.0-FREE
 * @version 3.4.0.0-FREE
 */
class PlgSystemEasyJoomlaBackupCronjob extends CMSPlugin
{
    /**
     * PlgSystemEasyJoomlaBackupCronjob constructor.
     *
     * @param object $subject
     * @param array  $config
     *
     * @throws Exception
     * @since 3.0.0-FREE
     */
    public function __construct(object $subject, array $config)
    {
        parent::__construct($subject, $config);
    }

    /**
     * The backup process via a cronjob is executed in the trigger onAfterRender
     *
     * @throws Exception
     * @since   3.0.0-FREE
     * @version 3.4.0.0-FREE
     */
    public function onAfterRender(): void
    {
        if (Factory::getApplication()->isClient('administrator')) {
            return;
        }

        $tokenRequest = Factory::getApplication()->input->get('ejbtoken', null, 'STRING');

        if (!empty($tokenRequest)) {
            $token = (string)$this->params->get('token');

            if ($tokenRequest === $token) {
                $this->backupCreate($this->getBackupType());
                Factory::getApplication()->redirect(Uri::getInstance()::current());
            }
        }
    }

    /**
     * Creates the backup archive in dependence on the submitted type
     * Based on the original controller function of the component
     *
     * @param string $type
     *
     * @throws Exception
     * @since   3.0.0-FREE
     * @version 3.4.0.0-FREE
     */
    private function backupCreate(string $type): void
    {
        @ini_set('memory_limit', -1);
        @ini_set('error_reporting', 0);
        @set_time_limit(0);

        require_once JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/helpers/Autoload.php';

        JLoader::import('createbackup', JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/models');

        /* @var EasyJoomlaBackupModelCreatebackup $model */
        $model = BaseDatabaseModel::getInstance('createbackup', 'EasyJoomlaBackupModel');
        $model->createBackup($type, 'plugin');
        $model->removeBackupFilesMax();
    }

    /**
     * Gets the backup type for the execution
     *
     * @return string
     * @throws Exception
     * @since 3.4.0.0-FREE
     */
    private function getBackupType(): string
    {
        $type = Factory::getApplication()->input->get('ejbtype', null, 'INTEGER');

        if (empty($type) || (!in_array($type, [1, 2, 3], true))) {
            $type = (int)$this->params->get('type');
        }

        if ($type === 2) {
            return 'databasebackup';
        }

        if ($type === 3) {
            return 'filebackup';
        }

        return 'fullbackup';
    }
}
