/* jce - 2.9.41 | 2023-08-23 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var each = tinymce.each, fmts = {
        p: "advanced.paragraph",
        address: "advanced.address",
        pre: "advanced.pre",
        h1: "advanced.h1",
        h2: "advanced.h2",
        h3: "advanced.h3",
        h4: "advanced.h4",
        h5: "advanced.h5",
        h6: "advanced.h6",
        div: "advanced.div",
        div_container: "advanced.div_container",
        blockquote: "advanced.blockquote",
        code: "advanced.code",
        samp: "advanced.samp",
        span: "advanced.span",
        section: "advanced.section",
        article: "advanced.article",
        aside: "advanced.aside",
        header: "advanced.header",
        footer: "advanced.footer",
        nav: "advanced.nav",
        figure: "advanced.figure",
        dt: "advanced.dt",
        dd: "advanced.dd"
    };
    tinymce.create("tinymce.plugins.FormatSelectPlugin", {
        init: function(ed, url) {
            this.editor = ed;
            var nodes = [];
            function isFormat(n) {
                return !(n.getAttribute("data-mce-bogus") || -1 === tinymce.inArray(nodes, n.nodeName) || n.className && -1 !== n.className.indexOf("mce-item-"));
            }
            each(ed.getParam("formatselect_blockformats", fmts, "hash"), function(value, key) {
                "span" !== key && nodes.push(key.toUpperCase());
            }), ed.onNodeChange.add(function(ed, cm, n) {
                var cm = cm.get("formatselect"), value = "";
                cm && ((n = ed.dom.getParent(n, isFormat, ed.getBody())) && n.nodeName && "pre" === (value = n.nodeName.toLowerCase()) && (value = n.getAttribute("data-mce-code") || n.getAttribute("data-mce-type") || value), 
                cm.select(value));
            });
        },
        createControl: function(n, cf) {
            if ("formatselect" === n) return this._createBlockFormats();
        },
        _createBlockFormats: function() {
            var ed = this.editor, PreviewCss = tinymce.util.PreviewCss, ctrl = ed.controlManager.createListBox("formatselect", {
                title: "advanced.block",
                max_height: 384,
                onselect: function(v) {
                    ed.execCommand("FormatBlock", !1, v);
                }
            }), preview_styles = ed.getParam("formatselect_preview_styles", !0);
            return ctrl && (each(ed.getParam("formatselect_blockformats", fmts, "hash"), function(value, key) {
                ctrl.add(ed.getLang(value, key), key, {
                    class: "mce_formatPreview mce_" + key,
                    style: function() {
                        return preview_styles ? PreviewCss.getCssText(ed, {
                            block: key
                        }) : "";
                    }
                });
            }), PreviewCss.reset()), ctrl;
        }
    }), tinymce.PluginManager.add("formatselect", tinymce.plugins.FormatSelectPlugin);
}();