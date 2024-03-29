/*!
 * vue-resource v1.0.3
 * https://github.com/vuejs/vue-resource
 * Released under the MIT License.
 */

! function (t, n) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : t.VueResource = n()
}(this, function () {
    "use strict";

    function t(t) {
        this.state = it, this.value = void 0, this.deferred = [];
        var n = this;
        try {
            t(function (t) {
                n.resolve(t)
            }, function (t) {
                n.reject(t)
            })
        } catch (t) {
            n.reject(t)
        }
    }

    function n(t, n) {
        t instanceof Promise ? this.promise = t : this.promise = new Promise(t.bind(n)), this.context = n
    }

    function e(t) {
        at = t.util, ct = t.config.debug || !t.config.silent
    }

    function o(t) {
        "undefined" != typeof console && ct && console.warn("[VueResource warn]: " + t)
    }

    function r(t) {
        "undefined" != typeof console && console.error(t)
    }

    function i(t, n) {
        return at.nextTick(t, n)
    }

    function u(t) {
        return t.replace(/^\s*|\s*$/g, "")
    }

    function s(t) {
        return t ? t.toLowerCase() : ""
    }

    function c(t) {
        return t ? t.toUpperCase() : ""
    }

    function a(t) {
        return "string" == typeof t
    }

    function f(t) {
        return t === !0 || t === !1
    }

    function h(t) {
        return "function" == typeof t
    }

    function p(t) {
        return null !== t && "object" == typeof t
    }

    function l(t) {
        return p(t) && Object.getPrototypeOf(t) == Object.prototype
    }

    function d(t) {
        return "undefined" != typeof Blob && t instanceof Blob
    }

    function m(t) {
        return "undefined" != typeof FormData && t instanceof FormData
    }

    function y(t, e, o) {
        var r = n.resolve(t);
        return arguments.length < 2 ? r : r.then(e, o)
    }

    function v(t, n, e) {
        return e = e || {}, h(e) && (e = e.call(n)), g(t.bind({
            $vm: n,
            $options: e
        }), t, {
            $options: e
        })
    }

    function b(t, n) {
        var e, o;
        if (t && "number" == typeof t.length)
            for (e = 0; e < t.length; e++) n.call(t[e], t[e], e);
        else if (p(t))
            for (o in t) t.hasOwnProperty(o) && n.call(t[o], t[o], o);
        return t
    }

    function g(t) {
        var n = ft.call(arguments, 1);
        return n.forEach(function (n) {
            x(t, n, !0)
        }), t
    }

    function w(t) {
        var n = ft.call(arguments, 1);
        return n.forEach(function (n) {
            for (var e in n) void 0 === t[e] && (t[e] = n[e])
        }), t
    }

    function T(t) {
        var n = ft.call(arguments, 1);
        return n.forEach(function (n) {
            x(t, n)
        }), t
    }

    function x(t, n, e) {
        for (var o in n) e && (l(n[o]) || ht(n[o])) ? (l(n[o]) && !l(t[o]) && (t[o] = {}), ht(n[o]) && !ht(t[o]) && (t[o] = []), x(t[o], n[o], e)) : void 0 !== n[o] && (t[o] = n[o])
    }

    function j(t, n) {
        var e = n(t);
        return a(t.root) && !e.match(/^(https?:)?\//) && (e = t.root + "/" + e), e
    }

    function E(t, n) {
        var e = Object.keys(k.options.params),
            o = {},
            r = n(t);
        return b(t.params, function (t, n) {
            e.indexOf(n) === -1 && (o[n] = t)
        }), o = k.params(o), o && (r += (r.indexOf("?") == -1 ? "?" : "&") + o), r
    }

    function O(t, n, e) {
        var o = P(t),
            r = o.expand(n);
        return e && e.push.apply(e, o.vars), r
    }

    function P(t) {
        var n = ["+", "#", ".", "/", ";", "?", "&"],
            e = [];
        return {
            vars: e,
            expand: function (o) {
                return t.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (t, r, i) {
                    if (r) {
                        var u = null,
                            s = [];
                        if (n.indexOf(r.charAt(0)) !== -1 && (u = r.charAt(0), r = r.substr(1)), r.split(/,/g).forEach(function (t) {
                                var n = /([^:\*]*)(?::(\d+)|(\*))?/.exec(t);
                                s.push.apply(s, C(o, u, n[1], n[2] || n[3])), e.push(n[1])
                            }), u && "+" !== u) {
                            var c = ",";
                            return "?" === u ? c = "&" : "#" !== u && (c = u), (0 !== s.length ? u : "") + s.join(c)
                        }
                        return s.join(",")
                    }
                    return U(i)
                })
            }
        }
    }

    function C(t, n, e, o) {
        var r = t[e],
            i = [];
        if ($(r) && "" !== r)
            if ("string" == typeof r || "number" == typeof r || "boolean" == typeof r) r = r.toString(), o && "*" !== o && (r = r.substring(0, parseInt(o, 10))), i.push(R(n, r, A(n) ? e : null));
            else if ("*" === o) Array.isArray(r) ? r.filter($).forEach(function (t) {
            i.push(R(n, t, A(n) ? e : null))
        }) : Object.keys(r).forEach(function (t) {
            $(r[t]) && i.push(R(n, r[t], t))
        });
        else {
            var u = [];
            Array.isArray(r) ? r.filter($).forEach(function (t) {
                u.push(R(n, t))
            }) : Object.keys(r).forEach(function (t) {
                $(r[t]) && (u.push(encodeURIComponent(t)), u.push(R(n, r[t].toString())))
            }), A(n) ? i.push(encodeURIComponent(e) + "=" + u.join(",")) : 0 !== u.length && i.push(u.join(","))
        } else ";" === n ? i.push(encodeURIComponent(e)) : "" !== r || "&" !== n && "?" !== n ? "" === r && i.push("") : i.push(encodeURIComponent(e) + "=");
        return i
    }

    function $(t) {
        return void 0 !== t && null !== t
    }

    function A(t) {
        return ";" === t || "&" === t || "?" === t
    }

    function R(t, n, e) {
        return n = "+" === t || "#" === t ? U(n) : encodeURIComponent(n), e ? encodeURIComponent(e) + "=" + n : n
    }

    function U(t) {
        return t.split(/(%[0-9A-Fa-f]{2})/g).map(function (t) {
            return /%[0-9A-Fa-f]/.test(t) || (t = encodeURI(t)), t
        }).join("")
    }

    function S(t) {
        var n = [],
            e = O(t.url, t.params, n);
        return n.forEach(function (n) {
            delete t.params[n]
        }), e
    }

    function k(t, n) {
        var e, o = this || {},
            r = t;
        return a(t) && (r = {
            url: t,
            params: n
        }), r = g({}, k.options, o.$options, r), k.transforms.forEach(function (t) {
            e = I(t, e, o.$vm)
        }), e(r)
    }

    function I(t, n, e) {
        return function (o) {
            return t.call(e, o, n)
        }
    }

    function H(t, n, e) {
        var o, r = ht(n),
            i = l(n);
        b(n, function (n, u) {
            o = p(n) || ht(n), e && (u = e + "[" + (i || o ? u : "") + "]"), !e && r ? t.add(n.name, n.value) : o ? H(t, n, u) : t.add(u, n)
        })
    }

    function L(t) {
        return new n(function (n) {
            var e = new XDomainRequest,
                o = function (o) {
                    var r = o.type,
                        i = 0;
                    "load" === r ? i = 200 : "error" === r && (i = 500), n(t.respondWith(e.responseText, {
                        status: i
                    }))
                };
            t.abort = function () {
                return e.abort()
            }, e.open(t.method, t.getUrl()), e.timeout = 0, e.onload = o, e.onerror = o, e.ontimeout = o, e.onprogress = function () {}, e.send(t.getBody())
        })
    }

    function N(t, n) {
        !f(t.crossOrigin) && q(t) && (t.crossOrigin = !0), t.crossOrigin && (yt || (t.client = L), delete t.emulateHTTP), n()
    }

    function q(t) {
        var n = k.parse(k(t));
        return n.protocol !== mt.protocol || n.host !== mt.host
    }

    function B(t, n) {
        m(t.body) ? t.headers.delete("Content-Type") : (p(t.body) || ht(t.body)) && (t.emulateJSON ? (t.body = k.params(t.body), t.headers.set("Content-Type", "application/x-www-form-urlencoded")) : t.body = JSON.stringify(t.body)), n(function (t) {
            return Object.defineProperty(t, "data", {
                get: function () {
                    return this.body
                },
                set: function (t) {
                    this.body = t
                }
            }), t.bodyText ? y(t.text(), function (n) {
                var e = t.headers.get("Content-Type");
                if (a(e) && 0 === e.indexOf("application/json")) try {
                    t.body = JSON.parse(n)
                } catch (n) {
                    t.body = null
                } else t.body = n;
                return t
            }) : t
        })
    }

    function J(t) {
        return new n(function (n) {
            var e, o, r = t.jsonp || "callback",
                i = "_jsonp" + Math.random().toString(36).substr(2),
                u = null;
            e = function (e) {
                var r = e.type,
                    s = 0;
                "load" === r && null !== u ? s = 200 : "error" === r && (s = 500), n(t.respondWith(u, {
                    status: s
                })), delete window[i], document.body.removeChild(o)
            }, t.params[r] = i, window[i] = function (t) {
                u = JSON.stringify(t)
            }, o = document.createElement("script"), o.src = t.getUrl(), o.type = "text/javascript", o.async = !0, o.onload = e, o.onerror = e, document.body.appendChild(o)
        })
    }

    function D(t, n) {
        "JSONP" == t.method && (t.client = J), n(function (n) {
            if ("JSONP" == t.method) return y(n.json(), function (t) {
                return n.body = t, n
            })
        })
    }

    function M(t, n) {
        h(t.before) && t.before.call(this, t), n()
    }

    function X(t, n) {
        t.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(t.method) && (t.headers.set("X-HTTP-Method-Override", t.method), t.method = "POST"), n()
    }

    function F(t, n) {
        var e = pt({}, Z.headers.common, t.crossOrigin ? {} : Z.headers.custom, Z.headers[s(t.method)]);
        b(e, function (n, e) {
            t.headers.has(e) || t.headers.set(e, n)
        }), n()
    }

    function W(t, n) {
        var e;
        t.timeout && (e = setTimeout(function () {
            t.abort()
        }, t.timeout)), n(function (t) {
            clearTimeout(e)
        })
    }

    function G(t) {
        return new n(function (n) {
            var e = new XMLHttpRequest,
                o = function (o) {
                    var r = t.respondWith("response" in e ? e.response : e.responseText, {
                        status: 1223 === e.status ? 204 : e.status,
                        statusText: 1223 === e.status ? "No Content" : u(e.statusText)
                    });
                    b(u(e.getAllResponseHeaders()).split("\n"), function (t) {
                        r.headers.append(t.slice(0, t.indexOf(":")), t.slice(t.indexOf(":") + 1))
                    }), n(r)
                };
            t.abort = function () {
                return e.abort()
            }, t.progress && ("GET" === t.method ? e.addEventListener("progress", t.progress) : /^(POST|PUT)$/i.test(t.method) && e.upload.addEventListener("progress", t.progress)), e.open(t.method, t.getUrl(), !0), "responseType" in e && (e.responseType = "blob"), t.credentials === !0 && (e.withCredentials = !0), t.headers.forEach(function (t, n) {
                e.setRequestHeader(n, t)
            }), e.timeout = 0, e.onload = o, e.onerror = o, e.send(t.getBody())
        })
    }

    function V(t) {
        function e(e) {
            return new n(function (n) {
                function s() {
                    r = i.pop(), h(r) ? r.call(t, e, c) : (o("Invalid interceptor of type " + typeof r + ", must be a function"), c())
                }

                function c(e) {
                    if (h(e)) u.unshift(e);
                    else if (p(e)) return u.forEach(function (n) {
                        e = y(e, function (e) {
                            return n.call(t, e) || e
                        })
                    }), void y(e, n);
                    s()
                }
                s()
            }, t)
        }
        var r, i = [_],
            u = [];
        return p(t) || (t = null), e.use = function (t) {
            i.push(t)
        }, e
    }

    function _(t, n) {
        var e = t.client || G;
        n(e(t))
    }

    function z(t, n) {
        return Object.keys(t).reduce(function (t, e) {
            return s(n) === s(e) ? e : t
        }, null)
    }

    function K(t) {
        if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t)) throw new TypeError("Invalid character in header field name");
        return u(t)
    }

    function Q(t) {
        return new n(function (n) {
            var e = new FileReader;
            e.readAsText(t), e.onload = function () {
                n(e.result)
            }
        })
    }

    function Y(t) {
        return 0 === t.type.indexOf("text") || t.type.indexOf("json") !== -1
    }

    function Z(t) {
        var e = this || {},
            o = V(e.$vm);
        return w(t || {}, e.$options, Z.options), Z.interceptors.forEach(function (t) {
            o.use(t)
        }), o(new wt(t)).then(function (t) {
            return t.ok ? t : n.reject(t)
        }, function (t) {
            return t instanceof Error && r(t), n.reject(t)
        })
    }

    function tt(t, n, e, o) {
        var r = this || {},
            i = {};
        return e = pt({}, tt.actions, e), b(e, function (e, u) {
            e = g({
                url: t,
                params: pt({}, n)
            }, o, e), i[u] = function () {
                return (r.$http || Z)(nt(e, arguments))
            }
        }), i
    }

    function nt(t, n) {
        var e, o = pt({}, t),
            r = {};
        switch (n.length) {
            case 2:
                r = n[0], e = n[1];
                break;
            case 1:
                /^(POST|PUT|PATCH)$/i.test(o.method) ? e = n[0] : r = n[0];
                break;
            case 0:
                break;
            default:
                throw "Expected up to 4 arguments [params, body], got " + n.length + " arguments"
        }
        return o.body = e, o.params = pt({}, o.params, r), o
    }

    function et(t) {
        et.installed || (e(t), t.url = k, t.http = Z, t.resource = tt, t.Promise = n, Object.defineProperties(t.prototype, {
            $url: {
                get: function () {
                    return v(t.url, this, this.$options.url)
                }
            },
            $http: {
                get: function () {
                    return v(t.http, this, this.$options.http)
                }
            },
            $resource: {
                get: function () {
                    return t.resource.bind(this)
                }
            },
            $promise: {
                get: function () {
                    var n = this;
                    return function (e) {
                        return new t.Promise(e, n)
                    }
                }
            }
        }))
    }
    var ot = 0,
        rt = 1,
        it = 2;
    t.reject = function (n) {
        return new t(function (t, e) {
            e(n)
        })
    }, t.resolve = function (n) {
        return new t(function (t, e) {
            t(n)
        })
    }, t.all = function (n) {
        return new t(function (e, o) {
            function r(t) {
                return function (o) {
                    u[t] = o, i += 1, i === n.length && e(u)
                }
            }
            var i = 0,
                u = [];
            0 === n.length && e(u);
            for (var s = 0; s < n.length; s += 1) t.resolve(n[s]).then(r(s), o)
        })
    }, t.race = function (n) {
        return new t(function (e, o) {
            for (var r = 0; r < n.length; r += 1) t.resolve(n[r]).then(e, o)
        })
    };
    var ut = t.prototype;
    ut.resolve = function (t) {
        var n = this;
        if (n.state === it) {
            if (t === n) throw new TypeError("Promise settled with itself.");
            var e = !1;
            try {
                var o = t && t.then;
                if (null !== t && "object" == typeof t && "function" == typeof o) return void o.call(t, function (t) {
                    e || n.resolve(t), e = !0
                }, function (t) {
                    e || n.reject(t), e = !0
                })
            } catch (t) {
                return void(e || n.reject(t))
            }
            n.state = ot, n.value = t, n.notify()
        }
    }, ut.reject = function (t) {
        var n = this;
        if (n.state === it) {
            if (t === n) throw new TypeError("Promise settled with itself.");
            n.state = rt, n.value = t, n.notify()
        }
    }, ut.notify = function () {
        var t = this;
        i(function () {
            if (t.state !== it)
                for (; t.deferred.length;) {
                    var n = t.deferred.shift(),
                        e = n[0],
                        o = n[1],
                        r = n[2],
                        i = n[3];
                    try {
                        t.state === ot ? r("function" == typeof e ? e.call(void 0, t.value) : t.value) : t.state === rt && ("function" == typeof o ? r(o.call(void 0, t.value)) : i(t.value))
                    } catch (t) {
                        i(t)
                    }
                }
        })
    }, ut.then = function (n, e) {
        var o = this;
        return new t(function (t, r) {
            o.deferred.push([n, e, t, r]), o.notify()
        })
    }, ut.catch = function (t) {
        return this.then(void 0, t)
    }, "undefined" == typeof Promise && (window.Promise = t), n.all = function (t, e) {
        return new n(Promise.all(t), e)
    }, n.resolve = function (t, e) {
        return new n(Promise.resolve(t), e)
    }, n.reject = function (t, e) {
        return new n(Promise.reject(t), e)
    }, n.race = function (t, e) {
        return new n(Promise.race(t), e)
    };
    var st = n.prototype;
    st.bind = function (t) {
        return this.context = t, this
    }, st.then = function (t, e) {
        return t && t.bind && this.context && (t = t.bind(this.context)), e && e.bind && this.context && (e = e.bind(this.context)), new n(this.promise.then(t, e), this.context)
    }, st.catch = function (t) {
        return t && t.bind && this.context && (t = t.bind(this.context)), new n(this.promise.catch(t), this.context)
    }, st.finally = function (t) {
        return this.then(function (n) {
            return t.call(this), n
        }, function (n) {
            return t.call(this), Promise.reject(n)
        })
    };
    var ct = !1,
        at = {},
        ft = [].slice,
        ht = Array.isArray,
        pt = Object.assign || T,
        lt = document.documentMode,
        dt = document.createElement("a");
    k.options = {
        url: "",
        root: null,
        params: {}
    }, k.transforms = [S, E, j], k.params = function (t) {
        var n = [],
            e = encodeURIComponent;
        return n.add = function (t, n) {
            h(n) && (n = n()), null === n && (n = ""), this.push(e(t) + "=" + e(n))
        }, H(n, t), n.join("&").replace(/%20/g, "+")
    }, k.parse = function (t) {
        return lt && (dt.href = t, t = dt.href), dt.href = t, {
            href: dt.href,
            protocol: dt.protocol ? dt.protocol.replace(/:$/, "") : "",
            port: dt.port,
            host: dt.host,
            hostname: dt.hostname,
            pathname: "/" === dt.pathname.charAt(0) ? dt.pathname : "/" + dt.pathname,
            search: dt.search ? dt.search.replace(/^\?/, "") : "",
            hash: dt.hash ? dt.hash.replace(/^#/, "") : ""
        }
    };
    var mt = k.parse(location.href),
        yt = "withCredentials" in new XMLHttpRequest,
        vt = function (t, n) {
            if (!(t instanceof n)) throw new TypeError("Cannot call a class as a function")
        },
        bt = function () {
            function t(n) {
                var e = this;
                vt(this, t), this.map = {}, b(n, function (t, n) {
                    return e.append(n, t)
                })
            }
            return t.prototype.has = function (t) {
                return null !== z(this.map, t)
            }, t.prototype.get = function (t) {
                var n = this.map[z(this.map, t)];
                return n ? n[0] : null
            }, t.prototype.getAll = function (t) {
                return this.map[z(this.map, t)] || []
            }, t.prototype.set = function (t, n) {
                this.map[K(z(this.map, t) || t)] = [u(n)]
            }, t.prototype.append = function (t, n) {
                var e = this.getAll(t);
                e.length ? e.push(u(n)) : this.set(t, n)
            }, t.prototype.delete = function (t) {
                delete this.map[z(this.map, t)]
            }, t.prototype.forEach = function (t, n) {
                var e = this;
                b(this.map, function (o, r) {
                    b(o, function (o) {
                        return t.call(n, o, r, e)
                    })
                })
            }, t
        }(),
        gt = function () {
            function t(n, e) {
                var o = e.url,
                    r = e.headers,
                    i = e.status,
                    u = e.statusText;
                vt(this, t), this.url = o, this.ok = i >= 200 && i < 300, this.status = i || 0, this.statusText = u || "", this.headers = new bt(r), this.body = n, a(n) ? this.bodyText = n : d(n) && (this.bodyBlob = n, Y(n) && (this.bodyText = Q(n)))
            }
            return t.prototype.blob = function () {
                return y(this.bodyBlob)
            }, t.prototype.text = function () {
                return y(this.bodyText)
            }, t.prototype.json = function () {
                return y(this.text(), function (t) {
                    return JSON.parse(t)
                })
            }, t
        }(),
        wt = function () {
            function t(n) {
                vt(this, t), this.body = null, this.params = {}, pt(this, n, {
                    method: c(n.method || "GET")
                }), this.headers instanceof bt || (this.headers = new bt(this.headers))
            }
            return t.prototype.getUrl = function () {
                return k(this)
            }, t.prototype.getBody = function () {
                return this.body
            }, t.prototype.respondWith = function (t, n) {
                return new gt(t, pt(n || {}, {
                    url: this.getUrl()
                }))
            }, t
        }(),
        Tt = {
            "X-Requested-With": "XMLHttpRequest"
        },
        xt = {
            Accept: "application/json, text/plain, */*"
        },
        jt = {
            "Content-Type": "application/json;charset=utf-8"
        };
    return Z.options = {}, Z.headers = {
        put: jt,
        post: jt,
        patch: jt,
        delete: jt,
        custom: Tt,
        common: xt
    }, Z.interceptors = [M, W, X, B, D, F, N], ["get", "delete", "head", "jsonp"].forEach(function (t) {
        Z[t] = function (n, e) {
            return this(pt(e || {}, {
                url: n,
                method: t
            }))
        }
    }), ["post", "put", "patch"].forEach(function (t) {
        Z[t] = function (n, e, o) {
            return this(pt(o || {}, {
                url: n,
                method: t,
                body: e
            }))
        }
    }), tt.actions = {
        get: {
            method: "GET"
        },
        save: {
            method: "POST"
        },
        query: {
            method: "GET"
        },
        update: {
            method: "PUT"
        },
        remove: {
            method: "DELETE"
        },
        delete: {
            method: "DELETE"
        }
    }, "undefined" != typeof window && window.Vue && window.Vue.use(et), et
});