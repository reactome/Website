<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_media
 *
<<<<<<< HEAD
 * @copyright   (C) 2007 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * HTML View class for the Media component
 *
 * @since  1.0
 */
class MediaViewMediaList extends JViewLegacy
{
	/**
	 * Execute and display a template script.
	 *
	 * @param   string  $tpl  The name of the template file to parse; automatically searches through the template paths.
	 *
	 * @return  mixed  A string if successful, otherwise an Error object.
	 *
	 * @since   1.0
	 */
	public function display($tpl = null)
	{
		$app = JFactory::getApplication();

		if (!$app->isClient('administrator'))
		{
			return $app->enqueueMessage(JText::_('JERROR_ALERTNOAUTHOR'), 'warning');
		}

		// Do not allow cache
		$app->allowCache(false);

		$this->images    = $this->get('images');
		$this->documents = $this->get('documents');
		$this->folders   = $this->get('folders');
		$this->videos    = $this->get('videos');
		$this->state     = $this->get('state');

		// Check for invalid folder name
		if (empty($this->state->folder))
		{
			$dirname = JFactory::getApplication()->input->getPath('folder', '');

			if (!empty($dirname))
			{
				$dirname = htmlspecialchars($dirname, ENT_COMPAT, 'UTF-8');
				JError::raiseWarning(100, JText::sprintf('COM_MEDIA_ERROR_UNABLE_TO_BROWSE_FOLDER_WARNDIRNAME', $dirname));
			}
		}

		$user = JFactory::getUser();
		$this->canDelete = $user->authorise('core.delete', 'com_media');

		parent::display($tpl);
	}
}
