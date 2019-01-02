<?php
/**
 * @package         Sourcerer
 * @version         7.4.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2018 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Plugin\System\Sourcerer;

defined('_JEXEC') or die;

use Joomla\CMS\Language\Text as JText;
use RegularLabs\Library\PluginTag as RL_PluginTag;
use RegularLabs\Library\Protect as RL_Protect;
use RegularLabs\Library\RegEx as RL_RegEx;
use RegularLabs\Library\StringHelper as RL_String;

class Clean
{
	/**
	 * Just in case you can't figure the method name out: this cleans the left-over junk
	 */
	public static function cleanLeftoverJunk(&$string)
	{
		RL_Protect::removeAreaTags($string, 'SRC');

		$params = Params::get();

		if ( ! $params->place_comments)
		{
			RL_Protect::removeCommentTags($string, 'Sourcerer');
		}

		if (strpos($string, $params->tag_character_start . '/' . $params->tag) === false)
		{
			Protect::unprotectTags($string);

			return;
		}

		$regex = Params::getRegex();

		$string = RL_RegEx::replace(
			$regex,
			Protect::getMessageCommentTag(JText::_('SRC_CODE_REMOVED_NOT_ENABLED')),
			$string
		);

		Protect::unprotectTags($string);
	}

	public static function cleanTagsFromHead(&$string)
	{
		if ( ! RL_String::contains($string, Params::getTags(true)))
		{
			return;
		}

		$params = Params::get();

		list($tag_start, $tag_end) = Params::getTagCharacters();
		$tag_start = RL_RegEx::quote($tag_start);
		$tag_end   = RL_RegEx::quote($tag_end);

		$inside_tag = RL_PluginTag::getRegexInsideTag();
		$spaces     = RL_PluginTag::getRegexSpaces();

		$regex = Params::getRegex();

		// Remove start tag to end tag
		$string = RL_RegEx::replace(
			$regex,
			'',
			$string
		);

		// Remove start tag with optional php stuff after it
		$string = RL_RegEx::replace(
			$tag_start . RL_RegEx::quote($params->tag) . '(' . $spaces . $inside_tag . ')?' . $tag_end
			. '(\s*<\?php(.*?)\?>)?',
			'',
			$string
		);

		// Remove left over end tags
		$string = RL_RegEx::replace(
			$tag_start . '\/' . RL_RegEx::quote($params->tag) . $tag_end,
			'',
			$string
		);
	}
}
