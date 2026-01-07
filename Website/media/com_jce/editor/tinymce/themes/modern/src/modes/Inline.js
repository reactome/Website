/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
import Events from "../api/Events";

import * as Settings from "../api/Settings";

import A11y from "../ui/A11y";

import ContextToolbars from "../ui/ContextToolbars";

import Menubar from "../ui/Menubar";

import SkinLoaded from "../ui/SkinLoaded";

import Toolbar from "../ui/Toolbar";

import Factory from "../../../../ui/Factory";

import UiContainer from "../../../../ui/UiContainer";

import FloatPanel from "../../../../ui/FloatPanel";

var DOMUtils = tinymce.dom.DOMUtils, isFixed = function(inlineToolbarContainer, editor) {
    return !(!inlineToolbarContainer || editor.settings.ui_container);
}, render = function(editor, theme, args) {
    function show() {
        panel && (panel.show(), reposition(), DOM.addClass(editor.getBody(), "mce-edit-focus"));
    }
    function hide() {
        panel && (panel.hide(), FloatPanel.hideAll(), DOM.removeClass(editor.getBody(), "mce-edit-focus"));
    }
    function render() {
        panel ? panel.visible() || show() : (panel = theme.panel = Factory.create({
            type: inlineToolbarContainer ? "panel" : "floatpanel",
            role: "application",
            classes: "tinymce tinywfe-inline",
            layout: "flex",
            autohide: !1,
            autofix: !0,
            fixed: isFixed(inlineToolbarContainer, editor),
            border: 1,
            items: [ Toolbar.createToolbars(editor, Settings.getToolbarSize(editor)) ]
        }), UiContainer.setUiContainer(editor, panel), Events.fireBeforeRenderUI(editor), 
        (inlineToolbarContainer ? panel.renderTo(inlineToolbarContainer) : panel.renderTo()).reflow(), 
        A11y.addKeys(editor, panel), show(), ContextToolbars.addContextualToolbars(editor), 
        editor.on("nodeChange", reposition), editor.on("ResizeWindow", reposition), 
        editor.on("activate", show), editor.on("deactivate", hide), editor.nodeChanged());
    }
    var panel, inlineToolbarContainer, DOM = DOMUtils.DOM, fixedToolbarContainer = Settings.getFixedToolbarContainer(editor), reposition = (fixedToolbarContainer && (inlineToolbarContainer = DOM.select(fixedToolbarContainer)[0]), 
    function() {
        var body, bodyPos, scrollContainer, deltaX, deltaY;
        panel && panel.moveRel && panel.visible() && !panel._fixed && (scrollContainer = editor.selection.getScrollContainer(), 
        body = editor.getBody(), deltaY = deltaX = 0, scrollContainer && (bodyPos = DOM.getPos(body), 
        scrollContainer = DOM.getPos(scrollContainer), deltaX = Math.max(0, scrollContainer.x - bodyPos.x), 
        deltaY = Math.max(0, scrollContainer.y - bodyPos.y)), panel.fixed(!1).moveRel(body, editor.rtl ? [ "tr-br", "br-tr" ] : [ "tl-bl", "bl-tl", "tr-br" ]).moveBy(deltaX, deltaY));
    });
    return editor.settings.content_editable = !0, editor.on("focus", function() {
        !1 === Settings.isSkinDisabled(editor) && args.skinUiCss ? DOM.styleSheetLoader.load(args.skinUiCss, render, render) : render();
    }), editor.on("blur hide", hide), editor.on("remove", function() {
        panel && (panel.remove(), panel = null);
    }), !1 === Settings.isSkinDisabled(editor) && args.skinUiCss ? DOM.styleSheetLoader.load(args.skinUiCss, SkinLoaded.fireSkinLoaded(editor)) : SkinLoaded.fireSkinLoaded(editor)(), 
    {};
};

export default {
    render: render
};