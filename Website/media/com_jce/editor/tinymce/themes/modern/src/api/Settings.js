/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
var EditorManager = tinymce.EditorManager, Tools = tinymce.util.Tools, isBrandingEnabled = function(editor) {
    return editor.getParam("branding", !0, "boolean");
}, hasMenubar = function(editor) {
    return !1 !== getMenubar(editor);
}, getMenubar = function(editor) {
    return editor.getParam("menubar");
}, hasStatusbar = function(editor) {
    return editor.getParam("statusbar", !0, "boolean");
}, getToolbarSize = function(editor) {
    return editor.getParam("toolbar_items_size");
}, isReadOnly = function(editor) {
    return editor.getParam("readonly", !1, "boolean");
}, getFixedToolbarContainer = function(editor) {
    return editor.getParam("fixed_toolbar_container");
}, getInlineToolbarPositionHandler = function(editor) {
    return editor.getParam("inline_toolbar_position_handler");
}, getMenu = function(editor) {
    return editor.getParam("menu");
}, getRemovedMenuItems = function(editor) {
    return editor.getParam("removed_menuitems", "");
}, getMinWidth = function(editor) {
    return editor.getParam("min_width", 100, "number");
}, getMinHeight = function(editor) {
    return editor.getParam("min_height", 100, "number");
}, getMaxWidth = function(editor) {
    return editor.getParam("max_width", 65535, "number");
}, getMaxHeight = function(editor) {
    return editor.getParam("max_height", 65535, "number");
}, isSkinDisabled = function(editor) {
    return !1 === editor.settings.skin;
}, isInline = function(editor) {
    return editor.getParam("inline", !1, "boolean");
}, getResize = function(editor) {
    editor = editor.getParam("resize", "vertical");
    return !1 === editor ? "none" : "both" === editor ? "both" : "vertical";
}, getSkinUrl = function(editor) {
    var settings = editor.settings, skin = settings.skin, settings = settings.skin_url;
    return !1 !== skin && (skin = skin || "modern", settings = settings ? editor.documentBaseURI.toAbsolute(settings) : EditorManager.baseURL + "/skins/" + skin), 
    settings;
}, getIndexedToolbars = function(settings, defaultToolbar) {
    for (var toolbars = [], i = 1; i < 10; i++) {
        var toolbar = settings["toolbar" + i];
        if (!toolbar) break;
        toolbars.push(toolbar);
    }
    defaultToolbar = settings.toolbar ? [ settings.toolbar ] : [ defaultToolbar ];
    return 0 < toolbars.length ? toolbars : defaultToolbar;
}, getToolbars = function(editor) {
    var toolbar = editor.getParam("toolbar");
    return !1 === toolbar ? [] : Tools.isArray(toolbar) ? Tools.grep(toolbar, function(toolbar) {
        return 0 < toolbar.length;
    }) : getIndexedToolbars(editor.settings, "undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image");
};

export {
    isBrandingEnabled,
    hasMenubar,
    getMenubar,
    hasStatusbar,
    getToolbarSize,
    getResize,
    isReadOnly,
    getFixedToolbarContainer,
    getInlineToolbarPositionHandler,
    getMenu,
    getRemovedMenuItems,
    getMinWidth,
    getMinHeight,
    getMaxWidth,
    getMaxHeight,
    getSkinUrl,
    isSkinDisabled,
    isInline,
    getToolbars
};