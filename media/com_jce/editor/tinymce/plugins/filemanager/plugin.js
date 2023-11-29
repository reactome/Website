/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var openwith = {
        googledocs: {
            supported: [ "doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "pages", "ai", "psd", "tiff", "dxf", "svg", "ps", "ttf", "xps", "rar" ],
            link: "https://docs.google.com/viewer?url=",
            embed: "https://docs.google.com/viewer?embedded=true&url="
        },
        officeapps: {
            supported: [ "doc", "docx", "xls", "xlsx", "ppt", "pptx" ],
            link: "https://view.officeapps.live.com/op/view.aspx?src=",
            embed: "https://view.officeapps.live.com/op/embed.aspx?src="
        }
    }, embedMimes = {
        doc: "application/msword",
        xls: "application/vnd.ms-excel",
        ppt: "application/vnd.ms-powerpoint",
        dot: "application/msword",
        pps: "application/vnd.ms-powerpoint",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
        pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        xlsm: "application/vnd.ms-excel.sheet.macroEnabled.12",
        ppsx: "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
        sldx: "application/vnd.openxmlformats-officedocument.presentationml.slide",
        potx: "application/vnd.openxmlformats-officedocument.presentationml.template",
        xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
        odt: "application/vnd.oasis.opendocument.text",
        odg: "application/vnd.oasis.opendocument.graphics",
        odp: "application/vnd.oasis.opendocument.presentation",
        ods: "application/vnd.oasis.opendocument.spreadsheet",
        odf: "application/vnd.oasis.opendocument.formula",
        txt: "text/plain",
        rtf: "application/rtf",
        md: "text/markdown",
        pdf: "application/pdf"
    }, embedInvalid = [ "gif", "jpeg", "jpg", "png", "apng", "webp", "avif", "zip", "tar", "gz", "avi", "wmv", "wm", "asf", "asx", "wmx", "wvx", "mov", "qt", "mpg", "mpeg", "swf", "dcr", "rm", "ra", "ram", "divx", "mp4", "ogv", "ogg", "webm", "flv", "f4v", "mp3", "ogg", "wav", "m4a", "xap", "aiff" ];
    tinymce.create("tinymce.plugins.FileManager", {
        init: function(ed, url) {
            ed.addCommand("mceFileManager", function() {
                ed.windowManager.open({
                    file: ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=filemanager",
                    size: "mce-modal-portrait-full"
                }, {
                    plugin_url: url
                });
            }), this.editor = ed, this.url = url, ed.addButton("filemanager", {
                title: "filemanager.desc",
                cmd: "mceFileManager"
            }), ed.onNodeChange.add(function(ed, cm, n) {
                n = ed.dom.getParent(n, "a, .mce-object-iframe, .mce-object-object, .mce-object-embed") || n, 
                cm.setActive("filemanager", (ed = n) && /((jce|wf)_file|mce-object-iframe|mce-object-object|mce-object-embed)/.test(ed.className));
            }), ed.onInit.add(function(ed) {
                ed.settings.compress.css || ed.dom.loadCSS(url + "/css/content.css"), 
                ed && ed.plugins.contextmenu && ed.plugins.contextmenu.onContextMenu.add(function(th, m, e) {
                    m.add({
                        title: "filemanager.desc",
                        icon: "filemanager",
                        cmd: "mceFileManager"
                    });
                });
            });
        },
        getAttributes: function(data) {
            var ed = this.editor, attr = {
                style: {}
            };
            return data.style && tinymce.is(data.style, "string") && (data.style = ed.dom.serializeStyle(ed.dom.parseStyle(data.style))), 
            tinymce.each([ "target", "id", "dir", "class", "charset", "style", "hreflang", "lang", "type", "rev", "rel", "tabindex", "accesskey" ], function(key) {
                tinymce.is(data[key]) && (attr[key] = data[key]);
            }), attr;
        },
        insertUploadedFile: function(o) {
            var ed = this.editor, data = this.getUploadConfig();
            if (data && data.filetypes && new RegExp(".(" + data.filetypes.join("|") + ")$", "i").test(o.file)) {
                var config, embedTag, html, args = {
                    href: o.file,
                    title: o.title || o.name
                }, data = o.method || "link";
                if (o.openwith && (config = openwith[o.openwith] || !1) && (args.href = encodeURIComponent(decodeURIComponent(ed.documentBaseURI.toAbsolute(args.href, ed.settings.remove_script_host))), 
                new RegExp(".(" + config.supported.join("|") + ")$", "i").test(o.file)) && (args.href = config[data] + args.href), 
                "embed" == data && (config = args.href, !1 === new RegExp(".(" + embedInvalid.join("|") + ")$").test(config))) return data = (data = args.href).substring(data.length, data.lastIndexOf(".") + 1), 
                data = embedMimes[data] || "", embedTag = "object", args = tinymce.extend(args, {
                    width: o.width || 640,
                    height: o.height || 480
                }), data ? args = tinymce.extend(args, {
                    type: data,
                    data: args.href
                }) : (args = tinymce.extend(args, {
                    seamless: "seamless",
                    src: args.href
                }), embedTag = "iframe"), delete args.href, html = ed.dom.createHTML(embedTag, args, ""), 
                ed.execCommand("mceInsertContent", !1, html, {
                    skip_undo: 1
                }), !0;
                html = [], o.features && tinymce.each(o.features, function(n) {
                    n = ed.dom.createHTML(n.node, n.attribs || {}, n.html || "");
                    html.push(n);
                });
                var cls = [ "wf_file" ], data = this.getAttributes(o.attributes || {});
                return tinymce.each(data, function(val, key) {
                    "class" == key && val ? cls = cls.concat(val.split(" ")) : args[key] = val;
                }), args.class = cls.join(" "), 1 === html.length && (html = [ o.name ]), 
                ed.dom.create("a", args, html.join(""));
            }
            return !1;
        },
        getUploadURL: function(file) {
            var ed = this.editor, data = this.getUploadConfig();
            if (data && data.filetypes) {
                if (/\.(jpg|jpeg|png|tiff|bmp|gif|avif)$/i.test(file.name) && (ed.plugins.imgmanager || ed.plugins.imgmanager_ext)) return !1;
                if (/\.(html|htm|txt|md)$/i.test(file.name) && ed.plugins.templatemanager) return !1;
                if (/\.(mp4|m4v|ogg|webm|ogv|mp3|oga)$/i.test(file.name) && ed.plugins.mediamanager) return !1;
                if (new RegExp(".(" + data.filetypes.join("|") + ")$", "i").test(file.name)) return ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=filemanager";
            }
            return !1;
        },
        getUploadConfig: function() {
            return this.editor.getParam("filemanager", {}).upload || {};
        }
    }), tinymce.PluginManager.add("filemanager", tinymce.plugins.FileManager);
}();