<?php

/**
 * @copyright     Copyright (c) 2009-2017 Ryan Demmer. All rights reserved
 * @license       GNU/GPL 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * JCE is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses
 */
defined('_JEXEC') or die('RESTRICTED');

// load base model
require_once dirname(__FILE__).'/model.php';

wfimport('admin.models.plugins');

/**
 * Profiles Model.
 */
class WFModelProfiles extends WFModel
{
    /**
     * Convert row string into array.
     *
     * @param object $rows
     *
     * @return array $rows
     */
    public function getRowArray($rows)
    {
        $out = array();
        $rows = explode(';', $rows);
        $i = 1;
        foreach ($rows as $row) {
            $out[$i] = $row;
            ++$i;
        }

        return $out;
    }

    /**
     * Get a plugin's extensions.
     *
     * @param object $plugin
     *
     * @return array extensions
     */
    public function getExtensions($plugin)
    {
        wfimport('admin.models.plugins');

        $model = new WFModelplugins();

        $extensions = array();
        $supported = array();

        $item = null;

        if (is_file($plugin->manifest)) {
            $xml = WFXMLElement::load($plugin->manifest);

            // get the plugin xml file
            if ($xml) {
                // get extensions supported by the plugin
                if ((string) $xml->extensions) {
                    $supported = explode(',', (string) $xml->extensions);
                }
            }
        }

        foreach ($model->getExtensions() as $extension) {
            // the plugin only supports some extensions, move along
            if (!in_array($extension->folder, $supported)) {
                continue;
            }

            // this extension only supports some plugins, move along
            if (!empty($extension->plugins) && !in_array($plugin->name, $extension->plugins)) {
                continue;
            }

            $extensions[$extension->folder][] = $extension;
        }

        return $extensions;
    }

    public function getPlugins($plugins = array())
    {
        $commands = array();

        if (empty($plugins)) {
            $commands = WFModelplugins::getCommands();
        }

        // only need plugins with xml files
        foreach (WFModelplugins::getPlugins() as $name => $plugin) {
            if (is_file($plugin->manifest)) {
                $plugins[$name] = $plugin;
            }
        }

        return array_merge($commands, $plugins);
    }

    public function getUserGroups($area)
    {
        $db = JFactory::getDBO();

        if (defined('JPATH_PLATFORM')) {
            jimport('joomla.access.access');

            $query = $db->getQuery(true);

            if (is_object($query)) {
                $query->select('id')->from('#__usergroups');
            } else {
                $query = 'SELECT id FROM #__usergroups';
            }

            $db->setQuery($query);
            if (method_exists($db, 'loadColumn')) {
                $groups = $db->loadColumn();
            } else {
                $groups = $db->loadResultArray();
            }

            $front = array();
            $back = array();

            foreach ($groups as $group) {
                $create = JAccess::checkGroup($group, 'core.create');
                $admin = JAccess::checkGroup($group, 'core.login.admin');
                $super = JAccess::checkGroup($group, 'core.admin');

                if ($super) {
                    $back[] = $group;
                } else {
                    // group can create
                    if ($create) {
                        // group has admin access
                        if ($admin) {
                            $back[] = $group;
                        } else {
                            $front[] = $group;
                        }
                    }
                }
            }
        } else {
            $front = array(
                '19',
                '20',
                '21',
            );
            $back = array(
                '23',
                '24',
                '25',
            );
        }

        switch ($area) {
            case 0:
                return array_merge($front, $back);
                break;
            case 1:
                return $front;
                break;
            case 2:
                return $back;
                break;
        }

        return array();
    }

