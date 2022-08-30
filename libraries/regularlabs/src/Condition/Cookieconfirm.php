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

use PlgSystemCookieconfirmCore;
use RegularLabs\Library\Condition;

/**
 * Class Cookieconfirm
 * @package RegularLabs\Library\Condition
 */
class Cookieconfirm extends Condition
{
	public function pass()
	{
		require_once JPATH_PLUGINS . '/system/cookieconfirm/core.php';
		$pass = PlgSystemCookieconfirmCore::getInstance()->isCookiesAllowed();

		return $this->_($pass);
	}
}
