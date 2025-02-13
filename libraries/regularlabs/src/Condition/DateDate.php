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
 * Class DateDate
 *
 * @package RegularLabs\Library\Condition
 */
class DateDate extends Date
{
    public function pass()
    {
        if ( ! $this->params->publish_up && ! $this->params->publish_down)
        {
            // no date range set
            return ($this->include_type == 'include');
        }

        $now  = $this->getNow();
        $up   = $this->getDate($this->params->publish_up);
        $down = $this->getDate($this->params->publish_down);

        if (isset($this->params->recurring) && $this->params->recurring)
        {
            if ( ! (int) $this->params->publish_up || ! (int) $this->params->publish_down)
            {
                // no date range set
                return ($this->include_type == 'include');
            }

            $up   = strtotime(date('Y') . $up->format('-m-d H:i:s', true));
            $down = strtotime(date('Y') . $down->format('-m-d H:i:s', true));

            // pass:
            // 1) now is between up and down
            // 2) up is later in year than down and:
            // 2a) now is after up
            // 2b) now is before down
            if (
                ($up < $now && $down > $now)
                || ($up > $down
                    && (
                        $up < $now
                        || $down > $now
                    )
                )
            )
            {
                return ($this->include_type == 'include');
            }

            // outside date range
            return $this->_(false);
        }

        if (
            (
                (int) $this->params->publish_up
                && strtotime($up->format('Y-m-d H:i:s', true)) > $now
            )
            || (
                (int) $this->params->publish_down
                && strtotime($down->format('Y-m-d H:i:s', true)) < $now
            )
        )
        {
            // outside date range
            return $this->_(false);
        }

        // pass
        return ($this->include_type == 'include');
    }
}
