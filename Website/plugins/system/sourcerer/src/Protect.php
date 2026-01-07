<?php
/**
 * @package         Sourcerer
 * @version         9.8.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            https://regularlabs.com
 * @copyright       Copyright © 2023 Regular Labs All Rights Reserved
 * @license         GNU General Public License version 2 or later
 */

namespace RegularLabs\Plugin\System\Sourcerer;

defined('_JEXEC') or die;

use RegularLabs\Library\Protect as RL_Protect;

class Protect
{
    static $name = 'Sourcerer';

    public static function _(&$string)
    {
        RL_Protect::protectForm($string, Params::getTags(true), true, 'no-sourcerer');
    }

    /**
     * Wrap the comment in comment tags
     *
     * @param string $comment
     *
     * @return string
     */
    public static function getMessageCommentTag($comment)
    {
        return RL_Protect::getMessageCommentTag(self::$name, $comment);
    }

    public static function protectTags(&$string)
    {
        RL_Protect::protectTags($string, Params::getTags(true));
    }

    public static function unprotectTags(&$string)
    {
        RL_Protect::unprotectTags($string, Params::getTags(true));
    }
}
