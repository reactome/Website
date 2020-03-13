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

use Joomla\CMS\{MVC\Model\BaseDatabaseModel, Application\CMSApplication, Date\Date, Input\Input, Factory, Uri\Uri, Table\Table, Language\Text, User\UserHelper, Component\ComponentHelper, Filesystem\File, Filesystem\Folder};
use Joomla\Registry\Registry;

class EasyJoomlaBackupModelCreatebackup extends BaseDatabaseModel
{
    const DEFAULT_PREFIX = 'easy-joomla-backup';

    /** @var CMSApplication $app */
    protected $app;

    /** @var Date $backupDatetime */
    protected $backupDatetime;

    /** @var string $backupFolder */
    protected $backupFolder;

    /** @var string $backupPath */
    protected $backupPath;

    /** @var JDatabaseDriver $db */
    protected $db;

    /** @var bool $externalAttributes */
    protected $externalAttributes = false;

    /** @var Input $input */
    protected $input;

    /** @var int $maximumExecutionLevel */
    protected $maximumExecutionLevel;

    /** @var float $maximumExecutionTime */
    protected $maximumExecutionTime;

    /** @var float $maximumExecutionTimeDefault */
    protected $maximumExecutionTimeDefault = 10.0;

    /** @var int $maximumExecutionLevelDefault */
    protected $maximumExecutionLevelDefault = 6;

    /** @var Registry $params */
    protected $params;

