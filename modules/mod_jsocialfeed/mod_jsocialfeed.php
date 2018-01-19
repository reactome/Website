<?php
defined('_JEXEC') or die;

/**
 * @author     Garda Informatica <info@gardainformatica.it>
 * @copyright  Copyright (C) 2014 Garda Informatica. All rights reserved.
 * @license    http://www.gnu.org/licenses/gpl-3.0.html  GNU General Public License version 3
 * @package    JSocialFeed Joomla Extension
 * @link       http://www.gardainformatica.it
 */

/*

This file is part of "JSocialFeed Joomla Extension".

"JSocialFeed Joomla Extension" is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

"JSocialFeed Joomla Extension" is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with "JSocialFeed Joomla Extension".  If not, see <http://www.gnu.org/licenses/>.

*/

// Avoid multiple instances of the same module when called by both template and content (using loadposition)
if (isset($GLOBALS["jsocialfeed_mid_" . $module->id])) return;
else $GLOBALS["jsocialfeed_mid_" . $module->id] = true;

// Load shared language files for frontend side
require_once(JPATH_ROOT . "/libraries/jsocialfeed/language/jsocialfeed.inc");

$moduleclass_sfx = htmlspecialchars($params->get('moduleclass_sfx'));

$document = JFactory::getDocument();
if (empty($GLOBALS["jsocialfeed"]["loaded_css"])){
	$GLOBALS["jsocialfeed"]["loaded_css"]=true;
	$document->addStyleSheet(JURI::Root(true) . "/modules/mod_jsocialfeed/tmpl/jquery.bxslider/jquery.bxslider.css");
	$document->addStyleSheet(JURI::Root(true) . "/modules/mod_jsocialfeed/tmpl/css/jsocialfeed.css");
}

if (empty($GLOBALS["jsocialfeed"]["loaded_js"])){
	$GLOBALS["jsocialfeed"]["loaded_js"]=true;
	
	if(version_compare(JVERSION, '3.0', 'ge')){
		JHtml::_('jquery.framework');
	}else{
		if ($params->get("load_jquery", 1)){
			$document->addScript("https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js");
			$document->addScript(JURI::Root(true) . '/modules/mod_jsocialfeed/tmpl/js/jquery-noconflict.js');
		}
	}
	
	
	$document->addScript(JURI::Root(true) . '/modules/mod_jsocialfeed/tmpl/jquery.bxslider/plugins/jquery.fitvids.js');
	$document->addScript(JURI::Root(true) . '/modules/mod_jsocialfeed/tmpl/jquery.bxslider/plugins/jquery.easing.1.3.js');
	$document->addScript(JURI::Root(true) . '/modules/mod_jsocialfeed/tmpl/jquery.bxslider/jquery.bxslider.js');
}


$menu = JFactory::getApplication()->getMenu();
$itemid = $menu->getActive() or $itemid = $menu->getDefault();
$itemid = "&amp;menu_Itemid=" . $itemid->id;

$prefix = JURI::base(true) . "/index.php?option=com_jsocialfeed&amp;view=smartloader";
$postfix = "&amp;mod_owner=module&amp;mod_id=" . $module->id . $itemid;

$json_script=$prefix . "&amp;type=json&amp;filename=jsocialfeed" . $postfix;
$js_script=$prefix . "&amp;type=js&amp;filename=jsocialfeed" . $postfix;


$ns='module_'.$module->id;

$document->addScriptDeclaration('

var jsf_lazy_load_loaded_'.$ns.'={"js":false,"json":false,"alreadyinit":false};

function jsf_lazy_load_js_loaded_'.$ns.'(){
	jsf_lazy_load_loaded_'.$ns.'.js=true;
	jsf_lazy_load_do_init_'.$ns.'();
}
function jsf_lazy_load_json_loaded_'.$ns.'(){
	jsf_lazy_load_loaded_'.$ns.'.json=true;
	jsf_lazy_load_do_init_'.$ns.'();
}
function jsf_lazy_load_do_init_'.$ns.'(){
	if (jsf_lazy_load_loaded_'.$ns.'.js && jsf_lazy_load_loaded_'.$ns.'.json && !jsf_lazy_load_loaded_'.$ns.'.alreadyinit){
		jsf_lazy_load_loaded_'.$ns.'.alreadyinit=true;
		jsf_init_'.$ns.'();
	}
}

function jsf_lazy_load_json_and_js_'.$ns.'() {
	
	var json_element = document.createElement("script");
	json_element.src = \''.htmlspecialchars_decode($json_script).'\';
	json_element.onreadystatechange= function () {
		if (this.readyState == "complete") jsf_lazy_load_json_loaded_'.$ns.'();
	}
	json_element.onload= jsf_lazy_load_json_loaded_'.$ns.';		
	document.body.appendChild(json_element);
	
	var js_element = document.createElement("script");
	js_element.src = \''.htmlspecialchars_decode($js_script).'\';
	js_element.onreadystatechange= function () {
		if (this.readyState == "complete") jsf_lazy_load_js_loaded_'.$ns.'();
	}
	js_element.onload= jsf_lazy_load_js_loaded_'.$ns.';		
	document.body.appendChild(js_element);
}
if (window.addEventListener){
	window.addEventListener("load", jsf_lazy_load_json_and_js_'.$ns.', false);
}else if (window.attachEvent){
	window.attachEvent("onload", jsf_lazy_load_json_and_js_'.$ns.');
}else{
	window.onload = jsf_lazy_load_json_and_js_'.$ns.';
}
');	

$jvers=explode('.',JVERSION);
$jv=array($jvers[0],$jvers[1]);

echo "<!-- mod_jsocialfeed " . $GLOBALS["jsocialfeed"]["version"] . " j ".implode('.',$jv)." -->";
require JModuleHelper::getLayoutPath('mod_jsocialfeed', $params->get('layout', 'default'));
$icons = load_icons_fonts_pathjsf(JPATH_ROOT . '/' . "modules" . '/' . "mod_jsocialfeed") . '/' . "tmpl" . '/' . "css" . '/'. "fonts";