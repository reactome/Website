<?php
/**
 * @package         Modals
 * @version         11.7.0
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

class File
{
	public static function isVideo($url, $data)
	{
		if (isset($data['video']) && $data['video'] == 'true')
		{
			return true;
		}

		return RL_File::isExternalVideo($url) || RL_File::isVideo($url);
	}

	public static function isIframe($url, &$data)
	{
		if ( ! empty($data['inline']))
		{
			return false;
		}

		$params = Params::get();

		if (RL_File::isMedia($url, $params->iframefiles))
		{
			return true;
		}

		if (RL_File::isMedia($url, $params->mediafiles))
		{
			unset($data['iframe']);

			return false;
		}

		if (empty($data['iframe']))
		{
			return $params->iframe;
		}

		return ($data['iframe'] !== 0 && $data['iframe'] !== 'false');
	}

	public static function retinaImageExists($url)
	{
		$params = Params::get();

		$suffix = str_replace('.$1', '.\1', $params->retinasuffix);

		$retina_file = RL_RegEx::replace('(\.[a-z0-9]+)$', $suffix, $url);

		return file_exists(JPATH_SITE . '/' . $retina_file);
	}

	public static function getCleanFileName($url)
	{
		$params = Params::get();

		$title = RL_File::getFileName($url);

		// Remove trailing numbers and dimensions
		$title = RL_RegEx::replace('[_-][0-9]+(x[0-9]+)?$', '', $title);


		return $title;
	}

	public static function getCleanTitle($url)
	{
		$title = self::getCleanFileName($url);

		// Replace dashes with spaces
		return str_replace(['-', '_'], ' ', $title);
	}

	public static function getTitle($url, $case)
	{
		$params = Params::get();

		$title = self::getCleanTitle($url);

		switch ($case)
		{
			case 'lowercase':
				return RL_String::strtolower($title);

			case 'uppercase':
				return RL_String::strtoupper($title);

			case 'uppercasefirst':
				return RL_String::strtoupper(RL_String::substr($title, 0, 1))
					. RL_String::strtolower(RL_String::substr($title, 1));

			case 'titlecase':
				return function_exists('mb_convert_case')
					? mb_convert_case(RL_String::strtolower($title), MB_CASE_TITLE)
					: ucwords(strtolower($title));

			case 'titlecase_smart':
				$title           = function_exists('mb_convert_case')
					? mb_convert_case(RL_String::strtolower($title), MB_CASE_TITLE)
					: ucwords(strtolower($title));
				$lowercase_words = explode(',', ' ' . str_replace(',', ' , ', RL_String::strtolower($params->lowercase_words)) . ' ');

				return str_ireplace($lowercase_words, $lowercase_words, $title);
		}

		return $title;
	}
}
