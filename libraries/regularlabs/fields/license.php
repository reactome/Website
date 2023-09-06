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
use RegularLabs\Library\License as RL_License;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
    return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

class JFormFieldRL_License extends Field
{
    public $type = 'License';

    protected function getInput()
    {
        $extension = $this->get('extension');

        if (empty($extension))
        {
            return '';
        }

        $message = RL_License::getMessage($extension, true);

        if (empty($message))
        {
            return '';
        }

        return '</div><div>' . $message;
    }

    protected function getLabel()
    {
        return '';
    }
}
