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
use RegularLabs\Library\Version as RL_Version;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
    return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

class JFormFieldRL_Version extends Field
{
    public $type = 'Version';

    protected function getInput()
    {
        $extension = $this->get('extension');
        $xml       = $this->get('xml');

        if ( ! $xml && $this->form->getValue('element'))
        {
            if ($this->form->getValue('folder'))
            {
                $xml = 'plugins/' . $this->form->getValue('folder') . '/' . $this->form->getValue('element') . '/' . $this->form->getValue('element') . '.xml';
            }
            else
            {
                $xml = 'administrator/modules/' . $this->form->getValue('element') . '/' . $this->form->getValue('element') . '.xml';
            }

            if ( ! file_exists(JPATH_SITE . '/' . $xml))
            {
                return '';
            }
        }

        if (empty($extension) || empty($xml))
        {
            return '';
        }

        $user = JFactory::getApplication()->getIdentity() ?: JFactory::getUser();

        if ( ! $user->authorise('core.manage', 'com_installer'))
        {
            return '';
        }

        return '</div><div class="hide">' . RL_Version::getMessage($extension);
    }

    protected function getLabel()
    {
        return '';
    }
}
