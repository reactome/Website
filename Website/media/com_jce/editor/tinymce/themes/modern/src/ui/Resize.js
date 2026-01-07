/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
import Events from "../api/Events";

import * as Settings from "../api/Settings";

var DOMUtils = tinymce.dom.DOMUtils, DOM = DOMUtils.DOM, getSize = function(elm) {
    return {
        width: elm.clientWidth,
        height: elm.clientHeight
    };
}, resizeTo = function(editor, width, height) {
    var containerElm = editor.getContainer(), iframeElm = editor.getContentAreaContainer().firstChild, containerSize = getSize(containerElm), iframeSize = getSize(iframeElm);
    null !== width && (width = Math.max(Settings.getMinWidth(editor), width), width = Math.min(Settings.getMaxWidth(editor), width), 
    DOM.setStyle(containerElm, "width", width + (containerSize.width - iframeSize.width))), 
    height = Math.max(Settings.getMinHeight(editor), height), height = Math.min(Settings.getMaxHeight(editor), height), 
    DOM.setStyle(iframeElm, "height", height), Events.fireResizeEditor(editor);
}, resizeBy = function(editor, dw, dh) {
    var elm = editor.getContentAreaContainer();
    resizeTo(editor, elm.clientWidth + dw, elm.clientHeight + dh);
};

export default {
    resizeTo: resizeTo,
    resizeBy: resizeBy
};