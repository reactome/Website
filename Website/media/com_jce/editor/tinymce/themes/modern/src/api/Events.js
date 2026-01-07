/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
var fireSkinLoaded = function(editor) {
    return editor.dispatch("SkinLoaded");
}, fireResizeEditor = function(editor) {
    return editor.dispatch("ResizeEditor");
}, fireBeforeRenderUI = function(editor) {
    return editor.dispatch("BeforeRenderUI");
};

export default {
    fireSkinLoaded: fireSkinLoaded,
    fireResizeEditor: fireResizeEditor,
    fireBeforeRenderUI: fireBeforeRenderUI
};