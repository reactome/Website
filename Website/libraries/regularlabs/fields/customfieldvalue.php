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

use Joomla\CMS\Language\Text as JText;
use RegularLabs\Library\Field;
use RegularLabs\Library\StringHelper as RL_String;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
    return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

class JFormFieldRL_CustomFieldValue extends Field
{
    public $type = 'CustomFieldValue';

    protected function getInput()
    {
        $label       = $this->get('label') ?: '';
        $size        = $this->get('size') ? 'style="width:' . $this->get('size') . 'px"' : '';
        $class       = 'class="' . ($this->get('class') ?: 'text_area') . '"';
        $this->value = htmlspecialchars(RL_String::html_entity_decoder($this->value), ENT_QUOTES);

        return
            '</div></div></div>'
            . '<input type="text" name="' . $this->name . '" id="' . $this->id . '" value="' . $this->value
            . '" placeholder="' . JText::_($label) . '" title="' . JText::_($label) . '" ' . $class . ' ' . $size . '>';
    }

    protected function getLabel()
    {
        return '';
    }
}
