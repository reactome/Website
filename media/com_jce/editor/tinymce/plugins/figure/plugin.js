/* jce - 2.9.63 | 2024-03-11 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var VK = tinymce.VK, Node = tinymce.html.Node, each = tinymce.each, blocks = [];
    tinymce.create("tinymce.plugins.Figure", {
        init: function(ed, url) {
            (this.editor = ed).onPreInit.add(function(ed) {
                ed.parser.addNodeFilter("figure", function(nodes, name) {
                    for (var figcaption, node, i = nodes.length; i--; ) 0 === (node = nodes[i]).getAll("figcaption").length && ((figcaption = new Node("figcaption", 1)).attr("data-mce-empty", ed.getLang("figcaption.default", "Write a caption...")), 
                    figcaption.attr("contenteditable", !0), node.append(figcaption)), 
                    node.attr("data-mce-image", "1"), node.attr("contenteditable", "false"), 
                    each(node.getAll("img"), function(img) {
                        img.attr("data-mce-contenteditable", "true");
                    }), !1 !== ed.settings.figure_data_attribute && node.attr("data-wf-figure", "1");
                }), ed.parser.addNodeFilter("figcaption", function(nodes, name) {
                    for (var node, i = nodes.length; i--; ) (node = nodes[i]).firstChild || node.attr("data-mce-empty", ed.getLang("figcaption.default", "Write a caption...")), 
                    node.attr("contenteditable", "true");
                }), ed.serializer.addNodeFilter("figure", function(nodes, name) {
                    for (var node, i = nodes.length; i--; ) (node = nodes[i]).attr("contenteditable", null), 
                    each(node.getAll("img"), function(img) {
                        img.attr("data-mce-contenteditable", null);
                    });
                }), ed.serializer.addNodeFilter("figcaption", function(nodes, name) {
                    for (var node, i = nodes.length; i--; ) (node = nodes[i]).firstChild ? node.attr("contenteditable", null) : node.remove();
                }), ed.serializer.addAttributeFilter("data-mce-image", function(nodes, name) {
                    for (var i = nodes.length; i--; ) nodes[i].attr(name, null);
                }), each(ed.schema.getBlockElements(), function(v, k) {
                    if (/\W/.test(k)) return !0;
                    blocks.push(k.toLowerCase());
                }), ed.formatter.register("figure", {
                    block: "figure",
                    remove: "all",
                    ceFalseOverride: !0,
                    deep: !1,
                    onformat: function(elm, fmt, vars, node) {
                        vars = vars || {}, ed.dom.select("img,video,iframe", elm) && (ed.dom.setAttribs(elm, {
                            "data-mce-image": 1,
                            contenteditable: !1
                        }), ed.dom.setAttrib(ed.dom.select("img", elm), "data-mce-contenteditable", "true"), 
                        ed.dom.add(elm, "figcaption", {
                            "data-mce-empty": ed.getLang("figcaption.default", "Write a caption..."),
                            contenteditable: !0
                        }, vars.caption || ""), !1 !== ed.settings.figure_data_attribute) && ed.dom.setAttribs(elm, {
                            "data-wf-figure": "1"
                        });
                    },
                    onremove: function(node) {
                        ed.dom.remove(ed.dom.select("figcaption", node)), ed.dom.remove(ed.dom.getParent("figure", node), 1);
                    }
                }), ed.onBeforeExecCommand.add(function(ed, cmd, ui, v, o) {
                    var parent, se = ed.selection, n = se.getNode();
                    switch (cmd) {
                      case "JustifyRight":
                      case "JustifyLeft":
                      case "JustifyCenter":
                        n && ed.dom.is(n, "img,span[data-mce-object]") && (parent = ed.dom.getParent(n, "FIGURE")) && (se.select(parent), 
                        ed.execCommand(cmd, !1), o.terminate = !0);
                    }
                }), ed.onKeyDown.add(function(ed, e) {
                    var container, offset, isDelete = e.keyCode == VK.DELETE;
                    if (!e.isDefaultPrevented() && (isDelete || e.keyCode == VK.BACKSPACE) && !VK.modifierPressed(e) && (container = (isDelete = ed.selection.getRng()).startContainer, 
                    offset = isDelete.startOffset, isDelete = isDelete.collapsed, 
                    container = ed.dom.getParent(container, "FIGURE"))) {
                        var node = ed.selection.getNode();
                        if ("IMG" === node.nodeName) ed.dom.remove(container), ed.nodeChanged(), 
                        e.preventDefault(); else if ("FIGCAPTION" != node.nodeName || node.nodeValue && 0 !== node.nodeValue.length || 0 !== node.childNodes.length || e.preventDefault(), 
                        3 === node.nodeType && !isDelete && !offset) {
                            var figcaption = ed.dom.getParent(node, "FIGCAPTION");
                            if (figcaption) {
                                for (;figcaption.firstChild; ) figcaption.removeChild(figcaption.firstChild);
                                e.preventDefault();
                            }
                        }
                    }
                });
            });
        }
    }), tinymce.PluginManager.add("figure", tinymce.plugins.Figure);
}();