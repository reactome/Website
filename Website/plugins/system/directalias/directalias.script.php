<?php
/**
 * @package        Direct Alias
 * @copyright      Copyright (C) 2009-2020 AlterBrains.com. All rights reserved.
 * @license        http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

use Joomla\CMS\Factory;

defined('_JEXEC') or die('Restricted access');

/**
 * @since        1.0
 * @noinspection PhpUnused
 */
class plgSystemDirectaliasInstallerScript
{
	/**
	 * @var string
	 * @since 3.0
	 */
	protected $extension_name = 'System - Direct Alias';

	public function install()
	{
		Factory::getApplication()->enqueueMessage(sprintf('Successfully installed "%s" plugin.', $this->extension_name));
	}

	public function uninstall()
	{
		Factory::getApplication()->enqueueMessage(sprintf('Successfully uninstalled "%s" plugin.', $this->extension_name));
	}

	public function update()
	{
		Factory::getApplication()->enqueueMessage(sprintf('Successfully updated "%s" plugin.', $this->extension_name));

		// Remove legacy language files since 3.0, todo - remove in 2021
		$folder = __DIR__ . '/language/en-GB';

		foreach (glob($folder . '/*.ini') as $file)
		{
			$filename = JPATH_ADMINISTRATOR . '/language/' . basename($folder) . '/' . basename($file);
			if (file_exists($filename))
			{
				@unlink($filename);
			}
		}
	}
}