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

class PlgSystemEasyJoomlaBackupCronjob extends JPlugin
{
	function __construct(&$subject, $config)
	{
		// Do not execute the plugin in the administration
		$app = JFactory::getApplication();

		if($app->isAdmin())
		{
			return;
		}

		parent::__construct($subject, $config);
	}

	/**
	 * The backup process via a cronjob is executed in the trigger onAfterRender
	 */
	public function onAfterRender()
	{
		// Is the a token provided via the URL?
		$token_request = JFactory::getApplication()->input->get('ejbtoken', null, 'STRING');

		if(!empty($token_request))
		{
			$token = $this->params->get('token');

			// Compare the provided token from the GET request with the saved one from the settings
			if($token_request == $token)
			{
				// Which type of backup is requested?
				$type = JFactory::getApplication()->input->get('ejbtype', null, 'INTEGER');

				if(empty($type) OR (!in_array($type, array(1, 2, 3))))
				{
					$type = (int)$this->params->get('type');
				}

				// Set the correct type name how it is used in the component
				if($type == 1)
				{
					$type = 'fullbackup';
				}
				elseif($type == 2)
				{
					$type = 'databasebackup';
				}
				elseif($type == 3)
				{
					$type = 'filebackup';
				}

				// Okay, we have everything to start the backup process - let's do it!
				$this->backupCreate($type);

				// Redirect without the query to remove the cronjob parameters
				JFactory::getApplication()->redirect(JUri::getInstance()->current());
			}
		}
	}

	/**
	 * Creates the backup archive in dependence on the submitted type
	 * Based on the original controller function of the component
	 *
	 * @param string $type
	 */
	private function backupCreate($type)
	{
		// Try to increase all relevant settings to prevent timeouts on big sites
		@ini_set('memory_limit', '512M');
		@ini_set('error_reporting', 0);
		@set_time_limit(3600);

		// Load the correct model from the component
		JLoader::import('createbackup', JPATH_ADMINISTRATOR.'/components/com_easyjoomlabackup/models');
		$model = JModelLegacy::getInstance('createbackup', 'EasyJoomlaBackupModel');

		// Execute the backup process
		$model->createBackup($type, 'plugin');

		// Remove unneeded backup files
		$model->removeBackupFilesMax();
	}
}
