<?php
/**
 * Joomla! Content Management System
 *
<<<<<<< HEAD
 * @copyright  (C) 2011 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\CMS\Http;

defined('JPATH_PLATFORM') or die;

/**
 * HTTP response data object class.
 *
 * @since  1.7.3
 */
class Response
{
	/**
	 * @var    integer  The server response code.
	 * @since  1.7.3
	 */
	public $code;

	/**
	 * @var    array  Response headers.
	 * @since  1.7.3
	 */
	public $headers = array();

	/**
	 * @var    string  Server response body.
	 * @since  1.7.3
	 */
	public $body;
}
