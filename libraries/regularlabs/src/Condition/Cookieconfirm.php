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

use PlgSystemCookieconfirmCore;
use RegularLabs\Library\Condition;

/**
 * Class Cookieconfirm
 *
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
