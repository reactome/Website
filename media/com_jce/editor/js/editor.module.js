/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
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
    var elm = editor.getElement();
    "advanced" === editor.settings.theme && (editor = new JceDecorator(editor, "jce", elm.id), 
    JoomlaEditor.register(editor));
}), window.JceDecorator = JceDecorator;