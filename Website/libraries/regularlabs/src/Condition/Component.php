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

use Joomla\CMS\Factory as JFactory;
use RegularLabs\Library\Condition;

defined('_JEXEC') or die;

/**
 * Class Component
 *
 * @package RegularLabs\Library\Condition
 */
class Component extends Condition
{
    public function pass()
    {
        $option = JFactory::getApplication()->input->get('option') == 'com_categories'
            ? 'com_categories'
            : $this->request->option;

        return $this->passSimple(strtolower($option));
    }
}
