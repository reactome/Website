/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var VK = tinymce.VK, each = tinymce.each, blocks = [];
    tinymce.create("tinymce.plugins.FormatPlugin", {
        init: function(ed, url) {
            var keyCode, self = this;
            (this.editor = ed).addButton("italic", {
                title: "advanced.italic_desc",
                onclick: function(e) {
                    e.preventDefault(), ed.focus(), e.shiftKey ? ed.formatter.toggle("italic-i") : ed.formatter.toggle("italic"), 
                    ed.undoManager.add();
                }
            }), ed.addShortcut("meta+shift+i", "italic.desc", function() {
                ed.formatter.apply("italic-i");
            }), ed.addCommand("mceSoftHyphen", function() {
                ed.execCommand("mceInsertContent", !1, ed.plugins.visualchars && ed.plugins.visualchars.state ? '<span data-mce-bogus="1" class="mce-item-hidden mce-item-shy">&shy;</span>' : "&shy;");
            }), keyCode = 189, tinymce.isGecko && (keyCode = 173), ed.addShortcut("ctrl+shift+" + keyCode, "softhyphen.desc", "mceSoftHyphen"), 
            ed.onPreInit.add(function(ed) {
                each(ed.schema.getBlockElements(), function(v, k) {
                    if (/\W/.test(k)) return !0;
                    blocks.push(k.toLowerCase());
                }), ed.formatter.register("aside", {
                    block: "aside",
                    remove: "all",
                    wrapper: !0
                }), ed.formatter.register("p", {
                    block: "p",
                    remove: "all"
                }), ed.formatter.register("div", {
                    block: "div",
                    onmatch: !!ed.settings.forced_root_block && function() {
                        return !1;
                    }
                }), ed.formatter.register("div_container", {
                    block: "div",
                    wrapper: !0,
                    onmatch: !!ed.settings.forced_root_block && function() {
                        return !1;
                    }
                }), ed.formatter.register("span", {
                    inline: "span",
                    remove: "all",
                    onmatch: function() {
                        return !1;
                    }
                }), ed.formatter.register("section", {
                    block: "section",
                    remove: "all",
                    wrapper: !0,
                    merge_siblings: !1
                }), ed.formatter.register("article", {
                    block: "article",
                    remove: "all",
                    wrapper: !0,
                    merge_siblings: !1
                }), ed.formatter.register("footer", {
                    block: "footer",
                    remove: "all",
                    wrapper: !0,
                    merge_siblings: !1
                }), ed.formatter.register("header", {
                    block: "header",
                    remove: "all",
                    wrapper: !0,
                    merge_siblings: !1
                }), ed.formatter.register("nav", {
                    block: "nav",
                    remove: "all",
                    wrapper: !0,
                    merge_siblings: !1
                }), ed.formatter.register("code", {
                    inline: "code",
                    remove: "all"
                }), ed.formatter.register("samp", {
                    inline: "samp",
                    remove: "all"
                }), ed.formatter.register("blockquote", {
                    block: "blockquote",
                    wrapper: 1,
                    remove: "all",
                    merge_siblings: !1
                }), ed.formatter.register("italic-i", {
                    inline: "i",
                    remove: "all"
                });
            }), ed.settings.removeformat = [ {
                selector: "b,strong,em,i,font,u,strike,sub,sup,dfn,code,samp,kbd,var,cite,mark,q,footer",
                remove: "all",
                split: !0,
                expand: !1,
                block_expand: !0,
                deep: !0
            } ], ed.onKeyDown.add(function(ed, e) {
                e.keyCode !== VK.ENTER && e.keyCode !== VK.UP && e.keyCode !== VK.DOWN || !e.altKey || self._clearBlocks(ed, e);
            }), ed.onKeyUp.addToTop(function(ed, e) {
                e.keyCode === VK.ENTER && "DIV" === (e = ed.selection.getNode()).nodeName && ed.settings.force_block_newlines && (!1 === ed.settings.keep_styles && ed.dom.removeAllAttribs(e), 
                ed.formatter.apply("p"));
            }), ed.onBeforeExecCommand.add(function(ed, cmd, ui, v, o) {
                var p, n = ed.selection.getNode();
                switch (cmd) {
                  case "FormatBlock":
                    if (!v) {
                        if (o.terminate = !0, n === ed.getBody()) return;
                        ed.undoManager.add(), (p = ed.dom.getParent(n, blocks.join(",")) || "") && (name = p.nodeName.toLowerCase(), 
                        ed.formatter.get(name)) && ed.formatter.remove(name);
                        var name = ed.controlManager.get("formatselect");
                        name && name.select(p);
                    }
                    "dt" !== v && "dd" !== v || (n && !ed.dom.getParent(n, "dl") && ed.execCommand("InsertDefinitionList"), 
                    "dt" === v && "DD" === n.nodeName && ed.dom.rename(n, "DT"), 
                    "dd" === v && "DT" === n.nodeName && ed.dom.rename(n, "DD"), 
                    o.terminate = !0);
                    break;

                  case "RemoveFormat":
                    v || ed.dom.isBlock(n) || (name = ed.controlManager.get("styleselect")) && name.selectedValue && ed.execCommand("mceToggleFormat", !1, name.selectedValue);
                }
            }), ed.onExecCommand.add(function(ed, cmd, ui, v, o) {
                var n = ed.selection.getNode();
                "mceToggleFormat" !== cmd || "dt" !== v && "dd" !== v || "DL" === n.nodeName && 0 === ed.dom.select("dt,dd", n).length && ed.formatter.remove("dl");
            });
        },
        _clearBlocks: function(ed, e) {
            var tag, n = ed.selection.getNode(), n = ed.dom.getParents(n, blocks.join(","));
            n && 1 < n.length && (tag = (tag = ed.getParam("forced_root_block", "p")) || (ed.getParam("force_block_newlines") ? "p" : "br"), 
            e.preventDefault(), (n = n[n.length - 1]) !== ed.getBody()) && (tag = ed.dom.create(tag, {}, "\xa0"), 
            e.keyCode === VK.ENTER || e.keyCode === VK.DOWN ? ed.dom.insertAfter(tag, n) : ed.dom.insertBefore(tag, n), 
            ed.selection.select(tag), ed.selection.collapse(1));
        }
    }), tinymce.PluginManager.add("format", tinymce.plugins.FormatPlugin);
}();