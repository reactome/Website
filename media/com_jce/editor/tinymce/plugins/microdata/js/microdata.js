/* jce - 2.9.63 | 2024-03-11 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
var MicrodataDialog = {
    settings: {},
    init: function() {
        tinyMCEPopup.restoreSelection();
        var data, schema, self = this, ed = tinyMCEPopup.editor, n = ed.selection.getNode(), update = !1, p = ($("#insert").on("click", function(e) {
            self.insert(), e.preventDefault();
        }), Wf.init(), $("input, select", "#microdata_tab").prop("disabled", !0), 
        ed.dom.getParent(n, "[data-microdata-itemtype],[itemtype]")), filter = (p && (update = !0, 
        $(".uk-button-text", "#insert").text(tinyMCEPopup.getLang("update", "Update", !0))), 
        $(".itemtype-options").toggle(update), $("#itemtype-new, #itemtype-replace").prop("disabled", !update), 
        window.sessionStorage && (schema = sessionStorage.getItem("wf-microdata-schema")) && (data = JSON.parse(schema), 
        Array.isArray(data) || (data = null)), ed.getParam("microdata_filter", []));
        function callback(values, parent) {
            $("#itemtype").prop("disabled", !1), values && ($.each(values, function(i, value) {
                if (!filter.length || -1 !== $.inArray(value.resource, filter)) {
                    for (var subClassOf = value.subClassOf, ix = 0; subClassOf && subClassOf.length; ) $.each(subClassOf, function(x, cls) {
                        (subClassOf = function(cls, values) {
                            for (var i = values.length; i--; ) if (values[i].resource === cls) return values[i].subClassOf;
                            return !1;
                        }(cls, values)) && subClassOf.length && ix++;
                    });
                    var opt = $('<option title="' + ed.dom.encode(value.comment) + '" value="' + value.resource + '">' + value.resource + "</option>").addClass(function() {
                        return !(0 < ix) && "microdata-itemtype";
                    }).addClass("microdata-itemtype-" + ix);
                    $("#itemtype").each(function() {
                        $(this.list).append(opt);
                    });
                }
            }), parent && (parent = (parent = ed.dom.getAttrib(parent, "data-microdata-itemtype")).substring(parent.lastIndexOf("/") + 1), 
            $("#itemtype").val(parent).trigger("change")), $("#itemtype").trigger("datalist:loading").trigger("datalist:update"));
        }
        $("#itemtype").on("change", function() {
            if ("" === $(this).val()) $("#itemprop, #itemid", "#microdata_tab").prop("disabled", !0); else {
                $("#itemprop, #itemid", "#microdata_tab").prop("disabled", !1);
                var props = {}, type = $(this).val();
                if (data) {
                    var cls = getClassFromType(type);
                    if (cls) {
                        props[type] = cls.domainIncludes;
                        for (var subClassOf = cls.subClassOf; subClassOf && subClassOf.length; ) $.each(subClassOf, function(i, key) {
                            cls = getClassFromType(key), props[key] = cls.domainIncludes, 
                            subClassOf = cls.subClassOf;
                        });
                    }
                    $("#itemprop").each(function() {
                        $(this.list).empty();
                    }).trigger("datalist:clear"), $.each(props, function(key, val) {
                        var $optgroup;
                        val.length && ($optgroup = $('<optgroup label="' + key + '"></optgroup>'), 
                        $.each(val, function(i, opt) {
                            var option = new Option(opt.label, opt.label);
                            $(option).attr("title", ed.dom.encode(opt.comment)), 
                            $optgroup.append(option);
                        }), $("#itemprop").each(function() {
                            $(this.list).append($optgroup);
                        }));
                    });
                }
                update && ($("#itemprop").val(ed.dom.getAttrib(n, "data-microdata-itemprop")), 
                $("#itemid").val(ed.dom.getAttrib(n, "data-microdata-itemid")).trigger("change")), 
                $("#itemprop").trigger("datalist:update");
            }
            function getClassFromType(type) {
                var match = !1;
                return $.each(data, function(i, item) {
                    if (type === item.resource) return match = item, !1;
                }), match;
            }
        }), $("#itemtype").trigger("datalist:loading"), data ? callback(data, p) : Wf.JSON.request("getSchema", [], function(o) {
            (o = o && "string" != typeof o ? o : {
                error: "Unable to load schema"
            }).error ? (Wf.Modal.alert(o.error), callback(!1)) : (callback(o, p), 
            data = o, window.sessionStorage && sessionStorage.setItem("wf-microdata-schema", JSON.stringify(o)));
        }), window.focus();
    },
    insert: function() {
        var args, blocks, fmt, ed = tinyMCEPopup.editor, se = ed.selection, n = se.getNode(), se = (tinyMCEPopup.restoreSelection(), 
        se.getContent() === se.getContent({
            format: "text"
        })), p = ed.dom.getParent(n, "[data-microdata-itemtype]"), itemtype = $("#itemtype").val();
        itemtype ? (args = {
            "data-microdata-itemprop": itemtype ? $("#itemprop").val() : null,
            "data-microdata-itemid": itemtype ? $("#itemid").val() : null
        }, blocks = [], $.each(ed.schema.getBlockElements(), function(k, v) {
            if (/\W/.test(k)) return !0;
            blocks.push(k.toUpperCase());
        }), p && !$("#itemtype-new:visible").is(":checked") || (p = ed.dom.getParent(n, blocks.join(","))) && !ed.dom.is(p, "[data-microdata-itemtype]") || (fmt = ed.schema.isValidChild(p, "div") ? "div" : "microdata", 
        ed.formatter.apply(fmt, {
            id: "__mce_tmp"
        }), p = ed.dom.get("__mce_tmp"), ed.dom.setAttrib(p, "id", null), p.innerHTML = "<span>" + p.innerHTML || "</span>", 
        n = p.firstChild, se = !1), se ? itemtype ? ed.formatter.apply("microdata", args) : (ed.formatter.remove("microdata-remove"), 
        p && ed.dom.setAttribs(p, {
            "data-microdata-itemscope": null,
            "data-microdata-itemtype": null
        })) : ed.dom.setAttribs(n, args), ed.dom.setAttribs(p, {
            "data-microdata-itemscope": itemtype ? "itemscope" : null,
            "data-microdata-itemtype": "https://schema.org/" + itemtype
        })) : (ed.formatter.remove("microdata-remove"), p && ed.dom.setAttribs(p, {
            "data-microdata-itemscope": null,
            "data-microdata-itemtype": null
        })), ed.undoManager.add(), tinyMCEPopup.close();
    }
};

tinyMCEPopup.onInit.add(MicrodataDialog.init, MicrodataDialog);