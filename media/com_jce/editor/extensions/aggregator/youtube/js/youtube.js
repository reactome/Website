/* jce - 2.9.84 | 2025-03-24 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
WFAggregator.add("youtube", {
    params: {
        width: 560,
        height: 315,
        embed: !0
    },
    props: {
        rel: 1,
        autoplay: 0,
        mute: 0,
        controls: 1,
        modestbranding: 0,
        enablejsapi: 0,
        loop: 0,
        playlist: "",
        start: "",
        end: "",
        privacy: 0
    },
    setup: function() {
        $.each(this.params, function(k, v) {
            $("#youtube_" + k).val(v).filter(":checkbox, :radio").prop("checked", !!v);
        }), $("#youtube_autoplay").on("change", function() {
            this.checked && $("#youtube_mute").prop("checked", !0);
        }).trigger("change");
    },
    getTitle: function() {
        return this.title || this.name;
    },
    getType: function() {
        return $("#youtube_embed:visible").is(":checked") ? "flash" : "iframe";
    },
    isSupported: function(v) {
        return !!v && !!/youtu(\.)?be(.+)?\/(.+)/.test(v) && "youtube";
    },
    getValues: function(src) {
        var id, self = this, data = {}, args = {}, type = this.getType(), u = this.parseURL(src), u = ($.extend(args, u.query), 
        src = src.replace(/^(http:)?\/\//, "https://"), $(":input", "#youtube_options").not("#youtube_embed, #youtube_https, #youtube_privacy").each(function() {
            var k = $(this).attr("id"), v = $(this).val();
            if (!k) return !0;
            k = k.substr(k.indexOf("_") + 1), $(this).is(":checkbox") && (v = $(this).is(":checked") ? 1 : 0), 
            self.props[k] != v && "" !== v && (args[k] = v);
        }), 1 == args.autoplay && (args.mute = 1), src = src.replace(/youtu(\.)?be([^\/]+)?\/(.+)/, function(a, b, c, d) {
            return d = d.replace(/(watch\?v=|v\/|embed\/|live\/)/, ""), b && !c && (c = ".com"), 
            id = d.replace(/([^\?&#]+)/, function($0, $1) {
                return $1;
            }), "youtube" + c + "/" + ("iframe" == type ? "embed" : "v") + "/" + d;
        }), id && args.loop && !args.playlist && (args.playlist = id), src = $("#youtube_privacy").is(":checked") ? src.replace(/youtube\./, "youtube-nocookie.") : src.replace(/youtube-nocookie\./, "youtube."), 
        "iframe" == type ? $.extend(data, {
            allowfullscreen: !0,
            frameborder: 0
        }) : $.extend(!0, data, {
            param: {
                allowfullscreen: !0,
                wmode: "opaque"
            }
        }), $(".uk-repeatable", "#youtube_params").each(function() {
            var key = $('input[name^="youtube_params_name"]', this).val(), value = $('input[name^="youtube_params_value"]', this).val();
            "" !== key && "" !== value && (args[key] = value);
        }), $.param(args));
        return u && (src = src + (/\?/.test(src) ? "&" : "?") + u), data.src = src, 
        data;
    },
    parseURL: function(url) {
        var o = {};
        try {
            var urlObj = new URL(url);
            o.host = urlObj.hostname, o.path = urlObj.pathname, o.query = {}, urlObj.searchParams.forEach(function(value, key) {
                o.query[key] = value;
            }), o.anchor = urlObj.hash ? urlObj.hash.substring(1) : null;
        } catch (e) {
            console.error("Invalid URL:", url);
        }
        return o;
    },
    setValues: function(data) {
        var u, s, self = this, id = "", src = data.src || data.data || "";
        return src && (-1 !== (src = "https://" + (u = this.parseURL(src)).host + u.path).indexOf("youtube-nocookie") && (data.youtube_privacy = 1), 
        u.query.v ? id = u.query.v : (s = /\/?(embed|live|v)?\/([\w-]+)\b/.exec(u.path)) && "array" === $.type(s) && (id = s.pop()), 
        $.each(u.query, function(key, val) {
            if ("v" == key) return !0;
            try {
                val = decodeURIComponent(val);
            } catch (e) {}
            return "autoplay" == key && (val = parseInt(val, 10)), "mute" == key && (val = parseInt(val, 10)), 
            "playlist" == key && val == id || "wmode" == key || self.props[key] === val || (data["youtube_" + key] = val, 
            void delete data[key]);
        }), src = src.replace(/youtu(\.)?be([^\/]+)?\/(.+)/, function(a, b, c, d) {
            var args = "youtube";
            return b && (args += ".com"), c && (args += c), args += "/embed/" + id, 
            u.anchor && (args += "#" + u.anchor.replace(/(\?|&)(.+)/, "")), args;
        }).replace(/\/\/youtube/i, "//www.youtube"), $.each(data, function(key, val) {
            /^iframe_(allow|frameborder|allowfullscreen)/.test(key) && delete data[key];
        }), data.src = src), data;
    },
    getAttributes: function(src) {
        var args = {}, data = this.setValues({
            src: src
        }) || {};
        return $.each(data, function(k, v) {
            "src" !== k && (args[k] = v);
        }), args = $.extend(args, {
            src: data.src || src,
            width: this.params.width,
            height: this.params.height
        });
    },
    setAttributes: function() {},
    onSelectFile: function() {},
    onInsert: function() {}
});