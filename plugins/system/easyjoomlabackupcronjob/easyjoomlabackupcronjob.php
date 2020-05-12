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

use Joomla\CMS\{Plugin\CMSPlugin, Factory, Uri\Uri, MVC\Model\BaseDatabaseModel};

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
    public function __construct(object &$subject, array $config)
    {
        if (Factory::getApplication()->isClient('administrator')) {
            return;
        }

        parent::__construct($subject, $config);
    }

    /**
     * The backup process via a cronjob is executed in the trigger onAfterRender
     *
     * @since 3.0.0-FREE
     */
    public function onAfterRender()
    {
        $tokenRequest = Factory::getApplication()->input->get('ejbtoken', null, 'STRING');

        if (!empty($tokenRequest)) {
            $token = (string)$this->params->get('token');

            if ($tokenRequest === $token) {
                $type = Factory::getApplication()->input->get('ejbtype', null, 'INTEGER');

                if (empty($type) || (!in_array($type, [1, 2, 3]))) {
                    $type = (int)$this->params->get('type');
                }

                if ($type === 1) {
                    $type = 'fullbackup';
                } elseif ($type === 2) {
                    $type = 'databasebackup';
                } elseif ($type === 3) {
                    $type = 'filebackup';
                }

                $this->backupCreate($type);
                Factory::getApplication()->redirect(Uri::getInstance()->current());
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
     * @since 3.0.0-FREE
     */
    private function backupCreate(string $type)
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
}
