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
 * Class UserGrouplevel
 * @package RegularLabs\Library\Condition
 */
class UserGrouplevel extends User
{
	static $user_group_children;

	public function pass()
	{
		$user = JFactory::getApplication()->getIdentity() ?: JFactory::getUser();

		if ( ! empty($user->groups))
		{
			$groups = array_values($user->groups);
		}
		else
		{
			$groups = $user->getAuthorisedGroups();
		}

		if ( ! $this->params->match_all && $this->params->inc_children)
		{
			$this->setUserGroupChildrenIds();
		}

		$this->selection = $this->convertUsergroupNamesToIds($this->selection);

		if ($this->params->match_all)
		{
			return $this->passMatchAll($groups);
		}

		return $this->passSimple($groups);
	}

<<<<<<< HEAD
	private function setUserGroupChildrenIds()
	{
		$children = $this->getUserGroupChildrenIds($this->selection);

		if ($this->params->inc_children == 2)
		{
			$this->selection = $children;

			return;
		}

		$this->selection = array_merge($this->selection, $children);
	}

=======
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	private function convertUsergroupNamesToIds($selection)
	{
		$names = [];

		foreach ($selection as $i => $group)
		{
			if (is_numeric($group))
			{
				continue;
			}

			unset($selection[$i]);

			$names[] = strtolower(str_replace(' ', '', $group));
		}

		if (empty($names))
		{
			return $selection;
		}

		$db = JFactory::getDbo();

		$query = $db->getQuery(true)
			->select($db->quoteName('id'))
			->from('#__usergroups')
			->where('LOWER(REPLACE(' . $db->quoteName('title') . ', " ", ""))'
				. RL_DB::in($names));
		$db->setQuery($query);

		$group_ids = $db->loadColumn();

		return array_unique(array_merge($selection, $group_ids));
	}

<<<<<<< HEAD
	private function passMatchAll($groups)
	{
		$pass = ! array_diff($this->selection, $groups) && ! array_diff($groups, $this->selection);

		return $this->_($pass);
	}

=======
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	private function getUserGroupChildrenIds($groups)
	{
		$children = [];

		foreach ($groups as $group)
		{
			$group_children = $this->getUserGroupChildrenIdsByGroup($group);

			if (empty($group_children))
			{
				continue;
			}

			$children = array_merge($children, $group_children);

			$group_grand_children = $this->getUserGroupChildrenIds($group_children);

			if (empty($group_grand_children))
			{
				continue;
			}

			$children = array_merge($children, $group_grand_children);
		}

		$children = array_unique($children);

		return $children;
	}

<<<<<<< HEAD
	private function getUserGroupChildrenIdsByGroup($group)
	{
		$group = (int) $group;

		if ( ! is_null(self::$user_group_children))
		{
			return self::$user_group_children[$group] ?? [];
		}

		$db = JFactory::getDbo();

		$query = $db->getQuery(true)
			->select(['id', 'parent_id'])
			->from($db->quoteName('#__usergroups'));
		$db->setQuery($query);

		$groups = $db->loadAssocList('id', 'parent_id');

		foreach ($groups as $id => $parent)
		{
			if ( ! isset(self::$user_group_children[$parent]))
			{
				self::$user_group_children[$parent] = [];
			}

			self::$user_group_children[$parent][] = $id;
		}

		return self::$user_group_children[$group] ?? [];
=======
	private function passMatchAll($groups)
	{
		$pass = ! array_diff($this->selection, $groups) && ! array_diff($groups, $this->selection);

		return $this->_($pass);
	}

	private function setUserGroupChildrenIds()
	{
		$children = $this->getUserGroupChildrenIds($this->selection);

		if ($this->params->inc_children == 2)
		{
			$this->selection = $children;

			return;
		}

		$this->selection = array_merge($this->selection, $children);
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	}
}
