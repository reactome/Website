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

defined('_JEXEC') or die;

use RegularLabs\Library\Field;
use RegularLabs\Library\ShowOn as RL_ShowOn;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
    return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

class JFormFieldRL_ShowOn extends Field
{
    public $type = 'ShowOn';

    protected function getInput()
    {
        $value       = (string) $this->get('value');
        $class       = $this->get('class', '');
        $formControl = $this->get('form', $this->formControl);
        $formControl = $formControl == 'root' ? '' : $formControl;

        if ( ! $value)
        {
            return RL_ShowOn::close();
        }

        return '</div></div>'
            . RL_ShowOn::open($value, $formControl, $this->group, $class)
            . '<div><div>';
    }

    protected function getLabel()
    {
        return '';
    }
}
