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

use Joomla\CMS\Factory;
use Joomla\CMS\Filesystem\File;
use Joomla\CMS\Installer\Installer;

class Com_EasyJoomlaBackupInstallerScript
{
    const MIN_VERSION_JOOMLA = '3.9.0';
    const MIN_VERSION_PHP = '7.3.0';

    /**
     * Name of extension that is used in the error message
     *
     * @var string
     */
    protected $extensionName = 'Easy Joomla Backup';

    /**
     * Checks compatibility in the preflight event
     *
     * @param $type
     * @param $parent
     *
     * @return bool
     * @throws Exception
     */
    public function preflight($type, $parent)
    {
        if (!$this->checkVersionJoomla()) {
            return false;
        }

        if (!$this->checkVersionPhp()) {
            return false;
        }

        return true;
    }

    /**
     * Checks whether the Joomla! version meets the requirement
     *
     * @return bool
     * @throws Exception
     */
    private function checkVersionJoomla()
    {
        // Using deprecated JVersion, JFactory and JText classes to avoid exceptions in old Joomla! versions
        $version = new JVersion();

        if (!$version->isCompatible(self::MIN_VERSION_JOOMLA)) {
            JFactory::getApplication()->enqueueMessage(JText::sprintf('KRJE_FREE_ERROR_JOOMLA_VERSION', $this->extensionName, self::MIN_VERSION_JOOMLA), 'error');

            return false;
        }

        return true;
    }

    /**
     * Checks whether the PHP version meets the requirement
     *
     * @return bool
     * @throws Exception
     */
    private function checkVersionPhp()
    {
        if (!version_compare(phpversion(), self::MIN_VERSION_PHP, 'ge')) {
            JFactory::getApplication()->enqueueMessage(JText::sprintf('KRJE_FREE_ERROR_PHP_VERSION', $this->extensionName, self::MIN_VERSION_PHP), 'error');

            return false;
        }

        return true;
    }

    public function install($parent)
    {
        $manifest = $parent->get('manifest');
        $parent = $parent->getParent();
        $source = $parent->getPath('source');

        $installer = new Installer();

        foreach ($manifest->plugins->plugin as $plugin) {
            $attributes = $plugin->attributes();
            $plg = $source . '/' . $attributes['folder'] . '/' . $attributes['plugin'];
            $installer->install($plg);
        }
    }

    public function update($parent)
    {
        $manifest = $parent->get('manifest');
        $parent = $parent->getParent();
        $source = $parent->getPath('source');

        $installer = new Installer();

        foreach ($manifest->plugins->plugin as $plugin) {
            $attributes = $plugin->attributes();
            $plg = $source . '/' . $attributes['folder'] . '/' . $attributes['plugin'];
            $installer->install($plg);
        }
    }

    public function postflight($type, $parent)
    {
        $db = Factory::getDbo();

        // Enable the cronjob plugin
        $db->setQuery("UPDATE " . $db->quoteName('#__extensions') . " SET " . $db->quoteName('enabled') . " = 1 WHERE " . $db->quoteName('element') . " = 'easyjoomlabackupcronjob' AND " . $db->quoteName('type') . " = 'plugin'");
        $db->execute();

        // Move CLI script to the CLI folder
        if (File::exists(JPATH_ROOT . '/cli/ejbCli.php')) {
            File::delete(JPATH_ROOT . '/cli/ejbCli.php');
        }

        File::move(JPATH_ROOT . '/administrator/components/com_easyjoomlabackup/ejbCli.php', JPATH_ROOT . '/cli/ejbCli.php');
    }
}
