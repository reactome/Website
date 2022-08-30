<?php
/**
 * @package         Regular Labs Library
<<<<<<< HEAD
 * @version         22.6.8549
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2022 Regular Labs All Rights Reserved
=======
 * @version         21.7.10061
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2021 Regular Labs All Rights Reserved
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Library\Condition;

defined('_JEXEC') or die;

/**
 * Class AgentDevice
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
