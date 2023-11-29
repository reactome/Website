/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var extend = tinymce.extend;
    function isMediaObject(node) {
        return node.getAttribute("data-mce-object") || node.getAttribute("data-mce-type");
    }
    tinymce.create("tinymce.plugins.ImageManagerExtended", {
        init: function(ed, url) {
            this.editor = ed, this.url = url, ed.onPreInit.add(function() {
                ed.parser.addNodeFilter("img", function(nodes) {
                    for (var i = nodes.length; i--; ) {
                        var node, stamp, src = (node = nodes[i]).attr("src");
                        src && -1 === src.indexOf("?") && /\.(jpg|jpeg|png|gif|webp|avif)$/.test(src) && (stamp = "?" + new Date().getTime(), 
                        src = ed.convertURL(src, "src", node.name), node.attr("src", src + stamp), 
                        node.attr("data-mce-src", src));
                    }
                });
            }), ed.addCommand("mceImageManagerExtended", function() {
                var n = ed.selection.getNode();
                "IMG" == n.nodeName && isMediaObject(n) || ed.windowManager.open({
                    file: ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=imagepro",
                    size: "mce-modal-portrait-full"
                }, {
                    plugin_url: url
                });
            }), ed.addButton("imgmanager_ext", {
                title: "imgmanager_ext.desc",
                cmd: "mceImageManagerExtended"
            }), ed.onNodeChange.add(function(ed, cm, n, collapsed) {
                n = (n = n) && "IMG" === n.nodeName && !isMediaObject(n);
                cm.setDisabled("imgmanager_ext", !n && !collapsed), cm.setActive("imgmanager_ext", n);
            }), ed.onInit.add(function() {
                var ux;
                ed && ed.plugins.contextmenu && ed.plugins.contextmenu.onContextMenu.add(function(th, m, e) {
                    m.add({
                        title: "imgmanager_ext.desc",
                        icon: "imgmanager_ext",
                        cmd: "mceImageManagerExtended"
                    });
                }), ed.settings.compress.css || ed.dom.loadCSS(url + "/css/content.css"), 
                ed.getParam("imgmanager_convert_img_links", 1) && ed.plugins.clipboard && (ux = "^((http|https)://[-!#$%&'*+\\/0-9=?A-Z^_`a-z{|}~;]+[-!#$%&*+\\/0-9=?A-Z^_`a-z{|}~;.]+?).(" + (ed.getParam("imgmanager_ext", {}).filetypes || [ "jpg", "jpeg", "png", "gif", "webp", "avif" ]).join("|") + ")$", 
                ed.onGetClipboardContent.add(function(ed, content) {
                    var match, value = content["text/plain"] || "";
                    value && (match = new RegExp(ux).exec(value)) && (content["text/plain"] = "", 
                    content["text/html"] = content["x-tinymce/html"] = ed.dom.createHTML("img", function(ed, value) {
                        var params = ed.getParam("imgmanager_ext", {}), args = {
                            src: value,
                            alt: ""
                        };
                        return tinymce.each([ "alt", "title", "id", "dir", "class", "usemap", "style", "longdesc", "loading", "width", "height" ], function(key) {
                            tinymce.is(params[key]) && (args[key] = params[key]);
                        }), args.style && (value = ed.dom.parseStyle(ed.dom.serializeStyle(args.style)), 
                        args.style = ed.dom.serializeStyle(value, "IMG")), args;
                    }(ed, match[0])), ed.setProgressState(!0), function(ed, value) {
                        return new Promise(function(resolve, reject) {
                            if (!value) return resolve();
                            var img = new Image();
                            img.onload = function() {
                                resolve();
                            }, img.onerror = function() {
                                reject();
                            }, img.src = ed.documentBaseURI.toAbsolute(value);
                        });
                    }(ed, value).then(function() {
                        ed.setProgressState(!1);
                    }, function() {
                        ed.setProgressState(!1);
                    }));
                }));
            });
        },
        getAttributes: function(data) {
            var ed = this.editor, attr = {
                style: {}
            }, attribs = data.attributes || {};
            return attribs.style && tinymce.is(attribs.style, "string") && (attribs.style = ed.dom.parseStyle(attribs.style)), 
            attribs.styles && tinymce.is(attribs.styles, "object") && (attribs.style = extend(attribs.styles, attribs.style || {}), 
            delete attribs.styles), attribs.style && (attribs.style = ed.dom.serializeStyle(attribs.style)), 
            tinymce.each([ "alt", "title", "id", "dir", "class", "usemap", "style", "longdesc", "loading" ], function(key) {
                tinymce.is(attribs[key]) && (attr[key] = attribs[key]);
            }), data.width && (attr.width = data.width), data.height && (attr.height = data.height), 
            attr;
        },
        insertUploadedFile: function(o) {
            var ed = this.editor, data = this.getUploadConfig();
            if (data && data.filetypes && new RegExp(".(" + data.filetypes.join("|") + ")$", "i").test(o.name)) return data = {
                src: o.file,
                alt: o.alt || o.name,
                style: {}
            }, data = extend(data, this.getAttributes(o)), ed.dom.create("img", data);
            return !1;
        },
        getUploadURL: function(file) {
            var ed = this.editor, data = this.getUploadConfig();
            return !!(data && data.filetypes && new RegExp(".(" + data.filetypes.join("|") + ")$", "i").test(file.name)) && ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=imagepro";
        },
        getUploadConfig: function() {
            return this.editor.getParam("imgmanager_ext", {}).upload || {};
        }
    }), tinymce.PluginManager.add("imgmanager_ext", tinymce.plugins.ImageManagerExtended);
}();