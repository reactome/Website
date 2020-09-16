<?php
/**
 * @package        Direct Alias
 * @copyright      Copyright (C) 2009-2020 AlterBrains.com. All rights reserved.
 * @license        http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;

defined('_JEXEC') or die('Restricted access');

/**
 * @since        1.0
 * @noinspection UnknownInspectionInspection
 * @noinspection PhpUnused
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

		HTMLHelper::_('bootstrap.popover');

		if (version_compare(JVERSION, '4.0', 'l'))
		{
			/** @noinspection PhpDeprecationInspection */
			Factory::getDocument()->addScriptDeclaration('
				function toggleDirectAlias(button) {
					var input = document.getElementById("jform_params_direct_alias");
					input.value = 1 - input.value;
					button.value = (input.value > 0) ? "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT') . '" : "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_RELATIVE') . '";
					jQuery(button).toggleClass("btn-success", input.value > 0);
				}
				function toggleAbsentAlias(button) {
					var input = document.getElementById("jform_params_absent_alias");
					input.value = 1 - input.value;
					button.value = (input.value > 0) ? "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT') . '" : "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_PRESENT') . '";
					jQuery(button).toggleClass("btn-success", input.value > 0);
				}
			');

			$html[] = '<div class="input-append">';
			$html[] = parent::getInput();
			$html[] = '<input type="button" onclick="toggleDirectAlias(this)" value="' . Text::_($direct ? 'PLG_SYSTEM_DIRECT_ALIAS_DIRECT' : 'PLG_SYSTEM_DIRECT_ALIAS_RELATIVE') . '" class="btn ' . ($direct ? 'btn-success ' : '') . 'hasPopover" title="<b>' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT_TIP_TITLE') . '" data-content="' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT_TIP_DESC') . '" style="cursor:pointer" data-placement="bottom" />';
			$html[] = '<input type="button" onclick="toggleAbsentAlias(this)" value="' . Text::_($absent ? 'PLG_SYSTEM_DIRECT_ALIAS_ABSENT' : 'PLG_SYSTEM_DIRECT_ALIAS_PRESENT') . '" class="btn ' . ($absent ? 'btn-success ' : '') . 'hasPopover" title="<b>' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT_TIP_TITLE') . '" data-content="' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT_TIP_DESC') . '" style="cursor:pointer" data-placement="bottom" />';
			$html[] = '</div>';
		}
		else
		{
			/** @noinspection PhpUnhandledExceptionInspection */
			/** @noinspection PhpPossiblePolymorphicInvocationInspection */
			Factory::getApplication()->getDocument()->addScriptDeclaration('
				function toggleDirectAlias(button) {
					var input = document.getElementById("jform_params_direct_alias");
					input.value = 1 - input.value;
					button.innerHTML = (input.value > 0) ? "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT') . '" : "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_RELATIVE') . '";
					jQuery(button).toggleClass("btn-success", input.value > 0);
					jQuery(button).toggleClass("btn-outline-secondary", input.value < 1);
				}
				function toggleAbsentAlias(button) {
					var input = document.getElementById("jform_params_absent_alias");
					input.value = 1 - input.value;
					button.innerHTML = (input.value > 0) ? "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT') . '" : "' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_PRESENT') . '";
					jQuery(button).toggleClass("btn-success", input.value > 0);
					jQuery(button).toggleClass("btn-outline-secondary", input.value < 1);
				}
			');

			$html[] = '<div class="input-group">';
			$html[] = parent::getInput();
			$html[] = '<div class="input-group-append">';
			$html[] = '<button type="button" onclick="toggleDirectAlias(this)" class="btn ' . ($direct ? 'btn-success' : 'btn-outline-secondary') . ' hasPopover" title="<b>' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT_TIP_TITLE') . '" data-content="' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_DIRECT_TIP_DESC') . '" style="cursor:pointer" data-placement="bottom">' . Text::_($direct ? 'PLG_SYSTEM_DIRECT_ALIAS_DIRECT' : 'PLG_SYSTEM_DIRECT_ALIAS_RELATIVE') . '</button>';
			$html[] = '<button type="button" onclick="toggleAbsentAlias(this)" class="btn ' . ($absent ? 'btn-success' : 'btn-outline-secondary') . ' hasPopover" title="<b>' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT_TIP_TITLE') . '" data-content="' . Text::_('PLG_SYSTEM_DIRECT_ALIAS_ABSENT_TIP_DESC') . '" style="cursor:pointer" data-placement="bottom">' . Text::_($absent ? 'PLG_SYSTEM_DIRECT_ALIAS_ABSENT' : 'PLG_SYSTEM_DIRECT_ALIAS_PRESENT') . '</button>';
			$html[] = '</div>';
			$html[] = '</div>';
		}

		return implode("\n", $html);
	}
}
