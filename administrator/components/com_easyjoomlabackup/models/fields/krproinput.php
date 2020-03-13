<?php
/**
 * @Copyright
 * @package     Field - Kubik-Rubik Pro Input
 * @author      Viktor Vogel <admin@kubik-rubik.de>
 * @version     Joomla! 3 - 3.0.0 - 2020-01-03
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

use Joomla\CMS\Form\FormField;

/**
 * Form Field class for Kubik-Rubik Joomla! Extensions.
 */
class JFormFieldKRProInput extends FormField
{
    protected $type = 'krproinput';

    protected function getInput()
    {
        return '<span style="color: red; padding-top: 5px; display: inline-block;">PRO FEATURE</span>';
    }
}
