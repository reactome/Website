/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
import Uuid from "../alien/Uuid";

var DOMUtils = tinymce.dom.DOMUtils, buttons = {}, sidebars = [], contextToolbars = [], contextMenu = {}, menuItems = {};

function addButton(name, settings) {
    (settings = "function" == typeof settings ? settings() : settings).text || settings.icon || (settings.icon = name), 
    buttons = buttons || {}, settings.tooltip = settings.tooltip || settings.title, 
    buttons[name] = settings;
}

function addSidebar(name, settings) {
    "function" == typeof settings && (settings = settings()), (sidebars = sidebars || []).push({
        name: name,
        settings: settings
    });
}

function addMenuItem(name, settings) {
    "function" == typeof settings && (settings = settings()), (menuItems = menuItems || {})[name] = settings;
}

function addContextToolbar(predicate, items) {
    var selector;
    "string" == typeof predicate && (selector = predicate, predicate = function(elm) {
        return DOMUtils.DOM.is(elm, selector);
    }), (contextToolbars = contextToolbars || []).push({
        id: Uuid.uuid("mcet"),
        predicate: predicate,
        items: items
    });
}

function addContextMenu(name, predicate) {
    var selector;
    "string" == typeof predicate && (selector = predicate, predicate = function(elm) {
        return DOMUtils.DOM.is(elm, selector) ? name : "";
    }), contextMenu[name] = predicate;
}

function getButtons() {
    return buttons;
}

function getMenuItems() {
    return menuItems;
}

function getSidebars() {
    return sidebars;
}

function getContextToolbars() {
    return contextToolbars;
}

function getContextMenu() {
    return contextMenu;
}

export default {
    getButtons: getButtons,
    getMenuItems: getMenuItems,
    getSidebars: getSidebars,
    getContextToolbars: getContextToolbars,
    addButton: addButton,
    addMenuItem: addMenuItem,
    addContextToolbar: addContextToolbar,
    addSidebar: addSidebar,
    addContextMenu: addContextMenu,
    getContextMenu: getContextMenu
};