/* jce - 2.9.63 | 2024-03-11 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function($) {
    var each = tinymce.each, htmlSchema = new tinymce.html.Schema({
        schema: "html5-strict"
    }), defaultAttributes = {
        frameborder: 1,
        scrolling: "auto"
    }, validAttributes = [ "scrolling", "frameborder" ], IframeDialog = {
        settings: {},
        init: function() {
            var mediatype, attribs, x, self = this, ed = tinyMCEPopup.editor, elm = ed.selection.getNode();
            tinyMCEPopup.restoreSelection(), TinyMCE_Utils.fillClassList("classlist"), 
            Wf.init(), this.settings.file_browser && Wf.createBrowsers($("#src"), function(files, data) {
                data = data[0];
                $("#src").val(data.url), data.width && $("#width").val(data.width).data("tmp", data.width).trigger("change"), 
                data.height && $("#height").val(data.height).data("tmp", data.height).trigger("change");
            }), $("#insert").on("click", function() {
                self.insert();
            }), WFAggregator.setup({
                embed: !1
            }), /mce-object/.test(elm.className) ? (elm = ed.plugins.media.getMediaData(), 
            attribs = {}, each(elm, function(value, name) {
                var tmp;
                "class" === name && (name = "classes", value = value.replace(/mce-(.*)/g, "").replace(/\s+/g, " ").trim()), 
                attribs[name = "innerHTML" == name ? "html" : name] = value, "style" == name && (tmp = ed.dom.create("div", {
                    style: value
                }), attribs.align = Wf.getAttrib(tmp, "align"), each([ "top", "right", "bottom", "left" ], function(pos) {
                    attribs["margin_" + pos] = Wf.getAttrib(tmp, "margin-" + pos), 
                    ed.dom.setStyle(tmp, "margin-" + pos, "");
                }), each([ "width", "style", "color" ], function(at) {
                    attribs["border_" + at] = Wf.getAttrib(tmp, "border-" + at), 
                    ed.dom.setStyle(tmp, "border-" + at, "");
                }), each([ "width", "height" ], function(at) {
                    attribs[at] = Wf.getAttrib(tmp, at);
                }), ed.dom.setStyles(tmp, {
                    float: "",
                    "vertical-align": "",
                    margin: "",
                    width: "",
                    height: ""
                }), attribs[name] = tmp.style.cssText);
            }), attribs && ($("#insert").button("option", "label", tinyMCEPopup.getLang("update", "Update", !0)), 
            each([ "width", "height" ], function(key) {
                var value = attribs[key];
                $("#" + key).val(value).data("tmp", value);
            }), ((mediatype = WFAggregator.isSupported(attribs)) ? (attribs = WFAggregator.setValues(mediatype, attribs), 
            $(".aggregator_option, .options_description", "#options_tab").hide().filter("." + mediatype)) : $(".options_description", "#options_tab")).show(), 
            $("#src").val(attribs.src || ""), x = 0, each(attribs, function(value, key) {
                if ("width" === key || "height" === key || "src" === key) return !0;
                if (Array.isArray(value)) return each(value, function(val, i) {
                    $('input[name="' + key + '[]"]').eq(i).val(val).trigger("change");
                }), !0;
                var $na = $("#" + key);
                if ($na.length) $na.is(":checkbox") ? $na.prop("checked", !!(value = "false" != value && "0" != value ? value : !1)).trigger("change") : $na.val(value); else if (mediatype) {
                    if (key.substr(0, mediatype.length) !== mediatype) return !0;
                    key = key.substr(mediatype.length + 1);
                    $na = $(".uk-repeatable", ".aggregator_option." + mediatype).eq(0), 
                    $na = (0 < x && $($na).clone(!0).appendTo($($na).parent()), 
                    $(".uk-repeatable", ".aggregator_option." + mediatype).eq(x).find("input, select"));
                    $($na).eq(0).val(key), $($na).eq(1).val(value), x++;
                }
            }))) : Wf.setDefaults(this.settings.defaults), Wf.updateStyles(), $("#src").on("change", function() {
                var mediatype, key, data = {}, val = this.value;
                for (key in ((mediatype = WFAggregator.isSupported(val)) ? (data = WFAggregator.getAttributes(mediatype, val), 
                $(".aggregator_option, .options_description", "#options_tab").hide().filter("." + mediatype)) : $(".options_description", "#options_tab")).show(), 
                data) {
                    var $el = $("#" + key), val = data[key];
                    "width" == key || "height" == key ? "" !== $el.val() && !1 !== $el.hasClass("edited") || $("#" + key).val(data[key]).data("tmp", data[key]).trigger("change") : $el.is(":checkbox") ? (val = parseInt(val, 10), 
                    $el.attr("checked", val).prop("checked", val)) : $el.val(val);
                }
            }), $(".uk-equalize-checkbox").trigger("equalize:update"), $(".uk-form-controls select").datalist().trigger("datalist:update"), 
            $(".uk-datalist").trigger("datalist:update"), $(".uk-repeatable").on("repeatable:delete", function(e, ctrl, elm) {
                $(elm).find("input, select").eq(1).val("");
            });
        },
        getAttrib: function(e, at) {
            return Wf.getAttrib(e, at);
        },
        checkPrefix: function(n) {
            var self = this, v = $(n).val();
            /^\s*www./i.test(v) ? Wf.Modal.confirm(tinyMCEPopup.getLang("iframe_dlg.is_external", "The URL you entered seems to be an external link, do you want to add the required http:// prefix?"), function(state) {
                state && $(n).val("http://" + v), self.insert();
            }) : this.insertAndClose();
        },
        insert: function() {
            return "" === $("#src").val() ? (Wf.Modal.alert(tinyMCEPopup.getLang("iframe_dlg.no_src", "Please enter a url for the iframe")), 
            !1) : "" === $("#width").val() || "" === $("#height").val() ? (Wf.Modal.alert(tinyMCEPopup.getLang("iframe_dlg.no_dimensions", "Please enter a width and height for the iframe")), 
            !1) : this.checkPrefix($("#src"));
        },
        insertAndClose: function() {
            tinyMCEPopup.restoreSelection();
            var ed = tinyMCEPopup.editor, data = {}, args = {}, elm = ed.selection.getNode(), innerHTML = ($("input[id], select[id]").each(function() {
                var value = $(this).val(), name = this.id;
                $(this).is(":checkbox") && (value = !!$(this).is(":checked")), (value = "frameborder" === name ? value ? 1 : 0 : value) === defaultAttributes[name = "classes" === name ? "class" : name] && (value = ""), 
                !htmlSchema.isValid("iframe", name) && -1 === tinymce.inArray(validAttributes, name) || (data[name] = value);
            }), data.width = data.width || 384, data.height = data.height || 216, 
            elm = ed.dom.getParent(elm, ".mce-object-iframe"), ed.dom.hasClass(elm, "mce-object-preview") && (elm = elm.firstChild), 
            $.trim($("#html").val())), provider = ((provider = WFAggregator.isSupported(data.src)) && $.extend(!0, data, WFAggregator.getValues(provider, data.src)), 
            ed.undoManager.add(), ed.plugins.media);
            elm ? (data.innerHTML = innerHTML, provider.updateMedia(data)) : (each(data, function(value, name) {
                "" !== value && (args[name] = value);
            }), elm = ed.dom.createHTML("iframe", args, innerHTML), ed.execCommand("mceInsertContent", !1, elm, {
                skip_undo: 1
            })), tinyMCEPopup.close();
        }
    };
    window.IframeDialog = IframeDialog, tinyMCEPopup.onInit.add(IframeDialog.init, IframeDialog);
}(jQuery, tinyMCEPopup);