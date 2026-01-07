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
 * Class Form2contentProject
 *
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
