/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var each = tinymce.each;
    tinymce.create("tinymce.plugins.JoomlaPlugin", {
        init: function(ed, url) {
            this.editor = ed;
        },
        createControl: function(n, cm) {
            var plugins, ctrl, ed = this.editor;
            return "joomla" === n && (plugins = ed.settings.joomla_xtd_buttons || []).length ? ((ctrl = cm.createSplitButton("joomla", {
                title: "joomla.buttons",
                icon: "joomla"
            })).onRenderMenu.add(function(ctrl, menu) {
                var ed = ctrl.editor, vp = ed.dom.getViewPort(), jModalCloseCore = (each(plugins, function(plg) {
                    var href = (href = plg.href || "") && (href = (href = ed.dom.decode(href)).replace(/(__jce__)/gi, ed.id)).replace(/(e_name|editor)=([\w_]+)/gi, "$1=" + ed.id), item = menu.add({
                        id: ed.dom.uniqueId(),
                        title: plg.title,
                        icon: plg.icon,
                        svg: plg.svg || "",
                        onclick: function(e) {
                            var buttons = [ {
                                id: "cancel",
                                title: ed.getLang("cancel", "Cancel")
                            } ];
                            return ed.lastSelectionBookmark = ed.selection.getBookmark(1), 
                            href && (plg.options && plg.options.confirmCallback && buttons.unshift({
                                id: "confirm",
                                title: plg.options.confirmText || ed.getLang("insert", "Insert"),
                                classes: "primary",
                                onsubmit: function(e) {
                                    new Function(plg.options.confirmCallback).apply();
                                }
                            }), ed.windowManager.open({
                                file: href,
                                title: plg.title,
                                width: Math.max(vp.w - 40, 896),
                                height: Math.max(vp.h - 40, 707),
                                size: "mce-modal-landscape-full",
                                addver: !1,
                                buttons: buttons
                            }), window.Joomla) && window.Joomla.Modal && window.Joomla.Modal.setCurrent(ed.windowManager), 
                            plg.onclick && new Function(plg.onclick).apply(), item.setSelected(!1), 
                            !1;
                        }
                    });
                }), function() {}), SBoxClose = (window.jModalClose && (jModalCloseCore = window.jModalClose), 
                window.jModalClose = function() {
                    var wm = ed.windowManager;
                    return wm.count ? wm.close() : jModalCloseCore();
                }, function() {});
                window.SqueezeBox ? SBoxClose = window.SqueezeBox.close : window.SqueezeBox = {}, 
                window.SqueezeBox.close = function() {
                    var wm = ed.windowManager;
                    return wm.count ? wm.close() : SBoxClose();
                };
            }), ed.onRemove.add(function() {
                ctrl.destroy();
            }), ctrl) : null;
        }
    }), tinymce.PluginManager.add("joomla", tinymce.plugins.JoomlaPlugin);
}();