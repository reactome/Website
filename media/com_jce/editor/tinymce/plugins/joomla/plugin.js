/* jce - 2.9.61 | 2024-01-21 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var Joomla = window.Joomla || null, each = tinymce.each, DOM = tinymce.DOM;
    tinymce.create("tinymce.plugins.JoomlaPlugin", {
        init: function(ed, url) {
            this.editor = ed;
        },
        createControl: function(n, cm) {
            var plugins, ctrl, ed = this.editor;
            return "joomla" === n && ((n = ed.settings.joomla_xtd_buttons || {})[ed.id] || n.__jce__ || n.ckeditor) && (plugins = n[ed.id] || n.__jce__ || n.ckeditor || []).length ? (ctrl = cm.createSplitButton("joomla", {
                title: "joomla.buttons",
                icon: "joomla"
            }), function(ed) {
                var ckModal = DOM.select('.modal[id^="ckeditor_"][id$="_modal"]');
                each(ckModal, function(modal) {
                    var newModal = modal.cloneNode(!0), id = newModal.id, url = newModal.getAttribute("data-url"), ifr = newModal.getAttribute("data-iframe"), ifr = (url && id && (id = id.replace("ckeditor_", ed.id + "_"), 
                    url = url.replace(/=ckeditor\b/g, "=" + ed.id)), DOM.create("div", {}, DOM.decode(ifr))), iframe = ifr.firstChild;
                    iframe && iframe.setAttribute("src", url), newModal.setAttribute("id", id), 
                    newModal.setAttribute("data-url", url), newModal.setAttribute("data-iframe", ifr.innerHTML), 
                    newModal.innerHTML = newModal.innerHTML.replace(/'ckeditor'/g, `'${ed.id}'`), 
                    document.body.appendChild(newModal), Joomla.initialiseModal(newModal), 
                    DOM.remove(modal);
                });
            }(ed), ctrl.onRenderMenu.add(function(ctrl, menu) {
                var ed = ctrl.editor, vp = ed.dom.getViewPort(), jModalCloseCore = (each(plugins, function(plg, name) {
                    var href = (href = plg.href || "") && (href = (href = ed.dom.decode(href)).replace(/(__jce__|ckeditor)/gi, ed.id)).replace(/(e_name|editor)=([\w_]+)/gi, "$1=" + ed.id), item = (plg.id = plg.id.replace(/(__jce__|ckeditor)/gi, ed.id), 
                    menu.add({
                        id: ed.dom.uniqueId(),
                        title: plg.title,
                        icon: plg.icon,
                        svg: plg.svg || "",
                        onclick: function(e) {
                            var modal, buttons = [ {
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
                            }), (modal = DOM.get(plg.id + "_modal")) ? modal.open() : (ed.windowManager.open({
                                file: href,
                                title: plg.title,
                                width: Math.max(vp.w - 40, 896),
                                height: Math.max(vp.h - 40, 707),
                                size: "mce-modal-landscape-full",
                                addver: !1,
                                buttons: buttons
                            }), Joomla && Joomla.Modal && Joomla.Modal.setCurrent(ed.windowManager))), 
                            plg.onclick && new Function(plg.onclick).apply(), item.setSelected(!1), 
                            !1;
                        }
                    }));
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