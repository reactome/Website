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
 * Class EasyblogKeyword
 *
 * @package RegularLabs\Library\Condition
 */
class EasyblogKeyword extends Easyblog
{
    public function pass()
    {
        parent::passContentKeyword();
    }
}
