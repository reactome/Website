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

/**
 * Class VirtuemartProduct
 *
 * @package RegularLabs\Library\Condition
 */
class VirtuemartProduct extends Virtuemart
{
    public function pass()
    {
        // Because VM sucks, we have to get the view again
        $this->request->view = JFactory::getApplication()->input->getString('view');

        if ( ! $this->request->id || $this->request->option != 'com_virtuemart' || $this->request->view != 'productdetails')
        {
            return $this->_(false);
        }

        return $this->passSimple($this->request->id);
    }
}
