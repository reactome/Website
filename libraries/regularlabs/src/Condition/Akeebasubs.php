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

/**
 * Class Akeebasubs
 *
 * @package RegularLabs\Library\Condition
 */
abstract class Akeebasubs extends Condition
{
    var $agent  = null;
    var $device = null;

    public function initRequest(&$request)
    {
        if ($request->id || $request->view != 'level')
        {
            return;
        }

        $slug = JFactory::getApplication()->input->getString('slug', '');

        if ( ! $slug)
        {
            return;
        }

        $query = $this->db->getQuery(true)
            ->select('l.akeebasubs_level_id')
            ->from('#__akeebasubs_levels AS l')
            ->where('l.slug = ' . $this->db->quote($slug));
        $this->db->setQuery($query);
        $request->id = $this->db->loadResult();
    }
}
