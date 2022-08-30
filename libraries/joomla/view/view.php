<?php
/**
 * @package     Joomla.Platform
 * @subpackage  View
 *
<<<<<<< HEAD
 * @copyright   (C) 2012 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('JPATH_PLATFORM') or die;

/**
 * Joomla Platform View Interface
 *
 * @since       3.0.0
 * @deprecated  4.0 Use the default MVC library
 */
interface JView
{
	/**
	 * Method to escape output.
	 *
	 * @param   string  $output  The output to escape.
	 *
	 * @return  string  The escaped output.
	 *
	 * @since   3.0.0
	 */
	public function escape($output);

	/**
	 * Method to render the view.
	 *
	 * @return  string  The rendered view.
	 *
	 * @since   3.0.0
	 * @throws  RuntimeException
	 */
	public function render();
}
