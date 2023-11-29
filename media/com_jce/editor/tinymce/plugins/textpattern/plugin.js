/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var each = tinymce.each;
    function toHtml(ed, source) {
        if (!ed.getParam("textpattern_use_markdown", 1)) return source;
        for (var content, block, text = tinymce.trim(source), rules = [ {
            p: /```([^\n]*?)\n([^]*?)\n\s*```\s*\n/g,
            r: function(m, lang, grp) {
                return grp = tinymce.DOM.encode(grp), "<pre>" + (grp = (grp = lang ? '<code class="language-' + lang + '">' + grp + "</code>" : grp).replace(/\n+/g, "\r")) + "</pre>";
            }
        }, {
            p: /[`]+(.*?)[`]+/g,
            r: function(m, grp) {
                return "<code>" + tinymce.DOM.encode(grp) + "</code>";
            }
        }, {
            p: /\n\s*(#+)(.*)/g,
            r: function(m, hset, hval) {
                return "<h" + (m = hset.length) + ">" + hval.replace(/#+/g, "").trim() + "</h" + m + ">";
            }
        }, {
            p: /\n\s*(.*?)\n={3,}\n/g,
            r: "\n<h1>$1</h1>\n"
        }, {
            p: /\n\s*(.*?)\n-{3,}\n/g,
            r: "\n<h2>$1</h2>\n"
        }, {
            p: /___(.*?)___/g,
            r: "<u>$1</u>"
        }, {
            p: /(\*\*|__)(.*?)\1/g,
            r: "<strong>$2</strong>"
        }, {
            p: /(\*|\b_)(.*?)\1/g,
            r: "<em>$2</em>"
        }, {
            p: /~~(.*?)~~/g,
            r: "<del>$1</del>"
        }, {
            p: /:"(.*?)":/g,
            r: "<q>$1</q>"
        }, {
            p: /\!\[([^\[]+?)\]\s*\(([^\)]+?)\)/g,
            r: '<img src="$2" alt="$1" />'
        }, {
            p: /\[([^\[]+?)\]\s*\(([^\)]+?)\)/g,
            r: '<a href="$2">$1</a>'
        }, {
            p: /\n\s*(\*|\-)\s*([^\n]*)/g,
            r: "\n<ul><li>$2</li></ul>"
        }, {
            p: /\n\s*\d+\.\s*([^\n]*)/g,
            r: "\n<ol><li>$1</li></ol>"
        }, {
            p: /\n\s*(\>)\s*([^\n]*)/g,
            r: "\n<blockquote>$2</blockquote>"
        }, {
            p: /<\/(ul|ol|blockquote)>\s*<\1>/g,
            r: " "
        }, {
            p: /\n\s*\*{5,}\s*\n/g,
            r: "\n<hr>"
        }, {
            p: /\n{3,}/g,
            r: "\n\n"
        }, {
            p: />\s+</g,
            r: "><"
        } ], l = rules.length, text = "\n" + text + "\n", i = 0; i < l; i++) text = text.replace(rules[i].p, rules[i].r);
        return source === (text = tinymce.trim(text)) ? source : (content = [], 
        block = ed.settings.forced_root_block || "p", each(text.split(/\r?\n{2,}/), function(val) {
            "" != val && ("<" == (val = val.replace(/\n/g, "<br />"))[0] ? content.push(val) : content.push(block ? "<" + block + ">" + val + "</" + block + ">" : val + "<br /><br />"));
        }), content.join(""));
    }
    function cleanURL(src) {
        function cleanChars(s) {
            for (var r = "", i = 0, ln = (s = s.replace(/[\+\\\/\?\#%&<>"\'=\[\]\{\},;@\^\(\)\xa3\u20ac$]/g, "")).length; i < ln; i++) {
                var ch = s[i];
                /[^\w\.\-~\s ]/.test(ch) && function(s) {
                    for (var c = s.toString(16).toUpperCase(); c.length < 4; ) c = "0" + c;
                    return "\\u" + c;
                }(ch.charCodeAt(0)) < "\\u007F" || (r += ch);
            }
            return s = r;
        }
        var s;
        return s = src, src = s = (s = (s = (s = (s = (s = (s = !0 ? s : s.replace(/[\s ]/g, "_")).replace(/[\/\\\\]+/g, "/")).split("/").map(cleanChars).join("/")).replace(/(\.){2,}/g, "")).replace(/^\./, "")).replace(/\.$/, "")).replace(/^\//, "").replace(/\/$/, "");
    }
    var defaultPatterns = [ {
        start: "*",
        end: "*",
        format: "italic"
    }, {
        start: "**",
        end: "**",
        format: "bold"
    }, {
        start: "~~",
        end: "~~",
        format: "strikethrough"
    }, {
        start: "```",
        end: "```",
        format: "pre"
    }, {
        start: "`",
        end: "`",
        format: "code"
    }, {
        start: "![",
        end: ")",
        cmd: "InsertMarkdownImage",
        remove: !0
    }, {
        start: "[",
        end: ")",
        cmd: "InsertMarkdownLink",
        remove: !0
    }, {
        start: "# ",
        format: "h1"
    }, {
        start: "## ",
        format: "h2"
    }, {
        start: "### ",
        format: "h3"
    }, {
        start: "#### ",
        format: "h4"
    }, {
        start: "##### ",
        format: "h5"
    }, {
        start: "###### ",
        format: "h6"
    }, {
        start: ">",
        format: "blockquote"
    }, {
        start: "1. ",
        cmd: "InsertOrderedList"
    }, {
        start: "* ",
        cmd: "InsertUnorderedList"
    }, {
        start: "- ",
        cmd: "InsertUnorderedList"
    }, {
        start: "$$",
        end: "$$",
        cmd: "InsertCustomTextPattern",
        remove: !0
    } ];
    tinymce.create("tinymce.plugins.TextPatternPlugin", {
        init: function(editor, url) {
            var patterns = (this.editor = editor).settings.textpattern_patterns || defaultPatterns, custom_patterns = (editor.addCommand("InsertMarkdownLink", function(ui, node) {
                var text, node = node.split("]("), dom = editor.dom;
                return node.length < 2 || (text = node[0], node = (node = node[1]).substring(0, node.length), 
                text = text.substring(1), (node = cleanURL(node)) && (text = text || node, 
                node = editor.convertURL(node), dom = dom.createHTML("a", {
                    href: node
                }, text), editor.execCommand("mceInsertContent", !1, dom))), !1;
            }), editor.addCommand("InsertMarkdownImage", function(ui, node) {
                var alt, node = node.split("]("), dom = editor.dom;
                return node.length < 2 || (alt = node[0], node = (node = node[1]).substring(0, node.length), 
                alt = alt.substring(1, 1), node = cleanURL(node), alt = {
                    alt: alt,
                    src: node = editor.convertURL(node)
                }, node || (alt["data-mce-upload-marker"] = 1, alt.width = 320, 
                alt.height = 240, alt.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", 
                alt.class = "mce-item-uploadmarker"), node = dom.createHTML("img", alt), 
                editor.execCommand("mceInsertContent", !1, node)), !1;
            }), editor.getParam("textpattern_custom_patterns", "", "hash"));
            editor.addCommand("InsertCustomTextPattern", function(ui, node) {
                var html;
                tinymce.is(custom_patterns, "function") && (html = "" + custom_patterns(node)), 
                tinymce.is(custom_patterns, "object") && (html = custom_patterns[node] || ""), 
                tinymce.is(html) && editor.execCommand("mceReplaceContent", !1, html);
            }), this.addPattern = function(pattern) {
                patterns.push(pattern);
            }, this.setPatterns = function(values) {
                patterns = values;
            }, this.getPatterns = function() {
                return patterns;
            }, editor.onPreInit.add(function() {
                each(patterns, function(ptn) {
                    editor.textpattern.addPattern(ptn);
                });
            }), editor.getParam("textpattern_use_markdown", 1) && (editor.onBeforeSetContent.add(function(ed, o) {
                -1 === o.content.indexOf("<") && (o.content = toHtml(ed, o.content));
            }), editor.onPreInit.add(function() {
                editor.serializer.addAttributeFilter("data-mce-wrapper", function(nodes, name) {
                    for (var i = nodes.length; i--; ) nodes[i].unwrap();
                }), editor.parser.addAttributeFilter("data-mce-wrapper", function(nodes, name) {
                    for (var i = nodes.length; i--; ) nodes[i].unwrap();
                }), editor.onGetClipboardContent.add(function(ed, clipboard) {
                    var text = clipboard["text/plain"] || "", html = clipboard["text/html"] || "";
                    text && !html && (text = ed.dom.encode(text), (html = toHtml(editor, text)) !== text) && (clipboard["text/html"] = html);
                }), editor.onBeforeExecCommand.add(function(editor, cmd, ui, v, o) {
                    "mceInsertClipboardContent" === cmd && (cmd = v.text || "") && (cmd = editor.dom.encode(cmd), 
                    (editor = toHtml(editor, cmd)) !== cmd) && (v.content = editor, 
                    v.text = "");
                });
            }));
        },
        toHtml: function(content) {
            return toHtml(this.editor, content);
        }
    }), tinymce.PluginManager.add("textpattern", tinymce.plugins.TextPatternPlugin);
}();