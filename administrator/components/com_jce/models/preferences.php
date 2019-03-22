<?php

/**
 * @copyright 	Copyright (c) 2009-2019 Ryan Demmer. All rights reserved
 * @license   	GNU/GPL 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * JCE is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses
 */
defined('_JEXEC') or die('RESTRICTED');

// load base model
require_once dirname(__FILE__).'/model.php';

class WFModelPreferences extends WFModel
{
    protected function checkRule($rules, $action, $gid)
    {
        if (is_object($rules)) {
            if (isset($rules->$action)) {
                $rule = $rules->$action;

                return isset($rule->$gid) && $rule->$gid != 0;
            }
        }

        // set Manager to false, Administrator and Super Administrator to true
        return $gid > 23;
    }

    public function getForm($group = null)
    {
        $component = WFExtensionHelper::getComponent();
            // get params definitions
            $params = json_decode($component->params);
        $rules = isset($params->access) ? $params->access : null;

            // Build the form control.
            $curLevel = 0;

        $actions = $this->getActions();
        $groups = $this->getUserGroups();

        $tabs = array('<ul class="nav nav-tabs">');
        $content = array('<div class="tab-content">');

        foreach ($groups as $group) {
            $difLevel = $group->level - $curLevel;
            $html = array();
            $item = new StdClass();

            $id = $curLevel;

            $tabs[] = '<li><a href="#permission-'.$id.'">'.str_repeat('<span> &rsaquo; </span> ', $curLevel = $group->level).$group->text.'</a></li>';

            $content[] = '<div id="permission-'.$id.'" class="tab-pane">';
            $content[] = '<table border="0" cellspacing="1" class="table table-striped">';
            $content[] = '<thead>';
            $content[] = '<tr>';
            $content[] = '<th><span>'.WFText::_('WF_RULES_ACTION').'</span></th>';
            $content[] = '<th><span>'.WFText::_('WF_RULES_SELECT_SETTING').'</span></th>';
            $content[] = '</tr>';
            $content[] = '</thead>';
            $content[] = '<tbody>';

            foreach ($actions as $action) {
                $content[] = '<tr>';
                $content[] = '<td><label class="hasTip" for="'.$action->name.'_'.$group->value.'" title="'.htmlspecialchars(WFText::_($action->title).'::'.WFText::_($action->description), ENT_COMPAT, 'UTF-8').'">'.WFText::_($action->title).'</label></td>';
                $content[] = '<td>';
                $content[] = '<select name="params[rules]['.$action->name.']['.$group->value.']" id="'.$action->name.'_'.$group->value.'" title="'.WFText::sprintf('WF_RULES_SELECT_ALLOW_DENY_GROUP', WFText::_($action->title), trim($group->text)).'">';

                $assetRule = $this->checkRule($rules, $action->name, $group->value);

                $content[] = '<option value="1"'.($assetRule === true ? ' selected="selected"' : '').'>'.WFText::_('WF_RULES_ALLOWED').'</option>';
                $content[] = '<option value="0"'.($assetRule === false ? ' selected="selected"' : '').'>'.WFText::_('WF_RULES_DENIED').'</option>';

                $content[] = '</select>&#160; ';
                $content[] = '</td>';
                $content[] = '</tr>';
            }

            $content[] = '</tbody>';
            $content[] = '</table>';
            $content[] = '</div>';
        }

        $tabs[] = '</ul>';
        $content[] = '</div>';

        return implode('', array_merge($tabs, $content));

        return null;
    }

    /**
     * Get Actions from access.xml file.
     */
    protected function getActions()
    {
        $file = JPATH_COMPONENT_ADMINISTRATOR.'/access.xml';
        $xml = WFXMLElement::load($file);

        $actions = array();

        if ($xml) {
            // Iterate over the children and add to the actions.
            foreach ($xml->section->children() as $element) {
                if ($element->getName() == 'action') {
                    $actions[] = (object) array(
                                'name' => (string) $element['name'],
                                'title' => (string) $element['title'],
                                'description' => (string) $element['description'],
                    );
                }
            }
        }

        return $actions;
    }

    /**
     * Get a list of the user groups.
     */
    protected function getUserGroups()
    {
        $db = JFactory::getDBO();

        // Initialise variables.
        $db = JFactory::getDBO();
        $query = 'SELECT a.id AS value, a.name AS text, COUNT(DISTINCT b.id) AS level, a.parent_id'
                .' FROM #__core_acl_aro_groups AS a'
                .' LEFT JOIN #__core_acl_aro_groups AS b ON a.lft >= b.lft AND a.rgt <= b.rgt'
                .' WHERE a.id IN (23,24,25) AND b.id IN (23,24,25)'
                .' GROUP BY a.id'
                .' ORDER BY a.lft ASC'
        ;

        // Get the options.
        $db->setQuery($query);

        return $db->loadObjectList();
    }
}
