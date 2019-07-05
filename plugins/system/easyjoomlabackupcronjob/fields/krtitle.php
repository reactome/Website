<?php
/**
 * @Copyright
 * @package     Field - Kubik-Rubik Title
 * @author      Viktor Vogel <admin@kubik-rubik.de>
 * @version     Joomla! 3 - 3.4.1 - 2019-06-03
 * @link        https://kubik-rubik.de/
 *
 * @license     GNU/GPL
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
defined('JPATH_PLATFORM') || die('Restricted access');

/**
 * Form Field class for Kubik-Rubik Joomla! Extensions.
 * Provides a custom title and description field.
 */
class JFormFieldKRTitle extends JFormField
{
    protected $type = 'krtitle';

    protected function getInput()
    {
        return '';
    }

    protected function getLabel()
    {
        // Use static variable to execute the CSS instruction only once
        static $executeOnce = false;

        if (empty($executeOnce)) {
            $document = JFactory::getDocument();

            // Set label instruction only for option tabs
            $fieldsets = $this->form->getFieldsets();

            foreach ($fieldsets as $fieldset) {
                $scriptDeclaration = 'jQuery(function($){$("div#attrib-' . $fieldset->name . ' .control-label:has(.clr)").addClass("krtitle");});';

                if (empty($this->group)) {
                    $scriptDeclaration = 'jQuery(function($){$("div#' . $fieldset->name . ' .control-label:has(.clr)").addClass("krtitle");});';
                }

                $document->addScriptDeclaration($scriptDeclaration);
                $document->addStyleDeclaration('div#attrib-' . $fieldset->name . ' .control-label.krtitle, div#' . $fieldset->name . ' .control-label.krtitle {width: 100%;}');
                $document->addStyleDeclaration('div#attrib-' . $fieldset->name . ' .control-label, div#' . $fieldset->name . ' .control-label {width: 20em;}');

                // Legacy
                $document->addStyleDeclaration('div#attrib-' . $fieldset->name . ' label, div#' . $fieldset->name . ' label {width: 20em;}');
            }

            $document->addScriptDeclaration('jQuery(function($){$(".control-group:has(.krtitle-hidden)").remove();});');
            $document->addStyleDeclaration('div.krtitle-title {padding: 5px 5px 5px 0; font-size: 16px; font-weight: bold;}');
            $document->addStyleDeclaration('div.krtitle-description {padding: 5px 5px 5px 0; font-size: 14px;}');

            $executeOnce = true;
        }

        $filterDonationCode = (string) $this->element['filter'];

        if ($filterDonationCode === 'donation') {
            $fieldValueSession = JFactory::getSession()->get('field_value', '', 'krdonationcodecheck');

            if ($fieldValueSession === 1) {
                return '<div class="krtitle-hidden"></div>';
            }
        }

        $label = '<div class="clr"></div>';

        if ($this->element['label']) {
            $label .= '<div class="krtitle-title">' . JText::_((string) $this->element['label']) . '</div>';
        } else {
            $label .= parent::getLabel();
        }

        if ($this->element['description']) {
            $label .= '<div class="krtitle-description">' . JText::_((string) $this->element['description']) . '</div>';
        }

        return $label;
    }
}
