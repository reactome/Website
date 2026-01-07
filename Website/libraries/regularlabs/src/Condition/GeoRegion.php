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
 * Class GeoRegion
 *
 * @package RegularLabs\Library\Condition
 */
class GeoRegion extends Geo
{
    public function pass()
    {
        if ( ! $this->getGeo() || empty($this->geo->countryCode) || empty($this->geo->regionCodes))
        {
            return $this->_(false);
        }

        $country = $this->geo->countryCode;
        $regions = $this->geo->regionCodes;

        array_walk($regions, function (&$region, $key, $country) {

            $region = $this->getCountryRegionCode($region, $country);
        }, $country);

        return $this->passSimple($regions);
    }

    private function getCountryRegionCode(&$region, $country)
    {
        switch ($country . '-' . $region)
        {
            case 'MX-CMX':
                return 'MX-DIF';

            default:
                return $country . '-' . $region;
        }
    }
}
