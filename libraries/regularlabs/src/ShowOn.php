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

namespace RegularLabs\Library;

defined('_JEXEC') or die;

use Joomla\CMS\Form\FormHelper as JFormHelper;

/**
 * Class ShowOn
 *
 * @package RegularLabs\Library
 */
class ShowOn
{
    public static function close()
    {
        return '</div>';
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

    public static function show($string = '', $condition = '', $formControl = '', $group = '', $animate = true, $class = '')
    {
        if ( ! $condition || ! $string)
        {
            return $string;
        }

        return self::open($condition, $formControl, $group, $animate, $class)
            . $string
            . self::close();
    }
}
