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

/* @DEPRECATED */

defined('_JEXEC') or die;

if (is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
    require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';
}

require_once dirname(__FILE__, 2) . '/assignment.php';

class RLAssignmentsForm2Content extends RLAssignment
{
    public function passProjects()
    {
        if ($this->request->option != 'com_content' && $this->request->view == 'article')
        {
            return $this->pass(false);
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
