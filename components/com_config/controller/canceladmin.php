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
 * Cancel Controller for Admin
 *
 * @since  3.2
 */
class ConfigControllerCanceladmin extends ConfigControllerCancel
{
	/**
	 * The context for storing internal data, e.g. record.
	 *
	 * @var    string
	 * @since  3.2
	 */
	protected $context;

	/**
	 * The URL option for the component.
	 *
	 * @var    string
	 * @since  3.2
	 */
	protected $option;

	/**
	 * URL for redirection.
	 *
	 * @var    string
	 * @since  3.2
	 * @note   Replaces _redirect.
	 */
	protected $redirect;

	/**
	 * Method to handle admin cancel
	 *
	 * @return  boolean  True on success.
	 *
	 * @since   3.2
	 */
	public function execute()
	{
		// Check for request forgeries.
		if (!JSession::checkToken())
		{
			$this->app->enqueueMessage(JText::_('JINVALID_TOKEN_NOTICE'));
			$this->app->redirect('index.php');
		}

		if (empty($this->context))
		{
			$this->context = $this->option . '.edit' . $this->context;
		}

		// Redirect.
		$this->app->setUserState($this->context . '.data', null);

		if (!empty($this->redirect))
		{
			// Don't redirect to an external URL.
			if (!JUri::isInternal($this->redirect))
			{
				$this->redirect = JUri::base();
			}

			$this->app->redirect($this->redirect);
		}
		else
		{
			parent::execute();
		}
	}
}
