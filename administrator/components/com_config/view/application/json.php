<?php
/**
 * @package     Joomla.Administrator
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
 * View for the component configuration
 *
 * @since  3.2
 */
class ConfigViewApplicationJson extends ConfigViewCmsJson
{
	public $state;

	public $data;

	/**
	 * Display the view
	 *
	 * @return  string  The rendered view.
	 *
	 * @since   3.2
	 */
	public function render()
	{
		try
		{
			$this->data = $this->model->getData();
			$user = JFactory::getUser();
		}
		catch (Exception $e)
		{
			JFactory::getApplication()->enqueueMessage($e->getMessage(), 'error');

			return false;
		}

		$this->userIsSuperAdmin = $user->authorise('core.admin');

		// Required data
		$requiredData = array(
			'sitename'            => null,
			'offline'             => null,
			'access'              => null,
			'list_limit'          => null,
			'MetaDesc'            => null,
			'MetaKeys'            => null,
			'MetaRights'          => null,
			'sef'                 => null,
			'sitename_pagetitles' => null,
			'debug'               => null,
			'debug_lang'          => null,
			'error_reporting'     => null,
			'mailfrom'            => null,
			'fromname'            => null
		);

		$this->data = array_intersect_key($this->data, $requiredData);

		return json_encode($this->data);
	}
}
