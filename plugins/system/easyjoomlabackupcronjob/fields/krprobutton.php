<?php

/**
 * @copyright
 * @package     Field - Kubik-Rubik Pro Available
 * @author      Viktor Vogel <admin@kubik-rubik.de>
 * @version     Joomla! 3 - 3.1.1 - 2020-05-22
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

use Joomla\CMS\{Form\FormField, Factory};

/**
 * Form Field class for Kubik-Rubik Joomla! Extensions.
 * Adds a Pro action button with a link to the Pro landing page.
 */
class JFormFieldKrProButton extends FormField
{
    protected $type = 'krProButton';

    protected function getLabel()
    {
        return '';
    }

    protected function getInput()
    {
        $proLink = 'https://kubik-rubik.de/pro';

        if (Factory::getApplication()->getLanguage()->getTag() === 'de-DE') {
            $proLink = 'https://kubik-rubik.de/de/pro';
        }

        if (!empty($this->fieldname)) {
            $proLink .= '?extension=' . $this->fieldname;
        }

        $proButton = '<div class="btn-wrapper" id="toolbar-pro"><a href="' . $proLink . '" title="Kubik-Rubik Joomla! Pro Extensions" target="_blank"><button class="btn btn-small btn-inverse"><span class="icon-cube icon-white" aria-hidden="true"></span> PRO</button></a></div>';

        $document = Factory::getDocument();
        $scriptDeclaration = 'jQuery(function($){$("#toolbar").append(\'' . $proButton . '\');});';
        $document->addScriptDeclaration($scriptDeclaration);

        return '';
    }
}
