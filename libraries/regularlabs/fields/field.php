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

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\HTML\HTMLHelper as JHtml;
use Joomla\CMS\Language\Text as JText;
<<<<<<< HEAD
use RegularLabs\Library\Field;
=======
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

<<<<<<< HEAD
class JFormFieldRL_Field extends Field
{
	public $type = 'Field';

	protected function getInput()
	{
		$options = $this->getFields();

		return $this->selectListSimple($options, $this->name, $this->value, $this->id);
	}

=======
class JFormFieldRL_Field extends \RegularLabs\Library\Field
{
	public $type = 'Field';

>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	public function getFields()
	{
		$db    = JFactory::getDbo();
		$query = $db->getQuery(true)
			->select('DISTINCT a.id, a.name, a.type, a.title')
			->from('#__fields AS a')
			->where('a.state = 1')
			->order('a.name');

		$db->setQuery($query);

		$fields = $db->loadObjectList();

		$options = [];

		$options[] = JHtml::_('select.option', '', '- ' . JText::_('RL_SELECT_FIELD') . ' -');

		foreach ($fields as &$field)
		{
			// Skip our own subfields type. We won't have subfields in subfields.
			if ($field->type == 'subfields' || $field->type == 'repeatable')
			{
				continue;
			}

			$options[] = JHtml::_('select.option', $field->name, ($field->title . ' (' . $field->type . ')'));
		}

		if ($this->get('show_custom'))
		{
			$options[] = JHtml::_('select.option', 'custom', '- ' . JText::_('RL_CUSTOM') . ' -');
		}

		return $options;
	}
<<<<<<< HEAD
=======

	protected function getInput()
	{
		$options = $this->getFields();

		return $this->selectListSimple($options, $this->name, $this->value, $this->id);
	}
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
}
