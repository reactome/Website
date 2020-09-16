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

use Joomla\CMS\Factory as JFactory;
use RegularLabs\Library\RegEx as RL_RegEx;
use RegularLabs\Library\Uri as RL_Uri;

class Data
{

	public static function setDataWidthHeight(&$data, $isexternal)
	{
		self::setDataAxis($data, $isexternal, 'width');
		self::setDataAxis($data, $isexternal, 'height');
	}

	public static function setDataAxis(&$data, $isexternal, $axis = 'width')
	{
		if ( ! empty($data[$axis]))
		{
			return;
		}

		$params = Params::get();

		if ($isexternal)
		{
			$data[$axis] = $params->{'external' . $axis} ?: $params->{$axis} ?: '95%';

			return;
		}

		$data[$axis] = $params->{$axis} ?: $params->{'external' . $axis} ?: '95%';
	}


	public static function flattenAttributeList($attributes)
	{
		$params = Params::get();

		$string = '';
		foreach ($attributes as $key => $val)
		{
			$key = trim($key);

			// Ignore attributes when key is empty
			if ($key == '')
			{
				continue;
			}

			$val = trim($val);

			// Ignore attributes when value is empty, but not a title or alt attribute
			if ($val == '' && ! in_array($key, ['alt', 'title']))
			{
				continue;
			}

			if (is_bool($val) && in_array($key, $params->booleans))
			{
				$val = $val ? 'true' : 'false';
			}

			$string .= ' ' . $key . '="' . $val . '"';
		}

		return $string;
	}

	public static function flattenDataAttributeList(&$dat)
	{
		if (isset($dat['width']))
		{
			unset($dat['externalWidth']);
		}

		if (isset($dat['height']))
		{
			unset($dat['externalHeight']);
		}

		$data = [];
		foreach ($dat as $key => $val)
		{
			if ( ! $str = self::flattenDataAttribute($key, $val))
			{
				continue;
			}

			$data[] = $str;
		}

		return empty($data) ? '' : ' ' . implode(' ', $data);
	}

	public static function flattenDataAttribute($key, $val)
	{
		if ($key == '')
		{
			return false;
		}

		if (strpos($key, 'title_') !== false || strpos($key, 'description_') !== false)
		{
			return false;
		}

		$key = $key == 'externalWidth' ? 'width' : $key;
		$key = $key == 'externalHeight' ? 'height' : $key;

		if ( ! in_array($key, ['title', 'iframe', 'video', 'class', 'rel', 'classname'])
			&& strpos($key, 'width') === false
			&& strpos($key, 'height') === false
		)
		{
			return false;
		}

		$val = str_replace('"', '&quot;', $val);

		if ($key == 'rel')
		{
			// map group value to rel
			return 'rel="' . $val . '"';
		}


		if (($key == 'width' || $key == 'height'))
		{
			// set param to innerWidth/innerHeight if width/height is set
			return 'data-modal-inner-' . $key . '="' . $val . '"';
		}

		$params = Params::get();

		if (in_array(strtolower($key), $params->booleans))
		{
			$val = $val ? 'true' : 'false';
		}

		if ($val == '')
		{
			return false;
		}

		if (in_array(strtolower($key), $params->paramNamesLowercase))
		{
			// fix use of lowercase params that should contain uppercase letters
			$key = $params->paramNamesCamelcase[array_search(strtolower($key), $params->paramNamesLowercase)];
			$key = strtolower(RL_RegEx::replace('([A-Z])', '-\1', $key, ''));
		}

		return 'data-modal-' . $key . '="' . $val . '"';
	}

}
