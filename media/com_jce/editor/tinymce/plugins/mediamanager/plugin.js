/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var each = tinymce.each, extend = tinymce.extend, DOM = tinymce.DOM, Event = tinymce.dom.Event, htmlSchema = new tinymce.html.Schema(), DomParser = tinymce.html.DomParser, Uuid = tinymce.util.Uuid;
    function isMedia(node) {
        return node && DOM.getParent(node, "[data-mce-object]");
    }
    var mediaProviders = {
        youtube: /youtu(\.)?be(.+)?\/(.+)/,
        vimeo: /vimeo(.+)?\/(.+)/,
        dailymotion: /dai\.?ly(motion)?(\.com)?/,
        scribd: /scribd\.com\/(.+)/,
        slideshare: /slideshare\.net\/(.+)\/(.+)/,
        soundcloud: /soundcloud\.com\/(.+)/,
        spotify: /spotify\.com\/(.+)/,
        ted: /ted\.com\/talks\/(.+)/,
        twitch: /twitch\.tv\/(.+)/,
        video: /\.(mp4|ogv|ogg|webm)$/,
        audio: /\.(mp3|ogg|webm|wav|m4a|aiff)$/
    };
    function stripQuery(value) {
        return value = -1 !== value.indexOf("?") ? value.substring(0, value.indexOf("?")) : value;
    }
    function insertMedia(ed, data, provider) {
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
        isMedia(node) ? mediaApi.updateMedia(data) : (attribs = getMediaHtml(ed, data), 
        ed.execCommand("insertMediaHtml", !1, attribs)), ed.undoManager.add(), ed.nodeChanged();
    }
    function getMediaHtml(ed, value) {
        var nodeName = "iframe", attribs = {}, innerHTML = "", src = stripQuery((value = "string" == typeof value ? {
            src: value
        } : value).src), boolAttrs = (/\.(mp4|m4v|ogg|webm|ogv)$/.test(src) ? nodeName = "video" : /\.(mp3|m4a|oga)$/.test(src) && (nodeName = "audio"), 
        ed.schema.getBoolAttrs());
        return each(value, function(val, name) {
            if ("" == val && !boolAttrs[name]) return !0;
            value.html && (innerHTML = value.html), !ed.schema.isValid(nodeName, name) && -1 === name.indexOf("-") || (attribs[name] = val);
        }), ed.dom.createHTML(nodeName, attribs, innerHTML);
    }
    function isSupportedMedia(ed, url) {
        var mediaApi, match;
        return !(!url || "string" != typeof url || (mediaApi = ed.plugins.media, 
        match = !1, ed = ed.getParam("mediamanager", {}), url = stripQuery(url), 
        each(mediaProviders, function(rx, key) {
            rx.test(url) && mediaApi.isSupportedMedia(url) && (match = key);
        }), match || (/\.(avi|wmv|wm|asf|asx|wmx|wvx)$/i.test(url) && (match = "windowsmedia"), 
        /\.(mov|qt|mpg|mpeg)$/i.test(url) && (match = "windowsmedia"), /\.(swf|dcr)$/i.test(url) && (match = "flash"), 
        /\.(rm|ra|ram)$/i.test(url) && (match = "real"), /\.divx$/i.test(url) && (match = "divx"), 
        /\.xap$/i.test(url) && (match = "silverlight")), match && !1 === ed.quickmedia[match])) && (ed.custom_embed && each(ed.custom_embed, function(values, name) {
            values = values.expression || name;
            if (new RegExp(values).test(url)) return match = name, !0;
        }), match);
    }
    function getMediaProps(ed, data, provider) {
        var id, matches, value = data.src || "", ed = ed.getParam("mediamanager", {}), defaultValues = {
            youtube: {
                src: value,
                width: 560,
                height: 315,
                frameborder: 0,
                allowfullscreen: "allowfullscreen",
                allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            },
            vimeo: {
                src: value,
                width: 560,
                height: 315,
                frameborder: 0,
                allowfullscreen: "allowfullscreen",
                allow: "autoplay; fullscreen"
            },
            dailymotion: {
                src: value,
                width: 640,
                height: 360,
                frameborder: 0,
                allowfullscreen: "allowfullscreen",
                allow: "autoplay; fullscreen"
            },
            video: {
                src: value,
                width: 560,
                height: 315,
                controls: !0,
                type: "video/mpeg"
            },
            slideshare: {
                src: "",
                width: 427,
                height: 356,
                frameborder: 0,
                allowfullscreen: "allowfullscreen",
                allow: "fullscreen"
            },
            soundcloud: {
                src: "",
                width: "100%",
                height: 400,
                frameborder: 0
            },
            spotify: {
                src: value,
                width: 300,
                height: 380,
                frameborder: 0,
                allowtransparency: !0,
                allow: "encrypted-media"
            },
            ted: {
                src: "",
                width: 560,
                height: 316,
                frameborder: 0,
                allowfullscreen: "allowfullscreen"
            },
            twitch: {
                src: "",
                width: 500,
                height: 281,
                frameborder: 0,
                allowfullscreen: "allowfullscreen"
            }
        }, attribs = (ed.custom_embed && ed.custom_embed[provider] && (defaultValues[provider] = ed.custom_embed[provider], 
        delete defaultValues[provider].expression, extend(defaultValues[provider], {
            src: value,
            width: 560,
            height: 315,
            frameborder: 0
        })), value = value.replace(/[^a-z0-9-_:&;=%\?\[\]\/\.]/gi, ""), defaultValues[provider] || (defaultValues[provider] = {}), 
        defaultValues[provider].src = value, data.attributes || {}), args = {}, attribsMap = [ "title", "id", "class", "style", "width", "height" ];
        return each(attribs, function(val, key) {
            key === provider ? args = extend(args, attribs[provider]) : -1 !== tinymce.inArray(attribsMap, key) && (args[key] = val);
        }), defaultValues[provider] = extend(defaultValues[provider], args), "youtube" === provider && (data = value.replace(/youtu(\.)?be([^\/]+)?\/(.+)/, function(a, b, c, d) {
            return d = d.replace(/(watch\?v=|v\/|embed\/|live\/)/, ""), b && !c && (c = ".com"), 
            id = d.replace(/([^\?&#]+)/, function($0, $1) {
                return $1;
            }), "youtube" + c + "/embed/" + d;
        }), defaultValues[provider].src = data), "vimeo" === provider && (-1 == value.indexOf("player.vimeo.com/video/") && (data = id = "", 
        matches = /vimeo\.com\/(?:\w+\/){0,3}((?:[0-9]+\b)(?:\/[a-z0-9]+)?)/.exec(value)) && tinymce.is(matches, "array") && (id = (ed = matches[1].split("/"))[0], 
        2 == ed.length && (data = ed[1]), value = "https://player.vimeo.com/video/" + id + (data ? "?h=" + data : "")), 
        defaultValues[provider].src = value), "dailymotion" === provider && (id = "", 
        (matches = /dai\.?ly(motion)?(.+)?\/(swf|video)?\/?([a-z0-9]+)_?/.exec(value)) && tinymce.is(matches, "array") && (id = matches.pop()), 
        defaultValues[provider].src = "https://dailymotion.com/embed/video/" + id), 
        "spotify" === provider && (defaultValues[provider].src = value.replace(/open\.spotify\.com\/track\//, "open.spotify.com/embed/track/")), 
        "ted" === provider && (defaultValues[provider].src = value.replace(/www\.ted.com\/talks\//, "embed.ted.com/talks/")), 
        defaultValues;
    }
    function getEmbedData(ed, data, provider) {
        var defaultProviderData = data[provider] || "";
        return new Promise(function(resolve, reject) {
            if (!defaultProviderData) return reject();
            var video, type, value;
            "video" === provider ? ((video = document.createElement("video")).onloadedmetadata = function() {
                data.video.width || data.video.height || tinymce.extend(data.video, {
                    width: video.videoWidth,
                    height: video.videoHeight
                }), video = null, tinymce.is(data.video.controls) || (data.video.controls = "controls"), 
                resolve(data.video);
            }, video.onerror = function() {
                video = null, resolve(data.video);
            }, video.src = ed.documentBaseURI.toAbsolute(data.video.src)) : "audio" === provider ? (tinymce.is(data.audio.controls) || (data.audio.controls = "controls"), 
            resolve(data.audio)) : (value = data[provider].url || data[provider].src, 
            type = "", "facebook" === provider && /\/(posts|videos)\//.test(value) && (type = /\/(posts|videos)\//.exec(value)[1]), 
            value = {
                id: Uuid.uuid("wf_"),
                method: "getEmbedData",
                params: [ provider, encodeURIComponent(value), type ]
            }, tinymce.util.XHR.send({
                url: ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.rpc&plugin=mediamanager&" + ed.settings.query,
                data: "json=" + JSON.stringify(value),
                content_type: "application/x-www-form-urlencoded",
                success: function(response) {
                    var data = "";
                    try {
                        data = JSON.parse(response);
                    } catch (e) {
                        return resolve(defaultProviderData);
                    }
                    if (!data.result) return resolve(defaultProviderData);
                    if (data.result.error) return reject(data.result.error);
                    response = tinymce.is(data.result, "object") ? data.result : {};
                    if ("string" == typeof data.result) try {
                        response = JSON.parse(data.result);
                    } catch (e) {
                        return resolve(defaultProviderData);
                    }
                    !response.src && response.url && (response.src = response.url), 
                    data = tinymce.extend(defaultProviderData, response), resolve(data);
                },
                error: function(err, xhr) {
                    return resolve(defaultProviderData);
                }
            }));
        });
    }
    function getDataAndInsert(ed, data) {
        return new Promise(function(resolve, reject) {
            if (data.src) {
                var provider = isSupportedMedia(ed, data.src);
                if (!provider) return ed.windowManager.alert(ed.getLang("mediamanager.url_unsupported", "This URL is not currently supported"));
                ed.setProgressState(!0);
                var props = getMediaProps(ed, data, provider);
                props[provider].url = data.src, getEmbedData(ed, props, provider).then(function(args) {
                    ed.setProgressState(!1), insertMedia(ed, args), resolve();
                }, function(msg) {
                    ed.setProgressState(!1), msg && ed.windowManager.alert(msg), 
                    reject();
                });
            }
        });
    }
    tinymce.create("tinymce.plugins.MediaManagerPlugin", {
        init: function(ed, url) {
            var self = this;
            function isMediaElm(n) {
                if (n = ed.dom.getParent(n, "[data-mce-object]")) {
                    n = ed.plugins.media.getMediaData();
                    if (n.src) return !1 !== isSupportedMedia(ed, n.src);
                }
            }
            function isPopup(n) {
                return !!ed.dom.is(n, "a.jcepopup") && (/(flash|quicktime|director|shockwave|windowsmedia|mplayer|real|realaudio|divx|video|audio)/.test(n.type) || isSupportedMedia(ed, n.href));
            }
            self.editor = ed, self.url = url, ed.addCommand("mceMedia", function() {
                var se = ed.selection, n = se.getNode();
                isPopup(n) && se.select(n), ed.windowManager.open({
                    file: ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=mediamanager",
                    size: "mce-modal-portrait-full"
                }, {
                    plugin_url: url
                });
            }), ed.onNodeChange.add(function(ed, cm, n, collapsed) {
                var node, nonEditClass, state = !1, disabled = !0;
                node = n, nonEditClass = tinymce.settings.noneditable_noneditable_class || "mceNonEditable", 
                (node.attr ? node.hasClass(nonEditClass) : DOM.hasClass(node, nonEditClass)) || (disabled = !1), 
                isMediaElm(n) && (state = !0), cm.setDisabled("mediamanager", disabled && !collapsed), 
                cm.setActive("mediamanager", state || isPopup(n));
            }), ed.onPreInit.add(function() {
                var cm, form, urlCtrl, args, attribs, mediaApi = ed.plugins.media, params = ed.getParam("mediamanager", {});
                !0 === params.basic_dialog && (cm = ed.controlManager, form = cm.createForm("media_form"), 
                args = {
                    label: ed.getLang("dlg.url", "URL"),
                    name: "src",
                    clear: !0
                }, params.basic_dialog_filebrowser && tinymce.extend(args, {
                    picker: !0,
                    picker_label: "browse",
                    picker_icon: "media",
                    onpick: function() {
                        ed.execCommand("mceFileBrowser", !0, {
                            caller: "mediamanager",
                            callback: function(selected, data) {
                                data = data[0].url;
                                urlCtrl.value(data), window.setTimeout(function() {
                                    urlCtrl.focus();
                                }, 10);
                            },
                            filter: params.filetypes.join(","),
                            value: urlCtrl.value()
                        });
                    }
                }), params.upload && extend(args, {
                    upload_label: "upload.label",
                    upload_accept: params.upload.filetypes,
                    upload: function(e, file) {
                        if (file && file.name) {
                            var url = self.getUploadURL(file);
                            if (!url) return ed.windowManager.alert(ed.getLang("upload.file_extension_error", "File type not supported")), 
                            !1;
                            urlCtrl.setLoading(!0), extend(file, {
                                filename: file.name.replace(/[\+\\\/\?\#%&<>"\'=\[\]\{\},;@\^\(\)\xa3\u20ac$~]/g, ""),
                                upload_url: url
                            }), ed.plugins.upload.upload(file, function(response) {
                                urlCtrl.setLoading(!1);
                                response = response.files || [], response = response.length ? response[0] : {};
                                if (response.file) return urlCtrl.value(response.file), 
                                !0;
                                ed.windowManager.alert("Unable to upload file!");
                            }, function(message) {
                                ed.windowManager.alert(message), urlCtrl.setLoading(!1);
                            });
                        }
                    }
                }), urlCtrl = cm.createUrlBox("media_url", args), form.add(urlCtrl), 
                attribs = {
                    src: ""
                }, ed.addCommand("mceMedia", function() {
                    ed.windowManager.open({
                        title: ed.getLang("mediamanager.desc", ""),
                        items: [ form ],
                        size: "mce-modal-landscape-small",
                        open: function() {
                            var label = ed.getLang("insert", "Insert"), node = ed.selection.getNode(), data = {
                                src: ""
                            };
                            isMedia(node) && (data = mediaApi.getMediaData(), each([ "width", "height", "style", "class", "id", "title" ], function(name) {
                                var val = ed.dom.getAttrib(node, name);
                                "" !== val && ("class" === name && (val = val.replace(/mce-item-(\w+)/gi, "").replace(/\s+/g, " "), 
                                val = tinymce.trim(val)), attribs[name] = val), 
                                "width" !== name && "height" !== name || (val = ed.dom.getStyle(node, name) || ed.dom.getAttrib(node, name), 
                                attribs[name] = parseInt(val, 10));
                            })), isPopup(node) && (data.src = ed.dom.getAttrib(node, "href")), 
                            data.src && (label = ed.getLang("update", "Update")), 
                            urlCtrl.value(data.src), window.setTimeout(function() {
                                urlCtrl.focus();
                            }, 10), DOM.setHTML(this.id + "_insert", label);
                        },
                        buttons: [ {
                            title: ed.getLang("cancel", "Cancel"),
                            id: "cancel"
                        }, {
                            title: ed.getLang("insert", "Insert"),
                            id: "insert",
                            onsubmit: function(e) {
                                var data = form.submit(), node = ed.selection.getNode();
                                return Event.cancel(e), !!data.src && (isMedia(node) ? mediaApi.updateMedia(data) : isPopup(node) ? ed.dom.setAttrib(node, "href", data.src) : !mediaApi.isMediaObject(node) && (attribs = tinymce.extend(params.attributes || {}, attribs), 
                                data = tinymce.extend(data, {
                                    attributes: attribs
                                }), void getDataAndInsert(ed, data).then(function() {})));
                            },
                            classes: "primary",
                            scope: self
                        } ]
                    });
                }));
            }), ed.onInit.add(function() {
                var params = ed.getParam("mediamanager", {});
                ed && ed.plugins.contextmenu && ed.plugins.contextmenu.onContextMenu.add(function(th, m, e) {
                    m.add({
                        title: "mediamanager.desc",
                        icon: "mediamanager",
                        cmd: "mceMedia"
                    });
                }), !1 !== params.quickmedia && ed.plugins.clipboard && (ed.onGetClipboardContent.add(function(ed, content) {
                    var provider, data, html, text = content["text/plain"] || "";
                    text && (text = new RegExp("^((http|https)://[-!#$%&'*+\\/0-9=?A-Z^_`a-z{|}~;]+.[-!#$%&'*+\\./0-9=?A-Z^_`a-z{|}~;]+)$").exec(text)) && (provider = isSupportedMedia(ed, text = tinymce.trim(text[0]))) && (content["text/plain"] = "", 
                    data = getMediaProps(ed, {
                        src: text
                    }, provider), html = "\x3c!-- x-tinymce/html --\x3e", html += getMediaHtml(ed, tinymce.extend({
                        "data-mce-clipboard-media": text
                    }, data[provider])), content["text/html"] = content["x-tinymce/html"] = html);
                }), ed.onPasteBeforeInsert.add(function(ed, o) {
                    var node = ed.dom.create("div", 0, o.content), media = ed.dom.select("[data-mce-clipboard-media]", node);
                    media.length && (each(media, function(el) {
                        var value = el.getAttribute("data-mce-clipboard-media"), provider = isSupportedMedia(ed, value);
                        provider && (ed.setProgressState(!0), el = self.getAttributes(params.attributes || {}), 
                        (el = getMediaProps(ed, {
                            src: value,
                            attributes: el
                        }, provider))[provider].url = value, getEmbedData(ed, el, provider).then(function(data) {
                            each(ed.dom.select("[data-mce-clipboard-media]", ed.getBody()), function(el) {
                                el.getAttribute("data-mce-clipboard-media") === value && (ed.selection.select(el), 
                                el.removeAttribute("data-mce-clipboard-media"), 
                                insertMedia(ed, data, provider));
                            }), ed.setProgressState(!1);
                        }));
                    }), o.content = ed.serializer.serialize(node, {
                        getInner: 1,
                        forced_root_block: ""
                    }), ed.dom.remove(node));
                }));
            });
        },
        createControl: function(n, cm) {
            var params, html, self = this, ed = this.editor, mediaApi = ed.plugins.media;
            return "mediamanager" !== n ? null : !1 === (params = ed.getParam("mediamanager", {})).quickmedia || !0 === params.basic_dialog ? cm.createButton("mediamanager", {
                title: "mediamanager.desc",
                cmd: "mceMedia"
            }) : (html = '<div class="mceToolbarRow">   <div class="mceToolbarItem mceFlexAuto">       <input type="text" id="' + ed.id + '_media_input" aria-label="' + ed.getLang("mediamanager.src", "URL") + '" />   </div>   <div class="mceToolbarItem">       <button type="button" id="' + ed.id + '_media_submit" class="mceButton mceButtonMedia">           <span class="mceIcon mce_check"></span>       </button>   </div></div>', 
            (n = cm.createSplitButton("mediamanager", {
                title: "mediamanager.desc",
                cmd: "mceMedia",
                max_width: 264,
                onselect: function(node) {
                    "" !== node.value && (node && isMedia(node) ? mediaApi.updateMedia({
                        src: node.value
                    }) : getDataAndInsert(ed, {
                        src: node.value
                    }).then(function() {}));
                }
            })).onRenderMenu.add(function(c, m) {
                var item = m.add({
                    onclick: function(e) {
                        e.preventDefault(), item.setSelected(!1);
                        e = ed.dom.getParent(e.target, ".mceButton");
                        if (e && !e.disabled) {
                            var e = ed.selection.getNode(), value = DOM.getValue(ed.id + "_media_input");
                            if ("" !== value) if (isMedia(e)) mediaApi.updateMedia({
                                src: value
                            }); else {
                                if (mediaApi.isMediaObject(e)) return !1;
                                getDataAndInsert(ed, {
                                    src: value,
                                    attributes: self.getAttributes(params.attributes || {})
                                }).then(function() {});
                            }
                            m.hideMenu();
                        }
                    },
                    html: html
                });
                m.onShowMenu.add(function() {
                    var data = {}, node = ed.selection.getNode();
                    node && isMedia(node) && (data = mediaApi.getMediaData()), window.setTimeout(function() {
                        DOM.get(ed.id + "_media_input").focus();
                    }, 10), DOM.setValue(ed.id + "_media_input", data.src || "");
                });
            }), n);
        },
        getAttributes: function(data) {
            var ed = this.editor;
            return data.style && tinymce.is(data.style, "string") && (data.style = ed.dom.parseStyle(data.style)), 
            data.styles && tinymce.is(data.styles, "object") && (data.style = extend(data.styles, data.style || {})), 
            data.style && (data.style = ed.dom.serializeStyle(data.style)), data;
        },
        insertUploadedFile: function(o) {
            var ed = this.editor, data = this.getUploadConfig();
            if (data && data.filetypes && new RegExp(".(" + data.filetypes.join("|") + ")$", "i").test(o.name)) return data = this.getAttributes(o.attributes || {}), 
            getDataAndInsert(ed, {
                src: o.file,
                attributes: data
            }).then(function() {}), !0;
            return !1;
        },
        getUploadURL: function(file) {
            var ed = this.editor, data = this.getUploadConfig();
            return !!(data && data.filetypes && new RegExp(".(" + data.filetypes.join("|") + ")$", "i").test(file.name)) && ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=mediamanager";
        },
        getUploadConfig: function() {
            return this.editor.getParam("mediamanager", {}).upload || {};
        }
    }), tinymce.PluginManager.add("mediamanager", tinymce.plugins.MediaManagerPlugin);
}();