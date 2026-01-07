<?php

/**
 * @copyright
 * @package     Field - Kubik-Rubik Title
 * @author      Viktor Vogel <admin@kubik-rubik.de>
 * @version     Joomla! 3 - 3.5.5 - 2021-06-27
 * @link        https://kubik-rubik.de
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

use Joomla\CMS\{Form\FormField, Factory, Language\Text};

/**
 * Form Field class for Kubik-Rubik Joomla! Extensions.
 * Provides a custom title and description field.
 *
 * @since 3.0.0-FREE
 */
class JFormFieldKrTitle extends FormField
{
    /**
     * @var string $type
     * @since 3.0.0-FREE
     */
    protected $type = 'krTitle';

    /**
     * Returns the label with the title and description, and adds required CSS classes and instructions.
     *
     * @return string
     * @since 3.0.0-FREE
     */
    protected function getLabel(): string
    {
        // Use static variable to execute the CSS instruction only once
        static $executeOnce = false;

        if (empty($executeOnce)) {
            $document = Factory::getDocument();

            // Set label instruction only for option tabs
            $fieldsets = $this->form->getFieldsets();

            foreach ($fieldsets as $fieldset) {
                $scriptDeclaration = 'jQuery(function($){$("div#attrib-' . $fieldset->name . ' .control-label:has(.clr)").addClass("krtitle");});';

                if (empty($this->group)) {
                    $scriptDeclaration = 'jQuery(function($){$("div#' . $fieldset->name . ' .control-label:has(.clr)").addClass("krtitle");});';
                }

                $document->addScriptDeclaration($scriptDeclaration);
                $document->addStyleDeclaration('div#attrib-' . $fieldset->name . ' .control-label.krtitle, div#' . $fieldset->name . ' .control-label.krtitle {width: 100%;} div#attrib-' . $fieldset->name . ' .control-label, div#' . $fieldset->name . ' .control-label {width: 20em;} div#attrib-' . $fieldset->name . ' label, div#' . $fieldset->name . ' label {width: 20em;}');
            }

            $document->addScriptDeclaration('jQuery(function($){$(".control-group:has(.krtitle-hidden)").remove();});');
            $document->addStyleDeclaration('div.krtitle-title {padding: 5px 5px 5px 0; font-size: 16px; font-weight: bold;} div.krtitle-title.sub {font-size: 14px;} div.krtitle-description {padding: 5px 5px 5px 0; font-size: 14px;}');

            $executeOnce = true;
        }

        $filterDonationCode = (string)$this->element['filter'];

        if ($filterDonationCode === 'donation') {
            $fieldValueSession = Factory::getSession()->get('field_value', '', 'krdonationcodecheck');

            if ($fieldValueSession === 1) {
                return '<div class="krtitle-hidden"></div>';
            }
        }

        $label = '<div class="clr"></div>';

        if ($this->element['label']) {
            $classSub = '';

            if (isset($this->element['titleType'])) {
                $classSub = (string)$this->element['titleType'];
            }

            $label .= '<div class="krtitle-title ' . $classSub . '">' . Text::_((string)$this->element['label']) . '</div>';
        } else {
            $label .= parent::getLabel();
        }

        if ($this->element['description']) {
            $label .= '<div class="krtitle-description">' . Text::_((string)$this->element['description']) . '</div>';
        }

        return $label;
    }

    /**
     * Don't use an input field.
     *
     * @return string
     * @since 3.0.0-FREE
     */
    protected function getInput(): string
    {
        return '';
    }
}
