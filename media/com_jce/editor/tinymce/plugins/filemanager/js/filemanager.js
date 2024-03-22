/* jce - 2.9.63 | 2024-03-11 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function($) {
    var each = tinymce.each, openwith = {
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
    }, embedInvalid = [ "gif", "jpeg", "jpg", "png", "apng", "webp", "avif", "zip", "tar", "gz", "avi", "wmv", "wm", "asf", "asx", "wmx", "wvx", "mov", "qt", "mpg", "mpeg", "swf", "dcr", "rm", "ra", "ram", "divx", "mp4", "ogv", "ogg", "webm", "flv", "f4v", "mp3", "ogg", "wav", "m4a", "xap", "aiff" ], FileManager = {
        init: function() {
            tinyMCEPopup.restoreSelection();
            var el, attribs, ordered, data, v, shortEnded, ed = tinyMCEPopup.editor, se = ed.selection, n = se.getNode(), self = this, href = "";
            function disableOptions() {
                $(".filemanager-link-options").find(":input").not("#target").prop("disabled", !0), 
                $("#layout").sortable("destroy");
            }
            $("#insert").on("click", function(e) {
                self.insert(), e.preventDefault();
            }), el = ed.dom.getParent(n, "A") || ed.dom.getParent(n, "IMG") || ed.dom.getParent(n, ".mce-object-iframe"), 
            this.setupSortables(), TinyMCE_Utils.fillClassList("date_class"), TinyMCE_Utils.fillClassList("size_class"), 
            Wf.init(), WFPopups.setup(), $("#format").on("change", function() {
                var state = "embed" === this.value;
                $(".filemanager-link-options").toggle(!state), $(".filemanager-embed-options").toggle(state).find(":input[required]").prop("disabled", !state), 
                $(".format-link").toggle(!state).find(":input").prop("disabled", state);
            }).trigger("change"), $("#format_openwith").on("change", function() {
                $('option[value="download"]', "#target").prop("disabled", "" !== this.value);
            }), el && ed.dom.is(el, ".jce_file, .wf_file, .mce-object-iframe, .mce-object-object") ? (ed.selection.select(el), 
            $(".uk-button-text", "#insert").text(tinyMCEPopup.getLang("update", "Update", !0)), 
            $("#classes").val(function() {
                var values = (values = ed.dom.getAttrib(el, "class")).replace(/mce-(.*)/g, "").replace(/(wf|jce)_file/gi, "").replace(/\s+/g, " ");
                return values = $.trim(values);
            }).trigger("change"), ed.dom.getParent(el, ".mce-object-iframe, .mce-object-object") ? (data = ed.plugins.media.getMediaData(), 
            attribs = {}, each(data, function(value, name) {
                var tmp;
                attribs[name] = value, "style" == name && (tmp = ed.dom.create("div", {
                    style: value
                }), attribs.align = Wf.getAttrib(tmp, "align"), each([ "top", "right", "bottom", "left" ], function(pos) {
                    attribs["margin_" + pos] = Wf.getAttrib(tmp, "margin-" + pos), 
                    ed.dom.setStyle(tmp, "margin-" + pos, "");
                }), each([ "width", "height" ], function(at) {
                    attribs["embed_" + at] = Wf.getAttrib(tmp, at);
                }), ed.dom.setStyles(tmp, {
                    float: "",
                    "vertical-align": "",
                    margin: "",
                    width: "",
                    height: ""
                }), attribs.style = tmp.style.cssText);
            }), attribs && ($(".uk-button-text", "#insert").text(tinyMCEPopup.getLang("update", "Update", !0)), 
            each(attribs, function(val, key) {
                "src" === key && (val = val.replace(/http:\/\//, "https://"), $.each(openwith, function(ow, ov) {
                    var match, link = ov.link, ov = ov.embed;
                    if (-1 !== val.indexOf(link) && (val = val.substring(link.length), 
                    match = !0), -1 !== val.indexOf(ov) && (val = val.substring(ov.length), 
                    match = !0), match) return $("#format_openwith").val(ow), !0;
                }), val = ed.convertURL(decodeURIComponent(val)), key = "href"), 
                $("#" + key).is(":checkbox") ? $("#" + key).prop("checked", !!val) : $("#" + key).val(val).trigger("change");
            })), $("#format").val("embed")) : (href = ed.dom.getAttrib(el, "href"), 
            $.each(openwith, function(k, v) {
                var match, link = v.link, v = v.embed;
                if (-1 !== href.indexOf(link) && (href = href.substring(link.length), 
                match = !0), -1 !== href.indexOf(v) && (href = href.substring(v.length), 
                match = !0), match) return $("#format_openwith").val(k), !0;
            }), href = ed.convertURL(decodeURIComponent(href)), $("#href").val(href), 
            $.each([ "title", "id", "style", "dir", "lang", "tabindex", "accesskey", "charset", "hreflang", "target", "rev", "download" ], function(i, k) {
                var v = ed.dom.getAttrib(el, k);
                "download" === k && v && (k = "target", v = "download"), $("#" + k).val(v).trigger("change");
            }), data = $("#layout > div"), ordered = [], $.each(el.childNodes, function(i, n) {
                switch (n.nodeName) {
                  case "IMG":
                    ed.dom.is(n, ".jce_icon, .wf_file_icon") ? ($("#layout_icon_check").prop("checked", !0), 
                    ordered.push($("#layout_icon").get(0))) : disableOptions();
                    break;

                  case "#text":
                    /[\w]+/i.test(n.data) && ($("#layout_text_check").prop("checked", !0), 
                    $("#text").val(n.data), ordered.push($("#layout_text").get(0)));
                    break;

                  case "SPAN":
                    var v = tinymce.trim(n.innerHTML), cls = n.className.replace(/(wf|jce)_(file_)?(text|size|date)/i, "");
                    ed.dom.is(n, ".wf_file_text") && ($("#layout_text_check").prop("checked", !0), 
                    $("#text").val(v), ordered.push($("#layout_text").get(0))), 
                    ed.dom.is(n, ".jce_size, .jce_file_size, .wf_file_size") && ($("input:text", "#layout_size").val(v), 
                    $("input:checkbox", "#layout_size").prop("checked", !0), $("#size_class").val(function() {
                        return $.trim(cls);
                    }).trigger("change"), ordered.push($("#layout_size").get(0))), 
                    ed.dom.is(n, ".jce_date, .jce_file_date, .wf_file_date") && ($("input:text", "#layout_date").val(v), 
                    $("input:checkbox", "#layout_size").prop("checked", !0), $("#date_class").val(function() {
                        return $.trim(cls);
                    }).trigger("change"), ordered.push($("#layout_date").get(0)));
                }
            }), ordered.length < data.length && $.each(data, function(i, n) {
                -1 == ordered.indexOf(n) && ordered.splice(i, 0, n);
            }), $("#layout").empty().append(ordered)), WFPopups.getPopup(n)) : (se.isCollapsed() || (n = se.getNode(), 
            data = !0, v = se.getContent({
                format: "text"
            }), shortEnded = ed.schema.getShortEndedElements(), (data = !n || !v || shortEnded[n.nodeName] || /</.test(se.getContent()) ? !1 : data) ? $("#text").val(v) : disableOptions()), 
            Wf.setDefaults(this.settings.defaults), $.each([ "icon", "size", "date" ], function(i, k) {
                $("#layout_" + k + "_check").prop("checked", self.settings["option_" + k + "_check"]).trigger("change");
            })), $("#href").filebrowser().on("filebrowser:onfileclick", function(e, file, data) {
                self.selectFile(file, data), file = data.url, (!1 !== new RegExp(".(" + embedInvalid.join("|") + ")$").test(file) ? $("#format").val("link").prop("disabled", !0) : $("#format").prop("disabled", !1)).trigger("change");
            }).on("filebrowser:onfileinsert", function(e, file, data) {
                self.selectFile(file, data);
            }).on("filebrowser:onfileinsert", function(e, file, data) {
                self.insert();
            }), Wf.updateStyles(), $("#format").trigger("change"), $(".uk-form-controls select").datalist().trigger("datalist:update"), 
            $(".uk-datalist").trigger("datalist:update");
        },
        insert: function() {
            return "" == $("#href").val() ? (Wf.Modal.alert(tinyMCEPopup.getLang("filemanager_dlg.no_src", "Please select a file or enter a file URL")), 
            !1) : "" === $("#text:enabled").val() && "link" === $("#format").val() ? (Wf.Modal.alert(tinyMCEPopup.getLang("filemanager_dlg.no_text", "Text for the file link is required")), 
            !1) : void this.insertAndClose();
        },
        insertAndClose: function() {
            tinyMCEPopup.restoreSelection();
            var el, ed = tinyMCEPopup.editor, se = ed.selection, n = se.getNode(), args = {}, html = [];
            tinymce.isWebKit && ed.getWin().focus();
            var ext = (ext = Wf.String.getExt($("#href").val())).toLowerCase(), options = [];
            $("#layout").hasClass("ui-sortable") && (options = $("#layout").sortable("toArray"));
            var rules, icon = (format = this.settings.icon_format).replace("{$name}", this.settings.icon_map[ext], "i"), data = {
                icon: '<img class="wf_file_icon" src="' + (icon = "/" == (icon = Wf.String.path(this.settings.icon_path, icon)).charAt(0) ? icon.substring(1) : icon) + '" style="border:0px;vertical-align:middle;max-width:inherit;" alt="' + ext + '" />',
                date: '<span class="wf_file_date" style="margin-left:5px;">' + $("input:text", "#layout_date").val() + "</span>",
                size: '<span class="wf_file_size" style="margin-left:5px;">' + $("input:text", "#layout_size").val() + "</span>",
                text: '<span class="wf_file_text">' + $("#text").val() + "</span>"
            };
            function removeTargetRules(rel) {
                return rel.filter(function(val) {
                    return -1 === $.inArray(val, rules);
                });
            }
            tinymce.each([ "href", "title", "target", "id", "style", "classes", "rel", "rev", "charset", "hreflang", "dir", "lang", "tabindex", "accesskey", "type" ], function(k) {
                var v = $("#" + k + ":enabled").val();
                "href" == k && (v = Wf.String.encodeURI(v, !0)), "target" == (k = "classes" === k ? "class" : k) && ("download" == v ? (args.download = Wf.String.basename($("#href").val()), 
                v = "_blank") : args.download = ""), args[k] = v;
            }), ed.settings.allow_unsafe_link_target || (args.rel = (icon = args.rel, 
            isUnsafe = "_blank" == args.target && /:\/\//.test(args.href), rules = [ "noopener" ], 
            icon = icon ? icon.split(/\s+/) : [], (icon = (isUnsafe ? function(rel) {
                return (rel = removeTargetRules(rel)).length ? rel.concat(rules) : rules;
            } : removeTargetRules)(icon)).length ? function(rel) {
                return $.trim(rel.sort().join(" "));
            }(icon) : null)), $.each(options, function(i, v) {
                $("input:checkbox", "#" + v).is(":checked") && html.push(data[v.replace("layout_", "")]);
            }), 1 === html.length && (html = [ $("#text").val() ]);
            var attr, embedTag, styles, isUnsafe = $("#format_openwith").val(), format = $("#format").val();
            isUnsafe && (args.href = openwith[isUnsafe][format] + encodeURIComponent(decodeURIComponent(Wf.URL.toAbsolute(args.href)))), 
            "embed" === format ? (icon = ed.selection.getNode(), icon = ed.dom.getParent(icon, ".mce-object-iframe, .mce-object-object"), 
            options = ed.plugins.media, attr = {}, embedTag = (format = embedMimes[ext] || "") && !isUnsafe ? "object" : "iframe", 
            each(args, function(val, key) {
                tinymce.is(val) && null !== val || (val = ""), "href" == key && (key = "object" == embedTag ? "data" : "src"), 
                ed.schema.isValid(embedTag, key) && (attr[key] = val);
            }), attr = tinymce.extend(attr, {
                type: format,
                width: $("#embed_width").val() || 640,
                height: $("#embed_height").val() || 480
            }), "iframe" == embedTag && delete attr.type, icon && icon.tagName.toLowerCase() == embedTag ? options.updateMedia(attr) : (each(attr, function(value, name) {
                "" == value && delete attr[name];
            }), html = ed.dom.createHTML(embedTag, attr), ed.execCommand("mceInsertContent", !1, html, {
                skip_undo: 1
            }))) : (se.isCollapsed() ? (ed.execCommand("mceInsertContent", !1, '<a href="#" id="__mce_tmp">' + html.join("") + "</a>", {
                skip_undo: 1
            }), el = ed.dom.get("__mce_tmp")) : (el = ed.dom.getParent(se.getNode(), "A")) ? (args.href || ed.dom.remove(el, !0), 
            $("#text").prop("disabled") || (el.innerHTML = html.join(""))) : (tinymce.isWebKit && n && "IMG" == n.nodeName && (styles = n.style.cssText), 
            ed.execCommand("mceInsertLink", !1, {
                href: "#",
                id: "__mce_tmp"
            }, {
                skip_undo: 1
            }), el = ed.dom.get("__mce_tmp"), ed.dom.setAttrib(el, "id", ""), $("#text").prop("disabled") || (el.innerHTML = html.join("")), 
            styles && ed.dom.setAttrib(n, "style", styles)), ed.dom.addClass(ed.dom.select(".wf_file_size", el), $("#size_class").val()), 
            ed.dom.addClass(ed.dom.select(".wf_file_date", el), $("#date_class").val()), 
            ed.dom.setAttribs(el, args), ed.dom.addClass(el, "wf_file"), WFPopups.createPopup(el)), 
            ed.undoManager.add(), ed.nodeChanged(), tinyMCEPopup.close();
        },
        setupSortables: function() {
            $("#layout").sortable({
                axis: "x"
            }), $("#layout").on("click", "div.ui-sortable-handle", function(e) {
                var type, e = e.target, p = this, items = $.fn.filebrowser.getselected();
                e.disabled || !$(e).is(":checkbox:checked, .layout_option_reload") || $(e).is(":checkbox") && $(e).siblings("input:text").val() || $(p).is("#layout_size, #layout_date") && items.length && ($("#insert").prop("disabled", !0), 
                $(p).addClass("loading"), type = $(p).data("type"), Wf.JSON.request("getFileDetails", $(items[0]).attr("id"), function(o) {
                    o.error || $("input:text", p).val(o[type]), $("#insert").prop("disabled", !1), 
                    $(p).removeClass("loading");
                }));
            });
        },
        selectFile: function(file, data) {
            var name = data.title, data = data.url;
            $("#href").val(data), $("input:text", "#layout_size").val(Wf.String.formatSize($(file).data("size"))), 
            $("input:text", "#layout_date").val(Wf.String.formatDate($(file).data("modified"), this.settings.date_format)), 
            1 == this.settings.replace_text && ("" !== $("#text").val() && 1 == this.settings.text_alert ? Wf.Modal.confirm(tinyMCEPopup.getLang("filemanager_dlg.replace_text_alert", "Replace file link text with file name?"), function(state) {
                state && $("#text").val(name);
            }) : $("#text").val(name));
        }
    };
    window.FileManager = FileManager, $(document).ready(function() {
        FileManager.init();
    });
}(jQuery);