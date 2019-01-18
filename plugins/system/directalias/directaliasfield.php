<?php
/**
 * @package        Direct Alias
 * @copyright      Copyright (C) 2009-2017 AlterBrains.com. All rights reserved.
 * @license        http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;

defined('_JEXEC') or die('Restricted access');

/**
 * @since 1.0
 */
class JFormFieldDirectaliasfield extends JFormFieldText
{
	/**
	 * @var string
	 * @since 1.0
	 */
	public $type = 'Directaliasfield';

	/**
	 * @inheritdoc
	 * @since 1.0
	 */
	protected function getInput()
	{
		$html = [];

		$direct = $this->form->getValue('direct_alias', 'params', false);
		$absent = $this->form->getValue('absent_alias', 'params', false);

		if (version_compare(JVERSION, '4.0', 'l'))
		{
			/** @noinspection PhpDeprecationInspection */
			Factory::getDocument()->addScriptDeclaration('
				function toggleDirectAlias(button) {
					var direct = document.getElementById("jform_params_direct_alias");
					direct.value = 1 - direct.value;
					button.value = (direct.value > 0) ? "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT') . '" : "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_RELATIVE') . '";
				}
				function toggleAbsentAlias(button) {
					var absent = document.getElementById("jform_params_absent_alias");
					absent.value = 1 - absent.value;
					button.value = (absent.value > 0) ? "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT') . '" : "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_PRESENT') . '";
				}
			');

			$html[] = '<div class="input-append">';
			$html[] = parent::getInput();
			$html[] = '<input type="button" onclick="toggleDirectAlias(this)" value="' . Text::_($direct ? 'PLG_SYSTEM_DIRECT_ALIAS_DIRECT' : 'PLG_SYSTEM_DIRECT_ALIAS_RELATIVE') . '" class="btn hasTooltip" title="<b>' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT_TIP_TITLE') . '</b><br/><br/>' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT_TIP_DESC') . '" style="cursor:pointer" data-placement="bottom" />';
			$html[] = '<input type="button" onclick="toggleAbsentAlias(this)" value="' . Text::_($absent ? 'PLG_SYSTEM_DIRECT_ALIAS_ABSENT' : 'PLG_SYSTEM_DIRECT_ALIAS_PRESENT') . '" class="btn hasTooltip" title="<b>' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT_TIP_TITLE') . '</b><br/><br/>' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT_TIP_DESC') . '" style="cursor:pointer" data-placement="bottom" />';
			$html[] = '</div>';
		}
		else
		{
			/** @noinspection PhpUnhandledExceptionInspection */
			/** @noinspection PhpUndefinedMethodInspection */
			Factory::getApplication()->getDocument()->addScriptDeclaration('
				function toggleDirectAlias(button) {
					var direct = document.getElementById("jform_params_direct_alias");
					direct.value = 1 - direct.value;
					button.innerHTML = (direct.value > 0) ? "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT') . '" : "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_RELATIVE') . '";
				}
				function toggleAbsentAlias(button) {
					var absent = document.getElementById("jform_params_absent_alias");
					absent.value = 1 - absent.value;
					button.innerHTML = (absent.value > 0) ? "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT') . '" : "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_PRESENT') . '";
				}
			');

			$html[] = '<div class="input-group">';
			$html[] = parent::getInput();
			$html[] = '<div class="input-group-append">';
			$html[] = '<button type="button" onclick="toggleDirectAlias(this)" class="btn btn-outline-secondary hasTooltip" title="<b>' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT_TIP_TITLE') . '</b><br/><br/>' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT_TIP_DESC') . '" style="cursor:pointer" data-placement="bottom">' . Text::_($direct ? 'PLG_SYSTEM_DIRECT_ALIAS_DIRECT' : 'PLG_SYSTEM_DIRECT_ALIAS_RELATIVE') . '</button>';
			$html[] = '<button type="button" onclick="toggleAbsentAlias(this)" class="btn btn-outline-secondary hasTooltip" title="<b>' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT_TIP_TITLE') . '</b><br/><br/>' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT_TIP_DESC') . '" style="cursor:pointer" data-placement="bottom">' . Text::_($absent ? 'PLG_SYSTEM_DIRECT_ALIAS_ABSENT' : 'PLG_SYSTEM_DIRECT_ALIAS_PRESENT') . '</button>';
			$html[] = '</div>';
			$html[] = '</div>';
		}

		return implode("\n", $html);
	}
}
