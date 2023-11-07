/* jce - 2.9.51 | 2023-10-18 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    "use strict";
    function parseCssToRules(content) {
        var doc = document.implementation.createHTMLDocument(""), styleElement = document.createElement("style");
        return styleElement.textContent = content, doc.body.appendChild(styleElement), 
        styleElement.sheet.cssRules;
    }
    var each$1 = tinymce.each, DOM$1 = tinymce.DOM, mceInternalUrlPrefix = "data:text/mce-internal,";
    function parseCSS(content) {
        var classes = {};
        return content = parseCssToRules(content), each$1(content, function(r) {
            var styles;
            r.selectorText && (styles = {}, each$1(r.style, function(name) {
                var val, value = r.style.getPropertyValue(name);
                "" !== (val = value) && "normal" !== val && "inherit" !== val && "none" !== val && "initial" !== val && (styles[name] = value);
            }), each$1(r.selectorText.split(","), function(selector) {
                0 != (selector = selector.trim()).indexOf(".mce") && -1 === selector.indexOf(".mce-") && -1 === selector.indexOf(".mso-") && Object.values(styles).length && (classes[selector] = {
                    styles: styles,
                    text: r.cssText
                });
            }));
        }), classes;
    }
    function trimHtml(html) {
        var content, items;
        return content = function(html) {
            if (-1 !== (startPos = html.indexOf("\x3c!--StartFragment--\x3e"))) {
                var startPos = html.substr(startPos + "\x3c!--StartFragment--\x3e".length), endPos = startPos.indexOf("\x3c!--EndFragment--\x3e");
                if (-1 !== endPos && /^<\/(p|h[1-6]|li)>/i.test(startPos.substr(endPos + "\x3c!--EndFragment--\x3e".length, 5))) return startPos.substr(0, endPos);
            }
            return html;
        }(html), items = [ /^[\s\S]*<body[^>]*>\s*|\s*<\/body[^>]*>[\s\S]*$/gi, /<!--StartFragment-->|<!--EndFragment-->/g, [ /( ?)<span class="Apple-converted-space">(\u00a0|&nbsp;)<\/span>( ?)/g, function(all, s1, s2) {
            return s1 || s2 ? "\xa0" : " ";
        } ], /<br class="Apple-interchange-newline">/g, /^<meta[^>]+>/g, /<br>$/i, /&nbsp;$/ ], 
        tinymce.each(items, function(v) {
            content = v.constructor == RegExp ? content.replace(v, "") : content.replace(v[0], v[1]);
        }), html = content;
    }
    var DOM = tinymce.DOM;
    function openWin(ed, cmd) {
        var title = "", msg = (msg = ed.getLang("clipboard.paste_dlg_title", "Use %s+V on your keyboard to paste text into the window.")).replace(/%s/g, tinymce.isMac ? "CMD" : "CTRL"), ctrl = (title = "mcePaste" === cmd ? ed.getLang("clipboard.paste_desc") : ed.getLang("clipboard.paste_text_desc"), 
        '<textarea id="' + ed.id + '_paste_content" dir="ltr" wrap="soft" rows="7"></textarea>'), msg = '<div class="mceModalRow mceModalStack">   <label for="' + ed.id + '_paste_content">' + msg + '</label></div><div class="mceModalRow">   <div class="mceModalControl">' + ctrl + "</div></div>", isInternalContent = !1;
        function createEditor(elm) {
            var pasteEd = new tinymce.Editor(elm.id, {
                plugins: "",
                language_load: !1,
                forced_root_block: !1,
                verify_html: !1,
                invalid_elements: ed.settings.invalid_elements,
                base_url: ed.settings.base_url,
                document_base_url: ed.settings.document_base_url,
                directionality: ed.settings.directionality,
                content_css: ed.settings.content_css,
                allow_event_attributes: ed.settings.allow_event_attributes,
                object_resizing: !1,
                schema: "mixed",
                theme: function() {
                    var parent = DOM.create("div", {
                        role: "application",
                        id: elm.id + "_parent",
                        style: "width:100%"
                    }), container = DOM.add(parent, "div", {
                        style: "width:100%"
                    });
                    return DOM.insertAfter(parent, elm), {
                        iframeContainer: container,
                        editorContainer: parent
                    };
                }
            });
            pasteEd.contentCSS = ed.contentCSS, pasteEd.onPreInit.add(function() {
                var doc = this.getDoc();
                this.onPaste.add(function(el, e) {
                    var sel, rng, clipboardContent = function(dataTransfer) {
                        var legacyText, items = {};
                        if (dataTransfer && (dataTransfer.getData && (legacyText = dataTransfer.getData("Text")) && 0 < legacyText.length && -1 === legacyText.indexOf(mceInternalUrlPrefix) && (items["text/plain"] = legacyText), 
                        dataTransfer.types)) for (var i = 0; i < dataTransfer.types.length; i++) {
                            var contentType = dataTransfer.types[i];
                            try {
                                items[contentType] = dataTransfer.getData(contentType);
                            } catch (ex) {
                                items[contentType] = "";
                            }
                        }
                        return items;
                    }(e.clipboardData || e.dataTransfer || doc.dataTransfer);
                    clipboardContent && (isInternalContent = function(clipboardContent, mimeType) {
                        return mimeType in clipboardContent && 0 < clipboardContent[mimeType].length;
                    }(clipboardContent, "x-tinymce/html"), clipboardContent = clipboardContent["x-tinymce/html"] || clipboardContent["text/html"] || clipboardContent["text/plain"] || "", 
                    clipboardContent = trimHtml(clipboardContent = !1 !== ed.settings.clipboard_process_stylesheets ? function(content, embed_stylesheet) {
                        var div = DOM$1.create("div", {}, content), styles = {}, css = "", styles = tinymce.extend(styles, parseCSS(content));
                        return each$1(styles, function(value, selector) {
                            if (-1 !== selector.indexOf("Mso")) return !0;
                            embed_stylesheet ? css += value.text : DOM$1.setStyles(DOM$1.select(selector, div), value.styles);
                        }), css && div.prepend(DOM$1.create("style", {
                            type: "text/css"
                        }, css)), content = div.innerHTML;
                    }(clipboardContent) : clipboardContent), null != (sel = doc.getSelection()) && null != (rng = sel.getRangeAt(0)) && (clipboardContent += '<span id="__mce_caret">_</span>', 
                    rng.startContainer == doc && rng.endContainer == doc || (rng.deleteContents(), 
                    0 === doc.body.childNodes.length) ? doc.body.innerHTML = clipboardContent : rng.insertNode(rng.createContextualFragment(clipboardContent)), 
                    clipboardContent = doc.getElementById("__mce_caret"), (rng = doc.createRange()).setStartBefore(clipboardContent), 
                    rng.setEndBefore(clipboardContent), sel.removeAllRanges(), sel.addRange(rng), 
                    clipboardContent.parentNode) && clipboardContent.parentNode.removeChild(clipboardContent), 
                    e.preventDefault());
                }), this.serializer.addAttributeFilter("data-mce-fragment", function(nodes, name) {
                    for (var i = nodes.length; i--; ) nodes[i].attr("data-mce-fragment", null);
                });
            }), pasteEd.onInit.add(function() {
                window.setTimeout(function() {
                    pasteEd.focus();
                    var tmp = pasteEd.dom.add("br", {
                        "data-mce-bogus": "1"
                    });
                    pasteEd.selection.select(tmp), pasteEd.selection.collapse(), 
                    pasteEd.dom.remove(tmp);
                }, 100);
            }), pasteEd.render();
        }
        ed.windowManager.open({
            title: title,
            content: msg,
            size: "mce-modal-landscape-medium",
            open: function() {
                var inp = DOM.get(ed.id + "_paste_content");
                "mcePaste" == cmd && createEditor(inp), window.setTimeout(function() {
                    inp.focus();
                }, 0);
            },
            close: function() {},
            buttons: [ {
                title: ed.getLang("cancel", "Cancel"),
                id: "cancel"
            }, {
                title: ed.getLang("insert", "Insert"),
                id: "insert",
                onsubmit: function(e) {
                    var content, inp = DOM.get(ed.id + "_paste_content"), data = {};
                    "mcePaste" == cmd ? (content = tinymce.get(inp.id).getContent(), 
                    content = (content = !0 !== ed.settings.code_allow_style ? content.replace(/<style[^>]*>[\s\S]+?<\/style>/gi, "") : content).replace(/<meta([^>]+)>/, ""), 
                    data.content = tinymce.trim(content), data.internal = isInternalContent) : data.text = inp.value, 
                    ed.execCommand("mceInsertClipboardContent", !1, data);
                },
                classes: "primary"
            } ]
        });
    }
    var each = tinymce.each;
    tinymce.create("tinymce.plugins.ClipboardPlugin", {
        init: function(ed, url) {
            var pasteText = ed.getParam("clipboard_paste_text", 1), pasteHtml = ed.getParam("clipboard_paste_html", 1);
            ed.onInit.add(function() {
                ed.plugins.contextmenu && ed.plugins.contextmenu.onContextMenu.add(function(th, m, e) {
                    var c = ed.selection.isCollapsed();
                    ed.getParam("clipboard_cut", 1) && m.add({
                        title: "advanced.cut_desc",
                        icon: "cut",
                        cmd: "Cut"
                    }).setDisabled(c), ed.getParam("clipboard_copy", 1) && m.add({
                        title: "advanced.copy_desc",
                        icon: "copy",
                        cmd: "Copy"
                    }).setDisabled(c), pasteHtml && m.add({
                        title: "clipboard.paste_desc",
                        icon: "paste",
                        cmd: "mcePaste"
                    }), pasteText && m.add({
                        title: "clipboard.paste_text_desc",
                        icon: "pastetext",
                        cmd: "mcePasteText"
                    });
                });
            }), each([ "mcePasteText", "mcePaste" ], function(cmd) {
                ed.addCommand(cmd, function() {
                    var doc = ed.getDoc(), failed = !1;
                    if (ed.getParam("clipboard_paste_use_dialog")) return openWin(ed, cmd);
                    try {
                        doc.execCommand("Paste", !1, null);
                    } catch (e) {
                        failed = !0;
                    }
                    return (failed = !doc.queryCommandEnabled("Paste") || failed) ? openWin(ed, cmd) : void 0;
                });
            }), pasteHtml && ed.addButton("paste", {
                title: "clipboard.paste_desc",
                cmd: "mcePaste",
                ui: !0
            }), pasteText && ed.addButton("pastetext", {
                title: "clipboard.paste_text_desc",
                cmd: "mcePasteText",
                ui: !0
            }), ed.getParam("clipboard_cut", 1) && ed.addButton("cut", {
                title: "advanced.cut_desc",
                cmd: "Cut",
                icon: "cut"
            }), ed.getParam("clipboard_copy", 1) && ed.addButton("copy", {
                title: "advanced.copy_desc",
                cmd: "Copy",
                icon: "copy"
            });
        }
    }), tinymce.PluginManager.add("clipboard", tinymce.plugins.ClipboardPlugin);
}();