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

use Joomla\CMS\Factory as JFactory;
use RegularLabs\Library\Parameters as RL_Parameters;
use RegularLabs\Library\PluginTag as RL_PluginTag;
use RegularLabs\Library\RegEx as RL_RegEx;
use RegularLabs\Library\Uri as RL_Uri;

class Params
{
	protected static $params  = null;
	protected static $regexes = null;

	public static function get()
	{
		if ( ! is_null(self::$params))
		{
			return self::$params;
		}

		$params = RL_Parameters::getInstance()->getPluginParams('sliders');

		$params->tag_open  = RL_PluginTag::clean($params->tag_open);
		$params->tag_close = RL_PluginTag::clean($params->tag_close);

		$params->tag_link = isset($params->tag_link) ? $params->tag_link : 'sliderlink';
		$params->tag_link = RL_PluginTag::clean($params->tag_link);

		$params->use_responsive_view = false;

		self::$params = $params;

		return self::$params;
	}

	public static function getTags($only_start_tags = false)
	{
		$params = self::get();

		list($tag_start, $tag_end) = self::getTagCharacters();

		$tags = [
			[
				$tag_start . $params->tag_open,
				$tag_start . $params->tag_link,
			],
			[
				$tag_start . '/' . $params->tag_close . $tag_end,
				$tag_start . '/' . $params->tag_link . $tag_end,
			],
		];

		return $only_start_tags ? $tags[0] : $tags;
	}

	public static function getAlignment()
	{
		$params = self::get();


		if ( ! $params->alignment)
		{
			$params->alignment = JFactory::getLanguage()->isRTL() ? 'right' : 'left';
		}

		return 'align_' . $params->alignment;
	}

	public static function getPositioning()
	{


		return 'top';
	}

	public static function getRegex($type = 'tag')
	{
		$regexes = self::getRegexes();

		return isset($regexes->{$type}) ? $regexes->{$type} : $regexes->tag;
	}

	private static function getRegexes()
	{
		if ( ! is_null(self::$regexes))
		{
			return self::$regexes;
		}

		$params = self::get();

		// Tag character start and end
		list($tag_start, $tag_end) = Params::getTagCharacters();

		$pre        = RL_PluginTag::getRegexSurroundingTagsPre();
		$post       = RL_PluginTag::getRegexSurroundingTagsPost();
		$inside_tag = RL_PluginTag::getRegexInsideTag($tag_start, $tag_end);

		$tag_start = RL_RegEx::quote($tag_start);
		$tag_end   = RL_RegEx::quote($tag_end);

		$delimiter = ($params->tag_delimiter == 'space') ? RL_PluginTag::getRegexSpaces() : '=';
		$set_id    = '(?:-[a-zA-Z0-9-_]+)?';

		self::$regexes = (object) [];

		self::$regexes->tag =
			'(?<pre>' . $pre . ')'
			. $tag_start . '(?<tag>'
			. $params->tag_open . 's?' . '(?<set_id>' . $set_id . ')' . $delimiter . '(?<data>' . $inside_tag . ')'
			. '|/' . $params->tag_close . $set_id
			. ')' . $tag_end
			. '(?<post>' . $post . ')';

		self::$regexes->end =
			'(?<pre>' . $pre . ')'
			. $tag_start . '/' . $params->tag_close . $set_id . $tag_end
			. '(?<post>' . $post . ')';

		self::$regexes->link =
			$tag_start . $params->tag_link . $set_id . $delimiter . '(?<id>' . $inside_tag . ')' . $tag_end
			. '(?<text>.*?)'
			. $tag_start . '/' . $params->tag_link . $tag_end;

		return self::$regexes;
	}

	public static function getTagCharacters()
	{
		$params = self::get();

		if ( ! isset($params->tag_character_start))
		{
			self::setTagCharacters();
		}

		return [$params->tag_character_start, $params->tag_character_end];
	}

	public static function setTagCharacters()
	{
		$params = self::get();

		list(self::$params->tag_character_start, self::$params->tag_character_end) = explode('.', $params->tag_characters);
	}
}
