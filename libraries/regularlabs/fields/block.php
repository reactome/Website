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

class JFormFieldRL_Block extends Field
{
    public $type = 'Block';

    protected function getInput()
    {
        $title       = $this->get('label');
        $description = $this->get('description');
        $class       = $this->get('class');
        $showclose   = $this->get('showclose', 0);
        $nowell      = $this->get('nowell', 0);

        $start = $this->get('start', 0);
        $end   = $this->get('end', 0);

        $html = [];

        if ($start || ! $end)
        {
            $html[] = '</div>';

            if (strpos($class, 'alert') !== false)
            {
                $class = 'alert ' . $class;
            }
            elseif ( ! $nowell)
            {
                $class = 'well well-small ' . $class;
            }

            $html[] = '<div class="' . $class . '">';

            $user = JFactory::getApplication()->getIdentity() ?: JFactory::getUser();

            if ($showclose && $user->authorise('core.admin'))
            {
                $html[] = '<button type="button" class="close rl_remove_assignment" aria-label="Close">&times;</button>';
            }

            if ($title)
            {
                $html[] = '<h4>' . $this->prepareText($title) . '</h4>';
            }

            if ($description)
            {
                $html[] = '<div>' . $this->prepareText($description) . '</div>';
            }

            $html[] = '<div><div>';
        }

        if ( ! $start && ! $end)
        {
            $html[] = '</div>';
        }

        return '</div>' . implode('', $html);
    }

    protected function getLabel()
    {
        return '';
    }
}
