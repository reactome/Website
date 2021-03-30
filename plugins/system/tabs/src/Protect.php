<?php
/**
 * @package         Tabs
 * @version         8.0.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2021 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Plugin\System\Tabs;

defined('_JEXEC') or die;

use RegularLabs\Library\Protect as RL_Protect;

class Protect
{
	static $name = 'Tabs';

	public static function _(&$string)
	{
		RL_Protect::protectHtmlCommentTags($string);
		RL_Protect::protectFields($string, Params::getTags(true));
		RL_Protect::protectSourcerer($string);
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
	public static function wrapInCommentTags($comment)
	{
		return RL_Protect::wrapInCommentTags(self::$name, $comment);
	}

	/**
	 * Get the html start comment tags
	 *
	 * @return string
	 */
	public static function getCommentStartTag()
	{
		return RL_Protect::getCommentStartTag(self::$name);
	}

	/**
	 * Get the html end comment tags
	 *
	 * @return string
	 */
	public static function getCommentEndTag()
	{
		return RL_Protect::getCommentEndTag(self::$name);
	}
}
