<?php defined('JPATH_PLATFORM') or die();

/**
 * @author     Garda Informatica <info@gardainformatica.it>
 * @copyright  Copyright (C) 2014 Garda Informatica. All rights reserved.
 * @license    http://www.gnu.org/licenses/gpl-3.0.html  GNU General Public License version 3
 * @package    JSocialFeed Joomla Extension
 * @link       http://www.gardainformatica.it
 */

/*

This file is part of "JSocialFeed Joomla Extension".

"JSocialFeed Joomla Extension" is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

"JSocialFeed Joomla Extension" is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with "JSocialFeed Joomla Extension".  If not, see <http://www.gnu.org/licenses/>.

*/

jimport('joomla.html.html');
jimport('joomla.form.formfield');

class JFormFieldOSSHeader extends JFormField
{
	protected $type = 'OSSHeader';

	protected function getInput()
	{
		return '';
	}

	protected function getLabel()
	{
		$name = basename(realpath(dirname(__FILE__) . '/' . '..' . '/' . '..'));
		$direction = intval(JFactory::getLanguage()->get('rtl', 0));
		$left  = $direction ? "right" : "left";
		$right = $direction ? "left" : "right";
		$class = version_compare(JVERSION, '2.5', 'gt') ? '3x' : '25';

		echo '<div class="clr"></div>';
		$image = '';
		$icon	= (string)$this->element['icon'];
		if (!empty($icon))
		{
			$image .= '<img style="margin:0; float:' . $left . ';" src="' . JURI::base(true) . '/../media/' . $name . '/images/' . $icon . '">';
		}

		$helpurl	= (string)$this->element['helpurl'];
		if (!empty($helpurl))
		{
			$image .= '<a href="' . $helpurl . '" target="_blank"><img style="margin:0; float:' . $right . ';" src="' . JURI::base(true) . '/../media/jsocialfeed/images/question-button-16.png"></a>';
		}

		$style = 'background:#f4f4f4; color:#025a8d; border:1px solid silver; padding:5px; margin:5px 0;';
		if ($this->element['default'])
		{
			return '<div class="'.$class.'" style="' . $style . '">' .
			$image .
			'<span style="padding-' . $left . ':5px; font-weight:bold; line-height:16px;">' .
			JText::_($this->element['default']) .
			'</span>' .
			'</div>';
		}
		else
		{
			return parent::getLabel();
		}

		echo '<div class="clr"></div>';
	}
}

