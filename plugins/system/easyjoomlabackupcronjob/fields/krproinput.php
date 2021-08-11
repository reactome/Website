<?php

/**
 * @copyright
 * @package     Field - Kubik-Rubik Pro Input
 * @author      Viktor Vogel <admin@kubik-rubik.de>
 * @version     Joomla! 3 - 3.1.1 - 2020-12-04
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

use Joomla\CMS\{Form\FormField, Language\Text};

/**
 * Form Field class for Kubik-Rubik Joomla! Extensions.
 */
class JFormFieldKrProInput extends FormField
{
    protected $type = 'krProInput';

    protected function getInput()
    {
        $placeholder = 'PRO FEATURE';

        if (!empty($this->default)) {
            $placeholder .= ' (' . Text::_($this->default) . ')';
        }

        return '<input type="text" name="' . $this->name . '" id="' . $this->id . '" value="" size="40" placeholder="' . $placeholder . '" disabled="disabled" style="color: #A50F0F; background-color: #FFF; display: inline-block;opacity: 0.9 !important;"/>';
    }
}
