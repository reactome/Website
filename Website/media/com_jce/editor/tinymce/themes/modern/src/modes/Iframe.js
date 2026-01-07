/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
import Events from "../api/Events";

import * as Settings from "../api/Settings";

import A11y from "../ui/A11y";

import ContextToolbars from "../ui/ContextToolbars";

import ContextMenu from "../ui/ContextMenu";

import Menubar from "../ui/Menubar";

import Resize from "../ui/Resize";

import Sidebar from "../ui/Sidebar";

import SkinLoaded from "../ui/SkinLoaded";

import Toolbar from "../ui/Toolbar";

import Factory from "../../../../ui/Factory";

import UiContainer from "../../../../ui/UiContainer";

var DOMUtils = tinymce.dom.DOMUtils, DOM = DOMUtils.DOM, switchMode = function(panel) {
    return function(e) {
        panel.find("*").disabled("readonly" === e.mode);
    };
}, editArea = function() {
    return {
        type: "panel",
        name: "iframe",
        layout: "stack",
        classes: "edit-area",
        html: ""
    };
}, editAreaContainer = function(editor) {
    return {
        type: "panel",
        layout: "stack",
        classes: "edit-aria-container",
        items: [ editArea(), Sidebar.createSidebar(editor) ]
    };
}, render = function(editor, theme, args) {
    !1 === Settings.isSkinDisabled(editor) && args.skinUiCss ? DOM.styleSheetLoader.load(args.skinUiCss, SkinLoaded.fireSkinLoaded(editor)) : SkinLoaded.fireSkinLoaded(editor)(), 
    panel = theme.panel = Factory.create({
        type: "panel",
        role: "application",
        classes: "tinymce",
        style: "visibility: hidden",
        layout: "stack",
        items: [ {
            type: "container",
            classes: "top-part",
            items: [ !1 === Settings.hasMenubar(editor) ? null : {
                type: "menubar",
                items: Menubar.createMenuButtons(editor)
            }, Toolbar.createToolbars(editor, Settings.getToolbarSize(editor)) ]
        }, Sidebar.hasSidebar(editor) ? editAreaContainer(editor) : editArea() ]
    }), UiContainer.setUiContainer(editor, panel), "none" !== Settings.getResize(editor) && (resizeHandleCtrl = {
        type: "resizehandle",
        direction: Settings.getResize(editor),
        onResizeStart: function() {
            var elm = editor.getContentAreaContainer().firstChild;
            startSize = {
                width: elm.clientWidth,
                height: elm.clientHeight
            };
        },
        onResize: function(e) {
            "both" === Settings.getResize(editor) ? Resize.resizeTo(editor, startSize.width + e.deltaX, startSize.height + e.deltaY) : Resize.resizeTo(editor, null, startSize.height + e.deltaY);
        }
    }), Settings.hasStatusbar(editor) && panel.add({
        type: "panel",
        name: "statusbar",
        classes: "statusbar",
        layout: "flow",
        ariaRoot: !0,
        items: [ {
            type: "elementpath",
            editor: editor
        }, resizeHandleCtrl, null ]
    }), Events.fireBeforeRenderUI(editor), editor.on("SwitchMode", switchMode(panel)), 
    panel.renderBefore(args.targetNode).reflow();
    var panel, startSize, theme = panel.find("#iframe")[0].getEl(), resizeHandleCtrl = panel.getEl();
    return args.width && DOM.setStyle(resizeHandleCtrl, "width", args.width), args.height && DOM.setStyle(theme, "height", args.height), 
    Settings.isReadOnly(editor) && editor.setMode("readonly"), editor.on("remove", function() {
        panel.remove(), panel = null;
    }), A11y.addKeys(editor, panel), ContextToolbars.addContextualToolbars(editor), 
    ContextMenu.addContextMenu(editor), {
        iframeContainer: theme,
        editorContainer: resizeHandleCtrl
    };
};

export default {
    render: render
};