    /**
     * Create the Profiles table.
     *
     * @return bool
     */
    public function createProfilesTable()
    {
        jimport('joomla.installer.helper');

        $mainframe = JFactory::getApplication();

        $db = JFactory::getDBO();
        $driver = strtolower($db->name);

        switch ($driver) {
            default:
            case 'mysql':
            case 'mysqli':
                $driver = 'mysql';
                break;
            case 'sqlsrv':
            case 'sqlazure':
            case 'sqlzure':
                $driver = 'sqlsrv';
                break;
            case 'postgresql':
                $driver = 'postgresql';
                break;
        }

        $file = dirname(dirname(__FILE__)).'/sql/'.$driver.'.sql';
        $error = null;

        if (is_file($file)) {
            $query = file_get_contents($file);

            if ($query) {
                // replace prefix
                $query = $db->replacePrefix((string) $query);

                // Postgresql needs special attention because of the query syntax
                if ($driver == 'postgresql') {
                    $query = "CREATE OR REPLACE FUNCTION create_table_if_not_exists (create_sql text)
                    RETURNS bool as $$
                    BEGIN
                        BEGIN
                            EXECUTE create_sql;
                            EXCEPTION WHEN duplicate_table THEN RETURN false;
                        END;
                        RETURN true;
                    END; $$
                    LANGUAGE plpgsql;
                    SELECT create_table_if_not_exists ('" .$query."');";
                }
                // set query
                $db->setQuery(trim($query));

                if (!$db->query()) {
                    $mainframe->enqueueMessage(WFText::_('WF_INSTALL_TABLE_PROFILES_ERROR').$db->stdErr(), 'error');

                    return false;
                } else {
                    return true;
                }
            } else {
                $error = 'NO SQL QUERY';
            }
        } else {
            $error = 'SQL FILE MISSING';
        }

        $mainframe->enqueueMessage(WFText::_('WF_INSTALL_TABLE_PROFILES_ERROR').!is_null($error) ? ' - '.$error : '', 'error');

        return false;
    }

    /**
     * Install Profiles.
     *
     * @return bool
     *
     * @param object $install[optional]
     */
    public function installProfiles()
    {
        $app = JFactory::getApplication();
        $db = JFactory::getDBO();

        if ($this->createProfilesTable()) {
            self::buildCountQuery();

            $profiles = array('Default' => false, 'Front End' => false);

            // No Profiles table data
            if (!$db->loadResult()) {
                $xml = dirname(__FILE__).'/profiles.xml';

                if (is_file($xml)) {
                    if (!$this->processImport($xml)) {
                        $app->enqueueMessage(WFText::_('WF_INSTALL_PROFILES_ERROR'), 'error');

                        return false;
                    }
                } else {
                    $app->enqueueMessage(WFText::_('WF_INSTALL_PROFILES_NOFILE_ERROR'), 'error');

                    return false;
                }
            }

            return true;
        }

        return false;
    }

    private static function buildCountQuery($name = '')
    {
        $db = JFactory::getDBO();

        $query = $db->getQuery(true);

        // check for name
        if (is_object($query)) {
            $query->select('COUNT(id)')->from('#__wf_profiles');

            if ($name) {
                $query->where('name = '.$db->Quote($name));
            }
        } else {
            $query = 'SELECT COUNT(id) FROM #__wf_profiles';

            if ($name) {
                $query .= ' WHERE name = '.$db->Quote($name);
            }
        }

        $db->setQuery($query);
    }

