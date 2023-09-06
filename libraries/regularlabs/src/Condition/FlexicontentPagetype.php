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
 * Class FlexicontentPagetype
 *
 * @package RegularLabs\Library\Condition
 */
class FlexicontentPagetype extends Flexicontent
{
    public function pass()
    {
        return $this->passByPageType('com_flexicontent', $this->selection, $this->include_type);
    }
}
