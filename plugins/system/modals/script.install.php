<?php
/**
 * @package         Modals
 * @version         11.7.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2020 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;

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

	public function onBeforeInstall($route)
	{
		if ( ! parent::onBeforeInstall($route))
		{
			return false;
		}

		$this->showDivMessage();

		return true;
	}

	public function onAfterInstall($route)
	{
		// Copy modal.php to system template folder
		JFile::copy(__DIR__ . '/modal.php', JPATH_SITE . '/templates/system/modal.php');

		$this->fixOldParams();

		return parent::onAfterInstall($route);
	}

	private function showDivMessage()
	{
		$installed_version = $this->getVersion($this->getInstalledXMLFile());

		if ($installed_version && version_compare($installed_version, 11, '<'))
		{
			JFactory::getApplication()->enqueueMessage(
				'Modals no longer uses the external Colorbox script. As a result, the script name and all element ids and have been changed.<br>'
				. 'This means that any custom styles and scripts you are using for Modals will need updating.<br><br>'
				. 'References in your custom CSS styling to <code>cboxTitle</code>, <code>cboxLoadedContent</code>, etc. will need to be changed to <code>rl_modals_title</code>, <code>rl_modals_loaded_content</code>, etc.<br>'
				. 'References in your custom code to <code>jQuery.colorbox</code> will need to be changed to <code>jQuery.rl_modals</code>'
				, 'warning'
			);
		}
	}

	public function fixOldParams()
	{
		$query = $this->db->getQuery(true)
			->select($this->db->quoteName('params'))
			->from('#__extensions')
			->where($this->db->quoteName('element') . ' = ' . $this->db->quote('modals'))
			->where($this->db->quoteName('folder') . ' = ' . $this->db->quote('system'));
		$this->db->setQuery($query);
		$db_params = $this->db->loadResult();

		if (empty($db_params))
		{
			return;
		}

		$params = json_decode($db_params);

		if (empty($params))
		{
			return;
		}

		// Since v9.14.0

		if (isset($params->gallery_create_thumbnails) && ! isset($params->create_thumbnails))
		{
			$params->create_thumbnails = $params->gallery_create_thumbnails;
			unset($params->gallery_create_thumbnails);
		}

		if (isset($params->gallery_thumb) && ! isset($params->thumbnail))
		{
			$params->thumbnail = $params->gallery_thumb;
			unset($params->gallery_thumb);
		}

		// Since v9.9.0
		if (isset($params->images_use_title_attribute) && $params->images_use_title_attribute === 1)
		{
			$params->images_use_title_attribute = 'title';
		}

		// Since v10.0.0
		if (isset($params->thumbnail_quality) && is_numeric($params->thumbnail_quality))
		{
			$params->thumbnail_quality = 'medium';
		}

		if ( ! isset($params->thumbnail_legacy) && ! empty($params->thumbnail_suffix))
		{
			$params->thumbnail_legacy = 1;
		}

		// Since v11.3.0
		if (isset($params->thumbnail_crop) && is_numeric($params->thumbnail_crop))
		{
			$params->thumbnail_resize_type = $params->thumbnail_crop ? 'crop' : 'scale';
			unset($params->thumbnail_crop);
		}

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
