/* jce - 2.9.76 | 2024-07-03 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
tinymce.PluginManager.add("browser", function(ed, url) {
    var self = this;
    ed.addCommand("mceFileBrowser", function(ui, args, win) {
        self.open(args, win);
    }), this.open = function(args, win) {
        return args = args || {}, ed.windowManager.open({
            file: ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=browser" + (args.caller ? "." + args.caller : "") + (args.filter ? "&filter=" + args.filter : ""),
            close_previous: "no",
            size: "mce-modal-landscape-full"
        }, args), !1;
    };
});