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

use RegularLabs\Library\Extension as RL_Extension;
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
class JFormFieldRL_OnlyPro extends Field
{
	public $type = 'OnlyPro';

	protected function getInput()
	{
		$label   = $this->prepareText($this->get('label'));
		$tooltip = $this->prepareText($this->get('description'));

		if ( ! $label && ! $tooltip)
		{
			return '';
		}

		return $this->getText();
	}

	protected function getText()
	{
		$text = JText::_('RL_ONLY_AVAILABLE_IN_PRO');
		$text = '<em>' . $text . '</em>';

		$extension = $this->getExtensionName();

		$alias = RL_Extension::getAliasByName($extension);

		if ($alias)
		{
			$text = '<a href="https://regularlabs.com/' . $extension . '/features" target="_blank">'
				. $text
				. '</a>';
		}

		$class = $this->get('class');
		$class = $class ? ' class="' . $class . '"' : '';

		return '<div' . $class . '>' . $text . '</div>';
	}

	protected function getExtensionName()
	{
		$extension = $this->form->getValue('element');
		if ($extension)
=======
class JFormFieldRL_OnlyPro extends \RegularLabs\Library\Field
{
	public $type = 'OnlyPro';

	protected function getExtensionName()
	{
		if ($extension = $this->form->getValue('element'))
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
		{
			return $extension;
		}

<<<<<<< HEAD
		$extension = JFactory::getApplication()->input->get('component');
		if ($extension)
=======
		if ($extension = JFactory::getApplication()->input->get('component'))
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
		{
			return str_replace('com_', '', $extension);
		}

<<<<<<< HEAD
		$extension = JFactory::getApplication()->input->get('folder');
		if ($extension)
=======
		if ($extension = JFactory::getApplication()->input->get('folder'))
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
		{
			$extension = explode('.', $extension);

			return array_pop($extension);
		}

		return false;
	}

	protected function getLabel()
	{
		$label   = $this->prepareText($this->get('label'));
		$tooltip = $this->prepareText($this->get('description'));

		if ( ! $label && ! $tooltip)
		{
			return '</div><div>' . $this->getText();
		}

		if ( ! $label)
		{
			return $tooltip;
		}

		if ( ! $tooltip)
		{
			return ($label == '---' ? '' : $label);
		}

		return '<label class="hasPopover" title="' . $label . '" data-content="' . htmlentities($tooltip) . '">'
			. $label
			. '</label>';
	}
<<<<<<< HEAD
=======

	protected function getInput()
	{
		$label   = $this->prepareText($this->get('label'));
		$tooltip = $this->prepareText($this->get('description'));

		if ( ! $label && ! $tooltip)
		{
			return '';
		}

		return $this->getText();
	}

	protected function getText()
	{
		$text = JText::_('RL_ONLY_AVAILABLE_IN_PRO');
		$text = '<em>' . $text . '</em>';

		$extension = $this->getExtensionName();

		$alias = RL_Extension::getAliasByName($extension);

		if ($alias)
		{
			$text = '<a href="https://regularlabs.com/' . $extension . '/features" target="_blank">'
				. $text
				. '</a>';
		}

		$class = $this->get('class');
		$class = $class ? ' class="' . $class . '"' : '';

		return '<div' . $class . '>' . $text . '</div>';
	}
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
}
