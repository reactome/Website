/* jce - 2.9.63 | 2024-03-11 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var each = tinymce.each, Node = tinymce.html.Node, VK = tinymce.VK, DomParser = tinymce.html.DomParser, Serializer = tinymce.html.Serializer, SaxParser = tinymce.html.SaxParser;
    function createTextNode(value, raw) {
        var text = new Node("#text", 3);
        return text.raw = !1 !== raw, text.value = value, text;
    }
    tinymce.create("tinymce.plugins.CodePlugin", {
        init: function(ed, url) {
            this.editor = ed, this.url = url;
            var blockElements = [], htmlSchema = new tinymce.html.Schema({
                schema: "mixed",
                invalid_elements: ed.settings.invalid_elements
            }), xmlSchema = new tinymce.html.Schema({
                verify_html: !1
            }), code_blocks = !1 !== ed.settings.code_use_blocks;
            function processOnInsert(value) {
                return /\{.+\}/gi.test(value) && ed.settings.code_protect_shortcode && (value = processShortcode(value, void 0)), 
                ed.settings.code_allow_custom_xml && (value = processXML(value)), 
                value = /<(\?|script|style)/.test(value) ? processPhp(value = value.replace(/<(script|style)([^>]*?)>([\s\S]*?)<\/\1>/gi, function(match, type) {
                    return ed.getParam("code_allow_" + type) ? createCodePre(match = match.replace(/<br[^>]*?>/gi, "\n"), type) : "";
                })) : value;
            }
            function processShortcode(html, tagName) {
                return -1 === html.indexOf("{") || "{" == html.charAt(0) && html.length < 3 ? html : (-1 != html.indexOf("{/source}") && (html = function(html) {
                    return -1 !== html.indexOf("{/source}") ? html.replace(/(?:(<(code|pre|samp|span)[^>]*(data-mce-type="code")?>|")?)\{source(.*?)\}([\s\S]+?)\{\/source\}/g, function(match) {
                        return "<" === match.charAt(0) || '"' === match.charAt(0) ? match : (match = ed.dom.decode(match), 
                        '<pre data-mce-code="shortcode" data-mce-label="sourcerer">' + ed.dom.encode(match) + "</pre>");
                    }) : html;
                }(html)), tagName = tagName || "span", html.replace(/(?:(<(code|pre|samp|span)[^>]*(data-mce-type="code")?>)?)(?:\{)([\w-]+)(.*?)(?:\/?\})(?:([\s\S]+?)\{\/\4\})?/g, function(match) {
                    return "<" === match.charAt(0) ? match : (match = match, tag = tagName, 
                    match = (match = ed.dom.decode(match)).replace(/[\n\r]/gi, "<br />"), 
                    ed.dom.createHTML(tag || "pre", {
                        "data-mce-code": "shortcode",
                        "data-mce-type": "code"
                    }, ed.dom.encode(match)));
                    var tag;
                }));
            }
            function processPhp(content) {
                return ed.settings.code_allow_php ? (content = content.replace(/\="([^"]+?)"/g, function(a, b) {
                    return '="' + (b = b.replace(/<\?(php)?(.+?)\?>/gi, function(x, y, z) {
                        return "[php:start]" + ed.dom.encode(z) + "[php:end]";
                    })) + '"';
                }), (content = (content = /<textarea/.test(content) ? content.replace(/<textarea([^>]*)>([\s\S]*?)<\/textarea>/gi, function(a, b, c) {
                    return "<textarea" + b + ">" + (c = c.replace(/<\?(php)?(.+?)\?>/gi, function(x, y, z) {
                        return "[php:start]" + ed.dom.encode(z) + "[php:end]";
                    })) + "</textarea>";
                }) : content).replace(/<([^>]+)<\?(php)?(.+?)\?>([^>]*?)>/gi, function(a, b, c, d, e) {
                    return " " !== b.charAt(b.length) && (b += " "), "<" + b + 'data-mce-php="' + d + '" ' + e + ">";
                })).replace(/<\?(php)?([\s\S]+?)\?>/gi, function(match) {
                    return createCodePre(match = match.replace(/\n/g, "<br />"), "php", "span");
                })) : content.replace(/<\?(php)?([\s\S]*?)\?>/gi, "");
            }
            function isXmlElement(name) {
                return !htmlSchema.isValid(name) && !function(name) {
                    var invalid_elements = ed.settings.invalid_elements.split(",");
                    return -1 !== tinymce.inArray(invalid_elements, name);
                }(name);
            }
            function processXML(content) {
                return content.replace(/<([a-z0-9\-_\:\.]+)(?:[^>]*?)\/?>((?:[\s\S]*?)<\/\1>)?/gi, function(match, tag) {
                    var html;
                    return ("svg" !== tag || !1 !== ed.settings.code_allow_svg_in_xml) && ("math" !== tag || !1 !== ed.settings.code_allow_mathml_in_xml) && isXmlElement(tag) ? (!1 !== ed.settings.code_validate_xml && (tag = match, 
                    html = [], new SaxParser({
                        start: function(name, attrs, empty) {
                            if (isValid(name)) {
                                var attr;
                                if (html.push("<", name), attrs) for (var i = 0, len = attrs.length; i < len; i++) !isValid(name, (attr = attrs[i]).name) || !0 !== ed.settings.allow_event_attributes && 0 === attr.name.indexOf("on") || html.push(" ", attr.name, '="', ed.dom.encode("" + attr.value, !0), '"');
                                html[html.length] = empty ? " />" : ">";
                            }
                        },
                        text: function(value) {
                            0 < value.length && (html[html.length] = value);
                        },
                        end: function(name) {
                            isValid(name) && html.push("</", name, ">");
                        },
                        cdata: function(text) {
                            html.push("<![CDATA[", text, "]]>");
                        },
                        comment: function(text) {
                            html.push("\x3c!--", text, "--\x3e");
                        }
                    }, xmlSchema).parse(tag), match = html.join("")), createCodePre(match, "xml")) : match;
                    function isValid(tag, attr) {
                        return isXmlElement(tag) || ed.schema.isValid(tag, attr);
                    }
                });
            }
            function createCodePre(data, type, tag) {
                return !1 === code_blocks ? (data = data.replace(/<br[^>]*?>/gi, "\n"), 
                ed.dom.createHTML("img", {
                    src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                    "data-mce-resize": "false",
                    "data-mce-code": type || "script",
                    "data-mce-type": "placeholder",
                    "data-mce-value": escape(data)
                })) : ed.dom.createHTML(tag || "pre", {
                    "data-mce-code": type || "script",
                    "data-mce-type": "code"
                }, ed.dom.encode(data));
            }
            function handleEnterInPre(ed, node, before) {
                var node = ed.dom.getParents(node, blockElements.join(",")), newBlockName = ed.settings.forced_root_block || "p", node = (!1 === ed.settings.force_block_newlines && (newBlockName = "br"), 
                node.shift());
                node !== ed.getBody() && (newBlockName = ed.dom.create(newBlockName, {}, "\xa0"), 
                before ? node.parentNode.insertBefore(newBlockName, node) : ed.dom.insertAfter(newBlockName, node), 
                (before = ed.selection.getRng()).setStart(newBlockName, 0), before.setEnd(newBlockName, 0), 
                ed.selection.setRng(before), ed.selection.scrollIntoView(newBlockName));
            }
            ed.settings.code_allow_script && (ed.settings.allow_script_urls = !0), 
            ed.addCommand("InsertShortCode", function(ui, html) {
                return ed.settings.code_protect_shortcode && (html = processShortcode(html, "pre"), 
                tinymce.is(html)) && ed.execCommand("mceReplaceContent", !1, html), 
                !1;
            }), ed.onKeyDown.add(function(ed, e) {
                var node;
                e.keyCode == VK.ENTER && "SPAN" === (node = ed.selection.getNode()).nodeName && node.getAttribute("data-mce-code") && (handleEnterInPre(ed, node), 
                e.preventDefault()), e.keyCode == VK.UP && e.altKey && "PRE" == (node = ed.selection.getNode()).nodeName && (handleEnterInPre(ed, node, !0), 
                e.preventDefault()), 9 != e.keyCode || VK.metaKeyPressed(e) || "PRE" === (node = ed.selection.getNode()).nodeName && node.getAttribute("data-mce-code") && (ed.selection.setContent("\t", {
                    no_events: !0
                }), e.preventDefault()), e.keyCode !== VK.BACKSPACE && e.keyCode !== VK.DELETE || "SPAN" === (node = ed.selection.getNode()).nodeName && node.getAttribute("data-mce-code") && "placeholder" === node.getAttribute("data-mce-type") && (ed.undoManager.add(), 
                ed.dom.remove(node), e.preventDefault());
            }), ed.onPreInit.add(function() {
                function isCodePlaceholder(node) {
                    return "SPAN" === node.nodeName && node.getAttribute("data-mce-code") && "placeholder" == node.getAttribute("data-mce-type");
                }
                !1 !== ed.settings.content_css && ed.dom.loadCSS(url + "/css/content.css"), 
                ed.dom.bind(ed.getDoc(), "keyup click", function(e) {
                    var node = e.target, sel = ed.selection.getNode();
                    ed.dom.removeClass(ed.dom.select(".mce-item-selected"), "mce-item-selected"), 
                    node === ed.getBody() && isCodePlaceholder(sel) ? sel.parentNode !== node || sel.nextSibling || ed.dom.insertAfter(ed.dom.create("br", {
                        "data-mce-bogus": 1
                    }), sel) : isCodePlaceholder(node) && (e.preventDefault(), e.stopImmediatePropagation(), 
                    ed.selection.select(node), window.setTimeout(function() {
                        ed.dom.addClass(node, "mce-item-selected");
                    }, 10), e.preventDefault());
                });
                var ctrl = ed.controlManager.get("formatselect");
                ctrl && each([ "script", "style", "php", "shortcode", "xml" ], function(key) {
                    var title = ed.getLang("code." + key, key);
                    if ("shortcode" === key && ed.settings.code_protect_shortcode) return ctrl.add(title, key, {
                        class: "mce-code-" + key
                    }), ed.formatter.register("shortcode", {
                        block: "pre",
                        attributes: {
                            "data-mce-code": "shortcode"
                        }
                    }), !0;
                    "xml" === key && (ed.settings.code_allow_xml = !!ed.settings.code_allow_custom_xml), 
                    ed.getParam("code_allow_" + key) && code_blocks && (ctrl.add(title, key, {
                        class: "mce-code-" + key
                    }), ed.formatter.register(key, {
                        block: "pre",
                        attributes: {
                            "data-mce-code": key
                        },
                        onformat: function(elm, fmt, vars) {
                            each(ed.dom.select("br", elm), function(br) {
                                ed.dom.replace(ed.dom.doc.createTextNode("\n"), br);
                            });
                        }
                    }));
                }), each(ed.schema.getBlockElements(), function(block, blockName) {
                    blockElements.push(blockName);
                }), ed.settings.code_protect_shortcode && (ed.textpattern.addPattern({
                    start: "{",
                    end: "}",
                    cmd: "InsertShortCode",
                    remove: !0
                }), ed.textpattern.addPattern({
                    start: " {",
                    end: "}",
                    format: "inline-shortcode",
                    remove: !1
                })), ed.formatter.register("inline-shortcode", {
                    inline: "span",
                    attributes: {
                        "data-mce-code": "shortcode"
                    }
                }), ed.selection.onSetContent.add(function(sel, o) {
                    each(ed.dom.select("pre[data-mce-code]", ed.getBody()), function(elm) {
                        elm = ed.dom.getParent(elm, "p");
                        elm && 1 === elm.childNodes.length && ed.dom.remove(elm, 1);
                    });
                }), ed.parser.addNodeFilter("script,style,noscript", function(nodes) {
                    for (var node, pre, text, value, placeholder, i = nodes.length; i--; ) (node = nodes[i]).firstChild && (node.firstChild.value = node.firstChild.value.replace(/<span([^>]+)>([\s\S]+?)<\/span>/gi, function(match, attr, content) {
                        return -1 === attr.indexOf("data-mce-code") ? match : ed.dom.decode(content);
                    })), code_blocks ? (value = new Serializer({
                        validate: !1
                    }).serialize(node), value = tinymce.trim(value), (pre = new Node("pre", 1)).attr({
                        "data-mce-code": node.name
                    }), text = createTextNode(value, !1), pre.append(text), node.replace(pre)) : (value = "", 
                    node.firstChild && (value = tinymce.trim(node.firstChild.value)), 
                    placeholder = Node.create("img", {
                        src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                        "data-mce-code": node.name,
                        "data-mce-type": "placeholder",
                        "data-mce-resize": "false",
                        title: ed.dom.encode(value)
                    }), each(node.attributes, function(attr) {
                        placeholder.attr("data-mce-p-" + attr.name, attr.value);
                    }), value && placeholder.attr("data-mce-value", escape(value)), 
                    node.replace(placeholder));
                }), ed.parser.addAttributeFilter("data-mce-code", function(nodes, name) {
                    var node, i = nodes.length;
                    function isBlockNode(node) {
                        return -1 != tinymce.inArray(blockElements, node.name);
                    }
                    for (;i--; ) {
                        var type, parent = (node = nodes[i]).parent;
                        "placeholder" == node.attr("data-mce-type") || "shortcode" !== (type = node.attr(name)) && "php" !== type || ((type = node.firstChild.value) && (node.firstChild.value = type.replace(/<br[\s\/]*>/g, "\n")), 
                        parent && (parent.attr(name) ? node.unwrap() : "body" === parent.name || function(node) {
                            var child = node.parent.firstChild, count = 0;
                            if (child) do {
                                if (1 === child.type) {
                                    if (child.attributes.map["data-mce-type"] || child.attributes.map["data-mce-bogus"]) continue;
                                    if (child === node) continue;
                                    count++;
                                }
                                8 === child.type && count++, 3 !== child.type || /^[ \t\r\n]*$/.test(child.value) || count++;
                            } while (child = child.next);
                            return 0 === count;
                        }(node) || !function(node) {
                            return "span" == node.name && (node.next && ("#text" == node.next.type || !isBlockNode(node.next)) || !(!node.prev || "#text" != node.prev.type && isBlockNode(node.prev)));
                        }(node) ? node.name = "pre" : "span" == node.name && node === parent.lastChild && (type = createTextNode("\xa0"), 
                        parent.append(type))));
                    }
                }), ed.serializer.addAttributeFilter("data-mce-code", function(nodes, name) {
                    var i = nodes.length;
                    for (;i--; ) {
                        var node, root_block = !1, type = (node = nodes[i]).attr(name);
                        if ("img" === node.name) {
                            var key, elm = new Node(type, 1);
                            for (key in node.attributes.map) {
                                var val = node.attributes.map[key];
                                -1 !== key.indexOf("data-mce-p-") ? key = key.substr(11) : val = null, 
                                elm.attr(key, val);
                            }
                            (value = node.attr("data-mce-value")) && (text = createTextNode(unescape(value)), 
                            "php" == type || "shortcode" == type ? elm = text : elm.append(text)), 
                            node.replace(elm);
                        } else if (node.isEmpty() && node.remove(), "xml" !== type) {
                            "script" !== type && "style" !== type || (root_block = type);
                            var value, parser, child = node.firstChild, newNode = node.clone(!0), text = "";
                            if (child) do {} while (/(shortcode|php)/.test(node.attr("data-mce-code")) || (value = "br" == child.name ? "\n" : child.value) && (text += value), 
                            child = child.next);
                            text && (newNode.empty(), parser = new DomParser({
                                validate: !1
                            }), "script" !== type && "style" !== type || parser.addNodeFilter(type, function(items, name) {
                                for (var n = items.length; n--; ) {
                                    var item = items[n];
                                    each(item.attributes, function(attr) {
                                        if (!attr) return !0;
                                        !1 === ed.schema.isValid(name, attr.name) && item.attr(attr.name, null);
                                    });
                                }
                            }), parser = parser.parse(text, {
                                forced_root_block: root_block
                            }), newNode.append(parser)), node.replace(newNode), 
                            "shortcode" === type && "pre" === newNode.name && (root_block = createTextNode("\n"), 
                            newNode.append(root_block), newNode.unwrap());
                        }
                    }
                }), ed.onGetClipboardContent.add(function(ed, content) {
                    var text = content["text/plain"] || "";
                    !(text = tinymce.trim(text)) || (ed = ed.selection.getNode()) && "PRE" === ed.nodeName || (ed = processOnInsert(text)) !== text && (content["text/plain"] = "", 
                    content["text/html"] = content["x-tinymce/html"] = ed);
                });
            }), ed.onInit.add(function() {
                ed.theme && ed.theme.onResolveName && ed.theme.onResolveName.add(function(theme, o) {
                    var node = o.node;
                    node.getAttribute("data-mce-code") && (o.name = node.getAttribute("data-mce-code"));
                });
            }), ed.onBeforeSetContent.addToTop(function(ed, o) {
                ed.settings.code_protect_shortcode && -1 === o.content.indexOf('data-mce-code="shortcode"') && (o.content = processShortcode(o.content)), 
                ed.settings.code_allow_custom_xml && o.content && o.load && (o.content = processXML(o.content)), 
                /<(\?|script|style)/.test(o.content) && (ed.settings.code_allow_script || (o.content = o.content.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")), 
                ed.settings.code_allow_style || (o.content = o.content.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")), 
                o.content = processPhp(o.content));
            }), ed.onPostProcess.add(function(ed, o) {
                o.get && (/(data-mce-php|\[php:start\])/.test(o.content) && (o.content = o.content.replace(/({source})?\[php:\s?start\](.*?)\[php:\s?end\]/g, function(match, pre, code) {
                    return (pre || "") + "<?php" + ed.dom.decode(code) + "?>";
                }), o.content = o.content.replace(/<textarea([^>]*)>([\s\S]*?)<\/textarea>/gi, function(a, b, c) {
                    return "<textarea" + b + ">" + (c = /&lt;\?php/.test(c) ? ed.dom.decode(c) : c) + "</textarea>";
                }), o.content = o.content.replace(/data-mce-php="([^"]+?)"/g, function(a, b) {
                    return "<?php" + ed.dom.decode(b) + "?>";
                })), ed.settings.code_protect_shortcode && (o.content = o.content.replace(/\{([\s\S]+?)\}/gi, function(match, content) {
                    return "{" + ed.dom.decode(content) + "}";
                }), o.content = o.content.replace(/\{source([^\}]*?)\}([\s\S]+?)\{\/source\}/gi, function(match, start, content) {
                    return "{source" + start + "}" + ed.dom.decode(content) + "{/source}";
                }), o.content = o.content.replace(/\{([\w-]+)(.*?)\}([\s\S]+)\{\/\1\}/gi, function(match, start, attr, content) {
                    return "{" + start + attr + "}" + ed.dom.decode(content) + "{/" + start + "}";
                })), o.content = o.content.replace(/<(pre|span)([^>]+?)>([\s\S]*?)<\/\1>/gi, function(match, tag, attr, content) {
                    if (-1 === attr.indexOf("data-mce-code")) return match;
                    content = tinymce.trim(content), content = ed.dom.decode(content);
                    attr = ed.dom.create("div", {}, match).firstChild.getAttribute("data-mce-code");
                    return "script" != attr && (content = content.replace(/<br[^>]*?>/gi, "\n")), 
                    "php" == attr && (content = content.replace(/<\?(php)?/gi, "").replace(/\?>/g, ""), 
                    content = "<?php\n" + tinymce.trim(content) + "\n?>"), content;
                }), o.content = o.content.replace(/<!--mce:protected ([\s\S]+?)-->/gi, function(match, content) {
                    return unescape(content);
                }));
            });
        }
    }), tinymce.PluginManager.add("code", tinymce.plugins.CodePlugin);
}();