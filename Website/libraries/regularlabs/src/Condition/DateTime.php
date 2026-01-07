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
 * Class DateTime
 *
 * @package RegularLabs\Library\Condition
 */
class DateTime extends Date
{
    public function pass()
    {
        $now  = $this->getNow();
        $up   = strtotime($this->date->format('Y-m-d ', true) . $this->params->publish_up);
        $down = strtotime($this->date->format('Y-m-d ', true) . $this->params->publish_down);

        if ($up > $down)
        {
            // publish up is after publish down (spans midnight)
            // current time should be:
            // - after publish up
            // - OR before publish down
            if ($now >= $up || $now < $down)
            {
                return $this->_(true);
            }

            return $this->_(false);
        }

        // publish down is after publish up (simple time span)
        // current time should be:
        // - after publish up
        // - AND before publish down
        if ($now >= $up && $now < $down)
        {
            return $this->_(true);
        }

        return $this->_(false);
    }
}
