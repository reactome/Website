<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_banners
 *
<<<<<<< HEAD
 * @copyright   (C) 2009 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Banner Helper Class
 *
 * @since  1.6
 */
abstract class BannerHelper
{
	/**
	 * Checks if a URL is an image
	 *
	 * @param   string  $url  The URL path to the potential image
	 *
	 * @return  boolean  True if an image of type bmp, gif, jp(e)g or png, false otherwise
	 *
	 * @since   1.6
	 */
	public static function isImage($url)
	{
		return preg_match('#\.(?:bmp|gif|jpe?g|png)$#i', $url);
	}

	/**
	 * Checks if a URL is a Flash file
	 *
	 * @param   string  $url  The URL path to the potential flash file
	 *
	 * @return  boolean  True if an image of type bmp, gif, jp(e)g or png, false otherwise
	 *
	 * @since   1.6
	 */
	public static function isFlash($url)
	{
		return preg_match('#\.swf$#i', $url);
	}
}
