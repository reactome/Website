/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function($) {
    $.widget("ui.thumbnail", {
        options: {
            src: "",
            values: {
                width: 120,
                height: 90,
                quality: 100
            },
            width: 400,
            height: 300,
            toDataURL: !0
        },
        _init: function() {
            var self = this, values = this.options.values, $preview = ($(this.element).append('<div id="transform" class="uk-grid uk-grid-small"> <div class="uk-width-3-4">\t  <div id="thumbnail-create-crop" class="uk-placeholder"></div> </div> <div class="uk-width-1-4 uk-flex uk-flex-column uk-flex-center"> <div class="uk-grid uk-grid-small uk-position-relative uk-margin-top uk-form-constrain">   <label for="thumbnail_width" class="uk-form-label uk-width-4-10">' + tinyMCEPopup.getLang("dlg.width", "Width") + '</label>   <div class="uk-width-6-10">     <input type="text" id="thumbnail_width" value="" />   </div>   <label for="thumbnail_height" class="uk-form-label uk-width-4-10 uk-margin-small-top">' + tinyMCEPopup.getLang("dlg.height", "Height") + '</label>   <div class="uk-margin-small-top uk-width-6-10">     <input type="text" id="thumbnail_height" value="" />   </div>   <label class="uk-form-label uk-width-1-1 uk-margin-small-top"><input class="uk-constrain-checkbox uk-margin-left-remove" type="checkbox" checked />' + tinyMCEPopup.getLang("dlg.proportional", "Proportional") + '</label> </div>\t<div class="uk-grid uk-grid-small">\t\t<label for="thumbnail_quality" class="uk-form-label uk-width-4-10">' + tinyMCEPopup.getLang("dlg.quality", "Quality") + '</label>   <div class="uk-width-6-10">     <input type="number" id="thumbnail_quality" value="" step="10" max="100" />\t  </div>\t</div>\t<div id="thumbnail-create-preview"></div></div></div>'), 
            $.each([ "width", "height", "quality" ], function(i, v) {
                $("#thumbnail_" + v).val(values[v]).trigger("change");
            }), $(".uk-constrain-checkbox", "#transform").constrain().on("constrain:change", function() {
                self._resizeMarquee($("#thumbnail_width").val(), $("#thumbnail_height").val());
            }), $("#thumbnail-create-preview")), img = new Image(), thumb = {
                width: parseFloat($("#thumbnail_width").val()),
                height: parseFloat($("#thumbnail_height").val())
            };
            (this.image = img).onload = function() {
                var size = {
                    width: img.width,
                    height: img.height
                }, s = {
                    width: (size = img.width > self.options.width || img.height > self.options.height ? Wf.sizeToFit(img, {
                        width: self.options.width,
                        height: self.options.height
                    }) : size).width,
                    height: size.height
                };
                thumb.width || (thumb.width = Math.floor(thumb.height / img.height * img.width)), 
                thumb.height || (thumb.height = Math.floor(thumb.width / img.width * img.height)), 
                $.extend(s, Wf.sizeToFit(thumb, size)), self.cropImage = $(img).clone().attr(size).appendTo("#thumbnail-create-crop").crop({
                    ratio: thumb.width / thumb.height,
                    width: size.width,
                    height: size.height,
                    selection: s,
                    change: function(e, s) {
                        self._updatePreview(s);
                    },
                    handles: "nw,ne,sw,se",
                    reset: function(e, s) {
                        self._resetThumbnail(s);
                    }
                }), $("#crop-box").css({
                    top: "50%",
                    "margin-top": 0 - size.height / 2
                }), self._createPreview(s), $preview.removeClass("loading");
            }, $preview.addClass("loading"), img.onerror = function() {
                $preview.removeClass("loading").addClass("error");
            }, img.src = this.options.src;
        },
        _createPreview: function(s) {
            var img = this.image, thumb = {
                width: parseFloat($("#thumbnail_width").val()),
                height: parseFloat($("#thumbnail_height").val())
            };
            $("#thumbnail-create-preview").css({
                width: thumb.width,
                height: thumb.height
            }).append($(img).clone()), this._updatePreview(s);
        },
        _resizeMarquee: function(width, height) {
            var r, ow = $("#crop-box").width(), oh = $("#crop-box").height();
            (width || height) && (width = parseInt(width), height = parseInt(height), 
            r = oh < ow ? oh / ow : ow / oh, width = width || Math.round(height * r), 
            height = height || Math.round(width * r), r = {
                width: Math.round(width * r),
                height: Math.round(height * r)
            }, $.extend(r, Wf.sizeToFit({
                width: width,
                height: height
            }, {
                width: ow,
                height: oh
            })), ow = height < width ? width / height : height / width, $(this.cropImage).crop("setRatio", ow).crop("setArea", r, !0));
        },
        _resetThumbnail: function(s) {
            var tw = $("#thumbnail_width").val(), th = $("#thumbnail_height").val();
            th < tw ? th = tw * (s.height / s.width) : tw = th * s.width / s.height, 
            tw = Math.floor(tw, 1), th = Math.floor(th, 1), $("#thumbnail_width").val(tw), 
            $("#thumbnail_height").val(th), $("#thumbnail-create-preview").css({
                width: tw,
                height: th
            }), this._updatePreview(s);
        },
        _updatePreview: function(s) {
            var mw, o = this.options, $preview = $("#thumbnail-create-preview"), tw = $("#thumbnail_width").val(), th = $("#thumbnail_height").val(), img = this.image, iw = img.width, img = img.height;
            (tw || th) && (tw = tw || Math.round(th / img * iw), th = th || Math.round(tw / iw * img), 
            (mw = $("#thumbnail-create-preview").parent().width()) < tw ? ($preview.css(Wf.sizeToFit({
                width: tw,
                height: th
            }, {
                width: mw,
                height: 120
            })), tw = $preview.width(), th = $preview.height()) : $preview.css({
                width: tw,
                height: th
            }), mw = s.width / Math.min(iw, o.width), iw < img && (mw = s.height / Math.min(img, o.height)), 
            $preview = Math.round(tw / mw), o = Math.round(th / mw), img < iw ? o = "auto" : iw < img && ($preview = "auto"), 
            mw = "translateX(" + (0 - Math.round(s.x * tw / s.width)) + "px) translateY(" + (0 - Math.round(s.y * th / s.height)) + "px)", 
            $("img", "#thumbnail-create-preview").css({
                width: $preview,
                height: o,
                transform: mw
            }));
        },
        getMime: function(s) {
            var mime = "image/jpeg";
            switch (Wf.String.getExt(s)) {
              case "jpg":
              case "jpeg":
                mime = "image/jpeg";
                break;

              case "png":
                mime = "image/png";
                break;

              case "bmp":
                mime = "image/bmp";
                break;

              case "webp":
                mime = "image/webp";
            }
            return mime;
        },
        save: function() {
            var ar, r_y, s, area = $(this.cropImage).crop("getArea", !0), ow = $("#crop-container").width(), oh = $("#crop-container").height(), iw = this.image.width, ih = this.image.height, w = $("#thumbnail_width").val(), h = $("#thumbnail_height").val();
            if (w = parseFloat(w), h = parseFloat(h), w || h) return ar = oh < ow ? ow / oh : oh / ow, 
            w = w || Math.round(h * ar, 1), h = h || Math.round(w * ar, 1), ar = iw / ow, 
            r_y = ih / oh, s = {
                width: iw,
                height: ih,
                x: 0,
                y: 0
            }, ih < iw ? (s.width = Math.round(area.width * ar, 1), area.height !== oh && (s.height = Math.round(area.height * r_y, 1))) : (s.height = Math.round(area.height * r_y, 1), 
            area.width !== ow && (s.width = Math.round(area.width * ar, 1))), s.x = Math.round(area.x * ar, 1), 
            s.y = Math.round(area.y * r_y, 1), ih = parseFloat($("#thumbnail_quality").val()), 
            ih = Math.max(Math.min(ih, 100), 10), {
                sx: s.x,
                sy: s.y,
                sw: s.width,
                sh: s.height,
                width: w,
                height: h,
                quality: ih
            };
        },
        destroy: function() {
            $.Widget.prototype.destroy.apply(this, arguments);
        }
    });
}(jQuery);