/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var Event = tinymce.dom.Event, DOM = tinymce.DOM;
    tinymce.create("tinymce.plugins.ContextMenu", {
        init: function(ed) {
            function isImage(elm) {
                return elm && "IMG" === elm.nodeName;
            }
            var showMenu, contextmenuNeverUseNative, realCtrlKey, hideMenu, self = this;
            self.editor = ed, contextmenuNeverUseNative = ed.settings.contextmenu_never_use_native;
            function hide(ed, e) {
                realCtrlKey = 0, e && 2 == e.button ? realCtrlKey = e.ctrlKey : self._menu && (self._menu.removeAll(), 
                self._menu.destroy(), Event.remove(ed.getDoc(), "click", hideMenu), 
                self._menu = null);
            }
            self.onContextMenu = new tinymce.util.Dispatcher(this), hideMenu = function(e) {
                hide(ed, e);
            }, showMenu = ed.onContextMenu.add(function(ed, e) {
                var elm;
                (0 !== realCtrlKey ? realCtrlKey : e.ctrlKey) && !contextmenuNeverUseNative || (Event.cancel(e), 
                tinymce.isMac && tinymce.isWebKit && 2 === e.button && !function(e) {
                    return e.ctrlKey && !contextmenuNeverUseNative;
                }(e) && ed.selection.isCollapsed() && (isImage(e.target) || ed.selection.placeCaretAt(e.clientX, e.clientY)), 
                (isImage(e.target) || (elm = e.target) && "A" === elm.nodeName) && ed.selection.select(e.target), 
                self._getMenu(ed, e).showMenu(e.clientX || e.pageX, e.clientY || e.pageY), 
                Event.add(ed.getDoc(), "click", hideMenu), ed.nodeChanged());
            }), ed.onRemove.add(function() {
                self._menu && self._menu.removeAll();
            }), ed.onMouseDown.add(hide), ed.onKeyDown.add(hide), ed.onKeyDown.add(function(ed, e) {
                !e.shiftKey || e.ctrlKey || e.altKey || 121 !== e.keyCode || (Event.cancel(e), 
                showMenu(ed, e));
            });
        },
        _getMenu: function(ed, e) {
            var m = this._menu, se = ed.selection, col = se.isCollapsed(), e = e.target;
            return e && "BODY" !== e.nodeName || (e = se.getNode() || ed.getBody()), 
            m && (m.removeAll(), m.destroy()), se = DOM.getPos(ed.getContentAreaContainer()), 
            m = ed.controlManager.createDropMenu("contextmenu", {
                offset_x: se.x + ed.getParam("contextmenu_offset_x", 0),
                offset_y: se.y + ed.getParam("contextmenu_offset_y", 0),
                constrain: !0,
                keyboard_focus: !0
            }), (se = (this._menu = m).addMenu({
                title: "contextmenu.align"
            })).add({
                title: "contextmenu.left",
                icon: "justifyleft",
                cmd: "JustifyLeft"
            }), se.add({
                title: "contextmenu.center",
                icon: "justifycenter",
                cmd: "JustifyCenter"
            }), se.add({
                title: "contextmenu.right",
                icon: "justifyright",
                cmd: "JustifyRight"
            }), se.add({
                title: "contextmenu.full",
                icon: "justifyfull",
                cmd: "JustifyFull"
            }), this.onContextMenu.dispatch(this, m, e, col), m;
        }
    }), tinymce.PluginManager.add("contextmenu", tinymce.plugins.ContextMenu);
}();