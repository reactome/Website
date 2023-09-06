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

use RegularLabs\Library\Field;

defined('_JEXEC') or die;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
    return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

class JFormFieldRL_PlainText extends Field
{
    public $type = 'PlainText';

    protected function getInput()
    {
        $text = $this->prepareText($this->value);

        if ( ! $text)
        {
            return '';
        }

        return '<fieldset class="rl_plaintext">' . $text . '</fieldset>';
    }

    protected function getLabel()
    {
        $label   = $this->prepareText($this->get('label'));
        $tooltip = $this->prepareText($this->get('description'));

        if ( ! $label && ! $tooltip)
        {
            return '';
        }

        if ( ! $label)
        {
            return '<div>' . $tooltip . '</div>';
        }

        if ( ! $tooltip)
        {
            return '<div>' . $label . '</div>';
        }

        return '<label class="hasPopover" title="' . $label . '" data-content="' . htmlentities($tooltip) . '">'
            . $label . '</label>';
    }
}
