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

/* @DEPRECATED */

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;

if (is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';
}

require_once dirname(__FILE__, 2) . '/assignment.php';

class RLAssignmentsUsers extends RLAssignment
{
	public function passAccessLevels()
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

		$db = JFactory::getDbo();

		$query = $db->getQuery(true)
			->select($db->quoteName('id'))
			->from('#__viewlevels')
			->where('LOWER(REPLACE(' . $db->quoteName('title') . ', " ", "")) IN (\'' . implode('\',\'', $names) . '\')');
		$db->setQuery($query);

		$level_ids = $db->loadColumn();

		return array_unique(array_merge($selection, $level_ids));
	}

	public function passUserGroupLevels()
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

		if ($this->params->inc_children)
		{
			$this->setUserGroupChildrenIds();
		}

		$this->selection = $this->convertUsergroupNamesToIds($this->selection);

		return $this->passSimple($groups);
	}

<<<<<<< HEAD
	private function setUserGroupChildrenIds()
=======
	public function passUsers()
	{
		$user = JFactory::getApplication()->getIdentity() ?: JFactory::getUser();

		return $this->passSimple($user->get('id'));
	}

	private function convertAccessLevelNamesToIds($selection)
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	{
		$children = $this->getUserGroupChildrenIds($this->selection);

		if ($this->params->inc_children == 2)
		{
			$this->selection = $children;

			return;
		}

		$this->selection = array_merge($this->selection, $children);
	}

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

		$db = JFactory::getDbo();

		$query = $db->getQuery(true)
			->select($db->quoteName('id'))
			->from('#__usergroups')
			->where('LOWER(REPLACE(' . $db->quoteName('title') . ', " ", "")) IN (\'' . implode('\',\'', $names) . '\')');
		$db->setQuery($query);

		$group_ids = $db->loadColumn();

		return array_unique(array_merge($selection, $group_ids));
	}

	private function getUserGroupChildrenIds($groups)
	{
		$children = [];

		$db = JFactory::getDbo();

		foreach ($groups as $group)
		{
			$query = $db->getQuery(true)
				->select($db->quoteName('id'))
				->from($db->quoteName('#__usergroups'))
				->where($db->quoteName('parent_id') . ' = ' . (int) $group);
			$db->setQuery($query);

			$group_children = $db->loadColumn();

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
	public function passUsers()
	{
		$user = JFactory::getApplication()->getIdentity() ?: JFactory::getUser();

		return $this->passSimple($user->get('id'));
=======
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
