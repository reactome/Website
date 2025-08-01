/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
import * as Settings from "../api/Settings";

import Factory from "../../../../ui/Factory";

import Registry from "./Registry";

var Tools = tinymce.util.Tools, createToolbar = function(editor, items, size) {
    var buttonGroup, buttons, toolbarItems = [];
    if (items) return buttons = Registry.getButtons(), "string" == typeof items && (items = items.split(/[ ,]/)), 
    Tools.each(items, function(item) {
        function bindSelectorChanged() {
            var selection = editor.selection;
            item.settings.stateSelector && selection.selectorChanged(item.settings.stateSelector, function(state) {
                item.active(state);
            }, !0), item.settings.disabledStateSelector && selection.selectorChanged(item.settings.disabledStateSelector, function(state) {
                item.disabled(state);
            });
        }
        "|" === item ? buttonGroup = null : (buttonGroup || (buttonGroup = {
            type: "buttongroup",
            items: []
        }, toolbarItems.push(buttonGroup)), buttons[item] && ((item = "function" == typeof (item = buttons[item]) ? item() : item).type = item.type || "button", 
        item.size = size, item = Factory.create(item), buttonGroup.items.push(item), 
        editor.initialized ? bindSelectorChanged() : editor.on("init", bindSelectorChanged)));
    }), {
        type: "toolbar",
        layout: "flow",
        items: toolbarItems
    };
}, createToolbars = function(editor, size) {
    var toolbars = [];
    if (Tools.each(Settings.getToolbars(editor), function(toolbar) {
        (toolbar = toolbar) && toolbars.push(createToolbar(editor, toolbar, size));
    }), toolbars.length) return {
        type: "panel",
        layout: "stack",
        classes: "toolbar-grp",
        ariaRoot: !0,
        ariaRemember: !0,
        items: toolbars
    };
};

export default {
    createToolbar: createToolbar,
    createToolbars: createToolbars
};