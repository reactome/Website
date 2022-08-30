<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_articles_categories
 *
<<<<<<< HEAD
 * @copyright   (C) 2010 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Helper for mod_articles_categories
 *
 * @since  1.5
 */
abstract class ModArticlesCategoriesHelper
{
	/**
	 * Get list of articles
	 *
	 * @param   \Joomla\Registry\Registry  &$params  module parameters
	 *
	 * @return  array
	 *
	 * @since   1.5
	 */
	public static function getList(&$params)
	{
		$options               = array();
		$options['countItems'] = $params->get('numitems', 0);

		$categories = JCategories::getInstance('Content', $options);
		$category   = $categories->get($params->get('parent', 'root'));

		if ($category !== null)
		{
			$items = $category->getChildren();

			$count = $params->get('count', 0);

			if ($count > 0 && count($items) > $count)
			{
				$items = array_slice($items, 0, $count);
			}

			return $items;
		}
	}
}
