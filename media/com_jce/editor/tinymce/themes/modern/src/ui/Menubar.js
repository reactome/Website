/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
var Tools = tinymce.util.Tools, defaultMenus = {
    file: {
        title: "File",
        items: "newdocument restoredraft | print"
    },
    edit: {
        title: "Edit",
        items: "undo redo | cut copy paste pastetext | selectall"
    },
    view: {
        title: "View",
        items: "visualaid visualchars visualblocks | preview fullscreen"
    },
    insert: {
        title: "Insert",
        items: "image link media template codesample inserttable | charmap hr | pagebreak nonbreaking anchor | insertdatetime"
    },
    format: {
        title: "Format",
        items: "bold italic underline strikethrough superscript subscript codeformat | removeformat"
    },
    tools: {
        title: "Tools",
        items: "spellchecker"
    },
    table: {
        title: "Table"
    },
    help: {
        title: "Help"
    }
}, createMenuItem = function(menuItems, name) {
    return "|" == name ? {
        text: "|"
    } : menuItems[name];
}, createMenu = function(editorMenuItems, settings, context) {
    var menuButton, menu, menuItems, isUserDefined, removedMenuItems = Tools.makeMap((settings.removed_menuitems || "").split(/[ ,]/));
    if (settings.menu ? (menu = settings.menu[context], isUserDefined = !0) : menu = defaultMenus[context], 
    menu) {
        menuButton = {
            text: menu.title
        }, menuItems = [], Tools.each((menu.items || "").split(/[ ,]/), function(item) {
            createMenuItem(editorMenuItems, item) && !removedMenuItems[item] && (menuItems.push(createMenuItem(editorMenuItems, item)), 
            removedMenuItems[item] = {});
        }), isUserDefined || Tools.each(editorMenuItems, function(menuItem, name) {
            if (removedMenuItems[name]) return !0;
            menuItem.context == context && ("before" == menuItem.separator && menuItems.push({
                text: "|"
            }), menuItem.prependToContext ? menuItems.unshift(menuItem) : menuItems.push(menuItem), 
            "after" == menuItem.separator) && menuItems.push({
                text: "|"
            });
        });
        for (var i = 0; i < menuItems.length; i++) "|" != menuItems[i].text || 0 !== i && i != menuItems.length - 1 || menuItems.splice(i, 1);
        if (menuButton.menu = menuItems, !menuButton.menu.length) return null;
    }
    return menuButton;
}, createMenuButtons = function(editor) {
    var name, menuButtons = [], settings = editor.settings, defaultMenuBar = [];
    if (settings.menu) for (name in settings.menu) defaultMenuBar.push(name); else for (name in defaultMenus) defaultMenuBar.push(name);
    for (var enabledMenuNames = "string" == typeof settings.menubar ? settings.menubar.split(/[ ,]/) : defaultMenuBar, menuItems = editor.theme.getMenuItems(), i = 0; i < enabledMenuNames.length; i++) {
        var menu = enabledMenuNames[i];
        (menu = createMenu(menuItems, editor.settings, menu)) && menuButtons.push(menu);
    }
    return menuButtons;
};

export default {
    createMenuButtons: createMenuButtons
};