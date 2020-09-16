<?php
/**
 * @package         Modals
 * @version         11.6.2
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2020 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
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
		list($tag_start, $tag_end) = Params::getTagCharacters();

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
