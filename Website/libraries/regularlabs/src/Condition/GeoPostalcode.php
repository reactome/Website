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
 * Class GeoPostalcode
 *
 * @package RegularLabs\Library\Condition
 */
class GeoPostalcode extends Geo
{
    public function pass()
    {
        if ( ! $this->getGeo() || empty($this->geo->postalCode))
        {
            return $this->_(false);
        }

        // replace dashes with dots: 730-0011 => 730.0011
        $postalcode = str_replace('-', '.', $this->geo->postalCode);

        return $this->passInRange($postalcode);
    }
}
