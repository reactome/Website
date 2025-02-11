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

use Joomla\CMS\HTML\HTMLHelper as JHtml;
use Joomla\CMS\Language\Text as JText;
use Joomla\Registry\Registry;
use RegularLabs\Library\Field;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
    return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

class JFormFieldRL_Agents extends Field
{
    public $type = 'Agents';

    public function getAgents($group = 'os')
    {
        $agents = [];

        switch ($group)
        {
            /* Browsers */
            case 'browsers':
                if ($this->get('simple') && $this->get('simple') !== 'false')
                {
                    $agents[] = ['Chrome', 'Chrome'];
                    $agents[] = ['Firefox', 'Firefox'];
                    $agents[] = ['Edge', 'Edge'];
                    $agents[] = ['Internet Explorer', 'MSIE'];
                    $agents[] = ['Opera', 'Opera'];
                    $agents[] = ['Safari', 'Safari'];
                    break;
                }

                $agents[] = ['Chrome', 'Chrome'];
                $agents[] = ['Firefox', 'Firefox'];
                $agents[] = ['Microsoft Edge', 'MSIE Edge']; // missing MSIE is added to agent string in assignments/agents.php
                $agents[] = ['Internet Explorer', 'MSIE [0-9]']; // missing MSIE is added to agent string in assignments/agents.php
                $agents[] = ['Opera', 'Opera'];
                $agents[] = ['Safari', 'Safari'];
                break;

            /* Mobile browsers */
            case 'mobile':
                $agents[] = [JText::_('JALL'), 'mobile'];
                $agents[] = ['Android', 'Android'];
                $agents[] = ['Android Chrome', '#Android.*Chrome#'];
                $agents[] = ['Blackberry', 'Blackberry'];
                $agents[] = ['IE Mobile', 'IEMobile'];
                $agents[] = ['iPad', 'iPad'];
                $agents[] = ['iPhone', 'iPhone'];
                $agents[] = ['iPod Touch', 'iPod'];
                $agents[] = ['NetFront', 'NetFront'];
                $agents[] = ['Nokia', 'NokiaBrowser'];
                $agents[] = ['Opera Mini', 'Opera Mini'];
                $agents[] = ['Opera Mobile', 'Opera Mobi'];
                $agents[] = ['UC Browser', 'UC Browser'];
                break;

            /* OS */
            case 'os':
            default:
                $agents[] = ['Windows', 'Windows'];
                $agents[] = ['Mac OS', '#(Mac OS|Mac_PowerPC|Macintosh)#'];
                $agents[] = ['Linux', '#(Linux|X11)#'];
                $agents[] = ['Open BSD', 'OpenBSD'];
                $agents[] = ['Sun OS', 'SunOS'];
                $agents[] = ['QNX', 'QNX'];
                $agents[] = ['BeOS', 'BeOS'];
                $agents[] = ['OS/2', 'OS/2'];
                break;
        }

        $options = [];

        foreach ($agents as $agent)
        {
            $option    = JHtml::_('select.option', $agent[1], $agent[0]);
            $options[] = $option;
        }

        return $options;
    }

    public function getAjaxRaw(Registry $attributes)
    {
        $name  = $attributes->get('name', $this->type);
        $id    = $attributes->get('id', strtolower($name));
        $value = $attributes->get('value', []);
        $size  = $attributes->get('size');

        $options = $this->getAgents(
            $attributes->get('group')
        );

        return $this->selectListSimple($options, $name, $value, $id, $size, true);
    }

    protected function getInput()
    {
        if ( ! is_array($this->value))
        {
            $this->value = explode(',', $this->value);
        }

        $size  = (int) $this->get('size');
        $group = $this->get('group', 'os');

        return $this->selectListSimpleAjax(
            $this->type, $this->name, $this->value, $this->id,
            compact('size', 'group')
        );
    }
}
