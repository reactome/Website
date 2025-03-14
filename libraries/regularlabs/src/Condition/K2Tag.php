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
 * Class K2Tag
 *
 * @package RegularLabs\Library\Condition
 */
class K2Tag extends K2
{
    public function pass()
    {
        if ($this->request->option != 'com_k2')
        {
            return $this->_(false);
        }

        $tag  = trim(JFactory::getApplication()->input->getString('tag', ''));
        $pass = (
            ($this->params->inc_tags && $tag != '')
            || ($this->params->inc_items && $this->request->view == 'item')
        );

        if ( ! $pass)
        {
            return $this->_(false);
        }

        if ($this->params->inc_tags && $tag != '')
        {
            $tags = [trim(JFactory::getApplication()->input->getString('tag', ''))];

            return $this->passSimple($tags, true);
        }

        $query = $this->db->getQuery(true)
            ->select('t.name')
            ->from('#__k2_tags_xref AS x')
            ->join('LEFT', '#__k2_tags AS t ON t.id = x.tagID')
            ->where('x.itemID = ' . (int) $this->request->id)
            ->where('t.published = 1');
        $this->db->setQuery($query);
        $tags = $this->db->loadColumn();

        return $this->passSimple($tags, true);
    }
}
