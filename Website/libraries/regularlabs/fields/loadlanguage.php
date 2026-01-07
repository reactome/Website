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
use RegularLabs\Library\Language as RL_Language;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
    return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

class JFormFieldRL_LoadLanguage extends Field
{
    public $type = 'LoadLanguage';

    public function loadLanguage($extension, $admin = 1)
    {
        if ( ! $extension)
        {
            return;
        }

        RL_Language::load($extension, $admin ? JPATH_ADMINISTRATOR : JPATH_SITE);
    }

    protected function getInput()
    {
        $extension = $this->get('extension');
        $admin     = $this->get('admin', 1);

        self::loadLanguage($extension, $admin);

        return '';
    }

    protected function getLabel()
    {
        return '';
    }
}
