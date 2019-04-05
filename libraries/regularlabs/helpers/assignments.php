<?php
/**
 * @package         Regular Labs Library
 * @version         19.3.16030
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2019 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
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
	function passAll($assignments, $matching_method = 'all', $item = 0)
	{
		return RL_Conditions::pass($assignments, $matching_method, $item);
	}

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
}
