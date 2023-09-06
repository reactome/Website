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

/**
 * Class ZooItem
 *
 * @package RegularLabs\Library\Condition
 */
class ZooItem extends Zoo
{
    public function pass()
    {
        if ( ! $this->request->id || $this->request->option != 'com_zoo')
        {
            return $this->_(false);
        }

        if ($this->request->view != 'item')
        {
            return $this->_(false);
        }

        $pass = false;

        // Pass Article Id
        if ( ! $this->passItemByType($pass, 'ContentId'))
        {
            return $this->_(false);
        }

        // Pass Author
        if ( ! $this->passItemByType($pass, 'Author'))
        {
            return $this->_(false);
        }

        return $this->_($pass);
    }
}
