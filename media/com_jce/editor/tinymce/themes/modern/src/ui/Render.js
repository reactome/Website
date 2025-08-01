/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
import * as Settings from "../api/Settings";

import Iframe from "../modes/Iframe";

import Inline from "../modes/Inline";

import ProgressState from "./ProgressState";

var renderUI = function(editor, theme, args) {
    var elm = editor.getElement(), settings = editor.settings, w = settings.width || elm.style.width || "100%", h = settings.height || elm.style.height || elm.offsetHeight, settings = settings.min_height || 100, re = /^[0-9\.]+(|px)$/i, re = (re.test("" + w) && (w = Math.max(parseInt(w, 10), 100)), 
    re.test("" + h) && (h = Math.max(parseInt(h, 10), settings)), args = args || {
        targetNode: elm,
        width: w,
        height: h
    }, Settings.getSkinUrl(editor));
    return re && (args.skinUiCss = re + "/skin.min.css", editor.contentCSS.push(re + "/content" + (editor.inline ? ".inline" : "") + ".min.css")), 
    ProgressState.setup(editor, theme), (Settings.isInline(editor) ? Inline : Iframe).render(editor, theme, args);
};

export default {
    renderUI: renderUI
};