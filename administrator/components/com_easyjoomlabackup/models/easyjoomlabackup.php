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
jimport('joomla.application.component.model');

class EasyJoomlaBackupModelEasyJoomlaBackup extends JModelLegacy
{
	protected $db;
	protected $data;
	protected $total;
	protected $pagination;

	function __construct()
	{
		parent::__construct();

		$this->db = JFactory::getDbo();

		$app = JFactory::getApplication();
		$limit = $app->getUserStateFromRequest('global.list.limit', 'limit', JApplicationWeb::getInstance()->get('list_limit'), 'int');
		$limitstart = $app->getUserStateFromRequest('easyjoomlabackup.limitstart', 'limitstart', 0, 'int');
		$limitstart = ($limit != 0 ? (floor($limitstart / $limit) * $limit) : 0);
		$search = $app->getUserStateFromRequest('easyfrontendseo.filter.search', 'filter_search', null);

		$this->setState('limit', $limit);
		$this->setState('limitstart', $limitstart);
		$this->setState('filter.search', $search);
	}

	/**
	 * Loads all or filtered entries from the database
	 *
	 * @return array
	 */
	public function getData()
	{
		if(empty($this->data))
		{
			$query = $this->db->getQuery(true);

			$query->select('*');
			$query->from('#__easyjoomlabackup AS a');

			$search = $this->getState('filter.search');

			if(!empty($search))
			{
				$search = $this->db->Quote('%'.$this->db->escape($search, true).'%');
				$query->where('(a.date LIKE '.$search.') OR (a.comment LIKE '.$search.') OR (a.type LIKE '.$search.') OR (a.size LIKE '.$search.') OR (a.name LIKE '.$search.')');
			}

			$query->order($this->db->escape('date DESC'));

			$this->data = $this->_getList($query, $this->getState('limitstart'), $this->getState('limit'));
		}

		return $this->data;
	}

	/**
	 * Creates the pagination in the footer of the list
	 *
	 * @return JPagination
	 */
	public function getPagination()
	{
		if(empty($this->pagination))
		{
			jimport('joomla.html.pagination');
			$this->pagination = new JPagination($this->getTotal(), (int)$this->getState('limitstart'), (int)$this->getState('limit'));
		}

		return $this->pagination;
	}

	/**
	 * Calculates the total number of all loaded entries
	 *
	 * @return int
	 */
	public function getTotal()
	{
		if(empty($this->total))
		{
			$query = $this->db->getQuery(true);

			$query->select('*');
			$query->from('#__easyjoomlabackup AS a');

			$search = $this->getState('filter.search');

			if(!empty($search))
			{
				$search = $this->db->Quote('%'.$this->db->escape($search, true).'%');
				$query->where('(a.date LIKE '.$search.') OR (a.comment LIKE '.$search.') OR (a.type LIKE '.$search.') OR (a.size LIKE '.$search.') OR (a.name LIKE '.$search.')');
			}

			$query->order($this->db->escape('date ASC'));

			$this->total = $this->_getListCount($query);
		}

		return $this->total;
	}

	/**
	 * Finds backup files without entry in the database or entries without backup files
	 *
	 * @return boolean
	 */
	public function discover()
	{
		// Get all backup files
		$backup_files = array();
		$dir = @opendir(JPATH_ADMINISTRATOR.'/components/com_easyjoomlabackup/backups/');

		while($file = readdir($dir))
		{
			if(substr(strtolower($file), -3) == 'zip')
			{
				$backup_files[] = $file;
			}
		}

		closedir($dir);

		// Get all entries
		$entries = $this->getData();

		if(empty($backup_files) AND empty($entries))
		{
			return false;
		}

		$entries_array = array();

		// Check whether an entry has to be removed - case: backup archive does not exist but entry in the database does
		foreach($entries as $entry)
		{
			$entries_array[] = $entry->name;

			if(!in_array($entry->name, $backup_files))
			{
				$this->removeEntry($entry->id);
				continue;
			}
		}

		// Check whether an entry has to be added - case: entry in the database does not exist but backup archive does
		foreach($backup_files as $backup_file)
		{
			if(!in_array($backup_file, $entries_array))
			{
				$this->addEntry($backup_file);
				continue;
			}
		}

		return true;
	}

	/**
	 * Gets the status of the plugin
	 *
	 * @return array
	 */
	public function getPluginStatus()
	{
		$plugin_state = array();
		$query = $this->db->getQuery(true);

		$query->select('*');
		$query->from('#__extensions');
		$query->where('folder = '.$this->db->quote('system').' AND element = '.$this->db->quote('easyjoomlabackupcronjob'));

		$result = $this->_getList($query);

		if(!empty($result))
		{
			$plugin_state = array('enabled' => (boolean)$result[0]->enabled, 'url_settings' => JUri::base().'index.php?option=com_plugins&task=plugin.edit&extension_id='.$result[0]->extension_id);
		}

		return $plugin_state;
	}

	/**
	 * Removes an entry from the database if the backup file does not exist
	 *
	 * @param int $id
	 *
	 * @return boolean
	 */
	private function removeEntry($id)
	{
		$query = "DELETE FROM ".$this->db->quoteName('#__easyjoomlabackup')." WHERE ".$this->db->quoteName('id')." = ".$this->db->quote($id);
		$this->db->setQuery($query);
		$this->db->execute();

		return true;
	}

	/**
	 * Adds an entry if the backup file does exist without a corresponding entry in the database
	 *
	 * @param string $file_name
	 *
	 * @return boolean
	 */
	private function addEntry($file_name)
	{
		$date = date("Y-m-d H:i:s.", filemtime(JPATH_ADMINISTRATOR.'/components/com_easyjoomlabackup/backups/'.$file_name));
		$size = filesize(JPATH_ADMINISTRATOR.'/components/com_easyjoomlabackup/backups/'.$file_name);

		$query = "INSERT INTO ".$this->db->quoteName('#__easyjoomlabackup')." (".$this->db->quoteName('date').", ".$this->db->quoteName('comment').", ".$this->db->quoteName('type').", ".$this->db->quoteName('size').", ".$this->db->quoteName('duration').", ".$this->db->quoteName('name').") VALUES (".$this->db->quote($date).", '', ".$this->db->quote('discovered').", ".$this->db->quote($size).", '', ".$this->db->quote($file_name).")";
		$this->db->setQuery($query);
		$this->db->execute();

		return true;
	}
}
