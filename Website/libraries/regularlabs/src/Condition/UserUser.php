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
 * Class UserUser
 *
 * @package RegularLabs\Library\Condition
 */
class UserUser extends User
{
    public function pass()
    {
        $user = JFactory::getApplication()->getIdentity() ?: JFactory::getUser();

        return $this->passSimple($user->get('id'));
    }
}
