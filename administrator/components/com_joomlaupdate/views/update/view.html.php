<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_joomlaupdate
 *
<<<<<<< HEAD
 * @copyright   (C) 2012 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Joomla! Update's Update View
 *
 * @since  2.5.4
 */
class JoomlaupdateViewUpdate extends JViewLegacy
{
	/**
	 * Renders the view.
	 *
	 * @param   string  $tpl  Template name.
	 *
	 * @return  void
	 */
	public function display($tpl = null)
	{
		JFactory::getApplication()->input->set('hidemainmenu', true);

		// Set the toolbar information.
		JToolbarHelper::title(JText::_('COM_JOOMLAUPDATE_OVERVIEW'), 'loop install');

		// Import com_login's model
		JModelLegacy::addIncludePath(JPATH_ADMINISTRATOR . '/components/com_login/models', 'LoginModel');

		// Render the view.
		parent::display($tpl);
	}
}
