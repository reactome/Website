<?php
/**
 * @package         Regular Labs Library
<<<<<<< HEAD
 * @version         22.6.8549
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2022 Regular Labs All Rights Reserved
=======
 * @version         21.7.10061
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2021 Regular Labs All Rights Reserved
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Library;

defined('_JEXEC') or die;

/**
 * Class RegEx
 * @package RegularLabs\Library
 */
class RegEx
{
	/**
	 * Perform a regular expression match
	 *
	 * @param string $pattern
	 * @param string $string
	 * @param null   $match
	 * @param string $options
	 * @param int    $flags
	 *
	 * @return int
	 */
	public static function match($pattern, $string, &$match = null, $options = null, $flags = 0)
	{
		if (
			( ! is_string($pattern) && ! is_numeric($pattern))
			|| $pattern === ''
			|| ( ! is_string($string) && ! is_numeric($string))
			|| $string === ''
		)
		{
			return false;
		}

		$pattern = self::preparePattern($pattern, $options, $string);

		return preg_match($pattern, $string, $match, $flags);
	}

	/**
<<<<<<< HEAD
	 * Make a string a valid regular expression pattern
	 *
	 * @param string $pattern
	 * @param string $options
	 * @param string $string
	 *
	 * @return string
	 */
	public static function preparePattern($pattern, $options = null, $string = '')
	{
		$array = ArrayHelper::applyMethodToValues([$pattern, $options, $string]);

		if ( ! is_null($array))
		{
			return $array;
=======
	 * Perform a global regular expression match
	 *
	 * @param string $pattern
	 * @param string $string
	 * @param null   $matches
	 * @param string $options
	 * @param int    $flags
	 *
	 * @return int
	 */
	public static function matchAll($pattern, $string, &$matches = null, $options = null, $flags = PREG_SET_ORDER)
	{
		if ( ! is_string($pattern) || $pattern == '' || ! is_string($string) || $string == '')
		{
			$matches = [];

			return false;
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
		}

		if (substr($pattern, 0, 1) != '#')
		{
			$options = ! is_null($options) ? $options : 'si';
			$pattern = '#' . $pattern . '#' . $options;
		}

<<<<<<< HEAD
		if (StringHelper::detectUTF8($string))
		{
			// use utf-8
			return $pattern . 'u';
		}

		return $pattern;
=======
		return preg_match_all($pattern, $string, $matches, $flags);
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	}

	/**
	 * preg_quote the given string or array of strings
	 *
	 * @param string|array $data
	 * @param string       $name
	 * @param string       $delimiter
	 *
	 * @return string
	 */
	public static function nameGroup($data, $name = '')
	{
		return '(?<' . $name . '>' . $data . ')';
	}

	/**
	 * Make a string a valid regular expression pattern
	 *
	 * @param string $pattern
	 * @param string $options
	 * @param string $string
	 *
	 * @return string
	 */
	public static function preparePattern($pattern, $options = null, $string = '')
	{
<<<<<<< HEAD
		if (
			( ! is_string($pattern) && ! is_numeric($pattern))
			|| $pattern === ''
			|| ( ! is_string($string) && ! is_numeric($string))
			|| $string === ''
		)
=======
		$array = ArrayHelper::applyMethodToValues([$pattern, $options, $string]);

		if ( ! is_null($array))
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
		{
			return $array;
		}

		if (substr($pattern, 0, 1) != '#')
		{
			$options = ! is_null($options) ? $options : 'si';
			$pattern = '#' . $pattern . '#' . $options;
		}

		if (StringHelper::detectUTF8($string))
		{
			// use utf-8
			return $pattern . 'u';
		}

		return $pattern;
	}

	/**
	 * preg_quote the given string or array of strings
	 *
	 * @param string|array $data
	 * @param string       $name
	 * @param string       $delimiter
	 *
	 * @return string
	 */
	public static function nameGroup($data, $name = '')
	{
		return '(?<' . $name . '>' . $data . ')';
	}

	/**
	 * preg_quote the given string or array of strings
	 *
	 * @param string|array $data
	 * @param string       $name
	 * @param string       $delimiter
	 *
	 * @return string
	 */
	public static function quote($data, $name = '', $delimiter = '#')
	{
		if (is_array($data))
		{
			$array = self::quoteArray($data, $delimiter);

			$prefix = '?:';

			if ( ! empty($name))
			{
				$prefix = $name ? '?<' . $name . '>' : '';
			}

			return '(' . $prefix . implode('|', $array) . ')';
		}

		if ( ! empty($name))
		{
			return '(?<' . $name . '>' . preg_quote($data, $delimiter) . ')';
		}

		return preg_quote($data, $delimiter);
	}

	/**
	 * preg_quote the given array of strings
	 *
	 * @param array  $array
	 * @param string $delimiter
	 *
	 * @return array
	 */
	public static function quoteArray($array = [], $delimiter = '#')
	{
		array_walk($array, function (&$part, $key, $delimiter) {
			$part = self::quote($part, '', $delimiter);
		}, $delimiter);

		return $array;
	}

	/**
<<<<<<< HEAD
	 * Perform a regular expression search and replace once
=======
	 * Perform a regular expression search and replace
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	 *
	 * @param string $pattern
	 * @param string $replacement
	 * @param string $string
	 * @param string $options
<<<<<<< HEAD
	 *
	 * @return string
	 */
	public static function replaceOnce($pattern, $replacement, $string, $options = null)
	{
		return self::replace($pattern, $replacement, $string, $options, 1);
	}

	/**
	 * Perform a regular expression search and replace
	 *
	 * @param string $pattern
	 * @param string $replacement
	 * @param string $string
	 * @param string $options
	 * @param int    $limit
	 * @param int    $count
	 *
	 * @return string
	 */
	public static function replace($pattern, $replacement, $string, $options = null, $limit = -1, &$count = null)
	{
=======
	 * @param int    $limit
	 * @param int    $count
	 *
	 * @return string
	 */
	public static function replace($pattern, $replacement, $string, $options = null, $limit = -1, &$count = null)
	{
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
		if ( ! is_string($pattern) || $pattern == '' || ! is_string($string) || $string == '')
		{
			return $string;
		}

		$pattern = self::preparePattern($pattern, $options, $string);

		return preg_replace($pattern, $replacement, $string, $limit, $count);
	}

	/**
<<<<<<< HEAD
	 * reverse preg_quote the given string
	 *
	 * @param string $string
	 * @param string $delimiter
	 *
	 * @return string
	 */
	public static function unquote($string, $delimiter = '#')
	{
=======
	 * Perform a regular expression search and replace once
	 *
	 * @param string $pattern
	 * @param string $replacement
	 * @param string $string
	 * @param string $options
	 *
	 * @return string
	 */
	public static function replaceOnce($pattern, $replacement, $string, $options = null)
	{
		return self::replace($pattern, $replacement, $string, $options, 1);
	}

	/**
	 * reverse preg_quote the given string
	 *
	 * @param string $string
	 * @param string $delimiter
	 *
	 * @return string
	 */
	public static function unquote($string, $delimiter = '#')
	{
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
		return strtr($string, [
			'\\' . $delimiter => $delimiter,
			'\\.'             => '.',
			'\\\\'            => '\\',
			'\\+'             => '+',
			'\\*'             => '*',
			'\\?'             => '?',
			'\\['             => '[',
			'\\^'             => '^',
			'\\]'             => ']',
			'\\$'             => '$',
			'\\('             => '(',
			'\\)'             => ')',
			'\\{'             => '{',
			'\\}'             => '}',
			'\\='             => '=',
			'\\!'             => '!',
			'\\<'             => '<',
			'\\>'             => '>',
			'\\|'             => '|',
			'\\:'             => ':',
			'\\-'             => '-',
		]);
	}
}
