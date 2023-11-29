/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var each = tinymce.each, DOM = tinymce.DOM, Event = tinymce.dom.Event;
    tinymce.create("tinymce.plugins.AdvListPlugin", {
        init: function(ed, url) {
            function buildFormats(str) {
                var formats = [];
                return each(str.split(/,/), function(type) {
                    var title = type.replace(/-/g, "_");
                    formats.push({
                        title: "advlist." + (title = "default" === type ? "def" : title),
                        styles: {
                            listStyleType: "default" === type ? "" : type
                        }
                    });
                }), formats;
            }
            var numlist = (this.editor = ed).getParam("advlist_number_styles", "default,lower-alpha,lower-greek,lower-roman,upper-alpha,upper-roman"), numlist = (numlist && (this.numlist = buildFormats(numlist)), 
            ed.getParam("advlist_bullet_styles", "default,circle,disc,square"));
            numlist && (this.bullist = buildFormats(numlist));
        },
        createControl: function(name, cm) {
            var btn, format, self = this, editor = self.editor;
            function hasFormat(node, format) {
                var state = !0;
                return each(format.styles, function(value, name) {
                    if (editor.dom.getStyle(node, name) != value) return state = !1;
                }), state;
            }
            function applyListFormat() {
                var dom = editor.dom, sel = editor.selection, list = dom.getParent(sel.getNode(), "ol,ul");
                list && list.nodeName != ("bullist" == name ? "OL" : "UL") && format && !hasFormat(list, format) || editor.execCommand("bullist" == name ? "InsertUnorderedList" : "InsertOrderedList"), 
                format && (list = dom.getParent(sel.getNode(), "ol,ul")) && (dom.setStyles(list, format.styles), 
                list.removeAttribute("data-mce-style")), editor.focus();
            }
            if ("numlist" == name || "bullist" == name) return self[name] && "advlist.def" === self[name][0].title && (format = self[name][0]), 
            self[name] ? ((btn = cm.createSplitButton(name, {
                title: "advanced." + name + "_desc",
                class: "mce_" + name,
                onclick: function() {
                    var form, start_ctrl, reversed_ctrl;
                    if ("numlist" === name && editor.dom.getParent(editor.selection.getNode(), "ol")) return (form = cm.createForm("numlist_form")).empty(), 
                    start_ctrl = cm.createTextBox("numlist_start_ctrl", {
                        label: editor.getLang("advlist.start", "Start"),
                        name: "start",
                        subtype: "number",
                        attributes: {
                            min: "1"
                        }
                    }), form.add(start_ctrl), reversed_ctrl = cm.createCheckBox("numlist_reversed_ctrl", {
                        label: editor.getLang("advlist.reversed", "Reversed"),
                        name: "reversed"
                    }), form.add(reversed_ctrl), void editor.windowManager.open({
                        title: editor.getLang("advanced.numlist_desc", "Ordered List"),
                        items: [ form ],
                        size: "mce-modal-landscape-small",
                        open: function() {
                            var label = editor.getLang("update", "Update"), node = editor.selection.getNode(), node = editor.dom.getParent(node, "ol");
                            node && (start_ctrl.value(editor.dom.getAttrib(node, "start") || 1), 
                            reversed_ctrl.checked(!!editor.dom.getAttrib(node, "reversed"))), 
                            DOM.setHTML(this.id + "_insert", label);
                        },
                        buttons: [ {
                            title: editor.getLang("remove", "Remove"),
                            id: "remove",
                            onclick: function() {
                                applyListFormat(), this.close();
                            }
                        }, {
                            title: editor.getLang("cancel", "Cancel"),
                            id: "cancel"
                        }, {
                            title: editor.getLang("insert", "Insert"),
                            id: "insert",
                            onsubmit: function(e) {
                                var data = form.submit(), list = (Event.cancel(e), 
                                editor.dom.getParent(editor.selection.getNode(), "ol"));
                                list && each(data, function(value, key) {
                                    value = value || null, editor.dom.setAttrib(list, key, value = "start" == key && "1" == value ? null : value);
                                });
                            },
                            classes: "primary",
                            scope: self
                        } ]
                    });
                    applyListFormat();
                }
            })).onRenderMenu.add(function(btn, menu) {
                menu.onHideMenu.add(function() {
                    self.bookmark && (editor.selection.moveToBookmark(self.bookmark), 
                    self.bookmark = 0);
                }), menu.onShowMenu.add(function() {
                    var fmtList, list = editor.dom.getParent(editor.selection.getNode(), "ol,ul");
                    (list || format) && (fmtList = self[name], each(menu.items, function(item) {
                        var state = !0;
                        item.setSelected(0), list && !item.isDisabled() && (each(fmtList, function(fmt) {
                            if (fmt.id == item.id && !hasFormat(list, fmt)) return state = !1;
                        }), state) && item.setSelected(1);
                    }), list || menu.items[format.id].setSelected(1)), editor.focus(), 
                    tinymce.isIE && (self.bookmark = editor.selection.getBookmark(1));
                }), each(self[name], function(item) {
                    item.id = editor.dom.uniqueId();
                    var icon = item.styles.listStyleType.replace(/-/g, "_");
                    menu.add({
                        id: item.id,
                        title: item.title,
                        icon: "list_" + icon,
                        onclick: function() {
                            format = item, applyListFormat();
                        }
                    });
                });
            }), btn) : cm.createButton(name, {
                title: "advanced." + name + "_desc",
                class: "mce_" + name,
                onclick: function() {
                    applyListFormat();
                }
            });
        }
    }), tinymce.PluginManager.add("advlist", tinymce.plugins.AdvListPlugin);
}();