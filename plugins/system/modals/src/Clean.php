<?php
/**
 * @package         Modals
<<<<<<< HEAD
 * @version         11.10.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2022 Regular Labs All Rights Reserved
=======
 * @version         11.9.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2021 Regular Labs All Rights Reserved
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
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
