<?php
/**
 * @package     Joomla.Platform
 * @subpackage  Model
 *
<<<<<<< HEAD
 * @copyright   (C) 2005 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('JPATH_PLATFORM') or die;

use Joomla\Registry\Registry;

/**
 * Joomla Platform Model Interface
 *
 * @since       3.0.0
 * @deprecated  4.0 Use the default MVC library
 */
interface JModel
{
	/**
	 * Get the model state.
	 *
	 * @return  Registry  The state object.
	 *
	 * @since   3.0.0
	 */
	public function getState();

	/**
	 * Set the model state.
	 *
	 * @param   Registry  $state  The state object.
	 *
	 * @return  void
	 *
	 * @since   3.0.0
	 */
	public function setState(Registry $state);
}
