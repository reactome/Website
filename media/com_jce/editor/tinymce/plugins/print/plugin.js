/* jce - 2.9.58 | 2023-12-20 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
tinymce.PluginManager.add("print", function(ed) {
    ed.addCommand("mcePrint", function() {
        ed.getWin().print();
    }), ed.addButton("print", {
        title: "print.desc",
        cmd: "mcePrint"
    });
});