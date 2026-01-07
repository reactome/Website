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
 * Class AgentBrowser
 *
 * @package RegularLabs\Library\Condition
 */
class AgentBrowser extends Agent
{
    public function pass()
    {
        if (empty($this->selection))
        {
            return $this->_(false);
        }

        foreach ($this->selection as $browser)
        {
            if ( ! $this->passBrowser($browser))
            {
                continue;
            }

            return $this->_(true);
        }

        return $this->_(false);
    }
}
