<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_newsfeeds
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
 * Content Component Category Tree
 *
 * @since  1.6
 */
class NewsfeedsCategories extends JCategories
{
	/**
	 * Constructor
	 *
	 * @param   array  $options  options
	 */
	public function __construct($options = array())
	{
		$options['table'] = '#__newsfeeds';
		$options['extension'] = 'com_newsfeeds';
		$options['statefield'] = 'published';
		parent::__construct($options);
	}
}
