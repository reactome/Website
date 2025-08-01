/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
import * as Settings from "../api/Settings";

import Toolbar from "./Toolbar";

import Factory from "../../../../ui/Factory";

import UiContainer from "../../../../ui/UiContainer";

import Registry from "./Registry";

var DOMUtils = tinymce.dom.DOMUtils, Rect = tinymce.geom.Rect, Delay = tinymce.util.Delay, Tools = tinymce.util.Tools, DOM = DOMUtils.DOM, toClientRect = function(geomRect) {
    return {
        left: geomRect.x,
        top: geomRect.y,
        width: geomRect.w,
        height: geomRect.h,
        right: geomRect.x + geomRect.w,
        bottom: geomRect.y + geomRect.h
    };
}, getContextToolbars = function() {
    return Registry.getContextToolbars() || [];
}, hideAllFloatingPanels = function(editor) {
    Tools.each(getContextToolbars(), function(toolbar) {
        toolbar.panel && toolbar.panel.hide();
    });
}, movePanelTo = function(panel, pos) {
    panel.moveTo(pos.left, pos.top);
}, togglePositionClass = function(panel, relPos, predicate) {
    relPos = relPos ? relPos.substr(0, 2) : "", Tools.each({
        t: "down",
        b: "up"
    }, function(cls, pos) {
        panel.classes.toggle("arrow-" + cls, predicate(pos, relPos.substr(0, 1)));
    }), Tools.each({
        l: "left",
        r: "right"
    }, function(cls, pos) {
        panel.classes.toggle("arrow-" + cls, predicate(pos, relPos.substr(1, 1)));
    });
}, userConstrain = function(handler, x, y, elementRect, contentAreaRect, panelRect) {
    return panelRect = toClientRect({
        x: x,
        y: y,
        w: panelRect.w,
        h: panelRect.h
    }), panelRect = handler ? handler({
        elementRect: toClientRect(elementRect),
        contentAreaRect: toClientRect(contentAreaRect),
        panelRect: panelRect
    }) : panelRect;
}, addContextualToolbars = function(editor) {
    function reposition(match, shouldShow) {
        var panel, relRect, testPositions, panelRect, contentAreaRect, delta, handler = Settings.getInlineToolbarPositionHandler(editor);
        editor.removed || (match && match.toolbar.panel ? (testPositions = [ "bc-tc", "tc-bc", "tl-bl", "bl-tl", "tr-br", "br-tr" ], 
        panel = match.toolbar.panel, shouldShow && panel.show(), shouldShow = getElementRect(match.element), 
        panelRect = DOM.getRect(panel.getEl()), contentAreaRect = DOM.getRect(editor.getContentAreaContainer() || editor.getBody()), 
        delta = UiContainer.getUiContainerDelta(panel) || {
            x: 0,
            y: 0
        }, shouldShow.x += delta.x, shouldShow.y += delta.y, panelRect.x += delta.x, 
        panelRect.y += delta.y, contentAreaRect.x += delta.x, contentAreaRect.y += delta.y, 
        "inline" !== DOM.getStyle(match.element, "display", !0) && (delta = match.element.getBoundingClientRect(), 
        shouldShow.w = delta.width, shouldShow.h = delta.height), editor.inline || (contentAreaRect.w = editor.getDoc().documentElement.offsetWidth), 
        editor.selection.controlSelection.isResizable(match.element) && shouldShow.w < 25 && (shouldShow = Rect.inflate(shouldShow, 0, 8)), 
        delta = Rect.findBestRelativePosition(panelRect, shouldShow, contentAreaRect, testPositions), 
        shouldShow = Rect.clamp(shouldShow, contentAreaRect), delta ? (relRect = Rect.relativePosition(panelRect, shouldShow, delta), 
        movePanelTo(panel, userConstrain(handler, relRect.x, relRect.y, shouldShow, contentAreaRect, panelRect))) : (contentAreaRect.h += panelRect.h, 
        (shouldShow = Rect.intersect(contentAreaRect, shouldShow)) ? (delta = Rect.findBestRelativePosition(panelRect, shouldShow, contentAreaRect, [ "bc-tc", "bl-tl", "br-tr" ])) ? (relRect = Rect.relativePosition(panelRect, shouldShow, delta), 
        movePanelTo(panel, userConstrain(handler, relRect.x, relRect.y, shouldShow, contentAreaRect, panelRect))) : movePanelTo(panel, userConstrain(handler, shouldShow.x, shouldShow.y, shouldShow, contentAreaRect, panelRect)) : panel.hide()), 
        togglePositionClass(panel, delta, function(pos1, pos2) {
            return pos1 === pos2;
        })) : hideAllFloatingPanels(editor));
    }
    function showContextToolbar(match) {
        var panel;
        match.toolbar.panel ? match.toolbar.panel.show() : (panel = Factory.create({
            type: "floatpanel",
            role: "dialog",
            classes: "tinymce tinymce-inline arrow",
            ariaLabel: "Inline toolbar",
            layout: "flex",
            autohide: !1,
            autofix: !0,
            fixed: !0,
            items: Toolbar.createToolbar(editor, match.toolbar.items),
            oncancel: function() {
                editor.focus();
            }
        }), UiContainer.setUiContainer(editor, panel), function(panel) {
            var reposition_1, uiContainer_1;
            scrollContainer || (reposition_1 = repositionHandler(!0), uiContainer_1 = UiContainer.getUiContainer(panel), 
            scrollContainer = editor.selection.getScrollContainer() || editor.getWin(), 
            DOM.bind(scrollContainer, "scroll", reposition_1), DOM.bind(uiContainer_1, "scroll", reposition_1), 
            editor.on("remove", function() {
                DOM.unbind(scrollContainer, "scroll", reposition_1), DOM.unbind(uiContainer_1, "scroll", reposition_1);
            }));
        }(panel), (match.toolbar.panel = panel).renderTo().reflow()), reposition(match);
    }
    function hideAllContextToolbars() {
        Tools.each(getContextToolbars(), function(toolbar) {
            toolbar.panel && toolbar.panel.hide();
        });
    }
    function findFrontMostMatch(targetElm) {
        for (var y, toolbars = getContextToolbars(), parentsAndSelf = editor.$(targetElm).parents().add(targetElm), i = parentsAndSelf.length - 1; 0 <= i; i--) for (y = toolbars.length - 1; 0 <= y; y--) if (toolbars[y].predicate(parentsAndSelf[i])) return {
            toolbar: toolbars[y],
            element: parentsAndSelf[i]
        };
        return null;
    }
    var scrollContainer, getElementRect = function(elm) {
        var pos = DOM.getPos(editor.getContentAreaContainer()), elm = editor.dom.getRect(elm), root = editor.dom.getRoot();
        return "BODY" === root.nodeName && (elm.x -= root.ownerDocument.documentElement.scrollLeft || root.scrollLeft, 
        elm.y -= root.ownerDocument.documentElement.scrollTop || root.scrollTop), 
        elm.x += pos.x, elm.y += pos.y, elm;
    }, repositionHandler = function(show) {
        return function() {
            Delay.requestAnimationFrame(function() {
                editor.selection && reposition(findFrontMostMatch(editor.selection.getNode()), show);
            });
        };
    };
    editor.on("click keyup focus setContent ObjectResized", function(e) {
        "setcontent" === e.type && !e.selection || Delay.setEditorTimeout(editor, function() {
            var match = findFrontMostMatch(editor.selection.getNode());
            hideAllContextToolbars(), match && showContextToolbar(match);
        });
    }), editor.on("blur hide contextmenu", hideAllContextToolbars), editor.on("ObjectResizeStart", function() {
        var match = findFrontMostMatch(editor.selection.getNode());
        match && match.toolbar.panel && match.toolbar.panel.hide();
    }), editor.on("ResizeEditor ResizeWindow", repositionHandler(!0)), editor.on("nodeChange", repositionHandler(!1)), 
    editor.on("remove", function() {
        Tools.each(getContextToolbars(), function(toolbar) {
            toolbar.panel && toolbar.panel.remove();
        });
    }), editor.shortcuts.add("ctrl+F9", "", function() {
        var match = findFrontMostMatch(editor.selection.getNode());
        match && match.toolbar.panel && match.toolbar.panel.items()[0].focus();
    });
};

export default {
    addContextualToolbars: addContextualToolbars
};