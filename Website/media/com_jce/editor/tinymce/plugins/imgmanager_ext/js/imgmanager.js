/* jce - 2.9.63 | 2024-03-11 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function($) {
    var useThumbnail = !1, ImageManagerDialog = {
        settings: {},
        selectedItems: [],
        init: function() {
            tinyMCEPopup.restoreSelection();
            var w, h, br, ed = tinyMCEPopup.editor, n = ed.selection.getNode(), self = this, src = ($("button#insert").on("click", function(e) {
                self.insert(), e.preventDefault();
            }), ed.convertURL(ed.dom.getAttrib(n, "src"))), src = decodeURIComponent(src), currentSrc = ($.each(this.settings.attributes, function(k, v) {
                parseFloat(v) || $("#attributes-" + k).hide();
            }), Wf.init(), $("#alt").on("change", function() {
                "" === this.value ? $(this).removeClass("uk-edited") : $(this).addClass("uk-edited");
            }).addClass("uk-input-multiple"), $("#src, #popup_src").addClass("uk-input-multiple-disabled").attr("placeholder", tinyMCEPopup.getLang("imgmanager_ext.select_multiple", "Multiple Image Selection")), 
            $("#onmouseover, #onmouseout").addClass("uk-persistent-focus").on("click focus", function() {
                $("#onmouseover, #onmouseout").removeClass("uk-active"), $(this).addClass("uk-active");
            }), $("#responsive_picture").on("click", function() {
                $('input[name^="responsive_media_query"]').prop("disabled", !this.checked);
            }), $('input[name^="responsive_width_descriptor"], input[name^="responsive_pixel_density"]').on("change", function() {
                this.value = this.value.replace(/[^0-9\.]+/g, "");
            }), $("#responsive_tab").on("click focus", 'input[name^="responsive_source"]', function(e) {
                $('input[name^="responsive_source"]').removeClass("uk-active"), 
                $(this).addClass("uk-active");
            }), $("body").on("click.persistent-focus", function(e) {
                $(e.target).is(".uk-persistent-focus, li.file") || $(e.target).parents("li.file").length || $(".uk-persistent-focus").removeClass("uk-active");
            }), WFPopups.setup({
                remove: function(el) {
                    ed.dom.remove(ed.dom.getParent(el, "a"), 1);
                },
                change: function(name) {
                    name && self.updateSelectedItems().then(function() {
                        var selected = self.selectedItems;
                        1 === selected.length && self.selectFile(selected[0]), 1 < selected.length && self.selectMultiple();
                    });
                }
            }), n && "IMG" == n.nodeName ? ($("#insert").button("option", "label", tinyMCEPopup.getLang("update", "Update", !0)), 
            $("#src").val(src), w = Wf.getAttrib(n, "width"), h = Wf.getAttrib(n, "height"), 
            $("#width").val(function() {
                return w ? ($(this).addClass("uk-isdirty"), w) : h ? void 0 : n.width;
            }), $("#height").val(function() {
                return h ? ($(this).addClass("uk-isdirty"), h) : w ? void 0 : n.height;
            }), $("#alt").val(function() {
                var val = ed.dom.getAttrib(n, "alt");
                if (val) return $(this).addClass("uk-edited"), val;
            }), $("#title").val(ed.dom.getAttrib(n, "title")), $.each([ "top", "right", "bottom", "left" ], function() {
                $("#margin_" + this).val(Wf.getAttrib(n, "margin-" + this));
            }), $("#border_width").val(function() {
                var v = Wf.getAttrib(n, "border-width");
                return 0 == $('option[value="' + v + '"]', this).length && $(this).append(new Option(v, v)), 
                v;
            }), $("#border_style").val(Wf.getAttrib(n, "border-style")), $("#border_color").val(Wf.getAttrib(n, "border-color")), 
            $("#border").is(":checked") || $.each([ "border_width", "border_style", "border_color" ], function(i, k) {
                $("#" + k).val(self.settings.defaults[k]).trigger("change");
            }), $("#align").val(Wf.getAttrib(n, "align")), $("#classes").val(function() {
                var values = ed.dom.getAttrib(n, "class");
                return $.trim(values);
            }).trigger("change"), $("#style").val(ed.dom.getAttrib(n, "style")), 
            $("#id").val(ed.dom.getAttrib(n, "id")), $("#dir").val(ed.dom.getAttrib(n, "dir")), 
            $("#lang").val(ed.dom.getAttrib(n, "lang")), $("#usemap").val(ed.dom.getAttrib(n, "usemap")), 
            $("#loading").val(ed.dom.getAttrib(n, "loading")), $("#insert").button("option", "label", ed.getLang("update", "Update")), 
            $("#longdesc").val(ed.convertURL(ed.dom.getAttrib(n, "longdesc"))), 
            $.each([ "mouseover", "mouseout" ], function(i, key) {
                var val = ed.dom.getAttrib(n, "data-" + key);
                val = (val = $.trim(val)).replace(/^\s*this.src\s*=\s*\'([^\']+)\';?\s*$/, "$1").replace(/^\s*|\s*$/g, ""), 
                val = ed.convertURL(val), "mouseout" == key && (val = val || src), 
                $("#on" + key).val(val);
            }), (br = n.nextSibling) && "BR" == br.nodeName && br.style.clear && $("#clear").val(br.style.clear), 
            br = {}, (br = WFPopups.getPopup(n)) && $("#popup_src").val(br.src), 
            (br = ed.dom.getAttrib(n, "srcset")) && (1 < (br = br.split(",")).length && $(".uk-repeatable", "#responsive_tab").trigger("repeatable:clone", br.length - 1), 
            $.each(br, function(i, set) {
                set = set.split(" ");
                $('input[name^="responsive_source"]').eq(i).val(set.shift()), $.each(set, function(x, v) {
                    -1 !== v.indexOf("w") && (v = v.replace(/[^0-9]+/g, ""), $('input[name^="responsive_width_descriptor"]').eq(i).val(v)), 
                    -1 !== v.indexOf("x") && (v = v.replace(/[^0-9\.]+/g, ""), $('input[name^="responsive_pixel_density"]').eq(i).val(v));
                });
            })), $("#responsive_sizes").val(ed.dom.getAttrib(n, "sizes"))) : Wf.setDefaults(this.settings.defaults), 
            $("#src").val());
            $("#src").filebrowser().on("filebrowser:onfileclick", function(e, file, data) {
                $(file).data("thumbnail-src") && (data.thumbnail = {}, $.each([ "src", "width", "height" ], function(i, key) {
                    var val = $(file).data("thumbnail-" + key);
                    val && (data.thumbnail[key] = val);
                })), self.selectFile(data), currentSrc = $(file).data("url");
            }).on("filebrowser:onfileinsert", function(e, file, data) {
                self.selectFile(data);
            }).on("filebrowser:selectmultiple", function() {
                self.selectMultiple();
            }).on("filebrowser:onfiletoggle", function(e, file, data) {
                self.selectOnToggle(data);
            }).on("filebrowser:onfileinsert", function(e, file, data) {
                self.insert();
            }), Wf.updateStyles(), $(".uk-repeatable").on("repeatable:create", function(e, ctrl, elm) {
                $('input[name^="responsive_source"]', elm).focus();
            }), $(".uk-repeatable").on("repeatable:delete", function(e, ctrl, elm) {
                $(elm).remove();
            }), $(".uk-constrain-checkbox").on("constrain:change", function(e, elms) {
                $(elms).addClass("uk-isdirty");
            }).trigger("constrain:update"), $(".uk-equalize-checkbox").trigger("equalize:update"), 
            $("#border").change(), $(".uk-tabs").on("tabs.activate", function(e, tab, panel) {
                if (!(1 < self.selectedItems.length)) {
                    if ("popups_tab" === $(panel).attr("id")) {
                        if (!(value = $("#popup_src").val()) || -1 !== value.indexOf("://") || value === currentSrc) return;
                        currentSrc = value, $("#src").trigger("filebrowser:load", value);
                    }
                    var value;
                    "image_tab" === $(panel).attr("id") && (value = $("#src").val()) && -1 === value.indexOf("://") && value !== currentSrc && (currentSrc = value, 
                    $("#src").trigger("filebrowser:load", value));
                }
            }), $("#src, #popup_src").on("change", function() {
                var value = this.value;
                value && -1 === value.indexOf("://") && value !== currentSrc && $("#src").trigger("filebrowser:load", value);
            }), $(".uk-form-controls select:not(.uk-datalist)").datalist({
                input: !1
            }).trigger("datalist:update"), $(".uk-datalist").trigger("datalist:update");
        },
        refresh: function() {
            $("#src").trigger("filebrowser:refresh");
        },
        insert: function() {
            var ed = tinyMCEPopup.editor, self = this, n = ed.selection.getNode();
            if ("" === $("#src:enabled").val()) return Wf.Modal.alert(tinyMCEPopup.getLang("imgmanager_ext_dlg.no_src", "Please enter a url for the image")), 
            !1;
            n && "IMG" === n.nodeName && "" === ed.dom.getAttrib(n, "alt") && this.insertAndClose(), 
            "" === $("#alt:enabled").val() ? Wf.Modal.confirm(tinyMCEPopup.getLang("imgmanager_ext_dlg.missing_alt"), function(state) {
                state && self.insertAndClose();
            }, {
                width: 360,
                height: 240
            }) : this.insertAndClose();
        },
        insertAndClose: function() {
            var v, ed = tinyMCEPopup.editor, self = this, args = {}, br = "", srcset = (Wf.updateStyles(), 
            tinyMCEPopup.restoreSelection(), !1 !== ed.settings.inline_styles && (args = {
                vspace: "",
                hspace: "",
                border: "",
                align: ""
            }), $.each([ "src", "width", "height", "alt", "title", "classes", "style", "id", "dir", "lang", "usemap", "longdesc", "loading" ], function(i, k) {
                v = $("#" + k + ":enabled").val(), "width" != k && "height" != k || (v = !1 !== self.settings.always_include_dimensions ? $("#" + k).val() : $("#" + k + ".uk-isdirty").val() || ""), 
                "src" == k && (v = v && Wf.String.buildURI(v)), "classes" == k && (k = "class", 
                v = $.trim(v)), args[k] = tinymce.is(v) ? v : "";
            }), []), files = ($('input[name^="responsive_source"]').each(function(i) {
                var values = [], s = $(this).val(), w = $('input[name^="responsive_width_descriptor"]').eq(i).val(), i = $('input[name^="responsive_pixel_density"]').eq(i).val();
                s && (s = Wf.String.buildURI(s), s = ed.convertURL(s, "srcset", "IMG"), 
                values.push(s), w && values.push(w + "w"), i && values.push(i + "x"), 
                srcset.push(values.join(" ")));
            }), srcset.length && (args.srcset = srcset.join(",")), args.sizes = $("#responsive_sizes").val(), 
            args.onmouseover = args.onmouseout = "", self.selectedItems), popups = ((files = 1 < files.length && !1 === $("#src").prop("disabled") ? $.grep(files, function(item) {
                return item.url === $("#src").val();
            }) : files).length || files.push($("#src").val()), []);
            function _insert(el, args) {
                var n;
                "string" == typeof el ? (ed.execCommand("mceInsertContent", !1, el, {
                    skip_undo: 1
                }), el = ed.dom.get("__mce_tmp"), n && "A" === n.nodeName && ed.dom.insertAfter(el, n), 
                tinymce.each(ed.dom.select("img[data-popup-src]", el), function(img) {
                    popups.push({
                        el: img,
                        src: img.getAttribute("data-popup-src")
                    }), img.removeAttribute("data-popup-src");
                }), ed.dom.remove(el, 1)) : (el && "IMG" === el.nodeName ? (ed.dom.setAttribs(el, args), 
                br && "BR" === br.nodeName ? (!$("#clear").is(":disabled") && "" !== $("#clear").val() || ed.dom.remove(br), 
                $("#clear").is(":disabled") || "" === $("#clear").val() || ed.dom.setStyle(br, "clear", $("#clear").val())) : $("#clear").is(":disabled") || "" === $("#clear").val() || (br = ed.dom.create("br"), 
                ed.dom.setStyle(br, "clear", $("#clear").val()), ed.dom.insertAfter(br, el)), 
                ed.onUpdateMedia.dispatch(ed, {
                    node: el
                })) : (n = el, ed.execCommand("mceInsertContent", !1, ed.dom.createHTML("img", $.extend({}, args, {
                    id: "__mce_tmp"
                })), {
                    skip_undo: 1
                }), el = ed.dom.get("__mce_tmp"), n && "A" === n.nodeName && ed.dom.insertAfter(el, n), 
                $("#clear").is(":disabled") || "" === $("#clear").val() || (br = ed.dom.create("br"), 
                ed.dom.setStyle(br, "clear", $("#clear").val()), ed.dom.insertAfter(br, el)), 
                ed.dom.setAttrib(el, "id", args.id)), n = "", /\.(jpg|jpeg|png|apng|avif|webp)$/.test(args.src) && (n = "?" + new Date().getTime()), 
                args.src = ed.convertURL(args.src, "src", "IMG"), ed.dom.setAttrib(el, "src", args.src + n), 
                ed.dom.setAttrib(el, "data-mce-src", args.src), el.removeAttribute("data-popup-src"), 
                popups.push({
                    el: el,
                    src: args["data-popup-src"]
                }));
            }
            var el, complete = !1, w = args.width, h = args.height, group = [], br = (el = ed.selection.getNode()).nextSibling;
            $.each(files, function(i, file) {
                if (1 < files.length) {
                    var k, alt = $("input[name^=alt]").eq(i).val(), alt = ($.extend(args, {
                        src: file.url,
                        alt: alt
                    }), file.width), fh = file.height;
                    for (k in WFPopups.isEnabled() && (args["data-popup-src"] = args.src, 
                    file.thumbnail) && (alt = file.thumbnail.width, fh = file.thumbnail.height, 
                    args.src = file.thumbnail.src), w && h && $.extend(args, Wf.sizeToFit({
                        width: alt,
                        height: fh
                    }, {
                        width: w || alt,
                        height: h || fh
                    })), args.width !== alt && w || delete args.width, args.height !== fh && h || delete args.height, 
                    args) "" === args[k] && delete args[k];
                    group.push(ed.dom.createHTML("img", args));
                } else {
                    file = $("#onmouseover").val(), alt = $("#onmouseout").val();
                    file || (alt = ""), args = $.extend(args, {
                        "data-mouseover": file ? ed.convertURL(file) : "",
                        "data-mouseout": alt ? ed.convertURL(alt) : ""
                    }), WFPopups.isEnabled() && (args["data-popup-src"] = $("#popup_src").val() || args.src), 
                    _insert(el, args);
                }
                i == files.length - 1 && (complete = !0);
            }), group.length && _insert('<span id="__mce_tmp">' + group.join("") + "</span>", args), 
            $.each(popups, function(i, o) {
                var args = {
                    popup_src: o.src,
                    title: o.title
                };
                i && tinymce.each(ed.dom.select("img[data-mce-popup]"), function(n) {
                    n = ed.dom.getParent(n, "a");
                    n && (o.el = n.nextSibling);
                }), ed.dom.setAttrib(o.el, "data-mce-popup", 1), ed.selection.select(o.el), 
                WFPopups.createPopup(o.el, args, i);
            }), ed.dom.setAttrib(ed.dom.select("img[data-mce-popup]"), "data-mce-popup", null), 
            ed.undoManager.add(), ed.nodeChanged(), complete && tinyMCEPopup.close();
        },
        resetMultipleInputs: function() {
            $(".uk-input-multiple").each(function() {
                var id = $(this).attr("id");
                $('input[type="hidden"][name="' + id + '[]"]').remove(), $(this).parent().removeClass("uk-form-icon uk-form-icon-flip").find(".uk-icon-edit").remove();
            });
        },
        toggleMultipleInputs: function() {
            var self = this, ed = tinyMCEPopup.editor;
            $(".uk-input-multiple").each(function() {
                var el = this, id = $(el).attr("id"), selected = ($(el).attr("name", id + "[]"), 
                $('input[type="hidden"][name="' + id + '[]"]').remove(), self.selectedItems);
                $(el).parent().toggleClass("uk-form-icon uk-form-icon-flip", 1 < selected.length), 
                selected.length < 2 || ($.each(selected, function(i, item) {
                    var value = "";
                    (value = item[id] || "") || "alt" !== id || (value = Wf.String.stripExt(item.title).replace(/[_-]+/g, " ")), 
                    0 === i ? $(el).val(value) : $(el).parent().append('<input type="hidden" name="' + id + '[]" value="' + value + '" />'), 
                    item[id] = value;
                }), $(el).siblings(".uk-icon-edit").length) || ($(el).prop("disabled", !0), 
                $('<i class="uk-icon uk-icon-edit" role="button"></i>').on("click", function() {
                    Wf.Modal.open($('label[for="' + el.id + '"]').text(), {
                        width: 300,
                        buttons: [ {
                            text: ed.getLang("dlg.ok", "Ok"),
                            icon: "uk-icon-check",
                            attributes: {
                                class: "uk-button uk-modal-close"
                            }
                        } ],
                        open: function() {
                            var modal, html;
                            modal = this, html = "", $.each(self.selectedItems, function(i) {
                                var inp = $('input[name="' + id + '[]"]').eq(i), inp = $(inp).val();
                                html += '<div class="uk-form-row uk-grid uk-grid-collapse"><label class="uk-form-label uk-width-1-10">' + (i + 1) + '.</label>     <div class="uk-form-controls uk-width-8-10">         <input type="text" value="' + inp + '" />     </div></div>';
                            }), $(".uk-modal-body", modal).append(html).find('input[type="text"]').each(function(i) {
                                $(this).on("change", function() {
                                    $('input[name="' + id + '[]"]').eq(i).val(this.value), 
                                    selected[i][id] = this.value;
                                });
                            });
                        }
                    });
                }).insertBefore(el));
            });
        },
        setPopupSrc: function(data) {
            var ed = tinyMCEPopup.editor;
            data.thumbnail && Wf.Modal.confirm(ed.getLang("imgmanager_ext_dlg.use_thumbnail", "Use associated thumbnail for popup link?"), function(state) {
                (useThumbnail = !!state) && ($("#src").val(data.thumbnail.src), 
                state = Wf.String.stripExt(data.title).replace(/[_-]+/g, " "), $("#alt").val(state), 
                data.thumbnail.width && data.thumbnail.height ? ($("#width").val(data.thumbnail.width).data("tmp", data.thumbnail.width), 
                $("#height").val(data.thumbnail.height).data("tmp", data.thumbnail.height)) : $("<img/>").attr("src", Wf.URL.toAbsolute(data.thumbnail.src)).on("load", function() {
                    var w = this.width, h = this.height;
                    $("#width").val(w).data("tmp", w), $("#height").val(h).data("tmp", h), 
                    $("#width~span.loader").remove();
                }));
            }), $("#popup_src").val(data.url);
        },
        selectFile: function(data) {
            $("#item-list").hasClass("ui-sortable") && $("#item-list").sortable("destroy"), 
            $(".uk-input-multiple, .uk-input-multiple-disabled").prop("disabled", !1), 
            this.resetMultipleInputs();
            var img, name = data.title, src = data.url, name = (data.description || (name = Wf.String.stripExt(name), 
            data.description = name.replace(/[-_]+/g, " ")), this.selectedItems = [ data ], 
            $(".uk-tabs-panel > .uk-active").attr("id"));
            "rollover_tab" === name ? $("input.uk-active", "#rollover_tab").or("#onmouseout").val(src) : "popups_tab" === name ? this.setPopupSrc(data) : "responsive_tab" === name ? $("input.uk-active", "#responsive_tab").val(src) : ($("#alt").hasClass("uk-edited") || $("#alt").val(data.description), 
            $("#onmouseout").val(src), $("#src").val(src), data.width && data.height ? $.each([ "width", "height" ], function(i, k) {
                $("#" + k).val(data[k]).data("tmp", data[k]).removeClass("uk-edited").addClass("uk-text-muted");
            }) : ((img = new Image()).onload = function() {
                $.each([ "width", "height" ], function(i, k) {
                    $("#" + k).val(img[k]).data("tmp", img[k]).removeClass("uk-isdirty");
                });
            }, img.src = data.preview)), $("#sample").attr({
                src: data.preview
            }).attr(Wf.sizeToFit({
                width: data.width,
                height: data.height
            }, {
                width: 80,
                height: 60
            }));
        },
        updateSelectedItems: function() {
            var self = this, deffered = $.Deferred();
            return $("#src").trigger("filebrowser:insert", function(selected, data) {
                $.each(selected, function(i, item) {
                    $(item).data("thumbnail-src") && (data[i].thumbnail = {
                        src: $(item).data("thumbnail-src"),
                        width: $(item).data("thumbnail-width"),
                        height: $(item).data("thumbnail-height")
                    });
                }), self.selectedItems = data, deffered.resolve(selected, data);
            }), deffered.promise();
        },
        selectOnToggle: function(data) {
            if (!data.state) return this.selectMultiple();
            var items = this.selectedItems;
            0 < items.length && data.url !== items[0].url && this.selectMultiple();
        },
        selectMultiple: function() {
            var self = this, ed = tinyMCEPopup.editor, tab = ($("#item-list").hasClass("ui-sortable") && $("#item-list").sortable("destroy"), 
            $(".uk-input-multiple, .uk-input-multiple-disabled").prop("disabled", !1), 
            $(".uk-tabs-panel > .uk-active").attr("id")), grid = (this.selectedItems = [], 
            self.updateSelectedItems().done(function(selected, data) {
                if (!data.length) return !1;
                var inp, item, file = data[0];
                1 < data.length && ($("#src").val(file.url), self.toggleMultipleInputs(), 
                $(".uk-input-multiple, .uk-input-multiple-disabled").prop("disabled", !0), 
                $.each([ "width", "height" ], function(i, key) {
                    var val = file[key] || "";
                    val && $("#" + key).val(val).data("tmp", val);
                }), file.thumbnail) && useThumbnail && ($("#src").val(file.thumbnail.src), 
                $.each([ "width", "height" ], function(i, key) {
                    $("#" + key).val(file.thumbnail[key]).data("tmp", file.thumbnail[key]);
                })), data.length && "responsive_tab" === tab && (inp = $('input[name^="responsive_source"]'), 
                (inp = data.length - inp.length) && $(".uk-repeatable", "#responsive_tab").trigger("repeatable:clone", inp), 
                $.each(data, function(i, props) {
                    $('input[name^="responsive_source"]').eq(i).val(props.url);
                }), self.resetMultipleInputs()), WFPopups.isEnabled() && "popups_tab" === tab && ($(".uk-input-multiple, .uk-input-multiple-disabled").prop("disabled", !0), 
                item = selected[0], $(item).hasClass("thumbnail") && Wf.Modal.confirm(ed.getLang("imgmanager_ext_dlg.use_thumbnail", "Use associated thumbnail for popup link?"), function(state) {
                    (useThumbnail = !!state) && $.each([ "width", "height" ], function(i, k) {
                        $("#" + k).val($(item).data("thumbnail-" + k)).data("tmp", $(item).data("thumbnail-" + k));
                    });
                }), self.toggleMultipleInputs());
            }), $("#browser").hasClass("view-mode-grid"));
            $("#item-list").sortable({
                items: ".file.selected",
                axis: !grid && "y",
                placeholder: "uk-state-highlight",
                start: function(e, ui) {
                    $(ui.placeholder).css({
                        width: $(ui.item).width(),
                        height: $(ui.item).height()
                    }), grid && $(ui.placeholder).addClass("file thumbnail-preview thumbnail-loaded"), 
                    $(".file", "#item-list").not(".selected, .uk-state-highlight").addClass("uk-state-disabled");
                },
                stop: function(e, ui) {
                    $(".uk-state-disabled", "#item-list").removeClass("uk-state-disabled"), 
                    self.selectMultiple(), $("#src").trigger("filebrowser:sort");
                }
            }).disableSelection();
        }
    };
    window.ImageManagerDialog = ImageManagerDialog, $(document).ready(function() {
        ImageManagerDialog.init();
    });
}(jQuery);