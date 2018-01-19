<?php
/**
* @package		Direct Alias
* @copyright	Copyright (C) 2009-2013 AlterBrains.com. All rights reserved.
* @license		http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
*/

defined('_JEXEC') or die('Restricted access'); 

class JFormFieldDirectaliasfield extends JFormFieldText
{
	public $type = 'Directaliasfield';

	protected function getInput()
	{
		$html 	= array();
		
		$direct 	= $this->form->getValue('direct_alias', 'params', false);
		$absent 	= $this->form->getValue('absent_alias', 'params', false);

		JFactory::getDocument()->addScriptDeclaration('
			function toggleDirectAlias(button) {
				var direct = document.getElementById("jform_params_direct_alias");
				direct.value = 1 - direct.value;
				button.value = (direct.value > 0) ? "'.JText::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT').'" : "'.JText::_('PLG_SYSTEM_DIRECT_ALIAS_RELATIVE').'";
			}
			function toggleAbsentAlias(button) {
				var absent = document.getElementById("jform_params_absent_alias");
				absent.value = 1 - absent.value;
				button.value = (absent.value > 0) ? "'.JText::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT').'" : "'.JText::_('PLG_SYSTEM_DIRECT_ALIAS_PRESENT').'";
			}
		');
		
		if (version_compare(JVERSION, '3.2', 'ge')) {
			$html[] = '<div class="input-append">';
			$html[] = parent::getInput();
			$html[] = '<input type="button" onclick="toggleDirectAlias(this)" value="' . JText::_($direct ? 'PLG_SYSTEM_DIRECT_ALIAS_DIRECT' : 'PLG_SYSTEM_DIRECT_ALIAS_RELATIVE') . '" class="btn hasTooltip" title="<b>' . JText::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT_TIP_TITLE') . '</b><br/><br/>' . JText::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT_TIP_DESC') . '" style="cursor:pointer" data-placement="bottom" />';
			$html[] = '<input type="button" onclick="toggleAbsentAlias(this)" value="' . JText::_($absent ? 'PLG_SYSTEM_DIRECT_ALIAS_ABSENT' : 'PLG_SYSTEM_DIRECT_ALIAS_PRESENT') . '" class="btn hasTooltip" title="<b>' . JText::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT_TIP_TITLE') . '</b><br/><br/>' . JText::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT_TIP_DESC') . '" style="cursor:pointer" data-placement="bottom" />';
			$html[] = '</div>';
		}
		else {
			$html[] = parent::getInput();
			$html[] = '<input type="button" onclick="toggleDirectAlias(this)" value="' . JText::_($direct ? 'PLG_SYSTEM_DIRECT_ALIAS_DIRECT' : 'PLG_SYSTEM_DIRECT_ALIAS_RELATIVE') . '" class="button hasTip" title="' . JText::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT_TIP_TITLE') . '::' . JText::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT_TIP_DESC') . '" style="cursor:pointer" />';
			$html[] = '<input type="button" onclick="toggleAbsentAlias(this)" value="' . JText::_($absent ? 'PLG_SYSTEM_DIRECT_ALIAS_ABSENT' : 'PLG_SYSTEM_DIRECT_ALIAS_PRESENT') . '" class="button hasTip" title="' . JText::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT_TIP_TITLE') . '::' . JText::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT_TIP_DESC') . '" style="cursor:pointer" />';
		}

		return implode("\n", $html);
	}
}
