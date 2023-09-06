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
 * Class Hikashop
 *
 * @package RegularLabs\Library\Condition
 */
abstract class Hikashop extends Condition
{
    public function beforePass()
    {
        $input = JFactory::getApplication()->input;

        // Reset $this->request because HikaShop messes with the view after stuff is loaded!
        $this->request->option = $input->get('option', $this->request->option);
        $this->request->view   = $input->get('view', $input->get('ctrl', $this->request->view));
        $this->request->id     = $input->getInt('id', $this->request->id);
        $this->request->Itemid = $input->getInt('Itemid', $this->request->Itemid);
    }
}
