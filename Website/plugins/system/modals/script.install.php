<?php
/**
 * @package         Modals
 * @version         12.6.1
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            https://regularlabs.com
 * @copyright       Copyright © 2023 Regular Labs All Rights Reserved
 * @license         GNU General Public License version 2 or later
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\Filesystem\File as JFile;

class PlgSystemModalsInstallerScript
{
    public function postflight($install_type, $adapter)
    {
        if ( ! in_array($install_type, ['install', 'update']))
        {
            return true;
        }

        self::copyModalFile();
        self::fixOldParams();

        return true;
    }

    private static function copyModalFile()
    {
        // Copy modal.php to system template folder
        JFile::copy(__DIR__ . '/modal.php', JPATH_SITE . '/templates/system/modal.php');
    }

    private static function fixOldParams()
    {
        $db = JFactory::getDbo();

        $query = $db->getQuery(true)
            ->select($db->quoteName('params'))
            ->from('#__extensions')
            ->where($db->quoteName('element') . ' = ' . $db->quote('modals'))
            ->where($db->quoteName('folder') . ' = ' . $db->quote('system'));
        $db->setQuery($query);
        $db_params = $db->loadResult();

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
            ->set($db->quoteName('params') . ' = ' . $db->quote(json_encode($params)))
            ->where($db->quoteName('element') . ' = ' . $db->quote('modals'))
            ->where($db->quoteName('folder') . ' = ' . $db->quote('system'));
        $db->setQuery($query);
        $db->execute();

        JFactory::getCache()->clean('_system');
    }
}
