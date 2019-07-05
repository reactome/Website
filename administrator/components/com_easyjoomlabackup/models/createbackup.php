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

class EasyJoomlaBackupModelCreatebackup extends JModelLegacy
{
    protected $db;
    protected $input;
    protected $params;
    protected $backupFolder;
    protected $backupDatetime;
    protected $externalAttributes;

    /**
     * EasyJoomlaBackupModelCreatebackup constructor.
     *
     * @throws Exception
     */
    public function __construct()
    {
        parent::__construct();

        $this->db = JFactory::getDbo();
        $this->input = JFactory::getApplication()->input;
        $this->params = JComponentHelper::getParams('com_easyjoomlabackup');
        $this->backupFolder = JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/backups/';
        $this->backupDatetime = JFactory::getDate('now', JFactory::getApplication()->get('offset'));
    }

    /**
     * Main function for the backup process
     *
     * @param string $type
     * @param bool   $source
     *
     * @return bool
     * @throws Exception
     */
    public function createBackup($type, $source = false)
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
                JTable::addIncludePath(JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/tables');
                $table = $this->getTable('createbackup', 'EasyJoomlaBackupTable');

                $data = array();
                $data['date'] = $this->backupDatetime->toSql();
                $data['type'] = $type;
                $data['name'] = $fileName;
                $data['size'] = filesize($this->backupFolder . $fileName);
                $data['duration'] = round(microtime(true) - $start, 2);

                if (empty($source)) {
                    $data['comment'] = $this->input->get('comment', '', 'STRING');
                } else {
                    $language = JFactory::getLanguage();
                    $language->load('com_easyjoomlabackup', JPATH_ADMINISTRATOR);

                    $data['comment'] = JText::_('COM_EASYJOOMLABACKUP_CRONJOBPLUGIN');

                    if ($source == 'cli') {
                        $data['comment'] = JText::_('COM_EASYJOOMLABACKUP_CLISCRIPT');
                    }
                }

                if (!$table->save($data)) {
                    throw new Exception(JText::_('JERROR_AN_ERROR_HAS_OCCURRED'), 404);
                }

                return true;
            }
        }

        return false;
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
     * @return string
     */
    private function createFilename()
    {
        if ($this->params->get('prefix_archive')) {
            $prefix = strtolower(preg_replace('@\s+@', '-', $this->params->get('prefix_archive')));
        } else {
            $root = JUri::root();

            if (!empty($root)) {
                $prefix = implode('-', array_filter(explode('/', str_replace(array('http://', 'https://'), '', $root))));
            } else {
                $prefix = JUri::getInstance()->getHost();
            }
        }

        $fileName = $prefix . '_' . $this->backupDatetime->format('Y-m-d_H-i-s', true);

        // If name already exists try it with another one
        if (is_file($this->backupFolder . $fileName)) {
            $fileName = $this->createFilename();
        }

        // Add a suffix to make the archive name unguessable
        $addSuffix = $this->params->get('add_suffix_archive', 1);

        if (!empty($addSuffix)) {
            $fileName .= '_' . JUserHelper::genRandomPassword(10);
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
     * @return boolean
     */
    private function createBackupZipArchiveFiles($fileName)
    {
        // Prepare files which should be excluded
        $excludeFiles = $this->params->get('exclude_files');

        if (!empty($excludeFiles)) {
            $excludeFiles = array_map('trim', explode("\n", $excludeFiles));
        }

        // Prepare folders which should be excluded
        $excludeFolders = $this->params->get('exclude_folders');

        if (!empty($excludeFolders)) {
            $excludeFolders = array_map('trim', explode("\n", $excludeFolders));
        }

        if (!$dir = @opendir(JPATH_ROOT)) {
            return false;
        }

        $filesArray = array();

        while ($file = readdir($dir)) {
            if ($file == '.' || $file == '..') {
                continue;
            }

            if (is_dir(JPATH_ROOT . '/' . $file)) {
                // Create for all folders an own Zip Archive object to avoid memory overflow
                $zipFolder = new ZipArchive();

                if ($zipFolder->open($this->backupFolder . $fileName, ZipArchive::CREATE) !== true) {
                    return false;
                } else {
                    $this->zipFoldersAndFilesRecursive($zipFolder, JPATH_ROOT . '/' . $file, $file, $excludeFiles, $excludeFolders, $file);
                }

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
     * @param bool   $folderStart
     *
     * @return bool
     */
    private function zipFoldersAndFilesRecursive($zip, $folder, $folderRelative, $excludeFiles = array(), $excludeFolders = array(), $folderStart = false)
    {
        // Do not zip the folders of the backup archives, the cache and temp folders - only create empty folders
        $excludeFoldersCreateEmpty = array('administrator/components/com_easyjoomlabackup/backups', 'cache', 'tmp', 'administrator/cache');

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

    private function setExternalAttributes(&$zipObject, $fileName, $filePermission)
    {
        if (!empty($this->externalAttributes)) {
            $zipObject->setExternalAttributesName($fileName, ZipArchive::OPSYS_UNIX, $filePermission << 16);
        }
    }

    /**
     * Creates a complete dump of the Joomla! database
     *
     * @param string $fileName
     *
     * @return boolean
     */
    private function createBackupZipArchiveDatabase($fileName)
    {
        // SQL Dump - Backup the whole database of the Joomla! website and write it into the archive file
        // Only if the zip archive could be created
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
     * @return boolean
     */
    private function backupDatabase($fileNameDump)
    {
        $this->db->setUtf();
        $tables = $this->db->getTableList();
        $dbPrefix = $this->db->getPrefix();
        $addDropStatement = $this->params->get('add_drop_statement');

        // Add additional database tables
        $addDbTables = $this->params->get('add_db_tables');

        if (!empty($addDbTables)) {
            $addDbTables = array_map('trim', explode("\n", $addDbTables));
        } else {
            $addDbTables = array();
        }

        // Create a temporary dump file first. This is required to avoid memory timeouts on large databases!
        $data = '-- EJB - Easy Joomla Backup for Joomal! - SQL Dump' . "\n";
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
                $result = $this->db->execute();
                $numFields = $result->field_count;
                $count = $result->num_rows;

                if ($count > 0) {
                    $data .= 'INSERT INTO `' . $table . '` VALUES' . "\n";
                    $rowList = $this->db->loadRowList();
                    $tableColumns = array_values($this->db->getTableColumns($table));

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
                                $row[$j] = str_replace(array('\\', '\'', "\0", "\r\n"), array('\\\\', '\'\'', '\0', '\r\n'), $row[$j]);

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
            header('Content-Type: application/zip');
            header('Content-Disposition: attachment; filename=' . $table->get('name'));
            header('Content-Transfer-Encoding: binary');
            header('Content-Length:' . $table->get('size'));
            ob_end_flush();
            @readfile($file);

            return true;
        }

        return false;
    }

    /**
     * Checks whether more backup files are available than allowed and starts deletion process if required
     *
     * @return bool
     * @throws Exception
     */
    public function removeBackupFilesMax()
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
     */
    private function getTotal()
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
    private function deleteFilesMax($limitstart, $limit)
    {
        $query = $this->db->getQuery(true);
        $query->select($this->db->quoteName('id'));
        $query->from('#__easyjoomlabackup');
        $query->order($this->db->escape('date DESC'));

        $data = $this->_getList($query, $limitstart, $limit);

        if (!empty($data)) {
            $ids = array();

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
     */
    public function delete()
    {
        $ids = $this->input->get('id', 0, 'ARRAY');
        $table = $this->getTable('createbackup', 'EasyJoomlaBackupTable');

        foreach ($ids as $id) {
            // Delete the backup file from the server
            $table->load($id);
            unlink($this->backupFolder . $table->get('name'));

            if (!$table->delete($id)) {
                throw new Exception(JText::_('JERROR_AN_ERROR_HAS_OCCURRED'), 404);
            }
        }

        return true;
    }
}
