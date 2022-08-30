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

/**
 * Class RedshopCategory
 * @package RegularLabs\Library\Condition
 */
class RedshopCategory extends Redshop
{
	public function pass()
	{
		if ($this->request->option != 'com_redshop')
		{
			return $this->_(false);
		}

		$pass = (
			($this->params->inc_categories
				&& ($this->request->view == 'category')
			)
			|| ($this->params->inc_items && $this->request->view == 'product')
		);

		if ( ! $pass)
		{
			return $this->_(false);
		}

		$cats = [];
		if ($this->request->category_id)
		{
			$cats = $this->request->category_id;
		}
		else if ($this->request->item_id)
		{
			$query = $this->db->getQuery(true)
				->select('x.category_id')
				->from('#__redshop_product_category_xref AS x')
				->where('x.product_id = ' . (int) $this->request->item_id);
			$this->db->setQuery($query);
			$cats = $this->db->loadColumn();
		}

		$cats = $this->makeArray($cats);

		$pass = $this->passSimple($cats, false, 'include');

		if ($pass && $this->params->inc_children == 2)
		{
			return $this->_(false);
		}
		else if ( ! $pass && $this->params->inc_children)
		{
			foreach ($cats as $cat)
			{
				$cats = array_merge($cats, $this->getCatParentIds($cat));
			}
		}

		return $this->passSimple($cats);
	}

	private function getCatParentIds($id = 0)
	{
		return $this->getParentIds($id, 'redshop_category_xref', 'category_parent_id', 'category_child_id');
	}
}
