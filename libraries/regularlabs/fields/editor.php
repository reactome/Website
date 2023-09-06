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

use Joomla\CMS\Factory as JFactory;
use RegularLabs\Library\Field;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
    return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

class JFormFieldRL_Editor extends Field
{
    public $type = 'Editor';

    protected function getInput()
    {
        $width  = $this->get('width', '100%');
        $height = $this->get('height', 400);

        $this->value = htmlspecialchars($this->value, ENT_COMPAT, 'UTF-8');

        // Get an editor object.
        $editor = JFactory::getEditor();
        $html   = $editor->display($this->name, $this->value, $width, $height, true, $this->id);

        return '</div><div>' . $html;
    }

    protected function getLabel()
    {
        return '';
    }
}
