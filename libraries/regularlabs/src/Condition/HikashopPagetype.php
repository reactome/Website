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

namespace RegularLabs\Library\Condition;

defined('_JEXEC') or die;

/**
 * Class HikashopPagetype
 *
 * @package RegularLabs\Library\Condition
 */
class HikashopPagetype extends Hikashop
{
    public function pass()
    {
        if ($this->request->option != 'com_hikashop')
        {
            return $this->_(false);
        }

        $type = $this->request->view;

        if (
            ($type == 'product' && in_array($this->request->task, ['contact', 'show']))
        )
        {
            $type .= '_' . $this->request->task;
        }
        elseif (
            ($type == 'product' && in_array($this->request->layout, ['contact', 'show']))
            || ($type == 'user' && in_array($this->request->layout, ['cpanel']))
        )
        {
            $type .= '_' . $this->request->layout;
        }

        return $this->passSimple($type);
    }
}
