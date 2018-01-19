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

class JFormFieldJUMessage extends JFormField {
		
	public $type = 'JUMessage';

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
		$html 			= '';
		$description	= trim($this->element['description']);
		$onclick 		= $this->element['onclick'] ? ' onclick="'.str_replace('"','\"',$this->element['onclick']).'"' : '';
		$onmouseover 	= $this->element['onmouseover'] ? ' onmouseover="'.str_replace('"','\"',$this->element['onmouseover']).'"' : '';
		$onmouseout 	= $this->element['onmouseout'] ? ' onmouseout="'.str_replace('"','\"',$this->element['onmouseout']).'"' : '';

		$html .= '<div class="jumessage '.$this->element['class'].'" id="'.$this->id.'"'.$onclick.$onmouseover.$onmouseout.'>';
		$html .= JText::_($description);
		$html .= '</div>';

		return $html;
	}

}
?>