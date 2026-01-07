/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
var focus = function(panel, type) {
    return function() {
        var item = panel.find(type)[0];
        item && item.focus(!0);
    };
}, addKeys = function(editor, panel) {
    editor.shortcuts.add("Alt+F9", "", focus(panel, "menubar")), editor.shortcuts.add("Alt+F10,F10", "", focus(panel, "toolbar")), 
    editor.shortcuts.add("Alt+F11", "", focus(panel, "elementpath")), panel.on("cancel", function() {
        editor.focus();
    });
};

export default {
    addKeys: addKeys
};