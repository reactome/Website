/* jce - 2.9.54 | 2023-11-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
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
        return "object" == typeof v && (v = v.src || v.data || ""), !!/youtu(\.)?be(.+)?\/(.+)/.test(v) && "youtube";
    },
    getValues: function(src) {
        var id, self = this, data = {}, args = {}, type = this.getType(), query = {}, u = this.parseURL(src), u = (u.query && (query = Wf.String.query(u.query)), 
        $.extend(args, query), src = src.replace(/^(http:)?\/\//, "https://"), $(":input", "#youtube_options").not("#youtube_embed, #youtube_https, #youtube_privacy").each(function() {
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
        return url = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(url), 
        $.each([ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ], function(i, v) {
            i = url[i];
            i && (o[v] = i);
        }), o;
    },
    setValues: function(data) {
        var u, s, self = this, id = "", src = data.src || data.data || "", query = {};
        return src && ((u = this.parseURL(src)).query && (query = Wf.String.query(u.query)), 
        -1 !== (src = "https://" + u.host + u.path).indexOf("youtube-nocookie") && (data.youtube_privacy = 1), 
        query.v ? (id = query.v, delete query.v) : (s = /\/?(embed|live|v)?\/([\w-]+)\b/.exec(u.path)) && "array" === $.type(s) && (id = s.pop()), 
        $.each(query, function(key, val) {
            try {
                val = decodeURIComponent(val);
            } catch (e) {}
            return "autoplay" == key && (val = parseInt(val, 10)), "mute" == key && (val = parseInt(val, 10)), 
            "playlist" == key && val == id || "wmode" == key || self.props[key] === val || (data["youtube_" + key] = val, 
            void delete data[key]);
        }), src = src.replace(/youtu(\.)?be([^\/]+)?\/(.+)/, function(a, b, c, d) {
            var args = "youtube";
            return b && (args += ".com"), c && (args += c), args = args + "/embed" + ("/" + id), 
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