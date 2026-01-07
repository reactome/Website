/* jce - 2.9.63 | 2024-03-11 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function($) {
    var each = tinymce.each, htmlSchema = new tinymce.html.Schema({
        schema: "mixed"
    }), mediatypes = [ "flash", "shockwave", "windowsmedia", "quicktime", "realmedia", "divx", "silverlight", "audio", "video", "iframe" ], defaultMediaAttributes = {
        quicktime: {
            autoplay: !0,
            controller: !0,
            loop: !1,
            cache: !1,
            correction: !1,
            enablejavascript: !1,
            kioskmode: !1,
            autohref: !1,
            playeveryframe: !1,
            targetcache: !1
        },
        flash: {
            play: !0,
            loop: !0,
            menu: !0,
            swliveconnect: !1,
            allowfullscreen: !1
        },
        director: {
            swstretchstyle: "none",
            swstretchhalign: "none",
            swstretchvalign: "none",
            autostart: !1,
            sound: !0,
            swliveconnect: !1,
            progress: !0
        },
        windowsmedia: {
            autostart: !0,
            enablecontextmenu: !0,
            invokeurls: !0,
            enabled: !1,
            fullscreen: !1,
            mute: !1,
            stretchtofit: !1,
            windowlessvideo: !1
        },
        real: {
            autogotourl: !0,
            imagestatus: !0
        },
        video: {
            autoplay: !1,
            loop: !1,
            controls: !1,
            muted: !1
        },
        audio: {
            autoplay: !1,
            loop: !1,
            controls: !1,
            muted: !1,
            preload: !1
        }
    };
    for (var y, ext, mimes = {}, items = "application/x-mplayer2,avi wmv wm asf asx wmx wvx,application/x-director,dcrvideo/divx,divxapplication/pdf,pdf,application/x-shockwave-flash,swf swfl,audio/mpeg,mpga mpega mp2 mp3 m4a,audio/ogg,ogg spx oga,audio/x-wav,wav,video/mpeg,mpeg mpg mpe,video/mp4,mp4 m4v,video/ogg,ogg ogv,video/webm,webm,video/quicktime,qt mov,video/x-flv,flv f4v,video/vnd.rn-realvideo,rvvideo/3gpp,3gpvideo/x-matroska,mkv".split(/,/), i = 0; i < items.length; i += 2) for (ext = items[i + 1].split(/ /), 
    y = 0; y < ext.length; y++) mimes[ext[y]] = items[i];
    function getTypeFromMime(mimetype) {
        return {
            "application/x-shockwave-flash": "flash",
            "application/x-director": "shockwave",
            "video/quicktime": "quicktime",
            "application/x-mplayer2": "windowsmedia",
            "audio/x-pn-realaudio-plugin": "real",
            "video/divx": "divx",
            "video/mp4": "video",
            "video/ogg": "video",
            "video/webm": "video",
            "audio/mpeg": "audio",
            "audio/mp3": "audio",
            "audio/x-wav": "audio",
            "audio/ogg": "audio",
            "audio/webm": "audio",
            "application/x-silverlight-2": "silverlight",
            "video/x-flv": "video"
        }[mimetype] || "";
    }
    function getMimeFromUrl(url) {
        (s = url) && (-1 !== s.indexOf("?") ? s = s.substr(0, s.indexOf("?")) : -1 !== s.indexOf("&") && (s = (s = s.replace(/&amp;/g, "&")).substr(0, s.indexOf("&")))), 
        url = s;
        var s = (s = Wf.String.getExt(url)).toLowerCase();
        return mimes[s] || !1;
    }
    var MediaManagerDialog = {
        settings: {
            filebrowser: {}
        },
        mediatypes: null,
        convertURL: function(url) {
            var query, n, ed = tinyMCEPopup.editor;
            return url && (query = "", 0 < (n = -1 === (n = url.indexOf("?")) ? (url = url.replace(/&amp;/g, "&")).indexOf("&") : n) && (query = url.substring(n + 1, url.length), 
            url = url.substr(0, n)), (url = ed.convertURL(url)) + (query ? "?" + query : ""));
        },
        init: function() {
            tinyMCEPopup.restoreSelection();
            var data, attribs, val, type, x, self = this, ed = tinyMCEPopup.editor, elm = ed.selection.getNode(), mediatype = "video";
            $("button#insert").on("click", function(e) {
                self.insert(), e.preventDefault();
            }), this.mediatypes = this.mapTypes(), Wf.init(), WFPopups.setup({
                remove: function(e, el) {
                    ed.dom.remove(ed.dom.getParent(el, "a"), 1);
                }
            }), WFAggregator.setup(), /mce-object/.test(elm.className) ? (data = ed.plugins.media.getMediaData(), 
            attribs = {}, elm = ed.dom.getParent(elm, "[data-mce-object]"), val = elm.className, 
            val = /mce-object-(flash|shockwave|windowsmedia|quicktime|realmedia|divx|silverlight|audio|video|iframe)/.exec(val), 
            mediatype = (type = val ? val[1].toLowerCase() : type) || "video", each(data, function(value, name) {
                if ("innerHTML" == name && value) return attribs.html = value.trim(), 
                !0;
                var tmp;
                "class" == (name = htmlSchema.isValid("img", name) ? name : mediatype + "_" + name) && (name = "classes", 
                value = value.replace(/mce-(\S+)/g, "").replace(/\s+/g, " ").trim()), 
                "align" == name && (value = Wf.getAttrib(elm, "align")), attribs[name] = value, 
                "style" == name && (tmp = ed.dom.create("div", {
                    style: value
                }), attribs.align = Wf.getAttrib(tmp, "align"), each([ "top", "right", "bottom", "left" ], function(pos) {
                    attribs["margin_" + pos] = Wf.getAttrib(tmp, "margin-" + pos), 
                    ed.dom.setStyle(tmp, "margin-" + pos, "");
                }), each([ "width", "style", "color" ], function(at) {
                    attribs["border_" + at] = Wf.getAttrib(tmp, "border-" + at), 
                    ed.dom.setStyle(tmp, "border-" + at, "");
                }), each([ "width", "height" ], function(at) {
                    attribs[at] = Wf.getAttrib(tmp, at);
                }), ed.dom.setStyles(tmp, {
                    float: "",
                    "vertical-align": "",
                    margin: "",
                    width: "",
                    height: ""
                }), attribs[name] = tmp.style.cssText);
            }), each(defaultMediaAttributes[mediatype], function(val, name) {
                if (attribs[mediatype + "_" + name]) return !0;
                attribs[mediatype + "_" + name] = val;
            }), $("#popup_list").prop("disabled", !0)) : WFPopups.getPopup(elm, 0, function(popup) {
                return attribs = {}, popup.type || (popup.type = getMimeFromUrl(popup.src)), 
                mediatype = getTypeFromMime(popup.type), each(popup, function(value, name) {
                    var key = name;
                    if ("src" !== name && "source" !== name || (value = self.convertURL(value)), 
                    "source" === name && (value = [ value ]), htmlSchema.isValid("img", name) || (name = mediatype + "_" + key), 
                    delete popup[key], "type" === key) return !0;
                    attribs[name] = value;
                }), popup;
            }), attribs ? ($("#insert").button("option", "label", tinyMCEPopup.getLang("update", "Update", !0)), 
            each([ "width", "height" ], function(key) {
                var value = attribs[key];
                $("#" + key).val(value).data("tmp", value);
            }), (val = WFAggregator.isSupported(attribs)) && (attribs = WFAggregator.setValues(val, attribs), 
            mediatype = val), x = 0, each(attribs, function(value, key) {
                var $na, $repeatable, $elements;
                return "width" === key || "height" === key || (Array.isArray(value) ? (each(value, function(val, i) {
                    $('input[name="' + key + '[]"]').eq(i).val(val).trigger("change");
                }), !0) : void (($na = $("#" + key)).length ? $na.is(":checkbox") ? $na.prop("checked", !!(value = "false" != value && "0" != value ? value : !1)).trigger("change") : $na.val(value) : ((key.substr(0, mediatype.length) !== mediatype ? ($repeatable = $(".uk-repeatable", "#advanced_tab"), 
                0 < x && $repeatable.eq(0).clone(!0).appendTo($repeatable.parent()), 
                $elements = $repeatable.eq(x).find("input, select"), key = key.replace(new RegExp("^(" + mediatypes.join("|") + ")_"), ""), 
                $elements) : (key = key.substr(mediatype.length + 1), $repeatable = $(".media_option." + mediatype + " .uk-repeatable"), 
                0 < x && ($repeatable.eq(0).clone(!0).appendTo($repeatable.parent()), 
                $repeatable = $(".media_option." + mediatype + " .uk-repeatable")), 
                $elements = $repeatable.eq(x).find("input, select"))).eq(0).val(key), 
                $elements.eq(1).val(value), x++)));
            }), "audio" != mediatype && "video" != mediatype || $(":input, select", "#" + mediatype + "_options").each(function() {
                $(this).is(":checkbox") ? $(this).prop("checked", !1) : $(this).val("");
            })) : Wf.setDefaults(this.settings.defaults), $("#media_type").val(mediatype).trigger("change"), 
            Wf.updateStyles(), attribs = attribs || {
                width: "",
                height: ""
            }, $("#src").filebrowser().on("filebrowser:onfileclick", function(e, file, data) {
                self.selectFile(file, data);
            }).on("filebrowser:onfiledetails", function(e, item, data) {
                data.width && !attribs.width && $("#width").val(data.width).data("tmp", data.width).trigger("change"), 
                data.height && !attribs.height && $("#height").val(data.height).data("tmp", data.height).trigger("change"), 
                attribs.width = attribs.height = null;
            }).on("filebrowser:onfileinsert", function(e, file, data) {
                self.insert();
            }), $("#src").on("change", function() {
                this.value && self.selectType(this.value);
            }), $("#width, #height").on("change", function() {
                var n = $(this).attr("id"), v = this.value;
                "audio" === $("#media_type").val() && self.addStyle(n, v);
            }), $("#border").change(), $(".uk-equalize-checkbox").trigger("equalize:update"), 
            $(".uk-form-controls select:not(.uk-datalist)").datalist({
                input: !1
            }).trigger("datalist:update"), $(".uk-datalist").trigger("datalist:update"), 
            $(".uk-repeatable").on("repeatable:delete", function(e, ctrl, elm) {
                $(elm).find("input, select").eq(1).val("");
            });
        },
        getAttrib: function(node, attrib) {
            return Wf.getAttrib(node, attrib);
        },
        getSiteRoot: function() {
            return tinyMCEPopup.getParam("document_base_url").match(/.*:\/\/([^\/]+)(.*)/)[2];
        },
        setControllerHeight: function(t) {
            var v = 0;
            switch (t) {
              case "quicktime":
              case "windowsmedia":
                v = 16;
                break;

              case "divx":
                switch ($("#divx_mode").val()) {
                  default:
                    v = 0;
                    break;

                  case "mini":
                    v = 20;
                    break;

                  case "large":
                    v = 65;
                    break;

                  case "full":
                    v = 90;
                }
            }
            $("#controller_height").val(v);
        },
        isIframe: function(n) {
            return n && -1 !== n.className.indexOf("mce-object-iframe");
        },
        addStyle: function(style, value) {
            style = $("<div></div>").attr("style", $("#style").val()).css(style, value).get(0).style.cssText;
            $("#style").val(style);
        },
        insert: function() {
            var src = $("#src").val(), type = $("#media_type").val();
            return "" == src ? (Wf.Modal.alert(tinyMCEPopup.getLang("mediamanager_dlg.no_src", "Please select a file or enter in a link to a file")), 
            !1) : $("#width").val() && $("#height").val() ? /(windowsmedia|mplayer|quicktime|divx)$/.test(type) ? (Wf.Modal.confirm(tinyMCEPopup.getLang("mediamanager_dlg.add_controls_height", "Add additional height for player controls?"), function(state) {
                var ch;
                state && (state = $("#height").val(), ch = $("#controller_height").val()) && $("#height").val(parseInt(state, 10) + parseInt(ch, 10)), 
                MediaManagerDialog.insertAndClose();
            }), !1) : void this.insertAndClose() : ("audio" === type && this.insertAndClose(), 
            WFPopups.isEnabled() && this.insertAndClose(), Wf.Modal.alert(tinyMCEPopup.getLang("mediamanager_dlg.no_dimensions", "A width and height value are required."), {
                close: function() {
                    $("#width, #height").map(function() {
                        if (!this.value) return this;
                    }).first().focus();
                }
            }), !1);
        },
        insertAndClose: function() {
            tinyMCEPopup.restoreSelection();
            var sources, ed = tinyMCEPopup.editor, classes = [ "mce-object" ], attribs = {}, args = {}, data = {}, popupData = {}, boolAttrs = htmlSchema.getBoolAttrs(), mediatype = $("#media_type").val(), elm = ed.selection.getNode(), elm = ed.dom.getParent(elm, "[data-mce-object]"), node = (mediatype == WFAggregator.isSupported($("#src").val()) && (WFAggregator.onInsert(mediatype), 
            mediatype = WFAggregator.getType(mediatype)), "iframe" === (type = mediatype) || "video" === type || "audio" === type ? mediatype : "object"), innerHTML = (classes.push("mce-object-" + mediatype), 
            $("input[id], select[id]").each(function() {
                var val = $(this).val();
                $(this).is(":checkbox") && (val = !!$(this).is(":checked")), data[this.id] = val;
            }), (type = WFAggregator.isSupported(data.src)) && $.extend(!0, data, WFAggregator.getValues(type, data.src)), 
            "audio" !== mediatype && "video" !== mediatype || (sources = [], $('input[name="' + mediatype + '_source[]"]').each(function() {
                var val = $(this).val();
                val !== data.src && sources.push(val);
            }), sources.length && (data[mediatype + "_source"] = sources)), "audio" === mediatype && (delete data.width, 
            delete data.height, type = navigator.userAgent.match(/(Opera|Chrome|Safari|Gecko)/)) && classes.push("mce-object-agent-" + type[0].toLowerCase()), 
            each(data, function(value, name) {
                return "classes" === name ? (attribs.class = value, !0) : !htmlSchema.isValid(node, name) || void (attribs[name] = value);
            }), "audio" !== mediatype && (attribs["data-mce-width"] = attribs.width || 384, 
            attribs["data-mce-height"] = attribs.height || 216), ""), type = (attribs.class = $.trim(attribs.class + " " + classes.join(" ")), 
            "object" === node && (attribs.data = data.src, attribs.type = function(type) {
                return {
                    flash: "application/x-shockwave-flash",
                    director: "application/x-director",
                    shockwave: "application/x-director",
                    quicktime: "video/quicktime",
                    mplayer: "application/x-mplayer2",
                    windowsmedia: "application/x-mplayer2",
                    realaudio: "audio/x-pn-realaudio-plugin",
                    real: "audio/x-pn-realaudio-plugin",
                    divx: "video/divx",
                    flv: "video/x-flv",
                    silverlight: "application/x-silverlight-2",
                    audio: "audio/mpeg",
                    video: "video/mpeg"
                }[type] || "";
            }(mediatype), "windowsmedia" === mediatype && (data.windowsmedia_url = data.src), 
            "quicktime" === mediatype && (data.quicktime_src = data.src), "flash" === mediatype) && (data.flash_movie = data.src), 
            $(".uk-repeatable", ".media_option." + mediatype).each(function() {
                var elements = $("input, select", this), key = $(elements).eq(0).val(), elements = $(elements).eq(1).val();
                key && (data[mediatype + "_" + key] = elements);
            }), $(".uk-repeatable", "#advanced_tab").each(function() {
                var elements = $("input, select", this), key = $(elements).eq(0).val(), elements = $(elements).eq(1).val();
                key && (attribs[key] = elements);
            }), each(data, function(value, name) {
                return 0 !== name.indexOf(mediatype) || (name = name.replace(mediatype + "_", ""), 
                !(!defaultMediaAttributes[mediatype] || boolAttrs[name] || value !== defaultMediaAttributes[mediatype][name])) || "" === value || ("source" === name ? (each(value, function(source) {
                    if (!source) return !0;
                    var mimetype = getMimeFromUrl(source);
                    mimetype = (mimetype = mimetype || mediatype + "/mpeg").replace(/(audio|video)/, mediatype), 
                    innerHTML += '<source src="' + source + '" type="' + mimetype + '"></source>', 
                    popupData.source = source;
                }), !0) : (popupData[name] = value, "object" === node ? (innerHTML += '<param name="' + name + '" value="' + value + '" />', 
                !0) : void (attribs[name] = value)));
            }), $("#html").val() && (innerHTML += $("#html").val()), ed.plugins.media);
            elm && type.isMediaObject(elm) ? (attribs.innerHTML = innerHTML, type.updateMedia(attribs)) : WFPopups.isEnabled() && ($("#popup_text").is(":disabled") || "" != $("#popup_text").val()) ? (args = {
                type: getMimeFromUrl(attribs.src),
                data: popupData
            }, each(attribs, function(value, name) {
                if (0 === name.indexOf("data-mce-")) return !0;
                args[name] = value;
            }), WFPopups.createPopup(elm, args)) : (classes = ed.dom.createHTML(node, attribs, $.trim(innerHTML)), 
            ed.execCommand("mceInsertContent", !1, classes, {
                skip_undo: 1
            })), ed.undoManager.add(), ed.nodeChanged(), tinyMCEPopup.close();
        },
        mapTypes: function() {
            var types = {}, mt = this.settings.media_types;
            return tinymce.each(tinymce.explode(mt, ";"), function(v, k) {
                v && v.replace(/([a-z0-9]+)=([a-z0-9,]+)/, function(a, b, c) {
                    types[b] = c.split(",");
                });
            }), types;
        },
        checkType: function(src) {
            src = getMimeFromUrl(src);
            return src && getTypeFromMime(src) || !1;
        },
        getType: function(v) {
            var s, type, data = {
                width: "",
                height: ""
            };
            if (!v) return !1;
            (type = /\.([a-z0-9]{3,4}$)/i.test(v) ? this.checkType(v) : type) || (s = WFAggregator.isSupported(v)) && (data = WFAggregator.getAttributes(s, v), 
            type = s);
            var x = 0;
            return tinymce.each(data, function(value, key) {
                var $el;
                value && ("width" === key || "height" === key ? $("#" + key).val(value).trigger("change") : ($el = $("#" + key)).length ? $el.is(":checkbox") ? $el.attr("checked", !!parseFloat(value)).prop("checked", !!parseFloat(value)) : $el.val(value) : (key = key.substr(type.length + 1), 
                $el = $(".media_option." + type + " .uk-repeatable"), 0 < x && ($el.eq(0).clone(!0).appendTo($el.parent()), 
                $el = $(".media_option." + type + " .uk-repeatable")), ($el = $el.eq(x).find("input, select")).eq(0).val(key), 
                $el.eq(1).val(value), x++));
            }), type;
        },
        selectType: function(v) {
            v = this.getType(v);
            v && $("#media_type").val(v).trigger("change");
        },
        changeType: function(type) {
            type = type || $("#media_type").val();
            this.setControllerHeight(type), $(".media_option", "#media_tab").hide().filter("." + type).show();
        },
        checkPrefix: function(n) {
            /^\s*www./i.test(n.value) && confirm(tinyMCEPopup.getLang("mediamanager_dlg_is_external", !1, "The URL you entered seems to be an external link, do you want to add the required http:// prefix?")) && (n.value = "http://" + n.value);
        },
        setSourceFocus: function(n) {
            $("input.uk-active").removeClass("uk-active"), $(n).addClass("uk-active");
        },
        selectFile: function(file, data) {
            var name = data.title, src = data.url;
            $("#media_tab").hasClass("uk-active") ? $("input.uk-active", "#media_tab").val(src) : ($("#src").val(src), 
            MediaManagerDialog.selectType(name), data.width && data.height && ($("#width").val(data.width).data("tmp", data.width), 
            $("#height").val(data.height).data("tmp", data.height)), WFAggregator.isSupported(src) && WFAggregator.onSelectFile(name));
        }
    };
    window.MediaManagerDialog = MediaManagerDialog, tinyMCEPopup.onInit.add(MediaManagerDialog.init, MediaManagerDialog);
}(jQuery, tinyMCEPopup);