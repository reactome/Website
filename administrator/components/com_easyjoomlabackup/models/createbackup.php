<?php
/**
 * @package    EJB - Easy Joomla Backup for Joomal! 3.x
 * @author     Viktor Vogel <admin@kubik-rubik.de>
 * @version    3.2.5 - 2017-10-09
 * @link       https://joomla-extensions.kubik-rubik.de/ejb-easy-joomla-backup
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
defined('_JEXEC') or die('Restricted access');

class EasyJoomlaBackupModelCreatebackup extends JModelLegacy
{
	protected $db;
	protected $input;
	protected $params;
	protected $backup_folder;
	protected $backup_datetime;
	protected $external_attributes;

	public function __construct()
	{
		parent::__construct();

		$this->db = JFactory::getDbo();
		$this->input = JFactory::getApplication()->input;
		$this->params = JComponentHelper::getParams('com_easyjoomlabackup');
		$this->backup_folder = JPATH_ADMINISTRATOR.'/components/com_easyjoomlabackup/backups/';
		$this->backup_datetime = JFactory::getDate('now', JFactory::getApplication()->get('offset'));
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
		if(class_exists('ZipArchive'))
		{
			$this->external_attributes = $this->checkExternalAttributes();
			$start = microtime(true);
			$status = true;
			$status_db = true;

			// Create name of the new archive
			$file_name = $this->createFilename();

			// Get all files and folders
			if($type == 'filebackup' OR $type == 'fullbackup')
			{
				$status = $this->createBackupZipArchiveFiles($file_name);
			}

			if($type == 'databasebackup' OR $type == 'fullbackup')
			{
				$status_db = $this->createBackupZipArchiveDatabase($file_name);
			}

			// Zip archive created successfully
			if(!empty($status) AND !empty($status_db))
			{
				// Add path of table - this is important for the cronjob system plugin
				JTable::addIncludePath(JPATH_ADMINISTRATOR.'/components/com_easyjoomlabackup/tables');
				$table = $this->getTable('createbackup', 'EasyJoomlaBackupTable');

				$data = array();
				$data['date'] = $this->backup_datetime->toSql();
				$data['type'] = $type;
				$data['name'] = $file_name;
				$data['size'] = filesize($this->backup_folder.$file_name);
				$data['duration'] = round(microtime(true) - $start, 2);

				if(empty($source))
				{
					$data['comment'] = $this->input->get('comment', '', 'STRING');
				}
				else
				{
					$language = JFactory::getLanguage();
					$language->load('com_easyjoomlabackup', JPATH_ADMINISTRATOR);

					$data['comment'] = JText::_('COM_EASYJOOMLABACKUP_CRONJOBPLUGIN');

					if($source == 'cli')
					{
						$data['comment'] = JText::_('COM_EASYJOOMLABACKUP_CLISCRIPT');
					}
				}

				if(!$table->save($data))
				{
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
		$zip_object = new ZipArchive();

		return method_exists($zip_object, 'setExternalAttributesName');
	}

	/**
	 * Creates a filename for the backup archive from the URL, the date and a random string
	 *
	 * @return string
	 */
	private function createFilename()
	{
		if($this->params->get('prefix_archive'))
		{
			$prefix = strtolower(preg_replace('@\s+@', '-', $this->params->get('prefix_archive')));
		}
		else
		{
			$root = JUri::root();

			if(!empty($root))
			{
				$prefix = implode('-', array_filter(explode('/', str_replace(array('http://', 'https://'), '', $root))));
			}
			else
			{
				$prefix = JUri::getInstance()->getHost();
			}
		}

		$file_name = $prefix.'_'.$this->backup_datetime->format('Y-m-d_H-i-s', true);

		// If name already exists try it with another one
		if(is_file($this->backup_folder.$file_name))
		{
			$file_name = $this->createFilename();
		}

		// Add a suffix to make the archive name unguessable
		$add_suffix = $this->params->get('add_suffix_archive', 1);

		if(!empty($add_suffix))
		{
			$file_name .= '_'.JUserHelper::genRandomPassword(10);
		}

		$file_name .= '.zip';

		return $file_name;
	}

	/**
	 * Creates the archive file of all files from the Joomla! installation with a possible exclusion of files and
	 * folders
	 *
	 * @param string $file_name
	 *
	 * @return boolean
	 */
	private function createBackupZipArchiveFiles($file_name)
	{
		// Prepare files which should be excluded
		$exclude_files = $this->params->get('exclude_files');

		if(!empty($exclude_files))
		{
			$exclude_files = array_map('trim', explode("\n", $exclude_files));
		}

		// Prepare folders which should be excluded
		$exclude_folders = $this->params->get('exclude_folders');

		if(!empty($exclude_folders))
		{
			$exclude_folders = array_map('trim', explode("\n", $exclude_folders));
		}

		if(!$dir = @opendir(JPATH_ROOT))
		{
			return false;
		}

		$files_array = array();

		while($file = readdir($dir))
		{
			if($file == '.' OR $file == '..')
			{
				continue;
			}

			if(is_dir(JPATH_ROOT.'/'.$file))
			{
				// Create for all folders an own Zip Archive object to avoid memory overflow
				$zip_folder = new ZipArchive();

				if($zip_folder->open($this->backup_folder.$file_name, ZipArchive::CREATE) !== true)
				{
					return false;
				}
				else
				{
					$this->zipFoldersAndFilesRecursive($zip_folder, JPATH_ROOT.'/'.$file, $file, $exclude_files, $exclude_folders, $file);
				}

				$zip_folder->close();

				if($zip_folder->status != 0)
				{
					return false;
				}
			}
			elseif(is_file(JPATH_ROOT.'/'.$file))
			{
				// First collect all files from the root in an array and add them at once to the archive later
				$files_array[] = $file;
			}
		}

		// Add all files from the root to the archive
		if(!empty($files_array))
		{
			$zip_file = new ZipArchive();

			if($zip_file->open($this->backup_folder.$file_name, ZipArchive::CREATE) !== true)
			{
				return false;
			}

			foreach($files_array as $file)
			{
				if(!empty($exclude_files))
				{
					if(in_array($file, $exclude_files))
					{
						continue;
					}
				}

				// Add the files to the zip archive and set a correct local name
				$zip_file->addFile(JPATH_ROOT.'/'.$file, $file);
				$this->setExternalAttributes($zip_file, $file, fileperms(JPATH_ROOT.'/'.$file));
			}

			$zip_file->close();

			if($zip_file->status != 0)
			{
				return false;
			}
		}

		closedir($dir);
		unset($zip_folder);
		unset($zip_file);

		return true;
	}

	/**
	 * Loads all files and (sub-)folders for the zip archive recursively
	 *
	 * @param object $zip
	 * @param string $folder
	 * @param string $folder_relative
	 * @param array  $exclude_files
	 * @param array  $exclude_folders
	 * @param bool   $folder_start
	 *
	 * @return bool
	 */
	private function zipFoldersAndFilesRecursive($zip, $folder, $folder_relative, $exclude_files = array(), $exclude_folders = array(), $folder_start = false)
	{
		// Do not zip the folders of the backup archives, the cache and temp folders - only create empty folders
		$exclude_folders_create_empty = array('administrator/components/com_easyjoomlabackup/backups', 'cache', 'tmp', 'administrator/cache');

		// First check whether a root folder has to be excluded
		if(!empty($folder_start))
		{
			if(in_array($folder_start, $exclude_folders_create_empty))
			{
				// Add empty folder - 0755
				$zip->addEmptyDir($folder_start.'/');
				$this->setExternalAttributes($zip, $folder_start.'/', 16877);

				// Add new file - 0644
				$zip->addFromString($folder_start.'/index.html', '');
				$this->setExternalAttributes($zip, $folder_start.'/index.html', 33188);

				return true;
			}

			if(!empty($exclude_folders))
			{
				if(in_array($folder_start, $exclude_folders))
				{
					return true;
				}
			}

			// Add the called folder to the zip archive
			$zip->addEmptyDir($folder_start.'/');
			$this->setExternalAttributes($zip, $folder_start.'/', fileperms($folder.'/'));
		}

		// Open the called folder path
		if(!$dir = @opendir($folder))
		{
			return false;
		}

		// Go through the current folder and add data to the zip object
		while($file = readdir($dir))
		{
			if(is_dir($folder.'/'.$file) AND $file != '.' AND $file != '..')
			{
				if(in_array($folder_relative.'/'.$file, $exclude_folders_create_empty))
				{
					// Add empty folder - 0755
					$zip->addEmptyDir($folder_relative.'/'.$file.'/');
					$this->setExternalAttributes($zip, $folder_relative.'/'.$file.'/', 16877);

					// Add new file - 0644
					$zip->addFromString($folder_relative.'/'.$file.'/index.html', '');
					$this->setExternalAttributes($zip, $folder_relative.'/'.$file.'/index.html', 33188);

					// Add a .htaccess to the backup folder to protect the archive files
					if($folder_relative.'/'.$file == 'administrator/components/com_easyjoomlabackup/backups')
					{
						// Add .htaccess with Deny from all - 0444
						$zip->addFromString($folder_relative.'/'.$file.'/.htaccess', 'Deny from all');
						$this->setExternalAttributes($zip, $folder_relative.'/'.$file.'/.htaccess', 33060);
					}

					continue;
				}

				if(!empty($exclude_folders))
				{
					if(in_array($folder_relative.'/'.$file, $exclude_folders))
					{
						continue;
					}
				}

				$zip->addEmptyDir($folder_relative.'/'.$file.'/');
				$this->setExternalAttributes($zip, $folder_relative.'/'.$file.'/', fileperms($folder.'/'.$file.'/'));

				$this->zipFoldersAndFilesRecursive($zip, $folder.'/'.$file, $folder_relative.'/'.$file, $exclude_files, $exclude_folders);
			}
			elseif(is_file($folder.'/'.$file))
			{
				if(!empty($exclude_files))
				{

					if(in_array($folder_relative.'/'.$file, $exclude_files))
					{
						continue;
					}
				}

				// Add the files to the zip archive and set a correct local name
				$zip->addFile($folder.'/'.$file, $folder_relative.'/'.$file);
				$this->setExternalAttributes($zip, $folder_relative.'/'.$file, fileperms($folder.'/'.$file));
			}
		}

		closedir($dir);

		return true;
	}

	private function setExternalAttributes(&$zip_object, $file_name, $file_permission)
	{
		if(!empty($this->external_attributes))
		{
			$zip_object->setExternalAttributesName($file_name, ZipArchive::OPSYS_UNIX, $file_permission << 16);
		}
	}

	/**
	 * Creates a complete dump of the Joomla! database
	 *
	 * @param string $file_name
	 *
	 * @return boolean
	 */
	private function createBackupZipArchiveDatabase($file_name)
	{
		// SQL Dump - Backup the whole database of the Joomla! website and write it into the archive file
		// Only if the zip archive could be created
		$zip_database = new ZipArchive();

		if($zip_database->open($this->backup_folder.$file_name, ZipArchive::CREATE) !== true)
		{
			return false;
		}

		// Set a correct extension for the database dump name
		$file_name_db = str_replace('.zip', '', $file_name).'.sql';
		$this->backupDatabase($file_name_db);

		// Add file which was created from the database export to the zip archive - 0640
		$zip_database->addFile($this->backup_folder.$file_name_db, $file_name_db);
		$this->setExternalAttributes($zip_database, $file_name_db, 33184);

		$zip_database->close();

		// Delete the temporary database dump files
		unlink($this->backup_folder.$file_name_db);

		if($zip_database->status != 0)
		{
			return false;
		}

		return true;
	}

	/**
	 * Creates a SQL Dump of the Joomla! database and add it directly to the archive
	 *
	 * @param string $file_name_dump
	 *
	 * @return boolean
	 */
	private function backupDatabase($file_name_dump)
	{
		$this->db->setUtf();
		$tables = $this->db->getTableList();
		$db_prefix = $this->db->getPrefix();
		$add_drop_statement = $this->params->get('add_drop_statement');

		// Add additional database tables
		$add_db_tables = $this->params->get('add_db_tables');

		if(!empty($add_db_tables))
		{
			$add_db_tables = array_map('trim', explode("\n", $add_db_tables));
		}
		else
		{
			$add_db_tables = array();
		}

		// Create a temporary dump file first. This is required to avoid memory timeouts on large databases!
		$data = '-- EJB - Easy Joomla Backup for Joomal! - SQL Dump'."\n";
		$data .= '-- Author: Viktor Vogel'."\n";
		$data .= '-- Project page: https://joomla-extensions.kubik-rubik.de/ejb-easy-joomla-backup'."\n";
		$data .= '-- License: GNU/GPL - http://www.gnu.org/licenses/gpl.html'."\n\n";

		file_put_contents($this->backup_folder.$file_name_dump, $data);

		foreach($tables as $table)
		{
			if(stripos($table, $db_prefix) !== false OR in_array($table, $add_db_tables))
			{
				$data = '';

				if(!empty($add_drop_statement))
				{
					$data .= 'DROP TABLE IF EXISTS '.$table.';'."\n";
				}

				// Set the query to get the table CREATE statement.
				$this->db->setQuery('SHOW CREATE TABLE '.$table);
				$row_create = $this->db->loadRow();

				$data .= $row_create[1].";\n\n";

				$this->db->setQuery('SELECT * FROM '.$table);
				$result = $this->db->execute();
				$num_fields = $result->field_count;
				$count = $result->num_rows;

				if($count > 0)
				{
					$data .= 'INSERT INTO `'.$table.'` VALUES'."\n";
					$row_list = $this->db->loadRowList();
					$table_columns = array_values($this->db->getTableColumns($table));

					$count_entries = 0;

					foreach($row_list as $row)
					{
						$count_entries++;

						$data .= '(';

						for($j = 0; $j < $num_fields; $j++)
						{
							// First check whether the value is NULL to avoid loss
							if(is_null($row[$j]))
							{
								$data .= 'NULL';
							}
							else
							{
								// Prepare data for a correct syntax
								$row[$j] = str_replace(array('\\', '\'', "\0", "\r\n"), array('\\\\', '\'\'', '\0', '\r\n'), $row[$j]);

								if(isset($row[$j]))
								{
									if(is_numeric($row[$j]) AND stripos($table_columns[$j], 'int') !== false)
									{
										$data .= $row[$j];
									}
									else
									{
										$data .= '\''.$row[$j].'\'';
									}
								}
								else
								{
									$data .= '\'\'';
								}
							}

							if($j < ($num_fields - 1))
							{
								$data .= ', ';
							}
						}

						if($count_entries < $count)
						{
							// Add a new INSERT INTO statement after every fiftieth entry to avoid timeouts
							if($count_entries % 50 == 0)
							{
								$data .= ");\n";
								$data .= 'INSERT INTO `'.$table.'` VALUES'."\n";
							}
							else
							{
								$data .= "),\n";
							}
						}
					}

					$data .= ");\n";
				}

				$data .= "\n\n";

				// Add the data to the temporary dump file
				file_put_contents($this->backup_folder.$file_name_dump, $data, FILE_APPEND);
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
		$file = $this->backup_folder.$table->get('name');

		if(file_exists($file))
		{
			header('Pragma: public');
			header('Expires: 0');
			header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
			header('Cache-Control: public');
			header('Content-Description: File Transfer');
			header('Content-Type: application/zip');
			header('Content-Disposition: attachment; filename='.$table->get('name'));
			header('Content-Transfer-Encoding: binary');
			header('Content-Length:'.$table->get('size'));
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
	 */
	public function removeBackupFilesMax()
	{
		$max_number_backups = $this->params->get('max_number_backups', 5);
		$total_number_backups = $this->getTotal();

		// Only execute the process if the max number is not empty and smaller than the total number
		if(!empty($max_number_backups) AND $total_number_backups > $max_number_backups)
		{
			// Delete outdated files
			if($this->deleteFilesMax($max_number_backups, $total_number_backups - $max_number_backups))
			{
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
	 */
	private function deleteFilesMax($limitstart, $limit)
	{
		$query = $this->db->getQuery(true);
		$query->select($this->db->quoteName('id'));
		$query->from('#__easyjoomlabackup');
		$query->order($this->db->escape('date DESC'));

		$data = $this->_getList($query, $limitstart, $limit);

		if(!empty($data))
		{
			$ids = array();

			foreach($data as $value)
			{
				$ids[] = $value->id;
			}

			$this->input->set('id', $ids);

			if($this->delete())
			{
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

		foreach($ids as $id)
		{
			// Delete the backup file from the server
			$table->load($id);
			unlink($this->backup_folder.$table->get('name'));

			if(!$table->delete($id))
			{
				throw new Exception(JText::_('JERROR_AN_ERROR_HAS_OCCURRED'), 404);
			}
		}

		return true;
	}
}
