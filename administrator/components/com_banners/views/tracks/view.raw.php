<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_banners
 *
<<<<<<< HEAD
 * @copyright   (C) 2009 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * View class for a list of tracks.
 *
 * @since  1.6
 */
class BannersViewTracks extends JViewLegacy
{
	/**
	 * Display the view
	 *
	 * @param   string  $tpl  The name of the template file to parse; automatically searches through the template paths.
	 *
	 * @return  void
	 */
	public function display($tpl = null)
	{
		$basename = $this->get('BaseName');
		$filetype = $this->get('FileType');
		$mimetype = $this->get('MimeType');
		$content  = $this->get('Content');

		// Check for errors.
		if (count($errors = $this->get('Errors')))
		{
			throw new Exception(implode("\n", $errors), 500);
		}

		$document = JFactory::getDocument();
		$document->setMimeEncoding($mimetype);
		JFactory::getApplication()
			->setHeader(
				'Content-disposition',
				'attachment; filename="' . $basename . '.' . $filetype . '"; creation-date="' . JFactory::getDate()->toRFC822() . '"',
				true
			);
		echo $content;
	}
}
