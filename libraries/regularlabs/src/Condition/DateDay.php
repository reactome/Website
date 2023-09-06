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
 * Class DateDay
 *
 * @package RegularLabs\Library\Condition
 */
class DateDay extends Date
{
    public function pass()
    {
        $day = $this->date->format('N', true); // 1 (for Monday) though 7 (for Sunday )

        return $this->passSimple($day);
    }
}
