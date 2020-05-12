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

use Joomla\CMS\{Factory, Application\CliApplication, MVC\Model\BaseDatabaseModel};

// Make sure we're being called from the command line, not a web interface
if (PHP_SAPI !== 'cli') {
    die('This is a command line only application.');
}

// We are a valid entry point.
const _JEXEC = 1;

// Load system defines
if (file_exists(dirname(__DIR__) . '/defines.php')) {
    require_once dirname(__DIR__) . '/defines.php';
}

if (!defined('_JDEFINES')) {
    define('JPATH_BASE', dirname(__DIR__));
    require_once JPATH_BASE . '/includes/defines.php';
}

// Get the framework.
require_once JPATH_LIBRARIES . '/import.legacy.php';

// Bootstrap the CMS libraries.
require_once JPATH_LIBRARIES . '/cms.php';

// Import the configuration.
require_once JPATH_CONFIGURATION . '/configuration.php';

// System configuration.
$config = new JConfig;

// Configure error reporting to maximum for CLI output.
error_reporting(E_ALL);
@ini_set('display_errors', 1);

/**
 * Command line script to create backup files with Easy Joomla Backup
 *
 * @since 3.0.0-FREE
 */
class EasyJoomlaBackupCronCli extends CliApplication
{
    /**
     * Entry point for CLI script
     *
     * @throws Exception
     * @since 3.0.0-FREE
     */
    public function doExecute()
    {
        $argv = $this->input->get('arg', [], 'ARRAY');

        if (empty($argv[1])) {
            $argv[1] = 1;
        }

        $type = (int)$argv[1];

        // Set default backup typ if wrong or no argument is provided
        if (!intval($type) || (!in_array($type, [1, 2, 3]))) {
            $type = 1;
        }

        // Set the correct type name how it is used in the component
        if ($type == 1) {
            $type = 'fullbackup';
        } elseif ($type == 2) {
            $type = 'databasebackup';
        } elseif ($type == 3) {
            $type = 'filebackup';
        }

        $_SERVER['HTTP_HOST'] = '';
        Factory::getApplication('administrator');

        // Okay, we have everything to start the backup process - let's do it!
        $this->backupCreate($type);
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
        // Try to increase all relevant settings to prevent timeouts on big sites
        @ini_set('memory_limit', -1);
        @set_time_limit(0);

        require_once JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/helpers/Autoload.php';

        // Load the correct model from the component
        JLoader::import('createbackup', JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/models');
        /* @var EasyJoomlaBackupModelCreatebackup $model */
        $model = BaseDatabaseModel::getInstance('createbackup', 'EasyJoomlaBackupModel');

        // Execute the backup process
        if ($model->createBackup($type, 'cli')) {
            // Remove unneeded backup files
            $model->removeBackupFilesMax();

            // Backup was created successfully, the result is 1
            Factory::getApplication()->close('1');
        }

        // If an error occured, the result is 0
        Factory::getApplication()->close('0');
    }
}

// Start the execution process of the CLI script
$cliStart = CliApplication::getInstance('EasyJoomlaBackupCronCli');
$cliStart->input->set('arg', $argv);
$cliStart->execute();
