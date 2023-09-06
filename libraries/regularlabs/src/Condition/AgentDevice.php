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
 * Class AgentDevice
 *
 * @package RegularLabs\Library\Condition
 */
class AgentDevice extends Agent
{
    public function pass()
    {
        $pass = (in_array('mobile', $this->selection) && $this->isMobile())
            || (in_array('tablet', $this->selection) && $this->isTablet())
            || (in_array('desktop', $this->selection) && $this->isDesktop());

        return $this->_($pass);
    }
}
