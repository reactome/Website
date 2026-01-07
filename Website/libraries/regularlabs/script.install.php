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

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;

if ( ! class_exists('RegularLabsInstallerScript'))
{
    class RegularLabsInstallerScript
    {
        public function postflight($install_type, $adapter)
        {
            if ( ! in_array($install_type, ['install', 'update']))
            {
                return true;
            }

            JFactory::getCache()->clean('_system');
        }
    }
}
