/* This file includes original and modified code from various versions of TinyMCE, relicensed under GPL v2+ per LGPL 2.1 §3 where applicable. Source: https://github.com/widgetfactory/tinymce-muon; Copyright (c) Tiny Technologies, Inc. All rights reserved.; Copyright (c) 1999–2015 Ephox Corp. All rights reserved.; Copyright (c) 2009       Moxiecode Systems AB. All rights reserved.; Copyright (c) 2009–2025  Ryan Demmer. All rights reserved.; For a detailed history of modifications, refer to the Git commit history.; Licensed under the GNU General Public License version 2 or later (GPL v2+): https://www.gnu.org/licenses/gpl-2.0.html */
import Api from "../../../ui/Api";

import ThemeApi from "./api/ThemeApi";

Api.registerToFactory(), Api.appendTo(tinymce), tinymce.ThemeManager.add("modern", function(editor) {
    return editor.on("init", function() {
        editor.dispatch("SkinLoaded");
    }), ThemeApi.get(editor);
});

export default function() {}