/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    "use strict";
    var Utils = {
        flattenObjectToArray: function flattenObjectToArray(obj) {
            var key, values = [];
            for (key in obj) {
                var value = obj[key];
                if (!value) return !0;
                if (tinymce.is(value, "function")) return !0;
                "string" == typeof (value = tinymce.is(value, "object") ? flattenObjectToArray(value) : value) && (value = value.split(" ")), 
                values = values.concat(value);
            }
            return values;
        },
        partition: function(array, maxrows) {
            for (var size = array.length, columns = Math.ceil(size / maxrows), fullrows = size - (columns - 1) * maxrows, result = [], i = 0; i < maxrows; ++i) {
                var n = array.splice(0, i < fullrows ? columns : columns - 1);
                result.push(n);
            }
            return result;
        }
    }, each$3 = tinymce.each;
    function isColumn(elm) {
        return elm && "DIV" == elm.nodeName && "column" == elm.getAttribute("data-mce-type");
    }
    function padColumn(editor, column) {
        var childBlock = (editor.settings.force_p_newlines ? "p" : "") || editor.settings.forced_root_block, columnContent = editor.dom.doc.createTextNode("\xa0");
        childBlock && (columnContent = editor.dom.create(childBlock), tinymce.isIE || (columnContent.innerHTML = '<br data-mce-bogus="1" />')), 
        editor.dom.add(column, columnContent);
    }
    function createColumn(editor) {
        var col = editor.dom.create("div", {
            class: "wf-column",
            "data-mce-type": "column"
        });
        return padColumn(editor, col), col;
    }
    function addColumn(editor, node, parentCol) {
        var node = getColumnNode(editor, node), col = createColumn(editor);
        node ? editor.dom.insertAfter(col, node) : (editor.formatter.apply("column"), 
        (col = editor.dom.get("__tmp")) && (col.parentNode.insertBefore(parentCol, col), 
        parentCol.appendChild(col), editor.dom.setAttrib(col, "id", ""))), col && col.childNodes.length && (editor.selection.select(col.firstChild), 
        editor.selection.collapse(1), editor.nodeChanged());
    }
    function getColumnNode(editor, node) {
        return (node = node || editor.selection.getNode()) === editor.dom.getRoot() ? null : isColumn(node) ? node : editor.dom.getParent(node, ".wf-column");
    }
    function getSelectedBlocks(editor) {
        editor = editor.selection.getSelectedBlocks();
        return tinymce.map(editor, function(node) {
            return "LI" === node.nodeName ? node.parentNode : node;
        });
    }
    var Columns = {
        stackColumn: function(editor, value) {
            var parent, node = getColumnNode(editor);
            node && (parent = editor.dom.getParent(node, ".wf-columns"), each$3([ "wf-columns-stack-small", "wf-columns-stack-medium", "wf-columns-stack-large" ], function(cls) {
                editor.dom.removeClass(parent, cls);
            }), value) && editor.dom.addClass(parent, "wf-columns-stack-" + value);
        },
        removeColumn: function(editor) {
            var node = getColumnNode(editor);
            if (node) {
                for (var child, num, parent = editor.dom.getParent(node, ".wf-columns"); child = node.firstChild; ) editor.dom.isEmpty(child) && 1 === child.nodeType ? editor.dom.remove(child) : (num = parent.childNodes.length, 
                editor.dom.nodeIndex(node) + 1 <= Math.ceil(num / 2) ? editor.dom.insertBefore(child, parent) : editor.dom.insertAfter(child, parent));
                editor.dom.remove(node);
                var cols = editor.dom.select(".wf-column", parent);
                cols.length ? (cols = cols[cols.length - 1]) && function(editor, node) {
                    var rng = editor.dom.createRng();
                    rng.setStart(node, 0), rng.setEnd(node, 0), rng.collapse(), 
                    editor.selection.setRng(rng);
                }(editor, cols.firstChild) : editor.dom.remove(parent, 1), editor.nodeChanged();
            }
            editor.undoManager.add();
        },
        addColumn: addColumn,
        isColumn: isColumn,
        insertColumn: function(editor, data) {
            var node = getColumnNode(editor), cls = [ "wf-columns" ], stack = data.stack, align = data.align, num = data.columns, layout = data.layout || "auto", gap = data.gap;
            if (stack && cls.push("wf-columns-stack-" + stack), align && cls.push("wf-columns-align-" + align), 
            gap && "medium" !== gap && cls.push("wf-columns-gap-" + gap), cls.push("wf-columns-layout-" + layout), 
            data.classes && (cls = cls.concat(data.classes.split(" "))), node) {
                parentCol = editor.dom.getParent(node, ".wf-columns"), editor.dom.setAttrib(parentCol, "class", tinymce.trim(cls.join(" ")));
                var stack = editor.dom.select(".wf-column", parentCol), lastNode = stack[stack.length - 1], num = Math.max(num - stack.length, 0);
            } else {
                var parentCol, align = getSelectedBlocks(editor), columns = (align.length && (lastNode = align[align.length - 1]), 
                []), newCol = createColumn(editor);
                if (1 == num) editor.formatter.apply("column"), newCol = editor.dom.get("__tmp") || align[0].parentNode, 
                editor.dom.setAttrib(newCol, "id", null), columns.push(newCol), 
                num = 0; else if (num < align.length) {
                    for (var groups = Utils.partition(align, num), i = 0; i < groups.length; i++) {
                        var group = groups[i];
                        editor.dom.wrap(group, newCol, !0), columns.push(group[0].parentNode);
                    }
                    num = 0;
                } else {
                    if (!align.length) {
                        parentCol = editor.dom.create("div", {
                            class: cls.join(" "),
                            "data-mce-type": "column"
                        });
                        for (gap = editor.selection.getContent(); num--; ) parentCol.appendChild(newCol.cloneNode(!0));
                        return gap && (parentCol.firstChild.innerHTML = gap), void editor.execCommand("mceInsertRawHtml", !1, editor.dom.getOuterHTML(parentCol));
                    }
                    each$3(align, function(node) {
                        if (num--, isColumn(node) || isColumn(node.parentNode)) return parentCol = parentCol || editor.dom.getParent(node, ".wf-columns"), 
                        (node = editor.dom.getParent(node, ".wf-column")) && columns.push(node), 
                        editor.dom.empty(parentCol), !0;
                        var elementRule;
                        editor.dom.isEmpty(node) && (elementRule = editor.schema.getElementRule(node.nodeName.toLowerCase())) && elementRule.paddEmpty && (node.innerHTML = '<br data-mce-bogus="1" />'), 
                        editor.dom.wrap(node, newCol), columns.push(node.parentNode);
                    });
                }
                parentCol ? each$3(columns, function(column) {
                    parentCol.appendChild(column);
                }) : (parentCol = editor.dom.create("div", {
                    class: cls.join(" "),
                    "data-mce-type": "column"
                }), editor.dom.wrap(columns, parentCol, !0));
            }
            if (num) for (;num--; ) addColumn(editor, lastNode, parentCol);
            editor.undoManager.add(), editor.nodeChanged();
        },
        getSelectedBlocks: getSelectedBlocks,
        getColumnNode: getColumnNode,
        createColumn: createColumn,
        padColumn: padColumn
    }, TreeWalker$1 = tinymce.dom.TreeWalker;
    function mapLayout$1(str) {
        var cls;
        switch (str) {
          case "1-2":
          case "2-1":
            cls = "8";
            break;

          case "1-3":
          case "3-1":
            cls = "9";
            break;

          case "2-1-1":
          case "1-1-2":
          case "1-2-1":
            cls = "6";
            break;

          case "4-1":
          case "1-4":
            cls = "10";
            break;

          case "2-1-1-1":
          case "1-1-1-2":
            cls = "5";
            break;

          case "3-2":
          case "1-1-3":
          case "3-1-1":
            cls = "7";
            break;

          case "col-sm-8":
          case "col-md-8":
          case "col-lg-8":
          case "col-xl-8":
            cls = [ "2-1", "1-2" ];
            break;

          case "col-sm-9":
          case "col-md-9":
          case "col-lg-9":
          case "col-xl-9":
            cls = [ "3-1", "1-3" ];
            break;

          case "col-sm-6":
          case "col-md-6":
          case "col-lg-6":
          case "col-xl-6":
            cls = [ "2-1-1", "1-2-1", "1-1-2" ];
            break;

          case "col-sm-10":
          case "col-md-10":
          case "col-lg-10":
          case "col-xl-10":
            cls = [ "4-1", "1-4" ];
            break;

          case "col-sm-5":
          case "col-md-5":
          case "col-lg-5":
          case "col-xl-5":
            cls = [ "2-1-1-1", "1-1-1-2" ];
            break;

          case "col-sm-7":
          case "col-md-7":
          case "col-lg-7":
          case "col-xl-7":
            cls = [ "3-2", "1-1-3", "3-1-1", "2-3" ];
        }
        return cls;
    }
    var DragSelection = {
        setup: function(editor) {
            var startColumn, startContainer, lastMouseOverTarget, hasSelection, dom = editor.dom, selected = [];
            function cleanup(force) {
                editor.getBody().style.webkitUserSelect = "", (force || hasSelection) && (dom.removeClass(dom.select("div.wf-column.mceSelected"), "mceSelected"), 
                hasSelection = !1), selected = [];
            }
            function isColumnInContainer(container, column) {
                return container && column && container === dom.getParent(column, ".wf-columns");
            }
            editor.onSetContent.add(function() {
                cleanup(!0);
            }), editor.onKeyUp.add(function() {
                cleanup();
            }), editor.onMouseDown.add(function(ed, e) {
                2 != e.button && (cleanup(), startColumn = dom.getParent(e.target, ".wf-column"), 
                startContainer = dom.getParent(startColumn, ".wf-columns"), selected.push(startColumn));
            }), dom.bind(editor.getDoc(), "mouseover", function(e) {
                var currentColumn, target = e.target;
                if (target !== lastMouseOverTarget && (lastMouseOverTarget = target, 
                startContainer) && startColumn && (currentColumn = dom.getParent(target, ".wf-column"), 
                isColumnInContainer(startContainer, currentColumn) || (currentColumn = dom.getParent(startContainer, ".wf-column")), 
                startColumn !== currentColumn || hasSelection) && isColumnInContainer(startContainer, currentColumn)) {
                    e.preventDefault(), editor.getBody().style.webkitUserSelect = "none", 
                    selected.push(currentColumn), dom.removeClass(dom.select(".wf-column"), "mceSelected"), 
                    dom.addClass(selected, "mceSelected"), hasSelection = !0, target = editor.selection.getSel();
                    try {
                        target.removeAllRanges ? target.removeAllRanges() : target.empty();
                    } catch (ex) {}
                }
            }), editor.onMouseUp.add(function() {
                var selectedColumns, walker, lastNode, sel = editor.selection;
                function setPoint(node, start) {
                    var walker = new TreeWalker$1(node, node);
                    do {
                        if (3 == node.nodeType) return void (start ? rng.setStart(node, 0) : rng.setEnd(node, node.nodeValue.length));
                        if ("BR" == node.nodeName) return void (start ? rng.setStartBefore(node) : rng.setEndBefore(node));
                    } while (node = start ? walker.next() : walker.prev());
                }
                if (startColumn) {
                    if (0 < (selectedColumns = dom.select("div.wf-column.mceSelected")).length) {
                        var parent = dom.getParent(selectedColumns[0], ".wf-columns"), rng = dom.createRng(), node = selectedColumns[0];
                        rng.setStartBefore(node), rng.setEndAfter(node), setPoint(node, 1), 
                        walker = new TreeWalker$1(node, parent);
                        do {
                            if ("DIV" == node.nodeName) {
                                if (!dom.hasClass(node, "mceSelected")) break;
                                lastNode = node;
                            }
                        } while (node = walker.next());
                        setPoint(lastNode), sel.setRng(rng);
                    }
                    selected = [], editor.nodeChanged(), startColumn = startContainer = lastMouseOverTarget = null;
                }
            });
        }
    }, DOM$2 = tinymce.DOM, each$2 = tinymce.each;
    function mapLayout(str) {
        var cls;
        switch (str) {
          case "1-2":
          case "2-1":
            cls = "uk-width-2-3";
            break;

          case "1-3":
          case "3-1":
            cls = "uk-width-3-4";
            break;

          case "2-1-1":
          case "1-1-2":
          case "1-2-1":
            cls = "uk-width-1-2";
            break;

          case "4-1":
          case "1-4":
            cls = "uk-width-1-5";
            break;

          case "2-1-1-1":
          case "1-1-1-2":
            cls = "uk-width-2-5";
            break;

          case "1-1-3":
          case "2-3":
            cls = "uk-width-3-5";
            break;

          case "3-1-1":
          case "3-2":
            cls = "uk-width-3-5";
            break;

          case "uk-width-2-3":
            cls = [ "2-1", "1-2" ];
            break;

          case "uk-width-3-4":
            cls = [ "3-1", "1-3" ];
            break;

          case "uk-width-1-2":
            cls = [ "2-1-1", "1-2-1", "1-1-2" ];
            break;

          case "uk-width-1-5":
            cls = [ "4-1", "1-4" ];
            break;

          case "uk-width-2-5":
            cls = [ "2-1-1-1", "1-1-1-2" ];
            break;

          case "uk-width-3-5":
            cls = [ "3-2", "1-1-3", "3-1-1", "2-3" ];
        }
        return cls;
    }
    var Bootstrap = {
        apply: function(elm) {
            function suffixMap(val) {
                return {
                    small: "-sm",
                    medium: "-md",
                    large: "-lg",
                    xlarge: "-xl"
                }[val] || "";
            }
            var pos, cls, classes = elm.getAttribute("class"), suffix = "", layout = "";
            DOM$2.addClass(elm, "row"), -1 !== classes.indexOf("wf-columns-stack-") && (suffix = suffixMap(/wf-columns-stack-(small|medium|large|xlarge)/.exec(classes)[1]), 
            DOM$2.addClass(DOM$2.select(".wf-column", elm), "col" + suffix)), -1 !== classes.indexOf("wf-columns-layout-") && ("auto" === (layout = /wf-columns-layout-([0-9-]+|auto)/.exec(classes)[1]) ? DOM$2.addClass(DOM$2.select(".wf-column", elm), "col" + suffix) : (pos = layout.split("-").shift(), 
            cls = "col" + suffix + "-" + mapLayout$1(layout), 1 < parseInt(pos, 10) ? DOM$2.addClass(DOM$2.select(".wf-column:first-child", elm), cls) : "1-2-1" === layout ? DOM$2.addClass(DOM$2.select(".wf-column:nth(2)", elm), cls) : 1 === parseInt(pos, 10) && DOM$2.addClass(DOM$2.select(".wf-column:last-child", elm), cls))), 
            -1 !== classes.indexOf("wf-columns-gap-") && (suffix = suffixMap(/wf-columns-gap-(small|medium|large|none)/.exec(classes)[1]) || "-none", 
            DOM$2.addClass(elm, "flex-gap" + suffix));
        },
        remove: function(elm) {
            var layoutClasses, stack, layout, nodes, suffixMap, classes, suffix;
            DOM$2.hasClass(elm, "row") && (layoutClasses = [ "col-sm", "col-md", "col-lg", "col-xl", "col-sm-8", "col-md-8", "col-lg-8", "col-xl-8", "col-sm-9", "col-md-9", "col-lg-9", "col-xl-9", "col-sm-10", "col-md-10", "col-lg-10", "col-xl-10", "col-sm-5", "col-md-5", "col-lg-5", "col-xl-5", "col-sm-7", "col-md-7", "col-lg-7", "col-xl-7" ], 
            classes = elm.getAttribute("class"), stack = "", layout = "wf-columns-layout-auto", 
            nodes = DOM$2.select('div[class*="col"]', elm), suffixMap = function(val) {
                return {
                    sm: "small",
                    md: "medium",
                    lg: "large",
                    xl: "xlarge"
                }[val] || "";
            }, each$2(nodes, function(node, i) {
                var match, values, cls = node.getAttribute("class");
                cls && -1 !== cls.indexOf("col-") && (values = [], each$2(cls.split(" "), function(val) {
                    val && 0 == val.indexOf("col-") && (match = /col-(sm|md|lg|xl)(-[0-9]+)?/.exec(val)) && -1 != tinymce.inArray(layoutClasses, match[0]) && DOM$2.removeClass(node, match[0]);
                }), match) && (values = mapLayout$1(match[0]), (cls = suffixMap(match[1])) && (stack = "wf-columns-stack-" + cls), 
                values) && (layout = 0 === i ? "wf-columns-layout-" + values[0] : i === nodes.length - 1 ? "wf-columns-layout-" + values[values.length - 1] : "wf-columns-layout-" + values[1]), 
                DOM$2.removeClass(node, "col");
            }), -1 !== classes.indexOf("flex-gap-") && (classes = /flex-gap-(none|sm|md|lg)?/.exec(classes)[1]) && "md" !== classes && (suffix = suffixMap(classes) || "none", 
            DOM$2.addClass(elm, "wf-columns-gap-" + suffix), DOM$2.removeClass(elm, "uk-flex-gap-" + classes)), 
            DOM$2.addClass(elm, layout), DOM$2.addClass(elm, stack), each$2([ "row", "col", "col-sm", "col-md", "col-lg", "col-xl", "flex-gap-sm", "flex-gap-md", "flex-gap-lg", "flex-gap-none" ], function(cls) {
                DOM$2.removeClass(elm, cls);
            }));
        }
    }, DOM$1 = tinymce.DOM, each$1 = tinymce.each;
    var UIKit = {
        apply: function(elm) {
            var stack, first, cls, classes = elm.getAttribute("class"), suffix = [], layout = "", last = (DOM$1.addClass(elm, "uk-flex"), 
            -1 !== classes.indexOf("wf-columns-stack-") && (suffix = [ "-" + (stack = /wf-columns-stack-(small|medium|large|xlarge)/.exec(classes)[1]), {
                small: "@s",
                medium: "@m",
                large: "@l",
                xlarge: "@xl"
            }[stack] || "" ], DOM$1.addClass(elm, "uk-flex-wrap")), -1 !== classes.indexOf("wf-columns-layout-") && ("auto" === (layout = /wf-columns-layout-([0-9-]+|auto)/.exec(classes)[1]) ? DOM$1.addClass(DOM$1.select(".wf-column", elm), "uk-flex-auto uk-flex-item-auto") : (stack = layout.split("-"), 
            first = parseInt(stack[0], 10), last = parseInt(stack[stack.length - 1], 10), 
            cls = "", each$1(suffix, function(sfx) {
                cls += " " + mapLayout(layout) + sfx;
            }), cls = tinymce.trim(cls), last < first ? DOM$1.addClass(DOM$1.select(".wf-column:first-child", elm), cls) : "1-2-1" === layout ? DOM$1.addClass(DOM$1.select(".wf-column:nth(2)", elm), cls) : DOM$1.addClass(DOM$1.select(".wf-column:last-child", elm), cls))), 
            "medium");
            -1 !== classes.indexOf("wf-columns-gap-") && (last = /wf-columns-gap-(small|medium|large|none)/.exec(classes)[1]), 
            DOM$1.addClass(elm, "uk-flex-gap-" + last), each$1(suffix, function(sfx) {
                DOM$1.addClass(elm, "uk-child-width-expand" + sfx);
            });
        },
        remove: function(elm) {
            var classes, stack, suffix, nodes, layout;
            DOM$1.hasClass(elm, "uk-flex") && (-1 !== (classes = elm.getAttribute("class")).indexOf("uk-child-width-expand@") && ((stack = /uk-child-width-expand(@s|@m|@l|@xl)/.exec(classes)) && ((suffix = {
                "@s": "small",
                "@m": "medium",
                "@l": "large",
                "@xl": "xlarge"
            }[stack[1]] || "") && DOM$1.addClass(elm, "wf-columns-stack-" + suffix), 
            DOM$1.removeClass(elm, stack[0])), DOM$1.removeClass(elm, "uk-flex-wrap")), 
            -1 !== classes.indexOf("uk-flex-gap-") && (suffix = /uk-flex-gap-(none|small|medium|large)/.exec(classes)[1]) && (DOM$1.addClass(elm, "wf-columns-gap-" + suffix), 
            DOM$1.removeClass(elm, "uk-flex-gap-" + suffix)), nodes = tinymce.grep(elm.childNodes, function(node) {
                if ("DIV" === node.nodeName) return node;
            }), layout = "wf-columns-layout-auto", each$1(nodes, function(node, i) {
                var cls = node.getAttribute("class");
                if (cls && -1 !== cls.indexOf("uk-width-")) {
                    var rx = /uk-width-([0-9-]+)(?:@s|@m|@l|@xl|-small|-medium|-large|-xlarge)/g, match = rx.exec(cls), values = [];
                    if (match && (values = mapLayout("uk-width-" + match[1])), each$1(cls.match(rx), function(str) {
                        DOM$1.removeClass(node, str);
                    }), !values.length) return !0;
                    layout = 0 === i ? "wf-columns-layout-" + values[0] : i === nodes.length - 1 ? "wf-columns-layout-" + values[values.length - 1] : "wf-columns-layout-" + values[1];
                }
                DOM$1.removeClass(node, "uk-flex-auto"), DOM$1.removeClass(node, "uk-flex-item-auto");
            }), DOM$1.removeClass(elm, "uk-flex"), DOM$1.addClass(elm, layout), 
            each$1([ "uk-flex", "uk-child-width-expand", "uk-flex-wrap", "uk-child-width-expand@s", "uk-child-width-expand@m", "uk-child-width-expand@l", "uk-child-width-expand@xl", "uk-child-width-expand-small", "uk-child-width-expand-medium", "uk-child-width-expand-large", "uk-child-width-expand-xlarge", "uk-flex-auto", "uk-flex-item-auto", "uk-width-2-3", "uk-width-3-4", "uk-width-1-2" ], function(cls) {
                DOM$1.removeClass(elm, cls);
            }));
        }
    }, DOM = tinymce.DOM, each = tinymce.each, VK = tinymce.VK, Event = tinymce.dom.Event, TreeWalker = tinymce.dom.TreeWalker;
    tinymce.create("tinymce.plugins.Columns", {
        init: function(editor, url) {
            this.editor = editor, this.url = url;
            var framework = editor.getParam("columns_framework", "");
            function onSetContent(editor, o) {
                var columns = editor.dom.select("[data-wf-columns], .wf-columns");
                each(columns, function(column) {
                    editor.dom.addClass(column, "wf-columns"), framework && editor.dom.addClass(column, "wf-columns-" + framework), 
                    each(column.childNodes, function(node) {
                        if ("DIV" !== node.nodeName) return !0;
                        editor.dom.addClass(node, "wf-column"), node.setAttribute("data-mce-type", "column");
                    }), UIKit.remove(column), Bootstrap.remove(column), each(editor.dom.select("div,p", column), function(block) {
                        "&nbsp;" != block.innerHTML && block.hasChildNodes() || (block.innerHTML = '<br data-mce-bogus="1" />');
                    });
                });
            }
            function handleDeleteInColumn(e) {
                if (e.ctrlKey && e.keyCode === VK.DELETE) Columns.getColumnNode(editor) && (Columns.removeColumn(editor), 
                e.preventDefault(), e.stopPropagation(), editor.undoManager.add()); else {
                    var selectedColumns = editor.dom.select("div.wf-column.mceSelected", editor.dom.getRoot()), rng = (selectedColumns.length && (e.preventDefault(), 
                    e.stopPropagation(), each(selectedColumns, function(node) {
                        editor.dom.empty(node), node.innerHTML = "", Columns.padColumn(editor, node), 
                        editor.selection.select(node.firstChild, !0), editor.selection.collapse(!0);
                    }), editor.undoManager.add()), editor.selection.getRng()), selectedColumns = rng.commonAncestorContainer;
                    if (!Columns.isColumn(rng.commonAncestorContainer)) {
                        if (!isWithinColumn(rng.startContainer) && !isWithinColumn(rng.endContainer)) return;
                        isWithinColumn(rng.startContainer) || 0 != rng.startOffset || (col = editor.dom.getParent(rng.endContainer, ".wf-column"), 
                        rng.setStart(col.firstChild, 0)), isWithinColumn(rng.endContainer) || 0 != rng.endOffset || (3 == (lastChild = getLastChild(col = editor.dom.getParent(rng.startContainer, ".wf-column"))).nodeType ? rng.setEnd(lastChild, lastChild.nodeValue.length) : rng.setEndAfter(lastChild, lastChild));
                    }
                    if (rng.collapsed && 0 == rng.startOffset) (col = editor.dom.getParent(selectedColumns, ".wf-column")) && col.firstChild && col.firstChild == col.lastChild && rng.startContainer == col.firstChild && e.preventDefault(); else if (col = editor.dom.getParent(editor.selection.getStart(), ".wf-column")) {
                        var lastChild = editor.dom.getParent(col.firstChild, function(n) {
                            return !Columns.isColumn(n) && editor.dom.isBlock(n);
                        });
                        if (lastChild && Columns.isColumn(lastChild.parentNode) && (!lastChild.previousSibling || !lastChild.nextSibling)) {
                            var col = lastChild.parentNode, selectedColumns = function() {
                                var start = editor.dom.getParent(rng.startContainer, editor.dom.isBlock);
                                return start = Columns.isColumn(start) ? start.firstChild : start;
                            }(), lastChild = function() {
                                var end = editor.dom.getParent(rng.endContainer, editor.dom.isBlock);
                                return end = Columns.isColumn(end) ? end.lastChild : end;
                            }();
                            if (col.firstChild == selectedColumns && getLastChild(col) == lastChild && rng.endContainer) {
                                selectedColumns = Columns.isColumn(rng.endContainer) ? rng.endContainer.lastChild : rng.endContainer;
                                if (selectedColumns == getLastChild(col) && !(rng.endOffset < rng.endContainer.length)) {
                                    for (;col.firstChild; ) col.removeChild(col.firstChild);
                                    Columns.padColumn(editor, col), editor.undoManager.add(), 
                                    e.preventDefault();
                                }
                            }
                        }
                    }
                }
                function isWithinColumn(node) {
                    return editor.dom.getParent(node, "div.wf-column");
                }
                function getLastChild(parent) {
                    for (var node, lastChild = parent.lastChild, walker = new TreeWalker(lastChild, parent); node = walker.next(); ) 3 == node.nodeType && node.nodeValue && (lastChild = node), 
                    1 == node.nodeType && (lastChild = Columns.isColumn(node.parentNode) ? node : node.parentNode);
                    return lastChild;
                }
            }
            editor.onPreProcess.add(function(editor, o) {
                o = editor.dom.select(".wf-columns", o.node);
                each(o, function(elm) {
                    if (elm.setAttribute("data-wf-columns", 1), each(editor.dom.select(".wf-column", elm), function(node) {}), 
                    !framework) return !0;
                    "uikit" === framework && UIKit.apply(elm), "bootstrap" === framework && Bootstrap.apply(elm);
                    var classes = elm.getAttribute("class");
                    each(classes.split(" "), function(val) {
                        -1 !== val.indexOf("wf-columns") && editor.dom.removeClass(elm, val);
                    }), editor.dom.removeClass(editor.dom.select(".wf-column", elm), "wf-column");
                });
            }), editor.onSetContent.add(onSetContent), editor.addButton("columns_add", {
                title: "columns.add",
                onclick: function() {
                    var node = editor.selection.getNode();
                    Columns.addColumn(editor, node);
                }
            }), editor.addButton("columns_delete", {
                title: "columns.delete",
                onclick: function() {
                    var node = editor.selection.getNode();
                    Columns.removeColumn(editor, node);
                }
            }), editor.onPreInit.add(function(ed) {
                editor.selection.onGetContent.add(function(sel, o) {
                    if (!o.contextual) return !0;
                    var node, container = editor.dom.create("body", {}, o.content), columns = editor.dom.select(".wf-column", container);
                    columns.length && (node = editor.selection.getNode(), node = editor.dom.getParent(node, "div[data-wf-columns]")) && (editor.dom.wrap(columns, editor.dom.clone(node), !0), 
                    o.content = sel.serializer.serialize(container, o));
                });
            }), editor.onInit.add(function() {
                editor.settings.compress.css || editor.dom.loadCSS(url + "/css/content.css"), 
                editor.onBeforeExecCommand.add(function(ed, cmd, ui, values, o) {
                    cmd && "FormatBlock" == cmd && (cmd = ed.selection.getNode(), 
                    Columns.isColumn(cmd)) && (o.terminate = !0);
                }), editor.selection.onSetContent.add(onSetContent), editor.onKeyDown.addToTop(function(editor, e) {
                    e.keyCode !== VK.BACKSPACE && e.keyCode !== VK.DELETE || handleDeleteInColumn(e);
                }), editor.formatter.register("column", {
                    block: "div",
                    classes: "wf-column",
                    attributes: {
                        id: "__tmp",
                        "data-mce-type": "column"
                    },
                    wrapper: !0
                }), editor.theme && editor.theme.onResolveName && editor.theme.onResolveName.add(function(theme, o) {
                    var n = o.node;
                    n && (editor.dom.hasClass(n, "wf-columns") && (o.name = "columns"), 
                    editor.dom.hasClass(n, "wf-column")) && (o.name = "column");
                }), DragSelection.setup(editor);
            }), editor.onNodeChange.add(function(ed, cm, n, co) {
                "DIV" !== n.nodeName && (n = ed.dom.getParent(n, "DIV"));
                var col, state = Columns.isColumn(n);
                state && 0 === n.childNodes.length && n.previousSibling && (col = n.previousSibling.lastChild) && ed.dom.remove(n) && (editor.selection.select(col), 
                editor.selection.collapse(0)), cm.setActive("columns", state), cm.setDisabled("columns_add", !state), 
                cm.setDisabled("columns_delete", !state);
            });
        },
        createControl: function(n, cm) {
            var form, columnsNum, layoutList, stackList, gapList, stylesList, ed = this.editor;
            function menuGridMouseOver(e) {
                var e = e.target, tbody = ("TD" !== e.nodeName && (e = e.parentNode), 
                DOM.getParent(e, "tbody"));
                if (tbody) {
                    var i, rows = tbody.childNodes, tbody = e.parentNode, x = tinymce.inArray(tbody.childNodes, e), y = tinymce.inArray(rows, tbody);
                    if (!(x < 0 || y < 0)) for (i = 0; i < rows.length; i++) for (var cells = rows[i].childNodes, z = 0; z < cells.length; z++) x < z || y < i ? DOM.removeClass(cells[z], "selected") : DOM.addClass(cells[z], "selected");
                }
            }
            function updateColumnValue(val, num) {
                columnsNum.setDisabled(!1);
                var layoutNum = 1;
                val && -1 !== val.indexOf("-") && (layoutNum = val.split("-").length), 
                columnsNum.value(num = layoutNum < num ? num : layoutNum);
            }
            if ("columns" == n) return form = cm.createForm("columns_form"), columnsNum = cm.createTextBox("columns_num", {
                label: ed.getLang("columns.columns", "Columns"),
                name: "columns",
                subtype: "number",
                attributes: {
                    step: 1,
                    min: 1
                },
                value: 1,
                onchange: function() {
                    columnsNum.value();
                }
            }), form.add(columnsNum), layoutList = cm.createListBox("columns_layout", {
                label: ed.getLang("columns.layout", "Layout"),
                onselect: function(val) {
                    updateColumnValue(val, columnsNum.value());
                },
                name: "layout",
                max_height: "auto"
            }), each([ "", "2-1", "1-2", "3-1", "1-3", "2-1-1", "1-2-1", "1-1-2", "2-3", "3-2", "1-4", "4-1", "3-1-1", "1-3-1", "1-1-3", "2-1-1-1", "1-1-1-2" ], function(val) {
                var key = val ? ed.getLang("columns.layout_" + val, val) : ed.getLang("columns.layout_auto", "Auto");
                layoutList.add(key, val, {
                    icon: "columns_layout_" + val.replace(/-/g, "_")
                });
            }), stackList = cm.createListBox("columns_stack", {
                label: ed.getLang("columns.stack", "Stack Width"),
                onselect: function(v) {},
                name: "stack",
                max_height: "auto"
            }), each([ "", "small", "medium", "large", "xlarge" ], function(val) {
                var key = val ? ed.getLang("columns.stack_" + val, val) : ed.getLang("columns.stack_none", "None");
                stackList.add(key, val);
            }), gapList = cm.createListBox("columns_gap", {
                label: ed.getLang("columns.gap", "Gap Size"),
                onselect: function(v) {},
                name: "gap",
                max_height: "auto"
            }), each([ "none", "small", "medium", "large" ], function(val) {
                var key = ed.getLang("columns.stack_" + val, val);
                gapList.add(key, val);
            }), stylesList = cm.createStylesBox("columns_class", {
                label: ed.getLang("columns.class", "Classes"),
                onselect: function(v) {},
                name: "classes"
            }), form.add(stackList), form.add(gapList), form.add(layoutList), form.add(stylesList), 
            (cm = cm.createSplitButton("columns", {
                title: "columns.desc",
                onclick: function() {
                    ed.windowManager.open({
                        title: ed.getLang("columns.desc", "Create Columns"),
                        items: [ form ],
                        size: "mce-modal-landscape-small",
                        open: function() {
                            var cols, cls, nodes = Columns.getSelectedBlocks(ed), stack = ed.getParam("columns_stack", "medium"), gap = ed.getParam("columns_gap", "medium"), num = ed.getParam("columns_num", 1), layout = ed.getParam("columns_layout", "");
                            nodes.length && (num = nodes.length, nodes = ed.dom.getParent(nodes[0], ".wf-columns")) && (cols = ed.dom.select(".wf-column", nodes), 
                            cls = nodes.getAttribute("class"), cols.length && (num = cols.length), 
                            cls && -1 !== cls.indexOf("wf-columns-stack-") && (stack = /wf-columns-stack-(small|medium|large|xlarge)/.exec(nodes.className)[1]), 
                            cls && -1 !== cls.indexOf("wf-columns-gap-") && (gap = /wf-columns-gap-(none|small|medium|large)/.exec(nodes.className)[1]), 
                            cls && -1 !== cls.indexOf("wf-columns-layout-") && "auto" === (layout = /wf-columns-layout-([0-9-]+|auto)/.exec(cls)[1]) && (layout = ""), 
                            cls = cls.replace(/wf-([a-z0-9-]+)/g, "").trim(), DOM.setHTML(this.id + "_insert", ed.getLang("update", "Update"))), 
                            stackList.value(stack), gapList.value(gap), layoutList.value(layout), 
                            stylesList.value(cls), updateColumnValue(layout, num);
                        },
                        buttons: [ {
                            title: ed.getLang("common.cancel", "Cancel"),
                            id: "cancel"
                        }, {
                            title: ed.getLang("common.insert", "Insert"),
                            id: "insert",
                            onsubmit: function(e) {
                                var data = form.submit();
                                Event.cancel(e), Columns.insertColumn(ed, data);
                            },
                            classes: "primary",
                            autofocus: !0
                        } ]
                    });
                },
                class: "mce_columns"
            })).onRenderMenu.add(function(c, m) {
                var sb = m.add({
                    onmouseover: menuGridMouseOver,
                    onclick: function(e) {
                        sb.setSelected(!1), function(e) {
                            "TD" !== (el = e.target).nodeName && (el = el.parentNode);
                            var el = DOM.getParent(el, "table"), cls = [ "wf-columns" ], stack = ed.getParam("columns_stack", "medium");
                            stack && cls.push("wf-columns-stack-" + stack), (stack = ed.getParam("columns_align", "")) && cls.push("wf-columns-align-" + stack);
                            (stack = ed.getParam("columns_gap", "small")) && "small" !== stack && cls.push("wf-columns-gap-" + stack);
                            for (var html = '<div class="' + cls.join(" ") + '">', rows = tinymce.grep(DOM.select("tr", el), function(row) {
                                return DOM.select("td.selected", row).length;
                            }), block = ed.settings.forced_root_block || "", y = 0; y < rows.length; y++) for (var cols = DOM.select("td.selected", rows[y]).length, x = 0; x < cols; x++) html = (html += '<div class="wf-column">') + (block ? ed.dom.createHTML(block, {}, "&nbsp;") : '<br data-mce-bogus="1" />') + "</div>";
                            html += "</div>", ed.undoManager.add(), ed.execCommand("mceInsertRawHTML", !1, html), 
                            Event.cancel(e);
                        }(e);
                    },
                    html: function(cols, rows) {
                        for (var html = "", html = (html += '<div class="mceToolbarRow">') + '   <div class="mceToolbarItem">' + '       <table role="presentation" class="mceTableSplitMenu"><tbody>', i = 0; i < rows; i++) {
                            html += "<tr>";
                            for (var x = 0; x < cols; x++) html += '<td><a href="#"></a></td>';
                            html += "</tr>";
                        }
                        return html = (html += "       </tbody></table>") + "   </div>" + "</div>";
                    }(5, 1),
                    class: "mceColumns"
                });
                m.onShowMenu.add(function() {
                    (n = DOM.get(sb.id)) && DOM.removeClass(DOM.select(".mceTableSplitMenu td", n), "selected");
                });
            }), cm;
        }
    }), tinymce.PluginManager.add("columns", tinymce.plugins.Columns);
}();