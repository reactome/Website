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

/**
 * Class Virtuemart
 * @package RegularLabs\Library\Condition
 */
abstract class Virtuemart extends Condition
{
	public function initRequest(&$request)
	{
		$virtuemart_product_id  = JFactory::getApplication()->input->get('virtuemart_product_id', [], 'array');
		$virtuemart_category_id = JFactory::getApplication()->input->get('virtuemart_category_id', [], 'array');

		$request->item_id     = $virtuemart_product_id[0] ?? null;
		$request->category_id = $virtuemart_category_id[0] ?? null;
		$request->id          = $request->item_id ?: $request->category_id;
	}
}
