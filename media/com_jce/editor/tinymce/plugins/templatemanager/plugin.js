/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var each = tinymce.each, DomParser = tinymce.html.DomParser, HtmlSerializer = tinymce.html.Serializer, XHR = tinymce.util.XHR, Uuid = tinymce.util.Uuid, fontIconRe = /<([a-z0-9]+)([^>]+)class="([^"]*)(glyph|uk-)?(fa|icon)-([\w-]+)([^"]*)"([^>]*)>(&nbsp;|\u00a0)?<\/\1>/gi;
    function dataToHtml(editor, data) {
        data = new DomParser({
            allow_event_attributes: !!editor.settings.allow_event_attributes
        }, editor.schema).parse(data, {
            forced_root_block: !1,
            isRootContent: !0
        }), data = data.getAll("body")[0] || data;
        return new HtmlSerializer({
            validate: editor.settings.validate
        }, editor.schema).serialize(data);
    }
    function createClassSelector(values) {
        return values = values.trim(), tinymce.map(values.split(" "), function(cls) {
            if (cls) return "." + cls;
        }).join(",");
    }
    tinymce.create("tinymce.plugins.TemplatePlugin", {
        init: function(ed, url) {
            var self = this;
            self.editor = ed, self.contentLoaded = !1, this.params = ed.getParam("templatemanager", {}), 
            ed.addCommand("mceTemplate", function(ui) {
                ed.windowManager.open({
                    file: ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=templatemanager",
                    size: "mce-modal-landscape-xxlarge"
                }, {
                    plugin_url: url
                });
            }), ed.onInit.add(function() {
                ed.plugins.contextmenu && ed.plugins.contextmenu.onContextMenu.add(function(th, m, e) {
                    m.add({
                        title: "templatemanager.desc",
                        icon: "templatemanager",
                        cmd: "mceTemplate"
                    });
                });
            }), ed.addCommand("mceInsertTemplate", function(ui, o) {
                o = self._processContent(o.content);
                return self._insertTemplate(o);
            }), this.params.list || ed.addButton("templatemanager", {
                title: "templatemanager.desc",
                cmd: "mceTemplate"
            }), ed.onPreProcess.add(function(ed, o) {
                var dom = ed.dom, mdate_classes = (dom.remove(dom.select("div.mceTmpl", o.node), 1), 
                self.params.mdate_classes || "mdate modifieddate"), mdate_format = self.params.mdate_format || ed.getLang("templatemanager.mdate_format"), ed = createClassSelector(mdate_classes);
                each(dom.select(ed, o.node), function(elm) {
                    elm.innerHTML = self._getDateTime(new Date(), mdate_format);
                });
            });
            var content_url = self.params.content_url || "";
            content_url && ed.onInit.add(function() {
                var content;
                self.contentLoaded || "" != (content = ed.getContent()) && "<p>&nbsp;</p>" != content || (/http(s)?:\/\//.test(content_url) || (ed.setProgressState(!0), 
                XHR.send({
                    url: ed.settings.document_base_url + "/" + content_url,
                    success: function(value) {
                        value = dataToHtml(ed, value);
                        value && ed.execCommand("mceInsertTemplate", !1, {
                            content: value
                        }), ed.setProgressState(!1), self.contentLoaded = !0;
                    },
                    error: function(e) {
                        ed.setProgressState(!1), self.contentLoaded = !0;
                    }
                })));
            });
        },
        _processContent: function(html) {
            var self = this, ed = self.editor, dom = ed.dom, params = this.params, replace_values = params.replace_values || {}, cdate_classes = (each(replace_values, function(v, k) {
                "function" != typeof v && (html = html.replace(new RegExp("\\{\\$" + k + "\\}", "g"), v));
            }), html = dataToHtml(ed, html), replace_values = dom.create("div", null, html), 
            dom.remove(dom.select("div.mceTmpl", replace_values), 1), params.cdate_classes || "cdate creationdate"), cdate_format = params.cdate_format || ed.getLang("templatemanager.cdate_format"), mdate_classes = params.mdate_classes || "mdate modifieddate", mdate_format = params.mdate_format || ed.getLang("templatemanager.mdate_format"), params = params.selected_content_classes || "selcontent", selection = ed.selection.getContent(), ed = createClassSelector(cdate_classes), cdate_classes = createClassSelector(mdate_classes), mdate_classes = createClassSelector(params);
            return each(dom.select(ed, replace_values), function(elm) {
                elm.innerHTML = self._getDateTime(new Date(), cdate_format);
            }), each(dom.select(cdate_classes, replace_values), function(elm) {
                elm.innerHTML = self._getDateTime(new Date(), mdate_format);
            }), each(dom.select(mdate_classes, replace_values), function(elm) {
                elm.innerHTML = selection;
            }), replace_values.innerHTML;
        },
        _insertTemplate: function(html) {
            var ed = this.editor;
            function insertAndUpdate(content) {
                ed.execCommand("mceInsertContent", !1, content), !1 === ed.settings.verify_html && (ed.settings.validate = !1), 
                ed.addVisual();
            }
            !1 === ed.settings.validate && (ed.settings.validate = !0);
            var cm, form, values = (html = (html = html.replace(fontIconRe, '<$1$2class="$3$4$5-$6$7"$8>&nbsp;</$1>')).replace(/<(a|i|span)([^>]+)><\/\1>/gi, "<$1$2>&nbsp;</$1>")).match(/\{\$([^\}]+?)\}/g);
            values ? (cm = ed.controlManager, (form = cm.createForm("templatemanager_form")).empty(), 
            each(values, function(key) {
                key = key.replace(/\{\$([^\}]+?)\}/, "$1"), form.add(cm.createTextBox("templatemanager_form_" + key, {
                    label: ed.getLang(key, key),
                    name: key
                }));
            }), ed.windowManager.open({
                title: ed.getLang("templatemanager.values", "Values"),
                items: [ form ],
                size: "mce-modal-landscape-small",
                open: function() {
                    window.setTimeout(function() {
                        form.controls[0].focus();
                    }, 10);
                },
                buttons: [ {
                    title: ed.getLang("cancel", "Cancel"),
                    id: "cancel"
                }, {
                    title: ed.getLang("insert", "Insert"),
                    id: "insert",
                    onsubmit: function(e) {
                        var data = form.submit();
                        each(data, function(value, key) {
                            if ("" == value) return !0;
                            value = ed.dom.create("div", {}, value).textContent, 
                            html = html.replace(new RegExp("\\{\\$" + key + "\\}", "g"), value);
                        }), insertAndUpdate(html);
                    },
                    classes: "primary",
                    scope: this
                } ]
            })) : insertAndUpdate(html);
        },
        _getDateTime: function(d, fmt) {
            var ed = this.editor;
            return fmt ? (fmt = (fmt = (fmt = (fmt = (fmt = (fmt = (fmt = (fmt = (fmt = (fmt = (fmt = (fmt = (fmt = (fmt = (fmt = fmt.replace("%D", "%m/%d/%y")).replace("%r", "%I:%M:%S %p")).replace("%Y", "" + d.getFullYear())).replace("%y", "" + d.getYear())).replace("%m", addZeros(d.getMonth() + 1, 2))).replace("%d", addZeros(d.getDate(), 2))).replace("%H", "" + addZeros(d.getHours(), 2))).replace("%M", "" + addZeros(d.getMinutes(), 2))).replace("%S", "" + addZeros(d.getSeconds(), 2))).replace("%I", "" + ((d.getHours() + 11) % 12 + 1))).replace("%p", d.getHours() < 12 ? "AM" : "PM")).replace("%B", "" + ed.getLang("templatemanager_months_long").split(",")[d.getMonth()])).replace("%b", "" + ed.getLang("templatemanager_months_short").split(",")[d.getMonth()])).replace("%A", "" + ed.getLang("templatemanager_day_long").split(",")[d.getDay()])).replace("%a", "" + ed.getLang("templatemanager_day_short").split(",")[d.getDay()])).replace("%%", "%") : "";
            function addZeros(value, len) {
                var i;
                if ((value = "" + value).length < len) for (i = 0; i < len - value.length; i++) value = "0" + value;
                return value;
            }
        },
        createControl: function(name, cm) {
            var ed = this.editor;
            if ("templatemanager" == name && this.params.list) return (name = cm.createSplitButton("templatemanager", {
                title: "templatemanager.desc",
                cmd: !1 !== this.params.dialog ? "mceTemplate" : null,
                class: "mce_templatemanager"
            })).onRenderMenu.add(function(btn, menu) {
                var editor, loader = menu.add({
                    id: ed.dom.uniqueId(),
                    title: ed.getLang("dlg.message_load")
                });
                editor = ed, new Promise(function(resolve, reject) {
                    var args = {
                        id: Uuid.uuid("wf_"),
                        method: "getTemplateList",
                        params: []
                    };
                    tinymce.util.XHR.send({
                        url: editor.getParam("site_url") + "index.php?option=com_jce&task=plugin.rpc&plugin=templatemanager&" + editor.settings.query,
                        data: "json=" + JSON.stringify(args),
                        content_type: "application/x-www-form-urlencoded",
                        success: function(response) {
                            var data = "";
                            try {
                                data = JSON.parse(response);
                            } catch (e) {
                                reject();
                            }
                            data.result || reject(), data.result.error && reject();
                            response = tinymce.is(data.result, "object") ? data.result : {};
                            if ("string" == typeof data.result) try {
                                response = JSON.parse(data.result);
                            } catch (e) {
                                return reject();
                            }
                            resolve(response);
                        },
                        error: function(err, xhr) {
                            return reject();
                        }
                    });
                }).then(function(templateData) {
                    loader.remove(), each(templateData, function(value, name) {
                        "string" == typeof value && (value = {
                            data: value,
                            image: ""
                        });
                        var item = menu.add({
                            id: ed.dom.uniqueId(),
                            title: name,
                            image: value.image,
                            onclick: function(e) {
                                return item.setSelected(!1), function(value) {
                                    /\.(html|html|txt|md)$/i.test(value) ? (ed.setProgressState(!0), 
                                    XHR.send({
                                        url: value,
                                        success: function(val) {
                                            val = dataToHtml(ed, val);
                                            val && (ed.execCommand("mceInsertTemplate", !1, {
                                                content: val
                                            }), ed.setProgressState(!1));
                                        }
                                    })) : (value = ed.dom.decode(value), ed.execCommand("mceInsertTemplate", !1, {
                                        content: value
                                    }));
                                }(value.data), !1;
                            }
                        });
                    });
                }, function() {});
            }), name;
        },
        insertUploadedFile: function(o) {
            var ed = this.editor, data = this.getUploadConfig();
            if (data && data.filetypes && new RegExp(".(" + data.filetypes.join("|") + ")$", "i").test(o.name)) return o.data && (data = dataToHtml(ed, o.data)) && ed.execCommand("mceInsertTemplate", !1, {
                content: data
            }), !0;
            return !1;
        },
        getUploadURL: function(file) {
            var ed = this.editor, data = this.getUploadConfig();
            return !!(data && data.filetypes && new RegExp(".(" + data.filetypes.join("|") + ")$", "i").test(file.name)) && ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=templatemanager";
        },
        getUploadConfig: function() {
            return this.params.upload || {};
        }
    }), tinymce.PluginManager.add("templatemanager", tinymce.plugins.TemplatePlugin);
}();