<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_search
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
 * Helper for mod_search
 *
 * @since  1.5
 */
class ModSearchHelper
{
	/**
	 * Display the search button as an image.
	 *
	 * @return  string  The HTML for the image.
	 *
	 * @since   1.5
	 */
	public static function getSearchImage()
	{
		return JHtml::_('image', 'searchButton.gif', '', null, true, true);
	}
}
