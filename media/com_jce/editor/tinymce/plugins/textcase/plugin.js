/* jce - 2.9.63 | 2024-03-11 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
tinymce.create("tinymce.plugins.TextCase", {
    init: function(ed, url) {
        var self = this;
        this.url = url, (this.editor = ed).addCommand("mceUpperCase", function() {
            self._upperCase();
        }), ed.addCommand("mceLowerCase", function() {
            self._lowerCase();
        }), ed.addCommand("mceTitleCase", function() {
            self._titleCase();
        }), ed.addCommand("mceSentenceCase", function() {
            self._sentenceCase();
        }), ed.onNodeChange.add(function(ed, cm, n, co) {
            cm.setDisabled("textcase", co);
        });
    },
    createControl: function(n, cm) {
        var ed = this.editor;
        return "textcase" === n ? ((n = cm.createSplitButton("textcase", {
            title: "textcase.uppercase",
            icon: "uppercase",
            onclick: function() {
                ed.execCommand("mceUpperCase");
            }
        })).onRenderMenu.add(function(c, m) {
            m.add({
                title: "textcase.uppercase",
                icon: "uppercase",
                onclick: function() {
                    ed.execCommand("mceUpperCase");
                }
            }), m.add({
                title: "textcase.lowercase",
                icon: "lowercase",
                onclick: function() {
                    ed.execCommand("mceLowerCase");
                }
            }), m.add({
                title: "textcase.sentencecase",
                icon: "sentencecase",
                onclick: function() {
                    ed.execCommand("mceSentenceCase");
                }
            }), m.add({
                title: "textcase.titlecase",
                icon: "titlecase",
                onclick: function() {
                    ed.execCommand("mceTitleCase");
                }
            });
        }), n) : null;
    },
    _sentenceCase: function() {
        var s = this.editor.selection, text = (text = s.getContent()).toLowerCase().replace(/([\u0000-\u1FFF])/, function(a, b) {
            return b.toUpperCase();
        }).replace(/(\.\s?)([\u0000-\u1FFF])/gi, function(a, b, c) {
            return b + c.toUpperCase();
        });
        s.setContent(text);
    },
    _titleCase: function() {
        var s = this.editor.selection, text = s.getContent();
        text = (text = text.toLowerCase()).replace(/(?:^|\s)[\u0000-\u1FFF]/g, function(match) {
            return match.toUpperCase();
        }), s.setContent(text);
    },
    _lowerCase: function() {
        var s = this.editor.selection, text = s.getContent();
        s.setContent(text.toLowerCase());
    },
    _upperCase: function() {
        var s = this.editor.selection, text = s.getContent();
        s.setContent(text.toUpperCase());
    }
}), tinymce.PluginManager.add("textcase", tinymce.plugins.TextCase);