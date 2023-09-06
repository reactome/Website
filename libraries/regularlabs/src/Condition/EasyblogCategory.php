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
 * Class EasyblogCategory
 *
 * @package RegularLabs\Library\Condition
 */
class EasyblogCategory extends Easyblog
{
    public function pass()
    {
        if ($this->request->option != 'com_easyblog')
        {
            return $this->_(false);
        }

        $pass = (
            ($this->params->inc_categories && $this->request->view == 'categories')
            || ($this->params->inc_items && $this->request->view == 'entry')
        );

        if ( ! $pass)
        {
            return $this->_(false);
        }

        $cats = $this->makeArray($this->getCategories());

        $pass = $this->passSimple($cats, false, 'include');

        if ($pass && $this->params->inc_children == 2)
        {
            return $this->_(false);
        }
        elseif ( ! $pass && $this->params->inc_children)
        {
            foreach ($cats as $cat)
            {
                $cats = array_merge($cats, $this->getCatParentIds($cat));
            }
        }

        return $this->passSimple($cats);
    }

    private function getCatParentIds($id = 0)
    {
        return $this->getParentIds($id, 'easyblog_category', 'parent_id');
    }

    private function getCategories()
    {
        switch ($this->request->view)
        {
            case 'entry' :
                return $this->getCategoryIDFromItem();
                break;

            case 'categories' :
                return $this->request->id;
                break;

            default:
                return '';
        }
    }

    private function getCategoryIDFromItem()
    {
        $query = $this->db->getQuery(true)
            ->select('i.category_id')
            ->from('#__easyblog_post AS i')
            ->where('i.id = ' . (int) $this->request->id);
        $this->db->setQuery($query);

        return $this->db->loadResult();
    }
}
