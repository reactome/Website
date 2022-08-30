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
 * Class Form2contentProject
 * @package RegularLabs\Library\Condition
 */
class Form2contentProject extends Form2content
{
	public function pass()
	{
		if ($this->request->option != 'com_content' && $this->request->view == 'article')
		{
			return $this->_(false);
		}

		$query = $this->db->getQuery(true)
			->select('c.projectid')
			->from('#__f2c_form AS c')
			->where('c.reference_id = ' . (int) $this->request->id);
		$this->db->setQuery($query);
		$type = $this->db->loadResult();

		$types = $this->makeArray($type);

		return $this->passSimple($types);
	}
}
