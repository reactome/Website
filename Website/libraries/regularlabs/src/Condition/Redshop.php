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
 * Class Redshop
 *
 * @package RegularLabs\Library\Condition
 */
abstract class Redshop extends Condition
{
    public function initRequest(&$request)
    {
        $request->item_id     = JFactory::getApplication()->input->getInt('pid', 0);
        $request->category_id = JFactory::getApplication()->input->getInt('cid', 0);
        $request->id          = $request->item_id ?: $request->category_id;
    }
}
