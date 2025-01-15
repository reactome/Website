/* jce - 2.9.82 | 2024-11-20 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var each = tinymce.each, extend = tinymce.extend, Node = tinymce.html.Node, VK = tinymce.VK, Serializer = tinymce.html.Serializer, DomParser = tinymce.html.DomParser, SaxParser = tinymce.html.SaxParser, DOM = tinymce.DOM, htmlSchema = new tinymce.html.Schema({
        schema: "mixed"
    }), transparentSrc = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    function isNonEditable(ed, node) {
        ed = ed.settings.noneditable_noneditable_class || "mceNonEditable";
        return node.attr ? node.hasClass(ed) : DOM.hasClass(node, ed);
    }
    var alignStylesMap = {
        left: {
            float: "left"
        },
        center: {
            display: "block",
            "margin-left": "auto",
            "margin-right": "auto"
        },
        right: {
            float: "right"
        }
    };
    function isResponsiveMedia(node) {
        var valid, pStyles, nStyles, parent = node.parent;
        if ("div" == parent.name) return valid = !0, pStyles = DOM.parseStyle(parent.attr("style")), 
        nStyles = DOM.parseStyle(node.attr("style")), each({
            "padding-bottom": "56.25%",
            position: "relative"
        }, function(val, key) {
            tinymce.is(pStyles[key]) && pStyles[key] == val || (valid = !1);
        }), each({
            position: "absolute"
        }, function(val, key) {
            tinymce.is(nStyles[key]) && nStyles[key] == val || (valid = !1);
        }), valid;
    }
    function isPreviewMedia(type) {
        return "iframe" == type || "video" == type || "audio" == type;
    }
    function isObjectEmbed(type) {
        return !isPreviewMedia(type);
    }
    function isCenterAligned(style) {
        return "block" == style.display && "auto" == style["margin-left"] && "auto" == style["margin-right"];
    }
    var sandbox_iframes_exclusions = [ "youtube.com", "youtu.be", "vimeo.com", "player.vimeo.com", "dailymotion.com", "embed.music.apple.com", "open.spotify.com", "giphy.com", "dai.ly", "codepen.io", "maps.google.com", "google.com/maps", "docs.google.com", "google.com/docs", "sheets.google.com", "google.com/sheets", "slides.google.com", "google.com/slides", "forms.google.com", "google.com/forms", "canva.com", "slideshare.net", "slides.com", "facebook.com", "instagram.com" ], mediaProviders = {
        youtube: /youtu(\.)?be(.+)?\/(.+)/,
        vimeo: /vimeo(.+)?\/(.+)/,
        dailymotion: /dai\.?ly(motion)?(\.com)?/,
        scribd: /scribd\.com\/(.+)/,
        slideshare: /slideshare\.net\/(.+)\/(.+)/,
        soundcloud: /soundcloud\.com\/(.+)/,
        spotify: /spotify\.com\/(.+)/,
        ted: /ted\.com\/talks\/(.+)/,
        twitch: /twitch\.tv\/(.+)/,
        facebook: /facebook\.com\/(.+)/,
        instagram: /instagram\.com\/(.+)/
    };
    function getMediaProps(ed, data, provider) {
        var id, matches, src, defaultValues = {
            youtube: {
                src: data = data.src || "",
                width: 560,
                height: 315,
                frameborder: 0,
                allowfullscreen: "allowfullscreen",
                allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
                sandbox: !1,
                oembed: !0
            },
            vimeo: {
                src: data,
                width: 560,
                height: 315,
                frameborder: 0,
                allowfullscreen: "allowfullscreen",
                allow: "autoplay; fullscreen",
                sandbox: !1,
                oembed: !0
            },
            dailymotion: {
                src: data,
                width: 640,
                height: 360,
                frameborder: 0,
                allowfullscreen: "allowfullscreen",
                allow: "autoplay; fullscreen",
                sandbox: !1,
                oembed: !0
            },
            video: {
                src: data,
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
                allow: "fullscreen",
                sandbox: !1,
                oembed: !0
            },
            soundcloud: {
                src: "",
                width: "100%",
                height: 400,
                frameborder: 0,
                scrolling: "no",
                allow: "autoplay; fullscreen",
                sandbox: !1,
                oembed: !0
            },
            spotify: {
                src: data,
                width: 300,
                height: 380,
                frameborder: 0,
                allowtransparency: !0,
                allow: "encrypted-media",
                sandbox: !1,
                oembed: !0
            },
            ted: {
                src: "",
                width: 560,
                height: 316,
                frameborder: 0,
                allowfullscreen: "allowfullscreen",
                allow: "fullscreen",
                sandbox: !1,
                oembed: !0
            },
            twitch: {
                src: "",
                width: 500,
                height: 281,
                frameborder: 0,
                allowfullscreen: "allowfullscreen",
                allow: "autoplay; fullscreen",
                sandbox: !1,
                oembed: !0
            },
            instagram: {
                src: "",
                width: 400,
                height: 480,
                frameborder: 0,
                allowfullscreen: "allowfullscreen",
                sandbox: !1,
                oembed: !1
            },
            facebook: {
                src: "",
                frameborder: 0,
                width: 500,
                height: 280,
                allowtransparency: "allowtransparency",
                allowfullscreen: "allowfullscreen",
                scrolling: "no",
                allow: "encrypted-media;fullscreen",
                sandbox: !1,
                oembed: !1
            }
        }, data = data.replace(/[^a-z0-9-_:&;=%\?\[\]\/\.]/gi, "");
        return defaultValues[provider] || (defaultValues[provider] = {}), defaultValues[provider].src = data, 
        "youtube" === provider && (src = data.replace(/youtu(\.)?be([^\/]+)?\/(.+)/, function(a, b, c, d) {
            return d = d.replace(/(watch\?v=|v\/|embed\/)/, ""), b && !c && (c = ".com"), 
            id = d.replace(/([^\?&#]+)/, function($0, $1) {
                return $1;
            }), "youtube" + c + "/embed/" + d;
        }), defaultValues[provider].src = src), "vimeo" === provider && (-1 == data.indexOf("player.vimeo.com/video/") && (src = id = "", 
        matches = /vimeo\.com\/(?:\w+\/){0,3}((?:[0-9]+\b)(?:\/[a-z0-9]+)?)/.exec(data)) && tinymce.is(matches, "array") && (matches = matches[1].split("/"), 
        id = matches[0], 2 == matches.length && (src = matches[1]), data = "https://player.vimeo.com/video/" + id + (src ? "?h=" + src : "")), 
        defaultValues[provider].src = data), "dailymotion" === provider && (id = "", 
        (matches = /dai\.?ly(motion)?(.+)?\/(swf|video)?\/?([a-z0-9]+)_?/.exec(data)) && tinymce.is(matches, "array") && (id = matches.pop()), 
        defaultValues[provider].src = "https://dailymotion.com/embed/video/" + id), 
        "spotify" === provider && (defaultValues[provider].src = data.replace(/open\.spotify\.com\/track\//, "open.spotify.com/embed/track/")), 
        "ted" === provider && (defaultValues[provider].src = data.replace(/www\.ted.com\/talks\//, "embed.ted.com/talks/")), 
        "twitch" === provider && (defaultValues[provider].src = data.replace(/twitch\.tv\//, "player.twitch.tv/?channel=")), 
        "instagram" === provider && (data = (data = data.replace(/\/\?.+$/gi, "")).replace(/\/$/, ""), 
        defaultValues[provider].src = data + "/embed/captioned"), "facebook" === provider && (src = "https://www.facebook.com/plugins/", 
        -1 !== data.indexOf("/videos/") && (src += "video.php?href="), -1 !== data.indexOf("/posts/") && (src += "post.php?href=", 
        defaultValues[provider].height = 247, data = data.replace(/\?.+$/, "")), 
        defaultValues[provider].src = src + encodeURIComponent(data)), defaultValues[provider];
    }
    function updateSandbox(editor, node) {
        var src = node.attr("src");
        if (!node.attr("sandbox")) {
            var defaultAttributes = getMediaProps(0, {
                src: src
            }, isSupportedMedia(editor, src));
            if (!1 === defaultAttributes.sandbox ? node.attr("sandbox", null) : node.attr("sandbox", defaultAttributes.sandbox || ""), 
            isLocalUrl(editor, src)) node.attr("sandbox", null); else if (!1 === editor.getParam("media_iframes_sandbox", !0)) node.attr("sandbox", null); else try {
                var url = new URL(src), host = url.host.toLowerCase(), path = url.pathname.toLowerCase(), site = (host.startsWith("www.") ? host.slice(4) : host) + path;
                sandbox_iframes_exclusions.some(function(value) {
                    value = value.toLowerCase();
                    return 0 === site.indexOf(value) || 0 === host.indexOf(value);
                }) && node.attr("sandbox", null);
            } catch (e) {}
        }
    }
    function isSupportedIframe(editor, url) {
        var value;
        return !!isValidElement(editor, "iframe") && !!url && (editor.settings.media_iframes_allow_local ? isLocalUrl(editor, url) : (value = function(editor, url) {
            var providers = editor.settings.media_iframes_supported_media || Object.keys(mediaProviders), supported = !1;
            "string" == typeof providers && (providers = providers.split(","));
            for (var i = 0; i < providers.length; i++) if (value = providers[i]) {
                var value = value.replace(/\/$/, "");
                if ((mediaProviders[value] || new RegExp(value + "/(.+)/")).test(url)) {
                    supported = mediaProviders[value] ? value : "iframe";
                    break;
                }
            }
            return supported;
        }(editor, url), editor.settings.media_iframes_allow_supported ? !!isLocalUrl(editor, url) || value : value || !0));
    }
    function isValidElement(editor, value) {
        return editor.getParam("media_valid_elements", "", "hash")[value];
    }
    function isSupportedUrl(editor, tag, url) {
        return !editor.settings["media_" + tag + "_allow_local"] || isLocalUrl(editor, url);
    }
    function isSupportedMedia(editor, url) {
        return url = stripQuery(url), /\.(mp4|ogv|ogg|webm)$/.test(url) && isValidElement(editor, "video") && isSupportedUrl(editor, "video", url) ? "video" : /\.(mp3|ogg|webm|wav|m4a|aiff)$/.test(url) && isValidElement(editor, "audio") && isSupportedUrl(editor, "audio", url) ? "audio" : /\.(mov|qt|mpg|mpeg)$/.test(url) && isValidElement(editor, "video") && isSupportedUrl(editor, "video", url) || /\.(divx)$/.test(url) && isValidElement(editor, "video") && isSupportedUrl(editor, "video", url) ? "video" : /\.swf$/.test(url) && isValidElement(editor, "object") && isSupportedUrl(editor, "object", url) || /\.pdf$/.test(url) && isValidElement(editor, "object") && isSupportedUrl(editor, "object", url) ? "object" : !!(editor = isSupportedIframe(editor, url)) && ("string" == typeof editor ? editor : "iframe");
    }
    var isAbsoluteUrl = function(url) {
        return !!url && (0 === url.indexOf("//") || 0 < url.indexOf("://"));
    }, isLocalUrl = function(editor, url) {
        return !isAbsoluteUrl(url) || (editor = editor.documentBaseURI.toRelative(url), 
        !1 === isAbsoluteUrl(editor));
    }, sanitize = function(editor, html) {
        var blocked, writer = new tinymce.html.Writer();
        return new tinymce.html.SaxParser({
            validate: !1,
            allow_conditional_comments: !1,
            special: "script,noscript",
            comment: function(text) {
                writer.comment(text);
            },
            cdata: function(text) {
                writer.cdata(text);
            },
            text: function(text, raw) {
                writer.text(text, raw);
            },
            start: function(name, attrs, empty) {
                if (blocked = !0, "script" !== name && "noscript" !== name && "svg" !== name) {
                    for (var i = attrs.length - 1; 0 <= i; i--) {
                        var attrName = attrs[i].name;
                        0 === attrName.indexOf("on") && (delete attrs.map[attrName], 
                        attrs.splice(i, 1)), "style" === attrName && (attrs[i].value = editor.dom.serializeStyle(editor.dom.parseStyle(attrs[i].value), name));
                    }
                    writer.start(name, attrs, empty), blocked = !1;
                }
            },
            end: function(name) {
                blocked || writer.end(name);
            }
        }, htmlSchema).parse(html), writer.getContent();
    };
    function parseHTML(value) {
        var nodes = [], settings = (new SaxParser({
            start: function(name, attrs) {
                ("source" !== name || !attrs.map) && "param" !== name && "embed" !== name && "track" !== name || nodes.push({
                    name: name,
                    value: attrs.map
                });
            }
        }).parse(value), {
            invalid_elements: "source,param,embed,track",
            forced_root_block: !1,
            verify_html: !0,
            validate: !0
        }), schema = new tinymce.html.Schema(settings), settings = new Serializer(settings, schema).serialize(new DomParser(settings, schema).parse(value));
        return nodes.push({
            name: "html",
            value: settings
        }), nodes;
    }
    function stripQuery(value) {
        return value = value && -1 !== value.indexOf("?") ? value.substring(0, value.indexOf("?")) : value;
    }
    for (var y, ext, lookup = {}, items = "video/divx,divx,application/pdf,pdf,application/x-shockwave-flash,swf swfl,audio/mpeg,mpga mpega mp2 mp3,audio/ogg,ogg spx oga,audio/x-wav,wav,video/mpeg,mpeg mpg mpe,video/mp4,mp4 m4v,video/ogg,ogg ogv,video/webm,webm,video/quicktime,qt mov,video/x-flv,flv,video/3gpp,3gp,video/x-matroska,mkv".split(/,/), i = 0; i < items.length; i += 2) for (ext = items[i + 1].split(/ /), 
    y = 0; y < ext.length; y++) ext[y], items[i];
    each({
        flash: {
            type: "application/x-shockwave-flash"
        },
        quicktime: {
            type: "video/quicktime"
        },
        divx: {
            type: "video/divx"
        },
        video: {
            type: "video/mpeg"
        },
        audio: {
            type: "audio/mpeg"
        },
        iframe: {}
    }, function(value, key) {
        value.name = key, value.classid && (lookup[value.classid] = value), value.type && (lookup[value.type] = value), 
        lookup[key.toLowerCase()] = value;
    });
    var createPlaceholderNode = function(editor, node) {
        var placeHolder = new Node("img", 1);
        return placeHolder.shortEnded = !0, retainAttributesAndInnerHtml(editor, node, placeHolder), 
        placeHolder.attr({
            src: transparentSrc,
            "data-mce-object": node.name
        }), isNonEditable(editor, node) && (placeHolder.attr("contenteditable", "false"), 
        placeHolder.attr("data-mce-resize", "false")), placeHolder;
    };
    function createReplacementNode(editor, node) {
        node = new tinymce.html.Serializer().serialize(node);
        return editor.dom.create("div", {}, node).firstChild;
    }
    function createPreviewNode(editor, node) {
        var name = node.name, msg = (msg = editor.getLang("media.preview_hint", "Click to activate, ALT + Click to toggle placeholder")).replace(/%s/g, "ALT"), src = (node.attr("autoplay") && (node.attr("data-mce-p-autoplay", node.attr("autoplay")), 
        node.attr("autoplay", null)), "iframe" == name && node.attr("src") && (src = node.attr("src"), 
        node.attr("data-mce-p-src", src), node.attr("src", src.replace("autoplay=1", "autoplay=0"))), 
        [ "mce-object-preview", "mce-object-" + name ]), styles = {}, styleVal = editor.dom.parseStyle(node.attr("style"));
        return each([ "width", "height" ], function(key) {
            var val = node.attr(key) || styleVal[key] || "";
            val && !/(%|[a-z]{1,3})$/.test(val) && (val += "px"), styles[key] = val;
        }), each(styleVal, function(value, key) {
            /(margin|float|align)/.test(key) && (styles[key] = value);
        }), isCenterAligned(styleVal) && (src.push("mce-object-preview-center"), 
        delete styles["margin-left"], delete styles["margin-right"]), styleVal.float && (src.push("mce-object-preview-" + styleVal.float), 
        delete styles.float), src = Node.create("span", {
            contentEditable: "false",
            "data-mce-contenteditable": "true",
            "data-mce-object": name,
            class: src.join(" "),
            "aria-details": msg,
            "data-mce-resize": function(node) {
                return "video" === node.name ? "proportional" : "iframe" === node.name ? isSupportedMedia(editor, node.attr("src")) ? "proportional" : "true" : "false";
            }(node),
            style: editor.dom.serializeStyle(styles)
        }), msg = Node.create(name, {
            src: node.attr("src")
        }), retainAttributesAndInnerHtml(editor, node, msg), name = Node.create("span", {
            class: "mce-object-shim"
        }), src.append(msg), src.append(name), src;
    }
    function processNodeAttributes(editor, tag, node) {
        var key, params, attribs = {}, styles = {}, boolAttrs = editor.schema.getBoolAttrs();
        for (key in node.attributes.map) {
            var align, styleObject, value = node.attributes.map[key];
            "src" === key && "img" === node.name || "draggable" === key || "contenteditable" === key || 0 === key.indexOf("on") || 0 === (key = "data-mce-width" !== (key = 0 === key.indexOf("data-mce-p-") ? key.substring(11) : key) && "data-mce-height" !== key ? key : key.substring(9)).indexOf("data-mce-") || "span" == node.name && node.attr("data-mce-object") || !editor.schema.isValid(tag, key) && -1 == key.indexOf("-") || ("class" === key && ((align = value.match(/mce-object-preview-(left|center|right)/)) && (styles = extend(styles, alignStylesMap[align[1]]), 
            node.attr("style") || node.attr("style", editor.dom.serializeStyle(styles))), 
            value = function(value) {
                return value && (value = value.replace(/\s?mce-([\w-]+)/g, "").replace(/\s+/g, " "), 
                value = 0 < (value = tinymce.trim(value)).length ? value : null), 
                value || null;
            }(value)), "style" === key && value && (styleObject = editor.dom.parseStyle(value), 
            each([ "width", "height" ], function(key) {
                var attrValue;
                return "audio" === tag || !styleObject[key] || ((attrValue = tinymce.is(node.attr(key)) ? node.attr(key) : "") && !/\D/.test(attrValue) && (attrValue += "px"), 
                void (attrValue && attrValue == styleObject[key] && delete styleObject[key]));
            }), styleObject = extend(styleObject, styles), value = (value = editor.dom.serializeStyle(styleObject)) || null), 
            "src" !== key && "poster" !== key && "data" !== key || (value = editor.convertURL(value)), 
            boolAttrs[key] && (value = key), attribs[key] = value);
        }
        return node.attr("data") || (params = node.getAll("param")).length && (value = (params = params[0]).attr("src") || params.attr("url") || null) && (attribs.src = editor.convertURL(value), 
        params.remove()), attribs;
    }
    function nodeToMedia(editor, node) {
        var embed, tag = node.attr("data-mce-object"), elm = new Node(tag, 1), attribs = processNodeAttributes(editor, tag, node), node = (/\s*mce-object-preview\s*/.test(node.attr("class")) && node.firstChild && node.firstChild.name === tag && (node = node.firstChild), 
        attribs = extend(attribs, processNodeAttributes(editor, tag, node)), elm.attr(attribs), 
        node.attr("data-mce-html"));
        return node && (node = parseHTML(unescape(node)), each(node, function(child) {
            var inner;
            "html" === child.name ? ((inner = new Node("#text", 3)).raw = !0, inner.value = sanitize(editor, child.value), 
            elm.append(inner)) : ((inner = new Node(child.name, 1)).shortEnded = !0, 
            each(child.value, function(val, key) {
                htmlSchema.isValid(inner.name, key) && inner.attr(key, val);
            }), elm.append(inner), "source" == inner.name && inner.attr("src") == elm.attr("src") && elm.attr("src", null));
        })), elm.attr("data-mce-html", null), "object" === tag && 0 === elm.getAll("embed").length && "application/x-shockwave-flash" != (node = elm.attr("type")) && "application/pdf" != node && ((embed = new Node("embed", 1)).shortEnded = !0, 
        each(attribs, function(value, name) {
            "data" === name && embed.attr("src", value), htmlSchema.isValid("embed", name) && embed.attr(name, value);
        }), elm.append(embed)), "iframe" === tag && updateSandbox(editor, elm), 
        elm;
    }
    function isWithinEmbed(node) {
        for (;node = node.parent; ) if (node.attr("data-mce-object")) return 1;
    }
    function placeHolderConverter(editor) {
        return function(nodes) {
            for (var node, i = nodes.length, media_live_embed = editor.settings.media_live_embed; i--; ) if ((node = nodes[i]).parent && !node.parent.attr("data-mce-object")) {
                if ("iframe" === node.name) if (node.attr("src")) {
                    if (!1 === function(editor, node) {
                        var src = node.attr("src");
                        return !!isNonEditable(editor, node) || isSupportedIframe(editor, src);
                    }(editor, node)) {
                        node.remove();
                        continue;
                    }
                } else media_live_embed = !1;
                if (isValidElement(editor, node.name) || isNonEditable(editor, node)) {
                    if ("iframe" !== node.name) {
                        var sources, src = node.attr("src") || node.attr("data") || "";
                        if (src || "video" !== node.name && "audio" !== node.name || (sources = node.getAll("source")).length && (src = sources[0].attr("src")), 
                        src && !isSupportedUrl(editor, node.name, src)) {
                            node.remove();
                            continue;
                        }
                        if (src || (media_live_embed = !1), !1 !== editor.settings.strict_media_embeds) {
                            if (node.name = isSupportedMedia(editor, src), !node.name) {
                                node.remove();
                                continue;
                            }
                            node.attr("src", src);
                        }
                    }
                    !media_live_embed || isObjectEmbed(node.name) || isResponsiveMedia(node) || isNonEditable(editor, node) ? isWithinEmbed(node) || (isResponsiveMedia(node) && node.parent.attr({
                        contentEditable: "false",
                        "data-mce-contenteditable": "true"
                    }), node.replace(createPlaceholderNode(editor, node))) : isWithinEmbed(node) || node.replace(createPreviewNode(editor, node));
                } else node.remove();
            }
        };
    }
    var retainAttributesAndInnerHtml = function(editor, sourceNode, targetNode) {
        var attrName, attrValue, attribs, ai, innerHtml, boolAttrs = editor.schema.getBoolAttrs(), src = sourceNode.attr("src"), style = (src && (defaultAttributes = getMediaProps(0, {
            src: src
        }, isSupportedMedia(editor, src)), each(defaultAttributes, function(val, name) {
            tinymce.is(sourceNode.attr(name)) || name in boolAttrs || sourceNode.attr(name, val);
        }), updateSandbox(editor, sourceNode)), editor.dom.parseStyle(sourceNode.attr("style"))), defaultAttributes = sourceNode.attr("width") || style.width || "", height = sourceNode.attr("height") || style.height || "", style = editor.dom.parseStyle(sourceNode.attr("style"));
        for (each([ "bgcolor", "align", "border", "vspace", "hspace" ], function(na) {
            var v = sourceNode.attr(na);
            if (v) {
                switch (na) {
                  case "bgcolor":
                    style["background-color"] = v;
                    break;

                  case "align":
                    /^(left|right)$/.test(v) ? style.float = v : style["vertical-align"] = v;
                    break;

                  case "vspace":
                    style["margin-top"] = v, style["margin-bottom"] = v;
                    break;

                  case "hspace":
                    style["margin-left"] = v, style["margin-right"] = v;
                    break;

                  default:
                    style[na] = v;
                }
                sourceNode.attr(na, null);
            }
        }), ai = (attribs = sourceNode.attributes).length; ai--; ) attrName = attribs[ai].name, 
        attrValue = attribs[ai].value, "data-mce-html" === attrName || "data-mce-clipboard-media" === attrName ? targetNode.attr(attrName, attrValue) : -1 !== attrName.indexOf("data-mce") && -1 === attrName.indexOf("data-mce-p-") || (-1 !== (attrName = 0 === (attrName = "img" !== targetNode.name || htmlSchema.isValid("img", attrName) && "src" != attrName ? attrName : "data-mce-p-" + attrName).indexOf("on") && editor.settings.allow_event_attributes ? "data-mce-p-" + attrName : attrName).indexOf("-") ? targetNode.attr(attrName, attrValue) : (htmlSchema.isValid(targetNode.name, attrName) && targetNode.attr(attrName, attrValue), 
        tinymce.is(boolAttrs[attrName]) && "false" == attrValue && targetNode.attr(attrName, null), 
        "sandbox" == attrName && !1 === attrValue && targetNode.attr(attrName, null)));
        defaultAttributes && !style.width && (style.width = /^[0-9.]+$/.test(defaultAttributes) ? defaultAttributes + "px" : defaultAttributes), 
        height && !style.height && (style.height = /^[0-9.]+$/.test(height) ? height + "px" : height);
        var agent, defaultAttributes = [], height = (sourceNode.attr("class") && (defaultAttributes = sourceNode.attr("class").replace(/mce-(\S+)/g, "").replace(/\s+/g, " ").trim().split(" ")), 
        lookup[sourceNode.attr("type")] || lookup[sourceNode.attr("classid")] || {
            name: sourceNode.name
        });
        defaultAttributes.push("mce-object mce-object-" + height.name), "audio" == sourceNode.name && (agent = navigator.userAgent.match(/(Chrome|Safari|Gecko)/)) && defaultAttributes.push("mce-object-agent-" + agent[0].toLowerCase()), 
        targetNode.attr("class", tinymce.trim(defaultAttributes.join(" "))), (agent = editor.dom.serializeStyle(style)) && targetNode.attr("style", agent), 
        src || (defaultAttributes = sourceNode.getAll("source")).length && (agent = defaultAttributes[0], 
        src = "src", "img" === targetNode.name && (src = "data-mce-p-" + src), targetNode.attr(src, agent.attr("src"))), 
        "object" === sourceNode.name && (sourceNode.attr("data") || (defaultAttributes = sourceNode.getAll("param"), 
        each(defaultAttributes, function(param) {
            if ("src" === param.attr("name") || "url" === param.attr("name")) return targetNode.attr({
                "data-mce-p-data": param.attr("value")
            }), !1;
        })), targetNode.attr("data-mce-p-type", height.type)), (innerHtml = sourceNode.firstChild ? new tinymce.html.Serializer({
            inner: !0
        }).serialize(sourceNode) : innerHtml) && (targetNode.attr("data-mce-html", escape(sanitize(editor, innerHtml))), 
        targetNode.empty());
    };
    function htmlToData(ed, mediatype, html) {
        var data = {
            innerHTML: ""
        };
        try {
            html = unescape(html);
        } catch (e) {}
        html = parseHTML(html);
        return each(html, function(node, i) {
            var val;
            "source" == node.name && (data.source || (data.source = []), val = ed.convertURL(node.value.src), 
            data.source.push(val)), "param" == node.name && (val = node.value.name, 
            -1 !== tinymce.inArray([ "src", "data", "movie", "url", "source" ], val) && (node.value.value = ed.convertURL(node.value.value)), 
            data[node.value.name] = node.value.value), "track" == node.name && (data.innerHTML += ed.dom.createHTML(node.name, node.value)), 
            "html" == node.name && (data.innerHTML += node.value);
        }), data;
    }
    function updateMedia(ed, data, elm) {
        var preview, attribs = {}, node = ed.dom.getParent(elm || ed.selection.getNode(), "[data-mce-object]"), boolAttrs = ed.schema.getBoolAttrs(), nodeName = node.nodeName.toLowerCase(), elm = (each([ "block", "center", "left", "right" ], function(val) {
            ed.dom.removeClass(node, "mce-object-preview-" + val);
        }), -1 !== node.className.indexOf("mce-object-preview") && (nodeName = (preview = node).getAttribute("data-mce-object"), 
        node = ed.dom.select(nodeName, node)[0]), preview && preview.removeAttribute("style"), 
        each(data, function(value, name) {
            return "innerHTML" === name && value ? (attribs["data-mce-html"] = escape(value), 
            !0) : "img" !== nodeName && !htmlSchema.isValid(nodeName, name) || (tinymce.is(boolAttrs[name]) && !value && (value = null, 
            "autoplay" == name) && (attribs["data-mce-p-" + name] = null), "img" !== nodeName || htmlSchema.isValid(nodeName, name) && "src" !== name || null === value ? ("iframe" == nodeName && "src" == name && (value = (attribs["data-mce-p-" + name] = value).replace("autoplay=1", "autoplay=1")), 
            "class" == name && value ? (ed.dom.addClass(node, value), !0) : "style" == name && value ? (ed.dom.setStyles(node, ed.dom.parseStyle(value)), 
            !0) : void (attribs[name] = value = "sandbox" == name && !1 === value ? null : value)) : (attribs["data-mce-p-" + name] = value, 
            !0));
        }), ed.dom.setAttribs(node, attribs), ed.dom.parseStyle(node.getAttribute("style")));
        preview && (isCenterAligned(elm) && ed.dom.addClass(preview, "mce-object-preview-center"), 
        elm.float) && ed.dom.addClass(preview, "mce-object-preview-" + elm.float), 
        each([ "width", "height" ], function(key) {
            attribs[key] && (ed.dom.setStyle(node, key, attribs[key]), preview) && ed.dom.setStyle(preview, key, attribs[key]);
        });
    }
    tinymce.PluginManager.add("media", function(ed, url) {
        var custom_sandbox_iframes_exclusions = ed.getParam("media_iframes_sandbox_exclusions", []);
        function isMediaObject(node) {
            return node = node || ed.selection.getNode(), ed.dom.getParent(node, "[data-mce-object]");
        }
        function isMediaNode(node) {
            return node && isMediaObject(node);
        }
        function findMediaNode(elm, nodeName) {
            nodeName = ed.dom.select(nodeName, elm);
            return nodeName.length ? nodeName[0] : null;
        }
        function objectActivate(ed, e) {
            var node = isMediaObject(e.target);
            node && !isNonEditable(ed, node) && (ed.selection.select(node), ed.dom.getAttrib(node, "data-mce-selected") && node.setAttribute("data-mce-selected", "2"), 
            "mousedown" === e.type && e.altKey && "IMG" !== node.nodeName && (e.target = function(editor, node) {
                var ifr = new tinymce.html.DomParser({}, editor.schema).parse(node.innerHTML).firstChild, ifr = createReplacementNode(editor, createPlaceholderNode(editor, ifr));
                return editor.dom.replace(ifr, node), ifr;
            }(ed, node)), e.stopImmediatePropagation(), e.preventDefault());
        }
        function setClipboardData(ed, e) {
            var node, e = e.clipboardData;
            e && (node = isMediaObject()) && (isNonEditable(ed, node) ? e.clearData() : (ed.selection.select(node), 
            ed = {
                html: node = ed.selection.getContent({
                    contextual: !0
                }),
                text: node.toString()
            }, e.clearData(), e.setData("text/html", ed.html), e.setData("text/plain", ed.text)));
        }
        function updatePreviewSelection(ed) {
            each(ed.dom.select(".mce-object-preview", ed.getBody()), function(node) {
                !ed.dom.isBlock(node.parentNode) || node.previousSibling || node.nextSibling || ed.dom.insertAfter(ed.dom.create("br", {
                    "data-mce-bogus": 1
                }), node);
            });
        }
        sandbox_iframes_exclusions = sandbox_iframes_exclusions.concat(custom_sandbox_iframes_exclusions), 
        ed.onMouseDown.add(objectActivate), ed.onKeyDown.add(objectActivate), ed.onNodeChange.addToTop(function(ed, cm, n, collapsed, o) {
            !isMediaNode(n) || isNonEditable(ed, n) || o.contenteditable || (o.contenteditable = !0);
        }), ed.onPreInit.add(function() {
            ed.onUpdateMedia.add(function(ed, o) {
                o.before && o.after && isSupportedMedia(ed, o.before) && each(ed.dom.select("video.mce-object, audio.mce-object, iframe.mce-object, img.mce-object"), function(elm) {
                    var html, src = elm.getAttribute("src");
                    "IMG" === elm.nodeName && (src = elm.getAttribute("data-mce-p-src")), 
                    "VIDEO" !== elm.nodeName && "AUDIO" !== elm.nodeName || ((html = elm.getAttribute("data-mce-html")) && (html = ed.dom.create(elm.nodeName, {}, unescape(html)), 
                    each(html.childNodes, function(el) {
                        "SOURCE" == el.nodeName && el.getAttribute("src") == o.before && el.setAttribute("src", o.after);
                    }), elm.setAttribute("data-mce-html", escape(html.innerHTML))), 
                    (html = elm.getAttribute("poster")) && html == o.before && elm.setAttribute("poster", o.after)), 
                    src == o.before && updateMedia(ed, {
                        src: o.after
                    }, elm);
                });
            }), "html4" === ed.settings.schema && (ed.schema.addValidElements("iframe[longdesc|name|src|frameborder|marginwidth|marginheight|scrolling|align|width|height|allowfullscreen|seamless|*]"), 
            ed.schema.addValidElements("video[src|autobuffer|autoplay|loop|controls|width|height|poster|*],audio[src|autobuffer|autoplay|loop|controls|*],source[src|type|media|*],embed[src|type|width|height|*]")), 
            ed.parser.addNodeFilter("iframe,video,audio,object,embed", placeHolderConverter(ed)), 
            ed.serializer.addAttributeFilter("data-mce-object", function(nodes, name) {
                for (var node, i = nodes.length; i--; ) (node = nodes[i]).parent && !function(editor, node) {
                    editor = nodeToMedia(editor, node);
                    isObjectEmbed(editor.name) || node.empty(), node.replace(editor), 
                    node.empty();
                }(ed, node);
            }), ed.dom.bind(ed.getDoc(), "touchstart", function(e) {
                objectActivate(ed, e);
            });
        }), ed.onInit.add(function() {
            var settings = ed.settings;
            each([ "left", "right", "center" ], function(align) {
                ed.formatter.register("align" + align, {
                    selector: "span[data-mce-object]",
                    collapsed: !1,
                    ceFalseOverride: !0,
                    classes: "mce-object-preview-" + align,
                    deep: !0,
                    onremove: function(elm) {
                        each([ "left", "right", "center" ], function(val) {
                            ed.dom.removeClass(elm, "mce-object-preview-" + val);
                        });
                    }
                });
            }), ed.theme.onResolveName.add(function(theme, o) {
                var name, node = ed.dom.getParent(o.node, "[data-mce-object]");
                node && (name = node.getAttribute("data-mce-object"), o.node !== node ? o.name = "" : ("IMG" !== node.nodeName && (node = ed.dom.select("iframe,audio,video", node), 
                node = ed.dom.getAttrib(node, "src") || ed.dom.getAttrib(node, "data-mce-p-src") || "") && (node = isSupportedMedia(ed, node) || "") && (name = node[0].toUpperCase() + node.slice(1)), 
                o.name = name = "object" === name ? "media" : name));
            }), ed.onObjectResized.add(function(ed, elm, width, height) {
                isMediaNode(elm) && (ed.dom.hasClass(elm, "mce-object-preview") && (ed.dom.setStyles(elm, {
                    width: "",
                    height: ""
                }), elm = elm.firstChild), ed.dom.setAttrib(elm, "data-mce-width", width), 
                ed.dom.setAttrib(elm, "data-mce-height", height), ed.dom.removeAttrib(elm, "width"), 
                ed.dom.removeAttrib(elm, "height"), ed.dom.setStyles(elm, {
                    width: width,
                    height: height
                }));
            }), ed.dom.bind(ed.getDoc(), "keyup click", function(e) {
                var node = ed.selection.getNode();
                node.hasAttribute("data-mce-object") && (each(ed.dom.select(".mce-object-preview video, .mce-object-preview audio"), function(elm) {
                    elm.pause();
                }), node) && "IMG" === node.nodeName && "object" !== node.getAttribute("data-mce-object") && !isNonEditable(ed, node) && "click" === e.type && e.altKey && (e.target = function(editor, node) {
                    for (var name, placeholder = new Node("img", 1), attributes = (placeholder.shortEnded = !0, 
                    node.attributes), i = attributes.length; i--; ) name = attributes[i].nodeName, 
                    placeholder.attr(name, "" + node.getAttribute(name));
                    var elm = nodeToMedia(editor, placeholder), elm = createReplacementNode(editor, createPreviewNode(editor, elm));
                    return editor.dom.replace(elm, node), elm;
                }(ed, node));
            }), ed.onBeforeExecCommand.add(function(ed, cmd, ui, values, o) {
                var range;
                !cmd || "ApplyFormat" != cmd && "RemoveFormat" != cmd && "ToggleFormat" != cmd || (cmd = ed.selection.getNode(), 
                isMediaNode(cmd = tinymce.is(values, "object") && values.node ? values.node : cmd) && "IMG" !== cmd.nodeName && ((cmd = findMediaNode(cmd, cmd.getAttribute("data-mce-object"))) && ((range = ed.dom.createRng()).setStart(cmd, 0), 
                range.setEnd(cmd, 0), (ed = ed.selection.getSel()).removeAllRanges(), 
                ed.addRange(range)), cmd) && tinymce.is(values, "object") && (values.node = cmd));
            }), ed.selection.onBeforeSetContent.add(function(ed, o) {
                settings.media_live_embed && (o.content = o.content.replace(/<br data-mce-caret="1"[^>]+>/gi, ""), 
                /^<(iframe|video|audio)([^>]+)><\/(iframe|video|audio)>$/.test(o.content)) && (o.content += '<br data-mce-caret="1" />');
            });
        }), ed.onKeyDown.add(function(ed, e) {
            var node = ed.selection.getNode();
            e.keyCode !== VK.BACKSPACE && e.keyCode !== VK.DELETE || node && isMediaNode(node = node === ed.getBody() ? e.target : node) && (isNonEditable(ed, node) ? e.preventDefault() : (node = ed.dom.getParent(node, "[data-mce-object]") || node, 
            ed.dom.remove(node), ed.nodeChanged()));
        }), ed.onCopy.add(setClipboardData), ed.onCut.add(setClipboardData), ed.onSetContent.add(function(ed, o) {
            updatePreviewSelection(ed);
        }), ed.onWfEditorSave.add(function(ed, o) {
            var body = DOM.create("div", {}, o.content);
            each(DOM.select("audio,video,object,iframe,embed", body), function(tag) {
                var name = tag.nodeName.toLowerCase();
                isValidElement(ed, name) || isNonEditable(ed, tag) || DOM.remove(tag);
            }), o.content = body.innerHTML;
        }), tinymce.util.MediaEmbed = {
            dataToHtml: function(name, data, innerHtml) {
                var html = "";
                return html = "iframe" !== name && "video" !== name && "audio" !== name ? html : "string" == typeof data ? data : ed.dom.createHTML(name, data, innerHtml);
            }
        }, ed.addCommand("insertMediaHtml", function(ui, value) {
            var data = {}, name = "iframe", innerHtml = "", value = ("string" == typeof value ? data = value : value.name && value.data && (name = value.name, 
            data = value.data, innerHtml = value.innerHtml || ""), tinymce.util.MediaEmbed.dataToHtml(name, data, innerHtml));
            ed.execCommand("mceInsertContent", !1, value, {
                skip_undo: 1
            }), updatePreviewSelection(ed), ed.undoManager.add();
        }), extend(this, {
            getMediaData: function() {
                return function(ed) {
                    var data = {}, node = ed.dom.getParent(ed.selection.getNode(), "[data-mce-object]"), boolAttrs = ed.schema.getBoolAttrs();
                    if (node && 1 == node.nodeType) {
                        if (-1 !== node.className.indexOf("mce-object-preview")) {
                            for (i = (attribs = node.attributes).length - 1; 0 <= i; i--) "contenteditable" != (name = attribs.item(i).name) && -1 == name.indexOf("data-mce-") && -1 == name.indexOf("aria-") && (data[name] = ed.dom.getAttrib(node, name));
                            node = ed.dom.select("audio,video,iframe", node)[0];
                        }
                        var i, attribs, mediatype = node.getAttribute("data-mce-object") || node.nodeName.toLowerCase(), html = ed.dom.getAttrib(node, "data-mce-html");
                        for ((data = html ? extend(data, htmlToData(ed, 0, html)) : data).src = ed.dom.getAttrib(node, "data-mce-p-src") || ed.dom.getAttrib(node, "data-mce-p-data") || ed.dom.getAttrib(node, "src"), 
                        data.src = ed.convertURL(data.src), data.src == transparentSrc && (data.src = ""), 
                        i = (attribs = node.attributes).length - 1; 0 <= i; i--) {
                            var value, name = attribs.item(i).name;
                            value = ed.dom.getAttrib(node, name), "data" !== (name = -1 !== name.indexOf("data-mce-p-") ? name.substr(11) : name) && "src" !== name && "type" !== name && "codebase" !== name && "classid" !== name && ("poster" === name && (value = ed.convertURL(value)), 
                            "flashvars" === name && (value = decodeURIComponent(value)), 
                            -1 === name.indexOf("data-mce-")) && (boolAttrs[name] && (value = !0), 
                            data[name] = value);
                        }
                        data.mediatype = mediatype;
                    }
                    return data;
                }(ed);
            },
            getMediaProps: function(data, provider) {
                return getMediaProps(0, data, provider);
            },
            updateMedia: function(data) {
                return updateMedia(ed, data);
            },
            isMediaObject: isMediaObject,
            isSupportedMedia: function(url) {
                return isSupportedMedia(ed, url);
            },
            getMediaHtml: function(data) {
                return function(ed, value) {
                    var nodeName = "iframe", attribs = {}, innerHTML = "", src = stripQuery((value = "string" == typeof value ? {
                        src: value
                    } : value).src), boolAttrs = (/\.(mp4|m4v|ogg|webm|ogv)$/.test(src) ? nodeName = "video" : /\.(mp3|m4a|oga)$/.test(src) && (nodeName = "audio"), 
                    nodeName = value.mediatype || nodeName, ed.schema.getBoolAttrs());
                    return each(value, function(val, name) {
                        if ("" == val && !boolAttrs[name]) return !0;
                        value.innerHTML && (innerHTML = value.innerHTML), !ed.schema.isValid(nodeName, name) && -1 === name.indexOf("-") || ("class" == name && (val = val.replace(/mce-(\S+)/g, "").replace(/\s+/g, " ").trim()), 
                        attribs[name] = val);
                    }), "iframe" != nodeName || attribs.sandbox || (attribs.sandbox = ""), 
                    ed.dom.createHTML(nodeName, attribs, innerHTML);
                }(ed, data);
            },
            isMediaHtml: function(html) {
                return !!(html = html.trim().match(/^<([a-zA-Z0-9]+)\b/)) && isPreviewMedia(html[1].toLowerCase());
            }
        });
    });
}();