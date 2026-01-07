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

use RegularLabs\Library\FieldGroup;

defined('_JEXEC') or die;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
    return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

class JFormFieldRL_Form2Content extends FieldGroup
{
    public $default_group = 'Projects';
    public $type          = 'Form2Content';

    public function getProjects()
    {
        $query = $this->db->getQuery(true)
            ->select('t.id, t.title as name')
            ->from('#__f2c_project AS t')
            ->where('t.published = 1')
            ->order('t.title, t.id');
        $this->db->setQuery($query);
        $list = $this->db->loadObjectList();

        return $this->getOptionsByList($list);
    }

    protected function getInput()
    {
        $error = $this->missingFilesOrTables(['projects' => 'project'], '', 'f2c');

        return $error ?: $this->getSelectList();
    }
}
