/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
import Throbber from "../../../../ui/Throbber";

var setup = function(editor, theme) {
    var throbber;
    editor.on("ProgressState", function(e) {
        throbber = throbber || new Throbber(e.parent || theme.panel.getEl("body")), 
        e.state ? throbber.show(e.time) : throbber.hide();
    });
};

export default {
    setup: setup
};