    /**
     * Process import data from XML file.
     *
     * @param object $file    XML file
     * @param bool   $install Can be used by the package installer
     *
     * @return bool
     */
    public function processImport($file)
    {
        $app = JFactory::getApplication();
        $db = JFactory::getDBO();
        $view = JRequest::getCmd('view');

        $language = JFactory::getLanguage();
        $language->load('com_jce', JPATH_ADMINISTRATOR);

        JTable::addIncludePath(dirname(dirname(__FILE__)).'/tables');

        $xml = WFXMLElement::load($file);

        if ($xml) {
            $n = 0;

            foreach ($xml->profiles->children() as $profile) {
                $row = JTable::getInstance('profiles', 'WFTable');
                // get profile name
                $name = (string) $profile->attributes()->name;

                // backwards compatability
                if ($name) {
                    self::buildCountQuery($name);
                    // create name copy if exists
                    while ($db->loadResult()) {
                        $name = JText::sprintf('WF_PROFILES_COPY_OF', $name);

                        self::buildCountQuery($name);
                    }
                    // set name
                    $row->name = $name;
                }

                foreach ($profile->children() as $item) {
                    switch ($item->getName()) {
                        case 'name':
                            $name = (string) $item;
                            // only if name set and table name not set
                            if ($name && !$row->name) {
                                self::buildCountQuery($name);

                                // create name copy if exists
                                while ($db->loadResult()) {
                                    $name = JText::sprintf('WF_PROFILES_COPY_OF', $name);

                                    self::buildCountQuery($name);
                                }
                                // set name
                                $row->name = $name;
                            }

                            break;
                        case 'description':
                            $row->description = WFText::_((string) $item);

                            break;
                        case 'types':
                            if (!(string) $item) {
                                $area = (string) $profile->area[0];

                                $groups = $this->getUserGroups($area);
                                $data = implode(',', array_unique($groups));
                            } else {
                                $data = (string) $item;
                            }
                            $row->types = $data;
                            break;
                        case 'params':
                            $params = array();
                            foreach ($item->children() as $param) {
                                $params[] = (string) $param;
                            }
                            $row->params = implode("\n", $params);

                            break;
                        case 'rows':

                            $row->rows = (string) $item;

                            break;
                        case 'plugins':
                            $row->plugins = (string) $item;
                            break;
                        case 'checked_out_time':
                            $row->checked_out_time = $db->getNullDate();
                            break;
                        default:
                            $key = $item->getName();
                            $row->$key = (string) $item;

                            break;
                    }
                }

                if (!$row->store()) {
                    $app->enqueueMessage(WFText::_('WF_PROFILES_IMPORT_ERROR'), $row->getError(), 'error');

                    return false;
                } else {
                    ++$n;
                }
            }

            return true;
        }
    }

    /**
     * Get default profile data.
     *
     * @return object Profile table object
     */
    public function getDefaultProfile()
    {
        $mainframe = JFactory::getApplication();
        $file = JPATH_COMPONENT.'/models/profiles.xml';

        $xml = WFXMLElement::load($file);

        if ($xml) {
            foreach ($xml->profiles->children() as $profile) {
                if ($profile->attributes()->default) {
                    $row = JTable::getInstance('profiles', 'WFTable');

                    foreach ($profile->children() as $item) {
                        switch ($item->getName()) {
                            case 'rows':
                                $row->rows = (string) $item;
                                break;
                            case 'plugins':
                                $row->plugins = (string) $item;
                                break;
                            default:
                                $key = $item->getName();
                                $row->$key = (string) $item;

                                break;
                        }
                    }
                    // reset name and description
                    $row->name = '';
                    $row->description = '';

                    return $row;
                }
            }
        }

        return null;
    }

    public function getEditorParams(&$row)
    {
        // get params definitions
        $xml = WF_EDITOR_LIBRARIES.'/xml/config/profiles.xml';

        // get editor params
        $params = new WFParameter($row->params, $xml, 'editor');
        $params->addElementPath(JPATH_COMPONENT.'/elements');
        $params->addElementPath(WF_EDITOR.'/elements');

        $groups = $params->getGroups();

        $row->editor_params = $params;
        $row->editor_groups = $groups;
    }

    public function getLayoutParams(&$row)
    {
        // get params definitions
        $xml = WF_EDITOR_LIBRARIES.'/xml/config/layout.xml';

        // get editor params
        $params = new WFParameter($row->params, $xml, 'editor');
        $params->addElementPath(JPATH_COMPONENT.'/elements');
        $params->addElementPath(WF_EDITOR.'/elements');

        $groups = $params->getGroups();

        $row->layout_params = $params;
        $row->layout_groups = $groups;
    }

