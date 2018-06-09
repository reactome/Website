<?php
/**
 * @package         Modals
 * @version         9.12.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2018 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Plugin\System\Modals;

defined('_JEXEC') or die;

use RegularLabs\Library\ArrayHelper as RL_Array;
use RegularLabs\Library\RegEx as RL_RegEx;
use RegularLabs\Library\StringHelper as RL_String;

class File
{
	public static function isExternal($url)
	{
		if (strpos($url, '://') === false)
		{
			return false;
		}

		// hostname: give preference to SERVER_NAME, because this includes subdomains
		$hostname = ($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : $_SERVER['HTTP_HOST'];

		return ! (strpos(RL_RegEx::replace('^.*?://', '', $url), $hostname) === 0);
	}

	public static function isMedia($url, $filetypes = [], $ignore = false)
	{
		$filetype = self::getFiletype($url);

		if ( ! $filetype)
		{
			return false;
		}

		if (empty($filetypes))
		{
			$params = Params::get();

			$filetypes = $params->mediafiles;
			$ignore    = false;
		}

		if ( ! $filetypes)
		{
			return false;
		}

		if (strpos($filetypes[0], ',') !== false)
		{
			$filetypes = RL_Array::toArray($filetypes[0]);
		}

		$pass = in_array($filetype, $filetypes);

		return $ignore ? ! $pass : $pass;
	}

	public static function isVideo($url, $data)
	{
		if (isset($data['video']) && $data['video'] == 'true')
		{
			return true;
		}

		// Return true for external video urls
		if (strpos($url, 'youtu.be') !== false
			|| strpos($url, 'youtube.com') !== false
			|| strpos($url, 'vimeo.com') !== false
		)
		{
			return true;
		}

		$filetype = self::getFiletype($url);

		$filetypes = [
			'3g2',
			'3gp',
			'avi',
			'divx',
			'f4v',
			'flv',
			'm4v',
			'mov',
			'mp4',
			'mpe',
			'mpeg',
			'mpg',
			'ogv',
			'swf',
			'webm',
			'wmv',
		];

		return in_array($filetype, $filetypes);
	}

	public static function isIframe($url, &$data)
	{
		if ( ! empty($data['inline']))
		{
			return false;
		}

		$params = Params::get();

		if (self::isMedia($url, $params->iframefiles))
		{
			return true;
		}

		if (self::isMedia($url))
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

		$retina_file = RL_RegEx::replace('\.([a-z0-9]+)$', $params->retinasuffix, $url);

		return is_file(JPATH_SITE . '/' . $retina_file);
	}

	public static function getFiletype($url)
	{
		$info = pathinfo($url);
		if ( ! isset($info['extension']))
		{
			return '';
		}

		$ext = explode('?', $info['extension']);

		return strtolower($ext[0]);
	}

	public static function getFileName($url)
	{
		return basename($url);
	}

	public static function getFileTitle($url)
	{
		$info = pathinfo($url);

		return isset($info['filename']) ? $info['filename'] : '';
	}

	public static function getFilePath($url)
	{
		return dirname($url) . '/';
	}

	public static function getTitle($url, $case)
	{
		$file_name = basename($url);

		$title = explode('.', $file_name);
		$title = $title[0];
		$title = RL_RegEx::replace('[_-]([0-9]+|[a-z])$', '', $title);
		$title = str_replace(['-', '_'], ' ', $title);

		$params = Params::get();

		switch ($case)
		{
			case 'lowercase':
				$title = RL_String::strtolower($title);
				break;
			case 'uppercase':
				$title = RL_String::strtoupper($title);
				break;
			case 'uppercasefirst':
				$title = RL_String::strtoupper(RL_String::substr($title, 0, 1))
					. RL_String::strtolower(RL_String::substr($title, 1));
				break;
			case 'titlecase':
				$title = function_exists('mb_convert_case')
					? mb_convert_case(RL_String::strtolower($title), MB_CASE_TITLE)
					: ucwords(strtolower($title));
				break;
			case 'titlecase_smart':
				$title           = function_exists('mb_convert_case')
					? mb_convert_case(RL_String::strtolower($title), MB_CASE_TITLE)
					: ucwords(strtolower($title));
				$lowercase_words = explode(',', ' ' . str_replace(',', ' , ', RL_String::strtolower($params->lowercase_words)) . ' ');
				$title           = str_ireplace($lowercase_words, $lowercase_words, $title);
				break;
		}

		return $title;
	}

	public static function trimFolder($folder)
	{
		return trim(str_replace(['\\', '//'], '/', $folder), '/');
	}
}
