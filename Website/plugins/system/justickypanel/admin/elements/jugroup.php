<?php
/**
 * ------------------------------------------------------------------------
 * JU Backend Toolkit for Joomla 2.5/3.x
 * ------------------------------------------------------------------------
 * Copyright (C) 2010-2013 JoomUltra. All Rights Reserved.
 * @license - GNU/GPL, http://www.gnu.org/licenses/gpl.html
 * Author: JoomUltra Co., Ltd
 * Websites: http://www.joomultra.com
 * ------------------------------------------------------------------------
 */

// no direct access
defined('_JEXEC') or die ;

jimport('joomla.form.formfield');

class JFormFieldJUGroup extends JFormField {
		
	public $type = 'JUGroup';

	/**
	 * Method to get the field options.
	 *
	 * @return	array	The field option objects.
	 * @since	1.6
	 */
	protected function getLabel() {
		return '';
	}

	/**
	 * Method to get the field input markup.
	 *
	 * @return	string	The field input markup.
	 * @since	1.6
	 */
	protected function getInput() {
		$html = '';
		$groupfields = trim($this->element['groupfields']);
		
		$document = JFactory::getDocument();
		
		$html .= '<h4 id="'.$this->id.'" class="jugroup '.$this->element['class'].'" data-groupfields="'.trim($groupfields).'">';
		$html .= '<span>'.JText::_($this->element['title']).'</span>';
		$html .= '<a title="'.JText::_('CLICK_HERE_TO_EXPAND_OR_COLLAPSE').'" class="toggle-btn">'.JText::_('Open').'</a>';
		$html .= '</h4>';

		return $html;
	}

}
?>