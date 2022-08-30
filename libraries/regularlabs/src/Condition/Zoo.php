<?php
/**
 * @package         Regular Labs Library
<<<<<<< HEAD
 * @version         22.6.8549
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2022 Regular Labs All Rights Reserved
=======
 * @version         21.7.10061
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2021 Regular Labs All Rights Reserved
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Library\Condition;

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use RegularLabs\Library\Condition;
use RegularLabs\Library\ConditionContent;

/**
 * Class Zoo
 * @package RegularLabs\Library\Condition
 */
abstract class Zoo extends Condition
{
	use ConditionContent;

	public function getItem($fields = [])
	{
		$query = $this->db->getQuery(true)
			->select($fields)
			->from('#__zoo_item')
			->where('id = ' . (int) $this->request->id);
		$this->db->setQuery($query);

		return $this->db->loadObject();
	}

	public function initRequest(&$request)
	{
		$request->view = $request->task ?: $request->view;

		switch ($request->view)
		{
			case 'item':
				$request->idname = 'item_id';
				break;
			case 'category':
				$request->idname = 'category_id';
				break;
		}

		if ( ! isset($request->idname))
		{
			$request->idname = '';
		}

		switch ($request->idname)
		{
			case 'item_id':
				$request->view = 'item';
				break;
			case 'category_id':
				$request->view = 'category';
				break;
		}

		$request->id = JFactory::getApplication()->input->getInt($request->idname, 0);

		if ($request->id)
		{
			return;
		}

		$menu = JFactory::getApplication()->getMenu()->getItem((int) $request->Itemid);

		if (empty($menu))
		{
			return;
		}

		$request->id = $menu->getParams()->get('item_id', 0);
	}

}
