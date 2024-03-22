/* jce - 2.9.63 | 2024-03-11 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var DOM = tinymce.DOM, Storage = tinymce.util.Storage;
    tinymce.create("tinymce.plugins.KitchenSink", {
        init: function(ed, url) {
            var state = !1, h = 0, el = ed.getElement(), s = ed.settings;
            function toggle() {
                var row = DOM.getParents(ed.id + "_kitchensink", ".mceToolbarRow");
                if (row) {
                    for (var n = DOM.getNext(row[0], ".mceToolbarRow"); n; ) state ? DOM.setStyle(n, "display", "") : DOM.hide(n), 
                    n = DOM.getNext(n, ".mceToolbarRow");
                    (h = s.height || el.style.height || el.offsetHeight) && DOM.setStyle(ed.id + "_ifr", "height", h), 
                    ed.getParam("use_state_cookies", !0) && Storage.set("wf_toggletoolbars_state_" + ed.id, state), 
                    ed.controlManager.setActive("kitchensink", state);
                }
            }
            ed.getParam("use_state_cookies", !0) && (state = Storage.get("wf_toggletoolbars_state_" + ed.id, !1)), 
            ed.addCommand("mceKitchenSink", function() {
                state = !state, toggle();
            }), ed.onSetContent.add(function() {
                ed.controlManager.setActive("visualblocks", state);
            }), ed.addButton("kitchensink", {
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