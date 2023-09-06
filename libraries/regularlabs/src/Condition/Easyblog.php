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

use RegularLabs\Library\Condition;
use RegularLabs\Library\ConditionContent;

defined('_JEXEC') or die;

/**
 * Class Easyblog
 *
 * @package RegularLabs\Library\Condition
 */
abstract class Easyblog extends Condition
{
    use ConditionContent;

    public function getItem($fields = [])
    {
        $query = $this->db->getQuery(true)
            ->select($fields)
            ->from('#__easyblog_post')
            ->where('id = ' . (int) $this->request->id);
        $this->db->setQuery($query);

        return $this->db->loadObject();
    }
}
