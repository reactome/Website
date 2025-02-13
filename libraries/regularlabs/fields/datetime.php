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
use Joomla\CMS\Language\Text as JText;
use RegularLabs\Library\Date as RL_Date;
use RegularLabs\Library\Field;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
    return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

class JFormFieldRL_DateTime extends Field
{
    public $type = 'DateTime';

    protected function getInput()
    {
        $label  = $this->get('label');
        $format = $this->get('format');

        $date = JFactory::getDate();

        $tz = new DateTimeZone(JFactory::getApplication()->getCfg('offset'));
        $date->setTimeZone($tz);

        if ($format)
        {
            if (strpos($format, '%') !== false)
            {
                $format = RL_Date::strftimeToDateFormat($format);
            }

            $html = $date->format($format, true);
        }
        else
        {
            $html = $date->format('', true);
        }

        if ($label)
        {
            $html = JText::sprintf($label, $html);
        }

        return '</div><div>' . $html;
    }

    protected function getLabel()
    {
        return '';
    }
}
