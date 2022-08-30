<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  mod_feed
 *
<<<<<<< HEAD
 * @copyright   (C) 2006 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Helper for mod_feed
 *
 * @since  1.5
 */
class ModFeedHelper
{
	/**
	 * Method to load a feed.
	 *
	 * @param   JRegisty  $params  The parameters object.
	 *
	 * @return  JFeedReader|string  Return a JFeedReader object or a string message if error.
	 *
	 * @since   1.5
	 */
	public static function getFeed($params)
	{
		// Module params
		$rssurl = $params->get('rssurl', '');

		// Get RSS parsed object
		try
		{
			jimport('joomla.feed.factory');
			$feed   = new JFeedFactory;
			$rssDoc = $feed->getFeed($rssurl);
		}
		catch (Exception $e)
		{
			return JText::_('MOD_FEED_ERR_FEED_NOT_RETRIEVED');
		}

		if (empty($rssDoc))
		{
			return JText::_('MOD_FEED_ERR_FEED_NOT_RETRIEVED');
		}

		return $rssDoc;
	}
}
