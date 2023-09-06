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

use Joomla\CMS\Factory as JFactory;

/**
 * Class K2Pagetype
 *
 * @package RegularLabs\Library\Condition
 */
class K2Pagetype extends K2
{
    public function pass()
    {
        // K2 messes with the task in the request, so we have to reset the task
        $this->request->task = JFactory::getApplication()->input->get('task');

        return $this->passByPageType('com_k2', $this->selection, $this->include_type, false, true);
    }
}
