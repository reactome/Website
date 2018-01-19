<?php
/**
 * @package         Modals
 * @version         9.7.1
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2017 Regular Labs All Rights Reserved
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
	public static function cleanLeftoverJunk(&$string)
	{
		$params = Params::get();
		list($tag_start, $tag_end) = Params::getTagCharacters();

		Protect::unprotectTags($string);

		RL_Protect::removeFromHtmlTagContent($string, Params::getTags(true));
		RL_Protect::removeInlineComments($string, 'Modals');
		RL_Protect::removePluginTags($string,
			Params::getTags(true),
			$tag_start,
			$tag_end
		);
	}
}
