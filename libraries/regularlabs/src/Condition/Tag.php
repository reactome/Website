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

use RegularLabs\Library\Condition;

defined('_JEXEC') or die;

/**
 * Class Tag
 * @package RegularLabs\Library\Condition
 */
class Tag extends Condition
{
	public function pass()
	{
		if ( ! $this->request->id)
		{
			return $this->_(false);
		}

		if (in_array($this->request->option, ['com_content', 'com_flexicontent']))
		{
			return $this->passTagsContent();
		}

		if ($this->request->option != 'com_tags'
			|| $this->request->view != 'tag'
		)
		{
			return $this->_(false);
		}

		return $this->passTag($this->request->id);
	}

<<<<<<< HEAD
	private function passTagsContent()
	{
		$is_item     = in_array($this->request->view, ['', 'article', 'item']);
		$is_category = in_array($this->request->view, ['category']);

		switch (true)
		{
			case ($is_item):
				$prefix = 'com_content.article';
				break;

			case ($is_category):
				$prefix = 'com_content.category';
				break;

			default:
				return $this->_(false);
		}

		// Load the tags.
		$query = $this->db->getQuery(true)
			->select($this->db->quoteName('t.id'))
			->select($this->db->quoteName('t.title'))
			->from('#__tags AS t')
			->join(
				'INNER', '#__contentitem_tag_map AS m'
				. ' ON m.tag_id = t.id'
				. ' AND m.type_alias = ' . $this->db->quote($prefix)
				. ' AND m.content_item_id = ' . (int) $this->request->id
			);
		$this->db->setQuery($query);
		$tags = $this->db->loadObjectList();

		if (empty($tags))
		{
			return $this->_(false);
		}

		return $this->_($this->passTagList($tags));
=======
	private function getTagsParentIds($id = 0)
	{
		$parentids = $this->getParentIds($id, 'tags');
		// Remove the root tag
		$parentids = array_diff($parentids, [1]);

		return $parentids;
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	}

	private function passTag($tag)
	{
		$pass = in_array($tag, $this->selection);

		if ($pass)
		{
			// If passed, return false if assigned to only children
			// Else return true
			return ($this->params->inc_children != 2);
		}

		if ( ! $this->params->inc_children)
		{
			return false;
		}

		// Return true if a parent id is present in the selection
		return array_intersect(
			$this->getTagsParentIds($tag),
			$this->selection
		);
	}

	private function passTagList($tags)
<<<<<<< HEAD
	{
		if ($this->params->match_all)
		{
			return $this->passTagListMatchAll($tags);
		}

		foreach ($tags as $tag)
		{
			if ( ! $this->passTag($tag->id) && ! $this->passTag($tag->title))
			{
				continue;
			}

			return true;
		}

		return false;
	}

	private function getTagsParentIds($id = 0)
=======
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	{
		if ($this->params->match_all)
		{
			return $this->passTagListMatchAll($tags);
		}

		foreach ($tags as $tag)
		{
			if ( ! $this->passTag($tag->id) && ! $this->passTag($tag->title))
			{
				continue;
			}

			return true;
		}

		return false;
	}

	private function passTagListMatchAll($tags)
	{
		foreach ($this->selection as $id)
		{
			if ( ! $this->passTagMatchAll($id, $tags))
			{
				return false;
			}
		}

		return true;
	}

	private function passTagMatchAll($id, $tags)
	{

		foreach ($tags as $tag)
		{
			if ($tag->id == $id || $tag->title == $id)
			{
				return true;
			}
		}

		return false;
	}

	private function passTagsContent()
	{
		$is_item     = in_array($this->request->view, ['', 'article', 'item']);
		$is_category = in_array($this->request->view, ['category']);

		switch (true)
		{
			case ($is_item):
				$prefix = 'com_content.article';
				break;

			case ($is_category):
				$prefix = 'com_content.category';
				break;

			default:
				return $this->_(false);
		}

		// Load the tags.
		$query = $this->db->getQuery(true)
			->select($this->db->quoteName('t.id'))
			->select($this->db->quoteName('t.title'))
			->from('#__tags AS t')
			->join(
				'INNER', '#__contentitem_tag_map AS m'
				. ' ON m.tag_id = t.id'
				. ' AND m.type_alias = ' . $this->db->quote($prefix)
				. ' AND m.content_item_id = ' . (int) $this->request->id
			);
		$this->db->setQuery($query);
		$tags = $this->db->loadObjectList();

		if (empty($tags))
		{
			return $this->_(false);
		}

		return $this->_($this->passTagList($tags));
	}
}
