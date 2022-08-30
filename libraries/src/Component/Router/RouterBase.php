<?php
/**
 * Joomla! Content Management System
 *
<<<<<<< HEAD
 * @copyright  (C) 2014 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\CMS\Component\Router;

defined('JPATH_PLATFORM') or die;

/**
 * Base component routing class
 *
 * @since  3.3
 */
abstract class RouterBase implements RouterInterface
{
	/**
	 * Application object to use in the router
	 *
	 * @var    \JApplicationCms
	 * @since  3.4
	 */
	public $app;

	/**
	 * Menu object to use in the router
	 *
	 * @var    \JMenu
	 * @since  3.4
	 */
	public $menu;

	/**
	 * Class constructor.
	 *
	 * @param   \JApplicationCms  $app   Application-object that the router should use
	 * @param   \JMenu            $menu  Menu-object that the router should use
	 *
	 * @since   3.4
	 */
	public function __construct($app = null, $menu = null)
	{
		if ($app)
		{
			$this->app = $app;
		}
		else
		{
			$this->app = \JFactory::getApplication('site');
		}

		if ($menu)
		{
			$this->menu = $menu;
		}
		else
		{
			$this->menu = $this->app->getMenu();
		}
	}

	/**
	 * Generic method to preprocess a URL
	 *
	 * @param   array  $query  An associative array of URL arguments
	 *
	 * @return  array  The URL arguments to use to assemble the subsequent URL.
	 *
	 * @since   3.3
	 */
	public function preprocess($query)
	{
		return $query;
	}
}
