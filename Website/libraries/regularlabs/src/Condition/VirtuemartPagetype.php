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
 * Class VirtuemartPagetype
 *
 * @package RegularLabs\Library\Condition
 */
class VirtuemartPagetype extends Virtuemart
{
    public function pass()
    {
        // Because VM sucks, we have to get the view again
        $this->request->view = JFactory::getApplication()->input->getString('view');

        return $this->passByPageType('com_virtuemart', $this->selection, $this->include_type, true);
    }
}
