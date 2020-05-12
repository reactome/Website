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

use Joomla\CMS\{MVC\Model\BaseDatabaseModel, Factory, Uri\Uri, Pagination\Pagination, Application\WebApplication};

class EasyJoomlaBackupModelEasyJoomlaBackup extends BaseDatabaseModel
{
    /**
     * @var JDatabaseDriver $db
     * @since 3.0.0-FREE
     */
    protected $db;
    /**
     * @var array $data
     * @since 3.0.0-FREE
     */
    protected $data;
    /**
     * @var int $total
     * @since 3.0.0-FREE
     */
    protected $total;
    /**
     * @var object $pagination
     * @since 3.0.0-FREE
     */
    protected $pagination;

    /**
     * EasyJoomlaBackupModelEasyJoomlaBackup constructor.
     *
     * @throws Exception
     * @since 3.0.0-FREE
     */
    public function __construct()
    {
        parent::__construct();

        $this->db = Factory::getDbo();

        $app = Factory::getApplication();
        $limit = $app->getUserStateFromRequest('global.list.limit', 'limit', WebApplication::getInstance()->get('list_limit'), 'int');
        $limitstart = $app->getUserStateFromRequest('easyjoomlabackup.limitstart', 'limitstart', 0, 'int');
        $limitstart = ($limit != 0 ? (floor($limitstart / $limit) * $limit) : 0);
        $search = $app->getUserStateFromRequest('easyfrontendseo.filter.search', 'filter_search', null);

        $this->setState('limit', $limit);
        $this->setState('limitstart', $limitstart);
        $this->setState('filter.search', $search);
    }

    /**
     * Creates the pagination in the footer of the list
     *
     * @return object
     * @since 3.0.0-FREE
     */
    public function getPagination(): object
    {
        if (empty($this->pagination)) {
            $this->pagination = new Pagination($this->getTotal(), (int)$this->getState('limitstart'), (int)$this->getState('limit'));
        }

        return $this->pagination;
    }

    /**
     * Calculates the total number of all loaded entries
     *
     * @return int
     * @since 3.0.0-FREE
     */
    public function getTotal(): int
    {
        if (empty($this->total)) {
            $query = $this->db->getQuery(true);

            $query->select('*');
            $query->from('#__easyjoomlabackup AS a');

            $search = $this->getState('filter.search');

            if (!empty($search)) {
                $search = $this->db->quote('%' . $this->db->escape($search, true) . '%');
                $query->where('(a.date LIKE ' . $search . ') OR (a.comment LIKE ' . $search . ') OR (a.type LIKE ' . $search . ') OR (a.size LIKE ' . $search . ') OR (a.name LIKE ' . $search . ')');
            }

            $query->order($this->db->escape('date ASC'));
            $this->total = $this->_getListCount($query);
        }

        return $this->total;
    }

    /**
     * Finds backup files without entry in the database or entries without backup files
     *
     * @return bool
     * @since 3.0.0-FREE
     */
    public function discover(): bool
    {
        // Get all backup files
        $backupFiles = [];
        $dir = @opendir(JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/backups/');

        while ($file = readdir($dir)) {
            if (substr(strtolower($file), -3) == 'zip') {
                $backupFiles[] = $file;
            }
        }

        closedir($dir);

        // Get all entries
        $entries = $this->getData();

        if (empty($backupFiles) && empty($entries)) {
            return false;
        }

        $entriesArray = [];

        // Check whether an entry has to be removed - Case: Backup archive does not exist but entry in the database does
        foreach ($entries as $entry) {
            $entriesArray[] = $entry->name;

            if (!in_array($entry->name, $backupFiles)) {
                $this->removeEntry($entry->id);
                continue;
            }
        }

        // Check whether an entry has to be added - Case: Entry in the database does not exist but backup archive does
        foreach ($backupFiles as $backupFile) {
            if (!in_array($backupFile, $entriesArray)) {
                $this->addEntry($backupFile);
                continue;
            }
        }

        return true;
    }

    /**
     * Loads all or filtered entries from the database
     *
     * @return array
     * @since 3.0.0-FREE
     */
    public function getData(): array
    {
        if (empty($this->data)) {
            $query = $this->db->getQuery(true);

            $query->select('*');
            $query->from('#__easyjoomlabackup AS a');

            $search = $this->getState('filter.search');

            if (!empty($search)) {
                $search = $this->db->quote('%' . $this->db->escape($search, true) . '%');
                $query->where('(a.date LIKE ' . $search . ') OR (a.comment LIKE ' . $search . ') OR (a.type LIKE ' . $search . ') OR (a.size LIKE ' . $search . ') OR (a.name LIKE ' . $search . ')');
            }

            $query->order($this->db->escape('date DESC'));
            $this->data = $this->_getList($query, $this->getState('limitstart'), $this->getState('limit'));
        }

        return $this->data;
    }

    /**
     * Removes an entry from the database if the backup file does not exist
     *
     * @param int $id
     *
     * @return bool
     * @since 3.0.0-FREE
     */
    private function removeEntry(int $id): bool
    {
        $query = "DELETE FROM " . $this->db->quoteName('#__easyjoomlabackup') . " WHERE " . $this->db->quoteName('id') . " = " . $this->db->quote($id);
        $this->db->setQuery($query);
        $this->db->execute();

        return true;
    }

    /**
     * Adds an entry if the backup file does exist without a corresponding entry in the database
     *
     * @param string $fileName
     *
     * @return bool
     * @since 3.0.0-FREE
     */
    private function addEntry(string $fileName): bool
    {
        $date = date("Y-m-d H:i:s.", filemtime(JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/backups/' . $fileName));
        $size = filesize(JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup/backups/' . $fileName);

        $query = "INSERT INTO " . $this->db->quoteName('#__easyjoomlabackup') . " (" . $this->db->quoteName('date') . ", " . $this->db->quoteName('comment') . ", " . $this->db->quoteName('type') . ", " . $this->db->quoteName('size') . ", " . $this->db->quoteName('duration') . ", " . $this->db->quoteName('name') . ") VALUES (" . $this->db->quote($date) . ", '', " . $this->db->quote('discovered') . ", " . $this->db->quote($size) . ", '', " . $this->db->quote($fileName) . ")";
        $this->db->setQuery($query);
        $this->db->execute();

        return true;
    }

    /**
     * Gets the status of the plugin
     *
     * @return array
     * @since 3.0.0-FREE
     */
    public function getPluginStatus(): array
    {
        $pluginState = [];
        $query = $this->db->getQuery(true);

        $query->select('*');
        $query->from('#__extensions');
        $query->where('folder = ' . $this->db->quote('system') . ' AND element = ' . $this->db->quote('easyjoomlabackupcronjob'));

        $result = $this->_getList($query);

        if (!empty($result)) {
            $pluginState = ['enabled' => (boolean)$result[0]->enabled, 'url_settings' => Uri::base() . 'index.php?option=com_plugins&task=plugin.edit&extension_id=' . $result[0]->extension_id];
        }

        return $pluginState;
    }
}
