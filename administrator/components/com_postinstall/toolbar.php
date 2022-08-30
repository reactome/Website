<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_postinstall
 *
<<<<<<< HEAD
 * @copyright   (C) 2013 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * The Toolbar class renders the component title area and the toolbar.
 *
 * @since  3.2
 */
class PostinstallToolbar extends FOFToolbar
{
	/**
	 * Setup the toolbar and title
	 *
	 * @return  void
	 *
	 * @since   3.2
	 */
	public function onMessages()
	{
		JToolBarHelper::preferences($this->config['option'], 550, 875);
		JToolbarHelper::help('JHELP_COMPONENTS_POST_INSTALLATION_MESSAGES');
	}
}
