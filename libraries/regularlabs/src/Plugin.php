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

if ( ! class_exists('RegularLabs\Library\SystemPlugin'))
{
    /**
     * Class Plugin
     *
     * @package    RegularLabs\Library
     * @deprecated Use SystemPlugin
     */
    class Plugin
    {
    }
}
else
{
    /**
     * Class Plugin
     *
     * @package    RegularLabs\Library
     * @deprecated Use SystemPlugin
     */
    class Plugin extends SystemPlugin
    {
    }
}
