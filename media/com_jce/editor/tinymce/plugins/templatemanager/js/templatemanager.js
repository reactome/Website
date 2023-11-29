/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function($) {
    var TemplateManager = {
        settings: {},
        templateHTML: null,
        init: function() {
            var self = this, ed = ($("button#insert").on("click", function(e) {
                self.insert(), e.preventDefault();
            }), tinyMCEPopup.editor), n = ed.selection.getNode(), ed = ed.convertURL(ed.dom.getAttrib(n, "src"));
            Wf.init(), $("#src").val(ed).filebrowser().on("filebrowser:onfileclick", function(e, file) {
                self.selectFile(file);
            }).on("filebrowser:createtemplate", function(e, file) {
                self.createTemplate();
            }), $("#insert").prop("disabled", !0);
        },
        insert: function() {
            tinyMCEPopup.execCommand("mceInsertTemplate", !1, {
                content: this.getHTML(),
                selection: tinyMCEPopup.editor.selection.getContent()
            }), tinyMCEPopup.close();
        },
        getHTML: function() {
            return this.templateHTML;
        },
        setHTML: function(h) {
            this.templateHTML = tinymce.trim(h);
        },
        openTextEditor: function(content) {
            var ed = tinyMCEPopup.editor;
            ed.windowManager.open({
                url: ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=" + Wf.getName() + "&slot=editor.text",
                size: "mce-modal-landscape-full",
                close_previous: !1,
                title: tinyMCEPopup.getLang("dlg.edit_text", "Edit Text")
            }, {
                content: content,
                save: function(name, data) {
                    return new Promise(function(resolve, reject) {
                        var dir = $.fn.filebrowser.getcurrentdir();
                        Wf.JSON.request("createTemplate", {
                            json: [ dir, name ],
                            data: data
                        }, function(o) {
                            $("#src").trigger("filebrowser:load", name), resolve();
                        });
                    });
                }
            });
        },
        createTemplate: function() {
            var ed = tinyMCEPopup.editor, content = ed.getContent(), selection = ed.selection.getContent();
            if ("" === selection && (selection = content), ed.getParam("templatemanager", {}).text_editor) return this.openTextEditor(content);
            Wf.Modal.prompt(ed.getLang("templatemanager_dlg.new_template", "Create Template"), function(name) {
                $.fn.filebrowser.status({
                    message: ed.getLang("dlg.message_load", "Loading..."),
                    state: "load"
                });
                var dir = $.fn.filebrowser.getcurrentdir();
                Wf.JSON.request("createTemplate", {
                    json: [ dir, name ],
                    data: selection
                }, function(o) {
                    $("#src").trigger("filebrowser:load", name);
                });
            }, {
                text: ed.getLang("dlg.name", "Name"),
                open: function(e) {
                    $(".uk-modal-footer .uk-text", e.target).text(Wf.translate("create", "Create"));
                }
            });
        },
        selectFile: function(file) {
            var self = this;
            $("#insert").addClass("loading").prop("disabled", !0), Wf.JSON.request("loadTemplate", file.id, function(o) {
                o && !o.error && self.setHTML(o), $("#insert").removeClass("loading").prop("disabled", !1);
            });
        }
    };
    $(document).ready(function() {
        TemplateManager.init();
    }), window.TemplateManager = TemplateManager;
}(jQuery);