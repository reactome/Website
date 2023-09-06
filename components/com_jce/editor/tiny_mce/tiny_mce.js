/**
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
**/
!function() {
    "use strict";
    !function(win) {
        var whiteSpaceRe = /^\s*|\s*$/g, slice = [].slice, tinymce = {
            majorVersion: "@@tinymce_major_version@@",
            minorVersion: "@@tinymce_minor_version@@",
            releaseDate: "@@tinymce_release_date@@",
            _init: function() {
                var i, nl, base, p, v, self = this, doc = document, na = navigator, ua = na.userAgent, isIE = (self.isOpera = win.opera && win.opera.buildNumber || !1, 
                self.isWebKit = /WebKit/.test(ua), !self.isWebKit && !self.isOpera && /MSIE/gi.test(ua) && /Explorer/gi.test(na.appName) && /MSIE (\w+)\./.exec(ua)[1]);
                for (self.isIE11 = -1 != ua.indexOf("Trident/") && (-1 != ua.indexOf("rv:") || -1 != na.appName.indexOf("Netscape")) && 11, 
                self.isIE = isIE || self.isIE11, self.isIE12 = -1 != ua.indexOf("Edge/") && !self.isIE && 12, 
                self.isIE12 && (self.isWebKit = !1), self.isGecko = !self.isWebKit && !self.isIE11 && /Gecko/.test(ua), 
                self.isMac = -1 != ua.indexOf("Mac"), self.isAir = /adobeair/i.test(ua), 
                self.isIDevice = /(iPad|iPhone)/.test(ua), self.isIOS = self.isIDevice, 
                self.isIOS5 = self.isIDevice && 534 <= ua.match(/AppleWebKit\/(\d*)/)[1], 
                self.suffix = "", nl = doc.getElementsByTagName("base"), i = 0; i < nl.length; i++) (v = nl[i].href) && (/^https?:\/\/[^\/]+$/.test(v) && (v += "/"), 
                base = v ? v.match(/.*\//)[0] : "");
                function getBase(n) {
                    return n.src && /tiny_mce(|_gzip|_jquery|_prototype|_full)(_dev|_src)?.js/.test(n.src) && (/_(src|dev)\.js/g.test(n.src) && (self.suffix = "_src"), 
                    -1 != (p = n.src.indexOf("?")) && (self.query = n.src.substring(p + 1)), 
                    self.baseURL = n.src.substring(0, n.src.lastIndexOf("/")), base && -1 == self.baseURL.indexOf("://") && 0 !== self.baseURL.indexOf("/") && (self.baseURL = base + self.baseURL), 
                    self.baseURL);
                }
                for (nl = doc.getElementsByTagName("script"), i = 0; i < nl.length; i++) if (getBase(nl[i])) return;
                if (na = doc.getElementsByTagName("head")[0]) for (nl = na.getElementsByTagName("script"), 
                i = 0; i < nl.length; i++) if (getBase(nl[i])) return;
            },
            is: function(o, t) {
                return t ? !("array" != t || !tinymce.isArray(o)) || typeof o == t : void 0 !== o;
            },
            isArray: Array.isArray || function(obj) {
                return "[object Array]" === Object.prototype.toString.call(obj);
            },
            makeMap: function(items, delim, map) {
                var i;
                for (delim = delim || ",", map = map || {}, i = (items = "string" == typeof (items = items || []) ? items.split(delim) : items).length; i--; ) map[items[i]] = {};
                return map;
            },
            each: function(o, cb, s) {
                var n, l;
                if (!o) return 0;
                if (s = s || o, void 0 !== o.length) {
                    for (n = 0, l = o.length; n < l; n++) if (!1 === cb.call(s, o[n], n, o)) return 0;
                } else for (n in o) if (o.hasOwnProperty(n) && !1 === cb.call(s, o[n], n, o)) return 0;
                return 1;
            },
            map: function(a, f) {
                var o = [];
                return tinymce.each(a, function(v) {
                    o.push(f(v));
                }), o;
            },
            grep: function(a, f) {
                var o = [];
                return tinymce.each(a, function(v) {
                    f && !f(v) || o.push(v);
                }), o;
            },
            inArray: function(a, v) {
                var i, l;
                if (a) for (i = 0, l = a.length; i < l; i++) if (a[i] === v) return i;
                return -1;
            },
            toArray: function(obj) {
                var i, l, array = obj;
                if (!tinymce.isArray(obj)) for (array = [], i = 0, l = obj.length; i < l; i++) array[i] = obj[i];
                return array;
            },
            extend: function(obj, ext) {
                for (var name, value, args = arguments, i = 1, l = args.length; i < l; i++) for (name in ext = args[i]) ext.hasOwnProperty(name) && void 0 !== (value = ext[name]) && (obj[name] = value);
                return obj;
            },
            trim: function(s) {
                return (s ? "" + s : "").replace(whiteSpaceRe, "");
            },
            create: function(s, p, root) {
                var sp, ns, cn, scn, c, de = 0;
                s = /^((static) )?([\w.]+)(:([\w.]+))?/.exec(s), cn = s[3].match(/(^|\.)(\w+)$/i)[2], 
                (ns = this.createNS(s[3].replace(/\.\w+$/, ""), root))[cn] || ("static" == s[2] ? (ns[cn] = p, 
                this.onCreate && this.onCreate(s[2], s[3], ns[cn])) : (p[cn] || (p[cn] = function() {}, 
                de = 1), ns[cn] = p[cn], this.extend(ns[cn].prototype, p), s[5] && (sp = this.resolve(s[5]).prototype, 
                scn = s[5].match(/\.(\w+)$/i)[1], c = ns[cn], ns[cn] = de ? function() {
                    return sp[scn].apply(this, arguments);
                } : function() {
                    return this._super = sp[scn], c.apply(this, arguments);
                }, ns[cn].prototype[cn] = ns[cn], this.each(sp, function(f, n) {
                    ns[cn].prototype[n] = sp[n];
                }), this.each(p, function(f, n) {
                    sp[n] ? ns[cn].prototype[n] = function() {
                        return this._super = sp[n], f.apply(this, arguments);
                    } : n != cn && (ns[cn].prototype[n] = f);
                })), this.each(p.static, function(f, n) {
                    ns[cn][n] = f;
                })));
            },
            walk: function(o, f, n, s) {
                s = s || this, o && (n && (o = o[n]), tinymce.each(o, function(o, i) {
                    if (!1 === f.call(s, o, i, n)) return !1;
                    tinymce.walk(o, f, n, s);
                }));
            },
            createNS: function(n, o) {
                var i, v;
                for (o = o || win, n = n.split("."), i = 0; i < n.length; i++) o[v = n[i]] || (o[v] = {}), 
                o = o[v];
                return o;
            },
            resolve: function(n, o) {
                var i, l;
                for (o = o || win, i = 0, l = (n = n.split(".")).length; i < l && (o = o[n[i]]); i++);
                return o;
            },
            addUnload: function(f, s) {
                var unload;
                function fakeUnload() {
                    var doc = document;
                    function stop() {
                        doc.detachEvent("onstop", stop), unload && unload(), doc = 0;
                    }
                    "interactive" == doc.readyState && (doc && doc.attachEvent("onstop", stop), 
                    win.setTimeout(function() {
                        doc && doc.detachEvent("onstop", stop);
                    }, 0));
                }
                return unload = function() {
                    var o, n, li = self.unloads;
                    if (li) {
                        for (n in li) (o = li[n]) && o.func && o.func.call(o.scope, 1);
                        win.detachEvent ? (win.detachEvent("onbeforeunload", fakeUnload), 
                        win.detachEvent("onunload", unload)) : win.removeEventListener && win.removeEventListener("unload", unload, !1), 
                        self.unloads = o = li = unload = 0, win.CollectGarbage && CollectGarbage();
                    }
                }, f = {
                    func: f,
                    scope: s || this
                }, self.unloads ? self.unloads.push(f) : (win.attachEvent ? (win.attachEvent("onunload", unload), 
                win.attachEvent("onbeforeunload", fakeUnload)) : win.addEventListener && win.addEventListener("unload", unload, !1), 
                self.unloads = [ f ]), f;
            },
            removeUnload: function(f) {
                var u = this.unloads, r = null;
                return tinymce.each(u, function(o, i) {
                    if (o && o.func == f) return u.splice(i, 1), r = f, !1;
                }), r;
            },
            explode: function(s, d) {
                return !s || tinymce.is(s, "array") ? s : tinymce.map(s.split(d || ","), tinymce.trim);
            },
            curry: function(fn) {
                var args = slice.call(arguments);
                return args.length - 1 >= fn.length ? fn.apply(this, args.slice(1)) : function() {
                    var tempArgs = args.concat([].slice.call(arguments));
                    return tinymce.curry.apply(this, tempArgs);
                };
            },
            _addVer: function(u) {
                var v;
                return this.query ? (v = (-1 == u.indexOf("?") ? "?" : "&") + this.query, 
                -1 == u.indexOf("#") ? u + v : u.replace("#", v + "#")) : u;
            }
        };
        tinymce._init(), (win.tinymce = win.tinyMCE = tinymce).dom = {}, tinymce.geom = {}, 
        tinymce.text = {}, tinymce.caret = {}, tinymce.html = {}, tinymce.ui = {}, 
        tinymce.util = {}, tinymce.file = {};
    }(window);
    var mouseEventRe, deprecated, count = 0, Arr = (tinymce.util.Uuid = {
        uuid: function(prefix) {
            return prefix + count++ + ("s" + new Date().getTime().toString(36) + rnd() + rnd() + rnd());
            function rnd() {
                return Math.round(4294967295 * Math.random()).toString(36);
            }
        }
    }, function(tinymce) {
        var requestAnimationFramePromise;
        function wrappedSetTimeout(callback, time) {
            return "number" != typeof time && (time = 0), setTimeout(callback, time);
        }
        function wrappedSetInterval(callback, time) {
            return "number" != typeof time && (time = 1), setInterval(callback, time);
        }
        function debounce(callback, time) {
            function func() {
                var args = arguments;
                clearTimeout(timer), timer = wrappedSetTimeout(function() {
                    callback.apply(this, args);
                }, time);
            }
            var timer;
            return func.stop = function() {
                clearTimeout(timer);
            }, func;
        }
        tinymce.util.Delay = {
            requestAnimationFrame: function(callback, element) {
                requestAnimationFramePromise ? requestAnimationFramePromise.then(callback) : requestAnimationFramePromise = new Promise(function(resolve) {
                    !function(callback, element) {
                        for (var requestAnimationFrameFunc = window.requestAnimationFrame, vendors = [ "ms", "moz", "webkit" ], i = 0; i < vendors.length && !requestAnimationFrameFunc; i++) requestAnimationFrameFunc = window[vendors[i] + "RequestAnimationFrame"];
                        (requestAnimationFrameFunc = requestAnimationFrameFunc || function(callback) {
                            window.setTimeout(callback, 0);
                        })(callback, element);
                    }(resolve, element = element || document.body);
                }).then(callback);
            },
            setTimeout: wrappedSetTimeout,
            setInterval: wrappedSetInterval,
            setEditorTimeout: function(editor, callback, time) {
                return wrappedSetTimeout(function() {
                    editor.removed || callback();
                }, time);
            },
            setEditorInterval: function(editor, callback, time) {
                var timer = wrappedSetInterval(function() {
                    editor.removed ? clearInterval(timer) : callback();
                }, time);
                return timer;
            },
            debounce: debounce,
            throttle: debounce,
            clearInterval: function(id) {
                return clearInterval(id);
            },
            clearTimeout: function(id) {
                return clearTimeout(id);
            }
        };
    }(tinymce), tinymce.create("tinymce.util.Dispatcher", {
        scope: null,
        listeners: null,
        inDispatch: !1,
        Dispatcher: function(scope) {
            this.scope = scope || this, this.listeners = [];
        },
        add: function(callback, scope) {
            return this.listeners.push({
                cb: callback,
                scope: scope || this.scope
            }), callback;
        },
        addToTop: function(callback, scope) {
            return scope = {
                cb: callback,
                scope: scope || this.scope
            }, this.inDispatch ? this.listeners = [ scope ].concat(this.listeners) : this.listeners.unshift(scope), 
            callback;
        },
        remove: function(callback) {
            var listeners = this.listeners, output = null;
            return tinymce.each(listeners, function(listener, i) {
                if (callback == listener.cb) return output = listener, listeners.splice(i, 1), 
                !1;
            }), output;
        },
        dispatch: function() {
            var returnValue, i, listener, args = arguments, listeners = this.listeners;
            for (this.inDispatch = !0, i = 0; i < listeners.length && !1 !== (returnValue = (listener = listeners[i]).cb.apply(listener.scope, 0 < args.length ? args : [ listener.scope ])); i++);
            return this.inDispatch = !1, returnValue;
        }
    }), function(tinymce) {
        var each = tinymce.each, trim = tinymce.trim, queryParts = "source protocol authority userInfo user password host port relative path directory file query anchor".split(" "), DEFAULT_PORTS = {
            ftp: 21,
            http: 80,
            https: 443,
            mailto: 25
        };
        tinymce.create("tinymce.util.URI", {
            URI: function(url, settings) {
                var baseUri, base_url, isProtocolRelative, self = this;
                url = trim(url), baseUri = (settings = self.settings = settings || {}).base_uri, 
                /^([\w\-]+):([^\/]{2})/i.test(url) || /^\s*#/.test(url) ? self.source = url : (isProtocolRelative = 0 === url.indexOf("//"), 
                0 !== url.indexOf("/") || isProtocolRelative || (url = (baseUri && baseUri.protocol || "http") + "://mce_host" + url), 
                /^[\w\-]*:?\/\//.test(url) || (base_url = settings.base_uri ? settings.base_uri.path : new tinymce.util.URI(location.href).directory, 
                url = "" === settings.base_uri.protocol ? "//mce_host" + self.toAbsPath(base_url, url) : (url = /([^#?]*)([#?]?.*)/.exec(url), 
                (baseUri && baseUri.protocol || "http") + "://mce_host" + self.toAbsPath(base_url, url[1]) + url[2])), 
                url = url.replace(/@@/g, "(mce_at)"), url = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(url), 
                each(queryParts, function(v, i) {
                    i = (i = url[i]) && i.replace(/\(mce_at\)/g, "@@"), self[v] = i;
                }), baseUri && (self.protocol || (self.protocol = baseUri.protocol), 
                self.userInfo || (self.userInfo = baseUri.userInfo), self.port || "mce_host" !== self.host || (self.port = baseUri.port), 
                self.host && "mce_host" !== self.host || (self.host = baseUri.host), 
                self.source = ""), isProtocolRelative && (self.protocol = ""));
            },
            setPath: function(path) {
                path = /^(.*?)\/?(\w+)?$/.exec(path), this.path = path[0], this.directory = path[1], 
                this.file = path[2], this.source = "", this.getURI();
            },
            toRelative: function(uri) {
                var tu, uu;
                return "./" === uri ? uri : "mce_host" != (uri = new tinymce.util.URI(uri, {
                    base_uri: this
                })).host && this.host != uri.host && uri.host || this.port != uri.port || this.protocol != uri.protocol && "" !== uri.protocol ? uri.getURI() : (tu = this.getURI()) == (uu = uri.getURI()) || "/" == tu.charAt(tu.length - 1) && tu.substr(0, tu.length - 1) == uu ? tu : (uu = this.toRelPath(this.path, uri.path), 
                uri.query && (uu += "?" + uri.query), uri.anchor && (uu += "#" + uri.anchor), 
                uu);
            },
            toAbsolute: function(uri, noHost) {
                return (uri = new tinymce.util.URI(uri, {
                    base_uri: this
                })).getURI(noHost && this.isSameOrigin(uri));
            },
            isSameOrigin: function(uri) {
                if (this.host == uri.host && this.protocol == uri.protocol) {
                    if (this.port == uri.port) return !0;
                    var defaultPort = DEFAULT_PORTS[this.protocol];
                    if (defaultPort && (this.port || defaultPort) == (uri.port || defaultPort)) return !0;
                }
                return !1;
            },
            toRelPath: function(base, path) {
                var items, i, l, breakPoint = 0, out = "";
                if (base = (base = base.substring(0, base.lastIndexOf("/"))).split("/"), 
                items = path.split("/"), base.length >= items.length) for (i = 0, 
                l = base.length; i < l; i++) if (i >= items.length || base[i] != items[i]) {
                    breakPoint = i + 1;
                    break;
                }
                if (base.length < items.length) for (i = 0, l = items.length; i < l; i++) if (i >= base.length || base[i] != items[i]) {
                    breakPoint = i + 1;
                    break;
                }
                if (1 === breakPoint) return path;
                for (i = 0, l = base.length - (breakPoint - 1); i < l; i++) out += "../";
                for (i = breakPoint - 1, l = items.length; i < l; i++) out += i != breakPoint - 1 ? "/" + items[i] : items[i];
                return out;
            },
            toAbsPath: function(base, path) {
                var i, nb = 0, o = [], tr = /\/$/.test(path) ? "/" : "";
                for (base = base.split("/"), path = path.split("/"), each(base, function(k) {
                    k && o.push(k);
                }), base = o, i = path.length - 1, o = []; 0 <= i; i--) 0 !== path[i].length && "." !== path[i] && (".." === path[i] ? nb++ : 0 < nb ? nb-- : o.push(path[i]));
                return 0 !== (base = (i = base.length - nb) <= 0 ? o.reverse().join("/") : base.slice(0, i).join("/") + "/" + o.reverse().join("/")).indexOf("/") && (base = "/" + base), 
                tr && base.lastIndexOf("/") !== base.length - 1 && (base += tr), 
                base;
            },
            getURI: function(noProtoHost) {
                var s;
                return this.source && !noProtoHost || (s = "", noProtoHost || (this.protocol ? s += this.protocol + "://" : s += "//", 
                this.userInfo && (s += this.userInfo + "@"), this.host && (s += this.host), 
                this.port && (s += ":" + this.port)), this.path && (s += this.path), 
                this.query && (s += "?" + this.query), this.anchor && (s += "#" + this.anchor), 
                this.source = s), this.source;
            }
        }), tinymce.util.URI.parseDataUri = function(uri) {
            var type, matches;
            return uri = decodeURIComponent(uri).split(","), {
                type: type = (matches = /data:([^;]+)/.exec(uri[0])) ? matches[1] : type,
                data: uri[1]
            };
        }, tinymce.util.URI.getDocumentBaseUrl = function(loc) {
            return loc = 0 !== loc.protocol.indexOf("http") && "file:" !== loc.protocol ? loc.href : loc.protocol + "//" + loc.host + loc.pathname, 
            /^[^:]+:\/\/\/?[^\/]+\//.test(loc) && (loc = loc.replace(/[\?#].*$/, "").replace(/[\/\\][^\/]+$/, ""), 
            /[\/\\]$/.test(loc) || (loc += "/")), loc;
        };
    }(tinymce), function(tinymce) {
        tinymce.create("static tinymce.util.Storage", {
            getHash: function(n) {
                var h;
                if (n = this.get(n)) try {
                    h = JSON.parse(n);
                } catch (e) {}
                return h;
            },
            setHash: function(n, v) {
                this.set(n, JSON.stringify(v));
            },
            get: function(n, s) {
                return window.sessionStorage ? (n = sessionStorage.getItem(n), tinymce.is(n) && null != n ? "true" === n || "false" !== n && ("null" === n ? null : n) : s) : null;
            },
            set: function(n, v) {
                window.sessionStorage && sessionStorage.setItem(n, v);
            }
        }), tinymce.create("static tinymce.util.Cookie", {
            getHash: function(n) {
                return tinymce.util.Storage.getHash(n);
            },
            setHash: function(n, v) {
                return tinymce.util.Storage.setHash(n, v);
            },
            get: function(n, s) {
                return tinymce.util.Storage.get(n, s);
            },
            set: function(n, v) {
                return tinymce.util.Storage.set(n, v);
            }
        });
    }(tinymce), function(tinymce) {
        tinymce.util.JSON = {
            serialize: function(obj) {
                try {
                    return JSON.stringify(obj);
                } catch (ex) {}
            },
            parse: function(str) {
                try {
                    return JSON.parse(str);
                } catch (ex) {}
            }
        };
    }(tinymce), tinymce.create("static tinymce.util.JSONP", {
        callbacks: {},
        count: 0,
        send: function(o) {
            var self = this, dom = tinymce.DOM, count = (void 0 !== o.count ? o : this).count, id = "tinymce_jsonp_" + count;
            this.callbacks[count] = function(json) {
                dom.remove(id), delete self.callbacks[count], o.callback(json);
            }, dom.add(dom.doc.body, "script", {
                id: id,
                src: o.url,
                type: "text/javascript"
            }), this.count++;
        }
    }), tinymce.create("static tinymce.util.XHR", {
        send: function(o) {
            var xhr, c = 0;
            function ready() {
                !o.async || 4 == xhr.readyState || 1e4 < c++ ? (o.success && c < 1e4 && 200 == xhr.status ? o.success.call(o.success_scope, "" + xhr.responseText, xhr, o) : o.error && o.error.call(o.error_scope, 1e4 < c ? "TIMED_OUT" : "GENERAL", xhr, o), 
                xhr = null) : window.setTimeout(ready, 10);
            }
            if (o.scope = o.scope || this, o.success_scope = o.success_scope || o.scope, 
            o.error_scope = o.error_scope || o.scope, o.async = !1 !== o.async, 
            o.data = o.data || "", xhr = new XMLHttpRequest()) {
                if (xhr.overrideMimeType && xhr.overrideMimeType(o.content_type), 
                xhr.open(o.type || (o.data ? "POST" : "GET"), o.url, o.async), o.content_type && xhr.setRequestHeader("Content-Type", o.content_type), 
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"), xhr.send(o.data), 
                !o.async) return ready();
                window.setTimeout(ready, 10);
            }
        }
    }), function(tinymce) {
        var extend = tinymce.extend, JSON = tinymce.util.JSON, XHR = tinymce.util.XHR;
        tinymce.create("tinymce.util.JSONRequest", {
            JSONRequest: function(s) {
                this.settings = extend({}, s), this.count = 0;
            },
            send: function(o) {
                var ecb = o.error, scb = o.success;
                (o = extend(this.settings, o)).success = function(c, x) {
                    (c = void 0 === (c = JSON.parse(c)) ? {
                        error: "JSON Parse error."
                    } : c).error ? ecb.call(o.error_scope || o.scope, c.error, x) : scb.call(o.success_scope || o.scope, c.result);
                }, o.error = function(ty, x) {
                    ecb && ecb.call(o.error_scope || o.scope, ty, x);
                }, o.data = JSON.serialize({
                    id: o.id || "c" + this.count++,
                    method: o.method,
                    params: o.params
                }), o.content_type = "application/json", XHR.send(o);
            },
            static: {
                sendRPC: function(o) {
                    return new tinymce.util.JSONRequest().send(o);
                }
            }
        });
    }(tinymce), function(tinymce) {
        tinymce.VK = {
            BACKSPACE: 8,
            DELETE: 46,
            DOWN: 40,
            ENTER: 13,
            LEFT: 37,
            RIGHT: 39,
            SPACEBAR: 32,
            TAB: 9,
            UP: 38,
            modifierPressed: function(e) {
                return e.shiftKey || e.ctrlKey || e.altKey || this.metaKeyPressed(e);
            },
            metaKeyPressed: function(e) {
                return tinymce.isMac ? e.metaKey : e.ctrlKey && !e.altKey;
            }
        };
    }(tinymce), tinymce.util.Quirks = function(editor) {
        var marker, VK = tinymce.VK, BACKSPACE = VK.BACKSPACE, DELETE = VK.DELETE, dom = editor.dom, selection = editor.selection, settings = editor.settings, parser = editor.parser, each = tinymce.each, RangeUtils = tinymce.dom.RangeUtils, TreeWalker = tinymce.dom.TreeWalker, mceInternalDataType = tinymce.isIE ? "Text" : "URL";
        function setEditorCommandState(cmd, state) {
            try {
                editor.getDoc().execCommand(cmd, !1, state);
            } catch (ex) {}
        }
        function isDefaultPrevented(e) {
            return e.isDefaultPrevented();
        }
        function selectAll() {
            editor.onKeyDown.add(function(editor, e) {
                !isDefaultPrevented(e) && 65 == e.keyCode && VK.metaKeyPressed(e) && (e.preventDefault(), 
                editor.execCommand("SelectAll"));
            });
        }
        function disableBackspaceIntoATable() {
            editor.onKeyDown.add(function(editor, e) {
                if (!isDefaultPrevented(e) && e.keyCode === BACKSPACE && selection.isCollapsed() && 0 === selection.getRng(!0).startOffset) {
                    var previousSibling = selection.getNode().previousSibling;
                    if (previousSibling && previousSibling.nodeName && "table" === previousSibling.nodeName.toLowerCase()) return e.preventDefault(), 
                    !1;
                }
            });
        }
        function bodyHeight() {
            editor.inline || (editor.contentStyles.push("body {min-height: 150px}"), 
            editor.onClick.add(function(editor, e) {
                "HTML" == e.target.nodeName && (tinymce.isIE12 ? editor.getBody().focus() : (e = editor.selection.getRng(), 
                editor.getBody().focus(), editor.selection.setRng(e), editor.selection.normalize(), 
                editor.nodeChanged()));
            }));
        }
        function selectControlElements() {
            editor.onClick.add(function(editor, e) {
                var target = e.target;
                function selectElm(e) {
                    e.preventDefault(), selection.select(target), editor.nodeChanged();
                }
                /^(IMG|HR)$/.test(target.nodeName) && selectElm(e), "A" == target.nodeName && dom.hasClass(target, "mce-item-anchor") && selectElm(e);
            });
        }
        function normalize(e) {
            65 == e.keyCode && VK.metaKeyPressed(e) || selection.normalize();
        }
        function serializeRng(rng) {
            var body = dom.create("body"), rng = rng.cloneContents();
            return body.appendChild(rng), selection.serializer.serialize(body, {
                format: "html"
            });
        }
        function allContentsSelected(rng) {
            var selection, allRng;
            return rng.setStart ? (selection = serializeRng(rng), (allRng = dom.createRng()).selectNode(editor.getBody()), 
            selection === serializeRng(allRng)) : !rng.item && ((selection = rng.duplicate()).moveToElementText(editor.getBody()), 
            RangeUtils.compareRanges(rng, selection));
        }
        function isBr(node) {
            return node && 1 == node.nodeType && "BR" == node.nodeName;
        }
        function isLastChild(node) {
            var parent = node.parentNode;
            return parent == editor.dom.getRoot() || node == parent.lastChild || node.nextSibling && isBr(node.nextSibling) && node.nextSibling == parent.lastChild;
        }
        function moveCursorToEnd(e) {
            var rng = selection.getRng(), container = rng.startContainer, node = container.parentNode;
            function moveToMarker() {
                (rng = dom.createRng()).setStart(marker, 0), rng.setEnd(marker, 0), 
                rng.collapse(), selection.setRng(rng);
            }
            node && node != editor.dom.getRoot() && (node = dom.getParent(node, "a")) && (isLastChild(node) || function(node) {
                return isBr(node) || node && 3 == node.nodeType && /^[ \t\r\n]*$/.test(node.nodeValue);
            }(node.nextSibling)) && 3 == container.nodeType && function(container, node) {
                return node.lastChild && 1 == node.lastChild.nodeType && (node = node.lastChild), 
                dom.isChildOf(container, node);
            }(container, node) && (container = container.data) && container.length && rng.startOffset == container.length && (marker = dom.create("span", {
                "data-mce-type": "caret"
            }, "\ufeff"), dom.isBlock(node.parentNode) && isLastChild(node) ? (node.parentNode.appendChild(marker), 
            moveToMarker(), dom.remove(marker)) : ((node = isBr(node.nextSibling) && node.nextSibling == node.parentNode.lastChild ? node.nextSibling : node).insertAdjacentElement("afterend", marker), 
            moveToMarker()), e.preventDefault(), editor.nodeChanged());
        }
        function removeRuntimeStyle(node) {
            var style = node.attr("style");
            style && "color:inherit;font-family:inherit;font-size:1rem;" === (style = style.replace(/\s/g, "")) && node.unwrap();
        }
        function fixLinks() {
            each(dom.select("a"), function(node) {
                var parentNode = node.parentNode, root = dom.getRoot();
                if (parentNode.lastChild === node) {
                    for (;parentNode && !dom.isBlock(parentNode); ) {
                        if (parentNode.parentNode.lastChild !== parentNode || parentNode === root) return;
                        parentNode = parentNode.parentNode;
                    }
                    dom.add(parentNode, "br", {
                        "data-mce-bogus": 1
                    });
                }
            });
        }
        function setOpts() {
            setEditorCommandState("StyleWithCSS", !1), setEditorCommandState("enableInlineTableEditing", !1), 
            settings.object_resizing || setEditorCommandState("enableObjectResizing", !1);
        }
        function getAttributeApplyFunction() {
            var template = dom.getAttribs(selection.getStart().cloneNode(!1));
            return function() {
                var target = selection.getStart();
                target !== dom.getRoot() && (dom.setAttrib(target, "style", null), 
                each(template, function(attr) {
                    target.setAttributeNode(attr.cloneNode(!0));
                }));
            };
        }
        function isSelectionAcrossElements() {
            return !selection.isCollapsed() && dom.getParent(selection.getStart(), dom.isBlock) != dom.getParent(selection.getEnd(), dom.isBlock);
        }
        editor.onKeyUp.add(normalize), editor.onMouseUp.add(normalize), editor.onKeyDown.add(function(editor, e) {
            var container, offset, root, parent;
            if (!isDefaultPrevented(e) && e.keyCode == VK.BACKSPACE && (container = (e = selection.getRng()).startContainer, 
            offset = e.startOffset, root = dom.getRoot(), parent = container, e.collapsed) && 0 === offset) {
                for (;parent && parent.parentNode && parent.parentNode.firstChild == parent && parent.parentNode != root; ) parent = parent.parentNode;
                "BLOCKQUOTE" === parent.tagName && (editor.formatter.toggle("blockquote", null, parent), 
                (e = dom.createRng()).setStart(container, 0), e.setEnd(container, 0), 
                selection.setRng(e));
            }
        }), editor.onKeyDown.add(function(editor, e) {
            var root, keyCode = e.keyCode;
            isDefaultPrevented(e) || keyCode != DELETE && keyCode != BACKSPACE || (keyCode = editor.selection.isCollapsed(), 
            root = dom.getRoot(), keyCode && !dom.isEmpty(root)) || (keyCode || allContentsSelected(editor.selection.getRng())) && (e.preventDefault(), 
            editor.setContent(""), root.firstChild && dom.isBlock(root.firstChild) ? editor.selection.setCursorLocation(root.firstChild, 0) : editor.selection.setCursorLocation(root, 0), 
            editor.nodeChanged());
        }), editor.onKeyDown.addToTop(function(editor, e) {
            dom.remove(marker), e.keyCode == VK.RIGHT && moveCursorToEnd(e);
        }), editor.onMouseDown.add(function(editor, e) {
            dom.remove(marker), moveCursorToEnd(e);
        }), tinymce.isWebKit && (function() {
            var dom = editor.dom, selection = editor.selection, MutationObserver = window.MutationObserver;
            function isSiblingsIgnoreWhiteSpace(node1, node2) {
                for (var node = node1.nextSibling; node && node != node2; node = node.nextSibling) if ((3 != node.nodeType || 0 !== tinymce.trim(node.data).length) && node !== node2) return;
                return node === node2;
            }
            function findCaretNode(node, forward, startNode) {
                var walker, current, nonEmptyElements, rootNode = dom.getRoot();
                if (dom.isChildOf(node, rootNode)) for (nonEmptyElements = dom.schema.getNonEmptyElements(), 
                walker = new TreeWalker(startNode || node, node); current = walker[forward ? "next" : "prev"](); ) {
                    if (nonEmptyElements[current.nodeName] && !function(node) {
                        var blockElements = dom.schema.getBlockElements(), rootNode = dom.getRoot();
                        if ("BR" == node.nodeName) {
                            for (;node != rootNode && !blockElements[node.nodeName]; node = node.parentNode) if (node.nextSibling) return;
                            return 1;
                        }
                    }(current)) return current;
                    if (3 == current.nodeType && 0 < current.data.length) return current;
                }
            }
            function handleLastBlockCharacterDelete(isForward, rng) {
                var blockElm, newBlockElm, clonedBlockElm, sibling, container, offset, br, currentFormatNodes;
                function cloneTextBlockWithFormats(blockElm, node) {
                    return currentFormatNodes = dom.getParents(node, function(n) {
                        return !!editor.schema.getTextInlineElements()[n.nodeName];
                    }), newBlockElm = blockElm.cloneNode(!1), (currentFormatNodes = tinymce.map(currentFormatNodes, function(formatNode) {
                        return formatNode = formatNode.cloneNode(!1), newBlockElm.hasChildNodes() && formatNode.appendChild(newBlockElm.firstChild), 
                        newBlockElm.appendChild(formatNode), newBlockElm.appendChild(formatNode), 
                        formatNode;
                    })).length ? (br = dom.create("br"), currentFormatNodes[0].appendChild(br), 
                    dom.replace(newBlockElm, blockElm), rng.setStartBefore(br), 
                    rng.setEndBefore(br), editor.selection.setRng(rng), br) : null;
                }
                function isTextBlock(node) {
                    return node && editor.schema.getTextBlockElements()[node.tagName];
                }
                if (rng.collapsed && (container = rng.startContainer, offset = rng.startOffset, 
                isTextBlock(blockElm = dom.getParent(container, dom.isBlock)))) {
                    if (1 == container.nodeType) return (!(container = container.childNodes[offset]) || "BR" == container.tagName) && (sibling = isForward ? blockElm.nextSibling : blockElm.previousSibling, 
                    dom.isEmpty(blockElm)) && isTextBlock(sibling) && dom.isEmpty(sibling) && cloneTextBlockWithFormats(blockElm, container) && (dom.remove(sibling), 
                    1);
                    if (3 == container.nodeType) {
                        if (sibling = function(rootNode, targetNode) {
                            for (var path = []; targetNode && targetNode != rootNode; targetNode = targetNode.parentNode) path.push(tinymce.DOM.nodeIndex(targetNode, void 0));
                            return path;
                        }(blockElm, container), container = function(path) {
                            for (var children, node = clonedBlockElm, i = path.length - 1; 0 <= i; i--) {
                                if (children = node.childNodes, path[i] > children.length - 1) return null;
                                node = children[path[i]];
                            }
                            return node;
                        }((clonedBlockElm = blockElm.cloneNode(!0), sibling)), isForward) {
                            if (offset >= container.data.length) return;
                            container.deleteData(offset, 1);
                        } else {
                            if (offset <= 0) return;
                            container.deleteData(offset - 1, 1);
                        }
                        return dom.isEmpty(clonedBlockElm) && cloneTextBlockWithFormats(blockElm, container);
                    }
                }
            }
            function customDelete(isForward) {
                var mutationObserver, rng, caretElement, rootNode = editor.dom.getRoot();
                !function(isForward) {
                    return !(isForward = function(rng, isForward) {
                        var container;
                        if (rng.collapsed) {
                            if (container = rng.startContainer, offset = rng.startOffset, 
                            3 == container.nodeType) if (isForward) {
                                if (offset < container.data.length) return rng;
                            } else if (0 < offset) return rng;
                            var caretNode = RangeUtils.getNode(container, offset), textBlock = dom.getParent(caretNode, dom.isBlock), targetCaretNode = findCaretNode(editor.getBody(), isForward, caretNode), targetTextBlock = dom.getParent(targetCaretNode, dom.isBlock), offset = 1 === container.nodeType && offset > container.childNodes.length - 1;
                            if (caretNode && targetCaretNode && targetTextBlock && textBlock != targetTextBlock) if (isForward) {
                                if (!isSiblingsIgnoreWhiteSpace(textBlock, targetTextBlock)) return rng;
                                1 == caretNode.nodeType ? "BR" == caretNode.nodeName ? rng.setStartBefore(caretNode) : rng.setStartAfter(caretNode) : rng.setStart(caretNode, caretNode.data.length), 
                                1 == targetCaretNode.nodeType ? rng.setEnd(targetCaretNode, 0) : rng.setEndBefore(targetCaretNode);
                            } else {
                                if (!isSiblingsIgnoreWhiteSpace(targetTextBlock, textBlock)) return rng;
                                1 == targetCaretNode.nodeType ? "BR" == targetCaretNode.nodeName ? rng.setStartBefore(targetCaretNode) : rng.setStartAfter(targetCaretNode) : rng.setStart(targetCaretNode, targetCaretNode.data.length), 
                                1 == caretNode.nodeType && offset ? rng.setEndAfter(caretNode) : rng.setEndBefore(caretNode);
                            }
                        }
                        return rng;
                    }(selection.getRng(), isForward)).collapsed && (startBlock = dom.getParent(RangeUtils.getNode(isForward.startContainer, isForward.startOffset), dom.isBlock), 
                    endBlock = dom.getParent(RangeUtils.getNode(isForward.endContainer, isForward.endOffset), dom.isBlock), 
                    textBlockElements = editor.schema.getTextBlockElements(), startBlock != endBlock) && textBlockElements[startBlock.nodeName] && textBlockElements[endBlock.nodeName] && "false" !== dom.getContentEditable(startBlock) && "false" !== dom.getContentEditable(endBlock) && (isForward.deleteContents(), 
                    textBlockElements = findCaretNode(startBlock, !1), caretNodeAfter = findCaretNode(endBlock, !0), 
                    textBlockElements && caretNodeAfter && (dom.isEmpty(endBlock) || (nodes = tinymce.toArray(endBlock.childNodes), 
                    each(nodes, function(node) {
                        node && node.nodeType && startBlock.appendChild(node);
                    })), dom.remove(endBlock)), each([ startBlock, endBlock ], function(node) {
                        dom.isEmpty(node) && dom.remove(node);
                    }), textBlockElements ? 1 == textBlockElements.nodeType ? "BR" == textBlockElements.nodeName ? (isForward.setStartBefore(textBlockElements), 
                    isForward.setEndBefore(textBlockElements)) : (isForward.setStartAfter(textBlockElements), 
                    isForward.setEndAfter(textBlockElements)) : (isForward.setStart(textBlockElements, textBlockElements.data.length), 
                    isForward.setEnd(textBlockElements, textBlockElements.data.length)) : caretNodeAfter && (1 == caretNodeAfter.nodeType ? (isForward.setStartBefore(caretNodeAfter), 
                    isForward.setEndBefore(caretNodeAfter)) : (isForward.setStart(caretNodeAfter, 0), 
                    isForward.setEnd(caretNodeAfter, 0))), selection.setRng(isForward), 
                    1);
                    var caretNodeAfter, nodes, startBlock, endBlock, textBlockElements;
                }(isForward) && (tinymce.each(rootNode.getElementsByTagName("*"), function(elm) {
                    "SPAN" == elm.tagName && elm.setAttribute("data-mce-marked", 1), 
                    !elm.hasAttribute("data-mce-style") && elm.hasAttribute("style") && editor.dom.setAttrib(elm, "style", editor.dom.getAttrib(elm, "style"));
                }), (mutationObserver = new MutationObserver(function() {})).observe(editor.getDoc(), {
                    childList: !0,
                    attributes: !0,
                    subtree: !0,
                    attributeFilter: [ "style" ]
                }), editor.getDoc().execCommand(isForward ? "ForwardDelete" : "Delete", !1, null), 
                rng = editor.selection.getRng(), caretElement = rng.startContainer.parentNode, 
                tinymce.each(mutationObserver.takeRecords(), function(record) {
                    var oldValue;
                    dom.isChildOf(record.target, rootNode) && ("style" == record.attributeName && ((oldValue = record.target.getAttribute("data-mce-style")) ? record.target.setAttribute("style", oldValue) : record.target.removeAttribute("style")), 
                    tinymce.each(record.addedNodes, function(node) {
                        if (1 !== node.nodeType) return !0;
                        var offset, container;
                        node.getAttribute("style") && !node.getAttribute("data-mce-style") && node.removeAttribute("style"), 
                        "SPAN" != node.nodeName || node.getAttribute("data-mce-marked") || (node == caretElement && (offset = rng.startOffset, 
                        container = node.firstChild), dom.remove(node, !0), container && (rng.setStart(container, offset), 
                        rng.setEnd(container, offset), editor.selection.setRng(rng)));
                    }));
                }), mutationObserver.disconnect(), tinymce.each(editor.dom.select("span[data-mce-marked]", editor.dom.getRoot()), function(span) {
                    span.removeAttribute("data-mce-marked");
                }));
            }
            editor.onKeyDown.add(function(editor, e) {
                var rng, container, offset, isForward = e.keyCode == DELETE, isMetaOrCtrl = e.ctrlKey || e.metaKey;
                isDefaultPrevented(e) || !isForward && e.keyCode != BACKSPACE || (container = (rng = editor.selection.getRng()).startContainer, 
                offset = rng.startOffset, isForward && e.shiftKey) || (handleLastBlockCharacterDelete(isForward, rng) ? e.preventDefault() : !isMetaOrCtrl && rng.collapsed && 3 == container.nodeType && (isForward ? offset < container.data.length : 0 < offset) || (e.preventDefault(), 
                isMetaOrCtrl && editor.selection.getSel().modify("extend", isForward ? "forward" : "backward", e.metaKey ? "lineboundary" : "word"), 
                customDelete(isForward)));
            }), editor.addCommand("Delete", function() {
                customDelete();
            }), editor.addCommand("ForwardDelete", function() {
                customDelete(!0);
            });
        }(), editor.settings.content_editable || dom.bind(editor.getDoc(), "mousedown mouseup", function(e) {
            var rng;
            e.target == editor.getDoc().documentElement && (rng = selection.getRng(), 
            editor.getBody().focus(), "mousedown" == e.type ? selection.placeCaretAt(e.clientX, e.clientY) : selection.setRng(rng));
        }), settings.forced_root_block && editor.onInit.add(function() {
            setEditorCommandState("DefaultParagraphSeparator", settings.forced_root_block);
        }), editor.onInit.add(function() {
            editor.dom.bind(editor.getBody(), "submit", function(e) {
                e.preventDefault();
            });
        }), disableBackspaceIntoATable(), parser.addNodeFilter("br", function(nodes) {
            for (var i = nodes.length; i--; ) "Apple-interchange-newline" == nodes[i].attr("class") && nodes[i].remove();
        }), editor.onBeforeExecCommand.add(function(ed, cmd) {
            "mceInsertLink" == cmd && (cmd = ed.selection.getNode()) && "IMG" == cmd.nodeName && (ed.dom.setAttrib(cmd, "data-mce-style", cmd.style.cssText), 
            cmd.style.cssText = null);
        }), editor.onExecCommand.add(function(ed, cmd) {
            "mceInsertLink" == cmd && (cmd = ed.selection.getNode(), tinymce.each(ed.dom.select("img[data-mce-style]", cmd), function(el) {
                "A" != el.parentNode.nodeName || el.style.cssText || (el.style.cssText = ed.dom.getAttrib(el, "data-mce-style"));
            }));
        }), selectControlElements(), editor.parser.addNodeFilter("span", function(nodes) {
            for (var i = nodes.length; i--; ) removeRuntimeStyle(nodes[i]);
        }), editor.serializer.addNodeFilter("span", function(nodes) {
            for (var i = nodes.length; i--; ) removeRuntimeStyle(nodes[i]);
        }), tinymce.isIOS ? (editor.onKeyDown.add(function() {
            document.activeElement == document.body && editor.getWin().focus();
        }), bodyHeight(), editor.onClick.add(function(editor, e) {
            var elm = e.target;
            do {
                if ("A" === elm.tagName) return void e.preventDefault();
            } while (elm = elm.parentNode);
        }), editor.contentStyles.push(".mce-content-body {-webkit-touch-callout: none}")) : selectAll()), 
        tinymce.isIE && (bodyHeight(), selectAll(), setEditorCommandState("AutoUrlDetect", !1), 
        editor.dom.bind("dragstart", function(e) {
            !function(e) {
                var selectionHtml;
                e.dataTransfer && (editor.selection.isCollapsed() && "IMG" == e.target.tagName && selection.select(e.target), 
                0 < (selectionHtml = editor.selection.getContent()).length) && (selectionHtml = "data:text/mce-internal," + escape(editor.id) + "," + escape(selectionHtml), 
                e.dataTransfer.setData(mceInternalDataType, selectionHtml));
            }(e);
        }), editor.dom.bind("dragstart", function(e) {
            var internalContent;
            isDefaultPrevented(e) || (internalContent = function(e) {
                return e.dataTransfer && (e = e.dataTransfer.getData(mceInternalDataType)) && 0 <= e.indexOf("data:text/mce-internal,") ? (e = e.substr("data:text/mce-internal,".length).split(","), 
                {
                    id: unescape(e[0]),
                    html: unescape(e[1])
                }) : null;
            }(e)) && internalContent.id != editor.id && (e.preventDefault(), e = RangeUtils.getCaretRangeFromPoint(e.x, e.y, editor.getDoc()), 
            selection.setRng(e), e = internalContent.html, editor.queryCommandSupported("mceInsertClipboardContent") ? editor.execCommand("mceInsertClipboardContent", !1, {
                content: e
            }) : editor.execCommand("mceInsertContent", !1, e));
        })), 11 <= tinymce.isIE && disableBackspaceIntoATable(), tinymce.isGecko && (editor.onKeyDown.add(function(editor, e) {
            var previousSibling;
            isDefaultPrevented(e) || e.keyCode !== BACKSPACE || editor.getBody().getElementsByTagName("hr").length && selection.isCollapsed() && 0 === selection.getRng(!0).startOffset && (previousSibling = (editor = selection.getNode()).previousSibling, 
            "HR" == editor.nodeName ? (dom.remove(editor), e.preventDefault()) : previousSibling && previousSibling.nodeName && "hr" === previousSibling.nodeName.toLowerCase() && (dom.remove(previousSibling), 
            e.preventDefault()));
        }), editor.onKeyPress.add(function(editor, e) {
            var applyAttributes;
            if (!isDefaultPrevented(e) && (8 == e.keyCode || 46 == e.keyCode) && isSelectionAcrossElements()) return applyAttributes = getAttributeApplyFunction(), 
            editor.getDoc().execCommand("delete", !1, null), applyAttributes(), 
            e.preventDefault(), !1;
        }), dom.bind(editor.getDoc(), "cut", function(e) {
            var applyAttributes;
            !isDefaultPrevented(e) && isSelectionAcrossElements() && (applyAttributes = getAttributeApplyFunction(), 
            setTimeout(function() {
                applyAttributes();
            }, 0));
        }), settings.readonly || (editor.onBeforeExecCommand.add(setOpts), editor.onMouseDown.add(setOpts)), 
        editor.onExecCommand.add(function(editor, cmd) {
            "mceInsertLink" === cmd && fixLinks();
        }), editor.onSetContent.add(selection.onSetContent.add(fixLinks)), editor.contentStyles.push("img:-moz-broken {-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}"), 
        tinymce.isMac && editor.onKeyDown.add(function(editor, e) {
            !VK.metaKeyPressed(e) || e.shiftKey || 37 != e.keyCode && 39 != e.keyCode || (e.preventDefault(), 
            editor.selection.getSel().modify("move", 37 == e.keyCode ? "backward" : "forward", "lineboundary"));
        }), disableBackspaceIntoATable(), selectControlElements());
    }, function(tinymce) {
        var previewElm, each = tinymce.each, extend = tinymce.extend, rgba = {}, luma = {};
        function getLuminance(val) {
            var RsRGB, GsRGB, col;
            return luma[val] || (RsRGB = (col = function(val) {
                var r, b, g, a, values, match;
                return rgba[val] || (g = b = r = 0, -(a = 1) !== val.indexOf("#") ? (3 === (val = val.substr(1)).length && (val += val), 
                r = parseInt(val.substring(0, 2), 16), g = parseInt(val.substring(2, 4), 16), 
                b = parseInt(val.substring(4, 6), 16), 6 < val.length && (a = +((a = parseInt(val.substring(6, 8), 16)) / 255).toFixed(2))) : (val = val.replace(/\s/g, ""), 
                (values = (match = /^(?:rgb|rgba)\(([^\)]*)\)$/.exec(val)) ? match[1].split(",").map(function(x) {
                    return parseFloat(x);
                }) : values) && (r = values[0], g = values[1], b = values[2], 4 === values.length) && (a = values[3] || 1)), 
                rgba[val] = {
                    r: r,
                    g: g,
                    b: b,
                    a: a
                }), rgba[val];
            }(val)).r / 255, GsRGB = col.g / 255, col = col.b / 255, RsRGB = RsRGB <= .03928 ? RsRGB / 12.92 : Math.pow((.055 + RsRGB) / 1.055, 2.4), 
            GsRGB = GsRGB <= .03928 ? GsRGB / 12.92 : Math.pow((.055 + GsRGB) / 1.055, 2.4), 
            col = col <= .03928 ? col / 12.92 : Math.pow((.055 + col) / 1.055, 2.4), 
            luma[val] = .2126 * RsRGB + .7152 * GsRGB + .0722 * col), luma[val];
        }
        function isReadable(color1, color2) {
            return color1 = getLuminance(color1), color2 = getLuminance(color2), 
            2 <= (Math.max(color1, color2) + .05) / (Math.min(color1, color2) + .05);
        }
        function resetElm() {
            previewElm && previewElm.parentNode && (previewElm.parentNode.removeChild(previewElm), 
            previewElm = null);
        }
        tinymce.util.PreviewCss = {
            getCssText: function(ed, fmt, reset) {
                var name, dom = ed.dom, previewCss = {}, previewStyles = (fmt = extend({
                    styles: [],
                    attributes: [],
                    classes: ""
                }, fmt), ed.settings.preview_styles);
                if (!1 === previewStyles) return "";
                function removeVars(val) {
                    return val && "string" == typeof val ? val.replace(/%(\w+)/g, "") : val;
                }
                previewStyles = previewStyles || "font-family font-size font-weight text-decoration text-transform background-color color", 
                name = fmt.block || fmt.inline || "div", previewElm && previewElm.nodeName == name.toUpperCase() || (previewElm = dom.create(name), 
                ed.getBody().appendChild(previewElm)), dom.removeAllAttribs(previewElm), 
                each(fmt.styles, function(value, name) {
                    (value = removeVars(value)) && dom.setStyle(previewElm, name, value);
                }), each(fmt.attributes, function(value, name) {
                    (value = removeVars(value)) && dom.setAttrib(previewElm, name, value);
                }), each(fmt.classes, function(value) {
                    value = removeVars(value), dom.addClass(previewElm, value);
                }), dom.setStyles(previewElm, {
                    position: "absolute",
                    left: -65535
                }), previewElm.setAttribute("data-mce-type", "temp");
                for (var bodybg = dom.getStyle(ed.getBody(), "background-color", !0), elmbg = dom.getStyle(previewElm, "background-color", !0), styles = previewStyles.split(" "), css = "", i = 0, len = styles.length; i < len; i++) {
                    var key = styles[i], value = dom.getStyle(previewElm, key, !0);
                    previewCss[key] || (value = ("color" != key || isReadable(value, elmbg = /transparent|rgba\s*\([^)]+,\s*0\)/.test(elmbg) ? "rgb(255, 255, 255)" : elmbg) ? value : value && isReadable(value, bodybg) ? bodybg : "inherit") || "inherit", 
                    "font-size" == key && 0 === parseInt(value, 10) && (value = "inherit"), 
                    css += key + ":" + (previewCss[key] = value) + ";");
                }
                return reset && resetElm(), css;
            },
            reset: resetElm
        };
    }(tinymce), function(tinymce) {
        var isArray = Array.isArray || function(obj) {
            return "[object Array]" === Object.prototype.toString.call(obj);
        };
        function each(o, cb, s) {
            var n, l;
            if (!o) return 0;
            if (s = s || o, void 0 !== o.length) {
                for (n = 0, l = o.length; n < l; n++) if (!1 === cb.call(s, o[n], n, o)) return 0;
            } else for (n in o) if (o.hasOwnProperty(n) && !1 === cb.call(s, o[n], n, o)) return 0;
            return 1;
        }
        function map(array, callback) {
            var out = [];
            return each(array, function(item, index) {
                out.push(callback(item, index, array));
            }), out;
        }
        function indexOf(a, v) {
            var i, l;
            if (a) for (i = 0, l = a.length; i < l; i++) if (a[i] === v) return i;
            return -1;
        }
        function findIndex(array, predicate, thisArg) {
            for (var i = 0, l = array.length; i < l; i++) if (predicate.call(thisArg, array[i], i, array)) return i;
            return -1;
        }
        function flat(arr) {
            for (var out = [], i = 0, l = arr.length; i < l; i++) isArray(arr[i]) && Array.prototype.push.apply(out, arr[i]);
            return out;
        }
        function flatMap(array, callback) {
            return flat(map(array, callback));
        }
        tinymce.util.Arr = {
            isArray: isArray,
            toArray: function(obj) {
                var i, l, array = obj;
                if (!isArray(obj)) for (array = [], i = 0, l = obj.length; i < l; i++) array[i] = obj[i];
                return array;
            },
            each: each,
            map: map,
            filter: function(a, f) {
                var o = [];
                return each(a, function(v, index) {
                    f && !f(v, index, a) || o.push(v);
                }), o;
            },
            indexOf: indexOf,
            reduce: function(collection, iteratee, accumulator, thisArg) {
                var i = 0;
                for (arguments.length < 3 && (accumulator = collection[0]); i < collection.length; i++) accumulator = iteratee.call(thisArg, accumulator, collection[i], i);
                return accumulator;
            },
            findIndex: findIndex,
            find: function(array, predicate, thisArg) {
                if (-1 !== (predicate = findIndex(array, predicate, thisArg))) return array[predicate];
            },
            last: function(collection) {
                return collection[collection.length - 1];
            },
            toObject: function(array, callback) {
                for (var object = {}, i = 0, l = array.length; i < l; i++) {
                    var x = array[i];
                    object[x] = callback(x, i);
                }
                return object;
            },
            flat: flat,
            flatMap: flatMap,
            bind: flatMap,
            contains: function(a, v) {
                return -1 < indexOf(a, v);
            },
            forall: function(xs, pred) {
                for (var i = 0, len = xs.length; i < len; ++i) if (!0 !== pred(xs[i], i)) return !1;
                return !0;
            }
        };
    }(tinymce), function(tinymce) {
        var slice = [].slice;
        function curry(fn) {
            var args = slice.call(arguments);
            return args.length - 1 >= fn.length ? fn.apply(this, args.slice(1)) : function() {
                var tempArgs = args.concat([].slice.call(arguments));
                return curry.apply(this, tempArgs);
            };
        }
        tinymce.util.Fun = {
            constant: function(value) {
                return function() {
                    return value;
                };
            },
            negate: function(predicate) {
                return function(x) {
                    return !predicate(x);
                };
            },
            and: function() {
                var args = slice.call(arguments);
                return function(x) {
                    for (var i = 0; i < args.length; i++) if (!args[i](x)) return !1;
                    return !0;
                };
            },
            or: function() {
                var args = slice.call(arguments);
                return function(x) {
                    for (var i = 0; i < args.length; i++) if (args[i](x)) return !0;
                    return !1;
                };
            },
            curry: curry,
            compose: function(f, g) {
                return function(x) {
                    return f(g(x));
                };
            },
            noop: function() {}
        };
    }(tinymce), tinymce.util.Arr), Fun = tinymce.util.Fun, Uuid = tinymce.util.Uuid, cache = [], constant = Fun.constant;
    function get(id) {
        return findFirst(function(cachedBlobInfo) {
            return cachedBlobInfo.id() === id;
        });
    }
    function findFirst(predicate) {
        return Arr.filter(cache, predicate)[0];
    }
    function parseDataUri(uri) {
        var type, matches;
        return uri = decodeURIComponent(uri).split(","), {
            type: type = (matches = /data:([^;]+)/.exec(uri[0])) ? matches[1] : type,
            data: uri[1]
        };
    }
    function addEvent(target, name, callback, capture) {
        target.addEventListener(name, callback, capture || !1);
    }
    function removeEvent(target, name, callback, capture) {
        target.removeEventListener(name, callback, capture || !1);
    }
    function fix(originalEvent, data) {
        var name, doc, event = data || {};
        function returnFalse() {
            return !1;
        }
        function returnTrue() {
            return !0;
        }
        for (name in originalEvent) deprecated[name] || (event[name] = originalEvent[name]);
        return event.target || (event.target = event.srcElement || document), originalEvent && mouseEventRe.test(originalEvent.type) && void 0 === originalEvent.pageX && void 0 !== originalEvent.clientX && (doc = (data = event.target.ownerDocument || document).documentElement, 
        data = data.body, event.pageX = originalEvent.clientX + (doc && doc.scrollLeft || data && data.scrollLeft || 0) - (doc && doc.clientLeft || data && data.clientLeft || 0), 
        event.pageY = originalEvent.clientY + (doc && doc.scrollTop || data && data.scrollTop || 0) - (doc && doc.clientTop || data && data.clientTop || 0)), 
        event.preventDefault = function() {
            event.isDefaultPrevented = returnTrue, originalEvent && originalEvent.preventDefault();
        }, event.stopPropagation = function() {
            event.isPropagationStopped = returnTrue, originalEvent && originalEvent.stopPropagation();
        }, event.stopImmediatePropagation = function() {
            event.isImmediatePropagationStopped = returnTrue, event.stopPropagation();
        }, event.isDefaultPrevented || (event.isDefaultPrevented = returnFalse, 
        event.isPropagationStopped = returnFalse, event.isImmediatePropagationStopped = returnFalse), 
        event;
    }
    function EventUtils() {
        var count, expando, hasFocusIn, hasMouseEnterLeave, mouseEnterLeave, self = this, events = {};
        function executeHandlers(evt, id) {
            var i, l, callback, callbackList = (id = events[id]) && id[evt.type];
            if (callbackList) for (i = 0, l = callbackList.length; i < l; i++) if ((callback = callbackList[i]) && !1 === callback.func.call(callback.scope, evt) && evt.preventDefault(), 
            evt.isImmediatePropagationStopped()) return;
        }
        expando = "mce-data-" + (+new Date()).toString(32), hasMouseEnterLeave = "onmouseenter" in document.documentElement, 
        hasFocusIn = "onfocusin" in document.documentElement, count = 1, self.domLoaded = !(mouseEnterLeave = {
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }), self.events = events, self.bind = function(target, names, callback, scope) {
            var id, callbackList, i, name, fakeName, nativeHandler, capture, win = window;
            function defaultNativeHandler(evt) {
                executeHandlers(fix(evt || win.event), id);
            }
            if (target && 3 !== target.nodeType && 8 !== target.nodeType) {
                for (target[expando] ? id = target[expando] : (id = count++, target[expando] = id, 
                events[id] = {}), scope = scope || target, i = (names = names.split(" ")).length; i--; ) nativeHandler = defaultNativeHandler, 
                fakeName = capture = !1, "DOMContentLoaded" === (name = names[i]) && (name = "ready"), 
                self.domLoaded && "ready" === name && "complete" == target.readyState ? callback.call(scope, fix({
                    type: name
                })) : (hasMouseEnterLeave || (fakeName = mouseEnterLeave[name]) && (nativeHandler = function(evt) {
                    var current = evt.currentTarget, related = evt.relatedTarget;
                    if (related && current.contains) related = current.contains(related); else for (;related && related !== current; ) related = related.parentNode;
                    related || ((evt = fix(evt || win.event)).type = "mouseout" === evt.type ? "mouseleave" : "mouseenter", 
                    evt.target = current, executeHandlers(evt, id));
                }), hasFocusIn || "focusin" !== name && "focusout" !== name || (capture = !0, 
                fakeName = "focusin" === name ? "focus" : "blur", nativeHandler = function(evt) {
                    (evt = fix(evt || win.event)).type = "focus" === evt.type ? "focusin" : "focusout", 
                    executeHandlers(evt, id);
                }), (callbackList = events[id][name]) ? "ready" === name && self.domLoaded ? callback({
                    type: name
                }) : callbackList.push({
                    func: callback,
                    scope: scope
                }) : (events[id][name] = callbackList = [ {
                    func: callback,
                    scope: scope
                } ], callbackList.fakeName = fakeName, callbackList.capture = capture, 
                callbackList.nativeHandler = nativeHandler, "ready" === name ? function(win, callback, eventUtils) {
                    var doc = win.document, event = {
                        type: "ready"
                    };
                    function readyHandler() {
                        eventUtils.domLoaded || (eventUtils.domLoaded = !0, callback(event));
                    }
                    eventUtils.domLoaded ? callback(event) : ("complete" === doc.readyState ? readyHandler() : addEvent(win, "DOMContentLoaded", readyHandler), 
                    addEvent(win, "load", readyHandler));
                }(target, nativeHandler, self) : addEvent(target, fakeName || name, nativeHandler, capture)));
                return target = callbackList = 0, callback;
            }
        }, self.unbind = function(target, names, callback) {
            var id, i, ci, name, eventMap, nativeHandler, fakeName, capture, callbackList;
            if (target && 3 !== target.nodeType && 8 !== target.nodeType && (id = target[expando])) {
                if (eventMap = events[id], names) {
                    for (i = (names = names.split(" ")).length; i--; ) if (callbackList = eventMap[name = names[i]]) {
                        if (callback) for (ci = callbackList.length; ci--; ) callbackList[ci].func === callback && (nativeHandler = callbackList.nativeHandler, 
                        fakeName = callbackList.fakeName, capture = callbackList.capture, 
                        (callbackList = callbackList.slice(0, ci).concat(callbackList.slice(ci + 1))).nativeHandler = nativeHandler, 
                        callbackList.fakeName = fakeName, callbackList.capture = capture, 
                        eventMap[name] = callbackList);
                        callback && 0 !== callbackList.length || (delete eventMap[name], 
                        removeEvent(target, callbackList.fakeName || name, callbackList.nativeHandler, callbackList.capture));
                    }
                } else {
                    for (name in eventMap) removeEvent(target, (callbackList = eventMap[name]).fakeName || name, callbackList.nativeHandler, callbackList.capture);
                    eventMap = {};
                }
                for (name in eventMap) return self;
                delete events[id];
                try {
                    delete target[expando];
                } catch (ex) {
                    target[expando] = null;
                }
            }
            return self;
        }, self.fire = function(target, name, args) {
            var id;
            if (target && 3 !== target.nodeType && 8 !== target.nodeType) for ((args = fix(null, args)).type = name, 
            args.target = target; (id = target[expando]) && executeHandlers(args, id), 
            (target = target.parentNode || target.ownerDocument || target.defaultView || target.parentWindow) && !args.isPropagationStopped(); );
            return self;
        }, self.clean = function(target) {
            var i, children, unbind = self.unbind;
            if (target && 3 !== target.nodeType && 8 !== target.nodeType && (target[expando] && unbind(target), 
            target = target.getElementsByTagName ? target : target.document) && target.getElementsByTagName) for (unbind(target), 
            i = (children = target.getElementsByTagName("*")).length; i--; ) (target = children[i])[expando] && unbind(target);
            return self;
        }, self.destroy = function() {
            events = {};
        }, self.cancel = function(e) {
            return e && (e.preventDefault(), e.stopImmediatePropagation()), !1;
        }, self.add = function(target, events, func, scope) {
            if (!((target = "string" == typeof target ? document.getElementById(target) : target) && target instanceof Array)) return self.bind(target, (events = "init" === events ? "ready" : events) instanceof Array ? events.join(" ") : events, func, scope);
            for (var i = target.length; i--; ) self.add(target[i], events, func, scope);
        }, self.remove = function(target, events, func, scope) {
            if (!target) return self;
            if ((target = "string" == typeof target ? document.getElementById(target) : target) instanceof Array) {
                for (var i = target.length; i--; ) self.remove(target[i], events, func, scope);
                return self;
            }
            return self.unbind(target, events instanceof Array ? events.join(" ") : events, func);
        }, self.clear = function(target) {
            return "string" == typeof target && (target = document.getElementById(target)), 
            self.clean(target);
        };
    }
    function cut(editor, evt) {
        evt.isDefaultPrevented() || !1 === editor.selection.isCollapsed() && setClipboardData(evt, getData(editor), fallback(editor), function() {
            setTimeout(function() {
                editor.execCommand("Delete");
            }, 0);
        });
    }
    function copy(editor, evt) {
        evt.isDefaultPrevented() || !1 === editor.selection.isCollapsed() && setClipboardData(evt, getData(editor), fallback(editor), noop);
    }
    function parseCssToRules(content) {
        var doc = document.implementation.createHTMLDocument(""), styleElement = document.createElement("style");
        return styleElement.textContent = content, doc.body.appendChild(styleElement), 
        styleElement.sheet.cssRules;
    }
    tinymce.file.BlobCache = {
        create: function(o, blob, base64, filename) {
            return function(o) {
                var id, name;
                if (o.blob && o.base64) return id = o.id || Uuid.uuid("blobid"), 
                name = o.name || id, {
                    id: constant(id),
                    name: constant(name),
                    filename: constant(name + "." + ({
                        "image/jpeg": "jpg",
                        "image/jpg": "jpg",
                        "image/gif": "gif",
                        "image/png": "png"
                    }[o.blob.type.toLowerCase()] || "dat")),
                    blob: constant(o.blob),
                    base64: constant(o.base64),
                    blobUri: constant(o.blobUri || URL.createObjectURL(o.blob)),
                    uri: constant(o.uri)
                };
                throw "blob and base64 representations of the image are required for BlobInfo to be created";
            }("object" == typeof o ? o : {
                id: o,
                name: filename,
                blob: blob,
                base64: base64
            });
        },
        add: function(blobInfo) {
            get(blobInfo.id()) || cache.push(blobInfo);
        },
        get: get,
        getByUri: function(blobUri) {
            return findFirst(function(blobInfo) {
                return blobInfo.blobUri() == blobUri;
            });
        },
        findFirst: findFirst,
        removeByUri: function(blobUri) {
            cache = Arr.filter(cache, function(blobInfo) {
                return blobInfo.blobUri() !== blobUri || (URL.revokeObjectURL(blobInfo.blobUri()), 
                !1);
            });
        },
        destroy: function() {
            Arr.each(cache, function(cachedBlobInfo) {
                URL.revokeObjectURL(cachedBlobInfo.blobUri());
            }), cache = [];
        }
    }, tinymce.file.Conversions = {
        uriToBlob: function(url) {
            var uri;
            return 0 === url.indexOf("blob:") ? function(url) {
                return new Promise(function(resolve, reject) {
                    function rejectWithError() {
                        reject("Cannot convert " + url + " to Blob. Resource might not exist or is inaccessible.");
                    }
                    try {
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", url, !0), xhr.responseType = "blob", xhr.onload = function() {
                            200 == this.status ? resolve(this.response) : rejectWithError();
                        }, xhr.onerror = rejectWithError, xhr.send();
                    } catch (ex) {
                        rejectWithError();
                    }
                });
            }(url) : 0 === url.indexOf("data:") ? (uri = url, new Promise(function(resolve) {
                var str, arr, i;
                uri = parseDataUri(uri);
                try {
                    str = atob(uri.data);
                } catch (e) {
                    return void resolve(new Blob([]));
                }
                for (arr = new Uint8Array(str.length), i = 0; i < arr.length; i++) arr[i] = str.charCodeAt(i);
                resolve(new Blob([ arr ], {
                    type: uri.type
                }));
            })) : null;
        },
        blobToDataUri: function(blob) {
            return new Promise(function(resolve) {
                var reader = new FileReader();
                reader.onloadend = function() {
                    resolve(reader.result);
                }, reader.readAsDataURL(blob);
            });
        },
        parseDataUri: parseDataUri
    }, function(tinymce) {
        var namedEntities, baseEntities, reverseEntities, attrsCharsRegExp = /[&<>\"\u0060\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g, textCharsRegExp = /[<>&\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g, rawCharsRegExp = /[<>&\"\']/g, entityRegExp = /&#([a-z0-9]+);?|&([a-z0-9]+);/gi, asciiMap = {
            128: "\u20ac",
            130: "\u201a",
            131: "\u0192",
            132: "\u201e",
            133: "\u2026",
            134: "\u2020",
            135: "\u2021",
            136: "\u02c6",
            137: "\u2030",
            138: "\u0160",
            139: "\u2039",
            140: "\u0152",
            142: "\u017d",
            145: "\u2018",
            146: "\u2019",
            147: "\u201c",
            148: "\u201d",
            149: "\u2022",
            150: "\u2013",
            151: "\u2014",
            152: "\u02dc",
            153: "\u2122",
            154: "\u0161",
            155: "\u203a",
            156: "\u0153",
            158: "\u017e",
            159: "\u0178"
        };
        function buildEntitiesLookup(items, radix) {
            var i, chr, entity, lookup = {};
            if (items) {
                for (items = items.split(","), radix = radix || 10, i = 0; i < items.length; i += 2) chr = String.fromCharCode(parseInt(items[i], radix)), 
                baseEntities[chr] || (entity = "&" + items[i + 1] + ";", lookup[chr] = entity, 
                lookup[entity] = chr);
                return lookup;
            }
        }
        baseEntities = {
            '"': "&quot;",
            "'": "&#39;",
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            "`": "&#96;"
        }, reverseEntities = {
            "&lt;": "<",
            "&gt;": ">",
            "&amp;": "&",
            "&quot;": '"',
            "&apos;": "'"
        }, namedEntities = buildEntitiesLookup("50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,t9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro", 32), 
        tinymce.html = tinymce.html || {}, tinymce.html.Entities = {
            encodeRaw: function(text, attr) {
                return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function(chr) {
                    return baseEntities[chr] || chr;
                });
            },
            encodeAllRaw: function(text) {
                return ("" + text).replace(rawCharsRegExp, function(chr) {
                    return baseEntities[chr] || chr;
                });
            },
            encodeNumeric: function(text, attr) {
                return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function(chr) {
                    return 1 < chr.length ? "&#" + (1024 * (chr.charCodeAt(0) - 55296) + (chr.charCodeAt(1) - 56320) + 65536) + ";" : baseEntities[chr] || "&#" + chr.charCodeAt(0) + ";";
                });
            },
            encodeNamed: function(text, attr, entities) {
                return entities = entities || namedEntities, text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function(chr) {
                    return baseEntities[chr] || entities[chr] || chr;
                });
            },
            getEncodeFunc: function(name, entities) {
                var Entities = tinymce.html.Entities;
                return entities = buildEntitiesLookup(entities) || namedEntities, 
                (name = tinymce.makeMap(name.replace(/\+/g, ","))).named && name.numeric ? function(text, attr) {
                    return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function(chr) {
                        return baseEntities[chr] || entities[chr] || "&#" + chr.charCodeAt(0) + ";" || chr;
                    });
                } : name.named ? entities ? function(text, attr) {
                    return Entities.encodeNamed(text, attr, entities);
                } : Entities.encodeNamed : name.numeric ? Entities.encodeNumeric : Entities.encodeRaw;
            },
            decode: function(text) {
                return text.replace(entityRegExp, function(all, numeric) {
                    return numeric ? 65535 < (numeric = "x" === numeric.charAt(0).toLowerCase() ? parseInt(numeric.substr(1), 16) : parseInt(numeric, 10)) ? (numeric -= 65536, 
                    String.fromCharCode(55296 + (numeric >> 10), 56320 + (1023 & numeric))) : asciiMap[numeric] || String.fromCharCode(numeric) : reverseEntities[all] || namedEntities[all] || (numeric = all, 
                    (all = document.createElement("div")).innerHTML = numeric, all.textContent) || all.innerText || numeric;
                });
            }
        };
    }(tinymce), tinymce.html.Styles = function(settings, schema) {
        var i, encodingItems, validStyles, invalidStyles, rgbRegExp = /rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/gi, urlOrStrRegExp = /(?:url(?:(?:\(\s*\"([^\"]+)\"\s*\))|(?:\(\s*\'([^\']+)\'\s*\))|(?:\(\s*([^)\s]+)\s*\))))|(?:\'([^\']+)\')|(?:\"([^\"]+)\")/gi, styleRegExp = /\s*([^:]+):\s*([^;]+);?/g, trimRightRegExp = /\s+$/, encodingLookup = {};
        for (settings = settings || {}, schema && (validStyles = schema.getValidStyles(), 
        invalidStyles = schema.getInvalidStyles()), encodingItems = "\\\" \\' \\; \\: ; : \ufeff".split(" "), 
        i = 0; i < encodingItems.length; i++) encodingLookup[encodingItems[i]] = "\ufeff" + i, 
        encodingLookup["\ufeff" + i] = encodingItems[i];
        function toHex(match, r, g, b) {
            function hex(val) {
                return 1 < (val = parseInt(val, 10).toString(16)).length ? val : "0" + val;
            }
            return "#" + hex(r) + hex(g) + hex(b);
        }
        return {
            toHex: function(color) {
                return color.replace(rgbRegExp, toHex);
            },
            parse: function(css) {
                var matches, name, value, isEncoded, a, b, c, styles = {}, urlConverter = settings.url_converter, urlConverterScope = settings.url_converter_scope || this;
                function compress(prefix, suffix, noJoin) {
                    var right, bottom, left, top = styles[prefix + "-top" + suffix];
                    if (top && (right = styles[prefix + "-right" + suffix]) && (bottom = styles[prefix + "-bottom" + suffix]) && (left = styles[prefix + "-left" + suffix])) {
                        var box = [ top, right, bottom, left ];
                        for (i = box.length - 1; i-- && box[i] === box[i + 1]; );
                        -1 < i && noJoin || (styles[prefix + suffix] = -1 == i ? box[0] : box.join(" "), 
                        delete styles[prefix + "-top" + suffix], delete styles[prefix + "-right" + suffix], 
                        delete styles[prefix + "-bottom" + suffix], delete styles[prefix + "-left" + suffix]);
                    }
                }
                function canCompress(key) {
                    var i, value = styles[key];
                    if (value) {
                        for (i = (value = value.split(" ")).length; i--; ) if (value[i] !== value[0]) return;
                        return styles[key] = value[0], 1;
                    }
                }
                function encode(str) {
                    return isEncoded = !0, encodingLookup[str];
                }
                function decode(str, keep_slashes) {
                    return isEncoded && (str = str.replace(/\uFEFF[0-9]/g, function(str) {
                        return encodingLookup[str];
                    })), keep_slashes ? str : str.replace(/\\([\'\";:])/g, "$1");
                }
                function processUrl(match, url, url2, url3, str, str2) {
                    if (str = str || str2) return "'" + (str = decode(str)).replace(/\'/g, "\\'") + "'";
                    if (url = decode(url || url2 || url3), !settings.allow_script_urls) {
                        if (str2 = url.replace(/[\s\r\n]+/, ""), /(java|vb)script:/i.test(str2)) return "";
                        if (!settings.allow_svg_data_urls && /^data:image\/svg/i.test(str2)) return "";
                    }
                    return "url('" + (url = urlConverter ? urlConverter.call(urlConverterScope, url, "style") : url).replace(/\'/g, "\\'") + "')";
                }
                if (css) {
                    for (css = (css = css.replace(/[\u0000-\u001F]/g, "")).replace(/\\[\"\';:\uFEFF]/g, encode).replace(/\"[^\"]+\"|\'[^\']+\'/g, function(str) {
                        return str.replace(/[;:]/g, encode);
                    }); matches = styleRegExp.exec(css); ) {
                        if (name = matches[1].replace(trimRightRegExp, "").toLowerCase(), 
                        value = (value = matches[2].replace(trimRightRegExp, "")).replace(/\\[0-9a-f]+/g, function(e) {
                            return String.fromCharCode(parseInt(e.substr(1), 16));
                        }), name && 0 < value.length) {
                            if (!settings.allow_script_urls && ("behavior" == name || /expression\s*\(|\/\*|\*\//.test(value))) continue;
                            "font-weight" === name && "700" === value ? value = "bold" : "color" !== name && "background-color" !== name || (value = value.toLowerCase()), 
                            value = (value = value.replace(rgbRegExp, toHex)).replace(urlOrStrRegExp, processUrl), 
                            styles[name] = isEncoded ? decode(value, !0) : value;
                        }
                        styleRegExp.lastIndex = matches.index + matches[0].length;
                    }
                    compress("border", "", !0), compress("border", "-width"), compress("border", "-color"), 
                    compress("border", "-style"), compress("padding", ""), compress("margin", ""), 
                    b = "border-style", c = "border-color", canCompress(a = "border-width") && canCompress(b) && canCompress(c) && (styles.border = styles[a] + " " + styles[b] + " " + styles[c], 
                    delete styles[a], delete styles[b], delete styles[c]), "medium none" === styles.border && delete styles.border, 
                    "none" === styles["border-image"] && delete styles["border-image"];
                }
                return styles;
            },
            serialize: function(styles, elementName) {
                var name, value, css = "";
                function serializeStyles(name) {
                    var i, l, value, styleList = validStyles[name];
                    if (styleList) for (i = 0, l = styleList.length; i < l; i++) name = styleList[i], 
                    void 0 !== (value = styles[name]) && 0 < value.length && (css += (0 < css.length ? " " : "") + name + ": " + value + ";");
                }
                if (elementName && validStyles) serializeStyles("*"), serializeStyles(elementName); else for (name in styles) void 0 !== (value = styles[name]) && 0 < value.length && (invalidStyles && !function(name, elementName) {
                    var styleMap = invalidStyles["*"];
                    return !(styleMap && styleMap[name] || (styleMap = invalidStyles[elementName]) && styleMap[name]);
                }(name, elementName) || (css += (0 < css.length ? " " : "") + name + ": " + value + ";"));
                return css;
            }
        };
    }, function(tinymce) {
        var mapCache = {}, dummyObj = {}, makeMap = tinymce.makeMap, each = tinymce.each, extend = tinymce.extend, explode = tinymce.explode, inArray = tinymce.inArray;
        function split(items, delim) {
            return items ? items.split(delim || " ") : [];
        }
        function compileElementMap(value, mode) {
            var styles;
            return value && (styles = {}, each(value = "string" == typeof value ? {
                "*": value
            } : value, function(value, key) {
                styles[key] = styles[key.toUpperCase()] = ("map" == mode ? makeMap : explode)(value, /[, ]/);
            })), styles;
        }
        tinymce.html.Schema = function(settings) {
            var validStyles, invalidStyles, schemaItems, whiteSpaceElementsMap, selfClosingElementsMap, shortEndedElementsMap, boolAttrMap, validClasses, blockElementsMap, nonEmptyElementsMap, moveCaretBeforeOnEnterElementsMap, textBlockElementsMap, textInlineElementsMap, type, globalAttributes, phrasingContent, flowContent, html4PhrasingContent, eventAttributes, schema, elements = {}, children = {}, patternElements = [], customElementsMap = {}, specialElements = {};
            function createLookupTable(option, default_value, extendWith) {
                var value = settings[option];
                return value ? value = makeMap(value, /[, ]/, makeMap(value.toUpperCase(), /[, ]/)) : (value = mapCache[option]) || (value = makeMap(default_value, " ", makeMap(default_value.toUpperCase(), " ")), 
                value = extend(value, extendWith), mapCache[option] = value), value;
            }
            function add(name, attributes, children) {
                var ni, i, attributesOrder, args = arguments;
                function arrayToMap(array, obj) {
                    for (var map = {}, i = 0, l = array.length; i < l; i++) map[array[i]] = obj || {};
                    return map;
                }
                for (attributes = attributes || "", "string" == typeof (children = children || []) && (children = split(children)), 
                i = 3; i < args.length; i++) "string" == typeof args[i] && (args[i] = split(args[i])), 
                children.push.apply(children, args[i]);
                for (ni = (name = split(name)).length; ni--; ) attributesOrder = [].concat(split(attributes), globalAttributes), 
                schema[name[ni]] = {
                    attributes: arrayToMap(attributesOrder),
                    attributesOrder: attributesOrder,
                    children: arrayToMap(children, dummyObj)
                };
            }
            function addAttrs(name, attributes) {
                var schemaItem, i, l, ni = (name = split(name)).length;
                for (attributes = split(attributes); ni--; ) for (schemaItem = schema[name[ni]], 
                i = 0, l = attributes.length; i < l; i++) schemaItem.attributes[attributes[i]] || (schemaItem.attributes[attributes[i]] = {}, 
                schemaItem.attributesOrder.push(attributes[i]));
            }
            function patternToRegExp(str) {
                return new RegExp("^" + str.replace(/([?+*])/g, ".$1") + "$");
            }
            function addValidElements(validElements) {
                var ei, el, ai, al, matches, element, attr, attrData, elementName, attrName, attrType, attributes, attributesOrder, prefix, outputName, globalAttributes, globalAttributesOrder, key, value, elementRuleRegExp = /^([#+\-])?([^\[!\/]+)(?:\/([^\[!]+))?(?:(!?)\[([^\]]+)\])?$/, attrRuleRegExp = /^([!\-])?(\w+::\w+|[^=:<]+)?(?:([=:<])(.*))?$/, hasPatternsRegExp = /[*?+]/;
                if (validElements) for (validElements = split(validElements, ","), 
                elements["@"] && (globalAttributes = elements["@"].attributes, globalAttributesOrder = elements["@"].attributesOrder), 
                ei = 0, el = validElements.length; ei < el; ei++) if (matches = elementRuleRegExp.exec(validElements[ei])) {
                    if (prefix = matches[1], elementName = matches[2], outputName = matches[3], 
                    attrData = matches[5], element = {
                        attributes: attributes = {},
                        attributesOrder: attributesOrder = []
                    }, "#" === prefix && (element.paddEmpty = !0), "-" === prefix && (element.removeEmpty = !0), 
                    "!" === matches[4] && (element.removeEmptyAttrs = !0), globalAttributes) {
                        for (key in globalAttributes) attributes[key] = globalAttributes[key];
                        attributesOrder.push.apply(attributesOrder, globalAttributesOrder);
                    }
                    if (attrData) for (ai = 0, al = (attrData = split(attrData, "|")).length; ai < al; ai++) (matches = attrRuleRegExp.exec(attrData[ai])) && (attr = {}, 
                    attrType = matches[1], attrName = matches[2].replace(/::/g, ":"), 
                    prefix = matches[3], value = matches[4], "!" === attrType && (element.attributesRequired = element.attributesRequired || [], 
                    element.attributesRequired.push(attrName), attr.required = !0), 
                    "-" === attrType ? (delete attributes[attrName], attributesOrder.splice(inArray(attributesOrder, attrName), 1)) : (prefix && ("=" === prefix && (element.attributesDefault = element.attributesDefault || [], 
                    element.attributesDefault.push({
                        name: attrName,
                        value: value
                    }), attr.defaultValue = value), ":" === prefix && (element.attributesForced = element.attributesForced || [], 
                    element.attributesForced.push({
                        name: attrName,
                        value: value
                    }), attr.forcedValue = value), "<" === prefix) && (attr.validValues = makeMap(value, "?")), 
                    hasPatternsRegExp.test(attrName) ? (element.attributePatterns = element.attributePatterns || [], 
                    attr.pattern = patternToRegExp(attrName), element.attributePatterns.push(attr)) : (attributes[attrName] || attributesOrder.push(attrName), 
                    attributes[attrName] = attr)));
                    globalAttributes || "@" != elementName || (globalAttributes = attributes, 
                    globalAttributesOrder = attributesOrder), outputName && (element.outputName = elementName, 
                    elements[outputName] = element), hasPatternsRegExp.test(elementName) ? (element.pattern = patternToRegExp(elementName), 
                    patternElements.push(element)) : elements[elementName] = element;
                }
            }
            function setValidElements(validElements) {
                elements = {}, patternElements = [], addValidElements(validElements), 
                each(schemaItems, function(element, name) {
                    children[name] = element.children;
                });
            }
            function addCustomElements(customElements) {
                var customElementRegExp = /^(~)?(.+)$/;
                customElements && (mapCache.text_block_elements = mapCache.block_elements = null, 
                each(split(customElements, ","), function(rule) {
                    var inline = "~" === (rule = customElementRegExp.exec(rule))[1], cloneName = inline ? "span" : "div", name = rule[2];
                    children[name] = children[cloneName], customElementsMap[name] = cloneName, 
                    inline || (blockElementsMap[name.toUpperCase()] = {}, blockElementsMap[name] = {}), 
                    elements[name] || (rule = elements[cloneName], delete (rule = extend({}, rule)).removeEmptyAttrs, 
                    delete rule.removeEmpty, elements[name] = rule), each(children, function(element, elmName) {
                        element[cloneName] && (children[elmName] = element = extend({}, children[elmName]), 
                        element[name] = element[cloneName]);
                    });
                }));
            }
            function addValidChildren(validChildren) {
                var childRuleRegExp = /^([+\-]?)(\w+)\[([^\]]+)\]$/;
                validChildren && each(split(validChildren, ","), function(rule) {
                    var parent, prefix, matches = childRuleRegExp.exec(rule);
                    matches && (prefix = matches[1], parent = prefix ? children[matches[2]] : children[matches[2]] = {
                        "#comment": {}
                    }, parent = children[matches[2]], each(split(matches[3], "|"), function(child) {
                        "-" === prefix ? (children[matches[2]] = parent = extend({}, children[matches[2]]), 
                        delete parent[child]) : parent[child] = {};
                    }));
                });
            }
            function getElementRule(name) {
                var i, element = elements[name];
                if (element) return element;
                for (i = patternElements.length; i--; ) if ((element = patternElements[i]).pattern.test(name)) return element;
            }
            type = (settings = settings || {}).schema, schema = {}, schemaItems = mapCache[type] || (globalAttributes = split("id accesskey class dir lang style tabindex title"), 
            eventAttributes = split("onclick ondblclick onmousedown onmouseup onmouseover onmousemove onmouseout onkeypress onkeydown onkeyup"), 
            "html4" != type && eventAttributes.push.apply(eventAttributes, split("onabort onblur oncancel oncanplay oncanplaythrough onchange onclose oncontextmenu oncuechange ondrag ondragend ondragenter ondragleave ondragover ondragstart ondrop ondurationchange onemptied onended onerror onfocus oninput oninvalid onload onloadeddata onloadedmetadata onloadstart onmouseenter onmouseleave onmousewheel onpause onplay onplaying onprogress onratechange onreset onscroll onseeked onseeking onseeking onselect onshow onstalled onsubmit onsuspend ontimeupdate onvolumechange onwaiting onwheel")), 
            globalAttributes.push.apply(globalAttributes, eventAttributes), globalAttributes.push.apply(globalAttributes, split("itemscope itemtype itemid itemprop itemref")), 
            globalAttributes.push.apply(globalAttributes, split("role")), eventAttributes = split("address blockquote div dl fieldset form h1 h2 h3 h4 h5 h6 hr menu ol p pre table ul"), 
            phrasingContent = split("a abbr b bdo br button cite code del dfn em embed i iframe img input ins kbd label map noscript object q s samp script select small span strong sub sup textarea u var link style #text #comment"), 
            "html4" != type && (globalAttributes.push.apply(globalAttributes, split("contenteditable contextmenu draggable dropzone hidden spellcheck translate")), 
            eventAttributes.push.apply(eventAttributes, split("article aside details dialog figure header footer hgroup section nav")), 
            phrasingContent.push.apply(phrasingContent, split("audio canvas command datalist mark meter output picture progress time wbr video ruby bdi keygen"))), 
            "html5-strict" != type && (globalAttributes.push("xml:lang"), html4PhrasingContent = split("acronym applet basefont big font strike tt"), 
            phrasingContent.push.apply(phrasingContent, html4PhrasingContent), each(html4PhrasingContent, function(name) {
                add(name, "", phrasingContent);
            }), html4PhrasingContent = split("center dir isindex noframes"), eventAttributes.push.apply(eventAttributes, html4PhrasingContent), 
            flowContent = [].concat(eventAttributes, phrasingContent), each(html4PhrasingContent, function(name) {
                add(name, "", flowContent);
            })), flowContent = flowContent || [].concat(eventAttributes, phrasingContent), 
            add("html", "manifest", "head body"), add("head", "", "base command link meta noscript script style title"), 
            add("title hr noscript br"), add("base", "href target"), add("link", "href rel media hreflang type sizes"), 
            add("meta", "name http-equiv content charset"), add("style", "media type scoped"), 
            add("script", "src async defer type charset"), add("body", "onafterprint onbeforeprint onbeforeunload onblur onerror onfocus onhashchange onload onmessage onoffline ononline onpagehide onpageshow onpopstate onresize onscroll onstorage onunload", flowContent), 
            add("address dt dd div caption", "", flowContent), add("h1 h2 h3 h4 h5 h6 pre p abbr code var samp kbd sub sup i b u bdo span legend em strong small s cite dfn", "", phrasingContent), 
            add("blockquote", "cite", flowContent), add("ol", "reversed start type", "li"), 
            add("ul", "", "li"), add("li", "value", flowContent), add("dl", "", "dt dd"), 
            add("a", "href target rel media hreflang type", phrasingContent), add("q", "cite", phrasingContent), 
            add("ins del", "cite datetime", flowContent), add("img", "src sizes srcset alt usemap ismap width height"), 
            add("iframe", "src name width height", flowContent), add("embed", "src type width height"), 
            add("object", "data type typemustmatch name usemap form width height", flowContent, "param"), 
            add("param", "name value"), add("map", "name", flowContent, "area"), 
            add("area", "alt coords shape href target rel media hreflang type"), 
            add("table", "border", "caption colgroup thead tfoot tbody tr" + ("html4" == type ? " col" : "")), 
            add("colgroup", "span", "col"), add("col", "span"), add("tbody thead tfoot", "", "tr"), 
            add("tr", "", "td th"), add("td", "colspan rowspan headers", flowContent), 
            add("th", "colspan rowspan headers scope abbr", flowContent), add("form", "accept-charset action autocomplete enctype method name novalidate target", flowContent), 
            add("fieldset", "disabled form name", flowContent, "legend"), add("label", "form for", phrasingContent), 
            add("input", "accept alt autocomplete checked dirname disabled form formaction formenctype formmethod formnovalidate formtarget height list max maxlength min multiple name pattern readonly required size src step type value width"), 
            add("button", "disabled form formaction formenctype formmethod formnovalidate formtarget name type value", "html4" == type ? flowContent : phrasingContent), 
            add("select", "disabled form multiple name required size", "option optgroup"), 
            add("optgroup", "disabled label", "option"), add("option", "disabled label selected value"), 
            add("textarea", "cols dirname disabled form maxlength name readonly required rows wrap"), 
            add("menu", "type label", flowContent, "li"), add("noscript", "", flowContent), 
            "html4" != type && (add("wbr"), add("ruby", "", phrasingContent, "rt rp"), 
            add("figcaption", "", flowContent), add("mark rt rp summary bdi", "", phrasingContent), 
            add("canvas", "width height", flowContent), add("video", "src crossorigin poster preload autoplay mediagroup loop muted controls width height buffered controlslist playsinline", flowContent, "track source"), 
            add("audio", "src crossorigin preload autoplay mediagroup loop muted controls buffered volume controlslist", flowContent, "track source"), 
            add("picture", "", "img source"), add("source", "src srcset type media sizes"), 
            add("track", "kind src srclang label default"), add("datalist", "", phrasingContent, "option"), 
            add("article section nav aside header footer", "", flowContent), add("hgroup", "", "h1 h2 h3 h4 h5 h6"), 
            add("figure", "", flowContent, "figcaption"), add("time", "datetime", phrasingContent), 
            add("dialog", "open", flowContent), add("command", "type label icon disabled checked radiogroup command"), 
            add("output", "for form name", phrasingContent), add("progress", "value max", phrasingContent), 
            add("meter", "value min max low high optimum", phrasingContent), add("details", "open", flowContent, "summary"), 
            add("keygen", "autofocus challenge disabled form keytype name"), add("a", "href target rel media hreflang type", flowContent)), 
            addAttrs("form", "onblur onchange onfocus onselect onsubmit"), "html5-strict" != type && (addAttrs("script", "language xml:space"), 
            addAttrs("style", "xml:space"), addAttrs("object", "declare classid code codebase codetype archive standby align border hspace vspace"), 
            addAttrs("embed", "align name hspace vspace"), addAttrs("param", "valuetype type"), 
            addAttrs("a", "charset name rev shape coords"), addAttrs("br", "clear"), 
            addAttrs("applet", "codebase archive code object alt name width height align hspace vspace"), 
            addAttrs("img", "name longdesc align border hspace vspace"), addAttrs("iframe", "longdesc frameborder marginwidth marginheight scrolling align"), 
            addAttrs("font basefont", "size color face"), addAttrs("input", "usemap align"), 
            addAttrs("select", "onchange"), addAttrs("textarea"), addAttrs("h1 h2 h3 h4 h5 h6 div p legend caption", "align"), 
            addAttrs("ul", "type compact"), addAttrs("li", "type"), addAttrs("ol dl menu dir", "compact"), 
            addAttrs("pre", "width xml:space"), addAttrs("hr", "align noshade size width"), 
            addAttrs("isindex", "prompt"), addAttrs("table", "summary width frame rules cellspacing cellpadding align bgcolor"), 
            addAttrs("col", "width align char charoff valign"), addAttrs("colgroup", "width align char charoff valign"), 
            addAttrs("thead", "align char charoff valign"), addAttrs("tr", "align char charoff valign bgcolor"), 
            addAttrs("th", "axis align char charoff valign nowrap bgcolor width height"), 
            addAttrs("form", "accept"), addAttrs("td", "abbr axis scope align char charoff valign nowrap bgcolor width height"), 
            addAttrs("tfoot", "align char charoff valign"), addAttrs("tbody", "align char charoff valign"), 
            addAttrs("area", "nohref"), addAttrs("body", "background bgcolor text link vlink alink"), 
            addAttrs("form", "onreset")), "html4" != type && (addAttrs("input button select textarea", "autofocus"), 
            addAttrs("input textarea", "placeholder"), addAttrs("a", "download"), 
            addAttrs("link script img", "crossorigin"), addAttrs("iframe", "sandbox seamless allowfullscreen allow referrerpolicy loading"), 
            addAttrs("img", "loading decoding"), addAttrs("link", "as disabled imagesizes imagesrcset title"), 
            addAttrs("form", "oncontextmenu onformchange onforminput oninput oninvalid"), 
            addAttrs("video audio", "onabort oncanplay oncanplaythrough ondurationchange onemptied onended onerror onloadeddata onloadedmetadata onloadstart onpause onplay onplaying onprogress onratechange onreadystatechange onseeked onseeking onstalled onsuspend ontimeupdate onvolumechange onwaiting")), 
            each(split("a form meter progress dfn"), function(name) {
                schema[name] && delete schema[name].children[name];
            }), delete schema.caption.children.table, mapCache[type] = schema), 
            !1 === settings.verify_html && (settings.valid_elements = "*[*]"), validStyles = compileElementMap(settings.valid_styles), 
            invalidStyles = compileElementMap(settings.invalid_styles, "map"), validClasses = compileElementMap(settings.valid_classes, "map"), 
            whiteSpaceElementsMap = createLookupTable("whitespace_elements", "pre script noscript style textarea video audio iframe object"), 
            selfClosingElementsMap = createLookupTable("self_closing_elements", "colgroup dd dt li option p td tfoot th thead tr"), 
            shortEndedElementsMap = createLookupTable("short_ended_elements", "area base basefont br col frame hr img input isindex link meta param embed source wbr track"), 
            boolAttrMap = createLookupTable("boolean_attributes", "async checked compact declare defer disabled ismap multiple nohref noresize noshade nowrap readonly selected autoplay loop controls itemscope playsinline spellcheck contextmenu draggable hidden allowfullscreen muted"), 
            nonEmptyElementsMap = createLookupTable("non_empty_elements", "td th iframe video audio object script pre code", shortEndedElementsMap), 
            moveCaretBeforeOnEnterElementsMap = createLookupTable("move_caret_before_on_enter_elements", "table", nonEmptyElementsMap), 
            textBlockElementsMap = createLookupTable("text_block_elements", "h1 h2 h3 h4 h5 h6 p div address pre form blockquote center dir fieldset header footer article section hgroup aside nav figure"), 
            blockElementsMap = createLookupTable("block_elements", "hr table tbody thead tfoot th tr td li ol ul caption dl dt dd noscript menu isindex option datalist select optgroup", textBlockElementsMap), 
            textInlineElementsMap = createLookupTable("text_inline_elements", "span strong b em i font strike u var cite dfn code mark q sup sub samp"), 
            each((settings.special || "script noscript iframe noframes noembed title style textarea xmp").split(" "), function(name) {
                specialElements[name] = new RegExp("</" + name + "[^>]*>", "gi");
            }), settings.valid_elements ? setValidElements(settings.valid_elements) : (each(schemaItems, function(element, name) {
                elements[name] = {
                    attributes: element.attributes,
                    attributesOrder: element.attributesOrder
                }, children[name] = element.children;
            }), "html4" === settings.schema && each(split("strong/b em/i"), function(item) {
                item = split(item, "/"), elements[item[1]].outputName = item[0];
            }), elements.img.attributesDefault = [ {
                name: "alt",
                value: ""
            } ], each(split("ol ul sub sup blockquote font table tbody tr strong b"), function(name) {
                elements[name] && (elements[name].removeEmpty = !0);
            }), each(split("p h1 h2 h3 h4 h5 h6 th td pre div address caption"), function(name) {
                elements[name].paddEmpty = !0;
            }), !1 === settings.allow_empty_spans && each(split("span"), function(name) {
                elements[name].removeEmptyAttrs = !0;
            })), addCustomElements(settings.custom_elements), addValidChildren(settings.valid_children), 
            addValidElements(settings.extended_valid_elements), addValidChildren("+ol[ul|ol],+ul[ul|ol]"), 
            settings.invalid_elements && each(explode(settings.invalid_elements), function(item) {
                elements[item] && delete elements[item];
            }), getElementRule("span") || addValidElements("span[*]"), this.children = children, 
            this.getValidStyles = function() {
                return validStyles;
            }, this.getInvalidStyles = function() {
                return invalidStyles;
            }, this.getValidClasses = function() {
                return validClasses;
            }, this.getBoolAttrs = function() {
                return boolAttrMap;
            }, this.getBlockElements = function() {
                return blockElementsMap;
            }, this.getTextBlockElements = function() {
                return textBlockElementsMap;
            }, this.getTextRootBlockElements = function() {
                return makeMap("td th li dt dd figcaption caption details summary", textBlockElementsMap);
            }, this.getTextInlineElements = function() {
                return textInlineElementsMap;
            }, this.getShortEndedElements = function() {
                return shortEndedElementsMap;
            }, this.getSelfClosingElements = function() {
                return selfClosingElementsMap;
            }, this.getNonEmptyElements = function() {
                return nonEmptyElementsMap;
            }, this.getMoveCaretBeforeOnEnterElements = function() {
                return moveCaretBeforeOnEnterElementsMap;
            }, this.getWhiteSpaceElements = function() {
                return whiteSpaceElementsMap;
            }, this.getSpecialElements = function() {
                return specialElements;
            }, this.isValidChild = function(name, child) {
                return !(!(name = children[name]) || !name[child]);
            }, this.isValid = function(name, attr) {
                var attrPatterns, i, rule = getElementRule(name);
                if (rule) {
                    if (!attr) return !0;
                    if (rule.attributes[attr]) return !0;
                    if (attrPatterns = rule.attributePatterns) for (i = attrPatterns.length; i--; ) if (attrPatterns[i].pattern.test(name)) return !0;
                }
                return !1;
            }, this.getElementRule = getElementRule, this.getCustomElements = function() {
                return customElementsMap;
            }, this.addValidElements = addValidElements, this.setValidElements = setValidElements, 
            this.addCustomElements = addCustomElements, this.addValidChildren = addValidChildren, 
            this.elements = elements;
        };
    }(tinymce), function(tinymce) {
        var each = tinymce.each, Entities = tinymce.html.Entities;
        tinymce.html.SaxParser = function(settings, schema) {
            var self = this;
            function noop() {}
            settings = settings || {}, self.schema = schema = schema || new tinymce.html.Schema(), 
            !1 !== settings.fix_self_closing && (settings.fix_self_closing = !0), 
            !0 !== settings.allow_event_attributes && (settings.allow_event_attributes = !1), 
            !1 !== settings.preserve_cdata && (settings.preserve_cdata = !0), each("comment cdata text start end pi doctype".split(" "), function(name) {
                name && (self[name] = settings[name] || noop);
            }), self.findEndTag = function(schema, html, startIndex) {
                var index, matches, count = 1, shortEndedElements = schema.getShortEndedElements(), tokenRegExp = /<([!?\/])?([A-Za-z0-9\-_\:\.]+)((?:\s+[^"\'>]+(?:(?:"[^"]*")|(?:\'[^\']*\')|[^>]*))*|\/|\s+)>/g;
                for (tokenRegExp.lastIndex = index = startIndex; matches = tokenRegExp.exec(html); ) {
                    if (index = tokenRegExp.lastIndex, "/" === matches[1]) count--; else if (!matches[1]) {
                        if (matches[2] in shortEndedElements) continue;
                        count++;
                    }
                    if (0 === count) break;
                }
                return index;
            }, self.parse = function(html, format) {
                var matches, value, attrList, i, text, name, isInternalElement, removeInternalElements, shortEndedElements, fillAttrsMap, isShortEnded, validate, elementRule, isValidElement, attr, attribsValue, validAttributesMap, validAttributePatterns, attributesRequired, attributesDefault, attributesForced, selfClosing, tokenRegExp, attrRegExp, specialElements, attrValue, fixSelfClosing, processHtml, self = this, index = 0, stack = [], idCount = 0, decode = Entities.decode, filteredUrlAttrs = tinymce.makeMap("src,href,data,background,formaction,poster,xlink:href"), scriptUriRegExp = /((java|vb)script|mhtml):/i;
                function processEndTag(name) {
                    for (var i, pos = stack.length; pos-- && stack[pos].name !== name; );
                    if (0 <= pos) {
                        for (i = stack.length - 1; pos <= i; i--) (name = stack[i]).valid && self.end(name.name);
                        stack.length = pos;
                    }
                }
                function processComment(value) {
                    return "" === value || (">" === value.charAt(0) && (value = " " + value), 
                    settings.allow_conditional_comments) || "[if" !== value.substr(0, 3).toLowerCase() ? value : " " + value;
                }
                function trimComments(text) {
                    for (var sanitizedText = text; /<!--|--!?>/g.test(sanitizedText); ) sanitizedText = sanitizedText.replace(/<!--|--!?>/g, "");
                    return sanitizedText;
                }
                function parseAttribute(match, name, value, val2, val3) {
                    var attrRule, i;
                    if (value = (name = name.toLowerCase()) in fillAttrsMap ? name : decode(value || val2 || val3 || ""), 
                    validate && !isInternalElement && !(0 < name.indexOf("-"))) {
                        if (!settings.allow_event_attributes && 0 == name.indexOf("on")) return;
                        if (!(attrRule = validAttributesMap[name]) && validAttributePatterns) {
                            for (i = validAttributePatterns.length; i-- && !(attrRule = validAttributePatterns[i]).pattern.test(name); );
                            -1 === i && (attrRule = null);
                        }
                        if (!attrRule) return;
                        if (attrRule.validValues && !(value in attrRule.validValues)) return;
                    }
                    if (filteredUrlAttrs[name] && !settings.allow_script_urls) {
                        val2 = value.replace(/[\s\u0000-\u001F]+/g, "");
                        try {
                            val2 = decodeURIComponent(val2);
                        } catch (ex) {
                            val2 = unescape(val2);
                        }
                        if (scriptUriRegExp.test(val2)) return;
                        if (function(settings, uri) {
                            return !settings.allow_html_data_urls && (/^data:image\//i.test(uri) ? !1 === settings.allow_svg_data_urls && /^data:image\/svg\+xml/i.test(uri) : /^data:/i.test(uri));
                        }(settings, val2)) return;
                    }
                    attrList.map[name] = value, attrList.push({
                        name: name,
                        value: value
                    });
                }
                for (format = format || "html", tokenRegExp = new RegExp("<(?:(?:!--([\\w\\W]*?)--!?>)|(?:!\\[CDATA\\[([\\w\\W]*?)\\]\\]>)|(?:![Dd][Oo][Cc][Tt][Yy][Pp][Ee]([\\w\\W]*?)>)|(?:\\?([^\\s\\/<>]+) ?([\\w\\W]*?)[?/]>)|(?:\\/([A-Za-z][A-Za-z0-9\\-_\\:\\.]*)>)|(?:([A-Za-z][A-Za-z0-9\\-_\\:\\.]*)((?:\\s+[^\"'>]+(?:(?:\"[^\"]*\")|(?:'[^']*')|[^>]*))*|\\/|\\s+)>))", "g"), 
                attrRegExp = /([\w:\-]+)(?:\s*=\s*(?:(?:\"((?:[^\"])*)\")|(?:\'((?:[^\'])*)\')|([^>\s]+)))?/g, 
                shortEndedElements = schema.getShortEndedElements(), selfClosing = settings.self_closing_elements || schema.getSelfClosingElements(), 
                fillAttrsMap = schema.getBoolAttrs(), validate = settings.validate, 
                removeInternalElements = settings.remove_internals, fixSelfClosing = settings.fix_self_closing, 
                specialElements = schema.getSpecialElements(), processHtml = html + ">"; matches = tokenRegExp.exec(processHtml); ) {
                    if (index < matches.index && self.text(decode(html.substr(index, matches.index - index))), 
                    value = matches[6]) processEndTag(value = ":" === (value = value.toLowerCase()).charAt(0) ? value.substr(1) : value); else if (value = matches[7]) {
                        if (matches.index + matches[0].length > html.length) {
                            self.text(decode(html.substr(matches.index))), index = matches.index + matches[0].length;
                            continue;
                        }
                        isShortEnded = (value = ":" === (value = value.toLowerCase()).charAt(0) ? value.substr(1) : value) in shortEndedElements, 
                        fixSelfClosing && selfClosing[value] && 0 < stack.length && stack[stack.length - 1].name === value && processEndTag(value);
                        var attrString, regExp = attrRegExp, attrString = matches[8];
                        if (null !== (attrString = (regExp = regExp.exec(attrString)) && (attrString = regExp[1], 
                        regExp = regExp[2], "string" == typeof attrString) && "data-mce-bogus" === attrString.toLowerCase() ? regExp : null)) {
                            if ("all" === attrString) {
                                index = self.findEndTag(schema, html, tokenRegExp.lastIndex), 
                                tokenRegExp.lastIndex = index;
                                continue;
                            }
                            isValidElement = !1;
                        }
                        if (!validate || (elementRule = schema.getElementRule(value))) {
                            if (isValidElement = !0, validate && (validAttributesMap = elementRule.attributes, 
                            validAttributePatterns = elementRule.attributePatterns), 
                            (attribsValue = matches[8]) ? ((isInternalElement = -1 !== attribsValue.indexOf("data-mce-type")) && removeInternalElements && (isValidElement = !1), 
                            (attrList = []).map = {}, attribsValue.replace(attrRegExp, parseAttribute)) : (attrList = []).map = {}, 
                            validate && !isInternalElement) {
                                if (attributesRequired = elementRule.attributesRequired, 
                                attributesDefault = elementRule.attributesDefault, 
                                attributesForced = elementRule.attributesForced, 
                                elementRule.removeEmptyAttrs && !attrList.length && (isValidElement = !1), 
                                attributesForced) for (i = attributesForced.length; i--; ) name = (attr = attributesForced[i]).name, 
                                "{$uid}" === (attrValue = attr.value) && (attrValue = "mce_" + idCount++), 
                                attrList.map[name] = attrValue, attrList.push({
                                    name: name,
                                    value: attrValue
                                });
                                if (attributesDefault) for (i = attributesDefault.length; i--; ) (name = (attr = attributesDefault[i]).name) in attrList.map || ("{$uid}" === (attrValue = attr.value) && (attrValue = "mce_" + idCount++), 
                                attrList.map[name] = attrValue, attrList.push({
                                    name: name,
                                    value: attrValue
                                }));
                                if (attributesRequired) {
                                    for (i = attributesRequired.length; i-- && !(attributesRequired[i] in attrList.map); );
                                    -1 === i && (isValidElement = !1);
                                }
                                if (attr = attrList.map["data-mce-bogus"]) {
                                    if ("all" === attr) {
                                        index = self.findEndTag(schema, html, tokenRegExp.lastIndex), 
                                        tokenRegExp.lastIndex = index;
                                        continue;
                                    }
                                    isValidElement = !1;
                                }
                            }
                            isValidElement && self.start(value, attrList, isShortEnded);
                        } else isValidElement = !1;
                        if (regExp = specialElements[value]) {
                            regExp.lastIndex = index = matches.index + matches[0].length, 
                            index = (matches = regExp.exec(html)) ? (isValidElement && (text = html.substr(index, matches.index - index)), 
                            matches.index + matches[0].length) : (text = html.substr(index), 
                            html.length), isValidElement && (0 < text.length && self.text(text, !0), 
                            self.end(value)), tokenRegExp.lastIndex = index;
                            continue;
                        }
                        isShortEnded || (attribsValue && attribsValue.indexOf("/") == attribsValue.length - 1 ? isValidElement && self.end(value) : stack.push({
                            name: value,
                            valid: isValidElement
                        }));
                    } else if (value = matches[1]) self.comment(trimComments(processComment(value))); else if (value = matches[2]) {
                        if (!("xml" === format || settings.preserve_cdata || 0 < stack.length && schema.isValidChild(stack[stack.length - 1].name, "#cdata"))) {
                            index = function(value, startIndex) {
                                var startTag = value || "", isBogus = 0 !== startTag.indexOf("--"), endIndex = function(html, isBogus, startIndex) {
                                    var endIfIndex, lcHtml = html.toLowerCase();
                                    return -1 !== lcHtml.indexOf("[if ", startIndex) && function(html, startIndex) {
                                        return /^\s*\[if [\w\W]+\]>.*<!\[endif\](--!?)?>/.test(html.substr(startIndex));
                                    }(lcHtml, startIndex) ? (endIfIndex = lcHtml.indexOf("[endif]", startIndex), 
                                    lcHtml.indexOf(">", endIfIndex)) : isBogus ? -1 !== (endIfIndex = lcHtml.indexOf(">", startIndex)) ? endIfIndex : lcHtml.length : ((isBogus = /--!?>/).lastIndex = startIndex, 
                                    (endIfIndex = isBogus.exec(html)) ? endIfIndex.index + endIfIndex[0].length : lcHtml.length);
                                }(value, isBogus, startIndex);
                                return value = value.substr(startIndex, endIndex - startIndex), 
                                value = processComment(isBogus ? startTag + value : value), 
                                endIndex + 1;
                            }("", matches.index + 2), tokenRegExp.lastIndex = index;
                            continue;
                        }
                        self.cdata(trimComments(value));
                    } else (value = matches[3]) ? self.doctype(value) : (value = matches[4]) && self.pi(value, matches[5]);
                    index = matches.index + matches[0].length;
                }
                for (index < html.length && self.text(decode(html.substr(index))), 
                i = stack.length - 1; 0 <= i; i--) (value = stack[i]).valid && self.end(value.name);
            };
        };
    }(tinymce), function(tinymce) {
        var whiteSpaceRegExp = /^[ \t\r\n]*$/, typeLookup = {
            "#text": 3,
            "#comment": 8,
            "#cdata": 4,
            "#pi": 7,
            "#doctype": 10,
            "#document-fragment": 11
        };
        function walk(node, root_node, prev) {
            var sibling, parent, startName = prev ? "lastChild" : "firstChild", siblingName = prev ? "prev" : "next";
            if (node[startName]) return node[startName];
            if (node !== root_node) {
                if (sibling = node[siblingName]) return sibling;
                for (parent = node.parent; parent && parent !== root_node; parent = parent.parent) if (sibling = parent[siblingName]) return sibling;
            }
        }
        function Node(name, type) {
            this.name = name, 1 === (this.type = type) && (this.attributes = [], 
            this.attributes.map = {});
        }
        tinymce.extend(Node.prototype, {
            replace: function(node) {
                return node.parent && node.remove(), this.insert(node, this), this.remove(), 
                this;
            },
            attr: function(name, value) {
                var attrs, i;
                if ("string" != typeof name) {
                    for (i in name) this.attr(i, name[i]);
                    return this;
                }
                if (attrs = this.attributes) {
                    if (void 0 === value) return attrs.map[name];
                    if (null === value) {
                        if (name in attrs.map) for (delete attrs.map[name], i = attrs.length; i--; ) if (attrs[i].name === name) return attrs = attrs.splice(i, 1), 
                        this;
                    } else {
                        if (name in attrs.map) {
                            for (value = "" + value, i = attrs.length; i--; ) if (attrs[i].name === name) {
                                attrs[i].value = value;
                                break;
                            }
                        } else attrs.push({
                            name: name,
                            value: value
                        });
                        attrs.map[name] = value;
                    }
                    return this;
                }
            },
            addClass: function(str) {
                var self = this, cls = self.attr("class") || "";
                return str ? -1 === str.indexOf(" ") ? (self.hasClass(str) || (cls = tinymce.trim(cls + " " + str), 
                self.attr("class", cls)), cls) : void tinymce.each(str.split(" "), function(val) {
                    self.addClass(val);
                }) : cls;
            },
            hasClass: function(str) {
                return -1 !== (" " + (this.attr("class") || "") + " ").indexOf(" " + str + " ");
            },
            removeClass: function(str) {
                var self = this, cls = self.attr("class") || "";
                return str ? -1 === str.indexOf(" ") ? (self.hasClass(str) && ((cls = tinymce.trim((" " + cls + " ").replace(" " + str + " ", " "))) ? self.attr("class", cls) : self.attr("class", null)), 
                cls) : void tinymce.each(str.split(" "), function(val) {
                    self.removeClass(val);
                }) : cls;
            },
            clone: function(deep) {
                var i, l, selfAttrs, selfAttr, cloneAttrs, node, next, clone = new Node(this.name, this.type);
                if (selfAttrs = this.attributes) {
                    for ((cloneAttrs = []).map = {}, i = 0, l = selfAttrs.length; i < l; i++) "id" !== (selfAttr = selfAttrs[i]).name && (cloneAttrs[cloneAttrs.length] = {
                        name: selfAttr.name,
                        value: selfAttr.value
                    }, cloneAttrs.map[selfAttr.name] = selfAttr.value);
                    clone.attributes = cloneAttrs;
                }
                if (clone.value = this.value, clone.shortEnded = this.shortEnded, 
                deep) for (node = this.firstChild; node; ) next = node.next, clone.append(node), 
                node = next;
                return clone;
            },
            wrap: function(wrapper) {
                return this.parent.insert(wrapper, this), wrapper.append(this), 
                this;
            },
            unwrap: function() {
                for (var next, node = this.firstChild; node; ) next = node.next, 
                this.insert(node, this, !0), node = next;
                this.remove();
            },
            remove: function() {
                var parent = this.parent, next = this.next, prev = this.prev;
                return parent && (parent.firstChild === this ? (parent.firstChild = next) && (next.prev = null) : prev.next = next, 
                parent.lastChild === this ? (parent.lastChild = prev) && (prev.next = null) : next.prev = prev, 
                this.parent = this.next = this.prev = null), this;
            },
            append: function(node) {
                var last;
                return node.parent && node.remove(), (last = this.lastChild) ? ((last.next = node).prev = last, 
                this.lastChild = node) : this.lastChild = this.firstChild = node, 
                node.parent = this, node;
            },
            insert: function(node, ref_node, before) {
                var parent;
                return node.parent && node.remove(), parent = ref_node.parent || this, 
                before ? (ref_node === parent.firstChild ? parent.firstChild = node : ref_node.prev.next = node, 
                node.prev = ref_node.prev, (node.next = ref_node).prev = node) : (ref_node === parent.lastChild ? parent.lastChild = node : ref_node.next.prev = node, 
                node.next = ref_node.next, (node.prev = ref_node).next = node), 
                node.parent = parent, node;
            },
            getAll: function(name) {
                for (var collection = [], node = this.firstChild; node; node = walk(node, this)) node.name === name && collection.push(node);
                return collection;
            },
            empty: function() {
                var nodes, i, node;
                if (this.firstChild) {
                    for (nodes = [], node = this.firstChild; node; node = walk(node, this)) nodes.push(node);
                    for (i = nodes.length; i--; ) (node = nodes[i]).parent = node.firstChild = node.lastChild = node.next = node.prev = null;
                }
                return this.firstChild = this.lastChild = null, this;
            },
            isEmpty: function(elements) {
                var i, name, node = this.firstChild;
                if (node) do {
                    if (1 === node.type) {
                        if (node.attributes.map["data-mce-bogus"]) continue;
                        if (elements[node.name]) return !1;
                        for (i = node.attributes.length; i--; ) if ("name" == (name = node.attributes[i].name) || "id" == name || "class" == name || -1 != name.indexOf("-") && ("data-mce-bookmark" == name || -1 == name.indexOf("data-mce-"))) return !1;
                    }
                    if (8 === node.type) return !1;
                    if (3 === node.type && !whiteSpaceRegExp.test(node.value)) return !1;
                } while (node = walk(node, this));
                return !0;
            },
            walk: function(prev) {
                return walk(this, null, prev);
            }
        }), tinymce.extend(Node, {
            create: function(name, attrs) {
                var attrName, node = new Node(name, typeLookup[name] || 1);
                if (attrs) {
                    for (attrName in attrs) node.attr(attrName, attrs[attrName]);
                    return node;
                }
            }
        }), tinymce.html.Node = Node;
    }(tinymce), function(tinymce) {
        var Node = tinymce.html.Node, each = tinymce.each, explode = tinymce.explode, extend = tinymce.extend, makeMap = tinymce.makeMap;
        tinymce.html.DomParser = function(settings, schema) {
            var self = this, nodeFilters = {}, attributeFilters = [], matchedNodes = {}, matchedAttributes = {};
            (settings = settings || {}).validate = !("validate" in settings) || settings.validate, 
            settings.root_name = settings.root_name || "body", self.schema = schema = schema || new tinymce.html.Schema(), 
            self.filterNode = function(node) {
                var i, name, list;
                name in nodeFilters && ((list = matchedNodes[name]) ? list.push(node) : matchedNodes[name] = [ node ]), 
                i = attributeFilters.length;
                for (;i--; ) (name = attributeFilters[i].name) in node.attributes.map && ((list = matchedAttributes[name]) ? list.push(node) : matchedAttributes[name] = [ node ]);
                return node;
            }, self.addNodeFilter = function(name, callback) {
                each(explode(name), function(name) {
                    var list = nodeFilters[name];
                    list || (nodeFilters[name] = list = []), list.push(callback);
                });
            }, self.addAttributeFilter = function(name, callback) {
                each(explode(name), function(name) {
                    for (var i = 0; i < attributeFilters.length; i++) if (attributeFilters[i].name === name) return void attributeFilters[i].callbacks.push(callback);
                    attributeFilters.push({
                        name: name,
                        callbacks: [ callback ]
                    });
                });
            }, self.parse = function(html, args) {
                var parser, rootNode, node, nodes, i, l, fi, fl, list, name, validate, blockElements, startWhiteSpaceRegExp, isInWhiteSpacePreservedElement, endWhiteSpaceRegExp, allWhiteSpaceRegExp, isAllWhiteSpaceRegExp, whiteSpaceElements, children, nonEmptyElements, rootBlockName, invalidChildren = [];
                function createNode(name, type) {
                    var list, type = new Node(name, type);
                    return name in nodeFilters && ((list = matchedNodes[name]) ? list.push(type) : matchedNodes[name] = [ type ]), 
                    type;
                }
                function removeWhitespaceBefore(node) {
                    for (var textVal, blockElements = schema.getBlockElements(), textNode = node.prev; textNode && 3 === textNode.type; ) {
                        if (0 < (textVal = textNode.value.replace(endWhiteSpaceRegExp, "")).length) return textNode.value = textVal;
                        if (textVal = textNode.next) {
                            if (3 == textVal.type && textVal.value.length) {
                                textNode = textNode.prev;
                                continue;
                            }
                            if (!blockElements[textVal.name] && "script" != textVal.name && "style" != textVal.name) {
                                textNode = textNode.prev;
                                continue;
                            }
                        }
                        textVal = textNode.prev, textNode.remove(), textNode = textVal;
                    }
                }
                if (args = args || {}, matchedNodes = {}, matchedAttributes = {}, 
                blockElements = extend(makeMap("script,style,head,html,body,title,meta,param"), schema.getBlockElements()), 
                nonEmptyElements = schema.getNonEmptyElements(), children = schema.children, 
                validate = settings.validate, rootBlockName = ("forced_root_block" in args ? args : settings).forced_root_block, 
                whiteSpaceElements = schema.getWhiteSpaceElements(), startWhiteSpaceRegExp = /^[ \t\r\n]+/, 
                endWhiteSpaceRegExp = /[ \t\r\n]+$/, allWhiteSpaceRegExp = /[ \t\r\n]+/g, 
                isAllWhiteSpaceRegExp = /^[ \t\r\n]+$/, parser = new tinymce.html.SaxParser({
                    validate: validate,
                    allow_script_urls: settings.allow_script_urls,
                    allow_conditional_comments: settings.allow_conditional_comments,
                    allow_event_attributes: settings.allow_event_attributes,
                    self_closing_elements: function(input) {
                        var name, output = {};
                        for (name in input) "li" !== name && "p" != name && (output[name] = input[name]);
                        return output;
                    }(schema.getSelfClosingElements()),
                    cdata: function(text) {
                        node.append(createNode("#cdata", 4)).value = text;
                    },
                    text: function(text, raw) {
                        var textNode;
                        isInWhiteSpacePreservedElement || (text = text.replace(allWhiteSpaceRegExp, " "), 
                        node.lastChild && blockElements[node.lastChild.name] && (text = text.replace(startWhiteSpaceRegExp, ""))), 
                        0 !== text.length && ((textNode = createNode("#text", 3)).raw = !!raw, 
                        node.append(textNode).value = text);
                    },
                    comment: function(text) {
                        node.append(createNode("#comment", 8)).value = text;
                    },
                    pi: function(name, text) {
                        node.append(createNode(name, 7)).value = text, removeWhitespaceBefore(node);
                    },
                    doctype: function(text) {
                        node.append(createNode("#doctype", 10)).value = text, removeWhitespaceBefore(node);
                    },
                    start: function(name, attrs, empty) {
                        var newNode, attrFiltersLen, attrName, elementRule = validate ? schema.getElementRule(name) : {};
                        if (elementRule) {
                            for ((newNode = createNode(elementRule.outputName || name, 1)).attributes = attrs, 
                            newNode.shortEnded = empty, node.append(newNode), (elementRule = children[node.name]) && children[newNode.name] && !elementRule[newNode.name] && invalidChildren.push(newNode), 
                            attrFiltersLen = attributeFilters.length; attrFiltersLen--; ) (attrName = attributeFilters[attrFiltersLen].name) in attrs.map && ((list = matchedAttributes[attrName]) ? list.push(newNode) : matchedAttributes[attrName] = [ newNode ]);
                            blockElements[name] && removeWhitespaceBefore(newNode), 
                            empty || (node = newNode), !isInWhiteSpacePreservedElement && whiteSpaceElements[name] && (isInWhiteSpacePreservedElement = !0);
                        }
                    },
                    end: function(name) {
                        var textNode, text, sibling, elementRule = validate ? schema.getElementRule(name) : {};
                        if (elementRule) {
                            if (blockElements[name] && !isInWhiteSpacePreservedElement) {
                                if ((textNode = node.firstChild) && 3 === textNode.type) if (0 < (text = textNode.value.replace(startWhiteSpaceRegExp, "")).length) textNode.value = text, 
                                textNode = textNode.next; else for (sibling = textNode.next, 
                                textNode.remove(), textNode = sibling; textNode && 3 === textNode.type; ) text = textNode.value, 
                                sibling = textNode.next, 0 !== text.length && !isAllWhiteSpaceRegExp.test(text) || (textNode.remove(), 
                                textNode = sibling), textNode = sibling;
                                if ((textNode = node.lastChild) && 3 === textNode.type) if (0 < (text = textNode.value.replace(endWhiteSpaceRegExp, "")).length) textNode.value = text, 
                                textNode = textNode.prev; else for (sibling = textNode.prev, 
                                textNode.remove(), textNode = sibling; textNode && 3 === textNode.type; ) text = textNode.value, 
                                sibling = textNode.prev, 0 !== text.length && !isAllWhiteSpaceRegExp.test(text) || (textNode.remove(), 
                                textNode = sibling), textNode = sibling;
                            }
                            if (isInWhiteSpacePreservedElement && whiteSpaceElements[name] && (isInWhiteSpacePreservedElement = !1), 
                            (elementRule.removeEmpty || elementRule.paddEmpty) && node.isEmpty(nonEmptyElements)) if (elementRule.paddEmpty) node.empty().append(new Node("#text", "3")).value = "\xa0"; else if (!node.attributes.map.name && !node.attributes.map.id) return name = node.parent, 
                            blockElements[node.name] ? node.empty().remove() : node.unwrap(), 
                            void (node = name);
                            node = node.parent;
                        }
                    }
                }, schema), rootNode = node = new Node(args.context || settings.root_name, 11), 
                parser.parse(html), validate && invalidChildren.length && (args.context ? args.invalid = !0 : function(nodes) {
                    for (var node, parent, parents, newParent, currentNode, tempNode, childNode, i, sibling, nextNode, nonSplitableElements = makeMap("tr,td,th,tbody,thead,tfoot,table"), nonEmptyElements = schema.getNonEmptyElements(), textBlockElements = schema.getTextBlockElements(), specialElements = schema.getSpecialElements(), ni = 0; ni < nodes.length; ni++) if ((node = nodes[ni]).parent && !node.fixed) if (textBlockElements[node.name] && "li" == node.parent.name) {
                        for (sibling = node.next; sibling && textBlockElements[sibling.name]; ) sibling.name = "li", 
                        sibling.fixed = !0, node.parent.insert(sibling, node.parent), 
                        sibling = sibling.next;
                        node.unwrap(node);
                    } else {
                        for (parents = [ node ], parent = node.parent; parent && !schema.isValidChild(parent.name, node.name) && !nonSplitableElements[parent.name]; parent = parent.parent) parents.push(parent);
                        if (parent && 1 < parents.length) {
                            for (parents.reverse(), newParent = currentNode = self.filterNode(parents[0].clone()), 
                            i = 0; i < parents.length - 1; i++) {
                                for (schema.isValidChild(currentNode.name, parents[i].name) ? (tempNode = self.filterNode(parents[i].clone()), 
                                currentNode.append(tempNode)) : tempNode = currentNode, 
                                childNode = parents[i].firstChild; childNode && childNode != parents[i + 1]; ) nextNode = childNode.next, 
                                tempNode.append(childNode), childNode = nextNode;
                                currentNode = tempNode;
                            }
                            newParent.isEmpty(nonEmptyElements) ? parent.insert(node, parents[0], !0) : (parent.insert(newParent, parents[0], !0), 
                            parent.insert(node, newParent)), ((parent = parents[0]).isEmpty(nonEmptyElements) || parent.firstChild === parent.lastChild && "br" === parent.firstChild.name) && parent.empty().remove();
                        } else node.parent && ("li" === node.name ? !(sibling = node.prev) || "ul" !== sibling.name && "ul" !== sibling.name ? !(sibling = node.next) || "ul" !== sibling.name && "ul" !== sibling.name ? node.wrap(self.filterNode(new Node("ul", 1))) : sibling.insert(node, sibling.firstChild, !0) : sibling.append(node) : schema.isValidChild(node.parent.name, "div") && schema.isValidChild("div", node.name) ? node.wrap(self.filterNode(new Node("div", 1))) : specialElements[node.name] ? node.empty().remove() : node.unwrap());
                    }
                }(invalidChildren)), rootBlockName && ("body" == rootNode.name || args.isRootContent) && function() {
                    var next, rootBlockNode, node = rootNode.firstChild;
                    function trim(rootBlockNode) {
                        rootBlockNode && ((node = rootBlockNode.firstChild) && 3 == node.type && (node.value = node.value.replace(startWhiteSpaceRegExp, "")), 
                        node = rootBlockNode.lastChild) && 3 == node.type && (node.value = node.value.replace(endWhiteSpaceRegExp, ""));
                    }
                    if (schema.isValidChild(rootNode.name, rootBlockName.toLowerCase())) {
                        for (;node; ) next = node.next, 3 == node.type && tinymce.trim(node.value) || 1 == node.type && "p" !== node.name && !blockElements[node.name] && !node.attr("data-mce-type") ? (rootBlockNode || ((rootBlockNode = createNode(rootBlockName, 1)).attr(settings.forced_root_block_attrs), 
                        rootNode.insert(rootBlockNode, node)), rootBlockNode.append(node)) : (trim(rootBlockNode), 
                        rootBlockNode = null), node = next;
                        trim(rootBlockNode);
                    }
                }(), !args.invalid) {
                    for (name in matchedNodes) {
                        for (list = nodeFilters[name], fi = (nodes = matchedNodes[name]).length; fi--; ) nodes[fi].parent || nodes.splice(fi, 1);
                        for (i = 0, l = list.length; i < l; i++) list[i](nodes, name, args);
                    }
                    for (i = 0, l = attributeFilters.length; i < l; i++) if ((list = attributeFilters[i]).name in matchedAttributes) {
                        for (fi = (nodes = matchedAttributes[list.name]).length; fi--; ) nodes[fi].parent || nodes.splice(fi, 1);
                        for (fi = 0, fl = list.callbacks.length; fi < fl; fi++) list.callbacks[fi](nodes, list.name, args);
                    }
                }
                return rootNode;
            }, settings.remove_trailing_brs && self.addNodeFilter("br", function(nodes) {
                var i, node, parent, lastParent, prev, prevName, elementRule, l = nodes.length, blockElements = extend({}, schema.getBlockElements()), nonEmptyElements = schema.getNonEmptyElements();
                for (blockElements.body = 1, i = 0; i < l; i++) if (parent = (node = nodes[i]).parent, 
                blockElements[node.parent.name] && node === parent.lastChild) {
                    for (prev = node.prev; prev; ) {
                        if ("span" !== (prevName = prev.name) || "bookmark" !== prev.attr("data-mce-type")) {
                            if ("br" !== prevName) break;
                            if ("br" === prevName) {
                                node = null;
                                break;
                            }
                        }
                        prev = prev.prev;
                    }
                    !node || node.attributes.length && "data-mce-bogus" !== node.attributes[0].name || (node.remove(), 
                    parent.isEmpty(nonEmptyElements) && (elementRule = schema.getElementRule(parent.name)) && (elementRule.removeEmpty ? parent.remove() : elementRule.paddEmpty && (parent.empty().append(new Node("#text", 3)).value = "\xa0")));
                } else {
                    for (lastParent = node; parent && parent.firstChild === lastParent && parent.lastChild === lastParent && !blockElements[(lastParent = parent).name]; ) parent = parent.parent;
                    lastParent === parent && ((elementRule = new Node("#text", 3)).value = "\xa0", 
                    node.replace(elementRule));
                }
            }), self.addAttributeFilter("href", function(nodes) {
                var node, i = nodes.length;
                if (!settings.allow_unsafe_link_target) for (;i--; ) "a" === (node = nodes[i]).name && "_blank" === node.attr("target") && /:\/\//.test(node.attr("href")) && node.attr("rel", (node = (node = node.attr("rel")) ? tinymce.trim(node) : "", 
                /\b(noopener)\b/g.test(node) ? node : function(rel) {
                    return rel.split(" ").filter(function(p) {
                        return 0 < p.length;
                    }).concat([ "noopener" ]).sort().join(" ");
                }(node)));
            }), settings.allow_html_in_named_anchor || self.addAttributeFilter("id,name", function(nodes) {
                for (var sibling, prevSibling, parent, node, i = nodes.length; i--; ) if ("a" === (node = nodes[i]).name && node.firstChild && !node.attr("href")) for (parent = node.parent, 
                sibling = node.lastChild; prevSibling = sibling.prev, parent.insert(sibling, node), 
                sibling = prevSibling; );
            }), settings.validate && schema.getValidClasses() && self.addAttributeFilter("class", function(nodes) {
                for (var node, classList, ci, className, classValue, validClassesMap, valid, i = nodes.length, validClasses = schema.getValidClasses(); i--; ) {
                    for (classList = (node = nodes[i]).attr("class").split(" "), 
                    classValue = "", ci = 0; ci < classList.length; ci++) className = classList[ci], 
                    valid = !1, (validClassesMap = validClasses["*"]) && validClassesMap[className] && (valid = !0), 
                    validClassesMap = validClasses[node.name], (valid = !(valid || !validClassesMap || !validClassesMap[className]) || valid) && (classValue && (classValue += " "), 
                    classValue += className);
                    classValue.length || (classValue = null), node.attr("class", classValue);
                }
            });
        };
    }(tinymce), function(tinymce) {
        tinymce.html.Serializer = function(settings, schema) {
            var writer = new tinymce.html.Writer(settings, schema);
            (settings = settings || {}).validate = !("validate" in settings) || settings.validate, 
            this.schema = schema = schema || new tinymce.html.Schema(), this.writer = writer, 
            this.serialize = function(node) {
                var handlers, validate;
                function walk(node) {
                    var isEmpty, attrs, attrName, attrValue, sortedAttrs, i, l, elementRule, handler = handlers[node.type];
                    if (handler) handler(node); else {
                        if (handler = node.name, isEmpty = node.shortEnded, attrs = node.attributes, 
                        validate && attrs && 1 < attrs.length) {
                            if ((sortedAttrs = []).map = {}, !(elementRule = schema.getElementRule(node.name))) return;
                            for (i = 0, l = elementRule.attributesOrder.length; i < l; i++) (attrName = elementRule.attributesOrder[i]) in attrs.map && (attrValue = attrs.map[attrName], 
                            sortedAttrs.map[attrName] = attrValue, sortedAttrs.push({
                                name: attrName,
                                value: attrValue
                            }));
                            for (i = 0, l = attrs.length; i < l; i++) (attrName = attrs[i].name) in sortedAttrs.map || (attrValue = attrs.map[attrName], 
                            sortedAttrs.map[attrName] = attrValue, sortedAttrs.push({
                                name: attrName,
                                value: attrValue
                            }));
                            attrs = sortedAttrs;
                        }
                        if (writer.start(node.name, attrs, isEmpty), !isEmpty) {
                            if (node = node.firstChild) for (;walk(node), node = node.next; );
                            writer.end(handler);
                        }
                    }
                }
                return validate = settings.validate, handlers = {
                    3: function(node) {
                        writer.text(node.value, node.raw);
                    },
                    8: function(node) {
                        writer.comment(node.value);
                    },
                    7: function(node) {
                        writer.pi(node.name, node.value);
                    },
                    10: function(node) {
                        writer.doctype(node.value);
                    },
                    4: function(node) {
                        writer.cdata(node.value);
                    },
                    11: function(node) {
                        if (node = node.firstChild) for (;walk(node), node = node.next; );
                    }
                }, writer.reset(), 1 != node.type || settings.inner ? handlers[11](node) : walk(node), 
                writer.getContent();
            };
        };
    }(tinymce), tinymce.html.Writer = function(settings, schema) {
        var html = [], makeMap = tinymce.makeMap, Entities = tinymce.html.Entities, indent = (settings = settings || {}).indent, indentBefore = makeMap(settings.indent_before || ""), indentAfter = makeMap(settings.indent_after || ""), encode = Entities.getEncodeFunc(settings.entity_encoding || "raw", settings.entities), htmlOutput = "html" == settings.element_format;
        return {
            start: function(name, attrs, empty) {
                var i, l, attr, value;
                if (indent && indentBefore[name] && 0 < html.length && 0 < (value = html[html.length - 1]).length && "\n" !== value && html.push("\n"), 
                html.push("<", name), attrs) for (i = 0, l = attrs.length; i < l; i++) (attr = attrs[i]).boolean ? html.push(" ", attr.name) : html.push(" ", attr.name, '="', encode("" + attr.value, !0), '"');
                !empty || htmlOutput || "html5-strict" == settings.schema ? html[html.length] = ">" : html[html.length] = " />", 
                empty && indent && indentAfter[name] && 0 < html.length && 0 < (value = html[html.length - 1]).length && "\n" !== value && html.push("\n");
            },
            end: function(name) {
                html.push("</", name, ">"), indent && indentAfter[name] && 0 < html.length && 0 < (name = html[html.length - 1]).length && "\n" !== name && html.push("\n");
            },
            text: function(text, raw) {
                0 < text.length && (html[html.length] = raw ? text : encode(text));
            },
            cdata: function(text) {
                html.push("<![CDATA[", text, "]]>");
            },
            comment: function(text) {
                html.push("\x3c!--", text, "--\x3e");
            },
            pi: function(name, text) {
                text ? html.push("<?", name, " ", encode(text), "?>") : html.push("<?", name, "?>"), 
                indent && html.push("\n");
            },
            doctype: function(text) {
                html.push("<!DOCTYPE", text, ">", indent ? "\n" : "");
            },
            reset: function() {
                html.length = 0;
            },
            getContent: function() {
                return html.join("").replace(/\n$/, "");
            }
        };
    }, function(tinymce) {
        function clone(rect) {
            return rect ? {
                left: round(rect.left),
                top: round(rect.top),
                bottom: round(rect.bottom),
                right: round(rect.right),
                width: round(rect.width),
                height: round(rect.height)
            } : {
                left: 0,
                top: 0,
                bottom: 0,
                right: 0,
                width: 0,
                height: 0
            };
        }
        function isValidOverflow(overflowY, clientRect1, clientRect2) {
            return 0 <= overflowY && overflowY <= Math.min(clientRect1.height, clientRect2.height) / 2;
        }
        function isAbove(clientRect1, clientRect2) {
            return clientRect1.bottom - clientRect1.height / 2 < clientRect2.top || !(clientRect1.top > clientRect2.bottom) && isValidOverflow(clientRect2.top - clientRect1.bottom, clientRect1, clientRect2);
        }
        function isBelow(clientRect1, clientRect2) {
            return clientRect1.top > clientRect2.bottom || !(clientRect1.bottom < clientRect2.top) && isValidOverflow(clientRect2.bottom - clientRect1.top, clientRect1, clientRect2);
        }
        function isLeft(clientRect1, clientRect2) {
            return clientRect1.left < clientRect2.left;
        }
        function isRight(clientRect1, clientRect2) {
            return clientRect1.right > clientRect2.right;
        }
        var round = Math.round;
        tinymce.geom.ClientRect = {
            clone: clone,
            collapse: function(clientRect, toStart) {
                return clientRect = clone(clientRect), toStart || (clientRect.left = clientRect.left + clientRect.width), 
                clientRect.right = clientRect.left, clientRect.width = 0, clientRect;
            },
            isEqual: function(rect1, rect2) {
                return rect1.left === rect2.left && rect1.top === rect2.top && rect1.bottom === rect2.bottom && rect1.right === rect2.right;
            },
            isAbove: isAbove,
            isBelow: isBelow,
            isLeft: isLeft,
            isRight: isRight,
            compare: function(clientRect1, clientRect2) {
                return isAbove(clientRect1, clientRect2) ? -1 : isBelow(clientRect1, clientRect2) ? 1 : isLeft(clientRect1, clientRect2) ? -1 : isRight(clientRect1, clientRect2) ? 1 : 0;
            },
            containsXY: function(clientRect, clientX, clientY) {
                return clientX >= clientRect.left && clientX <= clientRect.right && clientY >= clientRect.top && clientY <= clientRect.bottom;
            }
        };
    }(tinymce), function(tinymce) {
        function relativePosition(rect, targetRect, rel) {
            var x = targetRect.x, y = targetRect.y, w = rect.w, rect = rect.h, targetW = targetRect.w, targetRect = targetRect.h;
            return "b" === (rel = (rel || "").split(""))[0] && (y += targetRect), 
            "r" === rel[1] && (x += targetW), "c" === rel[0] && (y += round(targetRect / 2)), 
            "c" === rel[1] && (x += round(targetW / 2)), "b" === rel[3] && (y -= rect), 
            "r" === rel[4] && (x -= w), "c" === rel[3] && (y -= round(rect / 2)), 
            "c" === rel[4] && (x -= round(w / 2)), create(x, y, w, rect);
        }
        function create(x, y, w, h) {
            return {
                x: x,
                y: y,
                w: w,
                h: h
            };
        }
        var min = Math.min, max = Math.max, round = Math.round;
        tinymce.geom.Rect = {
            inflate: function(rect, w, h) {
                return create(rect.x - w, rect.y - h, rect.w + 2 * w, rect.h + 2 * h);
            },
            relativePosition: relativePosition,
            findBestRelativePosition: function(rect, targetRect, constrainRect, rels) {
                for (var pos, i = 0; i < rels.length; i++) if ((pos = relativePosition(rect, targetRect, rels[i])).x >= constrainRect.x && pos.x + pos.w <= constrainRect.w + constrainRect.x && pos.y >= constrainRect.y && pos.y + pos.h <= constrainRect.h + constrainRect.y) return rels[i];
                return null;
            },
            intersect: function(rect, cropRect) {
                var x1 = max(rect.x, cropRect.x), y1 = max(rect.y, cropRect.y), x2 = min(rect.x + rect.w, cropRect.x + cropRect.w), rect = min(rect.y + rect.h, cropRect.y + cropRect.h);
                return x2 - x1 < 0 || rect - y1 < 0 ? null : create(x1, y1, x2 - x1, rect - y1);
            },
            clamp: function(rect, clampRect, fixedSize) {
                var x1 = rect.x, y1 = rect.y, x2 = rect.x + rect.w, rect = rect.y + rect.h, cx2 = clampRect.x + clampRect.w, cy2 = clampRect.y + clampRect.h, underflowX1 = max(0, clampRect.x - x1), clampRect = max(0, clampRect.y - y1), cx2 = max(0, x2 - cx2), cy2 = max(0, rect - cy2);
                return x1 += underflowX1, y1 += clampRect, fixedSize && (x2 += underflowX1, 
                rect += clampRect, x1 -= cx2, y1 -= cy2), create(x1, y1, (x2 -= cx2) - x1, (rect -= cy2) - y1);
            },
            create: create,
            fromClientRect: function(clientRect) {
                return create(clientRect.left, clientRect.top, clientRect.width, clientRect.height);
            }
        };
    }(tinymce), tinymce.dom = {}, Fun = tinymce.dom, mouseEventRe = /^(?:mouse|contextmenu)|click/, 
    deprecated = {
        keyLocation: 1,
        layerX: 1,
        layerY: 1,
        returnValue: 1,
        webkitMovementX: 1,
        webkitMovementY: 1,
        keyIdentifier: 1,
        mozPressure: 1,
        path: 1
    }, Fun.EventUtils = EventUtils, Fun.Event = new EventUtils(), Fun.Event.bind(window, "ready", function() {}), 
    tinymce.dom.TreeWalker = function(startNode, rootNode) {
        var node = startNode;
        function findSibling(node, startName, siblingName, shallow) {
            var sibling, parent;
            if (node) {
                if (!shallow && node[startName]) return node[startName];
                if (node != rootNode) {
                    if (sibling = node[siblingName]) return sibling;
                    for (parent = node.parentNode; parent && parent != rootNode; parent = parent.parentNode) if (sibling = parent[siblingName]) return sibling;
                }
            }
        }
        this.current = function() {
            return node;
        }, this.next = function(shallow) {
            return node = findSibling(node, "firstChild", "nextSibling", shallow);
        }, this.prev = function(shallow) {
            return node = findSibling(node, "lastChild", "previousSibling", shallow);
        }, this.prev2 = function(shallow) {
            return node = function(node, siblingName, shallow) {
                var child;
                if (node && (siblingName = node[siblingName], !rootNode || siblingName !== rootNode)) {
                    if (siblingName) {
                        if (!shallow) for (child = siblingName.lastChild; child; child = child.lastChild) if (!child.lastChild) return child;
                        return siblingName;
                    }
                    return (shallow = node.parentNode) && shallow !== rootNode ? shallow : void 0;
                }
            }(node, "previousSibling", shallow);
        };
    }, function(tinymce) {
        var each = tinymce.each, is = tinymce.is, isWebKit = tinymce.isWebKit, isIE = tinymce.isIE, Entities = tinymce.html.Entities, simpleSelectorRe = /^([a-z0-9],?)+$/i, whiteSpaceRegExp = /^[ \t\r\n]*$/;
        tinymce.dom.DOMUtils = function(d, s) {
            var blockElementsMap;
            this.doc = d, this.win = window, this.files = {}, this.cssFlicker = !1, 
            this.counter = 0, this.stdMode = !tinymce.isIE || 8 <= d.documentMode, 
            this.boxModel = !tinymce.isIE || "CSS1Compat" == d.compatMode || this.stdMode, 
            this.hasOuterHTML = "outerHTML" in d.createElement("a"), this.settings = s = tinymce.extend({
                keep_values: !1,
                hex_colors: 1
            }, s), this.schema = s.schema, this.styles = new tinymce.html.Styles({
                url_converter: s.url_converter,
                url_converter_scope: s.url_converter_scope
            }, s.schema), this.events = s.ownEvents ? new tinymce.dom.EventUtils(s.proxy) : tinymce.dom.Event, 
            tinymce.addUnload(this.destroy, this), blockElementsMap = s.schema ? s.schema.getBlockElements() : {}, 
            this.isBlock = function(node) {
                var type;
                return !(!node || ((type = node.nodeType) ? 1 !== type || !blockElementsMap[node.nodeName] : !blockElementsMap[node]));
            };
        }, tinymce.dom.DOMUtils.prototype = {
            doc: null,
            root: null,
            files: null,
            pixelStyles: /^(top|left|bottom|right|width|height|maxWidth|maxHeight|minWidth|minHeight|borderWidth)$/,
            props: {
                for: "htmlFor",
                class: "className",
                className: "className",
                checked: "checked",
                disabled: "disabled",
                maxlength: "maxLength",
                readonly: "readOnly",
                selected: "selected",
                value: "value",
                id: "id",
                name: "name",
                type: "type"
            },
            clone: function(node, deep) {
                var clone, doc, self = this;
                return !isIE || tinymce.isIE11 || 1 !== node.nodeType || deep ? node.cloneNode(deep) : (doc = self.doc, 
                deep ? clone.firstChild : (clone = doc.createElement(node.nodeName), 
                each(self.getAttribs(node), function(attr) {
                    self.setAttrib(clone, attr.nodeName, self.getAttrib(node, attr.nodeName));
                }), clone));
            },
            getRoot: function() {
                var s = this.settings;
                return s && this.get(s.root_element) || this.doc.body;
            },
            getViewPort: function(w) {
                var d = (w = w || this.win).document, d = this.boxModel ? d.documentElement : d.body;
                return {
                    x: w.pageXOffset || d.scrollLeft,
                    y: w.pageYOffset || d.scrollTop,
                    w: w.innerWidth || d.clientWidth,
                    h: w.innerHeight || d.clientHeight
                };
            },
            getRect: function(e) {
                var p;
                return e = this.get(e), p = this.getPos(e), e = this.getSize(e), 
                {
                    x: p.x,
                    y: p.y,
                    w: e.w,
                    h: e.h
                };
            },
            getSize: function(e) {
                var w, h;
                return e = this.get(e), w = this.getStyle(e, "width"), h = this.getStyle(e, "height"), 
                -1 === w.indexOf("px") && (w = 0), -1 === h.indexOf("px") && (h = 0), 
                {
                    w: parseInt(w, 10) || e.offsetWidth || e.clientWidth,
                    h: parseInt(h, 10) || e.offsetHeight || e.clientHeight
                };
            },
            getParent: function(n, f, r) {
                return this.getParents(n, f, r, !1);
            },
            getParents: function(n, f, r, c) {
                var na, self = this, se = self.settings, o = [];
                for (n = self.get(n), c = void 0 === c, se.strict_root && (r = r || self.getRoot()), 
                is(f, "string") && (f = "*" === (na = f) ? function(n) {
                    return 1 == n.nodeType;
                } : function(n) {
                    return self.is(n, na);
                }); n && n != r && n.nodeType && 9 !== n.nodeType; ) {
                    if (!f || f(n)) {
                        if (!c) return n;
                        o.push(n);
                    }
                    n = n.parentNode;
                }
                return c ? o : null;
            },
            get: function(e) {
                var n;
                return e && this.doc && "string" == typeof e && (n = e, e = this.doc.getElementById(e)) && e.id !== n ? this.doc.getElementsByName(n)[1] : e;
            },
            getNext: function(node, selector) {
                return this._findSib(node, selector, "nextSibling");
            },
            getPrev: function(node, selector) {
                return this._findSib(node, selector, "previousSibling");
            },
            select: function(selector, scope) {
                return tinymce.dom.Sizzle(selector, this.get(scope) || this.get(this.settings.root_element) || this.doc, []);
            },
            unique: function(arr) {
                return tinymce.dom.Sizzle.uniqueSort(arr);
            },
            is: function(elm, selector) {
                var i, elms;
                if (void 0 === elm.length) {
                    if ("*" === selector) return 1 == elm.nodeType;
                    if (simpleSelectorRe.test(selector)) {
                        for (selector = selector.toLowerCase().split(/,/), elm = elm.nodeName.toLowerCase(), 
                        i = selector.length - 1; 0 <= i; i--) if (selector[i] == elm) return !0;
                        return !1;
                    }
                }
                return (!elm.nodeType || 1 == elm.nodeType) && (elms = elm.nodeType ? [ elm ] : elm, 
                0 < tinymce.dom.Sizzle(selector, elms[0].ownerDocument || elms[0], null, elms).length);
            },
            closest: function(n, selector) {
                for (var result = []; n; ) {
                    if ("string" == typeof selector && this.is(n, selector)) {
                        result.push(n);
                        break;
                    }
                    if (n === selector) {
                        result.push(n);
                        break;
                    }
                    n = n.parentNode;
                }
                return result;
            },
            contains: function(context, elm) {
                return tinymce.dom.Sizzle.contains(context, elm);
            },
            add: function(p, n, a, h, c) {
                var self = this;
                return this.run(p, function(p) {
                    var e = is(n, "string") ? self.doc.createElement(n) : n;
                    return self.setAttribs(e, a), h && (h.nodeType ? e.appendChild(h) : self.setHTML(e, h)), 
                    c ? e : p.appendChild(e);
                });
            },
            create: function(n, a, h) {
                return this.add(this.doc.createElement(n), n, a, h, 1);
            },
            wrap: function(elements, wrapper, all) {
                var lastParent, newWrapper;
                return wrapper = this.get(wrapper), this.run(elements, function(elm) {
                    all && lastParent == elm.parentNode || (lastParent = elm.parentNode, 
                    newWrapper = wrapper.cloneNode(!1), elm.parentNode.insertBefore(newWrapper, elm)), 
                    newWrapper.appendChild(elm);
                });
            },
            createHTML: function(n, a, h) {
                var k, o = "";
                for (k in o += "<" + n, a) a.hasOwnProperty(k) && "" != a[k] && (o += " " + k + '="' + this.encode(a[k]) + '"');
                return void 0 !== h ? o + ">" + h + "</" + n + ">" : o + " />";
            },
            createFragment: function(html) {
                var node, doc = this.doc, container = doc.createElement("div"), frag = doc.createDocumentFragment();
                for (frag.appendChild(container), html && (container.innerHTML = html); node = container.firstChild; ) frag.appendChild(node);
                return frag.removeChild(container), frag;
            },
            remove: function(node, keep_children) {
                return this.run(node, function(node) {
                    var child, parent = node.parentNode;
                    if (!parent) return null;
                    if (keep_children) for (;child = node.firstChild; ) !tinymce.isIE || 3 !== child.nodeType || child.nodeValue ? parent.insertBefore(child, node) : node.removeChild(child);
                    return parent.removeChild(node);
                });
            },
            empty: function(node) {
                return this.run(node, function(node) {
                    for (var n, i = node.length; i--; ) for (n = node[i]; n.firstChild; ) n.removeChild(n.firstChild);
                    return !0;
                });
            },
            setStyle: function(n, na, v) {
                var self = this;
                return self.run(n, function(e) {
                    var s = e.style;
                    na = na.replace(/-(\D)/g, function(a, b) {
                        return b.toUpperCase();
                    }), self.pixelStyles.test(na) && (tinymce.is(v, "number") || /^[\-0-9\.]+$/.test(v)) && (v += "px"), 
                    s[na = "float" == na ? tinymce.isIE && tinymce.isIE < 12 ? "styleFloat" : "cssFloat" : na] = v || "", 
                    self.settings.update_styles && (v = self.serializeStyle(self.parseStyle(e.style.cssText), e.nodeName), 
                    self.setAttrib(e, "data-mce-style", v));
                });
            },
            getStyle: function(n, na, c) {
                if (n = this.get(n)) {
                    if (this.doc.defaultView && c) {
                        na = na.replace(/[A-Z]/g, function(a) {
                            return "-" + a;
                        });
                        try {
                            return this.doc.defaultView.getComputedStyle(n, null).getPropertyValue(na);
                        } catch (ex) {
                            return null;
                        }
                    }
                    return "float" == (na = na.replace(/-(\D)/g, function(a, b) {
                        return b.toUpperCase();
                    })) && (na = "cssFloat"), n.currentStyle && c ? n.currentStyle[na] : n.style ? n.style[na] : void 0;
                }
            },
            setStyles: function(e, o) {
                var v, self = this, s = self.settings, ol = s.update_styles;
                s.update_styles = 0, this.run(e, function(e) {
                    each(o, function(v, n) {
                        self.setStyle(e, n, v);
                    }), ol && (v = self.serializeStyle(self.parseStyle(e.style.cssText), e.nodeName), 
                    self.setAttrib(e, "data-mce-style", v));
                }), s.update_styles = ol;
            },
            removeAllAttribs: function(e) {
                return this.run(e, function(e) {
                    for (var attrs = e.attributes, i = attrs.length - 1; 0 <= i; i--) e.removeAttributeNode(attrs.item(i));
                });
            },
            removeAttrib: function(e, n) {
                if (e && n) return this.settings.strict && (n = n.toLowerCase()), 
                this.run(e, function(e) {
                    e.removeAttribute(n, 2);
                });
            },
            setAttrib: function(e, n, v) {
                var self = this;
                if (e && n) return self.settings.strict && (n = n.toLowerCase()), 
                this.run(e, function(e) {
                    var s = self.settings, originalValue = e.getAttribute(n);
                    if (null !== v) switch (n) {
                      case "style":
                        if (!is(v, "string")) return void each(v, function(v, n) {
                            self.setStyle(e, n, v);
                        });
                        s.keep_values && (v && !self._isRes(v) ? e.setAttribute("data-mce-style", v, 2) : e.removeAttribute("data-mce-style", 2)), 
                        e.style.cssText = v;
                        break;

                      case "class":
                        e.className = v || "";
                        break;

                      case "src":
                      case "href":
                        s.keep_values && (s.url_converter && (v = s.url_converter.call(s.url_converter_scope || self, v, n, e)), 
                        self.setAttrib(e, "data-mce-" + n, v, 2));
                        break;

                      case "shape":
                        e.setAttribute("data-mce-style", v);
                    }
                    is(v) && null !== v && 0 !== v.length ? e.setAttribute(n, "" + v, 2) : e.removeAttribute(n, 2), 
                    tinymce.activeEditor && originalValue != v && (originalValue = tinymce.activeEditor).onSetAttrib.dispatch(originalValue, e, n, v);
                });
            },
            setAttribs: function(e, o) {
                var self = this;
                return this.run(e, function(e) {
                    each(o, function(v, n) {
                        self.setAttrib(e, n, v);
                    });
                });
            },
            getAttrib: function(e, n, dv) {
                var v;
                if (!(e = this.get(e)) || 1 !== e.nodeType) return void 0 !== dv && dv;
                if (is(dv) || (dv = ""), /^(src|href|style|coords|shape)$/.test(n) && (v = e.getAttribute("data-mce-" + n))) return v;
                if (v = (v = isIE && this.props[n] && (v = e[this.props[n]]) && v.nodeValue ? v.nodeValue : v) || e.getAttribute(n, 2), 
                /^(checked|compact|declare|defer|disabled|ismap|multiple|nohref|noshade|nowrap|readonly|selected)$/.test(n)) return !0 === e[this.props[n]] && "" === v || v ? n : "";
                if ("FORM" === e.nodeName && e.getAttributeNode(n)) return e.getAttributeNode(n).nodeValue;
                if ("style" === n && (v = v || e.style.cssText) && (v = this.serializeStyle(this.parseStyle(v), e.nodeName), 
                this.settings.keep_values) && !this._isRes(v) && e.setAttribute("data-mce-style", v), 
                isWebKit && "class" === n && (v = v && v.replace(/(apple|webkit)\-[a-z\-]+/gi, "")), 
                isIE) switch (n) {
                  case "rowspan":
                  case "colspan":
                    1 === v && (v = "");
                    break;

                  case "size":
                    "+0" !== v && 20 !== v && 0 !== v || (v = "");
                    break;

                  case "width":
                  case "height":
                  case "vspace":
                  case "checked":
                  case "disabled":
                  case "readonly":
                    0 === v && (v = "");
                    break;

                  case "hspace":
                    -1 === v && (v = "");
                    break;

                  case "maxlength":
                  case "tabindex":
                    32768 !== v && 2147483647 !== v && "32768" !== v || (v = "");
                    break;

                  case "multiple":
                  case "compact":
                  case "noshade":
                  case "nowrap":
                    return 65535 === v ? n : dv;

                  case "shape":
                    v = v.toLowerCase();
                    break;

                  default:
                    0 === n.indexOf("on") && (v = v && (v = "" + v).replace(/^function\s+\w+\(\)\s+\{\s+(.*)\s+\}$/, "$1"));
                }
                return null != v && "" !== v ? "" + v : dv;
            },
            setValue: function(n, value) {
                if (!(n = this.get(n)) || 1 !== n.nodeType) return null;
                "SELECT" === n.nodeName ? each(this.select('option[value="' + value + '"]', n), function(elm) {
                    elm.selected = !0;
                }) : n.value = value;
            },
            getValue: function(n) {
                return (n = this.get(n)) && 1 === n.nodeType ? "SELECT" === n.nodeName ? null == n.options || -1 === n.selectedIndex ? "" : n.options[n.selectedIndex].value : n.value : null;
            },
            getPos: function(n, ro) {
                var r, x = 0, y = 0, d = this.doc, body = d.body;
                if (ro = ro || body, n = this.get(n)) {
                    if (ro === body && n.getBoundingClientRect && "static" === this.getStyle(body, "position")) return n = n.getBoundingClientRect(), 
                    body = this.boxModel ? d.documentElement : d.body, {
                        x: x = n.left + (d.documentElement.scrollLeft || d.body.scrollLeft) - body.clientTop,
                        y: y = n.top + (d.documentElement.scrollTop || d.body.scrollTop) - body.clientLeft
                    };
                    for (r = n; r && r != ro && r.nodeType; ) x += r.offsetLeft || 0, 
                    y += r.offsetTop || 0, r = r.offsetParent;
                    for (r = n.parentNode; r && r != ro && r.nodeType; ) x -= r.scrollLeft || 0, 
                    y -= r.scrollTop || 0, r = r.parentNode;
                }
                return {
                    x: x,
                    y: y
                };
            },
            parseStyle: function(st) {
                return this.styles.parse(st);
            },
            serializeStyle: function(o, name) {
                return this.styles.serialize(o, name);
            },
            addStyle: function(cssText) {
                var head, doc = this.doc, styleElm = doc.getElementById("mceDefaultStyles");
                styleElm || ((styleElm = doc.createElement("style")).id = "mceDefaultStyles", 
                styleElm.type = "text/css", (head = doc.getElementsByTagName("head")[0]).firstChild ? head.insertBefore(styleElm, head.firstChild) : head.appendChild(styleElm)), 
                styleElm.styleSheet ? styleElm.styleSheet.cssText += cssText : styleElm.appendChild(doc.createTextNode(cssText));
            },
            loadCSS: function(u) {
                var head, self = this, d = self.doc;
                u = u || "", head = d.getElementsByTagName("head")[0], each(u.split(","), function(u) {
                    self.files[u] || (self.files[u] = !0, u = self.create("link", {
                        rel: "stylesheet",
                        "data-cfasync": !1,
                        href: tinymce._addVer(u)
                    }), head.appendChild(u));
                });
            },
            addClass: function(e, c) {
                return c ? this.run(e, function(e) {
                    var value = c, value = Array.isArray(value) ? value : "string" == typeof value ? value.split(" ") : [];
                    return each(value, function(cls) {
                        if (cls.trim(), !cls) return !0;
                        e.classList.add(cls);
                    }), e.className;
                }) : "";
            },
            removeClass: function(e, c) {
                return this.run(e, function(e) {
                    return e.classList.remove(c), e.className || (e.removeAttribute("class"), 
                    e.removeAttribute("className")), e.className;
                });
            },
            hasClass: function(n, c) {
                return !(!(n = this.get(n)) || !c) && n.classList && n.classList.contains(c);
            },
            toggleClass: function(n, c) {
                return !(!(n = this.get(n)) || !c) && (this.hasClass(n, c) ? this.removeClass(n, c) : this.addClass(n, c));
            },
            show: function(e) {
                return this.setStyle(e, "display", "block");
            },
            hide: function(e) {
                return this.setStyle(e, "display", "none");
            },
            isHidden: function(e) {
                return !(e = this.get(e)) || "none" == e.style.display || "none" == this.getStyle(e, "display");
            },
            uniqueId: function(p) {
                return (p || "mce_") + this.counter++;
            },
            setHTML: function(element, html) {
                var self = this;
                return self.run(element, function(element) {
                    if (isIE) {
                        for (;element.firstChild; ) element.removeChild(element.firstChild);
                        try {
                            element.innerHTML = "<br />" + html, element.removeChild(element.firstChild);
                        } catch (ex) {
                            var newElement = self.create("div");
                            newElement.innerHTML = "<br />" + html, each(tinymce.grep(newElement.childNodes), function(node, i) {
                                i && element.canHaveHTML && element.appendChild(node);
                            });
                        }
                    } else element.innerHTML = html;
                    return html;
                });
            },
            getOuterHTML: function(elm) {
                var doc;
                return (elm = this.get(elm)) ? 1 === elm.nodeType ? elm.outerHTML : ((doc = (elm.ownerDocument || this.doc).createElement("body")).appendChild(elm.cloneNode(!0)), 
                doc.innerHTML) : null;
            },
            setOuterHTML: function(e, h, d) {
                var self = this;
                function setHTML(e, h, d) {
                    var n;
                    for ((d = d.createElement("body")).innerHTML = h, n = d.lastChild; n; ) self.insertAfter(n.cloneNode(!0), e), 
                    n = n.previousSibling;
                    self.remove(e);
                }
                return this.run(e, function(e) {
                    if (1 == (e = self.get(e)).nodeType) if (d = d || e.ownerDocument || self.doc, 
                    isIE) try {
                        isIE && 1 == e.nodeType ? e.outerHTML = h : setHTML(e, h, d);
                    } catch (ex) {
                        setHTML(e, h, d);
                    } else setHTML(e, h, d);
                });
            },
            decode: Entities.decode,
            encode: Entities.encodeAllRaw,
            insertAfter: function(node, reference_node) {
                return reference_node = this.get(reference_node), this.run(node, function(node) {
                    var parent = reference_node.parentNode, nextSibling = reference_node.nextSibling;
                    return nextSibling ? parent.insertBefore(node, nextSibling) : parent.appendChild(node), 
                    node;
                });
            },
            insertBefore: function(node, reference_node) {
                return reference_node = this.get(reference_node), this.run(node, function(node) {
                    return reference_node.parentNode.insertBefore(node, reference_node), 
                    node;
                });
            },
            replace: function(n, o, k) {
                return is(o, "array") && (n = n.cloneNode(!0)), this.run(o, function(o) {
                    return k && each(tinymce.grep(o.childNodes), function(c) {
                        n.appendChild(c);
                    }), o.parentNode.replaceChild(n, o);
                });
            },
            rename: function(elm, name) {
                var newElm, self = this;
                return elm.nodeName != name.toUpperCase() && (newElm = self.create(name), 
                each(self.getAttribs(elm), function(attr_node) {
                    self.setAttrib(newElm, attr_node.nodeName, self.getAttrib(elm, attr_node.nodeName));
                }), self.replace(newElm, elm, 1)), newElm || elm;
            },
            findCommonAncestor: function(a, b) {
                for (var pe, ps = a; ps; ) {
                    for (pe = b; pe && ps != pe; ) pe = pe.parentNode;
                    if (ps == pe) break;
                    ps = ps.parentNode;
                }
                return !ps && a.ownerDocument ? a.ownerDocument.documentElement : ps;
            },
            toHex: function(s) {
                var c = (s = s.replace(/\s/g, "").replace(/(rgb|rgba)\(/i, "").replace(/\)/, "").replace(/\s/g, "")).split(",");
                function hex(s) {
                    return 1 < (s = parseInt(s, 10).toString(16)).length ? s : "0" + s;
                }
                return 3 <= c.length ? "#" + hex(c[0]) + hex(c[1]) + hex(c[2]) : s;
            },
            getClasses: function() {
                var ov, cl = [], lo = {}, f = this.settings.class_filter;
                if (this.classes) return this.classes;
                try {
                    each(this.doc.styleSheets, function addClasses(s) {
                        each(s.imports, function(r) {
                            addClasses(r);
                        }), each(s.cssRules || s.rules, function(r) {
                            switch (r.type || 1) {
                              case 1:
                                r.selectorText && each(r.selectorText.split(","), function(v) {
                                    v = v.replace(/^\s*|\s*$|^\s\./g, ""), /\.mce/.test(v) || !/\.[\w\-]+$/.test(v) || (v = (ov = v).replace(/.*\.([a-z0-9_\-]+).*/i, "$1"), 
                                    f && !(v = f(v, ov))) || lo[v] || (cl.push({
                                        class: v
                                    }), lo[v] = 1);
                                });
                                break;

                              case 3:
                                try {
                                    addClasses(r.styleSheet);
                                } catch (ex) {}
                            }
                        });
                    });
                } catch (ex) {}
                return 0 < cl.length && (this.classes = cl), cl;
            },
            run: function(e, f, s) {
                var o, self = this;
                return !!(e = self.doc && "string" == typeof e ? self.get(e) : e) && (s = s || this, 
                e.nodeType || !e.length && 0 !== e.length ? f.call(s, e) : (o = [], 
                each(e, function(e, i) {
                    e && ("string" == typeof e && (e = self.doc.getElementById(e)), 
                    o.push(f.call(s, e, i)));
                }), o));
            },
            getAttribs: function(n) {
                var o;
                return (n = this.get(n)) ? isIE && (o = [], "OBJECT" != n.nodeName) ? ("OPTION" === n.nodeName && this.getAttrib(n, "selected") && o.push({
                    specified: 1,
                    nodeName: "selected"
                }), n.cloneNode(!1).outerHTML.replace(/<\/?[\w:\-]+ ?|=[\"][^\"]+\"|=\'[^\']+\'|=[\w\-]+|>/gi, "").replace(/[\w:\-]+/gi, function(a) {
                    o.push({
                        specified: 1,
                        nodeName: a
                    });
                }), o) : n.attributes : [];
            },
            isEmpty: function(node, elements) {
                var i, attributes, type, whitespace, walker, name, brCount = 0;
                if (node = node.firstChild) {
                    walker = new tinymce.dom.TreeWalker(node, node.parentNode), 
                    elements = elements || (this.schema ? this.schema.getNonEmptyElements() : null), 
                    whitespace = this.schema ? this.schema.getWhiteSpaceElements() : {};
                    do {
                        if (1 === (type = node.nodeType)) {
                            var bogusVal = node.getAttribute("data-mce-bogus");
                            if (bogusVal) {
                                node = walker.next("all" === bogusVal);
                                continue;
                            }
                            if (name = node.nodeName.toLowerCase(), elements && elements[name]) {
                                if ("br" !== name) return !1;
                                brCount++, node = walker.next();
                                continue;
                            }
                            for (i = (attributes = this.getAttribs(node)).length; i--; ) if (function(name) {
                                return "name" == name || "id" == name || "class" == name || -1 != name.indexOf("-") && ("data-mce-bookmark" == name || -1 == name.indexOf("data-mce-"));
                            }(name = attributes[i].nodeName)) return !1;
                        }
                        if (8 == type) return !1;
                        if (3 === type && !whiteSpaceRegExp.test(node.nodeValue)) return !1;
                        if (3 === type && node.parentNode && whitespace[node.parentNode.nodeName] && whiteSpaceRegExp.test(node.nodeValue)) return !1;
                        node = walker.next();
                    } while (node);
                }
                return brCount <= 1;
            },
            destroy: function(s) {
                this.win = this.doc = this.root = this.events = this.frag = null, 
                s || tinymce.removeUnload(this.destroy);
            },
            createRng: function() {
                return this.doc.createRange();
            },
            nodeIndex: function(node, normalized) {
                var lastNodeType, nodeType, idx = 0;
                if (node) for (lastNodeType = node.nodeType, node = node.previousSibling; node; node = node.previousSibling) nodeType = node.nodeType, 
                (!normalized || 3 != nodeType || nodeType != lastNodeType && node.nodeValue.length) && (idx++, 
                lastNodeType = nodeType);
                return idx;
            },
            split: function(pe, e, re) {
                var bef, pa, self = this, r = self.createRng();
                function trim(node) {
                    var i, children = node.childNodes, type = node.nodeType;
                    if (1 != type || "bookmark" != node.getAttribute("data-mce-type")) {
                        for (i = children.length - 1; 0 <= i; i--) trim(children[i]);
                        if (9 != type) {
                            if (3 == type && 0 < node.nodeValue.length) {
                                var trimmedLength = tinymce.trim(node.nodeValue).length;
                                if (!self.isBlock(node.parentNode) || 0 < trimmedLength || 0 === trimmedLength && function(node) {
                                    var previousIsSpan = node.previousSibling && "SPAN" == node.previousSibling.nodeName, node = node.nextSibling && "SPAN" == node.nextSibling.nodeName;
                                    return previousIsSpan && node;
                                }(node)) return;
                            } else if (1 == type && (1 == (children = node.childNodes).length && children[0] && 1 == children[0].nodeType && "bookmark" == children[0].getAttribute("data-mce-type") && node.parentNode.insertBefore(children[0], node), 
                            children.length || /^(br|hr|input|img)$/i.test(node.nodeName))) return;
                            self.remove(node);
                        }
                        return node;
                    }
                }
                if (pe && e) return r.setStart(pe.parentNode, self.nodeIndex(pe)), 
                r.setEnd(e.parentNode, self.nodeIndex(e)), bef = r.extractContents(), 
                (r = self.createRng()).setStart(e.parentNode, self.nodeIndex(e) + 1), 
                r.setEnd(pe.parentNode, self.nodeIndex(pe) + 1), r = r.extractContents(), 
                (pa = pe.parentNode).insertBefore(trim(bef), pe), re ? pa.replaceChild(re, e) : pa.insertBefore(e, pe), 
                pa.insertBefore(trim(r), pe), self.remove(pe), re || e;
            },
            bind: function(target, name, func, scope) {
                return this.events.add(target, name, func, scope || this);
            },
            unbind: function(target, name, func) {
                return this.events.remove(target, name, func);
            },
            fire: function(target, name, evt) {
                return this.events.fire(target, name, evt);
            },
            getContentEditable: function(node) {
                var contentEditable;
                return node && 1 == node.nodeType ? (contentEditable = node.getAttribute("data-mce-contenteditable")) && "inherit" !== contentEditable ? contentEditable : "inherit" !== node.contentEditable ? node.contentEditable : null : null;
            },
            getContentEditableParent: function(node) {
                for (var root = this.getRoot(), state = null; node && node !== root && null === (state = this.getContentEditable(node)); node = node.parentNode);
                return state;
            },
            isChildOf: function(node, parent) {
                for (;node; ) {
                    if (parent === node) return !0;
                    node = node.parentNode;
                }
                return !1;
            },
            dumpRng: function(r) {
                return "startContainer: " + r.startContainer.nodeName + ", startOffset: " + r.startOffset + ", endContainer: " + r.endContainer.nodeName + ", endOffset: " + r.endOffset;
            },
            _findSib: function(node, selector, name) {
                var self = this, f = selector;
                if (node) for (is(f, "string") && (f = function(node) {
                    return self.is(node, selector);
                }), node = node[name]; node; node = node[name]) if (f(node)) return node;
                return null;
            },
            _isRes: function(c) {
                return /^(top|left|bottom|right|width|height)/i.test(c) || /;\s*(top|left|bottom|right|width|height)/i.test(c);
            }
        }, tinymce.DOM = new tinymce.dom.DOMUtils(document, {
            process_html: 0
        });
    }(tinymce), function(tinymce) {
        function isNodeType(type) {
            return function(node) {
                return !!node && node.nodeType == type;
            };
        }
        var isElement = isNodeType(1);
        function matchNodeNames(names) {
            return names = names.toLowerCase().split(" "), function(node) {
                var i, name;
                if (node && node.nodeType) for (name = node.nodeName.toLowerCase(), 
                i = 0; i < names.length; i++) if (name === names[i]) return !0;
                return !1;
            };
        }
        function isBogus(node) {
            return isElement(node) && node.hasAttribute("data-mce-bogus");
        }
        function isBookmark(node) {
            return isElement(node) && "bookmark" == node.getAttribute("data-mce-type");
        }
        function hasContentEditableState(value) {
            return function(node) {
                if (isElement(node)) {
                    if (node.hasAttribute("data-mce-contenteditable")) return node.getAttribute("data-mce-contenteditable") === value;
                    if (node.contentEditable === value) return !0;
                }
                return !1;
            };
        }
        tinymce.dom.NodeType = {
            isText: isNodeType(3),
            isElement: isElement,
            isComment: isNodeType(8),
            isDocument: isNodeType(9),
            isDocumentFragment: isNodeType(11),
            isBr: matchNodeNames("br"),
            isContentEditableTrue: hasContentEditableState("true"),
            isContentEditableFalse: hasContentEditableState("false"),
            matchNodeNames: matchNodeNames,
            hasPropValue: function(propName, propValue) {
                return function(node) {
                    return isElement(node) && node[propName] === propValue;
                };
            },
            hasAttributeValue: function(attrName, attrValue) {
                return function(node) {
                    return isElement(node) && node.getAttribute(attrName) === attrValue;
                };
            },
            matchStyleValues: function(name, values) {
                return values = values.toLowerCase().split(" "), function(node) {
                    var i;
                    if (isElement(node)) for (i = 0; i < values.length; i++) if (node.ownerDocument.defaultView.getComputedStyle(node, null).getPropertyValue(name) === values[i]) return !0;
                    return !1;
                };
            },
            isBogus: isBogus,
            isBookmark: isBookmark,
            isInternal: function(node) {
                return isBogus(node) || isBookmark(node) || function(node) {
                    return isElement(node) && "_mce_caret" === node.id;
                }(node);
            }
        };
    }(tinymce), function(tinymce) {
        var NodeType = tinymce.dom.NodeType, Arr = tinymce.util.Arr, ClientRect = tinymce.geom.ClientRect;
        tinymce.dom.Dimensions = {
            getClientRects: function getClientRects(node) {
                function toArrayWithNode(clientRects) {
                    return Arr.map(clientRects, function(clientRect) {
                        return (clientRect = ClientRect.clone(clientRect)).node = node, 
                        clientRect;
                    });
                }
                var rng;
                return Arr.isArray(node) ? Arr.reduce(node, function(result, node) {
                    return result.concat(getClientRects(node));
                }, []) : NodeType.isElement(node) ? toArrayWithNode(node.getClientRects()) : NodeType.isText(node) ? ((rng = node.ownerDocument.createRange()).setStart(node, 0), 
                rng.setEnd(node, node.data.length), toArrayWithNode(rng.getClientRects())) : void 0;
            }
        };
    }(tinymce), function(tinymce) {
        var each = tinymce.each, TreeWalker = tinymce.dom.TreeWalker;
        tinymce.dom.RangeUtils = function(dom) {
            this.walk = function(rng, callback) {
                var ancestor, node, parent, siblings, container, childNodes, startContainer = rng.startContainer, startOffset = rng.startOffset, endContainer = rng.endContainer, endOffset = rng.endOffset;
                if (0 < (rng = dom.select("td.mceSelected,th.mceSelected,div.mceSelected")).length) each(rng, function(node) {
                    callback([ node ]);
                }); else {
                    if (1 == startContainer.nodeType && startContainer.hasChildNodes() && (startContainer = startContainer.childNodes[startOffset]), 
                    1 == endContainer.nodeType && endContainer.hasChildNodes() && (rng = endOffset, 
                    --rng > (childNodes = (container = endContainer).childNodes).length - 1 ? rng = childNodes.length - 1 : rng < 0 && (rng = 0), 
                    endContainer = childNodes[rng] || container), startContainer == endContainer) return callback(exclude([ startContainer ]));
                    for (ancestor = dom.findCommonAncestor(startContainer, endContainer), 
                    node = startContainer; node; node = node.parentNode) {
                        if (node === endContainer) return walkBoundary(startContainer, ancestor, !0);
                        if (node === ancestor) break;
                    }
                    for (node = endContainer; node; node = node.parentNode) {
                        if (node === startContainer) return walkBoundary(endContainer, ancestor);
                        if (node === ancestor) break;
                    }
                    childNodes = findEndPoint(startContainer, ancestor) || startContainer, 
                    rng = findEndPoint(endContainer, ancestor) || endContainer, 
                    walkBoundary(startContainer, childNodes, !0), (siblings = collectSiblings(childNodes == startContainer ? childNodes : childNodes.nextSibling, "nextSibling", rng == endContainer ? rng.nextSibling : rng)).length && callback(exclude(siblings)), 
                    walkBoundary(endContainer, rng);
                }
                function exclude(nodes) {
                    var node = nodes[0];
                    return 3 === node.nodeType && node === startContainer && startOffset >= node.nodeValue.length && nodes.splice(0, 1), 
                    node = nodes[nodes.length - 1], 0 === endOffset && 0 < nodes.length && node === endContainer && 3 === node.nodeType && nodes.splice(nodes.length - 1, 1), 
                    nodes;
                }
                function collectSiblings(node, name, end_node) {
                    for (var siblings = []; node && node != end_node; node = node[name]) siblings.push(node);
                    return siblings;
                }
                function findEndPoint(node, root) {
                    do {
                        if (node.parentNode == root) return node;
                    } while (node = node.parentNode);
                }
                function walkBoundary(start_node, end_node, next) {
                    var siblingName = next ? "nextSibling" : "previousSibling";
                    for (parent = (node = start_node).parentNode; node && node != end_node; node = parent) parent = node.parentNode, 
                    (siblings = collectSiblings(node == start_node ? node : node[siblingName], siblingName)).length && (next || siblings.reverse(), 
                    callback(exclude(siblings)));
                }
            }, this.split = function(rng) {
                var startContainer = rng.startContainer, startOffset = rng.startOffset, endContainer = rng.endContainer, rng = rng.endOffset;
                function splitText(node, offset) {
                    return node.splitText(offset);
                }
                return startContainer == endContainer && 3 == startContainer.nodeType ? 0 < startOffset && startOffset < startContainer.nodeValue.length && (startContainer = (endContainer = splitText(startContainer, startOffset)).previousSibling, 
                startOffset < rng ? (startContainer = endContainer = splitText(endContainer, rng -= startOffset).previousSibling, 
                rng = endContainer.nodeValue.length, startOffset = 0) : rng = 0) : (3 == startContainer.nodeType && 0 < startOffset && startOffset < startContainer.nodeValue.length && (startContainer = splitText(startContainer, startOffset), 
                startOffset = 0), 3 == endContainer.nodeType && 0 < rng && rng < endContainer.nodeValue.length && (rng = (endContainer = splitText(endContainer, rng).previousSibling).nodeValue.length)), 
                {
                    startContainer: startContainer,
                    startOffset: startOffset,
                    endContainer: endContainer,
                    endOffset: rng
                };
            }, this.normalize = function(rng) {
                var normalized, collapsed;
                function normalizeEndPoint(start) {
                    var container, offset, walker, node, nonEmptyElementsMap, directionLeft, isAfterNode, body = dom.getRoot();
                    function hasBrBeforeAfter(node, left) {
                        for (var walker = new TreeWalker(node, dom.getParent(node.parentNode, dom.isBlock) || body); node = walker[left ? "prev" : "next"](); ) if ("BR" === node.nodeName) return 1;
                    }
                    function findTextNodeRelative(left, startNode) {
                        var walker, lastInlineElement, parentBlockContainer;
                        if (startNode = startNode || container, parentBlockContainer = dom.getParent(startNode.parentNode, dom.isBlock) || body, 
                        left && "BR" == startNode.nodeName && isAfterNode && dom.isEmpty(parentBlockContainer)) container = startNode.parentNode, 
                        offset = dom.nodeIndex(startNode), normalized = !0; else {
                            for (walker = new TreeWalker(startNode, parentBlockContainer); node = walker[left ? "prev" : "next"](); ) {
                                if ("false" === dom.getContentEditableParent(node)) return;
                                if (3 === node.nodeType && 0 < node.nodeValue.length) return container = node, 
                                offset = left ? node.nodeValue.length : 0, normalized = !0;
                                if (dom.isBlock(node) || nonEmptyElementsMap[node.nodeName.toLowerCase()]) return;
                                lastInlineElement = node;
                            }
                            collapsed && lastInlineElement && (container = lastInlineElement, 
                            normalized = !0, offset = 0);
                        }
                    }
                    if (container = rng[(start ? "start" : "end") + "Container"], 
                    offset = rng[(start ? "start" : "end") + "Offset"], isAfterNode = 1 == container.nodeType && offset === container.childNodes.length, 
                    nonEmptyElementsMap = dom.schema.getNonEmptyElements(), directionLeft = start, 
                    1 == container.nodeType && offset > container.childNodes.length - 1 && (directionLeft = !1), 
                    9 === container.nodeType && (container = dom.getRoot(), offset = 0), 
                    container === body) {
                        if (directionLeft && (node = container.childNodes[0 < offset ? offset - 1 : 0]) && (nonEmptyElementsMap[node.nodeName] || "TABLE" == node.nodeName)) return;
                        if (container.hasChildNodes() && (offset = Math.min(!directionLeft && 0 < offset ? offset - 1 : offset, container.childNodes.length - 1), 
                        container = container.childNodes[offset], offset = 0, container.hasChildNodes()) && !/TABLE/.test(container.nodeName)) {
                            walker = new TreeWalker(node = container, body);
                            do {
                                if (3 === node.nodeType && 0 < node.nodeValue.length) {
                                    offset = directionLeft ? 0 : node.nodeValue.length, 
                                    container = node, normalized = !0;
                                    break;
                                }
                                if (nonEmptyElementsMap[node.nodeName.toLowerCase()]) {
                                    offset = dom.nodeIndex(node), container = node.parentNode, 
                                    "IMG" != node.nodeName || directionLeft || offset++, 
                                    normalized = !0;
                                    break;
                                }
                            } while (node = directionLeft ? walker.next() : walker.prev());
                        }
                    }
                    collapsed && (3 === container.nodeType && 0 === offset && findTextNodeRelative(!0), 
                    1 !== container.nodeType || !(node = (node = container.childNodes[offset]) || container.childNodes[offset - 1]) || "BR" !== node.nodeName || function(node) {
                        return node.previousSibling && "A" == node.previousSibling.nodeName;
                    }(node) || hasBrBeforeAfter(node) || hasBrBeforeAfter(node, !0) || findTextNodeRelative(!0, node)), 
                    directionLeft && !collapsed && 3 === container.nodeType && offset === container.nodeValue.length && findTextNodeRelative(!1), 
                    normalized && rng["set" + (start ? "Start" : "End")](container, offset);
                }
                return collapsed = rng.collapsed, normalizeEndPoint(!0), collapsed || normalizeEndPoint(), 
                normalized && collapsed && rng.collapse(!0), normalized;
            };
        }, tinymce.dom.RangeUtils.compareRanges = function(rng1, rng2) {
            if (rng1 && rng2) {
                if (!rng1.item && !rng1.duplicate) return rng1.startContainer == rng2.startContainer && rng1.startOffset == rng2.startOffset;
                if (rng1.item && rng2.item && rng1.item(0) === rng2.item(0)) return !0;
                if (rng1.isEqual && rng2.isEqual && rng2.isEqual(rng1)) return !0;
            }
            return !1;
        }, tinymce.dom.RangeUtils.getCaretRangeFromPoint = function(x, y, doc) {
            var rng, point;
            if (doc.caretPositionFromPoint) point = doc.caretPositionFromPoint(x, y), 
            (rng = doc.createRange()).setStart(point.offsetNode, point.offset), 
            rng.collapse(!0); else if (doc.caretRangeFromPoint) rng = doc.caretRangeFromPoint(x, y); else if (doc.body.createTextRange) {
                rng = doc.body.createTextRange();
                try {
                    rng.moveToPoint(x, y), rng.collapse(!0);
                } catch (ex) {
                    rng.collapse(y < doc.body.clientHeight);
                }
            }
            return rng;
        }, tinymce.dom.RangeUtils.getSelectedNode = function(range) {
            var startContainer = range.startContainer, startOffset = range.startOffset;
            return startContainer.hasChildNodes() && range.endOffset == startOffset + 1 ? startContainer.childNodes[startOffset] : null;
        }, tinymce.dom.RangeUtils.getNode = function(container, offset) {
            return 1 == container.nodeType && container.hasChildNodes() && (offset >= container.childNodes.length && (offset = container.childNodes.length - 1), 
            container = container.childNodes[offset]), container;
        };
    }(tinymce), tinymce, function(tinymce) {
        var extendingChars = new RegExp("[\u0300-\u036f\u0483-\u0487\u0488-\u0489\u0591-\u05bd\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05c7\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7-\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u08e3-\u0902\u093a\u093c\u0941-\u0948\u094d\u0951-\u0957\u0962-\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2-\u09e3\u0a01-\u0a02\u0a3c\u0a41-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a51\u0a70-\u0a71\u0a75\u0a81-\u0a82\u0abc\u0ac1-\u0ac5\u0ac7-\u0ac8\u0acd\u0ae2-\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62-\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c00\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55-\u0c56\u0c62-\u0c63\u0c81\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc-\u0ccd\u0cd5-\u0cd6\u0ce2-\u0ce3\u0d01\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62-\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb-\u0ebc\u0ec8-\u0ecd\u0f18-\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039-\u103a\u103d-\u103e\u1058-\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085-\u1086\u108d\u109d\u135d-\u135f\u1712-\u1714\u1732-\u1734\u1752-\u1753\u1772-\u1773\u17b4-\u17b5\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927-\u1928\u1932\u1939-\u193b\u1a17-\u1a18\u1a1b\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1ab0-\u1abd\u1abe\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80-\u1b81\u1ba2-\u1ba5\u1ba8-\u1ba9\u1bab-\u1bad\u1be6\u1be8-\u1be9\u1bed\u1bef-\u1bf1\u1c2c-\u1c33\u1c36-\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1cf4\u1cf8-\u1cf9\u1dc0-\u1df5\u1dfc-\u1dff\u200c-\u200d\u20d0-\u20dc\u20dd-\u20e0\u20e1\u20e2-\u20e4\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302d\u302e-\u302f\u3099-\u309a\ua66f\ua670-\ua672\ua674-\ua67d\ua69e-\ua69f\ua6f0-\ua6f1\ua802\ua806\ua80b\ua825-\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\ua9e5\uaa29-\uaa2e\uaa31-\uaa32\uaa35-\uaa36\uaa43\uaa4c\uaa7c\uaab0\uaab2-\uaab4\uaab7-\uaab8\uaabe-\uaabf\uaac1\uaaec-\uaaed\uaaf6\uabe5\uabe8\uabed\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\uff9e-\uff9f]");
        tinymce.text.ExtendingChar = {
            isExtendingChar: function(ch) {
                return "string" == typeof ch && 768 <= ch.charCodeAt(0) && extendingChars.test(ch);
            }
        };
    }(tinymce), function(tinymce) {
        tinymce.text.Zwsp = {
            isZwsp: function(chr) {
                return "\ufeff" === chr;
            },
            ZWSP: "\ufeff",
            trim: function(text) {
                return text.replace(new RegExp("\ufeff", "g"), "");
            }
        };
    }(tinymce), tinymce.TextPattern = function(editor) {
        var self = this, isPatternsDirty = !0;
        function getPatterns() {
            return isPatternsDirty && (sortPatterns(self.patterns), isPatternsDirty = !1), 
            self.patterns;
        }
        function findPattern(text) {
            for (var patterns = getPatterns(), i = 0; i < patterns.length; i++) if (0 === text.indexOf(patterns[i].start) && (!patterns[i].end || text.lastIndexOf(patterns[i].end) == text.length - patterns[i].end.length)) return patterns[i];
        }
        function sortPatterns(patterns) {
            return patterns.sort(function(a, b) {
                return a.start.length > b.start.length ? -1 : a.start.length < b.start.length ? 1 : 0;
            });
        }
        function applyInlineFormat(space) {
            var container, startOffset, text, pattern, delta, selection = editor.selection, dom = editor.dom;
            if (selection.isCollapsed() && (container = (selection = selection.getRng(!0)).startContainer, 
            selection = selection.startOffset, text = container.data, delta = !0 === space ? 1 : 0, 
            3 == container.nodeType) && !dom.getParent(container, "PRE") && void 0 !== (pattern = function(text, offset, delta) {
                for (var pattern, sortedPatterns = sortPatterns(getPatterns()), i = 0; i < sortedPatterns.length; i++) if (void 0 !== (pattern = sortedPatterns[i]).end && function(pattern, text, offset, delta) {
                    return text.substr(offset - pattern.end.length - delta, pattern.end.length) === pattern.end;
                }(pattern, text, offset, delta) && function(offset, delta, pattern) {
                    return 0 < offset - delta - pattern.end.length - pattern.start.length;
                }(offset, delta, pattern)) return pattern;
            }(text, selection, delta)) && (startOffset = Math.max(0, selection - delta), 
            -1 !== (startOffset = text.lastIndexOf(pattern.start, startOffset - pattern.end.length - 1)))) return (text = dom.createRng()).setStart(container, startOffset), 
            text.setEnd(container, selection - delta), (pattern = findPattern(text.toString())) && pattern.end && !(container.data.length <= pattern.start.length + pattern.end.length) && pattern.format && (dom = editor.formatter.get(pattern.format)) && dom[0].inline ? (container = function(container, pattern, offset, startOffset, delta) {
                return delta && /[\u00a0 ]/.test(pattern.start) && (startOffset += 1), 
                (container = 0 < startOffset ? container.splitText(startOffset) : container).splitText(offset - startOffset - delta), 
                !1 !== pattern.remove && (container.deleteData(0, pattern.start.length), 
                container.deleteData(container.data.length - pattern.end.length, pattern.end.length)), 
                container;
            }(container, pattern, selection, startOffset, delta), space && container.appendData(" "), 
            editor.formatter.apply(pattern.format, {}, container), container) : void 0;
        }
        return self.patterns = [], editor.onKeyDown.addToTop(function(ed, e) {
            13 != e.keyCode || tinymce.VK.modifierPressed(e) || function(e) {
                var rng, wrappedTextNode = applyInlineFormat();
                wrappedTextNode && ((rng = editor.dom.createRng()).setStart(wrappedTextNode, wrappedTextNode.data.length), 
                rng.setEnd(wrappedTextNode, wrappedTextNode.data.length), editor.selection.setRng(rng)), 
                function(e) {
                    var firstTextNode, node, walker, rng, offset, format, parent, textBlockElm, selection = editor.selection, dom = editor.dom;
                    if (selection.isCollapsed() && "PRE" !== selection.getStart().nodeName && (textBlockElm = dom.getParent(selection.getStart(), "p"))) {
                        for (walker = new tinymce.dom.TreeWalker(textBlockElm, textBlockElm); node = walker.next(); ) if (3 == node.nodeType) {
                            firstTextNode = node;
                            break;
                        }
                        firstTextNode && (textBlockElm = findPattern(firstTextNode.data)) && (textBlockElm.remove && e.preventDefault(), 
                        e = (rng = selection.getRng(!0)).startContainer, offset = rng.startOffset, 
                        firstTextNode == e && (offset = Math.max(0, offset - textBlockElm.start.length)), 
                        tinymce.trim(firstTextNode.data).length != textBlockElm.start.length) && (textBlockElm.format ? (format = editor.formatter.get(textBlockElm.format)) && format[0].block && (firstTextNode.deleteData(0, textBlockElm.start.length), 
                        editor.formatter.apply(textBlockElm.format, {}, firstTextNode), 
                        rng.setStart(e, offset), rng.collapse(!0), selection.setRng(rng)) : textBlockElm.cmd && (editor.undoManager.add(), 
                        format = textBlockElm.start.length, e = firstTextNode.data, 
                        textBlockElm.remove && (format = firstTextNode.data.length), 
                        firstTextNode.deleteData(0, format), parent = firstTextNode.parentNode, 
                        dom.isEmpty(parent) && dom.isBlock(parent) && (parent.innerHTML = '<br data-mce-bogus="1">', 
                        window.setTimeout(function() {
                            rng.setStart(parent, 0), rng.collapse(!0), selection.setRng(rng);
                        }, 0)), editor.execCommand(textBlockElm.cmd, !1, e)));
                    }
                }(e);
            }(e);
        }), editor.onKeyUp.add(function(ed, e) {
            var lastChar, dom;
            32 != e.keyCode || tinymce.VK.modifierPressed(e) || (e = applyInlineFormat(!0)) && (dom = editor.dom, 
            lastChar = e.data.slice(-1), /[\u00a0 ]/.test(lastChar)) && (e.deleteData(e.data.length - 1, 1), 
            lastChar = dom.doc.createTextNode(lastChar), e.nextSibling ? dom.insertAfter(lastChar, e.nextSibling) : e.parentNode.appendChild(lastChar), 
            (e = dom.createRng()).setStart(lastChar, 1), e.setEnd(lastChar, 1), 
            editor.selection.setRng(e));
        }), {
            getPatterns: getPatterns,
            addPattern: function(pattern) {
                self.patterns.push(pattern), isPatternsDirty = !0;
            }
        };
    };
    function noop() {}
    function setClipboardData(evt, data, fallback, done) {
        !function(clipboardData, html, text) {
            if (function(clipboardData) {
                return !1 === tinymce.isIOS && void 0 !== clipboardData && "function" == typeof clipboardData.setData;
            }(clipboardData)) try {
                return clipboardData.clearData(), clipboardData.setData("text/html", html), 
                clipboardData.setData("text/plain", text), clipboardData.setData(internalMimeType, html), 
                1;
            } catch (e) {}
        }(evt.clipboardData, data.html, data.text) ? fallback(data.html, done) : (evt.preventDefault(), 
        done());
    }
    function fallback(editor) {
        return function(html, done) {
            var html = internalMark + html, outer = editor.dom.create("div", {
                contenteditable: "false",
                "data-mce-bogus": "all"
            }), html = editor.dom.create("div", {
                contenteditable: "true",
                "data-mce-bogus": "all"
            }, html), range = (editor.dom.setStyles(outer, {
                position: "fixed",
                left: "-3000px",
                width: "1000px",
                overflow: "hidden"
            }), outer.appendChild(html), editor.dom.add(editor.getBody(), outer), 
            editor.selection.getRng()), offscreenRange = (html.focus(), editor.dom.createRng());
            offscreenRange.selectNodeContents(html), editor.selection.setRng(offscreenRange), 
            setTimeout(function() {
                outer.parentNode.removeChild(outer), editor.selection.setRng(range), 
                done();
            }, 0);
        };
    }
    function getData(editor) {
        return {
            html: editor.selection.getContent({
                contextual: !0
            }),
            text: editor.selection.getContent({
                format: "text"
            })
        };
    }
    var internalMimeType = "x-tinymce/html", internalMark = "\x3c!-- " + internalMimeType + " --\x3e", unmark = function(html) {
        return html.replace(internalMark, "");
    }, isMarked = function(html) {
        return -1 !== html.indexOf(internalMark);
    }, DomParser$2 = tinymce.html.DomParser, Schema$1 = tinymce.html.Schema, each$4 = tinymce.each, DOM = tinymce.DOM, mceInternalUrlPrefix = "data:text/mce-internal,";
    function hasContentType(clipboardContent, mimeType) {
        return mimeType in clipboardContent && 0 < clipboardContent[mimeType].length;
    }
    function hasHtmlOrText(content) {
        return (hasContentType(content, "text/html") || hasContentType(content, "text/plain")) && !content.Files;
    }
    function getDataTransferItems(dataTransfer) {
        var legacyText, items = {};
        if (dataTransfer && (dataTransfer.getData && (legacyText = dataTransfer.getData("Text")) && 0 < legacyText.length && -1 === legacyText.indexOf(mceInternalUrlPrefix) && (items["text/plain"] = legacyText), 
        dataTransfer.types)) for (var i = 0; i < dataTransfer.types.length; i++) {
            var contentType = dataTransfer.types[i];
            try {
                items[contentType] = dataTransfer.getData(contentType);
            } catch (ex) {
                items[contentType] = "";
            }
        }
        return items;
    }
    function filter(content, items) {
        return tinymce.each(items, function(v) {
            content = v.constructor == RegExp ? content.replace(v, "") : content.replace(v[0], v[1]);
        }), content;
    }
    function trimHtml(html) {
        return filter(function(html) {
            if (-1 !== (startPos = html.indexOf("\x3c!--StartFragment--\x3e"))) {
                var startPos = html.substr(startPos + "\x3c!--StartFragment--\x3e".length), endPos = startPos.indexOf("\x3c!--EndFragment--\x3e");
                if (-1 !== endPos && /^<\/(p|h[1-6]|li)>/i.test(startPos.substr(endPos + "\x3c!--EndFragment--\x3e".length, 5))) return startPos.substr(0, endPos);
            }
            return html;
        }(html), [ /^[\s\S]*<body[^>]*>\s*|\s*<\/body[^>]*>[\s\S]*$/gi, /<!--StartFragment-->|<!--EndFragment-->/g, [ /( ?)<span class="Apple-converted-space">(\u00a0|&nbsp;)<\/span>( ?)/g, function(all, s1, s2) {
            return s1 || s2 ? "\xa0" : " ";
        } ], /<br class="Apple-interchange-newline">/g, /^<meta[^>]+>/g, /<br>$/i, /&nbsp;$/ ]);
    }
    var each$3 = tinymce.each;
    function convertToPixels(v) {
        if (-1 === v.indexOf("px")) {
            if (0 === parseInt(v, 10)) return 0;
            -1 !== v.indexOf("pt") && (v = parseInt(v, 10), v = Math.ceil(v / 1.33333), 
            v = Math.abs(v)), v && (v += "px");
        }
        return v;
    }
    var pixelStyles = [ "width", "height", "min-width", "max-width", "min-height", "max-height", "margin-top", "margin-right", "margin-bottom", "margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width" ], styleProps = [ "background", "background-attachment", "background-color", "background-image", "background-position", "background-repeat", "border", "border-bottom", "border-bottom-color", "border-bottom-style", "border-bottom-width", "border-color", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-style", "border-top", "border-top-color", "border-top-style", "border-top-width", "border-width", "outline", "outline-color", "outline-style", "outline-width", "height", "max-height", "max-width", "min-height", "min-width", "width", "font", "font-family", "font-size", "font-style", "font-variant", "font-weight", "content", "counter-increment", "counter-reset", "quotes", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "bottom", "clear", "clip", "cursor", "display", "float", "left", "overflow", "position", "right", "top", "visibility", "z-index", "orphans", "page-break-after", "page-break-before", "page-break-inside", "widows", "border-collapse", "border-spacing", "caption-side", "empty-cells", "table-layout", "color", "direction", "letter-spacing", "line-height", "text-align", "text-decoration", "text-indent", "text-shadow", "text-transform", "unicode-bidi", "vertical-align", "white-space", "word-spacing" ], borderStyles = [ "border", "border-width", "border-style", "border-color", "border-top", "border-right", "border-bottom", "border-left", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "border-top-style", "border-right-style", "border-bottom-style", "border-left-style" ], backgroundStyles = {
        "background-image": "none",
        "background-position": "0% 0%",
        "background-size": "auto auto",
        "background-repeat": "repeat",
        "background-origin": "padding-box",
        "background-clip": "border-box",
        "background-attachment": "scroll",
        "background-color": "transparent"
    }, fontStyles = [ "font", "font-family", "font-size", "font-style", "font-variant", "font-weight" ], namedColors = {
        "#F0F8FF": "AliceBlue",
        "#FAEBD7": "AntiqueWhite",
        "#7FFFD4": "Aquamarine",
        "#F0FFFF": "Azure",
        "#F5F5DC": "Beige",
        "#FFE4C4": "Bisque",
        "#000000": "Black",
        "#FFEBCD": "BlanchedAlmond",
        "#0000FF": "Blue",
        "#8A2BE2": "BlueViolet",
        "#A52A2A": "Brown",
        "#DEB887": "BurlyWood",
        "#5F9EA0": "CadetBlue",
        "#7FFF00": "Chartreuse",
        "#D2691E": "Chocolate",
        "#FF7F50": "Coral",
        "#6495ED": "CornflowerBlue",
        "#FFF8DC": "Cornsilk",
        "#DC143C": "Crimson",
        "#00008B": "DarkBlue",
        "#008B8B": "DarkCyan",
        "#B8860B": "DarkGoldenRod",
        "#A9A9A9": "DarkGray",
        "#006400": "DarkGreen",
        "#BDB76B": "DarkKhaki",
        "#8B008B": "DarkMagenta",
        "#556B2F": "DarkOliveGreen",
        "#FF8C00": "Darkorange",
        "#9932CC": "DarkOrchid",
        "#8B0000": "DarkRed",
        "#E9967A": "DarkSalmon",
        "#8FBC8F": "DarkSeaGreen",
        "#483D8B": "DarkSlateBlue",
        "#2F4F4F": "DarkSlateGrey",
        "#00CED1": "DarkTurquoise",
        "#9400D3": "DarkViolet",
        "#FF1493": "DeepPink",
        "#00BFFF": "DeepSkyBlue",
        "#696969": "DimGrey",
        "#1E90FF": "DodgerBlue",
        "#B22222": "FireBrick",
        "#FFFAF0": "FloralWhite",
        "#228B22": "ForestGreen",
        "#DCDCDC": "Gainsboro",
        "#F8F8FF": "GhostWhite",
        "#FFD700": "Gold",
        "#DAA520": "GoldenRod",
        "#808080": "Grey",
        "#008000": "Green",
        "#ADFF2F": "GreenYellow",
        "#F0FFF0": "HoneyDew",
        "#FF69B4": "HotPink",
        "#CD5C5C": "IndianRed",
        "#4B0082": "Indigo",
        "#FFFFF0": "Ivory",
        "#F0E68C": "Khaki",
        "#E6E6FA": "Lavender",
        "#FFF0F5": "LavenderBlush",
        "#7CFC00": "LawnGreen",
        "#FFFACD": "LemonChiffon",
        "#ADD8E6": "LightBlue",
        "#F08080": "LightCoral",
        "#E0FFFF": "LightCyan",
        "#FAFAD2": "LightGoldenRodYellow",
        "#D3D3D3": "LightGrey",
        "#90EE90": "LightGreen",
        "#FFB6C1": "LightPink",
        "#FFA07A": "LightSalmon",
        "#20B2AA": "LightSeaGreen",
        "#87CEFA": "LightSkyBlue",
        "#778899": "LightSlateGrey",
        "#B0C4DE": "LightSteelBlue",
        "#FFFFE0": "LightYellow",
        "#00FF00": "Lime",
        "#32CD32": "LimeGreen",
        "#FAF0E6": "Linen",
        "#FF00FF": "Magenta",
        "#800000": "Maroon",
        "#66CDAA": "MediumAquaMarine",
        "#0000CD": "MediumBlue",
        "#BA55D3": "MediumOrchid",
        "#9370D8": "MediumPurple",
        "#3CB371": "MediumSeaGreen",
        "#7B68EE": "MediumSlateBlue",
        "#00FA9A": "MediumSpringGreen",
        "#48D1CC": "MediumTurquoise",
        "#C71585": "MediumVioletRed",
        "#191970": "MidnightBlue",
        "#F5FFFA": "MintCream",
        "#FFE4E1": "MistyRose",
        "#FFE4B5": "Moccasin",
        "#FFDEAD": "NavajoWhite",
        "#000080": "Navy",
        "#FDF5E6": "OldLace",
        "#808000": "Olive",
        "#6B8E23": "OliveDrab",
        "#FFA500": "Orange",
        "#FF4500": "OrangeRed",
        "#DA70D6": "Orchid",
        "#EEE8AA": "PaleGoldenRod",
        "#98FB98": "PaleGreen",
        "#AFEEEE": "PaleTurquoise",
        "#D87093": "PaleVioletRed",
        "#FFEFD5": "PapayaWhip",
        "#FFDAB9": "PeachPuff",
        "#CD853F": "Peru",
        "#FFC0CB": "Pink",
        "#DDA0DD": "Plum",
        "#B0E0E6": "PowderBlue",
        "#800080": "Purple",
        "#FF0000": "Red",
        "#BC8F8F": "RosyBrown",
        "#4169E1": "RoyalBlue",
        "#8B4513": "SaddleBrown",
        "#FA8072": "Salmon",
        "#F4A460": "SandyBrown",
        "#2E8B57": "SeaGreen",
        "#FFF5EE": "SeaShell",
        "#A0522D": "Sienna",
        "#C0C0C0": "Silver",
        "#87CEEB": "SkyBlue",
        "#6A5ACD": "SlateBlue",
        "#708090": "SlateGrey",
        "#FFFAFA": "Snow",
        "#00FF7F": "SpringGreen",
        "#4682B4": "SteelBlue",
        "#D2B48C": "Tan",
        "#008080": "Teal",
        "#D8BFD8": "Thistle",
        "#FF6347": "Tomato",
        "#40E0D0": "Turquoise",
        "#EE82EE": "Violet",
        "#F5DEB3": "Wheat",
        "#FFFFFF": "White",
        "#F5F5F5": "WhiteSmoke",
        "#FFFF00": "Yellow",
        "#9ACD32": "YellowGreen"
    };
    function namedColorToHex(value) {
        return tinymce.each(namedColors, function(name, hex) {
            if (value.toLowerCase() === name.toLowerCase()) return value = hex, 
            !1;
        }), value.toLowerCase();
    }
    var each$2 = tinymce.each, Schema = tinymce.html.Schema, DomParser$1 = tinymce.html.DomParser, Serializer$1 = tinymce.html.Serializer, Node = tinymce.html.Node, ooRe = /(Version:[\d\.]+)\s*?((Start|End)(HTML|Fragment):[\d]+\s*?){4}/;
    var each$1 = tinymce.each, isIE$1 = tinymce.isIE || tinymce.isIE12;
    function setup$2(editor) {
        editor.onPastePreProcess.add(function(editor, o) {
            !function(editor, o) {
                var h = (h = (h = o.content).replace(/^\s*(&nbsp;)+/g, "")).replace(/(&nbsp;|<br[^>]*>)+\s*$/g, "");
                o.pasteAsPlainText || (o.wordContent && (h = function(editor, content) {
                    var removeProps, settings = editor.settings, validStyles = {}, styleProps$1 = styleProps, keepStyles = (content = filter(content = (content = (content = (content = (content = content.replace(/<meta([^>]+)>/, "")).replace(/<style([^>]*)>([\w\W]*?)<\/style>/gi, function(match, attr, value) {
                        var classes = [], value = parseCssToRules(value);
                        return each$2(value, function(r) {
                            r.selectorText && each$2(r.selectorText.split(","), function(v) {
                                v = v.replace(/^\s*|\s*$|^\s\./g, ""), !/\.mso/i.test(v) && /\.[\w\-]+$/.test(v) && (v = r.cssText || "") && -1 === tinymce.inArray(classes, v) && classes.push(v);
                            });
                        }), "<style" + attr + ">" + classes.join("") + "</style>";
                    })).replace(/Version:[\d.]+\nStartHTML:\d+\nEndHTML:\d+\nStartFragment:\d+\nEndFragment:\d+/gi, "")).replace(/<b[^>]+id="?docs-internal-[^>]*>/gi, "")).replace(/<br class="?Apple-interchange-newline"?>/gi, ""), [ /<!--[\s\S]+?-->/gi, /<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|meta|link|\w:\w+)(?=[\s\/>]))[^>]*>/gi, [ /<(\/?)s>/gi, "<$1strike>" ], [ /&nbsp;/gi, "\xa0" ], [ /<span\s+style\s*=\s*"\s*mso-spacerun\s*:\s*yes\s*;?\s*"\s*>([\s\u00a0]*)<\/span>/gi, function(str, spaces) {
                        return 0 < spaces.length ? spaces.replace(/./, " ").slice(Math.floor(spaces.length / 2)).split("").join("\xa0") : "";
                    } ] ]), settings.inline_styles && (content = (content = content.replace(/<(u|strike)>/gi, function(match, node) {
                        return '<span style="text-decoration:' + ("u" === node ? "underline" : "line-through") + ';">';
                    })).replace(/<\/(u|strike)>/g, "</span>")), settings.forced_root_block && (content = content.replace(/<br><br>/gi, "")), 
                    keepStyles = settings.paste_retain_style_properties, removeStyles = settings.paste_remove_style_properties, 
                    !1 !== settings.paste_remove_styles ? (validStyles = {
                        "font-weight": {},
                        "font-style": {}
                    }, keepStyles && tinymce.is(keepStyles, "string") && (styleProps$1 = tinymce.explode(keepStyles), 
                    each$2(styleProps$1, function(style, i) {
                        if ("border" === style) return styleProps$1 = styleProps$1.concat(borderStyles), 
                        !0;
                    }))) : removeStyles && tinymce.is(removeStyles, "string") && (removeProps = tinymce.explode(removeStyles), 
                    each$2(removeProps, function(style, i) {
                        if ("border" === style) return removeProps = removeProps.concat(borderStyles), 
                        !0;
                    }), styleProps$1 = tinymce.grep(styleProps$1, function(prop) {
                        return -1 === tinymce.inArray(removeProps, prop);
                    })), each$2(styleProps$1, function(style) {
                        if ("border" === style) return each$2(borderStyles, function(name) {
                            validStyles[name] = {};
                        }), !0;
                        validStyles[style] = {};
                    }), settings.paste_word_valid_elements || "-strong/b,-em/i,-u,-span,-p,-ol[type|start|reversed],-ul,-li,-h1,-h2,-h3,-h4,-h5,-h6,-p/div,-a[href|name],img[src|alt|width|height],sub,sup,strike,br,del,table[width],tr,td[colspan|rowspan|width|valign],th[colspan|rowspan|width],thead,tfoot,tbody"), removeStyles = ("style" == settings.paste_process_stylesheets && (keepStyles += ",style"), 
                    new Schema({
                        valid_elements: keepStyles,
                        valid_children: "-li[p]"
                    })), footnotes = ("html5" !== settings.schema && removeStyles.getElementRule("table") && removeStyles.addValidElements("table[width|border|cellpadding|cellspacing]"), 
                    each$2(removeStyles.elements, function(rule) {
                        rule.attributes.class || (rule.attributes.class = {}, rule.attributesOrder.push("class")), 
                        rule.attributes.style || (rule.attributes.style = {}, rule.attributesOrder.push("style"));
                    }), (keepStyles = new DomParser$1({}, removeStyles)).addAttributeFilter("style", function(nodes) {
                        for (var node, style, i = nodes.length; i--; ) (style = (node = nodes[i]).attr("style")) && -1 !== style.indexOf("mso-list") && "li" !== node.name && node.attr("data-mce-word-list", 1), 
                        node.attr("style", function(node, styleValue) {
                            var matches, outputStyles = {}, styles = editor.dom.parseStyle(styleValue);
                            return each$2(styles, function(value, name) {
                                switch (name) {
                                  case "mso-list":
                                    (matches = /\w+ \w+([0-9]+)/i.exec(styleValue)) && (node._listLevel = parseInt(matches[1], 10)), 
                                    /Ignore/i.test(value) && node.firstChild && (node._listIgnore = !0, 
                                    node.firstChild._listIgnore = !0);
                                    break;

                                  case "horiz-align":
                                    name = "text-align";
                                    break;

                                  case "vert-align":
                                    name = "vertical-align";
                                    break;

                                  case "font-color":
                                  case "mso-foreground":
                                  case "color":
                                    name = "color", "windowtext" == value && (value = "");
                                    break;

                                  case "mso-background":
                                  case "mso-highlight":
                                    name = "background";
                                    break;

                                  case "font-weight":
                                  case "font-style":
                                    "normal" == value && (value = "");
                                    break;

                                  case "mso-element":
                                    if (/^(comment|comment-list)$/i.test(value)) return void node.remove();
                                    break;

                                  case "margin-left":
                                    var indentValue;
                                    "p" === node.name && !1 !== settings.paste_convert_indents && (indentValue = parseInt(editor.settings.indentation, 10), 
                                    value = parseInt(value, 10), value = Math.round(value / indentValue) * indentValue) && (node.attr("data-mce-indent", "" + value), 
                                    value = "");
                                }
                                return 0 === name.indexOf("mso-comment") ? (node.remove(), 
                                !0) : 0 === name.indexOf("mso-") || (value && -1 !== tinymce.inArray(pixelStyles, name) && (value = convertToPixels(value)), 
                                void (validStyles[name] && (outputStyles[name] = value)));
                            }), /(bold|700|800|900)/i.test(outputStyles["font-weight"]) && editor.schema.isValidChild("strong", node.name) && (delete outputStyles["font-weight"], 
                            node.wrap(new Node("strong", 1))), /(italic)/i.test(outputStyles["font-style"]) && editor.schema.isValidChild("em", node.name) && (delete outputStyles["font-style"], 
                            node.wrap(new Node("em", 1))), (outputStyles = editor.dom.serializeStyle(outputStyles, node.name)) || null;
                        }(node, style)), "span" == node.name && node.parent && !node.attributes.length && node.unwrap();
                    }), keepStyles.addAttributeFilter("class", function(nodes) {
                        for (var node, i = nodes.length; i--; ) {
                            var parent, className = (node = nodes[i]).attr("class");
                            /^(MsoCommentReference|MsoCommentText|msoDel)$/i.test(className) ? node.remove() : (/^Mso[\w]+/i.test(className) || 0 !== settings.paste_strip_class_attributes) && (node.attr("class", null), 
                            className && -1 !== className.indexOf("MsoList") && "li" !== node.name && node.attr("data-mce-word-list", 1), 
                            className && /\s*Mso(Foot|End)note\s*/.test(className) && ((parent = node.parent) && "a" === parent.name && (node.name = "sup"), 
                            "span" !== node.name || node.attributes.length || node.unwrap()), 
                            className) && /\s*MsoQuote\s*/.test(className) && (node.name = "blockquote");
                        }
                    }), keepStyles.addNodeFilter("del", function(nodes) {
                        for (var i = nodes.length; i--; ) nodes[i].remove();
                    }), settings.paste_process_footnotes || "convert"), keepStyles = (keepStyles.addNodeFilter("a", function(nodes) {
                        for (var node, href, name, i = nodes.length; i--; ) href = (node = nodes[i]).attr("href"), 
                        name = node.attr("name"), href && -1 != href.indexOf("#_msocom_") ? node.remove() : !(href = (href = href && !name ? editor.convertURL(href) : href) && 0 == href.indexOf("#") ? href.substr(href.indexOf("#")) : href) && !name || name && !/^_?(?:toc|edn|ftn)/i.test(name) ? node.unwrap() : name && "remove" === footnotes ? node.remove() : name && "unlink" === footnotes ? node.unwrap() : (node.attr({
                            href: href,
                            name: null
                        }), "html4" === settings.schema ? node.attr("name", name) : node.attr("id", name));
                    }), keepStyles.addNodeFilter("span", function(nodes) {
                        for (var node, i = nodes.length; i--; ) (node = nodes[i]).parent && !node.attributes.length && node.unwrap();
                    }), settings.paste_remove_paragraph_in_table_cell && keepStyles.addNodeFilter("td", function(nodes) {
                        for (var node, i = nodes.length; i--; ) (node = nodes[i]).firstChild && "p" == node.firstChild.name && node.firstChild === node.lastChild && node.firstChild.unwrap();
                    }), keepStyles.parse(content));
                    if (!1 !== settings.paste_convert_word_fake_lists) {
                        var currentListNode, prevListNode, node = keepStyles, lastLevel = 1;
                        function trimListStart(node, regExp) {
                            if (3 !== node.type || !regExp.test(node.value)) {
                                if (node = node.firstChild) do {
                                    if (!trimListStart(node, regExp)) return;
                                } while (node = node.next);
                                return 1;
                            }
                            node.value = node.value.replace(regExp, "");
                        }
                        function convertParagraphToLi(paragraphNode, listName, start, type) {
                            var level = paragraphNode._listLevel || lastLevel;
                            (currentListNode = level != lastLevel ? level < lastLevel ? currentListNode && currentListNode.parent.parent : (prevListNode = currentListNode, 
                            null) : currentListNode) && currentListNode.name == listName ? currentListNode.append(paragraphNode) : (prevListNode = prevListNode || currentListNode, 
                            currentListNode = new Node(listName, 1), type && /roman|alpha/.test(type) && currentListNode.attr({
                                style: listName = "list-style-type:" + type,
                                "data-mce-style": listName
                            }), 1 < start && currentListNode.attr("start", "" + start), 
                            paragraphNode.wrap(currentListNode)), paragraphNode.name = "li", 
                            lastLevel < level && prevListNode && prevListNode.lastChild.append(currentListNode), 
                            lastLevel = level, function removeIgnoredNodes(node) {
                                if (node._listIgnore) node.remove(); else if (node = node.firstChild) for (;removeIgnoredNodes(node), 
                                node = node.next; );
                            }(paragraphNode), trimListStart(paragraphNode, /^\u00a0+/), 
                            "ol" === currentListNode.name && trimListStart(paragraphNode, /^\s*([\u2022\u00b7\u00a7\u25CF]|\w+\.)/), 
                            "ul" === currentListNode.name && trimListStart(paragraphNode, /^\s*([\u2022\u00b7\u00a7\u25CF]|\w+\.)/), 
                            trimListStart(paragraphNode, /^\u00a0+/);
                        }
                        for (var elements = [], child = node.firstChild; null != child; ) if (elements.push(child), 
                        null !== (child = child.walk())) for (;void 0 !== child && child.parent !== node; ) child = child.walk();
                        for (var type, nodeText, i = 0; i < elements.length; i++) "p" == (node = elements[i]).name && node.firstChild ? (nodeText = function getText(node) {
                            var txt = "";
                            if (3 === node.type) return node.value;
                            if (node = node.firstChild) for (;txt += getText(node), 
                            node = node.next; );
                            return txt;
                        }(node), /^[\s\u00a0]*[\u2022\u00b7\u00a7\u25CF]\s*/.test(nodeText) ? convertParagraphToLi(node, "ul") : node.attr("data-mce-word-list") && (node.attr("data-mce-word-list", null), 
                        type = function(text) {
                            var found = "";
                            return text = nodeText.replace(/^[\u00a0 ]+/, ""), each$2({
                                "uppper-roman": /^[IVXLMCD]{1,2}\.[ \u00a0]/,
                                "lower-roman": /^[ivxlmcd]{1,2}\.[ \u00a0]/,
                                "upper-alpha": /^[A-Z]{1,2}[\.\)][ \u00a0]/,
                                "lower-alpha": /^[a-z]{1,2}[\.\)][ \u00a0]/,
                                numeric: /^[0-9]+\.[ \u00a0]/,
                                japanese: /^[\u3007\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d]+\.[ \u00a0]/,
                                chinese: /^[\u58f1\u5f10\u53c2\u56db\u4f0d\u516d\u4e03\u516b\u4e5d\u62fe]+\.[ \u00a0]/
                            }, function(pattern, type) {
                                if (pattern.test(text)) return found = type, !1;
                            }), found;
                        }(nodeText)) ? convertParagraphToLi(node, "ol", (nodeText = /([0-9]+)\./.exec(nodeText)) ? parseInt(nodeText[1], 10) : 1, type) : node._listLevel ? convertParagraphToLi(node, "ul", 1) : currentListNode = null) : (prevListNode = currentListNode, 
                        currentListNode = null);
                    }
                    return new Serializer$1({
                        validate: settings.validate
                    }, removeStyles).serialize(keepStyles);
                }(editor, h)), !1 === editor.settings.verify_html && (h = (h = h.replace(/<b\b([^>]*)>/gi, "<strong$1>")).replace(/<\/b>/gi, "</strong>")), 
                o.content = h);
            }(editor, o);
        }), editor.onPastePostProcess.add(function(editor, o) {
            !function(editor, o) {
                var tags, dom = editor.dom, settings = editor.settings;
                dom.remove(dom.select("div[data-mce-convert]", o.node), 1), o.pasteAsPlainText || (each$1(dom.select("span.Apple-style-span", o.node), function(n) {
                    dom.remove(n, 1);
                }), 1 == settings.paste_strip_class_attributes && each$1(dom.select("*[class]", o.node), function(el) {
                    el.removeAttribute("class");
                }), each$1(dom.select("table, td, th", o.node), function(n) {
                    var width = dom.getAttrib(n, "width");
                    width && (dom.setStyle(n, "width", width), dom.setAttrib(n, "width", "")), 
                    (width = dom.getAttrib(n, "height")) && (dom.setStyle(n, "height", width), 
                    dom.setAttrib(n, "height", ""));
                }), !1 === settings.paste_remove_styles || settings.paste_retain_style_properties ? function(editor, node) {
                    var removeProps, dom = editor.dom, editor = editor.settings, styleProps$1 = styleProps, keepStyles = editor.paste_retain_style_properties, editor = editor.paste_remove_style_properties;
                    keepStyles && tinymce.is(keepStyles, "string") && (styleProps$1 = tinymce.explode(keepStyles), 
                    each$1(styleProps$1, function(style, i) {
                        return "border" == style ? (styleProps$1 = styleProps$1.concat(borderStyles), 
                        !0) : "font" == style ? (styleProps$1 = styleProps$1.concat(fontStyles), 
                        !0) : "padding" == style || "margin" == style ? (each$1([ "top", "bottom", "right", "left" ], function(side) {
                            styleProps$1.push(style + "-" + side);
                        }), !0) : void 0;
                    })), editor && tinymce.is(editor, "string") && (removeProps = tinymce.explode(editor), 
                    each$1(removeProps, function(style, i) {
                        return "border" === style ? (removeProps = removeProps.concat(borderStyles), 
                        !0) : "font" == style ? (removeProps = removeProps.concat(fontStyles), 
                        !0) : "padding" == style || "margin" == style ? (each$1([ "top", "bottom", "right", "left" ], function(side) {
                            removeProps.push(style + "-" + side);
                        }), !0) : void 0;
                    }), styleProps$1 = tinymce.grep(styleProps$1, function(prop) {
                        return -1 === tinymce.inArray(removeProps, prop);
                    })), each$1(dom.select("*[style]", node), function(n) {
                        var ns = {}, x = 0, styles = dom.parseStyle(n.style.cssText);
                        each$1(styles, function(v, k) {
                            -1 != tinymce.inArray(styleProps$1, k) && (ns[k] = v, 
                            x++);
                        }), dom.setAttrib(n, "style", ""), ns = dom.parseStyle(dom.serializeStyle(ns, n.nodeName)), 
                        0 < x ? dom.setStyles(n, ns) : "SPAN" != n.nodeName || n.className || dom.remove(n, !0), 
                        tinymce.isWebKit && n.removeAttribute("data-mce-style");
                    }), each$1(dom.select("*[align]", node), function(el) {
                        var v = dom.getAttrib(el, "align");
                        "left" !== v && "right" !== v && "center" !== v || (/(IFRAME|IMG|OBJECT|VIDEO|AUDIO|EMBED)/i.test(el.nodeName) ? "center" === v ? dom.setStyles(el, {
                            margin: "auto",
                            display: "block"
                        }) : dom.setStyle(el, "float", v) : dom.setStyle(el, "text-align", v)), 
                        el.removeAttribute("align");
                    });
                }(editor, o.node) : each$1(dom.select("*[style]", o.node), function(el) {
                    el.removeAttribute("style"), el.removeAttribute("data-mce-style");
                }), o.wordContent && function(editor, node) {
                    var dom = editor.dom, borderColors = [ "border-top-color", "border-right-color", "border-bottom-color", "border-left-color" ], positions = [ "top", "right", "bottom", "left" ];
                    each$2(dom.select("table[style], td[style], th[style]", node), function(n) {
                        var styles = {};
                        each$2(borderStyles, function(name) {
                            var value;
                            /-(top|right|bottom|left)-/.test(name) && (value = dom.getStyle(n, name), 
                            -1 !== name.indexOf("color") && ("currentcolor" !== value && "windowtext" !== value || each$2(borderColors, function(str) {
                                return str === name || (str = dom.getStyle(n, str), 
                                !!/(currentcolor|windowtext)/.test(str)) || void (value = str);
                            }), value = namedColorToHex(value)), "medium" === value && (value = "1"), 
                            (value = -1 !== name.indexOf("style") && "none" === value ? "solid" : value) && /^\d[a-z]?/.test(value) && (value = convertToPixels(value)), 
                            styles[name] = value);
                        }), each$2(positions, function(pos) {
                            var padding = dom.getStyle(n, "padding-" + pos), margin = dom.getStyle(n, "margin-" + pos);
                            padding && (styles["padding-" + pos] = convertToPixels(padding)), 
                            margin && (styles["margin-" + pos] = convertToPixels(margin));
                        }), each$2(styles, function(value, name) {
                            var prefix;
                            -1 !== name.indexOf("-width") && "" === value && (prefix = name.replace(/-width/, ""), 
                            delete styles[prefix + "-style"], delete styles[prefix + "-color"], 
                            delete styles[name]), -1 !== name.indexOf("color") && (styles[name] = namedColorToHex(value));
                        }), each$2(backgroundStyles, function(def, name) {
                            var value = dom.getStyle(n, name);
                            styles[name] = value === def ? "" : value;
                        }), dom.setStyle(n, "border", ""), dom.setStyle(n, "background", ""), 
                        dom.setStyles(n, styles);
                    }), each$2(dom.select("[data-mce-indent]", node), function(el) {
                        var value, style;
                        "p" === el.nodeName && (value = dom.getAttrib(el, "data-mce-indent"), 
                        style = editor.settings.indent_use_margin ? "margin-left" : "padding-left", 
                        dom.setStyle(el, style, value + "px")), dom.setAttrib(el, "data-mce-indent", "");
                    }), each$2(dom.select("[data-mce-word-list]", node), function(el) {
                        el.removeAttribute("data-mce-word-list");
                    });
                }(editor, o.node), each$1(dom.select("img", o.node), function(el) {
                    var src = dom.getAttrib(el, "src");
                    !src || /^(file:|data:image)\//i.test(src) ? settings.paste_upload_data_images ? dom.setAttrib(el, "data-mce-upload-marker", "1") : dom.remove(el) : dom.setAttrib(el, "src", editor.convertURL(src));
                }), isIE$1 && each$1(dom.select("a", o.node), function(el) {
                    each$1(dom.select("font,u"), function(n) {
                        dom.remove(n, 1);
                    });
                }), settings.paste_remove_tags && dom.remove(dom.select(settings.paste_remove_tags, o.node), 1), 
                settings.paste_keep_tags && (tags = settings.paste_keep_tags, dom.remove(dom.select("*:not(" + tags + ")", o.node), 1)), 
                settings.paste_remove_spans ? dom.remove(dom.select("span", o.node), 1) : (dom.remove(dom.select("span:empty", o.node)), 
                each$1(dom.select("span", o.node), function(n) {
                    n.childNodes && 0 !== n.childNodes.length || dom.remove(n), 
                    0 === dom.getAttribs(n).length && dom.remove(n, 1);
                })), !1 !== settings.paste_remove_empty_paragraphs && (dom.remove(dom.select("p:empty", o.node)), 
                each$1(dom.select("p", o.node), function(n) {
                    var h = n.innerHTML;
                    n.childNodes && 0 !== n.childNodes.length && !/^(\s|&nbsp;|\u00a0)?$/.test(h) || dom.remove(n);
                })));
            }(editor, o);
        });
    }
    var Entities = tinymce.html.Entities, isPlainText = function(text) {
        return !/<(?:(?!\/?(?:\w+))[^>]*|(?:\w+)\s+\w[^>]+)>/.test(text);
    }, convert = function(text, rootTag, rootAttrs) {
        return rootTag ? function(text, rootTag, rootAttrs) {
            var isLast, newlineFollows, isSingleNewline, pieces = text.split(/\r?\n/), i = 0, len = pieces.length, stack = [], blocks = [], rootAttrs = function(rootTag, rootAttrs) {
                var key, attrs = [], rootTag = "<" + rootTag;
                if ("object" == typeof rootAttrs) {
                    for (key in rootAttrs) Object.prototype.hasOwnProperty.call(rootAttrs, key) && attrs.push(key + '="' + Entities.encodeAllRaw(rootAttrs[key]) + '"');
                    attrs.length && (rootTag += " " + attrs.join(" "));
                }
                return rootTag + ">";
            }(rootTag, rootAttrs), rootTag = "</" + rootTag + ">";
            if (1 === pieces.length) return text;
            for (;i < len; i++) newlineFollows = !(isLast = i === len - 1) && !pieces[i + 1], 
            isSingleNewline = !pieces[i] && !stack.length, stack.push(pieces[i] || "&nbsp;"), 
            (isLast || newlineFollows || isSingleNewline) && (blocks.push(stack.join("<br>")), 
            stack = []), newlineFollows && i++;
            return 1 === blocks.length ? blocks[0] : rootAttrs + blocks.join(rootTag + rootAttrs) + rootTag;
        }(text, rootTag, rootAttrs) : text.replace(/\r?\n/g, "<br>");
    }, each = tinymce.each, VK = tinymce.VK, DomParser = tinymce.html.DomParser, Serializer = tinymce.html.Serializer, BlobCache = tinymce.file.BlobCache, isIE = tinymce.isIE || tinymce.isIE12;
    function isKeyboardPasteEvent(e) {
        return VK.metaKeyPressed(e) && 86 == e.keyCode || e.shiftKey && 45 == e.keyCode;
    }
    function pasteText(editor, text) {
        text = editor.dom.encode(text).replace(/\r\n/g, "\n"), pasteHtml(editor, text = convert(text, editor.settings.forced_root_block, editor.settings.forced_root_block_attrs));
    }
    function pasteHtml(editor, content, internal, pasteAsPlainText) {
        var o, re;
        content && (o = {
            content: content,
            internal: internal,
            pasteAsPlainText: pasteAsPlainText
        }, internal || !1 === editor.settings.paste_enable_default_filters || (o.wordContent = function(editor, content) {
            return !!editor.settings.paste_force_cleanup || !!(/(content=\"OpenOffice.org[^\"]+\")/i.test(content) || ooRe.test(content) || /@page {/.test(content)) || /<font face="Times New Roman"|class="?Mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:WordDocument|Excel\.Sheet|Microsoft Excel\s\d+/i.test(content) || /class="OutlineElement/.test(content) || /id="?docs\-internal\-guid\-/.test(content);
        }(editor, o.content), editor.settings.paste_process_stylesheets && (o.content = function(content) {
            var div = DOM.create("div", {}, content), styles = {}, css = "", styles = tinymce.extend(styles, function(content) {
                var classes = {};
                return content = parseCssToRules(content), each$4(content, function(r) {
                    var styles;
                    r.selectorText && (styles = {}, each$4(r.style, function(name) {
                        var value = r.style.getPropertyValue(name);
                        "" !== value && "normal" !== value && "inherit" !== value && "none" !== value && "initial" !== value && (styles[name] = value);
                    }), each$4(r.selectorText.split(","), function(selector) {
                        0 != (selector = selector.trim()).indexOf(".mce") && -1 === selector.indexOf(".mce-") && -1 === selector.indexOf(".mso-") && Object.values(styles).length && (classes[selector] = {
                            styles: styles,
                            text: r.cssText
                        });
                    }));
                }), classes;
            }(content));
            return each$4(styles, function(value, selector) {
                return -1 !== selector.indexOf("Mso") || -1 !== selector.indexOf(":") || 0 === selector.indexOf("@") || void DOM.setStyles(DOM.select(selector, div), value.styles);
            }), css && div.prepend(DOM.create("style", {
                type: "text/css"
            }, css)), div.innerHTML;
        }(o.content)), o.content = trimHtml(o.content), editor.onPastePreProcess.dispatch(editor, o), 
        o.content = function(editor, html) {
            var parser = new DomParser({
                allow_event_attributes: !!editor.settings.paste_allow_event_attributes
            }, editor.schema), remove_attribs = (parser.addNodeFilter("meta,svg,script,noscript", function(nodes) {
                for (var i = nodes.length; i--; ) nodes[i].remove();
            }), editor.settings.paste_remove_spans && parser.addNodeFilter("span", function(nodes, name) {
                for (var i = nodes.length; i--; ) nodes[i].unwrap();
            }), (remove_attribs = editor.settings.paste_remove_attributes) && parser.addAttributeFilter(remove_attribs, function(nodes, name) {
                for (var i = nodes.length; i--; ) nodes[i].attr(name, null);
            }), parser.parse(html, {
                forced_root_block: !1,
                isRootContent: !0
            }));
            return new Serializer({
                validate: editor.settings.validate
            }, editor.schema).serialize(remove_attribs);
        }(editor, o.content), !1 !== editor.settings.paste_convert_urls && (o.content = function(editor, content) {
            var ex = "([-!#$%&'*+\\./0-9=?A-Z^_`a-z{|}~]+@[-!#$%&'*+\\/0-9=?A-Z^_`a-z{|}~]+.[-!#$%&'*+\\./0-9=?A-Z^_`a-z{|}~]+)", ux = "((?:news|telnet|nttp|file|http|ftp|https)://[-!#$%&'*+\\/0-9=?A-Z^_`a-z{|}~;]+.[-!#$%&'*+\\./0-9=?A-Z^_`a-z{|}~;]+)";
            function createLink(url) {
                var attribs = {
                    href: editor.dom.decode(url)
                }, params = editor.settings.link || {}, attribs = tinymce.extend(attribs, params.attributes || {});
                return editor.dom.createHTML("a", attribs, url);
            }
            function wrapContent(content) {
                return -1 === content.indexOf('data-mce-convert="url"') ? editor.dom.createHTML("div", {
                    "data-mce-convert": "url"
                }, content) : content;
            }
            var decoded = editor.dom.decode(content);
            if (!/^<img src="(data|blob):[^>]+?>/.test(content) && !/^<a([^>]+)>([\s\S]+?)<\/a>$/.test(decoded)) {
                if (!1 !== editor.settings.autolink_url) {
                    if (new RegExp("^" + ux + "$").test(content)) return createLink(content);
                    content = (content = wrapContent(content)).replace(new RegExp("((?:(?:[a-z0-9_-]+)=[\"'])|(?:}|].?))?" + ux, "gi"), function(match, extra, url) {
                        return extra ? match : createLink(url);
                    });
                }
                if (!1 !== editor.settings.autolink_email) {
                    if (new RegExp("^" + ex + "$").test(content)) return '<a href="mailto:' + content + '">' + content + "</a>";
                    content = (content = wrapContent(content)).replace(new RegExp("(href=[\"']mailto:)*" + ex, "g"), function(match, attrib, email) {
                        return attrib ? match : '<a href="mailto:' + email + '">' + email + "</a>";
                    });
                }
            }
            return content;
        }(editor, o.content)), o.node = editor.dom.create("div", {
            style: "display:none"
        }, o.content), editor.onPastePostProcess.dispatch(editor, o), o.content = o.node.innerHTML, 
        !1 !== editor.settings.paste_remove_empty_paragraphs && (o.content = o.content.replace(/<p([^>]+)>(&nbsp;|\u00a0)?<\/p>/g, "")), 
        editor.settings.paste_remove_whitespace && (o.content = o.content.replace(/(&nbsp;|\u00a0|\s| ){2,}/g, " ")), 
        editor.settings.paste_filter && (content = editor.settings.paste_filter.split(";"), 
        each(content, function(s) {
            re = /^\/.*\/(g|i|m)*$/.test(s) ? new Function("return " + s)() : new RegExp(s), 
            o.content = o.content.replace(re, "");
        }))), editor.onPasteBeforeInsert.dispatch(editor, o), function(editor, content) {
            var validate = editor.settings.validate;
            editor.settings.validate = !0, editor.execCommand("mceInsertContent", !1, content), 
            editor.settings.validate = validate;
        }(editor, o.content));
    }
    function insertClipboardContent(editor, clipboardContent, internal, pasteAsPlainText) {
        var content, text;
        editor.onGetClipboardContent.dispatch(editor, clipboardContent), content = clipboardContent["x-tinymce/html"] || clipboardContent["text/html"], 
        internal = internal || isMarked(content), content = unmark(content), function(editor) {
            var node = editor.selection.getNode();
            return !1 !== editor.settings.html_paste_in_pre && node && "PRE" === node.nodeName;
        }(editor) ? (text = clipboardContent["text/plain"], text = editor.dom.encode(text), 
        content && !text && (content = trimHtml(content), text = editor.dom.encode(content)), 
        editor.selection.setContent(text, {
            no_events: !0
        })) : (text = !1 === internal && isPlainText(content), (pasteAsPlainText = !(content.length && !text) || pasteAsPlainText) ? pasteText(editor, content = hasContentType(clipboardContent, "text/plain") && text ? clipboardContent["text/plain"] : function(html) {
            var schema = new Schema$1(), domParser = new DomParser$2({}, schema), text = "", shortEndedElements = schema.getShortEndedElements(), ignoreElements = tinymce.makeMap("script noscript style textarea video audio iframe object", " "), blockElements = schema.getBlockElements();
            return html = filter(html, [ /<!\[[^\]]+\]>/g ]), function walk(node) {
                var name = node.name, currentNode = node;
                if ("br" === name) text += "\n"; else if (shortEndedElements[name] && (text += " "), 
                ignoreElements[name]) text += " "; else {
                    if (3 == node.type && (text += node.value), !node.shortEnded && (node = node.firstChild)) for (;walk(node), 
                    node = node.next; );
                    blockElements[name] && currentNode.next && (text += "\n", "p" == name) && (text += "\n");
                }
            }(domParser.parse(html)), text;
        }(content)) : pasteHtml(editor, content, internal, pasteAsPlainText));
    }
    function isBrokenAndroidClipboardEvent(e) {
        return e = e.clipboardData, -1 !== navigator.userAgent.indexOf("Android") && e && e.items && 0 === e.items.length;
    }
    function isHtmlPaste(content) {
        return hasContentType(content, "text/html");
    }
    function pasteImageData(editor, e, lastRng) {
        var dataTransfer = e.clipboardData || e.dataTransfer;
        function processItems(items) {
            var i, hadImage = !1;
            if (items) for (i = 0; i < items.length; i++) {
                var blob, reader, item = items[i];
                /^image\/(jpeg|png|gif|bmp)$/.test(item.type) && (hadImage = !0, 
                e.preventDefault(), !1 !== editor.settings.paste_data_images ? (blob = item.getAsFile ? item.getAsFile() : item, 
                (reader = new FileReader()).onload = function() {
                    var html = function(editor, rng, reader, blob) {
                        rng && (editor.selection.setRng(rng), rng = null);
                        var blobInfo, idx, base64 = -1 !== (idx = (reader = rng = reader.result).indexOf(",")) ? reader.substr(idx + 1) : null;
                        return (reader = new Image()).src = rng, idx = editor.settings, 
                        editor = reader, !idx.images_dataimg_filter || idx.images_dataimg_filter(editor) ? ((reader = BlobCache.findFirst(function(cachedBlobInfo) {
                            return cachedBlobInfo.base64() === base64;
                        })) ? blobInfo = reader : (blobInfo = BlobCache.create("mceclip", blob, base64), 
                        BlobCache.add(blobInfo)), '<img src="' + blobInfo.blobUri() + '" />') : '<img src="' + rng + '" />';
                    }(editor, lastRng, reader, blob);
                    pasteHtml(editor, html);
                }, reader.readAsDataURL(blob)) : pasteHtml(editor, '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-mce-upload-marker="1" />', !0));
            }
            return hadImage;
        }
        return dataTransfer && !processItems(dataTransfer.items) && processItems(dataTransfer.files), 
        1;
    }
    function setup$1(editor, pasteBin) {
        var keyboardPastePlainTextState, keyboardPasteTimeStamp = 0;
        function getContentAndInsert(e) {
            var clipboardTimer = new Date().getTime(), clipboardContent = function(editor) {
                return getDataTransferItems(e.clipboardData || e.dataTransfer || editor.getDoc().dataTransfer);
            }(editor), clipboardDelay = new Date().getTime() - clipboardTimer;
            function isKeyBoardPaste() {
                return "drop" != e.type && new Date().getTime() - keyboardPasteTimeStamp - clipboardDelay < 1e3;
            }
            var content, internal = hasContentType(clipboardContent, internalMimeType), pasteAsPlainText = keyboardPastePlainTextState;
            keyboardPastePlainTextState = !1, e.isDefaultPrevented() || isBrokenAndroidClipboardEvent(e) || (isKeyBoardPaste() || e.preventDefault(), 
            !isIE || isKeyBoardPaste() && !e.ieFake || hasContentType(clipboardContent, "text/html") || (pasteBin.create(), 
            editor.dom.bind(editor.dom.get("mcepastebin"), "paste", function(e) {
                e.stopPropagation();
            }), editor.getDoc().execCommand("Paste", !1, null), clipboardContent["text/html"] = pasteBin.getHtml()), 
            (content = (content = clipboardContent)["text/plain"]) && 0 === content.indexOf("file://")) || !hasHtmlOrText(clipboardContent) && pasteImageData(editor, e, pasteBin.getLastRng() || editor.selection.getRng()) ? pasteBin.remove() : (isHtmlPaste(clipboardContent) || (clipboardTimer = pasteBin.getHtml(), 
            pasteBin.isDefaultContent(clipboardTimer) ? pasteAsPlainText = !0 : clipboardContent["text/html"] = clipboardTimer), 
            isHtmlPaste(clipboardContent) ? (e.preventDefault(), internal = internal || isMarked(clipboardContent["text/html"]), 
            insertClipboardContent(editor, clipboardContent, internal, pasteAsPlainText), 
            pasteBin.remove()) : hasContentType(clipboardContent, "text/plain") && hasContentType(clipboardContent, "text/uri-list") ? (e.preventDefault(), 
            clipboardContent["text/html"] = clipboardContent["text/plain"], insertClipboardContent(editor, clipboardContent, internal, pasteAsPlainText)) : setTimeout(function() {
                function block(e) {
                    e.preventDefault();
                }
                editor.dom.bind(editor.getDoc(), "mousedown", block), editor.dom.bind(editor.getDoc(), "keydown", block), 
                insertClipboardContent(editor, clipboardContent, internal, pasteAsPlainText), 
                editor.dom.unbind(editor.getDoc(), "mousedown", block), editor.dom.unbind(editor.getDoc(), "keydown", block), 
                pasteBin.remove();
            }, 0));
        }
        function removePasteBinOnKeyUp(e) {
            isKeyboardPasteEvent(e) && !e.isDefaultPrevented() && pasteBin.remove();
        }
        editor.addCommand("mceInsertClipboardContent", function(u, data) {
            data.text && pasteText(editor, data.text), data.content && pasteHtml(editor, data.content, data.internal || !1);
        }), editor.onPaste.add(function(editor, e) {
            if (e.isDefaultPrevented() || isBrokenAndroidClipboardEvent(e)) return pasteBin.remove(), 
            !1;
            getContentAndInsert(e), e.preventDefault();
        }), editor.onKeyDown.add(function(editor, e) {
            isKeyboardPasteEvent(e) && !e.isDefaultPrevented() && (keyboardPasteTimeStamp = new Date().getTime(), 
            e.stopImmediatePropagation(), keyboardPastePlainTextState = e.shiftKey && 86 == e.keyCode, 
            editor.dom.bind(editor.getBody(), "keyup", function handler(e) {
                removePasteBinOnKeyUp(e), editor.dom.unbind(editor.getBody(), "keyup", handler);
            }), editor.dom.bind(editor.getBody(), "paste", function handler(e) {
                removePasteBinOnKeyUp(e), editor.dom.unbind(editor.getBody(), "paste", handler);
            }));
        });
    }
    function getCaretRangeFromEvent(editor, e) {
        return RangeUtils.getCaretRangeFromPoint(e.clientX, e.clientY, editor.getDoc());
    }
    function setFocusedRange(editor, rng) {
        editor.focus(), editor.selection.setRng(rng);
    }
    function PasteBin(editor) {
        var lastRng;
        return {
            create: function() {
                return lastRng = editor.selection.getRng(), function(editor, lastRng) {
                    var scrollContainer, rect, dom = editor.dom, body = editor.getBody(), scrollTop = editor.dom.getViewPort(editor.getWin()).y, top = 20;
                    editor.inline && (scrollContainer = editor.selection.getScrollContainer()) && 0 < scrollContainer.scrollTop && (scrollTop = scrollContainer.scrollTop), 
                    lastRng.getClientRects && ((rect = function(rng) {
                        var node, container = rng.startContainer, rects = rng.getClientRects();
                        if (rects.length) return rects[0];
                        if (rng.collapsed && 1 == container.nodeType) {
                            for (node = container.childNodes[lastRng.startOffset]; node && 3 == node.nodeType && !node.data.length; ) node = node.nextSibling;
                            if (node) return "BR" == node.tagName && (container = dom.doc.createTextNode("\ufeff"), 
                            node.parentNode.insertBefore(container, node), (rng = dom.createRng()).setStartBefore(container), 
                            rng.setEndAfter(container), rects = rng.getClientRects(), 
                            dom.remove(container)), rects.length ? rects[0] : void 0;
                        }
                    }(lastRng)) ? top = scrollTop + (rect.top - dom.getPos(body).y) : (top = scrollTop, 
                    (rect = lastRng.startContainer) && 1 == (rect = 3 == rect.nodeType && rect.parentNode != body ? rect.parentNode : rect).nodeType && (top = dom.getPos(rect, scrollContainer || body).y))), 
                    scrollTop = editor.dom.add(editor.getBody(), "div", {
                        id: "mcepastebin",
                        contentEditable: !0,
                        "data-mce-bogus": "all",
                        style: "position: absolute; top: " + top + "px; width: 10px; height: 10px; overflow: hidden; opacity: 0"
                    }, pasteBinDefaultContent), tinymce.isGecko && dom.setStyle(scrollTop, "left", "rtl" == dom.getStyle(body, "direction", !0) ? 65535 : -65535), 
                    dom.bind(scrollTop, "beforedeactivate focusin focusout", function(e) {
                        e.stopPropagation();
                    }), scrollTop.focus(), editor.selection.select(scrollTop, !0);
                }(editor, lastRng);
            },
            remove: function() {
                return function(editor, lastRng) {
                    if (getEl(editor)) {
                        for (var pasteBinClone; pasteBinClone = editor.dom.get("mcepastebin"); ) editor.dom.remove(pasteBinClone), 
                        editor.dom.unbind(pasteBinClone);
                        lastRng && editor.selection.setRng(lastRng);
                    }
                }(editor, lastRng);
            },
            getEl: function() {
                return getEl(editor);
            },
            getHtml: function() {
                return function(editor) {
                    function copyAndRemove(toElm, fromElm) {
                        toElm.appendChild(fromElm), editor.dom.remove(fromElm, !0);
                    }
                    var i, dirtyWrappers, cleanWrapper, pasteBinClones = tinymce.grep(editor.getBody().childNodes, function(elm) {
                        return "mcepastebin" === elm.id;
                    }), pasteBinElm = pasteBinClones.shift();
                    for (tinymce.each(pasteBinClones, function(pasteBinClone) {
                        copyAndRemove(pasteBinElm, pasteBinClone);
                    }), i = (dirtyWrappers = editor.dom.select("div[id=mcepastebin]", pasteBinElm)).length - 1; 0 <= i; i--) cleanWrapper = editor.dom.create("div"), 
                    pasteBinElm.insertBefore(cleanWrapper, dirtyWrappers[i]), copyAndRemove(cleanWrapper, dirtyWrappers[i]);
                    return pasteBinElm ? pasteBinElm.innerHTML : "";
                }(editor);
            },
            getLastRng: function() {
                return lastRng;
            },
            isDefaultContent: function(value) {
                return value === pasteBinDefaultContent;
            }
        };
    }
    function getEl(editor) {
        return editor.dom.get("mcepastebin");
    }
    var AutoLinkPattern, RangeUtils = tinymce.dom.RangeUtils, Delay = tinymce.util.Delay, draggingInternallyState = !1, pasteBinDefaultContent = "%MCEPASTEBIN%", Dispatcher = tinymce.util.Dispatcher;
    tinymce.Clipboard = function(editor) {
        var pasteBin = new PasteBin(editor);
        editor.onGetClipboardContent = new Dispatcher(this), editor.onPastePreProcess = new Dispatcher(this), 
        editor.onPastePostProcess = new Dispatcher(this), editor.onPasteBeforeInsert = new Dispatcher(this), 
        function(editor) {
            tinymce.isWebKit && editor.onPastePreProcess.add(function(editor, o) {
                o.isWordContent || (o.content = function(editor, content) {
                    var dom, node, webKitStyles = editor.settings.paste_webkit_styles;
                    return !0 === editor.settings.paste_remove_styles_if_webkit && "all" != webKitStyles ? (content = (webKitStyles = webKitStyles && webKitStyles.split(/[, ]/)) ? (dom = editor.dom, 
                    node = editor.selection.getNode(), content.replace(/(<[^>]+) style="([^"]*)"([^>]*>)/gi, function(all, before, value, after) {
                        var inputStyles = dom.parseStyle(value, "span"), outputStyles = {};
                        if ("none" === webKitStyles) return before + after;
                        for (var i = 0; i < webKitStyles.length; i++) {
                            var inputValue = inputStyles[webKitStyles[i]], currentValue = dom.getStyle(node, webKitStyles[i], !0);
                            /color/.test(webKitStyles[i]) && (inputValue = dom.toHex(inputValue), 
                            currentValue = dom.toHex(currentValue)), currentValue != inputValue && (outputStyles[webKitStyles[i]] = inputValue);
                        }
                        return (outputStyles = dom.serializeStyle(outputStyles, "span")) ? before + ' style="' + outputStyles + '"' + after : before + after;
                    })) : content.replace(/(<[^>]+) style="([^"]*)"([^>]*>)/gi, "$1$3")).replace(/(<[^>]+) data-mce-style="([^"]+)"([^>]*>)/gi, function(all, before, value, after) {
                        return before + ' style="' + value + '"' + after;
                    }) : content;
                }(editor, o.content));
            }), (tinymce.isIE || tinymce.isIE12) && editor.onPastePostProcess.add(function(editor, o) {
                o.isWordContent || (o.content = function(editor, html) {
                    var blockElements = [];
                    return each$3(editor.schema.getBlockElements(), function(block, blockName) {
                        blockElements.push(blockName);
                    }), html = filter(html, [ [ new RegExp("(?:<br>&nbsp;[\\s\\r\\n]+|<br>)*(<\\/?(" + blockElements.join("|") + ")[^>]*>)(?:<br>&nbsp;[\\s\\r\\n]+|<br>)*", "g"), "$1" ] ]), 
                    filter(html, [ [ /<br><br>/g, "<BR><BR>" ], [ /<br>/g, " " ], [ /<BR><BR>/g, "<br>" ] ]);
                }(editor, o.content));
            });
        }(editor), setup$2(editor), editor.onPreInit.add(function() {
            !function(editor) {
                editor.onCut.add(cut), editor.onCopy.add(copy);
            }(editor), function(editor) {
                editor.settings.paste_block_drop && editor.dom.bind(editor.getBody(), [ "dragend", "dragover", "draggesture", "dragdrop", "drop", "drag" ], function(e) {
                    e.preventDefault(), e.stopPropagation();
                }), !1 === editor.settings.paste_data_images && editor.dom.bind(editor.getBody(), "drop", function(e) {
                    var dataTransfer = e.dataTransfer;
                    dataTransfer && dataTransfer.files && 0 < dataTransfer.files.length && e.preventDefault();
                }), editor.dom.bind(editor.getBody(), "drop", function(e) {
                    var dropContent, internal, content, rng = getCaretRangeFromEvent(editor, e);
                    e.isDefaultPrevented() || (internal = hasContentType(dropContent = getDataTransferItems(e.dataTransfer), internalMimeType) || draggingInternallyState, 
                    (hasHtmlOrText(dropContent) && !function(content) {
                        return (content = content["text/plain"]) && 0 === content.indexOf("file://");
                    }(dropContent) || !pasteImageData(e, rng)) && rng && !1 !== editor.settings.paste_filter_drop && (content = dropContent[internalMimeType] || dropContent["text/html"] || dropContent["text/plain"]) && (e.preventDefault(), 
                    Delay.setEditorTimeout(editor, function() {
                        editor.undoManager.add(), internal && (editor.execCommand("Delete", !1, null, {
                            skip_undo: !0
                        }), editor.selection.getRng().deleteContents()), setFocusedRange(editor, rng), 
                        content = trimHtml(content);
                        var data = {};
                        dropContent["text/html"] ? (content = function(content) {
                            return content = DOM.create("div", {}, content), each$4(DOM.select("[style]", content), function(elm) {
                                elm.setAttribute("style", elm.getAttribute("data-mce-style") || "");
                            }), content.innerHTML;
                        }(content), data.content = content, data.internal = internal || draggingInternallyState) : data.text = content, 
                        editor.execCommand("mceInsertClipboardContent", !1, data, {
                            skip_undo: !0
                        });
                    })));
                }), editor.dom.bind(editor.getBody(), "dragstart", function(e) {
                    draggingInternallyState = !0, e.altKey && (e.dataTransfer.effectAllowed = "copy", 
                    e.dataTransfer.dropEffect = "copy");
                }), editor.dom.bind(editor.getBody(), [ "dragover", "dragend" ], function(e) {
                    editor.settings.clipboard_paste_data_images && 0 == draggingInternallyState && (e.preventDefault(), 
                    setFocusedRange(editor, getCaretRangeFromEvent(editor, e))), 
                    "dragend" == e.type && (draggingInternallyState = !1);
                });
            }(editor), setup$1(editor, pasteBin);
        });
    }, function(tinymce) {
        var NodeType = tinymce.dom.NodeType, DOMUtils = tinymce.DOM, Fun = tinymce.util.Fun, Arr = tinymce.util.Arr, isText = NodeType.isText, isBogus = NodeType.isBogus, nodeIndex = DOMUtils.nodeIndex;
        function getChildNodes(node) {
            return node ? Arr.reduce(node.childNodes, function(result, node) {
                return isBogus(node) && "BR" != node.nodeName ? result = result.concat(getChildNodes(node)) : result.push(node), 
                result;
            }, []) : [];
        }
        function equal(targetValue) {
            return function(value) {
                return targetValue === value;
            };
        }
        function createPathItem(node) {
            return (isText(node) ? "text()" : node.nodeName.toLowerCase()) + "[" + function(node) {
                var nodes = getChildNodes(function normalizedParent(node) {
                    return node = node.parentNode, isBogus(node) ? normalizedParent(node) : node;
                }(node)), index = Arr.findIndex(nodes, equal(node), node), nodes = nodes.slice(0, index + 1), index = Arr.reduce(nodes, function(result, node, i) {
                    return isText(node) && isText(nodes[i - 1]) && result++, result;
                }, 0);
                return nodes = Arr.filter(nodes, NodeType.matchNodeNames(node.nodeName)), 
                Arr.findIndex(nodes, equal(node), node) - index;
            }(node) + "]";
        }
        tinymce.caret.CaretBookmark = {
            create: function(rootNode, caretPosition) {
                var outputOffset, childNodes, path = [], container = caretPosition.container(), caretPosition = caretPosition.offset();
                return isText(container) ? outputOffset = function(textNode, offset) {
                    for (;(textNode = textNode.previousSibling) && isText(textNode); ) offset += textNode.data.length;
                    return offset;
                }(container, caretPosition) : (caretPosition >= (childNodes = container.childNodes).length ? (outputOffset = "after", 
                caretPosition = childNodes.length - 1) : outputOffset = "before", 
                container = childNodes[caretPosition]), path.push(createPathItem(container)), 
                childNodes = function(rootNode, node) {
                    var parents = [];
                    for (node = node.parentNode; node != rootNode; node = node.parentNode) parents.push(node);
                    return parents;
                }(rootNode, container), childNodes = Arr.filter(childNodes, Fun.negate(NodeType.isBogus)), 
                (path = path.concat(Arr.map(childNodes, createPathItem))).reverse().join("/") + "," + outputOffset;
            },
            resolve: function(rootNode, path) {
                var parts;
                {
                    if (path && (path = (parts = path.split(","))[0].split("/"), 
                    parts = 1 < parts.length ? parts[1] : "before", path = Arr.reduce(path, function(result, value) {
                        return (value = /([\w\-\(\)]+)\[([0-9]+)\]/.exec(value)) ? ("text()" === value[1] && (value[1] = "#text"), 
                        name = value[1], value = parseInt(value[2], 10), nodes = getChildNodes(result), 
                        nodes = Arr.filter(nodes, function(node, index) {
                            return !isText(node) || !isText(nodes[index - 1]);
                        }), (nodes = Arr.filter(nodes, NodeType.matchNodeNames(name)))[value]) : null;
                        var name, nodes;
                    }, rootNode))) {
                        if (isText(path)) {
                            for (var container = path, offset = parseInt(parts, 10), dataLen, node = container, targetOffset = 0; isText(node); ) {
                                if (dataLen = node.data.length, targetOffset <= offset && offset <= targetOffset + dataLen) {
                                    container = node, offset -= targetOffset;
                                    break;
                                }
                                if (!isText(node.nextSibling)) {
                                    container = node, offset = dataLen;
                                    break;
                                }
                                targetOffset += dataLen, node = node.nextSibling;
                            }
                            return offset > container.data.length && (offset = container.data.length), 
                            new tinymce.caret.CaretPosition(container, offset);
                        }
                        return parts = "after" === parts ? nodeIndex(path) + 1 : nodeIndex(path), 
                        new tinymce.caret.CaretPosition(path.parentNode, parts);
                    }
                    return null;
                }
            }
        };
    }(tinymce), function(tinymce) {
        var NodeType = tinymce.dom.NodeType, Zwsp = tinymce.text.Zwsp, isElement = NodeType.isElement, isText = NodeType.isText;
        function isCaretContainerBlock(node) {
            return isText(node) && (node = node.parentNode), isElement(node) && node.hasAttribute("data-mce-caret");
        }
        function isCaretContainerInline(node) {
            return isText(node) && Zwsp.isZwsp(node.data);
        }
        function isCaretContainer(node) {
            return isCaretContainerBlock(node) || isCaretContainerInline(node);
        }
        function startsWithCaretContainer(node) {
            return isText(node) && node.data[0] == Zwsp.ZWSP;
        }
        function endsWithCaretContainer(node) {
            return isText(node) && node.data[node.data.length - 1] == Zwsp.ZWSP;
        }
        tinymce.caret.CaretContainer = {
            isCaretContainer: isCaretContainer,
            isCaretContainerBlock: isCaretContainerBlock,
            isCaretContainerInline: isCaretContainerInline,
            showCaretContainerBlock: function(caretContainer) {
                var elm;
                return caretContainer && caretContainer.hasAttribute("data-mce-caret") ? (elm = (elm = (elm = caretContainer).getElementsByTagName("br"))[elm.length - 1], 
                NodeType.isBogus(elm) && elm.parentNode.removeChild(elm), caretContainer.removeAttribute("data-mce-caret"), 
                caretContainer.removeAttribute("data-mce-bogus"), caretContainer.removeAttribute("style"), 
                caretContainer.removeAttribute("_moz_abspos"), caretContainer) : null;
            },
            insertInline: function(node, before) {
                var sibling, textNode = node.ownerDocument.createTextNode(Zwsp.ZWSP), parentNode = node.parentNode;
                if (before) {
                    if (sibling = node.previousSibling, isText(sibling)) {
                        if (isCaretContainer(sibling)) return sibling;
                        if (endsWithCaretContainer(sibling)) return sibling.splitText(sibling.data.length - 1);
                    }
                    parentNode.insertBefore(textNode, node);
                } else {
                    if (sibling = node.nextSibling, isText(sibling)) {
                        if (isCaretContainer(sibling)) return sibling;
                        if (startsWithCaretContainer(sibling)) return sibling.splitText(1), 
                        sibling;
                    }
                    node.nextSibling ? parentNode.insertBefore(textNode, node.nextSibling) : parentNode.appendChild(textNode);
                }
                return textNode;
            },
            insertBlock: function(blockName, node, before) {
                var br;
                return (blockName = node.ownerDocument.createElement(blockName)).setAttribute("data-mce-caret", before ? "before" : "after"), 
                blockName.setAttribute("data-mce-bogus", "all"), blockName.appendChild(((br = document.createElement("br")).setAttribute("data-mce-bogus", "1"), 
                br)), br = node.parentNode, before ? br.insertBefore(blockName, node) : node.nextSibling ? br.insertBefore(blockName, node.nextSibling) : br.appendChild(blockName), 
                blockName;
            },
            hasContent: function(node) {
                return node.firstChild !== node.lastChild || !NodeType.isBr(node.firstChild);
            },
            startsWithCaretContainer: startsWithCaretContainer,
            endsWithCaretContainer: endsWithCaretContainer
        };
    }(tinymce), function(tinymce) {
        var NodeType = tinymce.dom.NodeType, CaretContainer = tinymce.caret.CaretContainer, Arr = tinymce.util.Arr, isContentEditableTrue = NodeType.isContentEditableTrue, isContentEditableFalse = NodeType.isContentEditableFalse, isBr = NodeType.isBr, isText = NodeType.isText, isInvalidTextElement = NodeType.matchNodeNames("script style textarea"), isAtomicInline = NodeType.matchNodeNames("img input textarea hr iframe video audio object"), isTable = NodeType.matchNodeNames("table"), isCaretContainer = CaretContainer.isCaretContainer;
        function isCaretCandidate(node) {
            return !isCaretContainer(node) && (isText(node) ? !isInvalidTextElement(node.parentNode) : isAtomicInline(node) || isBr(node) || isTable(node) || isContentEditableFalse(node));
        }
        function isInEditable(node, rootNode) {
            for (node = node.parentNode; node && node != rootNode; node = node.parentNode) {
                if (isContentEditableFalse(node)) return !1;
                if (isContentEditableTrue(node)) return !0;
            }
            return !0;
        }
        tinymce.caret.CaretCandidate = {
            isCaretCandidate: isCaretCandidate,
            isInEditable: isInEditable,
            isAtomic: function(node) {
                return isAtomicInline(node) || function(node) {
                    return !!isContentEditableFalse(node) && !0 !== Arr.reduce(node.getElementsByTagName("*"), function(result, elm) {
                        return result || isContentEditableTrue(elm);
                    }, !1);
                }(node);
            },
            isEditableCaretCandidate: function(node, rootNode) {
                return isCaretCandidate(node) && isInEditable(node, rootNode);
            }
        };
    }(tinymce), function(tinymce) {
        function setNodeValue(node, text) {
            0 === text.length ? removeNode(node) : node.nodeValue = text;
        }
        function trimCount(text) {
            var trimmedText = Zwsp.trim(text);
            return {
                count: text.length - trimmedText.length,
                text: trimmedText
            };
        }
        function remove(caretContainerNode) {
            isElement(caretContainerNode) && CaretContainer.isCaretContainer(caretContainerNode) && (CaretContainer.hasContent(caretContainerNode) ? caretContainerNode.removeAttribute("data-mce-caret") : removeNode(caretContainerNode)), 
            isText(caretContainerNode) && setNodeValue(caretContainerNode, Zwsp.trim(function(node) {
                try {
                    return node.nodeValue;
                } catch (ex) {
                    return "";
                }
            }(caretContainerNode)));
        }
        var NodeType = tinymce.dom.NodeType, Zwsp = tinymce.text.Zwsp, CaretContainer = tinymce.caret.CaretContainer, CaretPosition = tinymce.caret.CaretPosition, Arr = tinymce.util.Arr, isElement = NodeType.isElement, isText = NodeType.isText, removeNode = function(node) {
            var parentNode = node.parentNode;
            parentNode && parentNode.removeChild(node);
        }, removeUnchanged = function(caretContainer, pos) {
            return remove(caretContainer), pos;
        };
        tinymce.caret.CaretContainerRemove = {
            removeAndReposition: function(container, pos) {
                return (CaretPosition.isTextPosition(pos) ? function(caretContainer, pos) {
                    return (pos.container() === caretContainer ? function(caretContainer, pos) {
                        var before = trimCount(caretContainer.data.substr(0, pos.offset())), after = trimCount(caretContainer.data.substr(pos.offset()));
                        return 0 < (after = before.text + after.text).length ? (setNodeValue(caretContainer, after), 
                        new CaretPosition(caretContainer, pos.offset() - before.count)) : pos;
                    } : removeUnchanged)(caretContainer, pos);
                } : function(caretContainer, pos) {
                    return (pos.container() === caretContainer.parentNode ? function(caretContainer, pos) {
                        var parentNode = pos.container(), newPosition = Arr.indexOf(parentNode.childNodes, caretContainer).map(function(index) {
                            return index < pos.offset() ? new CaretPosition(parentNode, pos.offset() - 1) : pos;
                        }).getOr(pos);
                        return remove(caretContainer), newPosition;
                    } : removeUnchanged)(caretContainer, pos);
                })(container, pos);
            },
            remove: remove
        };
    }(tinymce), function(tinymce) {
        var NodeType = tinymce.dom.NodeType, DOMUtils = tinymce.DOM, CaretCandidate = tinymce.caret.CaretCandidate, RangeUtils = tinymce.dom.RangeUtils, ClientRect = tinymce.geom.ClientRect, ExtendingChar = tinymce.text.ExtendingChar, Fun = tinymce.util.Fun, isElement = NodeType.isElement, CaretCandidate = CaretCandidate.isCaretCandidate, isBlock = NodeType.matchStyleValues("display", "block table"), isFloated = NodeType.matchStyleValues("float", "left right"), isValidElementCaretCandidate = Fun.and(isElement, CaretCandidate, Fun.negate(isFloated)), isNotPre = Fun.negate(NodeType.matchStyleValues("white-space", "pre pre-line pre-wrap")), isText = NodeType.isText, isBr = NodeType.isBr, nodeIndex = DOMUtils.nodeIndex, resolveIndex = RangeUtils.getNode;
        function createRange(doc) {
            return "createRange" in doc ? doc.createRange() : DOMUtils.createRng();
        }
        function isWhiteSpace(chr) {
            return chr && /[\r\n\t ]/.test(chr);
        }
        function isHiddenWhiteSpaceRange(range) {
            var container = range.startContainer, offset = range.startOffset;
            return isWhiteSpace(range.toString()) && isNotPre(container.parentNode) && (isWhiteSpace((range = container.data)[offset - 1]) || isWhiteSpace(range[offset + 1]));
        }
        function CaretPosition(container, offset, clientRects) {
            function getClientRects() {
                return clientRects = clientRects || function(caretPosition) {
                    var node, clientRects = [];
                    function getBoundingClientRect(item) {
                        var clientRects = item.getClientRects();
                        return 0 < clientRects.length ? ClientRect.clone(clientRects[0]) : ClientRect.clone(item.getBoundingClientRect());
                    }
                    function collapseAndInflateWidth(clientRect, toStart) {
                        return (clientRect = ClientRect.collapse(clientRect, toStart)).width = 1, 
                        clientRect.right = clientRect.left + 1, clientRect;
                    }
                    function addUniqueAndValidRect(clientRect) {
                        0 === clientRect.height || 0 < clientRects.length && ClientRect.isEqual(clientRect, clientRects[clientRects.length - 1]) || clientRects.push(clientRect);
                    }
                    function addCharacterOffset(container, offset) {
                        var range = createRange(container.ownerDocument);
                        if (offset < container.data.length) {
                            if (ExtendingChar.isExtendingChar(container.data[offset])) return;
                            if (ExtendingChar.isExtendingChar(container.data[offset - 1]) && (range.setStart(container, offset), 
                            range.setEnd(container, offset + 1), !isHiddenWhiteSpaceRange(range))) return addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(range), !1));
                        }
                        0 < offset && (range.setStart(container, offset - 1), range.setEnd(container, offset), 
                        isHiddenWhiteSpaceRange(range) || addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(range), !1))), 
                        offset < container.data.length && (range.setStart(container, offset), 
                        range.setEnd(container, offset + 1), isHiddenWhiteSpaceRange(range) || addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(range), !0)));
                    }
                    if (isText(caretPosition.container())) addCharacterOffset(caretPosition.container(), caretPosition.offset()); else if (isElement(caretPosition.container())) if (caretPosition.isAtEnd()) node = resolveIndex(caretPosition.container(), caretPosition.offset()), 
                    isText(node) && addCharacterOffset(node, node.data.length), 
                    isValidElementCaretCandidate(node) && !isBr(node) && addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(node), !1)); else {
                        if (node = resolveIndex(caretPosition.container(), caretPosition.offset()), 
                        isText(node) && addCharacterOffset(node, 0), isValidElementCaretCandidate(node) && caretPosition.isAtEnd()) return addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(node), !1)), 
                        clientRects;
                        caretPosition = resolveIndex(caretPosition.container(), caretPosition.offset() - 1), 
                        !isValidElementCaretCandidate(caretPosition) || isBr(caretPosition) || !isBlock(caretPosition) && !isBlock(node) && isValidElementCaretCandidate(node) || addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(caretPosition), !1)), 
                        isValidElementCaretCandidate(node) && addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(node), !0));
                    }
                    return clientRects;
                }(new CaretPosition(container, offset));
            }
            return {
                container: Fun.constant(container),
                offset: Fun.constant(offset),
                toRange: function() {
                    var range = createRange(container.ownerDocument);
                    return range.setStart(container, offset), range.setEnd(container, offset), 
                    range;
                },
                getClientRects: getClientRects,
                isVisible: function() {
                    return 0 < getClientRects().length;
                },
                isAtStart: function() {
                    return isText(container), 0 === offset;
                },
                isAtEnd: function() {
                    return isText(container) ? offset >= container.data.length : offset >= container.childNodes.length;
                },
                isEqual: function(caretPosition) {
                    return caretPosition && container === caretPosition.container() && offset === caretPosition.offset();
                },
                getNode: function(before) {
                    return resolveIndex(container, before ? offset - 1 : offset);
                }
            };
        }
        CaretPosition.fromRangeStart = function(range) {
            return new CaretPosition(range.startContainer, range.startOffset);
        }, CaretPosition.fromRangeEnd = function(range) {
            return new CaretPosition(range.endContainer, range.endOffset);
        }, CaretPosition.after = function(node) {
            return new CaretPosition(node.parentNode, nodeIndex(node) + 1);
        }, CaretPosition.before = function(node) {
            return new CaretPosition(node.parentNode, nodeIndex(node));
        }, tinymce.caret.CaretPosition = CaretPosition;
    }(tinymce), function(tinymce) {
        var NodeType = tinymce.dom.NodeType, TreeWalker = tinymce.dom.TreeWalker, CaretContainer = tinymce.caret.CaretContainer, CaretCandidate = tinymce.caret.CaretCandidate, Fun = tinymce.util.Fun, isContentEditableTrue = NodeType.isContentEditableTrue, isContentEditableFalse = NodeType.isContentEditableFalse, isBlockLike = NodeType.matchStyleValues("display", "block table table-cell table-caption"), isCaretContainer = CaretContainer.isCaretContainer, isCaretContainerBlock = CaretContainer.isCaretContainerBlock, curry = Fun.curry, isElement = NodeType.isElement, isCaretCandidate = CaretCandidate.isCaretCandidate;
        function skipCaretContainers(walk, shallow) {
            for (var node; node = walk(shallow); ) if (!isCaretContainerBlock(node)) return node;
            return null;
        }
        function getEditingHost(node, rootNode) {
            for (node = node.parentNode; node && node != rootNode; node = node.parentNode) if (isContentEditableTrue(node)) return node;
            return rootNode;
        }
        function getParentBlock(node, rootNode) {
            for (;node && node != rootNode; ) {
                if (isBlockLike(node)) return node;
                node = node.parentNode;
            }
            return null;
        }
        function beforeAfter(before, node) {
            var range = node.ownerDocument.createRange();
            return before ? (range.setStartBefore(node), range.setEndBefore(node)) : (range.setStartAfter(node), 
            range.setEndAfter(node)), range;
        }
        function lean(left, rootNode, node) {
            for (var sibling, siblingName = left ? "previousSibling" : "nextSibling"; node && node != rootNode; ) {
                if (sibling = node[siblingName], isCaretContainer(sibling) && (sibling = sibling[siblingName]), 
                isContentEditableFalse(sibling)) {
                    if (function(rootNode, node2) {
                        return getParentBlock(sibling, rootNode) == getParentBlock(node2, rootNode);
                    }(rootNode, node)) return sibling;
                    break;
                }
                if (isCaretCandidate(sibling)) break;
                node = node.parentNode;
            }
            return null;
        }
        var before = curry(beforeAfter, !0), after = curry(beforeAfter, !1);
        function isNextToContentEditableFalse(relativeOffset, caretPosition) {
            return isContentEditableFalse(function(relativeOffset, caretPosition) {
                var container;
                return caretPosition && (container = caretPosition.container(), 
                caretPosition = caretPosition.offset(), isElement(container)) ? container.childNodes[caretPosition + relativeOffset] : null;
            }(relativeOffset, caretPosition));
        }
        tinymce.caret.CaretUtils = {
            isForwards: function(direction) {
                return 0 < direction;
            },
            isBackwards: function(direction) {
                return direction < 0;
            },
            findNode: function(node, direction, predicateFn, rootNode, shallow) {
                var walker = new TreeWalker(node, rootNode);
                if (direction < 0) {
                    if ((isContentEditableFalse(node) || isCaretContainerBlock(node)) && predicateFn(node = skipCaretContainers(walker.prev, !0))) return node;
                    for (;node = skipCaretContainers(walker.prev, shallow); ) if (predicateFn(node)) return node;
                }
                if (0 < direction) {
                    if ((isContentEditableFalse(node) || isCaretContainerBlock(node)) && predicateFn(node = skipCaretContainers(walker.next, !0))) return node;
                    for (;node = skipCaretContainers(walker.next, shallow); ) if (predicateFn(node)) return node;
                }
                return null;
            },
            getEditingHost: getEditingHost,
            getParentBlock: getParentBlock,
            isInSameBlock: function(caretPosition1, caretPosition2, rootNode) {
                return getParentBlock(caretPosition1.container(), rootNode) == getParentBlock(caretPosition2.container(), rootNode);
            },
            isInSameEditingHost: function(caretPosition1, caretPosition2, rootNode) {
                return getEditingHost(caretPosition1.container(), rootNode) == getEditingHost(caretPosition2.container(), rootNode);
            },
            isBeforeContentEditableFalse: curry(isNextToContentEditableFalse, 0),
            isAfterContentEditableFalse: curry(isNextToContentEditableFalse, -1),
            normalizeRange: function(direction, rootNode, range) {
                var node, location, leanLeft = curry(lean, !0, rootNode), rootNode = curry(lean, !1, rootNode), container = range.startContainer, offset = range.startOffset;
                if (CaretContainer.isCaretContainerBlock(container)) {
                    if ("before" == (location = (container = isElement(container) ? container : container.parentNode).getAttribute("data-mce-caret")) && (node = container.nextSibling, 
                    isContentEditableFalse(node))) return before(node);
                    if ("after" == location && (node = container.previousSibling, 
                    isContentEditableFalse(node))) return after(node);
                }
                if (range.collapsed && NodeType.isText(container)) {
                    if (isCaretContainer(container)) {
                        if (1 === direction) {
                            if (node = rootNode(container)) return before(node);
                            if (node = leanLeft(container)) return after(node);
                        }
                        if (-1 === direction) {
                            if (node = leanLeft(container)) return after(node);
                            if (node = rootNode(container)) return before(node);
                        }
                        return range;
                    }
                    if (CaretContainer.endsWithCaretContainer(container) && offset >= container.data.length - 1) return 1 === direction && (node = rootNode(container)) ? before(node) : range;
                    if (CaretContainer.startsWithCaretContainer(container) && offset <= 1) return -1 === direction && (node = leanLeft(container)) ? after(node) : range;
                    if (offset === container.data.length) return (node = rootNode(container)) ? before(node) : range;
                    if (0 === offset) return (node = leanLeft(container)) ? after(node) : range;
                }
                return range;
            }
        };
    }(tinymce), function(tinymce) {
        var NodeType = tinymce.dom.NodeType, CaretPosition = tinymce.caret.CaretPosition, CaretUtils = tinymce.caret.CaretUtils, CaretCandidate = tinymce.caret.CaretCandidate, Arr = tinymce.util.Arr, Fun = tinymce.util.Fun, isContentEditableFalse = NodeType.isContentEditableFalse, isText = NodeType.isText, isElement = NodeType.isElement, isBr = NodeType.isBr, isForwards = CaretUtils.isForwards, isBackwards = CaretUtils.isBackwards, isCaretCandidate = CaretCandidate.isCaretCandidate, isAtomic = CaretCandidate.isAtomic, isEditableCaretCandidate = CaretCandidate.isEditableCaretCandidate;
        function nodeAtIndex(container, offset) {
            return container.hasChildNodes() && offset < container.childNodes.length ? container.childNodes[offset] : null;
        }
        function getCaretCandidatePosition(direction, node) {
            if (isForwards(direction)) {
                if (isCaretCandidate(node.previousSibling) && !isText(node.previousSibling)) return CaretPosition.before(node);
                if (isText(node)) return CaretPosition(node, 0);
            }
            if (isBackwards(direction)) {
                if (isCaretCandidate(node.nextSibling) && !isText(node.nextSibling)) return CaretPosition.after(node);
                if (isText(node)) return CaretPosition(node, node.data.length);
            }
            return !isBackwards(direction) || isBr(node) ? CaretPosition.before(node) : CaretPosition.after(node);
        }
        function findCaretPosition(direction, startCaretPosition, rootNode) {
            var container, node, nextNode, innerNode, offset;
            if (!isElement(rootNode) || !startCaretPosition) return null;
            if (container = startCaretPosition.container(), offset = startCaretPosition.offset(), 
            isText(container)) {
                if (isBackwards(direction) && 0 < offset) return CaretPosition(container, --offset);
                if (isForwards(direction) && offset < container.length) return CaretPosition(container, ++offset);
                node = container;
            } else {
                if (isBackwards(direction) && 0 < offset && (nextNode = nodeAtIndex(container, offset - 1), 
                isCaretCandidate(nextNode))) return !isAtomic(nextNode) && (innerNode = CaretUtils.findNode(nextNode, direction, isEditableCaretCandidate, nextNode)) ? isText(innerNode) ? CaretPosition(innerNode, innerNode.data.length) : CaretPosition.after(innerNode) : isText(nextNode) ? CaretPosition(nextNode, nextNode.data.length) : CaretPosition.before(nextNode);
                if (isForwards(direction) && offset < container.childNodes.length && (nextNode = nodeAtIndex(container, offset), 
                isCaretCandidate(nextNode))) return function(node, rootNode) {
                    var next;
                    return NodeType.isBr(node) && (next = findCaretPosition(1, CaretPosition.after(node), rootNode)) && !CaretUtils.isInSameBlock(CaretPosition.before(node), CaretPosition.before(next), rootNode);
                }(nextNode, rootNode) ? findCaretPosition(direction, CaretPosition.after(nextNode), rootNode) : !isAtomic(nextNode) && (innerNode = CaretUtils.findNode(nextNode, direction, isEditableCaretCandidate, nextNode)) ? isText(innerNode) ? CaretPosition(innerNode, 0) : CaretPosition.before(innerNode) : isText(nextNode) ? CaretPosition(nextNode, 0) : CaretPosition.after(nextNode);
                node = startCaretPosition.getNode();
            }
            return (isForwards(direction) && startCaretPosition.isAtEnd() || isBackwards(direction) && startCaretPosition.isAtStart()) && (node = CaretUtils.findNode(node, direction, Fun.constant(!0), rootNode, !0), 
            isEditableCaretCandidate(node)) ? getCaretCandidatePosition(direction, node) : (nextNode = CaretUtils.findNode(node, direction, isEditableCaretCandidate, rootNode), 
            !(offset = Arr.last(Arr.filter(function(node, rootNode) {
                for (var parents = []; node && node != rootNode; ) parents.push(node), 
                node = node.parentNode;
                return parents;
            }(container, rootNode), isContentEditableFalse))) || nextNode && offset.contains(nextNode) ? nextNode ? getCaretCandidatePosition(direction, nextNode) : null : isForwards(direction) ? CaretPosition.after(offset) : CaretPosition.before(offset));
        }
        tinymce.caret.CaretWalker = function(rootNode) {
            return {
                next: function(caretPosition) {
                    return findCaretPosition(1, caretPosition, rootNode);
                },
                prev: function(caretPosition) {
                    return findCaretPosition(-1, caretPosition, rootNode);
                }
            };
        };
    }(tinymce), function(tinymce) {
        var NodeType = tinymce.dom.NodeType, DOM = tinymce.DOM, ClientRect = tinymce.geom.ClientRect, CaretContainer = tinymce.caret.CaretContainer, CaretContainerRemove = tinymce.caret.CaretContainerRemove, isContentEditableFalse = NodeType.isContentEditableFalse;
        tinymce.caret.FakeCaret = function(rootNode, isBlock) {
            var cursorInterval, $lastVisualCaret, caretContainerNode;
            function hide() {
                for (var node, sibling, data, contentEditableFalseNodes = DOM.select("*[contentEditable=false]", rootNode), i = 0; i < contentEditableFalseNodes.length; i++) sibling = (node = contentEditableFalseNodes[i]).previousSibling, 
                CaretContainer.endsWithCaretContainer(sibling) && (1 == (data = sibling.data).length ? sibling.parentNode.removeChild(sibling) : sibling.deleteData(data.length - 1, 1)), 
                sibling = node.nextSibling, CaretContainer.startsWithCaretContainer(sibling) && (1 == (data = sibling.data).length ? sibling.parentNode.removeChild(sibling) : sibling.deleteData(0, 1));
                caretContainerNode && (CaretContainerRemove.remove(caretContainerNode), 
                caretContainerNode = null), $lastVisualCaret && (DOM.remove($lastVisualCaret), 
                $lastVisualCaret = null), clearInterval(cursorInterval);
            }
            return {
                show: function(before, node) {
                    var clientRect;
                    return hide(), isBlock(node) ? (caretContainerNode = CaretContainer.insertBlock("p", node, before), 
                    clientRect = function(node, before) {
                        var scrollX, clientRect = ClientRect.collapse(node.getBoundingClientRect(), before), docElm = "BODY" == rootNode.tagName ? (docElm = rootNode.ownerDocument.documentElement, 
                        scrollX = rootNode.scrollLeft || docElm.scrollLeft, rootNode.scrollTop || docElm.scrollTop) : (docElm = rootNode.getBoundingClientRect(), 
                        scrollX = rootNode.scrollLeft - docElm.left, rootNode.scrollTop - docElm.top);
                        return clientRect.left += scrollX, clientRect.right += scrollX, 
                        clientRect.top += docElm, clientRect.bottom += docElm, clientRect.width = 1, 
                        0 < (scrollX = node.offsetWidth - node.clientWidth) && (before && (scrollX *= -1), 
                        clientRect.left += scrollX, clientRect.right += scrollX), 
                        clientRect;
                    }(node, before), DOM.setStyle(caretContainerNode, "top", clientRect.top), 
                    $lastVisualCaret = DOM.add(rootNode, "div", {
                        class: "mce-visual-caret",
                        "data-mce-bogus": "all",
                        style: clientRect
                    }), before && DOM.addClass($lastVisualCaret, "mce-visual-caret-before"), 
                    cursorInterval = setInterval(function() {
                        var caret = DOM.select("div.mce-visual-caret", rootNode)[0];
                        rootNode.ownerDocument.activeElement === rootNode ? DOM.toggleClass(caret, "mce-visual-caret-hidden") : DOM.addClass(caret, "mce-visual-caret-hidden");
                    }, 500), (clientRect = node.ownerDocument.createRange()).setStart(caretContainerNode, 0), 
                    clientRect.setEnd(caretContainerNode, 0)) : (caretContainerNode = CaretContainer.insertInline(node, before), 
                    clientRect = node.ownerDocument.createRange(), isContentEditableFalse(caretContainerNode.nextSibling) ? (clientRect.setStart(caretContainerNode, 0), 
                    clientRect.setEnd(caretContainerNode, 0)) : (clientRect.setStart(caretContainerNode, 1), 
                    clientRect.setEnd(caretContainerNode, 1))), clientRect;
                },
                hide: hide,
                getCss: function() {
                    return ".mce-visual-caret {position: absolute;background-color: black;background-color: currentcolor;}.mce-visual-caret-hidden {display: none;}*[data-mce-caret] {position: absolute;left: -1000px;right: auto;top: 0;margin: 0;padding: 0;}";
                },
                destroy: function() {
                    clearInterval(cursorInterval);
                }
            };
        };
    }(tinymce), function(tinymce) {
        var NodeType = tinymce.dom.NodeType, Fun = tinymce.util.Fun, Arr = tinymce.util.Arr, Dimensions = tinymce.dom.Dimensions, ClientRect = tinymce.geom.ClientRect, CaretUtils = tinymce.caret.CaretUtils, CaretCandidate = tinymce.caret.CaretCandidate, isContentEditableFalse = NodeType.isContentEditableFalse, findNode = CaretUtils.findNode, curry = Fun.curry;
        function distanceToRectLeft(clientRect, clientX) {
            return Math.abs(clientRect.left - clientX);
        }
        function distanceToRectRight(clientRect, clientX) {
            return Math.abs(clientRect.right - clientX);
        }
        function findClosestClientRect(clientRects, clientX) {
            function isInside(clientX, clientRect) {
                return clientX >= clientRect.left && clientX <= clientRect.right;
            }
            return Arr.reduce(clientRects, function(oldClientRect, clientRect) {
                var oldDistance = Math.min(distanceToRectLeft(oldClientRect, clientX), distanceToRectRight(oldClientRect, clientX)), newDistance = Math.min(distanceToRectLeft(clientRect, clientX), distanceToRectRight(clientRect, clientX));
                return isInside(clientX, clientRect) || !isInside(clientX, oldClientRect) && (newDistance == oldDistance && isContentEditableFalse(clientRect.node) || newDistance < oldDistance) ? clientRect : oldClientRect;
            });
        }
        function walkUntil(direction, rootNode, predicateFn, node) {
            for (;node = findNode(node, direction, CaretCandidate.isEditableCaretCandidate, rootNode); ) if (predicateFn(node)) return;
        }
        function findLineNodeRects(rootNode, targetNodeRect) {
            var clientRects = [];
            function collect(checkPosFn, node) {
                return node = Arr.filter(Dimensions.getClientRects(node), function(clientRect) {
                    return !checkPosFn(clientRect, targetNodeRect);
                }), clientRects = clientRects.concat(node), 0 === node.length;
            }
            return clientRects.push(targetNodeRect), walkUntil(-1, rootNode, curry(collect, ClientRect.isAbove), targetNodeRect.node), 
            walkUntil(1, rootNode, curry(collect, ClientRect.isBelow), targetNodeRect.node), 
            clientRects;
        }
        tinymce.caret.LineUtils = {
            findClosestClientRect: findClosestClientRect,
            findLineNodeRects: findLineNodeRects,
            closestCaret: function(rootNode, clientX, clientY) {
                var contentEditableFalseNodeRects = Dimensions.getClientRects(function(rootNode) {
                    return Arr.filter(Arr.toArray(rootNode.getElementsByTagName("*")), isContentEditableFalse);
                }(rootNode));
                return (contentEditableFalseNodeRects = (contentEditableFalseNodeRects = findClosestClientRect(Arr.filter(contentEditableFalseNodeRects, function(clientRect) {
                    return clientY >= clientRect.top && clientY <= clientRect.bottom;
                }), clientX)) && findClosestClientRect(findLineNodeRects(rootNode, contentEditableFalseNodeRects), clientX)) && isContentEditableFalse(contentEditableFalseNodeRects.node) ? function(clientRect, clientX) {
                    return {
                        node: clientRect.node,
                        before: distanceToRectLeft(clientRect, clientX) < distanceToRectRight(clientRect, clientX)
                    };
                }(contentEditableFalseNodeRects, clientX) : null;
            }
        };
    }(tinymce), function(tinymce) {
        var Fun = tinymce.util.Fun, Arr = tinymce.util.Arr, Dimensions = tinymce.dom.Dimensions, ClientRect = tinymce.geom.ClientRect, CaretUtils = tinymce.caret.CaretUtils, CaretCandidate = tinymce.caret.CaretCandidate, CaretWalker = tinymce.caret.CaretWalker, CaretPosition = tinymce.caret.CaretPosition;
        function walkUntil(direction, isAboveFn, isBeflowFn, rootNode, predicateFn, caretPosition) {
            var targetClientRect, line = 0, result = [];
            function add(node) {
                var i, clientRect, clientRects = Dimensions.getClientRects(node);
                for (-1 == direction && (clientRects = clientRects.reverse()), i = 0; i < clientRects.length; i++) if (clientRect = clientRects[i], 
                !isBeflowFn(clientRect, targetClientRect)) {
                    if (0 < result.length && isAboveFn(clientRect, Arr.last(result)) && line++, 
                    clientRect.line = line, predicateFn(clientRect)) return !0;
                    result.push(clientRect);
                }
            }
            return (targetClientRect = Arr.last(caretPosition.getClientRects())) && (add(caretPosition = caretPosition.getNode()), 
            function(direction, rootNode, predicateFn, node) {
                for (;node = CaretUtils.findNode(node, direction, CaretCandidate.isEditableCaretCandidate, rootNode); ) if (predicateFn(node)) return;
            }(direction, rootNode, add, caretPosition)), result;
        }
        var upUntil = (Fun = Fun.curry)(walkUntil, -1, ClientRect.isAbove, ClientRect.isBelow), downUntil = Fun(walkUntil, 1, ClientRect.isBelow, ClientRect.isAbove);
        tinymce.caret.LineWalker = {
            upUntil: upUntil,
            downUntil: downUntil,
            positionsUntil: function(direction, rootNode, predicateFn, node) {
                var walkFn, isBelowFn, isAboveFn, caretPosition, clientRect, targetClientRect, rootNode = new CaretWalker(rootNode), result = [], line = 0;
                function getClientRect(caretPosition) {
                    return Arr.last(caretPosition.getClientRects());
                }
                targetClientRect = getClientRect(caretPosition = 1 == direction ? (walkFn = rootNode.next, 
                isBelowFn = ClientRect.isBelow, isAboveFn = ClientRect.isAbove, 
                CaretPosition.after(node)) : (walkFn = rootNode.prev, isBelowFn = ClientRect.isAbove, 
                isAboveFn = ClientRect.isBelow, CaretPosition.before(node)));
                do {
                    if (caretPosition.isVisible() && !isAboveFn(clientRect = getClientRect(caretPosition), targetClientRect)) {
                        if (0 < result.length && isBelowFn(clientRect, Arr.last(result)) && line++, 
                        (clientRect = ClientRect.clone(clientRect)).position = caretPosition, 
                        clientRect.line = line, predicateFn(clientRect)) return result;
                        result.push(clientRect);
                    }
                } while (caretPosition = walkFn(caretPosition));
                return result;
            },
            isAboveLine: Fun(function(lineNumber, clientRect) {
                return clientRect.line > lineNumber;
            }),
            isLine: Fun(function(lineNumber, clientRect) {
                return clientRect.line === lineNumber;
            })
        };
    }(tinymce), function(tinymce) {
        function funescape(_, escaped, escapedWhitespace) {
            var high = "0x" + escaped - 65536;
            return high != high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(65536 + high) : String.fromCharCode(high >> 10 | 55296, 1023 & high | 56320);
        }
        var i, support, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate, setDocument, document, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains, expando = "sizzle" + -new Date(), preferredDoc = window.document, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), sortOrder = function(a, b) {
            return a === b && (hasDuplicate = !0), 0;
        }, strundefined = "undefined", hasOwn = {}.hasOwnProperty, arr = [], pop = arr.pop, push_native = arr.push, push = arr.push, slice = arr.slice, indexOf = arr.indexOf || function(elem) {
            for (var i = 0, len = this.length; i < len; i++) if (this[i] === elem) return i;
            return -1;
        }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", whitespace = "[\\x20\\t\\r\\n\\f]", identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + identifier + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|.*)\\)|)", rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
            ID: new RegExp("^#(" + identifier + ")"),
            CLASS: new RegExp("^\\.(" + identifier + ")"),
            TAG: new RegExp("^(" + identifier + "|[*])"),
            ATTR: new RegExp("^" + attributes),
            PSEUDO: new RegExp("^" + pseudos),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + booleans + ")$", "i"),
            needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rnative = /^[^{]+\{\s*\[native \w/, rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, rescape = /'|\\/g, runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig");
        try {
            push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes), 
            arr[preferredDoc.childNodes.length].nodeType;
        } catch (e) {
            push = {
                apply: arr.length ? function(target, els) {
                    push_native.apply(target, slice.call(els));
                } : function(target, els) {
                    for (var j = target.length, i = 0; target[j++] = els[i++]; );
                    target.length = j - 1;
                }
            };
        }
        function Sizzle(selector, context, results, seed) {
            var nodeType, i, groups, elem, nid, match, m;
            if ((context ? context.ownerDocument || context : preferredDoc) !== document && setDocument(context), 
            results = results || [], !selector || "string" != typeof selector) return results;
            if (1 !== (nodeType = (context = context || document).nodeType) && 9 !== nodeType) return [];
            if (documentIsHTML && !seed) {
                if (match = rquickExpr.exec(selector)) if (m = match[1]) {
                    if (9 === nodeType) {
                        if (!(elem = context.getElementById(m)) || !elem.parentNode) return results;
                        if (elem.id === m) return results.push(elem), results;
                    } else if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) return results.push(elem), 
                    results;
                } else {
                    if (match[2]) return push.apply(results, context.getElementsByTagName(selector)), 
                    results;
                    if ((m = match[3]) && support.getElementsByClassName) return push.apply(results, context.getElementsByClassName(m)), 
                    results;
                }
                if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                    if (nid = elem = expando, match = context, m = 9 === nodeType && selector, 
                    1 === nodeType && "object" !== context.nodeName.toLowerCase()) {
                        for (groups = tokenize(selector), (elem = context.getAttribute("id")) ? nid = elem.replace(rescape, "\\$&") : context.setAttribute("id", nid), 
                        nid = "[id='" + nid + "'] ", i = groups.length; i--; ) groups[i] = nid + toSelector(groups[i]);
                        match = rsibling.test(selector) && testContext(context.parentNode) || context, 
                        m = groups.join(",");
                    }
                    if (m) try {
                        return push.apply(results, match.querySelectorAll(m)), results;
                    } catch (qsaError) {} finally {
                        elem || context.removeAttribute("id");
                    }
                }
            }
            return select(selector.replace(rtrim, "$1"), context, results, seed);
        }
        function createCache() {
            var keys = [];
            function cache(key, value) {
                return keys.push(key + " ") > Expr.cacheLength && delete cache[keys.shift()], 
                cache[key + " "] = value;
            }
            return cache;
        }
        function markFunction(fn) {
            return fn[expando] = !0, fn;
        }
        function assert(fn) {
            var div = document.createElement("div");
            try {
                return !!fn(div);
            } catch (e) {
                return !1;
            } finally {
                div.parentNode && div.parentNode.removeChild(div);
            }
        }
        function addHandle(attrs, handler) {
            for (var arr = attrs.split("|"), i = attrs.length; i--; ) Expr.attrHandle[arr[i]] = handler;
        }
        function siblingCheck(a, b) {
            var cur = b && a, diff = cur && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || 1 << 31) - (~a.sourceIndex || 1 << 31);
            if (diff) return diff;
            if (cur) for (;cur = cur.nextSibling; ) if (cur === b) return -1;
            return a ? 1 : -1;
        }
        function createPositionalPseudo(fn) {
            return markFunction(function(argument) {
                return argument = +argument, markFunction(function(seed, matches) {
                    for (var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length; i--; ) seed[j = matchIndexes[i]] && (seed[j] = !(matches[j] = seed[j]));
                });
            });
        }
        function testContext(context) {
            return context && typeof context.getElementsByTagName !== strundefined && context;
        }
        for (i in support = Sizzle.support = {}, isXML = Sizzle.isXML = function(elem) {
            return !!(elem = elem && (elem.ownerDocument || elem).documentElement) && "HTML" !== elem.nodeName;
        }, setDocument = Sizzle.setDocument = function(node) {
            var doc = node ? node.ownerDocument || node : preferredDoc, node = doc.defaultView;
            return doc !== document && 9 === doc.nodeType && doc.documentElement ? (docElem = (document = doc).documentElement, 
            documentIsHTML = !isXML(doc), node && node !== function(win) {
                try {
                    return win.top;
                } catch (ex) {}
                return null;
            }(node) && (node.addEventListener ? node.addEventListener("unload", function() {
                setDocument();
            }, !1) : node.attachEvent && node.attachEvent("onunload", function() {
                setDocument();
            })), support.attributes = assert(function(div) {
                return div.className = "i", !div.getAttribute("className");
            }), support.getElementsByTagName = assert(function(div) {
                return div.appendChild(doc.createComment("")), !div.getElementsByTagName("*").length;
            }), support.getElementsByClassName = rnative.test(doc.getElementsByClassName), 
            support.getById = assert(function(div) {
                return docElem.appendChild(div).id = expando, !doc.getElementsByName || !doc.getElementsByName(expando).length;
            }), support.getById ? (Expr.find.ID = function(id, context) {
                if (typeof context.getElementById !== strundefined && documentIsHTML) return (context = context.getElementById(id)) && context.parentNode ? [ context ] : [];
            }, Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                    return elem.getAttribute("id") === attrId;
                };
            }) : (delete Expr.find.ID, Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                    return (elem = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id")) && elem.value === attrId;
                };
            }), Expr.find.TAG = support.getElementsByTagName ? function(tag, context) {
                if (typeof context.getElementsByTagName !== strundefined) return context.getElementsByTagName(tag);
            } : function(tag, context) {
                var elem, tmp = [], i = 0, results = context.getElementsByTagName(tag);
                if ("*" !== tag) return results;
                for (;elem = results[i++]; ) 1 === elem.nodeType && tmp.push(elem);
                return tmp;
            }, Expr.find.CLASS = support.getElementsByClassName && function(className, context) {
                if (documentIsHTML) return context.getElementsByClassName(className);
            }, rbuggyMatches = [], rbuggyQSA = [], (support.qsa = rnative.test(doc.querySelectorAll)) && (assert(function(div) {
                div.innerHTML = "<select msallowcapture=''><option selected=''></option></select>", 
                div.querySelectorAll("[msallowcapture^='']").length && rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")"), 
                div.querySelectorAll("[selected]").length || rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")"), 
                div.querySelectorAll(":checked").length || rbuggyQSA.push(":checked");
            }), assert(function(div) {
                var input = doc.createElement("input");
                input.setAttribute("type", "hidden"), div.appendChild(input).setAttribute("name", "D"), 
                div.querySelectorAll("[name=d]").length && rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?="), 
                div.querySelectorAll(":enabled").length || rbuggyQSA.push(":enabled", ":disabled"), 
                div.querySelectorAll("*,:x"), rbuggyQSA.push(",.*:");
            })), (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) && assert(function(div) {
                support.disconnectedMatch = matches.call(div, "div"), matches.call(div, "[s!='']:x"), 
                rbuggyMatches.push("!=", pseudos);
            }), rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|")), 
            rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|")), 
            node = rnative.test(docElem.compareDocumentPosition), contains = node || rnative.test(docElem.contains) ? function(a, b) {
                var adown = 9 === a.nodeType ? a.documentElement : a;
                return a === (b = b && b.parentNode) || !(!b || 1 !== b.nodeType || !(adown.contains ? adown.contains(b) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(b)));
            } : function(a, b) {
                if (b) for (;b = b.parentNode; ) if (b === a) return !0;
                return !1;
            }, sortOrder = node ? function(a, b) {
                var compare;
                return a === b ? (hasDuplicate = !0, 0) : !a.compareDocumentPosition - !b.compareDocumentPosition || (1 & (compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1) || !support.sortDetached && b.compareDocumentPosition(a) === compare ? a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ? -1 : b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ? 1 : sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0 : 4 & compare ? -1 : 1);
            } : function(a, b) {
                if (a === b) return hasDuplicate = !0, 0;
                var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [ a ], bp = [ b ];
                if (!aup || !bup) return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
                if (aup === bup) return siblingCheck(a, b);
                for (cur = a; cur = cur.parentNode; ) ap.unshift(cur);
                for (cur = b; cur = cur.parentNode; ) bp.unshift(cur);
                for (;ap[i] === bp[i]; ) i++;
                return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
            }, doc) : document;
        }, Sizzle.matches = function(expr, elements) {
            return Sizzle(expr, null, null, elements);
        }, Sizzle.matchesSelector = function(elem, expr) {
            if ((elem.ownerDocument || elem) !== document && setDocument(elem), 
            expr = expr.replace(rattributeQuotes, "='$1']"), support.matchesSelector && documentIsHTML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) try {
                var ret = matches.call(elem, expr);
                if (ret || support.disconnectedMatch || elem.document && 11 !== elem.document.nodeType) return ret;
            } catch (e) {}
            return 0 < Sizzle(expr, document, null, [ elem ]).length;
        }, Sizzle.contains = function(context, elem) {
            return (context.ownerDocument || context) !== document && setDocument(context), 
            contains(context, elem);
        }, Sizzle.attr = function(elem, name) {
            (elem.ownerDocument || elem) !== document && setDocument(elem);
            var fn = Expr.attrHandle[name.toLowerCase()];
            return void 0 !== (fn = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0) ? fn : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (fn = elem.getAttributeNode(name)) && fn.specified ? fn.value : null;
        }, Sizzle.error = function(msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        }, Sizzle.uniqueSort = function(results) {
            var elem, duplicates = [], j = 0, i = 0;
            if (hasDuplicate = !support.detectDuplicates, sortInput = !support.sortStable && results.slice(0), 
            results.sort(sortOrder), hasDuplicate) {
                for (;elem = results[i++]; ) elem === results[i] && (j = duplicates.push(i));
                for (;j--; ) results.splice(duplicates[j], 1);
            }
            return sortInput = null, results;
        }, getText = Sizzle.getText = function(elem) {
            var node, ret = "", i = 0, nodeType = elem.nodeType;
            if (nodeType) {
                if (1 === nodeType || 9 === nodeType || 11 === nodeType) {
                    if ("string" == typeof elem.textContent) return elem.textContent;
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) ret += getText(elem);
                } else if (3 === nodeType || 4 === nodeType) return elem.nodeValue;
            } else for (;node = elem[i++]; ) ret += getText(node);
            return ret;
        }, (Expr = Sizzle.selectors = {
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(match) {
                    return match[1] = match[1].replace(runescape, funescape), match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape), 
                    "~=" === match[2] && (match[3] = " " + match[3] + " "), match.slice(0, 4);
                },
                CHILD: function(match) {
                    return match[1] = match[1].toLowerCase(), "nth" === match[1].slice(0, 3) ? (match[3] || Sizzle.error(match[0]), 
                    match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * ("even" === match[3] || "odd" === match[3])), 
                    match[5] = +(match[7] + match[8] || "odd" === match[3])) : match[3] && Sizzle.error(match[0]), 
                    match;
                },
                PSEUDO: function(match) {
                    var excess, unquoted = !match[6] && match[2];
                    return matchExpr.CHILD.test(match[0]) ? null : (match[3] ? match[2] = match[4] || match[5] || "" : unquoted && rpseudo.test(unquoted) && (excess = (excess = tokenize(unquoted, !0)) && unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) && (match[0] = match[0].slice(0, excess), 
                    match[2] = unquoted.slice(0, excess)), match.slice(0, 3));
                }
            },
            filter: {
                TAG: function(nodeNameSelector) {
                    var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                    return "*" === nodeNameSelector ? function() {
                        return !0;
                    } : function(elem) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
                },
                CLASS: function(className) {
                    var pattern = classCache[className + " "];
                    return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                        return pattern.test("string" == typeof elem.className && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "");
                    });
                },
                ATTR: function(name, operator, check) {
                    return function(elem) {
                        return null == (elem = Sizzle.attr(elem, name)) ? "!=" === operator : !operator || (elem += "", 
                        "=" === operator ? elem === check : "!=" === operator ? elem !== check : "^=" === operator ? check && 0 === elem.indexOf(check) : "*=" === operator ? check && -1 < elem.indexOf(check) : "$=" === operator ? check && elem.slice(-check.length) === check : "~=" === operator ? -1 < (" " + elem + " ").indexOf(check) : "|=" === operator && (elem === check || elem.slice(0, check.length + 1) === check + "-"));
                    };
                },
                CHILD: function(type, what, argument, first, last) {
                    var simple = "nth" !== type.slice(0, 3), forward = "last" !== type.slice(-4), ofType = "of-type" === what;
                    return 1 === first && 0 === last ? function(elem) {
                        return !!elem.parentNode;
                    } : function(elem, context, xml) {
                        var cache, outerCache, node, diff, nodeIndex, start, dir = simple != forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType;
                        if (parent) {
                            if (simple) {
                                for (;dir; ) {
                                    for (node = elem; node = node[dir]; ) if (ofType ? node.nodeName.toLowerCase() === name : 1 === node.nodeType) return !1;
                                    start = dir = "only" === type && !start && "nextSibling";
                                }
                                return !0;
                            }
                            if (start = [ forward ? parent.firstChild : parent.lastChild ], 
                            forward && useCache) {
                                for (nodeIndex = (cache = (outerCache = parent[expando] || (parent[expando] = {}))[type] || [])[0] === dirruns && cache[1], 
                                diff = cache[0] === dirruns && cache[2], node = nodeIndex && parent.childNodes[nodeIndex]; node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0, 
                                start.pop()); ) if (1 === node.nodeType && ++diff && node === elem) {
                                    outerCache[type] = [ dirruns, nodeIndex, diff ];
                                    break;
                                }
                            } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) diff = cache[1]; else for (;(node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0, 
                            start.pop())) && ((ofType ? node.nodeName.toLowerCase() !== name : 1 !== node.nodeType) || !++diff || (useCache && ((node[expando] || (node[expando] = {}))[type] = [ dirruns, diff ]), 
                            node !== elem)); );
                            return (diff -= last) === first || diff % first == 0 && 0 <= diff / first;
                        }
                    };
                },
                PSEUDO: function(pseudo, argument) {
                    var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
                    return fn[expando] ? fn(argument) : 1 < fn.length ? (args = [ pseudo, pseudo, "", argument ], 
                    Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
                        for (var idx, matched = fn(seed, argument), i = matched.length; i--; ) seed[idx = indexOf.call(seed, matched[i])] = !(matches[idx] = matched[i]);
                    }) : function(elem) {
                        return fn(elem, 0, args);
                    }) : fn;
                }
            },
            pseudos: {
                not: markFunction(function(selector) {
                    var input = [], results = [], matcher = compile(selector.replace(rtrim, "$1"));
                    return matcher[expando] ? markFunction(function(seed, matches, context, xml) {
                        for (var elem, unmatched = matcher(seed, null, xml, []), i = seed.length; i--; ) (elem = unmatched[i]) && (seed[i] = !(matches[i] = elem));
                    }) : function(elem, context, xml) {
                        return input[0] = elem, matcher(input, null, xml, results), 
                        !results.pop();
                    };
                }),
                has: markFunction(function(selector) {
                    return function(elem) {
                        return 0 < Sizzle(selector, elem).length;
                    };
                }),
                contains: markFunction(function(text) {
                    return text = text.replace(runescape, funescape), function(elem) {
                        return -1 < (elem.textContent || elem.innerText || getText(elem)).indexOf(text);
                    };
                }),
                lang: markFunction(function(lang) {
                    return ridentifier.test(lang || "") || Sizzle.error("unsupported lang: " + lang), 
                    lang = lang.replace(runescape, funescape).toLowerCase(), function(elem) {
                        var elemLang;
                        do {
                            if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) return (elemLang = elemLang.toLowerCase()) === lang || 0 === elemLang.indexOf(lang + "-");
                        } while ((elem = elem.parentNode) && 1 === elem.nodeType);
                        return !1;
                    };
                }),
                target: function(elem) {
                    var hash = window.location && window.location.hash;
                    return hash && hash.slice(1) === elem.id;
                },
                root: function(elem) {
                    return elem === docElem;
                },
                focus: function(elem) {
                    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },
                enabled: function(elem) {
                    return !1 === elem.disabled;
                },
                disabled: function(elem) {
                    return !0 === elem.disabled;
                },
                checked: function(elem) {
                    var nodeName = elem.nodeName.toLowerCase();
                    return "input" === nodeName && !!elem.checked || "option" === nodeName && !!elem.selected;
                },
                selected: function(elem) {
                    return elem.parentNode && elem.parentNode.selectedIndex, !0 === elem.selected;
                },
                empty: function(elem) {
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) if (elem.nodeType < 6) return !1;
                    return !0;
                },
                parent: function(elem) {
                    return !Expr.pseudos.empty(elem);
                },
                header: function(elem) {
                    return rheader.test(elem.nodeName);
                },
                input: function(elem) {
                    return rinputs.test(elem.nodeName);
                },
                button: function(elem) {
                    var name = elem.nodeName.toLowerCase();
                    return "input" === name && "button" === elem.type || "button" === name;
                },
                text: function(elem) {
                    return "input" === elem.nodeName.toLowerCase() && "text" === elem.type && (null == (elem = elem.getAttribute("type")) || "text" === elem.toLowerCase());
                },
                first: createPositionalPseudo(function() {
                    return [ 0 ];
                }),
                last: createPositionalPseudo(function(matchIndexes, length) {
                    return [ length - 1 ];
                }),
                eq: createPositionalPseudo(function(matchIndexes, length, argument) {
                    return [ argument < 0 ? argument + length : argument ];
                }),
                even: createPositionalPseudo(function(matchIndexes, length) {
                    for (var i = 0; i < length; i += 2) matchIndexes.push(i);
                    return matchIndexes;
                }),
                odd: createPositionalPseudo(function(matchIndexes, length) {
                    for (var i = 1; i < length; i += 2) matchIndexes.push(i);
                    return matchIndexes;
                }),
                lt: createPositionalPseudo(function(matchIndexes, length, argument) {
                    for (var i = argument < 0 ? argument + length : argument; 0 <= --i; ) matchIndexes.push(i);
                    return matchIndexes;
                }),
                gt: createPositionalPseudo(function(matchIndexes, length, argument) {
                    for (var i = argument < 0 ? argument + length : argument; ++i < length; ) matchIndexes.push(i);
                    return matchIndexes;
                })
            }
        }).pseudos.nth = Expr.pseudos.eq, {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) Expr.pseudos[i] = function(type) {
            return function(elem) {
                return "input" === elem.nodeName.toLowerCase() && elem.type === type;
            };
        }(i);
        for (i in {
            submit: !0,
            reset: !0
        }) Expr.pseudos[i] = function(type) {
            return function(elem) {
                var name = elem.nodeName.toLowerCase();
                return ("input" === name || "button" === name) && elem.type === type;
            };
        }(i);
        function setFilters() {}
        function toSelector(tokens) {
            for (var i = 0, len = tokens.length, selector = ""; i < len; i++) selector += tokens[i].value;
            return selector;
        }
        function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir, checkNonElements = base && "parentNode" === dir, doneName = done++;
            return combinator.first ? function(elem, context, xml) {
                for (;elem = elem[dir]; ) if (1 === elem.nodeType || checkNonElements) return matcher(elem, context, xml);
            } : function(elem, context, xml) {
                var oldCache, outerCache, newCache = [ dirruns, doneName ];
                if (xml) {
                    for (;elem = elem[dir]; ) if ((1 === elem.nodeType || checkNonElements) && matcher(elem, context, xml)) return !0;
                } else for (;elem = elem[dir]; ) if (1 === elem.nodeType || checkNonElements) {
                    if ((oldCache = (outerCache = elem[expando] || (elem[expando] = {}))[dir]) && oldCache[0] === dirruns && oldCache[1] === doneName) return newCache[2] = oldCache[2];
                    if ((outerCache[dir] = newCache)[2] = matcher(elem, context, xml)) return !0;
                }
            };
        }
        function elementMatcher(matchers) {
            return 1 < matchers.length ? function(elem, context, xml) {
                for (var i = matchers.length; i--; ) if (!matchers[i](elem, context, xml)) return !1;
                return !0;
            } : matchers[0];
        }
        function condense(unmatched, map, filter, context, xml) {
            for (var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = null != map; i < len; i++) !(elem = unmatched[i]) || filter && !filter(elem, context, xml) || (newUnmatched.push(elem), 
            mapped && map.push(i));
            return newUnmatched;
        }
        setFilters.prototype = Expr.filters = Expr.pseudos, Expr.setFilters = new setFilters(), 
        tokenize = Sizzle.tokenize = function(selector, parseOnly) {
            var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
            if (cached) return parseOnly ? 0 : cached.slice(0);
            for (soFar = selector, groups = [], preFilters = Expr.preFilter; soFar; ) {
                for (type in matched && !(match = rcomma.exec(soFar)) || (match && (soFar = soFar.slice(match[0].length) || soFar), 
                groups.push(tokens = [])), matched = !1, (match = rcombinators.exec(soFar)) && (matched = match.shift(), 
                tokens.push({
                    value: matched,
                    type: match[0].replace(rtrim, " ")
                }), soFar = soFar.slice(matched.length)), Expr.filter) !(match = matchExpr[type].exec(soFar)) || preFilters[type] && !(match = preFilters[type](match)) || (matched = match.shift(), 
                tokens.push({
                    value: matched,
                    type: type,
                    matches: match
                }), soFar = soFar.slice(matched.length));
                if (!matched) break;
            }
            return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
        }, compile = Sizzle.compile = function(selector, match) {
            var i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
            if (!cached) {
                for (i = (match = match || tokenize(selector)).length; i--; ) ((cached = function matcherFromTokens(tokens) {
                    for (var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
                        return elem === checkContext;
                    }, implicitRelative, !0), matchAnyContext = addCombinator(function(elem) {
                        return -1 < indexOf.call(checkContext, elem);
                    }, implicitRelative, !0), matchers = [ function(elem, context, xml) {
                        return !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext : matchAnyContext)(elem, context, xml);
                    } ]; i < len; i++) if (matcher = Expr.relative[tokens[i].type]) matchers = [ addCombinator(elementMatcher(matchers), matcher) ]; else {
                        if ((matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches))[expando]) {
                            for (j = ++i; j < len && !Expr.relative[tokens[j].type]; j++);
                            return function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
                                return postFilter && !postFilter[expando] && (postFilter = setMatcher(postFilter)), 
                                postFinder && !postFinder[expando] && (postFinder = setMatcher(postFinder, postSelector)), 
                                markFunction(function(seed, results, context, xml) {
                                    var temp, i, elem, preMap = [], postMap = [], preexisting = results.length, elems = seed || function(selector, contexts, results) {
                                        for (var i = 0, len = contexts.length; i < len; i++) Sizzle(selector, contexts[i], results);
                                        return results;
                                    }(selector || "*", context.nodeType ? [ context ] : context, []), matcherIn = !preFilter || !seed && selector ? elems : condense(elems, preMap, preFilter, context, xml), matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
                                    if (matcher && matcher(matcherIn, matcherOut, context, xml), 
                                    postFilter) for (temp = condense(matcherOut, postMap), 
                                    postFilter(temp, [], context, xml), i = temp.length; i--; ) (elem = temp[i]) && (matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem));
                                    if (seed) {
                                        if (postFinder || preFilter) {
                                            if (postFinder) {
                                                for (temp = [], i = matcherOut.length; i--; ) (elem = matcherOut[i]) && temp.push(matcherIn[i] = elem);
                                                postFinder(null, matcherOut = [], temp, xml);
                                            }
                                            for (i = matcherOut.length; i--; ) (elem = matcherOut[i]) && -1 < (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) && (seed[temp] = !(results[temp] = elem));
                                        }
                                    } else matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut), 
                                    postFinder ? postFinder(null, results, matcherOut, xml) : push.apply(results, matcherOut);
                                });
                            }(1 < i && elementMatcher(matchers), 1 < i && toSelector(tokens.slice(0, i - 1).concat({
                                value: " " === tokens[i - 2].type ? "*" : ""
                            })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
                        }
                        matchers.push(matcher);
                    }
                    return elementMatcher(matchers);
                }(match[i]))[expando] ? setMatchers : elementMatchers).push(cached);
                (cached = compilerCache(selector, function(elementMatchers, setMatchers) {
                    function superMatcher(seed, context, xml, results, outermost) {
                        var elem, j, matcher, matchedCount = 0, i = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", outermost), dirrunsUnique = dirruns += null == contextBackup ? 1 : Math.random() || .1, len = elems.length;
                        for (outermost && (outermostContext = context !== document && context); i !== len && null != (elem = elems[i]); i++) {
                            if (byElement && elem) {
                                for (j = 0; matcher = elementMatchers[j++]; ) if (matcher(elem, context, xml)) {
                                    results.push(elem);
                                    break;
                                }
                                outermost && (dirruns = dirrunsUnique);
                            }
                            bySet && ((elem = !matcher && elem) && matchedCount--, 
                            seed) && unmatched.push(elem);
                        }
                        if (matchedCount += i, bySet && i !== matchedCount) {
                            for (j = 0; matcher = setMatchers[j++]; ) matcher(unmatched, setMatched, context, xml);
                            if (seed) {
                                if (0 < matchedCount) for (;i--; ) unmatched[i] || setMatched[i] || (setMatched[i] = pop.call(results));
                                setMatched = condense(setMatched);
                            }
                            push.apply(results, setMatched), outermost && !seed && 0 < setMatched.length && 1 < matchedCount + setMatchers.length && Sizzle.uniqueSort(results);
                        }
                        return outermost && (dirruns = dirrunsUnique, outermostContext = contextBackup), 
                        unmatched;
                    }
                    var bySet = 0 < setMatchers.length, byElement = 0 < elementMatchers.length;
                    return bySet ? markFunction(superMatcher) : superMatcher;
                }(elementMatchers, setMatchers))).selector = selector;
            }
            return cached;
        }, select = Sizzle.select = function(selector, context, results, seed) {
            var i, tokens, token, type, find, compiled = "function" == typeof selector && selector, match = !seed && tokenize(selector = compiled.selector || selector);
            if (results = results || [], 1 === match.length) {
                if (2 < (tokens = match[0] = match[0].slice(0)).length && "ID" === (token = tokens[0]).type && support.getById && 9 === context.nodeType && documentIsHTML && Expr.relative[tokens[1].type]) {
                    if (!(context = (Expr.find.ID(token.matches[0].replace(runescape, funescape), context) || [])[0])) return results;
                    compiled && (context = context.parentNode), selector = selector.slice(tokens.shift().value.length);
                }
                for (i = matchExpr.needsContext.test(selector) ? 0 : tokens.length; i-- && (token = tokens[i], 
                !Expr.relative[type = token.type]); ) if ((find = Expr.find[type]) && (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context))) {
                    if (tokens.splice(i, 1), selector = seed.length && toSelector(tokens)) break;
                    return push.apply(results, seed), results;
                }
            }
            return (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, rsibling.test(selector) && testContext(context.parentNode) || context), 
            results;
        }, support.sortStable = expando.split("").sort(sortOrder).join("") === expando, 
        support.detectDuplicates = !!hasDuplicate, setDocument(), support.sortDetached = assert(function(div1) {
            return 1 & div1.compareDocumentPosition(document.createElement("div"));
        }), assert(function(div) {
            return div.innerHTML = "<a href='#'></a>", "#" === div.firstChild.getAttribute("href");
        }) || addHandle("type|href|height|width", function(elem, name, isXML) {
            if (!isXML) return elem.getAttribute(name, "type" === name.toLowerCase() ? 1 : 2);
        }), support.attributes && assert(function(div) {
            return div.innerHTML = "<input/>", div.firstChild.setAttribute("value", ""), 
            "" === div.firstChild.getAttribute("value");
        }) || addHandle("value", function(elem, name, isXML) {
            if (!isXML && "input" === elem.nodeName.toLowerCase()) return elem.defaultValue;
        }), assert(function(div) {
            return null == div.getAttribute("disabled");
        }) || addHandle(booleans, function(elem, name, isXML) {
            if (!isXML) return !0 === elem[name] ? name.toLowerCase() : (isXML = elem.getAttributeNode(name)) && isXML.specified ? isXML.value : null;
        }), tinymce.dom.Sizzle = Sizzle;
    }(tinymce), function(tinymce) {
        function getPos(elm) {
            for (var x = 0, y = 0, offsetParent = elm; offsetParent && offsetParent.nodeType; ) x += offsetParent.offsetLeft || 0, 
            y += offsetParent.offsetTop || 0, offsetParent = offsetParent.offsetParent;
            return {
                x: x,
                y: y
            };
        }
        var NodeType = tinymce.dom.NodeType, Dispatcher = tinymce.util.Dispatcher;
        tinymce.dom.ScrollIntoView = function(editor, elm, alignToTop) {
            var y, viewPortY, viewPortH, dom = editor.dom, root = dom.getRoot(), offsetY = 0;
            editor.onScrollIntoView = new Dispatcher(), !function(editor, elm, alignToTop) {
                return editor.onScrollIntoView.dispatch(editor, elm = {
                    elm: elm,
                    alignToTop: alignToTop,
                    cancel: !1
                }), !0 === elm.cancel;
            }(editor, elm, alignToTop) && NodeType.isElement(elm) && (!1 === alignToTop && (offsetY = elm.offsetHeight), 
            "BODY" !== root.nodeName && (alignToTop = editor.selection.getScrollContainer()) ? (y = getPos(elm).y - getPos(alignToTop).y + offsetY, 
            viewPortH = alignToTop.clientHeight, (y < (viewPortY = alignToTop.scrollTop) || viewPortY + viewPortH < y + 25) && (alignToTop.scrollTop = y < viewPortY ? y : y - viewPortH + 25)) : (root = dom.getViewPort(editor.getWin()), 
            y = dom.getPos(elm).y + offsetY, viewPortY = root.y, viewPortH = root.h, 
            (y < root.y || viewPortY + viewPortH < y + 25) && editor.getWin().scrollTo(0, y < viewPortY ? y : y - viewPortH + 25)));
        };
    }(tinymce), function(tinymce) {
        function trimEmptyTextNode(node) {
            NodeType.isText(node) && 0 === node.data.length && node.parentNode.removeChild(node);
        }
        var NodeType = tinymce.dom.NodeType, CaretBookmark = tinymce.caret.CaretBookmark, CaretContainer = tinymce.caret.CaretContainer, CaretPosition = tinymce.caret.CaretPosition, RangeUtils = tinymce.dom.RangeUtils, Zwsp = tinymce.text.Zwsp, Arr = tinymce.util.Arr, isContentEditableFalse = NodeType.isContentEditableFalse;
        function BookmarkManager(selection) {
            var dom = selection.dom;
            this.getBookmark = function(type, normalized) {
                var rng, collapsed, styles, chr = "&#xFEFF;";
                function findIndex(name, element) {
                    var count = 0;
                    return tinymce.each(dom.select(name), function(node) {
                        if ("all" !== node.getAttribute("data-mce-bogus")) return node != element && void count++;
                    }), count;
                }
                function normalizeTableCellSelection(rng) {
                    function moveEndPoint(start) {
                        var childNodes, container = rng[(prefix = start ? "start" : "end") + "Container"], prefix = rng[prefix + "Offset"];
                        1 == container.nodeType && "TR" == container.nodeName && (container = (childNodes = container.childNodes)[Math.min(start ? prefix : prefix - 1, childNodes.length - 1)]) && (prefix = start ? 0 : container.childNodes.length, 
                        rng["set" + (start ? "Start" : "End")](container, prefix));
                    }
                    return moveEndPoint(!0), moveEndPoint(), rng;
                }
                if (2 == type) return name = (element = selection.getNode()) ? element.nodeName : null, 
                rng = selection.getRng(), isContentEditableFalse(element) || "IMG" == name ? {
                    name: name,
                    index: findIndex(name, element)
                } : selection.tridentSel ? selection.tridentSel.getBookmark(type) : (element = function(rng) {
                    function findSibling(node, offset) {
                        return NodeType.isElement(node) && (node = RangeUtils.getNode(node, offset), 
                        isContentEditableFalse(node)) ? node : CaretContainer.isCaretContainer(node) && (offset = (node = NodeType.isText(node) && CaretContainer.isCaretContainerBlock(node) ? node.parentNode : node).previousSibling, 
                        isContentEditableFalse(offset) || (offset = node.nextSibling, 
                        isContentEditableFalse(offset))) ? offset : void 0;
                    }
                    return findSibling(rng.startContainer, rng.startOffset) || findSibling(rng.endContainer, rng.endOffset);
                }(rng)) ? {
                    name: name = element.tagName,
                    index: findIndex(name, element)
                } : function(rng) {
                    var root = dom.getRoot(), bookmark = {};
                    function getPoint(rng, start) {
                        var childNodes, container = rng[start ? "startContainer" : "endContainer"], rng = rng[start ? "startOffset" : "endOffset"], point = [], start = 0;
                        for (3 === container.nodeType ? point.push(normalized ? function(container, offset) {
                            for (var trimmedOffset = Zwsp.trim(container.data.slice(0, offset)).length, node = container.previousSibling; node && 3 === node.nodeType; node = node.previousSibling) trimmedOffset += Zwsp.trim(node.data).length;
                            return trimmedOffset;
                        }(container, rng) : rng) : (rng >= (childNodes = container.childNodes).length && childNodes.length && (start = 1, 
                        rng = Math.max(0, childNodes.length - 1)), point.push(dom.nodeIndex(childNodes[rng], normalized) + start)); container && container != root; container = container.parentNode) point.push(dom.nodeIndex(container, normalized));
                        return point;
                    }
                    return bookmark.start = getPoint(rng, !0), selection.isCollapsed() || (bookmark.end = getPoint(rng)), 
                    bookmark;
                }(rng);
                if (3 == type) return rng = selection.getRng(), {
                    start: CaretBookmark.create(dom.getRoot(), CaretPosition.fromRangeStart(rng)),
                    end: CaretBookmark.create(dom.getRoot(), CaretPosition.fromRangeEnd(rng))
                };
                if (type) return {
                    rng: selection.getRng()
                };
                if (rng = selection.getRng(), type = dom.uniqueId(), collapsed = selection.isCollapsed(), 
                styles = "overflow:hidden;line-height:0px", rng.duplicate || rng.item) {
                    if (rng.item) return {
                        name: name = (element = rng.item(0)).nodeName,
                        index: findIndex(name, element)
                    };
                    rng2 = rng.duplicate();
                    try {
                        rng.collapse(), rng.pasteHTML('<span data-mce-type="bookmark" id="' + type + '_start" style="' + styles + '">' + chr + "</span>"), 
                        collapsed || (rng2.collapse(!1), rng.moveToElementText(rng2.parentElement()), 
                        0 === rng.compareEndPoints("StartToEnd", rng2) && rng2.move("character", -1), 
                        rng2.pasteHTML('<span data-mce-type="bookmark" id="' + type + '_end" style="' + styles + '">' + chr + "</span>"));
                    } catch (ex) {
                        return null;
                    }
                } else {
                    if ("IMG" == (name = (element = selection.getNode()).nodeName)) return {
                        name: name,
                        index: findIndex(name, element)
                    };
                    var name, rng2 = normalizeTableCellSelection(rng.cloneRange()), element = (collapsed || (rng2.collapse(!1), 
                    name = dom.create("span", {
                        "data-mce-type": "bookmark",
                        id: type + "_end",
                        style: styles
                    }, chr), rng2.insertNode(name), trimEmptyTextNode(name.nextSibling)), 
                    (rng = normalizeTableCellSelection(rng)).collapse(!0), dom.create("span", {
                        "data-mce-type": "bookmark",
                        id: type + "_start",
                        style: styles
                    }, chr));
                    rng.insertNode(element), trimEmptyTextNode(element.previousSibling);
                }
                return selection.moveToBookmark({
                    id: type,
                    keep: 1
                }), {
                    id: type
                };
            }, this.moveToBookmark = function(bookmark) {
                var rng, root, startContainer, endContainer, startOffset, endOffset;
                function setEndPoint(start) {
                    var i, node, offset, children, point = bookmark[start ? "start" : "end"];
                    if (point) {
                        for (offset = point[0], node = root, i = point.length - 1; 1 <= i; i--) {
                            if (children = node.childNodes, point[i] > children.length - 1) return;
                            node = children[point[i]];
                        }
                        3 === node.nodeType && (offset = Math.min(point[0], node.nodeValue.length)), 
                        1 === node.nodeType && (offset = Math.min(point[0], node.childNodes.length)), 
                        start ? rng.setStart(node, offset) : rng.setEnd(node, offset);
                    }
                    return 1;
                }
                function restoreEndPoint(suffix) {
                    var idx, node, marker = dom.get(bookmark.id + "_" + suffix), keep = bookmark.keep;
                    if (marker && (node = marker.parentNode, "start" == suffix ? (idx = keep ? (node = marker.firstChild, 
                    1) : dom.nodeIndex(marker), startContainer = endContainer = node, 
                    startOffset = endOffset = idx) : (idx = keep ? (node = marker.firstChild, 
                    1) : dom.nodeIndex(marker), endContainer = node, endOffset = idx), 
                    !keep)) {
                        for (node = marker.previousSibling, keep = marker.nextSibling, 
                        tinymce.each(tinymce.grep(marker.childNodes), function(node) {
                            3 == node.nodeType && (node.nodeValue = node.nodeValue.replace(/\uFEFF/g, ""));
                        }); marker = dom.get(bookmark.id + "_" + suffix); ) dom.remove(marker, 1);
                        node && keep && node.nodeType == keep.nodeType && 3 == node.nodeType && (idx = node.nodeValue.length, 
                        node.appendData(keep.nodeValue), dom.remove(keep), "start" == suffix ? (startContainer = endContainer = node, 
                        startOffset = endOffset = idx) : (endContainer = node, endOffset = idx));
                    }
                }
                function addBogus(node) {
                    return dom.isBlock(node) && !node.innerHTML && (node.innerHTML = '<br data-mce-bogus="1" />'), 
                    node;
                }
                if (bookmark) if (Arr.isArray(bookmark.start)) {
                    if (rng = dom.createRng(), root = dom.getRoot(), selection.tridentSel) return selection.tridentSel.moveToBookmark(bookmark);
                    setEndPoint(!0) && setEndPoint() && selection.setRng(rng);
                } else "string" == typeof bookmark.start ? selection.setRng(function() {
                    var rng = dom.createRng(), pos = CaretBookmark.resolve(dom.getRoot(), bookmark.start);
                    return rng.setStart(pos.container(), pos.offset()), pos = CaretBookmark.resolve(dom.getRoot(), bookmark.end), 
                    rng.setEnd(pos.container(), pos.offset()), rng;
                }()) : bookmark.id ? (restoreEndPoint("start"), restoreEndPoint("end"), 
                startContainer && ((rng = dom.createRng()).setStart(addBogus(startContainer), startOffset), 
                rng.setEnd(addBogus(endContainer), endOffset), selection.setRng(rng))) : bookmark.name ? selection.select(dom.select(bookmark.name)[bookmark.index]) : bookmark.rng && selection.setRng(bookmark.rng);
            };
        }
        BookmarkManager.isBookmarkNode = function(node) {
            return node && "SPAN" === node.tagName && "bookmark" === node.getAttribute("data-mce-type");
        }, tinymce.dom.BookmarkManager = BookmarkManager;
    }(tinymce), function(tinymce) {
        var Dispatcher = tinymce.util.Dispatcher, VK = tinymce.VK;
        function hasContentEditableState(node, value) {
            if (node && 1 === node.nodeType) {
                if (node.contentEditable === value) return !0;
                if (node.getAttribute("data-mce-contenteditable") === value) return !0;
            }
            return !1;
        }
        tinymce.dom.ControlSelection = function(selection, editor) {
            var selectedElm, selectedElmGhost, resizeHelper, resizeHandles, selectedHandle, lastMouseDownEvent, startX, startY, selectedElmX, selectedElmY, startW, startH, ratio, resizeStarted, width, height, startScrollWidth, startScrollHeight, dom = editor.dom, each = tinymce.each, editableDoc = editor.getDoc(), rootDocument = document, isIE = tinymce.isIE && tinymce.isIE < 11, abs = Math.abs, round = Math.round, rootElement = editor.getBody();
            function isResizable(elm) {
                var selector = editor.settings.object_resizing;
                return !1 !== selector && ("string" != typeof selector && (selector = "table,img,[data-mce-resize]"), 
                "false" !== elm.getAttribute("data-mce-resize")) && elm != editor.getBody() && editor.dom.is(elm, selector);
            }
            function resizeGhostElement(e) {
                var deltaX, deltaY, elm;
                !function(e) {
                    var keys, i;
                    if (e.changedTouches) for (keys = "screenX screenY pageX pageY clientX clientY".split(" "), 
                    i = 0; i < keys.length; i++) e[keys[i]] = e.changedTouches[0][keys[i]];
                }(e), deltaX = e.screenX - startX, deltaY = e.screenY - startY, 
                width = deltaX * selectedHandle[2] + startW, height = deltaY * selectedHandle[3] + startH, 
                width = width < 5 ? 5 : width, height = height < 5 ? 5 : height, 
                ("IMG" !== (elm = selectedElm).nodeName && "proportional" !== elm.getAttribute("data-mce-resize") || !1 === editor.settings.resize_img_proportional ? VK.modifierPressed(e) || "IMG" == selectedElm.nodeName && selectedHandle[2] * selectedHandle[3] != 0 : !VK.modifierPressed(e)) && (abs(deltaX) > abs(deltaY) ? (height = round(width * ratio), 
                width = round(height / ratio)) : (width = round(height / ratio), 
                height = round(width * ratio))), dom.setStyles(selectedElmGhost, {
                    width: width,
                    height: height
                }), elm = selectedHandle.startPos.x + deltaX, e = selectedHandle.startPos.y + deltaY, 
                dom.setStyles(resizeHelper, {
                    left: elm = 0 < elm ? elm : 0,
                    top: e = 0 < e ? e : 0,
                    display: "block"
                }), resizeHelper.innerHTML = width + " &times; " + height, selectedHandle[2] < 0 && selectedElmGhost.clientWidth <= width && dom.setStyle(selectedElmGhost, "left", selectedElmX + (startW - width)), 
                selectedHandle[3] < 0 && selectedElmGhost.clientHeight <= height && dom.setStyle(selectedElmGhost, "top", selectedElmY + (startH - height)), 
                (deltaX = rootElement.scrollWidth - startScrollWidth) + (deltaY = rootElement.scrollHeight - startScrollHeight) != 0 && dom.setStyles(resizeHelper, {
                    left: elm - deltaX,
                    top: e - deltaY
                }), resizeStarted || (editor.onObjectResizeStart.dispatch(editor, selectedElm, startW, startH), 
                resizeStarted = !0);
            }
            function endGhostResize() {
                function setSizeProp(name, value) {
                    value && ("IMG" !== selectedElm.nodeName ? dom.setStyle(selectedElm, name, value) : dom.setAttrib(selectedElm, name, value));
                }
                resizeStarted = !1, setSizeProp("width", width), setSizeProp("height", height), 
                dom.unbind(editableDoc, "mousemove touchmove", resizeGhostElement), 
                dom.unbind(editableDoc, "mouseup touchend", endGhostResize), rootDocument != editableDoc && (dom.unbind(rootDocument, "mousemove touchmove", resizeGhostElement), 
                dom.unbind(rootDocument, "mouseup touchend", endGhostResize)), dom.remove(selectedElmGhost), 
                dom.remove(resizeHelper), dom.removeClass(selectedElm, "mce-resizing"), 
                isIE && "TABLE" != selectedElm.nodeName || showResizeRect(selectedElm), 
                editor.onObjectResized.dispatch(editor, selectedElm, width, height), 
                dom.setAttrib(selectedElm, "style", dom.getAttrib(selectedElm, "style")), 
                editor.nodeChanged();
            }
            function showResizeRect(targetElm, mouseDownHandleName, mouseDownEvent) {
                var targetWidth, targetHeight, position;
                hideResizeRect(), unbindResizeHandleEvents(), position = dom.getPos(targetElm, rootElement), 
                selectedElmX = position.x, selectedElmY = position.y, position = targetElm.getBoundingClientRect(), 
                targetWidth = position.width || position.right - position.left, 
                targetHeight = position.height || position.bottom - position.top, 
                selectedElm != targetElm && (detachResizeStartListener(), selectedElm = targetElm, 
                width = height = 0), editor.onObjectSelected.dispatch(editor, targetElm), 
                isResizable(targetElm) ? each(resizeHandles, function(handle, name) {
                    var handleElm;
                    function startDrag(e) {
                        startX = e.screenX, startY = e.screenY, startW = selectedElm.clientWidth, 
                        startH = selectedElm.clientHeight, ratio = startH / startW, 
                        (selectedHandle = handle).startPos = {
                            x: targetWidth * handle[0] + selectedElmX,
                            y: targetHeight * handle[1] + selectedElmY
                        }, startScrollWidth = rootElement.scrollWidth, startScrollHeight = rootElement.scrollHeight, 
                        selectedElmGhost = selectedElm.cloneNode(), dom.addClass(selectedElmGhost, "mce-clonedresizable"), 
                        dom.setAttrib(selectedElmGhost, "data-mce-bogus", "all"), 
                        selectedElmGhost.contentEditable = !1, selectedElmGhost.unSelectabe = !0, 
                        dom.setStyles(selectedElmGhost, {
                            left: selectedElmX,
                            top: selectedElmY,
                            margin: 0
                        }), dom.addClass(selectedElm, "mce-resizing"), selectedElmGhost.removeAttribute("data-mce-selected"), 
                        rootElement.appendChild(selectedElmGhost), dom.bind(editableDoc, "mousemove touchmove", resizeGhostElement), 
                        dom.bind(editableDoc, "mouseup touchend", endGhostResize), 
                        rootDocument != editableDoc && (dom.bind(rootDocument, "mousemove touchmove", resizeGhostElement), 
                        dom.bind(rootDocument, "mouseup touchend", endGhostResize)), 
                        resizeHelper = dom.add(rootElement, "div", {
                            class: "mce-resize-helper",
                            "data-mce-bogus": "all"
                        }, startW + " &times; " + startH);
                    }
                    mouseDownHandleName ? name == mouseDownHandleName && startDrag(mouseDownEvent) : ((handleElm = dom.get("mceResizeHandle" + name.toUpperCase())) && dom.remove(handleElm), 
                    handleElm = dom.add(rootElement, "div", {
                        id: "mceResizeHandle" + name.toUpperCase(),
                        "data-mce-bogus": "all",
                        class: "mce-resizehandle mce-resizehandle-" + name,
                        unselectable: !0,
                        style: "cursor:" + name + "-resize;"
                    }), 11 === isIE && (handleElm.contentEditable = !1), dom.bind(handleElm, "mousedown", function(e) {
                        e.stopImmediatePropagation(), e.preventDefault(), startDrag(e);
                    }), handle.elm = handleElm, dom.setStyles(handleElm, {
                        left: targetWidth * handle[0] + selectedElmX - handleElm.offsetWidth / 2,
                        top: targetHeight * handle[1] + selectedElmY - handleElm.offsetHeight / 2
                    }));
                }) : hideResizeRect(), selectedElm.setAttribute("data-mce-selected", "1");
            }
            function hideResizeRect() {
                var name, handleElm;
                for (name in unbindResizeHandleEvents(), selectedElm && selectedElm.removeAttribute("data-mce-selected"), 
                resizeHandles) (handleElm = dom.get("mceResizeHandle" + name.toUpperCase())) && (dom.unbind(handleElm), 
                dom.remove(handleElm));
            }
            function updateResizeRect(e) {
                var startElm;
                function isChildOrEqual(node, parent) {
                    if (node) do {
                        if (node === parent) return 1;
                    } while (node = node.parentNode);
                }
                resizeStarted || editor.removed || editor !== tinymce.activeEditor || (each(dom.select("img[data-mce-selected][data-mce-resize],hr[data-mce-selected][data-mce-resize],span[data-mce-selected][data-mce-resize]"), function(img) {
                    img.removeAttribute("data-mce-selected");
                }), e = "mousedown" == e.type ? e.target : selection.getNode(), 
                isChildOrEqual(e = dom.closest(e, isIE ? "table" : "table,img,[data-mce-resize]")[0], rootElement) && (disableGeckoResize(), 
                isChildOrEqual(startElm = selection.getStart(!0), e)) && isChildOrEqual(selection.getEnd(!0), e) && (!isIE || e != startElm && "IMG" !== startElm.nodeName) ? showResizeRect(e) : hideResizeRect());
            }
            function attachEvent(elm, name, func) {
                elm && elm.attachEvent && elm.attachEvent("on" + name, func);
            }
            function detachEvent(elm, name, func) {
                elm && elm.detachEvent && elm.detachEvent("on" + name, func);
            }
            function resizeNativeStart(e) {
                var name, corner, cornerX, cornerY, target = e.srcElement, e = target.getBoundingClientRect(), relativeX = lastMouseDownEvent.clientX - e.left, relativeY = lastMouseDownEvent.clientY - e.top;
                for (name in resizeHandles) if (corner = resizeHandles[name], cornerX = target.offsetWidth * corner[0], 
                cornerY = target.offsetHeight * corner[1], abs(cornerX - relativeX) < 8 && abs(cornerY - relativeY) < 8) {
                    selectedHandle = corner;
                    break;
                }
                resizeStarted = !0, editor.onObjectResizeStart.dispatch(editor, selectedElm, selectedElm.clientWidth, selectedElm.clientHeight), 
                editor.getDoc().selection.empty(), showResizeRect(target, name, lastMouseDownEvent);
            }
            function isWithinContentEditableFalse(elm) {
                return hasContentEditableState(function(root, node) {
                    for (;node && node != root; ) {
                        if (hasContentEditableState(node, "true") || hasContentEditableState(node, "false")) return node;
                        node = node.parentNode;
                    }
                    return null;
                }(editor.getBody(), elm), "false");
            }
            function nativeControlSelect(e) {
                var target = e.srcElement;
                isWithinContentEditableFalse(target) ? function(e) {
                    e.preventDefault ? e.preventDefault() : e.returnValue = !1;
                }(e) : target != selectedElm && (editor.onObjectSelected.dispatch(editor, target), 
                detachResizeStartListener(), 0 === target.id.indexOf("mceResizeHandle") ? e.returnValue = !1 : "IMG" != target.nodeName && "TABLE" != target.nodeName || (hideResizeRect(), 
                attachEvent(selectedElm = target, "resizestart", resizeNativeStart)));
            }
            function detachResizeStartListener() {
                detachEvent(selectedElm, "resizestart", resizeNativeStart);
            }
            function unbindResizeHandleEvents() {
                for (var name in resizeHandles) (name = resizeHandles[name]).elm && (dom.unbind(name.elm), 
                delete name.elm);
            }
            function disableGeckoResize() {
                try {
                    editor.getDoc().execCommand("enableObjectResizing", !1, !1);
                } catch (ex) {}
            }
            function controlSelect(elm) {
                var ctrlRng;
                if (isIE) {
                    ctrlRng = editableDoc.body.createControlRange();
                    try {
                        return ctrlRng.addElement(elm), ctrlRng.select(), !0;
                    } catch (ex) {}
                }
            }
            function selectControl(editor, e) {
                var target = e.target, nodeName = target.nodeName;
                resizeStarted || !/^(TABLE|IMG|HR)$/.test(nodeName) || isWithinContentEditableFalse(target) || (editor.selection.select(target, "TABLE" == nodeName), 
                "mousedown" == e.type && editor.nodeChanged());
            }
            return editor.onObjectSelected = new Dispatcher(), editor.onObjectResizeStart = new Dispatcher(), 
            editor.onObjectResized = new Dispatcher(), resizeHandles = {
                nw: [ 0, 0, -1, -1 ],
                ne: [ 1, 0, 1, -1 ],
                se: [ 1, 1, 1, 1 ],
                sw: [ 0, 1, -1, 1 ]
            }, editor.onInit.add(function(editor) {
                isIE ? (editor.onObjectResized.add(function(editor, e) {
                    "TABLE" != e.target.nodeName && (hideResizeRect(), controlSelect(e.target));
                }), attachEvent(rootElement, "controlselect", nativeControlSelect), 
                editor.onMouseDown.add(function(editor, e) {
                    lastMouseDownEvent = e;
                })) : (disableGeckoResize(), (11 <= tinymce.isIE || tinymce.isIE12) && (editor.onClick.add(selectControl), 
                editor.onMouseDown.add(selectControl), editor.dom.bind(rootElement, "mscontrolselect", function(e) {
                    function delayedSelect(node) {
                        setTimeout(function() {
                            editor.selection.select(node);
                        }, 0);
                    }
                    isWithinContentEditableFalse(e.target) ? (e.preventDefault(), 
                    delayedSelect(e.target)) : /^(TABLE|IMG|HR)$/.test(e.target.nodeName) && (e.preventDefault(), 
                    "IMG" == e.target.tagName) && delayedSelect(e.target);
                }))), callback = function(e) {
                    updateResizeRect(e);
                }, (func = function() {
                    var args = arguments;
                    clearTimeout(timer), timer = setTimeout(function() {
                        callback.apply(this, args);
                    }, 0);
                }).stop = function() {
                    clearTimeout(timer);
                };
                var callback, timer, func, throttledUpdateResizeRect = func;
                function updateTableRect(editor, e) {
                    selectedElm && "TABLE" == selectedElm.nodeName && throttledUpdateResizeRect(e);
                }
                editor.onNodeChange.add(function() {
                    setTimeout(function() {
                        throttledUpdateResizeRect({
                            type: ""
                        });
                    }, 100);
                }), editor.dom.bind(editor.getBody(), "drop", function(e) {
                    throttledUpdateResizeRect(e);
                }), editor.onBeforeGetContent.add(hideResizeRect), editor.onKeyUp.add(updateTableRect), 
                editor.dom.bind(editor.getBody(), "compositionend", function(e) {
                    updateTableRect(0, e);
                }), editor.onBlur.add(hideResizeRect), editor.onHide.add(hideResizeRect);
            }), editor.onRemove.add(unbindResizeHandleEvents), {
                isResizable: isResizable,
                showResizeRect: showResizeRect,
                hideResizeRect: hideResizeRect,
                updateResizeRect: updateResizeRect,
                controlSelect: controlSelect,
                destroy: function() {
                    selectedElm = selectedElmGhost = null, isIE && (detachResizeStartListener(), 
                    detachEvent(rootElement, "controlselect", nativeControlSelect));
                }
            };
        };
    }(tinymce), function(tinymce) {
        var is = tinymce.is, isIE = tinymce.isIE, each = tinymce.each, extend = tinymce.extend, TreeWalker = tinymce.dom.TreeWalker, BookmarkManager = tinymce.dom.BookmarkManager, ControlSelection = tinymce.dom.ControlSelection;
        function isRestricted(element) {
            return element && !Object.getPrototypeOf(element);
        }
        tinymce.dom.Selection = function(dom, win, serializer, editor) {
            var self = this;
            self.dom = dom, self.win = win, self.serializer = serializer, self.editor = editor, 
            self.bookmarkManager = new BookmarkManager(self), self.controlSelection = new ControlSelection(self, editor), 
            each([ "onBeforeSetContent", "onBeforeGetContent", "onSetContent", "onGetContent", "onGetSelectionRange", "onSetSelectionRange", "onAfterSetSelectionRange" ], function(e) {
                self[e] = new tinymce.util.Dispatcher(self);
            }), self.onBeforeSetContent.add(function(e, args) {
                var node;
                "raw" !== args.format && (node = new tinymce.html.DomParser(editor.settings, editor.schema).parse(args.content, extend(args, {
                    isRootContent: !0,
                    forced_root_block: !1
                })), args.content = new tinymce.html.Serializer({
                    validate: !1
                }, editor.schema).serialize(node));
            }), tinymce.addUnload(self.destroy, self);
        }, tinymce.dom.Selection.prototype = {
            setCursorLocation: function(node, offset) {
                var r = this.dom.createRng();
                r.setStart(node, offset), r.setEnd(node, offset), this.setRng(r), 
                this.collapse(!1);
            },
            getContextualFragment: function(rng, frag) {
                var ed = this.editor, dom = this.dom, node = rng.commonAncestorContainer;
                if (node === ed.getBody()) return frag;
                var nodes, tableCells = dom.select("td.mceSelected, th.mceSelected", node);
                if (tableCells.length) {
                    var row, table = dom.getParent(node, "table");
                    if (table) return table = dom.clone(table), row = dom.create("tr"), 
                    each(tableCells, function(cell) {
                        row.appendChild(dom.clone(cell, !0));
                    }), table.appendChild(row), table;
                }
                return !rng.collapsed && (tableCells = dom.getParents(node, null, ed.getBody()), 
                (table = tinymce.grep(tableCells, function(elm) {
                    return 1 === elm.nodeType && !function(elm) {
                        return dom.isBlock(elm) && !/H[1-6]/.test(elm.nodeName);
                    }(elm);
                })).length) ? (nodes = document.createDocumentFragment(), each(table, function(elm) {
                    (elm = dom.clone(elm)).appendChild(frag), nodes.appendChild(elm);
                }), nodes) : frag;
            },
            getContent: function(s) {
                var wa, r = this.getRng(), e = this.dom.create("body"), se = this.getSel(), wb = wa = "";
                return (s = s || {}).get = !0, s.format = s.format || "html", s.forced_root_block = "", 
                this.onBeforeGetContent.dispatch(this, s), "text" == s.format ? this.isCollapsed() ? "" : r.text || (se.toString ? se.toString() : "") : (r.cloneContents ? (se = r.cloneContents()) && (s.contextual && (se = this.getContextualFragment(r, se)), 
                e.appendChild(se)) : is(r.item) || is(r.htmlText) ? (e.innerHTML = "<br>" + (r.item ? r.item(0).outerHTML : r.htmlText), 
                e.removeChild(e.firstChild)) : e.innerHTML = r.toString(), /^\s/.test(e.innerHTML) && (wb = " "), 
                /\s+$/.test(e.innerHTML) && (wa = " "), s.getInner = !0, s.content = this.isCollapsed() ? "" : wb + this.serializer.serialize(e, s) + wa, 
                this.onGetContent.dispatch(this, s), s.content);
            },
            setContent: function(content, args) {
                var caretNode, rng = this.getRng(), doc = this.win.document;
                if ((args = args || {
                    format: "html"
                }).set = !0, args.content = content, args.no_events || this.onBeforeSetContent.dispatch(this, args), 
                content = args.content, rng.insertNode) {
                    content += '<span id="__caret">_</span>', rng.startContainer == doc && rng.endContainer == doc || (rng.deleteContents(), 
                    0 === doc.body.childNodes.length) ? doc.body.innerHTML = content : rng.insertNode(rng.createContextualFragment(content)), 
                    caretNode = this.dom.get("__caret"), (rng = doc.createRange()).setStartBefore(caretNode), 
                    rng.setEndBefore(caretNode), this.setRng(rng), this.dom.remove("__caret");
                    try {
                        this.setRng(rng);
                    } catch (ex) {}
                } else rng.item && (doc.execCommand("Delete", !1, null), rng = this.getRng()), 
                /^\s+/.test(content) ? (rng.pasteHTML('<span id="__mce_tmp">_</span>' + content), 
                this.dom.remove("__mce_tmp")) : rng.pasteHTML(content);
                args.no_events || this.onSetContent.dispatch(this, args);
            },
            getStart: function(real) {
                var startElement, parentElement, checkRng, node, rng = this.getRng();
                if (rng.duplicate || rng.item) {
                    if (rng.item) return rng.item(0);
                    for ((checkRng = rng.duplicate()).collapse(1), (startElement = checkRng.parentElement()).ownerDocument !== this.dom.doc && (startElement = this.dom.getRoot()), 
                    parentElement = node = rng.parentElement(); node = node.parentNode; ) if (node == startElement) {
                        startElement = parentElement;
                        break;
                    }
                    return startElement;
                }
                return (startElement = 1 != (startElement = rng.startContainer).nodeType || !startElement.hasChildNodes() || real && rng.collapsed ? startElement : startElement.childNodes[Math.min(startElement.childNodes.length - 1, rng.startOffset)]) && 3 == startElement.nodeType ? startElement.parentNode : startElement;
            },
            getEnd: function(real) {
                var endElement, endOffset, rng = this.getRng();
                return rng.duplicate || rng.item ? rng.item ? rng.item(0) : ((rng = rng.duplicate()).collapse(0), 
                (endElement = (endElement = rng.parentElement()).ownerDocument !== this.dom.doc ? this.dom.getRoot() : endElement) && "BODY" == endElement.nodeName && endElement.lastChild || endElement) : (endElement = rng.endContainer, 
                endOffset = rng.endOffset, (endElement = 1 != endElement.nodeType || !endElement.hasChildNodes() || real && rng.collapsed ? endElement : endElement.childNodes[0 < endOffset ? endOffset - 1 : endOffset]) && 3 == endElement.nodeType ? endElement.parentNode : endElement);
            },
            getBookmark: function(type, normalized) {
                return this.bookmarkManager.getBookmark(type, normalized);
            },
            moveToBookmark: function(bookmark) {
                return this.bookmarkManager.moveToBookmark(bookmark);
            },
            select: function(node, content) {
                var dom = this.dom, rng = dom.createRng();
                function setPoint(node, start) {
                    var walker = new TreeWalker(node, node);
                    do {
                        if (3 == node.nodeType && 0 !== tinymce.trim(node.nodeValue).length) return start ? rng.setStart(node, 0) : rng.setEnd(node, node.nodeValue.length);
                        if ("BR" == node.nodeName) return start ? rng.setStartBefore(node) : rng.setEndBefore(node);
                    } while (node = start ? walker.next() : walker.prev());
                }
                if (node) {
                    if (!content && this.controlSelection.controlSelect(node)) return;
                    dom = dom.nodeIndex(node), rng.setStart(node.parentNode, dom), 
                    rng.setEnd(node.parentNode, dom + 1), content && (setPoint(node, 1), 
                    setPoint(node)), this.setRng(rng);
                }
                return node;
            },
            isCollapsed: function() {
                var r = this.getRng(), s = this.getSel();
                return !(!r || r.item) && (r.compareEndPoints ? 0 === r.compareEndPoints("StartToEnd", r) : !s || r.collapsed);
            },
            collapse: function(to_start) {
                var node, rng = this.getRng();
                rng.item && (node = rng.item(0), (rng = this.win.document.body.createTextRange()).moveToElementText(node)), 
                rng.collapse(!!to_start), this.setRng(rng);
            },
            getSel: function() {
                var w = this.win;
                return w.getSelection ? w.getSelection() : w.document.selection;
            },
            getRng: function(w3c) {
                var selection, rng, elm, doc, ieRng;
                function tryCompareBoundaryPoints(how, sourceRange, destinationRange) {
                    try {
                        return sourceRange.compareBoundaryPoints(how, destinationRange);
                    } catch (ex) {
                        return -1;
                    }
                }
                if (!this.win) return null;
                if (null == (doc = this.win.document)) return null;
                if (!w3c && this.lastFocusBookmark) (w3c = this.lastFocusBookmark).startContainer ? ((rng = doc.createRange()).setStart(w3c.startContainer, w3c.startOffset), 
                rng.setEnd(w3c.endContainer, w3c.endOffset)) : rng = w3c; else {
                    try {
                        (selection = this.getSel()) && !isRestricted(selection.anchorNode) && (rng = 0 < selection.rangeCount ? selection.getRangeAt(0) : (selection.createRange ? selection : doc).createRange());
                    } catch (ex) {}
                    if (this.onGetSelectionRange.dispatch(this, w3c = {
                        range: rng
                    }), w3c.range !== rng) return w3c.range;
                    if (isIE && rng && rng.setStart && doc.selection) {
                        try {
                            ieRng = doc.selection.createRange();
                        } catch (ex) {}
                        ieRng && ieRng.item && (elm = ieRng.item(0), (rng = doc.createRange()).setStartBefore(elm), 
                        rng.setEndAfter(elm));
                    }
                    (rng = (rng = rng && isRestricted(rng.startContainer) ? null : rng) || (doc.createRange ? doc.createRange() : doc.body.createTextRange())).setStart && 9 === rng.startContainer.nodeType && rng.collapsed && (elm = this.dom.getRoot(), 
                    rng.setStart(elm, 0), rng.setEnd(elm, 0)), this.selectedRange && this.explicitRange && (0 === tryCompareBoundaryPoints(rng.START_TO_START, rng, this.selectedRange) && 0 === tryCompareBoundaryPoints(rng.END_TO_END, rng, this.selectedRange) ? rng = this.explicitRange : (this.selectedRange = null, 
                    this.explicitRange = null));
                }
                return rng;
            },
            setRng: function(rng, forward) {
                if (rng) if (rng.select) {
                    this.explicitRange = null;
                    try {
                        rng.select();
                    } catch (ex) {}
                } else {
                    var sel = this.getSel(), evt = {
                        range: rng
                    };
                    if (this.onSetSelectionRange.dispatch(this, evt), rng = evt.range, 
                    sel) {
                        this.explicitRange = rng;
                        try {
                            sel.removeAllRanges(), sel.addRange(rng);
                        } catch (ex) {}
                        !1 === forward && sel.extend && (sel.collapse(rng.endContainer, rng.endOffset), 
                        sel.extend(rng.startContainer, rng.startOffset)), this.selectedRange = 0 < sel.rangeCount ? sel.getRangeAt(0) : null;
                    }
                    rng.collapsed || rng.startContainer !== rng.endContainer || !sel.setBaseAndExtent || tinymce.isIE || rng.endOffset - rng.startOffset < 2 && rng.startContainer.hasChildNodes() && (evt = rng.startContainer.childNodes[rng.startOffset]) && "IMG" === evt.tagName && (sel.setBaseAndExtent(rng.startContainer, rng.startOffset, rng.endContainer, rng.endOffset), 
                    sel.anchorNode === rng.startContainer && sel.focusNode === rng.endContainer || sel.setBaseAndExtent(evt, 0, evt, 1)), 
                    this.onAfterSetSelectionRange.dispatch(this, {
                        range: rng
                    });
                }
            },
            setNode: function(n) {
                return this.setContent(this.dom.getOuterHTML(n)), n;
            },
            getNode: function() {
                var elm, startContainer, endContainer, startOffset, endOffset, rng = this.getRng(), root = this.dom.getRoot();
                function skipEmptyTextNodes(node, forwards) {
                    for (var orig = node; node && 3 === node.nodeType && 0 === node.length; ) node = forwards ? node.nextSibling : node.previousSibling;
                    return node || orig;
                }
                return rng ? (startContainer = rng.startContainer, endContainer = rng.endContainer, 
                startOffset = rng.startOffset, endOffset = rng.endOffset, rng.setStart ? (elm = rng.commonAncestorContainer, 
                !rng.collapsed && (startContainer == endContainer && endOffset - startOffset < 2 && startContainer.hasChildNodes() && (elm = startContainer.childNodes[startOffset]), 
                3 === startContainer.nodeType) && 3 === endContainer.nodeType && (startContainer = startContainer.length === startOffset ? skipEmptyTextNodes(startContainer.nextSibling, !0) : startContainer.parentNode, 
                endContainer = 0 === endOffset ? skipEmptyTextNodes(endContainer.previousSibling, !1) : endContainer.parentNode, 
                startContainer) && startContainer === endContainer ? startContainer : elm && 3 == elm.nodeType ? elm.parentNode : elm) : rng.item ? rng.item(0) : rng.parentElement()) : root;
            },
            getSelectedBlocks: function(st, en) {
                var dom = this.dom, bl = [], st = dom.getParent(st || this.getStart(), dom.isBlock), eb = dom.getParent(en || this.getEnd(), dom.isBlock);
                if (st && bl.push(st), st && eb && st != eb) for (var n, walker = new TreeWalker(st, dom.getRoot()); (n = walker.next()) && n != eb; ) dom.isBlock(n) && bl.push(n);
                return eb && st != eb && bl.push(eb), bl;
            },
            getSelectedNodes: function(start, end) {
                var nodes = [], rng = this.getRng(), start = start || rng.startContainer, endNode = end || rng.endContainer;
                if (start && nodes.push(start), start && endNode && start != endNode) for (var node, walker = new TreeWalker(start, this.dom.getRoot()); (node = walker.next()) && node != endNode; ) node.parentNode === this.dom.getRoot() && nodes.push(node);
                return endNode && start != endNode && nodes.push(endNode), nodes;
            },
            isForward: function() {
                var anchorRange, dom = this.dom, sel = this.getSel();
                return !sel || null == sel.anchorNode || null == sel.focusNode || ((anchorRange = dom.createRng()).setStart(sel.anchorNode, sel.anchorOffset), 
                anchorRange.collapse(!0), (dom = dom.createRng()).setStart(sel.focusNode, sel.focusOffset), 
                dom.collapse(!0), anchorRange.compareBoundaryPoints(anchorRange.START_TO_START, dom) <= 0);
            },
            normalize: function() {
                var rng, normalized, collapsed, self = this;
                function normalizeEndPoint(start) {
                    var container, offset, walker, node, nonEmptyElementsMap, dom = self.dom, body = dom.getRoot();
                    function hasBrBeforeAfter(node, left) {
                        for (var walker = new TreeWalker(node, dom.getParent(node.parentNode, dom.isBlock) || body); node = walker[left ? "prev" : "next"](); ) if ("BR" === node.nodeName) return 1;
                    }
                    function findTextNodeRelative(left, startNode) {
                        for (var lastInlineElement, walker = new TreeWalker(startNode = startNode || container, dom.getParent(startNode.parentNode, dom.isBlock) || body); node = walker[left ? "prev" : "next"](); ) {
                            if (3 === node.nodeType && 0 < node.nodeValue.length) return container = node, 
                            offset = left ? node.nodeValue.length : 0, normalized = !0;
                            if (dom.isBlock(node) || nonEmptyElementsMap[node.nodeName.toLowerCase()]) return;
                            lastInlineElement = node;
                        }
                        collapsed && lastInlineElement && (container = lastInlineElement, 
                        normalized = !0, offset = 0);
                    }
                    if (container = rng[(start ? "start" : "end") + "Container"], 
                    offset = rng[(start ? "start" : "end") + "Offset"], nonEmptyElementsMap = dom.schema.getNonEmptyElements(), 
                    9 === container.nodeType && (container = dom.getRoot(), offset = 0), 
                    container === body) {
                        if (start && (node = container.childNodes[0 < offset ? offset - 1 : 0]) && (nonEmptyElementsMap[node.nodeName] || "TABLE" == node.nodeName)) return;
                        if (container.hasChildNodes() && (container = container.childNodes[Math.min(!start && 0 < offset ? offset - 1 : offset, container.childNodes.length - 1)], 
                        offset = 0, container.hasChildNodes()) && !/TABLE/.test(container.nodeName)) {
                            walker = new TreeWalker(node = container, body);
                            do {
                                if (3 === node.nodeType && 0 < node.nodeValue.length) {
                                    offset = start ? 0 : node.nodeValue.length, 
                                    container = node, normalized = !0;
                                    break;
                                }
                                if (nonEmptyElementsMap[node.nodeName.toLowerCase()]) {
                                    offset = dom.nodeIndex(node), container = node.parentNode, 
                                    "IMG" != node.nodeName || start || offset++, 
                                    normalized = !0;
                                    break;
                                }
                            } while (node = start ? walker.next() : walker.prev());
                        }
                    }
                    collapsed && (3 === container.nodeType && 0 === offset && findTextNodeRelative(!0), 
                    1 !== container.nodeType || !(node = container.childNodes[offset]) || "BR" !== node.nodeName || hasBrBeforeAfter(node) || hasBrBeforeAfter(node, !0) || findTextNodeRelative(!0, container.childNodes[offset])), 
                    start && !collapsed && 3 === container.nodeType && offset === container.nodeValue.length && findTextNodeRelative(!1), 
                    normalized && rng["set" + (start ? "Start" : "End")](container, offset);
                }
                tinymce.isIE || (rng = self.getRng(), collapsed = rng.collapsed, 
                normalizeEndPoint(!0), collapsed || normalizeEndPoint(), normalized && (collapsed && rng.collapse(!0), 
                self.setRng(rng, self.isForward())));
            },
            selectorChanged: function(selector, callback) {
                var currentSelectors, self = this;
                return self.selectorChangedData || (self.selectorChangedData = {}, 
                currentSelectors = {}, self.editor.onNodeChange.addToTop(function(ed, cm, node) {
                    var dom = self.dom, parents = dom.getParents(node, null, dom.getRoot()), matchedSelectors = {};
                    each(self.selectorChangedData, function(callbacks, selector) {
                        each(parents, function(node) {
                            if (dom.is(node, selector)) return currentSelectors[selector] || (each(callbacks, function(callback) {
                                callback(!0, {
                                    node: node,
                                    selector: selector,
                                    parents: parents
                                });
                            }), currentSelectors[selector] = callbacks), matchedSelectors[selector] = callbacks, 
                            !1;
                        });
                    }), each(currentSelectors, function(callbacks, selector) {
                        matchedSelectors[selector] || (delete currentSelectors[selector], 
                        each(callbacks, function(callback) {
                            callback(!1, {
                                node: node,
                                selector: selector,
                                parents: parents
                            });
                        }));
                    });
                })), self.selectorChangedData[selector] || (self.selectorChangedData[selector] = []), 
                self.selectorChangedData[selector].push(callback), self;
            },
            getScrollContainer: function() {
                for (var scrollContainer, node = this.dom.getRoot(); node && "BODY" != node.nodeName; ) {
                    if (node.scrollHeight > node.clientHeight) {
                        scrollContainer = node;
                        break;
                    }
                    node = node.parentNode;
                }
                return scrollContainer;
            },
            scrollIntoView: function(elm, alignToTop) {
                tinymce.dom.ScrollIntoView(this.editor, elm, alignToTop);
            },
            placeCaretAt: function(clientX, clientY) {
                this.setRng(tinymce.dom.RangeUtils.getCaretRangeFromPoint(clientX, clientY, this.editor.getDoc()));
            },
            destroy: function(manual) {
                this.win = null, manual || tinymce.removeUnload(this.destroy);
            },
            _fixIESelection: function() {
                var started, startRng, htmlElm, dom = this.dom, doc = dom.doc, body = doc.body;
                function rngFromPoint(x, y) {
                    var rng = body.createTextRange();
                    try {
                        rng.moveToPoint(x, y);
                    } catch (ex) {
                        rng = null;
                    }
                    return rng;
                }
                function selectionChange(e) {
                    e.button ? (e = rngFromPoint(e.x, e.y)) && (0 < e.compareEndPoints("StartToStart", startRng) ? e.setEndPoint("StartToStart", startRng) : e.setEndPoint("EndToEnd", startRng), 
                    e.select()) : endSelection();
                }
                function endSelection() {
                    var rng = doc.selection.createRange();
                    startRng && !rng.item && 0 === rng.compareEndPoints("StartToEnd", rng) && startRng.select(), 
                    dom.unbind(doc, "mouseup", endSelection), dom.unbind(doc, "mousemove", selectionChange), 
                    startRng = started = 0;
                }
                doc.documentElement.unselectable = !0, dom.bind(doc, [ "mousedown", "contextmenu" ], function(e) {
                    "HTML" === e.target.nodeName && (started && endSelection(), 
                    (htmlElm = doc.documentElement).scrollHeight > htmlElm.clientHeight || (started = 1, 
                    (startRng = rngFromPoint(e.x, e.y)) && (dom.bind(doc, "mouseup", endSelection), 
                    dom.bind(doc, "mousemove", selectionChange), dom.win.focus(), 
                    startRng.select())));
                });
            }
        };
    }(tinymce), function(tinymce) {
        tinymce.dom.Serializer = function(settings, dom, schema) {
            var onPreProcess, onPostProcess, htmlParser, self = this, isIE = tinymce.isIE, each = tinymce.each;
            return settings.apply_source_formatting || (settings.indent = !1), dom = dom || tinymce.DOM, 
            schema = schema || new tinymce.html.Schema(settings), settings.entity_encoding = settings.entity_encoding || "named", 
            settings.remove_trailing_brs = !("remove_trailing_brs" in settings) || settings.remove_trailing_brs, 
            onPreProcess = new tinymce.util.Dispatcher(self), onPostProcess = new tinymce.util.Dispatcher(self), 
            (htmlParser = new tinymce.html.DomParser(settings, schema)).addAttributeFilter("data-mce-tabindex", function(nodes, name) {
                for (var node, i = nodes.length; i--; ) (node = nodes[i]).attr("tabindex", node.attributes.map["data-mce-tabindex"]), 
                node.attr(name, null);
            }), htmlParser.addAttributeFilter("src,href,style", function(nodes, name) {
                for (var node, value, i = nodes.length, internalName = "data-mce-" + name, urlConverter = settings.url_converter, urlConverterScope = settings.url_converter_scope; i--; ) void 0 !== (value = (node = nodes[i]).attributes.map[internalName]) ? (node.attr(name, 0 < value.length ? value : null), 
                node.attr(internalName, null)) : (value = node.attributes.map[name], 
                "style" === name ? settings.validate_styles && (value = dom.serializeStyle(dom.parseStyle(value), node.name)) : urlConverter && (value = urlConverter.call(urlConverterScope, value, name, node.name)), 
                node.attr(name, 0 < value.length ? value : null));
            }), htmlParser.addAttributeFilter("class", function(nodes) {
                for (var node, value, i = nodes.length; i--; ) (value = (node = nodes[i]).attr("class")) && (value = (value = node.attr("class").replace(/(?:^|\s)mce(-?)(Item[\w-]+|Selected)(?!\S)/gi, "")).replace(/\s+/g, " ").replace(/^\s*|\s*$/g, ""), 
                node.attr("class", 0 < value.length ? value : null));
            }), htmlParser.addAttributeFilter("data-mce-type", function(nodes, name, args) {
                for (var node, i = nodes.length; i--; ) "temp" !== (node = nodes[i]).attributes.map["data-mce-type"] && ("bookmark" !== node.attributes.map["data-mce-type"] || args.cleanup) || node.remove();
            }), htmlParser.addNodeFilter("noscript", function(nodes) {
                for (var node, i = nodes.length; i--; ) (node = nodes[i].firstChild) && (node.value = tinymce.html.Entities.decode(node.value));
            }), htmlParser.addNodeFilter("script,style", function(nodes, name) {
                var node, value, type, i = nodes.length;
                for (;i--; ) value = (node = nodes[i]).firstChild ? node.firstChild.value : "", 
                "script" === name && (type = node.attr("type")) && node.attr("type", "mce-no/type" == type ? null : type.replace(/^mce\-/, "")), 
                0 < value.length && (node.firstChild.value = value.replace(/(<!--\[CDATA\[|\]\]-->)/g, "\n").replace(/^[\r\n]*|[\r\n]*$/g, "").replace(/^\s*((<!--)?(\s*\/\/)?\s*<!\[CDATA\[|(<!--\s*)?\/\*\s*<!\[CDATA\[\s*\*\/|(\/\/)?\s*<!--|\/\*\s*<!--\s*\*\/)\s*[\r\n]*/gi, "").replace(/\s*(\/\*\s*\]\]>\s*\*\/(-->)?|\s*\/\/\s*\]\]>(-->)?|\/\/\s*(-->)?|\]\]>|\/\*\s*-->\s*\*\/|\s*-->\s*)\s*$/g, ""));
            }), htmlParser.addNodeFilter("#comment", function(nodes) {
                for (var node, i = nodes.length; i--; ) 0 === (node = nodes[i]).value.indexOf("[CDATA[") ? (node.name = "#cdata", 
                node.type = 4, node.value = node.value.replace(/^\[CDATA\[|\]\]$/g, "")) : 0 === node.value.indexOf("mce:protected ") && (node.name = "#text", 
                node.type = 3, node.raw = !0, node.value = unescape(node.value).substr(14));
            }), htmlParser.addNodeFilter("xml:namespace,input", function(nodes, name) {
                for (var node, i = nodes.length; i--; ) 7 === (node = nodes[i]).type ? node.remove() : 1 !== node.type || "input" !== name || "type" in node.attributes.map || node.attr("type", "text");
            }), settings.fix_list_elements && htmlParser.addNodeFilter("ul,ol", function(nodes) {
                for (var node, parentNode, i = nodes.length; i--; ) "ul" !== (parentNode = (node = nodes[i]).parent).name && "ol" !== parentNode.name || node.prev && "li" === node.prev.name && node.prev.append(node);
            }), htmlParser.addAttributeFilter("data-mce-src,data-mce-href,data-mce-style,data-mce-selected,data-mce-expando,data-mce-type,data-mce-resize,data-mce-new", function(nodes, name) {
                for (var i = nodes.length; i--; ) nodes[i].attr(name, null);
            }), {
                schema: schema,
                addNodeFilter: htmlParser.addNodeFilter,
                addAttributeFilter: htmlParser.addAttributeFilter,
                onPreProcess: onPreProcess,
                onPostProcess: onPostProcess,
                serialize: function(node, args) {
                    var doc, oldDoc, content, rootNode, brNode2;
                    return isIE && 0 < dom.select("script,style,select,map").length ? (content = node.innerHTML, 
                    node = node.cloneNode(!1), dom.setHTML(node, content)) : node = node.cloneNode(!0), 
                    (content = document.implementation).createHTMLDocument && (doc = content.createHTMLDocument(""), 
                    each("BODY" == node.nodeName ? node.childNodes : [ node ], function(node) {
                        doc.body.appendChild(doc.importNode(node, !0));
                    }), node = "BODY" != node.nodeName ? doc.body.firstChild : doc.body, 
                    oldDoc = dom.doc, dom.doc = doc), (args = args || {}).format = args.format || "html", 
                    args.selection && (args.forced_root_block = ""), args.no_events || (args.node = node, 
                    onPreProcess.dispatch(self, args)), isBr(rootNode = (rootNode = content = htmlParser.parse(tinymce.trim(args.getInner ? node.innerHTML : dom.getOuterHTML(node)), args)).lastChild) && isBr(brNode2 = rootNode.prev) && (rootNode.remove(), 
                    brNode2.remove()), node = new tinymce.html.Serializer(settings, schema), 
                    args.content = node.serialize(content), args.cleanup || (args.content = args.content.replace(/\uFEFF/g, "")), 
                    args.no_events || onPostProcess.dispatch(self, args), oldDoc && (dom.doc = oldDoc), 
                    args.node = null, args.content;
                    function isBr(node) {
                        return node && "br" === node.name;
                    }
                },
                addRules: function(rules) {
                    schema.addValidElements(rules);
                },
                setRules: function(rules) {
                    schema.setValidElements(rules);
                }
            };
        };
    }(tinymce), function(tinymce) {
        tinymce.dom.ScriptLoader = function() {
            var states = {}, queue = [], scriptLoadedCallbacks = {}, queueLoadedCallbacks = [], loading = 0;
            this.isDone = function(url) {
                return 2 == states[url];
            }, this.markDone = function(url) {
                states[url] = 2;
            }, this.add = this.load = function(url, callback, scope) {
                null == states[url] && (queue.push(url), states[url] = 0), callback && (scriptLoadedCallbacks[url] || (scriptLoadedCallbacks[url] = []), 
                scriptLoadedCallbacks[url].push({
                    func: callback,
                    scope: scope || this
                }));
            }, this.loadQueue = function(callback, scope) {
                this.loadScripts(queue, callback, scope);
            }, this.loadScripts = function(scripts, callback, scope) {
                var loadScripts;
                function execScriptLoadedCallbacks(url) {
                    tinymce.each(scriptLoadedCallbacks[url], function(callback) {
                        callback.func.call(callback.scope);
                    }), scriptLoadedCallbacks[url] = void 0;
                }
                queueLoadedCallbacks.push({
                    func: callback,
                    scope: scope || this
                }), (loadScripts = function() {
                    var loadingScripts = tinymce.grep(scripts);
                    scripts.length = 0, tinymce.each(loadingScripts, function(url) {
                        2 == states[url] ? execScriptLoadedCallbacks(url) : 1 != states[url] && (states[url] = 1, 
                        loading++, function(url, callback) {
                            var elm, id, dom = tinymce.DOM;
                            function done() {
                                dom.remove(id), elm && (elm.onreadystatechange = elm.onload = elm = null), 
                                callback();
                            }
                            id = dom.uniqueId(), (elm = document.createElement("script")).setAttribute("data-cfasync", !1), 
                            elm.id = id, elm.type = "text/javascript", elm.src = tinymce._addVer(url), 
                            tinymce.isIE && !tinymce.isIE11 || (elm.onload = done), 
                            elm.onerror = function() {
                                "undefined" != typeof console && console.log && console.log("Failed to load: " + url);
                            }, tinymce.isOpera || (elm.onreadystatechange = function() {
                                var state = elm.readyState;
                                "complete" != state && "loaded" != state || done();
                            }), (document.getElementsByTagName("head")[0] || document.body).appendChild(elm);
                        }(url, function() {
                            states[url] = 2, loading--, execScriptLoadedCallbacks(url), 
                            loadScripts();
                        }));
                    }), loading || (tinymce.each(queueLoadedCallbacks, function(callback) {
                        callback.func.call(callback.scope);
                    }), queueLoadedCallbacks.length = 0);
                })();
            };
        }, tinymce.ScriptLoader = new tinymce.dom.ScriptLoader();
    }(tinymce), function(tinymce) {
        tinymce.dom.StyleSheetLoader = function(document) {
            var states = {}, queue = [], stylesheetLoadedCallbacks = {}, queueLoadedCallbacks = [], loading = 0, maxLoadTime = 5e3;
            function loadStylesheet(url, callback) {
                var elm, id, startTime, complete;
                function done() {
                    complete || (complete = !0, elm && (elm.onreadystatechange = elm.onload = elm = null), 
                    callback());
                }
                function error() {
                    "undefined" != typeof console && console.log && console.log("Failed to load: " + url), 
                    done();
                }
                id = tinymce.DOM.uniqueId(), (elm = document.createElement("link")).rel = "stylesheet", 
                elm.type = "text/css", elm.href = tinymce._addVer(url), elm.async = !1, 
                elm.defer = !1, startTime = new Date().getTime(), elm.setAttribute("data-cfasync", !1), 
                elm.id = id, elm.onload = function waitForLoaded() {
                    var waitCallback = waitForLoaded;
                    !function() {
                        for (var styleSheet, styleSheets = document.styleSheets, i = styleSheets.length; i--; ) if ((styleSheet = (styleSheet = styleSheets[i]).ownerNode || styleSheet.owningElement) && styleSheet.id === elm.id) return done(), 
                        1;
                    }() && (new Date().getTime() - startTime < maxLoadTime ? setTimeout(waitCallback) : error());
                }, elm.onerror = error, (document.getElementsByTagName("head")[0] || document.body).appendChild(elm);
            }
            this.isDone = function(url) {
                return 2 == states[url];
            }, this.markDone = function(url) {
                states[url] = 2;
            }, this.add = this.load = function(url, callback, scope) {
                null == states[url] && (queue.push(url), states[url] = 0), callback && (stylesheetLoadedCallbacks[url] || (stylesheetLoadedCallbacks[url] = []), 
                stylesheetLoadedCallbacks[url].push({
                    func: callback,
                    scope: scope || this
                }));
            }, this.loadQueue = function(callback, scope) {
                this.loadStylesheets(queue, callback, scope);
            }, this.loadStylesheets = function(stylesheets, callback, scope) {
                var loadStylesheets;
                function execstylesheetLoadedCallbacks(url) {
                    tinymce.each(stylesheetLoadedCallbacks[url], function(callback) {
                        callback.func.call(callback.scope);
                    }), stylesheetLoadedCallbacks[url] = void 0;
                }
                queueLoadedCallbacks.push({
                    func: callback,
                    scope: scope || this
                }), (loadStylesheets = function() {
                    var loadingstylesheets = tinymce.grep(stylesheets);
                    stylesheets.length = 0, tinymce.each(loadingstylesheets, function(url) {
                        2 == states[url] ? execstylesheetLoadedCallbacks(url) : 1 != states[url] && (states[url] = 1, 
                        loading++, loadStylesheet(url, function() {
                            states[url] = 2, loading--, execstylesheetLoadedCallbacks(url), 
                            loadStylesheets();
                        }));
                    }), loading || (tinymce.each(queueLoadedCallbacks, function(callback) {
                        callback.func.call(callback.scope);
                    }), queueLoadedCallbacks.length = 0);
                })();
            }, this.loadStylesheet = loadStylesheet;
        }, tinymce.StyleSheetLoader = new tinymce.dom.StyleSheetLoader();
    }(tinymce), function(tinymce) {
        function isUIElement(editor, elm) {
            var customSelector = editor ? editor.settings.custom_ui_selector : "";
            return null !== DOM.getParent(elm, function(elm) {
                return FocusManager.isEditorUIElement(elm) || !!customSelector && editor.dom.is(elm, customSelector);
            });
        }
        var selectionChangeHandler, documentFocusInHandler, documentMouseUpHandler, DOM = tinymce.DOM;
        function FocusManager(editorManager) {
            function registerEvents(editor) {
                editor.onSetContent.add(function() {
                    editor.lastRng = null;
                }), editor.onMouseDown.add(function() {
                    editor.selection.lastFocusBookmark = null;
                }), editor.onFocusIn.add(function() {
                    var lastRng, focusedEditor = editorManager.focusedEditor;
                    editor.selection.lastFocusBookmark && (lastRng = function(editor, bookmark) {
                        var rng;
                        return bookmark.startContainer ? ((rng = editor.getDoc().createRange()).setStart(bookmark.startContainer, bookmark.startOffset), 
                        rng.setEnd(bookmark.endContainer, bookmark.endOffset)) : rng = bookmark, 
                        rng;
                    }(editor, editor.selection.lastFocusBookmark), editor.selection.lastFocusBookmark = null, 
                    editor.selection.setRng(lastRng)), focusedEditor != editor && (focusedEditor && (focusedEditor.onBlur.dispatch(focusedEditor, {
                        focusedEditor: editor
                    }), focusedEditor.onDeactivate.dispatch(focusedEditor, editor)), 
                    editorManager.setActive(editor), (editorManager.focusedEditor = editor).onFocus.dispatch(editor, {
                        blurredEditor: focusedEditor
                    }), editor.onActivate.dispatch(editor, focusedEditor), editor.focus(!0)), 
                    editor.lastRng = null;
                }), editor.onFocusOut.add(function() {
                    setTimeout(function() {
                        var focusedEditor = editorManager.focusedEditor;
                        isUIElement(editor, function() {
                            try {
                                return document.activeElement;
                            } catch (ex) {
                                return document.body;
                            }
                        }()) || focusedEditor != editor || (editor.onBlur.dispatch(editor, {
                            focusedEditor: null
                        }), editorManager.focusedEditor = null, editor.selection && (editor.selection.lastFocusBookmark = null));
                    }, 10);
                }), documentFocusInHandler || (documentFocusInHandler = function(e) {
                    var dom, rng, activeEditor = editorManager.activeEditor, e = e.target;
                    activeEditor && e.ownerDocument === document && (activeEditor.selection && e !== activeEditor.getBody() && function(editor, target) {
                        return !1 === editor.dom.isChildOf(target, editor.getBody());
                    }(editor, e) && (activeEditor.selection.lastFocusBookmark = (dom = activeEditor.dom, 
                    (rng = activeEditor.lastRng) && rng.startContainer ? dom.isChildOf(rng.startContainer, dom.getRoot()) && dom.isChildOf(rng.endContainer, dom.getRoot()) ? {
                        startContainer: rng.startContainer,
                        startOffset: rng.startOffset,
                        endContainer: rng.endContainer,
                        endOffset: rng.endOffset
                    } : void 0 : rng)), e === document.body || isUIElement(activeEditor, e) || editorManager.focusedEditor !== activeEditor || (activeEditor.onBlur.dispatch(editor, {
                        focusedEditor: null
                    }), editorManager.focusedEditor = null));
                }, DOM.bind(document, "focusin", documentFocusInHandler));
            }
            editorManager.onAddEditor.add(function(mgr, editor) {
                registerEvents(editor);
            }), editorManager.onRemoveEditor.add(function(mgr, editor) {
                !function(editor) {
                    editorManager.focusedEditor == editor && (editorManager.focusedEditor = null), 
                    editorManager.activeEditor || (DOM.unbind(document, "selectionchange", selectionChangeHandler), 
                    DOM.unbind(document, "focusin", documentFocusInHandler), DOM.unbind(document, "mouseup", documentMouseUpHandler), 
                    selectionChangeHandler = documentFocusInHandler = documentMouseUpHandler = null);
                }(editor);
            });
        }
        FocusManager.isEditorUIElement = function(elm) {
            return -1 !== elm.className.toString().indexOf("mce");
        }, tinymce.dom.FocusManager = FocusManager;
    }(tinymce), function(tinymce) {
        var Event = tinymce.dom.Event, each = tinymce.each;
        tinymce.create("tinymce.ui.KeyboardNavigation", {
            KeyboardNavigation: function(settings, dom) {
                var itemFocussed, itemBlurred, rootKeydown, rootFocussed, focussedId, self = this, root = settings.root, items = settings.items, enableUpDown = settings.enableUpDown, enableLeftRight = settings.enableLeftRight || !settings.enableUpDown, excludeFromTabOrder = settings.excludeFromTabOrder, rootElm = (dom = dom || tinymce.DOM, 
                itemFocussed = function(evt) {
                    focussedId = evt.target.id;
                }, itemBlurred = function(evt) {
                    dom.setAttrib(evt.target.id, "tabindex", "-1");
                }, rootFocussed = function() {
                    var item = dom.get(focussedId);
                    dom.setAttrib(item, "tabindex", "0"), item.focus();
                }, this.focus = function() {
                    dom.get(focussedId).focus();
                }, this.update = function(value) {
                    each(items = value, function(item, idx) {
                        item.id || (item.id = dom.uniqueId("_mce_item_")), item = dom.get(item.id), 
                        idx = excludeFromTabOrder ? (dom.bind(item, "blur", itemBlurred), 
                        "-1") : 0 === idx ? "0" : "-1", item.setAttribute("tabindex", idx), 
                        dom.bind(item, "focus", itemFocussed);
                    });
                }, this.destroy = function() {
                    each(items, function(item) {
                        item = dom.get(item.id), dom.unbind(item, "focus", itemFocussed), 
                        dom.unbind(item, "blur", itemBlurred);
                    });
                    var rootElm = dom.get(root);
                    dom.unbind(rootElm, "focus", rootFocussed), dom.unbind(rootElm, "keydown", rootKeydown), 
                    items = dom = root = this.focus = itemFocussed = itemBlurred = rootKeydown = rootFocussed = null, 
                    this.destroy = function() {};
                }, this.moveFocus = function(dir, evt) {
                    var idx = -1;
                    focussedId && (each(items, function(item, index) {
                        if (item.id === focussedId) return idx = index, !1;
                    }), (idx += dir) < 0 ? idx = items.length - 1 : idx >= items.length && (idx = 0), 
                    dir = items[idx], dom.setAttrib(focussedId, "tabindex", "-1"), 
                    dom.setAttrib(dir.id, "tabindex", "0"), dom.get(dir.id).focus(), 
                    settings.actOnFocus && settings.onAction(dir.id), evt) && Event.cancel(evt);
                }, rootKeydown = function(evt) {
                    switch (evt.keyCode) {
                      case 37:
                        enableLeftRight && (self.moveFocus(-1), Event.cancel(evt));
                        break;

                      case 39:
                        enableLeftRight && (self.moveFocus(1), Event.cancel(evt));
                        break;

                      case 38:
                        enableUpDown && (self.moveFocus(-1), Event.cancel(evt));
                        break;

                      case 40:
                        enableUpDown && (self.moveFocus(1), Event.cancel(evt));
                        break;

                      case 27:
                        settings.onCancel && (settings.onCancel(), Event.cancel(evt));
                        break;

                      case 14:
                      case 13:
                      case 32:
                        settings.onAction && (Event.cancel(evt), settings.onAction(evt, focussedId));
                    }
                }, this.update(items), items[0] && (focussedId = items[0].id), dom.setAttrib(root, "tabindex", "-1"), 
                dom.get(root));
                dom.bind(rootElm, "focus", rootFocussed), dom.bind(rootElm, "keydown", rootKeydown);
            }
        });
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM;
        tinymce.create("tinymce.ui.Control", {
            Control: function(id, settings, editor) {
                this.id = id, this.settings = settings || {}, this.rendered = !1, 
                this.onRender = new tinymce.util.Dispatcher(this), this.classPrefix = "mce", 
                this.scope = this.settings.scope || this, this.disabled = 0, this.active = 0, 
                this.editor = editor, this.name = this.settings.name || id;
            },
            setAriaProperty: function(property, value) {
                var element = DOM.get(this.id + "_aria") || DOM.get(this.id);
                element && DOM.setAttrib(element, "aria-" + property, !!value);
            },
            focus: function() {
                DOM.get(this.id).focus();
            },
            setDisabled: function(state) {
                state != this.disabled && (this.setAriaProperty("disabled", state), 
                this.setState("Disabled", state), this.setState("Enabled", !state), 
                this.disabled = state);
            },
            isDisabled: function() {
                return this.disabled;
            },
            setActive: function(s) {
                s != this.active && (this.setState("Active", s), this.active = s, 
                this.setAriaProperty("pressed", s));
            },
            isActive: function() {
                return this.active;
            },
            setState: function(c, s) {
                var n = DOM.get(this.id);
                c = this.classPrefix + c, s ? DOM.addClass(n, c) : DOM.removeClass(n, c);
            },
            isRendered: function() {
                return this.rendered;
            },
            renderHTML: function() {},
            renderTo: function(n) {
                var frag = DOM.createFragment(this.renderHTML());
                n.appendChild(frag), this.postRender();
            },
            postRender: function() {
                var state;
                tinymce.is(this.disabled) && (state = this.disabled, this.disabled = -1, 
                this.setDisabled(state)), tinymce.is(this.active) && (state = this.active, 
                this.active = -1, this.setActive(state)), this._elm = DOM.get(this.id), 
                this.onRender.dispatch();
            },
            parent: function(ctrl) {
                if (!ctrl) return this._parent || null;
                this._parent = ctrl;
            },
            remove: function() {
                this.destroy(), DOM.remove(this.id);
            },
            destroy: function() {
                tinymce.dom.Event.clear(this.id);
            }
        });
    }(tinymce), tinymce.create("tinymce.ui.Container:tinymce.ui.Control", {
        Container: function(id, settings, editor) {
            var self = this;
            this._super(id, settings = settings || {}, editor), this.controls = [], 
            this.lookup = {}, settings.controls && tinymce.each(settings.controls, function(ctrl) {
                self.add(ctrl);
            });
        },
        add: function(ctrl) {
            return this.lookup[ctrl.id] = ctrl, this.controls.push(ctrl), ctrl.parent(this), 
            ctrl;
        },
        destroy: function() {
            var i;
            for (this._super(), i = 0; i < this.controls.length; i++) this.controls[i].destroy();
            delete this.lookup[this.id];
        },
        get: function(id) {
            return this.lookup[id];
        }
    }), function(tinymce) {
        var dom = tinymce.DOM;
        tinymce.create("tinymce.ui.Form:tinymce.ui.Container", {
            renderHTML: function() {
                for (var html = "", settings = this.settings, i = 0; i < this.controls.length; i++) {
                    var ctrl = this.controls[i], s = ctrl.settings;
                    html += '<div class="mceFormRow">', s.label && (html += '<label for="' + ctrl.id + '">' + s.label + "</label>"), 
                    html = (html += '\t<div class="mceFormControl">') + ctrl.renderHTML() + "\t</div></div>";
                }
                return dom.createHTML("div", {
                    id: this.id,
                    class: "mceForm" + (settings.class ? " " + settings.class : ""),
                    role: "group"
                }, html);
            },
            submit: function() {
                for (var data = {}, i = 0; i < this.controls.length; i++) {
                    var ctrl = this.controls[i];
                    "function" == typeof ctrl.value && (data[ctrl.name] = ctrl.value());
                }
                return data;
            },
            update: function(data) {
                for (var i = 0; i < this.controls.length; i++) {
                    var ctrl = this.controls[i];
                    data[ctrl.name] && "function" == typeof ctrl.value && ctrl.value(data[ctrl.name]);
                }
            },
            empty: function() {
                for (var i = 0; i < this.controls.length; i++) this.controls[i].remove();
                this.controls = [], this.lookup = {};
            },
            add: function(ctrl) {
                return !this.get(ctrl.id) && this._super(ctrl);
            },
            postRender: function() {
                var i;
                for (this._super(), i = 0; i < this.controls.length; i++) this.controls[i].postRender();
            }
        });
    }(tinymce), tinymce.create("tinymce.ui.Separator:tinymce.ui.Control", {
        Separator: function(id, s) {
            this._super(id, s), this.classPrefix = "mceSeparator", this.setDisabled(!0);
        },
        renderHTML: function() {
            return tinymce.DOM.createHTML("span", {
                class: this.classPrefix,
                role: "separator",
                "aria-orientation": "vertical",
                tabindex: "-1"
            }, "");
        }
    }), function(tinymce) {
        tinymce.create("tinymce.ui.MenuItem:tinymce.ui.Control", {
            MenuItem: function(id, settings) {
                this._super(id, settings);
            },
            setSelected: function(state) {
                this.setState("Selected", state), this.setAriaProperty("checked", !!state), 
                this.selected = state;
            },
            isSelected: function() {
                return this.selected;
            },
            postRender: function() {
                this._super(), tinymce.is(this.selected) && this.setSelected(this.selected);
            }
        });
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, walk = tinymce.walk;
        tinymce.create("tinymce.ui.Menu:tinymce.ui.MenuItem", {
            Menu: function(id, settings) {
                this._super(id, settings), this.items = {}, this.collapsed = !1, 
                this.menuCount = 0, this.onAddItem = new tinymce.util.Dispatcher(this);
            },
            expand: function(d) {
                d && walk(this, function(o) {
                    o.expand && o.expand();
                }, "items", this), this.collapsed = !1;
            },
            collapse: function(state) {
                state && walk(this, function(menu) {
                    menu.collapse && menu.collapse();
                }, "items", this), this.collapsed = !0;
            },
            isCollapsed: function() {
                return this.collapsed;
            },
            add: function(menu) {
                return menu.settings || (menu = new tinymce.ui.MenuItem(menu.id || DOM.uniqueId(), menu)), 
                this.onAddItem.dispatch(this, menu), this.items[menu.id] = menu;
            },
            addSeparator: function() {
                return this.add({
                    separator: !0
                });
            },
            addMenu: function(menu) {
                return menu.collapse || (menu = this.createMenu(menu)), this.menuCount++, 
                this.add(menu);
            },
            hasMenus: function() {
                return 0 !== this.menuCount;
            },
            remove: function(menu) {
                delete this.items[menu.id];
            },
            removeAll: function() {
                walk(this, function(menu) {
                    menu.removeAll ? menu.removeAll() : menu.remove(), menu.destroy();
                }, "items", this), this.items = {};
            },
            createMenu: function(settings) {
                return (settings = new tinymce.ui.Menu(settings.id || DOM.uniqueId(), settings)).onAddItem.add(this.onAddItem.dispatch, this.onAddItem), 
                settings;
            }
        });
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, each = tinymce.each, Event = tinymce.dom.Event, specialKeyCodeMap = {
            9: "tab",
            17: "ctrl",
            18: "alt",
            27: "esc",
            37: "left",
            39: "right",
            13: "enter",
            91: "cmd",
            38: "up",
            40: "down"
        };
        tinymce.create("tinymce.ui.DropMenu:tinymce.ui.Menu", {
            DropMenu: function(id, s) {
                (s = s || {}).container = s.container || DOM.doc.body, s.offset_x = s.offset_x || 0, 
                s.offset_y = s.offset_y || 0, s.vp_offset_x = s.vp_offset_x || 0, 
                s.vp_offset_y = s.vp_offset_y || 0, this._super(id, s), this.onShowMenu = new tinymce.util.Dispatcher(this), 
                this.onHideMenu = new tinymce.util.Dispatcher(this), this.onFilterInput = new tinymce.util.Dispatcher(this), 
                this.classPrefix = "mceMenu", this.selected = [];
            },
            createMenu: function(s) {
                var cs = this.settings;
                return s.container = s.container || cs.container, s.parent = this, 
                s.constrain = s.constrain || cs.constrain, s.class = s.class || cs.class, 
                s.vp_offset_x = s.vp_offset_x || cs.vp_offset_x, s.vp_offset_y = s.vp_offset_y || cs.vp_offset_y, 
                s.keyboard_focus = cs.keyboard_focus, (cs = new tinymce.ui.DropMenu(s.id || DOM.uniqueId(), s)).onAddItem.add(this.onAddItem.dispatch, this.onAddItem), 
                cs;
            },
            focus: function() {
                this.keyboardNav && this.keyboardNav.focus();
            },
            update: function() {
                var s = this.settings, m = DOM.get("menu_" + this.id);
                s.max_width && DOM.setStyle(m, "width", s.max_width), s.max_height && DOM.setStyle(m, "height", s.max_height);
            },
            scrollTo: function(el) {
                el.parentNode.scrollTop = el.offsetTop;
            },
            deselectAll: function() {
                each(this.items, function(item) {
                    item.setSelected(0);
                });
            },
            selectItem: function(item, state) {
                return item.setSelected(state), state ? this.selected.push(item) : 0 <= (state = tinymce.inArray(this.selected, item)) && this.selected.splice(state, 1), 
                item;
            },
            findItem: function(val) {
                var found;
                return each(this.items, function(item) {
                    if (item.settings.title === val) return found = item, !1;
                }), found;
            },
            clearFilterInput: function() {
                var filter = DOM.get("menu_" + this.id + "_filter"), input = DOM.select("input", "menu_" + this.id + "_filter_input")[0];
                filter && (input.value = "", input.focus(), this.clearFilteredItems());
            },
            showMenu: function(x, y, px, py) {
                var co, w, h, mx, self = this, s = self.settings, vp = DOM.getViewPort(), cp = self.classPrefix;
                self.collapse(1), self.isMenuVisible || (self.selected = [], self.rendered ? co = DOM.get("menu_" + self.id) : (co = DOM.add(self.settings.container, self.renderNode()), 
                each(self.items, function(o) {
                    o.postRender();
                }), self.postRender()), co && (DOM.show(co), self.update(), x += s.offset_x || 0, 
                y += s.offset_y || 0, s.constrain && (w = +co.clientWidth, h = +co.clientHeight, 
                mx = vp.x + vp.w, vp = vp.y + vp.h, x + s.vp_offset_x + w > mx && (x = px ? px - w : Math.max(0, mx - s.vp_offset_x - w)), 
                y + s.vp_offset_y + h > vp) && (y = py ? py - h - 8 : Math.max(0, vp - s.vp_offset_y - h)), 
                DOM.setStyles(co, {
                    left: x,
                    top: y
                }), self.isMenuVisible = 1, self.mouseClickFunc = Event.add(co, "click", function(e) {
                    var n = e.target;
                    return "INPUT" != n.nodeName && "TEXTAREA" != n.nodeName && (n = n && DOM.getParent(n, ".mceMenuItem")) && !DOM.hasClass(n, cp + "ItemSub") ? ((n = self.items[n.id]) && !n.isDisabled() && (n.settings.onAction && n.settings.onAction(e), 
                    n.settings.onclick && (n.settings.onclick(e), self.close()), 
                    self.clearFilterInput()), !1) : void 0;
                }), self.mouseOverFunc = Event.add(co, "mouseover", function(e) {
                    var m, n = e.target;
                    if (n = n && DOM.getParent(n, ".mceMenuItem")) {
                        if (m = self.items[n.id], self.hasMenus()) {
                            if (self.lastMenu && self.lastMenu.collapse(1), m.isDisabled()) return;
                            n && DOM.hasClass(n, cp + "ItemSub") && (n = DOM.getRect(n), 
                            m.showMenu(+(n.x + n.w), +n.y, n.x), self.lastMenu = m);
                        }
                        m.settings.onmouseover && m.settings.onmouseover(e);
                    }
                }), Event.add(co, "keydown", self._keyDownHandler, self), s.filter && Event.add(co, "keyup", self._keyUpHandler, self), 
                self.onShowMenu.dispatch(self), each(self.items, function(o) {
                    o.selected && -1 === tinymce.inArray(self.selected, o) && self.selected.push(o);
                }), self.selected.length ? (px = DOM.get(self.selected[0].id), self.scrollTo(px)) : DOM.get("menu_" + self.id + "_items").scrollTop = 0, 
                s.keyboard_focus && self._setupKeyboardNav(), s.filter) && (mx = DOM.select("input", "menu_" + self.id + "_filter_input")) && mx[0].focus());
            },
            hideMenu: function(c) {
                var co = DOM.get("menu_" + this.id);
                this.isMenuVisible && (this.settings.filter && this.clearFilterInput(!0), 
                Event.remove(co, "click", this.mouseClickFunc), Event.remove(co, "keydown", this._keyDownHandler), 
                Event.remove(co, "keyup", this._keyUpHandler), DOM.hide(co), this.isMenuVisible = 0, 
                c || this.collapse(1), (co = DOM.get("menu_" + this.id)) && DOM.removeClass(co.firstChild, this.classPrefix + "ItemActive"), 
                this.onHideMenu.dispatch(this));
            },
            add: function(o) {
                var co;
                return o = this._super(o), this.isRendered && (co = DOM.get("menu_" + this.id + "_items")) && this._add(co, o), 
                o;
            },
            collapse: function(d) {
                this._super(d), this.hideMenu(1);
            },
            close: function() {
                for (var dm = this; dm; ) dm.hideMenu && dm.hideMenu(), dm = dm.settings.parent;
            },
            remove: function(o) {
                return DOM.remove(o.id), this.destroy(), this._super(o);
            },
            destroy: function() {
                var co = DOM.get("menu_" + this.id);
                this.keyboardNav && this.keyboardNav.destroy(), Event.remove(co, "mouseover", this.mouseOverFunc), 
                Event.remove(DOM.select("a", co), "focus", this.mouseOverFunc), 
                Event.remove(co, "click", this.mouseClickFunc), Event.remove(co, "keyup", this._keyUpHandler), 
                Event.remove(co, "keydown", this._keyDownHandler), DOM.remove(co);
            },
            renderNode: function() {
                var items, filterInput, self = this, s = self.settings, menu = DOM.create("div", {
                    role: "menu",
                    id: "menu_" + self.id,
                    class: s.class + " " + self.classPrefix
                });
                return self.settings.parent && DOM.setAttrib(menu, "aria-parent", self.settings.parent.id), 
                s.filter && (s = DOM.add(menu, "div", {
                    id: "menu_" + self.id + "_filter",
                    class: self.classPrefix + "Filter"
                }, ""), filterInput = DOM.add(s, "div", {
                    id: "menu_" + self.id + "_filter_input",
                    class: self.classPrefix + "FilterInput"
                }, '<input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="..." />'), 
                self.onHideMenu.add(function() {
                    filterInput.firstChild.value = "";
                })), items = DOM.add(menu, "div", {
                    role: "presentation",
                    id: "menu_" + self.id + "_items",
                    class: self.classPrefix + "Items"
                }), each(self.items, function(o) {
                    self._add(items, o);
                }), self.rendered = !0, menu;
            },
            selectAndClear: function(value) {
                this.settings.onselect(value), this.clearFilterInput();
            },
            _setupKeyboardNav: function() {
                var self = this, contextMenu = DOM.get("menu_" + self.id), menuItems = DOM.select('div[role="option"]', "menu_" + self.id);
                menuItems.splice(0, 0, contextMenu), self.keyboardNav = new tinymce.ui.KeyboardNavigation({
                    root: "menu_" + self.id,
                    items: menuItems,
                    onCancel: function() {
                        self.hideMenu();
                    },
                    onAction: function(e, id) {
                        var val, item;
                        1 < menuItems.length ? e.target && "INPUT" === e.target.nodeName && ("" !== (val = e.target.value) && ((item = self.findItem(val)) ? id = item.id : (id = DOM.uniqueId(), 
                        item = self.add({
                            id: id,
                            role: "option",
                            title: val,
                            onclick: function() {
                                self.selectAndClear(this.settings.value);
                            }
                        }))), e.target.value = "") : (self.settings.onselect && self.settings.onselect(e.target), 
                        self.hideMenu()), (item = item || self.items[id]) && item.settings.value && self.selectAndClear(item.settings.value);
                    },
                    enableUpDown: !0
                }), contextMenu.focus();
            },
            _updateKeyboardNav: function() {
                var items = DOM.select('div[role="option"]:not(.mceMenuItemHidden)', this.id + "");
                this.keyboardNav.update(items);
            },
            clearFilteredItems: function() {
                each(this.items, function(o, id) {
                    DOM.removeClass(id, "mceMenuItemHidden");
                }), this.keyboardNav && this._updateKeyboardNav();
            },
            filterItems: function(value) {
                var matcher;
                "" === value ? this.clearFilteredItems() : (matcher = new RegExp("^" + value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), "i"), 
                each(this.items, function(o, id) {
                    o = o.settings, (o = !value || void 0 === value || matcher.test(o.title)) ? DOM.removeClass(id, "mceMenuItemHidden") : DOM.addClass(id, "mceMenuItemHidden");
                }), this._updateKeyboardNav());
            },
            _keyDownHandler: function(evt) {
                var nodes, endIndex, tabIndex;
                9 == evt.keyCode && (nodes = DOM.select("input, button, select, textarea", DOM.get("menu_" + this.id)), 
                (nodes = tinymce.grep(nodes, function(node) {
                    return !node.disabled && !DOM.isHidden(node) && 0 <= node.getAttribute("tabindex");
                })).length) && (DOM.setAttrib(nodes, "tabindex", 0), evt.shiftKey && nodes.reverse(), 
                endIndex = Math.max(0, nodes.length - 1), tabIndex = function(nodes, node) {
                    for (var i = 0; i < nodes.length; i++) if (nodes[i] === node) return i;
                    return -1;
                }(nodes, evt.target), tabIndex++, nodes[tabIndex = endIndex < (tabIndex = Math.max(tabIndex, 0)) ? 0 : tabIndex].focus(), 
                DOM.setAttrib(nodes[tabIndex], "tabindex", 1), evt.preventDefault(), 
                evt.stopImmediatePropagation());
            },
            _keyUpHandler: function(evt) {
                var input, self = this;
                evt.target && "INPUT" === evt.target.nodeName && (input = evt.target, 
                setTimeout(function() {
                    var item;
                    32 === evt.keyCode && ((item = self.findItem(input.value)) && self.selectItem(item), 
                    input.value = ""), specialKeyCodeMap[evt.keyCode] || self.filterItems(input.value), 
                    self.onFilterInput.dispatch(self, evt);
                }, 0));
            },
            _add: function(menu, o) {
                var icon, s = o.settings, cp = this.classPrefix;
                s.separator ? DOM.add(menu, "div", {
                    id: o.id,
                    class: cp + "Item " + cp + "ItemSeparator"
                }) : (menu = DOM.add(menu, "div", {
                    id: o.id,
                    class: cp + "Item " + cp + "ItemEnabled",
                    title: o.settings.title || "",
                    "aria-label": o.settings.title || ""
                }), s.html ? (DOM.addClass(menu, "mceMenuHtml"), DOM.setHTML(menu, s.html)) : (DOM.setAttrib(menu, "role", "option"), 
                !s.icon && !s.icon_src || s.svg || s.image || (icon = DOM.add(menu, "span", {
                    class: "mceIcon" + (s.icon ? " mce_" + s.icon : "")
                }), s.icon_src && DOM.add(icon, "img", {
                    src: s.icon_src
                }), DOM.addClass(menu, "mceHasIcon")), s.image && DOM.add(menu, "span", {
                    class: "mceImage",
                    style: 'background-image:url("' + s.image + '")'
                }), s.svg && DOM.add(menu, "span", {
                    class: "mceIcon mceIconSvg"
                }, s.svg), icon = DOM.add(menu, s.element || "span", {
                    class: "mceText",
                    role: "presentation"
                }, o.settings.title), o.settings.style && ("function" == typeof o.settings.style && (o.settings.style = o.settings.style()), 
                DOM.setAttrib(icon, "style", o.settings.style)), s.parent && (DOM.setAttrib(icon, "aria-haspopup", "true"), 
                DOM.setAttrib(icon, "aria-owns", o.id))), DOM.addClass(menu, s.class), 
                o.onmouseover && Event.add(menu, "mouseover", o.onmouseover), o.collapse && DOM.addClass(menu, cp + "ItemSub"));
            }
        });
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, Event = tinymce.dom.Event, Dispatcher = tinymce.util.Dispatcher;
        tinymce.create("tinymce.ui.Button:tinymce.ui.Control", {
            Button: function(id, s, ed) {
                this._super(id, s, ed), this.classPrefix = "mceButton", this.onPostRender = new Dispatcher(this);
            },
            renderHTML: function() {
                var cp = this.classPrefix, s = this.settings, l = DOM.encode(s.label || ""), h = '<button type="button" id="' + this.id + '" class="' + cp + " " + s.class + (l ? " " + cp + "Labeled" : "") + '" title="' + DOM.encode(s.title) + '" aria-label="' + DOM.encode(s.title) + '">';
                return s.class && (s.class = " " + tinymce.trim(s.class)), s.icon = s.icon || "", 
                s.image ? h += '<span role="presentation" class="mceIcon mceIconImage' + s.class + '"><img class="mceIcon" src="' + s.image + '" alt="' + DOM.encode(s.title) + '" /></span>' + (l ? '<span class="' + cp + 'Label">' + l + "</span>" : "") : (s.icon && (s.icon = " mce_" + s.icon), 
                h += '<span role="presentation" class="mceIcon' + s.class + s.icon + '"></span>' + (l ? '<span class="' + cp + 'Label">' + l + "</span>" : "")), 
                h + "</button>";
            },
            postRender: function() {
                var imgBookmark, self = this, s = self.settings;
                tinymce.isIE && self.editor && Event.add(self.id, "mousedown", function() {
                    var nodeName = self.editor.selection.getNode().nodeName;
                    imgBookmark = "IMG" === nodeName ? self.editor.selection.getBookmark() : null;
                }), Event.add(self.id, "click", function(e) {
                    if (Event.cancel(e), !self.isDisabled()) return tinymce.isIE && self.editor && null !== imgBookmark && self.editor.selection.moveToBookmark(imgBookmark), 
                    s.onclick.call(s.scope, e);
                }), Event.add(self.id, "keydown", function(e) {
                    if (!self.isDisabled() && e.keyCode == tinymce.VK.SPACEBAR) return Event.cancel(e), 
                    s.onclick.call(s.scope, e);
                }), this.rendered = !0, this.onPostRender.dispatch(this, DOM.get(this.id));
            }
        });
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each, Dispatcher = tinymce.util.Dispatcher, specialKeyCodeMap = {
            9: "tab",
            17: "ctrl",
            18: "alt",
            27: "esc",
            37: "left",
            39: "right",
            13: "enter",
            91: "cmd",
            38: "up",
            40: "down"
        };
        tinymce.create("tinymce.ui.ListBox:tinymce.ui.Control", {
            ListBox: function(id, s, ed) {
                this._super(id, s, ed), this.items = s.items || [], this.onChange = new Dispatcher(this), 
                this.onPostRender = new Dispatcher(this), this.onAdd = new Dispatcher(this), 
                this.onBeforeRenderMenu = new Dispatcher(this), this.onRenderMenu = new Dispatcher(this), 
                this.classPrefix = "mceListBox";
            },
            deselectAll: function() {
                each(this.items, function(item) {
                    item.selected = !1;
                }), this.menu && this.menu.deselectAll();
            },
            select: function(values) {
                var fv, self = this;
                return null == values ? this.selectByIndex(-1) : values.length ? (this.settings.multiple || this.deselectAll(), 
                void ("function" == typeof values ? (each(self.items, function(item, i) {
                    values(item.value) && (self.selectByIndex(i), fv = !0);
                }), fv || self.selectByIndex(-1)) : (tinymce.is(values, "string") && (values = self.settings.multiple && self.settings.seperator ? values.split(self.settings.seperator) : [ values ]), 
                each(values, function(value) {
                    var i = self.findItem(value);
                    -1 == i && self.settings.combobox && (i = self.add(value, value)), 
                    self.selectByIndex(i);
                }), this.settings.combobox && (this.clearComboBox(!0), this.settings.multiple) && each(this.items, function(item) {
                    item.selected && self.addTag(item.value);
                })))) : (this.deselectAll(), this.selectByIndex(-1));
            },
            value: function(val) {
                if (!arguments.length) return val = [], each(this.items, function(item) {
                    item.selected && val.push(item.value);
                }), val.join(" ").trim();
                this.select(val);
            },
            selectByIndex: function(idx) {
                var elm = DOM.get(this.id + "_text");
                (idx = this.items[idx]) ? (idx.selected = !idx.selected, idx.selected ? this.selectedValue = idx.value : this.selectedValue = null, 
                this.settings.combobox || (DOM.setHTML(elm, DOM.encode(idx.title)), 
                DOM.removeClass(elm, "mceTitle"), DOM.setAttrib(this.id, "aria-valuenow", idx.title)), 
                this.menu && this.menu.selectItem(this.menu.items[idx.id], idx.selected)) : (DOM.setHTML(elm, DOM.encode(this.settings.title)), 
                DOM.addClass(elm, "mceTitle"), this.selectedValue = null, DOM.setAttrib(this.id, "aria-valuenow", this.settings.title), 
                this.settings.multiple && this.deselectAll());
            },
            add: function(name, value, settings) {
                if (settings = settings || {}, -1 == this.findItem(value)) return settings = tinymce.extend(settings, {
                    title: name,
                    value: value
                }), name = this.items.push(settings), this.onAdd.dispatch(this, settings), 
                name - 1;
            },
            findItem: function(value) {
                for (var idx = -1, i = 0, len = this.items.length; i < len; i++) this.items[i].value === value && (idx = i);
                return idx;
            },
            getLength: function() {
                return this.items.length;
            },
            renderHTML: function() {
                var inp, html = "", prefix = this.classPrefix;
                return this.settings.combobox ? (inp = DOM.createHTML("input", {
                    type: "text",
                    id: this.id + "_input",
                    tabindex: -1,
                    autocomplete: "off",
                    spellcheck: !1,
                    autocapitalize: "off",
                    class: "mceText",
                    placeholder: "..."
                }), html += DOM.createHTML("div", {
                    class: "mceComboBox"
                }, inp)) : html += DOM.createHTML("button", {
                    type: "button",
                    id: this.id + "_text",
                    tabindex: -1,
                    class: "mceText"
                }, DOM.encode(this.settings.title)), html += DOM.createHTML("button", {
                    type: "button",
                    id: this.id + "_open",
                    tabindex: -1,
                    class: "mceOpen"
                }), DOM.createHTML("div", {
                    id: this.id,
                    role: this.settings.combobox ? "combobox" : "listbox",
                    tabindex: 0,
                    class: prefix + " " + this.settings.class,
                    title: this.settings.title,
                    "aria-label": this.settings.title,
                    "aria-haspopup": "true",
                    "aria-expanded": !1
                }, html);
            },
            clearComboBox: function(removetags) {
                var input = DOM.get(this.id + "_input");
                input.value = "", input.focus(), removetags && DOM.remove(DOM.select(".mceButtonTag", this.id));
            },
            removeTag: function(btn) {
                var self = this;
                each(self.items, function(item, i) {
                    item.value === btn.value && (item.selected = !1, self.selectedValue == item.value) && (self.selectedValue = null);
                }), Event.clear(btn), DOM.remove(btn);
            },
            addTag: function(value) {
                var self = this, inp = DOM.get(self.id + "_input"), btn = DOM.create("button", {
                    class: "mceButton mceButtonTag",
                    value: value
                }, "<label>" + value + "</label>");
                DOM.insertBefore(btn, inp), Event.add(btn, "click", function(evt) {
                    evt.preventDefault(), "LABEL" != evt.target.nodeName && self.removeTag(btn);
                });
            },
            showMenu: function() {
                var pos, menu, self = this, elm = DOM.get(this.id);
                this.isDisabled() || (this.isMenuRendered || (this.renderMenu(), 
                this.isMenuRendered = !0), 0 !== this.items.length && (pos = DOM.getPos(elm), 
                (menu = this.menu).settings.offset_x = pos.x, menu.settings.offset_y = pos.y, 
                this.settings.max_width || (menu.settings.max_width = elm.offsetWidth), 
                each(this.items, function(item) {
                    menu.items[item.id] && (menu.items[item.id].setSelected(0), 
                    item.value !== self.selectedValue && !item.selected || menu.items[item.id].setSelected(1));
                }), menu.showMenu(0, elm.clientHeight, 0, pos.y), Event.add(DOM.doc, "mousedown", this.hideMenu, this), 
                DOM.addClass(this.id, this.classPrefix + "Selected"), this.setAriaProperty("expanded", !0)));
            },
            hideMenu: function(e) {
                this.menu && (!e || "mousedown" != e.type || e.target.id != this.id + "_text" && e.target.id != this.id + "_open") && (e && DOM.getParent(e.target, ".mceMenu") || (DOM.removeClass(this.id, this.classPrefix + "Selected"), 
                Event.remove(DOM.doc, "mousedown", this.hideMenu, this), this.menu.hideMenu()), 
                this.setAriaProperty("expanded", !1));
            },
            renderMenu: function() {
                var self = this, menu = this.settings.control_manager.createDropMenu(this.id + "_menu", {
                    class: this.classPrefix + "Menu",
                    max_width: this.settings.max_width || 250,
                    max_height: this.settings.max_height || "",
                    filter: !!this.settings.filter,
                    keyboard_focus: !0,
                    onselect: function(value) {
                        !1 !== self.settings.onselect(value) && (self.select(value), 
                        menu.close());
                    }
                });
                menu.onHideMenu.add(function() {
                    self.hideMenu(), self.settings.combobox && (menu.clearFilteredItems(), 
                    self.focus());
                }), this.onBeforeRenderMenu.dispatch(this, menu), each(this.items, function(item) {
                    void 0 === item.value ? menu.add({
                        title: item.title,
                        role: "option",
                        onAction: function(e) {
                            !1 !== self.settings.onselect("") && self.select(""), 
                            menu.close();
                        }
                    }) : (item.id = DOM.uniqueId(), item.role = "option", item.onAction = function(e) {
                        !1 !== self.settings.onselect(item.value) && self.select(item.value), 
                        self.settings.multiple || self.settings.keepopen || menu.close();
                    }, menu.add(item));
                }), this.onRenderMenu.dispatch(this, menu), this.menu = menu;
            },
            postRender: function() {
                var self = this;
                self.destroy(), Event.add(this.id, "click", function(evt) {
                    "INPUT" == evt.target.nodeName || DOM.hasClass(evt.target, "mceButtonTag") || (self.menu && self.menu.isMenuVisible ? self.hideMenu(evt) : self.showMenu(evt), 
                    Event.cancel(evt));
                }), Event.add(this.id, "keydown", function(evt) {
                    "INPUT" !== evt.target.nodeName && 32 == evt.keyCode && (self.menu && self.menu.isMenuVisible ? self.hideMenu(evt) : self.showMenu(evt), 
                    Event.cancel(evt));
                }), Event.add(this.id + "_input", "keyup", function(evt) {
                    setTimeout(function() {
                        var value = evt.target.value;
                        value ? specialKeyCodeMap[evt.keyCode] || (self.menu && self.menu.isMenuVisible || self.showMenu(), 
                        evt.target.focus(), self.menu.filterItems(value)) : (Event.cancel(evt), 
                        self.hideMenu());
                    }, 0);
                }), Event.add(this.id + "_input", "keydown", function(evt) {
                    switch (evt.keyCode) {
                      case 13:
                        Event.cancel(evt), "" === this.value ? self.showMenu() : (!1 !== self.settings.onselect(this.value) && self.select(this.value), 
                        self.hideMenu(), this.value = "");
                        break;

                      case 40:
                      case 38:
                        self.showMenu(), Event.cancel(evt), self.menu.focus();
                        break;

                      case 8:
                        var tags, val;
                        this.value || (tags = DOM.select("button", evt.target.parentNode)).length && (val = (tags = tags.pop()).value, 
                        self.removeTag(tags), Event.cancel(evt), this.value = val, 
                        this.focus());
                    }
                }), Event.add(this.id, "focus", function() {
                    this._focused || (this.keyDownHandler = Event.add(this.id, "keydown", function(e) {
                        40 == e.keyCode && (self.showMenu(), Event.cancel(e));
                    }), this.keyPressHandler = Event.add(this.id, "keypress", function(e) {
                        var value;
                        13 == e.keyCode && (value = self.selectedValue, self.selectedValue = null, 
                        Event.cancel(e), self.settings.onselect(value));
                    })), this._focused = 1;
                }), Event.add(this.id, "blur", function() {
                    Event.remove(this.id, "keydown", this.keyDownHandler), Event.remove(this.id, "keypress", this.keyPressHandler), 
                    this._focused = 0;
                }), this.onPostRender.dispatch(this, DOM.get(this.id)), this.rendered = !0;
            },
            destroy: function() {
                this._super(), Event.clear(this.id + "_text"), Event.clear(this.id + "_open"), 
                each(this.items, function(item) {
                    item.selected = !1;
                }), this.selectedValue = null;
            }
        });
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each;
        tinymce.create("tinymce.ui.NativeListBox:tinymce.ui.ListBox", {
            NativeListBox: function(id, settings) {
                this._super(id, settings);
            },
            setDisabled: function(settings) {
                DOM.get(this.id).disabled = settings, this.setAriaProperty("disabled", settings);
            },
            isDisabled: function() {
                return DOM.get(this.id).disabled;
            },
            select: function(value) {
                var fv, fn, self = this;
                if (null == value) return this.selectByIndex(-1);
                fn = value && "function" == typeof value ? value : function(val) {
                    return val == value;
                }, value != this.selectedValue && (each(this.items, function(o, i) {
                    if (fn(o.value)) return fv = 1, self.selectByIndex(i), !1;
                }), fv || this.selectByIndex(-1));
            },
            selectByIndex: function(idx) {
                DOM.get(this.id).selectedIndex = idx + 1, this.selectedValue = this.items[idx] ? this.items[idx].value : null;
            },
            add: function(name, value, attribs) {
                (attribs = attribs || {}).value = value, this.isRendered() && DOM.add(DOM.get(this.id), "option", attribs, name), 
                this.items.push(name = {
                    title: name,
                    value: value,
                    attribs: attribs
                }), this.onAdd.dispatch(this, name);
            },
            getLength: function() {
                return this.items.length;
            },
            renderHTML: function() {
                var html = DOM.createHTML("option", {
                    value: ""
                }, "-- " + this.settings.title + " --");
                return each(this.items, function(item) {
                    html += DOM.createHTML("option", {
                        value: item.value
                    }, item.title);
                }), html = DOM.createHTML("select", {
                    id: this.id,
                    class: "mceNativeListBox",
                    "aria-labelledby": this.id + "_aria"
                }, html), html += DOM.createHTML("span", {
                    id: this.id + "_aria",
                    style: "display: none"
                }, this.settings.title);
            },
            postRender: function() {
                var self = this, changeListenerAdded = !0;
                function onChange(e) {
                    (e = (e = self.items[e.target.selectedIndex - 1]) && e.value) && (self.onChange.dispatch(self, e), 
                    self.settings.onselect) && self.settings.onselect(e);
                }
                this.rendered = !0, Event.add(this.id, "change", onChange), Event.add(this.id, "keydown", function(e) {
                    var blur;
                    if (Event.remove(self.id, "change", void 0), changeListenerAdded = !1, 
                    blur = Event.add(this.id, "blur", function() {
                        changeListenerAdded || (changeListenerAdded = !0, Event.add(self.id, "change", onChange), 
                        Event.remove(self.id, "blur", blur));
                    }), 13 == e.keyCode || 32 == e.keyCode) return onChange(e), 
                    Event.cancel(e);
                    40 != e.keyCode && 38 != e.keyCode || e.stopImmediatePropagation();
                }), this.onPostRender.dispatch(this, DOM.get(this.id));
            }
        });
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, Event = tinymce.dom.Event, Dispatcher = tinymce.util.Dispatcher;
        tinymce.create("tinymce.ui.TextBox:tinymce.ui.Control", {
            TextBox: function(id, s, ed) {
                s = tinymce.extend({
                    class: "",
                    title: ""
                }, s), this._super(id, s, ed), this.onChange = new Dispatcher(this), 
                this.onPostRender = new Dispatcher(this), this.classPrefix = "mceTextBox";
            },
            value: function(val) {
                if (!arguments.length) return DOM.getValue(this.id);
                DOM.setValue(this.id, val);
            },
            renderHTML: function() {
                var html = "", prefix = this.classPrefix, s = this.settings, prefix = {
                    type: s.subtype || "text",
                    id: this.id,
                    class: prefix + " " + s.class,
                    title: DOM.encode(s.title),
                    tabindex: 0,
                    autofocus: !0
                }, prefix = tinymce.extend(prefix, s.attributes || {});
                return s.multiline ? html += DOM.createHTML("textarea", prefix) : html += DOM.createHTML("input", prefix), 
                s.button && (html += DOM.createHTML("button", {
                    id: this.id + "_button",
                    class: "mceButton",
                    title: DOM.encode(s.button.label || "")
                }, '<span role="presentation" class="mceIcon mce_' + s.button.icon + '"></span>')), 
                html;
            },
            postRender: function() {
                var self = this, s = this.settings;
                void 0 !== s.value && this.value(s.value), s.onchange && "function" == typeof s.onchange && this.onChange.add(s.onchange), 
                Event.add(this.id, "change", function() {
                    self.onChange.dispatch(this, DOM.get(self.id));
                }), s.button && Event.add(this.id + "_button", "click", function(e) {
                    e.preventDefault(), s.button.click.apply(self);
                }), this.onPostRender.dispatch(this, DOM.get(this.id));
            },
            setDisabled: function(state) {
                this._super(state), DOM.get(this.id).disabled = state;
            },
            destroy: function() {
                this._super(), Event.clear(this.id);
            }
        });
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, Event = tinymce.dom.Event;
        tinymce.create("tinymce.ui.UrlBox:tinymce.ui.TextBox", {
            UrlBox: function(id, s, ed) {
                s.multiline = !1, s.onpick = s.onpick || function() {}, s.class = "mceUrlBox", 
                this._super(id, s, ed);
            },
            renderHTML: function() {
                var icon, html = this._super(), s = this.settings;
                return s.picker && (icon = s.picker_icon || "file", html += '<button type="button" class="mceButton mceButtonPicker" id="' + this.id + '_picker" title="' + DOM.encode(s.picker_label || "") + '"><span role="presentation" class="mceIcon mce_' + icon + '"></span></button>'), 
                s.upload && (icon = tinymce.map(s.upload_accept || [], function(val) {
                    return -1 == val.indexOf("/") && "." != val.charAt(0) ? "." + val : val;
                }), html += '<a class="mceButton mceButtonUpload" role="button" aria-label="' + DOM.encode(s.upload_label || "") + '"><span role="presentation" class="mceIcon mce_upload"></span><span role="presentation" class="mceIcon mce_spinner"></span><input id="' + this.id + '_upload" type="file" aria-hidden="true" title="' + DOM.encode(s.upload_label || "") + '" accept="' + icon.join(",") + '" /></a>'), 
                html;
            },
            setLoading: function(state) {
                this.setAriaProperty("busy", state), this.setDisabled(state);
            },
            setDisabled: function(state) {
                this._super(state), DOM.get(this.id + "_upload").disabled = state;
            },
            postRender: function() {
                var self = this, s = this.settings;
                this._super(), s.picker && (DOM.addClass(this.id, "mceUrlBoxPicker"), 
                Event.add(this.id + "_picker", "click", function(e) {
                    e.preventDefault(), s.onpick.call(self);
                })), s.upload && (DOM.addClass(this.id, "mceUrlBoxUpload"), Event.add(this.id + "_upload", "change", function(e) {
                    this.files && this.files.length && s.upload.call(self, e, this.files[0]), 
                    e.preventDefault();
                }), DOM.bind(this.id, "drag dragstart dragend dragover dragenter dragleave", function(e) {
                    e.preventDefault();
                }), DOM.bind(this.id, "dragover dragenter", function() {
                    DOM.addClass(this.id, "mceUrlBoxUploadHover");
                }), DOM.bind(this.id, "dragleave", function() {
                    DOM.removeClass(this.id, "mceUrlBoxUploadHover");
                }), DOM.bind(this.id, "drop", function(e) {
                    var dataTransfer = e.dataTransfer;
                    dataTransfer && dataTransfer.files && dataTransfer.files.length && (dataTransfer = dataTransfer.files[0]) && s.upload.call(self, e, dataTransfer), 
                    e.preventDefault();
                }));
            }
        });
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each, Dispatcher = tinymce.util.Dispatcher;
        tinymce.create("tinymce.ui.CheckBox:tinymce.ui.Control", {
            CheckBox: function(id, s, ed) {
                this._super(id, s, ed), void 0 === s.value && (s.value = ""), this.onChange = new Dispatcher(this), 
                this.onPostRender = new Dispatcher(this), this.classPrefix = "mceCheckBox";
            },
            value: function(val) {
                var elm = DOM.get(this.id);
                if (!arguments.length) return elm.checked ? elm.value || 1 : "";
                elm.value = val;
            },
            checked: function(state) {
                var elm = DOM.get(this.id);
                if (!arguments.length) return elm.checked;
                this.isDisabled() || (this.setState("checked", !!state), elm.checked = !!state);
            },
            renderHTML: function() {
                var html = "", prefix = this.classPrefix, s = this.settings;
                return html += '<input type="checkbox" id="' + this.id + '" value="' + s.value + '" class="' + prefix + " " + s.class + '" title="' + DOM.encode(s.title) + '"', 
                s.attributes && each(s.attributes, function(val, key) {
                    html += " " + key + '="' + val + '"';
                }), html += " />";
            },
            postRender: function() {
                var self = this, s = this.settings;
                s.onchange && "function" == typeof s.onchange && this.onChange.add(s.onchange), 
                Event.add(this.id, "click", function() {
                    self.checked(self.checked());
                }), Event.add(this.id, "change", function() {
                    self.onChange.dispatch(this, DOM.get(self.id));
                }), this.onPostRender.dispatch(this, DOM.get(this.id));
            },
            setDisabled: function(state) {
                this._super(state), DOM.get(this.id).disabled = state;
            },
            destroy: function() {
                this._super(), Event.clear(this.id);
            }
        });
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, Event = tinymce.dom.Event;
        tinymce.create("tinymce.ui.MenuButton:tinymce.ui.Button", {
            MenuButton: function(id, s, ed) {
                this._super(id, s, ed), this.onRenderMenu = new tinymce.util.Dispatcher(this), 
                s.menu_container = s.menu_container || DOM.doc.body;
            },
            showMenu: function() {
                var pos, m, e = DOM.get(this.id);
                if (!this.isDisabled()) {
                    if (this.isMenuRendered || (this.renderMenu(), this.isMenuRendered = !0), 
                    this.isMenuVisible) return this.hideMenu();
                    pos = DOM.getPos(e), (m = this.menu).settings.offset_x = pos.x, 
                    m.settings.offset_y = pos.y, m.settings.vp_offset_x = pos.x, 
                    m.settings.vp_offset_y = pos.y, m.settings.keyboard_focus = this._focused, 
                    m.showMenu(0, e.firstChild.clientHeight), Event.add(DOM.doc, "mousedown", this.hideMenu, this), 
                    this.setState("Selected", 1), this.isMenuVisible = 1, this.setAriaProperty("expanded", !0);
                }
            },
            renderMenu: function() {
                var self = this, m = self.settings.control_manager.createDropMenu(self.id + "_menu", {
                    class: this.classPrefix + "Menu",
                    icons: self.settings.icons,
                    max_width: this.settings.max_width,
                    max_height: this.settings.max_height,
                    keyboard_focus: !0,
                    onselect: this.settings.onselect,
                    title: this.settings.title
                });
                m.onHideMenu.add(function() {
                    self.hideMenu(), self.focus();
                }), self.onRenderMenu.dispatch(self, m), self.menu = m;
            },
            hideMenu: function(e) {
                var self = this;
                e && "mousedown" == e.type && DOM.getParent(e.target, function(e) {
                    return e.id === self.id || e.id === self.id + "_open";
                }) || (e && DOM.getParent(e.target, ".mceMenu") || (self.setState("Selected", 0), 
                Event.remove(DOM.doc, "mousedown", self.hideMenu, self), self.menu && self.menu.hideMenu()), 
                self.isMenuVisible = 0, self.setAriaProperty("expanded", !1));
            },
            postRender: function() {
                var self = this, s = self.settings;
                this._super(), Event.add(self.id, "click", function() {
                    self.isDisabled() || (s.onclick && s.onclick(self.value), self.showMenu());
                });
            }
        });
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, Event = tinymce.dom.Event;
        tinymce.create("tinymce.ui.SplitButton:tinymce.ui.MenuButton", {
            SplitButton: function(id, s, ed) {
                this._super(id, s, ed), this.classPrefix = "mceSplitButton";
            },
            renderHTML: function() {
                var html = "", s = this.settings, icon = s.image ? DOM.createHTML("img ", {
                    src: s.image,
                    role: "presentation",
                    class: "mceAction " + s.class
                }) : DOM.createHTML("span", {
                    class: "mceAction " + s.class,
                    role: "presentation"
                }), html = (html += DOM.createHTML("button", {
                    type: "button",
                    id: this.id + "_action",
                    tabindex: "-1",
                    class: "mceText " + s.class,
                    title: s.title
                }, icon)) + DOM.createHTML("button", {
                    type: "button",
                    id: this.id + "_open",
                    tabindex: "-1",
                    class: "mceOpen " + s.class,
                    title: s.title
                });
                return DOM.createHTML("div", {
                    id: this.id,
                    role: "button",
                    tabindex: 0,
                    class: "mceSplitButton " + s.class,
                    title: s.title,
                    "aria-label": s.title,
                    "aria-haspopup": "true",
                    "aria-expanded": !1
                }, html);
            },
            postRender: function() {
                var activate, self = this, s = self.settings;
                s.onclick ? (Event.add(self.id + "_action", "click", activate = function(evt) {
                    self.isDisabled() || (s.onclick(self.value), Event.cancel(evt), 
                    self.hideMenu());
                }), Event.add(self.id, [ "click", "keydown" ], function(evt) {
                    32 !== evt.keyCode && 13 !== evt.keyCode && 14 !== evt.keyCode || evt.altKey || evt.ctrlKey || evt.metaKey ? "click" !== evt.type && 40 !== evt.keyCode || (self.showMenu(), 
                    Event.cancel(evt)) : (activate(), Event.cancel(evt));
                })) : Event.add(self.id + "_action", "click", function(evt) {
                    self.showMenu(), Event.cancel(evt);
                }), Event.add(self.id + "_open", "click", function(evt) {
                    self.showMenu(), Event.cancel(evt);
                }), Event.add([ self.id, self.id + "_open" ], "focus", function() {
                    self._focused = 1;
                }), Event.add([ self.id, self.id + "_open" ], "blur", function() {
                    self._focused = 0;
                }), this.rendered = !0;
            },
            destroy: function() {
                this._super(), Event.clear(this.id + "_action"), Event.clear(this.id + "_open"), 
                Event.clear(this.id);
            }
        });
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, Event = tinymce.dom.Event, is = tinymce.is, each = tinymce.each;
        tinymce.create("tinymce.ui.ColorSplitButton:tinymce.ui.SplitButton", {
            ColorSplitButton: function(id, settings, editor) {
                this._super(id, settings, editor), this.settings = tinymce.extend({
                    colors: "000000,993300,333300,003300,003366,000080,333399,333333,800000,FF6600,808000,008000,008080,0000FF,666699,808080,FF0000,FF9900,99CC00,339966,33CCCC,3366FF,800080,999999,FF00FF,FFCC00,FFFF00,00FF00,00FFFF,00CCFF,993366,FFFFFF,FF99CC,FFCC99,FFFF99,CCFFCC,CCFFFF,99CCFF,CC99FF",
                    grid_width: 8,
                    default_color: "#888888"
                }, settings || {}), this.onShowMenu = new tinymce.util.Dispatcher(this), 
                this.onHideMenu = new tinymce.util.Dispatcher(this), this.value = settings.default_color;
            },
            showMenu: function() {
                var elm, pos, self = this;
                if (!this.isDisabled()) {
                    if (this.isMenuRendered || (this.renderMenu(), this.isMenuRendered = !0), 
                    this.isMenuVisible) return this.hideMenu();
                    elm = DOM.get(this.id), DOM.show(this.id + "_menu"), DOM.addClass(elm, "mceSplitButtonSelected"), 
                    pos = DOM.getPos(elm), DOM.setStyles(this.id + "_menu", {
                        left: pos.x,
                        top: pos.y + elm.firstChild.clientHeight
                    }), Event.add(DOM.doc, "mousedown", this.hideMenu, this), this.onShowMenu.dispatch(this), 
                    this._focused && (this._keyHandler = Event.add(this.id + "_menu", "keydown", function(e) {
                        27 == e.keyCode && this.hideMenu();
                    }), DOM.select("button", this.id + "_menu")[0].focus()), this.keyboardNav = new tinymce.ui.KeyboardNavigation({
                        root: this.id + "_menu",
                        items: DOM.select("button", this.id + "_menu"),
                        onCancel: function() {
                            self.hideMenu(), self.focus();
                        }
                    }), this.keyboardNav.focus(), this.isMenuVisible = 1;
                }
            },
            hideMenu: function(e) {
                var self = this;
                !this.isMenuVisible || e && "mousedown" == e.type && DOM.getParent(e.target, function(elm) {
                    return elm.id === self.id + "_open";
                }) || (e && DOM.getParent(e.target, ".mceSplitButtonMenu") || (DOM.removeClass(this.id, "mceSplitButtonSelected"), 
                Event.remove(DOM.doc, "mousedown", this.hideMenu, this), Event.remove(this.id + "_menu", "keydown", this._keyHandler), 
                DOM.hide(this.id + "_menu")), this.isMenuVisible = 0, this.onHideMenu.dispatch(), 
                this.keyboardNav.destroy());
            },
            renderMenu: function() {
                var node, self = this, settings = this.settings, list = DOM.add(settings.menu_container, "div", {
                    role: "listbox",
                    id: this.id + "_menu",
                    class: "mceMenu mceSplitButtonMenu " + settings.menu_class
                }), menu = DOM.add(list, "div", {
                    role: "presentation",
                    class: "mceColorSplitMenu " + settings.class
                });
                return each(is(settings.colors, "array") ? settings.colors : settings.colors.split(","), function(color) {
                    var val = "#" + (color = color.replace(/^#/, "")), color = {
                        style: {
                            backgroundColor: val = 0 == color.indexOf("--") ? "var(" + color + ")" : val
                        },
                        title: self.editor.getLang("colors." + color, val),
                        "data-mce-color": val,
                        class: "mceColorButton",
                        role: "option"
                    };
                    node = DOM.add(menu, "button", color);
                }), node = DOM.add(menu, "button", {
                    title: this.editor.getLang("advanced.no_color", "No Colour"),
                    "data-mce-color": "",
                    role: "option",
                    class: "mceRemoveColor"
                }, "&cross;"), settings.more_colors_func && (node = DOM.add(menu, "button", {
                    role: "option",
                    id: this.id + "_more",
                    class: "mceMoreColors"
                }, settings.more_colors_title), Event.add(node, "click", function(e) {
                    return settings.more_colors_func.call(settings.more_colors_scope || self), 
                    self.hideMenu(), Event.cancel(e);
                })), DOM.addClass(menu, "mceColorSplitMenu"), Event.add(this.id + "_menu", "mousedown", function(e) {
                    return Event.cancel(e);
                }), Event.add(this.id + "_menu", "click", function(e) {
                    var color = (e = DOM.getParent(e.target, "button", menu)).getAttribute("data-mce-color");
                    return e && "button" == e.nodeName.toLowerCase() && void 0 !== color && self.setColor(color), 
                    !1;
                }), list;
            },
            setColor: function(color) {
                this.displayColor(color), this.hideMenu(), this.settings.onselect(color);
            },
            displayColor: function(color) {
                DOM.setStyle(this.id + "_preview", "backgroundColor", color), this.value = color;
            },
            postRender: function() {
                this._super(), DOM.add(this.id + "_action", "span", {
                    id: this.id + "_preview",
                    role: "presentation",
                    class: "mceColorPreview"
                }), DOM.setStyle(this.id + "_preview", "backgroundColor", this.value);
            },
            destroy: function() {
                this._super(), Event.clear(this.id + "_menu"), Event.clear(this.id + "_more"), 
                DOM.remove(this.id + "_menu"), this.keyboardNav && this.keyboardNav.destroy();
            }
        });
    }(tinymce), function(tinymce) {
        var dom = tinymce.DOM, each = tinymce.each, Event = tinymce.dom.Event;
        tinymce.create("tinymce.ui.ToolbarGroup:tinymce.ui.Container", {
            renderHTML: function() {
                var html = [], controls = this.controls, controls = ((0, tinymce.each)(controls, function(toolbar) {
                    html.push(toolbar.renderHTML());
                }), dom.create("div", {
                    id: this.id,
                    role: "group",
                    class: this.settings.class ? this.classPrefix + this.settings.class : ""
                }, html.join("")));
                return dom.getOuterHTML(controls);
            },
            focus: function() {
                dom.get(this.id).focus();
            },
            postRender: function() {
                var editor = this.editor, settings = this.settings, id = this.id, items = [];
                each(this.controls, function(toolbar) {
                    each(toolbar.controls, function(control) {
                        control.id && items.push(control);
                    });
                }), this.keyNav = new tinymce.ui.KeyboardNavigation({
                    root: id,
                    items: items,
                    onCancel: function() {
                        tinymce.isWebKit && dom.get(editor.id + "_ifr").focus(), 
                        editor.focus();
                    },
                    excludeFromTabOrder: !settings.tab_focus_toolbar
                });
            },
            destroy: function() {
                this._super(), this.keyNav.destroy(), Event.clear(this.id);
            }
        });
    }(tinymce), function(tinymce) {
        var dom = tinymce.DOM;
        tinymce.create("tinymce.ui.Toolbar:tinymce.ui.Container", {
            renderHTML: function() {
                for (var html = "", settings = this.settings, controls = settings.controls || this.controls, i = 0; i < controls.length; i++) html += controls[i].renderHTML();
                return this.controls = controls, dom.createHTML("div", {
                    id: this.id,
                    class: "mceToolbarRow" + (settings.class ? " " + settings.class : ""),
                    role: "group"
                }, html);
            }
        });
    }(tinymce), function(tinymce) {
        var dom = tinymce.DOM;
        tinymce.create("tinymce.ui.Layout:tinymce.ui.Container", {
            renderHTML: function() {
                for (var html = "", settings = this.settings, controls = settings.controls || this.controls, i = 0; i < controls.length; i++) html += controls[i].renderHTML();
                return this.controls = controls, dom.createHTML("div", {
                    id: this.id,
                    class: "mceFlexLayout " + (settings.class ? " " + settings.class : ""),
                    role: "group"
                }, html);
            }
        });
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each, Dispatcher = tinymce.util.Dispatcher;
        tinymce.create("tinymce.ui.Panel:tinymce.ui.Container", {
            Panel: function(id, s, ed) {
                this._super(id, s, ed), this.settings = s = tinymce.extend({
                    content: "",
                    buttons: []
                }, this.settings), this.editor = ed, this.classPrefix = "mcePanel", 
                this.onRenderPanel = new Dispatcher(this);
            },
            showPanel: function(elm) {
                var x, y, mx, w, vp, panel, self = this, s = this.settings;
                if (this.storeSelection(), self.isPanelRendered || self.renderPanel(), 
                self.isPanelVisible) return self.hidePanel();
                vp = DOM.getViewPort(), (panel = DOM.get(self.id)) && (DOM.show(panel), 
                s.url && (DOM.get(self.id + "_iframe").src = s.url), s = DOM.getPos(elm), 
                w = panel.clientWidth, panel = panel.clientHeight, mx = vp.x + vp.w, 
                vp = vp.y + vp.h, mx < x + w && (x = Math.max(0, mx - w)), vp < y + panel && (y = Math.max(0, vp - panel)), 
                x = s.x, y = s.y, DOM.setStyles(self.id, {
                    left: x,
                    top: y + elm.clientHeight + 5,
                    zIndex: 2e5
                }), self.isPanelVisible = 1, Event.add(DOM.doc, "mousedown", function(e) {
                    DOM.getParents(e.target, ".mcePanel").length || self.hidePanel();
                }));
            },
            storeSelection: function() {
                tinymce.isIE && (this.editor.focus(), this.bookmark = this.editor.selection.getBookmark(1));
            },
            restoreSelection: function() {
                this.bookmark && (this.editor.selection.moveToBookmark(this.bookmark), 
                this.editor.focus()), this.bookmark = 0;
            },
            renderPanel: function() {
                var footer, self = this, s = this.settings, prefix = this.classPrefix, panel = DOM.add(DOM.doc.body, "div", {
                    role: "presentation",
                    id: self.id,
                    class: s.class || "defaultSkin",
                    style: "position:absolute;left:0;top:-1000px;"
                }), panel = DOM.add(panel, "div", {
                    class: prefix
                }), content = DOM.add(panel, "div", {
                    class: prefix + "Content"
                }), html = (s.width && DOM.setStyle(panel, "width", s.width), []), navItems = (s.html && ("string" == typeof s.html ? html.push(s.html) : html.push(DOM.createHTML(s.html))), 
                s.controls && each(s.controls, function(ctrl) {
                    html.push(ctrl.renderHTML()), ctrl.postRender(), setTimeout(function() {
                        ctrl.controls && each(ctrl.controls, function(c) {
                            c.postRender();
                        });
                    }, 0);
                }), DOM.setHTML(content, html.join("")), s.url && DOM.add(content, "iframe", {
                    id: self.id + "_iframe",
                    src: s.url,
                    style: {
                        border: 0,
                        width: "100%",
                        height: "100%"
                    },
                    onload: function() {
                        self.isPanelRendered = !0, self.onRenderPanel.dispatch(self);
                    }
                }), s.buttons.length && (footer = DOM.add(panel, "div", {
                    class: prefix + "Footer"
                }), each(s.buttons, function(o) {
                    var btn = DOM.add(footer, "button", {
                        type: "button",
                        class: "mceButton",
                        id: self.id + "_button_" + o.id
                    }, o.title || "");
                    o.classes && DOM.addClass(btn, o.classes), o.onclick && Event.add(btn, "click", function(e) {
                        e.preventDefault(), self.restoreSelection(), o.onclick.call(o.scope || self, e) && self.hidePanel();
                    });
                })), tinymce.grep(DOM.select("input, select, button, textarea", panel), function(elm) {
                    return 0 <= elm.getAttribute("tabindex") && -1 === elm.className.indexOf("Disabled");
                }));
                return navItems.length && Event.add(panel, "keydown", function(e) {
                    9 === e.keyCode && e.target === navItems[navItems.length - 1] && (e.preventDefault(), 
                    navItems[0].focus());
                }), Event.add(panel, "keyup", function(e) {
                    13 === e.keyCode && self.settings.onsubmit && (e.preventDefault(), 
                    self.settings.onsubmit());
                }), s.url || (self.isPanelRendered = !0, self.onRenderPanel.dispatch(self)), 
                panel;
            },
            hidePanel: function() {
                DOM.hide(this.id), this.isPanelVisible = 0;
            },
            setButtonDisabled: function(button, state) {
                button = this.id + "_button_" + button, state ? DOM.addClass(button, "disabled") : DOM.removeClass(button, "disabled");
            },
            setButtonLabel: function(button, label) {
                DOM.setHTML(this.id + "_button_" + button, label);
            },
            destroy: function() {
                this._super(), Event.clear(this.id), DOM.remove(this.id);
            }
        });
    }(tinymce), function() {
        var DOM = tinymce.DOM, Event = tinymce.dom.Event, Delay = tinymce.util.Delay;
        tinymce.create("tinymce.ui.ContextPanel:tinymce.ui.Panel", {
            ContextPanel: function(id, s, ed) {
                this._super(id, s, ed), this.settings = s = tinymce.extend({
                    content: "",
                    buttons: []
                }, this.settings), this.editor = ed;
            },
            renderPanel: function() {
                var self = this, scrollFunc = (this._super(), DOM.addClass(DOM.select(".mcePanel", DOM.get(this.id)), "mceContextPanel"), 
                Delay.debounce(function() {
                    self.isPanelVisible && self.positionPanel();
                }, 60));
                self.scrollFunc = Event.add(this.editor.getWin(), "scroll", scrollFunc), 
                this.editor.onHide.add(function() {
                    self.hidePanel();
                });
            },
            showPanel: function(elm) {
                this._super(elm), this.target = elm, this.positionPanel();
            },
            positionPanel: function() {
                var pos, elm, offset, win, panel = DOM.get(this.id);
                panel && (elm = this.target, offset = DOM.getRect(this.editor.getContentAreaContainer()), 
                DOM.removeClass(panel, "mceArrowDown"), (pos = DOM.getPos(elm)).y < 0 || (win = (win = this.editor.getWin()).scrollY + win.innerHeight, 
                pos.y > win - elm.clientHeight) ? this.hidePanel() : (DOM.show(panel), 
                this.isPanelVisible = 1, win = pos.x + offset.x + elm.clientWidth / 2, 
                pos = pos.y + offset.y, win -= panel.clientWidth / 2, (pos = pos + elm.clientHeight + 10) > offset.y + offset.h && (pos -= elm.clientHeight + panel.clientHeight + 10, 
                DOM.addClass(panel, "mceArrowDown")), DOM.setStyles(this.id, {
                    left: win,
                    top: pos,
                    zIndex: 2e5
                })));
            },
            destroy: function() {
                Event.remove(this.editor.getWin(), "scroll", self.scrollFunc), this._super();
            }
        });
    }(), function(tinymce) {
        var DOM = tinymce.DOM, Event = tinymce.dom.Event, Dispatcher = tinymce.util.Dispatcher;
        tinymce.create("tinymce.ui.PanelButton:tinymce.ui.Button", {
            PanelButton: function(id, s, ed) {
                this._super(id, s, ed), this.settings = s = tinymce.extend({}, this.settings), 
                this.editor = ed, this.classPrefix = "mcePanelButton", this.onShowPanel = new Dispatcher(this), 
                this.onHidePanel = new Dispatcher(this), this.onRenderPanel = new Dispatcher(this);
            },
            showPanel: function() {
                var elm;
                this.isDisabled() || (elm = DOM.get(this.id), this.panel.showPanel(elm), 
                this.onShowPanel.dispatch(this), this.setState("Selected", 1), this.setAriaProperty("expanded", !0));
            },
            hidePanel: function(e) {
                var self = this;
                !self.panel || e && "mousedown" == e.type && DOM.getParent(e.target, function(e) {
                    return e.id === self.id || e.id === self.id + "_open";
                }) || e && DOM.getParent(e.target, ".mcePanel") || (self.setState("Selected", 0), 
                Event.remove(DOM.doc, "mousedown", self.hidePanel, self), self.panel.hidePanel(), 
                self.onHidePanel.dispatch(self), self.setAriaProperty("expanded", !1));
            },
            postRender: function() {
                var self = this, s = self.settings;
                DOM.addClass(self.id, "mceButton"), Event.add(self.id, "click", function(evt) {
                    self.isDisabled() || (s.onclick && s.onclick(self.value), self.showPanel()), 
                    Event.cancel(evt);
                }), Event.add(self.id, "focus", function() {
                    self._focused = 1;
                }), Event.add(self.id, "blur", function() {
                    self._focused = 0;
                }), self.panel || (self.panel = self.editor.controlManager.createPanel(self.id + "_panel", self.settings), 
                self.editor.onMouseDown.add(self.hidePanel, self)), self.panel.onRenderPanel.add(function() {
                    self.onRenderPanel.dispatch(self);
                }), self.setAriaProperty("expanded", !1);
            },
            restoreSelection: function() {
                self.panel && self.panel.restoreSelection();
            },
            destroy: function() {
                this._super(), Event.clear(this.id + "_panel"), DOM.remove(this.id + "_panel");
            }
        });
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, Event = tinymce.dom.Event;
        tinymce.create("tinymce.ui.PanelSplitButton:tinymce.ui.PanelButton", {
            PanelSplitButton: function(id, s, ed) {
                this._super(id, s, ed);
            },
            renderHTML: function() {
                var html = "", s = this.settings, icon = s.image ? DOM.createHTML("img ", {
                    src: s.image,
                    role: "presentation",
                    class: "mceAction " + s.class
                }) : DOM.createHTML("span", {
                    class: "mceAction " + s.class,
                    role: "presentation"
                }), html = (html += DOM.createHTML("button", {
                    id: this.id + "_action",
                    tabindex: "-1",
                    class: "mceText " + s.class,
                    title: s.title
                }, icon)) + DOM.createHTML("button", {
                    id: this.id + "_open",
                    tabindex: "-1",
                    class: "mceOpen " + s.class,
                    title: s.title
                });
                return DOM.createHTML("div", {
                    id: this.id,
                    role: "button",
                    tabindex: 0,
                    class: "mceSplitButton " + s.class,
                    title: s.title,
                    "aria-label": s.title,
                    "aria-haspopup": "true"
                }, html);
            },
            postRender: function() {
                function activate(evt) {
                    self.isDisabled() || (s.onclick(self.value), Event.cancel(evt));
                }
                var self = this, s = self.settings;
                Event.add(self.id + "_action", "click", activate), Event.add(self.id, [ "click", "keydown" ], function(evt) {
                    32 !== evt.keyCode && 13 !== evt.keyCode && 14 !== evt.keyCode || evt.altKey || evt.ctrlKey || evt.metaKey ? "click" !== evt.type && 40 !== evt.keyCode || (self.showPanel(), 
                    Event.cancel(evt)) : (activate(), Event.cancel(evt));
                }), Event.add(self.id + "_open", "click", function(evt) {
                    self.showPanel(), Event.cancel(evt);
                }), Event.add([ self.id, self.id + "_open" ], "focus", function() {
                    self._focused = 1;
                }), Event.add([ self.id, self.id + "_open" ], "blur", function() {
                    self._focused = 0;
                }), self.panel || (self.panel = new tinymce.ui.Panel(self.id + "_panel", self.settings, self.editor)), 
                self.panel.onRenderPanel.add(function() {
                    self.onRenderPanel.dispatch(self), DOM.addClass(self.id + "_panel", "mcePanelSplitButton");
                });
            }
        });
    }(tinymce), function(tinymce) {
        var Dispatcher = tinymce.util.Dispatcher;
        tinymce.create("tinymce.ui.ButtonDialog:tinymce.ui.PanelButton", {
            ButtonDialog: function(id, s, ed) {
                s.content && (s.html = s.content), s.buttons && tinymce.each(s.buttons, function(btn) {
                    btn.onclick = btn.click || function() {};
                }), this.onShowDialog = new Dispatcher(this), this.onHideDialog = new Dispatcher(this), 
                this._super(id, s, ed);
            },
            showDialog: function() {
                this.showPanel(), this.onShowDialog.dispatch(this);
            },
            hideDialog: function(e) {
                this.hidePanel(e), this.onHideDialog.dispatch(this);
            }
        });
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, count = 0;
        tinymce.create("tinymce.ui.RepeatableItem:tinymce.ui.Container", {
            RepeatableItem: function(id, settings) {
                this._super(id, settings), id = settings.controls[0].id + "_" + count++, 
                delete this.lookup[id], this.controls[0].id = id;
            },
            renderHTML: function() {
                var html = "";
                return html += this.controls[0].renderHTML(), DOM.createHTML("div", {
                    id: this.id,
                    class: "mceRepeatableItem mceForm mceFormRow"
                }, html += '<button class="mceButton"><span role="presentation" class="mceIcon mce_plus"></span><span role="presentation" class="mceIcon mce_trash"></span></button>');
            },
            value: function(value) {
                return arguments.length ? (Array.isArray(value) && (value = value.shift()), 
                this.controls[0].value(value), this) : this.controls[0].value();
            }
        });
    }(tinymce), function(tinymce) {
        var dom = tinymce.DOM, each = tinymce.each, count = 0;
        tinymce.create("tinymce.ui.Repeatable:tinymce.ui.Container", {
            renderHTML: function() {
                for (var settings = this.settings, html = "", controls = this.controls, i = 0; i < controls.length; i++) html += controls[i].renderHTML();
                return dom.createHTML("div", {
                    id: this.id,
                    class: "mceForm mceRepeatable" + (settings.class ? " " + settings.class : ""),
                    role: "group"
                }, html);
            },
            value: function(values) {
                var self = this, controls = this.controls;
                if (arguments.length) {
                    for (i = 0; i < controls.length; i++) controls[i].value(values.shift());
                    return each(values, function(val) {
                        self.addItem(val);
                    }), this;
                }
                for (var values = [], i = 0; i < this.controls.length; i++) {
                    var value = this.controls[i].value();
                    value && (values = values.concat(value));
                }
                return values;
            },
            getItemControl: function() {
                var item = this.settings.item || {
                    type: "TextBox",
                    settings: {}
                };
                return new tinymce.ui[item.type || "TextBox"](this.id + "_item_" + item.id, item.settings || {}, this.editor);
            },
            addItem: function(value) {
                var item = this.getItemControl(), item = new tinymce.ui.RepeatableItem(this.id + "_item_" + count++, {
                    controls: [ item ]
                });
                return this.add(item), item.renderTo(dom.get(this.id)), value && item.value(value), 
                item;
            },
            postRender: function() {
                var self = this, elm = dom.get(this.id);
                dom.bind(elm, "click", function(e) {
                    e.preventDefault(), (e = dom.getParent(e.target, "button")) && (e = e.parentNode, 
                    0 == dom.nodeIndex(e) ? self.addItem() : self.get(e.id).remove());
                }), this.addItem();
            },
            destroy: function() {
                this._super(), this.controls = [];
            }
        });
    }(tinymce), function(tinymce) {
        var each = tinymce.each;
        tinymce.create("tinymce.ui.CustomValue:tinymce.ui.Form", {
            CustomValue: function(id, settings, ed) {
                settings = tinymce.extend(settings, {
                    class: "mceFormRow"
                }), this._super(id, settings, ed);
                var name = new tinymce.ui.TextBox(this.id + "_name", {
                    name: "name",
                    label: ed.getLang("label_name", "Name"),
                    attributes: {
                        autocomplete: !1
                    }
                }), id = new tinymce.ui.TextBox(this.id + "_value", {
                    name: "value",
                    label: ed.getLang("label_value", "Value"),
                    attributes: {
                        autocomplete: !1
                    }
                });
                settings.values && settings.values.length && (name = new tinymce.ui.ListBox(this.id + "_name", {
                    name: "name",
                    label: ed.getLang("label_name", "Name"),
                    combobox: !0
                }), each(settings.values, function(val) {
                    name.add(val, val);
                })), this.add(name), this.add(id);
            },
            renderHTML: function() {
                for (var i = 0; i < this.controls.length; i++) {
                    var ctrl = this.controls[i];
                    ctrl.id = this.id + "_" + ctrl.name;
                }
                return this._super();
            },
            value: function(values) {
                if (arguments.length) {
                    if ("object" == typeof values) for (var key in values) this.controls[0].value(key), 
                    this.controls[1].value(values[key]);
                    return this;
                }
                var data;
                return (key = this.controls[0].value()) ? ((data = {})[key] = this.controls[1].value(), 
                data) : "";
            }
        });
    }(tinymce), function(tinymce) {
        var Dispatcher = tinymce.util.Dispatcher;
        tinymce.AddOnManager = function() {
            this.items = [], this.urls = {}, this.lookup = {}, this.onAdd = new Dispatcher(this);
        }, tinymce.AddOnManager.prototype = {
            get: function(n) {
                if (this.lookup[n]) return this.lookup[n].instance;
            },
            dependencies: function(n) {
                var result;
                return (this.lookup[n] ? this.lookup[n].dependencies : result) || [];
            },
            requireLangPack: function(n) {
                var s = tinymce.settings;
                s && s.language && !1 !== s.language_load && tinymce.ScriptLoader.add(this.urls[n] + "/langs/" + s.language + ".js");
            },
            add: function(id, o, dependencies) {
                return this.items.push(o), this.lookup[id] = {
                    instance: o,
                    dependencies: dependencies
                }, this.onAdd.dispatch(this, id, o), o;
            },
            createUrl: function(baseUrl, dep) {
                return "object" == typeof dep ? dep : {
                    prefix: baseUrl.prefix,
                    resource: dep,
                    suffix: baseUrl.suffix
                };
            },
            addComponents: function(pluginName, scripts) {
                var pluginUrl = this.urls[pluginName];
                tinymce.each(scripts, function(script) {
                    tinymce.ScriptLoader.add(pluginUrl + "/" + script);
                });
            },
            load: function(n, u, cb, s) {
                var self = this, url = u;
                function loadDependencies() {
                    var dependencies = self.dependencies(n);
                    tinymce.each(dependencies, function(dep) {
                        dep = self.createUrl(u, dep), self.load(dep.resource, dep, void 0, void 0);
                    }), cb && (s ? cb.call(s) : cb.call(tinymce.ScriptLoader));
                }
                self.urls[n] || (0 !== (url = "object" == typeof u ? u.prefix + u.resource + u.suffix : url).indexOf("/") && -1 == url.indexOf("://") && (url = tinymce.baseURL + "/" + url), 
                self.urls[n] = url.substring(0, url.lastIndexOf("/")), self.lookup[n] ? loadDependencies() : tinymce.ScriptLoader.add(url, loadDependencies, s));
            }
        }, tinymce.PluginManager = new tinymce.AddOnManager(), tinymce.ThemeManager = new tinymce.AddOnManager();
    }(tinymce), function(tinymce) {
        var each = tinymce.each, extend = tinymce.extend, DOM = tinymce.DOM, Event = tinymce.dom.Event, explode = tinymce.explode, Dispatcher = tinymce.util.Dispatcher, instanceCounter = 0;
        tinymce.documentBaseURL = window.location.href.replace(/[\?#].*$/, "").replace(/[\/\\][^\/]+$/, ""), 
        /[\/\\]$/.test(tinymce.documentBaseURL) || (tinymce.documentBaseURL += "/"), 
        tinymce.baseURL = new tinymce.util.URI(tinymce.documentBaseURL).toAbsolute(tinymce.baseURL), 
        tinymce.baseURI = new tinymce.util.URI(tinymce.baseURL), tinymce.onBeforeUnload = new Dispatcher(tinymce), 
        Event.add(window, "beforeunload", function(e) {
            tinymce.onBeforeUnload.dispatch(tinymce, e);
        }), tinymce.onAddEditor = new Dispatcher(tinymce), tinymce.onRemoveEditor = new Dispatcher(tinymce), 
        tinymce.EditorManager = extend(tinymce, {
            editors: [],
            i18n: {},
            activeEditor: null,
            init: function(settings) {
                var self = this;
                function hasClass(elm, className) {
                    return className.constructor === RegExp ? className.test(elm.className) : DOM.hasClass(elm, className);
                }
                self.settings = settings, DOM.bind(window, "ready", function initEditors() {
                    var targets, editors = [];
                    DOM.unbind(window, "ready", initEditors), function(name) {
                        (name = settings.onpageload) && name.apply(self, Array.prototype.slice.call(arguments, 2));
                    }("onpageload"), targets = DOM.unique(function(settings) {
                        var l, targets = [];
                        if (settings.types) each(settings.types, function(type) {
                            targets = targets.concat(DOM.select(type.selector));
                        }); else {
                            if (settings.selector) return DOM.select(settings.selector);
                            if (settings.target) return [ settings.target ];
                            switch (settings.mode) {
                              case "exact":
                                0 < (l = settings.elements || "").length && each(explode(l), function(id) {
                                    var elm;
                                    (elm = DOM.get(id)) ? targets.push(elm) : each(document.forms, function(f) {
                                        each(f.elements, function(e) {
                                            e.name === id && (id = "mce_editor_" + instanceCounter++, 
                                            DOM.setAttrib(e, "id", id), targets.push(e));
                                        });
                                    });
                                });
                                break;

                              case "textareas":
                              case "specific_textareas":
                                each(DOM.select("textarea"), function(elm) {
                                    settings.editor_deselector && hasClass(elm, settings.editor_deselector) || settings.editor_selector && !hasClass(elm, settings.editor_selector) || targets.push(elm);
                                });
                            }
                        }
                        return targets;
                    }(settings)), each(targets, function(elm) {
                        var targetEditor, EditorManager, oldEditors, editors;
                        (elm = self.get(elm.id)) && elm.initialized && !(elm.getContainer() || elm.getBody()).parentNode && (targetEditor = elm, 
                        oldEditors = editors = (EditorManager = tinymce.EditorManager).editors, 
                        editors = tinymce.grep(editors, function(editor) {
                            return targetEditor !== editor;
                        }), EditorManager.activeEditor === targetEditor && (EditorManager.activeEditor = 0 < editors.length ? editors[0] : null), 
                        EditorManager.focusedEditor === targetEditor && (EditorManager.focusedEditor = null), 
                        oldEditors.length, editors.length, elm.remove());
                    }), 0 !== (targets = tinymce.grep(targets, function(elm) {
                        return !self.get(elm.id);
                    })).length && each(targets, function(elm) {
                        !function(id, settings, targetElm) {
                            id = new tinymce.Editor(id, settings, self), editors.push(id), 
                            id.onInit.add(function() {
                                targets.length;
                            }), id.targetElm = id.targetElm || targetElm, id.render();
                        }(function(elm) {
                            var id = elm.id;
                            return id || (id = (id = elm.name) && !DOM.get(id) ? elm.name : DOM.uniqueId(), 
                            elm.setAttribute("id", id)), id;
                        }(elm), settings, elm);
                    });
                });
            },
            get: function(id) {
                return void 0 === id ? this.editors : this.editors.hasOwnProperty(id) ? this.editors[id] : void 0;
            },
            getInstanceById: function(id) {
                return this.get(id);
            },
            add: function(editor) {
                var editors = this.editors;
                return editors[editor.id] = editor, editors.push(editor), this.setActive(editor), 
                this.onAddEditor.dispatch(this, editor), editor;
            },
            remove: function(editor) {
                var i, editors = this.editors;
                if (!editor) return null;
                if (!editors[editor.id]) return null;
                for (delete editors[editor.id], i = 0; i < editors.length; i++) if (editors[i] == editor) {
                    editors.splice(i, 1);
                    break;
                }
                return this.activeEditor == editor && this.setActive(editors[0]), 
                editor.destroy(), this.onRemoveEditor.dispatch(this, editor), editor;
            },
            execCommand: function(c, u, v) {
                var win, ed = this.get(v);
                switch (c) {
                  case "mceFocus":
                    return ed.focus(), !0;

                  case "mceAddEditor":
                  case "mceAddControl":
                    return this.get(v) || new tinymce.Editor(v, this.settings).render(), 
                    !0;

                  case "mceAddFrameControl":
                    return (win = v.window).tinyMCE = tinyMCE, (win.tinymce = tinymce).DOM.doc = win.document, 
                    tinymce.DOM.win = win, (ed = new tinymce.Editor(v.element_id, v)).render(), 
                    !(v.page_window = null);

                  case "mceRemoveEditor":
                  case "mceRemoveControl":
                    return ed && ed.remove(), !0;

                  case "mceToggleEditor":
                    return ed ? ed.isHidden() ? ed.show() : ed.hide() : this.execCommand("mceAddControl", 0, v), 
                    !0;
                }
                return !!this.activeEditor && this.activeEditor.execCommand(c, u, v);
            },
            execInstanceCommand: function(id, c, u, v) {
                return !!(id = this.get(id)) && id.execCommand(c, u, v);
            },
            triggerSave: function() {
                each(this.editors, function(e) {
                    e.save();
                });
            },
            addI18n: function(p, o) {
                var i18n = this.i18n;
                tinymce.is(p, "string") ? each(o, function(o, k) {
                    i18n[p + "." + k] = o;
                }) : each(p, function(o, lc) {
                    each(o, function(o, g) {
                        each(o, function(o, k) {
                            "common" === g ? i18n[lc + "." + k] = o : i18n[lc + "." + g + "." + k] = o;
                        });
                    });
                });
            },
            setActive: function(editor) {
                this.selectedInstance = this.activeEditor = editor;
            }
        }), tinymce.FocusManager = new tinymce.dom.FocusManager(tinymce.EditorManager);
    }(tinymce), function(tinymce) {
        var timer, lastPath = [];
        function nodeChanged(ed, e) {
            timer && clearTimeout(timer), 65 == e.keyCode && tinymce.VK.metaKeyPressed(e) || ed.selection.normalize(), 
            ed.nodeChanged();
        }
        tinymce.NodeChange = function(editor) {
            editor.onSelectionChange.add(function(ed, e) {
                var startElm = ed.selection.getStart(!0);
                lastPath = [ startElm ], !function(ed, startElm) {
                    var i, currentPath = ed.dom.getParents(startElm, "*", ed.getBody());
                    if (currentPath.reverse(), currentPath.length === lastPath.length) {
                        for (i = currentPath.length; 0 <= i && currentPath[i] === lastPath[i]; i--);
                        if (-1 === i) return lastPath = currentPath, 1;
                    }
                    lastPath = currentPath;
                }(ed, startElm) && ed.dom.isChildOf(startElm, ed.getBody()) && nodeChanged(ed, e);
            }), editor.onMouseUp.add(function(ed, e) {
                e.isDefaultPrevented() || ("IMG" == ed.selection.getNode().nodeName ? timer = setTimeout(function() {
                    nodeChanged(ed, e);
                }, 0) : nodeChanged(ed, e));
            }), this.nodeChanged = function(args) {
                var node, root, parents, selection = editor.selection;
                editor.initialized && selection && !editor.settings.disable_nodechange && !editor.readonly && (root = editor.getBody(), 
                1 === (node = (node = selection.getStart(!0) || root).ownerDocument == editor.getDoc() && editor.dom.isChildOf(node, root) ? node : root).nodeType && !node.getAttribute("data-mce-bogus") || (node = node.parentNode), 
                parents = [], editor.dom.getParent(node, function(node) {
                    if (node === root) return !0;
                    parents.push(node);
                }), (args = args || {}).element = node, args.parents = parents, 
                args.contenteditable = !node.hasAttribute("contenteditable") || tinymce.dom.NodeType.isContentEditableTrue(node), 
                editor.onNodeChange.dispatch(editor, args && args.controlManager || editor.controlManager, node, selection.isCollapsed(), args));
            };
        };
    }(tinymce), function(tinymce) {
        function normalizeSelection(editor) {
            editor.selection.normalize();
        }
        function focusBody(body) {
            if (body.setActive) try {
                body.setActive();
            } catch (ex) {
                body.focus();
            } else body.focus();
        }
        var activateEditor = function(editor) {
            tinymce.setActive(editor);
        };
        tinymce.EditorFocus = {
            focus: function(editor, skipFocus) {
                editor.removed || (skipFocus ? activateEditor : function(editor) {
                    editor.getDoc();
                    var body = editor.getBody(), contentEditable = editor.settings.content_editable, selection = editor.selection, rng = selection.getRng();
                    rng.item && rng.item(0), rng = function(editor, node) {
                        return editor.dom.getParent(node, function(node) {
                            return "true" === editor.dom.getContentEditable(node);
                        });
                    }(editor, selection.getNode()), editor.dom.contains(body, rng) ? (focusBody(rng), 
                    normalizeSelection(editor), activateEditor(editor)) : (contentEditable || editor.getWin().focus(), 
                    (tinymce.isGecko || contentEditable) && (contentEditable && document.activeElement !== body && editor.selection.setRng(editor.lastRng), 
                    focusBody(body), normalizeSelection(editor)));
                })(editor);
            }
        };
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, Event = tinymce.dom.Event, extend = tinymce.extend, each = tinymce.each, isGecko = tinymce.isGecko, isIE = tinymce.isIE, is = tinymce.is, ThemeManager = tinymce.ThemeManager, PluginManager = tinymce.PluginManager, EditorFocus = tinymce.EditorFocus, explode = tinymce.explode;
        tinymce.Editor = function(id, settings) {
            this.settings = settings = extend({
                id: id,
                language: "en",
                theme: "advanced",
                skin: "modern",
                delta_width: 0,
                delta_height: 0,
                popup_css: "",
                plugins: "",
                document_base_url: tinymce.documentBaseURL,
                add_form_submit_trigger: !0,
                submit_patch: !0,
                add_unload_trigger: !0,
                convert_urls: !0,
                relative_urls: !0,
                remove_script_host: !0,
                table_inline_editing: !1,
                object_resizing: !0,
                accessibility_focus: !0,
                doctype: "<!DOCTYPE html>",
                visual: !0,
                font_size_style_values: "xx-small,x-small,small,medium,large,x-large,xx-large",
                font_size_legacy_values: "xx-small,small,medium,large,x-large,xx-large,300%",
                apply_source_formatting: !0,
                directionality: "ltr",
                forced_root_block: "p",
                hidden_input: !0,
                padd_empty_editor: !0,
                render_ui: !0,
                indentation: "30px",
                fix_table_elements: !0,
                inline_styles: !0,
                convert_fonts_to_spans: !0,
                indent: "simple",
                indent_before: "p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,ul,li,area,table,thead,tfoot,tbody,tr,section,article,hgroup,aside,figure,option,optgroup,datalist",
                indent_after: "p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,ul,li,area,table,thead,tfoot,tbody,tr,section,article,hgroup,aside,figure,option,optgroup,datalist",
                validate: !0,
                entity_encoding: "named",
                url_converter: this.convertURL,
                url_converter_scope: this,
                validate_styles: !0
            }, settings), this.id = this.editorId = id, this.isNotDirty = !1, this.plugins = {}, 
            this.documentBaseURI = new tinymce.util.URI(settings.document_base_url || tinymce.documentBaseURL, {
                base_uri: tinymce.baseURI
            }), this.baseURI = tinymce.baseURI, this.contentCSS = [], this.contentStyles = [], 
            this.setupEvents(), this.execCommands = {}, this.queryStateCommands = {}, 
            this.queryValueCommands = {}, this.execCallback("setup", this);
        }, tinymce.Editor.prototype = {
            render: function() {
                var self = this, s = self.settings, id = self.id, sl = tinymce.ScriptLoader;
                Event.domLoaded ? (tinymce.settings = s, !self.getElement() || tinymce.isIDevice && !tinymce.isIOS5 || (!/TEXTAREA|INPUT/i.test(self.getElement().nodeName) && s.hidden_input && DOM.getParent(id, "form") && DOM.insertAfter(DOM.create("input", {
                    type: "hidden",
                    name: id
                }), id), s.content_editable || (self.orgVisibility = self.getElement().style.visibility, 
                self.getElement().style.visibility = "hidden"), tinymce.WindowManager && (self.windowManager = new tinymce.WindowManager(self)), 
                "xml" == s.encoding && self.onGetContent.add(function(ed, o) {
                    o.save && (o.content = DOM.encode(o.content));
                }), s.add_form_submit_trigger && self.onSubmit.addToTop(function() {
                    self.initialized && (self.save(), self.isNotDirty = 1);
                }), s.add_unload_trigger && (self._beforeUnload = tinymce.onBeforeUnload.add(function() {
                    !self.initialized || self.destroyed || self.isHidden() || self.save({
                        format: "raw",
                        no_events: !0
                    });
                })), tinymce.addUnload(self.destroy, self), s.submit_patch && self.onBeforeRenderUI.add(function() {
                    var n = self.getElement().form;
                    !n || n._mceOldSubmit || n.submit.nodeType || n.submit.length || ((self.formElement = n)._mceOldSubmit = n.submit, 
                    n.submit = function() {
                        return tinymce.triggerSave(), self.isNotDirty = 1, self.formElement._mceOldSubmit(self.formElement);
                    });
                }), s.language && !1 !== s.language_load && sl.add(tinymce.baseURL + "/langs/" + s.language + ".js"), 
                s.theme && "function" != typeof s.theme && "-" != s.theme.charAt(0) && !ThemeManager.urls[s.theme] && ThemeManager.load(s.theme, "themes/" + s.theme + "/editor_template" + tinymce.suffix + ".js"), 
                each(explode(s.plugins), function(p) {
                    var dependencies;
                    p && !PluginManager.urls[p] && ("-" == p.charAt(0) ? (p = p.substr(1, p.length), 
                    dependencies = PluginManager.dependencies(p), each(dependencies, function(dep) {
                        var defaultSettings = {
                            prefix: "plugins/",
                            resource: dep,
                            suffix: "/editor_plugin" + tinymce.suffix + ".js"
                        };
                        dep = PluginManager.createUrl(defaultSettings, dep), PluginManager.load(dep.resource, dep);
                    })) : PluginManager.load(p, {
                        prefix: "plugins/",
                        resource: p,
                        suffix: "/editor_plugin" + tinymce.suffix + ".js"
                    }));
                }), each(s.external_plugins, function(url, name) {
                    PluginManager.load(name, url), s.plugins += "," + name;
                }), sl.loadQueue(function() {
                    self.removed || self.init();
                }))) : Event.add(window, "ready", function() {
                    self.render();
                });
            },
            init: function() {
                var h, mh, o, url, w, re, self = this, s = self.settings, e = self.getElement(), initializedPlugins = [];
                if (tinymce.add(self), s.aria_label = s.aria_label || DOM.getAttrib(e, "aria-label", self.getLang("aria.rich_text_area")), 
                s.theme && ("function" != typeof s.theme ? (s.theme = s.theme.replace(/-/, ""), 
                o = ThemeManager.get(s.theme), self.theme = new o(), self.theme.init && self.theme.init(self, ThemeManager.urls[s.theme] || tinymce.documentBaseURL.replace(/\/$/, ""))) : self.theme = s.theme), 
                each(explode(s.plugins.replace(/\-/g, "")), function initPlugin(p) {
                    var c = PluginManager.get(p), u = PluginManager.urls[p] || tinymce.documentBaseURL.replace(/\/$/, "");
                    c && -1 === tinymce.inArray(initializedPlugins, p) && (each(PluginManager.dependencies(p), function(dep) {
                        initPlugin(dep);
                    }), c = new c(self, u), (self.plugins[p] = c).init) && (c.init(self, u), 
                    initializedPlugins.push(p));
                }), self.controlManager = new tinymce.ControlManager(self), self.onBeforeRenderUI.dispatch(self, self.controlManager), 
                s.render_ui && self.theme && (self.orgDisplay = e.style.display, 
                "function" != typeof s.theme ? (w = s.width, h = s.height || e.style.height || e.offsetHeight, 
                mh = s.min_height || 100, (re = /^[0-9\.]+(|px)$/i).test("" + w) && (w = Math.max(parseInt(w, 10) + (o.deltaWidth || 0), 100)), 
                re.test("" + h) && (h = Math.max(parseInt(h, 10) + (o.deltaHeight || 0), mh)), 
                o = self.theme.renderUI({
                    targetNode: e,
                    width: w,
                    height: h,
                    deltaWidth: s.delta_width,
                    deltaHeight: s.delta_height
                }), w && DOM.setStyles(o.sizeContainer || o.editorContainer, {
                    width: w
                }), (h = (o.iframeHeight || h) + ("number" == typeof h ? o.deltaHeight || 0 : "")) < mh && (h = mh)) : ((o = s.theme(self, e)).editorContainer.nodeType && (o.editorContainer = o.editorContainer.id = o.editorContainer.id || self.id + "_parent"), 
                o.iframeContainer.nodeType && (o.iframeContainer = o.iframeContainer.id = o.iframeContainer.id || self.id + "_iframecontainer"), 
                h = o.iframeHeight || e.offsetHeight, isIE && (self.onInit.add(function(ed) {
                    ed.dom.bind(ed.getBody(), "beforedeactivate keydown keyup", function() {
                        ed.bookmark = ed.selection.getBookmark(1);
                    });
                }), self.onNodeChange.add(function(ed) {
                    document.activeElement.id == ed.id + "_ifr" && (ed.bookmark = ed.selection.getBookmark(1));
                }))), self.editorContainer = o.editorContainer), s.content_css && each(explode(s.content_css), function(u) {
                    self.contentCSS.push(self.documentBaseURI.toAbsolute(u));
                }), s.content_style && self.contentStyles.push(s.content_style), 
                s.content_editable) return e = o = null, self.initContentBody();
                document.domain && location.hostname != document.domain && (tinymce.relaxedDomain = document.domain), 
                self.iframeHTML = s.doctype + '<html dir="' + s.directionality + '"><head xmlns="http://www.w3.org/1999/xhtml">', 
                s.document_base_url != tinymce.documentBaseURL && (self.iframeHTML += '<base href="' + self.documentBaseURI.getURI() + '" />'), 
                self.iframeHTML += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />', 
                -1 != (re = s.body_id || "tinymce").indexOf("=") && (re = (re = self.getParam("body_id", "", "hash"))[self.id] || re), 
                -1 != (w = s.body_class || "").indexOf("=") && (w = (w = self.getParam("body_class", "", "hash"))[self.id] || ""), 
                self.iframeHTML += '</head><body id="' + re + '" class="mceContentBody ' + w + '"><br></body></html>', 
                tinymce.relaxedDomain && (url = 'javascript:(function(){document.open();document.domain="' + document.domain + '";var ed = window.parent.tinymce.get("' + self.id + '");document.write(ed.iframeHTML);document.close();ed.initContentBody();})()');
                var ifr = DOM.add(o.iframeContainer, "iframe", {
                    id: self.id + "_ifr",
                    frameBorder: "0",
                    allowTransparency: "true",
                    title: s.aria_label,
                    style: {
                        height: h
                    }
                });
                ifr.onload = function() {
                    ifr.onload = null, self.onLoad.dispatch();
                }, DOM.setAttrib(ifr, "src", url || 'javascript:""'), self.contentAreaContainer = o.iframeContainer, 
                o.editorContainer && (DOM.get(o.editorContainer).style.display = self.orgDisplay), 
                e.style.visibility = self.orgVisibility, DOM.get(self.id).style.display = "none", 
                DOM.setAttrib(self.id, "aria-hidden", !0), tinymce.relaxedDomain && url || self.initContentBody();
            },
            initContentBody: function() {
                var body, contentCssText, self = this, settings = self.settings, targetElm = DOM.get(self.id), doc = self.getDoc(), styleLoader = (isIE && tinymce.relaxedDomain || settings.content_editable || (doc.open(), 
                doc.write(self.iframeHTML), doc.close(), tinymce.relaxedDomain && (doc.domain = tinymce.relaxedDomain)), 
                settings.content_editable && (DOM.addClass(targetElm, "mceContentBody"), 
                self.contentDocument = doc = settings.content_document || document, 
                self.contentWindow = settings.content_window || window, self.bodyElement = targetElm, 
                settings.content_document = settings.content_window = null), (body = self.getBody()).disabled = !0, 
                settings.readonly || (body.contentEditable = self.getParam("content_editable_state", !0)), 
                body.disabled = !1, self.schema = new tinymce.html.Schema(settings), 
                self.dom = new tinymce.dom.DOMUtils(doc, {
                    keep_values: !0,
                    url_converter: self.convertURL,
                    url_converter_scope: self,
                    hex_colors: settings.force_hex_style_colors,
                    class_filter: settings.class_filter,
                    update_styles: !0,
                    root_element: settings.content_editable ? self.id : null,
                    schema: self.schema
                }), self.parser = new tinymce.html.DomParser(settings, self.schema), 
                self.parser.addAttributeFilter("src,href,style", function(nodes, name) {
                    for (var node, value, internalName, i = nodes.length, dom = self.dom; i--; ) value = (node = nodes[i]).attr(name), 
                    node.attributes.map[internalName = "data-mce-" + name] || ("style" === name ? (settings.validate_styles && (value = dom.serializeStyle(dom.parseStyle(value), node.name)), 
                    node.attr(internalName, value)) : node.attr(internalName, self.convertURL(value, name, node.name)));
                }), self.parser.addNodeFilter("#cdata", function(nodes) {
                    for (var node, i = nodes.length; i--; ) (node = nodes[i]).type = 8, 
                    node.name = "#comment", node.value = "[CDATA[" + node.value + "]]";
                }), self.parser.addNodeFilter("p,h1,h2,h3,h4,h5,h6,div", function(nodes) {
                    for (var node, i = nodes.length, nonEmptyElements = self.schema.getNonEmptyElements(); i--; ) (node = nodes[i]).isEmpty(nonEmptyElements) && (node.empty().append(new tinymce.html.Node("br", 1)).shortEnded = !0);
                }), self.serializer = new tinymce.dom.Serializer(settings, self.dom, self.schema), 
                self.selection = new tinymce.dom.Selection(self.dom, self.getWin(), self.serializer, self), 
                self.formatter = new tinymce.Formatter(self), self.textpattern = new tinymce.TextPattern(self), 
                self.undoManager = new tinymce.UndoManager(self), self.forceBlocks = new tinymce.ForceBlocks(self), 
                self.enterKey = new tinymce.EnterKey(self), self._nodeChangeDispatcher = new tinymce.NodeChange(self), 
                self.editorCommands = new tinymce.EditorCommands(self), self._selectionOverrides = new tinymce.SelectionOverrides(self), 
                self._clipBoard = new tinymce.Clipboard(self), self.onExecCommand.add(function(editor, command) {
                    /^(FontName|FontSize)$/.test(command) || self.nodeChanged();
                }), self.serializer.onPreProcess.add(function(se, o) {
                    return self.onPreProcess.dispatch(self, o, se);
                }), self.serializer.onPostProcess.add(function(se, o) {
                    return self.onPostProcess.dispatch(self, o, se);
                }), self.onPreInit.dispatch(self), settings.browser_spellcheck || settings.gecko_spellcheck || (doc.body.spellcheck = !1), 
                settings.readonly || self.bindNativeEvents(), self.controlManager.onPostRender.dispatch(self, self.controlManager), 
                self.onPostRender.dispatch(self), self.quirks = tinymce.util.Quirks(self), 
                settings.directionality && (body.dir = settings.directionality), 
                settings.nowrap && (body.style.whiteSpace = "nowrap"), settings.protect && self.onBeforeSetContent.add(function(ed, o) {
                    each(settings.protect, function(pattern) {
                        o.content = o.content.replace(pattern, function(str) {
                            return "\x3c!--mce:protected " + escape(str) + "--\x3e";
                        });
                    });
                }), self.onSetContent.add(function() {
                    self.addVisual(self.getBody());
                }), settings.padd_empty_editor && self.onPostProcess.add(function(ed, o) {
                    o.content = o.content.replace(/^(<p[^>]*>(&nbsp;|&#160;|\s|\u00a0|)<\/p>[\r\n]*|<br \/>[\r\n]*)$/, "");
                }), self.load({
                    initial: !0,
                    format: "html"
                }), self.startContent = self.getContent({
                    format: "raw"
                }), 0 < self.contentStyles.length && (contentCssText = "", each(self.contentStyles, function(style) {
                    contentCssText += style + "\r\n";
                }), self.dom.addStyle(contentCssText)), new tinymce.dom.StyleSheetLoader(self.getDoc()));
                each(self.contentCSS, function(url) {
                    styleLoader.add(url);
                }), styleLoader.loadQueue(function() {
                    self.initialized = !0, self.onInit.dispatch(self), self.execCallback("setupcontent_callback", self.id, body, doc), 
                    self.execCallback("init_instance_callback", self), self.focus(!0), 
                    self.nodeChanged({
                        initial: !0
                    }), settings.auto_focus && setTimeout(function() {
                        var focusEditor = !0 === settings.auto_focus ? self : tinymce.get(settings.auto_focus);
                        focusEditor.destroyed || focusEditor.focus();
                    }, 100);
                }), doc = body = null;
            },
            focus: function(skip_focus) {
                EditorFocus.focus(this, skip_focus);
            },
            execCallback: function(n) {
                var s, f = this.settings[n];
                if (f) return this.callbackLookup && (s = this.callbackLookup[n]) && (f = s.func, 
                s = s.scope), is(f, "string") && (s = (s = f.replace(/\.\w+$/, "")) ? tinymce.resolve(s) : 0, 
                f = tinymce.resolve(f), this.callbackLookup = this.callbackLookup || {}, 
                this.callbackLookup[n] = {
                    func: f,
                    scope: s
                }), f.apply(s || this, Array.prototype.slice.call(arguments, 1));
            },
            translate: function(s) {
                var c = this.settings.language || "en", i18n = tinymce.i18n;
                return s ? i18n[c + "." + s] || s.replace(/\{\#([^\}]+)\}/g, function(a, b) {
                    return i18n[c + "." + b] || "{#" + b + "}";
                }) : "";
            },
            getLang: function(n, dv) {
                return tinymce.i18n[(this.settings.language || "en") + "." + n] || (is(dv) ? dv : "{#" + n + "}");
            },
            getParam: function(n, dv, ty) {
                var o, tr = tinymce.trim, n = is(this.settings[n]) ? this.settings[n] : dv;
                return "hash" === ty ? (o = {}, is(n, "string") ? each(0 < n.indexOf("=") ? n.split(/[;,](?![^=;,]*(?:[;,]|$))/) : n.split(","), function(v) {
                    1 < (v = v.split("=")).length ? o[tr(v[0])] = tr(v[1]) : o[tr(v[0])] = tr(v);
                }) : o = n, o) : n;
            },
            nodeChanged: function(args) {
                this._nodeChangeDispatcher.nodeChanged(args);
            },
            addButton: function(name, settings) {
                this.buttons = this.buttons || {}, this.buttons[name] = settings;
            },
            addCommand: function(name, callback, scope) {
                this.execCommands[name] = {
                    func: callback,
                    scope: scope || this
                };
            },
            addQueryStateHandler: function(name, callback, scope) {
                this.queryStateCommands[name] = {
                    func: callback,
                    scope: scope || this
                };
            },
            addQueryValueHandler: function(name, callback, scope) {
                this.queryValueCommands[name] = {
                    func: callback,
                    scope: scope || this
                };
            },
            queryCommandSupported: function(cmd) {
                return this.editorCommands.queryCommandSupported(cmd);
            },
            addShortcut: function(pattern, desc, cmdFunc, scope) {
                var self = this;
                if (!1 === self.settings.custom_shortcuts) return !1;
                self.shortcuts = self.shortcuts || {};
                var cmd, keyCodeLookup = {
                    f9: 120,
                    f10: 121,
                    f11: 122
                }, modifierNames = tinymce.makeMap("alt,ctrl,shift,meta,access");
                function parseShortcut(pattern) {
                    var id, key, shortcut = {};
                    for (key in each(explode(pattern, "+"), function(value) {
                        value in modifierNames ? shortcut[value] = !0 : /^[0-9]{2,}$/.test(value) ? shortcut.keyCode = parseInt(value, 10) : (shortcut.charCode = value.charCodeAt(0), 
                        shortcut.keyCode = keyCodeLookup[value] || value.toUpperCase().charCodeAt(0));
                    }), id = [ shortcut.keyCode ], modifierNames) shortcut[key] ? id.push(key) : shortcut[key] = !1;
                    return shortcut.id = id.join(","), shortcut.access && (shortcut.alt = !0, 
                    tinymce.isMac ? shortcut.ctrl = !0 : shortcut.shift = !0), shortcut.meta && (tinymce.isMac ? shortcut.meta = !0 : (shortcut.ctrl = !0, 
                    shortcut.meta = !1)), shortcut;
                }
                return "string" == typeof (cmd = cmdFunc) ? cmdFunc = function() {
                    self.execCommand(cmd, !1, null);
                } : tinymce.isArray(cmd) && (cmdFunc = function() {
                    self.execCommand(cmd[0], cmd[1], cmd[2]);
                }), each(explode(tinymce.trim(pattern.toLowerCase())), function(pattern) {
                    pattern = function(pattern, desc, cmdFunc, scope) {
                        return (pattern = tinymce.map(explode(pattern, ">"), parseShortcut))[pattern.length - 1] = extend(pattern[pattern.length - 1], {
                            func: cmdFunc,
                            scope: scope || self
                        }), extend(pattern[0], {
                            desc: self.translate(desc),
                            subpatterns: pattern.slice(1)
                        });
                    }(pattern, desc, cmdFunc, scope), self.shortcuts[pattern.id] = pattern;
                }), !0;
            },
            execCommand: function(cmd, ui, val, a) {
                var o, self = this, s = 0;
                return /^(mceAddUndoLevel|mceEndUndoLevel|mceBeginUndoLevel|mceRepaint|SelectAll)$/.test(cmd) || a && a.skip_focus || self.focus(), 
                a = extend({}, a), self.onBeforeExecCommand.dispatch(self, cmd, ui, val, a), 
                !a.terminate && (self.execCallback("execcommand_callback", self.id, self.selection.getNode(), cmd, ui, val) ? (self.onExecCommand.dispatch(self, cmd, ui, val, a), 
                !0) : (o = self.execCommands[cmd]) && !0 !== (o = o.func.call(o.scope, ui, val)) ? (self.onExecCommand.dispatch(self, cmd, ui, val, a), 
                o) : (each(self.plugins, function(p) {
                    if (p.execCommand && p.execCommand(cmd, ui, val)) return self.onExecCommand.dispatch(self, cmd, ui, val, a), 
                    !(s = 1);
                }), !!s || (self.theme && self.theme.execCommand && self.theme.execCommand(cmd, ui, val) || self.editorCommands.execCommand(cmd, ui, val) ? (self.onExecCommand.dispatch(self, cmd, ui, val, a), 
                !0) : (self.getDoc().execCommand(cmd, ui, val), void self.onExecCommand.dispatch(self, cmd, ui, val, a)))));
            },
            queryCommandState: function(cmd) {
                var o, s;
                if (!this._isHidden()) {
                    if ((o = this.queryStateCommands[cmd]) && !0 !== (s = o.func.call(o.scope))) return s;
                    if (-1 !== (o = this.editorCommands.queryCommandState(cmd))) return o;
                    try {
                        return this.getDoc().queryCommandState(cmd);
                    } catch (ex) {}
                }
            },
            queryCommandValue: function(c) {
                var o, s;
                if (!this._isHidden()) {
                    if ((o = this.queryValueCommands[c]) && !0 !== (s = o.func.call(o.scope))) return s;
                    if (o = this.editorCommands.queryCommandValue(c), is(o)) return o;
                    try {
                        return this.getDoc().queryCommandValue(c);
                    } catch (ex) {}
                }
            },
            show: function() {
                DOM.show(this.getContainer()), DOM.hide(this.id), this.load(), this.onShow.dispatch(this);
            },
            hide: function() {
                var doc = this.getDoc();
                isIE && doc && doc.execCommand("SelectAll"), this.save(), DOM.hide(this.getContainer()), 
                DOM.setStyle(this.id, "display", this.orgDisplay), this.onHide.dispatch(this);
            },
            isHidden: function() {
                return !DOM.isHidden(this.id);
            },
            setProgressState: function(b, ti, o) {
                return this.onSetProgressState.dispatch(this, b, ti, o), b;
            },
            load: function(o) {
                var h, e = this.getElement();
                if (e) return (o = o || {}).load = !0, h = this.setContent(is(e.value) ? e.value : e.innerHTML, o), 
                o.element = e, o.no_events || this.onLoadContent.dispatch(this, o), 
                o.element = null, h;
            },
            save: function(o) {
                var h, f, self = this, e = self.getElement();
                if (e && self.initialized) return (o = o || {}).save = !0, o.element = e, 
                o.content = self.getContent(o), o.no_events || self.onSaveContent.dispatch(self, o), 
                h = o.content, /TEXTAREA|INPUT/i.test(e.nodeName) ? e.value = h : (e.innerHTML = h, 
                (f = DOM.getParent(self.id, "form")) && each(f.elements, function(e) {
                    if (e.name == self.id) return e.value = h, !1;
                })), o.element = e = null, h;
            },
            setContent: function(content, args) {
                var forcedRootBlockName, body = this.getBody();
                return (args = args || {}).format = args.format || "html", args.set = !0, 
                args.content = content, args.no_events || this.onBeforeSetContent.dispatch(this, args), 
                0 === (content = args.content).length || /^\s+$/.test(content) ? ((forcedRootBlockName = this.settings.forced_root_block) && this.schema.isValidChild(body.nodeName.toLowerCase(), forcedRootBlockName.toLowerCase()) ? content = isIE ? "<" + forcedRootBlockName + "></" + forcedRootBlockName + ">" : "<" + forcedRootBlockName + '><br data-mce-bogus="1"></' + forcedRootBlockName + ">" : isIE || (content = '<br data-mce-bogus="1">'), 
                this.dom.setHTML(body, content), this.onSetContent.dispatch(this, args)) : ("raw" !== args.format && (content = new tinymce.html.Serializer({}, this.schema).serialize(this.parser.parse(content))), 
                args.content = tinymce.trim(content), this.dom.setHTML(body, args.content), 
                args.no_events || this.onSetContent.dispatch(this, args)), args.content;
            },
            getSelection: function() {
                return this.selection.getContent();
            },
            getContent: function(args) {
                var body = this.getBody();
                return (args = args || {}).format = args.format || "html", args.get = !0, 
                args.getInner = !0, args.no_events || this.onBeforeGetContent.dispatch(this, args), 
                body = "raw" == args.format ? body.innerHTML : "text" == args.format ? body.innerText || body.textContent : this.serializer.serialize(body, args), 
                "text" != args.format ? args.content = tinymce.trim(body) : args.content = body, 
                args.no_events || this.onGetContent.dispatch(this, args), args.content;
            },
            isDirty: function() {
                return tinymce.trim(this.startContent) !== tinymce.trim(this.getContent({
                    format: "raw"
                })) && !this.isNotDirty;
            },
            getContainer: function() {
                return this.container || (this.container = DOM.get(this.editorContainer || this.id + "_parent")), 
                this.container;
            },
            getContentAreaContainer: function() {
                return this.contentAreaContainer;
            },
            getElement: function() {
                return DOM.get(this.settings.content_element || this.id);
            },
            getWin: function() {
                var elm;
                return this.contentWindow || (elm = DOM.get(this.id + "_ifr")) && (this.contentWindow = elm.contentWindow), 
                this.contentWindow;
            },
            getDoc: function() {
                var win;
                return this.contentDocument || (win = this.getWin()) && (this.contentDocument = win.document), 
                this.contentDocument;
            },
            getBody: function() {
                return this.bodyElement || this.getDoc().body;
            },
            convertURL: function(url, name, elm) {
                var settings = this.settings;
                if (settings.urlconverter_callback) return this.execCallback("urlconverter_callback", url, elm, !0, name);
                if (settings.convert_urls && (!elm || "LINK" != elm.nodeName) && 0 !== url.indexOf("file:")) {
                    if (settings.relative_urls) return this.documentBaseURI.toRelative(url);
                    url = this.documentBaseURI.toAbsolute(url, settings.remove_script_host);
                }
                return url;
            },
            addVisual: function(elm) {
                var cls, self = this, settings = self.settings, dom = self.dom;
                elm = elm || self.getBody(), is(self.hasVisual) || (self.hasVisual = settings.visual), 
                self.hasVisual ? dom.addClass(self.getBody(), "mce-visualaid") : dom.removeClass(self.getBody(), "mce-visualaid"), 
                each(dom.select("table,a", elm), function(elm) {
                    var value;
                    switch (elm.nodeName) {
                      case "TABLE":
                        return cls = settings.visual_table_class || "mce-item-table", 
                        void ((value = dom.getAttrib(elm, "border")) && "0" != value || (self.hasVisual ? dom.addClass(elm, cls) : dom.removeClass(elm, cls)));

                      case "A":
                        return void (dom.getAttrib(elm, "href", !1) || (value = dom.getAttrib(elm, "name") || elm.id, 
                        cls = "mce-item-anchor", value && (self.hasVisual ? dom.addClass(elm, cls) : dom.removeClass(elm, cls))));
                    }
                }), self.onVisualAid.dispatch(self, elm, self.hasVisual);
            },
            remove: function() {
                var elm = this.getContainer(), doc = this.getDoc();
                this.removed || (this.removed = 1, isIE && doc && doc.execCommand("SelectAll"), 
                this.save(), DOM.setStyle(this.id, "display", this.orgDisplay), 
                this.getBody().onload = null, this.settings.content_editable || (Event.unbind(this.getWin()), 
                Event.unbind(this.getDoc())), Event.unbind(this.getBody()), Event.clear(elm), 
                this.execCallback("remove_instance_callback", this), this.onRemove.dispatch(this), 
                this.onExecCommand.listeners = [], this._selectionOverrides.destroy(), 
                tinymce.remove(this), DOM.remove(elm));
            },
            destroy: function(s) {
                this.destroyed || (isGecko && (Event.unbind(this.getDoc()), Event.unbind(this.getWin()), 
                Event.unbind(this.getBody())), s || (tinymce.removeUnload(this.destroy), 
                tinymce.onBeforeUnload.remove(this._beforeUnload), this.theme && this.theme.destroy && this.theme.destroy(), 
                this.controlManager.destroy(), this.selection.destroy(), this.dom.destroy()), 
                this.formElement && (this.formElement.submit = this.formElement._mceOldSubmit, 
                this.formElement._mceOldSubmit = null), this.contentAreaContainer = this.formElement = this.container = this.settings.content_element = this.bodyElement = this.contentDocument = this.contentWindow = null, 
                this.selection && (this.selection = this.selection.win = this.selection.dom = this.selection.dom.doc = null), 
                this.destroyed = 1);
            },
            setMode: function(disabled) {
                var body = self.getBody();
                body.contentEditable = disabled, body.disabled = disabled;
            },
            _isHidden: function() {
                var s;
                return isGecko ? !(s = this.selection.getSel()) || !s.rangeCount || 0 === s.rangeCount : 0;
            }
        };
    }(tinymce), function(tinymce) {
        var each = tinymce.each;
        tinymce.Editor.prototype.setupEvents = function() {
            var self = this, settings = self.settings;
            each([ "onPreInit", "onBeforeRenderUI", "onPostRender", "onLoad", "onInit", "onRemove", "onActivate", "onDeactivate", "onShow", "onHide", "onClick", "onEvent", "onMouseUp", "onMouseDown", "onDblClick", "onKeyDown", "onKeyUp", "onKeyPress", "onContextMenu", "onSubmit", "onReset", "onPaste", "onCut", "onCopy", "onPreProcess", "onPostProcess", "onBeforeSetContent", "onBeforeGetContent", "onSetContent", "onGetContent", "onLoadContent", "onSaveContent", "onNodeChange", "onChange", "onBeforeExecCommand", "onExecCommand", "onUndo", "onRedo", "onVisualAid", "onSetProgressState", "onSetAttrib", "onSelectionChange", "onBlur", "onFocus", "onFocusIn", "onFocusOut" ], function(name) {
                self[name] = new tinymce.util.Dispatcher(self);
            }), settings.cleanup_callback && (self.onBeforeSetContent.add(function(ed, o) {
                o.content = ed.execCallback("cleanup_callback", "insert_to_editor", o.content, o);
            }), self.onPreProcess.add(function(ed, o) {
                o.set && ed.execCallback("cleanup_callback", "insert_to_editor_dom", o.node, o), 
                o.get && ed.execCallback("cleanup_callback", "get_from_editor_dom", o.node, o);
            }), self.onPostProcess.add(function(ed, o) {
                o.set && (o.content = ed.execCallback("cleanup_callback", "insert_to_editor", o.content, o)), 
                o.get && (o.content = ed.execCallback("cleanup_callback", "get_from_editor", o.content, o));
            }));
        }, tinymce.Editor.prototype.bindNativeEvents = function() {
            var nativeToDispatcherMap, self = this, settings = self.settings, dom = self.dom;
            function eventHandler(evt, args) {
                self.removed || !1 !== self.onEvent.dispatch(self, evt, args) && self[nativeToDispatcherMap[evt.fakeType || evt.type]].dispatch(self, evt, args);
            }
            function matchShortcut(e, shortcut) {
                return shortcut && shortcut.ctrl == e.ctrlKey && shortcut.meta == e.metaKey && shortcut.alt == e.altKey && shortcut.shift == e.shiftKey && (e.keyCode == shortcut.keyCode || e.charCode && e.charCode == shortcut.charCode) && (e.preventDefault(), 
                1);
            }
            function executeShortcutAction(shortcut) {
                shortcut.func && shortcut.func.call(shortcut.scope);
            }
            each(nativeToDispatcherMap = {
                mouseup: "onMouseUp",
                mousedown: "onMouseDown",
                click: "onClick",
                keyup: "onKeyUp",
                keydown: "onKeyDown",
                keypress: "onKeyPress",
                submit: "onSubmit",
                reset: "onReset",
                contextmenu: "onContextMenu",
                dblclick: "onDblClick",
                paste: "onPaste",
                cut: "onCut",
                copy: "onCopy",
                selectionchange: "onSelectionChange",
                focusin: "onFocusIn",
                focusout: "onFocusOut"
            }, function(dispatcherName, nativeName) {
                var root = settings.content_editable ? self.getBody() : self.getDoc();
                switch (nativeName) {
                  case "contextmenu":
                    dom.bind(root, nativeName, eventHandler);
                    break;

                  case "paste":
                  case "cut":
                  case "copy":
                    dom.bind(self.getBody(), nativeName, eventHandler);
                    break;

                  case "submit":
                  case "reset":
                    dom.bind(self.getElement().form || tinymce.DOM.getParent(self.id, "form"), nativeName, eventHandler);
                    break;

                  default:
                    dom.bind(root, nativeName, eventHandler);
                }
            }), dom.bind(settings.content_editable ? self.getBody() : tinymce.isGecko ? self.getDoc() : self.getWin(), "focus", function() {
                self.focus(!0);
            }), self.onReset.add(function() {
                self.setContent(self.startContent, {
                    format: "raw"
                });
            });
            var pendingPatterns = [];
            function handleShortcut(e) {
                !function(e) {
                    return e.altKey || e.ctrlKey || e.metaKey;
                }(e) && !function(e) {
                    return "keydown" === e.type && 112 <= e.keyCode && e.keyCode <= 123;
                }(e) || e.isDefaultPrevented() || (each(self.shortcuts, function(shortcut) {
                    if (matchShortcut(e, shortcut)) return pendingPatterns = shortcut.subpatterns.slice(0), 
                    "keydown" == e.type && executeShortcutAction(shortcut), !0;
                }), matchShortcut(e, pendingPatterns[0]) && (1 === pendingPatterns.length && "keydown" == e.type && executeShortcutAction(pendingPatterns[0]), 
                pendingPatterns.shift()));
            }
            self.onKeyUp.add(function(ed, e) {
                handleShortcut(e);
            }), self.onKeyPress.add(function(ed, e) {
                handleShortcut(e);
            }), self.onKeyDown.add(function(ed, e) {
                handleShortcut(e);
            });
        };
    }(tinymce), function(tinymce) {
        function listItems(elm) {
            return tinymce.grep(elm.childNodes, function(child) {
                return "LI" === child.nodeName;
            });
        }
        function trimListItems(elms) {
            return 0 < elms.length && !elms[elms.length - 1].firstChild ? elms.slice(0, -1) : elms;
        }
        function getParentLi(dom, node) {
            return (node = dom.getParent(node, dom.isBlock)) && "LI" === node.nodeName ? node : null;
        }
        function findLastOf(node, rootNode) {
            return node = CaretPosition.after(node), (rootNode = new CaretWalker(rootNode).prev(node)) ? rootNode.toRange() : null;
        }
        var CaretWalker = tinymce.caret.CaretWalker, CaretPosition = tinymce.caret.CaretPosition;
        tinymce.InsertList = {
            isListFragment: function(fragment) {
                var firstChild = fragment.firstChild, fragment = fragment.lastChild;
                return firstChild && "meta" === firstChild.name && (firstChild = firstChild.next), 
                fragment && "mce_marker" === fragment.attr("id") && (fragment = fragment.prev), 
                !(!firstChild || firstChild !== fragment || "ul" !== firstChild.name && "ol" !== firstChild.name);
            },
            insertAtCaret: function(serializer, dom, rng, fragment) {
                function isAt(location) {
                    var caretPos = CaretPosition.fromRangeStart(rng), caretWalker = new CaretWalker(dom.getRoot());
                    return !(location = 1 === location ? caretWalker.prev(caretPos) : caretWalker.next(caretPos)) || getParentLi(dom, location.getNode()) !== liTarget;
                }
                var target, rootNode, parentElm, serializer = function(dom, serializer, fragment) {
                    return serializer = serializer.serialize(fragment), fragment = dom.createFragment(serializer), 
                    serializer = (dom = fragment).firstChild, fragment = dom.lastChild, 
                    serializer && "META" === serializer.nodeName && serializer.parentNode.removeChild(serializer), 
                    fragment && "mce_marker" === fragment.id && fragment.parentNode.removeChild(fragment), 
                    dom;
                }(dom, serializer, fragment), liTarget = getParentLi(dom, rng.startContainer), fragment = trimListItems(listItems(serializer.firstChild)), serializer = dom.getRoot();
                return isAt(1) ? (rootNode = serializer, parentElm = (target = liTarget).parentNode, 
                tinymce.each(fragment, function(elm) {
                    parentElm.insertBefore(elm, target);
                }), function(node, rootNode) {
                    return node = CaretPosition.before(node), (rootNode = new CaretWalker(rootNode).next(node)) ? rootNode.toRange() : null;
                }(target, rootNode)) : isAt(2) ? function(target, elms, rootNode, dom) {
                    return dom.insertAfter(elms.reverse(), target), findLastOf(elms[0], rootNode);
                }(liTarget, fragment, serializer, dom) : function(target, elms, rootNode, rng) {
                    var rng = function(parentNode, rng) {
                        var beforeRng = rng.cloneRange(), rng = rng.cloneRange();
                        return beforeRng.setStartBefore(parentNode), rng.setEndAfter(parentNode), 
                        [ beforeRng.cloneContents(), rng.cloneContents() ];
                    }(target, rng), parentElm = target.parentNode;
                    return parentElm.insertBefore(rng[0], target), tinymce.each(elms, function(li) {
                        parentElm.insertBefore(li, target);
                    }), parentElm.insertBefore(rng[1], target), parentElm.removeChild(target), 
                    findLastOf(elms[elms.length - 1], rootNode);
                }(liTarget, fragment, serializer, rng);
            },
            isParentBlockLi: function(dom, node) {
                return !!getParentLi(dom, node);
            },
            trimListItems: trimListItems,
            listItems: listItems
        };
    }(tinymce), function(tinymce) {
        var CaretWalker = tinymce.caret.CaretWalker, CaretPosition = tinymce.caret.CaretPosition, NodeType = tinymce.dom.NodeType, Serializer = tinymce.html.Serializer, InsertList = tinymce.InsertList, isTableCell = NodeType.matchNodeNames("td th");
        tinymce.InsertContent = {
            insertAtCaret: function(editor, value) {
                !function(editor, value, details) {
                    var parser, serializer, parentNode, rootNode, args, marker, node, node2, bookmarkHtml, merge, textInlineElements = editor.schema.getTextInlineElements(), selection = editor.selection, dom = editor.dom;
                    /^ | $/.test(value) && (value = function(html) {
                        var container, rng;
                        function hasSiblingText(siblingName) {
                            return container[siblingName] && 3 == container[siblingName].nodeType;
                        }
                        return rng = selection.getRng(!0), container = rng.startContainer, 
                        rng = rng.startOffset, 3 == container.nodeType && (0 < rng ? html = html.replace(/^&nbsp;/, " ") : hasSiblingText("previousSibling") || (html = html.replace(/^ /, "&nbsp;")), 
                        rng < container.length ? html = html.replace(/&nbsp;(<br>|)$/, " ") : hasSiblingText("nextSibling") || (html = html.replace(/(&nbsp;| )(<br>|)$/, "&nbsp;"))), 
                        html;
                    }(value)), parser = editor.parser, merge = details.merge, serializer = new Serializer({
                        validate: editor.settings.validate
                    }, editor.schema), bookmarkHtml = '<span id="mce_marker" data-mce-type="bookmark">&#xFEFF;&#x200B;</span>', 
                    args = {
                        content: value,
                        format: "html",
                        selection: !0
                    }, selection.onBeforeSetContent.dispatch(selection, args), -1 == (value = args.content).indexOf("{$caret}") && (value += "{$caret}"), 
                    value = value.replace(/\{\$caret\}/, bookmarkHtml);
                    var rng, root, caretElement = (rng = selection.getRng()).startContainer || (rng.parentElement ? rng.parentElement() : null), body = editor.getBody(), caretElement = (caretElement === body && selection.isCollapsed() && dom.isBlock(body.firstChild) && function(node) {
                        return node && !editor.schema.getShortEndedElements()[node.nodeName];
                    }(body.firstChild) && dom.isEmpty(body.firstChild) && ((rng = dom.createRng()).setStart(body.firstChild, 0), 
                    rng.setEnd(body.firstChild, 0), selection.setRng(rng)), selection.isCollapsed() || (editor.selection.setRng(editor.selection.getRng()), 
                    editor.getDoc().execCommand("Delete", !1, null), function() {
                        var rng = selection.getRng(!0), container = rng.startContainer, offset = rng.startOffset;
                        3 == container.nodeType && rng.collapsed && "\xa0" === container.data[offset] && (container.deleteData(offset, 1), 
                        /[\u00a0| ]$/.test(value) || (value += " "));
                    }()), {
                        context: (parentNode = selection.getNode()).nodeName.toLowerCase(),
                        data: details.data
                    }), fragment = parser.parse(value, caretElement);
                    if (!0 === details.paste && InsertList.isListFragment(fragment) && InsertList.isParentBlockLi(dom, parentNode)) rng = InsertList.insertAtCaret(serializer, dom, editor.selection.getRng(!0), fragment), 
                    editor.selection.setRng(rng), editor.onSetContent.dispatch(editor, args); else {
                        if (function(fragment) {
                            for (var node = fragment; node = node.walk(); ) 1 === node.type && node.attr("data-mce-fragment", "1");
                        }(fragment), "mce_marker" == (node = fragment.lastChild).attr("id")) for (node = (marker = node).prev; node; node = node.walk(!0)) if (3 == node.type || !dom.isBlock(node.name)) {
                            editor.schema.isValidChild(node.parent.name, "span") && node.parent.insert(marker, node, "br" === node.name);
                            break;
                        }
                        if (editor._selectionOverrides.showBlockCaretContainer(parentNode), 
                        caretElement.invalid) {
                            for (selection.setContent(bookmarkHtml, {
                                no_events: !0
                            }), parentNode = selection.getNode(), rootNode = editor.getBody(), 
                            9 == parentNode.nodeType ? parentNode = node = rootNode : node = parentNode; node !== rootNode; ) node = (parentNode = node).parentNode;
                            value = parentNode == rootNode ? rootNode.innerHTML : dom.getOuterHTML(parentNode), 
                            value = serializer.serialize(parser.parse(value.replace(/<span (id="mce_marker"|id=mce_marker).+?<\/span>/i, function() {
                                return serializer.serialize(fragment);
                            }))), parentNode == rootNode ? dom.setHTML(rootNode, value) : dom.setOuterHTML(parentNode, value);
                        } else value = serializer.serialize(fragment), function(editor, value, parentNode) {
                            var node, node2;
                            "all" === parentNode.getAttribute("data-mce-bogus") ? parentNode.parentNode.insertBefore(editor.dom.createFragment(value), parentNode) : (node = parentNode.firstChild, 
                            node2 = parentNode.lastChild, !node || node === node2 && "BR" === node.nodeName ? editor.dom.setHTML(parentNode, value) : editor.selection.setContent(value));
                        }(editor, value, parentNode);
                        merge && (root = editor.getBody(), tinymce.each(dom.select("*[data-mce-fragment]"), function(node) {
                            for (var testNode = node.parentNode; testNode && testNode != root; testNode = testNode.parentNode) textInlineElements[node.nodeName.toLowerCase()] && testNode === node && dom.remove(node, !0);
                        })), function(marker) {
                            var parentEditableFalseElm;
                            marker && (selection.scrollIntoView(marker), (parentEditableFalseElm = function(node) {
                                for (var root = editor.getBody(); node && node !== root; node = node.parentNode) if ("false" === editor.dom.getContentEditable(node)) return node;
                                return null;
                            }(marker)) ? (dom.remove(marker), selection.select(parentEditableFalseElm)) : (rng = dom.createRng(), 
                            (node = marker.previousSibling) && 3 == node.nodeType ? (rng.setStart(node, node.nodeValue.length), 
                            (node2 = marker.nextSibling) && 3 == node2.nodeType && (node.appendData(node2.data), 
                            node2.parentNode.removeChild(node2))) : (rng.setStartBefore(marker), 
                            rng.setEndBefore(marker)), parentEditableFalseElm = dom.getParent(marker, dom.isBlock), 
                            dom.remove(marker), parentEditableFalseElm && dom.isEmpty(parentEditableFalseElm) && (dom.empty(parentEditableFalseElm), 
                            rng.setStart(parentEditableFalseElm, 0), rng.setEnd(parentEditableFalseElm, 0), 
                            isTableCell(parentEditableFalseElm) || parentEditableFalseElm.getAttribute("data-mce-fragment") || !(marker = function(rng) {
                                if (rng = CaretPosition.fromRangeStart(rng), rng = new CaretWalker(editor.getBody()).next(rng)) return rng.toRange();
                            }(rng)) ? dom.add(parentEditableFalseElm, dom.create("br", {
                                "data-mce-bogus": "1"
                            })) : (rng = marker, dom.remove(parentEditableFalseElm))), 
                            selection.setRng(rng)));
                        }(dom.get("mce_marker")), body = editor.getBody(), tinymce.each(body.getElementsByTagName("*"), function(elm) {
                            elm.removeAttribute("data-mce-fragment");
                        }), selection.onSetContent.dispatch(selection, args), editor.addVisual();
                    }
                }(editor, (value = function(value) {
                    var details;
                    return "string" != typeof value ? (details = tinymce.extend({
                        paste: value.paste,
                        data: {
                            paste: value.paste
                        }
                    }, value), {
                        content: value.content,
                        details: details
                    }) : {
                        content: value,
                        details: {}
                    };
                }(value)).content, value.details);
            }
        };
    }(tinymce), function(tinymce) {
        var each = tinymce.each, TreeWalker = tinymce.dom.TreeWalker;
        tinymce.EditorCommands = function(editor) {
            var bookmark, dom = editor.dom, selection = editor.selection, commands = {
                state: {},
                exec: {},
                value: {}
            }, settings = editor.settings, formatter = editor.formatter;
            function execCommand(command, ui, value) {
                var func;
                return command = command.toLowerCase(), !!(func = commands.exec[command]) && (func(command, ui, value), 
                !0);
            }
            function queryCommandState(command) {
                var func;
                return command = command.toLowerCase(), (func = commands.state[command]) ? func(command) : -1;
            }
            function addCommands(command_list, type) {
                type = type || "exec", each(command_list, function(callback, command) {
                    each(command.toLowerCase().split(","), function(command) {
                        commands[type][command] = callback;
                    });
                });
            }
            function execNativeCommand(command, ui, value) {
                void 0 === ui && (ui = !1), void 0 === value && (value = null), 
                editor.getDoc().execCommand(command, ui, value);
            }
            function isFormatMatch(name) {
                return formatter.match(name);
            }
            function toggleFormat(name, value) {
                formatter.toggle(name, value ? {
                    value: value
                } : void 0);
            }
            function storeSelection(type) {
                bookmark = selection.getBookmark(type);
            }
            function restoreSelection() {
                selection.moveToBookmark(bookmark);
            }
            tinymce.extend(this, {
                execCommand: execCommand,
                queryCommandState: queryCommandState,
                queryCommandValue: function(command) {
                    var func;
                    return command = command.toLowerCase(), !!(func = commands.value[command]) && func(command);
                },
                addCommands: addCommands,
                queryCommandSupported: function(command) {
                    if (command = command.toLowerCase(), commands.exec[command]) return !0;
                    try {
                        return editor.getDoc().queryCommandSupported(command);
                    } catch (ex) {}
                    return !1;
                }
            }), addCommands({
                "mceResetDesignMode,mceBeginUndoLevel": function() {},
                "mceEndUndoLevel,mceAddUndoLevel": function() {
                    editor.undoManager.add();
                },
                "Cut,Copy,Paste": function(command) {
                    try {
                        execNativeCommand(command);
                    } catch (ex) {}
                },
                unlink: function() {
                    var elm;
                    selection.isCollapsed() ? (elm = editor.dom.getParent(selection.getStart(), "a")) && editor.dom.remove(elm, !0) : formatter.remove("link");
                },
                "JustifyLeft,JustifyCenter,JustifyRight,JustifyFull": function(command) {
                    var align = command.substring(7);
                    each("left,center,right,full".split(","), function(name) {
                        align != name && formatter.remove("align" + name);
                    }), toggleFormat("align" + align), execCommand("mceRepaint");
                },
                "InsertUnorderedList,InsertOrderedList": function(command) {
                    var listParent;
                    execNativeCommand(command), (command = dom.getParent(selection.getNode(), "ol,ul")) && (listParent = command.parentNode, 
                    /^(H[1-6]|P|ADDRESS|PRE)$/.test(listParent.nodeName)) && (storeSelection(), 
                    dom.split(listParent, command), restoreSelection());
                },
                "Bold,Italic,Underline,Strikethrough,Superscript,Subscript": function(command) {
                    toggleFormat(command);
                },
                "ForeColor,HiliteColor,FontName": function(command, ui, value) {
                    toggleFormat(command, value);
                },
                FontSize: function(command, ui, value) {
                    var fontClasses, fontSizes;
                    1 <= value && value <= 7 && (fontSizes = tinymce.explode(settings.font_size_style_values), 
                    value = (fontClasses = tinymce.explode(settings.font_size_classes)) ? fontClasses[value - 1] || value : fontSizes[value - 1] || value), 
                    toggleFormat(command, value);
                },
                ApplyFormat: function(command, ui, value) {
                    formatter.apply(value.name, value.args || {}, value.node || null);
                },
                RemoveFormat: function(command, ui, value) {
                    formatter.remove((value = value || {
                        name: command
                    }).name, value.args || {}, value.node || null);
                },
                ToggleFormat: function(command, ui, value) {
                    formatter.toggle((value = value || {
                        name: command
                    }).name, value.args || {}, value.node || null);
                },
                mceBlockQuote: function() {
                    toggleFormat("blockquote");
                },
                FormatBlock: function(command, ui, value) {
                    return toggleFormat(value || "p");
                },
                mceCleanup: function() {
                    var bookmark = selection.getBookmark();
                    editor.setContent(editor.getContent({
                        cleanup: !0
                    }), {
                        cleanup: !0
                    }), selection.moveToBookmark(bookmark);
                },
                mceRemoveNode: function(command, ui, value) {
                    (value = value || selection.getNode()) != editor.getBody() && (storeSelection(), 
                    editor.dom.remove(value, !0), restoreSelection());
                },
                mceSelectNodeDepth: function(command, ui, value) {
                    var counter = 0;
                    value = parseInt(value, 10), dom.getParent(selection.getNode(), function(node) {
                        if (1 == node.nodeType && counter++ == value) return selection.select(node), 
                        !1;
                    }, editor.getBody());
                },
                mceSelectNode: function(command, ui, value) {
                    selection.select(value);
                },
                mceInsertContent: function(command, ui, value) {
                    tinymce.InsertContent.insertAtCaret(editor, value);
                },
                mceInsertRawHTML: function(command, ui, value) {
                    selection.setContent("tiny_mce_marker"), editor.setContent(editor.getContent().replace(/tiny_mce_marker/g, function() {
                        return value;
                    }));
                },
                mceToggleFormat: function(command, ui, value) {
                    toggleFormat(value);
                },
                mceSetContent: function(command, ui, value) {
                    editor.setContent(value);
                },
                "Indent,Outdent": function(command) {
                    var value, intentValue = settings.indentation, indentUnit = /[a-z%]+$/i.exec(intentValue), intentValue = parseInt(intentValue, 10);
                    queryCommandState("InsertUnorderedList") || queryCommandState("InsertOrderedList") ? execNativeCommand(command) : (settings.forced_root_block || dom.getParent(selection.getNode(), dom.isBlock) || formatter.apply("div"), 
                    each(selection.getSelectedBlocks(), function(element) {
                        var indentStyleName;
                        "LI" != element.nodeName && (indentStyleName = editor.getParam("indent_use_margin", !1) ? "margin" : "padding", 
                        indentStyleName += "rtl" == dom.getStyle(element, "direction", !0) ? "Right" : "Left", 
                        "outdent" == command ? (value = Math.max(0, parseInt(element.style[indentStyleName] || 0, 10) - intentValue), 
                        dom.setStyle(element, indentStyleName, value ? value + indentUnit : "")) : (value = parseInt(element.style[indentStyleName] || 0, 10) + intentValue + indentUnit, 
                        dom.setStyle(element, indentStyleName, value)));
                    }));
                },
                mceRepaint: function() {
                    if (tinymce.isGecko) try {
                        storeSelection(!0), selection.getSel() && selection.getSel().selectAllChildren(editor.getBody()), 
                        selection.collapse(!0), restoreSelection();
                    } catch (ex) {}
                },
                InsertHorizontalRule: function() {
                    editor.execCommand("mceInsertContent", !1, "<hr />");
                },
                mceToggleVisualAid: function() {
                    editor.hasVisual = !editor.hasVisual, editor.addVisual();
                },
                mceReplaceContent: function(command, ui, value) {
                    editor.execCommand("mceInsertContent", !1, value.replace(/\{\$selection\}/g, selection.getContent({
                        format: "text"
                    })));
                },
                mceInsertLink: function(command, ui, value) {
                    var anchor;
                    "string" == typeof value && (value = {
                        href: value
                    }), anchor = dom.getParent(selection.getNode(), "a"), value.href = value.href.replace(" ", "%20"), 
                    anchor && value.href || formatter.remove("link"), value.href && formatter.apply("link", value, anchor);
                },
                selectAll: function() {
                    var root = dom.getRoot(), rng = dom.createRng();
                    selection.getRng().setStart ? ((rng = dom.createRng()).setStart(root, 0), 
                    rng.setEnd(root, root.childNodes.length), selection.setRng(rng)) : (rng = selection.getRng()).item || (rng.moveToElementText(root), 
                    rng.select());
                },
                delete: function() {
                    execNativeCommand("Delete");
                    var body = editor.getBody();
                    dom.isEmpty(body) && (editor.setContent(""), body.firstChild && dom.isBlock(body.firstChild) ? editor.selection.setCursorLocation(body.firstChild, 0) : editor.selection.setCursorLocation(body, 0));
                },
                mceNewDocument: function() {
                    editor.setContent("");
                },
                InsertLineBreak: function(command, ui, value) {
                    var brElm, extraBr, rng = selection.getRng(!0), offset = (new tinymce.dom.RangeUtils(dom).normalize(rng), 
                    rng.startOffset), container = rng.startContainer, parentBlock = (1 == container.nodeType && container.hasChildNodes() && (isAfterLastNodeInContainer = offset > container.childNodes.length - 1, 
                    container = container.childNodes[Math.min(offset, container.childNodes.length - 1)] || container, 
                    offset = isAfterLastNodeInContainer && 3 == container.nodeType ? container.nodeValue.length : 0), 
                    dom.getParent(container, dom.isBlock)), isAfterLastNodeInContainer = parentBlock ? dom.getParent(parentBlock.parentNode, dom.isBlock) : null, containerBlockName = isAfterLastNodeInContainer ? isAfterLastNodeInContainer.nodeName.toUpperCase() : "", value = value && value.ctrlKey;
                    return "LI" != containerBlockName || value || (parentBlock = isAfterLastNodeInContainer), 
                    container && 3 == container.nodeType && offset >= container.nodeValue.length && !function() {
                        for (var node, walker = new TreeWalker(container, parentBlock), nonEmptyElementsMap = editor.schema.getNonEmptyElements(); node = walker.next(); ) if (nonEmptyElementsMap[node.nodeName.toLowerCase()] || 0 < node.length) return 1;
                    }() && (brElm = dom.create("br"), rng.insertNode(brElm), rng.setStartAfter(brElm), 
                    rng.setEndAfter(brElm), extraBr = !0), brElm = dom.create("br"), 
                    rng.insertNode(brElm), containerBlockName = dom.create("span", {}, "&nbsp;"), 
                    brElm.parentNode.insertBefore(containerBlockName, brElm), selection.scrollIntoView(containerBlockName), 
                    dom.remove(containerBlockName), extraBr ? (rng.setStartBefore(brElm), 
                    rng.setEndBefore(brElm)) : (rng.setStartAfter(brElm), rng.setEndAfter(brElm)), 
                    selection.setRng(rng), editor.undoManager.add(), !0;
                }
            }), addCommands({
                "JustifyLeft,JustifyCenter,JustifyRight,JustifyFull": function(command) {
                    var name = "align" + command.substring(7), command = selection.getNode(), nodes = selection.isCollapsed() ? [ dom.getParent(command, dom.isBlock) ] : selection.getSelectedBlocks(), command = ("FIGCAPTION" == command.nodeName && (nodes = [ command ]), 
                    tinymce.map(nodes, function(node) {
                        return !!formatter.matchNode(node, name);
                    }));
                    return -1 !== tinymce.inArray(command, !0);
                },
                "Bold,Italic,Underline,Strikethrough,Superscript,Subscript": isFormatMatch,
                mceBlockQuote: function() {
                    return isFormatMatch("blockquote");
                },
                Outdent: function() {
                    var node;
                    if (settings.inline_styles) {
                        if ((node = dom.getParent(selection.getStart(), dom.isBlock)) && 0 < parseInt(node.style.paddingLeft, 10)) return !0;
                        if ((node = dom.getParent(selection.getEnd(), dom.isBlock)) && 0 < parseInt(node.style.paddingLeft, 10)) return !0;
                    }
                    return queryCommandState("InsertUnorderedList") || queryCommandState("InsertOrderedList") || !settings.inline_styles && !!dom.getParent(selection.getNode(), "BLOCKQUOTE");
                },
                "InsertUnorderedList,InsertOrderedList": function(command) {
                    var list = dom.getParent(selection.getNode(), "ul,ol,dl");
                    return list && ("insertunorderedlist" === command && "UL" === list.tagName || "insertorderedlist" === command && "OL" === list.tagName);
                }
            }, "state"), addCommands({
                "FontSize,FontName": function(command) {
                    var parent;
                    return (parent = dom.getParent(selection.getNode(), "span")) ? "fontsize" == command ? parent.style.fontSize : parent.style.fontFamily.replace(/, /g, ",").replace(/[\'\"]/g, "").toLowerCase() : 0;
                }
            }, "value"), addCommands({
                Undo: function() {
                    editor.undoManager.undo();
                },
                Redo: function() {
                    editor.undoManager.redo();
                }
            });
        };
    }(tinymce), function(tinymce) {
        var Dispatcher = tinymce.util.Dispatcher;
        tinymce.UndoManager = function(editor) {
            var um, beforeBookmark, onBeforeAdd, onAdd, onUndo, onRedo, index = 0, data = [];
            function addNonTypingUndoLevel() {
                um.typing = !1, um.add();
            }
            return onBeforeAdd = new Dispatcher(um), onAdd = new Dispatcher(um), 
            onUndo = new Dispatcher(um), onRedo = new Dispatcher(um), onAdd.add(function(undoman, level) {
                if (undoman.hasUndo()) return editor.onChange.dispatch(editor, level, undoman);
            }), onUndo.add(function(undoman, level) {
                return editor.onUndo.dispatch(editor, level, undoman);
            }), onRedo.add(function(undoman, level) {
                return editor.onRedo.dispatch(editor, level, undoman);
            }), editor.onInit.add(function() {
                um.add();
            }), editor.onBeforeExecCommand.add(function(ed, cmd, ui, val, args) {
                "Undo" == cmd || "Redo" == cmd || "mceRepaint" == cmd || args && args.skip_undo || um.beforeChange();
            }), editor.onExecCommand.add(function(ed, cmd, ui, val, args) {
                "Undo" == cmd || "Redo" == cmd || "mceRepaint" == cmd || args && args.skip_undo || um.add();
            }), editor.onSaveContent.add(addNonTypingUndoLevel), editor.dom.bind(editor.dom.getRoot(), "dragend", addNonTypingUndoLevel), 
            editor.dom.bind(editor.getBody(), "focusout", function() {
                !editor.removed && um.typing && addNonTypingUndoLevel();
            }), editor.onKeyUp.add(function(editor, e) {
                var keyCode = e.keyCode;
                e.isDefaultPrevented() || (33 <= keyCode && keyCode <= 36 || 37 <= keyCode && keyCode <= 40 || 45 == keyCode || 13 == keyCode || e.ctrlKey) && addNonTypingUndoLevel();
            }), editor.onKeyDown.add(function(editor, e) {
                var keyCode = e.keyCode;
                e.isDefaultPrevented() || (33 <= keyCode && keyCode <= 36 || 37 <= keyCode && keyCode <= 40 || 45 == keyCode ? um.typing && addNonTypingUndoLevel() : (e = e.ctrlKey && !e.altKey || e.metaKey, 
                !(keyCode < 16 || 20 < keyCode) || 224 === keyCode || 91 === keyCode || um.typing || e || (um.beforeChange(), 
                um.typing = !0, um.add())));
            }), editor.onMouseDown.add(function() {
                um.typing && addNonTypingUndoLevel();
            }), editor.addShortcut("meta+z", "", "Undo"), editor.addShortcut("meta+y,meta+shift+z", "", "Redo"), 
            um = {
                data: data,
                typing: !1,
                onBeforeAdd: onBeforeAdd,
                onAdd: onAdd,
                onUndo: onUndo,
                onRedo: onRedo,
                beforeChange: function() {
                    beforeBookmark = editor.selection.getBookmark(2, !0);
                },
                add: function(level) {
                    var i, lastLevel, settings = editor.settings;
                    if ((level = level || {}).content = tinymce.trim(editor.getContent({
                        format: "raw",
                        no_events: 1,
                        undo: !0
                    }).replace(/<span[^>]+data-mce-bogus[^>]+>[\u200B\uFEFF]+<\/span>/g, "")), 
                    um.onBeforeAdd.dispatch(um, level), (lastLevel = data[index]) && lastLevel.content == level.content) return null;
                    if (data[index] && (data[index].beforeBookmark = beforeBookmark), 
                    settings.custom_undo_redo_levels && data.length > settings.custom_undo_redo_levels) {
                        for (i = 0; i < data.length - 1; i++) data[i] = data[i + 1];
                        data.length--, index = data.length;
                    }
                    return level.bookmark = editor.selection.getBookmark(2, !0), 
                    index < data.length - 1 && (data.length = index + 1), data.push(level), 
                    index = data.length - 1, um.onAdd.dispatch(um, level), editor.isNotDirty = 0, 
                    level;
                },
                undo: function() {
                    var level;
                    return um.typing && (um.add(), um.typing = !1), 0 < index && (level = data[--index], 
                    editor.setContent(level.content, {
                        format: "raw",
                        undo: !0
                    }), editor.selection.moveToBookmark(level.beforeBookmark), um.onUndo.dispatch(um, level)), 
                    level;
                },
                redo: function() {
                    var level;
                    return index < data.length - 1 && (level = data[++index], editor.setContent(level.content, {
                        format: "raw",
                        undo: !0
                    }), editor.selection.moveToBookmark(level.bookmark), um.onRedo.dispatch(um, level)), 
                    level;
                },
                clear: function() {
                    data = [], index = 0, um.typing = !1;
                },
                hasUndo: function() {
                    return 0 < index || this.typing;
                },
                hasRedo: function() {
                    return index < data.length - 1 && !this.typing;
                }
            };
        };
    }(tinymce), tinymce.ForceBlocks = function(editor) {
        var settings = editor.settings, dom = editor.dom, selection = editor.selection, schema = editor.schema, blockElements = schema.getBlockElements();
        function addRootBlocks() {
            var rng, startContainer, startOffset, endContainer, endOffset, rootBlockNode, tempNode, wrapped, restoreSelection, tmpRng, rootNodeName, node = selection.getStart(), rootNode = editor.getBody(), forcedRootBlock = settings.forced_root_block;
            if (node && 1 === node.nodeType && forcedRootBlock && !node.getAttribute("data-mce-type")) {
                for (;node && node != rootNode; ) {
                    if (blockElements[node.nodeName]) return;
                    node = node.parentNode;
                }
                if ((rng = selection.getRng()).setStart) {
                    startContainer = rng.startContainer, startOffset = rng.startOffset, 
                    endContainer = rng.endContainer, endOffset = rng.endOffset;
                    try {
                        restoreSelection = editor.getDoc().activeElement === rootNode;
                    } catch (ex) {}
                } else rng.item && (node = rng.item(0), (rng = editor.getDoc().body.createTextRange()).moveToElementText(node)), 
                restoreSelection = rng.parentElement().ownerDocument === editor.getDoc(), 
                (tmpRng = rng.duplicate()).collapse(!0), startOffset = -1 * tmpRng.move("character", -16777215), 
                tmpRng.collapsed || ((tmpRng = rng.duplicate()).collapse(!1), endOffset = -1 * tmpRng.move("character", -16777215) - startOffset);
                for (node = rootNode.firstChild, rootNodeName = rootNode.nodeName.toLowerCase(); node; ) (3 === node.nodeType || 1 == node.nodeType && !blockElements[node.nodeName]) && schema.isValidChild(rootNodeName, forcedRootBlock.toLowerCase()) ? 3 === node.nodeType && 0 === node.nodeValue.length ? (node = (tempNode = node).nextSibling, 
                dom.remove(tempNode)) : (rootBlockNode || (rootBlockNode = dom.create(forcedRootBlock, editor.settings.forced_root_block_attrs), 
                node.parentNode.insertBefore(rootBlockNode, node), wrapped = !0), 
                node = (tempNode = node).nextSibling, rootBlockNode.appendChild(tempNode)) : (rootBlockNode = null, 
                node = node.nextSibling);
                if (wrapped && restoreSelection) {
                    if (rng.setStart) rng.setStart(startContainer, startOffset), 
                    rng.setEnd(endContainer, endOffset), selection.setRng(rng); else try {
                        (rng = editor.getDoc().body.createTextRange()).moveToElementText(rootNode), 
                        rng.collapse(!0), rng.moveStart("character", startOffset), 
                        0 < endOffset && rng.moveEnd("character", endOffset), rng.select();
                    } catch (ex) {}
                    editor.nodeChanged();
                }
            }
        }
        settings.forced_root_block && (editor.onKeyUp.add(addRootBlocks), editor.onNodeChange.add(addRootBlocks));
    }, function(tinymce) {
        var Event = tinymce.dom.Event, each = tinymce.each, extend = tinymce.extend, PreviewCss = tinymce.util.PreviewCss;
        tinymce.ControlManager = function(ed, s) {
            var self = this;
            s = s || {}, self.editor = ed, self.controls = {}, self.onAdd = new tinymce.util.Dispatcher(self), 
            self.onPostRender = new tinymce.util.Dispatcher(self), self.prefix = s.prefix || ed.id + "_", 
            self._cls = {}, self.classPrefix = "mce", self.onPostRender.add(function() {
                each(self.controls, function(c) {
                    c.postRender();
                });
            });
        }, tinymce.ControlManager.prototype = {
            get: function(id) {
                return this.controls[this.prefix + id] || this.controls[id];
            },
            setActive: function(id, s) {
                return (id = this.get(id)) && id.setActive(s), id;
            },
            setDisabled: function(id, s) {
                return (id = this.get(id)) && id.setDisabled(s), id;
            },
            add: function(c) {
                return c && (this.controls[c.id] = c, this.onAdd.dispatch(c, this)), 
                c;
            },
            createControl: function(name) {
                var ctrl, i, l, factories, self = this, editor = self.editor;
                for (self.controlFactories || (self.controlFactories = [], each(editor.plugins, function(plugin) {
                    plugin.createControl && self.controlFactories.push(plugin);
                })), i = 0, l = (factories = self.controlFactories).length; i < l; i++) if (ctrl = factories[i].createControl(name, self)) return self.add(ctrl);
                return "|" === name || "separator" === name ? self.createSeparator() : editor.buttons && (ctrl = editor.buttons[name]) ? self.createButton(name, ctrl) : self.add(ctrl);
            },
            createDropMenu: function(id, s, cc) {
                var c, bm, ed = this.editor;
                return (s = extend({
                    class: "mceDropDown",
                    constrain: ed.settings.constrain_menus
                }, s)).class += " " + (ed.settings.skin_class || "mceDefaultSkin"), 
                -1 == id.indexOf(this.prefix) && (id = this.prefix + id), cc = cc || this._cls.dropmenu || tinymce.ui.DropMenu, 
                (c = this.controls[id] = new cc(id, s)).onAddItem.add(function(c, o) {
                    var s = o.settings;
                    s.title && (s.title = ed.getLang(s.title, s.title)), !s.onclick && s.cmd && (s.onclick = function() {
                        ed.execCommand(s.cmd, s.ui || !1, s.value);
                    });
                }), tinymce.isIE && (c.onShowMenu.add(function() {
                    ed.focus(), bm = ed.selection.getBookmark(1);
                }), c.onHideMenu.add(function() {
                    bm && (ed.selection.moveToBookmark(bm), bm = 0);
                })), ed.onRemove.add(function() {
                    c.destroy();
                }), this.add(c);
            },
            createListBox: function(id, s, cc) {
                var ed = this.editor, c = this.get(id);
                return c || (s.title = ed.translate(s.title), s.scope = s.scope || ed, 
                s.onselect || (s.onselect = function(v) {
                    if (!s.cmd) return !1;
                    ed.execCommand(s.cmd, s.ui || !1, v || s.value);
                }), s = extend({
                    title: s.title,
                    class: "mce_" + id,
                    scope: s.scope,
                    control_manager: this
                }, s), id = this.prefix + id, c = new (cc || this._cls.listbox || tinymce.ui.ListBox)(id, s, ed), 
                this.controls[id] = c, tinymce.isWebKit && c.onPostRender.add(function(c, n) {
                    Event.add(n, "mousedown", function() {
                        ed.bookmark = ed.selection.getBookmark(1);
                    }), Event.add(n, "focus", function() {
                        ed.selection.moveToBookmark(ed.bookmark), ed.bookmark = null;
                    });
                }), c.hideMenu && ed.onMouseDown.add(c.hideMenu, c), this.add(c));
            },
            createStylesBox: function(id, s, cc) {
                var ed = this.editor;
                return s = tinymce.extend({
                    max_height: 384,
                    combobox: !0,
                    multiple: !0,
                    seperator: " "
                }, s || {}), (id = this.createListBox(id, s, cc)).onPostRender.add(function(c, n) {
                    var ctrl = c;
                    Array.isArray(ed.settings.importcss_classes) && !ctrl.hasClasses && (each(ed.settings.importcss_classes, function(item) {
                        var selector = /^(?:([a-z0-9\-_]+))?(\.[a-z0-9_\-\.]+)$/i.exec(item.selector || item);
                        selector && !selector[1] && (selector = selector[2].substr(1).split("."), 
                        each(selector, function(cls) {
                            ctrl.add(cls, cls, {
                                style: function() {
                                    return item.style || PreviewCss.getCssText(ed, {
                                        classes: cls
                                    });
                                }
                            });
                        }), PreviewCss.reset());
                    }), Array.isArray(ed.settings.importcss_classes)) && (ctrl.hasClasses = !0);
                }), id;
            },
            createButton: function(id, s, cc) {
                var c, ed = this.editor;
                return this.get(id) ? null : (s.title = ed.translate(s.title), s.label = ed.translate(s.label), 
                s.scope = s.scope || ed, s.onclick || s.menu_button || (s.onclick = function() {
                    ed.execCommand(s.cmd, s.ui || !1, s.value);
                }), s = extend({
                    title: s.title,
                    class: "mce_" + id,
                    scope: s.scope,
                    control_manager: this
                }, s), id = this.prefix + id, s.menu_button ? (c = new (cc || this._cls.menubutton || tinymce.ui.MenuButton)(id, s, ed), 
                ed.onMouseDown.add(c.hideMenu, c)) : c = new (this._cls.button || tinymce.ui.Button)(id, s, ed), 
                this.add(c));
            },
            createMenuButton: function(id, s, cc) {
                return (s = s || {}).menu_button = 1, this.createButton(id, s, cc);
            },
            createSplitButton: function(id, s, cc) {
                var ed = this.editor;
                return this.get(id) ? null : (s.title = ed.translate(s.title), s.scope = s.scope || ed, 
                !s.onclick && s.cmd && (s.onclick = function(v) {
                    ed.execCommand(s.cmd, s.ui || !1, v || s.value);
                }), !s.onselect && s.cmd && (s.onselect = function(v) {
                    ed.execCommand(s.cmd, s.ui || !1, v || s.value);
                }), s = extend({
                    title: s.title,
                    class: "mce_" + id,
                    scope: s.scope,
                    control_manager: this
                }, s), id = this.prefix + id, cc = cc || this._cls.splitbutton || tinymce.ui.SplitButton, 
                cc = this.add(new cc(id, s, ed)), ed.onMouseDown.add(cc.hideMenu, cc), 
                cc.onRenderMenu.add(function(e, m) {
                    m.onHideMenu.add(function() {
                        ed.nodeChanged(), ed.focus();
                    });
                }), this.add(cc));
            },
            createColorSplitButton: function(id, s, cc) {
                var c, bm, ed = this.editor;
                return this.get(id) ? null : (s.title = ed.translate(s.title), s.scope = s.scope || ed, 
                s.onclick || (s.onclick = function(v) {
                    tinymce.isIE && (bm = ed.selection.getBookmark(1)), ed.execCommand(s.cmd, s.ui || !1, v || s.value);
                }), s.onselect || (s.onselect = function(v) {
                    ed.execCommand(s.cmd, s.ui || !1, v || s.value);
                }), s = extend({
                    title: s.title,
                    class: "mce_" + id,
                    menu_class: ed.settings.skin_class || "mceDefaultSkin",
                    scope: s.scope,
                    more_colors_title: ed.getLang("more_colors")
                }, s), id = this.prefix + id, cc = cc || this._cls.colorsplitbutton || tinymce.ui.ColorSplitButton, 
                c = new cc(id, s, ed), ed.onMouseDown.add(c.hideMenu, c), ed.onRemove.add(function() {
                    c.destroy();
                }), c.onShowMenu.add(function() {
                    bm = ed.selection.getBookmark(1);
                }), c.onHideMenu.add(function() {
                    bm && (ed.selection.moveToBookmark(bm), bm = 0);
                }), this.add(c));
            },
            createTextBox: function(id, s, cc) {
                var ed = this.editor;
                return id = this.prefix + id, this.get(id) || (s.title = ed.translate(s.title), 
                s.label = ed.translate(s.label), s.scope = s.scope || ed, s = extend({
                    title: s.title,
                    class: "mce_" + id,
                    scope: s.scope,
                    control_manager: this
                }, s), cc = new (cc || tinymce.ui.TextBox)(id, s, ed), this.add(cc));
            },
            createUrlBox: function(id, s) {
                var ed = this.editor;
                return s.upload_label = ed.getLang(s.upload_label, "Upload"), s.picker_label = ed.getLang(s.picker_label, "Browse"), 
                this.createTextBox(id, s, tinymce.ui.UrlBox);
            },
            createCheckBox: function(id, s) {
                var ed = this.editor;
                return this.get(id) || (s.title = ed.translate(s.title), s.label = ed.translate(s.label), 
                s.scope = s.scope || ed, s = extend({
                    title: s.title,
                    class: "mce_" + id,
                    scope: s.scope,
                    control_manager: this
                }, s), id = this.prefix + id, id = new tinymce.ui.CheckBox(id, s, ed), 
                this.add(id));
            },
            createCustomValue: function(id, s) {
                var ed = this.editor;
                return id = this.prefix + id, id = new tinymce.ui.CustomValue(id, s, ed), 
                this.add(id);
            },
            createRepeatable: function(id, s) {
                var ed = this.editor;
                return id = this.prefix + id, this.get(id) || (s.scope = s.scope || ed, 
                s = extend({
                    class: "mce_" + id,
                    scope: s.scope,
                    control_manager: this
                }, s), id = new tinymce.ui.Repeatable(id, s, ed), this.add(id));
            },
            createPanel: function(id, s, cc) {
                var ed = this.editor;
                return s.class += " " + (ed.settings.skin_class || "mceDefaultSkin"), 
                ed = new (cc || this._cls.panel || tinymce.ui.Panel)(id, s, this.editor), 
                this.get(id) ? null : this.add(ed);
            },
            createContextPanel: function(id, s) {
                var cc = tinymce.ui.ContextPanel;
                return this.createPanel(id, s, cc);
            },
            createToolbar: function(id, s, cc) {
                return id = this.prefix + id, cc = new (cc || this._cls.toolbar || tinymce.ui.Toolbar)(id, s, this.editor), 
                this.get(id) ? null : this.add(cc);
            },
            createToolbarGroup: function(id, s, cc) {
                return id = this.prefix + id, cc = new (cc || this._cls.toolbarGroup || tinymce.ui.ToolbarGroup)(id, s, this.editor), 
                this.get(id) ? null : this.add(cc);
            },
            createLayout: function(id, s, cc) {
                return id = this.prefix + id, cc = new (cc || this._cls.layout || tinymce.ui.Layout)(id, s, this.editor), 
                this.get(id) ? null : this.add(cc);
            },
            createForm: function(id, s) {
                return id = this.prefix + id, id = new tinymce.ui.Form(id, s, this.editor), 
                this.add(id);
            },
            createSeparator: function(cc) {
                return new (cc || this._cls.separator || tinymce.ui.Separator)();
            },
            setControlType: function(n, c) {
                return this._cls[n.toLowerCase()] = c;
            },
            destroy: function() {
                each(this.controls, function(c) {
                    c.destroy();
                }), this.controls = null;
            }
        };
    }(tinymce), function(tinymce) {
        var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each, Dispatcher = tinymce.util.Dispatcher;
        function ucfirst(s) {
            return s.substring(0, 1).toUpperCase() + s.substring(1);
        }
        function updateWithTouchData(e) {
            var keys, i;
            if (e.changedTouches) for (keys = "screenX screenY pageX pageY clientX clientY".split(" "), 
            i = 0; i < keys.length; i++) e[keys[i]] = e.changedTouches[0][keys[i]];
        }
        tinymce.create("tinymce.WindowManager", {
            WindowManager: function(ed) {
                this.editor = ed, this.onOpen = new Dispatcher(this), this.onClose = new Dispatcher(this), 
                this.params = {}, this.features = {}, this.zIndex = 700002, this.count = 0, 
                this.windows = {};
            },
            createInstance: function(cl, a, b, c, d, e) {
                return new (tinymce.resolve(cl))(a, b, c, d, e);
            },
            open: function(f, p) {
                var id, self = this, ed = self.editor, dh = 0, p = (p = p || {}, 
                (f = f || {}).type || (self.bookmark = ed.selection.getBookmark(1)), 
                id = DOM.uniqueId("mce_window_"), f.width = parseInt(f.width || 0, 10), 
                f.height = parseInt(f.height || 0, 10), p.mce_window_id = id, self.features = f, 
                self.params = p, self.onOpen.dispatch(self, f, p), '<div class="mceModalBody" id="' + id + '" dir="' + ed.settings.skin_directionality + '">   <div class="mceModalContainer">       <div class="mceModalHeader" id="' + id + '_header">           <h5 class="mceModalTitle" id="' + id + '_title">' + (f.title || "") + '</h5>           <button class="mceModalClose" type="button" title="' + ed.getLang("close", "Close") + '"></button>       </div>       <div class="mceModalContent" id="' + id + '_content"></div>   </div></div>'), modal = DOM.select(".mceModal");
                return modal.length || (modal = DOM.add(DOM.doc.body, "div", {
                    class: ed.settings.skin_class + " mceModal",
                    role: "dialog",
                    "aria-labelledby": id + "_title"
                }, ""), !1 !== f.overlay && DOM.add(modal, "div", {
                    class: "mceModalOverlay"
                })), DOM.add(modal, "div", {
                    class: "mceModalFrame",
                    id: id + "_frame"
                }, p), f.fixed ? (DOM.addClass(modal, "mceModalFixed"), Event.add(id, "blur", function() {
                    self.close(null, id);
                })) : DOM.addClass(DOM.select(".mceModalHeader", modal), "mceModalMove"), 
                f.buttons = f.buttons || [], (ed = f.url || f.file) ? (!1 !== f.addver && (ed = tinymce._addVer(ed)), 
                DOM.addClass(id, "mceLoading"), DOM.addClass(id + "_content", "mceModalContentIframe"), 
                p = DOM.add(id + "_content", "iframe", {
                    id: id + "_ifr",
                    src: 'javascript:""',
                    frameBorder: 0,
                    "aria-label": "Dialog Content Iframe"
                }), DOM.setAttrib(p, "src", ed), Event.add(p, "load", function() {
                    DOM.removeClass(id, "mceLoading");
                })) : (f.type && DOM.addClass(id, "mceModal" + ucfirst(f.type)), 
                f.buttons.length || f.buttons.push({
                    id: "cancel",
                    title: self.editor.getLang("cancel", "Cancel"),
                    onclick: function(e) {
                        Event.cancel(e), self.close(null, id);
                    }
                }), f.content && ("string" == typeof f.content && DOM.setHTML(id + "_content", "<form>" + f.content.replace("\n", "") + "</form>"), 
                f.content.nodeType) && DOM.add(id + "_content", DOM.create("form", {}, f.content)), 
                f.items && (tinymce.is(f.items, "array") || (f.items = [ f.items ]), 
                each(f.items, function(ctrl) {
                    var form = DOM.add(id + "_content", "form");
                    ctrl.renderTo(form), self.onClose.add(function(e, win) {
                        win.id == id && ctrl.destroy();
                    });
                })), Event.add(id, "keydown", function(e) {
                    var nodes, endIndex, tabIndex;
                    9 === e.keyCode && (nodes = DOM.select("input, button, select, textarea, .mceListBox", DOM.get(id)), 
                    (nodes = tinymce.grep(nodes, function(node) {
                        return !node.disabled && !DOM.isHidden(node) && 0 <= node.getAttribute("tabindex");
                    })).length) && (DOM.setAttrib(nodes, "tabindex", 0), e.shiftKey && nodes.reverse(), 
                    endIndex = Math.max(0, nodes.length - 1), tabIndex = function(nodes, node) {
                        for (var i = 0; i < nodes.length; i++) if (nodes[i] === node) return i;
                        return -1;
                    }(nodes, e.target), tabIndex++, nodes[tabIndex = endIndex < (tabIndex = Math.max(tabIndex, 0)) ? 0 : tabIndex].focus(), 
                    DOM.setAttrib(nodes[tabIndex], "tabindex", 1), e.preventDefault(), 
                    e.stopImmediatePropagation());
                })), f.buttons.length && (DOM.add(DOM.select(".mceModalContainer", id), "div", {
                    class: "mceModalFooter",
                    id: id + "_footer"
                }), each(f.buttons, function(button) {
                    "cancel" === button.id && (button.onclick = function(e) {
                        self.close(null, id);
                    });
                    var attribs = {
                        id: id + "_" + button.id,
                        class: "mceButton",
                        type: "button"
                    }, btn = (button.autofocus && (attribs.autofocus = !0), button.title = button.title || "OK", 
                    DOM.add(id + "_footer", "button", attribs, button.title));
                    button.icon && DOM.add(btn, "span", {
                        class: "mceIcon mce_" + button.icon,
                        role: "presentation"
                    }), each(tinymce.explode(button.classes), function(cls) {
                        DOM.addClass(btn, "mceButton" + ucfirst(cls));
                    }), button.onclick && Event.add(btn, "click", function(e) {
                        Event.cancel(e), button.onclick.call(self, e);
                    }), button.onsubmit && Event.add(btn, "click", function(e) {
                        Event.cancel(e), button.onsubmit.call(self, e), e.cancelSubmit || self.close(null, id);
                    });
                })), Event.add(id, "keydown", function(evt) {
                    if (27 === evt.keyCode) self.close(null, id), evt.preventDefault(), 
                    evt.stopImmediatePropagation(); else if (13 === evt.keyCode) {
                        if (evt.target) {
                            if ("TEXTAREA" === evt.target.nodeName) return;
                            "BUTTON" === evt.target.nodeName && Event.fire(evt.target, "click");
                        }
                        evt.preventDefault(), evt.stopImmediatePropagation();
                    }
                }), Event.add(DOM.select("button.mceModalClose", DOM.get(id)), "click", function(evt) {
                    self.close(null, id), evt.preventDefault(), evt.stopImmediatePropagation();
                }), f.type || (dh += DOM.get(id + "_header").clientHeight), f.size ? DOM.addClass(id, f.size) : (f.width && DOM.setStyle(id, "width", f.width + 0), 
                f.height && DOM.setStyle(id, "height", f.height + dh)), f.fixed || Event.add(DOM.win, "resize orientationchange", function() {
                    DOM.get(id) && self.position(id);
                }), Event.add(id, "mousedown", function(e) {
                    var n = e.target;
                    if (!/(input|select|textarea|button|label)/i.test(n.nodeName)) return self.focus(id), 
                    DOM.hasClass(n, ".mceModalClose") || f.fixed || !DOM.hasClass(n, "mceModalMove") && !DOM.hasClass(n.parentNode, "mceModalMove") ? void 0 : self._startDrag(id, e, "Move");
                }), self.windows[id] = modal = {
                    id: id,
                    features: f,
                    elm: DOM.get(id),
                    moveTo: function(x, y) {
                        return self.moveTo(id, x, y);
                    },
                    close: function() {
                        return self.close(null, id);
                    },
                    focus: function() {
                        return self.focus(id);
                    }
                }, f.open && "function" == typeof f.open && f.open.call(modal, modal), 
                DOM.setAttrib(id, "aria-hidden", "false"), self.position(id), self.focus(id), 
                self.count++, modal;
            },
            close: function(win, id) {
                if (id = this._findId(id || win), !(win = this.windows[id] || this._frontWindow())) return !1;
                this.count--, 0 === this.count && (DOM.remove(DOM.select(".mceModal")), 
                DOM.setAttrib(DOM.doc.body, "aria-hidden", "false"), this.editor.focus()), 
                this.onClose.dispatch(this, win);
                var f = win.features || {};
                return f.close && "function" == typeof f.close && f.close.call(win || this, win), 
                Event.clear(id), Event.clear(id + "_ifr"), DOM.setAttrib(id + "_ifr", "src", 'javascript:""'), 
                DOM.remove(id + "_frame"), DOM.remove(id), delete this.windows[id], 
                0 < this.count && (f = this._frontWindow()) && f.focus(), !0;
            },
            setTitle: function(win, title) {
                win = this._findId(win), (win = DOM.get(win + "_title")) && !win.innerHTML && (win.innerHTML = DOM.encode(title));
            },
            confirm: function(txt, cb, s) {
                var self = this;
                self.open({
                    title: "",
                    type: "confirm",
                    buttons: [ {
                        title: self.editor.getLang("no", "No"),
                        id: "cancel"
                    }, {
                        title: self.editor.getLang("yes", "Yes"),
                        id: "ok",
                        classes: "primary",
                        autofocus: !0,
                        onsubmit: function(s) {
                            cb && cb.call(s || self, s);
                        }
                    } ],
                    content: "<p>" + DOM.encode(self.editor.getLang(txt, txt)) + "</p>"
                });
            },
            alert: function(txt, cb, s) {
                var self = this;
                self.open({
                    title: "",
                    type: "alert",
                    buttons: [ {
                        title: self.editor.getLang("cancel", "Cancel"),
                        id: "cancel"
                    }, {
                        title: self.editor.getLang("ok", "Ok"),
                        id: "ok",
                        classes: "primary",
                        autofocus: !0,
                        onsubmit: function(s) {
                            cb && cb.call(s || self, s);
                        }
                    } ],
                    content: "<p>" + DOM.encode(self.editor.getLang(txt, txt)) + "</p>"
                });
            },
            prompt: function(txt, cb, s) {
                var self = this, html = '<div class="mceModalRow">   <div class="mceModalControl">       <input type="text" id="' + self.editor.id + '_prompt_input" autofocus />   </div></div>';
                self.open({
                    title: "",
                    type: "prompt",
                    buttons: [ {
                        title: self.editor.getLang("cancel", "Cancel"),
                        id: "cancel"
                    }, {
                        title: self.editor.getLang("ok", "Ok"),
                        id: "ok",
                        classes: "primary",
                        autofocus: !0,
                        onsubmit: function() {
                            var value = DOM.getValue(self.editor.id + "_prompt_input");
                            cb && cb.call(s || self, value);
                        }
                    } ],
                    content: html
                });
            },
            resizeBy: function(dw, dh, id) {},
            moveTo: function(id, x, y) {
                DOM.setStyles(id, {
                    left: x,
                    top: y
                });
            },
            position: function(id) {
                var p = DOM.getRect(id), vp = DOM.getViewPort(), top = Math.round(Math.max(vp.y + 10, vp.y + vp.h / 2 - p.h / 2)), vp = Math.round(Math.max(vp.x + 10, vp.x + vp.w / 2 - p.w / 2));
                DOM.setStyles(id, {
                    left: vp,
                    top: top
                });
            },
            focus: function(id) {
                var win = this.windows[id];
                if (win) if (win.zIndex = this.zIndex++, DOM.setStyle(id + "_frame", "zIndex", win.zIndex), 
                DOM.removeClass(this.lastId, "mceFocus"), DOM.addClass(id + "_frame", "mceFocus"), 
                this.lastId = id + "_frame", DOM.get(id).focus(), DOM.get(id + "_ifr")) DOM.get(id + "_ifr").focus(); else {
                    var nodes = DOM.select("input, select, button, textarea", DOM.get(id));
                    nodes[0].focus();
                    for (var i = 0; i < nodes.length; i++) {
                        var node = nodes[i];
                        if (0 <= node.getAttribute("tabindex") && node.getAttribute("autofocus")) {
                            node.focus();
                            break;
                        }
                    }
                }
            },
            _startDrag: function(id, se, ac) {
                var mu, mm, sx, sy, p, vp, d = DOM.doc;
                function end() {
                    Event.remove(d, "mouseup touchend", mu), Event.remove(d, "mousemove touchmove", mm), 
                    DOM.removeClass(id, "dragging");
                }
                DOM.hasClass(id, "dragging") ? end() : (updateWithTouchData(se), 
                p = DOM.getRect(id), (vp = DOM.getViewPort()).w -= 2, vp.h -= 2, 
                DOM.addClass(id, "dragging"), sx = se.screenX, sy = se.screenY, 
                mu = Event.add(d, "mouseup touchend", function(e) {
                    return updateWithTouchData(e), end(), Event.cancel(e);
                }), mm = Event.add(d, "mousemove touchmove", function(e) {
                    updateWithTouchData(e);
                    var x = e.screenX - sx, y = e.screenY - sy, x = Math.max(p.x + x, 10), y = Math.max(p.y + y, 10);
                    return DOM.setStyles(id, {
                        left: x,
                        top: y
                    }), Event.cancel(e);
                }));
            },
            _frontWindow: function() {
                var fw, ix = 0;
                return tinymce.each(this.windows, function(win) {
                    win.zIndex > ix && (ix = (fw = win).zIndex);
                }), fw;
            },
            _findId: function(w) {
                return "string" != typeof w && each(this.windows, function(wo) {
                    var ifr = DOM.get(wo.id + "_ifr");
                    if (ifr && w == ifr.contentWindow) return w = wo.id, !1;
                }), w;
            }
        });
    }(tinymce), function(tinymce) {
        tinymce.Formatter = function(ed) {
            var formatChangeData, undef, formats = {}, each = tinymce.each, dom = ed.dom, selection = ed.selection, TreeWalker = tinymce.dom.TreeWalker, rangeUtils = new tinymce.dom.RangeUtils(dom), isValidChild = ed.schema.isValidChild, isBlock = dom.isBlock, forcedRootBlock = ed.settings.forced_root_block, nodeIndex = dom.nodeIndex, INVISIBLE_CHAR = "\ufeff", MCE_ATTR_RE = /^(src|href|style)$/, FALSE = !1, TRUE = !0, getContentEditable = dom.getContentEditable, hasCaretNodeSibling = function(node) {
                for (var sibling = node.parentNode.firstChild; sibling; ) {
                    if (sibling !== node && isCaretNode(sibling)) return !0;
                    sibling = sibling.nextSibling;
                }
                return !1;
            }, canFormatBR = function(editor, format, node, parentName) {
                return !(!1 === editor.settings.format_empty_lines || !format.inline || !node.parentNode) && ("a" == format.inline || editor.schema.getTextRootBlockElements()[parentName] && !editor.dom.isEmpty(node.parentNode) && !hasCaretNodeSibling(node));
            };
            function isTextBlock(name) {
                return name.nodeType && (name = name.nodeName), !!ed.schema.getTextBlockElements()[name.toLowerCase()];
            }
            function isTableCell(node) {
                return /^(TH|TD)$/.test(node.nodeName);
            }
            function getParents(node, selector) {
                return dom.getParents(node, selector, dom.getRoot());
            }
            function isCaretNode(node) {
                return 1 === node.nodeType && "_mce_caret" === node.id;
            }
            function isBogusBr(node) {
                return "BR" == node.nodeName && node.getAttribute("data-mce-bogus") && !node.nextSibling;
            }
            function get(name) {
                return name ? formats[name] : formats;
            }
            function register(name, format) {
                var current;
                name && ("string" != typeof name ? each(name, function(format, name) {
                    register(name, format);
                }) : (format = format.length ? format : [ format ], each(format, function(format) {
                    format.deep === undef && (format.deep = !format.selector), format.split === undef && (format.split = !format.selector || format.inline), 
                    format.remove === undef && format.selector && !format.inline && (format.remove = "none"), 
                    format.selector && format.inline && (format.mixed = !0, format.block_expand = !0), 
                    "string" == typeof format.classes && (format.classes = format.classes.split(/\s+/));
                }), formats[name] ? (current = (current = formats[name]).length ? current : [ current ], 
                formats[name] = current.concat(format)) : formats[name] = format));
            }
            function matchesUnInheritedFormatSelector(node, name) {
                var formatList = get(name);
                if (formatList) for (var i = 0; i < formatList.length; i++) if (!1 === formatList[i].inherit && formatList[i].selector && dom.is(node, formatList[i].selector)) return 1;
            }
            function getTextDecoration(node) {
                var decoration;
                return ed.dom.getParent(node, function(n) {
                    return (decoration = ed.dom.getStyle(n, "text-decoration")) && "none" !== decoration;
                }), decoration;
            }
            function processUnderlineAndColor(node) {
                var textDecoration;
                1 === node.nodeType && node.parentNode && 1 === node.parentNode.nodeType && (textDecoration = getTextDecoration(node.parentNode), 
                ed.dom.getStyle(node, "color") && textDecoration ? ed.dom.setStyle(node, "text-decoration", textDecoration) : ed.dom.getStyle(node, "text-decoration") === textDecoration && ed.dom.setStyle(node, "text-decoration", null));
            }
            function apply(name, vars, node) {
                var bookmark, rng, formatList = get(name), format = formatList[0], isCollapsed = !node && selection.isCollapsed();
                function setElementFormat(elm, fmt) {
                    var styleVal;
                    fmt = fmt || format, elm && (each(fmt.styles, function(value, name) {
                        dom.setStyle(elm, name, replaceVars(value, vars));
                    }), fmt.styles && (styleVal = dom.serializeStyle(dom.parseStyle(elm.style.cssText), elm.nodeName)) && elm.setAttribute("data-mce-style", styleVal), 
                    each(fmt.attributes, function(value, name) {
                        dom.setAttrib(elm, name, replaceVars(value, vars));
                    }), each(fmt.classes, function(value) {
                        value = replaceVars(value, vars), dom.hasClass(elm, value) || dom.addClass(elm, value);
                    }), fmt.onformat) && fmt.onformat(elm, fmt, vars, node);
                }
                function applyNodeStyle(formatList, node) {
                    var found = !1;
                    return !!format.selector && (each(formatList, function(format) {
                        return "collapsed" in format && format.collapsed !== isCollapsed || !dom.is(node, format.selector) || isCaretNode(node) || isBogusBr(node) ? void 0 : (setElementFormat(node, format), 
                        !(found = !0));
                    }), found);
                }
                function applyRngStyle(rng, bookmark, node_specific) {
                    var newWrappers = [], contentEditable = !0, wrapName = format.inline || format.block, wrapElm = dom.create(wrapName);
                    setElementFormat(wrapElm), rangeUtils.walk(rng, function(nodes) {
                        var currentWrapElm;
                        each(nodes, function process(node) {
                            var nodeName, parentName, found, hasContentEditableState, lastContentEditable;
                            isBogusBr(node) || isBookmarkNode(node) || (lastContentEditable = contentEditable, 
                            nodeName = node.nodeName.toLowerCase(), parentName = node.parentNode.nodeName.toLowerCase(), 
                            1 === node.nodeType && getContentEditable(node) && (lastContentEditable = contentEditable, 
                            contentEditable = "true" === getContentEditable(node), 
                            hasContentEditableState = !function(node) {
                                return ed.schema.getShortEndedElements()[node.nodeName.toLowerCase()];
                            }(node)), isEq(nodeName, "br") && !canFormatBR(ed, format, node, parentName) ? (currentWrapElm = 0, 
                            format.block && dom.remove(node)) : format.wrapper && matchNode(node, name, vars) ? currentWrapElm = 0 : contentEditable && !hasContentEditableState && format.block && !format.wrapper && isTextBlock(nodeName) && isValidChild(parentName, wrapName) ? (setElementFormat(node = dom.rename(node, wrapName)), 
                            newWrappers.push(node), currentWrapElm = 0) : format.selector && (found = applyNodeStyle(formatList, node), 
                            !format.inline || found) ? currentWrapElm = 0 : !contentEditable || hasContentEditableState || !isValidChild(wrapName, nodeName) || !isValidChild(parentName, wrapName) || function(node) {
                                return !node_specific && 3 === node.nodeType && 1 === node.nodeValue.length && 65279 === node.nodeValue.charCodeAt(0);
                            }(node) || isCaretNode(node) || isBogusBr(node) || isBookmarkNode(node) || format.inline && isBlock(node) ? (currentWrapElm = 0, 
                            each(tinymce.grep(node.childNodes), process), hasContentEditableState && (contentEditable = lastContentEditable), 
                            currentWrapElm = 0) : (currentWrapElm || (currentWrapElm = dom.clone(wrapElm, FALSE), 
                            node.parentNode.insertBefore(currentWrapElm, node), 
                            newWrappers.push(currentWrapElm)), currentWrapElm.appendChild(node)));
                        });
                    }), !0 !== format.links && !1 !== format.wrap_links || each(newWrappers, function(node) {
                        !function process(node) {
                            "A" === node.nodeName && setElementFormat(node, format), 
                            each(tinymce.grep(node.childNodes), process);
                        }(node);
                    }), each(newWrappers, function(node) {
                        var childCount;
                        if (childCount = function(node) {
                            var count = 0;
                            return each(node.childNodes, function(node) {
                                isWhiteSpaceNode(node) || isBookmarkNode(node) || count++;
                            }), count;
                        }(node), (1 < newWrappers.length || !isBlock(node)) && 0 === childCount) dom.remove(node, 1); else if (1 < childCount && isEq(node.firstChild.nodeName, "BR") && dom.remove(node.firstChild), 
                        format.inline || format.wrapper) {
                            if (format.exact || 1 !== childCount || (node = function(node) {
                                var clone, child = function(root) {
                                    var child = !1;
                                    return each(root.childNodes, function(node) {
                                        if (function(node) {
                                            return !(1 != node.nodeType || isBookmarkNode(node) || isWhiteSpaceNode(node) || isCaretNode(node) || isBogusBr(node));
                                        }(node)) return child = node, !1;
                                    }), child;
                                }(node);
                                return child && !isBookmarkNode(child) && matchName(child, format) && (setElementFormat(clone = dom.clone(child, FALSE)), 
                                dom.replace(clone, node, TRUE), dom.remove(child, 1)), 
                                clone || node;
                            }(node)), each(formatList, function(format) {
                                each(dom.select(format.inline, node), function(child) {
                                    isBookmarkNode(child) || removeFormat(format, vars, child, format.exact ? child : null);
                                });
                            }), matchNode(node.parentNode, name, vars)) return dom.remove(node, 1), 
                            node = 0, TRUE;
                            format.merge_with_parents && dom.getParent(node.parentNode, function(parent) {
                                if (matchNode(parent, name, vars)) return dom.remove(node, 1), 
                                node = 0, TRUE;
                            }), node && !1 !== format.merge_siblings && (node = mergeSiblings(getNonWhiteSpaceSibling(node), node), 
                            node = mergeSiblings(node, getNonWhiteSpaceSibling(node, TRUE)));
                        }
                    });
                }
                if ("false" === getContentEditable(selection.getNode())) {
                    node = selection.getNode();
                    for (var i = 0, l = formatList.length; i < l; i++) if (formatList[i].ceFalseOverride && formatList[i].selector && dom.is(node, formatList[i].selector)) return setElementFormat(node, formatList[i]), 
                    !0;
                } else format && (node && node.parentNode ? node.nodeType ? applyNodeStyle(formatList, node) || ((rng = dom.createRng()).setStartBefore(node), 
                rng.setEndAfter(node), applyRngStyle(expandRng(rng, formatList), 0, !0)) : applyRngStyle(node, 0, !0) : isCollapsed && format.inline && !dom.select("td.mceSelected,th.mceSelected,div.mceSelected").length ? performCaretAction("apply", name, vars) : (rng = selection.getNode(), 
                forcedRootBlock || !formatList[0].defaultBlock || dom.getParent(rng, dom.isBlock) || apply(formatList[0].defaultBlock), 
                selection.setRng(function() {
                    var rng = selection.getRng(), start = rng.startContainer, end = rng.endContainer;
                    return start != end && 0 === rng.endOffset && (end = (3 == (start = function(start, end) {
                        var walker = new TreeWalker(end);
                        for (node = walker.prev2(); node; node = walker.prev2()) {
                            if (3 == node.nodeType && 0 < node.data.length) return node;
                            if (1 < node.childNodes.length || node == start || "BR" == node.tagName) return node;
                        }
                    }(start, end)).nodeType ? start.data : start.childNodes).length, 
                    rng.setEnd(start, end)), rng;
                }()), bookmark = selection.getBookmark(), applyRngStyle(expandRng(selection.getRng(TRUE), formatList)), 
                format.styles && (format.styles.color || format.styles.textDecoration) && (tinymce.walk(rng, processUnderlineAndColor, "childNodes"), 
                processUnderlineAndColor(rng)), selection.moveToBookmark(bookmark), 
                moveStart(selection.getRng(TRUE)), ed.nodeChanged()));
            }
            function remove(name, vars, node, similar) {
                var rng, formatList = get(name), format = formatList[0], contentEditable = !0;
                function splitToFormatRoot(container) {
                    return function(formatRoot, container, target) {
                        var parent, clone, lastClone, firstClone, i, formatRootParent;
                        if (formatRoot) {
                            for (formatRootParent = formatRoot.parentNode, parent = container.parentNode; parent && parent != formatRootParent; parent = parent.parentNode) {
                                for (clone = dom.clone(parent, FALSE), i = 0; i < formatList.length; i++) if (removeFormat(formatList[i], vars, clone, clone)) {
                                    clone = 0;
                                    break;
                                }
                                clone && (lastClone && clone.appendChild(lastClone), 
                                firstClone = firstClone || clone, lastClone = clone);
                            }
                            format.mixed && isBlock(formatRoot) || (container = dom.split(formatRoot, container)), 
                            lastClone && (target.parentNode.insertBefore(lastClone, target), 
                            firstClone.appendChild(target));
                        }
                        return container;
                    }(function(container) {
                        var formatRoot;
                        return each(getParents(container.parentNode).reverse(), function(parent) {
                            var format;
                            formatRoot || "_start" == parent.id || "_end" == parent.id || (format = matchNode(parent, name, vars, similar)) && !1 !== format.split && (formatRoot = parent);
                        }), formatRoot;
                    }(container), container, container);
                }
                function unwrap(start) {
                    var node = dom.get(start ? "_start" : "_end"), out = node[start ? "firstChild" : "lastChild"];
                    return 3 == (out = isBookmarkNode(out) ? out[start ? "firstChild" : "lastChild"] : out).nodeType && 0 === out.data.length && (out = start ? node.previousSibling || node.nextSibling : node.nextSibling || node.previousSibling), 
                    dom.remove(node, !0), out;
                }
                function removeRngStyle(rng) {
                    var startContainer, endContainer, commonAncestorContainer = rng.commonAncestorContainer;
                    rng = expandRng(rng, formatList, TRUE), format.split && ((startContainer = getContainer(rng, TRUE)) != (endContainer = getContainer(rng)) ? (commonAncestorContainer && /^T(HEAD|BODY|FOOT|R)$/.test(commonAncestorContainer.nodeName) && /^(TH|TD)$/.test(endContainer.nodeName) && endContainer.firstChild && (endContainer = endContainer.firstChild || endContainer), 
                    !dom.isChildOf(startContainer, endContainer) || isBlock(endContainer) || isTableCell(startContainer) || isTableCell(endContainer) ? (startContainer = wrap(startContainer, "span", {
                        id: "_start",
                        "data-mce-type": "bookmark"
                    }), endContainer = wrap(endContainer, "span", {
                        id: "_end",
                        "data-mce-type": "bookmark"
                    }), splitToFormatRoot(startContainer), splitToFormatRoot(endContainer), 
                    startContainer = unwrap(TRUE), endContainer = unwrap()) : (splitToFormatRoot(startContainer = wrap(startContainer, "span", {
                        id: "_start",
                        "data-mce-type": "bookmark"
                    })), startContainer = unwrap(TRUE))) : startContainer = endContainer = splitToFormatRoot(startContainer), 
                    rng.startContainer = startContainer.parentNode || startContainer, 
                    rng.startOffset = nodeIndex(startContainer), rng.endContainer = endContainer.parentNode || endContainer, 
                    rng.endOffset = nodeIndex(endContainer) + 1), rangeUtils.walk(rng, function(nodes) {
                        each(nodes, function(node) {
                            (function process(node) {
                                var children, i, l;
                                if (1 === node.nodeType && getContentEditable(node) && (contentEditable = "true" === getContentEditable(node)), 
                                children = tinymce.grep(node.childNodes), contentEditable || format.ceFalseOverride || function(node) {
                                    return getParents(node, "FIGURE") && "FIGURE" != node.nodeName;
                                }(node)) for (i = 0, l = formatList.length; i < l && !removeFormat(formatList[i], vars, node, node); i++);
                                if (format.deep && children.length) for (i = 0, 
                                l = children.length; i < l; i++) process(children[i]);
                            })(node), 1 === node.nodeType && "underline" === ed.dom.getStyle(node, "text-decoration") && node.parentNode && "underline" === getTextDecoration(node.parentNode) && removeFormat({
                                deep: !1,
                                exact: !0,
                                inline: "span",
                                styles: {
                                    textDecoration: "underline"
                                }
                            }, null, node);
                        });
                    });
                }
                if (node) node.nodeType ? ((rng = dom.createRng()).setStartBefore(node), 
                rng.setEndAfter(node), removeRngStyle(rng)) : removeRngStyle(node); else if ("false" === getContentEditable(selection.getNode())) {
                    node = selection.getNode();
                    for (var i = 0, l = formatList.length; i < l && (!formatList[i].ceFalseOverride || !removeFormat(formatList[i], vars, node, node)); i++);
                } else selection.isCollapsed() && format.inline && !dom.select("td.mceSelected,th.mceSelected,div.mceSelected").length ? performCaretAction("remove", name, vars, similar) : (rng = selection.getBookmark(), 
                removeRngStyle(selection.getRng(TRUE)), selection.moveToBookmark(rng), 
                format.inline && match(name, vars, selection.getStart()) && moveStart(selection.getRng(!0)), 
                ed.nodeChanged());
            }
            function matchNode(node, name, vars, similar) {
                var format, i, classes, formatList = get(name);
                function matchItems(node, format, item_name) {
                    var key, value, i, items = format[item_name];
                    if (format.onmatch) return format.onmatch(node, format, item_name);
                    if (items) if (items.length === undef) {
                        for (key in items) if (items.hasOwnProperty(key)) {
                            if (value = "attributes" === item_name ? dom.getAttrib(node, key) : getStyle(node, key), 
                            similar && !value && !format.exact) return;
                            if ((!similar || format.exact) && !isEq(value, normalizeStyleValue(replaceVars(items[key], vars), key))) return;
                        }
                    } else for (i = 0; i < items.length; i++) if ("attributes" === item_name ? dom.getAttrib(node, items[i]) : getStyle(node, items[i])) return format;
                    return format;
                }
                if (formatList && node) for (i = 0; i < formatList.length; i++) if (matchName(node, format = formatList[i]) && matchItems(node, format, "attributes") && matchItems(node, format, "styles")) {
                    if (classes = format.classes) for (i = 0; i < classes.length; i++) if (!dom.hasClass(node, classes[i])) return;
                    return format;
                }
            }
            function match(name, vars, node) {
                var startNode;
                function matchParents(node) {
                    var root = dom.getRoot();
                    return node !== root && (node = dom.getParent(node, function(node) {
                        return !!matchesUnInheritedFormatSelector(node, name) || node.parentNode === root || !!matchNode(node, name, vars, !0);
                    }), matchNode(node, name, vars));
                }
                return node ? matchParents(node) : matchParents(node = selection.getNode()) || (startNode = selection.getStart()) != node && matchParents(startNode) ? TRUE : FALSE;
            }
            tinymce.extend(this, {
                get: get,
                register: register,
                unregister: function(name) {
                    return name && formats[name] && delete formats[name], formats;
                },
                apply: apply,
                remove: remove,
                toggle: function(name, vars, node) {
                    var fmt = get(name);
                    (!match(name, vars, node) || "toggle" in fmt[0] && !fmt[0].toggle ? apply : remove)(name, vars, node);
                },
                match: match,
                matchAll: function(names, vars) {
                    var matchedFormatNames = [], checkedMap = {}, startElement = selection.getStart();
                    return dom.getParent(startElement, function(node) {
                        for (var name, i = 0; i < names.length; i++) name = names[i], 
                        !checkedMap[name] && matchNode(node, name, vars) && (checkedMap[name] = !0, 
                        matchedFormatNames.push(name));
                    }, dom.getRoot()), matchedFormatNames;
                },
                matchNode: matchNode,
                canApply: function(name) {
                    var parents, i, x, selector, formatList = get(name);
                    if (formatList) for (parents = getParents(selection.getStart()), 
                    x = formatList.length - 1; 0 <= x; x--) {
                        if (!(selector = formatList[x].selector) || formatList[x].defaultBlock) return TRUE;
                        for (i = parents.length - 1; 0 <= i; i--) if (dom.is(parents[i], selector)) return TRUE;
                    }
                    return FALSE;
                },
                formatChanged: function(formats, callback, similar) {
                    var currentFormats;
                    return formatChangeData || (formatChangeData = {}, currentFormats = {}, 
                    ed.onNodeChange.addToTop(function(ed, cm, node) {
                        var parents = getParents(node), matchedFormats = {}, parents = tinymce.grep(parents, function(node) {
                            return 1 == node.nodeType && !node.getAttribute("data-mce-bogus");
                        });
                        each(formatChangeData, function(callbacks, format) {
                            each(parents, function(node) {
                                return matchNode(node, format, {}, callbacks.similar) ? (currentFormats[format] || (each(callbacks, function(callback) {
                                    callback(!0, {
                                        node: node,
                                        format: format,
                                        parents: parents
                                    });
                                }), currentFormats[format] = callbacks), matchedFormats[format] = callbacks, 
                                !1) : !matchesUnInheritedFormatSelector(node, format) && void 0;
                            });
                        }), each(currentFormats, function(callbacks, format) {
                            matchedFormats[format] || (delete currentFormats[format], 
                            each(callbacks, function(callback) {
                                callback(!1, {
                                    node: node,
                                    format: format,
                                    parents: parents
                                });
                            }));
                        });
                    })), each(formats.split(","), function(format) {
                        formatChangeData[format] || (formatChangeData[format] = [], 
                        formatChangeData[format].similar = similar), formatChangeData[format].push(callback);
                    }), this;
                }
            }), register({
                valigntop: [ {
                    selector: "td,th",
                    styles: {
                        verticalAlign: "top"
                    }
                } ],
                valignmiddle: [ {
                    selector: "td,th",
                    styles: {
                        verticalAlign: "middle"
                    }
                } ],
                valignbottom: [ {
                    selector: "td,th",
                    styles: {
                        verticalAlign: "bottom"
                    }
                } ],
                alignleft: [ {
                    selector: "figure,figcaption,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li",
                    styles: {
                        textAlign: "left"
                    },
                    defaultBlock: "div",
                    inherit: !1
                }, {
                    selector: "figure[data-mce-image]",
                    collapsed: !1,
                    ceFalseOverride: !0,
                    styles: {
                        float: "left"
                    }
                }, {
                    selector: "img,table",
                    collapsed: !1,
                    styles: {
                        float: "left"
                    }
                } ],
                aligncenter: [ {
                    selector: "figure,figcaption,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li",
                    styles: {
                        textAlign: "center"
                    },
                    defaultBlock: "div",
                    inherit: !1
                }, {
                    selector: "figure[data-mce-image]",
                    collapsed: !1,
                    ceFalseOverride: !0,
                    styles: {
                        marginLeft: "auto",
                        marginRight: "auto",
                        display: "table"
                    }
                }, {
                    selector: "img",
                    collapsed: !1,
                    styles: {
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }
                }, {
                    selector: "table",
                    collapsed: !1,
                    styles: {
                        marginLeft: "auto",
                        marginRight: "auto"
                    }
                } ],
                alignright: [ {
                    selector: "figure,figcaption,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li",
                    styles: {
                        textAlign: "right"
                    },
                    defaultBlock: "div",
                    inherit: !1
                }, {
                    selector: "figure[data-mce-image]",
                    collapsed: !1,
                    ceFalseOverride: !0,
                    styles: {
                        float: "right"
                    }
                }, {
                    selector: "img,table",
                    collapsed: !1,
                    styles: {
                        float: "right"
                    }
                } ],
                alignfull: [ {
                    selector: "figure,figcaption,p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",
                    styles: {
                        textAlign: "justify"
                    },
                    defaultBlock: "div",
                    inherit: !1
                } ],
                bold: [ {
                    inline: "strong",
                    remove: "all"
                }, {
                    inline: "span",
                    styles: {
                        fontWeight: "bold"
                    }
                }, {
                    inline: "b",
                    remove: "all"
                } ],
                italic: [ {
                    inline: "em",
                    remove: "all"
                }, {
                    inline: "span",
                    styles: {
                        fontStyle: "italic"
                    }
                }, {
                    inline: "i",
                    remove: "all"
                } ],
                underline: [ {
                    inline: "span",
                    styles: {
                        textDecoration: "underline"
                    },
                    exact: !0
                }, {
                    inline: "u",
                    remove: "all"
                } ],
                strikethrough: [ {
                    inline: "span",
                    styles: {
                        textDecoration: "line-through"
                    },
                    exact: !0
                }, {
                    inline: "strike",
                    remove: "all"
                } ],
                forecolor: {
                    inline: "span",
                    styles: {
                        color: "%value"
                    },
                    links: !0,
                    remove_similar: !0
                },
                hilitecolor: {
                    inline: "span",
                    styles: {
                        backgroundColor: "%value"
                    },
                    links: !0,
                    remove_similar: !0
                },
                fontname: {
                    inline: "span",
                    styles: {
                        fontFamily: "%value"
                    }
                },
                fontsize: {
                    inline: "span",
                    styles: {
                        fontSize: "%value"
                    }
                },
                fontsize_class: {
                    inline: "span",
                    attributes: {
                        class: "%value"
                    }
                },
                blockquote: {
                    block: "blockquote",
                    wrapper: !0,
                    remove: "all"
                },
                subscript: {
                    inline: "sub"
                },
                superscript: {
                    inline: "sup"
                },
                code: {
                    inline: "code"
                },
                link: {
                    inline: "a",
                    selector: "a",
                    remove: "all",
                    split: !0,
                    deep: !0,
                    onmatch: function() {
                        return !0;
                    },
                    onformat: function(elm, fmt, vars) {
                        each(vars, function(value, key) {
                            dom.setAttrib(elm, key, value);
                        });
                    }
                },
                removeformat: [ {
                    selector: "b,strong,em,i,font,u,strike,sub,sup,dfn,code,samp,kbd,var,cite,mark,q,del,ins",
                    remove: "all",
                    split: !0,
                    expand: !1,
                    block_expand: !0,
                    deep: !0
                }, {
                    selector: "span",
                    attributes: [ "style", "class" ],
                    remove: "empty",
                    split: !0,
                    expand: !1,
                    deep: !0
                }, {
                    selector: "*",
                    attributes: [ "style", "class" ],
                    split: !1,
                    expand: !1,
                    deep: !0
                } ]
            }), each("p h1 h2 h3 h4 h5 h6 div address pre div code samp dt dd dl".split(/\s/), function(name) {
                register(name, {
                    block: name,
                    remove: "all"
                });
            }), register(ed.settings.formats), ed.addShortcut("meta+b", "bold_desc", "Bold"), 
            ed.addShortcut("meta+i", "italic_desc", "Italic"), ed.addShortcut("meta+u", "underline_desc", "Underline");
            for (var i = 1; i <= 6; i++) ed.addShortcut("access+" + i, "", [ "FormatBlock", !1, "h" + i ]);
            function matchName(node, format) {
                return isEq(node, format.inline) || isEq(node, format.block) ? TRUE : format.selector && 1 == node.nodeType && dom.is(node, format.selector);
            }
            function isEq(str1, str2) {
                return str1 = "" + ((str1 = str1 || "").nodeName || str1), str2 = "" + ((str2 = str2 || "").nodeName || str2), 
                str1.toLowerCase() == str2.toLowerCase();
            }
            function getStyle(node, name) {
                return normalizeStyleValue(dom.getStyle(node, name), name);
            }
            function normalizeStyleValue(value, name) {
                return "color" != name && "backgroundColor" != name || (value = dom.toHex(value)), 
                "fontWeight" == name && 700 == value && (value = "bold"), "" + ("fontFamily" == name ? value.replace(/[\'\"]/g, "").replace(/,\s+/g, ",") : value);
            }
            function replaceVars(value, vars) {
                return "string" != typeof value ? value = value(vars) : vars && (value = value.replace(/%(\w+)/g, function(str, name) {
                    return vars[name] || str;
                })), value;
            }
            function isWhiteSpaceNode(node) {
                return node && 3 === node.nodeType && /^([\t \r\n]+|)$/.test(node.nodeValue);
            }
            function wrap(node, name, attrs) {
                return name = dom.create(name, attrs), node.parentNode.insertBefore(name, node), 
                name.appendChild(node), name;
            }
            function expandRng(rng, format, remove) {
                var leaf, lastIdx, startContainer = rng.startContainer, startOffset = rng.startOffset, endContainer = rng.endContainer, endOffset = rng.endOffset;
                function findParentContainer(start) {
                    var parent, sibling, container = parent = start ? startContainer : endContainer, siblingName = start ? "previousSibling" : "nextSibling", root = dom.getRoot();
                    if (3 != container.nodeType || isWhiteSpaceNode(container) || !(start ? 0 < startOffset : endOffset < container.nodeValue.length)) for (;;) {
                        if (!format[0].block_expand && isBlock(parent)) return parent;
                        for (sibling = parent[siblingName]; sibling; sibling = sibling[siblingName]) if (!(isBookmarkNode(sibling) || isWhiteSpaceNode(sibling) || isBogusBr(sibling) || isCaretNode(sibling))) return parent;
                        if (parent == root || parent.parentNode == root) {
                            container = parent;
                            break;
                        }
                        parent = parent.parentNode;
                    }
                    return container;
                }
                function findLeaf(node, offset) {
                    for (offset === undef && (offset = (3 === node.nodeType ? node : node.childNodes).length); node && node.hasChildNodes(); ) (node = node.childNodes[offset]) && (offset = (3 === node.nodeType ? node : node.childNodes).length);
                    return {
                        node: node,
                        offset: offset
                    };
                }
                function findParentContentEditable(node) {
                    for (var parent = node; parent; ) {
                        if (1 === parent.nodeType && getContentEditable(parent)) return "false" === getContentEditable(parent) ? parent : node;
                        parent = parent.parentNode;
                    }
                    return node;
                }
                function findWordEndPoint(container, offset, start) {
                    var walker, node, pos, lastTextNode;
                    function findSpace(node, offset) {
                        var pos, pos2, node = node.nodeValue;
                        return void 0 === offset && (offset = start ? node.length : 0), 
                        start ? (pos = node.lastIndexOf(" ", offset), -1 === (pos = (pos2 = node.lastIndexOf("\xa0", offset)) < pos ? pos : pos2) || remove || pos++) : (pos = node.indexOf(" ", offset), 
                        pos2 = node.indexOf("\xa0", offset), pos = -1 !== pos && (-1 === pos2 || pos < pos2) ? pos : pos2), 
                        pos;
                    }
                    if (3 === container.nodeType) {
                        if (-1 !== (pos = findSpace(container, offset))) return {
                            container: container,
                            offset: pos
                        };
                        lastTextNode = container;
                    }
                    for (walker = new TreeWalker(container, dom.getParent(container, isBlock) || ed.getBody()); node = walker[start ? "prev" : "next"](); ) if (3 === node.nodeType) {
                        if (-1 !== (pos = findSpace(lastTextNode = node))) return {
                            container: node,
                            offset: pos
                        };
                    } else if (isBlock(node)) break;
                    if (lastTextNode) return {
                        container: lastTextNode,
                        offset: offset = start ? 0 : lastTextNode.length
                    };
                }
                function findSelectorEndPoint(container, sibling_name) {
                    for (var y, curFormat, parents = getParents(container = 3 == container.nodeType && 0 === container.nodeValue.length && container[sibling_name] ? container[sibling_name] : container), i = 0; i < parents.length; i++) for (y = 0; y < format.length; y++) if (!("collapsed" in (curFormat = format[y]) && curFormat.collapsed !== rng.collapsed) && dom.is(parents[i], curFormat.selector)) return parents[i];
                    return container;
                }
                function findBlockEndPoint(container, sibling_name) {
                    var node, root = dom.getRoot();
                    if (!(node = (node = (node = format[0].wrapper ? node : dom.getParent(container, format[0].block, root)) || dom.getParent(3 == container.nodeType ? container.parentNode : container, function(node) {
                        return node != root && isTextBlock(node);
                    })) && format[0].wrapper && getParents(node, "ul,ol,dl").reverse()[0] || node)) for (node = container; node[sibling_name] && !isBlock(node[sibling_name]) && !isEq(node = node[sibling_name], "br"); );
                    return node || container;
                }
                if (1 == startContainer.nodeType && startContainer.hasChildNodes() && (lastIdx = startContainer.childNodes.length - 1, 
                startContainer = startContainer.childNodes[lastIdx < startOffset ? lastIdx : startOffset]) && 3 == startContainer.nodeType && (startOffset = 0), 
                1 == endContainer.nodeType && endContainer.hasChildNodes() && (lastIdx = endContainer.childNodes.length - 1, 
                endContainer = endContainer.childNodes[lastIdx < endOffset ? lastIdx : endOffset - 1]) && 3 == endContainer.nodeType && (endOffset = endContainer.nodeValue.length), 
                startContainer = findParentContentEditable(startContainer), endContainer = findParentContentEditable(endContainer), 
                (isBookmarkNode(startContainer.parentNode) || isBookmarkNode(startContainer)) && 3 == (startContainer = (startContainer = isBookmarkNode(startContainer) ? startContainer : startContainer.parentNode).nextSibling || startContainer).nodeType && (startOffset = 0), 
                (isBookmarkNode(endContainer.parentNode) || isBookmarkNode(endContainer)) && 3 == (endContainer = (endContainer = isBookmarkNode(endContainer) ? endContainer : endContainer.parentNode).previousSibling || endContainer).nodeType && (endOffset = endContainer.length), 
                format[0].inline && (rng.collapsed && ((lastIdx = findWordEndPoint(startContainer, startOffset, !0)) && (startContainer = lastIdx.container, 
                startOffset = lastIdx.offset), lastIdx = findWordEndPoint(endContainer, endOffset)) && (endContainer = lastIdx.container, 
                endOffset = lastIdx.offset), (leaf = findLeaf(endContainer, endOffset)).node)) {
                    for (;leaf.node && 0 === leaf.offset && leaf.node.previousSibling; ) leaf = findLeaf(leaf.node.previousSibling);
                    leaf.node && 0 < leaf.offset && 3 === leaf.node.nodeType && " " === leaf.node.nodeValue.charAt(leaf.offset - 1) && 1 < leaf.offset && (endContainer = leaf.node).splitText(leaf.offset - 1);
                }
                return (format[0].inline || format[0].block_expand) && (format[0].inline && 3 == startContainer.nodeType && 0 !== startOffset || isBlock(startContainer) || (startContainer = findParentContainer(!0)), 
                format[0].inline && 3 == endContainer.nodeType && endOffset !== endContainer.nodeValue.length || isBlock(endContainer) || (endContainer = findParentContainer())), 
                format[0].selector && format[0].expand !== FALSE && !format[0].inline && (startContainer = findSelectorEndPoint(startContainer, "previousSibling"), 
                endContainer = findSelectorEndPoint(endContainer, "nextSibling")), 
                (format[0].block || format[0].selector) && (startContainer = findBlockEndPoint(startContainer, "previousSibling"), 
                endContainer = findBlockEndPoint(endContainer, "nextSibling"), format[0].block) && (isBlock(startContainer) || (startContainer = findParentContainer(!0)), 
                isBlock(endContainer) || (endContainer = findParentContainer())), 
                1 == startContainer.nodeType && (startOffset = nodeIndex(startContainer), 
                startContainer = startContainer.parentNode), 1 == endContainer.nodeType && (endOffset = nodeIndex(endContainer) + 1, 
                endContainer = endContainer.parentNode), {
                    startContainer: startContainer,
                    startOffset: startOffset,
                    endContainer: endContainer,
                    endOffset: endOffset
                };
            }
            function removeFormat(format, vars, node, compare_node) {
                var i, attrs, stylesModified;
                if (!matchName(node, format) && !function(node, format) {
                    return format.links && "A" == node.tagName;
                }(node, format)) return FALSE;
                if (format.onremove && format.onremove(node, format, vars, node), 
                "all" != format.remove) for (each(format.styles, function(value, name) {
                    value = normalizeStyleValue(replaceVars(value, vars), name), 
                    "number" == typeof name && (name = value, compare_node = 0), 
                    !format.remove_similar && compare_node && !isEq(getStyle(compare_node, name), value) || dom.setStyle(node, name, ""), 
                    stylesModified = 1;
                }), stylesModified && "" === dom.getAttrib(node, "style") && (node.removeAttribute("style"), 
                node.removeAttribute("data-mce-style")), each(format.attributes, function(value, name) {
                    var valueOut;
                    value = replaceVars(value, vars), "number" == typeof name && (name = value, 
                    compare_node = 0), compare_node && !isEq(dom.getAttrib(compare_node, name), value) || ("class" == name && (value = dom.getAttrib(node, name)) && (valueOut = "", 
                    each(value.split(/\s+/), function(cls) {
                        /mce\w+/.test(cls) && (valueOut += (valueOut ? " " : "") + cls);
                    }), valueOut) ? dom.setAttrib(node, name, valueOut) : ("class" == name && node.removeAttribute("className"), 
                    MCE_ATTR_RE.test(name) && node.removeAttribute("data-mce-" + name), 
                    node.removeAttribute(name)));
                }), each(format.classes, function(value) {
                    value = replaceVars(value, vars), compare_node && !dom.hasClass(compare_node, value) || dom.removeClass(node, value);
                }), attrs = dom.getAttribs(node), i = 0; i < attrs.length; i++) {
                    var attrName = attrs[i].nodeName;
                    if (0 !== attrName.indexOf("_") && 0 !== attrName.indexOf("data-")) return FALSE;
                }
                return "none" != format.remove && (function(node, format) {
                    var rootBlockElm, parentNode = node.parentNode;
                    function find(node, next, inc) {
                        return !(node = getNonWhiteSpaceSibling(node, next, inc)) || "BR" == node.nodeName || isBlock(node);
                    }
                    format.block && (forcedRootBlock ? parentNode != dom.getRoot() || format.list_block && isEq(node, format.list_block) || each(tinymce.grep(node.childNodes), function(node) {
                        isValidChild(forcedRootBlock, node.nodeName.toLowerCase()) ? rootBlockElm ? rootBlockElm.appendChild(node) : (rootBlockElm = wrap(node, forcedRootBlock), 
                        dom.setAttribs(rootBlockElm, ed.settings.forced_root_block_attrs)) : rootBlockElm = 0;
                    }) : isBlock(node) && !isBlock(parentNode) && (find(node, FALSE) || find(node.firstChild, TRUE, 1) || node.insertBefore(dom.create("br"), node.firstChild), 
                    find(node, TRUE) || find(node.lastChild, FALSE, 1) || node.appendChild(dom.create("br")))), 
                    format.selector && format.inline && !isEq(format.inline, node) || dom.remove(node, 1);
                }(node, format), TRUE);
            }
            function getNonWhiteSpaceSibling(node, next, inc) {
                if (node) for (next = next ? "nextSibling" : "previousSibling", 
                node = inc ? node : node[next]; node; node = node[next]) if (1 == node.nodeType || !isWhiteSpaceNode(node)) return node;
            }
            function isBookmarkNode(node) {
                return node && 1 == node.nodeType && "bookmark" == node.getAttribute("data-mce-type");
            }
            function mergeSiblings(prev, next) {
                var sibling, tmpSibling, node1, node2;
                function findElementSibling(node, sibling_name) {
                    for (sibling = node; sibling; sibling = sibling[sibling_name]) {
                        if (3 == sibling.nodeType && 0 !== sibling.nodeValue.length) return node;
                        if (1 == sibling.nodeType && !isBookmarkNode(sibling)) return sibling;
                    }
                    return node;
                }
                if (prev && next && (prev = findElementSibling(prev, "previousSibling"), 
                node2 = next = findElementSibling(next, "nextSibling"), (node1 = prev).nodeName == node2.nodeName && compareObjects(getAttribs(node1), getAttribs(node2)) && compareObjects(dom.parseStyle(dom.getAttrib(node1, "style")), dom.parseStyle(dom.getAttrib(node2, "style"))) ? TRUE : FALSE)) {
                    for (sibling = prev.nextSibling; sibling && sibling != next; ) sibling = (tmpSibling = sibling).nextSibling, 
                    prev.appendChild(tmpSibling);
                    return dom.remove(next), each(tinymce.grep(next.childNodes), function(node) {
                        prev.appendChild(node);
                    }), prev;
                }
                function getAttribs(node) {
                    var attribs = {};
                    return each(dom.getAttribs(node), function(attr) {
                        0 !== (attr = attr.nodeName.toLowerCase()).indexOf("_") && "style" !== attr && (attribs[attr] = dom.getAttrib(node, attr));
                    }), attribs;
                }
                function compareObjects(obj1, obj2) {
                    var value, name;
                    for (name in obj1) if (obj1.hasOwnProperty(name)) {
                        if ((value = obj2[name]) === undef) return FALSE;
                        if (obj1[name] != value) return FALSE;
                        delete obj2[name];
                    }
                    for (name in obj2) if (obj2.hasOwnProperty(name)) return FALSE;
                    return TRUE;
                }
                return next;
            }
            function getContainer(rng, start) {
                var lastIdx, container = rng[start ? "startContainer" : "endContainer"], rng = rng[start ? "startOffset" : "endOffset"];
                return 1 == container.nodeType && (lastIdx = container.childNodes.length - 1, 
                !start && rng && rng--, container = container.childNodes[lastIdx < rng ? lastIdx : rng]), 
                3 === (container = 3 === container.nodeType && start && rng >= container.nodeValue.length && new TreeWalker(container, ed.getBody()).next() || container).nodeType && !start && 0 === rng && new TreeWalker(container, ed.getBody()).prev() || container;
            }
            function performCaretAction(type, name, vars, similar) {
                var textNode, offset, text, caretContainer, debug = ed.settings.caret_debug;
                function createCaretContainer(fill) {
                    var caretContainer = dom.create("span", {
                        id: "_mce_caret",
                        "data-mce-bogus": !0,
                        style: debug ? "color:red" : ""
                    });
                    return fill && caretContainer.appendChild(ed.getDoc().createTextNode(INVISIBLE_CHAR)), 
                    caretContainer;
                }
                function isCaretContainerEmpty(node, nodes) {
                    for (;node; ) {
                        if (3 === node.nodeType && node.nodeValue !== INVISIBLE_CHAR || 1 < node.childNodes.length) return;
                        nodes && 1 === node.nodeType && nodes.push(node), node = node.firstChild;
                    }
                    return 1;
                }
                function getParentCaretContainer(node) {
                    for (;node; ) {
                        if ("_mce_caret" === node.id) return node;
                        node = node.parentNode;
                    }
                }
                function findFirstTextNode(node) {
                    var walker;
                    if (node) for (node = (walker = new TreeWalker(node, node)).current(); node; node = walker.next()) if (3 === node.nodeType) return node;
                }
                function removeCaretContainer(node, move_caret) {
                    var rng;
                    if (node) rng = selection.getRng(!0), isCaretContainerEmpty(node) ? (!1 !== move_caret && (rng.setStartBefore(node), 
                    rng.setEndBefore(node)), dom.remove(node)) : ((move_caret = findFirstTextNode(node)).nodeValue.charAt(0) === INVISIBLE_CHAR && (move_caret.deleteData(0, 1), 
                    rng.startContainer == move_caret && 0 < rng.startOffset && rng.setStart(move_caret, rng.startOffset - 1), 
                    rng.endContainer == move_caret) && 0 < rng.endOffset && rng.setEnd(move_caret, rng.endOffset - 1), 
                    dom.remove(node, 1)), selection.setRng(rng); else if (!(node = getParentCaretContainer(selection.getStart()))) for (;node = dom.get("_mce_caret"); ) removeCaretContainer(node, !1);
                }
                function unmarkBogusCaretParents() {
                    var caretContainer = getParentCaretContainer(selection.getStart());
                    caretContainer && !dom.isEmpty(caretContainer) && tinymce.walk(caretContainer, function(node) {
                        1 != node.nodeType || "_mce_caret" === node.id || dom.isEmpty(node) || dom.setAttrib(node, "data-mce-bogus", null);
                    }, "childNodes");
                }
                ed._hasCaretEvents || (ed.onBeforeGetContent.addToTop(function() {
                    var i, nodes = [];
                    if (isCaretContainerEmpty(getParentCaretContainer(selection.getStart()), nodes)) for (i = nodes.length; i--; ) dom.setAttrib(nodes[i], "data-mce-bogus", "1");
                }), tinymce.each("onMouseUp onKeyUp".split(" "), function(name) {
                    ed[name].addToTop(function() {
                        removeCaretContainer(), unmarkBogusCaretParents();
                    });
                }), ed.onKeyDown.addToTop(function(ed, e) {
                    (8 == (e = e.keyCode) && selection.isCollapsed() || 37 == e || 39 == e) && removeCaretContainer(getParentCaretContainer(selection.getStart())), 
                    unmarkBogusCaretParents();
                }), selection.onSetContent.add(unmarkBogusCaretParents), ed._hasCaretEvents = !0), 
                "apply" == type ? (offset = (type = selection.getRng(!0)).startOffset, 
                text = type.startContainer.nodeValue, (caretContainer = getParentCaretContainer(selection.getStart())) && (textNode = findFirstTextNode(caretContainer)), 
                text && 0 < offset && offset < text.length && /\w/.test(text.charAt(offset)) && /\w/.test(text.charAt(offset - 1)) ? (text = selection.getBookmark(), 
                type.collapse(!0), type = expandRng(type, get(name)), type = rangeUtils.split(type), 
                apply(name, vars, type), selection.moveToBookmark(text)) : (caretContainer && textNode.nodeValue === INVISIBLE_CHAR || (textNode = (caretContainer = createCaretContainer(!0)).firstChild, 
                type.insertNode(caretContainer), offset = 1), apply(name, vars, caretContainer), 
                selection.setCursorLocation(textNode, offset))) : function() {
                    var hasContentAfter, formatNode, i, parents = [], container = (rng = selection.getRng(!0)).startContainer, offset = rng.startOffset;
                    for (3 == (node = container).nodeType && (offset != container.nodeValue.length && (hasContentAfter = !0), 
                    node = node.parentNode); node; ) {
                        if (matchNode(node, name, vars, similar)) {
                            formatNode = node;
                            break;
                        }
                        node.nextSibling && (hasContentAfter = !0), parents.push(node), 
                        node = node.parentNode;
                    }
                    if (formatNode) if (hasContentAfter) offset = selection.getBookmark(), 
                    rng.collapse(!0), rng = expandRng(rng, get(name), !0), rng = rangeUtils.split(rng), 
                    remove(name, vars, rng), selection.moveToBookmark(offset); else {
                        for (node = container = createCaretContainer(), i = parents.length - 1; 0 <= i; i--) node.appendChild(dom.clone(parents[i], !1)), 
                        node = node.firstChild;
                        node.appendChild(dom.doc.createTextNode(INVISIBLE_CHAR));
                        var rng, node = node.firstChild;
                        (rng = dom.getParent(formatNode, isTextBlock)) && dom.isEmpty(rng) ? formatNode.parentNode.replaceChild(container, formatNode) : dom.insertAfter(container, formatNode), 
                        selection.setCursorLocation(node, 1), dom.isEmpty(formatNode) && dom.remove(formatNode);
                    }
                }();
            }
            function moveStart(rng) {
                var isAtEndOfText, walker, node, nodes, container = rng.startContainer, offset = rng.startOffset;
                if ((rng.startContainer != rng.endContainer || !function(node) {
                    return node && /^(IMG)$/.test(node.nodeName);
                }(rng.startContainer.childNodes[rng.startOffset])) && (3 == container.nodeType && offset >= container.nodeValue.length && (offset = nodeIndex(container), 
                container = container.parentNode, isAtEndOfText = !0), 1 == container.nodeType)) for (container = (nodes = container.childNodes)[Math.min(offset, nodes.length - 1)], 
                walker = new TreeWalker(container, dom.getParent(container, dom.isBlock)), 
                (offset > nodes.length - 1 || isAtEndOfText) && walker.next(), node = walker.current(); node; node = walker.next()) if (3 == node.nodeType && !isWhiteSpaceNode(node)) return rng.setStart(node, 0), 
                selection.setRng(rng);
            }
            ed.addShortcut("access+7", "", [ "FormatBlock", !1, "p" ]), ed.addShortcut("access+8", "", [ "FormatBlock", !1, "div" ]), 
            ed.addShortcut("access+9", "", [ "FormatBlock", !1, "address" ]);
        };
    }(tinymce), tinymce.onAddEditor.add(function(tinymce, ed) {
        var filters, fontSizes, dom, settings = ed.settings;
        function replaceWithSpan(node, styles) {
            tinymce.each(styles, function(value, name) {
                value && dom.setStyle(node, name, value);
            }), dom.rename(node, "span");
        }
        function convert(editor, params) {
            dom = editor.dom, settings.convert_fonts_to_spans && tinymce.each(dom.select("font,u,strike", params.node), function(node) {
                filters[node.nodeName.toLowerCase()](ed.dom, node);
            });
        }
        settings.inline_styles && (fontSizes = tinymce.explode(settings.font_size_legacy_values), 
        filters = {
            font: function(dom, node) {
                replaceWithSpan(node, {
                    backgroundColor: node.style.backgroundColor,
                    color: node.color,
                    fontFamily: node.face,
                    fontSize: fontSizes[parseInt(node.size, 10) - 1]
                });
            },
            u: function(dom, node) {
                replaceWithSpan(node, {
                    textDecoration: "underline"
                });
            },
            strike: function(dom, node) {
                replaceWithSpan(node, {
                    textDecoration: "line-through"
                });
            }
        }, ed.onPreProcess.add(convert), ed.onSetContent.add(convert), ed.onInit.add(function() {
            ed.selection.onSetContent.add(convert);
        }));
    }), function(tinymce) {
        var TreeWalker = tinymce.dom.TreeWalker, RangeUtils = tinymce.dom.RangeUtils;
        tinymce.EnterKey = function(editor) {
            var dom = editor.dom, selection = editor.selection, settings = editor.settings, undoManager = editor.undoManager, schema = editor.schema, nonEmptyElementsMap = schema.getNonEmptyElements(), moveCaretBeforeOnEnterElementsMap = schema.getMoveCaretBeforeOnEnterElements(), isIE = tinymce.isIE && tinymce.isIE < 11;
            editor.onNewBlock = new tinymce.util.Dispatcher(), editor.onKeyDown.add(function(ed, evt) {
                13 == evt.keyCode && (function(evt) {
                    var tmpRng, editableRoot, container, offset, parentBlock, documentMode, newBlock, fragment, containerBlock, parentBlockName, containerBlockName, isAfterLastNodeInContainer, shiftKey, newBlockName, containerBlockParentName, elm, node, rng = selection.getRng(!0);
                    function canSplitBlock(node) {
                        return node && dom.isBlock(node) && !/^(TD|TH|CAPTION|FORM)$/.test(node.nodeName) && !/^(fixed|absolute)/i.test(node.style.position) && "true" !== dom.getContentEditable(node) && !node.hasAttribute("data-mce-type");
                    }
                    function renderBlockOnIE(block) {
                        var oldRng;
                        dom.isBlock(block) && (oldRng = selection.getRng(), block.appendChild(dom.create("span", null, "\xa0")), 
                        selection.select(block), block.lastChild.outerHTML = "", 
                        selection.setRng(oldRng));
                    }
                    function moveToCaretPosition(root) {
                        var walker, node, rng, tempElm, firstChild, lastNode = root;
                        if (root) {
                            if (isIE && parentBlock && parentBlock.firstChild && parentBlock.firstChild == parentBlock.lastChild && "BR" == parentBlock.firstChild.tagName && dom.remove(parentBlock.firstChild), 
                            /^(LI|DT|DD)$/.test(root.nodeName) && (firstChild = function(node) {
                                for (;node; ) {
                                    if (1 == node.nodeType || 3 == node.nodeType && node.data && /[\r\n\s]/.test(node.data)) return node;
                                    node = node.nextSibling;
                                }
                            }(root.firstChild)) && /^(UL|OL|DL)$/.test(firstChild.nodeName) && root.insertBefore(dom.doc.createTextNode("\xa0"), root.firstChild), 
                            rng = dom.createRng(), isIE || root.normalize(), root.hasChildNodes()) {
                                for (walker = new TreeWalker(root, root); node = walker.current(); ) {
                                    if (3 == node.nodeType) {
                                        rng.setStart(node, 0), rng.setEnd(node, 0);
                                        break;
                                    }
                                    if (moveCaretBeforeOnEnterElementsMap[node.nodeName.toLowerCase()]) {
                                        rng.setStartBefore(node), rng.setEndBefore(node);
                                        break;
                                    }
                                    lastNode = node, node = walker.next();
                                }
                                node || (rng.setStart(lastNode, 0), rng.setEnd(lastNode, 0));
                            } else "BR" == root.nodeName ? root.nextSibling && dom.isBlock(root.nextSibling) ? ((!documentMode || documentMode < 9) && (tempElm = dom.create("br"), 
                            root.parentNode.insertBefore(tempElm, root)), rng.setStartBefore(root), 
                            rng.setEndBefore(root)) : (rng.setStartAfter(root), 
                            rng.setEndAfter(root)) : (rng.setStart(root, 0), rng.setEnd(root, 0));
                            selection.setRng(rng), dom.remove(tempElm), selection.scrollIntoView(root);
                        }
                    }
                    function setForcedBlockAttrs(node) {
                        var forcedRootBlockName = settings.forced_root_block;
                        forcedRootBlockName && forcedRootBlockName.toLowerCase() === node.tagName.toLowerCase() && dom.setAttribs(node, settings.forced_root_block_attrs);
                    }
                    function emptyBlock(elm) {
                        elm.innerHTML = isIE ? "" : '<br data-mce-bogus="1">';
                    }
                    function createNewBlock(name) {
                        var block, clonedNode, caretNode, node = container, textInlineElements = schema.getTextInlineElements();
                        if (name || "TABLE" == parentBlockName ? setForcedBlockAttrs(block = dom.create(name || newBlockName)) : block = settings.keep_attributes ? parentBlock.cloneNode(!1) : dom.create(parentBlock.nodeName), 
                        caretNode = block, !1 !== settings.keep_styles) for (;textInlineElements[node.nodeName] && "_mce_caret" != node.id && (clonedNode = node.cloneNode(!1), 
                        dom.setAttrib(clonedNode, "id", ""), block.hasChildNodes() ? clonedNode.appendChild(block.firstChild) : caretNode = clonedNode, 
                        block.appendChild(clonedNode)), node = node.parentNode; );
                        return isIE || (caretNode.innerHTML = '<br data-mce-bogus="1">'), 
                        block;
                    }
                    function isCaretAtStartOrEndOfBlock(start) {
                        var walker, node, name;
                        if (3 != container.nodeType || !(start ? 0 < offset : offset < container.nodeValue.length)) {
                            if ((container.parentNode != parentBlock || !isAfterLastNodeInContainer || start) && (!start || 1 != container.nodeType || container != parentBlock.firstChild)) {
                                if ("TABLE" === container.nodeName || container.previousSibling && "TABLE" == container.previousSibling.nodeName) return isAfterLastNodeInContainer && !start || !isAfterLastNodeInContainer && start;
                                for (walker = new TreeWalker(container, parentBlock), 
                                3 == container.nodeType && (start && 0 === offset ? walker.prev() : start || offset != container.nodeValue.length || walker.next()); node = walker.current(); ) {
                                    if (1 === node.nodeType) {
                                        if (!node.getAttribute("data-mce-bogus") && (name = node.nodeName.toLowerCase(), 
                                        nonEmptyElementsMap[name]) && "br" !== name) return;
                                    } else if (3 === node.nodeType && !/^[ \t\r\n]*$/.test(node.nodeValue)) return;
                                    start ? walker.prev() : walker.next();
                                }
                            }
                            return 1;
                        }
                    }
                    function insertBr() {
                        editor.execCommand("InsertLineBreak", !1, evt);
                    }
                    function insertNewBlockAfter() {
                        newBlock = /^(H[1-6]|PRE|FIGURE)$/.test(parentBlockName) && "HGROUP" != containerBlockName ? createNewBlock(newBlockName) : createNewBlock(), 
                        settings.end_container_on_empty_block && canSplitBlock(containerBlock) && dom.isEmpty(parentBlock) ? newBlock = dom.split(containerBlock, parentBlock) : dom.insertAfter(newBlock, parentBlock), 
                        moveToCaretPosition(newBlock);
                    }
                    if (rng = selection.getRng(!0), !evt.isDefaultPrevented()) if (rng.collapsed) {
                        if (new RangeUtils(dom).normalize(rng), container = rng.startContainer, 
                        offset = rng.startOffset, newBlockName = settings.forced_root_block || "p", 
                        newBlockName = (newBlockName = !1 === settings.force_block_newlines ? "" : newBlockName) ? newBlockName.toUpperCase() : "", 
                        documentMode = dom.doc.documentMode, shiftKey = evt.shiftKey, 
                        1 == container.nodeType && container.hasChildNodes() && (isAfterLastNodeInContainer = offset > container.childNodes.length - 1, 
                        container = container.childNodes[Math.min(offset, container.childNodes.length - 1)] || container, 
                        offset = isAfterLastNodeInContainer && 3 == container.nodeType ? container.nodeValue.length : 0), 
                        editableRoot = function(node) {
                            for (var editableRoot, root = dom.getRoot(), parent = node; parent && parent !== root && "false" !== dom.getContentEditable(parent); ) "true" === dom.getContentEditable(parent) && (editableRoot = parent), 
                            parent = parent.parentNode;
                            return parent !== root ? editableRoot : root;
                        }(container)) {
                            if (undoManager.beforeChange(), (newBlockName && !shiftKey || !newBlockName && shiftKey) && (container = function(container, offset) {
                                var newBlock, startNode, node, next, rootBlockName, blockName = newBlockName || "P", parentBlock = dom.getParent(container, dom.isBlock);
                                if (!parentBlock || !canSplitBlock(parentBlock)) {
                                    if (rootBlockName = ((parentBlock = parentBlock || editableRoot) == editableRoot || function(node) {
                                        return node && /^(TD|TH|CAPTION)$/.test(node.nodeName);
                                    }(parentBlock) ? parentBlock : parentBlock.parentNode).nodeName.toLowerCase(), 
                                    !parentBlock.hasChildNodes()) return setForcedBlockAttrs(newBlock = dom.create(blockName)), 
                                    parentBlock.appendChild(newBlock), rng.setStart(newBlock, 0), 
                                    rng.setEnd(newBlock, 0), newBlock;
                                    for (node = container; node.parentNode != parentBlock; ) node = node.parentNode;
                                    for (;node && !dom.isBlock(node); ) node = (startNode = node).previousSibling;
                                    if (startNode && schema.isValidChild(rootBlockName, blockName.toLowerCase())) {
                                        for (setForcedBlockAttrs(newBlock = dom.create(blockName)), 
                                        startNode.parentNode.insertBefore(newBlock, startNode), 
                                        node = startNode; node && !dom.isBlock(node); ) next = node.nextSibling, 
                                        newBlock.appendChild(node), node = next;
                                        rng.setStart(container, offset), rng.setEnd(container, offset);
                                    }
                                }
                                return container;
                            }(container, offset)), parentBlock = dom.getParent(container, dom.isBlock), 
                            containerBlock = parentBlock ? dom.getParent(parentBlock.parentNode, dom.isBlock) : null, 
                            parentBlockName = parentBlock ? parentBlock.nodeName.toUpperCase() : "", 
                            "LI" != (containerBlockName = containerBlock ? containerBlock.nodeName.toUpperCase() : "") || evt.ctrlKey || (parentBlock = containerBlock, 
                            parentBlockName = containerBlockName), /^(LI|DT|DD)$/.test(parentBlockName)) {
                                if (!newBlockName && shiftKey) return insertBr();
                                if (dom.isEmpty(parentBlock)) return containerBlock != editor.getBody() && (containerBlockParentName = containerBlock.parentNode.nodeName, 
                                /^(OL|UL|LI)$/.test(containerBlockParentName) && (newBlockName = "LI"), 
                                newBlock = newBlockName ? createNewBlock(newBlockName) : dom.create("BR"), 
                                isFirstOrLastLi(!0) && isFirstOrLastLi() ? "LI" == containerBlockParentName ? dom.insertAfter(newBlock, getContainerBlock()) : dom.replace(newBlock, containerBlock) : isFirstOrLastLi(!0) ? "LI" == containerBlockParentName ? (dom.insertAfter(newBlock, getContainerBlock()), 
                                newBlock.appendChild(dom.doc.createTextNode(" ")), 
                                newBlock.appendChild(containerBlock)) : containerBlock.parentNode.insertBefore(newBlock, containerBlock) : isFirstOrLastLi() ? (dom.insertAfter(newBlock, getContainerBlock()), 
                                renderBlockOnIE(newBlock)) : (containerBlock = getContainerBlock(), 
                                (tmpRng = rng.cloneRange()).setStartAfter(parentBlock), 
                                tmpRng.setEndAfter(containerBlock), fragment = tmpRng.extractContents(), 
                                "LI" == newBlockName && "LI" == fragment.firstChild.nodeName ? (newBlock = fragment.firstChild, 
                                dom.insertAfter(fragment, containerBlock)) : (dom.insertAfter(fragment, containerBlock), 
                                dom.insertAfter(newBlock, containerBlock))), dom.remove(parentBlock), 
                                moveToCaretPosition(newBlock), undoManager.add());
                            }
                            if ("PRE" == parentBlockName && !1 !== settings.br_in_pre) {
                                if (!shiftKey) return insertBr();
                            } else if (!newBlockName && !shiftKey && "LI" != parentBlockName || newBlockName && shiftKey) return insertBr();
                            newBlockName && parentBlock === editor.getBody() || (newBlockName = newBlockName || "P", 
                            (containerBlockParentName = (containerBlockParentName = parentBlock) && 3 === containerBlockParentName.nodeType ? containerBlockParentName.parentNode : containerBlockParentName) && 1 === containerBlockParentName.nodeType && containerBlockParentName.hasAttribute("data-mce-caret") ? (newBlock = (containerBlockParentName = parentBlock) && containerBlockParentName.hasAttribute("data-mce-caret") ? ((node = elm = (elm = (elm = containerBlockParentName).getElementsByTagName("br"))[elm.length - 1]) && 1 === node.nodeType && node.hasAttribute("data-mce-bogus") && elm.parentNode.removeChild(elm), 
                            containerBlockParentName.removeAttribute("data-mce-caret"), 
                            containerBlockParentName.removeAttribute("data-mce-bogus"), 
                            containerBlockParentName.removeAttribute("style"), containerBlockParentName.removeAttribute("_moz_abspos"), 
                            containerBlockParentName) : null, dom.isEmpty(parentBlock) && emptyBlock(parentBlock), 
                            moveToCaretPosition(newBlock)) : isCaretAtStartOrEndOfBlock() ? insertNewBlockAfter() : isCaretAtStartOrEndOfBlock(!0) ? (renderBlockOnIE(newBlock = parentBlock.parentNode.insertBefore(createNewBlock(), parentBlock)), 
                            moveToCaretPosition(parentBlock)) : ((tmpRng = rng.cloneRange()).setEndAfter(parentBlock), 
                            function(node) {
                                for (;3 === node.nodeType && (node.nodeValue = node.nodeValue.replace(/^[\r\n]+/, "")), 
                                node = node.firstChild; );
                            }(fragment = tmpRng.extractContents()), newBlock = fragment.firstChild, 
                            dom.insertAfter(fragment, parentBlock), function() {
                                var i, node = newBlock, firstChilds = [];
                                if (node) {
                                    for (;node = node.firstChild; ) {
                                        if (dom.isBlock(node)) return;
                                        1 != node.nodeType || nonEmptyElementsMap[node.nodeName.toLowerCase()] || firstChilds.push(node);
                                    }
                                    for (i = firstChilds.length; i--; ) (!(node = firstChilds[i]).hasChildNodes() || node.firstChild == node.lastChild && "" === node.firstChild.nodeValue || "A" == node.nodeName && " " === (node.innerText || node.textContent)) && dom.remove(node);
                                }
                            }(), shiftKey = parentBlock, isIE || (shiftKey.normalize(), 
                            (node = shiftKey.lastChild) && !/^(left|right)$/gi.test(dom.getStyle(node, "float", !0))) || dom.add(shiftKey, "br"), 
                            dom.isEmpty(parentBlock) && emptyBlock(parentBlock), 
                            !newBlock || dom.isEmpty(newBlock) ? (dom.remove(newBlock), 
                            insertNewBlockAfter()) : moveToCaretPosition(newBlock), 
                            newBlock.normalize()), dom.setAttrib(newBlock, "id", ""), 
                            editor.onNewBlock.dispatch(editor, newBlock), undoManager.add());
                        }
                    } else editor.execCommand("Delete");
                    function isFirstOrLastLi(first) {
                        for (var node = containerBlock[first ? "firstChild" : "lastChild"]; node && 1 != node.nodeType; ) node = node[first ? "nextSibling" : "previousSibling"];
                        return node === parentBlock;
                    }
                    function getContainerBlock() {
                        var containerBlockParent = containerBlock.parentNode;
                        return /^(LI|DT|DD)$/.test(containerBlockParent.nodeName) ? containerBlockParent : containerBlock;
                    }
                }(evt), evt.preventDefault());
            });
        };
    }(tinymce), function(tinymce) {
        function bindFakeDragEvents(editor) {
            var state = {}, pageDom = tinymce.DOM, rootDocument = document, dragStartHandler = function(state, editor) {
                return function(e) {
                    var ceElm, docElm, rootElm, elm;
                    0 === e.button && (ceElm = Arr.find(editor.dom.getParents(e.target), Fun.or(isContentEditableFalse, isContentEditableTrue)), 
                    rootElm = editor.getBody(), isContentEditableFalse(elm = ceElm)) && elm !== rootElm && (elm = editor.dom.getPos(ceElm), 
                    rootElm = editor.getBody(), docElm = editor.getDoc().documentElement, 
                    state.element = ceElm, state.screenX = e.screenX, state.screenY = e.screenY, 
                    state.maxX = (editor.inline ? rootElm.scrollWidth : docElm.offsetWidth) - 2, 
                    state.maxY = (editor.inline ? rootElm.scrollHeight : docElm.offsetHeight) - 2, 
                    state.relX = e.pageX - elm.x, state.relY = e.pageY - elm.y, 
                    state.width = ceElm.offsetWidth, state.height = ceElm.offsetHeight, 
                    state.ghost = function(editor, elm, width, height) {
                        var elm = elm.cloneNode(!0), ghostElm = (editor.dom.setStyles(elm, {
                            width: width,
                            height: height
                        }), editor.dom.setAttrib(elm, "data-mce-selected", null), 
                        editor.dom.create("div", {
                            class: "mce-drag-container",
                            "data-mce-bogus": "all",
                            unselectable: "on",
                            contenteditable: "false"
                        }));
                        return editor.dom.setStyles(ghostElm, {
                            position: "absolute",
                            opacity: .5,
                            overflow: "hidden",
                            border: 0,
                            padding: 0,
                            margin: 0,
                            width: width,
                            height: height
                        }), editor.dom.setStyles(elm, {
                            margin: 0,
                            boxSizing: "border-box"
                        }), ghostElm.appendChild(elm), ghostElm;
                    }(editor, ceElm, state.width, state.height));
                };
            }(state, editor), dragHandler = function(state, editor) {
                var throttledPlaceCaretAt = Delay.throttle(function(clientX, clientY) {
                    editor._selectionOverrides.hideFakeCaret(), editor.selection.placeCaretAt(clientX, clientY);
                }, 0);
                return function(e) {
                    var ghostElm, bodyElm, movement = Math.max(Math.abs(e.screenX - state.screenX), Math.abs(e.screenY - state.screenY));
                    if (state.element && !state.dragging && 10 < movement) {
                        if (editor.dom.fire(editor.getBody(), "dragstart", {
                            target: state.element
                        }).isDefaultPrevented()) return;
                        state.dragging = !0, editor.focus();
                    }
                    state.dragging && (movement = function(state, position) {
                        return {
                            pageX: position.pageX - state.relX,
                            pageY: position.pageY + 5
                        };
                    }(state, MousePosition.calc(editor, e)), ghostElm = state.ghost, 
                    bodyElm = editor.getBody(), ghostElm.parentNode !== bodyElm && bodyElm.appendChild(ghostElm), 
                    function(ghostElm, position, width, height, maxX, maxY) {
                        var overflowX = 0, overflowY = 0;
                        ghostElm.style.left = position.pageX + "px", ghostElm.style.top = position.pageY + "px", 
                        position.pageX + width > maxX && (overflowX = position.pageX + width - maxX), 
                        position.pageY + height > maxY && (overflowY = position.pageY + height - maxY), 
                        ghostElm.style.width = width - overflowX + "px", ghostElm.style.height = height - overflowY + "px";
                    }(state.ghost, movement, state.width, state.height, state.maxX, state.maxY), 
                    throttledPlaceCaretAt(e.clientX, e.clientY));
                };
            }(state, editor), dropHandler = function(state, editor) {
                return function(e) {
                    var targetClone, selection;
                    state.dragging && function(editor, targetElement, dragElement) {
                        return targetElement !== dragElement && !editor.dom.isChildOf(targetElement, dragElement) && !isContentEditableFalse(targetElement);
                    }(editor, 3 === (selection = (selection = editor.selection).getSel().getRangeAt(0).startContainer).nodeType ? selection.parentNode : selection, state.element) && ((selection = (selection = state.element).cloneNode(!0)).removeAttribute("data-mce-selected"), 
                    targetClone = selection, (e = editor.dom.fire(editor.getBody(), "drop", {
                        targetClone: targetClone,
                        clientX: e.clientX,
                        clientY: e.clientY
                    })).isDefaultPrevented() || (targetClone = e.targetClone, editor.undoManager.transact(function() {
                        removeElement(state.element), editor.insertContent(editor.dom.getOuterHTML(targetClone)), 
                        editor._selectionOverrides.hideFakeCaret();
                    }))), removeDragState(state);
                };
            }(state, editor), dragEndHandler = function(state, editor) {
                return function() {
                    removeDragState(state), state.dragging && editor.dom.fire(editor.getBody(), "dragend");
                };
            }(state, editor);
            editor.dom.bind(editor.getBody(), "mousedown", dragStartHandler), editor.dom.bind(editor.getBody(), "mousemove", dragHandler), 
            editor.dom.bind(editor.getBody(), "mouseup", dropHandler), pageDom.bind(rootDocument, "mousemove", dragHandler), 
            pageDom.bind(rootDocument, "mouseup", dragEndHandler), editor.dom.bind(editor.getBody(), "remove", function() {
                pageDom.unbind(rootDocument, "mousemove", dragHandler), pageDom.unbind(rootDocument, "mouseup", dragEndHandler);
            });
        }
        function removeDragState(state) {
            state.dragging = !1, state.element = null, removeElement(state.ghost);
        }
        var NodeType = tinymce.dom.NodeType, Fun = tinymce.util.Fun, Arr = tinymce.util.Arr, Delay = tinymce.util.Delay, MousePosition = tinymce.dom.MousePosition, isContentEditableFalse = NodeType.isContentEditableFalse, isContentEditableTrue = NodeType.isContentEditableTrue, removeElement = function(elm) {
            elm && elm.parentNode && elm.parentNode.removeChild(elm);
        };
        tinymce.DragDropOverrides = {
            init: function(editor) {
                bindFakeDragEvents(editor), function(editor) {
                    editor.dom.bind(editor.getBody(), "drop", function(e) {
                        var realTarget = void 0 !== e.clientX ? editor.getDoc().elementFromPoint(e.clientX, e.clientY) : null;
                        (isContentEditableFalse(realTarget) || isContentEditableFalse(editor.dom.getContentEditableParent(realTarget))) && e.preventDefault();
                    });
                }(editor);
            }
        };
    }(tinymce), function(tinymce) {
        var CaretWalker = tinymce.caret.CaretWalker, CaretPosition = tinymce.caret.CaretPosition, CaretContainer = tinymce.caret.CaretContainer, CaretUtils = tinymce.caret.CaretUtils, CaretContainerRemove = tinymce.caret.CaretContainerRemove, FakeCaret = tinymce.caret.FakeCaret, LineWalker = tinymce.caret.LineWalker, LineUtils = tinymce.caret.LineUtils, NodeType = tinymce.dom.NodeType, RangeUtils = tinymce.dom.RangeUtils, VK = tinymce.VK, Fun = tinymce.util.Fun, Arr = tinymce.util.Arr, Dispatcher = tinymce.util.Dispatcher, DragDropOverrides = tinymce.DragDropOverrides, curry = Fun.curry, isContentEditableTrue = NodeType.isContentEditableTrue, isContentEditableFalse = NodeType.isContentEditableFalse, isElement = NodeType.isElement, isAfterContentEditableFalse = CaretUtils.isAfterContentEditableFalse, isBeforeContentEditableFalse = CaretUtils.isBeforeContentEditableFalse, getSelectedNode = RangeUtils.getSelectedNode;
        function getVisualCaretPosition(walkFn, caretPosition) {
            for (;caretPosition = walkFn(caretPosition); ) if (caretPosition.isVisible()) return caretPosition;
            return caretPosition;
        }
        function setEditorTimeout(editor, callback, time) {
            setTimeout(function() {
                editor.removed || callback();
            }, time);
        }
        tinymce.SelectionOverrides = function(editor) {
            var selectedContentEditableNode, right, left, deleteForward, backspace, up, down, rootNode = editor.getBody(), caretWalker = new CaretWalker(rootNode), getNextVisualCaretPosition = curry(getVisualCaretPosition, caretWalker.next), getPrevVisualCaretPosition = curry(getVisualCaretPosition, caretWalker.prev), fakeCaret = new FakeCaret(editor.getBody(), isBlock), realSelectionId = "sel-" + editor.dom.uniqueId();
            function getRealSelectionElement() {
                var container = editor.dom.get(realSelectionId);
                return container && container.getElementsByTagName("*")[0];
            }
            function isBlock(node) {
                return editor.dom.isBlock(node);
            }
            function setRange(range) {
                range && editor.selection.setRng(range);
            }
            function getRange() {
                return editor.selection.getRng();
            }
            function scrollIntoView(node, alignToTop) {
                editor.selection.scrollIntoView(node, alignToTop);
            }
            function showCaret(direction, node, before) {
                var evt = {
                    target: node,
                    direction: direction,
                    before: before
                };
                return editor.onShowCaret.dispatch(editor, evt), evt.target ? (scrollIntoView(node, -1 === direction), 
                fakeCaret.show(before, node)) : null;
            }
            function selectNode(node) {
                var evt = {
                    target: node
                };
                return editor.onBeforeObjectSelected.dispatch(editor, evt), evt.target ? function(node) {
                    var rng = node.ownerDocument.createRange();
                    return rng.selectNode(node), rng;
                }(node) : null;
            }
            function getNormalizedRangeEndPoint(direction, range) {
                return range = CaretUtils.normalizeRange(direction, rootNode, range), 
                -1 == direction ? CaretPosition.fromRangeStart(range) : CaretPosition.fromRangeEnd(range);
            }
            function exitPreBlock(direction, range) {
                var pre;
                range.collapsed && editor.settings.forced_root_block && (pre = editor.dom.getParent(range.startContainer, "PRE")) && !(1 == direction ? getNextVisualCaretPosition : getPrevVisualCaretPosition)(CaretPosition.fromRangeStart(range)) && ((range = editor.dom.create(editor.settings.forced_root_block)).innerHTML = '<br data-mce-bogus="1">', 
                1 == direction ? editor.dom.insertAfter(range, pre) : editor.dom.insertBefore(range, pre), 
                editor.selection.select(range, !0), editor.selection.collapse());
            }
            function moveH(direction, getNextPosFn, isBeforeContentEditableFalseFn, range) {
                return (getNextPosFn = function(direction, getNextPosFn, isBeforeContentEditableFalseFn, range) {
                    var caretPosition, node, toCaretPosition;
                    return !range.collapsed && (node = getSelectedNode(range), isContentEditableFalse(node)) ? showCaret(direction, node, -1 == direction) : (node = function(range) {
                        return CaretContainer.isCaretContainerBlock(range.startContainer);
                    }(range), isBeforeContentEditableFalseFn(caretPosition = getNormalizedRangeEndPoint(direction, range)) ? selectNode(caretPosition.getNode(-1 == direction)) : (caretPosition = getNextPosFn(caretPosition)) ? isBeforeContentEditableFalseFn(caretPosition) ? showCaret(direction, caretPosition.getNode(-1 == direction), 1 == direction) : isBeforeContentEditableFalseFn(isBeforeContentEditableFalseFn = getNextPosFn(caretPosition)) && (getNextPosFn = caretPosition, 
                    toCaretPosition = isBeforeContentEditableFalseFn, !(toCaretPosition = CaretUtils.isInSameBlock(getNextPosFn, toCaretPosition)) && NodeType.isBr(getNextPosFn.getNode()) || toCaretPosition) ? showCaret(direction, isBeforeContentEditableFalseFn.getNode(-1 == direction), 1 == direction) : node ? renderRangeCaret(caretPosition.toRange()) : null : node ? range : null);
                }(direction, getNextPosFn, isBeforeContentEditableFalseFn, range)) || (exitPreBlock(direction, range), 
                null);
            }
            function moveV(direction, walkerFn, range) {
                return (walkerFn = function(direction, walkerFn, range) {
                    var dist2, contentEditableFalseNode = getSelectedNode(range), range = getNormalizedRangeEndPoint(direction, range), walkerFn = walkerFn(rootNode, LineWalker.isAboveLine(1), range), walkerFn = Arr.filter(walkerFn, LineWalker.isLine(1)), caretClientRect = Arr.last(range.getClientRects());
                    return isBeforeContentEditableFalse(range) && (contentEditableFalseNode = range.getNode()), 
                    isAfterContentEditableFalse(range) && (contentEditableFalseNode = range.getNode(!0)), 
                    caretClientRect ? (range = caretClientRect.left, (caretClientRect = LineUtils.findClosestClientRect(walkerFn, range)) && isContentEditableFalse(caretClientRect.node) ? (walkerFn = Math.abs(range - caretClientRect.left), 
                    dist2 = Math.abs(range - caretClientRect.right), showCaret(direction, caretClientRect.node, walkerFn < dist2)) : contentEditableFalseNode && (walkerFn = LineWalker.positionsUntil(direction, rootNode, LineWalker.isAboveLine(1), contentEditableFalseNode), 
                    caretClientRect = (caretClientRect = LineUtils.findClosestClientRect(Arr.filter(walkerFn, LineWalker.isLine(1)), range)) || Arr.last(Arr.filter(walkerFn, LineWalker.isLine(0)))) ? renderRangeCaret(caretClientRect.position.toRange()) : void 0) : null;
                }(direction, walkerFn, range)) || (exitPreBlock(direction, range), 
                null);
            }
            function showBlockCaretContainer(blockCaretContainer) {
                blockCaretContainer.hasAttribute("data-mce-caret") && (CaretContainer.showCaretContainerBlock(blockCaretContainer), 
                setRange(getRange()), scrollIntoView(blockCaretContainer[0]));
            }
            function renderCaretAtRange(range) {
                return range = CaretUtils.normalizeRange(1, rootNode, range), range = CaretPosition.fromRangeStart(range), 
                isContentEditableFalse(range.getNode()) ? showCaret(1, range.getNode(), !range.isAtEnd()) : isContentEditableFalse(range.getNode(!0)) ? showCaret(1, range.getNode(!0), !1) : (range = editor.dom.getParent(range.getNode(), Fun.or(isContentEditableFalse, isContentEditableTrue)), 
                isContentEditableFalse(range) ? showCaret(1, range, !1) : null);
            }
            function renderRangeCaret(range) {
                return range && range.collapsed && renderCaretAtRange(range) || range;
            }
            function deleteContentEditableNode(node) {
                var nextCaretPosition, prevCaretPosition, prevCeFalseElm, nextElement;
                return isContentEditableFalse(node) ? (isContentEditableFalse(node.previousSibling) && (prevCeFalseElm = node.previousSibling), 
                (nextCaretPosition = (prevCaretPosition = getPrevVisualCaretPosition(CaretPosition.before(node))) ? nextCaretPosition : getNextVisualCaretPosition(CaretPosition.after(node))) && isElement(nextCaretPosition.getNode()) && (nextElement = nextCaretPosition.getNode()), 
                CaretContainerRemove.remove(node.previousSibling), CaretContainerRemove.remove(node.nextSibling), 
                editor.dom.remove(node), editor.dom.isEmpty(editor.getBody()) ? (editor.setContent(""), 
                void editor.focus()) : prevCeFalseElm ? CaretPosition.after(prevCeFalseElm).toRange() : nextElement ? CaretPosition.before(nextElement).toRange() : prevCaretPosition ? prevCaretPosition.toRange() : nextCaretPosition ? nextCaretPosition.toRange() : null) : null;
            }
            function isTextBlock(node) {
                var textBlocks = editor.schema.getTextBlockElements();
                return node.nodeName in textBlocks;
            }
            function isEmpty(elm) {
                return editor.dom.isEmpty(elm);
            }
            function mergeTextBlocks(direction, fromCaretPosition, toCaretPosition) {
                var node, ceTarget, dom = editor.dom, fromBlock = dom.getParent(fromCaretPosition.getNode(), dom.isBlock), toBlock = dom.getParent(toCaretPosition.getNode(), dom.isBlock);
                if (-1 === direction) {
                    if (ceTarget = toCaretPosition.getNode(!0), isAfterContentEditableFalse(toCaretPosition) && isBlock(ceTarget)) return isTextBlock(fromBlock) ? (isEmpty(fromBlock) && dom.remove(fromBlock), 
                    CaretPosition.after(ceTarget).toRange()) : deleteContentEditableNode(toCaretPosition.getNode(!0));
                } else if (ceTarget = fromCaretPosition.getNode(), isBeforeContentEditableFalse(fromCaretPosition) && isBlock(ceTarget)) return isTextBlock(toBlock) ? (isEmpty(toBlock) && dom.remove(toBlock), 
                CaretPosition.before(ceTarget).toRange()) : deleteContentEditableNode(fromCaretPosition.getNode());
                if (fromBlock === toBlock || !isTextBlock(fromBlock) || !isTextBlock(toBlock)) return null;
                for (;node = fromBlock.firstChild; ) toBlock.appendChild(node);
                return editor.dom.remove(fromBlock), toCaretPosition.toRange();
            }
            function backspaceDelete(direction, beforeFn, afterFn, range) {
                var newCaretPosition;
                return range.collapsed ? afterFn(afterFn = getNormalizedRangeEndPoint(direction, range)) && CaretContainer.isCaretContainerBlock(range.startContainer) ? (newCaretPosition = -1 == direction ? caretWalker.prev(afterFn) : caretWalker.next(afterFn)) ? renderRangeCaret(newCaretPosition.toRange()) : range : beforeFn(afterFn) ? renderRangeCaret(deleteContentEditableNode(afterFn.getNode(-1 == direction))) : beforeFn(newCaretPosition = -1 == direction ? caretWalker.prev(afterFn) : caretWalker.next(afterFn)) ? -1 === direction ? mergeTextBlocks(direction, afterFn, newCaretPosition) : mergeTextBlocks(direction, newCaretPosition, afterFn) : void 0 : (beforeFn = getSelectedNode(range), 
                isContentEditableFalse(beforeFn) ? renderRangeCaret(deleteContentEditableNode(beforeFn)) : null);
            }
            function isWithinCaretContainer(node) {
                return CaretContainer.isCaretContainer(node) || CaretContainer.startsWithCaretContainer(node) || CaretContainer.endsWithCaretContainer(node);
            }
            function isRangeInCaretContainer(rng) {
                return isWithinCaretContainer(rng.startContainer) || isWithinCaretContainer(rng.endContainer);
            }
            function setContentEditableSelection(range) {
                var node, startOffset, endOffset, caretPosition, dom = editor.dom;
                if (!range) return null;
                if (range.collapsed) {
                    if (!isRangeInCaretContainer(range)) {
                        if (caretPosition = getNormalizedRangeEndPoint(1, range), 
                        isContentEditableFalse(caretPosition.getNode())) return showCaret(1, caretPosition.getNode(), !caretPosition.isAtEnd());
                        if (isContentEditableFalse(caretPosition.getNode(!0))) return showCaret(1, caretPosition.getNode(!0), !1);
                    }
                    return null;
                }
                return caretPosition = range.startContainer, startOffset = range.startOffset, 
                endOffset = range.endOffset, 3 == caretPosition.nodeType && 0 == startOffset && isContentEditableFalse(caretPosition.parentNode) && (caretPosition = caretPosition.parentNode, 
                startOffset = dom.nodeIndex(caretPosition), caretPosition = caretPosition.parentNode), 
                1 == caretPosition.nodeType && (endOffset == startOffset + 1 && (node = caretPosition.childNodes[startOffset]), 
                isContentEditableFalse(node)) && (endOffset = node.cloneNode(!0), 
                editor.onObjectSelected.dispatch(editor, caretPosition = {
                    node: node,
                    target: endOffset
                }), 0 != !caretPosition.isDefaultPrevented) ? ((startOffset = dom.get(realSelectionId)) || (startOffset = dom.create("div", {
                    "data-mce-bogus": "all",
                    class: "mce-offscreen-selection",
                    id: realSelectionId
                }), dom.add(editor.getBody(), startOffset)), range = dom.createRng(), 
                dom.empty(startOffset), startOffset.appendChild(document.createTextNode("\xa0")), 
                startOffset.appendChild(endOffset), startOffset.appendChild(document.createTextNode("\xa0")), 
                range.setStart(startOffset.firstChild, 1), range.setEnd(startOffset.lastChild, 0), 
                dom.setStyle(startOffset, "top", dom.getPos(node, editor.getBody()).y), 
                startOffset.focus(), (caretPosition = editor.selection.getSel()).removeAllRanges(), 
                caretPosition.addRange(range), dom.setAttrib(dom.select("*[data-mce-selected]"), "data-mce-selected", null), 
                node.setAttribute("data-mce-selected", 1), selectedContentEditableNode = node, 
                hideFakeCaret(), range) : null;
            }
            function removeContentEditableSelection() {
                selectedContentEditableNode && (selectedContentEditableNode.removeAttribute("data-mce-selected"), 
                editor.dom.remove(realSelectionId), selectedContentEditableNode = null);
            }
            function hideFakeCaret() {
                fakeCaret.hide();
            }
            function override(evt, moveFn) {
                !1 === evt.isDefaultPrevented() && (moveFn = moveFn(getRange())) && (evt.preventDefault(), 
                setRange(moveFn));
            }
            function getContentEditableRoot(node) {
                for (var root = editor.getBody(); node && node != root; ) {
                    if (isContentEditableTrue(node) || isContentEditableFalse(node)) return node;
                    node = node.parentNode;
                }
                return null;
            }
            function hasBetterMouseTarget(targetNode, caretNode) {
                targetNode = editor.dom.getParent(targetNode, editor.dom.isBlock), 
                caretNode = editor.dom.getParent(caretNode, editor.dom.isBlock);
                return targetNode && editor.dom.getParent(targetNode, editor.dom.isBlock) !== editor.dom.getParent(caretNode, editor.dom.isBlock) && (targetNode = new CaretWalker(caretNode = targetNode), 
                caretNode.firstChild) && (caretNode = CaretPosition.before(caretNode.firstChild), 
                targetNode = targetNode.next(caretNode)) && !isBeforeContentEditableFalse(targetNode) && !isAfterContentEditableFalse(targetNode);
            }
            return editor.onShowCaret = new Dispatcher(), editor.onBeforeObjectSelected = new Dispatcher(), 
            editor.onObjectSelected = new Dispatcher(), editor.onContentEditableSelect = new Dispatcher(), 
            right = curry(moveH, 1, getNextVisualCaretPosition, isBeforeContentEditableFalse), 
            left = curry(moveH, -1, getPrevVisualCaretPosition, isAfterContentEditableFalse), 
            deleteForward = curry(backspaceDelete, 1, isBeforeContentEditableFalse, isAfterContentEditableFalse), 
            backspace = curry(backspaceDelete, -1, isAfterContentEditableFalse, isBeforeContentEditableFalse), 
            up = curry(moveV, -1, LineWalker.upUntil), down = curry(moveV, 1, LineWalker.downUntil), 
            editor.onMouseUp.add(function() {
                var range = getRange();
                range.collapsed && setRange(renderCaretAtRange(range));
            }), editor.onClick.add(function(editor, e) {
                var contentEditableRoot = getContentEditableRoot(e.target);
                contentEditableRoot && (isContentEditableFalse(contentEditableRoot) && (e.preventDefault(), 
                editor.focus()), isContentEditableTrue(contentEditableRoot)) && editor.dom.isChildOf(contentEditableRoot, editor.selection.getNode()) && removeContentEditableSelection();
            }), editor.onNewBlock.add(function() {
                removeContentEditableSelection(), hideFakeCaret();
            }), editor.onBlur.add(function() {
                removeContentEditableSelection(), hideFakeCaret();
            }), function(editor) {
                var moved = !1;
                editor.dom.bind(editor.getBody(), "touchstart", function() {
                    moved = !1;
                }), editor.dom.bind(editor.getBody(), "touchmove", function() {
                    moved = !0;
                }), editor.dom.bind(editor.getBody(), "touchend", function(e) {
                    var contentEditableRoot = getContentEditableRoot(e.target);
                    contentEditableRoot && (isContentEditableFalse(contentEditableRoot) && !moved && (e.preventDefault(), 
                    setContentEditableSelection(selectNode(contentEditableRoot))), 
                    editor.onContentEditableSelect.dispatch(editor, e));
                });
            }(editor), editor.onMouseDown.add(function(editor, e) {
                var contentEditableRoot = getContentEditableRoot(e.target);
                contentEditableRoot ? (isContentEditableFalse(contentEditableRoot) ? (e.preventDefault(), 
                setContentEditableSelection(selectNode(contentEditableRoot))) : editor.selection.isCollapsed() || editor.selection.placeCaretAt(e.clientX, e.clientY), 
                editor.onContentEditableSelect.dispatch(editor, e)) : (removeContentEditableSelection(), 
                hideFakeCaret(), (contentEditableRoot = LineUtils.closestCaret(rootNode, e.clientX, e.clientY)) && !hasBetterMouseTarget(e.target, contentEditableRoot.node) && (e.preventDefault(), 
                editor.getBody().focus(), setRange(showCaret(1, contentEditableRoot.node, contentEditableRoot.before))));
            }), editor.onKeyDown.add(function(editor, e) {
                if (!VK.modifierPressed(e)) switch (e.keyCode) {
                  case VK.RIGHT:
                    override(e, right);
                    break;

                  case VK.DOWN:
                    override(e, down);
                    break;

                  case VK.LEFT:
                    override(e, left);
                    break;

                  case VK.UP:
                    override(e, up);
                    break;

                  case VK.DELETE:
                    override(e, deleteForward);
                    break;

                  case VK.BACKSPACE:
                    override(e, backspace);
                    break;

                  default:
                    isContentEditableFalse(editor.selection.getNode()) && function(e) {
                        return !(112 <= e.keyCode && e.keyCode <= 123);
                    }(e) && e.preventDefault();
                }
            }), editor.dom.bind(editor.getBody(), "keyup compositionstart", function(e) {
                (function(e) {
                    var blockCaretContainer = editor.dom.select("*[data-mce-caret]")[0];
                    blockCaretContainer && ("compositionstart" == e.type ? (e.preventDefault(), 
                    e.stopPropagation(), showBlockCaretContainer(blockCaretContainer)) : CaretContainer.hasContent(blockCaretContainer) && showBlockCaretContainer(blockCaretContainer));
                })(e), function(e) {
                    var prevent, br, ceRoot;
                    switch (e.keyCode) {
                      case VK.DELETE:
                      case VK.BACKSPACE:
                        ceRoot = getContentEditableRoot(editor.selection.getNode()), 
                        prevent = void (isContentEditableTrue(ceRoot) && isBlock(ceRoot) && editor.dom.isEmpty(ceRoot) && (br = editor.dom.create("br", {
                            "data-mce-bogus": "1"
                        }), editor.dom.empty(ceRoot), editor.dom.add(ceRoot, br), 
                        editor.selection.setRng(CaretPosition.before(br).toRange())));
                    }
                    prevent && e.preventDefault();
                }(e);
            }, !0), editor.onCut.add(function() {
                var node = editor.selection.getNode();
                isContentEditableFalse(node) && setEditorTimeout(editor, function() {
                    setRange(renderRangeCaret(deleteContentEditableNode(node)));
                });
            }), editor.selection.onGetSelectionRange.add(function(sel, e) {
                var rng = e.range;
                selectedContentEditableNode && (selectedContentEditableNode.parentNode ? ((rng = rng.cloneRange()).selectNode(selectedContentEditableNode), 
                e.range = rng) : selectedContentEditableNode = null);
            }), editor.selection.onSetSelectionRange.add(function(sel, e) {
                var rng = setContentEditableSelection(e.range);
                rng && (e.range = rng);
            }), editor.selection.onAfterSetSelectionRange.add(function(sel, e) {
                isRangeInCaretContainer(e = e.range) || hideFakeCaret(), e.startContainer.parentNode == rootNode || (e = e.startContainer.parentNode, 
                editor.dom.hasClass(e, "mce-offscreen-selection")) || removeContentEditableSelection();
            }), editor.dom.bind(editor.getBody(), "focus", function() {
                setEditorTimeout(editor, function() {
                    editor.selection.setRng(renderRangeCaret(editor.selection.getRng()));
                }, 0);
            }), editor.onCopy.add(function(editor, e) {
                var realSelectionElement, clipboardData = e.clipboardData;
                !e.isDefaultPrevented() && clipboardData && (realSelectionElement = getRealSelectionElement()) && (e.preventDefault(), 
                clipboardData.clearData(), clipboardData.setData("text/html", realSelectionElement.outerHTML), 
                clipboardData.setData("text/plain", realSelectionElement.outerText));
            }), DragDropOverrides.init(editor), {
                showBlockCaretContainer: showBlockCaretContainer,
                hideFakeCaret: hideFakeCaret,
                destroy: function() {
                    fakeCaret.destroy(), selectedContentEditableNode = null;
                }
            };
        };
    }(tinymce), function() {
        var Entities = tinymce.html.Entities, each = tinymce.each, extend = tinymce.extend, DomParser = tinymce.html.DomParser, HtmlSerializer = tinymce.html.Serializer, Dispatcher = tinymce.util.Dispatcher, DOM = tinymce.DOM;
        tinymce.PluginManager.add("core", function(ed, url) {
            ed.onUpdateMedia = new Dispatcher(), ed.onWfEditorSave = new Dispatcher();
            var store, contentLoaded = !1, elm = ed.getElement(), startup_content_html = ed.settings.startup_content_html || "", quoteMap = (ed.onBeforeRenderUI.add(function() {
                if (startup_content_html && elm && !contentLoaded && ("TEXTAREA" === elm.nodeName ? "" == elm.value : "" == elm.innerHTML)) return contentLoaded = !0, 
                (value = Entities.decode(startup_content_html)) && ("TEXTAREA" === elm.nodeName ? elm.value = value : elm.innerHTML = value), 
                !0;
                var value;
            }), {
                en: {
                    '"': "&ldquo;{$selection}&rdquo;",
                    "'": "&lsquo;{$selection}&rsquo;"
                },
                de: {
                    '"': "&bdquo;{$selection}&ldquo;",
                    "'": "&sbquo;{$selection}&rsquo;"
                }
            });
            ed.onKeyUp.add(function(ed, e) {
                var map = quoteMap[ed.settings.language] || quoteMap.en;
                ('"' == e.key || "'" == e.key) && e.shiftKey && e.ctrlKey && (map = map[e.key], 
                ed.undoManager.add(), ed.execCommand("mceReplaceContent", !1, map));
            }), ed.onExecCommand.add(function(ed, cmd, ui, val, args) {
                "Undo" != cmd && "Redo" != cmd && "mceReApply" != cmd && "mceRepaint" != cmd && (store = {
                    cmd: cmd,
                    ui: ui,
                    value: val,
                    args: args
                });
            }), ed.addShortcut("ctrl+alt+z", "", "mceReApply"), ed.addCommand("mceReApply", function() {
                if (store && store.cmd) return ed.execCommand(store.cmd, store.ui, store.value, store.args);
            }), ed.onPreInit.add(function() {
                var pb;
                ed.onUpdateMedia.add(function(ed, o) {
                    o.before && o.after && (each(ed.dom.select("img,poster"), function(elm) {
                        var after, stamp, src = elm.getAttribute("src");
                        src.substring(0, src.indexOf("?")) == o.before && (after = o.after, 
                        stamp = "?" + new Date().getTime(), -1 !== src.indexOf("?") && -1 === after.indexOf("?") && (after += stamp), 
                        ed.dom.setAttribs(elm, {
                            src: after,
                            "data-mce-src": o.after
                        })), elm.getAttribute("srcset") && function(elm, o) {
                            var srcset = elm.getAttribute("srcset");
                            if (srcset) {
                                for (var sets = srcset.split(","), i = 0; i < sets.length; i++) {
                                    var values = sets[i].trim().split(" ");
                                    o.before == values[0] && (values[0] = o.after), 
                                    sets[i] = values.join(" ");
                                }
                                elm.setAttribute("srcset", sets.join(","));
                            }
                        }(elm, o);
                    }), each(ed.dom.select("a[href]"), function(elm) {
                        ed.dom.getAttrib(elm, "href") == o.before && ed.dom.setAttribs(elm, {
                            href: o.after,
                            "data-mce-href": o.after
                        });
                    }));
                }), ed.onWfEditorSave.add(function(ed, o) {
                    o.content = function(ed, content) {
                        var parser, args = {
                            no_events: !0,
                            format: "raw"
                        }, settings = {};
                        return extend(settings, ed.settings), args.content = content, 
                        ed.settings.validate && (args.format = "html", args.load = !0, 
                        ed.onBeforeGetContent.dispatch(ed, args), settings.verify_html = !1, 
                        settings.forced_root_block = !1, settings.validate = !0, 
                        parser = new DomParser(settings, ed.schema), settings = new HtmlSerializer(settings, ed.schema), 
                        args.content = settings.serialize(parser.parse(args.content), args), 
                        args.get = !0, ed.onPostProcess.dispatch(ed, args), content = args.content), 
                        content;
                    }(ed, o.content);
                }), (pb = DOM.get("sp-inline-popover")) && DOM.isChildOf(ed.getElement(), pb) && ed.onGetContent.addToTop(function(ed, o) {
                    var args;
                    -1 != ed.id.indexOf("sppbeditor-") && "raw" == o.format && (args = tinymce.extend(o, {
                        format: "html"
                    }), o.content = ed.serializer.serialize(ed.getBody(), args));
                });
            }), 0 == ed.settings.forced_root_block && 0 != ed.settings.editable_root && (ed.settings.editable_root = "rootblock", 
            ed.onPreInit.addToTop(function() {
                var selection = ed.selection, dom = ed.dom;
                dom.settings.root_element = ed.settings.editable_root, ed.schema.addValidElements("#mce:root[id|data-mce-root]"), 
                ed.schema.children["mce:root"] = ed.schema.children.body, ed.schema.children.body["mce:root"] = {}, 
                ed.serializer.addAttributeFilter("data-mce-root", function(nodes) {
                    for (var i = nodes.length; i--; ) nodes[i].unwrap();
                }), ed.serializer.addAttributeFilter("data-mce-bogus", function(nodes) {
                    for (var i = nodes.length; i--; ) nodes[i].remove();
                }), ed.onBeforeSetContent.add(function(editor, o) {
                    o.content || (o.content = '<br data-mce-bogus="1">'), o.content = '<mce:root id="' + ed.settings.editable_root + '" data-mce-root="1">' + o.content + "</mce:root>";
                }), ed.onSetContent.addToTop(function(ed, o) {
                    var rng;
                    (ed = dom.get(ed.settings.editable_root)) && (/^(&nbsp;|&#160;|\s|\u00a0|)$/.test(ed.innerHTML) && (ed.innerHTML = '<br data-mce-bogus="1">'), 
                    (rng = dom.createRng()).setStart(ed, 0), rng.setEnd(ed, 0), 
                    selection.setRng(rng));
                }), ed.onSaveContent.add(function(ed, o) {
                    "&nbsp;" === o.content && (o.content = "");
                }), ed.undoManager.onBeforeAdd.add(function(um, level) {
                    var node, container = ed.dom.create("div", {}, level.content);
                    (node = container.firstChild) && 1 == node.nodeType && node.hasAttribute("data-mce-root") && (level.content = container.firstChild.innerHTML);
                });
            }));
        });
    }(), tinymce.create("tinymce.plugins.HelpPlugin", {
        init: function(ed, url) {
            (this.editor = ed).addCommand("mceHelp", function() {
                ed.windowManager.open({
                    title: ed.getLang("dlg.help", "Help"),
                    url: ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=help&lang=" + ed.getParam("language") + "&section=editor&category=editor&article=about",
                    size: "mce-modal-landscape-full"
                });
            }), ed.addButton("help", {
                title: "dlg.help",
                cmd: "mceHelp"
            });
        }
    }), tinymce.PluginManager.add("help", tinymce.plugins.HelpPlugin), AutoLinkPattern = /^(https?:\/\/|ssh:\/\/|ftp:\/\/|file:\/|www\.|(?:mailto:)?[A-Z0-9._%+\-]+@)(.+)$/i, 
    tinymce.create("tinymce.plugins.AutolinkPlugin", {
        init: function(ed, url) {
            var self = this;
            (ed.getParam("autolink_url", !0) || ed.getParam("autolink_email", !0)) && (ed.settings.autolink_pattern && (AutoLinkPattern = ed.settings.autolink_pattern), 
            ed.onAutoLink = new tinymce.util.Dispatcher(this), ed.onKeyDown.addToTop(function(ed, e) {
                if (13 == e.keyCode) return self.handleEnter(ed);
            }), tinymce.isIE || (ed.onKeyPress.add(function(ed, e) {
                if (41 == e.which) return self.handleEclipse(ed);
            }), ed.onKeyUp.add(function(ed, e) {
                if (32 == e.keyCode) return self.handleSpacebar(ed);
            })));
        },
        handleEclipse: function(ed) {
            this.parseCurrentLine(ed, -1, "(", !0);
        },
        handleSpacebar: function(ed) {
            this.parseCurrentLine(ed, 0, "", !0);
        },
        handleEnter: function(ed) {
            this.parseCurrentLine(ed, -1, "", !1);
        },
        parseCurrentLine: function(editor, endOffset, delimiter) {
            var rng, end, endContainer, len, rngText, prev;
            function scopeIndex(container, index) {
                return index < 0 && (index = 0), 3 == container.nodeType && (container = container.data.length) < index ? container : index;
            }
            function setStart(container, offset) {
                1 != container.nodeType || container.hasChildNodes() ? rng.setStart(container, scopeIndex(container, offset)) : rng.setStartBefore(container);
            }
            function setEnd(container, offset) {
                1 != container.nodeType || container.hasChildNodes() ? rng.setEnd(container, scopeIndex(container, offset)) : rng.setEndAfter(container);
            }
            if ("A" != editor.selection.getNode().tagName) {
                if ((rng = editor.selection.getRng(!0).cloneRange()).startOffset < 5) {
                    if (!(prev = rng.endContainer.previousSibling)) {
                        if (!rng.endContainer.firstChild || !rng.endContainer.firstChild.nextSibling) return;
                        prev = rng.endContainer.firstChild.nextSibling;
                    }
                    if (setStart(prev, len = prev.length), setEnd(prev, len), rng.endOffset < 5) return;
                    end = rng.endOffset, endContainer = prev;
                } else {
                    if (3 != (endContainer = rng.endContainer).nodeType && endContainer.firstChild) {
                        for (;3 != endContainer.nodeType && endContainer.firstChild; ) endContainer = endContainer.firstChild;
                        3 == endContainer.nodeType && (setStart(endContainer, 0), 
                        setEnd(endContainer, endContainer.nodeValue.length));
                    }
                    end = 1 == rng.endOffset ? 2 : rng.endOffset - 1 - endOffset;
                }
                for (len = end; setStart(endContainer, 2 <= end ? end - 2 : 0), 
                setEnd(endContainer, 1 <= end ? end - 1 : 0), --end, " " != (rngText = rng.toString()) && "" !== rngText && 160 != rngText.charCodeAt(0) && 0 <= end - 2 && rngText != delimiter; );
                rng.toString() == delimiter || 160 == rng.toString().charCodeAt(0) ? (setStart(endContainer, end), 
                setEnd(endContainer, len), end += 1) : (0 === rng.startOffset ? setStart(endContainer, 0) : setStart(endContainer, end), 
                setEnd(endContainer, len)), "." == (prev = rng.toString()).charAt(prev.length - 1) && setEnd(endContainer, len - 1), 
                (endOffset = (prev = rng.toString()).match(AutoLinkPattern)) && ("www." == endOffset[1] ? endOffset[1] = "https://www." : /@$/.test(endOffset[1]) && !/^mailto:/.test(endOffset[1]) && (endOffset[1] = "mailto:" + endOffset[1]), 
                -1 !== endOffset[1].indexOf("http") && !editor.getParam("autolink_url", !0) || -1 !== endOffset[1].indexOf("mailto:") && !editor.getParam("autolink_email", !0) || (len = editor.selection.getBookmark(), 
                editor.selection.setRng(rng), editor.execCommand("createlink", !1, endOffset[1] + endOffset[2]), 
                prev = editor.selection.getNode(), editor.settings.default_link_target && editor.dom.setAttrib(prev, "target", editor.settings.default_link_target), 
                editor.onAutoLink.dispatch(editor, {
                    node: prev
                }), editor.selection.moveToBookmark(len), editor.nodeChanged()));
            }
        }
    }), tinymce.PluginManager.add("autolink", tinymce.plugins.AutolinkPlugin), function() {
        var each = tinymce.each, Node = tinymce.html.Node, tags = [ "a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp" ], fontIconRe = /<([a-z0-9]+)([^>]+)class="([^"]*)(glyph|uk-)?(fa|icon)-([\w-]+)([^"]*)"([^>]*)><\/\1>/gi, paddedRx = /<(p|h1|h2|h3|h4|h5|h6|pre|div|address|caption)\b([^>]+)>(&nbsp;|\u00a0)<\/\1>/gi;
        tinymce.create("tinymce.plugins.CleanupPlugin", {
            init: function(ed, url) {
                var self = this;
                !1 === (this.editor = ed).settings.verify_html && (ed.settings.validate = !1), 
                ed.onPreInit.add(function() {
                    var elements, invalidAttribValue;
                    function replaceAttributeValue(nodes, name, expr, check) {
                        for (var i = nodes.length; i--; ) {
                            var node, value = (node = nodes[i]).attr(name);
                            !value || expr && !function(value, expr, check) {
                                return expr ? "=" === expr ? value === check : "*=" === expr ? 0 <= value.indexOf(check) : "~=" === expr ? 0 <= (" " + value + " ").indexOf(" " + check + " ") : "!=" === expr ? value != check : "^=" === expr ? 0 === value.indexOf(check) : "$=" === expr && value.substr(value.length - check.length) === check : check;
                            }(value, expr, check) || (node.attr(name, null), "src" !== name && "href" !== name && "style" !== name || node.attr("data-mce-" + name, null), 
                            "a" !== node.name) || node.attributes.length || node.unwrap();
                        }
                    }
                    ed.serializer.addAttributeFilter("data-mce-caret", function(nodes, name, args) {
                        for (var i = nodes.length; i--; ) nodes[i].remove();
                    }), !1 === ed.settings.remove_trailing_brs && ed.serializer.addAttributeFilter("data-mce-bogus", function(nodes, name, args) {
                        for (var node, textNode, i = nodes.length; i--; ) "br" === (node = nodes[i]).name && (node.prev || node.next ? node.remove() : ((textNode = new Node("#text", 3)).value = "\xa0", 
                        node.replace(textNode)));
                    }), ed.serializer.addAttributeFilter("data-mce-tmp", function(nodes, name) {
                        for (var i = nodes.length; i--; ) nodes[i].attr("data-mce-tmp", null);
                    }), ed.parser.addAttributeFilter("data-mce-tmp", function(nodes, name) {
                        for (var i = nodes.length; i--; ) nodes[i].attr("data-mce-tmp", null);
                    }), !1 !== ed.settings.verify_html && (ed.settings.allow_event_attributes || each(ed.schema.elements, function(elm) {
                        if (!elm.attributesOrder || 0 === elm.attributesOrder.length) return !0;
                        each(elm.attributes, function(obj, name) {
                            0 === name.indexOf("on") && (delete elm.attributes[name], 
                            elm.attributesOrder.splice(tinymce.inArray(elm, elm.attributesOrder, name), 1));
                        });
                    }), elements = ed.schema.elements, each("ol ul sub sup blockquote font table tbody tr strong b".split(","), function(name) {
                        elements[name] && (elements[name].removeEmpty = !1);
                    }), ed.getParam("pad_empty_tags", !0) || each(elements, function(v, k) {
                        v.paddEmpty && (v.paddEmpty = !1);
                    }), ed.getParam("table_pad_empty_cells", !0) || (elements.th.paddEmpty = !1, 
                    elements.td.paddEmpty = !1), each(elements, function(v, k) {
                        if (0 == k.indexOf("mce:")) return !0;
                        -1 === tinymce.inArray(tags, k) && ed.schema.addCustomElements(k);
                    })), !1 !== ed.settings.verify_html && (invalidAttribValue = ed.getParam("invalid_attribute_values", "")) && each(tinymce.explode(invalidAttribValue), function(item) {
                        var tag, attrib, expr, value;
                        (item = /([a-z0-9\*]+)\[([a-z0-9-]+)([\^\$\!~\*]?=)?["']?([^"']+)?["']?\]/i.exec(item)) && 5 == item.length && (tag = item[1], 
                        attrib = item[2], expr = item[3], value = item[4], void 0 !== (expr = !attrib || expr || value ? expr : "")) && ("*" == tag ? (ed.parser.addAttributeFilter(attrib, function(nodes, name) {
                            replaceAttributeValue(nodes, name, expr, value);
                        }), ed.serializer.addAttributeFilter(attrib, function(nodes, name) {
                            replaceAttributeValue(nodes, name, expr, value);
                        })) : (ed.parser.addNodeFilter(tag, function(nodes, name) {
                            replaceAttributeValue(nodes, attrib, expr, value);
                        }), ed.serializer.addNodeFilter(tag, function(nodes, name) {
                            replaceAttributeValue(nodes, attrib, expr, value);
                        })));
                    }), ed.serializer.addNodeFilter(ed.settings.invalid_elements, function(nodes, name) {
                        var i = nodes.length;
                        if (ed.schema.isValidChild("body", name)) for (;i--; ) nodes[i].remove();
                    }), ed.parser.addNodeFilter(ed.settings.invalid_elements, function(nodes, name) {
                        var node, i = nodes.length;
                        if (ed.schema.isValidChild("body", name)) for (;i--; ) node = nodes[i], 
                        "span" === name && node.attr("data-mce-type") || node.unwrap();
                    }), ed.parser.addNodeFilter("a,i,span,li", function(nodes, name) {
                        for (var node, i = nodes.length; i--; ) !(node = nodes[i]).attr("class") && "li" !== name || node.firstChild || (node.attr("data-mce-empty", "1"), 
                        node.append(new Node("#text", "3")).value = "\xa0");
                    }), ed.serializer.addAttributeFilter("data-mce-empty", function(nodes, name) {
                        for (var node, fc, i = nodes.length; i--; ) fc = (node = nodes[i]).firstChild, 
                        node.attr("data-mce-empty", null), !fc || "\xa0" !== fc.value && "&nbsp;" !== fc.value || fc.remove();
                    }), ed.parser.addAttributeFilter("onclick,ondblclick,onmousedown,onmouseup", function(nodes, name) {
                        for (var node, i = nodes.length; i--; ) (node = nodes[i]).attr("data-mce-" + name, node.attr(name)), 
                        node.attr(name, "return false;");
                    }), ed.serializer.addAttributeFilter("data-mce-onclick,data-mce-ondblclick,data-mce-onmousedown,data-mce-onmouseup", function(nodes, name) {
                        for (var node, k, i = nodes.length; i--; ) node = nodes[i], 
                        k = name.replace("data-mce-", ""), node.attr(k, node.attr(name)), 
                        node.attr(name, null);
                    }), ed.serializer.addNodeFilter("br", function(nodes, name) {
                        var node, i = nodes.length;
                        if (i) for (;i--; ) (node = nodes[i]).parent && "body" === node.parent.name && !node.prev && node.remove();
                    }), ed.parser.addNodeFilter("br", function(nodes, name) {
                        var node, i = nodes.length;
                        if (i) for (;i--; ) (node = nodes[i]).parent && "body" === node.parent.name && !node.prev && node.remove();
                    });
                }), !1 === ed.settings.verify_html && ed.addCommand("mceCleanup", function() {
                    var s = ed.settings, se = ed.selection, bm = se.getBookmark(), content = ed.getContent({
                        cleanup: !0
                    }), s = (s.verify_html = !0, new tinymce.html.Schema(s)), content = new tinymce.html.Serializer({
                        validate: !0
                    }, s).serialize(new tinymce.html.DomParser({
                        validate: !0,
                        allow_event_attributes: !!ed.settings.allow_event_attributes
                    }, s).parse(content));
                    ed.setContent(content, {
                        cleanup: !0
                    }), se.moveToBookmark(bm);
                }), ed.onBeforeSetContent.add(function(ed, o) {
                    o.content = o.content.replace(/^<br>/, ""), o.content = self.convertFromGeshi(o.content), 
                    ed.settings.validate && ed.getParam("invalid_attributes") && (ed = ed.getParam("invalid_attributes", ""), 
                    o.content = o.content.replace(new RegExp("<([^>]+)(" + ed.replace(/,/g, "|") + ')="([^"]+)"([^>]*)>', "gi"), function() {
                        var args = arguments;
                        return "<" + args[1] + (args[args.length - 3] || "") + ">";
                    })), o.content = o.content.replace(fontIconRe, '<$1$2class="$3$4$5-$6$7"$8 data-mce-empty="1">&nbsp;</$1>'), 
                    o.content = o.content.replace(/<(a|i|span)\b([^>]+)><\/\1>/gi, '<$1$2 data-mce-empty="1">&nbsp;</$1>'), 
                    o.content = o.content.replace(/<li><\/li>/, '<li data-mce-empty="1">&nbsp;</li>');
                }), ed.onPostProcess.add(function(ed, o) {
                    o.set && (o.content = self.convertFromGeshi(o.content)), o.get && (o.content = self.convertToGeshi(o.content), 
                    o.content = o.content.replace(/<a([^>]*)class="jce(box|popup|lightbox|tooltip|_tooltip)"([^>]*)><\/a>/gi, ""), 
                    o.content = o.content.replace(/<span class="jce(box|popup|lightbox|tooltip|_tooltip)">(.*?)<\/span>/gi, "$2"), 
                    o.content = o.content.replace(/_mce_(src|href|style|coords|shape)="([^"]+)"\s*?/gi, ""), 
                    !1 === ed.settings.validate && (o.content = o.content.replace(/<body([^>]*)>([\s\S]*)<\/body>/, "$2"), 
                    ed.getParam("remove_tag_padding") || (o.content = o.content.replace(/<(p|h1|h2|h3|h4|h5|h6|th|td|pre|div|address|caption)\b([^>]*)><\/\1>/gi, "<$1$2>&nbsp;</$1>"))), 
                    ed.getParam("table_pad_empty_cells", !0) || (o.content = o.content.replace(/<(th|td)([^>]*)>(&nbsp;|\u00a0)<\/\1>/gi, "<$1$2></$1>")), 
                    o.content = o.content.replace(/<(a|i|span)([^>]+)>(&nbsp;|\u00a0)<\/\1>/gi, function(match, tag, attribs) {
                        return attribs = attribs.replace('data-mce-empty="1"', ""), 
                        "<" + tag + " " + tinymce.trim(attribs) + "></" + tag + ">";
                    }), o.content = o.content.replace(/<li data-mce-empty="1">(&nbsp;|\u00a0)<\/li>/gi, "<li></li>"), 
                    ed.getParam("remove_div_padding") && (o.content = o.content.replace(/<div([^>]*)>(&nbsp;|\u00a0)<\/div>/g, "<div$1></div>")), 
                    !1 === ed.getParam("pad_empty_tags", !0) && (o.content = o.content.replace(paddedRx, "<$1$2></$1>")), 
                    ed.getParam("keep_nbsp", !0) && "raw" === ed.settings.entity_encoding && (o.content = o.content.replace(/\u00a0/g, "&nbsp;")), 
                    o.content = o.content.replace(/(uk|v|ng|data)-([\w-]+)=""(\s|>)/gi, "$1-$2$3"), 
                    ed.settings.padd_empty_editor && (o.content = o.content.replace(/^(<div>(&nbsp;|&#160;|\s|\u00a0|)<\/div>[\r\n]*|<br(\s*\/)?>[\r\n]*)$/, "")), 
                    o.content = o.content.replace(/<hr(.*)class="system-pagebreak"(.*?)\/?>/gi, '<hr$1class="system-pagebreak"$2/>'), 
                    o.content = o.content.replace(/<hr id="system-readmore"(.*?)>/gi, '<hr id="system-readmore" />'));
                }), ed.onSaveContent.add(function(ed, o) {
                    var entities;
                    ed.getParam("cleanup_pluginmode") && (entities = {
                        "&#39;": "'",
                        "&amp;": "&",
                        "&quot;": '"',
                        "&apos;": "'"
                    }, o.content = o.content.replace(/&(#39|apos|amp|quot);/gi, function(a) {
                        return entities[a];
                    }));
                }), ed.addButton("cleanup", {
                    title: "advanced.cleanup_desc",
                    cmd: "mceCleanup"
                });
            },
            convertFromGeshi: function(h) {
                return h.replace(/<pre xml:lang="([^"]+)"([^>]*)>(.*?)<\/pre>/g, function(a, b, c, d) {
                    return '<pre data-geshi-lang="' + b + '"' + (c && /\w/.test(c) ? c.split(" ").join(" data-geshi-") : "") + ">" + d + "</pre>";
                });
            },
            convertToGeshi: function(h) {
                return h.replace(/<pre([^>]+)data-geshi-lang="([^"]+)"([^>]*)>(.*?)<\/pre>/g, function(a, b, c, d, e) {
                    return '<pre xml:lang="' + c + '"' + (b + d).replace(/data-geshi-/gi, "").replace(/\s+/g, " ").replace(/\s$/, "") + ">" + e + "</pre>";
                });
            }
        }), tinymce.PluginManager.add("cleanup", tinymce.plugins.CleanupPlugin);
    }(), function() {
        var each = tinymce.each, Node = tinymce.html.Node, VK = tinymce.VK, DomParser = tinymce.html.DomParser, Serializer = tinymce.html.Serializer, SaxParser = tinymce.html.SaxParser;
        function createTextNode(value, raw) {
            var text = new Node("#text", 3);
            return text.raw = !1 !== raw, text.value = value, text;
        }
        tinymce.create("tinymce.plugins.CodePlugin", {
            init: function(ed, url) {
                this.editor = ed, this.url = url;
                var blockElements = [], htmlSchema = new tinymce.html.Schema({
                    schema: "mixed",
                    invalid_elements: ed.settings.invalid_elements
                }), xmlSchema = new tinymce.html.Schema({
                    verify_html: !1
                }), code_blocks = !1 !== ed.settings.code_use_blocks;
                function processOnInsert(value) {
                    return /\{.+\}/gi.test(value) && ed.settings.code_protect_shortcode && (value = processShortcode(value, void 0)), 
                    ed.settings.code_allow_custom_xml && (value = processXML(value)), 
                    /<(\?|script|style)/.test(value) ? processPhp(value = value.replace(/<(script|style)([^>]*?)>([\s\S]*?)<\/\1>/gi, function(match, type) {
                        return ed.getParam("code_allow_" + type) ? createCodePre(match = match.replace(/<br[^>]*?>/gi, "\n"), type) : "";
                    })) : value;
                }
                function processShortcode(html, tagName) {
                    return -1 === html.indexOf("{") || "{" == html.charAt(0) && html.length < 3 ? html : (-1 != html.indexOf("{/source}") && (html = function(html) {
                        return -1 !== html.indexOf("{/source}") ? html.replace(/(?:(<(code|pre|samp|span)[^>]*(data-mce-type="code")?>|")?)\{source(.*?)\}([\s\S]+?)\{\/source\}/g, function(match) {
                            return "<" === match.charAt(0) || '"' === match.charAt(0) ? match : (match = ed.dom.decode(match), 
                            '<pre data-mce-code="shortcode" data-mce-label="sourcerer">' + ed.dom.encode(match) + "</pre>");
                        }) : html;
                    }(html)), tagName = tagName || "span", html.replace(/(?:(<(code|pre|samp|span)[^>]*(data-mce-type="code")?>)?)(?:\{)([\w-]+)(.*?)(?:\/?\})(?:([\s\S]+?)\{\/\4\})?/g, function(match) {
                        return "<" === match.charAt(0) ? match : (tag = tagName, 
                        match = (match = ed.dom.decode(match)).replace(/[\n\r]/gi, "<br />"), 
                        ed.dom.createHTML(tag || "pre", {
                            "data-mce-code": "shortcode",
                            "data-mce-type": "code"
                        }, ed.dom.encode(match)));
                        var tag;
                    }));
                }
                function processPhp(content) {
                    return ed.settings.code_allow_php ? (content = content.replace(/\="([^"]+?)"/g, function(a, b) {
                        return '="' + b.replace(/<\?(php)?(.+?)\?>/gi, function(x, y, z) {
                            return "[php:start]" + ed.dom.encode(z) + "[php:end]";
                        }) + '"';
                    }), (content = (content = /<textarea/.test(content) ? content.replace(/<textarea([^>]*)>([\s\S]*?)<\/textarea>/gi, function(a, b, c) {
                        return "<textarea" + b + ">" + c.replace(/<\?(php)?(.+?)\?>/gi, function(x, y, z) {
                            return "[php:start]" + ed.dom.encode(z) + "[php:end]";
                        }) + "</textarea>";
                    }) : content).replace(/<([^>]+)<\?(php)?(.+?)\?>([^>]*?)>/gi, function(a, b, c, d, e) {
                        return " " !== b.charAt(b.length) && (b += " "), "<" + b + 'data-mce-php="' + d + '" ' + e + ">";
                    })).replace(/<\?(php)?([\s\S]+?)\?>/gi, function(match) {
                        return createCodePre(match = match.replace(/\n/g, "<br />"), "php", "span");
                    })) : content.replace(/<\?(php)?([\s\S]*?)\?>/gi, "");
                }
                function isXmlElement(name) {
                    return !htmlSchema.isValid(name) && !function(name) {
                        var invalid_elements = ed.settings.invalid_elements.split(",");
                        return -1 !== tinymce.inArray(invalid_elements, name);
                    }(name);
                }
                function processXML(content) {
                    return content.replace(/<([a-z0-9\-_\:\.]+)(?:[^>]*?)\/?>((?:[\s\S]*?)<\/\1>)?/gi, function(match, tag) {
                        var html;
                        return "svg" === tag && !1 === ed.settings.code_allow_svg_in_xml || "math" === tag && !1 === ed.settings.code_allow_mathml_in_xml || !isXmlElement(tag) ? match : (!1 !== ed.settings.code_validate_xml && (tag = match, 
                        html = [], new SaxParser({
                            start: function(name, attrs, empty) {
                                if (isValid(name)) {
                                    var attr;
                                    if (html.push("<", name), attrs) for (var i = 0, len = attrs.length; i < len; i++) !isValid(name, (attr = attrs[i]).name) || !0 !== ed.settings.allow_event_attributes && 0 === attr.name.indexOf("on") || html.push(" ", attr.name, '="', ed.dom.encode("" + attr.value, !0), '"');
                                    html[html.length] = empty ? " />" : ">";
                                }
                            },
                            text: function(value) {
                                0 < value.length && (html[html.length] = value);
                            },
                            end: function(name) {
                                isValid(name) && html.push("</", name, ">");
                            },
                            cdata: function(text) {
                                html.push("<![CDATA[", text, "]]>");
                            },
                            comment: function(text) {
                                html.push("\x3c!--", text, "--\x3e");
                            }
                        }, xmlSchema).parse(tag), match = html.join("")), createCodePre(match, "xml"));
                        function isValid(tag, attr) {
                            return isXmlElement(tag) || ed.schema.isValid(tag, attr);
                        }
                    });
                }
                function createCodePre(data, type, tag) {
                    return !1 === code_blocks ? (data = data.replace(/<br[^>]*?>/gi, "\n"), 
                    ed.dom.createHTML("img", {
                        src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                        "data-mce-resize": "false",
                        "data-mce-code": type || "script",
                        "data-mce-type": "placeholder",
                        "data-mce-value": escape(data)
                    })) : ed.dom.createHTML(tag || "pre", {
                        "data-mce-code": type || "script",
                        "data-mce-type": "code"
                    }, ed.dom.encode(data));
                }
                function handleEnterInPre(ed, node, before) {
                    var node = ed.dom.getParents(node, blockElements.join(",")), newBlockName = ed.settings.forced_root_block || "p";
                    !1 === ed.settings.force_block_newlines && (newBlockName = "br"), 
                    (node = node.shift()) !== ed.getBody() && (newBlockName = ed.dom.create(newBlockName, {}, "\xa0"), 
                    before ? node.parentNode.insertBefore(newBlockName, node) : ed.dom.insertAfter(newBlockName, node), 
                    (before = ed.selection.getRng()).setStart(newBlockName, 0), 
                    before.setEnd(newBlockName, 0), ed.selection.setRng(before), 
                    ed.selection.scrollIntoView(newBlockName));
                }
                ed.settings.code_allow_script && (ed.settings.allow_script_urls = !0), 
                ed.addCommand("InsertShortCode", function(ui, html) {
                    return ed.settings.code_protect_shortcode && (html = processShortcode(html, "pre"), 
                    tinymce.is(html)) && ed.execCommand("mceReplaceContent", !1, html), 
                    !1;
                }), ed.onKeyDown.add(function(ed, e) {
                    var node;
                    e.keyCode == VK.ENTER && "SPAN" === (node = ed.selection.getNode()).nodeName && node.getAttribute("data-mce-code") && (handleEnterInPre(ed, node), 
                    e.preventDefault()), e.keyCode == VK.UP && e.altKey && "PRE" == (node = ed.selection.getNode()).nodeName && (handleEnterInPre(ed, node, !0), 
                    e.preventDefault()), 9 != e.keyCode || VK.metaKeyPressed(e) || "PRE" === (node = ed.selection.getNode()).nodeName && node.getAttribute("data-mce-code") && (ed.selection.setContent("\t", {
                        no_events: !0
                    }), e.preventDefault()), e.keyCode !== VK.BACKSPACE && e.keyCode !== VK.DELETE || "SPAN" === (node = ed.selection.getNode()).nodeName && node.getAttribute("data-mce-code") && "placeholder" === node.getAttribute("data-mce-type") && (ed.undoManager.add(), 
                    ed.dom.remove(node), e.preventDefault());
                }), ed.onPreInit.add(function() {
                    function isCodePlaceholder(node) {
                        return "SPAN" === node.nodeName && node.getAttribute("data-mce-code") && "placeholder" == node.getAttribute("data-mce-type");
                    }
                    !1 !== ed.settings.content_css && ed.dom.loadCSS(url + "/css/content.css"), 
                    ed.dom.bind(ed.getDoc(), "keyup click", function(e) {
                        var node = e.target, sel = ed.selection.getNode();
                        ed.dom.removeClass(ed.dom.select(".mce-item-selected"), "mce-item-selected"), 
                        node === ed.getBody() && isCodePlaceholder(sel) ? sel.parentNode !== node || sel.nextSibling || ed.dom.insertAfter(ed.dom.create("br", {
                            "data-mce-bogus": 1
                        }), sel) : isCodePlaceholder(node) && (e.preventDefault(), 
                        e.stopImmediatePropagation(), ed.selection.select(node), 
                        window.setTimeout(function() {
                            ed.dom.addClass(node, "mce-item-selected");
                        }, 10), e.preventDefault());
                    });
                    var ctrl = ed.controlManager.get("formatselect");
                    ctrl && each([ "script", "style", "php", "shortcode", "xml" ], function(key) {
                        var title = ed.getLang("code." + key, key);
                        if ("shortcode" === key && ed.settings.code_protect_shortcode) return ctrl.add(title, key, {
                            class: "mce-code-" + key
                        }), ed.formatter.register("shortcode", {
                            block: "pre",
                            attributes: {
                                "data-mce-code": "shortcode"
                            }
                        }), !0;
                        "xml" === key && (ed.settings.code_allow_xml = !!ed.settings.code_allow_custom_xml), 
                        ed.getParam("code_allow_" + key) && code_blocks && (ctrl.add(title, key, {
                            class: "mce-code-" + key
                        }), ed.formatter.register(key, {
                            block: "pre",
                            attributes: {
                                "data-mce-code": key
                            },
                            onformat: function(elm, fmt, vars) {
                                each(ed.dom.select("br", elm), function(br) {
                                    ed.dom.replace(ed.dom.doc.createTextNode("\n"), br);
                                });
                            }
                        }));
                    }), each(ed.schema.getBlockElements(), function(block, blockName) {
                        blockElements.push(blockName);
                    }), ed.settings.code_protect_shortcode && (ed.textpattern.addPattern({
                        start: "{",
                        end: "}",
                        cmd: "InsertShortCode",
                        remove: !0
                    }), ed.textpattern.addPattern({
                        start: " {",
                        end: "}",
                        format: "inline-shortcode",
                        remove: !1
                    })), ed.formatter.register("inline-shortcode", {
                        inline: "span",
                        attributes: {
                            "data-mce-code": "shortcode"
                        }
                    }), ed.selection.onSetContent.add(function(sel, o) {
                        each(ed.dom.select("pre[data-mce-code]", ed.getBody()), function(elm) {
                            (elm = ed.dom.getParent(elm, "p")) && 1 === elm.childNodes.length && ed.dom.remove(elm, 1);
                        });
                    }), ed.parser.addNodeFilter("script,style,noscript", function(nodes) {
                        for (var node, pre, text, value, placeholder, i = nodes.length; i--; ) (node = nodes[i]).firstChild && (node.firstChild.value = node.firstChild.value.replace(/<span([^>]+)>([\s\S]+?)<\/span>/gi, function(match, attr, content) {
                            return -1 === attr.indexOf("data-mce-code") ? match : ed.dom.decode(content);
                        })), code_blocks ? (value = new Serializer({
                            validate: !1
                        }).serialize(node), value = tinymce.trim(value), (pre = new Node("pre", 1)).attr({
                            "data-mce-code": node.name
                        }), text = createTextNode(value, !1), pre.append(text), 
                        node.replace(pre)) : (value = "", node.firstChild && (value = tinymce.trim(node.firstChild.value)), 
                        placeholder = Node.create("img", {
                            src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                            "data-mce-code": node.name,
                            "data-mce-type": "placeholder",
                            "data-mce-resize": "false",
                            title: ed.dom.encode(value)
                        }), each(node.attributes, function(attr) {
                            placeholder.attr("data-mce-p-" + attr.name, attr.value);
                        }), value && placeholder.attr("data-mce-value", escape(value)), 
                        node.replace(placeholder));
                    }), ed.parser.addAttributeFilter("data-mce-code", function(nodes, name) {
                        var node, i = nodes.length;
                        function isBlockNode(node) {
                            return -1 != tinymce.inArray(blockElements, node.name);
                        }
                        for (;i--; ) {
                            var type, parent = (node = nodes[i]).parent;
                            "placeholder" == node.attr("data-mce-type") || "shortcode" !== (type = node.attr(name)) && "php" !== type || ((type = node.firstChild.value) && (node.firstChild.value = type.replace(/<br[\s\/]*>/g, "\n")), 
                            parent && (parent.attr(name) ? node.unwrap() : "body" === parent.name || function(node) {
                                var child = node.parent.firstChild, count = 0;
                                if (child) do {
                                    if (1 === child.type) {
                                        if (child.attributes.map["data-mce-type"] || child.attributes.map["data-mce-bogus"]) continue;
                                        if (child === node) continue;
                                        count++;
                                    }
                                    8 === child.type && count++, 3 !== child.type || /^[ \t\r\n]*$/.test(child.value) || count++;
                                } while (child = child.next);
                                return 0 === count;
                            }(node) || !function(node) {
                                return "span" == node.name && (node.next && ("#text" == node.next.type || !isBlockNode(node.next)) || node.prev && ("#text" == node.prev.type || !isBlockNode(node.prev)));
                            }(node) ? node.name = "pre" : "span" == node.name && node === parent.lastChild && (type = createTextNode("\xa0"), 
                            parent.append(type))));
                        }
                    }), ed.serializer.addAttributeFilter("data-mce-code", function(nodes, name) {
                        for (var i = nodes.length; i--; ) {
                            var node, root_block = !1, type = (node = nodes[i]).attr(name);
                            if ("img" === node.name) {
                                var key, elm = new Node(type, 1);
                                for (key in node.attributes.map) {
                                    var val = node.attributes.map[key];
                                    -1 !== key.indexOf("data-mce-p-") ? key = key.substr(11) : val = null, 
                                    elm.attr(key, val);
                                }
                                (value = node.attr("data-mce-value")) && (text = createTextNode(unescape(value)), 
                                "php" == type || "shortcode" == type ? elm = text : elm.append(text)), 
                                node.replace(elm);
                            } else if (node.isEmpty() && node.remove(), "xml" !== type) {
                                "script" !== type && "style" !== type || (root_block = type);
                                var value, parser, child = node.firstChild, newNode = node.clone(!0), text = "";
                                if (child) for (;/(shortcode|php)/.test(node.attr("data-mce-code")) || (value = "br" == child.name ? "\n" : child.value) && (text += value), 
                                child = child.next; );
                                text && (newNode.empty(), parser = new DomParser({
                                    validate: !1
                                }), "script" !== type && "style" !== type || parser.addNodeFilter(type, function(items, name) {
                                    for (var n = items.length; n--; ) {
                                        var item = items[n];
                                        each(item.attributes, function(attr) {
                                            if (!attr) return !0;
                                            !1 === ed.schema.isValid(name, attr.name) && item.attr(attr.name, null);
                                        });
                                    }
                                }), parser = parser.parse(text, {
                                    forced_root_block: root_block
                                }), newNode.append(parser)), node.replace(newNode), 
                                "shortcode" === type && "pre" === newNode.name && (root_block = createTextNode("\n"), 
                                newNode.append(root_block), newNode.unwrap());
                            }
                        }
                    }), ed.onGetClipboardContent.add(function(ed, content) {
                        var text = content["text/plain"] || "";
                        !(text = tinymce.trim(text)) || (ed = ed.selection.getNode()) && "PRE" === ed.nodeName || (ed = processOnInsert(text)) !== text && (content["text/plain"] = "", 
                        content["text/html"] = content["x-tinymce/html"] = ed);
                    });
                }), ed.onInit.add(function() {
                    ed.theme && ed.theme.onResolveName && ed.theme.onResolveName.add(function(theme, o) {
                        var node = o.node;
                        node.getAttribute("data-mce-code") && (o.name = node.getAttribute("data-mce-code"));
                    });
                }), ed.onBeforeSetContent.addToTop(function(ed, o) {
                    ed.settings.code_protect_shortcode && -1 === o.content.indexOf('data-mce-code="shortcode"') && (o.content = processShortcode(o.content)), 
                    ed.settings.code_allow_custom_xml && o.content && o.load && (o.content = processXML(o.content)), 
                    /<(\?|script|style)/.test(o.content) && (ed.settings.code_allow_script || (o.content = o.content.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")), 
                    ed.settings.code_allow_style || (o.content = o.content.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")), 
                    o.content = processPhp(o.content));
                }), ed.onPostProcess.add(function(ed, o) {
                    o.get && (/(data-mce-php|\[php:start\])/.test(o.content) && (o.content = o.content.replace(/({source})?\[php:\s?start\](.*?)\[php:\s?end\]/g, function(match, pre, code) {
                        return (pre || "") + "<?php" + ed.dom.decode(code) + "?>";
                    }), o.content = o.content.replace(/<textarea([^>]*)>([\s\S]*?)<\/textarea>/gi, function(a, b, c) {
                        return "<textarea" + b + ">" + (/&lt;\?php/.test(c) ? ed.dom.decode(c) : c) + "</textarea>";
                    }), o.content = o.content.replace(/data-mce-php="([^"]+?)"/g, function(a, b) {
                        return "<?php" + ed.dom.decode(b) + "?>";
                    })), ed.settings.code_protect_shortcode && (o.content = o.content.replace(/\{([\s\S]+?)\}/gi, function(match, content) {
                        return "{" + ed.dom.decode(content) + "}";
                    }), o.content = o.content.replace(/\{source([^\}]*?)\}([\s\S]+?)\{\/source\}/gi, function(match, start, content) {
                        return "{source" + start + "}" + ed.dom.decode(content) + "{/source}";
                    }), o.content = o.content.replace(/\{([\w-]+)(.*?)\}([\s\S]+)\{\/\1\}/gi, function(match, start, attr, content) {
                        return "{" + start + attr + "}" + ed.dom.decode(content) + "{/" + start + "}";
                    })), o.content = o.content.replace(/<(pre|span)([^>]+?)>([\s\S]*?)<\/\1>/gi, function(match, tag, attr, content) {
                        return -1 === attr.indexOf("data-mce-code") ? match : (content = tinymce.trim(content), 
                        content = ed.dom.decode(content), "script" != (attr = ed.dom.create("div", {}, match).firstChild.getAttribute("data-mce-code")) && (content = content.replace(/<br[^>]*?>/gi, "\n")), 
                        "php" == attr && (content = content.replace(/<\?(php)?/gi, "").replace(/\?>/g, ""), 
                        content = "<?php\n" + tinymce.trim(content) + "\n?>"), content);
                    }), o.content = o.content.replace(/<!--mce:protected ([\s\S]+?)-->/gi, function(match, content) {
                        return unescape(content);
                    }));
                });
            }
        }), tinymce.PluginManager.add("code", tinymce.plugins.CodePlugin);
    }(), function() {
        var each = tinymce.each;
        tinymce.PluginManager.add("effects", function(ed, url) {
            function cleanEventAttribute(val) {
                return val ? val.replace(/^\s*this.src\s*=\s*\'([^\']+)\';?\s*$/, "$1").replace(/^\s*|\s*$/g, "") : "";
            }
            function bindMouseoverEvent(ed) {
                each(ed.dom.select("img"), function(elm) {
                    var src = elm.getAttribute("src"), mouseover = elm.getAttribute("data-mouseover"), mouseout = elm.getAttribute("data-mouseout");
                    if (elm.onmouseover = elm.onmouseout = null, !src || !mouseover || !mouseout) return !0;
                    elm.onmouseover = function() {
                        elm.setAttribute("src", elm.getAttribute("data-mouseover"));
                    }, elm.onmouseout = function() {
                        elm.setAttribute("src", elm.getAttribute("data-mouseout") || src);
                    };
                });
            }
            ed.onPreInit.add(function() {
                ed.onBeforeSetContent.add(function(ed, o) {
                    var div;
                    -1 !== o.content.indexOf("onmouseover=") && (div = ed.dom.create("div", {}, o.content), 
                    each(ed.dom.select("img[onmouseover]", div), function(node) {
                        var mouseover = node.getAttribute("onmouseover"), mouseout = node.getAttribute("onmouseout");
                        return !mouseover || 0 !== mouseover.indexOf("this.src") || (mouseover = cleanEventAttribute(mouseover), 
                        node.removeAttribute("onmouseover"), !mouseover) || (node.setAttribute("data-mouseover", mouseover), 
                        void (mouseout && 0 === mouseout.indexOf("this.src") && (mouseout = cleanEventAttribute(mouseout), 
                        node.removeAttribute("onmouseout"), mouseout) && node.setAttribute("data-mouseout", mouseout)));
                    }), o.content = div.innerHTML);
                }), ed.parser.addAttributeFilter("onmouseover", function(nodes) {
                    for (var i = nodes.length; i--; ) {
                        var mouseover, mouseout, node = nodes[i];
                        "img" === node.name && (mouseover = node.attr("onmouseover"), 
                        mouseout = node.attr("onmouseout"), mouseover) && 0 === mouseover.indexOf("this.src") && (mouseover = cleanEventAttribute(mouseover), 
                        node.attr("data-mouseover", mouseover), node.attr("onmouseover", null), 
                        mouseout) && 0 === mouseout.indexOf("this.src") && (mouseout = cleanEventAttribute(mouseout), 
                        node.attr("data-mouseout", mouseout), node.attr("onmouseout", null));
                    }
                }), ed.serializer.addAttributeFilter("data-mouseover", function(nodes) {
                    for (var i = nodes.length; i--; ) {
                        var mouseout, mouseover, node = nodes[i];
                        "img" === node.name && (mouseover = node.attr("data-mouseover"), 
                        mouseout = node.attr("data-mouseout"), mouseover = cleanEventAttribute(mouseover), 
                        node.attr("data-mouseover", null), node.attr("data-mouseout", null), 
                        mouseover) && (node.attr("onmouseover", "this.src='" + mouseover + "';"), 
                        mouseout = cleanEventAttribute(mouseout)) && node.attr("onmouseout", "this.src='" + mouseout + "';");
                    }
                }), ed.selection.onSetContent.add(function() {
                    bindMouseoverEvent(ed);
                }), ed.onSetContent.add(function() {
                    bindMouseoverEvent(ed);
                }), ed.onUpdateMedia.add(function(ed, o) {
                    bindMouseoverEvent(ed), o.before && o.after && each(ed.dom.select("img[data-mouseover]"), function(elm) {
                        var mouseover = elm.getAttribute("data-mouseover"), mouseout = elm.getAttribute("data-mouseout");
                        if (!mouseover) return !0;
                        mouseover == o.before && elm.setAttribute("data-mouseover", o.after), 
                        mouseout == o.before && elm.setAttribute("data-mouseout", o.after);
                    });
                });
            });
        });
    }(), function() {
        var VK = tinymce.VK, each = tinymce.each, blocks = [];
        tinymce.create("tinymce.plugins.FormatPlugin", {
            init: function(ed, url) {
                var keyCode, self = this;
                (this.editor = ed).addButton("italic", {
                    title: "advanced.italic_desc",
                    onclick: function(e) {
                        e.preventDefault(), ed.focus(), e.shiftKey ? ed.formatter.toggle("italic-i") : ed.formatter.toggle("italic"), 
                        ed.undoManager.add();
                    }
                }), ed.addShortcut("meta+shift+i", "italic.desc", function() {
                    ed.formatter.apply("italic-i");
                }), ed.addCommand("mceSoftHyphen", function() {
                    ed.execCommand("mceInsertContent", !1, ed.plugins.visualchars && ed.plugins.visualchars.state ? '<span data-mce-bogus="1" class="mce-item-hidden mce-item-shy">&shy;</span>' : "&shy;");
                }), keyCode = 189, tinymce.isGecko && (keyCode = 173), ed.addShortcut("ctrl+shift+" + keyCode, "softhyphen.desc", "mceSoftHyphen"), 
                ed.onPreInit.add(function(ed) {
                    each(ed.schema.getBlockElements(), function(v, k) {
                        if (/\W/.test(k)) return !0;
                        blocks.push(k.toLowerCase());
                    }), ed.formatter.register("aside", {
                        block: "aside",
                        remove: "all",
                        wrapper: !0
                    }), ed.formatter.register("p", {
                        block: "p",
                        remove: "all"
                    }), ed.formatter.register("div", {
                        block: "div",
                        onmatch: !!ed.settings.forced_root_block && function() {
                            return !1;
                        }
                    }), ed.formatter.register("div_container", {
                        block: "div",
                        wrapper: !0,
                        onmatch: !!ed.settings.forced_root_block && function() {
                            return !1;
                        }
                    }), ed.formatter.register("span", {
                        inline: "span",
                        remove: "all",
                        onmatch: function() {
                            return !1;
                        }
                    }), ed.formatter.register("section", {
                        block: "section",
                        remove: "all",
                        wrapper: !0,
                        merge_siblings: !1
                    }), ed.formatter.register("article", {
                        block: "article",
                        remove: "all",
                        wrapper: !0,
                        merge_siblings: !1
                    }), ed.formatter.register("footer", {
                        block: "footer",
                        remove: "all",
                        wrapper: !0,
                        merge_siblings: !1
                    }), ed.formatter.register("header", {
                        block: "header",
                        remove: "all",
                        wrapper: !0,
                        merge_siblings: !1
                    }), ed.formatter.register("nav", {
                        block: "nav",
                        remove: "all",
                        wrapper: !0,
                        merge_siblings: !1
                    }), ed.formatter.register("code", {
                        inline: "code",
                        remove: "all"
                    }), ed.formatter.register("samp", {
                        inline: "samp",
                        remove: "all"
                    }), ed.formatter.register("blockquote", {
                        block: "blockquote",
                        wrapper: 1,
                        remove: "all",
                        merge_siblings: !1
                    }), ed.formatter.register("italic-i", {
                        inline: "i",
                        remove: "all"
                    });
                }), ed.settings.removeformat = [ {
                    selector: "b,strong,em,i,font,u,strike,sub,sup,dfn,code,samp,kbd,var,cite,mark,q,footer",
                    remove: "all",
                    split: !0,
                    expand: !1,
                    block_expand: !0,
                    deep: !0
                } ], ed.onKeyDown.add(function(ed, e) {
                    e.keyCode !== VK.ENTER && e.keyCode !== VK.UP && e.keyCode !== VK.DOWN || !e.altKey || self._clearBlocks(ed, e);
                }), ed.onKeyUp.addToTop(function(ed, e) {
                    e.keyCode === VK.ENTER && "DIV" === (e = ed.selection.getNode()).nodeName && ed.settings.force_block_newlines && (!1 === ed.settings.keep_styles && ed.dom.removeAllAttribs(e), 
                    ed.formatter.apply("p"));
                }), ed.onBeforeExecCommand.add(function(ed, cmd, ui, v, o) {
                    var p, n = ed.selection.getNode();
                    switch (cmd) {
                      case "FormatBlock":
                        if (!v) {
                            if (o.terminate = !0, n === ed.getBody()) return;
                            ed.undoManager.add(), (p = ed.dom.getParent(n, blocks.join(",")) || "") && (name = p.nodeName.toLowerCase(), 
                            ed.formatter.get(name)) && ed.formatter.remove(name);
                            var name = ed.controlManager.get("formatselect");
                            name && name.select(p);
                        }
                        "dt" !== v && "dd" !== v || (n && !ed.dom.getParent(n, "dl") && ed.execCommand("InsertDefinitionList"), 
                        "dt" === v && "DD" === n.nodeName && ed.dom.rename(n, "DT"), 
                        "dd" === v && "DT" === n.nodeName && ed.dom.rename(n, "DD"), 
                        o.terminate = !0);
                        break;

                      case "RemoveFormat":
                        v || ed.dom.isBlock(n) || (name = ed.controlManager.get("styleselect")) && name.selectedValue && ed.execCommand("mceToggleFormat", !1, name.selectedValue);
                    }
                }), ed.onExecCommand.add(function(ed, cmd, ui, v, o) {
                    var n = ed.selection.getNode();
                    "mceToggleFormat" !== cmd || "dt" !== v && "dd" !== v || "DL" === n.nodeName && 0 === ed.dom.select("dt,dd", n).length && ed.formatter.remove("dl");
                });
            },
            _clearBlocks: function(ed, e) {
                var tag, n = ed.selection.getNode();
                (n = ed.dom.getParents(n, blocks.join(","))) && 1 < n.length && (tag = (tag = ed.getParam("forced_root_block", "p")) || (ed.getParam("force_block_newlines") ? "p" : "br"), 
                e.preventDefault(), (n = n[n.length - 1]) !== ed.getBody()) && (tag = ed.dom.create(tag, {}, "\xa0"), 
                e.keyCode === VK.ENTER || e.keyCode === VK.DOWN ? ed.dom.insertAfter(tag, n) : ed.dom.insertBefore(tag, n), 
                ed.selection.select(tag), ed.selection.collapse(1));
            }
        }), tinymce.PluginManager.add("format", tinymce.plugins.FormatPlugin);
    }(), function() {
        var each = tinymce.each, DOM = tinymce.DOM, PreviewCss = tinymce.util.PreviewCss, rgba = {}, luma = {};
        function getLuminance(val) {
            var RsRGB, GsRGB, col;
            return luma[val] || (RsRGB = (col = function(val) {
                var r, b, g, a, values, match;
                return rgba[val] || (g = b = r = 0, -(a = 1) !== val.indexOf("#") ? (3 === (val = val.substr(1)).length && (val += val), 
                r = parseInt(val.substring(0, 2), 16), g = parseInt(val.substring(2, 4), 16), 
                b = parseInt(val.substring(4, 6), 16), 6 < val.length && (a = +((a = parseInt(val.substring(6, 8), 16)) / 255).toFixed(2))) : (val = val.replace(/\s/g, ""), 
                (values = (match = /^(?:rgb|rgba)\(([^\)]*)\)$/.exec(val)) ? match[1].split(",").map(function(x, i) {
                    return parseFloat(x);
                }) : values) && (r = values[0], g = values[1], b = values[2], 4 === values.length) && (a = values[3] || 1)), 
                rgba[val] = {
                    r: r,
                    g: g,
                    b: b,
                    a: a
                }), rgba[val];
            }(val)).r / 255, GsRGB = col.g / 255, col = col.b / 255, RsRGB = RsRGB <= .03928 ? RsRGB / 12.92 : Math.pow((.055 + RsRGB) / 1.055, 2.4), 
            GsRGB = GsRGB <= .03928 ? GsRGB / 12.92 : Math.pow((.055 + GsRGB) / 1.055, 2.4), 
            col = col <= .03928 ? col / 12.92 : Math.pow((.055 + col) / 1.055, 2.4), 
            luma[val] = .2126 * RsRGB + .7152 * GsRGB + .0722 * col), luma[val];
        }
        function isReadable(color1, color2, wcag2, limit) {
            return color1 = getLuminance(color1), color2 = getLuminance(color2), 
            wcag2 = wcag2 || 4.5, limit = limit || 21, (color1 = (Math.max(color1, color2) + .05) / (Math.min(color1, color2) + .05)) >= parseFloat(wcag2) && color1 < parseFloat(limit);
        }
        tinymce.create("tinymce.plugins.ImportCSS", {
            init: function(ed, url) {
                this.editor = ed;
                var self = this;
                ed.onImportCSS = new tinymce.util.Dispatcher(), ed.onImportCSS.add(function() {
                    tinymce.is(ed.settings.importcss_classes) || self.get();
                }), ed.onInit.add(function() {
                    ed.onImportCSS.dispatch(), "auto" !== ed.settings.content_style_reset || ed.dom.hasClass(ed.getBody(), "mceContentReset") || self._setHighContrastMode(), 
                    self._setGuideLinesColor();
                }), ed.onFocus.add(function(ed) {
                    ed._hasGuidelines || self._setGuideLinesColor();
                });
            },
            _setHighContrastMode: function() {
                var hex, ed = this.editor, bodybg = ed.dom.getStyle(ed.getBody(), "background-color", !0), color = ed.dom.getStyle(ed.getBody(), "color", !0);
                bodybg && color && ((hex = ed.dom.toHex(bodybg)) == ed.dom.toHex(color) && "#000000" === hex || isReadable(color, bodybg, 3) || ed.dom.addClass(ed.getBody(), "mceContentReset"));
            },
            _setGuideLinesColor: function() {
                var ed = this.editor, gray = [ "#000000", "#080808", "#101010", "#181818", "#202020", "#282828", "#303030", "#383838", "#404040", "#484848", "#505050", "#585858", "#606060", "#686868", "#696969", "#707070", "#787878", "#808080", "#888888", "#909090", "#989898", "#a0a0a0", "#a8a8a8", "#a9a9a9", "#b0b0b0", "#b8b8b8", "#bebebe", "#c0c0c0", "#c8c8c8", "#d0d0d0", "#d3d3d3", "#d8d8d8", "#dcdcdc", "#e0e0e0", "#e8e8e8", "#f0f0f0", "#f5f5f5", "#f8f8f8", "#ffffff" ], blue = [ "#0d47a1", "#1565c0", "#1976d2", "#1e88e5", "#2196f3", "#42a5f5", "#64b5f6", "#90caf9", "#bbdefb", "#e3f2fd" ], guidelines = "#787878", control = "#1e88e5", bodybg = ed.dom.getStyle(ed.getBody(), "background-color", !0), color = ed.dom.getStyle(ed.getBody(), "color", !0);
                if (bodybg) {
                    ed._hasGuidelines = !0;
                    for (var i = 0; i < gray.length; i++) if (isReadable(gray[i], bodybg, 4.5, 5) && ed.dom.toHex(color) !== ed.dom.toHex(gray[i])) {
                        guidelines = gray[i];
                        break;
                    }
                    for (var css, i = 0; i < blue.length; i++) if (isReadable(blue[i], bodybg, 4.5, 5)) {
                        control = blue[i];
                        break;
                    }
                    (guidelines || control) && (css = ":root{", guidelines && (css += "--mce-guidelines: " + guidelines + ";"), 
                    css += "--mce-placeholder: #efefef;", control && (css = css + "--mce-control-selection: " + control + ";--mce-control-selection-bg: #b4d7ff;"), 
                    ed.dom.addStyle(css += "}"));
                }
            },
            get: function() {
                var self = this, ed = this.editor, doc = ed.getDoc(), href = "", rules = [], fontface = [], filtered = {}, classes = [], bodyRx = !!ed.settings.body_class && new RegExp(".(" + ed.settings.body_class.split(" ").join("|") + ")");
                if (!classes.length) try {
                    each(doc.styleSheets, function(styleSheet) {
                        !function parseCSS(stylesheet) {
                            each(stylesheet.imports, function(r) {
                                var v;
                                0 < r.href.indexOf("://fonts.googleapis.com") ? (v = "@import url(" + r.href + ");", 
                                -1 === self.fontface.indexOf(v) && self.fontface.unshift(v)) : parseCSS(r);
                            });
                            try {
                                if (rules = stylesheet.cssRules || stylesheet.rules, 
                                !(href = stylesheet.href)) return;
                                if (-1 !== (url = href).indexOf("/tiny_mce/") && -1 !== url.indexOf("content.css")) return;
                                href = href.substr(0, href.lastIndexOf("/") + 1), 
                                ed.hasStyleSheets = !0;
                            } catch (e) {}
                            var url;
                            each(rules, function(r) {
                                switch (r.type || 1) {
                                  case 1:
                                    if (!function(href) {
                                        var styleselect = ed.getParam("styleselect_stylesheets");
                                        return !styleselect || (void 0 === filtered[href] && (filtered[href] = -1 !== href.indexOf(styleselect)), 
                                        filtered[href]);
                                    }(stylesheet.href)) return !0;
                                    r.selectorText && each(r.selectorText.split(","), function(v) {
                                        var value;
                                        0 == (v = v.trim()).indexOf(".mce") || -1 !== v.indexOf(".mce-") || (value = v, 
                                        bodyRx && bodyRx.test(value)) || /\.[\w\-]+$/.test(v) && classes.push(v);
                                    });
                                    break;

                                  case 3:
                                    0 < r.href.indexOf("//fonts.googleapis.com") && (v = "@import url(" + r.href + ");", 
                                    -1 === fontface.indexOf(v)) && fontface.unshift(v), 
                                    -1 === r.href.indexOf("//") && parseCSS(r.styleSheet);
                                    break;

                                  case 5:
                                    var v;
                                    r.cssText && !1 === /(fontawesome|glyphicons|icomoon)/i.test(r.cssText) && (u = r.cssText, 
                                    p = href, v = u.replace(/url\(["']?(.+?)["']?\)/gi, function(a, b) {
                                        return b.indexOf("://") < 0 ? 'url("' + p + b + '")' : a;
                                    }), -1 === fontface.indexOf(v)) && fontface.push(v);
                                }
                                var u, p;
                            });
                        }(styleSheet);
                    });
                } catch (ex) {}
                if (!fontface.length) try {
                    var setCss, head = DOM.doc.getElementsByTagName("head")[0], style = DOM.create("style", {
                        type: "text/css"
                    }), css = self.fontface.join("\n");
                    style.styleSheet ? (setCss = function() {
                        try {
                            style.styleSheet.cssText = css;
                        } catch (e) {}
                    }, style.styleSheet.disabled ? setTimeout(setCss, 10) : setCss()) : style.appendChild(DOM.doc.createTextNode(css)), 
                    head.appendChild(style);
                } catch (e) {}
                if (classes.length) return classes = classes.filter(function(val, ind, arr) {
                    return arr.indexOf(val) === ind;
                }), ed.getParam("styleselect_sort", 1) && classes.sort(), ed.settings.importcss_classes = tinymce.map(classes, function(val) {
                    var selectorText = (selectorText = /^(?:([a-z0-9\-_]+))?(\.[a-z0-9_\-\.]+)$/i.exec(selectorText = val)) && "body" !== selectorText[1] ? selectorText[2].substr(1).split(".").join(" ") : "", style = PreviewCss.getCssText(ed, {
                        classes: selectorText.split(" ")
                    });
                    return {
                        selector: val,
                        class: selectorText,
                        style: style
                    };
                }), PreviewCss.reset(), ed.settings.importcss_classes;
            }
        }), tinymce.PluginManager.add("importcss", tinymce.plugins.ImportCSS);
    }(), tinymce.create("tinymce.plugins.ColorPicker", {
        init: function(ed, url) {
            (this.editor = ed).addCommand("mceColorPicker", function(ui, v) {
                ed.windowManager.open({
                    url: ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=colorpicker",
                    width: 365,
                    height: 320,
                    close_previous: !1
                }, {
                    input_color: v.color,
                    func: v.func
                });
            });
        }
    }), tinymce.PluginManager.add("colorpicker", tinymce.plugins.ColorPicker), function() {
        var each = tinymce.each, JSON = tinymce.util.JSON, RangeUtils = tinymce.dom.RangeUtils, Uuid = tinymce.util.Uuid;
        tinymce.PluginManager.add("upload", function(ed, url) {
            var plugins = [], files = [], noop = (ed.onPreInit.add(function() {
                function bindUploadEvents(ed) {
                    each(ed.dom.select(".mce-item-upload-marker", ed.getBody()), function(n) {
                        0 == plugins.length ? ed.dom.remove(n) : bindUploadMarkerEvents(n);
                    });
                }
                each(ed.plugins, function(plg, name) {
                    var data;
                    tinymce.is(plg.getUploadConfig, "function") && (data = plg.getUploadConfig()).inline && data.filetypes && plugins.push(plg);
                }), ed.onBeforeSetContent.add(function(ed, o) {
                    o.content = o.content.replace(/<\/media>/g, "&nbsp;</media>");
                }), ed.onPostProcess.add(function(ed, o) {
                    o.content = o.content.replace(/(&nbsp;|\u00a0)<\/media>/g, "</media>");
                }), ed.schema.addCustomElements("~media[type|width|height|class|style|title|*]"), 
                ed.settings.compress.css || ed.dom.loadCSS(url + "/css/content.css"), 
                ed.serializer.addAttributeFilter("data-mce-marker", function(nodes, name, args) {
                    for (var i = nodes.length; i--; ) nodes[i].remove();
                }), ed.parser.addNodeFilter("img,media", function(nodes) {
                    for (var node, i = nodes.length; i--; ) !function(node) {
                        return "media" === node.name || "img" === node.name && (node.attr("data-mce-upload-marker") || !(!(node = node.attr("class")) || -1 == node.indexOf("upload-placeholder")));
                    }(node = nodes[i]) || (0 == plugins.length ? node.remove() : function(node) {
                        var src = node.attr("src") || "", style = {}, cls = [];
                        node.attr("alt") || /data:image/.test(src) || (src = src.substring(src.length, src.lastIndexOf("/") + 1), 
                        node.attr("alt", src)), node.attr("style") && (style = ed.dom.styles.parse(node.attr("style"))), 
                        node.attr("hspace") && (style["margin-left"] = style["margin-right"] = node.attr("hspace")), 
                        node.attr("vspace") && (style["margin-top"] = style["margin-bottom"] = node.attr("vspace")), 
                        node.attr("align") && (style.float = node.attr("align")), 
                        (cls = node.attr("class") ? node.attr("class").replace(/\s*upload-placeholder\s*/, "").split(" ") : cls).push("mce-item-upload"), 
                        cls.push("mce-item-upload-marker"), "media" === node.name && (node.name = "img", 
                        node.shortEnded = !0), node.attr({
                            src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                            class: tinymce.trim(cls.join(" "))
                        }), src = ed.dom.create("span", {
                            style: style
                        }), (cls = ed.dom.getAttrib(src, "style")) && node.attr({
                            style: cls,
                            "data-mce-style": cls
                        });
                    }(node));
                }), ed.serializer.addNodeFilter("img", function(nodes) {
                    for (var node, cls, i = nodes.length; i--; ) (cls = (node = nodes[i]).attr("class")) && /mce-item-upload-marker/.test(cls) && (cls = cls.replace(/(?:^|\s)(mce-item-)(?!)(upload|upload-marker|upload-placeholder)(?!\S)/g, ""), 
                    node.attr({
                        "data-mce-src": "",
                        src: "",
                        class: tinymce.trim(cls)
                    }), node.name = "media", node.shortEnded = !1, node.attr("alt", null));
                }), ed.selection.onSetContent.add(function() {
                    bindUploadEvents(ed);
                }), ed.onSetContent.add(function() {
                    bindUploadEvents(ed);
                }), ed.onFullScreen && ed.onFullScreen.add(function(editor) {
                    bindUploadEvents(editor);
                });
            }), ed.onInit.add(function() {
                function cancelEvent(e) {
                    e.preventDefault(), e.stopPropagation();
                }
                0 == plugins.length ? (ed.dom.bind(ed.getBody(), "dragover", function(e) {
                    var dataTransfer = e.dataTransfer;
                    dataTransfer && dataTransfer.files && dataTransfer.files.length && e.preventDefault();
                }), ed.dom.bind(ed.getBody(), "drop", function(e) {
                    var dataTransfer = e.dataTransfer;
                    dataTransfer && dataTransfer.files && dataTransfer.files.length && e.preventDefault();
                })) : (ed.theme && ed.theme.onResolveName && ed.theme.onResolveName.add(function(theme, o) {
                    var n = o.node;
                    n && "IMG" === n.nodeName && /mce-item-upload/.test(n.className) && (o.name = "placeholder");
                }), ed.dom.bind(ed.getBody(), "dragover", function(e) {
                    e.dataTransfer.dropEffect = tinymce.VK.metaKeyPressed(e) ? "copy" : "move";
                }), ed.dom.bind(ed.getBody(), "drop", function(e) {
                    var rng, dataTransfer = e.dataTransfer;
                    dataTransfer && dataTransfer.files && dataTransfer.files.length && (each(dataTransfer.files, function(file) {
                        rng || (rng = RangeUtils.getCaretRangeFromPoint(e.clientX, e.clientY, ed.getDoc())) && ed.selection.setRng(rng), 
                        addFile(file);
                    }), cancelEvent(e)), files.length && each(files, function(file) {
                        uploadFile(file);
                    }), tinymce.isGecko && "IMG" == e.target.nodeName && cancelEvent(e);
                }));
            }), function() {});
            function uploadHandler(file, success, failure, progress) {
                success = success || noop, failure = failure || noop, progress = progress || noop;
                var xhr, formData, args = {
                    method: "upload",
                    id: Uuid.uuid("wf_"),
                    inline: 1,
                    name: file.filename
                }, url = file.upload_url;
                url += "&" + ed.settings.query, (xhr = new XMLHttpRequest()).open("POST", url), 
                xhr.upload.onprogress = function(e) {
                    progress(e.loaded / e.total * 100);
                }, xhr.onerror = function() {
                    failure("Image upload failed due to a XHR Transport error. Code: " + xhr.status);
                }, xhr.onload = function() {
                    var json;
                    xhr.status < 200 || 300 <= xhr.status ? failure("HTTP Error: " + xhr.status) : ((json = JSON.parse(xhr.responseText)) || failure("Invalid JSON response!"), 
                    json.error || !json.result ? failure(json.error.message || "Invalid JSON response!") : success(json.result));
                }, formData = new FormData(), each(args, function(value, name) {
                    formData.append(name, value);
                }), formData.append("file", file, file.name), xhr.send(formData);
            }
            function addFile(file) {
                if (!/\.(php([0-9]*)|phtml|pl|py|jsp|asp|htm|html|shtml|sh|cgi)\./i.test(file.name) && (each(plugins, function(plg) {
                    if (!file.upload_url) {
                        var url = plg.getUploadURL(file);
                        if (url) return file.upload_url = url, file.uploader = plg, 
                        !1;
                    }
                }), file.upload_url)) {
                    if (tinymce.is(file.uploader.getUploadConfig, "function")) {
                        var config = file.uploader.getUploadConfig(), name = file.target_name || file.name;
                        if (file.filename = name.replace(/[\+\\\/\?\#%&<>"\'=\[\]\{\},;@\^\(\)\xa3\u20ac$~]/g, ""), 
                        !new RegExp(".(" + config.filetypes.join("|") + ")$", "i").test(file.name)) return ed.windowManager.alert(ed.getLang("upload.file_extension_error", "File type not supported")), 
                        0;
                        if (file.size && (name = parseInt(config.max_size, 10) || 1024, 
                        file.size > 1024 * name)) return ed.windowManager.alert(ed.getLang("upload.file_size_error", "File size exceeds maximum allowed size")), 
                        0;
                    }
                    var w;
                    return file.marker || !1 === ed.settings.upload_use_placeholder || (config = Uuid.uuid("wf-tmp-"), 
                    ed.execCommand("mceInsertContent", !1, '<span data-mce-marker="1" id="' + config + '">\ufeff</span>', {
                        skip_undo: 1
                    }), name = ed.dom.get(config), /image\/(gif|png|jpeg|jpg)/.test(file.type) && file.size ? (config = Math.round(Math.sqrt(file.size)), 
                    w = Math.max(300, config), config = Math.max(300, config), ed.dom.setStyles(name, {
                        width: w,
                        height: config
                    }), ed.dom.addClass(name, "mce-item-upload")) : ed.setProgressState(!0), 
                    file.marker = name), files.push(file), 1;
                }
                ed.windowManager.alert(ed.getLang("upload.file_extension_error", "File type not supported"));
            }
            function bindUploadMarkerEvents(marker) {
                var dom = tinymce.DOM;
                function removeUpload() {
                    dom.setStyles("wf_upload_button", {
                        top: "",
                        left: "",
                        display: "none",
                        zIndex: ""
                    });
                }
                ed.onNodeChange.add(removeUpload), ed.dom.bind(ed.getWin(), "scroll", removeUpload);
                var btn, input = dom.get("wf_upload_input");
                dom.get("wf_upload_button") || (btn = dom.add(dom.doc.body, "div", {
                    id: "wf_upload_button",
                    class: "btn",
                    role: "button",
                    title: ed.getLang("upload.button_description", "Click to upload a file")
                }, '<label for="wf_upload_input"><span class="icon-upload"></span>&nbsp;' + ed.getLang("upload.label", "Upload") + "</label>"), 
                input = dom.add(btn, "input", {
                    type: "file",
                    id: "wf_upload_input"
                })), ed.dom.bind(marker, "mouseover", function(e) {
                    var p2, x, p1, vp;
                    ed.dom.getAttrib(marker, "data-mce-selected") || (vp = ed.dom.getViewPort(ed.getWin()), 
                    p1 = dom.getRect(ed.getContentAreaContainer()), p2 = ed.dom.getRect(marker), 
                    vp.y > p2.y + p2.h / 2 - 25) || vp.y < p2.y + p2.h / 2 + 25 - p1.h || (x = Math.max(p2.x - vp.x, 0) + p1.x, 
                    p1 = Math.max(p2.y - vp.y, 0) + p1.y - Math.max(vp.y - p2.y, 0), 
                    vp = "mce_fullscreen" == ed.id ? dom.get("mce_fullscreen_container").style.zIndex : 0, 
                    dom.setStyles("wf_upload_button", {
                        top: p1 + p2.h / 2 - 16,
                        left: x + p2.w / 2 - 50,
                        display: "block",
                        zIndex: vp + 1
                    }), dom.setStyles("wf_select_button", {
                        top: p1 + p2.h / 2 - 16,
                        left: x + p2.w / 2 - 50,
                        display: "block",
                        zIndex: vp + 1
                    }), input.onchange = function() {
                        var file;
                        input.files && (file = input.files[0]) && (file.marker = marker, 
                        addFile(file)) && (each([ "width", "height" ], function(key) {
                            ed.dom.setStyle(marker, key, ed.dom.getAttrib(marker, key));
                        }), file.marker = ed.dom.rename(marker, "span"), uploadFile(file), 
                        removeUpload());
                    });
                }), ed.dom.bind(marker, "mouseout", function(e) {
                    !e.relatedTarget && 0 < e.clientY || removeUpload();
                });
            }
            function removeFile(file) {
                for (var i = 0; i < files.length; i++) files[i] === file && files.splice(i, 1);
                files.splice(tinymce.inArray(files, file), 1);
            }
            function uploadFile(file) {
                uploadHandler(file, function(response) {
                    response = (response = response.files || []).length ? response[0] : {};
                    file.uploader && (response = tinymce.extend({
                        type: file.type,
                        name: file.name
                    }, response), function(file, data) {
                        var w, h, marker = file.marker, file = file.uploader;
                        ed.selection.select(marker), (file = file.insertUploadedFile(data)) && ("object" == typeof file && file.nodeType && (ed.dom.hasClass(marker, "mce-item-upload-marker") && (data = ed.dom.getAttrib(marker, "data-mce-style"), 
                        w = marker.width || 0, h = marker.height || 0, data && ((data = ed.dom.styles.parse(data)).width && (w = data.width, 
                        delete data.width), data.height && (h = data.height, delete data.height), 
                        ed.dom.setStyles(file, data)), w && ed.dom.setAttrib(file, "width", w), 
                        h) && ed.dom.setAttrib(file, "height", h = w ? "" : h), 
                        ed.undoManager.add(), ed.dom.replace(file, marker)), ed.nodeChanged());
                    }(file, response)), removeFile(file), file.marker && ed.dom.remove(file.marker), 
                    ed.setProgressState(!1);
                }, function(message) {
                    ed.windowManager.alert(message), removeFile(file), file.marker && ed.dom.remove(file.marker), 
                    ed.setProgressState(!1);
                }, function(value) {
                    file.marker && ed.dom.setAttrib(file.marker, "data-progress", value);
                });
            }
            return {
                plugins: plugins,
                upload: uploadHandler
            };
        });
    }(), function() {
        var VK = tinymce.VK, Node = tinymce.html.Node, each = tinymce.each, blocks = [];
        tinymce.create("tinymce.plugins.Figure", {
            init: function(ed, url) {
                (this.editor = ed).onPreInit.add(function(ed) {
                    ed.parser.addNodeFilter("figure", function(nodes, name) {
                        for (var figcaption, node, i = nodes.length; i--; ) 0 === (node = nodes[i]).getAll("figcaption").length && ((figcaption = new Node("figcaption", 1)).attr("data-mce-empty", ed.getLang("figcaption.default", "Write a caption...")), 
                        figcaption.attr("contenteditable", !0), node.append(figcaption)), 
                        node.attr("data-mce-image", "1"), node.attr("contenteditable", "false"), 
                        each(node.getAll("img"), function(img) {
                            img.attr("data-mce-contenteditable", "true");
                        }), !1 !== ed.settings.figure_data_attribute && node.attr("data-wf-figure", "1");
                    }), ed.parser.addNodeFilter("figcaption", function(nodes, name) {
                        for (var node, i = nodes.length; i--; ) (node = nodes[i]).firstChild || node.attr("data-mce-empty", ed.getLang("figcaption.default", "Write a caption...")), 
                        node.attr("contenteditable", "true");
                    }), ed.serializer.addNodeFilter("figure", function(nodes, name) {
                        for (var node, i = nodes.length; i--; ) (node = nodes[i]).attr("contenteditable", null), 
                        each(node.getAll("img"), function(img) {
                            img.attr("data-mce-contenteditable", null);
                        });
                    }), ed.serializer.addNodeFilter("figcaption", function(nodes, name) {
                        for (var node, i = nodes.length; i--; ) (node = nodes[i]).firstChild ? node.attr("contenteditable", null) : node.remove();
                    }), ed.serializer.addAttributeFilter("data-mce-image", function(nodes, name) {
                        for (var i = nodes.length; i--; ) nodes[i].attr(name, null);
                    }), each(ed.schema.getBlockElements(), function(v, k) {
                        if (/\W/.test(k)) return !0;
                        blocks.push(k.toLowerCase());
                    }), ed.formatter.register("figure", {
                        block: "figure",
                        remove: "all",
                        ceFalseOverride: !0,
                        deep: !1,
                        onformat: function(elm, fmt, vars, node) {
                            vars = vars || {}, ed.dom.select("img,video,iframe", elm) && (ed.dom.setAttribs(elm, {
                                "data-mce-image": 1,
                                contenteditable: !1
                            }), ed.dom.setAttrib(ed.dom.select("img", elm), "data-mce-contenteditable", "true"), 
                            ed.dom.add(elm, "figcaption", {
                                "data-mce-empty": ed.getLang("figcaption.default", "Write a caption..."),
                                contenteditable: !0
                            }, vars.caption || ""), !1 !== ed.settings.figure_data_attribute) && ed.dom.setAttribs(elm, {
                                "data-wf-figure": "1"
                            });
                        },
                        onremove: function(node) {
                            ed.dom.remove(ed.dom.select("figcaption", node)), ed.dom.remove(ed.dom.getParent("figure", node), 1);
                        }
                    }), ed.onBeforeExecCommand.add(function(ed, cmd, ui, v, o) {
                        var parent, se = ed.selection, n = se.getNode();
                        switch (cmd) {
                          case "JustifyRight":
                          case "JustifyLeft":
                          case "JustifyCenter":
                            n && ed.dom.is(n, "img,span[data-mce-object]") && (parent = ed.dom.getParent(n, "FIGURE")) && (se.select(parent), 
                            ed.execCommand(cmd, !1), o.terminate = !0);
                        }
                    }), ed.onKeyDown.add(function(ed, e) {
                        var container, offset, isDelete = e.keyCode == VK.DELETE;
                        if (!e.isDefaultPrevented() && (isDelete || e.keyCode == VK.BACKSPACE) && !VK.modifierPressed(e) && (container = (isDelete = ed.selection.getRng()).startContainer, 
                        offset = isDelete.startOffset, isDelete = isDelete.collapsed, 
                        container = ed.dom.getParent(container, "FIGURE"))) {
                            var node = ed.selection.getNode();
                            if ("IMG" === node.nodeName) ed.dom.remove(container), 
                            ed.nodeChanged(), e.preventDefault(); else if ("FIGCAPTION" != node.nodeName || node.nodeValue && 0 !== node.nodeValue.length || 0 !== node.childNodes.length || e.preventDefault(), 
                            3 === node.nodeType && !isDelete && !offset) {
                                var figcaption = ed.dom.getParent(node, "FIGCAPTION");
                                if (figcaption) {
                                    for (;figcaption.firstChild; ) figcaption.removeChild(figcaption.firstChild);
                                    e.preventDefault();
                                }
                            }
                        }
                    });
                });
            }
        }), tinymce.PluginManager.add("figure", tinymce.plugins.Figure);
    }(), tinymce.create("tinymce.plugins.UiPlugin", {
        init: function(ed, url) {}
    }), tinymce.PluginManager.add("ui", tinymce.plugins.UiPlugin), function() {
        var DOM = tinymce.DOM;
        tinymce.PluginManager.add("noneditable", function(editor) {
            var editClass = tinymce.trim(editor.getParam("noneditable_editable_class", "mceEditable")), nonEditClass = tinymce.trim(editor.getParam("noneditable_noneditable_class", "mceNonEditable"));
            function hasClass(checkClassName) {
                return function(node) {
                    return -1 !== (" " + node.attr("class") + " ").indexOf(checkClassName);
                };
            }
            var nonEditableRegExps, hasEditClass = hasClass(editClass), hasNonEditClass = hasClass(nonEditClass);
            return (nonEditableRegExps = editor.getParam("noneditable_regexp")) && !nonEditableRegExps.length && (nonEditableRegExps = [ nonEditableRegExps ]), 
            editor.onPreInit.add(function() {
                editor.formatter.register("noneditable", {
                    block: "div",
                    wrapper: !0,
                    onformat: function(elm, fmt, vars) {
                        tinymce.each(vars, function(value, key) {
                            editor.dom.setAttrib(elm, key, value);
                        });
                    }
                }), nonEditableRegExps && editor.onBeforeSetContent.add(function(ed, e) {
                    !function(e) {
                        var i = nonEditableRegExps.length, content = e.content, cls = tinymce.trim(nonEditClass);
                        function replaceMatchWithSpan(match) {
                            var args = arguments, index = args[args.length - 2], prevChar = 0 < index ? content.charAt(index - 1) : "";
                            return '"' === prevChar || ">" === prevChar && -1 !== (prevChar = content.lastIndexOf("<", index)) && -1 !== content.substring(prevChar, index).indexOf('contenteditable="false"') ? match : '<span class="' + cls + '" data-mce-content="' + editor.dom.encode(args[0]) + '">' + editor.dom.encode("string" == typeof args[1] ? args[1] : args[0]) + "</span>";
                        }
                        if ("raw" != e.format) {
                            for (;i--; ) content = content.replace(nonEditableRegExps[i], replaceMatchWithSpan);
                            e.content = content;
                        }
                    }(e);
                }), editor.parser.addAttributeFilter("class", function(nodes) {
                    for (var node, i = nodes.length; i--; ) node = nodes[i], hasEditClass(node) ? node.attr("contenteditable", "true") : hasNonEditClass(node) && node.attr("contenteditable", "false");
                }), editor.serializer.addAttributeFilter("contenteditable", function(nodes) {
                    for (var node, i = nodes.length; i--; ) node = nodes[i], (hasEditClass(node) || hasNonEditClass(node)) && (nonEditableRegExps && node.attr("data-mce-content") ? (node.name = "#text", 
                    node.type = 3, node.raw = !0, node.value = node.attr("data-mce-content")) : node.attr("contenteditable", null));
                });
            }), {
                isNonEditable: function(node) {
                    return node.attr ? node.hasClass(nonEditClass) : DOM.hasClass(node, nonEditClass);
                },
                isEditable: function(node) {
                    return node.attr ? node.hasClass(editClass) : DOM.hasClass(node, editClass);
                }
            };
        });
    }(), function() {
        var DOM = tinymce.DOM;
        tinymce.create("tinymce.plugins.BrandingPlugin", {
            init: function(ed, url) {
                !1 !== ed.settings.branding && (ed.onPostRender.add(function() {
                    var container = ed.getContentAreaContainer();
                    DOM.insertAfter(DOM.create("div", {
                        class: "mceBranding"
                    }, 'Powered by JCE Core. <span id="mceBrandingMessage"></span><a href="https://www.joomlacontenteditor.net/purchase" target="_blank" title="Get JCE Pro">JCE Pro</a>'), container);
                }), ed.onNodeChange.add(function(ed, cm, n, co) {
                    var container = ed.getContentAreaContainer(), msg = "Get more features with ";
                    "IMG" === n.nodeName && (msg = "Image resizing, thumbnails and editing in "), 
                    ed.dom.is(n, ".mce-item-media") && (msg = "Upload and manage audio and video with "), 
                    DOM.setHTML(DOM.get("mceBrandingMessage", container), msg);
                }));
            }
        }), tinymce.PluginManager.add("branding", tinymce.plugins.BrandingPlugin);
    }(), function() {
        function uniqueId(prefix) {
            return (prefix || "blobid") + count++;
        }
        var each = tinymce.each, BlobCache = tinymce.file.BlobCache, Conversions = tinymce.file.Conversions, Uuid = tinymce.util.Uuid, DOM = tinymce.DOM, count = 0;
        tinymce.PluginManager.add("blobupload", function(ed, url) {
            var uploaders = [];
            function findMarker(marker) {
                var found;
                return each(ed.dom.select("img[src]"), function(image) {
                    if (image.src == marker.src) return found = image, !1;
                }), found;
            }
            function removeMarker(marker) {
                each(ed.dom.select("img[src]"), function(image) {
                    image.src == marker.src && (ed.selection.select(image), ed.execCommand("mceRemoveNode"), 
                    "P" == (image = ed.selection.getNode()).nodeName) && ed.dom.isEmpty(image) && ed.dom.add(image, "br", {
                        "data-mce-bogus": 1
                    });
                });
            }
            function uploadPastedImage(marker, blobInfo) {
                return new Promise(function(resolve, reject) {
                    if (!uploaders.length) return removeMarker(marker), resolve();
                    var html = '<div class="mceForm"><p>' + ed.getLang("upload.name_description", "Please supply a name for this file") + '</p><div class="mceModalRow">   <label for="' + ed.id + '_blob_input">' + ed.getLang("dlg.name", "Name") + '</label>   <div class="mceModalControl mceModalControlAppend">       <input type="text" id="' + ed.id + '_blob_input" autofocus />       <select id="' + ed.id + '_blob_mimetype">           <option value="jpeg">jpeg</option>           <option value="png">png</option>       </select>   </div></div><div class="mceModalRow">   <label for="' + ed.id + '_blob_input">' + ed.getLang("dlg.quality", "Quality") + '</label>   <div class="mceModalControl">       <select id="' + ed.id + '_blob_quality" class="mce-flex-25">           <option value="100">100</option>           <option value="90">90</option>           <option value="80">80</option>           <option value="70">70</option>           <option value="60">60</option>           <option value="50">50</option>           <option value="40">40</option>           <option value="30">30</option>           <option value="20">20</option>           <option value="10">10</option>       </select>       <span role="presentation">%</span>   </div></div></div>', win = ed.windowManager.open({
                        title: ed.getLang("dlg.name", "Name"),
                        content: html,
                        size: "mce-modal-landscape-small",
                        buttons: [ {
                            title: ed.getLang("cancel", "Cancel"),
                            id: "cancel"
                        }, {
                            title: ed.getLang("submit", "Submit"),
                            id: "submit",
                            onclick: function(e) {
                                var url, uploader, quality, value, images, filename = DOM.getValue(ed.id + "_blob_input");
                                return filename ? (filename = filename.replace(/[\+\\\/\?\#%&<>"\'=\[\]\{\},;@\^\(\)\xa3\u20ac$~]/g, ""), 
                                /\.(php([0-9]*)|phtml|pl|py|jsp|asp|htm|html|shtml|sh|cgi)\b/i.test(filename) ? (ed.windowManager.alert(ed.getLang("upload.file_extension_error", "File type not supported")), 
                                removeMarker(marker), resolve()) : (each(uploaders, function(instance) {
                                    if (!url && (url = instance.getUploadURL({
                                        name: blobInfo.filename()
                                    }))) return uploader = instance, !1;
                                }), url ? (value = blobInfo.filename(), value = (/\.(jpg|jpeg|png|gif|webp|avif)$/.test(value) ? value.substring(value.length, value.lastIndexOf(".") + 1) : "") || "jpeg", 
                                quality = DOM.getValue(ed.id + "_blob_quality") || 100, 
                                value = DOM.getValue(ed.id + "_blob_mimetype") || value, 
                                filename = {
                                    method: "upload",
                                    id: Uuid.uuid("wf_"),
                                    inline: 1,
                                    name: filename,
                                    url: url + "&" + ed.settings.query,
                                    mimetype: "image/" + value,
                                    quality: quality
                                }, images = tinymce.grep(ed.dom.select("img[src]"), function(image) {
                                    return image.src == marker.src;
                                }), ed.setProgressState(!0), void function(settings, blobInfo, failure) {
                                    var formData, xhr = new XMLHttpRequest();
                                    xhr.open("POST", settings.url), xhr.upload.onprogress = function(e) {
                                        e.loaded, e.total;
                                    }, xhr.onerror = function() {
                                        failure("Image upload failed due to a XHR Transport error. Code: " + xhr.status);
                                    }, xhr.onload = function() {
                                        var json, data;
                                        xhr.status < 200 || 300 <= xhr.status ? failure("HTTP Error: " + xhr.status) : (json = JSON.parse(xhr.responseText)) && !json.error && json.result && json.result.files ? ((data = json.result.files[0]).marker = images[0], 
                                        (data = uploader.insertUploadedFile(data)) && (ed.undoManager.add(), 
                                        ed.dom.replace(data, images[0]), ed.selection.select(data)), 
                                        ed.setProgressState(!1), win.close(), resolve()) : failure(json.error.message || "Invalid JSON response!");
                                    }, (formData = new FormData()).append("file", blobInfo.blob(), blobInfo.filename()), 
                                    each(settings, function(value, name) {
                                        if ("url" == name || "multipart" == name) return !0;
                                        formData.append(name, value);
                                    }), xhr.send(formData);
                                }(filename, blobInfo, function(error) {
                                    ed.windowManager.alert(error), ed.setProgressState(!1), 
                                    resolve();
                                })) : (removeMarker(marker), resolve()))) : (removeMarker(marker), 
                                resolve());
                            },
                            classes: "primary"
                        } ],
                        open: function() {
                            window.setTimeout(function() {
                                DOM.get(ed.id + "_blob_input").focus();
                            }, 10);
                        },
                        close: function() {
                            return removeMarker(marker), resolve();
                        }
                    });
                });
            }
            ed.onPreInit.add(function() {
                each(ed.plugins, function(plg, name) {
                    var data;
                    tinymce.is(plg.getUploadConfig, "function") && (data = plg.getUploadConfig()).inline && data.filetypes && uploaders.push(plg);
                });
            }), ed.onInit.add(function() {
                ed.onPasteBeforeInsert.add(function(ed, o) {
                    var promises, images, cachedPromises, o = ed.dom.create("div", 0, o.content);
                    (o = tinymce.grep(ed.dom.select("img[src]", o), function(img) {
                        var src = img.getAttribute("src");
                        return !(img.hasAttribute("data-mce-bogus") || img.hasAttribute("data-mce-placeholder") || img.hasAttribute("data-mce-upload-marker") || !src || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" == src || 0 !== src.indexOf("blob:") && 0 !== src.indexOf("data:"));
                    })).length && (promises = [], images = o, cachedPromises = {}, 
                    images = tinymce.map(o, function(img) {
                        var newPromise;
                        return cachedPromises[img.src] ? new Promise(function(resolve) {
                            cachedPromises[img.src].then(function(imageInfo) {
                                if ("string" == typeof imageInfo) return imageInfo;
                                resolve({
                                    image: img,
                                    blobInfo: imageInfo.blobInfo
                                });
                            });
                        }) : (newPromise = new Promise(function(resolve, reject) {
                            !function(blobCache, img, resolve, reject) {
                                var base64, blobInfo;
                                0 === img.src.indexOf("blob:") ? (blobInfo = blobCache.getByUri(img.src)) ? resolve({
                                    image: img,
                                    blobInfo: blobInfo
                                }) : Conversions.uriToBlob(img.src).then(function(blob) {
                                    Conversions.blobToDataUri(blob).then(function(dataUri) {
                                        base64 = Conversions.parseDataUri(dataUri).data, 
                                        blobInfo = blobCache.create(uniqueId(), blob, base64), 
                                        blobCache.add(blobInfo), resolve({
                                            image: img,
                                            blobInfo: blobInfo
                                        });
                                    });
                                }, function(err) {
                                    reject(err);
                                }) : (base64 = Conversions.parseDataUri(img.src).data, 
                                (blobInfo = blobCache.findFirst(function(cachedBlobInfo) {
                                    return cachedBlobInfo.base64() === base64;
                                })) ? resolve({
                                    image: img,
                                    blobInfo: blobInfo
                                }) : Conversions.uriToBlob(img.src).then(function(blob) {
                                    blobInfo = blobCache.create(uniqueId(), blob, base64), 
                                    blobCache.add(blobInfo), resolve({
                                        image: img,
                                        blobInfo: blobInfo
                                    });
                                }, function(err) {
                                    reject(err);
                                }));
                            }(BlobCache, img, resolve, reject);
                        }).then(function(result) {
                            return delete cachedPromises[result.image.src], result;
                        }).catch(function(error) {
                            return delete cachedPromises[img.src], error;
                        }), cachedPromises[img.src] = newPromise);
                    }), Promise.all(images).then(function(result) {
                        each(result, function(item) {
                            "string" != typeof item && (ed.selection.select(findMarker(item.image)), 
                            ed.selection.scrollIntoView(), promises.push(uploadPastedImage(item.image, item.blobInfo)));
                        });
                    }), Promise.all(promises).then());
                });
            });
        });
    }();
}();