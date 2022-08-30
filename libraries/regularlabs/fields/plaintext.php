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

use RegularLabs\Library\Field;

defined('_JEXEC') or die;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

<<<<<<< HEAD
class JFormFieldRL_PlainText extends Field
=======
class JFormFieldRL_PlainText extends \RegularLabs\Library\Field
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
{
	public $type = 'PlainText';

	protected function getInput()
	{
<<<<<<< HEAD
		$text = $this->prepareText($this->value);

		if ( ! $text)
		{
			return '';
		}

		return '<fieldset class="rl_plaintext">' . $text . '</fieldset>';
	}

	protected function getLabel()
	{
=======
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
		$label   = $this->prepareText($this->get('label'));
		$tooltip = $this->prepareText($this->get('description'));

		if ( ! $label && ! $tooltip)
		{
			return '';
		}

		if ( ! $label)
		{
			return '<div>' . $tooltip . '</div>';
		}

		if ( ! $tooltip)
		{
			return '<div>' . $label . '</div>';
		}

		return '<label class="hasPopover" title="' . $label . '" data-content="' . htmlentities($tooltip) . '">'
			. $label . '</label>';
	}
<<<<<<< HEAD
=======

	protected function getInput()
	{
		$text = $this->prepareText($this->value);

		if ( ! $text)
		{
			return '';
		}

		return '<fieldset class="rl_plaintext">' . $text . '</fieldset>';
	}
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
}
