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

class JFormFieldRL_Note extends Field
{
	public $type = 'Note';

	public function setup(SimpleXMLElement $element, $value, $group = null)
	{
		$this->element = $element;

		$element['label']                = $this->prepareText($element['label']);
		$element['description']          = $this->prepareText($element['description']);
		$element['translateDescription'] = false;

		return parent::setup($element, $value, $group);
	}

	protected function getInput()
	{
		return '';
	}

	protected function getLabel()
	{
		if (empty($this->element['label']) && empty($this->element['description']))
		{
			return '';
		}

		$title       = $this->element['label'] ? (string) $this->element['label'] : ($this->element['title'] ? (string) $this->element['title'] : '');
		$heading     = $this->element['heading'] ? (string) $this->element['heading'] : 'h4';
		$description = (string) $this->element['description'];
		$class       = $this->class ?? '';
		$close       = (string) $this->element['close'];
		$controls    = (int) $this->element['controls'];
<<<<<<< HEAD

		$class = ! empty($class) ? ' class="' . $class . '"' : '';

=======

		$class = ! empty($class) ? ' class="' . $class . '"' : '';

>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
		$button      = '';
		$title       = JText::_($title ?? '');
		$description = JText::_($description ?? '');

		if ($close)
		{
			$close  = $close == 'true' ? 'alert' : $close;
			$button = '<button type="button" class="close" data-dismiss="' . $close . '" aria-label="Close">&times;</button>';
		}

		if ($heading && $title)
		{
			$title = '<' . $heading . '>'
				. $title
				. '</' . $heading . '>';
		}

		if ($controls)
		{
			$title = '<div class="control-label"><label>'
				. $title
				. '</label></div>';
<<<<<<< HEAD

			$description = '<div class="controls">'
				. $description
				. '</div>';
		}
=======

			$description = '<div class="controls">'
				. $description
				. '</div>';
		}

		return '</div><div ' . $class . '>'
			. $button
			. $title
			. $description;
	}
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090

		return '</div><div ' . $class . '>'
			. $button
			. $title
			. $description;
	}
}
