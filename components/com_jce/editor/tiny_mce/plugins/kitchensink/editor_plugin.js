/* jce - 2.9.41 | 2023-08-23 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var DOM = tinymce.DOM;
    tinymce.create("tinymce.plugins.KitchenSink", {
        init: function(ed, url) {
            var state = !1, h = 0, el = ed.getElement(), s = ed.settings;
            function toggle() {
                var row = DOM.getParents(ed.id + "_kitchensink", ".mceToolbarRow");
                if (row) {
                    for (var n = DOM.getNext(row[0], ".mceToolbarRow"); n; ) state = DOM.isHidden(n) ? (DOM.setStyle(n, "display", ""), 
                    !0) : (DOM.hide(n), !1), n = DOM.getNext(n, ".mceToolbarRow");
                    (h = s.height || el.style.height || el.offsetHeight) && DOM.setStyle(ed.id + "_ifr", "height", h), 
                    ed.controlManager.setActive("kitchensink", state);
                }
            }
            ed.addCommand("mceKitchenSink", toggle), ed.addButton("kitchensink", {
                title: "kitchensink.desc",
                cmd: "mceKitchenSink"
            }), ed.onPostRender.add(function(ed, cm) {
                DOM.get("mce_fullscreen") ? state = !0 : toggle();
            }), ed.onInit.add(function(ed) {
                ed.controlManager.setActive("kitchensink", state);
            });
        }
    }), tinymce.PluginManager.add("kitchensink", tinymce.plugins.KitchenSink);
}();