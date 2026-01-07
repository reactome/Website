<?php
/**
 * @package         Regular Labs Library
 * @version         23.9.3039
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            https://regularlabs.com
 * @copyright       Copyright © 2023 Regular Labs All Rights Reserved
 * @license         GNU General Public License version 2 or later
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\Installer\Manifest\PackageManifest as JPackageManifest;
use Joomla\CMS\Language\Text as JText;

if ( ! class_exists('pkg_regularlabsInstallerScript'))
{
    class pkg_regularlabsInstallerScript
    {
        static $current_version;
        static $name;
        static $package_name;
        static $previous_version;

        public function postflight($install_type, $adapter)
        {
            self::publishExtensions();
            self::recreateNamespaceMap();
            self::displayMessages();

            return true;
        }

        public function preflight($install_type, $adapter)
        {
            $manifest = $adapter->getManifest();

            static::$package_name     = trim($manifest->packagename);
            static::$name             = trim($manifest->name);
            static::$current_version  = trim($manifest->version);
            static::$previous_version = self::getPreviousVersion();

            return true;
        }

        private static function recreateNamespaceMap()
        {
            if (JVERSION < 4)
            {
                return;
            }

            // Remove the administrator/cache/autoload_psr4.php file
            $filename = JPATH_ADMINISTRATOR . '/cache/autoload_psr4.php';

            if (file_exists($filename))
            {
                self::clearFileInOPCache($filename);
                clearstatcache(true, $filename);

                @unlink($filename);
            }

            JFactory::getApplication()->createExtensionNamespaceMap();
        }

        private static function clearFileInOPCache($file)
        {
            $hasOpCache = ini_get('opcache.enable')
                && function_exists('opcache_invalidate')
                && (
                    ! ini_get('opcache.restrict_api')
                    || stripos(realpath($_SERVER['SCRIPT_FILENAME']), ini_get('opcache.restrict_api')) === 0
                );

            if ( ! $hasOpCache)
            {
                return false;
            }

            return opcache_invalidate($file, true);
        }

        private static function displayMessages()
        {
            $msg = self::getInstallationLanguageString();

            JFactory::getApplication()->enqueueMessage(
                JText::sprintf(
                    $msg,
                    '<strong>' . JText::_(static::$name . '_SHORT') . '</strong>',
                    '<strong>' . static::$current_version . '</strong>'
                ), 'success'
            );
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

        private static function getPreviousVersion()
        {
            $xml_file = self::getXmlFile();

            if ( ! $xml_file)
            {
                return '';
            }

            $manifest = new JPackageManifest($xml_file);

            return isset($manifest->version) ? trim($manifest->version) : '';
        }

        private static function getXmlFile()
        {
            $xml_file = JPATH_MANIFESTS . '/packages/pkg_' . static::$package_name . '.xml';

            if (file_exists($xml_file))
            {
                return $xml_file;
            }

            $xml_file = JPATH_LIBRARIES . '/' . static::$package_name . '.xml';

            if (file_exists($xml_file))
            {
                return $xml_file;
            }

            $xml_file = JPATH_ADMINISTRATOR . '/components/com_' . static::$package_name . '/' . static::$package_name . '.xml';

            if (file_exists($xml_file))
            {
                return $xml_file;
            }

            return '';
        }

        private static function publishExtensions()
        {
            // ignore if this is an update of Conditions
            if (static::$package_name == 'conditions' && static::$previous_version)
            {
                return;
            }

            $db = JFactory::getDbo();

            $query = $db->getQuery(true)
                ->update('#__extensions')
                ->set($db->quoteName('enabled') . ' = 1')
                ->where($db->quoteName('element') . ' IN ('
                    . $db->quote(static::$package_name)
                    . ', ' . $db->quote('com_' . static::$package_name)
                    . ')'
                );

            $db->setQuery($query);
            $db->execute();
        }
    }
}
