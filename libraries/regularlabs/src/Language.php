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

namespace RegularLabs\Library;

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;

/**
 * Class Language
 *
 * @package RegularLabs\Library
 */
class Language
{
    /**
     * Load the language of the given extension
     *
     * @param string $extension
     * @param string $basePath
     * @param bool   $reload
     *
     * @return bool
     */
    public static function load($extension = 'plg_system_regularlabs', $basePath = '', $reload = false)
    {
        if ($basePath && JFactory::getLanguage()->load($extension, $basePath, null, $reload))
        {
            return true;
        }

        $basePath = Extension::getPath($extension, $basePath, 'language');

        return JFactory::getLanguage()->load($extension, $basePath, null, $reload);
    }
}