    /**
     * EasyJoomlaBackupModelCreatebackup constructor.
     *
     * @throws Exception
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
        $this->maximumExecutionTime = $this->getMaximumExecutionTime();
        $this->maximumExecutionLevel = $this->getMaximumExecutionLevel();
    }

    /**
     * Main function for the backup process
     *
     * @param string $type
     * @param string $hash
     *
     * @return bool|array
     * @throws Exception
     */
    public function createBackupAjax(string $type, string $hash)
    {
        // Check whether Zip class exists
        if (class_exists('ZipArchive')) {
            $this->externalAttributes = $this->checkExternalAttributes();

            $status = true;
            $statusDb = true;

            $fileName = $this->createFilenameAjax($hash);
            $this->backupPath = $this->backupFolder . $fileName;

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
            if ($type == 'filebackup' || $type == 'fullbackup') {
                $fileBackupDone = (bool) $this->app->getUserState('ejb.' . $hash . '.fileBackupDone', false);

                if (!$fileBackupDone) {
                    $status = $this->createBackupZipArchiveFilesAjax($hash);

                    $foldersIteration = (array) $this->app->getUserState('ejb.' . $hash . '.foldersIteration', []);
                    $foldersIterationCount = (int) $this->app->getUserState('ejb.' . $hash . '.foldersIterationCount', 1);
                    $message = Text::sprintf('COM_EASYJOOMLABACKUP_BACKUPMODAL_LASTFOLDER', $foldersIteration[0]['relname']);
                    $totalPercentage = ($type === 'fullbackup') ? 90 : 100;

                    if ($status) {
                        $this->app->setUserState('ejb.' . $hash . '.fileBackupDone', true);
                        $foldersIteration = [];
                        $foldersIterationCount = 1;
                        $message = ($type === 'fullbackup') ? Text::_('COM_EASYJOOMLABACKUP_BACKUPMODAL_FILEBACKUPDONE_DB') : Text::_('COM_EASYJOOMLABACKUP_BACKUPMODAL_FILEBACKUPDONE');
                    }

                    $result = [
                        'hash'     => $hash,
                        'finished' => false,
                        'percent'  => $totalPercentage - round(count($foldersIteration) * $totalPercentage / $foldersIterationCount),
                        'message'  => $message,
                    ];

                    return $result;
                }
            }

            // Create database backup
            if ($type == 'databasebackup' || $type == 'fullbackup') {
                $statusDb = $this->createBackupZipArchiveDatabaseAjax($fileName);
            }

            // Backup process finished successfully
            if (!empty($status) && !empty($statusDb)) {
                // Add path of table - this is important for the cronjob system plugin
                Table::addIncludePath(JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/tables');
                $table = $this->getTable('createbackup', 'EasyJoomlaBackupTable');

                $data = [];
                $data['date'] = $this->backupDatetime->toSql();
                $data['type'] = $type;
                $data['name'] = $fileName;
                $data['size'] = filesize($this->backupFolder . $fileName);

                $startProcess = $this->app->getUserState('ejb.' . $hash . '.startProcess', microtime(true));

                $data['duration'] = round(microtime(true) - $startProcess, 2);

                if (empty($source)) {
                    $data['comment'] = $this->input->get('comment', '', 'STRING');
                } else {
                    $language = Factory::getLanguage();
                    $language->load('com_easyjoomlabackup', JPATH_ADMINISTRATOR);

                    $data['comment'] = Text::_('COM_EASYJOOMLABACKUP_CRONJOBPLUGIN');

                    if ($source == 'cli') {
                        $data['comment'] = Text::_('COM_EASYJOOMLABACKUP_CLISCRIPT');
                    }
                }

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
        }

        return false;
    }

    /**
     * Main function for the backup process - used in plugin and CLI script
     *
     * @param string $type
     * @param string $source
     *
     * @return bool
     * @throws Exception
     */
    public function createBackup(string $type, string $source = ''): bool
    {
        // Check whether Zip class exists
        if (class_exists('ZipArchive')) {
            $this->externalAttributes = $this->checkExternalAttributes();

            $start = microtime(true);
            $status = true;
            $statusDb = true;

            // Create name of the new archive
            $fileName = $this->createFilename();

            // Get all files and folders
            if ($type == 'filebackup' || $type == 'fullbackup') {
                $status = $this->createBackupZipArchiveFiles($fileName);
            }

            if ($type == 'databasebackup' || $type == 'fullbackup') {
                $statusDb = $this->createBackupZipArchiveDatabase($fileName);
            }

            // Zip archive created successfully
            if (!empty($status) && !empty($statusDb)) {
                // Add path of table - this is important for the cronjob system plugin
                Table::addIncludePath(JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/tables');
                $table = $this->getTable('createbackup', 'EasyJoomlaBackupTable');

                $data = [];
                $data['date'] = $this->backupDatetime->toSql();
                $data['type'] = $type;
                $data['name'] = $fileName;
                $data['size'] = filesize($this->backupFolder . $fileName);
                $data['duration'] = round(microtime(true) - $start, 2);
                $data['comment'] = $this->input->get('comment', '', 'STRING');

                if (!empty($source)) {
                    $language = Factory::getLanguage();
                    $language->load('com_easyjoomlabackup', JPATH_ADMINISTRATOR);

                    $data['comment'] = Text::_('COM_EASYJOOMLABACKUP_CRONJOBPLUGIN');

                    if ($source == 'cli') {
                        $data['comment'] = Text::_('COM_EASYJOOMLABACKUP_CLISCRIPT');
                    }
                }

                if (!$table->save($data)) {
                    throw new Exception(Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 404);
                }

                return true;
            }
        }

        return false;
    }

    /**
     * Loads the correct backup archive and creates the download process
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
     * Deletes backup files from the server and the corresponding database entries
     *
     * @return bool
     * @throws Exception
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

    /**
     * Gets the maximum execution time for each batch process
     *
     * @return float
     */
    private function getMaximumExecutionTime(): float
    {
        return $this->maximumExecutionTimeDefault;
    }

    /**
     * Gets the maximum execution level for initial scanning process
     *
     * @return int
     */
    private function getMaximumExecutionLevel(): int
    {
        return $this->maximumExecutionLevelDefault;
    }

    /**
     * Check whether required function to set the permission rights on UNIX systems is available
     * Since PHP 5 >= 5.6.0, PHP 7, PECL zip >= 1.12.4
     *
     * @return bool
     */
    private function checkExternalAttributes()
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
     */
    private function createFilenameAjax(string &$hash)
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
            $fileName .= '_' . UserHelper::genRandomPassword(10);
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
     */
    private function getFileNamePrefix($hostOnly = false)
    {
        if ($this->params->get('prefix_archive')) {
            return strtolower(preg_replace('@\s+@', '-', $this->params->get('prefix_archive')));
        }

        if ($hostOnly) {
            return Uri::getInstance()->getHost();
        }

        $root = Uri::root();

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
     */
    private function prepareBackupProcess(string $backupType, string $hash)
    {
        $this->app->setUserState('ejb.' . $hash . '.startProcess', microtime(true));

        // Database information
        if ($backupType === EasyJoomlaBackupHelper::BACKUP_TYPE_DATABASE || $backupType === EasyJoomlaBackupHelper::BACKUP_TYPE_FULL) {
            $prefix = $this->db->getPrefix();
            $tables = $this->db->getTableList();

            $additionalDbTables = $this->params->get('add_db_tables');
            $additionalDbTables = array_map('trim', explode("\n", $additionalDbTables));

            $tables = array_filter($tables, function($table) use ($prefix, $additionalDbTables) {
                return strpos($table, $prefix) === 0 || in_array($table, $additionalDbTables);
            });

            $this->app->setUserState('ejb.' . $hash . '.dbTables', $tables);
            $this->app->setUserState('ejb.' . $hash . '.dbTablesCount', count($tables));
            $this->app->setUserState('ejb.' . $hash . '.dbBackupDone', false);
        }

        // File system information
        if ($backupType === EasyJoomlaBackupHelper::BACKUP_TYPE_FILE || $backupType === EasyJoomlaBackupHelper::BACKUP_TYPE_FULL) {
            $filesRoot = Folder::files(JPATH_ROOT, '.', false, false, [], []);
            $foldersIteration = Folder::listFolderTree(JPATH_ROOT, '.', $this->maximumExecutionLevel);

            // Remove first slash from relname property
            foreach ($foldersIteration as &$folderIteration) {
                if (strpos($folderIteration['relname'], '/') === 0) {
                    $folderIteration['relname'] = substr($folderIteration['relname'], 1);
                }
            }

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

        $filesRoot = (array) $this->app->getUserState('ejb.' . $hash . '.filesRoot', []);

        if (!empty($filesRoot)) {
            $zipFile = new ZipArchive();

            if ($zipFile->open($this->backupPath, ZipArchive::CREATE) !== true) {
                throw new Exception('Error: Zip file could not be created!');
            }

            foreach ($filesRoot as $file) {
                if (!empty($excludeFiles)) {
                    if (in_array($file, $excludeFiles)) {
                        continue;
                    }
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

        $foldersIteration = (array) $this->app->getUserState('ejb.' . $hash . '.foldersIteration', []);

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

                if (count(explode('/', $folderIteration['relname'])) == $this->maximumExecutionLevel) {
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
     */
    private function setExternalAttributes(object &$zipObject, string $fileName, int $filePermission)
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
        if (in_array($folderRelative, $excludeFoldersCreateEmpty)) {
            // Add empty folder - 0755
            $zip->addEmptyDir($folderRelative . '/');
            $this->setExternalAttributes($zip, $folderRelative . '/', 16877);

            // Add new file - 0644
            $zip->addFromString($folderRelative . '/index.html', '');
            $this->setExternalAttributes($zip, $folderRelative . '/index.html', 33188);

            // Add a .htaccess to the backup folder to protect the archive files
            if ($folderRelative == 'administrator/components/com_easyjoomlabackup/backups') {
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
            if (is_dir($folder . '/' . $file) && $file != '.' && $file != '..') {
                if (in_array($folderRelative . '/' . $file, $excludeFoldersCreateEmpty)) {
                    // Add empty folder - 0755
                    $zip->addEmptyDir($folderRelative . '/' . $file . '/');
                    $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/', 16877);

                    // Add new file - 0644
                    $zip->addFromString($folderRelative . '/' . $file . '/index.html', '');
                    $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/index.html', 33188);

                    // Add a .htaccess to the backup folder to protect the archive files
                    if ($folderRelative . '/' . $file == 'administrator/components/com_easyjoomlabackup/backups') {
                        // Add .htaccess with Deny from all - 0444
                        $zip->addFromString($folderRelative . '/' . $file . '/.htaccess', 'Deny from all');
                        $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/.htaccess', 33060);
                    }

                    continue;
                }

                if (!empty($excludeFolders)) {
                    if (in_array($folderRelative . '/' . $file, $excludeFolders)) {
                        continue;
                    }
                }

                $zip->addEmptyDir($folderRelative . '/' . $file . '/');
                $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/', fileperms($folder . '/' . $file . '/'));

                if ($recursive) {
                    $this->zipFoldersAndFilesRecursiveAjax($zip, $folder . '/' . $file, $folderRelative . '/' . $file, $recursive, $excludeFiles, $excludeFolders);
                }
            } elseif (is_file($folder . '/' . $file)) {
                if (!empty($excludeFiles)) {

                    if (in_array($folderRelative . '/' . $file, $excludeFiles)) {
                        continue;
                    }
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
     */
    private function ceilDecimalDigits(float $value, int $precision = 2)
    {
        return ceil($value * pow(10, $precision)) / pow(10, $precision);
    }

    /**
     * Creates a complete dump of the Joomla! database
     *
     * @param string $fileName
     *
     * @return bool
     */
    private function createBackupZipArchiveDatabaseAjax(string $fileName): bool
    {
        // SQL Dump - Backup the whole database of the Joomla! website and write it into the
        // archive file - only if the zip archive could be created
        $zipDatabase = new ZipArchive();

        if ($zipDatabase->open($this->backupFolder . $fileName, ZipArchive::CREATE) !== true) {
            return false;
        }

        // Set a correct extension for the database dump name
        $fileNameDb = str_replace('.zip', '', $fileName) . '.sql';
        $this->backupDatabase($fileNameDb);

        // Add file which was created from the database export to the zip archive - 0640
        $zipDatabase->addFile($this->backupFolder . $fileNameDb, $fileNameDb);
        $this->setExternalAttributes($zipDatabase, $fileNameDb, 33184);

        $zipDatabase->close();

        // Delete the temporary database dump files
        unlink($this->backupFolder . $fileNameDb);

        if ($zipDatabase->status != 0) {
            return false;
        }

        return true;
    }

    /**
     * Creates a SQL Dump of the Joomla! database and add it directly to the archive
     *
     * @param string $fileNameDump
     *
     * @return bool
     */
    private function backupDatabase(string $fileNameDump): bool
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
        $data = '-- Easy Joomla Backup for Joomal! - SQL Dump' . "\n";
        $data .= '-- Author: Viktor Vogel' . "\n";
        $data .= '-- Project page: https://kubik-rubik.de/ejb-easy-joomla-backup' . "\n";
        $data .= '-- License: GNU/GPL - http://www.gnu.org/licenses/gpl.html' . "\n\n";

        file_put_contents($this->backupFolder . $fileNameDump, $data);

        foreach ($tables as $table) {
            if (stripos($table, $dbPrefix) !== false || in_array($table, $addDbTables)) {
                $data = '';

                if (!empty($addDropStatement)) {
                    $data .= 'DROP TABLE IF EXISTS ' . $table . ';' . "\n";
                }

                // Set the query to get the table CREATE statement.
                $this->db->setQuery('SHOW CREATE TABLE ' . $table);
                $rowCreate = $this->db->loadRow();

                $data .= $rowCreate[1] . ";\n\n";

                $this->db->setQuery('SELECT * FROM ' . $table);
                $this->db->execute();
                $count = $this->db->getNumRows();

                if ($count > 0) {
                    $data .= 'INSERT INTO `' . $table . '` VALUES' . "\n";
                    $rowList = $this->db->loadRowList();

                    $tableInformation = $this->db->getTableColumns($table);
                    $numFields = count($tableInformation);
                    $tableColumns = array_values($tableInformation);

                    $countEntries = 0;

                    foreach ($rowList as $row) {
                        $countEntries++;

                        $data .= '(';

                        for ($j = 0; $j < $numFields; $j++) {
                            // First check whether the value is NULL to avoid loss
                            if (is_null($row[$j])) {
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
                            // Add a new INSERT INTO statement after every fiftieth entry to avoid timeouts
                            if ($countEntries % 50 == 0) {
                                $data .= ");\n";
                                $data .= 'INSERT INTO `' . $table . '` VALUES' . "\n";
                            } else {
                                $data .= "),\n";
                            }
                        }
                    }

                    $data .= ");\n";
                }

                $data .= "\n\n";

                // Add the data to the temporary dump file
                file_put_contents($this->backupFolder . $fileNameDump, $data, FILE_APPEND);
            }
        }

        return true;
    }

    /**
     * Creates a filename for the backup archive from the URL, the date and a random string
     *
     * @return string
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
            $fileName .= '_' . UserHelper::genRandomPassword(10);
        }

        $fileName .= '.zip';

        return $fileName;
    }

    /**
     * Creates the archive file of all files from the Joomla! installation with a possible exclusion of files and
     * folders
     *
     * @param string $fileName
     *
     * @return bool
     */
    private function createBackupZipArchiveFiles(string $fileName): bool
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
            if ($file == '.' || $file == '..') {
                continue;
            }

            if (is_dir(JPATH_ROOT . '/' . $file)) {
                // Create for all folders an own Zip Archive object to avoid memory overflow
                $zipFolder = new ZipArchive();

                if ($zipFolder->open($this->backupFolder . $fileName, ZipArchive::CREATE) !== true) {
                    return false;
                }

                $this->zipFoldersAndFilesRecursive($zipFolder, JPATH_ROOT . '/' . $file, $file, $excludeFiles, $excludeFolders, $file);
                $zipFolder->close();

                if ($zipFolder->status != 0) {
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

            if ($zipFile->open($this->backupFolder . $fileName, ZipArchive::CREATE) !== true) {
                return false;
            }

            foreach ($filesArray as $file) {
                if (!empty($excludeFiles)) {
                    if (in_array($file, $excludeFiles)) {
                        continue;
                    }
                }

                // Add the files to the zip archive and set a correct local name
                $zipFile->addFile(JPATH_ROOT . '/' . $file, $file);
                $this->setExternalAttributes($zipFile, $file, fileperms(JPATH_ROOT . '/' . $file));
            }

            $zipFile->close();

            if ($zipFile->status != 0) {
                return false;
            }
        }

        closedir($dir);
        unset($zipFolder);
        unset($zipFile);

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
     * @return bool
     */
    private function zipFoldersAndFilesRecursive(object $zip, string $folder, string $folderRelative, array $excludeFiles = [], array $excludeFolders = [], string $folderStart = ''): bool
    {
        // Do not zip the folders of the backup archives, the cache and temp folders - only create empty folders
        $excludeFoldersCreateEmpty = ['administrator/components/com_easyjoomlabackup/backups', 'cache', 'tmp', 'administrator/cache'];

        // First check whether a root folder has to be excluded
        if (!empty($folderStart)) {
            if (in_array($folderStart, $excludeFoldersCreateEmpty)) {
                // Add empty folder - 0755
                $zip->addEmptyDir($folderStart . '/');
                $this->setExternalAttributes($zip, $folderStart . '/', 16877);

                // Add new file - 0644
                $zip->addFromString($folderStart . '/index.html', '');
                $this->setExternalAttributes($zip, $folderStart . '/index.html', 33188);

                return true;
            }

            if (!empty($excludeFolders)) {
                if (in_array($folderStart, $excludeFolders)) {
                    return true;
                }
            }

            // Add the called folder to the zip archive
            $zip->addEmptyDir($folderStart . '/');
            $this->setExternalAttributes($zip, $folderStart . '/', fileperms($folder . '/'));
        }

        // Open the called folder path
        if (!$dir = @opendir($folder)) {
            return false;
        }

        // Go through the current folder and add data to the zip object
        while ($file = readdir($dir)) {
            if (is_dir($folder . '/' . $file) && $file != '.' && $file != '..') {
                if (in_array($folderRelative . '/' . $file, $excludeFoldersCreateEmpty)) {
                    // Add empty folder - 0755
                    $zip->addEmptyDir($folderRelative . '/' . $file . '/');
                    $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/', 16877);

                    // Add new file - 0644
                    $zip->addFromString($folderRelative . '/' . $file . '/index.html', '');
                    $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/index.html', 33188);

                    // Add a .htaccess to the backup folder to protect the archive files
                    if ($folderRelative . '/' . $file == 'administrator/components/com_easyjoomlabackup/backups') {
                        // Add .htaccess with Deny from all - 0444
                        $zip->addFromString($folderRelative . '/' . $file . '/.htaccess', 'Deny from all');
                        $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/.htaccess', 33060);
                    }

                    continue;
                }

                if (!empty($excludeFolders)) {
                    if (in_array($folderRelative . '/' . $file, $excludeFolders)) {
                        continue;
                    }
                }

                $zip->addEmptyDir($folderRelative . '/' . $file . '/');
                $this->setExternalAttributes($zip, $folderRelative . '/' . $file . '/', fileperms($folder . '/' . $file . '/'));

                $this->zipFoldersAndFilesRecursive($zip, $folder . '/' . $file, $folderRelative . '/' . $file, $excludeFiles, $excludeFolders);
            } elseif (is_file($folder . '/' . $file)) {
                if (!empty($excludeFiles)) {

                    if (in_array($folderRelative . '/' . $file, $excludeFiles)) {
                        continue;
                    }
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
     * Creates a complete dump of the Joomla! database
     *
     * @param string $fileName
     *
     * @return bool
     */
    private function createBackupZipArchiveDatabase(string $fileName): bool
    {
        // SQL Dump - Backup the whole database of the Joomla! website and write it into the
        // archive file - only if the zip archive could be created
        $zipDatabase = new ZipArchive();

        if ($zipDatabase->open($this->backupFolder . $fileName, ZipArchive::CREATE) !== true) {
            return false;
        }

        // Set a correct extension for the database dump name
        $fileNameDb = str_replace('.zip', '', $fileName) . '.sql';
        $this->backupDatabase($fileNameDb);

        // Add file which was created from the database export to the zip archive - 0640
        $zipDatabase->addFile($this->backupFolder . $fileNameDb, $fileNameDb);
        $this->setExternalAttributes($zipDatabase, $fileNameDb, 33184);

        $zipDatabase->close();

        // Delete the temporary database dump files
        unlink($this->backupFolder . $fileNameDb);

        if ($zipDatabase->status != 0) {
            return false;
        }

        return true;
    }

    /**
     * Gets the total number of entries after the backup process was executed
     *
     * @return int
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
}
