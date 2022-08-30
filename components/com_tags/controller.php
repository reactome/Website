<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_tags
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
 * Tags Component Controller
 *
 * @since  3.1
 */
class TagsController extends JControllerLegacy
{
	/**
	 * Method to display a view.
	 *
	 * @param   boolean        $cachable   If true, the view output will be cached
	 * @param   mixed|boolean  $urlparams  An array of safe URL parameters and their variable types, for valid values see {@link JFilterInput::clean()}.
	 *
	 * @return  JControllerLegacy  This object to support chaining.
	 *
	 * @since   3.1
	 */
	public function display($cachable = false, $urlparams = false)
	{
		$user = JFactory::getUser();

		// Set the default view name and format from the Request.
		$vName = $this->input->get('view', 'tags');
		$this->input->set('view', $vName);

		if ($user->get('id') || ($this->input->getMethod() === 'POST' && $vName === 'tags'))
		{
			$cachable = false;
		}

		$safeurlparams = array(
			'id'               => 'ARRAY',
			'type'             => 'ARRAY',
			'limit'            => 'UINT',
			'limitstart'       => 'UINT',
			'filter_order'     => 'CMD',
			'filter_order_Dir' => 'CMD',
			'lang'             => 'CMD'
		);

		return parent::display($cachable, $safeurlparams);
	}
}
