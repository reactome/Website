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

use RegularLabs\Library\File as RL_File;
use RegularLabs\Library\RegEx as RL_RegEx;
use RegularLabs\Library\StringHelper as RL_String;

class Pass
{
	public static function passLinkChecks($attributes)
	{
		// return if the link has no href
		if (empty($attributes->href))
		{
			return false;
		}

		$params = Params::get();

		// return if the link already has the Modals main class
		if ( ! empty($attributes->class) && in_array($params->class, explode(' ', $attributes->class)))
		{
			return false;
		}

		// return if url is in ignore list
		if (self::urlIgnored($attributes->href))
		{
			return false;
		}

		// check for classnames, external sites and target blanks
		if (
			self::passClassnames($attributes)
		)
		{
			return true;
		}


		return false;
	}

	public static function urlIgnored($url)
	{
		$params = Params::get();

		if (empty($params->exclude_urls))
		{
			return false;
		}

		$exclude_urls = explode(',', str_replace(['\n', ' '], [',', ''], $params->exclude_urls));

		foreach ($exclude_urls as $exclude)
		{
			if ($exclude && (strpos($url, $exclude) !== false || strpos(htmlentities($url), $exclude) !== false))
			{
				return true;
			}
		}

		return false;
	}

	public static function passClassnames($attributes)
	{
		$params = Params::get();

		if (empty($attributes->class) || empty($params->classnames))
		{
			return false;
		}

		$classnames = str_replace($params->class, '', $attributes->class);

		return self::arrayInArray($classnames, $params->classnames);
	}

	private static function arrayInArray($needles, $haystack)
	{
		if ( ! is_array($needles))
		{
			$needles = explode(' ', trim($needles));
		}
		if ( ! is_array($haystack))
		{
			$haystack = explode(' ', trim($haystack));
		}

		// Check
		return (boolean) array_intersect($haystack, $needles);
	}

	private static function passURLs($url)
	{
		$params = Params::get();

		foreach ($params->urls as $param_url)
		{
			if (self::passURL($url, $param_url))
			{
				return true;
			}
		}

		return false;
	}

	private static function passURL($url, $param_url)
	{
		$url = trim($url);
		if (empty($url))
		{
			return false;
		}

		$param_url = trim($param_url);
		if (empty($param_url))
		{
			return false;
		}

		$params = Params::get();

		$urls = [$url, RL_String::html_entity_decoder($url)];

		foreach ($urls as $url)
		{
			if ($params->urls_regex && self::passURLRegex($url, $param_url))
			{
				return true;
			}

			if ($params->urls_regex)
			{
				continue;
			}

			if (strpos($url, $param_url) !== false)
			{
				return true;
			}
		}

		return false;
	}

	private static function passURLRegex($url, $param_url)
	{
		$url_part = str_replace(['#', '&amp;'], ['\#', '(&amp;|&)'], $param_url);

		if ( ! RL_RegEx::match($url_part, $url))
		{
			return false;
		}

		return true;
	}

}
