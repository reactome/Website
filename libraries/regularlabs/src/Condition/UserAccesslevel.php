<?php
/**
 * @package         Regular Labs Library
<<<<<<< HEAD
 * @version         22.6.8549
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2022 Regular Labs All Rights Reserved
=======
 * @version         21.7.10061
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2021 Regular Labs All Rights Reserved
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Library\Condition;

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use RegularLabs\Library\DB as RL_DB;

/**
 * Class UserAccesslevel
 * @package RegularLabs\Library\Condition
 */
class UserAccesslevel extends User
{
	public function pass()
	{
		$user = JFactory::getApplication()->getIdentity() ?: JFactory::getUser();

		$levels = $user->getAuthorisedViewLevels();

		$this->selection = $this->convertAccessLevelNamesToIds($this->selection);

		return $this->passSimple($levels);
	}

	private function convertAccessLevelNamesToIds($selection)
	{
		$names = [];

		foreach ($selection as $i => $level)
		{
			if (is_numeric($level))
			{
				continue;
			}

			unset($selection[$i]);

			$names[] = strtolower(str_replace(' ', '', $level));
		}

		if (empty($names))
		{
			return $selection;
		}

		$db = JFactory::getDbo();

		$query = $db->getQuery(true)
			->select($db->quoteName('id'))
			->from('#__viewlevels')
			->where('LOWER(REPLACE(' . $db->quoteName('title') . ', " ", ""))'
				. RL_DB::in($names));
		$db->setQuery($query);

		$level_ids = $db->loadColumn();

		return array_unique(array_merge($selection, $level_ids));
	}
}
