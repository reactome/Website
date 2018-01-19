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

class Com_EasyJoomlaBackupInstallerScript
{
	function install($parent)
	{
		$manifest = $parent->get('manifest');
		$parent = $parent->getParent();
		$source = $parent->getPath('source');

		$installer = new JInstaller();

		foreach($manifest->plugins->plugin as $plugin)
		{
			$attributes = $plugin->attributes();
			$plg = $source.'/'.$attributes['folder'].'/'.$attributes['plugin'];
			$installer->install($plg);
		}
	}

	function uninstall($parent)
	{
		// Not needed at the moment
	}

	function update($parent)
	{
		$manifest = $parent->get('manifest');
		$parent = $parent->getParent();
		$source = $parent->getPath('source');

		$installer = new JInstaller();

		foreach($manifest->plugins->plugin as $plugin)
		{
			$attributes = $plugin->attributes();
			$plg = $source.'/'.$attributes['folder'].'/'.$attributes['plugin'];
			$installer->install($plg);
		}
	}

	function postflight($type, $parent)
	{
		$db = JFactory::getDbo();

		// Enable the cronjob plugin
		$db->setQuery("UPDATE ".$db->quoteName('#__extensions')." SET ".$db->quoteName('enabled')." = 1 WHERE ".$db->quoteName('element')." = 'easyjoomlabackupcronjob' AND ".$db->quoteName('type')." = 'plugin'");
		$db->execute();

		// Move CLI script to the CLI folder
		jimport('joomla.filesystem.file');

		if(JFile::exists(JPATH_ROOT.'/cli/ejb_cli.php'))
		{
			JFile::delete(JPATH_ROOT.'/cli/ejb_cli.php');
		}

		JFile::move(JPATH_ROOT.'/administrator/components/com_easyjoomlabackup/ejb_cli.php', JPATH_ROOT.'/cli/ejb_cli.php');
	}
}
