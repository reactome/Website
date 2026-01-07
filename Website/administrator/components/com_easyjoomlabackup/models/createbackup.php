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
use Joomla\CMS\MVC\Model\BaseDatabaseModel;
use Joomla\CMS\{Input\Input, Application\CMSApplication, Date\Date, Factory, Uri\Uri, Table\Table, Language\Text, User\UserHelper, Component\ComponentHelper, Filesystem\File, Filesystem\Folder};
use Joomla\Registry\Registry;

/**
 * Class EasyJoomlaBackupModelCreatebackup
 *
 * @since   3.0.0-FREE
 * @version 3.4.1.0-FREE
 */
class EasyJoomlaBackupModelCreatebackup extends BaseDatabaseModel
{
    /**
     * @var string DEFAULT_PREFIX
     * @since 3.0.0-FREE
     */
    public const DEFAULT_PREFIX = 'easy-joomla-backup';

    /**
     * @var CMSApplication $app
     * @since 3.0.0-FREE
     */
    protected $app;

    /**
     * @var Date $backupDatetime
     * @since 3.0.0-FREE
     */
    protected $backupDatetime;

    /**
     * @var string $backupFolder
     * @since 3.0.0-FREE
     */
    protected $backupFolder;

    /**
     * @var string $backupPath
     * @since 3.0.0-FREE
     */
    protected $backupPath;

    /**
     * @var JDatabaseDriver $db
     * @since 3.0.0-FREE
     */
    protected $db;

    /**
     * @var bool $externalAttributes
     * @since 3.0.0-FREE
     */
    protected $externalAttributes = false;

    /**
     * @var Input $input
     * @since 3.0.0-FREE
     */
    protected $input;

    /**
     * @var int $maximumExecutionLevel
     * @since 3.3.0-FREE
     */
    protected $maximumExecutionLevel;

    /**
     * @var float $maximumExecutionTime
     * @since 3.3.0-FREE
     */
    protected $maximumExecutionTime;

    /**
     * @var float $maximumExecutionTimeDefault
     * @since 3.3.0-FREE
     */
    protected $maximumExecutionTimeDefault = 10.0;

    /**
     * @var int $maximumExecutionLevelDefault
     * @since 3.3.0-FREE
     */
    protected $maximumExecutionLevelDefault = 6;

    /**
     * @var Registry $params
     * @since 3.0.0-FREE
     */
    protected $params;

    /**
     * @var int $maximumListLimit
     * @since 3.4.0.0-FREE
     */
    protected $maximumListLimit = 100000;

    /**
     * @var int $maximumInsertLimit
     * @since 3.4.0.0-FREE
     */
    protected $maximumInsertLimit = 250;

    /**
     * @var string $fileName
     * @since 3.4.0.0-FREE
     */
    protected $fileName = '';

    /**
     * @var string $fileNameDatabase
     * @since 3.4.0.0-FREE
     */
    protected $fileNameDatabase = '';

    /**
     * @var object $iterator
     * @since 3.4.0.0-FREE
     */
    protected $iterator;

    /**
     * EasyJoomlaBackupModelCreatebackup constructor.
     *
     * @throws Exception
     * @since 3.0.0-FREE
     */
    public function __construct()
    {
        parent::__construct();

        $this->db = Factory::getDbo();
        $this->app = Factory::getApplication();
        $this->input = $this->app->input;
        $this->params = ComponentHelper::getParams('com_easyjoomlabackup');
        $this->backupFolder = JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/backups/';
        $this->backupDatetime = Factory::getDate('now', $this->app->get('offset'));
        $this->maximumExecutionTime = (float)$this->getMaximumExecutionTime();
        $this->maximumExecutionLevel = (int)$this->getMaximumExecutionLevel();
    }

    /**
     * Gets the maximum execution time for each batch process
     *
     * @return float
     * @since 3.3.0-FREE
     */
    private function getMaximumExecutionTime(): float
    {
        return $this->maximumExecutionTimeDefault;
    }

    /**
     * Gets the maximum execution level for initial scanning process
     *
     * @return int
     * @since 3.3.0-FREE
     */
    private function getMaximumExecutionLevel(): int
    {
        return $this->maximumExecutionLevelDefault;
    }

