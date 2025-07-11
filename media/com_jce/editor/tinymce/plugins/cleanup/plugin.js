/* jce - 2.9.88 | 2025-06-19 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var each = tinymce.each, Node = tinymce.html.Node;
    var tags = [ "a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp" ], fontIconRe = /<([a-z0-9]+)([^>]+)class="([^"]*)(glyph|uk-)?(fa|icon)-([\w-]+)([^"]*)"([^>]*)><\/\1>/gi, paddedRx = /<(p|h1|h2|h3|h4|h5|h6|pre|div|address|caption)\b([^>]+)>(&nbsp;|\u00a0)<\/\1>/gi;
    tinymce.PluginManager.add("cleanup", function(ed, url) {
        function convertFromGeshi(h) {
            return h = h.replace(/<pre xml:lang="([^"]+)"([^>]*)>(.*?)<\/pre>/g, function(a, b, c, d) {
                var attr = "";
                return '<pre data-geshi-lang="' + b + '"' + (attr = c && /\w/.test(c) ? c.split(" ").join(" data-geshi-") : attr) + ">" + d + "</pre>";
            });
        }
        !1 === ed.settings.verify_html && (ed.settings.validate = !1), ed.onPreInit.add(function() {
            var elements, invalidAttribValue;
            function replaceAttributeValue(nodes, name, expr, check) {
                for (var i = nodes.length; i--; ) {
                    var node, value = (node = nodes[i]).attr(name);
                    !value || expr && !function(value, expr, check) {
                        return expr ? "=" === expr ? value === check : "*=" === expr ? 0 <= value.indexOf(check) : "~=" === expr ? 0 <= (" " + value + " ").indexOf(" " + check + " ") : "!=" === expr ? value != check : "^=" === expr ? 0 === value.indexOf(check) : "$=" === expr && value.substr(value.length - check.length) === check : check;
                    }(value, expr, check) || (node.attr(name, null), "src" !== name && "href" !== name && "style" !== name || node.attr("data-mce-" + name, null), 
                    "a" !== node.name) || node.attributes.length || node.unwrap();
                }
            }
            ed.serializer.addAttributeFilter("data-mce-caret", function(nodes, name, args) {
                for (var i = nodes.length; i--; ) nodes[i].remove();
            }), !1 === ed.settings.remove_trailing_brs && ed.serializer.addAttributeFilter("data-mce-bogus", function(nodes, name, args) {
                for (var node, textNode, i = nodes.length; i--; ) "br" === (node = nodes[i]).name && (node.prev || node.next ? node.remove() : ((textNode = new Node("#text", 3)).value = "\xa0", 
                node.replace(textNode)));
            }), ed.serializer.addAttributeFilter("data-mce-tmp", function(nodes, name) {
                for (var i = nodes.length; i--; ) nodes[i].attr("data-mce-tmp", null);
            }), ed.parser.addAttributeFilter("data-mce-tmp", function(nodes, name) {
                for (var i = nodes.length; i--; ) nodes[i].attr("data-mce-tmp", null);
            }), !1 !== ed.settings.verify_html && (ed.settings.allow_event_attributes || each(ed.schema.elements, function(elm) {
                if (!elm.attributesOrder || 0 === elm.attributesOrder.length) return !0;
                each(elm.attributes, function(obj, name) {
                    0 === name.indexOf("on") && (delete elm.attributes[name], elm.attributesOrder.splice(tinymce.inArray(elm, elm.attributesOrder, name), 1));
                });
            }), elements = ed.schema.elements, each("ol ul sub sup blockquote font table tbody tr strong b".split(","), function(name) {
                elements[name] && (elements[name].removeEmpty = !1);
            }), ed.getParam("pad_empty_tags", !0) || each(elements, function(v, k) {
                v.paddEmpty && (v.paddEmpty = !1);
            }), ed.getParam("table_pad_empty_cells", !0) || (elements.th.paddEmpty = !1, 
            elements.td.paddEmpty = !1), each(elements, function(v, k) {
                if (0 == k.indexOf("mce:")) return !0;
                -1 === tinymce.inArray(tags, k) && ed.schema.addCustomElements(k);
            })), !1 !== ed.settings.verify_html && (invalidAttribValue = ed.getParam("invalid_attribute_values", "")) && each(tinymce.explode(invalidAttribValue), function(item) {
                var tag, attrib, expr, value, item = /([a-z0-9\*]+)\[([a-z0-9-]+)([\^\$\!~\*]?=)?["']?([^"']+)?["']?\]/i.exec(item);
                item && 5 == item.length && (tag = item[1], attrib = item[2], expr = item[3], 
                value = item[4], void 0 !== (expr = !attrib || expr || value ? expr : "")) && ("*" == tag ? (ed.parser.addAttributeFilter(attrib, function(nodes, name) {
                    replaceAttributeValue(nodes, name, expr, value);
                }), ed.serializer.addAttributeFilter(attrib, function(nodes, name) {
                    replaceAttributeValue(nodes, name, expr, value);
                })) : (ed.parser.addNodeFilter(tag, function(nodes, name) {
                    replaceAttributeValue(nodes, attrib, expr, value);
                }), ed.serializer.addNodeFilter(tag, function(nodes, name) {
                    replaceAttributeValue(nodes, attrib, expr, value);
                })));
            }), ed.serializer.addNodeFilter(ed.settings.invalid_elements, function(nodes, name) {
                var i = nodes.length;
                if (ed.schema.isValidChild("body", name)) for (;i--; ) nodes[i].remove();
            }), ed.parser.addNodeFilter(ed.settings.invalid_elements, function(nodes, name) {
                var node, i = nodes.length;
                if (ed.schema.isValidChild("body", name)) for (;i--; ) node = nodes[i], 
                "span" === name && node.attr("data-mce-type") || node.unwrap();
            }), ed.parser.addNodeFilter("a,i,span,li", function(nodes, name) {
                for (var node, i = nodes.length; i--; ) ((node = nodes[i]).attr("class") || "li" === name) && !node.firstChild && (node.attr("data-mce-empty", "1"), 
                node.append(new Node("#text", "3")).value = "\xa0");
            }), ed.serializer.addAttributeFilter("data-mce-empty", function(nodes, name) {
                for (var node, fc, i = nodes.length; i--; ) fc = (node = nodes[i]).firstChild, 
                node.attr("data-mce-empty", null), !fc || "\xa0" !== fc.value && "&nbsp;" !== fc.value || fc.remove();
            }), ed.parser.addAttributeFilter("onclick,ondblclick,onmousedown,onmouseup", function(nodes, name) {
                for (var node, i = nodes.length; i--; ) (node = nodes[i]).attr("data-mce-" + name, node.attr(name)), 
                node.attr(name, "return false;");
            }), ed.serializer.addAttributeFilter("data-mce-onclick,data-mce-ondblclick,data-mce-onmousedown,data-mce-onmouseup", function(nodes, name) {
                for (var node, k, i = nodes.length; i--; ) node = nodes[i], k = name.replace("data-mce-", ""), 
                node.attr(k, node.attr(name)), node.attr(name, null);
            }), ed.serializer.addNodeFilter("br", function(nodes, name) {
                var node, i = nodes.length;
                if (i) for (;i--; ) (node = nodes[i]).parent && "body" === node.parent.name && !node.prev && node.remove();
            }), ed.parser.addNodeFilter("br", function(nodes, name) {
                var node, i = nodes.length;
                if (i) for (;i--; ) (node = nodes[i]).parent && "body" === node.parent.name && !node.prev && node.remove();
            });
        }), !1 === ed.settings.verify_html && ed.addCommand("mceCleanup", function() {
            var s = ed.settings, se = ed.selection, bm = se.getBookmark(), content = ed.getContent({
                cleanup: !0
            }), s = (s.verify_html = !0, new tinymce.html.Schema(s)), content = new tinymce.html.Serializer({
                validate: !0
            }, s).serialize(new tinymce.html.DomParser({
                validate: !0,
                allow_event_attributes: !!ed.settings.allow_event_attributes
            }, s).parse(content));
            ed.setContent(content, {
                cleanup: !0
            }), se.moveToBookmark(bm);
        }), ed.onBeforeSetContent.add(function(ed, o) {
            o.content = o.content.replace(/^<br>/, ""), o.content = convertFromGeshi(o.content), 
            ed.settings.validate && ed.getParam("invalid_attributes") && (ed = ed.getParam("invalid_attributes", ""), 
            o.content = o.content.replace(new RegExp("<([^>]+)(" + ed.replace(/,/g, "|") + ')="([^"]+)"([^>]*)>', "gi"), function() {
                var args = arguments;
                return "<" + args[1] + (args[args.length - 3] || "") + ">";
            })), o.content = o.content.replace(fontIconRe, '<$1$2class="$3$4$5-$6$7"$8 data-mce-empty="1">&nbsp;</$1>'), 
            o.content = o.content.replace(/<(a|i|span)\b([^>]+)><\/\1>/gi, '<$1$2 data-mce-empty="1">&nbsp;</$1>'), 
            o.content = o.content.replace(/<li><\/li>/, '<li data-mce-empty="1">&nbsp;</li>');
        }), ed.onPostProcess.add(function(ed, o) {
            o.set && (o.content = convertFromGeshi(o.content)), o.get && (o.content = o.content.replace(/<pre([^>]+)data-geshi-lang="([^"]+)"([^>]*)>(.*?)<\/pre>/g, function(a, b, c, d, e) {
                return '<pre xml:lang="' + c + '"' + (b + d).replace(/data-geshi-/gi, "").replace(/\s+/g, " ").replace(/\s$/, "") + ">" + e + "</pre>";
            }), o.content = o.content.replace(/<a([^>]*)class="jce(box|popup|lightbox|tooltip|_tooltip)"([^>]*)><\/a>/gi, ""), 
            o.content = o.content.replace(/<span class="jce(box|popup|lightbox|tooltip|_tooltip)">(.*?)<\/span>/gi, "$2"), 
            o.content = o.content.replace(/_mce_(src|href|style|coords|shape)="([^"]+)"\s*?/gi, ""), 
            !1 === ed.settings.validate && (o.content = o.content.replace(/<body([^>]*)>([\s\S]*)<\/body>/, "$2"), 
            ed.getParam("remove_tag_padding") || (o.content = o.content.replace(/<(p|h1|h2|h3|h4|h5|h6|th|td|pre|div|address|caption)\b([^>]*)><\/\1>/gi, "<$1$2>&nbsp;</$1>"))), 
            ed.getParam("table_pad_empty_cells", !0) || (o.content = o.content.replace(/<(th|td)([^>]*)>(&nbsp;|\u00a0)<\/\1>/gi, "<$1$2></$1>")), 
            o.content = o.content.replace(/<(a|i|span)([^>]+)>(&nbsp;|\u00a0)<\/\1>/gi, function(match, tag, attribs) {
                return attribs = attribs.replace('data-mce-empty="1"', ""), "<" + tag + " " + tinymce.trim(attribs) + "></" + tag + ">";
            }), o.content = o.content.replace(/<li data-mce-empty="1">(&nbsp;|\u00a0)<\/li>/gi, "<li></li>"), 
            ed.getParam("remove_div_padding") && (o.content = o.content.replace(/<div([^>]*)>(&nbsp;|\u00a0)<\/div>/g, "<div$1></div>")), 
            !1 === ed.getParam("pad_empty_tags", !0) && (o.content = o.content.replace(paddedRx, "<$1$2></$1>")), 
            ed.getParam("keep_nbsp", !0) && "raw" === ed.settings.entity_encoding && (o.content = o.content.replace(/\u00a0/g, "&nbsp;")), 
            o.content = o.content.replace(/(uk|v|ng|data)-([\w-]+)=""(\s|>)/gi, "$1-$2$3"), 
            ed.settings.padd_empty_editor && (o.content = o.content.replace(/^(<div>(&nbsp;|&#160;|\s|\u00a0|)<\/div>[\r\n]*|<br(\s*\/)?>[\r\n]*)$/, "")), 
            o.content = o.content.replace(/<hr(.*)class="system-pagebreak"(.*?)\/?>/gi, '<hr$1class="system-pagebreak"$2/>'), 
            o.content = o.content.replace(/<hr id="system-readmore"(.*?)>/gi, '<hr id="system-readmore" />'));
        }), ed.onSaveContent.add(function(ed, o) {
            var entities;
            ed.getParam("cleanup_pluginmode") && (entities = {
                "&#39;": "'",
                "&amp;": "&",
                "&quot;": '"',
                "&apos;": "'"
            }, o.content = o.content.replace(/&(#39|apos|amp|quot);/gi, function(a) {
                return entities[a];
            }));
        }), ed.addButton("cleanup", {
            title: "advanced.cleanup_desc",
            cmd: "mceCleanup"
        });
    });
}();