<?php
/**
 * @package         Sourcerer
 * @version         9.5.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2023 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\Installer\Manifest\PackageManifest as JPackageManifest;
use Joomla\CMS\Language\Text as JText;

if ( ! class_exists('pkg_sourcererInstallerScript'))
{
    class pkg_sourcererInstallerScript
    {
        static $adapter;
        static $current_version;
        static $extensions         = [];
        static $file_string;
        static $min_joomla_version = [3 => '3.9.0', 4 => '4.0'];
        static $min_php_version    = [3 => '7.4', 4 => '7.4'];
        static $name;
        static $new_manifest;
        static $package_name;
        static $previous_version;
        static $previous_joomla_version;
        static $dependancies       = [
            'regularlabs',
            'conditions',
        ];

        public function postflight($install_type, $adapter)
        {
            static::$adapter = $adapter;

            if ( ! in_array($install_type, ['install', 'update']))
            {
                return true;
            }

            self::updateManifestFile();
            self::updatePackageIds();

            self::publishExtensions($install_type);
            self::updateUpdateSites();
            self::removeUnusedLanguageFiles();

            self::clearCache();
            self::displayMessages();

            return true;
        }

        private function removeUnusedLanguageFiles()
        {
            $joomla_version  = self::getJoomlaVersion();
            $packages_folder = __DIR__ . '/packages/j' . $joomla_version;

            $installed_languages = array_unique(array_merge(
                JFolder::folders(JPATH_SITE . '/language', '^[a-z]+-[A-Z]+$'),
                JFolder::folders(JPATH_ADMINISTRATOR . '/language', '^[a-z]+-[A-Z]+$')
            ));
            $package_languages   = JFolder::folders($packages_folder, '^[a-z]+-[A-Z]+$', true, true);

            $remove_folders = [];
            foreach ($package_languages as $path)
            {
                $path = str_replace($packages_folder . '/', '', $path);

                // remove leading package folders
                $path = preg_replace('#^[^/]+/packages/#', '', $path);

                // continue if there are not exactly 2 slashes in the path
                if (substr_count($path, '/') !== 2)
                {
                    continue;
                }

                list($extension, $unused, $language) = explode('/', $path);

                // skip if this is an installed language
                if (in_array($language, $installed_languages))
                {
                    continue;
                }

                $folder = self::getFolderFromExtensionName($extension);

                // skip if no extension folder was found
                if ( ! $folder)
                {
                    continue;
                }

                $folder = self::getFolderFromExtensionName($extension) . '/language/' . $language;

                // skip if folder doesn't exist
                if ( ! is_dir($folder))
                {
                    continue;
                }

                $remove_folders[] = self::getFolderFromExtensionName($extension) . '/language/' . $language;
            }

            if (empty($remove_folders))
            {
                return;
            }

            self::delete($remove_folders);
        }

        private static function getFolderFromExtensionName($extension)
        {
            list($type, $name) = explode('_', $extension, 2);
            switch ($type)
            {
                case 'com':
                    return JPATH_ADMINISTRATOR . '/components/com_' . $name;
                case 'mod':
                    return JPATH_ADMINISTRATOR . '/modules/mod_' . $name;
                case 'plg':
                    list($folder, $name) = explode('_', $name, 2);

                    return JPATH_SITE . '/plugins/' . $folder . '/' . $name;
                default:
                    return false;
            }
        }

        private static function delete($files = [])
        {
            foreach ($files as $file)
            {
                if (is_dir($file))
                {
                    JFolder::delete($file);
                }

                if (is_file($file))
                {
                    JFile::delete($file);
                }
            }
        }

        public function preflight($install_type, $adapter)
        {
            static::$adapter = $adapter;

            if ( ! in_array($install_type, ['install', 'update']))
            {
                return true;
            }

            $manifest = $adapter->getManifest();

            static::$package_name            = trim($manifest->packagename);
            static::$name                    = trim($manifest->name);
            static::$current_version         = trim($manifest->version);
            static::$previous_version        = self::getPreviousVersion();
            static::$previous_joomla_version = self::getPreviousJoomlaVersion();

            if ( ! self::canInstall())
            {
                return false;
            }

            self::setNewManifest();

            return true;
        }

        private static function canInstall()
        {
            if ( ! self::passFreeOverProCheck())
            {
                return false;
            }

            if ( ! self::passJoomlaVersion())
            {
                return false;
            }

            if ( ! self::passMinimumPHPVersion())
            {
                return false;
            }

            return true;
        }

        private static function clearCache()
        {
            JFactory::getCache()->clean('_system');
            JFactory::getCache()->clean('com_plugins');
            JFactory::getCache()->clean('com_modules');
        }

        private static function displayChangelog()
        {
            $msg = self::getInstallationLanguageString();

            JFactory::getApplication()->enqueueMessage(
                JText::sprintf(
                    $msg,
                    '<strong>' . JText::_(static::$name . '_SHORT') . '</strong>',
                    '<strong>' . static::$current_version . '</strong>'
                ), 'success'
            );

            $changelog = self::getChangelog();

            JFactory::getApplication()->enqueueMessage($changelog, 'info');
        }

        private static function displayMessages()
        {
            self::displayChangelog();
            self::reorderMessageQueue();
        }

        private static function getChangelog()
        {
            $changelog = file_get_contents(__DIR__ . '/CHANGELOG.txt');

            $changelog = "\n" . trim(preg_replace('#^.* \*/#s', '', $changelog));
            $changelog = preg_replace("#\r#s", '', $changelog);

            $parts = explode("\n\n", $changelog);

            if (empty($parts))
            {
                return '';
            }

            $changelog = [];

            // Add first entry to the changelog
            $changelog[] = array_shift($parts);

            $previous_version_simple = preg_replace('#^([0-9\.]+).*$#', '\1', static::$previous_version);

            if (preg_match('#^[0-9]+-[a-z]+-[0-9]+ : v([0-9\.]+(?:-dev[0-9]+)?)\n#i', trim($changelog[0]), $match))
            {
                $this_version = $match[1];
            }

            // Add extra older entries if this is an upgrade based on previous installed version
            if (static::$previous_version)
            {
                foreach ($parts as $part)
                {
                    $part = trim($part);

                    if ( ! preg_match('#^[0-9]+-[a-z]+-[0-9]+ : v([0-9\.]+(?:-dev[0-9]+)?)\n#i', $part, $match))
                    {
                        continue;
                    }

                    $changelog_version = $match[1];

                    if (version_compare($changelog_version, $previous_version_simple, '<='))
                    {
                        break;
                    }

                    $changelog[] = $part;
                }
            }

            $joomla_version = self::getJoomlaVersion();

            $badge_classes = [
                'default' => $joomla_version == 3 ? 'label label-sm label-default' : 'rl-badge badge bg-secondary',
                'success' => $joomla_version == 3 ? 'label label-sm label-success' : 'rl-badge badge text-white bg-success',
                'info'    => $joomla_version == 3 ? 'label label-sm label-info' : 'rl-badge badge text-white bg-info',
                'warning' => $joomla_version == 3 ? 'label label-sm label-warning' : 'rl-badge badge text-white bg-warning',
                'danger'  => $joomla_version == 3 ? 'label label-sm label-important' : 'rl-badge badge text-white bg-danger',
            ];

            $changelog = implode('</pre>' . "\n\n", $changelog);

            //  + Added   ! Removed   ^ Changed   # Fixed
            $change_types = [
                '+' => ['title' => 'Added', 'class' => $badge_classes['success']],
                '^' => ['title' => 'Changed', 'class' => $badge_classes['info']],
                '#' => ['title' => 'Fixed', 'class' => $badge_classes['warning']],
                '!' => ['title' => 'Removed', 'class' => $badge_classes['danger']],
            ];
            foreach ($change_types as $char => $type)
            {
                $changelog = preg_replace(
                    '#\n ' . preg_quote($char, '#') . ' #',
                    "\n" . '<span class="' . $type['class'] . '" title="' . $type['title'] . '">' . $char . '</span> ',
                    $changelog
                );
            }

            // Extract note
            $note = '';
            if (preg_match('#\n > (.*?)\n#s', $changelog, $match))
            {
                $note      = $match[1];
                $changelog = str_replace($match[0], "\n", $changelog);
            }

            $changelog = preg_replace('#see: (https://www\.regularlabs\.com[^ \)]*)#s', '<a href="\1" target="_blank">see documentation</a>', $changelog);

            $changelog = preg_replace(
                    "#(\n+)([0-9]+.*?) : v([0-9\.]+(?:-dev[0-9]*)?)([^\n]*?\n+)#",
                    '\1'
                    . '<code>v\3</code> [\2]'
                    . '\4<pre>',
                    $changelog
                ) . '</pre>';

            $code_styling = $joomla_version == 3
                ? 'white-space: pre-wrap;line-height: 1.6em;max-height: 120px;overflow: auto;'
                : 'white-space: pre-wrap;line-height: 1.6em;';
            $changelog    = str_replace(
                [
                    '<pre>',
                    '[FREE]',
                    '[PRO]',
                ],
                [
                    '<pre class="border bg-light p-2" style="' . $code_styling . '">',
                    '<span class="' . $badge_classes['success'] . '">FREE</span>',
                    '<span class="' . $badge_classes['info'] . '">PRO</span>',
                ],
                $changelog
            );

            $changelog = preg_replace(
                '#\[J([1-9][\.0-9]*)\]#',
                '<span class="' . $badge_classes['default'] . '">J\1</span>',
                $changelog
            );

            $msg = self::getInstallationLanguageString();

            $title1 = JText::sprintf(
                $msg,
                '<strong>' . JText::_(static::$name . '_SHORT') . '</strong>',
                '<strong>' . static::$current_version . '</strong>'
            );

            $title2 = JText::_('PKG_RL_LATEST_CHANGES');

            if (static::$previous_version
                && version_compare(static::$previous_version, static::$current_version, '<'))
            {
                $title2 = JText::sprintf('PKG_RL_LATEST_CHANGES_SINCE', $previous_version_simple);

                $previous_version_major = (int) static::$previous_version;
                $current_version_major  = (int) static::$current_version;
                if (version_compare($previous_version_major, $current_version_major, '<'))
                {
                    JFactory::getApplication()->enqueueMessage(JText::sprintf(
                        'PKG_RL_MAJOR_UPGRADE',
                        '<strong>' . JText::_(static::$name . '_SHORT') . '</strong>'
                    ), 'warning');
                }
            }

            if (strpos(static::$current_version, 'dev') !== false)
            {
                $note = '';
            }

            return '<h3>' . $title1 . '</h3>'
                . '<h4>' . $title2 . '</h4>'
                . ($note ? '<div class="alert alert-warning">' . $note . '</div>' : '')
                . $changelog;
        }

        private static function getExtensions()
        {
            if ( ! empty(static::$extensions))
            {
                return static::$extensions;
            }

            $manifest = self::getNewManifest();
            $xml      = $manifest->asXML();

            self::removeDependanciesFromString($xml);

            $file = __DIR__ . '/pkg_' . static::$package_name . '.xml';

            file_put_contents($file, $xml);

            $package_manifest = new JPackageManifest($file);

            static::$extensions = $package_manifest->filelist;

            foreach (static::$extensions as $extension)
            {
                if ($extension->type != 'module')
                {
                    continue;
                }

                $extension->position = self::getModulePositionFromXMLString($xml, $extension->id);
            }

            return static::$extensions;
        }

        private static function getFilesString($xml)
        {
            $tag = 'files_j' . self::getJoomlaVersion();

            $string = self::getTagStringFromXml($xml, $tag, 'files');

            static::$file_string = $string;

            if (empty($string))
            {
                return '';
            }

            self::removeDependanciesIfOlder($string);

            return $string;
        }

        private static function removeDependanciesFromString(&$string)
        {
            foreach (static::$dependancies as $dependancy)
            {
                self::removePackageFilesFromString($string, $dependancy);
            }
        }

        private static function removeDependanciesIfOlder(&$string)
        {
            foreach (static::$dependancies as $dependancy)
            {
                self::removeDependancyIfOlder($string, $dependancy);
            }
        }

        private static function removeDependancyIfOlder(&$string, $dependancy)
        {
            if ( ! self::shouldUpdateDependancy($dependancy))
            {
                self::removePackageFilesFromString($string, $dependancy);
            }
        }

        private static function getFirstExtension()
        {
            $extensions = self::getExtensions();

            return reset($extensions);
        }

        private static function getInstallationLanguageString()
        {
            if ( ! static::$previous_version)
            {
                return 'PKG_RL_EXTENSION_INSTALLED';
            }

            if (static::$previous_version == static::$current_version)
            {
                return 'PKG_RL_EXTENSION_REINSTALLED';
            }

            return 'PKG_RL_EXTENSION_UPDATED';
        }

        private static function getJoomlaVersion()
        {
            return (int) JVERSION;
        }

        private static function getPackageId($package_name = '')
        {
            $package_name = $package_name ?: static::$package_name;
            $db           = JFactory::getDbo();

            $query = $db->getQuery(true)
                ->select('extension_id')
                ->from('#__extensions')
                ->where($db->quoteName('element') . ' = ' . $db->quote('pkg_' . $package_name));
            $db->setQuery($query);

            return $db->loadResult();
        }

        private static function getMainXmlFile($package_name = '', $include_pkg = true)
        {
            $package_name = $package_name ?: static::$package_name;

            $file_paths = [
                self::getManifestFilePathPackage($package_name),
                self::getManifestFilePathLibrary($package_name),
                self::getManifestFilePathComponent($package_name),
                self::getManifestFilePathSystemPlugin($package_name),
                self::getManifestFilePathFieldsPlugin($package_name),
                self::getManifestFilePathModule($package_name),
            ];

            if ( ! $include_pkg)
            {
                unset($file_paths[0]);
            }

            foreach ($file_paths as $file_path)
            {
                if (file_exists($file_path))
                {
                    return $file_path;
                }
            }

            return '';
        }

        private static function getManifestWithoutDependancies()
        {
            $manifest = static::$adapter->getManifest();

            $xml = $manifest->asXML();
            self::removeDependanciesFromString($xml);

            return simplexml_load_string($xml);
        }

        private static function getModulePositionFromXMLString($xml, $id)
        {
            preg_match('#position="([^"]+)"[^>]* id="' . $id . '"#', $xml, $match);

            return isset($match['1']) ? $match['1'] : '';
        }

        private static function getNewManifest()
        {
            if ( ! is_null(static::$new_manifest))
            {
                return static::$new_manifest;
            }

            $manifest = static::$adapter->getManifest();

            $xml = $manifest->asXML();

            $files = self::getFilesString($xml);
            $xml   = preg_replace('#<files .*?</files>#s', $files, $xml);
            $xml   = preg_replace('#<(files_j[3-4]).*?</\1>#s', '', $xml);

            static::$new_manifest = simplexml_load_string($xml);

            return static::$new_manifest;
        }

        private static function getManifestFilePathPackage($package_name = '')
        {
            $package_name = $package_name ?: static::$package_name;

            return JPATH_MANIFESTS . '/packages/pkg_' . $package_name . '.xml';
        }

        private static function getManifestFilePathLibrary($package_name = '')
        {
            $package_name = $package_name ?: static::$package_name;

            return JPATH_LIBRARIES . '/' . $package_name . '/' . $package_name . '.xml';
        }

        private static function getManifestFilePathComponent($package_name = '')
        {
            $package_name = $package_name ?: static::$package_name;

            return JPATH_ADMINISTRATOR . '/components/com_' . $package_name . '/com_' . $package_name . '.xml';
        }

        private static function getManifestFilePathModule($package_name = '')
        {
            $package_name = $package_name ?: static::$package_name;

            return JPATH_SITE . '/modules/mod_' . $package_name . '/mod_' . $package_name . '.xml';
        }

        private static function getManifestFilePathFieldsPlugin($package_name = '')
        {
            $package_name = $package_name ?: static::$package_name;

            return JPATH_PLUGINS . '/fields/' . $package_name . '/' . $package_name . '.xml';
        }

        private static function getManifestFilePathSystemPlugin($package_name = '')
        {
            $package_name = $package_name ?: static::$package_name;

            return JPATH_PLUGINS . '/system/' . $package_name . '/' . $package_name . '.xml';
        }

        private static function getVersionFromManifest($manifest_file)
        {
            if ( ! $manifest_file || ! file_exists($manifest_file))
            {
                return '';
            }

            $manifest = new JPackageManifest($manifest_file);

            return isset($manifest->version) ? trim($manifest->version) : '';
        }

        private static function getCurrentVersion($package_name = '')
        {
            $package_name = $package_name ?: static::$package_name;

            $joomla_version = self::getJoomlaVersion();
            $manifest_file  = __DIR__ . '/packages/j' . $joomla_version . '/pkg_' . $package_name . '/pkg_' . $package_name . '.xml';

            return self::getVersionFromManifest($manifest_file);
        }

        private static function getPreviousVersion($package_name = '')
        {
            $package_name  = $package_name ?: static::$package_name;
            $manifest_file = self::getMainXmlFile($package_name);

            return self::getVersionFromManifest($manifest_file);
        }

        private static function getPreviousJoomlaVersion($package_name = '')
        {
            $package_name  = $package_name ?: static::$package_name;
            $manifest_file = self::getMainXmlFile($package_name, false);

            if ( ! $manifest_file || ! file_exists($manifest_file))
            {
                return '';
            }

            $xml = simplexml_load_file($manifest_file);

            if ( ! $xml)
            {
                return '';
            }

            return (int) $xml->attributes()->version;
        }

        private static function getTagStringFromXml($xml, $from_tag, $to_tag)
        {
            $found = preg_match('#<' . $from_tag . '.*?</' . $from_tag . '>#s', $xml, $match);

            if ( ! $found)
            {
                return '';
            }

            return str_replace($from_tag, $to_tag, $match[0]);
        }

        private static function hasFilesForJoomlaVersion($joomla_version)
        {
            $manifest = static::$adapter->getManifest();

            return count($manifest->{'files_j' . $joomla_version}->children());
        }

        private static function passFreeOverProCheck()
        {
            // The pro version is installed.
            if (strpos(static::$previous_version, 'PRO') !== false)
            {
                JFactory::getApplication()->enqueueMessage(JText::_('PKG_RL_ERROR_PRO_TO_FREE'), 'error');

                JFactory::getApplication()->enqueueMessage(
                    html_entity_decode(
                        JText::sprintf(
                            'PKG_RL_ERROR_UNINSTALL_FIRST',
                            '<a href="https://regularlabs.com/' . static::$package_name . '" target="_blank">',
                            '</a>',
                            '<strong>' . JText::_(static::$name . '_SHORT') . '</strong>'
                        )
                    ), 'error'
                );

                return false;
            }

            return true;
        }

        private static function passJoomlaVersion()
        {
            $joomla_version = self::getJoomlaVersion();

            if ( ! self::hasFilesForJoomlaVersion($joomla_version))
            {
                JFactory::getApplication()->enqueueMessage(
                    JText::sprintf(
                        'PKG_RL_NOT_COMPATIBLE_JOOMLA',
                        '<strong>' . JText::_(static::$name . '_SHORT') . '</strong>',
                        '<strong>' . self::getJoomlaVersion() . '</strong>'
                    ),
                    'error'
                );

                return false;
            }

            $min_joomla_version = static::$min_joomla_version[$joomla_version];

            if (version_compare(JVERSION, $min_joomla_version, '<'))
            {
                JFactory::getApplication()->enqueueMessage(
                    JText::sprintf(
                        'PKG_RL_NOT_COMPATIBLE_UPDATE',
                        '<strong>' . JText::_(static::$name . '_SHORT') . '</strong>',
                        '<strong>' . JVERSION . '</strong>',
                        '<strong>' . $min_joomla_version . '</strong>'
                    ),
                    'error'
                );

                return false;
            }

            return true;
        }

        private static function passMinimumPHPVersion()
        {
            $joomla_version  = self::getJoomlaVersion();
            $min_php_version = static::$min_php_version[$joomla_version];

            if (version_compare(PHP_VERSION, $min_php_version, '<'))
            {
                JFactory::getApplication()->enqueueMessage(
                    JText::sprintf(
                        'PKG_RL_NOT_COMPATIBLE_PHP',
                        '<strong>' . JText::_(static::$name . '_SHORT') . '</strong>',
                        '<strong>' . PHP_VERSION . '</strong>',
                        '<strong>' . $min_php_version . '</strong>'
                    ),
                    'error'
                );

                return false;
            }

            return true;
        }

        /**
         * Enable an extension
         *
         * @param string  $type   The extension type.
         * @param string  $name   The name of the extension (the element field).
         * @param string  $plugin_folder
         * @param string  $module_position
         * @param integer $client The application id (0: Joomla CMS site; 1: Joomla CMS administrator).
         * @param bool    $force
         */
        private static function publishExtension($type, $name, $plugin_folder = 'system', $module_position = 'status', $client_id = 0, $force = false)
        {
            switch ($type)
            {
                case 'component' :
                    self::publishComponent($name, $client_id);
                    break;

                case 'module' :
                    self::publishModule($name, $module_position, $client_id, $force);
                    break;

                case 'plugin' :
                    self::publishPlugin($name, $plugin_folder);
                    break;

                default:
                    break;
            }
        }

        private static function publishExtensions($install_type)
        {
            $extensions = self::getExtensions();

            $joomla_version = self::getJoomlaVersion();

            foreach ($extensions as $extension)
            {
                $is_admin_module = $extension->client == 'administrator' && $extension->type == 'module';

                $force = $joomla_version > static::$previous_joomla_version
                    || $is_admin_module
                    || $extension->id == 'regularlabs';

                if ($install_type == 'update' && ! $force)
                {
                    continue;
                }

                self::publishExtension(
                    $extension->type,
                    $extension->id,
                    isset($extension->group) ? $extension->group : 'system',
                    isset($extension->position) ? $extension->position : 'status',
                    $extension->client === 'site' ? 0 : 1,
                    $is_admin_module
                );
            }
        }

        private static function publishModule($name, $module_position = 'status', $client_id = 0, $force = false)
        {
            $db = JFactory::getDbo();

            // Get module id
            $query = $db->getQuery(true)
                ->select($db->quoteName('id'))
                ->select($db->quoteName('position'))
                ->from('#__modules')
                ->where($db->quoteName('module') . ' = ' . $db->quote($name))
                ->where($db->quoteName('client_id') . ' = ' . (int) $client_id);
            $db->setQuery($query, 0, 1);
            $module = $db->loadObject();

            if (empty($module))
            {
                return;
            }

            // check if module is already in the modules_menu table (meaning it is already saved)
            $query->clear()
                ->select($db->quoteName('moduleid'))
                ->from('#__modules_menu')
                ->where($db->quoteName('moduleid') . ' = ' . (int) $module->id)
                ->setLimit(1);
            $db->setQuery($query);
            $exists = $db->loadResult();

            if ($exists && $force)
            {
                $query = $db->getQuery(true)
                    ->update('#__modules')
                    ->set('published = 1')
                    ->where($db->quoteName('id') . ' = ' . (int) $module->id);
                $db->setQuery($query);
                $db->execute();

                return;
            }

            if ($exists)
            {
                return;
            }

            // Get highest ordering number in position
            $query->clear()
                ->select($db->quoteName('ordering'))
                ->from('#__modules')
                ->where($db->quoteName('position') . ' = ' . $db->quote($module_position))
                ->where($db->quoteName('client_id') . ' = ' . (int) $client_id)
                ->order('ordering DESC');
            $db->setQuery($query, 0, 1);
            $ordering = $db->loadResult();

            $ordering++;

            // publish module and set ordering number
            $query->clear()
                ->update('#__modules')
                ->set($db->quoteName('published') . ' = 1')
                ->set($db->quoteName('ordering') . ' = ' . (int) $ordering)
                ->set($db->quoteName('position') . ' = ' . $db->quote($module_position))
                ->where($db->quoteName('id') . ' = ' . (int) $module->id);
            $db->setQuery($query);
            $db->execute();

            // add module to the modules_menu table
            $query->clear()
                ->insert('#__modules_menu')
                ->columns([$db->quoteName('moduleid'), $db->quoteName('menuid')])
                ->values((int) $module->id . ', 0');
            $db->setQuery($query);
            $db->execute();
        }

        private static function publishPlugin($name, $plugin_folder)
        {
            $db = JFactory::getDbo();

            $query = $db->getQuery(true)
                ->update('#__extensions')
                ->set($db->quoteName('enabled') . ' = 1')
                ->where($db->quoteName('type') . ' = ' . $db->quote('plugin'))
                ->where($db->quoteName('folder') . ' = ' . $db->quote($plugin_folder))
                ->where($db->quoteName('element') . ' = ' . $db->quote($name));
            $db->setQuery($query);
            $db->execute();
        }

        private static function publishComponent($name, $client_id = 0, $force = false)
        {
            $db = JFactory::getDbo();

            $query = $db->getQuery(true)
                ->update('#__extensions')
                ->set($db->quoteName('enabled') . ' = 1')
                ->where($db->quoteName('type') . ' = ' . $db->quote('component'))
                ->where($db->quoteName('element') . ' = ' . $db->quote($name))
                ->where($db->quoteName('client_id') . ' = ' . (int) $client_id);
            $db->setQuery($query);
            $db->execute();
        }

        private static function removeDuplicateUpdateSite()
        {
            $db = JFactory::getDbo();
            // First check to see if there is a pro entry

            $query = $db->getQuery(true)
                ->select($db->quoteName('update_site_id'))
                ->from('#__update_sites')
                ->where($db->quoteName('location') . ' LIKE ' . $db->quote('%download.regularlabs.com%'))
                ->where($db->quoteName('location') . ' LIKE ' . $db->quote('%e=' . static::$package_name . '%'))
                ->where($db->quoteName('location') . ' NOT LIKE ' . $db->quote('%pro=1%'))
                ->setLimit(1);
            $db->setQuery($query);
            $id = $db->loadResult();

            // Otherwise just get the first match
            if ( ! $id)
            {
                $query->clear()
                    ->select($db->quoteName('update_site_id'))
                    ->from('#__update_sites')
                    ->where($db->quoteName('location') . ' LIKE ' . $db->quote('%download.regularlabs.com%'))
                    ->where($db->quoteName('location') . ' LIKE ' . $db->quote('%e=' . static::$package_name . '%'));
                $db->setQuery($query, 0, 1);
                $id = $db->loadResult();

                // Remove pro=1 from the found update site
                $query->clear()
                    ->update('#__update_sites')
                    ->set($db->quoteName('location')
                        . ' = replace(' . $db->quoteName('location') . ', ' . $db->quote('&pro=1') . ', ' . $db->quote('') . ')')
                    ->where($db->quoteName('update_site_id') . ' = ' . (int) $id);
                $db->setQuery($query);
                $db->execute();
            }

            if ( ! $id)
            {
                return;
            }

            $query->clear()
                ->select($db->quoteName('update_site_id'))
                ->from('#__update_sites')
                ->where($db->quoteName('location') . ' LIKE ' . $db->quote('%download.regularlabs.com%'))
                ->where($db->quoteName('location') . ' LIKE ' . $db->quote('%e=' . static::$package_name . '%'))
                ->where($db->quoteName('update_site_id') . ' != ' . $id);
            $db->setQuery($query);
            $ids = $db->loadColumn();

            if (empty($ids))
            {
                return;
            }

            $query->clear()
                ->delete('#__update_sites')
                ->where($db->quoteName('update_site_id') . ' IN (' . implode(',', $ids) . ')');
            $db->setQuery($query);
            $db->execute();

            $query->clear()
                ->delete('#__update_sites_extensions')
                ->where($db->quoteName('update_site_id') . ' IN (' . implode(',', $ids) . ')');
            $db->setQuery($query);
            $db->execute();
        }

        private static function removePackageFilesFromString(&$string, $package_name = '')
        {
            $package_name = $package_name ?: static::$package_name;

            $string = preg_replace('#<file [^>]*id="' . $package_name . '">.*?</file>#s', '', $string);
        }

        private static function removeOldUpdateSites()
        {
            $db = JFactory::getDbo();

            $query = $db->getQuery(true)
                ->select($db->quoteName('update_site_id'))
                ->from('#__update_sites')
                ->where($db->quoteName('location') . ' LIKE ' . $db->quote('%nonumber.nl%'));
            $db->setQuery($query);
            $ids = $db->loadColumn();

            self::removeUpdateSitesByIds($ids);
        }

        private static function removePackageId($id)
        {
            $db = JFactory::getDbo();

            $query = $db->getQuery(true)
                ->update('#__extensions')
                ->set($db->quoteName('package_id') . ' = 0')
                ->where($db->quoteName('extension_id') . ' = ' . (int) $id);
            $db->setQuery($query);
            $db->execute();
        }

        private static function removeUpdateSitesByIds($ids = [])
        {
            if (empty($ids))
            {
                return;
            }

            $db = JFactory::getDbo();

            $query = $db->getQuery(true)
                ->delete('#__update_sites')
                ->where($db->quoteName('update_site_id') . ' IN (' . implode(',', $ids) . ')');
            $db->setQuery($query);
            $db->execute();

            $query->clear()
                ->delete('#__update_sites_extensions')
                ->where($db->quoteName('update_site_id') . ' IN (' . implode(',', $ids) . ')');
            $db->setQuery($query);
            $db->execute();
        }

        private static function removeXXXUpdateSites()
        {
            $db    = JFactory::getDbo();
            $query = $db->getQuery(true)
                ->select($db->quoteName('update_site_id'))
                ->from('#__update_sites')
                ->where($db->quoteName('location') . ' LIKE ' . $db->quote('%regularlabs.com/updates.xml?e=XXX%'));
            $db->setQuery($query);
            $ids = $db->loadColumn();

            self::removeUpdateSitesByIds($ids);
        }

        private static function reorderMessageQueue()
        {
            $old_messages    = JFactory::getApplication()->getMessageQueue(true);
            $library_version = self::getCurrentVersion('regularlabs');

            $library_messages = [];

            foreach ($old_messages as $message)
            {
                if (strpos($message['message'], $library_version) !== false)
                {
                    $library_messages[] = $message;
                    continue;
                }

                JFactory::getApplication()->enqueueMessage($message['message'], $message['type']);
            }

            foreach ($library_messages as $message)
            {
                JFactory::getApplication()->enqueueMessage($message['message'], $message['type']);
            }
        }

        private static function saveDownloadKey($key)
        {
            $key = trim($key);

            if ( ! $key)
            {
                return false;
            }

            if ( ! preg_match('#^[a-zA-Z0-9]{8}[A-Z0-9]{8}$#', $key, $match))
            {
                return false;
            }

            $db = JFactory::getDbo();
            // Add the key on all regularlabs.com urls
            $query = $db->getQuery(true)
                ->update('#__update_sites')
                ->set($db->quoteName('extra_query') . ' = ' . $db->quote('k=' . $key))
                ->where($db->quoteName('location') . ' LIKE ' . $db->quote('%download.regularlabs.com%'))
                ->where($db->quoteName('location') . ' LIKE ' . $db->quote('%&pro=%'));
            $db->setQuery($query);
            $db->execute();

            return true;
        }

        private static function setNewManifest()
        {
            $manifest = self::getNewManifest();
            static::$adapter->setManifest($manifest);
        }

        private static function setPackageId($element, $id)
        {
            $db = JFactory::getDbo();

            $query = $db->getQuery(true)
                ->update('#__extensions')
                ->set($db->quoteName('package_id') . ' = ' . (int) $id)
                ->where($db->quoteName('element') . ' = ' . $db->quote($element));
            $db->setQuery($query);
            $db->execute();
        }

        private static function shouldUpdateDependancy($package_name)
        {
            $previous_version = self::getPreviousVersion($package_name);

            if ( ! $previous_version)
            {
                return true;
            }

            $current_version = self::getCurrentVersion($package_name);

            if ( ! $current_version)
            {
                return true;
            }

            return version_compare($previous_version, $current_version, '<=');
        }

        private static function updateDownloadKey()
        {
            if (self::updateDownloadKeyFromDatabase())
            {
                return;
            }

            self::updateDownloadKeyFromExtensionManager();
        }

        private static function updateDownloadKeyFromDatabase()
        {
            $db    = JFactory::getDbo();
            $query = $db->getQuery(true)
                ->select('extra_query')
                ->from('#__update_sites')
                ->where($db->quoteName('extra_query') . ' LIKE ' . $db->quote('k=%'))
                ->where($db->quoteName('location') . ' LIKE ' . $db->quote('%download.regularlabs.com%'));

            $db->setQuery($query);

            $key = $db->loadResult();

            if ( ! $key)
            {
                return false;
            }

            if ( ! preg_match('#k=([a-zA-Z0-9]{8}[A-Z0-9]{8})#si', $key, $match))
            {
                return false;
            }

            return self::saveDownloadKey($match[1]);
        }

        private static function updateDownloadKeyFromExtensionManager()
        {
            $db    = JFactory::getDbo();
            $query = $db->getQuery(true)
                ->select($db->quoteName('params'))
                ->from('#__extensions')
                ->where($db->quoteName('element') . ' = ' . $db->quote('com_regularlabsmanager'));
            $db->setQuery($query);
            $params = $db->loadResult();

            if ( ! $params)
            {
                return false;
            }

            $params = json_decode($params);

            if ( ! isset($params->key))
            {
                return false;
            }

            return self::saveDownloadKey($params->key);
        }

        private static function updateHttptoHttpsInUpdateSites()
        {
            $db    = JFactory::getDbo();
            $query = $db->getQuery(true)
                ->update('#__update_sites')
                ->set($db->quoteName('location') . ' = REPLACE('
                    . $db->quoteName('location') . ', '
                    . $db->quote('http://') . ', '
                    . $db->quote('https://')
                    . ')')
                ->where($db->quoteName('location') . ' LIKE ' . $db->quote('http://download.regularlabs.com%'));
            $db->setQuery($query);
            $db->execute();
        }

        private static function updateManifestFile()
        {
            $manifest = self::getManifestWithoutDependancies();

            file_put_contents(self::getManifestFilePathPackage(), $manifest->asXML());
        }

        private static function updateNamesInUpdateSites()
        {
            $db   = JFactory::getDbo();
            $name = JText::_(static::$name);


            $query = $db->getQuery(true)
                ->update('#__update_sites')
                ->set($db->quoteName('name') . ' = ' . $db->quote($name))
                ->where($db->quoteName('location') . ' LIKE ' . $db->quote('%download.regularlabs.com%'))
                ->where($db->quoteName('location') . ' LIKE ' . $db->quote('%e=' . static::$package_name . '%'));
            $db->setQuery($query);
            $db->execute();
        }

        private static function updatePackageIds()
        {
            $lib_package_id = self::getPackageId('regularlabs');

            self::setPackageId('regularlabs', $lib_package_id);
            self::removePackageId($lib_package_id);
        }

        private static function updateUpdateSites()
        {
            self::removeOldUpdateSites();
            self::removeXXXUpdateSites();
            self::updateNamesInUpdateSites();
            self::updateHttptoHttpsInUpdateSites();
            self::removeDuplicateUpdateSite();
            self::updateDownloadKey();
        }
    }
}
