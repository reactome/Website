/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
import Events from "../api/Events";

import Factory from "../../../../ui/Factory";

var Tools = tinymce.util.Tools, api = function(elm) {
    return {
        element: function() {
            return elm;
        }
    };
}, trigger = function(sidebar, panel, callbackName) {
    sidebar = sidebar.settings[callbackName];
    sidebar && sidebar(api(panel.getEl("body")));
}, hidePanels = function(name, container, sidebars) {
    Tools.each(sidebars, function(sidebar) {
        var panel = container.items().filter("#" + sidebar.name)[0];
        panel && panel.visible() && sidebar.name !== name && (trigger(sidebar, panel, "onhide"), 
        panel.visible(!1));
    });
}, deactivateButtons = function(toolbar) {
    toolbar.items().each(function(ctrl) {
        ctrl.active(!1);
    });
}, findSidebar = function(sidebars, name) {
    return Tools.grep(sidebars, function(sidebar) {
        return sidebar.name === name;
    })[0];
}, showPanel = function(editor, name, sidebars) {
    return function(e) {
        var e = e.control, container = e.parents().filter("panel")[0], panel = container.find("#" + name)[0], sidebar = findSidebar(sidebars, name);
        hidePanels(name, container, sidebars), deactivateButtons(e.parent()), panel && panel.visible() ? (trigger(sidebar, panel, "onhide"), 
        panel.hide(), e.active(!1)) : (panel ? panel.show() : (panel = Factory.create({
            type: "container",
            name: name,
            layout: "stack",
            classes: "sidebar-panel",
            html: ""
        }), container.prepend(panel), trigger(sidebar, panel, "onrender")), trigger(sidebar, panel, "onshow"), 
        e.active(!0)), Events.fireResizeEditor(editor);
    };
}, hasSidebar = function(editor) {
    return !!editor.sidebars && 0 < editor.sidebars.length;
}, createSidebar = function(editor) {
    return {
        type: "panel",
        name: "sidebar",
        layout: "stack",
        classes: "sidebar",
        items: [ {
            type: "toolbar",
            layout: "stack",
            classes: "sidebar-toolbar",
            items: Tools.map(editor.sidebars, function(sidebar) {
                var settings = sidebar.settings;
                return {
                    type: "button",
                    icon: settings.icon,
                    image: settings.image,
                    tooltip: settings.tooltip,
                    onclick: showPanel(editor, sidebar.name, editor.sidebars)
                };
            })
        } ]
    };
};

export default {
    hasSidebar: hasSidebar,
    createSidebar: createSidebar
};