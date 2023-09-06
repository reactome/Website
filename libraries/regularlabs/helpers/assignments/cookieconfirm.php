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

/* @DEPRECATED */

defined('_JEXEC') or die;

if (is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
    require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';
}

require_once dirname(__FILE__, 2) . '/assignment.php';

class RLAssignmentsCookieConfirm extends RLAssignment
{
    public function passCookieConfirm()
    {
        require_once JPATH_PLUGINS . '/system/cookieconfirm/core.php';
        $pass = PlgSystemCookieconfirmCore::getInstance()->isCookiesAllowed();

        return $this->pass($pass);
    }
}
