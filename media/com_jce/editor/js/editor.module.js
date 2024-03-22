/* jce - 2.9.63 | 2024-03-11 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
import {
    JoomlaEditor,
    JoomlaEditorDecorator
} from "editor-api";

class JceDecorator extends JoomlaEditorDecorator {
    getValue() {
        return WfEditor.getContent(this.instance.id);
    }
    setValue(value) {
        return WfEditor.setContent(this.instance.id, value), this;
    }
    getSelection() {
        return WfEditor.getSelection(this.instance.id, {
            format: "text"
        });
    }
    replaceSelection(value) {
        return WfEditor.insert(this.instance.id, value), this;
    }
    disable(enable) {
        return this.instance.setMode(enable ? "design" : "readonly"), this;
    }
    toggle(show) {
        return WfEditor.toggleEditor(this.instance.getElement()), !1;
    }
}

tinyMCE.onAddEditor.add(function(mgr, editor) {
    var elm = editor.getElement(), container = elm.parentNode;
    if ("advanced" === editor.settings.theme) {
        const JceEditor = new JceDecorator(editor, "jce", elm.id), editorButtons = (JoomlaEditor.register(JceEditor), 
        mgr.editors[0] === editor && JoomlaEditor.setActive(JceEditor), container.parentNode.querySelector(".editor-xtd-buttons"));
        editorButtons && (editorButtons.addEventListener("click", function(e) {
            e.target.matches("button") && e.target.parentNode === editorButtons && (mgr.setActive(editor), 
            JoomlaEditor.setActive(JceEditor));
        }), editorButtons.querySelectorAll(".modal").forEach(function(modal) {
            document.body.appendChild(modal);
        }));
    }
}), window.JceDecorator = JceDecorator;