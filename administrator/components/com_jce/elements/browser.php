<?php

/**
 * @copyright     Copyright (c) 2009-2019 Ryan Demmer. All rights reserved
 * @license       GNU/GPL 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * JCE is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses
 */
defined('JPATH_BASE') or die('RESTRICTED');

/**
 * Renders a browser element.
 */
class WFElementBrowser extends WFElement
{
    /**
     * Element name.
     *
     * @var string
     */
    public $_name = 'Browser';

    public function fetchElement($name, $value, &$node, $control_name)
    {
        $attributes = array();

        foreach ($node->attributes() as $k => $v) {
            if ($v != '') {
                $attributes[$k] = (string) $v;
            }
        }

        /*
         * Required to avoid a cycle of encoding &
         * html_entity_decode was used in place of htmlspecialchars_decode because
         * htmlspecialchars_decode is not compatible with PHP 4
         */
        $value = htmlspecialchars(html_entity_decode($value, ENT_QUOTES), ENT_QUOTES);
        $attributes['class'] = ((string) $node->attributes()->class ? (string) $node->attributes()->class : '');

        $control = $control_name.'['.$name.']';

        $html = '';

        $attributes['value'] = $value;
        $attributes['type'] = 'text';
        $attributes['name'] = $control;
        $attributes['id'] = preg_replace('#[^a-z0-9_-]#i', '', $control_name.$name);

        // pattern data attribute for editable select input box
        if ((string) $node->attributes()->parent) {
            $prefix = preg_replace(array('#^params#', '#([^\w]+)#'), '', $control_name);

            $items = array();

            foreach (explode(';', (string) $node->attributes()->parent) as $item) {
                $items[] = $prefix.$item;
            }

            $attributes['data-parent'] = implode(';', $items);
        }

        $filter = isset($attributes['data-filter']) ? $attributes['data-filter'] : '';

        $html .= '<div class="input-append">';
        $html .= '  <input';

        foreach ($attributes as $k => $v) {
            if (!in_array($k, array('default', 'label', 'description'))) {
                $html .= ' '.$k.' = "'.$v.'"';
            }
        }

        $html .= ' />';

        $component = WFExtensionHelper::getComponent();
        // get params definitions
        $params = new WFParameter($component->params, '', 'preferences');

        $width = (int) $params->get('browser_width', 780);
        $height = (int) $params->get('browser_height', 560);

        wfimport('admin.models.model');
        $model = new WFModel();

        $link = $model->getBrowserLink($attributes['id'], $filter);

        if (!empty($link)) {
            $html .= '  <span class="add-on"><a href="'.$link.'" id="'.$attributes['id'].'_browser" class="browser" target="_blank" onclick="Joomla.modal(this, \''.$link.'\', '.$width.', '.$height.');return false;" title="'.WFText::_('WF_BROWSER_TITLE').'"><i class="icon-picture"></i></a></span>';
        }

        $html .= '</div>';

        return $html;
    }
}
