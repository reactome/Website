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

// If controller.php exists, assume this is K2 v3
defined('RL_K2_VERSION') or define('RL_K2_VERSION', file_exists(JPATH_ADMINISTRATOR . '/components/com_k2/controller.php') ? 3 : 2);

/**
 * Class K2
 *
 * @package RegularLabs\Library\Condition
 */
abstract class K2 extends Condition
{
    use ConditionContent;

    public function getItem($fields = [])
    {
        $query = $this->db->getQuery(true)
            ->select($fields)
            ->from('#__k2_items')
            ->where('id = ' . (int) $this->request->id);
        $this->db->setQuery($query);

        return $this->db->loadObject();
    }
}
