<?php
/**
 * @package         Modals
 * @version         9.12.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2018 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die;

require_once __DIR__ . '/script.install.helper.php';

class PlgSystemModalsInstallerScript extends PlgSystemModalsInstallerScriptHelper
{
	public $name           = 'MODALS';
	public $alias          = 'modals';
	public $extension_type = 'plugin';

	public function uninstall($adapter)
	{
		$this->uninstallPlugin($this->extname, 'editors-xtd');
	}

	public function onAfterInstall($route)
	{
		// Copy modal.php to system template folder
		JFile::copy(__DIR__ . '/modal.php', JPATH_SITE . '/templates/system/modal.php');

		$this->fixOldParams();
	}

	public function fixOldParams()
	{
		$query = $this->db->getQuery(true)
			->select($this->db->quoteName('params'))
			->from('#__extensions')
			->where($this->db->quoteName('element') . ' = ' . $this->db->quote('modals'))
			->where($this->db->quoteName('folder') . ' = ' . $this->db->quote('system'));
		$this->db->setQuery($query);
		$params = $this->db->loadResult();

		if (empty($params))
		{
			return;
		}

		$params = json_decode($params);

		if (empty($params))
		{
			return;
		}

		// Fix params changed since v9.9.0

		if ( ! isset($params->images_use_title_attribute) || $params->images_use_title_attribute !== 1)
		{
			return;
		}

		$params->images_use_title_attribute = 'title';

		$query->clear()
			->update('#__extensions')
			->set($this->db->quoteName('params') . ' = ' . $this->db->quote(json_encode($params)))
			->where($this->db->quoteName('element') . ' = ' . $this->db->quote('modals'))
			->where($this->db->quoteName('folder') . ' = ' . $this->db->quote('system'));
		$this->db->setQuery($query);
		$this->db->execute();

		JFactory::getCache()->clean('_system');
	}
}
