<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_languages
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
 * Languages controller Class.
 *
 * @since  1.6
 */
class LanguagesControllerLanguages extends JControllerAdmin
{
	/**
	 * Method to get a model object, loading it if required.
	 *
	 * @param   string  $name    The model name. Optional.
	 * @param   string  $prefix  The class prefix. Optional.
	 * @param   array   $config  Configuration array for model. Optional.
	 *
	 * @return  object  The model.
	 *
	 * @since   1.6
	 */
	public function getModel($name = 'Language', $prefix = 'LanguagesModel', $config = array('ignore_request' => true))
	{
		return parent::getModel($name, $prefix, $config);
	}

	/**
	 * Method to save the submitted ordering values for records via AJAX.
	 *
	 * @return  void
	 *
	 * @since   3.1
	 */
	public function saveOrderAjax()
	{
		// Check for request forgeries.
		$this->checkToken();

<<<<<<< HEAD
		$pks   = (array) $this->input->post->get('cid', array(), 'int');
		$order = (array) $this->input->post->get('order', array(), 'int');
=======
		$pks   = $this->input->post->get('cid', array(), 'array');
		$order = $this->input->post->get('order', array(), 'array');
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090

		// Remove zero PK's and corresponding order values resulting from input filter for PK
		foreach ($pks as $i => $pk)
		{
			if ($pk === 0)
			{
				unset($pks[$i]);
				unset($order[$i]);
			}
		}

		// Get the model.
		$model = $this->getModel();

		// Save the ordering.
		$return = $model->saveorder($pks, $order);

		if ($return)
		{
			echo '1';
		}

		// Close the application.
		JFactory::getApplication()->close();
	}
}