    public function getPluginParameters()
    {
    }

    public function getThemes()
    {
        jimport('joomla.filesystem.folder');
        $path = WF_EDITOR_THEMES.'/advanced/skins';

        return JFolder::folders($path, '.', false, true);
    }

    /**
     * Check whether a table exists.
     *
     * @return bool
     *
     * @param string $table Table name
     */
    public static function checkTable()
    {
        $db = JFactory::getDBO();

        $tables = $db->getTableList();

        if (!empty($tables)) {
            // swap array values with keys, convert to lowercase and return array keys as values
            $tables = array_keys(array_change_key_case(array_flip($tables)));
            $app = JFactory::getApplication();
            $match = str_replace('#__', strtolower($app->getCfg('dbprefix', '')), '#__wf_profiles');

            return in_array($match, $tables);
        }

        // try with query
        self::buildCountQuery();

        return $db->query();
    }

    /**
     * Check table contents.
     *
     * @return int
     *
     * @param string $table Table name
     */
    public static function checkTableContents()
    {
        $db = JFactory::getDBO();

        self::buildCountQuery();

        return $db->loadResult();
    }

    private function getIconType($icon)
    {
        // TODO - Enhance this later to get the type from xml

        if (in_array($icon, array('styleselect', 'formatselect', 'fontselect', 'fontsizeselect'))) {
            return 'mceListBox';
        }

        if (in_array($icon, array('numlist', 'bullist', 'forecolor', 'backcolor', 'spellchecker', 'textcase'))) {
            return 'mceSplitButton';
        }

        return 'mceButton';
    }

    public function getIcon($plugin)
    {
        if ($plugin->type == 'command') {
            $base = 'components/com_jce/editor/tiny_mce/themes/advanced/img';
        } else {
            if (isset($plugin->url)) {
                $base = $plugin->url . '/img';
            } else {
                $base = 'components/com_jce/editor/tiny_mce/plugins/' . $plugin->name . '/img';
            }
        }
        // convert backslashes
        $base = preg_replace('#[/\\\\]+#', '/', $base);

        $span = '';
        $img = '';
        $icons = explode(',', $plugin->icon);

        foreach ($icons as $icon) {
            if ($icon == '|' || $icon == 'spacer') {
                continue;
            } else {
                $path = $base . '/' . $icon . '.png';

                if (JFile::exists(JPATH_SITE.'/'.$path)) {
                    $img = '<img src="' . JURI::root(true) . '/' . $path . '" alt="' . WFText::_($plugin->title) . '" />';
                }

                $span .= '<div data-button="' . preg_replace('/[^\w]/i', '', $icon) . '" class="' . self::getIconType($icon) . '"><span class="mceIcon mce_'.preg_replace('/[^\w]/i', '', $icon) . '">' . $img . '</span></div>';
            }
        }

        return $span;
    }

    public function saveOrder($cid, $order)
    {
        $db = JFactory::getDBO();
        $total = count($cid);

        JArrayHelper::toInteger($cid, array(0));
        JArrayHelper::toInteger($order, array(0));

        $row = JTable::getInstance('profiles', 'WFTable');
        $conditions = array();

        // update ordering values
        for ($i = 0; $i < $total; ++$i) {
            $row->load((int) $cid[$i]);
            if ($row->ordering != $order[$i]) {
                $row->ordering = $order[$i];
                if (!$row->store()) {
                    return false;
                }
                // remember to updateOrder this group
                $condition = ' ordering > -10000 AND ordering < 10000';
                $found = false;
                foreach ($conditions as $cond) {
                    if ($cond[1] == $condition) {
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    $conditions[] = array($row->id, $condition);
                }
            }
        }

        // execute updateOrder for each group
        foreach ($conditions as $cond) {
            $row->load($cond[0]);
            $row->reorder($cond[1]);
        }

        return true;
    }
}