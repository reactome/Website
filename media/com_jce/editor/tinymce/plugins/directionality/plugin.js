/* jce - 2.9.63 | 2024-03-11 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
tinymce.create("tinymce.plugins.Directionality", {
    init: function(ed, url) {
        function setDir(dir) {
            var curDir, dom = ed.dom, blocks = ed.selection.getSelectedBlocks();
            blocks.length && (curDir = dom.getAttrib(blocks[0], "dir"), tinymce.each(blocks, function(block) {
                dom.getParent(block.parentNode, "*[dir='" + dir + "']", dom.getRoot()) || (curDir != dir ? dom.setAttrib(block, "dir", dir) : dom.setAttrib(block, "dir", null));
            }), ed.nodeChanged());
        }
        ed.addCommand("mceDirectionLTR", function() {
            setDir("ltr");
        }), ed.addCommand("mceDirectionRTL", function() {
            setDir("rtl");
        }), ed.addButton("ltr", {
            title: "directionality.ltr_desc",
            cmd: "mceDirectionLTR"
        }), ed.addButton("rtl", {
            title: "directionality.rtl_desc",
            cmd: "mceDirectionRTL"
        }), ed.onNodeChange.add(this.nodeChange, this);
    },
    nodeChange: function(ed, cm, n) {
        var ed = ed.dom;
        (n = ed.getParent(n, ed.isBlock)) ? (ed = ed.getAttrib(n, "dir"), cm.setActive("ltr", "ltr" == ed), 
        cm.setDisabled("ltr", 0), cm.setActive("rtl", "rtl" == ed), cm.setDisabled("rtl", 0)) : (cm.setDisabled("ltr", 1), 
        cm.setDisabled("rtl", 1));
    }
}), tinymce.PluginManager.add("directionality", tinymce.plugins.Directionality);