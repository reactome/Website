<?php
/**
 * Joomla! Content Management System
 *
<<<<<<< HEAD
 * @copyright  (C) 2017 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\CMS\Document\Feed;

defined('JPATH_PLATFORM') or die;

/**
 * Data object representing a feed enclosure
 *
 * @since  1.7.0
 */
class FeedEnclosure
{
	/**
	 * URL enclosure element
	 *
	 * required
	 *
	 * @var    string
	 * @since  1.7.0
	 */
	public $url = '';

	/**
	 * Length enclosure element
	 *
	 * required
	 *
	 * @var    string
	 * @since  1.7.0
	 */
	public $length = '';

	/**
	 * Type enclosure element
	 *
	 * required
	 *
	 * @var    string
	 * @since  1.7.0
	 */
	public $type = '';
}
