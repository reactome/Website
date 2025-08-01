/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
tinymce.PluginManager.add("colorpicker", function(ed, url) {
    ed.addCommand("mceColorPicker", function(ui, v) {
        ed.windowManager.open({
            url: ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=colorpicker",
            width: 365,
            height: 320,
            close_previous: !1
        }, {
            input_color: v.color,
            func: v.func
        });
    });
});