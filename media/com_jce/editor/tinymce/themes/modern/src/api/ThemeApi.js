/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
import Init from "../init/Init";

import Render from "../ui/Render";

import Resize from "../ui/Resize";

import NotificationManagerImpl from "../../../../ui/NotificationManagerImpl";

import WindowManagerImpl from "../../../../ui/WindowManagerImpl";

import Registry from "../ui/Registry";

const theme = function(editor) {
    function addButton(name, settings) {
        return Registry.addButton(name, settings);
    }
    return {
        renderUI: function(args) {
            return Render.renderUI(editor, theme, args);
        },
        resizeTo: function(w, h) {
            return Resize.resizeTo(editor, w, h);
        },
        resizeBy: function(dw, dh) {
            return Resize.resizeBy(editor, dw, dh);
        },
        getNotificationManagerImpl: function() {
            return NotificationManagerImpl(editor);
        },
        getWindowManagerImpl: function() {
            return WindowManagerImpl(editor);
        },
        addButton: addButton,
        addMenuButton: function(name, settings) {
            return settings.type = settings.type || "menubutton", addButton(name, settings);
        },
        addSplitButton: function(name, settings) {
            return settings.type = settings.type || "splitbutton", addButton(name, settings);
        },
        addMenuItem: function(name, settings) {
            return Registry.addMenuItem(name, settings);
        },
        addContextToolbar: function(predicate, items) {
            return Registry.addContextToolbar(predicate, items);
        },
        addContextMenu: function(name, predicate) {
            return Registry.addContextMenu(name, predicate);
        },
        getButtons: function() {
            return Registry.getButtons();
        },
        getMenuItems: function() {
            return Registry.getMenuItems();
        },
        getContextMenu: function() {
            return Registry.getContextMenu();
        },
        init: function(editor, url, $) {
            return Init.init(editor, url, $);
        },
        prefix: "wfe"
    };
};

export default {
    get: theme
};