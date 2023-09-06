/* jce - 2.9.41 | 2023-08-23 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function($) {
    var counter = 0;
    function parseUrl(url) {
        var data = {};
        return url && (url = url.substring(url.indexOf("?") + 1), $.each(url.replace(/\+/g, " ").split("&"), function(i, value) {
            var value = value.split("="), key = decodeURIComponent(value[0]);
            2 === value.length && "string" == typeof (value = decodeURIComponent(value[1])) && value.length && (data[key] = value);
        })), data;
    }
    function upload(url, file) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest(), formData = new FormData();
            xhr.upload && (xhr.upload.onprogress = function(e) {
                e.lengthComputable && (file.loaded = Math.min(file.size, e.loaded));
            }), xhr.onreadystatechange = function() {
                4 == xhr.readyState && (200 === xhr.status ? resolve(xhr.responseText) : reject(), 
                file = formData = null);
            };
            var name = (name = file.target_name || file.name).replace(/[\+\\\/\?\#%&<>"\'=\[\]\{\},;@\^\(\)\xa3\u20ac$~]/g, ""), name = {
                method: "upload",
                id: function() {
                    for (var guid = new Date().getTime().toString(32), i = 0; i < 5; i++) guid += Math.floor(65535 * Math.random()).toString(32);
                    return "wf_" + guid + (counter++).toString(32);
                }(),
                inline: 1,
                name: name
            }, Joomla = window.Joomla || {};
            Joomla.getOptions && (Joomla = Joomla.getOptions("csrf.token") || "") && (name[Joomla] = 1), 
            xhr.open("post", url, !0), xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"), 
            $.each(name, function(key, value) {
                formData.append(key, value);
            }), formData.append("file", file), xhr.send(formData);
        });
    }
    function isAdmin(value) {
        return value && -1 != value.indexOf("/administrator/");
    }
    function getBasePath(elm) {
        var path = "", $wrapper = $(elm).parents(".field-media-wrapper"), $wrapper = $wrapper.data("fieldMedia") || $wrapper.get(0);
        return (path = (path = $wrapper ? $wrapper.options ? $wrapper.options.basepath || "" : $wrapper.basePath || "" : path) || $(elm).data("basepath") || "") && !isAdmin(path) && isAdmin(document.location.href) && (path += "administrator/"), 
        path;
    }
    function createElementMedia(elm) {
        var modalElement;
        0 != $(elm).is("joomla-field-media, .wf-media-wrapper-custom") && 0 != $(elm).hasClass("wf-media-wrapper-custom") && ((modalElement = $(".joomla-modal", elm).get(0)) && window.bootstrap && window.bootstrap.Modal && (Joomla.initialiseModal(modalElement, {
            isJoomla: !0
        }), $(".button-select", elm).on("click", function(e) {
            e.preventDefault(), modalElement.open();
        })), $(".button-clear", elm).on("click", function(e) {
            e.preventDefault(), $(".wf-media-input", elm).val("").trigger("change");
        }), $(".wf-media-input", elm).not(".wf-media-input-converted").on("change", function() {
            var value, path = Joomla.getOptions("system.paths", {}).root || "", src = "";
            (value = this.value) && /\.(jpg|jpeg|png|gif|svg|apng|webp)$/.test(value) && (src = path + "/" + this.value), 
            $(".field-media-preview img", elm).attr("src", src);
        }).trigger("change"));
    }
    function updateMediaUrl(row, options, repeatable) {
        $(row).find(".field-media-wrapper").add(row).each(function() {
            if ($(this).find(".wf-media-input-upload").length && !repeatable) return !0;
            var $inp = $(this).find(".field-media-input"), id = $inp.attr("id");
            if (!id) return !0;
            id = id.replace("rowX", "row" + $(row).index()), createElementMedia(this), 
            $(this).addClass("wf-media-wrapper");
            var dataUrl = $(this).data("url") || $(this).attr("url") || "", $linkBtn = $(this).find('a[href*="index.php?option=com_media"].modal.btn'), dataUrl = parseUrl(dataUrl = $linkBtn.length && !dataUrl ? $linkBtn.attr("href") || "" : dataUrl), mediatype = "images", plugin = dataUrl.plugin || "", dataUrl = (dataUrl.mediatype ? mediatype = dataUrl.mediatype : "files" == dataUrl.view && (mediatype = "files"), 
            getBasePath($inp) + "index.php?option=com_jce&task=mediafield.display&plugin=" + plugin + "&fieldid=" + id + "&mediatype=" + mediatype);
            options.context && (dataUrl += "&context=" + options.context), $(this).data("url") && $(this).data("url", dataUrl), 
            $(this).is("joomla-field-media, .wf-media-wrapper-custom") && ($(this).attr("url", dataUrl), 
            $inp = Joomla.sanitizeHtml('<iframe src="' + dataUrl + '" class="iframe" title="" width="100%" height="100%"></iframe>', {
                iframe: [ "src", "class", "title", "width", "height" ]
            }), $(this).find(".joomla-modal").attr("data-url", dataUrl).attr("data-iframe", $inp)), 
            $linkBtn.length && $linkBtn.attr("href", dataUrl);
        });
    }
    function cleanInputValue(elm) {
        var val = $(elm).val() || "";
        -1 != val.indexOf("#joomlaImage") && (val = val.substring(0, val.indexOf("#")), 
        $(elm).val(val).attr("value", val));
    }
    $.fn.WfMediaUpload = function() {
        return this.each(function() {
            var elm = this;
            function uploadAndInsert(url, file) {
                var params, validParams;
                file.name && (params = parseUrl(url), url = getBasePath(elm) + "index.php?option=com_jce", 
                validParams = [ "task", "context", "plugin", "filter", "mediatype" ], 
                !function(file, filter) {
                    return filter = filter.replace(/[^\w_,]/gi, "").toLowerCase(), 
                    new RegExp(".(" + ({
                        images: "jpg,jpeg,png,apng,gif,webp",
                        media: "avi,wmv,wm,asf,asx,wmx,wvx,mov,qt,mpg,mpeg,m4a,m4v,swf,dcr,rm,ra,ram,divx,mp4,ogv,ogg,webm,flv,f4v,mp3,ogg,wav,xap",
                        html: "html,htm,txt",
                        files: "doc,docx,dot,dotx,ppt,pps,pptx,ppsx,xls,xlsx,gif,jpeg,jpg,png,webp,apng,pdf,zip,tar,gz,swf,rar,mov,mp4,m4a,flv,mkv,webm,ogg,ogv,qt,wmv,asx,asf,avi,wav,mp3,aiff,oga,odt,odg,odp,ods,odf,rtf,txt,csv,htm,html"
                    }[filter] || filter).split(",").join("|") + ")$", "i").test(file.name);
                }(file, params.filter || params.mediatype || "images") ? alert("The selected file is not supported.") : (params.task = "plugin.rpc", 
                $.each(params, function(key, value) {
                    -1 === $.inArray(key, validParams) && delete params[key];
                }), url += "&" + $.param(params), $(elm).prop("disabled", !0).addClass("wf-media-upload-busy"), 
                upload(url, file).then(function(response) {
                    $(elm).prop("disabled", !1).removeAttr("disabled").removeClass("wf-media-upload-busy");
                    try {
                        var o = JSON.parse(response), error = "Unable to upload file";
                        if ($.isPlainObject(o)) {
                            o.error && (error = o.error.message || error);
                            var r = o.result;
                            if (r) {
                                var files = r.files || [], item = files.length ? files[0] : {};
                                if (item.file) return value = item.file, ($wrapper = ($wrapper = $(elm).parents(".field-media-wrapper")).data("fieldMedia") || $wrapper.get(0)) && $wrapper.setValue ? $wrapper.setValue(value) : $(elm).val(value).trigger("change"), 
                                !0;
                            }
                        }
                        alert(error);
                    } catch (e) {
                        alert("The server returned an invalid JSON response");
                    }
                    var value, $wrapper;
                }, function() {
                    return $(elm).prop("disabled", !1).removeAttr("disabled").removeClass("wf-media-upload-busy"), 
                    !1;
                })));
            }
            var url = function(elm) {
                var url = "", $wrapper = ($wrapper = $(elm).parents(".field-media-wrapper")).data("fieldMedia") || $wrapper.get(0);
                return (url = $wrapper ? $wrapper.options ? $wrapper.options.url || "" : $wrapper.getAttribute("data-url") || $wrapper.getAttribute("url") || "" : url) || $(elm).siblings("a.modal").attr("href") || "";
            }(elm);
            if (!url) return !1;
            var $uploadBtn = $('<a title="Upload" role="button" class="btn btn-outline-secondary wf-media-upload-button" aria-label="Upload"><i role="presentation" class="icon-upload"></i><input type="file" aria-hidden="true" /></a>'), $selectBtn = ($('input[type="file"]', $uploadBtn).on("change", function(e) {
                e.preventDefault(), this.files && (e = this.files[0]) && uploadAndInsert(url, e);
            }), $(elm).parent().find(".button-select, .modal.btn"));
            $uploadBtn.insertAfter($selectBtn), $(elm).on("drag dragstart dragend dragover dragenter dragleave drop", function(e) {
                e.preventDefault(), e.stopPropagation();
            }).on("dragover dragenter", function(e) {
                $(this).addClass("wf-media-upload-hover");
            }).on("dragleave", function(e) {
                $(this).removeClass("wf-media-upload-hover");
            }).on("drop", function(e) {
                var e = e.originalEvent.dataTransfer;
                e && e.files && e.files.length && (e = e.files[0]) && uploadAndInsert(url, e), 
                $(this).removeClass("wf-media-upload-hover");
            });
        });
    }, $(document).ready(function($) {
        var options = Joomla.getOptions("plg_system_jce", {});
        $("[data-wf-converted]").addClass("wf-media-input-converted"), $(".wf-media-input-converted").addClass("wf-media-input"), 
        $(".wf-media-input").parents(".field-media-wrapper, .fc-field-value-properties-box").addClass("wf-media-wrapper"), 
        options.convert_mediafield && $(".field-media-wrapper, .fc-field-value-properties-box").not(".wf-media-wrapper").addClass("wf-media-wrapper").find(".field-media-input").addClass("wf-media-input wf-media-input-converted"), 
        $(".wf-media-input").removeAttr("readonly"), $(".wf-media-input").parents(".subform-repeatable-group").each(function(i, row) {
            updateMediaUrl(row, options, !0);
        }), $("joomla-field-media.wf-media-wrapper").each(function() {
            var setValueFunction, field = this;
            if (field.inputElement) {
                if ($(this).find("input.wf-media-input-converted").length) return updateMediaUrl(this, options, !0), 
                setValueFunction = field.setValue || function() {}, void (field.setValue = function(value, data) {
                    var parts;
                    field.markValid && (field.markValid(), value && -1 === value.indexOf("://") && (parts = value.split("/"), 
                    value += "#joomlaImage://local-" + parts.shift() + "/" + parts.join("/"), 
                    data) && "object" == typeof data && (value += "?width=" + data.width + "&height=" + data.height), 
                    setValueFunction(value));
                });
                cleanInputValue(field.inputElement);
                var markValidFunction = field.markValid || function() {};
                field.markValid = function() {
                    cleanInputValue(this.inputElement), field.querySelector('label[for="' + this.inputElement.id + '"]') && markValidFunction.apply(this);
                }, field.inputElement.addEventListener("change", function(e) {
                    e.stopImmediatePropagation(), cleanInputValue(this), field.querySelector('label[for="' + this.id + '"]') && markValidFunction.apply(this), 
                    fetch(field.basePath + this.value).then(function(response) {
                        return response.blob();
                    }).then(function(blob) {
                        field.mimeType = blob.type, field.updatePreview();
                    }), $(document).trigger("t4:media-selected", {
                        selectedUrl: field.basePath + this.value
                    });
                }, !0);
            }
            updateMediaUrl(this, options);
        }), $(".wf-media-wrapper-custom").each(function() {
            updateMediaUrl(this, options, !0);
        }), $(document).on("subform-row-add", function(evt, row) {
            var evt = evt.originalEvent;
            evt && evt.detail && (row = evt.detail.row || row), evt = row, (options.convert_mediafield || $(evt).find(".wf-media-input").length) && (options.convert_mediafield && $(row).find(".field-media-input").addClass("wf-media-input wf-media-input-converted"), 
            $(row).find(".wf-media-input").removeAttr("readonly").addClass("wf-media-input-active"), 
            updateMediaUrl(row, options, !0), $(row).find(".wf-media-input-upload").WfMediaUpload());
        }), $(".wf-media-input-upload").not('[name*="media-repeat"]').WfMediaUpload(), 
        $(".wf-media-wrapper .modal-header h3").html("&nbsp;");
    });
}(jQuery);