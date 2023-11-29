/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    function isAnchor(elm) {
        return elm && "a" === elm.nodeName.toLowerCase();
    }
    function hasFileSpan(elm) {
        return isAnchor(elm) && elm.querySelector("span.wf_file_text") && 1 === elm.childNodes.length;
    }
    var DOM = tinymce.DOM, Event = tinymce.dom.Event;
    function collectNodesInRange(rng, predicate) {
        if (rng.collapsed) return [];
        for (var rng = rng.cloneContents(), walker = new tinymce.dom.TreeWalker(rng.firstChild, rng), elements = [], nodes = [], current = rng.firstChild; (predicate(current) ? elements : nodes).push(current), 
        current = walker.next(); );
        return nodes.length && function(nodes) {
            for (var hasTextNodes = !1, hasElementNodes = !1, i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (3 === node.nodeType ? hasTextNodes = !0 : 1 === node.nodeType && "A" != node.tagName && (hasElementNodes = !0), 
                hasTextNodes && hasElementNodes) return 1;
            }
        }(nodes) ? nodes : elements;
    }
    function isOnlyTextSelected(ed) {
        var inlineTextElements = ed.schema.getTextInlineElements();
        return 0 === collectNodesInRange(ed.selection.getRng(), function(elm) {
            return 1 === elm.nodeType && !isAnchor(elm) && !inlineTextElements[elm.nodeName.toLowerCase()];
        }).length;
    }
    function getAnchorText(selection, anchorElm) {
        return (anchorElm ? anchorElm.innerText || anchorElm.textContent : selection.getContent({
            format: "text"
        })).replace(/\uFEFF/g, "");
    }
    function updateTextContent(elm, text) {
        tinymce.each(elm.childNodes, function(node) {
            3 == node.nodeType && "" !== node.nodeValue.trim() && (node.textContent = text);
        });
    }
    function createLink(ed, data) {
        var text, node = ed.selection.getNode(), anchor = ed.dom.getParent(node, "a[href]"), params = ed.getParam("link", {});
        (data = "string" == typeof data ? {
            url: data,
            text: data
        } : data).url ? (text = getAnchorText(ed.selection, isAnchor(node) ? node : null) || "", 
        data.text = data.text || text || data.url, /^\s*www\./i.test(data.url) && (data.url = "https://" + data.url), 
        text = {
            href: data.url
        }, text = tinymce.extend(text, params.attributes || {}), ed.selection.isCollapsed() ? ed.execCommand("mceInsertContent", !1, ed.dom.createHTML("a", text, data.text)) : (ed.execCommand("mceInsertLink", !1, text), 
        isAnchor(anchor) && updateTextContent(node, data.text)), ed.undoManager.add(), 
        ed.nodeChanged()) : isAnchor(node) && ed.execCommand("unlink", !1);
    }
    tinymce.create("tinymce.plugins.LinkPlugin", {
        init: function(ed, url) {
            var urlCtrl, textCtrl;
            this.editor = ed, this.url = url, ed.addCommand("mceLink", function() {
                var se = ed.selection, n = se.getNode();
                "A" != n.nodeName || isAnchor(n) || se.select(n), ed.windowManager.open({
                    file: ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=link",
                    size: "mce-modal-square-xlarge"
                }, {
                    plugin_url: url
                });
            }), ed.addShortcut("meta+k", "link.desc", "mceLink"), ed.onPreInit.add(function() {
                var cm, form, args, params = ed.getParam("link", {});
                !0 === params.basic_dialog && (cm = ed.controlManager, form = cm.createForm("link_form"), 
                args = {
                    label: ed.getLang("url", "URL"),
                    name: "url",
                    clear: !0,
                    attributes: {
                        required: !0
                    }
                }, params.file_browser && tinymce.extend(args, {
                    picker: !0,
                    picker_label: "browse",
                    picker_icon: "files",
                    onpick: function(e) {
                        ed.execCommand("mceFileBrowser", !0, {
                            caller: "link",
                            callback: function(selected, data) {
                                var src;
                                data.length && (src = data[0].url, data = data[0].title, 
                                urlCtrl.value(src), data = data.replace(/\.[^.]+$/i, ""), 
                                textCtrl.value(data), window.setTimeout(function() {
                                    urlCtrl.focus();
                                }, 10));
                            },
                            filter: params.filetypes || "files",
                            value: urlCtrl.value()
                        });
                    }
                }), urlCtrl = cm.createUrlBox("link_url", args), form.add(urlCtrl), 
                textCtrl = cm.createTextBox("link_text", {
                    label: ed.getLang("link.text", "Text"),
                    name: "text",
                    clear: !0,
                    attributes: {
                        required: !0
                    }
                }), form.add(textCtrl), ed.addCommand("mceLink", function() {
                    ed.windowManager.open({
                        title: ed.getLang("link.desc", "Link"),
                        items: [ form ],
                        size: "mce-modal-landscape-small",
                        open: function() {
                            var label = ed.getLang("insert", "Insert"), node = ed.selection.getNode(), src = "", state = isOnlyTextSelected(ed), start = ((node = ed.dom.getParent(node, "a[href]")) && (ed.selection.select(node), 
                            (src = ed.dom.getAttrib(node, "href")) && (label = ed.getLang("update", "Update")), 
                            tinymce.isIE && (start = ed.selection.getStart()) === ed.selection.getEnd() && "A" === start.nodeName && (node = start), 
                            hasFileSpan(node)) && (state = !0), getAnchorText(ed.selection, isAnchor(node) ? node : null) || "");
                            urlCtrl.value(src), textCtrl.value(start), textCtrl.setDisabled(!state), 
                            window.setTimeout(function() {
                                urlCtrl.focus();
                            }, 10), DOM.setHTML(this.id + "_insert", label);
                        },
                        buttons: [ {
                            title: ed.getLang("common.cancel", "Cancel"),
                            id: "cancel"
                        }, {
                            title: ed.getLang("insert", "Insert"),
                            id: "insert",
                            onsubmit: function(e) {
                                var data = form.submit();
                                Event.cancel(e), createLink(ed, data);
                            },
                            classes: "primary",
                            scope: self
                        } ]
                    });
                }));
            }), ed.onInit.add(function() {
                ed && ed.plugins.contextmenu && ed.plugins.contextmenu.onContextMenu.add(function(th, m, e) {
                    m.addSeparator(), m.add({
                        title: "link.desc",
                        icon: "link",
                        cmd: "mceLink",
                        ui: !0
                    }), "A" != e.nodeName || ed.dom.getAttrib(e, "name") || m.add({
                        title: "advanced.unlink_desc",
                        icon: "unlink",
                        cmd: "UnLink"
                    });
                });
            }), ed.onNodeChange.add(function(ed, cm, n, co) {
                var n = ed.dom.getParent(n, "a[href]"), anchor = n && ed.dom.hasClass(n, "mce-item-anchor");
                ed.dom.removeAttrib(ed.dom.select("a"), "data-mce-selected"), n && ed.dom.setAttrib(n, "data-mce-selected", "inline-boundary"), 
                cm.setActive("unlink", n), cm.setActive("link", n), cm.setDisabled("link", anchor);
            });
        },
        createControl: function(n, cm) {
            var html, ed = this.editor;
            return "link" !== n ? null : !1 === (n = ed.getParam("link", {})).quicklink || !0 === n.basic_dialog ? cm.createButton("link", {
                title: "link.desc",
                cmd: "mceLink"
            }) : (html = '<div class="mceToolbarRow">   <div class="mceToolbarItem mceFlexAuto">       <input type="text" id="' + ed.id + '_link_input" aria-label="' + ed.getLang("dlg.url", "URL") + '" />   </div>   <div class="mceToolbarItem">       <button type="button" id="' + ed.id + '_link_submit" class="mceButton mceButtonLink" title="' + ed.getLang("advanced.link_desc", "Insert Link") + '" aria-label="' + ed.getLang("link.insert", "Insert Link") + '">           <span class="mceIcon mce_link"></span>       </button>   </div>   <div class="mceToolbarItem">       <button type="button" id="' + ed.id + '_link_unlink" class="mceButton mceButtonUnlink" disabled="disabled" title="' + ed.getLang("advanced.unlink_desc", "Remove Link") + '" aria-label="' + ed.getLang("advanced.unlink_desc", "Remove Link") + '">           <span class="mceIcon mce_unlink"></span>       </button>   </div></div>', 
            (n = cm.createSplitButton("link", {
                title: "link.desc",
                cmd: "mceLink",
                max_width: 264,
                onselect: function(node) {
                    createLink(ed, {
                        url: node.value,
                        text: ""
                    });
                }
            })) ? (n.onRenderMenu.add(function(c, m) {
                var item = m.add({
                    onclick: function(e) {
                        e.preventDefault(), item.setSelected(!1);
                        var value, e = ed.dom.getParent(e.target, ".mceButton");
                        e.disabled || (ed.dom.hasClass(e, "mceButtonLink") && (value = DOM.getValue(ed.id + "_link_input"), 
                        createLink(ed, {
                            url: value,
                            text: ""
                        })), ed.dom.hasClass(e, "mceButtonUnlink") && ed.execCommand("unlink", !1), 
                        m.hideMenu());
                    },
                    html: html
                });
                m.onShowMenu.add(function() {
                    var selection = ed.selection, value = "", node = (DOM.setAttrib(ed.id + "_link_unlink", "disabled", "disabled"), 
                    ed.dom.getParent(selection.getNode(), "a[href]"));
                    isAnchor(node) && (selection.select(node), value = node.getAttribute("href"), 
                    DOM.setAttrib(ed.id + "_link_unlink", "disabled", null)), window.setTimeout(function() {
                        DOM.get(ed.id + "_link_input").focus();
                    }, 10), DOM.setValue(ed.id + "_link_input", value);
                });
            }), n) : void 0);
        },
        isAnchor: isAnchor,
        hasFileSpan: hasFileSpan,
        isOnlyTextSelected: isOnlyTextSelected,
        getAnchorText: getAnchorText,
        updateTextContent: updateTextContent
    }), tinymce.PluginManager.add("link", tinymce.plugins.LinkPlugin);
}();