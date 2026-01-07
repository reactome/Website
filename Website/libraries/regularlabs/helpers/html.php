<?php
/**
 * @package         Regular Labs Library
 * @version         23.9.3039
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            https://regularlabs.com
 * @copyright       Copyright © 2023 Regular Labs All Rights Reserved
 * @license         GNU General Public License version 2 or later
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
