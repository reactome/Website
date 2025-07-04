/* jce - 2.9.88 | 2025-06-19 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var Storage = tinymce.util.Storage;
    tinymce.PluginManager.add("visualchars", function(ed, url) {
        function toggleVisualChars(state, o) {
            var node, nodeList, i, nodeValue, div, charMap, visualCharsRegExp, o = o || ed.getBody();
            function wrapCharWithSpan(value) {
                return '<span data-mce-bogus="1" class="mce-item-' + charMap[value] + '">' + value + "</span>";
            }
            if (charMap = {
                "\xa0": "nbsp",
                "\xad": "shy"
            }, visualCharsRegExp = function() {
                var key, regExp = "";
                for (key in charMap) regExp += key;
                return new RegExp("[" + regExp + "]", "g");
            }(), state) for (nodeList = [], tinymce.walk(o, function(n) {
                (function(n) {
                    return 3 === n.nodeType && !ed.dom.getParent(n, ".mce-item-nbsp, .mce-item-shy");
                })(n) && n.nodeValue && visualCharsRegExp.test(n.nodeValue) && nodeList.push(n);
            }, "childNodes"), i = 0; i < nodeList.length; i++) {
                for (nodeValue = nodeList[i].nodeValue, nodeValue = (nodeValue = ed.dom.encode(nodeValue)).replace(visualCharsRegExp, wrapCharWithSpan), 
                div = ed.dom.create("div", null, nodeValue); node = div.lastChild; ) ed.dom.insertAfter(node, nodeList[i]);
                ed.dom.remove(nodeList[i]);
            } else for (i = (nodeList = ed.dom.select(function() {
                var key, selector = "";
                for (key in charMap) selector && (selector += ","), selector += "span.mce-item-" + charMap[key];
                return selector;
            }(), o)).length - 1; 0 <= i; i--) ed.dom.remove(nodeList[i], 1);
        }
        var state;
        ed.getParam("use_state_cookies", !0) && (state = Storage.get("wf_visualchars_state")), 
        state = tinymce.is(state, "string") ? parseFloat(state) : ed.getParam("visualchars_default_state", 0), 
        ed.onInit.add(function() {
            ed.controlManager.setActive("visualchars", state), toggleVisualChars(state);
        }), ed.addButton("visualchars", {
            title: "visualchars.desc",
            cmd: "mceVisualChars"
        }), ed.onExecCommand.add(function(ed, cmd, ui, v, o) {
            "mceNonBreaking" === cmd && toggleVisualChars(state);
        }), ed.addCommand("mceVisualChars", function() {
            state = !state, ed.controlManager.setActive("visualchars", state), toggleVisualChars(state), 
            ed.getParam("use_state_cookies", !0) && Storage.set("wf_visualchars_state", state ? 1 : 0);
        }, self), ed.onKeyUp.add(function(ed, e) {
            state && 13 == e.keyCode && toggleVisualChars(state);
        }), ed.onPreProcess.add(function(ed, o) {
            o.get && toggleVisualChars(!1, o.node);
        }), ed.onSetContent.add(function(ed, o) {
            toggleVisualChars(state);
        });
    });
}();