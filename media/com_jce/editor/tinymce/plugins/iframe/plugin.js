/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var each = tinymce.each, extend = tinymce.extend, DOM = tinymce.DOM, htmlSchema = new tinymce.html.Schema(), DomParser = tinymce.html.DomParser;
    function isMedia(node) {
        return node && DOM.getParent(node, "[data-mce-object]");
    }
    function insertMedia(ed, data) {
        var attribs, node = ed.selection.getNode(), mediaApi = ed.plugins.media;
        data.html && (attribs = function(html) {
            var attribs = {
                html: ""
            }, parser = new DomParser({
                verify_html: !0,
                validate: !0,
                forced_root_block: !1,
                invalid_elements: "script,noscript,svg"
            }, htmlSchema);
            return parser.addNodeFilter("iframe", function(nodes) {
                for (var node, i = nodes.length; i--; ) {
                    node = nodes[i], each(node.attributes.map, function(val, name) {
                        attribs[name] = val;
                    });
                    var child = node.firstChild;
                    if (child && htmlSchema.isValid(child.name)) for (;child.value && (attribs.html += child.value), 
                    child = child.next; );
                }
            }), parser.parse(html), attribs;
        }(data.html), data.width && delete attribs.width, data.height && delete attribs.height, 
        extend(data, attribs)), data.query && (-1 !== data.src.indexOf("?") ? data.src += "&" + data.query : data.src += "?" + data.query), 
        isMedia(node) ? mediaApi.updateMedia(data) : (attribs = mediaApi.getMediaHtml(data), 
        ed.execCommand("insertMediaHtml", !1, attribs)), ed.undoManager.add(), ed.nodeChanged();
    }
    tinymce.create("tinymce.plugins.IframePlugin", {
        init: function(ed, url) {
            (this.editor = ed).addCommand("mceIframe", function() {
                ed.windowManager.open({
                    file: ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=iframe",
                    size: "mce-modal-landscape-xlarge"
                }, {
                    plugin_url: url
                });
            }), ed.addButton("iframe", {
                title: "iframe.desc",
                cmd: "mceIframe"
            }), ed.onNodeChange.add(function(ed, cm, n, collapsed) {
                ed = "iframe" === (n = ed.dom.getParent(n, ".mce-object-iframe") || n).getAttribute("data-mce-object") || "IFRAME" === n.nodeName;
                cm.setDisabled("iframe", !ed && !collapsed), cm.setActive("iframe", ed);
            });
        },
        createControl: function(n, cm) {
            var params, html, ed = this.editor, mediaApi = ed.plugins.media;
            return "iframe" !== n ? null : !1 === (params = ed.getParam("iframe", {})).quickmedia ? cm.createButton("iframe", {
                title: "iframe.desc",
                cmd: "mceIframe"
            }) : (html = '<div class="mceModalBody">\t<div class="mceModalContent">\t\t<div class="mceModalRow">   \t\t<div class="mceModalControl mceFlexAuto">       \t\t<textarea id="' + ed.id + '_iframe_input" aria-label="' + ed.getLang("media.embed_code", "Embed Code") + '" placeholder="' + ed.getLang("media.embed_code", "Embed Code") + '" rows="5"></textarea>   \t\t</div>\t\t</div>\t</div>\t<div class="mceModalFooter">\t\t<button id="' + ed.id + '_iframe_submit" class="mceButton mceButtonPrimary" type="button">' + ed.getLang("dlg.insert", "Insert") + "</button>\t</div></div>", 
            (n = cm.createSplitButton("iframe", {
                title: "iframe.desc",
                cmd: "mceIframe",
                max_width: 264,
                onselect: function(node) {
                    "" !== node.value && (node && isMedia(node) ? mediaApi.updateMedia({
                        src: node.value
                    }) : insertMedia(ed, {
                        src: node.value
                    }));
                }
            })).onRenderMenu.add(function(c, m) {
                var item = m.add({
                    onclick: function(e) {
                        e.preventDefault(), item.setSelected(!1);
                        var e = ed.dom.getParent(e.target, ".mceButton");
                        e && !e.disabled && ((e = (e = DOM.getValue(ed.id + "_iframe_input") || "").trim()) && mediaApi.isMediaHtml(e) && insertMedia(ed, {
                            html: e,
                            attributes: function(ed, data) {
                                return data.style && tinymce.is(data.style, "string") && (data.style = ed.dom.parseStyle(data.style)), 
                                data.styles && tinymce.is(data.styles, "object") && (data.style = extend(data.styles, data.style || {})), 
                                data.style && (data.style = ed.dom.serializeStyle(data.style)), 
                                data;
                            }(ed, params.attributes || {})
                        }), m.hideMenu());
                    },
                    html: html
                });
                m.onShowMenu.add(function() {
                    var data = {}, node = ed.selection.getNode(), node = (node && isMedia(node) && (data = mediaApi.getMediaData()), 
                    ed.getLang("insert", "Insert")), html = (window.setTimeout(function() {
                        DOM.get(ed.id + "_iframe_input").focus();
                    }, 10), "");
                    data.src && (html = mediaApi.getMediaHtml(data), node = ed.getLang("update", "Update")), 
                    DOM.setValue(ed.id + "_iframe_input", html), DOM.get(ed.id + "_iframe_submit").innerText = node;
                });
            }), n);
        }
    }), tinymce.PluginManager.add("iframe", tinymce.plugins.IframePlugin);
}();