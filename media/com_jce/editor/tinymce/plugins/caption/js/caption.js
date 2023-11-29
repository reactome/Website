/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function(window, $, tinymce, tinyMCEPopup) {
    var iw, each = tinymce.each;
    var CaptionDialog = {
        settings: {},
        init: function() {
            var el, ed = tinyMCEPopup.editor, n = ed.selection.getNode(), self = this;
            tinyMCEPopup.restoreSelection(), el = ed.dom.getParent(n, ".mce-item-caption,figure"), 
            "IMG" != n.nodeName && (n = ed.dom.select("img", el)[0]), $("#insert").on("click", function(e) {
                self.insert(), e.preventDefault();
            }), $("#help").on("click", function(e) {
                Wf.help("caption"), e.preventDefault();
            }), TinyMCE_Utils.fillClassList("text_classes"), Wf.init(), n && "IMG" == n.nodeName && $("#caption_image").attr({
                src: n.src
            }), null != el ? ($("#insert").button("option", "label", tinyMCEPopup.getLang("update", "Update", !0)), 
            ed.dom.removeClass(el, "mceVisualAid"), each([ "top", "right", "bottom", "left" ], function(o) {
                var v = self.getAttrib(el, "padding-" + o);
                tinymce.is(v) && "inherit" != v && $("#padding_" + o).val(v), v = self.getAttrib(el, "margin-" + o), 
                tinymce.is(v) && "inherit" !== v && $("#margin_" + o).val(v);
            }), $("#border_width").val(function() {
                var v = self.getAttrib(el, "border-width");
                return 0 == $('option[value="' + v + '"]', this).length && $(this).append(new Option(v, v)), 
                v;
            }), $("#border_style").val(this.getAttrib(el, "border-style")), $("#border_color").val(this.getAttrib(el, "border-color")), 
            $("#border").is(":checked") || $.each([ "border_width", "border_style", "border_color" ], function(i, k) {
                $("#" + k).val(self.settings.defaults[k]);
            }), $("#align").val(this.getAttrib(el, "align")), $("#bgcolor").val(this.getAttrib(el, "background-color")), 
            each(ed.dom.select("span,figcaption", el), function(c) {
                ed.dom.removeClass(c, "mceVisualAid"), $("#text_position").val(function() {
                    return ed.dom.getStyle(c, "caption-side") || (el.firstChild == c ? "top" : "bottom");
                }), $("#text_align").val(ed.dom.getStyle(c, "text-align")), each([ "top", "right", "bottom", "left" ], function(key) {
                    $("#text_padding_" + key).val(self.getAttrib(c, "padding-" + key));
                    var val = self.getAttrib(c, "margin-" + key);
                    "inherit" != val && $("#text_margin_" + key).val(val);
                }), $("#text_color").val(self.getAttrib(c, "color")), $("#text_bgcolor").val(self.getAttrib(c, "background-color")), 
                $("#text").val(c.innerHTML || ""), $("#text_classes").val(function() {
                    return ed.dom.getAttrib(c, "class").replace(/(wf_|jce_|mce-)(\S+)/g, " ").trim();
                });
            }), $("#classes").val(function() {
                return ed.dom.getAttrib(el, "class").replace(/(wf_|jce_|mce-)(\S+)/g, " ").trim();
            })) : (each(this.settings.defaults, function(value, key) {
                switch (key) {
                  case "padding":
                  case "margin":
                  case "text_padding":
                  case "text_margin":
                    each([ "top", "right", "bottom", "left" ], function(pos) {
                        $("#" + key + "_" + pos).val(value);
                    });
                    break;

                  default:
                    var $n = $("#" + key);
                    $n.is(":checkbox") ? $n.prop("checked", !!value) : $n.val(value);
                }
            }), $("#align").val(this.getAttrib(n, "align")), each([ "top", "right", "bottom", "left" ], function(pos) {
                var value = self.getAttrib(n, "margin-" + pos);
                $("#margin_" + pos).val(value);
            }), $("#text").val(ed.dom.getAttrib(n, "title") || ed.dom.getAttrib(n, "alt") || tinyMCEPopup.getLang("caption_dlg.text", "Caption Text"))), 
            $("#border").on("border:change", function() {
                self.updateCaption();
            }), $(".uk-equalize-checkbox").on("equalize:change", function() {
                self.updateCaption();
            }), this.updateText(), this.updateCaption(), $(".uk-equalize-checkbox").trigger("equalize:update"), 
            $("input[id], select[id]").not("[list]").on("change", function() {
                self.updateCaption();
            }).trigger("change"), $(".uk-form-controls select").datalist().trigger("datalist:update"), 
            $(".uk-datalist").trigger("datalist:update");
        },
        insert: function() {
            tinyMCEPopup.restoreSelection();
            var c, h, ed = tinyMCEPopup.editor, s = ed.selection, n = s.getNode(), styleObject = ed.dom.parseStyle($("#caption").get(0).style.cssText), el = ed.dom.getParent(n, "span.mce-item-caption,figure"), s = ("IMG" != (n = el ? ed.dom.select("img", el)[0] : n).nodeName || n.getAttribute("data-mce-object") || (w = ed.dom.getAttrib(n, "width"), 
            h = ed.dom.getAttrib(n, "height"), iw = n.naturalWidth, (w || h) && !(w = w && /%/.test(w) ? Math.round(parseInt(iw) * parseInt(w) / 100) : w) && h && (w = Math.round(iw * h / void 0)), 
            el && "SPAN" == el.nodeName && (ed.getParam("caption_responsive", 1) && (ed.dom.setAttrib(n, "width", w || iw), 
            ed.dom.setStyle(n, "width", "100%")), ed.dom.setAttrib(n, "height", null), 
            ed.dom.setStyle(n, "height", "")), each([ "margin-left", "margin-right", "margin-top", "margin-bottom", "float" ], function(key) {
                var value, val = ed.dom.getStyle(n, key, !0);
                "" !== (value = val) && null != value && "undefined" != value && (val = "initial", 
                ed.dom.setStyle(n, key, val = "float" === key ? "none" : val));
            }), s = ed.dom.serializeStyle(ed.dom.parseStyle(n.style.cssText)), ed.dom.setAttribs(n, {
                style: s,
                "data-mce-style": s
            }), h = w || iw), $("#text_classes").val()), w = {
                style: ed.dom.serializeStyle(ed.dom.parseStyle($("#caption_text").get(0).style.cssText)),
                class: s
            }, txt = $("#text").val(), n = ed.dom.getParent(n, "A") || n, s = (null != el ? ("FIGURE" == el.nodeName && each(styleObject, function(val, key) {
                var name;
                0 == key.indexOf("border") && (name = "outline" + key.substring(6), 
                styleObject[name] = val, delete styleObject[key]), "display" == key && (styleObject[key] = "table");
            }), "SPAN" == el.nodeName && el.setAttribute("role", "figure")) : (ed.formatter.apply("wfcaption"), 
            txt && (c = ed.dom.create("SPAN", w, txt))), (c = ("FIGURE" == (el = ed.dom.getParent(n, "span.mce-item-caption,figure")).nodeName ? ed.dom.select("figcaption", el) : ed.dom.select("span", el))[0]) ? txt ? (ed.dom.setAttribs(c, w), 
            ed.dom.setHTML(c, txt)) : c = ("SPAN" == c.nodeName ? ed.dom.remove(c) : ed.dom.setHTML(c, ""), 
            null) : txt && "SPAN" == el.nodeName && (c = ed.dom.create("span", w, txt)), 
            c && (w = $("#text_position").val(), "SPAN" == c.nodeName ? (ed.dom.setStyle(c, "display", "block"), 
            c.removeAttribute("data-mce-style"), "top" == w ? el.insertBefore(c, n) : ed.dom.insertAfter(c, n)) : ed.dom.setStyle(c, "caption-side", "top" == w ? w : "")), 
            ed.dom.setAttrib(el, "style", ed.dom.serializeStyle(styleObject)), $("#classes").val());
            ed.dom.setAttrib(el, "class", s.trim()), "SPAN" == el.nodeName && (ed.dom.removeClass(el, "jce_caption"), 
            ed.dom.addClass(el, "wf_caption mce-item-caption"), ed.dom.setStyle(el, "display", "inline-block"), 
            "auto" === el.style.marginLeft && "auto" === el.style.marginRight && ed.dom.setStyle(el, "display", "block"), 
            ed.dom.setStyle(el, "max-width", h + "px"), ed.getParam("caption_responsive", 1) && !ed.dom.getStyle(el, "float") && ed.dom.setStyle(el, "width", "100%"), 
            ed.dom.setStyle(el, "height", "")), ed.undoManager.add(), ed.nodeChanged(), 
            tinyMCEPopup.close();
        },
        updateText: function(v) {
            v = v || $("#text").val(), /<\w+([^>]*)>/.test(v) ? $("#caption_text").html(v) : $("#caption_text").text(v);
        },
        updateCaption: function() {
            var k, v, $c = $("#caption"), $ct = $("#caption_text"), m = 0, p = 0;
            switch ($("#caption_image").attr("style", $("#style").val()), $("#text").val() && ("top" == $("#text_position").val() ? $ct.insertBefore("#caption_image") : $ct.insertAfter("#caption_image"), 
            $ct.css("text-align", $("#text_align").val()), each([ "top", "right", "bottom", "left" ], function(o) {
                v = $("#text_padding_" + o).val(), p += parseInt(v), $ct.css("padding-" + o, /[^a-z]/i.test(v) ? v + "px" : v);
            }), 0 == p && $ct.css("padding", ""), $.each([ "top", "right", "bottom", "left" ], function(i, o) {
                v = $("#text_margin_" + o).val(), m += parseInt(v), $ct.css("margin-" + o, /[^a-z]/i.test(v) ? v + "px" : v);
            }), 0 == m && $ct.css("margin", ""), $ct.css("color", function() {
                var v = $("#text_color").val();
                return v ? "#" + v : "";
            }), $ct.css("background-color", function() {
                var v = $("#text_bgcolor").val();
                return v ? "#" + v : "";
            }), $ct.html($("#text").val())), $c.css("background-color", function() {
                var v = $("#bgcolor").val();
                return v ? "#" + v : "";
            }), $.each([ "width", "color", "style" ], function(i, k) {
                v = "", "inherit" == (v = $("#border").is(":checked") ? $("#border_" + k).val() : v) && (v = ""), 
                "width" == k && (v = /[^a-z]/i.test(v) ? v + "px" : v), "color" == k && "#" !== v.charAt(0) && (v = "#" + v), 
                $c.css("border-" + k, v);
            }), $.each([ "top", "right", "bottom", "left" ], function(i, k) {
                (v = $("#padding_" + k).val()) && (p += parseInt(v)), $c.css("padding-" + k, /[^a-z]/i.test(v) ? v + "px" : v);
            }), 0 == p && $c.css("padding", ""), $.each([ "top", "right", "bottom", "left" ], function(i, k) {
                (v = $("#margin_" + k).val()) && (m += parseInt(v)), v && !1 === /[^\d]/i.test(v) && (v += "px"), 
                $c.css("margin-" + k, v);
            }), 0 == m && $c.css("margin", ""), $c.css({
                float: "",
                "vertical-align": ""
            }), v = $("#align").val()) {
              case "center":
                k = {
                    "margin-left": "auto",
                    "margin-right": "auto",
                    display: "block"
                }, v = null, $("#margin_left, #margin_right").val("auto");
                break;

              case "left":
              case "right":
                k = "float";
                break;

              case "top":
              case "middle":
              case "bottom":
                k = "vertical-align";
                break;

              default:
                "auto" === $("#margin_left").val() && $("#margin_left").val(""), 
                "auto" === $("#margin_right").val() && $("#margin_right").val(""), 
                k = {
                    "margin-left": $("#margin_left").val(),
                    "margin-right": $("#margin_right").val(),
                    display: ""
                };
            }
            $c.css(k, v);
        },
        getAttrib: function(e, at) {
            var v, ed = tinyMCEPopup.editor;
            if ("width" == at || "height" == at) return ed.dom.getAttrib(e, at) || ed.dom.getStyle(e, at) || "";
            if ("align" == at) {
                if (v = ed.dom.getAttrib(e, "align")) return v;
                if (v = ed.dom.getStyle(e, "float")) return v;
                if (v = ed.dom.getStyle(e, "vertical-align")) return v;
                if ("auto" === ed.dom.getStyle(e, "margin-left") && "auto" === ed.dom.getStyle(e, "margin-right")) return "center";
            }
            if (/^(margin|padding)-(top|bottom)$/.test(at)) {
                if (v = ed.dom.getStyle(e, at)) return v = /\d/.test(v) ? v.replace(/[^-\d]+/g, "") : v;
                if (v = ed.dom.getAttrib(e, "vspace")) return parseInt(v.replace(/[^-\d]+/g, ""));
            }
            if (/^(margin|padding)-(left|right)$/.test(at)) {
                if (v = ed.dom.getStyle(e, at)) return v = /\d/.test(v) ? v.replace(/[^-\d]+/g, "") : v;
                if (v = ed.dom.getAttrib(e, "hspace")) return parseInt(v.replace(/[^\d]+/g, ""));
            }
            return -1 != at.indexOf("border-") ? (v = "", "FIGURE" == e.nodeName ? v = ed.dom.getStyle(e, at.replace("border-", "outline-")) : each([ "top", "right", "bottom", "left" ], function(n) {
                n = at.replace(/-/, "-" + n + "-"), n = ed.dom.getStyle(e, n);
                ("" !== n || n != v && "" !== v) && (v = ""), n && (v = n);
            }), "" != v && $("#border").prop("checked", !0), "border-width" != at && "border-style" != at || "" != v || (v = "inherit"), 
            "border-color" == at && (v = Wf.String.toHex(v)), v = "border-width" == at && /[0-9][a-z]/.test(v) ? parseFloat(v) : v) : -1 != at.indexOf("color") ? (v = ed.dom.getStyle(e, at), 
            Wf.String.toHex(v)) : void 0;
        },
        setClasses: function(n, v) {
            v = $("<span/>").addClass($("#" + n).val()).addClass(v);
            $("#" + n).val(v.attr("class"));
        },
        openHelp: function() {
            Wf.help("caption");
        }
    };
    tinyMCEPopup.onInit.add(CaptionDialog.init, CaptionDialog), window.CaptionDialog = CaptionDialog;
}(window, jQuery, tinymce, tinyMCEPopup);