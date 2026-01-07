/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
import Registry from "./Registry";

import Factory from "../../../../ui/Factory";

const Env = tinymce.Env, DOMUtils = tinymce.dom.DOMUtils, Tools = tinymce.util.Tools, DOM = DOMUtils.DOM;

var addContextMenu = function(editor) {
    var menu, visibleState, contextmenuNeverUseNative = editor.settings.contextmenu_never_use_native;
    return !Env.android && !Env.ios && (!1 !== editor.settings.contextmenu ? (editor.on("contextmenu", function(e) {
        if (!function(e) {
            return e.ctrlKey && !contextmenuNeverUseNative;
        }(e)) {
            if (editor.editorManager.setActive(editor), editor.selection.getBookmark(), 
            e.preventDefault(), menu) menu.show(); else {
                const node = editor.selection.getNode(), contextMenuItems = Registry.getContextMenu(), menuItems = Registry.getMenuItems();
                let items = [];
                Tools.each(contextMenuItems, function(predicate, name) {
                    predicate = predicate(node);
                    if (!predicate) return !0;
                    "string" == typeof predicate && (predicate = predicate.split(/[ ,]/)), 
                    Tools.each(predicate, function(name) {
                        var item;
                        menuItems[name] && (item = menuItems[name], (item = "|" == name ? {
                            text: name
                        } : item).shortcut = "", items.push(item));
                    });
                });
                for (var i = 0; i < items.length; i++) "|" != items[i].text || 0 !== i && i != items.length - 1 || items.splice(i, 1);
                (menu = Factory.create("menu", {
                    items: items,
                    context: "contextmenu",
                    classes: "contextmenu"
                }).renderTo()).on("hide", function(e) {
                    e.control === this && (visibleState = !1);
                }), editor.on("remove", function() {
                    menu.remove(), menu = null;
                });
            }
            var pos = {
                x: e.pageX,
                y: e.pageY
            };
            editor.inline || ((pos = DOM.getPos(editor.getContentAreaContainer())).x += e.clientX, 
            pos.y += e.clientY), menu.moveTo(pos.x, pos.y), visibleState = !0;
        }
    }), {
        isContextMenuVisible: function() {
            return !0 === visibleState;
        }
    }) : void 0);
};

export default {
    addContextMenu: addContextMenu
};