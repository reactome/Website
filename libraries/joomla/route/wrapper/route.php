<?php
/**
 * @package     Joomla.Platform
 * @subpackage  Application
 *
<<<<<<< HEAD
 * @copyright   (C) 2014 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('JPATH_PLATFORM') or die;

/**
 * Wrapper class for JRoute
 *
 * @package     Joomla.Platform
 * @subpackage  Application
 * @since       3.4
 * @deprecated  4.0 Will be removed without replacement
 */
class JRouteWrapperRoute
{
	/**
	 * Helper wrapper method for _
	 *
	 * @param   string   $url    Absolute or Relative URI to Joomla resource.
	 * @param   boolean  $xhtml  Replace & by &amp; for XML compliance.
	 * @param   integer  $ssl    Secure state for the resolved URI.
	 *
	 * @return  string The translated humanly readable URL.
	 *
	 * @see     JRoute::_()
	 * @since   3.4
	 */
	public function _($url, $xhtml = true, $ssl = null)
	{
		return JRoute::_($url, $xhtml, $ssl);
	}
}
