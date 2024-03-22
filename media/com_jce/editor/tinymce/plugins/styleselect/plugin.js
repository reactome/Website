/* jce - 2.9.63 | 2024-03-11 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var each = tinymce.each, PreviewCss = tinymce.util.PreviewCss, NodeType = tinymce.dom.NodeType, DOM = tinymce.DOM, Event = tinymce.dom.Event;
    function compileFilter(filter) {
        var filters;
        return Array.isArray(filter) ? (filters = filter.map(compileFilter), function(value) {
            return filters.every(function(filterFunc) {
                return filterFunc(value);
            });
        }) : "string" == typeof filter && filter ? function(value) {
            return -1 !== value.indexOf(filter);
        } : filter instanceof RegExp ? function(value) {
            return filter.test(value);
        } : filter;
    }
    tinymce.create("tinymce.plugins.StyleSelectPlugin", {
        init: function(ed, url) {
            this.editor = ed;
        },
        createControl: function(n, cf) {
            var ed = this.editor;
            if ("styleselect" === n) if (!1 !== ed.getParam("styleselect_stylesheets") || ed.getParam("style_formats") || ed.getParam("styleselect_custom_classes")) return this._createStyleSelect();
        },
        convertSelectorToFormat: function(selectorText) {
            var format, ed = this.editor;
            if (selectorText) {
                if (ed.settings.styleselect_selector_filter) if (compileFilter(ed.settings.styleselect_selector_filter)(selectorText)) return;
                var selector = /^(?:([a-z0-9\-_]+))?(\.[a-z0-9_\-\.]+)$/i.exec(selectorText);
                if (selector) {
                    var classes, inlineSelectorElements, elementName = selector[1];
                    if ("body" !== elementName) return classes = selector[2].substr(1).split(".").join(" "), 
                    inlineSelectorElements = tinymce.makeMap("a,img"), elementName ? (format = {
                        title: selectorText
                    }, ed.schema.getTextBlockElements()[elementName] ? format.block = elementName : ed.schema.getBlockElements()[elementName] || inlineSelectorElements[elementName.toLowerCase()] ? format.selector = elementName : format.inline = elementName) : selector[2] && (format = {
                        inline: "span",
                        selector: "*",
                        title: selectorText.substr(1),
                        split: !1,
                        expand: !1,
                        deep: !0
                    }), !1 !== ed.settings.importcss_merge_classes ? format.classes = classes : format.attributes = {
                        class: classes
                    }, format.ceFalseOverride = !0, format;
                }
            }
        },
        _createStyleSelect: function(n) {
            var ctrl, self = this, ed = this.editor;
            function removeFilterTags() {
                var filter = DOM.get("menu_" + ctrl.id + "_menu_filter");
                filter && DOM.remove(DOM.select("button.mceButton", filter));
            }
            function removeFilterTag(tag, item) {
                DOM.remove(tag), item || each(ctrl.items, function(n) {
                    if (n.value == tag.value) return item = n, !1;
                }), item && item.onAction && item.onAction();
            }
            function addFilterTag(item) {
                var filter, btn;
                ctrl.menu && (filter = DOM.get("menu_" + ctrl.id + "_menu_filter"), 
                btn = DOM.create("button", {
                    class: "mceButton",
                    value: item.value
                }, "<label>" + item.title + "</label>"), filter) && (DOM.insertBefore(btn, filter.lastChild), 
                Event.add(btn, "click", function(evt) {
                    evt.preventDefault(), "LABEL" !== evt.target.nodeName && removeFilterTag(btn, item);
                }));
            }
            (ctrl = ed.controlManager.createListBox("styleselect", {
                title: "advanced.style_select",
                max_height: 384,
                filter: !0,
                keepopen: !0,
                menu_class: "mceStylesListMenu",
                onselect: function(name) {
                    function isElement(elm) {
                        return NodeType.isElement(elm) && !NodeType.isInternal(elm) && !inlineTextElements[elm.nodeName.toLowerCase()];
                    }
                    function isOnlyTextSelected() {
                        return 0 === function(rng, predicate) {
                            if (rng.collapsed) return [];
                            for (var rng = rng.cloneContents(), walker = new tinymce.dom.TreeWalker(rng.firstChild, rng), elements = [], current = rng.firstChild; predicate(current) && elements.push(current), 
                            current = walker.next(); );
                            return elements;
                        }(ed.selection.getRng(), isElement).length;
                    }
                    function isRoot(node) {
                        return node === ed.dom.getRoot();
                    }
                    var fmt, removedFormat, matches = [], selection = ed.selection, node = selection.getNode(), inlineTextElements = ed.schema.getTextInlineElements(), nodes = (ed.focus(), 
                    ed.undoManager.add(), [ node ]), isCollapsed = selection.isCollapsed();
                    if (isRoot(node)) {
                        if (isCollapsed) return !1;
                        node = selection.getSelectedBlocks();
                        node.length && (nodes = node);
                    }
                    return each(nodes, function(node) {
                        var sel, bookmark = selection.getBookmark();
                        each(ctrl.items, function(item) {
                            (fmt = ed.formatter.matchNode(node, item.value)) && matches.push(fmt);
                        }), !isCollapsed && isOnlyTextSelected() && (node = null), 
                        isRoot(node) && (node = null), selection.moveToBookmark(bookmark), 
                        !node && isCollapsed && (sel = selection.getSel()).anchorNode && NodeType.isElement(sel.anchorNode) && !ed.dom.isBlock(sel.anchorNode) && !isRoot(sel.anchorNode) && (node = sel.anchorNode), 
                        each(matches, function(match) {
                            name && match.name != name || (ed.execCommand("RemoveFormat", !1, {
                                name: match.name,
                                node: match.block ? null : node
                            }), removedFormat = !0);
                        }), removedFormat || (ed.formatter.get(name) ? ed.execCommand("ToggleFormat", !1, {
                            name: name,
                            node: node
                        }) : (node = selection.getNode(), ed.execCommand("ToggleFormat", !1, {
                            name: "classname",
                            node: node
                        }), ctrl.add(name, name))), selection.moveToBookmark(bookmark), 
                        selection.isCollapsed() && node && node.parentNode && ((sel = ed.dom.createRng()).setStart(node, 0), 
                        sel.setEnd(node, 0), sel.collapse(), ed.selection.setRng(sel), 
                        ed.nodeChanged());
                    }), !1;
                }
            })).onBeforeRenderMenu.add(function(ctrl, menu) {
                loadClasses(), menu.onShowMenu.add(function() {
                    removeFilterTags(), each(ctrl.items, function(item) {
                        item.selected && addFilterTag(item);
                    });
                });
            }), ctrl.onRenderMenu.add(function(ctrl, menu) {
                menu.onFilterInput.add(function(menu, evt) {
                    var elm, tags, val;
                    8 != evt.keyCode || (elm = evt.target).value || (tags = DOM.select("button", elm.parentNode.parentNode)).length && (val = (tags = tags.pop()).textContent, 
                    removeFilterTag(tags), evt.preventDefault(), elm.value = val, 
                    elm.focus());
                });
            }), !1 === ed.settings.styleselect_stylesheets && (ctrl.hasClasses = !0);
            var counter = 0;
            function loadClasses() {
                var preview_styles;
                ed.settings.importcss_classes || ed.onImportCSS.dispatch(), Array.isArray(ed.settings.importcss_classes) && !ctrl.hasClasses && (preview_styles = ed.getParam("styleselect_preview_styles", !0), 
                each(ed.settings.importcss_classes, function(item, idx) {
                    var idx = "style_" + (counter + idx), fmt = ("string" == typeof item && (item = {
                        selector: item,
                        class: "",
                        style: ""
                    }), self.convertSelectorToFormat(item.selector));
                    fmt && (ed.formatter.register(idx, fmt), ctrl.add(fmt.title, idx, {
                        style: function() {
                            return preview_styles && item.style || "";
                        }
                    }));
                }), Array.isArray(ed.settings.importcss_classes)) && (ctrl.hasClasses = !0);
            }
            return ed.onNodeChange.add(function(ed, cm, node) {
                var matches, cm = cm.get("styleselect");
                cm && (loadClasses(), matches = [], removeFilterTags(), each(cm.items, function(item) {
                    ed.formatter.matchNode(node, item.value) && (matches.push(item.value), 
                    addFilterTag(item));
                }), cm.select(matches));
            }), ed.onPreInit.add(function() {
                var formats = ed.getParam("style_formats"), styles = ed.getParam("styleselect_custom_classes", "", "hash"), preview_styles = ed.getParam("styleselect_preview_styles", !0);
                if (ed.formatter.register("classname", {
                    attributes: {
                        class: "%value"
                    },
                    selector: "*",
                    ceFalseOverride: !0
                }), formats) {
                    if ("string" == typeof formats) try {
                        formats = JSON.parse(formats);
                    } catch (e) {
                        formats = [];
                    }
                    each(formats, function(fmt) {
                        var frag, name, keys = 0;
                        each(fmt, function() {
                            keys++;
                        }), 1 < keys ? (name = fmt.name = fmt.name || "style_" + counter++, 
                        tinymce.is(fmt.attributes, "string") && (fmt.attributes = ed.dom.decode(fmt.attributes), 
                        frag = ed.dom.createFragment("<div " + tinymce.trim(fmt.attributes) + "></div>"), 
                        frag = ed.dom.getAttribs(frag.firstChild), fmt.attributes = {}, 
                        each(frag, function(node) {
                            var name, isvalid, invalid, key = node.name, node = "" + node.value;
                            if (name = key, isvalid = !0, (invalid = ed.settings.invalid_attributes) && (each(invalid.split(","), function(val) {
                                name === val && (isvalid = !1);
                            }), !isvalid)) return !0;
                            "onclick" !== key && "ondblclick" !== key || (fmt.attributes[key] = "return false;", 
                            key = "data-mce-" + key), fmt.attributes[key] = ed.dom.decode(node);
                        })), tinymce.is(fmt.styles, "string") && (fmt.styles = ed.dom.parseStyle(fmt.styles), 
                        each(fmt.styles, function(value, key) {
                            fmt.styles[key] = ed.dom.decode(value = "" + value);
                        })), tinymce.is(fmt.ceFalseOverride) || (fmt.ceFalseOverride = !0), 
                        ed.formatter.register(name, fmt), ctrl.add(fmt.title, name, {
                            style: function() {
                                return preview_styles ? PreviewCss.getCssText(ed, fmt, !0) : "";
                            }
                        })) : ctrl.add(fmt.title);
                    });
                }
                styles && each(styles, function(val, key) {
                    var name, fmt;
                    val && (val = val.replace(/^\./, ""), name = "style_" + counter++, 
                    ed.formatter.register(name, fmt = {
                        inline: "span",
                        classes: val,
                        selector: "*",
                        ceFalseOverride: !0
                    }), key = key && key.replace(/^\./, ""), ctrl.add(ed.translate(key), name, {
                        style: function() {
                            return preview_styles ? PreviewCss.getCssText(ed, fmt, !0) : "";
                        }
                    }));
                });
            }), ctrl;
        }
    }), tinymce.PluginManager.add("styleselect", tinymce.plugins.StyleSelectPlugin);
}();