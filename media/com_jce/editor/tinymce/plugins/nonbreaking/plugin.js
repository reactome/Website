/* jce - 2.9.82 | 2024-11-20 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
tinymce.PluginManager.add("nonbreaking", function(ed, url) {
    ed.addCommand("mceNonBreaking", function() {
        ed.execCommand("mceInsertContent", !1, ed.plugins.visualchars && ed.plugins.visualchars.state ? '<span data-mce-bogus="1" class="mce-item-hidden mce-item-nbsp">&nbsp;</span>' : "&nbsp;");
    }), ed.addButton("nonbreaking", {
        title: "nonbreaking.desc",
        cmd: "mceNonBreaking"
    }), ed.getParam("nonbreaking_force_tab") && ed.onKeyDown.add(function(ed, e) {
        9 == e.keyCode && (e.preventDefault(), ed.execCommand("mceNonBreaking"), 
        ed.execCommand("mceNonBreaking"), ed.execCommand("mceNonBreaking"));
    }), ed.addShortcut("ctrl+shift+32", "nonbreaking.desc", "mceNonBreaking");
});