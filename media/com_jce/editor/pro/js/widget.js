/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function($, Wf) {
    var options = {
        view_mode: "list"
    };
    function onBeforeBuildList() {
        "grid" === getMode() && $("li.file", "#item-list").hide();
    }
    function onAfterBuildList() {
        "grid" === getMode() && togglePreviewThumbnails();
    }
    function createPreviewThumbnails(force) {
        var area = $("#browser-list").height() + $("#browser-list").scrollTop(), selector = [ ".thumbnail-loading" ];
        force || selector.concat(".thumbnail-loading", ".thumbnail-loaded", ".thumbnail-error");
        $("#item-list .file").filter([ ".jpg", ".jpeg", ".bmp", ".tiff", ".png", ".webp", ".gif" ].join(",")).not(selector.join(",")).each(function() {
            var item, img, src;
            $(this).position().top < area && (src = $(item = this).data("preview"), 
            src = $(item).data("thumbnail") ? $(item).data("thumbnail") : src) && (img = new Image(), 
            $(item).addClass("thumbnail-loading"), $(img).on("load", function() {
                $(".uk-thumbnail", item).get(0) || $('<span class="uk-thumbnail uk-position-cover"></span>').css("background-image", 'url("' + img.src + '")').appendTo(item);
                $(item).removeClass("thumbnail-loading").addClass("thumbnail-loaded");
            }), $(img).on("error.local", function() {
                $(item).removeClass("thumbnail-loading").addClass("thumbnail-error");
            }), img.src = src);
        });
    }
    function togglePreviewThumbnails(force) {
        "grid" === getMode() ? (createPreviewThumbnails(force), $("#browser-list").on("scroll.browser-list", function(e) {
            createPreviewThumbnails();
        }), $("#item-list").data("sortable") && $("#item-list").sortable("option", "axis", !1)) : ($("#browser-list").off("scroll.browser-list"), 
        $("#item-list").off("click.item-list-images"), $("#item-list").data("sortable") && $("#item-list").sortable("option", "axis", "y"));
    }
    function getMode() {
        var mode = Wf.Storage.get("wf_" + Wf.getName() + "_mode", options.view_mode);
        return "images" == mode ? "grid" : mode;
    }
    function toggleMode(mode) {
        $("#browser").toggleClass("view-mode-grid", "grid" === mode), togglePreviewThumbnails(!0);
    }
    function editImage() {
        var items = $.fn.filebrowser.getselected();
        if (1 < items.length) return function(items) {
            Wf.Modal.dialog(tinyMCEPopup.getLang("dlg.resize-dialog", "Resize Images"), "", {
                id: "resize-dialog",
                classes: "uk-modal-prompt",
                width: 480,
                onOpen: function() {
                    var modal = this, rw = options.upload_resize_width || "", rh = options.upload_resize_height || "", $resize = $('<div class="uk-form-row uk-form-striped uk-repeatable uk-width-1-1 uk-flex-wrap uk-position-relative uk-panel uk-panel-box uk-panel-box-secondary">   <div class="uk-form-row uk-width-9-10">       <label class="uk-form-label uk-width-1-5" title="' + tinyMCEPopup.getLang("dlg.dimensions", "Dimensions") + '">' + tinyMCEPopup.getLang("dlg.dimensions", "Dimensions") + '</label>       <div class="uk-width-4-5 uk-form-constrain uk-flex uk-flex-wrap">           <div class="uk-form-controls uk-width-1-4">               <input type="text" name="resize_width[]" class="uk-text-center" value="" />           </div>           <div class="uk-form-controls">               <strong class="uk-form-label uk-text-center uk-vertical-align-middle uk-display-block">&times;</strong>           </div>           <div class="uk-form-controls uk-width-1-4">               <input type="text" name="resize_height[]" class="uk-text-center" value="" />           </div>           <div class="uk-form-controls uk-width-auto">               <label class="uk-form-label uk-constrain-label" title="' + tinyMCEPopup.getLang("dlg.proportional", "Proportional") + '"><input class="uk-constrain-checkbox" type="checkbox" checked />' + tinyMCEPopup.getLang("dlg.proportional", "Proportional") + '</label>           </div>       </div>   </div>   <div class="uk-form-row uk-width-1-1">       <div class="uk-form-row uk-width-1-2">           <label class="uk-form-label uk-width-1-1" title="' + tinyMCEPopup.getLang("dlg.upload_crop", "Crop to Fit") + '"><input class="uk-margin-right" name="resize_crop[]" type="checkbox" value="0" />' + tinyMCEPopup.getLang("dlg.upload_crop", "Crop to Fit") + '</label>       </div>       <div class="uk-form-row uk-width-1-2 uk-grid uk-grid-small uk-margin-top-remove">           <label class="uk-form-label uk-width-1-5">' + tinyMCEPopup.getLang("dlg.upload_resize_suffix", "Suffix") + '</label>           <div class="uk-form-controls uk-width-4-5">               <input type="text" name="resize_suffix[]" value="" />           </div>       </div>   </div>   <div class="uk-text-right uk-position-top-right uk-margin-small-top">       <button class="uk-button uk-button-link uk-repeatable-create uk-margin-small-top"><i class="uk-icon-plus"></i></button>       <button class="uk-button uk-button-link uk-repeatable-delete uk-margin-small-top"><i class="uk-icon-trash"></i></button>   </div></div>');
                    if (options.upload_resize && options.can_edit_images) {
                        "string" == typeof rw && (rw = rw.split(",")), "string" == typeof rh && (rh = rh.split(","));
                        for (var num = Math.max(rw.length, rh.length), i = 0; i < num; i++) {
                            var $opt = $resize.clone(), w = rw[i] || "", h = rh[i] || "", w = ($("#resize-dialog").append($opt), 
                            $opt.find('input[name^="resize_width"]').val(w), $opt.find('input[name^="resize_height"]').val(h), 
                            $opt.find(".uk-constrain-checkbox").constrain(), $opt.repeatable().on("repeatable:create", function(e, o, n) {
                                $(n).find(".uk-constrain-checkbox").trigger("constrain:update"), 
                                $(modal).trigger("modal.assetloaded");
                            }).on("repeatable:delete", function(e, ctrl, elm) {
                                $(elm).remove();
                            }), parseInt(options.upload_resize_crop, 10));
                            $opt.find('input[name^="resize_crop"]').prop("checked", !!w).on("click", function() {
                                this.value = this.checked ? 1 : 0;
                            }).val(w);
                        }
                    }
                },
                buttons: [ {
                    text: Wf.translate("cancel", "Cancel"),
                    icon: "uk-icon-close",
                    attributes: {
                        class: "uk-modal-close"
                    }
                }, {
                    text: Wf.translate("ok", "OK"),
                    icon: "uk-icon-check",
                    attributes: {
                        class: "uk-button-primary uk-modal-close"
                    },
                    click: function() {
                        var args = {
                            json: [ $.map(items, function(file) {
                                return $(file).attr("id");
                            }) ]
                        };
                        $.fn.filebrowser.status({
                            message: tinyMCEPopup.getLang("dlg.resize_message", "Resizing..."),
                            state: "load"
                        }), Wf.JSON.request("resizeImages", args, function(o) {
                            o && o.error && o.error.length && Wf.Modal.alert(o.error || "Unable to resize images"), 
                            $.fn.filebrowser.load($.map(items, function(file) {
                                return $(file).data("url");
                            }));
                        }, self);
                    }
                } ]
            });
        }(items);
        var items = items[0], ed = tinyMCEPopup.editor, iw = parseFloat($(items).data("width")), ih = parseFloat($(items).data("height")), src = $(items).attr("id"), items = $(items).data("preview"), query = items.indexOf("?");
        -1 !== query && (items = items.substring(0, query)), ed.windowManager.open({
            url: ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=" + Wf.getName() + "&slot=editor.image",
            size: "mce-modal-landscape-full",
            close_previous: !1,
            inline: !0,
            title: tinyMCEPopup.getLang("dlg.edit_image", "Edit Image")
        }, {
            src: src,
            url: items,
            width: iw,
            height: ih,
            onsave: function(item) {
                $(".filebrowser").trigger("filebrowser:load", item);
            },
            scope: this
        });
    }
    function editText() {
        var item = $.fn.filebrowser.getselected(), ed = tinyMCEPopup.editor, src = $(item).attr("id"), item = $(item).data("preview"), query = item.indexOf("?");
        -1 !== query && (item = item.substring(0, query)), ed.windowManager.open({
            url: ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=" + Wf.getName() + "&slot=editor.text",
            size: "mce-modal-landscape-full",
            close_previous: !1,
            inline: !0,
            title: tinyMCEPopup.getLang("dlg.edit_text", "Edit Text")
        }, {
            src: src,
            url: item,
            onsave: function(item) {
                $(".filebrowser").trigger("filebrowser:load", item);
            },
            scope: this
        });
    }
    function getUploadOptions() {
        $("#upload-options").append(function() {
            var layout = [], rw = options.upload_resize_width || "", rh = options.upload_resize_height || "", rs = options.upload_resize_suffix || "", crop = options.upload_resize_crop || "", $resize = $('<div class="uk-form-row uk-repeatable uk-flex uk-flex-wrap uk-width-1-1 uk-position-relative uk-placeholder uk-placeholder-small">   <div class="uk-width-1-1 uk-width-medium-1-5">       <input name="upload_resize_state" type="checkbox" value="0" class="uk-margin-small-right" />       <label for="upload_resize_state" title="' + tinyMCEPopup.getLang("dlg.upload_resize_tip", "Resize Image") + '" class="hastip">' + tinyMCEPopup.getLang("dlg.resize", "Resize Image") + '</label>   </div>   <div class="uk-width-1-1 uk-width-small-4-5 uk-flex">       <div class="uk-width-1-1 uk-width-small-3-5 uk-width-medium-2-5 uk-form-constrain uk-flex uk-flex-wrap">           <div class="uk-form-controls uk-width-1-4 uk-width-medium-1-6">               <input type="text" name="upload_resize_width[]" class="uk-text-center" value="" />           </div>           <div class="uk-form-controls">               <strong class="uk-form-label uk-text-center uk-vertical-align-middle uk-display-block">&times;</strong>           </div>           <div class="uk-form-controls uk-width-1-4 uk-width-medium-1-6">               <input type="text" name="upload_resize_height[]" class="uk-text-center" value="" />           </div>           <div class="uk-form-controls uk-width-auto uk-width-medium-3-6">               <label class="uk-form-label uk-constrain-label" title="' + tinyMCEPopup.getLang("dlg.proportional", "Proportional") + '"><input class="uk-constrain-checkbox" type="checkbox" checked />' + tinyMCEPopup.getLang("dlg.proportional", "Proportional") + '</label>           </div>       </div>       <div class="uk-width-1-1 uk-width-small-1-4 uk-flex">           <label class="uk-form-label uk-width-1-1" title="' + tinyMCEPopup.getLang("dlg.upload_crop", "Crop to Fit") + '"><input class="uk-margin-right" name="upload_resize_crop[]" type="checkbox" value="0" />' + tinyMCEPopup.getLang("dlg.upload_crop", "Crop to Fit") + '</label>       </div>       <div class="uk-width-medium-1-4 uk-flex">           <label class="uk-form-label uk-width-1-5">' + tinyMCEPopup.getLang("dlg.upload_resize_suffix", "Suffix") + '</label>           <div class="uk-form-controls uk-width-4-5 uk-margin-small-right">               <input type="text" name="upload_resize_suffix[]" class="uk-margin-small-left" value="" />           </div>       </div>       <div class="uk-width-1-1 uk-width-small-1-6 uk-flex uk-flex-middle uk-flex-center">           <label><input name="upload_resize_item_state[]" type="checkbox" value="1" class="uk-margin-small-right" title="" checked /></label>       </div>   </div>   <div class="uk-text-right uk-position-top-right">       <button class="uk-button uk-button-link uk-repeatable-create uk-margin-small-top"><i class="uk-icon-plus"></i></button>       <button class="uk-button uk-button-link uk-repeatable-delete uk-margin-small-top"><i class="uk-icon-trash"></i></button>   </div></div>');
            if (options.upload_resize && options.can_edit_images) {
                "string" == typeof rw && (rw = rw.split(",")), "string" == typeof rh && (rh = rh.split(",")), 
                "string" == typeof rs && (rs = rs.split(",")), "string" == typeof crop && (crop = crop.split(","));
                for (var num = Math.max(rw.length, rh.length), state = parseInt(options.upload_resize_state, 10), i = 0; i < num; i++) {
                    var $opt = $resize.clone(), w = rw[i] || "", h = rh[i] || "", sfx = rs[i] || "", ctf = crop[i] || "", w = (layout.push($opt), 
                    $opt.find('input[name^="upload_resize_width"]').val(w), $opt.find('input[name^="upload_resize_height"]').val(h), 
                    $opt.find('input[name^="upload_resize_suffix"]').val(sfx), $opt.find(".uk-constrain-checkbox").constrain(), 
                    0 < i && $('input[name="upload_resize_state"]', $opt).remove(), 
                    $opt.repeatable().on("repeatable:create", function(e, o, n) {
                        $('input[name="upload_resize_state"]', n).remove(), $(n).find(".uk-constrain-checkbox").trigger("constrain:update");
                    }).on("repeatable:delete", function(e, ctrl, elm) {
                        $(elm).remove();
                    }), $opt.find('input[name="upload_resize_state"]').prop("checked", !!state).on("click", function() {
                        var el = this;
                        this.value = this.checked ? 1 : 0, $(".uk-repeatable", "#upload-options").each(function() {
                            $(this).find(":input").not(el).prop("disabled", !el.checked);
                        }), this.checked && $opt.parent().find('input[name^="upload_resize_item_state"]').trigger("update");
                    }).val(state), $opt.find(":input").not('input[name="upload_resize_state"]').prop("disabled", !state), 
                    parseInt(ctf, 10));
                    $opt.find('input[name^="upload_resize_crop"]').prop("checked", !!w).on("click", function() {
                        this.value = this.checked ? 1 : 0;
                    }).val(w), $opt.find('input[name^="upload_resize_item_state"]').on("update", function() {
                        $(this).parentsUntil(".uk-repeatable").find(":input").not(this).prop("disabled", !this.checked);
                    }).on("click", function() {
                        this.value = this.checked ? 1 : 0, $(this).trigger("update");
                    });
                }
            }
            return layout;
        }());
        var th, tw, $watermark = $('<div class="uk-form-row uk-flex uk-flex-wrap uk-width-1-1 uk-placeholder uk-placeholder-small" id="upload_watermark_options">   <div class="uk-width-1-1 uk-width-small-1-5">       <input id="upload_watermark" name="upload_watermark_state" type="checkbox" value="0" class="uk-margin-small-right" />       <label for="upload_watermark" title="' + tinyMCEPopup.getLang("dlg.upload_watermark_tip", "Watermark Image") + '" class="hastip">' + tinyMCEPopup.getLang("dlg.upload_watermark", "Watermark Image") + "</label>   </div></div>"), $thumbnail = $('<div class="uk-form-row uk-flex uk-flex-wrap uk-width-1-1 uk-placeholder uk-placeholder-small"><div class="uk-width-1-1 uk-width-medium-1-5">   <input name="upload_thumbnail_state" type="checkbox" value="0" class="uk-margin-small-right" />   <label for="upload_thumbnail_state" title="' + tinyMCEPopup.getLang("dlg.upload_thumbnail_tip", "Thumbnail") + '" class="hastip">' + tinyMCEPopup.getLang("dlg.upload_thumbnail", "Thumbnail") + '</label></div><div class="uk-width-1-1 uk-width-small-4-5"><div class="uk-width-1-1 uk-width-medium-2-5 uk-width-small-3-5 uk-form-constrain uk-flex uk-flex-wrap">   <div class="uk-form-controls uk-width-1-4 uk-width-medium-1-6">       <input type="text" name="upload_thumbnail_width" class="uk-text-center" value="" />   </div>   <div class="uk-form-controls">       <strong class="uk-form-label uk-text-center uk-vertical-align-middle uk-display-block">&times;</strong>   </div>   <div class="uk-form-controls uk-width-1-4 uk-width-medium-1-6">       <input type="text" name="upload_thumbnail_height" class="uk-text-center" value="" />   </div>   <div class="uk-form-controls uk-width-auto uk-width-medium-3-6">       <label class="uk-form-label uk-width-1-1 uk-constrain-label" title="' + tinyMCEPopup.getLang("dlg.proportional", "Proportional") + '"><input class="uk-constrain-checkbox" type="checkbox" checked />' + tinyMCEPopup.getLang("dlg.proportional", "Proportional") + '</label>   </div></div><div class="uk-width-1-1 uk-width-medium-3-5 uk-width-small-2-5">   <label class="uk-form-label uk-width-1-1" title="' + tinyMCEPopup.getLang("dlg.upload_crop", "Crop to Fit") + '" class="hastip"><input class="uk-margin-right" name="upload_thumbnail_crop" type="checkbox" value="0" />' + tinyMCEPopup.getLang("dlg.upload_crop", "Crop Thumbnail") + "</label></div></div></div>");
        options.upload_thumbnail && options.can_edit_images && (tw = options.upload_thumbnail_width || "", 
        th = options.upload_thumbnail_height || "", tw || th || (tw = 120, th = 90), 
        $("#upload-options").append($thumbnail), $thumbnail.find('input[name^="upload_thumbnail_width"]').val(tw), 
        $thumbnail.find('input[name^="upload_thumbnail_height"]').val(th), $thumbnail.find(".uk-constrain-checkbox").constrain(), 
        tw = parseInt(options.upload_thumbnail_state, 10), $thumbnail.find('input[name="upload_thumbnail_state"]').prop("checked", !!tw).on("click", function() {
            this.value = this.checked ? 1 : 0, $thumbnail.find(":input").not(this).prop("disabled", !this.checked);
        }).val(tw), $thumbnail.find(":input").not('input[name="upload_thumbnail_state"]').prop("disabled", !tw), 
        th = parseInt(options.upload_thumbnail_crop, 10), $thumbnail.find('input[name="upload_thumbnail_crop"]').prop("checked", !!th).on("click", function() {
            this.value = this.checked ? 1 : 0;
        }).val(th)), options.upload_watermark && options.can_edit_images && (tw = parseInt(options.upload_watermark_state, 10), 
        $("#upload-options").append($watermark).find('input[name="upload_watermark_state"]').prop("checked", !!tw).on("click", function() {
            this.value = this.checked ? 1 : 0;
        }).val(tw)), (options.upload_resize || options.upload_watermark) && options.can_edit_images && ($("#upload-options").prepend('<h4 class="uk-text-bold">' + tinyMCEPopup.getLang("dlg.image_options", "Image Options") + "</h4>"), 
        $('<button class="uk-button uk-button-small uk-float-right"><i class="uk-icon-caret-up"></i><i class="uk-icon-caret-down"></i></button>').on("click", function(e) {
            e.preventDefault(), $("#upload-options").toggleClass("uk-expanded");
        }).appendTo("#upload-options > h4"), $("#upload-options").show(), $(".hastip", "#upload-options").tips()), 
        $("#upload-queue").on("uploadwidget:fileadded", function(e, file) {
            var $opt;
            /^(jpg|jpeg|png|bmp|tiff|gif)$/i.test(file.extension) && options.upload_resize && options.can_edit_images && (($opt = $('<div class="uk-grid uk-grid-collapse uk-width-1-1 queue-item-resize uk-placeholder uk-placeholder-small uk-repeatable uk-position-relative uk-hidden"> <div class="uk-width-1-10">   <label for="upload_resize" class="uk-form-label" title="' + tinyMCEPopup.getLang("dlg.upload_resize_tip", "Resize") + '">' + tinyMCEPopup.getLang("dlg.resize", "Resize") + '</label> </div><div class="uk-width-1-1 uk-width-medium-4-5 uk-flex uk-flex-wrap">   <div class="uk-width-1-1 uk-width-small-3-5 uk-width-medium-2-5 uk-form-constrain uk-flex uk-flex-wrap uk-margin-small-top">       <div class="uk-form-controls uk-width-1-4 uk-width-medium-1-6">           <input type="text" name="upload_file_resize_width[]" class="uk-text-center" value="" />       </div>       <div class="uk-form-controls">           <strong class="uk-form-label uk-text-center uk-vertical-align-middle uk-display-block">&times;</strong>       </div>       <div class="uk-form-controls uk-width-1-4 uk-width-medium-1-6">           <input type="text" name="upload_file_resize_height[]" class="uk-text-center" value="" />       </div>       <div class="uk-form-controls uk-width-auto uk-width-medium-3-6">           <label class="uk-form-label uk-constrain-label" title="' + tinyMCEPopup.getLang("dlg.proportional", "Proportional") + '"><input class="uk-constrain-checkbox" type="checkbox" checked />' + tinyMCEPopup.getLang("dlg.proportional", "Proportional") + '</label>       </div>   </div>   <div class="uk-width-1-1 uk-width-medium-1-5 uk-flex uk-margin-small-top">       <label class="uk-form-label uk-width-1-1" title="' + tinyMCEPopup.getLang("dlg.upload_crop", "Crop to Fit") + '"><input class="uk-margin-right" name="upload_file_resize_crop[]" type="checkbox" value="0" />' + tinyMCEPopup.getLang("dlg.upload_crop", "Crop to Fit") + '</label>   </div>   <div class="uk-width-medium-1-5 uk-flex uk-margin-small-top">       <label class="uk-form-label uk-width-1-5">' + tinyMCEPopup.getLang("dlg.upload_resize_suffix", "Suffix") + '</label>       <div class="uk-form-controls uk-width-4-5 uk-margin-small-right">           <input type="text" name="upload_file_resize_suffix[]" class="uk-margin-small-left" value="" />       </div>   </div></div><div class="uk-text-right uk-position-top-right">   <button class="uk-button uk-button-link uk-repeatable-create uk-margin-small-top"><i class="uk-icon-plus"></i></button>   <button class="uk-button uk-button-link uk-repeatable-delete uk-margin-small-top"><i class="uk-icon-trash"></i></button></div></div>')).appendTo(file.element).repeatable().on("repeatable:create", function(e, o, n) {
                $(n).find(".uk-constrain-checkbox").trigger("constrain:update");
            }).on("repeatable:delete", function(e, ctrl, elm) {
                $(elm).remove();
            }).find(".uk-constrain-checkbox").constrain(), $opt.find('input[name^="upload_file_resize_crop"]').on("click", function() {
                this.value = this.checked ? 1 : 0;
            }), $opt = $('<button class="uk-button uk-button-link queue-item-action" title="' + tinyMCEPopup.getLang("dlg.resize_item_options", "Options") + '"><i class="uk-icon uk-icon-gear"></i></button>').click(function(e) {
                e.preventDefault(), e.stopPropagation(), $(".queue-item-resize", file.element).toggleClass("uk-hidden");
            }), $(".queue-item-actions", file.element).append($opt));
        });
    }
    function onInit(e, o) {
        var mode = getMode();
        $("#view-mode").on("click", function(e) {
            e.preventDefault(), e = "list" == (e = getMode()) ? "grid" : "list", 
            Wf.Storage.set("wf_" + Wf.getName() + "_mode", e), toggleMode(e);
        }), $("#show-details").on("click", function(e) {
            "grid" === mode && createPreviewThumbnails();
        }), "grid" === mode && toggleMode(mode);
    }
    function deleteThumbnail() {
        var items = $.fn.filebrowser.getselected();
        Wf.Modal.confirm(tinyMCEPopup.getLang("dlg.delete_thumbnail", "Delete Thumbnail?"), function(state) {
            state && (state = {
                json: [ $.map(items, function(file) {
                    return $(file).attr("id");
                }) ]
            }, $.fn.filebrowser.status({
                message: tinyMCEPopup.getLang("dlg.delete_thumbnail_message", "Deleting Thumbnail..."),
                state: "load"
            }), Wf.JSON.request("deleteThumbnail", state, function(o) {
                o.error.length && Wf.Modal.alert(o.error), $.fn.filebrowser.load($.map(items, function(file) {
                    return $(file).data("url");
                }));
            }));
        });
    }
    function createThumbnail() {
        var item, items = $.fn.filebrowser.getselected();
        if (options.thumbnail_width || options.thumbnail_height || (options.thumbnail_width = 120, 
        options.thumbnail_height = 90), 1 < items.length) return function(items) {
            Wf.Modal.dialog(tinyMCEPopup.getLang("dlg.create_thumbnail", "Create Thumbnail"), "", {
                id: "thumbnail-create-dialog",
                classes: "uk-modal-prompt",
                width: 440,
                onOpen: function() {
                    $("#thumbnail-create-dialog").append('<div class="uk-form-row uk-grid uk-grid-small">   <label class="uk-form-label uk-width-3-10" title="' + tinyMCEPopup.getLang("dlg.dimensions", "Dimensions") + '">' + tinyMCEPopup.getLang("dlg.dimensions", "Dimensions") + '</label>   <div class="uk-width-2-3 uk-form-constrain uk-flex">       <div class="uk-form-controls">           <input type="text" name="thumbnail_width" class="uk-text-center" value="" />       </div>       <div class="uk-form-controls">           <strong class="uk-form-label uk-text-center uk-vertical-align-middle uk-display-block">&times;</strong>       </div>       <div class="uk-form-controls">           <input type="text" name="thumbnail_height" class="uk-text-center" value="" />       </div>       <div class="uk-form-controls uk-width-auto">           <label class="uk-form-label uk-width-1-1 uk-constrain-label" title="' + tinyMCEPopup.getLang("dlg.proportional", "Proportional") + '"><input class="uk-constrain-checkbox" type="checkbox" checked />' + tinyMCEPopup.getLang("dlg.proportional", "Proportional") + '</label>       </div>   </div></div><div class="uk-form-row uk-grid uk-grid-small">   <label for="thumbnail_quality" class="uk-form-label uk-width-3-10">' + tinyMCEPopup.getLang("dlg.quality", "Quality") + '</label>   <div class="uk-form-controls uk-width-2-3"><input type="number" name="thumbnail_quality" min="1" max="100" value="100" class="quality" /> %</div></div><div class="uk-form-row uk-grid uk-grid-small">   <div class="uk-form-row uk-width-1-1">       <label class="uk-form-label uk-width-1-1" title="' + tinyMCEPopup.getLang("dlg.upload_crop", "Crop to Fit") + '" class="hastip"><input class="uk-margin-right" name="thumbnail_crop" type="checkbox" value="0" />' + tinyMCEPopup.getLang("dlg.upload_crop", "Crop Thumbnail") + "</label>   </div></div>"), 
                    options.upload_thumbnail_width || options.upload_thumbnail_height || (options.upload_thumbnail_width = 120, 
                    options.upload_thumbnail_height = 90), $("#thumbnail-create-dialog").find('input[name^="thumbnail_width"]').val(options.upload_thumbnail_width), 
                    $("#thumbnail-create-dialog").find('input[name^="thumbnail_height"]').val(options.upload_thumbnail_height), 
                    $("#thumbnail-create-dialog").find(".uk-constrain-checkbox").constrain();
                    var crop_state = parseInt(options.upload_thumbnail_crop, 10);
                    $("#thumbnail-create-dialog").find('input[name="thumbnail_crop"]').prop("checked", !!crop_state).on("click", function() {
                        this.value = this.checked ? 1 : 0;
                    }).val(crop_state);
                },
                buttons: [ {
                    text: Wf.translate("cancel", "Cancel"),
                    icon: "uk-icon-close",
                    attributes: {
                        class: "uk-modal-close"
                    }
                }, {
                    text: Wf.translate("ok", "OK"),
                    icon: "uk-icon-check",
                    attributes: {
                        type: "submit",
                        class: "uk-button-primary uk-modal-close"
                    },
                    click: function() {
                        var args = {
                            json: [ $.map(items, function(file) {
                                return $(file).attr("id");
                            }) ]
                        };
                        $.fn.filebrowser.status({
                            message: tinyMCEPopup.getLang("dlg.create_thumbnail_message", "Creating Thumbnail..."),
                            state: "load"
                        }), Wf.JSON.request("createThumbnails", args, function(o) {
                            o && o.error && o.error.length && Wf.Modal.alert(o.error || "Unable to create thumbnails"), 
                            $.fn.filebrowser.load($.map(items, function(file) {
                                return $(file).data("url");
                            }));
                        }, self);
                    }
                } ]
            });
        }(items);
        item = items[0], Wf.Modal.dialog(tinyMCEPopup.getLang("dlg.create_thumbnail", "Create Thumbnail"), "", {
            text: tinyMCEPopup.getLang("dlg.name", "Name"),
            id: "thumbnail-create-dialog",
            width: 680,
            height: 440,
            dialogClass: "thumbnail",
            onOpen: function() {
                $("#thumbnail-create-dialog").thumbnail({
                    src: $(item).data("preview") + "?" + new Date().getTime(),
                    values: {
                        width: options.upload_thumbnail_width,
                        height: options.upload_thumbnail_height,
                        quality: options.upload_thumbnail_quality
                    }
                });
            },
            buttons: [ {
                text: Wf.translate("save", "Save"),
                icon: "uk-icon-check",
                attributes: {
                    type: "submit",
                    class: "uk-button-primary uk-modal-close"
                },
                click: function() {
                    var data = $("#thumbnail-create-dialog").thumbnail("save"), args = {
                        json: [ $(item).attr("id") ]
                    }, box = {
                        sw: data.sw,
                        sh: data.sh,
                        sx: data.sx,
                        sy: data.sy
                    };
                    $.merge(args.json, [ data.width, data.height, data.quality, box ]), 
                    $.fn.filebrowser.status({
                        message: tinyMCEPopup.getLang("dlg.create_thumbnail_message", "Creating Thumbnail..."),
                        state: "load"
                    }), Wf.JSON.request("createThumbnail", args, function(o) {
                        o && o.error && o.error.length && Wf.Modal.alert(o.error || "Unable to create thumbnail"), 
                        $.fn.filebrowser.load($(item).data("url"));
                    }, self);
                }
            } ]
        });
    }
    function onUpload() {}
    $(window).ready(function(e) {
        $("input.filebrowser").on("filebrowser:oninit", onInit).on("filebrowser:onbeforebuildList", onBeforeBuildList).on("filebrowser:onafterbuildlist", onAfterBuildList).on("filebrowser:onpaste", onAfterBuildList).on("filebrowser:editimage", editImage).on("filebrowser:edittext", editText).on("filebrowser:onuploadopen", getUploadOptions).on("filebrowser:onupload", onUpload).on("filebrowser:onlistsort", createPreviewThumbnails).on("filebrowser:onmaximise", createPreviewThumbnails).on("filebrowser:createthumbnail", createThumbnail).on("filebrowser:deletethumbnail", deleteThumbnail), 
        options = $.extend(options, FileBrowser.options);
    });
}(jQuery, Wf);