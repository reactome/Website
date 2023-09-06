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

namespace RegularLabs\Plugin\System\Modals;

defined('_JEXEC') or die;

use RegularLabs\Library\Protect as RL_Protect;

class Clean
{
    /**
     * Just in case you can't figure the method name out: this cleans the left-over junk
     */
    public static function cleanFinalHtmlOutput(&$html)
    {
        [$tag_start, $tag_end] = Params::getTagCharacters();

        Protect::unprotectTags($html);

        RL_Protect::removeFromHtmlTagContent($html, Params::getTags(true));
        RL_Protect::removeInlineComments($html, 'Modals');
        RL_Protect::removePluginTags($html,
            Params::getTagWords(),
            $tag_start,
            $tag_end
        );
    }
}
