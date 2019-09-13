<?php
/**
 * @package         Sourcerer
 * @version         8.2.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2019 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
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

	public static function protectTags(&$string)
	{
		RL_Protect::protectTags($string, Params::getTags(true));
	}

	public static function unprotectTags(&$string)
	{
		RL_Protect::unprotectTags($string, Params::getTags(true));
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
}
