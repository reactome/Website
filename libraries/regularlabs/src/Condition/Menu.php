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
use RegularLabs\Library\Document as RL_Document;

/**
 * Class Menu
 *
 * @package RegularLabs\Library\Condition
 */
class Menu extends Condition
{
    public function pass()
    {
        // return if no Itemid or selection is set
        if ( ! $this->request->Itemid || empty($this->selection))
        {
            return $this->_($this->params->inc_noitemid);
        }

        // return true if menu is in selection
        if (in_array($this->request->Itemid, $this->selection))
        {
            return $this->_(($this->params->inc_children != 2));
        }

        $menutype = 'type.' . self::getMenuType();

        // return true if menu type is in selection
        if (in_array($menutype, $this->selection))
        {
            return $this->_(true);
        }

        if ( ! $this->params->inc_children)
        {
            return $this->_(false);
        }

        $parent_ids = $this->getMenuParentIds($this->request->Itemid);
        $parent_ids = array_diff($parent_ids, [1]);

        foreach ($parent_ids as $id)
        {
            if ( ! in_array($id, $this->selection))
            {
                continue;
            }

            return $this->_(true);
        }

        return $this->_(false);
    }

    private function getMenuParentIds($id = 0)
    {
        return $this->getParentIds($id, 'menu');
    }

    private function getMenuType()
    {
        if (isset($this->request->menutype))
        {
            return $this->request->menutype;
        }

        if (empty($this->request->Itemid))
        {
            $this->request->menutype = '';

            return $this->request->menutype;
        }

        if (RL_Document::isClient('site'))
        {
            $menu = JFactory::getApplication()->getMenu()->getItem((int) $this->request->Itemid);

            $this->request->menutype = $menu->menutype ?? '';

            return $this->request->menutype;
        }

        $query = $this->db->getQuery(true)
            ->select('m.menutype')
            ->from('#__menu AS m')
            ->where('m.id = ' . (int) $this->request->Itemid);
        $this->db->setQuery($query);
        $this->request->menutype = $this->db->loadResult();

        return $this->request->menutype;
    }
}
