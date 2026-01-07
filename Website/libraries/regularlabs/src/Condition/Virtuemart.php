<?php
/**
 * @package         Regular Labs Library
 * @version         23.9.3039
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            https://regularlabs.com
 * @copyright       Copyright © 2023 Regular Labs All Rights Reserved
 * @license         GNU General Public License version 2 or later
 */

namespace RegularLabs\Library\Condition;

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use RegularLabs\Library\Condition;

/**
 * Class Virtuemart
 *
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
