/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var each = tinymce.each, VK = tinymce.VK;
    tinymce.create("tinymce.plugins.CaptionPlugin", {
        init: function(ed, url) {
            function isCaption(n) {
                return n && ed.dom.getParent(n, ".mce-item-caption,figure");
            }
            (this.editor = ed).onPreInit.add(function() {
                ed.settings.compress.css || ed.dom.loadCSS(url + "/css/content.css");
            }), ed.onInit.add(function() {
                ed.formatter.register("wfcaption", {
                    inline: "span",
                    remove: "all",
                    classes: "mce-item-caption",
                    selector: ".mce-item-caption",
                    attributes: {
                        role: "figure"
                    },
                    styles: {
                        display: "inline-block"
                    }
                }), ed.theme && ed.theme.onResolveName && ed.theme.onResolveName.add(function(theme, o) {
                    var n = o.node, cls = ed.dom.getAttrib(n, "class");
                    n && -1 !== cls.indexOf("mce-item-caption") && (o.name = "caption");
                }), ed.onObjectResized.add(function(ed, elm, width, height) {
                    elm = ed.dom.getParent(elm, "span.mce-item-caption");
                    elm && ed.dom.setStyle(elm, "max-width", width + "px");
                }), ed.onUpdateMedia.add(function(ed, o) {
                    o = o.node || !1;
                    o && "IMG" == o.nodeName && ed.dom.getParent(o, ".mce-item-caption");
                }), ed.onKeyDown.add(function(ed, e) {
                    var n;
                    e.keyCode !== VK.BACKSPACE && e.keyCode !== VK.DELETE || (n = ed.selection.getNode()) && ed.dom.hasClass(n, "mce-item-caption") && (ed.dom.remove(n), 
                    e.preventDefault(), ed.nodeChanged());
                });
            }), ed.onSetContent.add(function(ed) {
                var dom = ed.dom;
                each(dom.select(".jce_caption, .wf_caption", ed.getBody()), function(n) {
                    dom.addClass(n, "mce-item-caption");
                });
            }), ed.onPreProcess.add(function(ed, o) {
                var dom = ed.dom;
                o.set && each(dom.select(".jce_caption, .wf_caption", o.node), function(n) {
                    dom.addClass(n, "mce-item-caption");
                }), o.get && each(dom.select(".mceCaption", o.node), function(n) {
                    dom.removeClass(n, "mce-item-caption");
                }), each(dom.select(".jce_caption, .wf_caption", o.node), function(n) {
                    var w;
                    each(n.childNodes, function(c) {
                        var img;
                        "IMG" === c.nodeName && (w = c.getAttribute("width"), ed.getParam("caption_responsive", 1) && ed.dom.setStyle(c, "width", "100%"), 
                        (img = new Image()).onload = function() {
                            var iw = img.width;
                            dom.setStyle(n, "max-width", (w || iw) + "px"), dom.setAttrib(c, "width", w || iw);
                        }, img.src = ed.documentBaseURI.toAbsolute(c.getAttribute("src"), !0)), 
                        "FIGCAPTION" !== c.nodeName && "SPAN" !== c.nodeName || ed.dom.getStyle(c, "max-width") && ed.dom.setStyle(c, "max-width", null);
                    }), dom.setStyle(n, "display", "inline-block"), "auto" === n.style.marginLeft && "auto" === n.style.marginRight && dom.setStyle(n, "display", "block"), 
                    ed.getParam("caption_responsive", 1) && !ed.dom.getStyle(n, "float") && ed.dom.setStyle(n, "width", "100%"), 
                    ed.dom.getStyle(n, "float") && ed.dom.setStyle(n, "width", ""), 
                    dom.setAttrib(n, "data-mce-style", n.style.cssText);
                });
            }), ed.addCommand("mceCaption", function() {
                var n = ed.selection.getNode(), p = ed.dom.getParent(n, ".mce-item-caption,figure");
                (ed.dom.is(n, "span,figcaption") && p || n === p) && (n = ed.dom.select("img,span[data-mce-object]", p)[0]), 
                !(p && "SPAN" != p.nodeName || "IMG" == n.nodeName) || n.getAttribute("data-mce-object") && "FIGURE" != p.nodeName || (ed.dom.select(n), 
                ed.windowManager.open({
                    file: ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=caption",
                    size: "mce-modal-square-large"
                }, {
                    plugin_url: url
                }));
            }), ed.addCommand("mceInsertCaption", function(ui, o) {
                var n = ed.selection.getNode(), figure = ed.dom.getParent(n, ".mce-item-caption");
                if ("IMG" !== (n = ed.dom.is(n, "span,figcaption") && figure || n === figure ? ed.dom.select("img", figure)[0] : n).nodeName) return !1;
                figure || (ed.formatter.apply("wfcaption"), figure = ed.dom.getParent(n, ".mce-item-caption"));
                n = ed.dom.select("span,figcaption", figure)[0];
                !n && o.text && (n = ed.dom.add(figure, "span", {})), ed.dom.setHTML(n, o.text || ""), 
                ed.dom.setStyle(n, "display", "block");
            }), ed.addCommand("mceCaptionDelete", function() {
                var f, n = ed.selection.getNode(), c = ed.dom.getParent(n, ".mce-item-caption,figure");
                if (c) {
                    if ("FIGURE" == c.nodeName) return ed.formatter.remove("figure", {}, c);
                    tinymce.each(ed.dom.select("img", c), function(o) {
                        var styles = {};
                        tinymce.each([ "Top", "Right", "Bottom", "Left" ], function(s) {
                            var v = ed.dom.getStyle(c, "margin" + s);
                            styles["margin" + s] = parseInt(v, 10) || "auto" == v ? v : "";
                        }), f = ed.dom.getStyle(c, "float"), styles.float = "left" == f || "right" == f ? f : "", 
                        "top" !== (f = ed.dom.getStyle(c, "vertical-align")) && "middle" !== f && "bottom" !== f || (styles.verticalAlign = f), 
                        styles.marginLeft && "auto" === styles.marginLeft && styles.marginRight && "auto" === styles.marginRight && (styles.display = "block"), 
                        styles.width = "", ed.dom.setStyles(o, styles), ed.dom.setAttrib(o, "data-mce-style", o.style.cssText);
                    }), ed.dom.remove(ed.dom.select("span, div, figcaption", c)), 
                    ed.dom.remove(c, !0);
                }
            }), ed.addButton("caption_add", {
                title: "caption.desc",
                cmd: "mceCaption"
            }), ed.addButton("caption_delete", {
                title: "caption.delete",
                cmd: "mceCaptionDelete"
            }), ed.onNodeChange.add(function(ed, cm, n, co, o) {
                var s = isCaption(n);
                cm.setActive("caption_delete", s), cm.setActive("caption_add", s), 
                cm.setDisabled("caption_add", !s), cm.setDisabled("caption_delete", !s), 
                !s && "IMG" == n.nodeName && o.contenteditable && (cm.setDisabled("caption_add", !1), 
                s) && (ed.selection.select(n), o = ed.dom.getParent(n, "span.mce-item-caption")) && (ed.dom.setStyle(o, "max-width", n.getAttribute("width") || ed.dom.getStyle(n, "width") || ""), 
                ed.dom.setAttrib(o, "data-mce-style", o.style.cssText));
            });
        }
    }), tinymce.PluginManager.add("caption", tinymce.plugins.CaptionPlugin);
}();