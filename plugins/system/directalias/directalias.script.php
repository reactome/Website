<?php
/**
 * @package        Direct Alias
 * @copyright      Copyright (C) 2009-2017 AlterBrains.com. All rights reserved.
 * @license        http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;

defined('_JEXEC') or die('Restricted access');

/**
 * @since 1.0
 */
class plgSystemDirectaliasInstallerScript
{
	/**
	 * @since 1.0
	 */
	public function install()
	{
		Factory::getApplication()->enqueueMessage(Text::_('Successfully installed "System - Direct Alias" plugin!'));
	}

	/**
	 * @since 1.0
	 */
	public function uninstall()
	{
		Factory::getApplication()->enqueueMessage(Text::_('Successfully uninstalled "System - Direct Alias" plugin!'));
	}

	/**
	 * @since 1.0
	 */
	public function update()
	{
		Factory::getApplication()->enqueueMessage(Text::_('Successfully updated "System - Direct Alias" plugin!'));
	}
}