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
use RegularLabs\Library\StringHelper as RL_String;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

<<<<<<< HEAD
class JFormFieldRL_CustomFieldKey extends Field
=======
class JFormFieldRL_CustomFieldKey extends \RegularLabs\Library\Field
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
{
	public $type = 'CustomFieldKey';

	protected function getInput()
	{
<<<<<<< HEAD
		return '<div style="display:none;"><div><div>';
	}

	protected function getLabel()
	{
=======
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
		$label       = $this->get('label') ?: '';
		$size        = $this->get('size') ? 'style="width:' . $this->get('size') . 'px"' : '';
		$class       = 'class="' . ($this->get('class') ?: 'text_area') . '"';
		$this->value = htmlspecialchars(RL_String::html_entity_decoder($this->value), ENT_QUOTES);

		return
			'<label for="' . $this->id . '" style="margin-top: -5px;">'
			. '<input type="text" name="' . $this->name . '" id="' . $this->id . '" value="' . $this->value
			. '" placeholder="' . JText::_($label) . '" title="' . JText::_($label) . '" ' . $class . ' ' . $size . '>'
			. '</label>';
	}
}
