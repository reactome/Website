<?php
/**
 * @package         Regular Labs Library
 * @version         20.10.18795
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2020 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Library;

defined('_JEXEC') or die;

/**
 * Class ArrayHelper
 * @package RegularLabs\Library
 */
class ArrayHelper
{
	/**
	 * Convert data (string or object) to an array
	 *
	 * @param mixed  $data
	 * @param string $separator
	 * @param bool   $unique
	 *
	 * @return array
	 */
	public static function toArray($data, $separator = ',', $unique = false, $trim = true)
	{
		if (is_array($data))
		{
			return $data;
		}

		if (is_object($data))
		{
			return (array) $data;
		}

		if ($data === '' || is_null($data))
		{
			return [];
		}

		if ($separator === '')
		{
			return [$data];
		}

		// explode on separator, but keep escaped separators
		$splitter = uniqid('RL_SPLIT');
		$data     = str_replace($separator, $splitter, $data);
		$data     = str_replace('\\' . $splitter, $separator, $data);
		$array    = explode($splitter, $data);

		if ($trim)
		{
			$array = self::trim($array);
		}

		if ($unique)
		{
			$array = array_unique($array);
		}

		return $array;
	}

	/**
	 * Join array elements with a string
	 *
	 * @param string $glue
	 * @param array  $pieces
	 *
	 * @return array
	 */
	public static function implode($pieces, $glue = '')
	{
		if ( ! is_array($pieces))
		{
			$pieces = self::toArray($pieces, $glue);
		}

		return implode($glue, $pieces);
	}

	/**
	 * Clean array by trimming values and removing empty/false values
	 *
	 * @param array $array
	 *
	 * @return array
	 */
	public static function clean($array)
	{
		if ( ! is_array($array))
		{
			return $array;
		}

		$array = self::trim($array);
		$array = self::unique($array);
		$array = self::removeEmpty($array);

		return $array;
	}

	/**
	 * Removes empty values from the array
	 *
	 * @param array $array
	 *
	 * @return array
	 */
	public static function removeEmpty($array)
	{
		if ( ! is_array($array))
		{
			return $array;
		}

		foreach ($array as $key => &$value)
		{
			if ($key && ! is_numeric($key))
			{
				continue;
			}

			if ($value !== '')
			{
				continue;
			}

			unset($array[$key]);
		}

		return $array;
	}

	/**
	 * Removes duplicate values from the array
	 *
	 * @param array $array
	 *
	 * @return array
	 */
	public static function unique($array)
	{
		if ( ! is_array($array))
		{
			return $array;
		}

		$values = [];

		foreach ($array as $key => $value)
		{
			if ( ! is_numeric($key))
			{
				continue;
			}

			if ( ! in_array($value, $values))
			{
				$values[] = $value;
				continue;
			}

			unset($array[$key]);
		}

		return $array;
	}

	/**
	 * Clean array by trimming values
	 *
	 * @param array $array
	 *
	 * @return array
	 */
	public static function trim($array)
	{
		if ( ! is_array($array))
		{
			return $array;
		}

		foreach ($array as &$value)
		{
			if ( ! is_string($value))
			{
				continue;
			}

			$value = trim($value);
		}

		return $array;
	}

	/**
	 * Check if any of the given values is found in the array
	 *
	 * @param array $needles
	 * @param array $haystack
	 *
	 * @return boolean
	 */
	public static function find($needles, $haystack)
	{
		if ( ! is_array($haystack) || empty($haystack))
		{
			return false;
		}

		$needles = self::toArray($needles);

		foreach ($needles as $value)
		{
			if (in_array($value, $haystack))
			{
				return true;
			}
		}

		return false;
	}

	/**
	 * Sorts the array by keys based on the values of another array
	 *
	 * @param array $array
	 * @param array $order
	 *
	 * @return array
	 */
	public static function sortByOtherArray($array, $order)
	{
		uksort($array, function ($key1, $key2) use ($order) {
			return (array_search($key1, $order) > array_search($key2, $order));
		});

		return $array;
	}

	/**
	 * Flatten an array of nested arrays, keeping the order
	 *
	 * @param array $array
	 *
	 * @return array
	 */
	public static function flatten($array)
	{
		$flattened = [];

		foreach ($array as $nested)
		{
			if ( ! is_array($nested))
			{
				$flattened[] = $nested;
				continue;
			}

			$flattened = array_merge($flattened, self::flatten($nested));
		}

		return $flattened;
	}
}