    /**
     * Main function for the backup process
     *
     * @param string $type
     * @param string $hash
     *
     * @return array
     * @throws Exception
     * @since   3.3.0-FREE
     * @version 3.4.0.0-FREE
     */
    public function createBackupAjax(string $type, string $hash): array
    {
        // Check whether Zip class exists
        if (!class_exists('ZipArchive')) {
            return [];
        }

        $this->externalAttributes = $this->checkExternalAttributes();

        $status = true;
        $statusDb = true;

        $this->fileName = $this->createFilenameAjax($hash);
        $this->backupPath = $this->backupFolder . $this->fileName;

        // Prepare backup process
        if (!File::exists($this->backupPath)) {
            $this->prepareBackupProcess($type, $hash);

            $message = ($type === 'databasebackup') ? Text::_('COM_EASYJOOMLABACKUP_BACKUPMODAL_INITIALISE_DB') : Text::sprintf('COM_EASYJOOMLABACKUP_BACKUPMODAL_LASTFOLDER', 'root');

            return [
                'hash'     => $hash,
                'finished' => false,
                'percent'  => 0,
                'message'  => $message,
            ];
        }

        // Create file system backup
        if ($type === 'filebackup' || $type === 'fullbackup') {
            $fileBackupDone = (bool)$this->app->getUserState('ejb.' . $hash . '.fileBackupDone', false);

            if (!$fileBackupDone) {
                $status = $this->createBackupZipArchiveFilesAjax($hash);

                $foldersIteration = (array)$this->app->getUserState('ejb.' . $hash . '.foldersIteration', []);
                $foldersIterationCount = (int)$this->app->getUserState('ejb.' . $hash . '.foldersIterationCount', 1);
                $message = Text::sprintf('COM_EASYJOOMLABACKUP_BACKUPMODAL_LASTFOLDER', $foldersIteration[0]['relname']);
                $totalPercentage = ($type === 'fullbackup') ? 90 : 100;

                if ($status) {
                    $this->app->setUserState('ejb.' . $hash . '.fileBackupDone', true);
                    $foldersIteration = [];
                    $foldersIterationCount = 1;
                    $message = ($type === 'fullbackup') ? Text::_('COM_EASYJOOMLABACKUP_BACKUPMODAL_FILEBACKUPDONE_DB') : Text::_('COM_EASYJOOMLABACKUP_BACKUPMODAL_FILEBACKUPDONE');
                }

                return [
                    'hash'     => $hash,
                    'finished' => false,
                    'percent'  => $totalPercentage - round(count($foldersIteration) * $totalPercentage / $foldersIterationCount),
                    'message'  => $message,
                ];
            }
        }

        // Create database backup
        if ($type === 'databasebackup' || $type === 'fullbackup') {
            $this->setFileNameDatabase();
            $dbBackupDone = (bool)$this->app->getUserState('ejb.' . $hash . '.dbBackupDone', false);

            if (!$dbBackupDone) {
                $statusDb = $this->createBackupSqlArchiveDatabaseAjax($hash);
                $dbTables = (array)$this->app->getUserState('ejb.' . $hash . '.dbTables', []);
                $dbTablesCount = (int)$this->app->getUserState('ejb.' . $hash . '.dbTablesCount', 1);
                $message = Text::sprintf('COM_EASYJOOMLABACKUP_BACKUPMODAL_LASTTABLE', $dbTables[0]);
                $totalPercentage = ($type === 'fullbackup') ? 10 : 100;

                if ($statusDb) {
                    $this->app->setUserState('ejb.' . $hash . '.dbBackupDone', true);
                    $dbTables = [];
                    $dbTablesCount = 1;
                    $message = ($type === 'fullbackup') ? Text::_('COM_EASYJOOMLABACKUP_BACKUPMODAL_FILEDATABASEBACKUPDONE_DB') : Text::_('COM_EASYJOOMLABACKUP_BACKUPMODAL_DATABASEBACKUPDONE');
                }

                return [
                    'hash'     => $hash,
                    'finished' => false,
                    'percent'  => ($type === 'fullbackup' ? 90 : 0) + $totalPercentage - round(count($dbTables) * $totalPercentage / $dbTablesCount),
                    'message'  => $message,
                ];
            }

            $this->createBackupSqlArchiveDatabasePostProcess($hash);
            $this->createBackupZipArchiveDatabaseAjax();
        }

        // Backup process finished successfully
        if (!empty($status) && !empty($statusDb)) {
            // Add path of table - this is important for the cronjob system plugin
            Table::addIncludePath(JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/tables');
            $table = $this->getTable('createbackup', 'EasyJoomlaBackupTable');

            $data = [];
            $data['date'] = $this->backupDatetime->toSql();
            $data['type'] = $type;
            $data['name'] = $this->fileName;
            $data['size'] = filesize($this->backupFolder . $this->fileName);

            $startProcess = $this->app->getUserState('ejb.' . $hash . '.startProcess', microtime(true));
            $data['duration'] = round(microtime(true) - $startProcess, 2);
            $data['comment'] = $this->input->get('comment', '', 'STRING');

            if (!$table->save($data)) {
                throw new Exception(Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 404);
            }

            // Backup process executed completely
            return [
                'hash'           => $hash,
                'finished'       => true,
                'percent'        => 100,
                'backupLastFile' => Text::_('COM_EASYJOOMLABACKUP_BACKUPMODAL_DONE'),
            ];
        }

        return [];
    }

    /**
     * Check whether required function to set the permission rights on UNIX systems is available
     * Since PHP 5 >= 5.6.0, PHP 7, PECL zip >= 1.12.4
     *
     * @return bool
     * @since   3.0.0-FREE
     * @version 3.4.0.0-FREE
     */
    private function checkExternalAttributes(): bool
    {
        $zipObject = new ZipArchive();

        return method_exists($zipObject, 'setExternalAttributesName');
    }

    /**
     * Creates a filename for the backup archive from the URL, the date and a random string
     *
     * @param string $hash
     *
     * @return string
     * @since 3.3.0-FREE
     */
    private function createFilenameAjax(string &$hash): string
    {
        if (!empty($hash)) {
            $fileName = $this->app->getUserState('ejb.' . $hash . '.filename');

            if (!empty($fileName)) {
                return $fileName;
            }
        }

        $fileName = $this->getFileNamePrefix() . '_' . $this->backupDatetime->format('Y-m-d_H-i-s', true);

        // If name already exists try it with another one
        if (is_file($this->backupFolder . $fileName)) {
            $fileName = $this->createFilenameAjax($hash);
        }

        // Add a suffix to make the archive name unguessable
        $addSuffix = $this->params->get('add_suffix_archive', 1);

        if (!empty($addSuffix)) {
            $fileName .= '_' . UserHelper::genRandomPassword(16);
        }

        $fileName .= '.zip';

        // Store file name into the session using a hash value
        $hash = md5($fileName);
        $this->app->setUserState('ejb.' . $hash . '.filename', $fileName);

        return $fileName;
    }

    /**
     * Gets the filename prefix for the archive files
     *
     * @param bool $hostOnly
     *
     * @return string
     * @since 3.0.0-FREE
     */
    private function getFileNamePrefix(bool $hostOnly = false): string
    {
        if ($this->params->get('prefix_archive')) {
            return strtolower(preg_replace('@\s+@', '-', $this->params->get('prefix_archive')));
        }

        if ($hostOnly) {
            return (string)Uri::getInstance()->getHost();
        }

        $root = (string)Uri::root();

        if (!empty($root)) {
            return implode('-', array_filter(explode('/', str_replace(['http://', 'https://', ':'], '', $root))));
        }

        return self::DEFAULT_PREFIX;
    }

    /**
     * Prepares the backup process with all required states
     *
     * @param string $backupType
     * @param string $hash
     *
     * @since   3.3.0-FREE
     * @version 3.4.0.0-FREE
     */
    private function prepareBackupProcess(string $backupType, string $hash): void
    {
        $this->app->setUserState('ejb.' . $hash . '.startProcess', microtime(true));

        // Database information
        if ($backupType === Helper::BACKUP_TYPE_DATABASE || $backupType === Helper::BACKUP_TYPE_FULL) {
            $prefix = $this->db->getPrefix();
            $tables = $this->db->getTableList();

            $additionalDbTables = $this->params->get('add_db_tables');
            $additionalDbTables = array_map('trim', explode("\n", $additionalDbTables));

            $tables = array_filter(
                $tables,
                static function ($table) use ($prefix, $additionalDbTables) {
                    return strpos($table, $prefix) === 0 || in_array($table, $additionalDbTables, true);
                }
            );

            $this->app->setUserState('ejb.' . $hash . '.dbTables', $tables);
            $this->app->setUserState('ejb.' . $hash . '.dbTablesCount', count($tables));
            $this->app->setUserState('ejb.' . $hash . '.dbBackupDone', false);
        }

        // File system information
        if ($backupType === Helper::BACKUP_TYPE_FILE || $backupType === Helper::BACKUP_TYPE_FULL) {
            $filesRoot = Folder::files(JPATH_ROOT, '.', false, false, [], []);
            $foldersIteration = Folder::listFolderTree(JPATH_ROOT, '.', $this->maximumExecutionLevel);

            // Remove first slash from relname property
            foreach ($foldersIteration as &$folderIteration) {
                if (strncmp($folderIteration['relname'], '/', 1) === 0) {
                    $folderIteration['relname'] = substr($folderIteration['relname'], 1);
                }
            }

            unset($folderIteration);

            $this->app->setUserState('ejb.' . $hash . '.filesRoot', $filesRoot);
            $this->app->setUserState('ejb.' . $hash . '.foldersIteration', $foldersIteration);
            $this->app->setUserState('ejb.' . $hash . '.foldersIterationCount', count($foldersIteration));
            $this->app->setUserState('ejb.' . $hash . '.fileBackupDone', false);
        }

        // Write an empty file to finalise prepare process
        File::write($this->backupPath, '');
    }

    /**
     * Creates the archive file of all files from the Joomla! installation with a possible exclusion of files and folders
     *
     * @param string $hash
     *
     * @return bool
     * @throws Exception
     * @since   3.3.0-FREE
     * @version 3.4.0.0-FREE
     */
    private function createBackupZipArchiveFilesAjax(string $hash): bool
    {
        // Prepare files which should be excluded
        $excludeFiles = $this->params->get('exclude_files', []);

        if (!empty($excludeFiles)) {
            $excludeFiles = array_map('trim', explode("\n", $excludeFiles));
        }

        // Prepare folders which should be excluded
        $excludeFolders = $this->params->get('exclude_folders', []);

        if (!empty($excludeFolders)) {
            $excludeFolders = array_map('trim', explode("\n", $excludeFolders));
        }

        if (!$dir = @opendir(JPATH_ROOT)) {
            throw new Exception('Error: Root path could not be opened!');
        }

        $filesRoot = (array)$this->app->getUserState('ejb.' . $hash . '.filesRoot', []);

        if (!empty($filesRoot)) {
            $zipFile = new ZipArchive();

            if ($zipFile->open($this->backupPath, ZipArchive::CREATE) !== true) {
                throw new Exception('Error: Zip file could not be created!');
            }

            foreach ($filesRoot as $file) {
                if (!empty($excludeFiles) && in_array($file, $excludeFiles, true)) {
                    continue;
                }

                // Add the files to the zip archive and set a correct local name
                $zipFile->addFile(JPATH_ROOT . '/' . $file, $file);
                $this->setExternalAttributes($zipFile, $file, fileperms(JPATH_ROOT . '/' . $file));
            }

            $zipFile->close();

            if ($zipFile->status !== 0) {
                throw new Exception('Error: Zip status is not correct!');
            }

            $this->app->setUserState('ejb.' . $hash . '.filesRoot', []);

            return false;
        }

        $foldersIteration = (array)$this->app->getUserState('ejb.' . $hash . '.foldersIteration', []);

        if (!empty($foldersIteration)) {
            // Create for all folders an own Zip Archive object to avoid memory overflow
            $zipFolder = new ZipArchive();

            if ($zipFolder->open($this->backupPath, ZipArchive::CREATE) !== true) {
                throw new Exception('Error: Zip file could not be created!');
            }

            while ($this->maximumExecutionTime > 0 && !empty($foldersIteration)) {
                $startTime = microtime(true);
                $folderIteration = array_shift($foldersIteration);
                $recursive = false;

                if (count(explode('/', $folderIteration['relname'])) === $this->maximumExecutionLevel) {
                    $recursive = true;
                }

                $this->zipFoldersAndFilesRecursiveAjax($zipFolder, JPATH_ROOT . '/' . $folderIteration['relname'], $folderIteration['relname'], $recursive, $excludeFiles, $excludeFolders);

                $endTime = microtime(true);
                $this->maximumExecutionTime -= $this->ceilDecimalDigits($endTime - $startTime, 2);
            }

            $zipFolder->close();

            if ($zipFolder->status !== 0) {
                throw new Exception('Error: Zip status is not correct!');
            }

            if (count($foldersIteration) >= 1) {
                $this->app->setUserState('ejb.' . $hash . '.foldersIteration', $foldersIteration);

                return false;
            }
        }

        return true;
    }

    /**
     * Sets external attributes
     *
     * @param object $zipObject
     * @param string $fileName
     * @param int    $filePermission
     *
     * @since   3.0.0-FREE
     * @version 3.4.0.0-FREE
     */
    private function setExternalAttributes(object $zipObject, string $fileName, int $filePermission): void
    {
        if ($this->externalAttributes) {
            $zipObject->setExternalAttributesName($fileName, ZipArchive::OPSYS_UNIX, $filePermission << 16);
        }
    }

    /**
     * Loads all files and (sub-)folders for the zip archive recursively
     *
     * @param object $zip
     * @param string $folder
     * @param string $folderRelative
     * @param bool   $recursive
     * @param array  $excludeFiles
     * @param array  $excludeFolders
     *
     * @return bool
     * @since   3.3.0-FREE
     * @version 3.4.0.0-FREE
     */
    private function zipFoldersAndFilesRecursiveAjax(object $zip, string $folder, string $folderRelative, bool $recursive, array $excludeFiles = [], array $excludeFolders = []): bool
    {
        // First check for globally excluded folders
        if (!empty($excludeFolders)) {
            foreach ($excludeFolders as $excludeFolder) {
                if (stripos($folderRelative, $excludeFolder) === 0) {
                    return true;
                }
            }
        }

        // Do not zip the folders of the backup archives, the cache and temp folders - only create empty folders
        $excludeFoldersCreateEmpty = ['administrator/components/com_easyjoomlabackup/backups', 'cache', 'tmp', 'administrator/cache'];

        // Check whether the loaded folder has to be excluded
        if (in_array($folderRelative, $excludeFoldersCreateEmpty, true)) {
            // Add empty folder - 0755
            $zip->addEmptyDir($folderRelative . '/');
            $this->setExternalAttributes($zip, $folderRelative . '/', 16877);

            // Add new file - 0644
            $zip->addFromString($folderRelative . '/index.html', '');
            $this->setExternalAttributes($zip, $folderRelative . '/index.html', 33188);

            // Add a .htaccess to the backup folder to protect the archive files
            if ($folderRelative === 'administrator/components/com_easyjoomlabackup/backups') {
                // Add .htaccess with Deny from all - 0444
                $zip->addFromString($folderRelative . '/.htaccess', 'Deny from all');
                $this->setExternalAttributes($zip, $folderRelative . '/.htaccess', 33060);
            }

            return true;
        }

        foreach ($excludeFoldersCreateEmpty as $excludeFolderCreateEmpty) {
            if (stripos($folderRelative, $excludeFolderCreateEmpty) === 0) {
                return true;
            }
        }

        // Add the called folder to the zip archive
        $zip->addEmptyDir($folderRelative . '/');
        $this->setExternalAttributes($zip, $folderRelative . '/', fileperms($folder . '/'));

        // Open the called folder path
        if (!$dir = @opendir($folder)) {
            return false;
        }

        // Go through the current folder and add data to the zip object
        while ($file = readdir($dir)) {
            if ($file !== '.' && $file !== '..' && is_dir($folder . '/' . $file)) {
                if (in_array($folderRelative . '/' . $file, $excludeFoldersCreateEmpty, true)) {
                    // Add empty folder - 0755
                    $zip->addEmptyDir($folderRelative . '/' . $file . '/');
                    $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/', 16877);

                    // Add new file - 0644
                    $zip->addFromString($folderRelative . '/' . $file . '/index.html', '');
                    $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/index.html', 33188);

                    // Add a .htaccess to the backup folder to protect the archive files
                    if ($folderRelative . '/' . $file === 'administrator/components/com_easyjoomlabackup/backups') {
                        // Add .htaccess with Deny from all - 0444
                        $zip->addFromString($folderRelative . '/' . $file . '/.htaccess', 'Deny from all');
                        $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/.htaccess', 33060);
                    }

                    continue;
                }

                if (!empty($excludeFolders) && in_array($folderRelative . '/' . $file, $excludeFolders, true)) {
                    continue;
                }

                $zip->addEmptyDir($folderRelative . '/' . $file . '/');
                $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/', fileperms($folder . '/' . $file . '/'));

                if ($recursive) {
                    $this->zipFoldersAndFilesRecursiveAjax($zip, $folder . '/' . $file, $folderRelative . '/' . $file, $recursive, $excludeFiles, $excludeFolders);
                }
            } elseif (is_file($folder . '/' . $file)) {
                if (!empty($excludeFiles) && in_array($folderRelative . '/' . $file, $excludeFiles, true)) {
                    continue;
                }

                // Add the files to the zip archive and set a correct local name
                $zip->addFile($folder . '/' . $file, $folderRelative . '/' . $file);
                $this->setExternalAttributes($zip, $folderRelative . '/' . $file, fileperms($folder . '/' . $file));
            }
        }

        closedir($dir);

        return true;
    }

    /**
     * Helper function to apply the ceil function to float numbers with decimal digits (default precision = 2)
     *
     * @param float $value
     * @param int   $precision
     *
     * @return float|int
     * @since   3.0.0-FREE
     * @version 3.4.0.0-FREE
     */
    private function ceilDecimalDigits(float $value, int $precision = 2)
    {
        return ceil($value * (10 ** $precision)) / (10 ** $precision);
    }

    /**
     * Sets the database filename
     *
     * @since 3.4.0.0-FREE
     */
    private function setFileNameDatabase(): void
    {
        $this->fileNameDatabase = str_replace('.zip', '', $this->fileName) . '.sql';
    }

    /**
     * Creates a complete dump of the Joomla! database as a SQL file
     *
     * @param string $hash
     *
     * @return bool
     * @since   3.4.0.0-FREE
     * @version 3.4.1.0-FREE
     */
    private function createBackupSqlArchiveDatabaseAjax(string $hash): bool
    {
        // Create a temporary sql file first. This is required to avoid memory timeouts on large databases!
        if (!File::exists($this->backupFolder . $this->fileNameDatabase)) {
            $data = Helper::getDatabaseDumpHeader();
            $this->writeDatabaseFile($data);
        }

        $dbTables = (array)$this->app->getUserState('ejb.' . $hash . '.dbTables', []);

        while ($this->maximumExecutionTime > 0 && !empty($dbTables)) {
            $startTime = microtime(true);
            $dbTable = array_shift($dbTables);

            $this->backupDatabaseAjax($dbTable, $hash);

            $endTime = microtime(true);
            $this->maximumExecutionTime -= $this->ceilDecimalDigits($endTime - $startTime, 2);
        }

        if (count($dbTables) >= 1) {
            $this->app->setUserState('ejb.' . $hash . '.dbTables', $dbTables);

            return false;
        }

        return true;
    }

    /**
     * Adds the data to the temporary dump file and cleans the data string
     *
     * @param string $data
     *
     * @since 3.4.0.0-FREE
     */
    private function writeDatabaseFile(string &$data): void
    {
        file_put_contents($this->backupFolder . $this->fileNameDatabase, $data, FILE_APPEND);
        $data = '';
    }

    /**
     * Creates a SQL Dump of the Joomla! database and add it directly to the archive
     *
     * @param string $dbTable
     * @param string $hash
     *
     * @return void
     * @since   3.4.0.0-FREE
     * @version 3.4.1.0-FREE
     */
    private function backupDatabaseAjax(string $dbTable, string $hash): void
    {
        $this->db->setUtf();
        $dbPrefix = $this->db->getPrefix();
        $addDropStatement = $this->params->get('add_drop_statement');

        // Add additional database tables
        $addDbTables = $this->params->get('add_db_tables', []);

        if (!empty($addDbTables)) {
            $addDbTables = array_map('trim', explode("\n", $addDbTables));
        }

        if (stripos($dbTable, $dbPrefix) !== false || in_array($dbTable, $addDbTables, true)) {
            if (!empty($addDropStatement)) {
                $data = 'DROP TABLE IF EXISTS ' . $dbTable . ';' . "\n";
                $this->writeDatabaseFile($data);
            }

            // Set the query to get the table CREATE statement.
            $this->db->setQuery('SHOW CREATE TABLE ' . $dbTable);
            $rowCreate = $this->db->loadRow();
            $this->checkPostProcessDataCreateTable($rowCreate, $hash);

            $data = $rowCreate[1] . ";\n\n";
            $this->writeDatabaseFile($data);

            $tableInformation = $this->db->getTableColumns($dbTable);
            $numFields = count($tableInformation);
            $tableColumnTypes = array_values($tableInformation);

            $this->db->setQuery('SELECT * FROM ' . $dbTable);
            $this->db->execute();
            $count = $this->db->getNumRows();

            if ($count > 0) {
                $passes = (int)ceil($count / $this->maximumListLimit);
                $this->iterator = $this->db->getIterator();

                for ($round = 0; $round < $passes; $round++) {
                    $rowList = $this->getRowList($passes);
                    $this->addRowEntries($rowList, $numFields, $tableColumnTypes, $dbTable);
                }
            }

            $data .= "\n\n";
            $this->writeDatabaseFile($data);
        }
    }

    /**
     * Checks the create database command for post process rules
     *
     * @param array  $rowCreate
     * @param string $hash
     *
     * @since 3.4.1.0-FREE
     */
    private function checkPostProcessDataCreateTable(array &$rowCreate, string $hash): void
    {
        if (empty($rowCreate) || count($rowCreate) !== 2) {
            return;
        }

        if (strpos($rowCreate[1], 'CONSTRAINT') === false) {
            return;
        }

        [$tableName, $createTableCommand] = $rowCreate;
        $postProcessData = (array)$this->app->getUserState('ejb.' . $hash . '.postProcessData', []);

        preg_match('@\(\n?(.*)\n?\)@s', $createTableCommand, $matchColumnsDefinition);
        $matchColumnsDefinitionArray = array_filter(array_map('trim', explode("\n", $matchColumnsDefinition[1])));

        foreach ($matchColumnsDefinitionArray as $matchColumnsDefinitionArrayKey => &$matchColumnsDefinitionArrayValue) {
            if (strncmp($matchColumnsDefinitionArrayValue, 'CONSTRAINT', 10) === 0) {
                $postProcessData[] = [
                    'type'    => 'constraint',
                    'table'   => $tableName,
                    'command' => Helper::removeTrailingComma($matchColumnsDefinitionArrayValue),
                ];

                unset($matchColumnsDefinitionArray[$matchColumnsDefinitionArrayKey]);
                continue;
            }

            $matchColumnsDefinitionArrayValue = '  ' . Helper::removeTrailingComma($matchColumnsDefinitionArrayValue);
        }

        unset($matchColumnsDefinitionArrayValue);

        $this->app->setUserState('ejb.' . $hash . '.postProcessData', $postProcessData);
        $rowCreate[1] = str_replace($matchColumnsDefinition[1], implode(',' . "\n", $matchColumnsDefinitionArray) . "\n", $createTableCommand);
    }

    /**
     * Gets a list of database entries from the table query - using an iterator if too many entries
     *
     * @param int $passes
     *
     * @return array|mixed
     * @since 3.4.0.0-FREE
     */
    private function getRowList(int $passes)
    {
        if ($passes === 1) {
            return $this->db->loadRowList();
        }

        $rowList = [];
        $iteratorCount = 0;

        foreach ($this->iterator as $row) {
            if ($iteratorCount >= $this->maximumListLimit) {
                break;
            }

            if (!empty($row)) {
                $rowList[] = array_values((array)$row);
                $iteratorCount++;
            }
        }

        return $rowList;
    }

    /**
     * Adds insert values to the dump file
     *
     * @param array  $rowList
     * @param int    $numFields
     * @param array  $tableColumns
     * @param string $table
     *
     * @since 3.4.0.0-FREE
     */
    private function addRowEntries(array $rowList, int $numFields, array $tableColumns, string $table): void
    {
        $countEntries = 0;
        $count = count($rowList);
        $data = 'INSERT INTO `' . $table . '` VALUES' . "\n";

        foreach ($rowList as $row) {
            $countEntries++;
            $data .= '(';

            for ($j = 0; $j < $numFields; $j++) {
                // First check whether the value is NULL to avoid loss
                if ($row[$j] === null) {
                    $data .= 'NULL';
                } else {
                    // Prepare data for a correct syntax
                    $row[$j] = str_replace(['\\', '\'', "\0", "\r\n"], ['\\\\', '\'\'', '\0', '\r\n'], $row[$j]);

                    if (isset($row[$j])) {
                        if (is_numeric($row[$j]) && stripos($tableColumns[$j], 'int') !== false) {
                            $data .= $row[$j];
                        } else {
                            $data .= '\'' . $row[$j] . '\'';
                        }
                    } else {
                        $data .= '\'\'';
                    }
                }

                if ($j < ($numFields - 1)) {
                    $data .= ', ';
                }
            }

            if ($countEntries < $count) {
                // Add a new INSERT INTO statement to avoid timeouts
                if ($countEntries % $this->maximumInsertLimit === 0) {
                    $data .= ");\n";
                    $data .= 'INSERT INTO `' . $table . '` VALUES' . "\n";
                } else {
                    $data .= "),\n";
                }
            }
        }

        $data .= ");\n";
        $this->writeDatabaseFile($data);
    }

    /**
     * Adds post process data
     *
     * @param string $hash
     *
     * @since 3.4.1.0-FREE
     */
    private function createBackupSqlArchiveDatabasePostProcess(string $hash): void
    {
        $postProcessData = (array)$this->app->getUserState('ejb.' . $hash . '.postProcessData', []);

        if (empty($postProcessData)) {
            return;
        }

        $data = '';

        foreach ($postProcessData as $postProcessDatum) {
            if ($postProcessDatum['type'] === 'constraint') {
                $data .= 'ALTER TABLE `' . $postProcessDatum['table'] . '`' . "\n" . '  ADD ' . $postProcessDatum['command'] . ";\n\n";
            }
        }

        $this->writeDatabaseFile($data);
    }

    /**
     * Creates a zip archive of the SQL dump file
     *
     * @return void
     * @since   3.3.0-FREE
     * @version 3.4.0.0-FREE
     */
    private function createBackupZipArchiveDatabaseAjax(): void
    {
        // SQL Dump - Backup the whole database of the Joomla! website and write it into the
        // archive file - only if the zip archive could be created
        $zipDatabase = new ZipArchive();

        if ($zipDatabase->open($this->backupFolder . $this->fileName, ZipArchive::CREATE) !== true) {
            return;
        }

        if (!File::exists($this->backupFolder . $this->fileNameDatabase)) {
            return;
        }

        // Add file which was created from the database export to the zip archive - 0640
        $zipDatabase->addFile($this->backupFolder . $this->fileNameDatabase, $this->fileNameDatabase);
        $this->setExternalAttributes($zipDatabase, $this->fileNameDatabase, 33184);

        $zipDatabase->close();

        // Delete the temporary database dump files
        File::delete($this->backupFolder . $this->fileNameDatabase);
    }

    /**
     * Main function for the backup process - used in plugin and CLI script
     *
     * @param string $type
     * @param string $source
     *
     * @return bool
     * @throws Exception
     * @since 3.0.0-FREE
     */
    public function createBackup(string $type, string $source = ''): bool
    {
        // Check whether Zip class exists
        if (!class_exists('ZipArchive')) {
            return false;
        }

        $this->externalAttributes = $this->checkExternalAttributes();

        $start = microtime(true);
        $status = true;
        $statusDb = true;

        // Create name of the new archive
        $this->fileName = $this->createFilename();

        // Get all files and folders
        if ($type === 'filebackup' || $type === 'fullbackup') {
            $status = $this->createBackupZipArchiveFiles();
        }

        if ($type === 'databasebackup' || $type === 'fullbackup') {
            $statusDb = $this->createBackupZipArchiveDatabase();
        }

        // Zip archive created successfully
        if (!empty($status) && !empty($statusDb)) {
            // Add path of table - this is important for the cronjob system plugin
            Table::addIncludePath(JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/tables');
            $table = $this->getTable('createbackup', 'EasyJoomlaBackupTable');

            $data = [];
            $data['date'] = $this->backupDatetime->toSql();
            $data['type'] = $type;
            $data['name'] = $this->fileName;
            $data['size'] = filesize($this->backupFolder . $this->fileName);
            $data['duration'] = round(microtime(true) - $start, 2);
            $data['comment'] = $this->input->get('comment', '', 'STRING');

            if (!empty($source)) {
                Factory::getLanguage()->load('com_easyjoomlabackup', JPATH_ADMINISTRATOR);

                $data['comment'] = Text::_('COM_EASYJOOMLABACKUP_CRONJOBPLUGIN');

                if ($source === 'cli') {
                    $data['comment'] = Text::_('COM_EASYJOOMLABACKUP_CLISCRIPT');
                }
            }

            if (!$table->save($data)) {
                throw new Exception(Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 404);
            }

            return true;
        }

        return false;
    }

    /**
     * Creates a filename for the backup archive from the URL, the date and a random string
     *
     * @return string
     * @since   3.0.0-FREE
     * @version 3.4.0.0-FREE
     */
    private function createFilename(): string
    {
        $fileName = $this->getFileNamePrefix(true) . '_' . $this->backupDatetime->format('Y-m-d_H-i-s', true);

        // If name already exists try it with another one
        if (is_file($this->backupFolder . $fileName)) {
            $fileName = $this->createFilename();
        }

        // Add a suffix to make the archive name unguessable
        $addSuffix = $this->params->get('add_suffix_archive', 1);

        if (!empty($addSuffix)) {
            $fileName .= '_' . UserHelper::genRandomPassword(16);
        }

        $fileName .= '.zip';

        return $fileName;
    }

    /**
     * Creates the archive file of all files from the Joomla! installation with a possible exclusion of files and
     * folders
     *
     * @return bool
     * @since   3.0.0-FREE
     * @version 3.4.0.0-FREE
     */
    private function createBackupZipArchiveFiles(): bool
    {
        // Prepare files which should be excluded
        $excludeFiles = $this->params->get('exclude_files', []);

        if (!empty($excludeFiles)) {
            $excludeFiles = array_map('trim', explode("\n", $excludeFiles));
        }

        // Prepare folders which should be excluded
        $excludeFolders = $this->params->get('exclude_folders', []);

        if (!empty($excludeFolders)) {
            $excludeFolders = array_map('trim', explode("\n", $excludeFolders));
        }

        if (!$dir = @opendir(JPATH_ROOT)) {
            return false;
        }

        $filesArray = [];

        while ($file = readdir($dir)) {
            if ($file === '.' || $file === '..') {
                continue;
            }

            if (is_dir(JPATH_ROOT . '/' . $file)) {
                // Create for all folders an own Zip Archive object to avoid memory overflow
                $zipFolder = new ZipArchive();

                if ($zipFolder->open($this->backupFolder . $this->fileName, ZipArchive::CREATE) !== true) {
                    return false;
                }

                $this->zipFoldersAndFilesRecursive($zipFolder, JPATH_ROOT . '/' . $file, $file, $excludeFiles, $excludeFolders, $file);
                $zipFolder->close();

                if ($zipFolder->status !== 0) {
                    return false;
                }
            } elseif (is_file(JPATH_ROOT . '/' . $file)) {
                // First collect all files from the root in an array and add them at once to the archive later
                $filesArray[] = $file;
            }
        }

        // Add all files from the root to the archive
        if (!empty($filesArray)) {
            $zipFile = new ZipArchive();

            if ($zipFile->open($this->backupFolder . $this->fileName, ZipArchive::CREATE) !== true) {
                return false;
            }

            foreach ($filesArray as $file) {
                if (!empty($excludeFiles) && in_array($file, $excludeFiles, true)) {
                    continue;
                }

                // Add the files to the zip archive and set a correct local name
                $zipFile->addFile(JPATH_ROOT . '/' . $file, $file);
                $this->setExternalAttributes($zipFile, $file, fileperms(JPATH_ROOT . '/' . $file));
            }

            $zipFile->close();

            if ($zipFile->status !== 0) {
                return false;
            }
        }

        closedir($dir);
        unset($zipFolder, $zipFile);

        return true;
    }

    /**
     * Loads all files and (sub-)folders for the zip archive recursively
     *
     * @param object $zip
     * @param string $folder
     * @param string $folderRelative
     * @param array  $excludeFiles
     * @param array  $excludeFolders
     * @param string $folderStart
     *
     * @return void
     * @since 3.0.0-FREE
     */
    private function zipFoldersAndFilesRecursive(object $zip, string $folder, string $folderRelative, array $excludeFiles = [], array $excludeFolders = [], string $folderStart = ''): void
    {
        // Do not zip the folders of the backup archives, the cache and temp folders - only create empty folders
        $excludeFoldersCreateEmpty = ['administrator/components/com_easyjoomlabackup/backups', 'cache', 'tmp', 'administrator/cache'];

        // First check whether a root folder has to be excluded
        if (!empty($folderStart)) {
            if (in_array($folderStart, $excludeFoldersCreateEmpty, true)) {
                // Add empty folder - 0755
                $zip->addEmptyDir($folderStart . '/');
                $this->setExternalAttributes($zip, $folderStart . '/', 16877);

                // Add new file - 0644
                $zip->addFromString($folderStart . '/index.html', '');
                $this->setExternalAttributes($zip, $folderStart . '/index.html', 33188);

                return;
            }

            if (!empty($excludeFolders) && in_array($folderStart, $excludeFolders, true)) {
                return;
            }

            // Add the called folder to the zip archive
            $zip->addEmptyDir($folderStart . '/');
            $this->setExternalAttributes($zip, $folderStart . '/', fileperms($folder . '/'));
        }

        // Open the called folder path
        if (!$dir = @opendir($folder)) {
            return;
        }

        // Go through the current folder and add data to the zip object
        while ($file = readdir($dir)) {
            if ($file !== '.' && $file !== '..' && is_dir($folder . '/' . $file)) {
                if (in_array($folderRelative . '/' . $file, $excludeFoldersCreateEmpty, true)) {
                    // Add empty folder - 0755
                    $zip->addEmptyDir($folderRelative . '/' . $file . '/');
                    $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/', 16877);

                    // Add new file - 0644
                    $zip->addFromString($folderRelative . '/' . $file . '/index.html', '');
                    $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/index.html', 33188);

                    // Add a .htaccess to the backup folder to protect the archive files
                    if ($folderRelative . '/' . $file === 'administrator/components/com_easyjoomlabackup/backups') {
                        // Add .htaccess with Deny from all - 0444
                        $zip->addFromString($folderRelative . '/' . $file . '/.htaccess', 'Deny from all');
                        $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/.htaccess', 33060);
                    }

                    continue;
                }

                if (!empty($excludeFolders) && in_array($folderRelative . '/' . $file, $excludeFolders, true)) {
                    continue;
                }

                $zip->addEmptyDir($folderRelative . '/' . $file . '/');
                $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/', fileperms($folder . '/' . $file . '/'));

                $this->zipFoldersAndFilesRecursive($zip, $folder . '/' . $file, $folderRelative . '/' . $file, $excludeFiles, $excludeFolders);
            } elseif (is_file($folder . '/' . $file)) {
                if (!empty($excludeFiles) && in_array($folderRelative . '/' . $file, $excludeFiles, true)) {
                    continue;
                }

                // Add the files to the zip archive and set a correct local name
                $zip->addFile($folder . '/' . $file, $folderRelative . '/' . $file);
                $this->setExternalAttributes($zip, $folderRelative . '/' . $file, fileperms($folder . '/' . $file));
            }
        }

        closedir($dir);
    }

    /**
     * Creates a complete dump of the Joomla! database
     *
     * @return bool
     * @since   3.0.0-FREE
     * @version 3.4.0.0-FREE
     */
    private function createBackupZipArchiveDatabase(): bool
    {
        // SQL Dump - Backup the whole database of the Joomla! website and write it into the
        // archive file - only if the zip archive could be created
        $zipDatabase = new ZipArchive();

        if ($zipDatabase->open($this->backupFolder . $this->fileName, ZipArchive::CREATE) !== true) {
            return false;
        }

        // Set a correct extension for the database dump name
        $hash = md5($this->fileNameDatabase);
        $this->setFileNameDatabase();
        $this->backupDatabase($hash);

        // Add file which was created from the database export to the zip archive - 0640
        $zipDatabase->addFile($this->backupFolder . $this->fileNameDatabase, $this->fileNameDatabase);
        $this->setExternalAttributes($zipDatabase, $this->fileNameDatabase, 33184);

        $zipDatabase->close();

        // Delete the temporary database dump files
        unlink($this->backupFolder . $this->fileNameDatabase);

        return !($zipDatabase->status !== 0);
    }

    /**
     * Creates an SQL dump of the Joomla! database and add it directly to the archive
     *
     * @param string $hash
     *
     * @return void
     * @since   3.4.0.0-FREE
     * @version 3.4.1.0-FREE
     */
    private function backupDatabase(string $hash): void
    {
        $this->db->setUtf();
        $tables = $this->db->getTableList();
        $dbPrefix = $this->db->getPrefix();
        $addDropStatement = $this->params->get('add_drop_statement');

        // Add additional database tables
        $addDbTables = $this->params->get('add_db_tables', []);

        if (!empty($addDbTables)) {
            $addDbTables = array_map('trim', explode("\n", $addDbTables));
        }

        // Create a temporary dump file first. This is required to avoid memory timeouts on large databases!
        $data = Helper::getDatabaseDumpHeader();
        $this->writeDatabaseFile($data);

        foreach ($tables as $table) {
            if (stripos($table, $dbPrefix) !== false || in_array($table, $addDbTables, true)) {
                if (!empty($addDropStatement)) {
                    $data = 'DROP TABLE IF EXISTS ' . $table . ';' . "\n";
                    $this->writeDatabaseFile($data);
                }

                // Set the query to get the table CREATE statement.
                $this->db->setQuery('SHOW CREATE TABLE ' . $table);
                $rowCreate = $this->db->loadRow();

                $data = $rowCreate[1] . ";\n\n";
                $this->writeDatabaseFile($data);

                $tableInformation = $this->db->getTableColumns($table);
                $numFields = count($tableInformation);
                $tableColumnTypes = array_values($tableInformation);

                $this->db->setQuery('SELECT * FROM ' . $table);
                $this->db->execute();
                $count = $this->db->getNumRows();

                if ($count > 0) {
                    $passes = (int)ceil($count / $this->maximumListLimit);
                    $this->iterator = $this->db->getIterator();

                    for ($round = 0; $round < $passes; $round++) {
                        $rowList = $this->getRowList($passes);
                        $this->addRowEntries($rowList, $numFields, $tableColumnTypes, $table);
                    }
                }

                $data .= "\n\n";
                $this->writeDatabaseFile($data);
            }
        }

        $this->createBackupSqlArchiveDatabasePostProcess($hash);
    }

    /**
     * Loads the correct backup archive and creates the download process
     *
     * @return bool|void
     * @throws Exception
     * @since   3.0.0-FREE
     */
    public function download()
    {
        $id = $this->input->get('id', 0, 'INTEGER');
        $table = $this->getTable('createbackup', 'EasyJoomlaBackupTable');

        // Get the file with the correct path
        $table->load($id);
        $file = $this->backupFolder . $table->get('name');

        if (file_exists($file)) {
            header('Pragma: public');
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Cache-Control: public');
            header('Content-Description: File Transfer');
            header('Content-Type: application/zip', true, 200);
            header('Content-Disposition: attachment; filename=' . $table->get('name'));
            header('Content-Transfer-Encoding: binary');
            header('Content-Length: ' . $table->get('size'));

            $chunkSize = 10 * (1024 * 1024);
            $handle = fopen($file, 'rb');

            while (!feof($handle)) {
                $buffer = fread($handle, $chunkSize);
                echo $buffer;
                ob_flush();
                flush();
            }

            fclose($handle);

            exit();
        }

        return false;
    }

    /**
     * Checks whether more backup files are available than allowed and starts deletion process if required
     *
     * @return bool
     * @throws Exception
     * @since 3.0.0-FREE
     */
    public function removeBackupFilesMax(): bool
    {
        $maxNumberBackups = $this->params->get('max_number_backups', 5);
        $totalNumberBackups = $this->getTotal();

        // Only execute the process if the max number is not empty and smaller than the total number
        if (!empty($maxNumberBackups) && $totalNumberBackups > $maxNumberBackups) {
            // Delete outdated files
            if ($this->deleteFilesMax($maxNumberBackups, $totalNumberBackups - $maxNumberBackups)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Gets the total number of entries after the backup process was executed
     *
     * @return int
     * @since 3.0.0-FREE
     */
    private function getTotal(): int
    {
        $query = $this->db->getQuery(true);
        $query->select('*');
        $query->from('#__easyjoomlabackup');

        return $this->_getListCount($query);
    }

    /**
     * Deletes all unneeded files. The number of files which should be kept can be set in the settings
     *
     * @param int $limitstart
     * @param int $limit
     *
     * @return bool
     * @throws Exception
     * @since 3.0.0-FREE
     */
    private function deleteFilesMax(int $limitstart, int $limit): bool
    {
        $query = $this->db->getQuery(true);
        $query->select($this->db->quoteName('id'));
        $query->from('#__easyjoomlabackup');
        $query->order($this->db->escape('date DESC'));

        $data = $this->_getList($query, $limitstart, $limit);

        if (!empty($data)) {
            $ids = [];

            foreach ($data as $value) {
                $ids[] = $value->id;
            }

            $this->input->set('id', $ids);

            if ($this->delete()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Deletes backup files from the server and the corresponding database entries
     *
     * @return bool
     * @throws Exception
     * @since 3.0.0-FREE
     */
    public function delete(): bool
    {
        $ids = $this->input->get('id', 0, 'ARRAY');
        $table = $this->getTable('createbackup', 'EasyJoomlaBackupTable');

        foreach ($ids as $id) {
            // Delete the backup file from the server
            $table->load($id);

            $filePath = $this->backupFolder . $table->get('name');

            if (File::exists($filePath)) {
                File::delete($filePath);
            }

            if (!$table->delete($id)) {
                throw new Exception(Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 404);
            }
        }

        return true;
    }
}
