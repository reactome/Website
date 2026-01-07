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
 * Class DateMonth
 *
 * @package RegularLabs\Library\Condition
 */
class DateMonth extends Date
{
    public function pass()
    {
        $month = $this->date->format('m', true); // 01 (for January) through 12 (for December)

        return $this->passSimple((int) $month);
    }
}
