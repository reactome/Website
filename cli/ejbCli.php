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

use Joomla\CMS\MVC\Model\BaseDatabaseModel;
use Joomla\CMS\{Factory, Application\CliApplication};

if (PHP_SAPI !== 'cli') {
    die('This is a command line only application.');
}

const _JEXEC = 1;

if (file_exists(dirname(__DIR__) . '/defines.php')) {
    require_once dirname(__DIR__) . '/defines.php';
}

if (!defined('_JDEFINES')) {
    define('JPATH_BASE', dirname(__DIR__));
    require_once JPATH_BASE . '/includes/defines.php';
}

require_once JPATH_LIBRARIES . '/import.legacy.php';
require_once JPATH_LIBRARIES . '/cms.php';
require_once JPATH_CONFIGURATION . '/configuration.php';

$config = new JConfig();

error_reporting(E_ALL);
@ini_set('display_errors', 1);

/**
 * Command line script to create backup files with Easy Joomla Backup
 *
 * @since   3.0.0-FREE
 * @version 3.4.0.0-FREE
 */
class EasyJoomlaBackupCronCli extends CliApplication
{
    /**
     * Entry point for CLI script
     *
     * @throws Exception
     * @since   3.0.0-FREE
     * @version 3.4.0.0-FREE
     */
    public function doExecute(): void
    {
        $type = $this->getBackupType();

        $_SERVER['HTTP_HOST'] = '';
        Factory::getApplication('administrator');

        $this->backupCreate($type);
    }

    /**
     * Gets the backup type for the execution
     *
     * @return string
     * @since 3.4.0.0-FREE
     */
    private function getBackupType(): string
    {
        $argv = $this->input->get('arg', [], 'ARRAY');

        if (empty($argv[1])) {
            return 'fullbackup';
        }

        $typeArg = (int)$argv[1];

        if (empty($typeArg) || (!in_array($typeArg, [1, 2, 3], true))) {
            return 'fullbackup';
        }

        if ($typeArg === 2) {
            return 'databasebackup';
        }

        if ($typeArg === 3) {
            return 'filebackup';
        }

        return 'fullbackup';
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
        @set_time_limit(0);

        require_once JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/helpers/Autoload.php';

        JLoader::import('createbackup', JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/models');

        /* @var EasyJoomlaBackupModelCreatebackup $model */
        $model = BaseDatabaseModel::getInstance('createbackup', 'EasyJoomlaBackupModel');

        if ($model->createBackup($type, 'cli')) {
            $model->removeBackupFilesMax();
            Factory::getApplication()->close('1');
        }

        Factory::getApplication()->close('0');
    }
}

$cliStart = CliApplication::getInstance('EasyJoomlaBackupCronCli');
$cliStart->input->set('arg', $argv);
$cliStart->execute();
