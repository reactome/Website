<?php
/**
 * @package     Joomla.Plugin
 * @subpackage  System.p3p
 *
<<<<<<< HEAD
 * @copyright   (C) 2010 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Joomla! P3P Header Plugin.
 *
 * @since  1.6
 * @deprecate  4.0  Obsolete
 */
class PlgSystemP3p extends JPlugin
{
	/**
	 * After initialise.
	 *
	 * @return  void
	 *
	 * @since   1.6
	 * @deprecate  4.0  Obsolete
	 */
	public function onAfterInitialise()
	{
		// Get the header.
		$header = $this->params->get('header', 'NOI ADM DEV PSAi COM NAV OUR OTRo STP IND DEM');
		$header = trim($header);

		// Bail out on empty header (why would anyone do that?!).
		if (empty($header))
		{
			return;
		}

		// Replace any existing P3P headers in the response.
		JFactory::getApplication()->setHeader('P3P', 'CP="' . $header . '"', true);
	}
}
