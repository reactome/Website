/* jce - 2.9.88 | 2025-06-19 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
WFAggregator.add("dailymotion", {
    params: {
        width: 480,
        height: 270,
        autoPlay: !1
    },
    props: {
        autoPlay: 0,
        start: 0
    },
    setup: function() {
        $("#dailymotion_autoPlay").prop("checked", this.params.autoPlay), $("#dailymotion_player_size").on("change", function() {
            var v = parseInt(this.value, 10);
            $("#dailymotion_player_size_custom").toggleClass("uk-hidden", !!this.value), 
            v && ($("#width").val(v), $("#height").val(Math.round(9 * v / 16)));
        }), $("#dailymotion_player_size_custom").on("change", function() {
            var v = parseInt(this.value, 10);
            v && ($("#width").val(v), $("#height").val(Math.round(16 * v / 9)));
        });
        var attributes = this.params.attributes || {}, x = 0;
        $.each(attributes, function(key, value) {
            var $repeatable = $(".media_option.dailymotion .uk-repeatable"), $repeatable = (0 < x && ($repeatable.eq(0).clone(!0).appendTo($repeatable.parent()), 
            $repeatable = $(".media_option.dailymotion .uk-repeatable")), $repeatable.eq(x).find("input, select"));
            $repeatable.eq(0).val(key), $repeatable.eq(1).val(value), x++;
        });
    },
    getTitle: function() {
        return this.title || this.name;
    },
    getType: function() {
        return "iframe";
    },
    isSupported: function(v) {
        return !!v && !!/dai\.?ly(motion)?(\.com)?/.test(v) && "dailymotion";
    },
    getValues: function(data) {
        var self = this, args = {}, id = "", src = data.src, m = (-1 !== src.indexOf("=") && $.extend(args, Wf.String.query(src)), 
        $("input[id], select[id]", "#dailymotion_options").each(function() {
            var k = $(this).attr("id"), v = $(this).val();
            if (!k) return !0;
            k = k.substr(k.indexOf("_") + 1), $(this).is(":checkbox") && (v = $(this).is(":checked") ? 1 : 0), 
            -1 === k.indexOf("player_size") && self.props[k] !== v && "" !== v && (args[k] = v);
        }), src.match(/dai\.?ly(motion\.com)?\/(embed)?\/?(swf|video)?\/?([a-z0-9]+)_?/)), m = (src = "https://www.dailymotion.com/embed/video/" + (id = m ? m.pop() : id), 
        $.param(args));
        return m && (src = src + (/\?/.test(src) ? "&" : "?") + m), data.src = src, 
        $.extend(data, {
            frameborder: 0,
            allowfullscreen: "allowfullscreen"
        }), $(".uk-repeatable", "#dailymotion_attributes").each(function() {
            var elements = $("input, select", this), key = $(elements).eq(0).val(), elements = $(elements).eq(1).val();
            key && (data["dailymotion_" + key] = elements);
        }), data;
    },
    setValues: function(data) {
        var query, self = this, src = data.src || data.data || "", id = "";
        return src && (query = Wf.String.query(src), $.each(query, function(key, val) {
            if (self.props[key] == val) return !0;
            data["dailymotion_" + key] = val;
        }), (query = (src = src.replace(/&amp;/g, "&")).match(/dai\.?ly(motion\.com)?\/(embed)?\/?(swf|video)?\/?([a-z0-9]+)_?/)) && (id = query.pop()), 
        data.src = "https://www.dailymotion.com/embed/video/" + id), data;
    },
    getAttributes: function(src) {
        var args = {}, data = this.setValues({
            src: src
        }) || {};
        return $.each(data, function(k, v) {
            "src" != k && (args["dailymotion_" + k] = v);
        }), $.extend(args, {
            src: data.src || src,
            width: this.params.width,
            height: this.params.height
        }), args;
    },
    setAttributes: function() {},
    onSelectFile: function() {},
    onInsert: function() {}
});