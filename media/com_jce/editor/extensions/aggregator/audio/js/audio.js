/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
WFAggregator.add("audio", {
    params: {},
    props: {
        autoplay: 0,
        loop: 0,
        controls: 1,
        mute: 0
    },
    setup: function() {
        var x = 0;
        $.each(this.params, function(k, v) {
            "attributes" == k ? $.each(v, function(key, value) {
                var $repeatable = $(".media_option.audio .uk-repeatable"), $repeatable = (0 < x && ($repeatable.eq(0).clone(!0).appendTo($repeatable.parent()), 
                $repeatable = $(".media_option.audio .uk-repeatable")), $repeatable.eq(x).find("input, select"));
                $repeatable.eq(0).val(key), $repeatable.eq(1).val(value), x++;
            }) : $("#audio_" + k).val(v).filter(":checkbox, :radio").prop("checked", !!v);
        });
    },
    getTitle: function() {
        return this.title || this.name;
    },
    getType: function() {
        return "audio";
    },
    isSupported: function(v) {
        return !!v && (v = v.split("?")[0], !!/\.(mp3|oga|webm|wav|m4a|aiff)$/.test(v)) && "audio";
    },
    getValues: function(data) {
        var sources = [], agent = ($('input[name="audio_source[]"]').each(function() {
            var val = $(this).val();
            val !== data.src && sources.push(val);
        }), sources.length && (data.audio_source = sources), delete data.width, 
        delete data.height, navigator.userAgent.match(/(Opera|Chrome|Safari|Gecko)/));
        return agent && (data.classes += " mce-object-agent-" + agent[0].toLowerCase()), 
        $(".uk-repeatable", "#audio_attributes").each(function() {
            var elements = $("input, select", this), key = $(elements).eq(0).val(), elements = $(elements).eq(1).val();
            key && (data["audio_" + key] = elements);
        }), data;
    },
    setValues: function(data) {
        var x = 0;
        return $.each(data, function(key, val) {
            if (-1 === key.indexOf("audio_")) return !0;
            delete data[key], key = key.substr(key.indexOf("_") + 1);
            var $repeatable = $(".uk-repeatable", "#audio_attributes"), $repeatable = (0 < x && ($repeatable.eq(0).clone(!0).appendTo($repeatable.parent()), 
            $repeatable = $(".uk-repeatable", "#audio_attributes")), $repeatable.eq(x).find("input, select"));
            $repeatable.eq(0).val(key), $repeatable.eq(1).val(val), x++;
        }), data;
    },
    getAttributes: function(src) {
        return {
            width: "",
            height: ""
        };
    }
});