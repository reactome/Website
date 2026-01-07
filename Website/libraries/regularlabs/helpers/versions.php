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

/* @DEPRECATED */

defined('_JEXEC') or die;

use RegularLabs\Library\Version as RL_Version;

if (is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
    require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';
}

class RLVersions
{
    public static function getFooter($name, $copyright = 1)
    {
        return ! class_exists('RegularLabs\Library\Version') ? '' : RL_Version::getFooter($name, $copyright);
    }

    public static function getPluginXMLVersion($alias, $folder = 'system')
    {
        return ! class_exists('RegularLabs\Library\Version') ? '' : RL_Version::getPluginVersion($alias, $folder);
    }

    public static function getXMLVersion($alias, $urlformat = false, $type = 'component', $folder = 'system')
    {
        return ! class_exists('RegularLabs\Library\Version') ? '' : RL_Version::get($alias, $type, $folder);
    }

    public static function render($alias)
    {
        return ! class_exists('RegularLabs\Library\Version') ? '' : RL_Version::getMessage($alias);
    }
}
