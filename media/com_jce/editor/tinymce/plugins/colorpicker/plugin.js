/* jce - 2.9.63 | 2024-03-11 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
tinymce.create("tinymce.plugins.ColorPicker", {
    init: function(ed, url) {
        (this.editor = ed).addCommand("mceColorPicker", function(ui, v) {
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
    }
}), tinymce.PluginManager.add("colorpicker", tinymce.plugins.ColorPicker);