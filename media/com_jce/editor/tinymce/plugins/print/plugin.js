/* jce - 2.9.62 | 2024-02-22 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
tinymce.PluginManager.add("print", function(ed) {
    ed.addCommand("mcePrint", function() {
        ed.getWin().print();
    }), ed.addButton("print", {
        title: "print.desc",
        cmd: "mcePrint"
    });
});