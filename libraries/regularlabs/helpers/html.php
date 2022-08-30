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

/* @DEPRECATED */

defined('_JEXEC') or die;

use RegularLabs\Library\Form as RL_Form;

if (is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';
}

class RLHtml
{
	static function selectlist(&$options, $name, $value, $id, $size = 0, $multiple = 0, $simple = 0)
	{
		return RL_Form::selectList($options, $name, $value, $id, $size, $multiple, $simple);
	}

	static function selectlistsimple(&$options, $name, $value, $id, $size = 0, $multiple = 0)
	{
		return RL_Form::selectListSimple($options, $name, $value, $id, $size, $multiple);
	}
}
