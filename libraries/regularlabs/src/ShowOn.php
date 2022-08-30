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

use Joomla\CMS\Form\FormHelper as JFormHelper;

/**
 * Class ShowOn
 * @package RegularLabs\Library
 */
class ShowOn
{
<<<<<<< HEAD
	public static function show($string = '', $condition = '', $formControl = '', $group = '', $animate = true, $class = '')
	{
		if ( ! $condition || ! $string)
		{
			return $string;
		}

		return self::open($condition, $formControl, $group, $animate, $class)
			. $string
			. self::close();
=======
	public static function close()
	{
		return '</div>';
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	}

	public static function open($condition = '', $formControl = '', $group = '', $class = '')
	{
		if ( ! $condition)
		{
			return self::close();
		}

		Document::loadFormDependencies();

		$json = json_encode(JFormHelper::parseShowOnConditions($condition, $formControl, $group));

		$class = $class ? ' class="' . $class . '"' : '';

		return '<div data-showon=\'' . $json . '\' style="display: none;"' . $class . '>';
	}

<<<<<<< HEAD
	public static function close()
	{
		return '</div>';
=======
	public static function show($string = '', $condition = '', $formControl = '', $group = '', $animate = true, $class = '')
	{
		if ( ! $condition || ! $string)
		{
			return $string;
		}

		return self::open($condition, $formControl, $group, $animate, $class)
			. $string
			. self::close();
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	}
}
