<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_config
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
 * Prototype admin view.
 *
 * @since  3.2
 */
abstract class ConfigViewCmsJson extends ConfigViewCmsHtml
{
	public $state;

	public $data;

	/**
	 * Method to render the view.
	 *
	 * @return  string  The rendered view.
	 *
	 * @since   3.2
	 */
	public function render()
	{
		$this->data = $this->model->getData();

		return json_encode($this->data);
	}
}
