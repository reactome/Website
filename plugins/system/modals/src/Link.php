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

use ContentHelperRoute;
use JFactory;
use JText;
use RegularLabs\Library\PluginTag as RL_PluginTag;
use RegularLabs\Library\RegEx as RL_RegEx;
use RegularLabs\Library\StringHelper as RL_String;

class Link
{
	public static function buildLink($attributes, $data, $content = '')
	{

		self::setVideoUrl($attributes, $data);

		$isexternal = File::isExternal($attributes->href);
		$ismedia    = File::isMedia($attributes->href);
		$isvideo    = File::isVideo($attributes->href, $data);
		$fullpage   = (empty($data['fullpage']) || $isexternal) ? false : (bool) $data['fullpage'];
		$isiframe   = $fullpage || File::isIframe($attributes->href, $data);

		$params = Params::get();

		if (isset($attributes->{'data-modal-title'}) && ! isset($data['title']))
		{
			$data['title'] = $attributes->{'data-modal-title'};
		}

		if (isset($attributes->title) && ! isset($data['title']))
		{
			$data['title'] = $attributes->title;
		}

		if ($ismedia)
		{
			$data['classname'] = (isset($data['classname']) ? $data['classname'] . ' ' : '') . 'is_image';
			$data['image']     = 'true';

			if ( ! isset($data['title']))
			{
				$auto_titles = isset($data['auto_titles']) ? $data['auto_titles'] : $params->auto_titles;
				$title_case  = isset($data['title_case']) ? $data['title_case'] : $params->title_case;
				if ($auto_titles)
				{
					$data['title'] = File::getTitle($attributes->href, $title_case);
				}
			}

		}
		unset($data['auto_titles']);

		// Force/overrule certain data values
		if ($isiframe || ($isexternal && ! $ismedia))
		{
			// use iframe mode for external urls
			$data['iframe'] = 'true';
			Data::setDataWidthHeight($data, $isexternal);
		}

		if ($isvideo)
		{
			$data['classname'] = (isset($data['classname']) ? $data['classname'] . ' ' : '') . 'is_video';
			$data['video']     = 'true';
		}

		if ($attributes->href && $attributes->href['0'] != '#' && ! $isexternal && ! $ismedia)
		{
			$attributes->href = Document::addUrlAttributes($attributes->href, $isiframe, $fullpage, ! empty($data['print']));
		}


		if (empty($data['title']))
		{
			$data['classname'] = (isset($data['classname']) ? $data['classname'] . ' ' : '') . 'no_title';
			$data['title']     = '';
		}


		return
			'<a'
			. Data::flattenAttributeList($attributes)
			. Data::flattenDataAttributeList($data)
			. '>'
			. $content;
	}

	public static function getLink($string, $link = '', $content = '')
	{
		list($attributes, $data, $extra) = self::getLinkData($string, $link);

		return [self::buildLink($attributes, $data, $content), $extra];
	}

	public static function getLinkData($string, $link = '')
	{
		$params = Params::get();

		$attributes = self::prepareLinkAttributeList($link);

		RL_PluginTag::protectSpecialChars($string);

		$is_old_syntax =
			(strpos($string, '|') !== false)
			|| (strpos($string, '"') === false && strpos($string, '&quot;') === false);

		if ($is_old_syntax)
		{
			// Replace open attribute with open=1
			$string = RL_RegEx::replace('(^|\|)open($|\|)', '\1open=1\2', $string);

			// Add empty url attribute to beginning if no url/href attribute is there,
			// to prevent issues with grabbing values from old syntax
			if (RL_RegEx::match('^([a-z]+)=', $string, $match))
			{
				if ($match['1'] != 'url' && $match['1'] != 'href')
				{
					$string = 'url=|' . $string;
				}
			}
		}

		RL_PluginTag::unprotectSpecialChars($string);

		// Get the values from the tag
		$tag = RL_PluginTag::getAttributesFromString($string, 'url', $params->booleans);

		$key_aliases = [
			'url'     => ['href', 'link', 'image', 'src'],
			'gallery' => ['galery', 'images'],
		];

		RL_PluginTag::replaceKeyAliases($tag, $key_aliases);

		if ( ! empty($tag->url))
		{
			$attributes->href = self::cleanUrl($tag->url);
		}
		unset($tag->url);

		if ( ! empty($tag->target))
		{
			$attributes->target = $tag->target;
		}
		unset($tag->target);

		$extra = '';


		$attributes->id = ! empty($tag->id) ? $tag->id : '';
		unset($tag->id);

		$attributes->class .= ! empty($tag->class) ? ' ' . $tag->class : '';
		unset($tag->class);

		if ( ! empty($tag->title))
		{
			$tag->title = self::translateString($tag->title);
		}

		if ( ! empty($tag->description))
		{
			$tag->description = self::translateString($tag->description);
		}

		// move onSomething params to attributes, except the modal callbacks
		$callbacks = ['onopen', 'onload', 'oncomplete', 'oncleanup', 'onclosed'];
		foreach ($tag as $key => $val)
		{
			if (
				substr($key, 0, 2) == 'on'
				&& ! in_array(strtolower($key), $callbacks)
				&& is_string($val)
			)
			{
				$attributes->{$key} = $val;
				unset($tag->{$key});
			}
		}

		$data = [];


		// set data by values set in tag
		foreach ($tag as $key => $val)
		{
			$data[strtolower($key)] = $val;
		}

		return [$attributes, $data, $extra];
	}

