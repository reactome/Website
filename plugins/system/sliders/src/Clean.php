<?php
/**
 * @package         Sliders
 * @version         7.7.8
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2019 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Plugin\System\Sliders;

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

		Protect::unprotectTags($string);

		RL_Protect::removeFromHtmlTagContent($string, Params::getTags(true));
		RL_Protect::removeInlineComments($string, 'Sliders');

		if ( ! $params->place_comments)
		{
			RL_Protect::removeCommentTags($string, 'Sliders');
		}
	}
}
