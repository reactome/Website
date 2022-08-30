<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_banners
 *
<<<<<<< HEAD
 * @copyright   (C) 2006 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Banners Controller
 *
 * @since  1.5
 */
class BannersController extends JControllerLegacy
{
	/**
	 * Method when a banner is clicked on.
	 *
	 * @return  void
	 *
	 * @since   1.5
	 */
	public function click()
	{
		$id = $this->input->getInt('id', 0);

		if ($id)
		{
			$model = $this->getModel('Banner', 'BannersModel', array('ignore_request' => true));
			$model->setState('banner.id', $id);
			$model->click();
			$this->setRedirect($model->getUrl());
		}
	}
}
