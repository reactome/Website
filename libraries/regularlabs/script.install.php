<?php
/**
 * @package         Regular Labs Library
 * @version         23.3.19307
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2023 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
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