	private static function translateString($string = '')
	{
		if (empty($string) || ! RL_RegEx::match('^[A-Z][A-Z0-9_]+$', $string))
		{
			return $string;
		}

		return JText::_($string);
	}

	private static function cleanUrl($url)
	{
		return RL_RegEx::replace('<a[^>]*>(.*?)</a>', '\1', $url);
	}

	private static function setVideoUrl(&$attributes, &$data)
	{

		$attributes->href = self::fixVideoUrl($attributes->href, $data);
	}

	private static function fixVideoUrl($url, &$data)
	{
		switch (true)
		{
			case(
				strpos($url, 'youtu.be') !== false
				|| strpos($url, 'youtube.com') !== false
			) :
				$data['video'] = 'true';

				return self::fixUrlYoutube($url);

			case(
				strpos($url, 'vimeo.com') !== false
			) :
				$data['video'] = 'true';

				return self::fixUrlVimeo($url);
		}

		return $url;
	}

	private static function fixUrlYoutube($url)
	{
		if ( ! RL_RegEx::match(
			'(?:^youtube=|youtu\.be/?|youtube\.com/embed/?|youtube\.com\/watch\?v=)([^/&\?]+)(?:\?|&amp;|&)?(.*)$',
			trim($url),
			$parts
		)
		)
		{
			return $url;
		}

		$url = 'https://www.youtube.com/embed/' . $parts['1'] . '?' . $parts['2'];

		if (strpos($parts['2'], 'wmode=transparent') !== false)
		{
			return $url;
		}

		return $url . '&wmode=transparent';
	}

	private static function fixUrlVimeo($url)
	{
		if ( ! RL_RegEx::match(
			'(?:^vimeo=|vimeo\.com/(?:video/)?)([0-9]+)(.*)$',
			trim($url),
			$parts
		)
		)
		{
			return $url;
		}

		return
			'https://player.vimeo.com/video/'
			. $parts['1']
			. $parts['2'];
	}

	private static function prepareLinkAttributeList($link)
	{
		$params = Params::get();

		$attributes        = (object) [];
		$attributes->href  = '';
		$attributes->class = $params->class;
		$attributes->id    = '';

		if ( ! $link)
		{
			return $attributes;
		}

		$link_attributes = self::getLinkAttributeList(trim($link));

		foreach ($link_attributes as $key => $val)
		{
			$key = trim($key);
			$val = trim($val);

			if ($key == '' || $val == '')
			{
				continue;
			}

			if ($key == 'class')
			{
				$attributes->{$key} = trim($attributes->{$key} . ' ' . $val);
				continue;
			}

			$attributes->{$key} = $val;
		}

		return $attributes;
	}

	public static function getLinkAttributeList($string)
	{
		$attributes = (object) [];

		if ( ! $string)
		{
			return $attributes;
		}

		$params = Params::get();

		RL_RegEx::matchAll('([a-z0-9_-]+)\s*=\s*(?:"(.*?)"|\'(.*?)\')', $string, $params);

		if (empty($params))
		{
			return $attributes;
		}

		foreach ($params as $param)
		{
			$attributes->{$param['1']} = isset($param['3']) ? $param['3'] : $param['2'];
		}

		return $attributes;
	}

}
