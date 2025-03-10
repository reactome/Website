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

use RegularLabs\Library\Conditions as RL_Conditions;

if (is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
    require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';
}

class RLAssignmentsHelper
{
    public function getAssignmentsFromParams(&$params)
    {
        return RL_Conditions::getConditionsFromParams($params);
    }

    public function getAssignmentsFromTagAttributes(&$params, $types = [])
    {
        return RL_Conditions::getConditionsFromTagAttributes($params, $types);
    }

    public function hasAssignments(&$assignments)
    {
        return RL_Conditions::hasConditions($assignments);
    }

    public function passAll($assignments, $matching_method = 'all', $item = 0)
    {
        return RL_Conditions::pass($assignments, $matching_method, $item);
    }
}
