<?php
/**
 * @package         Regular Labs Library
<<<<<<< HEAD
 * @version         22.6.8549
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2022 Regular Labs All Rights Reserved
=======
 * @version         21.7.10061
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2021 Regular Labs All Rights Reserved
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Library\Condition;

defined('_JEXEC') or die;

/**
 * Class GeoRegion
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
