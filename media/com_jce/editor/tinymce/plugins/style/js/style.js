/* jce - 2.9.88 | 2025-06-19 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function(tinymce, tinyMCEPopup, $) {
    function selectByValue(field_name, value, add_custom, ignore_case) {
        value = value || "";
        var sel = document.getElementById(field_name);
        if (sel) {
            sel.list && (sel.value = value, sel = sel.list);
            for (var option, found = !1, i = 0; i < sel.options.length; i++) (option = sel.options[i]).value == value || ignore_case && option.value.toLowerCase() == value.toLowerCase() ? found = option.selected = !0 : option.selected = !1;
            !found && add_custom && "" != value && ((option = new Option(value, value)).selected = !0, 
            sel.appendChild(option), sel.selectedIndex = sel.options.length - 1);
        }
    }
    function addSelectValue(field_name, name, value) {
        field_name = (field_name = document.getElementById(field_name)).list || field_name, 
        name = new Option(name, value);
        field_name.appendChild(name);
    }
    function getColor(n) {
        n = $(n).val();
        return -1 !== n.indexOf("#") ? n : "#" + n;
    }
    var StyleDialog = {
        settings: {},
        defaults: {
            Fonts: "Arial, Helvetica, sans-serif=Arial, Helvetica, sans-serif;Times New Roman, Times, serif=Times New Roman, Times, serif;Courier New, Courier, mono=Courier New, Courier, mono;Times New Roman, Times, serif=Times New Roman, Times, serif;Georgia, Times New Roman, Times, serif=Georgia, Times New Roman, Times, serif;Verdana, Arial, Helvetica, sans-serif=Verdana, Arial, Helvetica, sans-serif;Geneva, Arial, Helvetica, sans-serif=Geneva, Arial, Helvetica, sans-serif",
            Sizes: "9;10;12;14;16;18;24;xx-small;x-small;small;medium;large;x-large;xx-large;smaller;larger",
            Measurement: "+pixels=px;points=pt;inches=in;centimetres=cm;millimetres=mm;picas=pc;ems=em;exs=ex;%",
            SpacingMeasurement: "pixels=px;points=pt;inches=in;centimetres=cm;millimetres=mm;picas=pc;+ems=em;exs=ex;%",
            IndentMeasurement: "pixels=px;+points=pt;inches=in;centimetres=cm;millimetres=mm;picas=pc;ems=em;exs=ex;%",
            Weight: "normal;bold;bolder;lighter;100;200;300;400;500;600;700;800;900",
            TextStyle: "normal;italic;oblique",
            Variant: "normal;small-caps",
            LineHeight: "normal",
            Attachment: "fixed;scroll",
            Repeat: "no-repeat;repeat;repeat-x;repeat-y",
            PosH: "left;center;right",
            PosV: "top;center;bottom",
            VAlign: "baseline;sub;super;top;text-top;middle;bottom;text-bottom",
            Display: "inline;block;list-item;run-in;compact;marker;table;inline-table;table-row-group;table-header-group;table-footer-group;table-row;table-column-group;table-column;table-cell;table-caption;none",
            BorderStyle: "none;solid;dashed;dotted;double;groove;ridge;inset;outset",
            BorderWidth: "thin;medium;thick",
            ListType: "disc;circle;square;decimal;lower-roman;upper-roman;lower-alpha;upper-alpha;none"
        },
        aggregateStyles: function(allStyles) {
            var mergedStyles = {};
            return tinymce.each(allStyles, function(style) {
                if ("" !== style) {
                    var name, parsedStyles = tinyMCEPopup.editor.dom.parseStyle(style);
                    for (name in parsedStyles) parsedStyles.hasOwnProperty(name) && (void 0 === mergedStyles[name] ? mergedStyles[name] = parsedStyles[name] : "text-decoration" === name && -1 === mergedStyles[name].indexOf(parsedStyles[name]) && (mergedStyles[name] = mergedStyles[name] + " " + parsedStyles[name]));
                }
            }), mergedStyles;
        },
        init: function() {
            var self = this, ed = tinyMCEPopup.editor, ce = document.getElementById("container");
            this.settings.file_browser || $(".browser").removeClass("browser"), 
            this.existingStyles = this.aggregateStyles(tinyMCEPopup.getWindowArg("styles")), 
            ce.style.cssText = ed.dom.serializeStyle(this.existingStyles), this.applyActionIsInsert = ed.getParam("edit_css_style_insert_span", !1), 
            $("#insert").on("click", function(e) {
                e.preventDefault(), self.updateAction();
            }), $("#apply").on("click", function(e) {
                e.preventDefault(), self.applyAction();
            }), $("#toggle_insert_span").prop("checked", this.applyActionIsInsert), 
            this.fillSelect("text_font", "style_font", ed.getParam("theme_fonts", this.defaults.Fonts), ";", !0), 
            this.fillSelect("text_size", "style_font_size", this.defaults.Sizes, ";", !0), 
            this.fillSelect("text_size_measurement", "style_font_size_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("text_case", "style_text_case", "capitalize;uppercase;lowercase", ";", !0), 
            this.fillSelect("text_weight", "style_font_weight", this.defaults.Weight, ";", !0), 
            this.fillSelect("text_style", "style_font_style", this.defaults.TextStyle, ";", !0), 
            this.fillSelect("text_variant", "style_font_variant", this.defaults.Variant, ";", !0), 
            this.fillSelect("text_lineheight", "style_font_line_height", this.defaults.LineHeight, ";", !0), 
            this.fillSelect("text_lineheight_measurement", "style_font_line_height_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("background_attachment", "style_background_attachment", this.defaults.Attachment, ";", !0), 
            this.fillSelect("background_repeat", "style_background_repeat", this.defaults.Repeat, ";", !0), 
            this.fillSelect("background_hpos_measurement", "style_background_hpos_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("background_vpos_measurement", "style_background_vpos_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("background_hpos", "style_background_hpos", this.defaults.PosH, ";", !0), 
            this.fillSelect("background_vpos", "style_background_vpos", this.defaults.PosV, ";", !0), 
            this.fillSelect("block_wordspacing", "style_wordspacing", "normal", ";", !0), 
            this.fillSelect("block_wordspacing_measurement", "style_wordspacing_measurement", this.defaults.SpacingMeasurement, ";", !0), 
            this.fillSelect("block_letterspacing", "style_letterspacing", "normal", ";", !0), 
            this.fillSelect("block_letterspacing_measurement", "style_letterspacing_measurement", this.defaults.SpacingMeasurement, ";", !0), 
            this.fillSelect("block_vertical_alignment", "style_vertical_alignment", this.defaults.VAlign, ";", !0), 
            this.fillSelect("block_text_align", "style_text_align", "left;right;center;justify", ";", !0), 
            this.fillSelect("block_whitespace", "style_whitespace", "normal;pre;pre-wrap;pre-line;nowrap", ";", !0), 
            this.fillSelect("block_display", "style_display", this.defaults.Display, ";", !0), 
            this.fillSelect("block_text_indent_measurement", "style_text_indent_measurement", this.defaults.IndentMeasurement, ";", !0), 
            this.fillSelect("box_width_measurement", "style_box_width_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("box_height_measurement", "style_box_height_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("box_float", "style_float", "left;right;none", ";", !0), 
            this.fillSelect("box_clear", "style_clear", "left;right;both;none", ";", !0), 
            this.fillSelect("box_padding_left_measurement", "style_padding_left_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("box_padding_top_measurement", "style_padding_top_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("box_padding_bottom_measurement", "style_padding_bottom_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("box_padding_right_measurement", "style_padding_right_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("box_margin_left_measurement", "style_margin_left_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("box_margin_top_measurement", "style_margin_top_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("box_margin_bottom_measurement", "style_margin_bottom_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("box_margin_right_measurement", "style_margin_right_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("border_style_top", "style_border_style_top", this.defaults.BorderStyle, ";", !0), 
            this.fillSelect("border_style_right", "style_border_style_right", this.defaults.BorderStyle, ";", !0), 
            this.fillSelect("border_style_bottom", "style_border_style_bottom", this.defaults.BorderStyle, ";", !0), 
            this.fillSelect("border_style_left", "style_border_style_left", this.defaults.BorderStyle, ";", !0), 
            this.fillSelect("border_width_top", "style_border_width_top", this.defaults.BorderWidth, ";", !0), 
            this.fillSelect("border_width_right", "style_border_width_right", this.defaults.BorderWidth, ";", !0), 
            this.fillSelect("border_width_bottom", "style_border_width_bottom", this.defaults.BorderWidth, ";", !0), 
            this.fillSelect("border_width_left", "style_border_width_left", this.defaults.BorderWidth, ";", !0), 
            this.fillSelect("border_width_top_measurement", "style_border_width_top_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("border_width_right_measurement", "style_border_width_right_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("border_width_bottom_measurement", "style_border_width_bottom_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("border_width_left_measurement", "style_border_width_left_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("list_type", "style_list_type", this.defaults.ListType, ";", !0), 
            this.fillSelect("list_position", "style_list_position", "inside;outside", ";", !0), 
            this.fillSelect("positioning_type", "style_positioning_type", "absolute;relative;static", ";", !0), 
            this.fillSelect("positioning_visibility", "style_positioning_visibility", "inherit;visible;hidden", ";", !0), 
            this.fillSelect("positioning_width_measurement", "style_positioning_width_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("positioning_height_measurement", "style_positioning_height_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("positioning_overflow", "style_positioning_overflow", "visible;hidden;scroll;auto", ";", !0), 
            this.fillSelect("positioning_placement_top_measurement", "style_positioning_placement_top_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("positioning_placement_right_measurement", "style_positioning_placement_right_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("positioning_placement_bottom_measurement", "style_positioning_placement_bottom_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("positioning_placement_left_measurement", "style_positioning_placement_left_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("positioning_clip_top_measurement", "style_positioning_clip_top_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("positioning_clip_right_measurement", "style_positioning_clip_right_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("positioning_clip_bottom_measurement", "style_positioning_clip_bottom_measurement", this.defaults.Measurement, ";", !0), 
            this.fillSelect("positioning_clip_left_measurement", "style_positioning_clip_left_measurement", this.defaults.Measurement, ";", !0), 
            this.setupFormData(), this.showDisabledControls(), Wf.init(), $(".uk-form-controls select").datalist().trigger("datalist:update"), 
            $(".uk-datalist").trigger("datalist:update");
        },
        setupFormData: function() {
            var v, ed = tinyMCEPopup.editor, ce = document.getElementById("container");
            selectByValue("text_font", ce.style.fontFamily, !0, !0), selectByValue("text_size", this.getNum(ce.style.fontSize), !0, !0), 
            selectByValue("text_size_measurement", this.getMeasurement(ce.style.fontSize)), 
            selectByValue("text_weight", ce.style.fontWeight, !0, !0), selectByValue("text_style", ce.style.fontStyle, !0, !0), 
            selectByValue("text_lineheight", this.getNum(ce.style.lineHeight), !0, !0), 
            selectByValue("text_lineheight_measurement", this.getMeasurement(ce.style.lineHeight)), 
            selectByValue("text_case", ce.style.textTransform, !0, !0), selectByValue("text_variant", ce.style.fontVariant, !0, !0), 
            $("#text_color").val(ed.dom.toHex(ce.style.color)), $("#text_underline").prop("checked", this.inStr(ce.style.textDecoration, "underline")), 
            $("#text_overline").prop("checked", this.inStr(ce.style.textDecoration, "overline")), 
            $("#text_linethrough").prop("checked", this.inStr(ce.style.textDecoration, "line-through")), 
            $("#text_blink").prop("checked", this.inStr(ce.style.textDecoration, "blink")), 
            $("#text_none").prop("checked", this.inStr(ce.style.textDecoration, "none")), 
            this.updateTextDecorations(), $("#background_color").val(ed.dom.toHex(ce.style.backgroundColor)), 
            $("#background_image").val(ce.style.backgroundImage.replace(new RegExp("url\\('?([^']*)'?\\)", "gi"), function(a, b) {
                return ed.convertURL(b);
            })), selectByValue("background_repeat", ce.style.backgroundRepeat, !0, !0), 
            selectByValue("background_attachment", ce.style.backgroundAttachment, !0, !0), 
            selectByValue("background_hpos", this.getNum(this.getVal(ce.style.backgroundPosition, 0)), !0, !0), 
            selectByValue("background_hpos_measurement", this.getMeasurement(this.getVal(ce.style.backgroundPosition, 0))), 
            selectByValue("background_vpos", this.getNum(this.getVal(ce.style.backgroundPosition, 1)), !0, !0), 
            selectByValue("background_vpos_measurement", this.getMeasurement(this.getVal(ce.style.backgroundPosition, 1))), 
            selectByValue("block_wordspacing", this.getNum(ce.style.wordSpacing), !0, !0), 
            selectByValue("block_wordspacing_measurement", this.getMeasurement(ce.style.wordSpacing)), 
            selectByValue("block_letterspacing", this.getNum(ce.style.letterSpacing), !0, !0), 
            selectByValue("block_letterspacing_measurement", this.getMeasurement(ce.style.letterSpacing)), 
            selectByValue("block_vertical_alignment", ce.style.verticalAlign, !0, !0), 
            selectByValue("block_text_align", ce.style.textAlign, !0, !0), $("#block_text_indent").val(this.getNum(ce.style.textIndent)), 
            selectByValue("block_text_indent_measurement", this.getMeasurement(ce.style.textIndent)), 
            selectByValue("block_whitespace", ce.style.whiteSpace, !0, !0), selectByValue("block_display", ce.style.display, !0, !0), 
            $("#box_width").val(this.getNum(ce.style.width)), selectByValue("box_width_measurement", this.getMeasurement(ce.style.width)), 
            $("#box_height").val(this.getNum(ce.style.height)), selectByValue("box_height_measurement", this.getMeasurement(ce.style.height)), 
            selectByValue("box_float", ce.style.cssFloat || ce.style.styleFloat, !0, !0), 
            selectByValue("box_clear", ce.style.clear, !0, !0), this.setupBox(ce, "box_padding", "padding", ""), 
            this.setupBox(ce, "box_margin", "margin", ""), this.setupBox(ce, "border_style", "border", "Style"), 
            this.setupBox(ce, "border_width", "border", "Width"), this.setupBox(ce, "border_color", "border", "Color"), 
            $.each([ "top", "right", "bottom", "left" ], function(i, k) {
                $("#border_color_" + k).val(function() {
                    return ed.dom.toHex(this.value);
                });
            }), selectByValue("list_type", ce.style.listStyleType, !0, !0), selectByValue("list_position", ce.style.listStylePosition, !0, !0), 
            $("#list_bullet_image").val(ce.style.listStyleImage.replace(new RegExp("url\\('?([^']*)'?\\)", "gi"), "$1")), 
            selectByValue("positioning_type", ce.style.position, !0, !0), selectByValue("positioning_visibility", ce.style.visibility, !0, !0), 
            selectByValue("positioning_overflow", ce.style.overflow, !0, !0), $("#positioning_zindex").val(ce.style.zIndex || ""), 
            $("#positioning_width").val(this.getNum(ce.style.width)), selectByValue("positioning_width_measurement", this.getMeasurement(ce.style.width)), 
            $("#positioning_height").val(this.getNum(ce.style.height)), selectByValue("positioning_height_measurement", this.getMeasurement(ce.style.height)), 
            this.setupBox(ce, "positioning_placement", "", "", [ "top", "right", "bottom", "left" ]), 
            ce = (ce = ce.style.clip.replace(new RegExp("rect\\('?([^']*)'?\\)", "gi"), "$1")).replace(/,/g, " "), 
            this.hasEqualValues([ this.getVal(ce, 0), this.getVal(ce, 1), this.getVal(ce, 2), this.getVal(ce, 3) ]) ? ($("#positioning_clip_top").val(this.getNum(this.getVal(ce, 0))), 
            selectByValue("positioning_clip_top_measurement", this.getMeasurement(this.getVal(ce, 0))), 
            v = $("#positioning_clip_left").val(), $("#positioning_clip_right").val(v), 
            $("#positioning_clip_bottom").val(v)) : ($("#positioning_clip_top").val(this.getNum(this.getVal(ce, 0))), 
            selectByValue("positioning_clip_top_measurement", this.getMeasurement(this.getVal(ce, 0))), 
            $("#positioning_clip_right").val(this.getNum(this.getVal(ce, 1))), selectByValue("positioning_clip_right_measurement", this.getMeasurement(this.getVal(ce, 1))), 
            $("#positioning_clip_bottom").val(this.getNum(this.getVal(ce, 2))), 
            selectByValue("positioning_clip_bottom_measurement", this.getMeasurement(this.getVal(ce, 2))), 
            $("#positioning_clip_left").val(this.getNum(this.getVal(ce, 3))), selectByValue("positioning_clip_left_measurement", this.getMeasurement(this.getVal(ce, 3))));
        },
        getMeasurement: function(s) {
            return s.replace(/^([0-9.]+)(.*)$/, "$2");
        },
        getNum: function(s) {
            return new RegExp("^(?:[0-9.]+)(?:[a-z%]+)$", "gi").test(s) ? s.replace(/[^0-9.]/g, "") : s;
        },
        inStr: function(s, n) {
            return new RegExp(n, "gi").test(s);
        },
        getVal: function(s, i) {
            s = s.split(" ");
            return 1 < s.length ? s[i] : "";
        },
        setValue: function(n, v) {
            var el = document.getElementById(n);
            "select" == el.type ? selectByValue(n, v, !0, !0) : el.value = v;
        },
        setProp: function(n, p, v) {
            n = document.getElementById(n);
            $(n).prop(p, v);
        },
        setupBox: function(ce, fp, pr, sf, b) {
            this.isSame(ce, pr, sf, b = void 0 === b ? [ "Top", "Right", "Bottom", "Left" ] : b) ? (this.setProp(fp + "_same", "checked", !0), 
            this.setValue(fp + "_top", this.getNum(ce.style[pr + b[0] + sf])), this.setProp(fp + "_top", "disabled", !1), 
            this.setValue(fp + "_right", ""), this.setProp(fp + "_right", "disabled", !0), 
            this.setValue(fp + "_bottom", ""), this.setProp(fp + "_bottom", "disabled", !0), 
            this.setValue(fp + "_left", ""), this.setProp(fp + "_left", "disabled", !0), 
            $("#" + fp + "_top_measurement").get(0) && (selectByValue(fp + "_top_measurement", this.getMeasurement(ce.style[pr + b[0] + sf])), 
            this.setProp(fp + "_left_measurement", "disabled", !0), this.setProp(fp + "_bottom_measurement", "disabled", !0), 
            this.setProp(fp + "_right_measurement", "disabled", !0))) : (this.setProp(fp + "_same", "checked", !1), 
            this.setValue(fp + "_top", this.getNum(ce.style[pr + b[0] + sf])), this.setProp(fp + "_top", "disabled", !1), 
            this.setValue(fp + "_right", this.getNum(ce.style[pr + b[1] + sf])), 
            this.setProp(fp + "_right", "disabled", !1), this.setValue(fp + "_bottom", this.getNum(ce.style[pr + b[2] + sf])), 
            this.setProp(fp + "_bottom", "disabled", !1), this.setValue(fp + "_left", this.getNum(ce.style[pr + b[3] + sf])), 
            this.setProp(fp + "_left", "disabled", !1), $("#" + fp + "_top_measurement").get(0) && (selectByValue(fp + "_top_measurement", this.getMeasurement(ce.style[pr + b[0] + sf])), 
            selectByValue(fp + "_right_measurement", this.getMeasurement(ce.style[pr + b[1] + sf])), 
            selectByValue(fp + "_bottom_measurement", this.getMeasurement(ce.style[pr + b[2] + sf])), 
            selectByValue(fp + "_left_measurement", this.getMeasurement(ce.style[pr + b[3] + sf])), 
            this.setProp(fp + "_left_measurement", "disabled", !1), this.setProp(fp + "_bottom_measurement", "disabled", !1), 
            this.setProp(fp + "_right_measurement", "disabled", !1)));
        },
        isSame: function(e, pr, sf, b) {
            var i, x, a = [];
            for (a[0] = e.style[pr + (b = void 0 === b ? [ "Top", "Right", "Bottom", "Left" ] : b)[0] + (sf = void 0 !== sf && null != sf ? sf : "")], 
            a[1] = e.style[pr + b[1] + sf], a[2] = e.style[pr + b[2] + sf], a[3] = e.style[pr + b[3] + sf], 
            i = 0; i < a.length; i++) {
                if (null == a[i]) return !1;
                for (x = 0; x < a.length; x++) if (a[x] != a[i]) return !1;
            }
            return !0;
        },
        hasEqualValues: function(a) {
            for (var x, i = 0; i < a.length; i++) {
                if (null == a[i]) return !1;
                for (x = 0; x < a.length; x++) if (a[x] != a[i]) return !1;
            }
            return !0;
        },
        toggleApplyAction: function() {
            this.applyActionIsInsert = !this.applyActionIsInsert;
        },
        applyAction: function() {
            var nodes, ce = document.getElementById("container"), ed = tinyMCEPopup.editor, ce = (this.generateCSS(), 
            tinyMCEPopup.restoreSelection(), tinyMCEPopup.editor.dom.parseStyle(ce.style.cssText));
            this.applyActionIsInsert ? (ed.formatter.register("plugin_style", {
                inline: "span",
                styles: this.existingStyles
            }), ed.formatter.remove("plugin_style"), ed.formatter.register("plugin_style", {
                inline: "span",
                styles: ce
            }), ed.formatter.apply("plugin_style")) : (nodes = tinyMCEPopup.getWindowArg("applyStyleToBlocks") ? ed.selection.getSelectedBlocks() : ed.selection.getNode(), 
            ed.dom.setAttrib(nodes, "style", tinyMCEPopup.editor.dom.serializeStyle(ce))), 
            ed.undoManager.add(), ed.nodeChanged();
        },
        updateAction: function() {
            this.applyAction(), tinyMCEPopup.close();
        },
        generateCSS: function() {
            var s, t, ce = document.getElementById("container");
            ce.style.cssText = "", ce.style.fontFamily = $("#text_font").val(), 
            ce.style.fontSize = $("#text_size").val() + (this.isNum($("#text_size").val()) ? $("#text_size_measurement").val() || "px" : ""), 
            ce.style.fontStyle = $("#text_style").val(), ce.style.lineHeight = $("#text_lineheight").val() + (this.isNum($("#text_lineheight").val()) ? $("#text_lineheight_measurement").val() : ""), 
            ce.style.textTransform = $("#text_case").val(), ce.style.fontWeight = $("#text_weight").val(), 
            ce.style.fontVariant = $("#text_variant").val(), ce.style.color = getColor("#text_color"), 
            s = "", s = 0 < (s = (s = (s = (s += $("#text_underline").prop("checked") ? " underline" : "") + ($("#text_overline").prop("checked") ? " overline" : "")) + ($("#text_linethrough").prop("checked") ? " line-through" : "")) + ($("#text_blink").prop("checked") ? " blink" : "")).length ? s.substring(1) : s, 
            $("#text_none").prop("checked") && (s = "none"), ce.style.textDecoration = s, 
            ce.style.backgroundColor = getColor("#background_color"), ce.style.backgroundImage = "" != $("#background_image").val() ? "url(" + $("#background_image").val() + ")" : "", 
            ce.style.backgroundRepeat = $("#background_repeat").val(), ce.style.backgroundAttachment = $("#background_attachment").val(), 
            "" != $("#background_hpos").val() && (s = "", s = (s += $("#background_hpos").val() + (this.isNum($("#background_hpos").val()) ? $("#background_hpos_measurement").val() : "") + " ") + ($("#background_vpos").val() + (this.isNum($("#background_vpos").val()) ? $("#background_vpos_measurement").val() : "")), 
            ce.style.backgroundPosition = s), ce.style.wordSpacing = $("#block_wordspacing").val() + (this.isNum($("#block_wordspacing").val()) ? $("#block_wordspacing_measurement").val() : ""), 
            ce.style.letterSpacing = $("#block_letterspacing").val() + (this.isNum($("#block_letterspacing").val()) ? $("#block_letterspacing_measurement").val() : ""), 
            ce.style.verticalAlign = $("#block_vertical_alignment").val(), ce.style.textAlign = $("#block_text_align").val(), 
            ce.style.textIndent = $("#block_text_indent").val() + (this.isNum($("#block_text_indent").val()) ? $("#block_text_indent_measurement").val() : ""), 
            ce.style.whiteSpace = $("#block_whitespace").val(), ce.style.display = $("#block_display").val(), 
            ce.style.width = $("#box_width").val() + (this.isNum($("#box_width").val()) ? $("#box_width_measurement").val() : ""), 
            ce.style.height = $("#box_height").val() + (this.isNum($("#box_height").val()) ? $("#box_height_measurement").val() : ""), 
            tinymce.isIE ? ce.style.styleFloat = $("#box_float").val() : ce.style.cssFloat = $("#box_float").val(), 
            ce.style.clear = $("#box_clear").val(), $("#box_padding_same").prop("checked") ? ce.style.padding = $("#box_padding_top").val() + (this.isNum($("#box_padding_top").val()) ? $("#box_padding_top_measurement").val() : "") : (ce.style.paddingTop = $("#box_padding_top").val() + (this.isNum($("#box_padding_top").val()) ? $("#box_padding_top_measurement").val() : ""), 
            ce.style.paddingRight = $("#box_padding_right").val() + (this.isNum($("#box_padding_right").val()) ? $("#box_padding_right_measurement").val() : ""), 
            ce.style.paddingBottom = $("#box_padding_bottom").val() + (this.isNum($("#box_padding_bottom").val()) ? $("#box_padding_bottom_measurement").val() : ""), 
            ce.style.paddingLeft = $("#box_padding_left").val() + (this.isNum($("#box_padding_left").val()) ? $("#box_padding_left_measurement").val() : "")), 
            $("#box_margin_same").prop("checked") ? ce.style.margin = $("#box_margin_top").val() + (this.isNum($("#box_margin_top").val()) ? $("#box_margin_top_measurement").val() : "") : (ce.style.marginTop = $("#box_margin_top").val() + (this.isNum($("#box_margin_top").val()) ? $("#box_margin_top_measurement").val() : ""), 
            ce.style.marginRight = $("#box_margin_right").val() + (this.isNum($("#box_margin_right").val()) ? $("#box_margin_right_measurement").val() : ""), 
            ce.style.marginBottom = $("#box_margin_bottom").val() + (this.isNum($("#box_margin_bottom").val()) ? $("#box_margin_bottom_measurement").val() : ""), 
            ce.style.marginLeft = $("#box_margin_left").val() + (this.isNum($("#box_margin_left").val()) ? $("#box_margin_left_measurement").val() : "")), 
            $("#border_style_same").prop("checked") ? ce.style.borderStyle = $("#border_style_top").val() : (ce.style.borderTopStyle = $("#border_style_top").val(), 
            ce.style.borderRightStyle = $("#border_style_right").val(), ce.style.borderBottomStyle = $("#border_style_bottom").val(), 
            ce.style.borderLeftStyle = $("#border_style_left").val()), $("#border_width_same").prop("checked") ? ce.style.borderWidth = $("#border_width_top").val() + (this.isNum($("#border_width_top").val()) ? $("#border_width_top_measurement").val() : "") : (ce.style.borderTopWidth = $("#border_width_top").val() + (this.isNum($("#border_width_top").val()) ? $("#border_width_top_measurement").val() : ""), 
            ce.style.borderRightWidth = $("#border_width_right").val() + (this.isNum($("#border_width_right").val()) ? $("#border_width_right_measurement").val() : ""), 
            ce.style.borderBottomWidth = $("#border_width_bottom").val() + (this.isNum($("#border_width_bottom").val()) ? $("#border_width_bottom_measurement").val() : ""), 
            ce.style.borderLeftWidth = $("#border_width_left").val() + (this.isNum($("#border_width_left").val()) ? $("#border_width_left_measurement").val() : "")), 
            $("#border_color_same").prop("checked") ? ce.style.borderColor = getColor("#border_color_top") : (ce.style.borderTopColor = getColor("#border_color_top"), 
            ce.style.borderRightColor = getColor("#border_color_right"), ce.style.borderBottomColor = getColor("#border_color_bottom"), 
            ce.style.borderLeftColor = getColor("#border_color_left")), ce.style.listStyleType = $("#list_type").val(), 
            ce.style.listStylePosition = $("#list_position").val(), ce.style.listStyleImage = "" != $("#list_bullet_image").val() ? "url(" + $("#list_bullet_image").val() + ")" : "", 
            ce.style.position = $("#positioning_type").val(), ce.style.visibility = $("#positioning_visibility").val(), 
            "" == ce.style.width && (ce.style.width = $("#positioning_width").val() + (this.isNum($("#positioning_width").val()) ? $("#positioning_width_measurement").val() : "")), 
            "" == ce.style.height && (ce.style.height = $("#positioning_height").val() + (this.isNum($("#positioning_height").val()) ? $("#positioning_height_measurement").val() : "")), 
            ce.style.zIndex = $("#positioning_zindex").val(), ce.style.overflow = $("#positioning_overflow").val(), 
            $("#positioning_placement_same").prop("checked") ? (s = $("#positioning_placement_top").val() + (this.isNum($("#positioning_placement_top").val()) ? $("#positioning_placement_top_measurement").val() : ""), 
            ce.style.top = s, ce.style.right = s, ce.style.bottom = s, ce.style.left = s) : (ce.style.top = $("#positioning_placement_top").val() + (this.isNum($("#positioning_placement_top").val()) ? $("#positioning_placement_top_measurement").val() : ""), 
            ce.style.right = $("#positioning_placement_right").val() + (this.isNum($("#positioning_placement_right").val()) ? $("#positioning_placement_right_measurement").val() : ""), 
            ce.style.bottom = $("#positioning_placement_bottom").val() + (this.isNum($("#positioning_placement_bottom").val()) ? $("#positioning_placement_bottom_measurement").val() : ""), 
            ce.style.left = $("#positioning_placement_left").val() + (this.isNum($("#positioning_placement_left").val()) ? $("#positioning_placement_left_measurement").val() : "")), 
            $("#positioning_clip_same").prop("checked") ? "rect(auto auto auto auto)" != (s = (s = (s = "rect(") + ((t = this.isNum($("#positioning_clip_top").val()) ? $("#positioning_clip_top").val() + $("#positioning_clip_top_measurement").val() : "auto") + " ") + (t + " ")) + (t + " ") + (t + ")")) && (ce.style.clip = s) : (s = "rect(", 
            "rect(auto auto auto auto)" != (s = (s = (s = (s += (this.isNum($("#positioning_clip_top").val()) ? $("#positioning_clip_top").val() + $("#positioning_clip_top_measurement").val() : "auto") + " ") + ((this.isNum($("#positioning_clip_right").val()) ? $("#positioning_clip_right").val() + $("#positioning_clip_right_measurement").val() : "auto") + " ")) + ((this.isNum($("#positioning_clip_bottom").val()) ? $("#positioning_clip_bottom").val() + $("#positioning_clip_bottom_measurement").val() : "auto") + " ")) + (this.isNum($("#positioning_clip_left").val()) ? $("#positioning_clip_left").val() + $("#positioning_clip_left_measurement").val() : "auto") + ")") && (ce.style.clip = s));
        },
        isNum: function(s) {
            return new RegExp("[0-9]+", "g").test(s);
        },
        showDisabledControls: function() {},
        fillSelect: function(s, param, dval, sep, em) {
            var i, ar, p, se;
            for (sep = void 0 === sep ? ";" : sep, em && addSelectValue(s, "", ""), 
            ar = tinyMCEPopup.getParam(param, dval).split(sep), i = 0; i < ar.length; i++) se = !1, 
            "+" == ar[i].charAt(0) && (ar[i] = ar[i].substring(1), se = !0), 1 < (p = ar[i].split("=")).length ? (addSelectValue(s, p[0], p[1]), 
            se && selectByValue(s, p[1])) : (addSelectValue(s, p[0], p[0]), se && selectByValue(s, p[0]));
        },
        toggleSame: function(ce, pre) {
            ce = ce.checked;
            $("#" + pre + "_right, #" + pre + "_bottom, #" + pre + "_left").attr("disabled", ce).toggleClass("disabled", ce).trigger("change"), 
            $("#" + pre + "_right_measurement, #" + pre + "_bottom_measurement, #" + pre + "_left_measurement").attr("disabled", ce).toggleClass("disabled", ce).trigger("change");
        },
        synch: function(fr, to) {
            $("#" + to).val($("#" + fr).val()), document.getElementById[fr + "_measurement"] && selectByValue(to + "_measurement", $("#" + fr + "_measurement").val());
        },
        updateTextDecorations: function() {
            var noneChecked = $("#text_none").is(":checked");
            $("#text_underline, #text_overline, #text_linethrough, #text_blink").each(function() {
                $(this).prop("disabled", noneChecked), noneChecked && $(this).prop("checked", !1);
            });
        }
    };
    tinyMCEPopup.onInit.add(StyleDialog.init, StyleDialog), window.StyleDialog = StyleDialog;
}(tinymce, tinyMCEPopup, jQuery);