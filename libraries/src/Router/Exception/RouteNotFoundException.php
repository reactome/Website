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

namespace Joomla\CMS\Router\Exception;

defined('JPATH_PLATFORM') or die;

/**
 * Exception class defining an error for a missing route
 *
 * @since  3.8.0
 */
class RouteNotFoundException extends \InvalidArgumentException
{
	/**
	 * Constructor
	 *
	 * @param   string      $message   The Exception message to throw.
	 * @param   integer     $code      The Exception code.
	 * @param   \Exception  $previous  The previous exception used for the exception chaining.
	 *
	 * @since   3.8.0
	 */
	public function __construct($message = '', $code = 404, \Exception $previous = null)
	{
		if (empty($message))
		{
			$message = 'URL was not found';
		}

		parent::__construct($message, $code, $previous);
	}
}
