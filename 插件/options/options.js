var smarttoc = function (Ae) {
    "use strict";
    var se = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {},
        ke, st;

    function re() {
        if (st) return ke;
        st = 1;

        function t(n, a, c, l, p, m) {
            return {
                tag: n,
                key: a,
                attrs: c,
                children: l,
                text: p,
                dom: m,
                domSize: void 0,
                state: void 0,
                events: void 0,
                instance: void 0
            }
        }

        return t.normalize = function (n) {
            return Array.isArray(n) ? t("[", void 0, void 0, t.normalizeChildren(n), void 0, void 0) : n == null || typeof n == "boolean" ? null : typeof n == "object" ? n : t("#", void 0, void 0, String(n), void 0, void 0)
        }, t.normalizeChildren = function (n) {
            var a = [];
            if (n.length) {
                for (var c = n[0] != null && n[0].key != null, l = 1; l < n.length; l++) if ((n[l] != null && n[l].key != null) !== c) throw new TypeError(c && (n[l] != null || typeof n[l] == "boolean") ? "In fragments, vnodes must either all have keys or none have keys. You may wish to consider using an explicit keyed empty fragment, m.fragment({key: ...}), instead of a hole." : "In fragments, vnodes must either all have keys or none have keys.");
                for (var l = 0; l < n.length; l++) a[l] = t.normalize(n[l])
            }
            return a
        }, ke = t, ke
    }

    var Wt = re(), ut = function () {
            var t = arguments[this], n = this + 1, a;
            if (t == null ? t = {} : (typeof t != "object" || t.tag != null || Array.isArray(t)) && (t = {}, n = this), arguments.length === n + 1) a = arguments[n], Array.isArray(a) || (a = [a]); else for (a = []; n < arguments.length;) a.push(arguments[n++]);
            return Wt("", t.key, t, a)
        }, Te = {}.hasOwnProperty, Xt = re(), Zt = ut, ue = Te,
        er = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g, lt = {};

    function ft(t) {
        for (var n in t) if (ue.call(t, n)) return !1;
        return !0
    }

    function tr(t) {
        for (var n, a = "div", c = [], l = {}; n = er.exec(t);) {
            var p = n[1], m = n[2];
            if (p === "" && m !== "") a = m; else if (p === "#") l.id = m; else if (p === ".") c.push(m); else if (n[3][0] === "[") {
                var h = n[6];
                h && (h = h.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")), n[4] === "class" ? c.push(h) : l[n[4]] = h === "" ? h : h || !0
            }
        }
        return c.length > 0 && (l.className = c.join(" ")), lt[t] = {tag: a, attrs: l}
    }

    function rr(t, n) {
        var a = n.attrs, c = ue.call(a, "class"), l = c ? a.class : a.className;
        if (n.tag = t.tag, n.attrs = {}, !ft(t.attrs) && !ft(a)) {
            var p = {};
            for (var m in a) ue.call(a, m) && (p[m] = a[m]);
            a = p
        }
        for (var m in t.attrs) ue.call(t.attrs, m) && m !== "className" && !ue.call(a, m) && (a[m] = t.attrs[m]);
        (l != null || t.attrs.className != null) && (a.className = l != null ? t.attrs.className != null ? String(t.attrs.className) + " " + String(l) : l : t.attrs.className != null ? t.attrs.className : null), c && (a.class = null);
        for (var m in a) if (ue.call(a, m) && m !== "key") {
            n.attrs = a;
            break
        }
        return n
    }

    function nr(t) {
        if (t == null || typeof t != "string" && typeof t != "function" && typeof t.view != "function") throw Error("The selector must be either a string or a component.");
        var n = Zt.apply(1, arguments);
        return typeof t == "string" && (n.children = Xt.normalizeChildren(n.children), t !== "[") ? rr(lt[t] || tr(t), n) : (n.tag = t, n)
    }

    var pt = nr, ir = re(), ar = function (t) {
        return t == null && (t = ""), ir("<", void 0, void 0, t, void 0, void 0)
    }, or = re(), cr = ut, sr = function () {
        var t = cr.apply(0, arguments);
        return t.tag = "[", t.children = or.normalizeChildren(t.children), t
    }, qe = pt;
    qe.trust = ar, qe.fragment = sr;
    var ur = qe, ge = {exports: {}}, Oe, ht;

    function mt() {
        if (ht) return Oe;
        ht = 1;
        var t = function (n) {
            if (!(this instanceof t)) throw new Error("Promise must be called with 'new'.");
            if (typeof n != "function") throw new TypeError("executor must be a function.");
            var a = this, c = [], l = [], p = g(c, !0), m = g(l, !1), h = a._instance = {resolvers: c, rejectors: l},
                u = typeof setImmediate == "function" ? setImmediate : setTimeout;

            function g(C, P) {
                return function O(T) {
                    var w;
                    try {
                        if (P && T != null && (typeof T == "object" || typeof T == "function") && typeof (w = T.then) == "function") {
                            if (T === a) throw new TypeError("Promise can't be resolved with itself.");
                            y(w.bind(T))
                        } else u(function () {
                            !P && C.length === 0 && console.error("Possible unhandled promise rejection:", T);
                            for (var x = 0; x < C.length; x++) C[x](T);
                            c.length = 0, l.length = 0, h.state = P, h.retry = function () {
                                O(T)
                            }
                        })
                    } catch (x) {
                        m(x)
                    }
                }
            }

            function y(C) {
                var P = 0;

                function O(w) {
                    return function (x) {
                        P++ > 0 || w(x)
                    }
                }

                var T = O(m);
                try {
                    C(O(p), T)
                } catch (w) {
                    T(w)
                }
            }

            y(n)
        };
        return t.prototype.then = function (n, a) {
            var c = this, l = c._instance;

            function p(g, y, C, P) {
                y.push(function (O) {
                    if (typeof g != "function") C(O); else try {
                        m(g(O))
                    } catch (T) {
                        h && h(T)
                    }
                }), typeof l.retry == "function" && P === l.state && l.retry()
            }

            var m, h, u = new t(function (g, y) {
                m = g, h = y
            });
            return p(n, l.resolvers, m, !0), p(a, l.rejectors, h, !1), u
        }, t.prototype.catch = function (n) {
            return this.then(null, n)
        }, t.prototype.finally = function (n) {
            return this.then(function (a) {
                return t.resolve(n()).then(function () {
                    return a
                })
            }, function (a) {
                return t.resolve(n()).then(function () {
                    return t.reject(a)
                })
            })
        }, t.resolve = function (n) {
            return n instanceof t ? n : new t(function (a) {
                a(n)
            })
        }, t.reject = function (n) {
            return new t(function (a, c) {
                c(n)
            })
        }, t.all = function (n) {
            return new t(function (a, c) {
                var l = n.length, p = 0, m = [];
                if (n.length === 0) a([]); else for (var h = 0; h < n.length; h++) (function (u) {
                    function g(y) {
                        p++, m[u] = y, p === l && a(m)
                    }

                    n[u] != null && (typeof n[u] == "object" || typeof n[u] == "function") && typeof n[u].then == "function" ? n[u].then(g, c) : g(n[u])
                })(h)
            })
        }, t.race = function (n) {
            return new t(function (a, c) {
                for (var l = 0; l < n.length; l++) n[l].then(a, c)
            })
        }, Oe = t, Oe
    }

    var we = mt();
    typeof window < "u" ? (typeof window.Promise > "u" ? window.Promise = we : window.Promise.prototype.finally || (window.Promise.prototype.finally = we.prototype.finally), ge.exports = window.Promise) : typeof se < "u" ? (typeof se.Promise > "u" ? se.Promise = we : se.Promise.prototype.finally || (se.Promise.prototype.finally = we.prototype.finally), ge.exports = se.Promise) : ge.exports = we;
    var Le, dt;

    function lr() {
        if (dt) return Le;
        dt = 1;
        var t = re();
        return Le = function (n) {
            var a = n && n.document, c,
                l = {svg: "http://www.w3.org/2000/svg", math: "http://www.w3.org/1998/Math/MathML"};

            function p(r) {
                return r.attrs && r.attrs.xmlns || l[r.tag]
            }

            function m(r, e) {
                if (r.state !== e) throw new Error("'vnode.state' must not be modified.")
            }

            function h(r) {
                var e = r.state;
                try {
                    return this.apply(e, arguments)
                } finally {
                    m(r, e)
                }
            }

            function u() {
                try {
                    return a.activeElement
                } catch {
                    return null
                }
            }

            function g(r, e, i, s, f, d, v) {
                for (var I = i; I < s; I++) {
                    var b = e[I];
                    b != null && y(r, b, f, v, d)
                }
            }

            function y(r, e, i, s, f) {
                var d = e.tag;
                if (typeof d == "string") switch (e.state = {}, e.attrs != null && et(e.attrs, e, i), d) {
                    case"#":
                        C(r, e, f);
                        break;
                    case"<":
                        O(r, e, s, f);
                        break;
                    case"[":
                        T(r, e, i, s, f);
                        break;
                    default:
                        w(r, e, i, s, f)
                } else $(r, e, i, s, f)
            }

            function C(r, e, i) {
                e.dom = a.createTextNode(e.children), A(r, e.dom, i)
            }

            var P = {
                caption: "table",
                thead: "table",
                tbody: "table",
                tfoot: "table",
                tr: "tbody",
                th: "tr",
                td: "tr",
                colgroup: "table",
                col: "colgroup"
            };

            function O(r, e, i, s) {
                var f = e.children.match(/^\s*?<(\w+)/im) || [], d = a.createElement(P[f[1]] || "div");
                i === "http://www.w3.org/2000/svg" ? (d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + e.children + "</svg>", d = d.firstChild) : d.innerHTML = e.children, e.dom = d.firstChild, e.domSize = d.childNodes.length, e.instance = [];
                for (var v = a.createDocumentFragment(), I; I = d.firstChild;) e.instance.push(I), v.appendChild(I);
                A(r, v, s)
            }

            function T(r, e, i, s, f) {
                var d = a.createDocumentFragment();
                if (e.children != null) {
                    var v = e.children;
                    g(d, v, 0, v.length, i, null, s)
                }
                e.dom = d.firstChild, e.domSize = d.childNodes.length, A(r, d, f)
            }

            function w(r, e, i, s, f) {
                var d = e.tag, v = e.attrs, I = v && v.is;
                s = p(e) || s;
                var b = s ? I ? a.createElementNS(s, d, {is: I}) : a.createElementNS(s, d) : I ? a.createElement(d, {is: I}) : a.createElement(d);
                if (e.dom = b, v != null && We(e, v, s), A(r, b, f), !L(e) && e.children != null) {
                    var R = e.children;
                    g(b, R, 0, R.length, i, null, s), e.tag === "select" && v != null && Gr(e, v)
                }
            }

            function x(r, e) {
                var i;
                if (typeof r.tag.view == "function") {
                    if (r.state = Object.create(r.tag), i = r.state.view, i.$$reentrantLock$$ != null) return;
                    i.$$reentrantLock$$ = !0
                } else {
                    if (r.state = void 0, i = r.tag, i.$$reentrantLock$$ != null) return;
                    i.$$reentrantLock$$ = !0, r.state = r.tag.prototype != null && typeof r.tag.prototype.view == "function" ? new r.tag(r) : r.tag(r)
                }
                if (et(r.state, r, e), r.attrs != null && et(r.attrs, r, e), r.instance = t.normalize(h.call(r.state.view, r)), r.instance === r) throw Error("A view cannot return the vnode it received as argument");
                i.$$reentrantLock$$ = null
            }

            function $(r, e, i, s, f) {
                x(e, i), e.instance != null ? (y(r, e.instance, i, s, f), e.dom = e.instance.dom, e.domSize = e.dom != null ? e.instance.domSize : 0) : e.domSize = 0
            }

            function H(r, e, i, s, f, d) {
                if (!(e === i || e == null && i == null)) if (e == null || e.length === 0) g(r, i, 0, i.length, s, f, d); else if (i == null || i.length === 0) z(r, e, 0, e.length); else {
                    var v = e[0] != null && e[0].key != null, I = i[0] != null && i[0].key != null, b = 0, R = 0;
                    if (!v) for (; R < e.length && e[R] == null;) R++;
                    if (!I) for (; b < i.length && i[b] == null;) b++;
                    if (v !== I) z(r, e, R, e.length), g(r, i, b, i.length, s, f, d); else if (I) {
                        for (var V = e.length - 1, U = i.length - 1, Re, J, M, Y, S, nt; V >= R && U >= b && (Y = e[V], S = i[U], Y.key === S.key);) Y !== S && D(r, Y, S, s, f, d), S.dom != null && (f = S.dom), V--, U--;
                        for (; V >= R && U >= b && (J = e[R], M = i[b], J.key === M.key);) R++, b++, J !== M && D(r, J, M, s, te(e, R, f), d);
                        for (; V >= R && U >= b && !(b === U || J.key !== S.key || Y.key !== M.key);) nt = te(e, R, f), _(r, Y, nt), Y !== M && D(r, Y, M, s, nt, d), ++b <= --U && _(r, J, f), J !== S && D(r, J, S, s, f, d), S.dom != null && (f = S.dom), R++, V--, Y = e[V], S = i[U], J = e[R], M = i[b];
                        for (; V >= R && U >= b && Y.key === S.key;) Y !== S && D(r, Y, S, s, f, d), S.dom != null && (f = S.dom), V--, U--, Y = e[V], S = i[U];
                        if (b > U) z(r, e, R, V + 1); else if (R > V) g(r, i, b, U + 1, s, f, d); else {
                            var rn = f, Gt = U - b + 1, Ce = new Array(Gt), it = 0, j = 0, at = 2147483647, ot = 0, Re,
                                ct;
                            for (j = 0; j < Gt; j++) Ce[j] = -1;
                            for (j = U; j >= b; j--) {
                                Re == null && (Re = oe(e, R, V + 1)), S = i[j];
                                var ye = Re[S.key];
                                ye != null && (at = ye < at ? ye : -1, Ce[j - b] = ye, Y = e[ye], e[ye] = null, Y !== S && D(r, Y, S, s, f, d), S.dom != null && (f = S.dom), ot++)
                            }
                            if (f = rn, ot !== V - R + 1 && z(r, e, R, V + 1), ot === 0) g(r, i, b, U + 1, s, f, d); else if (at === -1) for (ct = ee(Ce), it = ct.length - 1, j = U; j >= b; j--) M = i[j], Ce[j - b] === -1 ? y(r, M, s, d, f) : ct[it] === j - b ? it-- : _(r, M, f), M.dom != null && (f = i[j].dom); else for (j = U; j >= b; j--) M = i[j], Ce[j - b] === -1 && y(r, M, s, d, f), M.dom != null && (f = i[j].dom)
                        }
                    } else {
                        var rt = e.length < i.length ? e.length : i.length;
                        for (b = b < R ? b : R; b < rt; b++) J = e[b], M = i[b], !(J === M || J == null && M == null) && (J == null ? y(r, M, s, d, te(e, b + 1, f)) : M == null ? N(r, J) : D(r, J, M, s, te(e, b + 1, f), d));
                        e.length > rt && z(r, e, b, e.length), i.length > rt && g(r, i, b, i.length, s, f, d)
                    }
                }
            }

            function D(r, e, i, s, f, d) {
                var v = e.tag, I = i.tag;
                if (v === I) {
                    if (i.state = e.state, i.events = e.events, tn(i, e)) return;
                    if (typeof v == "string") switch (i.attrs != null && tt(i.attrs, i, s), v) {
                        case"#":
                            me(e, i);
                            break;
                        case"<":
                            Z(r, e, i, d, f);
                            break;
                        case"[":
                            F(r, e, i, s, f, d);
                            break;
                        default:
                            X(e, i, s, d)
                    } else Q(r, e, i, s, f, d)
                } else N(r, e), y(r, i, s, d, f)
            }

            function me(r, e) {
                r.children.toString() !== e.children.toString() && (r.dom.nodeValue = e.children), e.dom = r.dom
            }

            function Z(r, e, i, s, f) {
                e.children !== i.children ? (k(r, e), O(r, i, s, f)) : (i.dom = e.dom, i.domSize = e.domSize, i.instance = e.instance)
            }

            function F(r, e, i, s, f, d) {
                H(r, e.children, i.children, s, f, d);
                var v = 0, I = i.children;
                if (i.dom = null, I != null) {
                    for (var b = 0; b < I.length; b++) {
                        var R = I[b];
                        R != null && R.dom != null && (i.dom == null && (i.dom = R.dom), v += R.domSize || 1)
                    }
                    v !== 1 && (i.domSize = v)
                }
            }

            function X(r, e, i, s) {
                var f = e.dom = r.dom;
                s = p(e) || s, e.tag === "textarea" && e.attrs == null && (e.attrs = {}), Wr(e, r.attrs, e.attrs, s), L(e) || H(f, r.children, e.children, i, null, s)
            }

            function Q(r, e, i, s, f, d) {
                if (i.instance = t.normalize(h.call(i.state.view, i)), i.instance === i) throw Error("A view cannot return the vnode it received as argument");
                tt(i.state, i, s), i.attrs != null && tt(i.attrs, i, s), i.instance != null ? (e.instance == null ? y(r, i.instance, s, d, f) : D(r, e.instance, i.instance, s, f, d), i.dom = i.instance.dom, i.domSize = i.instance.domSize) : e.instance != null ? (N(r, e.instance), i.dom = void 0, i.domSize = 0) : (i.dom = e.dom, i.domSize = e.domSize)
            }

            function oe(r, e, i) {
                for (var s = Object.create(null); e < i; e++) {
                    var f = r[e];
                    if (f != null) {
                        var d = f.key;
                        d != null && (s[d] = e)
                    }
                }
                return s
            }

            var G = [];

            function ee(r) {
                for (var e = [0], i = 0, s = 0, f = 0, d = G.length = r.length, f = 0; f < d; f++) G[f] = r[f];
                for (var f = 0; f < d; ++f) if (r[f] !== -1) {
                    var v = e[e.length - 1];
                    if (r[v] < r[f]) {
                        G[f] = v, e.push(f);
                        continue
                    }
                    for (i = 0, s = e.length - 1; i < s;) {
                        var I = (i >>> 1) + (s >>> 1) + (i & s & 1);
                        r[e[I]] < r[f] ? i = I + 1 : s = I
                    }
                    r[f] < r[e[i]] && (i > 0 && (G[f] = e[i - 1]), e[i] = f)
                }
                for (i = e.length, s = e[i - 1]; i-- > 0;) e[i] = s, s = G[s];
                return G.length = 0, e
            }

            function te(r, e, i) {
                for (; e < r.length; e++) if (r[e] != null && r[e].dom != null) return r[e].dom;
                return i
            }

            function _(r, e, i) {
                var s = a.createDocumentFragment();
                E(r, s, e), A(r, s, i)
            }

            function E(r, e, i) {
                for (; i.dom != null && i.dom.parentNode === r;) {
                    if (typeof i.tag != "string") {
                        if (i = i.instance, i != null) continue
                    } else if (i.tag === "<") for (var s = 0; s < i.instance.length; s++) e.appendChild(i.instance[s]); else if (i.tag !== "[") e.appendChild(i.dom); else if (i.children.length === 1) {
                        if (i = i.children[0], i != null) continue
                    } else for (var s = 0; s < i.children.length; s++) {
                        var f = i.children[s];
                        f != null && E(r, e, f)
                    }
                    break
                }
            }

            function A(r, e, i) {
                i != null ? r.insertBefore(e, i) : r.appendChild(e)
            }

            function L(r) {
                if (r.attrs == null || r.attrs.contenteditable == null && r.attrs.contentEditable == null) return !1;
                var e = r.children;
                if (e != null && e.length === 1 && e[0].tag === "<") {
                    var i = e[0].children;
                    r.dom.innerHTML !== i && (r.dom.innerHTML = i)
                } else if (e != null && e.length !== 0) throw new Error("Child node of a contenteditable must be trusted.");
                return !0
            }

            function z(r, e, i, s) {
                for (var f = i; f < s; f++) {
                    var d = e[f];
                    d != null && N(r, d)
                }
            }

            function N(r, e) {
                var i = 0, s = e.state, f, d;
                if (typeof e.tag != "string" && typeof e.state.onbeforeremove == "function") {
                    var v = h.call(e.state.onbeforeremove, e);
                    v != null && typeof v.then == "function" && (i = 1, f = v)
                }
                if (e.attrs && typeof e.attrs.onbeforeremove == "function") {
                    var v = h.call(e.attrs.onbeforeremove, e);
                    v != null && typeof v.then == "function" && (i |= 2, d = v)
                }
                if (m(e, s), !i) de(e), K(r, e); else {
                    if (f != null) {
                        var I = function () {
                            i & 1 && (i &= 2, i || b())
                        };
                        f.then(I, I)
                    }
                    if (d != null) {
                        var I = function () {
                            i & 2 && (i &= 1, i || b())
                        };
                        d.then(I, I)
                    }
                }

                function b() {
                    m(e, s), de(e), K(r, e)
                }
            }

            function k(r, e) {
                for (var i = 0; i < e.instance.length; i++) r.removeChild(e.instance[i])
            }

            function K(r, e) {
                for (; e.dom != null && e.dom.parentNode === r;) {
                    if (typeof e.tag != "string") {
                        if (e = e.instance, e != null) continue
                    } else if (e.tag === "<") k(r, e); else {
                        if (e.tag !== "[" && (r.removeChild(e.dom), !Array.isArray(e.children))) break;
                        if (e.children.length === 1) {
                            if (e = e.children[0], e != null) continue
                        } else for (var i = 0; i < e.children.length; i++) {
                            var s = e.children[i];
                            s != null && K(r, s)
                        }
                    }
                    break
                }
            }

            function de(r) {
                if (typeof r.tag != "string" && typeof r.state.onremove == "function" && h.call(r.state.onremove, r), r.attrs && typeof r.attrs.onremove == "function" && h.call(r.attrs.onremove, r), typeof r.tag != "string") r.instance != null && de(r.instance); else {
                    var e = r.children;
                    if (Array.isArray(e)) for (var i = 0; i < e.length; i++) {
                        var s = e[i];
                        s != null && de(s)
                    }
                }
            }

            function We(r, e, i) {
                r.tag === "input" && e.type != null && r.dom.setAttribute("type", e.type);
                var s = e != null && r.tag === "input" && e.type === "file";
                for (var f in e) ae(r, f, null, e[f], i, s)
            }

            function ae(r, e, i, s, f, d) {
                if (!(e === "key" || e === "is" || s == null || Kt(e) || i === s && !Xr(r, e) && typeof s != "object" || e === "type" && r.tag === "input")) {
                    if (e[0] === "o" && e[1] === "n") return Qt(r, e, s);
                    if (e.slice(0, 6) === "xlink:") r.dom.setAttributeNS("http://www.w3.org/1999/xlink", e.slice(6), s); else if (e === "style") Jt(r.dom, i, s); else if (Vt(r, e, f)) {
                        if (e === "value") {
                            if ((r.tag === "input" || r.tag === "textarea") && r.dom.value === "" + s && (d || r.dom === u()) || r.tag === "select" && i !== null && r.dom.value === "" + s || r.tag === "option" && i !== null && r.dom.value === "" + s) return;
                            if (d && "" + s != "") {
                                console.error("`value` is read-only on file inputs!");
                                return
                            }
                        }
                        r.dom[e] = s
                    } else typeof s == "boolean" ? s ? r.dom.setAttribute(e, "") : r.dom.removeAttribute(e) : r.dom.setAttribute(e === "className" ? "class" : e, s)
                }
            }

            function ce(r, e, i, s) {
                if (!(e === "key" || e === "is" || i == null || Kt(e))) if (e[0] === "o" && e[1] === "n") Qt(r, e, void 0); else if (e === "style") Jt(r.dom, i, null); else if (Vt(r, e, s) && e !== "className" && e !== "title" && !(e === "value" && (r.tag === "option" || r.tag === "select" && r.dom.selectedIndex === -1 && r.dom === u())) && !(r.tag === "input" && e === "type")) r.dom[e] = null; else {
                    var f = e.indexOf(":");
                    f !== -1 && (e = e.slice(f + 1)), i !== !1 && r.dom.removeAttribute(e === "className" ? "class" : e)
                }
            }

            function Gr(r, e) {
                if ("value" in e) if (e.value === null) r.dom.selectedIndex !== -1 && (r.dom.value = null); else {
                    var i = "" + e.value;
                    (r.dom.value !== i || r.dom.selectedIndex === -1) && (r.dom.value = i)
                }
                "selectedIndex" in e && ae(r, "selectedIndex", null, e.selectedIndex, void 0)
            }

            function Wr(r, e, i, s) {
                if (e && e === i && console.warn("Don't reuse attrs object, use new object for every redraw, this will throw in next major"), i != null) {
                    r.tag === "input" && i.type != null && r.dom.setAttribute("type", i.type);
                    var f = r.tag === "input" && i.type === "file";
                    for (var d in i) ae(r, d, e && e[d], i[d], s, f)
                }
                var v;
                if (e != null) for (var d in e) (v = e[d]) != null && (i == null || i[d] == null) && ce(r, d, v, s)
            }

            function Xr(r, e) {
                return e === "value" || e === "checked" || e === "selectedIndex" || e === "selected" && r.dom === u() || r.tag === "option" && r.dom.parentNode === a.activeElement
            }

            function Kt(r) {
                return r === "oninit" || r === "oncreate" || r === "onupdate" || r === "onremove" || r === "onbeforeremove" || r === "onbeforeupdate"
            }

            function Vt(r, e, i) {
                return i === void 0 && (r.tag.indexOf("-") > -1 || r.attrs != null && r.attrs.is || e !== "href" && e !== "list" && e !== "form" && e !== "width" && e !== "height") && e in r.dom
            }

            var Zr = /[A-Z]/g;

            function en(r) {
                return "-" + r.toLowerCase()
            }

            function Xe(r) {
                return r[0] === "-" && r[1] === "-" ? r : r === "cssFloat" ? "float" : r.replace(Zr, en)
            }

            function Jt(r, e, i) {
                if (e !== i) if (i == null) r.style.cssText = ""; else if (typeof i != "object") r.style.cssText = i; else if (e == null || typeof e != "object") {
                    r.style.cssText = "";
                    for (var s in i) {
                        var f = i[s];
                        f != null && r.style.setProperty(Xe(s), String(f))
                    }
                } else {
                    for (var s in i) {
                        var f = i[s];
                        f != null && (f = String(f)) !== String(e[s]) && r.style.setProperty(Xe(s), f)
                    }
                    for (var s in e) e[s] != null && i[s] == null && r.style.removeProperty(Xe(s))
                }
            }

            function Ze() {
                this._ = c
            }

            Ze.prototype = Object.create(null), Ze.prototype.handleEvent = function (r) {
                var e = this["on" + r.type], i;
                typeof e == "function" ? i = e.call(r.currentTarget, r) : typeof e.handleEvent == "function" && e.handleEvent(r), this._ && r.redraw !== !1 && (0, this._)(), i === !1 && (r.preventDefault(), r.stopPropagation())
            };

            function Qt(r, e, i) {
                if (r.events != null) {
                    if (r.events._ = c, r.events[e] === i) return;
                    i != null && (typeof i == "function" || typeof i == "object") ? (r.events[e] == null && r.dom.addEventListener(e.slice(2), r.events, !1), r.events[e] = i) : (r.events[e] != null && r.dom.removeEventListener(e.slice(2), r.events, !1), r.events[e] = void 0)
                } else i != null && (typeof i == "function" || typeof i == "object") && (r.events = new Ze, r.dom.addEventListener(e.slice(2), r.events, !1), r.events[e] = i)
            }

            function et(r, e, i) {
                typeof r.oninit == "function" && h.call(r.oninit, e), typeof r.oncreate == "function" && i.push(h.bind(r.oncreate, e))
            }

            function tt(r, e, i) {
                typeof r.onupdate == "function" && i.push(h.bind(r.onupdate, e))
            }

            function tn(r, e) {
                do {
                    if (r.attrs != null && typeof r.attrs.onbeforeupdate == "function") {
                        var i = h.call(r.attrs.onbeforeupdate, r, e);
                        if (i !== void 0 && !i) break
                    }
                    if (typeof r.tag != "string" && typeof r.state.onbeforeupdate == "function") {
                        var i = h.call(r.state.onbeforeupdate, r, e);
                        if (i !== void 0 && !i) break
                    }
                    return !1
                } while (!1);
                return r.dom = e.dom, r.domSize = e.domSize, r.instance = e.instance, r.attrs = e.attrs, r.children = e.children, r.text = e.text, !0
            }

            var ve;
            return function (r, e, i) {
                if (!r) throw new TypeError("DOM element being rendered to does not exist.");
                if (ve != null && r.contains(ve)) throw new TypeError("Node is currently being rendered to and thus is locked.");
                var s = c, f = ve, d = [], v = u(), I = r.namespaceURI;
                ve = r, c = typeof i == "function" ? i : void 0;
                try {
                    r.vnodes == null && (r.textContent = ""), e = t.normalizeChildren(Array.isArray(e) ? e : [e]), H(r, r.vnodes, e, d, null, I === "http://www.w3.org/1999/xhtml" ? void 0 : I), r.vnodes = e, v != null && u() !== v && typeof v.focus == "function" && v.focus();
                    for (var b = 0; b < d.length; b++) d[b]()
                } finally {
                    c = s, ve = f
                }
            }
        }, Le
    }

    var Se, yt;

    function gt() {
        return yt || (yt = 1, Se = lr()(typeof window < "u" ? window : null)), Se
    }

    var wt = re(), fr = function (t, n, a) {
            var c = [], l = !1, p = -1;

            function m() {
                for (p = 0; p < c.length; p += 2) try {
                    t(c[p], wt(c[p + 1]), h)
                } catch (g) {
                    a.error(g)
                }
                p = -1
            }

            function h() {
                l || (l = !0, n(function () {
                    l = !1, m()
                }))
            }

            h.sync = m;

            function u(g, y) {
                if (y != null && y.view == null && typeof y != "function") throw new TypeError("m.mount expects a component, not a vnode.");
                var C = c.indexOf(g);
                C >= 0 && (c.splice(C, 2), C <= p && (p -= 2), t(g, [])), y != null && (c.push(g, y), t(g, wt(y), h))
            }

            return {mount: u, redraw: h}
        }, pr = gt(),
        Ne = fr(pr, typeof requestAnimationFrame < "u" ? requestAnimationFrame : null, typeof console < "u" ? console : null),
        je, bt;

    function Pt() {
        return bt || (bt = 1, je = function (t) {
            if (Object.prototype.toString.call(t) !== "[object Object]") return "";
            var n = [];
            for (var a in t) c(a, t[a]);
            return n.join("&");

            function c(l, p) {
                if (Array.isArray(p)) for (var m = 0; m < p.length; m++) c(l + "[" + m + "]", p[m]); else if (Object.prototype.toString.call(p) === "[object Object]") for (var m in p) c(l + "[" + m + "]", p[m]); else n.push(encodeURIComponent(l) + (p != null && p !== "" ? "=" + encodeURIComponent(p) : ""))
            }
        }), je
    }

    var Me, vt;

    function Ct() {
        if (vt) return Me;
        vt = 1;
        var t = Te;
        return Me = Object.assign || function (n, a) {
            for (var c in a) t.call(a, c) && (n[c] = a[c])
        }, Me
    }

    var $e, Tt;

    function _e() {
        if (Tt) return $e;
        Tt = 1;
        var t = Pt(), n = Ct();
        return $e = function (a, c) {
            if (/:([^\/\.-]+)(\.{3})?:/.test(a)) throw new SyntaxError("Template parameter names must be separated by either a '/', '-', or '.'.");
            if (c == null) return a;
            var l = a.indexOf("?"), p = a.indexOf("#"), m = p < 0 ? a.length : p, h = l < 0 ? m : l, u = a.slice(0, h),
                g = {};
            n(g, c);
            var y = u.replace(/:([^\/\.-]+)(\.{3})?/g, function ($, H, D) {
                return delete g[H], c[H] == null ? $ : D ? c[H] : encodeURIComponent(String(c[H]))
            }), C = y.indexOf("?"), P = y.indexOf("#"), O = P < 0 ? y.length : P, T = C < 0 ? O : C, w = y.slice(0, T);
            l >= 0 && (w += a.slice(l, m)), C >= 0 && (w += (l < 0 ? "?" : "&") + y.slice(C, O));
            var x = t(g);
            return x && (w += (l < 0 && C < 0 ? "?" : "&") + x), p >= 0 && (w += a.slice(p)), P >= 0 && (w += (p < 0 ? "" : "&") + y.slice(P)), w
        }, $e
    }

    var hr = _e(), Et = Te, mr = function (t, n, a) {
        var c = 0;

        function l(h) {
            return new n(h)
        }

        l.prototype = n.prototype, l.__proto__ = n;

        function p(h) {
            return function (u, g) {
                typeof u != "string" ? (g = u, u = u.url) : g == null && (g = {});
                var y = new n(function (T, w) {
                    h(hr(u, g.params), g, function (x) {
                        if (typeof g.type == "function") if (Array.isArray(x)) for (var $ = 0; $ < x.length; $++) x[$] = new g.type(x[$]); else x = new g.type(x);
                        T(x)
                    }, w)
                });
                if (g.background === !0) return y;
                var C = 0;

                function P() {
                    --C === 0 && typeof a == "function" && a()
                }

                return O(y);

                function O(T) {
                    var w = T.then;
                    return T.constructor = l, T.then = function () {
                        C++;
                        var x = w.apply(T, arguments);
                        return x.then(P, function ($) {
                            if (P(), C === 0) throw $
                        }), O(x)
                    }, T
                }
            }
        }

        function m(h, u) {
            for (var g in h.headers) if (Et.call(h.headers, g) && g.toLowerCase() === u) return !0;
            return !1
        }

        return {
            request: p(function (h, u, g, y) {
                var C = u.method != null ? u.method.toUpperCase() : "GET", P = u.body,
                    O = (u.serialize == null || u.serialize === JSON.serialize) && !(P instanceof t.FormData || P instanceof t.URLSearchParams),
                    T = u.responseType || (typeof u.extract == "function" ? "" : "json"), w = new t.XMLHttpRequest,
                    x = !1, $ = !1, H = w, D, me = w.abort;
                w.abort = function () {
                    x = !0, me.call(this)
                }, w.open(C, h, u.async !== !1, typeof u.user == "string" ? u.user : void 0, typeof u.password == "string" ? u.password : void 0), O && P != null && !m(u, "content-type") && w.setRequestHeader("Content-Type", "application/json; charset=utf-8"), typeof u.deserialize != "function" && !m(u, "accept") && w.setRequestHeader("Accept", "application/json, text/*"), u.withCredentials && (w.withCredentials = u.withCredentials), u.timeout && (w.timeout = u.timeout), w.responseType = T;
                for (var Z in u.headers) Et.call(u.headers, Z) && w.setRequestHeader(Z, u.headers[Z]);
                w.onreadystatechange = function (F) {
                    if (!x && F.target.readyState === 4) try {
                        var X = F.target.status >= 200 && F.target.status < 300 || F.target.status === 304 || /^file:\/\//i.test(h),
                            Q = F.target.response, oe;
                        if (T === "json") {
                            if (!F.target.responseType && typeof u.extract != "function") try {
                                Q = JSON.parse(F.target.responseText)
                            } catch {
                                Q = null
                            }
                        } else (!T || T === "text") && Q == null && (Q = F.target.responseText);
                        if (typeof u.extract == "function" ? (Q = u.extract(F.target, u), X = !0) : typeof u.deserialize == "function" && (Q = u.deserialize(Q)), X) g(Q); else {
                            var G = function () {
                                try {
                                    oe = F.target.responseText
                                } catch {
                                    oe = Q
                                }
                                var ee = new Error(oe);
                                ee.code = F.target.status, ee.response = Q, y(ee)
                            };
                            w.status === 0 ? setTimeout(function () {
                                $ || G()
                            }) : G()
                        }
                    } catch (ee) {
                        y(ee)
                    }
                }, w.ontimeout = function (F) {
                    $ = !0;
                    var X = new Error("Request timed out");
                    X.code = F.target.status, y(X)
                }, typeof u.config == "function" && (w = u.config(w, u, h) || w, w !== H && (D = w.abort, w.abort = function () {
                    x = !0, D.call(this)
                })), P == null ? w.send() : typeof u.serialize == "function" ? w.send(u.serialize(P)) : P instanceof t.FormData || P instanceof t.URLSearchParams ? w.send(P) : w.send(JSON.stringify(P))
            }), jsonp: p(function (h, u, g, y) {
                var C = u.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + c++,
                    P = t.document.createElement("script");
                t[C] = function (O) {
                    delete t[C], P.parentNode.removeChild(P), g(O)
                }, P.onerror = function () {
                    delete t[C], P.parentNode.removeChild(P), y(new Error("JSONP request failed"))
                }, P.src = h + (h.indexOf("?") < 0 ? "?" : "&") + encodeURIComponent(u.callbackKey || "callback") + "=" + encodeURIComponent(C), t.document.documentElement.appendChild(P)
            })
        }
    }, dr = ge.exports, yr = Ne, gr = mr(typeof window < "u" ? window : null, dr, yr.redraw), ze, It;

    function xt() {
        if (It) return ze;
        It = 1;

        function t(n) {
            try {
                return decodeURIComponent(n)
            } catch {
                return n
            }
        }

        return ze = function (n) {
            if (n === "" || n == null) return {};
            n.charAt(0) === "?" && (n = n.slice(1));
            for (var a = n.split("&"), c = {}, l = {}, p = 0; p < a.length; p++) {
                var m = a[p].split("="), h = t(m[0]), u = m.length === 2 ? t(m[1]) : "";
                u === "true" ? u = !0 : u === "false" && (u = !1);
                var g = h.split(/\]\[?|\[/), y = l;
                h.indexOf("[") > -1 && g.pop();
                for (var C = 0; C < g.length; C++) {
                    var P = g[C], O = g[C + 1], T = O == "" || !isNaN(parseInt(O, 10));
                    if (P === "") {
                        var h = g.slice(0, C).join();
                        c[h] == null && (c[h] = Array.isArray(y) ? y.length : 0), P = c[h]++
                    } else if (P === "__proto__") break;
                    if (C === g.length - 1) y[P] = u; else {
                        var w = Object.getOwnPropertyDescriptor(y, P);
                        w != null && (w = w.value), w == null && (y[P] = w = T ? [] : {}), y = w
                    }
                }
            }
            return l
        }, ze
    }

    var De, Rt;

    function Be() {
        if (Rt) return De;
        Rt = 1;
        var t = xt();
        return De = function (n) {
            var a = n.indexOf("?"), c = n.indexOf("#"), l = c < 0 ? n.length : c, p = a < 0 ? l : a,
                m = n.slice(0, p).replace(/\/{2,}/g, "/");
            return m ? (m[0] !== "/" && (m = "/" + m), m.length > 1 && m[m.length - 1] === "/" && (m = m.slice(0, -1))) : m = "/", {
                path: m,
                params: a < 0 ? {} : t(n.slice(a + 1, l))
            }
        }, De
    }

    var Fe, At;

    function wr() {
        if (At) return Fe;
        At = 1;
        var t = Be();
        return Fe = function (n) {
            var a = t(n), c = Object.keys(a.params), l = [],
                p = new RegExp("^" + a.path.replace(/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g, function (m, h, u) {
                    return h == null ? "\\" + m : (l.push({
                        k: h,
                        r: u === "..."
                    }), u === "..." ? "(.*)" : u === "." ? "([^/]+)\\." : "([^/]+)" + (u || ""))
                }) + "$");
            return function (m) {
                for (var h = 0; h < c.length; h++) if (a.params[c[h]] !== m.params[c[h]]) return !1;
                if (!l.length) return p.test(m.path);
                var u = p.exec(m.path);
                if (u == null) return !1;
                for (var h = 0; h < l.length; h++) m.params[l[h].k] = l[h].r ? u[h + 1] : decodeURIComponent(u[h + 1]);
                return !0
            }
        }, Fe
    }

    var Ue, kt;

    function qt() {
        if (kt) return Ue;
        kt = 1;
        var t = Te, n = new RegExp("^(?:key|oninit|oncreate|onbeforeupdate|onupdate|onbeforeremove|onremove)$");
        return Ue = function (a, c) {
            var l = {};
            if (c != null) for (var p in a) t.call(a, p) && !n.test(p) && c.indexOf(p) < 0 && (l[p] = a[p]); else for (var p in a) t.call(a, p) && !n.test(p) && (l[p] = a[p]);
            return l
        }, Ue
    }

    var He, Ot;

    function br() {
        if (Ot) return He;
        Ot = 1;
        var t = re(), n = pt, a = ge.exports, c = _e(), l = Be(), p = wr(), m = Ct(), h = qt(), u = {};

        function g(y) {
            try {
                return decodeURIComponent(y)
            } catch {
                return y
            }
        }

        return He = function (y, C) {
            var P = y == null ? null : typeof y.setImmediate == "function" ? y.setImmediate : y.setTimeout,
                O = a.resolve(), T = !1, w = !1, x = 0, $, H, D = u, me, Z, F, X, Q = {
                    onbeforeupdate: function () {
                        return x = x ? 2 : 1, !(!x || u === D)
                    }, onremove: function () {
                        y.removeEventListener("popstate", ee, !1), y.removeEventListener("hashchange", G, !1)
                    }, view: function () {
                        if (!(!x || u === D)) {
                            var E = [t(me, Z.key, Z)];
                            return D && (E = D.render(E[0])), E
                        }
                    }
                }, oe = _.SKIP = {};

            function G() {
                T = !1;
                var E = y.location.hash;
                _.prefix[0] !== "#" && (E = y.location.search + E, _.prefix[0] !== "?" && (E = y.location.pathname + E, E[0] !== "/" && (E = "/" + E)));
                var A = E.concat().replace(/(?:%[a-f89][a-f0-9])+/gim, g).slice(_.prefix.length), L = l(A);
                m(L.params, y.history.state);

                function z(k) {
                    console.error(k), te(H, null, {replace: !0})
                }

                N(0);

                function N(k) {
                    for (; k < $.length; k++) if ($[k].check(L)) {
                        var K = $[k].component, de = $[k].route, We = K, ae = X = function (ce) {
                            if (ae === X) {
                                if (ce === oe) return N(k + 1);
                                me = ce != null && (typeof ce.view == "function" || typeof ce == "function") ? ce : "div", Z = L.params, F = A, X = null, D = K.render ? K : null, x === 2 ? C.redraw() : (x = 2, C.redraw.sync())
                            }
                        };
                        K.view || typeof K == "function" ? (K = {}, ae(We)) : K.onmatch ? O.then(function () {
                            return K.onmatch(L.params, A, de)
                        }).then(ae, A === H ? null : z) : ae("div");
                        return
                    }
                    if (A === H) throw new Error("Could not resolve default route " + H + ".");
                    te(H, null, {replace: !0})
                }
            }

            function ee() {
                T || (T = !0, P(G))
            }

            function te(E, A, L) {
                if (E = c(E, A), w) {
                    ee();
                    var z = L ? L.state : null, N = L ? L.title : null;
                    L && L.replace ? y.history.replaceState(z, N, _.prefix + E) : y.history.pushState(z, N, _.prefix + E)
                } else y.location.href = _.prefix + E
            }

            function _(E, A, L) {
                if (!E) throw new TypeError("DOM element being rendered to does not exist.");
                if ($ = Object.keys(L).map(function (N) {
                    if (N[0] !== "/") throw new SyntaxError("Routes must start with a '/'.");
                    if (/:([^\/\.-]+)(\.{3})?:/.test(N)) throw new SyntaxError("Route parameter names must be separated with either '/', '.', or '-'.");
                    return {route: N, component: L[N], check: p(N)}
                }), H = A, A != null) {
                    var z = l(A);
                    if (!$.some(function (N) {
                        return N.check(z)
                    })) throw new ReferenceError("Default route doesn't match any known routes.")
                }
                typeof y.history.pushState == "function" ? y.addEventListener("popstate", ee, !1) : _.prefix[0] === "#" && y.addEventListener("hashchange", G, !1), w = !0, C.mount(E, Q), G()
            }

            return _.set = function (E, A, L) {
                X != null && (L = L || {}, L.replace = !0), X = null, te(E, A, L)
            }, _.get = function () {
                return F
            }, _.prefix = "#!", _.Link = {
                view: function (E) {
                    var A = n(E.attrs.selector || "a", h(E.attrs, ["options", "params", "selector", "onclick"]), E.children),
                        L, z, N;
                    return (A.attrs.disabled = Boolean(A.attrs.disabled)) ? (A.attrs.href = null, A.attrs["aria-disabled"] = "true") : (L = E.attrs.options, z = E.attrs.onclick, N = c(A.attrs.href, E.attrs.params), A.attrs.href = _.prefix + N, A.attrs.onclick = function (k) {
                        var K;
                        typeof z == "function" ? K = z.call(k.currentTarget, k) : z == null || typeof z != "object" || typeof z.handleEvent == "function" && z.handleEvent(k), K !== !1 && !k.defaultPrevented && (k.button === 0 || k.which === 0 || k.which === 1) && (!k.currentTarget.target || k.currentTarget.target === "_self") && !k.ctrlKey && !k.metaKey && !k.shiftKey && !k.altKey && (k.preventDefault(), k.redraw = !1, _.set(N, null, L))
                    }), A
                }
            }, _.param = function (E) {
                return Z && E != null ? Z[E] : Z
            }, _
        }, He
    }

    var Ye, Lt;

    function Pr() {
        if (Lt) return Ye;
        Lt = 1;
        var t = Ne;
        return Ye = br()(typeof window < "u" ? window : null, t), Ye
    }

    var Ee = ur, St = gr, Nt = Ne, B = function () {
        return Ee.apply(this, arguments)
    };
    B.m = Ee, B.trust = Ee.trust, B.fragment = Ee.fragment, B.Fragment = "[", B.mount = Nt.mount, B.route = Pr(), B.render = gt(), B.redraw = Nt.redraw, B.request = St.request, B.jsonp = St.jsonp, B.parseQueryString = xt(), B.buildQueryString = Pt(), B.parsePathname = Be(), B.buildPathname = _e(), B.vnode = re(), B.PromisePolyfill = mt(), B.censor = qt();
    var o = B;
    const jt = t => t.filter(Boolean), nn = "";
    var be = (t => (t.cancel = "cancel", t.ok = "ok", t))(be || {});
    const Mt = () => ({
        view({attrs: t}) {
            const n = t.options ?? jt([t.cancelable && {key: "cancel", text: "Cancel"}, {
                key: "ok",
                text: "OK",
                isPrimary: !0
            }]);
            return o("dialog.smarttoc-dialog-wrapper.f-center", {open: !0}, [o(".dialog", [o(".header.f-v-center", t.title), t.body && o(".body", t.body), o(".footer.f-row.f-m-end.f-c-center", n.map(a => o("button", {
                class: a.isPrimary ? "primary" : "text",
                onclick() {
                    t.onSelect?.(a.key)
                }
            }, a.text)))])])
        }
    }), vr = (t, n = document.body) => {
        let a = document.getElementById(t);
        return a || (a = document.createElement("div"), a.id = t, n.append(a)), a
    };
    let Cr = 0;
    const le = t => {
        const n = Cr++, a = vr(`smarttoc-dialog-${n}`);
        let c = p => {
        };
        return {
            result: new Promise(p => {
                c = p, o.render(a, o(Mt, {
                    ...t, onSelect: m => {
                        o.render(a, null), a.remove(), c(m)
                    }
                }))
            }), destroy: () => {
                o.render(a, null), a.remove(), c("cancel")
            }
        }
    }, Tr = t => "errmsg" in t, $t = t => Tr(t) ? t.errmsg : "Unknown error occured, please try again";

    class Ie extends Error {
        errmsg;
        data;

        constructor(n, a) {
            super(n), Error.captureStackTrace ? Error.captureStackTrace(this, Ie) : this.stack = new Error(n).stack, Object.setPrototypeOf ? Object.setPrototypeOf(this, Ie.prototype) : this.__proto__ = new.target.prototype, this.errmsg = n, this.data = a
        }
    }

    const _t = t => {
        console.error("[showError]", t);
        const n = $t(t);
        le({title: n, cancelable: !0})
    }, Ke = t => (...a) => {
        try {
            const c = t(...a);
            if (typeof c?.then == "function") return c.catch(l => {
                throw _t(l), l
            })
        } catch (c) {
            throw _t(c), c
        }
    };

    function W(t, n) {
        if (!t) throw new Error(n || "assertion failed")
    }

    const zt = t => {
            throw new TypeError("Unexpected type:" + JSON.stringify(t))
        }, xe = typeof location < "u" && location.search.includes("st-debug=1"),
        Dt = typeof location < "u" && (location.origin === "http://localhost:3000" || location.origin === "http://localhost:5173") && !(typeof chrome < "u" && chrome.storage),
        Er = "https://smarttoc.cc/api", Bt = t => {
            const n = () => {
            };
            return n.basePath = t, new Proxy(n, {
                get(a, c) {
                    if (typeof c != "string" && typeof c != "number") throw new TypeError("expects string or number");
                    return Bt(`${a.basePath}/${c}`)
                }, apply(a, c, [l]) {
                    return fetch(a.basePath, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(l)
                    }).then(async p => {
                        if (!p.ok || p.status > 299) throw await p.json();
                        return await p.json()
                    })
                }
            })
        }, Pe = Bt(Er), Ir = "smart-toc-pro", ne = {
            queryStartTrial(t) {
                return t?.startTrialReason
            }, async startTrial(t) {
                const n = await this.fetchProductInfo(t);
                return W(t), W(n.product), await Pe.customer.startTrial({email: t, productId: n.product.id})
            }, getPrivilegeType(t) {
                return t ? t.privilege : {type: "free"}
            }, queryClaimPaid(t) {
                return t?.claimPaidReason
            }, async claimPaid(t, n) {
                const a = await this.fetchProductInfo(t);
                return W(a.product), await Pe.customer.claimPaid({email: t, productId: a.product.id, method: n})
            }, async fetchProductInfo(t) {
                return await Pe.customer.getProductInfo({email: t, productId: Ir})
            }
        }, on = "", xr = async t => new Promise(n => setTimeout(n, t)), Ve = t => {
            let n = 0;
            for (let a = 0; a < t.length; a++) n = t.charCodeAt(a) + ((n << 5) - n);
            return n
        }, Je = (t, n, a) => typeof a == "number" ? a % (n - t + 1) + t : Math.floor(Math.random() * (n - t + 1)) + t,
        Rr = () => {
        }, Ar = t => {
            const n = Je(0, 360, Ve("r" + t)), a = Je(50, 100, Ve("g" + t)), c = Je(60, 80, Ve("b" + t));
            return `hsl(${n}deg ${a}% ${c}%)`
        }, Ft = t => {
            if (!xe) return Rr;
            const n = Ar(t);
            return (...a) => {
                console.info("%c" + t, `color: ${n}`, ...a)
            }
        }, kr = Ft("client");

    function qr() {
        return new Proxy({}, {
            get: function (n, a, c) {
                return async (...l) => {
                    kr(a, ...l);
                    const p = new Promise((m, h) => {
                        try {
                            chrome.runtime.sendMessage({command: a, args: l}, u => {
                                if (!u) {
                                    h(new Error("Cannot connect to background service"));
                                    return
                                }
                                u.ok ? m(u.result) : h(u.error)
                            })
                        } catch (u) {
                            h(u)
                        }
                    });
                    return Promise.race([p, xr(5e3).then(() => {
                        throw new Ie("Unable to connect to the background script. Try quitting and restarting your browser to see if that fixes the problem.")
                    })])
                }
            }
        })
    }

    function Or() {
        let t = !1;
        const n = void 0;
        return {
            async hasIdentityPermission() {
                return t
            }, async requestIdentityPermission() {
                return t = !0, !0
            }, async requestScriptingPermission() {
                return !0
            }, async getIdentity() {
                if (!!t) return n
            }, async isIdentitySupported() {
                return !0
            }, async checkProductStatusIfNeeded() {
            }, async login(a) {
            }, async logout() {
            }, async getAccountInfo() {
                return {id: "123", email: "FallenMax@gmail.com", method: "browser"}
            }, async getShortcuts() {
                return {next: "\u21E7\u2318X", prev: "\u21E7\u2318Z", theme: "\u21E7\u2318V", toggle: "\u21E7\u2318E"}
            }, async openOptionsPage() {
                console.log("open options")
            }
        }
    }

    const Ut = {
        async sendLoginCode(t) {
            await Pe.account.sendLoginCode({email: t})
        }, async validateLogin(t, n) {
            return await Pe.account.validateLogin({email: t, loginCode: n})
        }
    };

    class Lr {
        disposers = [];
        isDisposed = !1;
        R = n => (W(!this.isDisposed, "trying to R() after dispose"), this.disposers.push(n), n);
        dispose = () => {
            if (this.isDisposed) {
                xe && console.warn("[smarttoc] trying to dispose() after dispose");
                return
            }
            this.isDisposed = !0, this.disposers.reverse().forEach(n => {
                typeof n == "function" ? n() : n.dispose()
            }), this.disposers = []
        }
    }

    class Ht extends Lr {
        handlerMap = new Map;

        constructor() {
            super(), this.R(() => this.offAll())
        }

        on(n, a) {
            const c = this.handlerMap.get(n) || new Set;
            return c.add(a), this.handlerMap.set(n, c), () => this.off(n, a)
        }

        off(n, a) {
            const c = this.handlerMap.get(n) || new Set;
            c.delete(a), this.handlerMap.set(n, c)
        }

        emit(n, a) {
            const c = this.handlerMap.get(n);
            if (c) for (const l of c) l(a)
        }

        offAll() {
            this.handlerMap = new Map
        }
    }

    const Sr = Ft("storage");

    class Nr extends Ht {
        cached = {};
        storeArea;

        constructor(n) {
            super(), this.storeArea = n.storeArea ?? chrome.storage.sync, chrome.storage.onChanged.addListener(this.onChange), xe && typeof globalThis < "u" && (globalThis.__store = this), this.R(() => chrome.storage.onChanged.removeListener(this.onChange))
        }

        onChange = async () => {
            await this.get(), this.emit("changed", void 0)
        };

        async get() {
            const n = await new Promise((a, c) => {
                this.storeArea.get(a)
            });
            return Sr(n), this.cached = n, n
        }

        getCached() {
            return this.cached
        }

        async patch(n) {
            const a = Object.keys(n).filter(c => n[c] == null);
            await new Promise((c, l) => {
                this.storeArea.set(n, c)
            }), a.length && await new Promise((c, l) => {
                this.storeArea.remove(a, c)
            }), await this.get()
        }

        async DEBUG_reset() {
            await new Promise((n, a) => {
                this.storeArea.clear(n)
            }), await this.get()
        }
    }

    class jr extends Ht {
        cached = {};

        constructor(n) {
            super()
        }

        async get() {
            return this.cached
        }

        getCached() {
            return this.cached
        }

        async patch(n) {
            const a = Object.keys(n).filter(c => n[c] == null);
            if (Object.assign(this.cached, n), a.length) for (const c of a) delete this.cached[c]
        }

        async DEBUG_reset() {
            this.cached = {}
        }
    }

    const ie = Dt ? new jr({}) : new Nr({}), fe = Dt ? Or() : qr();
    xe && (window.st_store = ie, window.st_background = fe);
    const q = {
        background: fe,
        CONTACT_EMAIL: "fallenmax@gmail.com",
        fetched: !1,
        error: void 0,
        account: void 0,
        get productInfo() {
            return ie.getCached().productInfo
        },
        get config() {
            return ie.getCached().config
        },
        async updateConfig(t) {
            await ie.patch({config: {...this.config, ...t}})
        },
        async initialize() {
            try {
                ie.on("changed", () => o.redraw()), await this.updateAccount(), await this.fetchProductInfo(this.account), this.fetched = !0
            } catch (t) {
                console.error(t), this.error = t
            }
        },
        async sendLoginCode(t) {
            await Ut.sendLoginCode(t)
        },
        async validateLogin(t, n) {
            await Ut.validateLogin(t, n), await fe.login({email: t, authType: "email", loginCode: n})
        },
        async updateAccount() {
            this.account = await fe.getAccountInfo()
        },
        async logout() {
            await fe.logout(), await this.updateAccount(), await this.fetchProductInfo(this.account)
        },
        async login(t) {
            await fe.login(t), await this.updateAccount(), await this.fetchProductInfo(this.account)
        },
        async fetchProductInfo(t) {
            const n = await ne.fetchProductInfo(t?.email);
            await ie.patch({productInfo: n}), o.redraw()
        },
        async startTrial() {
            await this.updateAccount(), W(this.account);
            const t = await ne.startTrial(this.account.email);
            await ie.patch({productInfo: t}), o.redraw()
        },
        async claimPaid(t) {
            await this.updateAccount(), W(this.account);
            const n = await ne.claimPaid(this.account.email, t);
            await ie.patch({productInfo: n}), o.redraw()
        }
    }, Mr = () => {
        let t, n = !1;
        return {
            async oninit(a) {
                n = await q.background.isIdentitySupported(), o.redraw()
            }, view({attrs: a}) {
                const c = q.background, l = () => [o("button.primary.large.button-login", {
                        disabled: !n, async onclick() {
                            let h = await c.hasIdentityPermission();
                            if (!h) try {
                                h = await c.requestIdentityPermission()
                            } catch (g) {
                                console.error(g), h = !1
                            }
                            if (!h) return;
                            t = {method: "browser", identity: await c.getIdentity()}, o.redraw()
                        }
                    }, ["Continue with Browser Profile (Recommended)"]), !n && o(".hint", "Sorry, your browser does not support this login method."), o("", {style: {height: "12px"}}), o("button.primary.large.button-login", {
                        async onclick() {
                            t = {
                                method: "email",
                                email: "",
                                codeRequested: !1,
                                codeRequesting: !1,
                                code: "",
                                validated: !1
                            }
                        }
                    }, ["Continue with Email + Auth Code"]), o(".hint", {style: {"margin-top": "40px"}}, "* You can log in to your account using either of the above methods by using the same email."), o(".hint", "* Only your email will be uploaded for the sole purpose of recording your purchase information.")],
                    p = () => (W(t?.method === "browser"), [o(".browser-login-form", [o("", "Your Browser Profile: "), o(".account", t.identity ? t.identity.email : "(not logged in)"), !t.identity && [o(".hint", "You may not be logged in to your browser, or your browser does not support this feature."), o(".hint", 'Please try logging in to your browser and refreshing, or press "Back" and log in with your email and authentication code.')], t.identity && o("button.primary.f-s-start", {
                        async onclick() {
                            W(t?.method === "browser" && t.identity), await q.login({
                                authType: "browser",
                                email: t.identity.email
                            }), a.onSuccess()
                        }
                    }, "Use This Account")])]), m = () => (W(t?.method === "email"), [o("form.email-login-form", {
                        async onsubmit(h) {
                            if (h.preventDefault(), W(t?.method === "email"), t.codeRequested) {
                                if (t.code) {
                                    t.codeError = void 0, o.redraw();
                                    try {
                                        await q.validateLogin(t.email, t.code), t.validated = !0, q.login({
                                            authType: "email",
                                            email: t.email,
                                            loginCode: t.code
                                        }), a.onSuccess()
                                    } catch (u) {
                                        const g = $t(u);
                                        t.codeError = g
                                    }
                                }
                            } else {
                                try {
                                    t.codeRequesting = !0, await q.sendLoginCode(t.email)
                                } finally {
                                    t.codeRequesting = !1
                                }
                                t.codeRequested = !0, o.redraw()
                            }
                            o.redraw()
                        }
                    }, [o("label", {for: "email"}, "Email: "), o("input.f-1", {
                        type: "email",
                        id: "email",
                        value: t.email,
                        required: !0,
                        disabled: t.codeRequested || t.codeRequesting,
                        onchange(h) {
                            W(t?.method === "email"), t.email = h.target.value.toLowerCase()
                        }
                    }), o("button.secondary.small", {
                        type: "form",
                        disabled: t.codeRequested || t.codeRequesting
                    }, "Send code"), t.emailError && o(".error", t.emailError), t.codeRequested && [o(".sent-hint", "An email containing a login code has been sent. Please check your inbox and spam box for the email."), o("label", {for: "loginCode"}, "Login Code:"), o("input", {
                        type: "string",
                        id: "loginCode",
                        value: t.code,
                        oninput(h) {
                            W(t?.method === "email"), t.code = h.target.value, t.codeError = ""
                        },
                        onchange(h) {
                            W(t?.method === "email"), t.code = h.target.value
                        }
                    }), o("button.secondary.small", {
                        type: "form",
                        disabled: !t.code
                    }, "Login"), t.codeError && o(".error", t.codeError)]])]);
                return o(Mt, {
                    cancelable: !0,
                    title: o("h2.login-popup-title", "Log In"),
                    options: jt([t && {key: "back", text: "Back", isPrimary: !1}, {
                        key: be.cancel,
                        text: "Cancel",
                        isPrimary: !1
                    }]),
                    onSelect(h) {
                        switch (h) {
                            case be.cancel: {
                                a.onCancel();
                                break
                            }
                            case"back": {
                                t = void 0;
                                break
                            }
                        }
                    },
                    body: o(".login-popup.f-col", [t ? t.method === "browser" ? p() : t.method === "email" ? m() : zt(t) : l()])
                })
            }
        }
    }, $r = async () => {
        const t = "login-popup",
            n = document.getElementById(t) ?? document.body.appendChild(document.createElement("div"));
        return n.id = t, new Promise(a => {
            o.mount(n, {
                view() {
                    return o(Mr, {
                        onCancel() {
                            a(!1), o.mount(n, null)
                        }, onSuccess() {
                            a(!0), o.mount(n, null)
                        }
                    })
                }
            })
        })
    }, _r = () => {
        let t = !1;
        return {
            view({attrs: {ctrl: n}}) {
                if (!n.productInfo) return;
                const a = ne.getPrivilegeType(n.productInfo), c = n.account;
                return o(".account-pane.f-1.f-col.f-c-start", [o("header", o("h1", "Smart TOC Options")), o(".account-section.f-row.f-c-start", [o(".account-section-key", "Account:"), c ? [o(".account-section-value", c.email), o("button.secondary.small.rounded", {
                    onclick: Ke(async () => {
                        await n.logout()
                    }), style: {"margin-left": "10px"}
                }, "Log Out")] : o(".login", [o("button.primary.button-login", {
                    async onclick() {
                        await $r()
                    }
                }, "Log In")])]), o(".account-section.f-row.f-c-start", [o(".account-section-key", "Product:"), o(".account-section-value", o(".f-v-center", [{
                    pro: "Pro",
                    free: "Free"
                }[a.type], o("button.secondary.rounded.small", {
                    onclick: Ke(async () => {
                        try {
                            t = !0, o.redraw(), await n.fetchProductInfo(n.account)
                        } finally {
                            t = !1, o.redraw()
                        }
                    }), style: {"margin-left": "10px", "font-size": "10px"}
                }, t ? "Refreshing..." : "Refresh")]), a.desc && o(".account-section-desc", a.desc))]), o(".account-section", [o(".account-section-key", {style: {"margin-bottom": "5px"}}, "Preferences:"), a.type === "free" && o(".config-field.f-row.f-c-start", [o("input.config-input", {
                    type: "checkbox",
                    id: "hide-pro-features",
                    checked: n.config?.hideProFeatures ?? !1,
                    onchange: async l => {
                        await n.updateConfig({hideProFeatures: l.target.checked})
                    }
                }), o("label.config-label", {for: "hide-pro-features"}, "Hide Pro Features")]), o(".config-field.f-row.f-c-start", [o("input.config-input", {
                    type: "checkbox",
                    id: "auto-run",
                    checked: n.config?.autoRun ?? !1,
                    onchange: async l => {
                        const p = l.target.checked;
                        p && !await n.background.requestScriptingPermission() || await n.updateConfig({autoRun: p})
                    }
                }), o("label.config-label", {for: "auto-run"}, "(Experimental) Auto enable Smart TOC when navigating to new pages")])]), o(".f-1"), o(".footer.f-center", [o("a", {
                    href: "https://smart-toc.canny.io/feature-requests",
                    target: "_blank"
                }, "Request Feature"), o(".separator", "/"), o("a", {
                    href: "https://smart-toc.canny.io/bug-report",
                    target: "_blank"
                }, "Report Bug"), o(".separator", "/"), o("a", {
                    href: `mailto:${n.CONTACT_EMAIL}`,
                    target: "_blank"
                }, "Email")])])
            }
        }
    }, cn = "", sn = "", un = "", zr = "smarttoc-base", ln = "";
    let Qe = !1;
    document.addEventListener("mousedown", () => Qe = !0), document.addEventListener("mouseup", () => Qe = !1);
    let pe, he;
    const Dr = () => ({
        view() {
            const t = pe?.getBoundingClientRect();
            if (!t || !he) return;
            const n = window.innerHeight - t.bottom > 60;
            return o(".smarttoc-tooltip", {
                role: "tooltip",
                id: zr,
                "data-theme": window.smarttoc?.theme ?? "light",
                style: {
                    ...n ? {
                        top: Math.round(t.bottom + 6) + "px",
                        transform: "translate(-50%, 0%)"
                    } : {top: Math.round(t.top - 6) + "px", transform: "translate(-50%, -100%)"},
                    left: Math.round(t.left + t.width / 2) + "px"
                }
            }, he)
        }
    }), Br = (t, n = document.body) => {
        let a = document.getElementById(t);
        return a || (a = document.createElement("div"), a.id = t, n.append(a)), a
    }, Ge = () => {
        let t, n, a, c = () => {
        };
        const l = () => {
            n || (n = Br("smarttoc-tooltip")), o.render(n, o(Dr))
        }, p = () => {
            Qe || (pe = t, he = a, l())
        }, m = () => {
            pe === t && (pe = void 0, he = void 0), l()
        }, h = () => {
            if (!t) {
                console.warn("[smarttoc] cannot bind tooltip event for node");
                return
            }
            const u = t;
            u.addEventListener("pointerenter", p), u.addEventListener("pointerleave", m), u.addEventListener("focus", p), u.addEventListener("blur", m), c = () => {
                u.removeEventListener("pointerenter", p), u.removeEventListener("pointerleave", m), u.removeEventListener("focus", p), u.removeEventListener("blur", m)
            }
        };
        return {
            oncreate(u) {
                if (t = u.dom, !(t instanceof HTMLElement)) {
                    console.warn("[smarttoc] cannot display tooltip for node");
                    return
                }
                h()
            }, oninit(u) {
                a = u.attrs.title, pe === t && (he = a)
            }, onupdate(u) {
                u.dom !== t && (c(), t = u.dom, h()), a = u.attrs.title, pe === t && (he = a), l()
            }, onbeforeremove() {
                m(), c()
            }, view({attrs: u, children: g}) {
                return g
            }
        }
    }, Fr = t => {
        const n = document.createElement("textarea");
        n.style.position = "fixed", n.style.top = "0", n.style.opacity = "0", document.body.appendChild(n), n.value = t, n.select();
        const a = document.execCommand("copy");
        if (document.body.removeChild(n), !a) throw new Error("failed to copy")
    }, Ur = {paypal: {title: "PayPal"}, wechat: {title: "WeChat"}, alipay: {title: "Alipay"}}, Hr = () => ({
        view({attrs: {isActive: t, onStartPurchase: n, onTrial: a}}) {
            const c = q.productInfo?.product;
            return c && o(".product-slide.slide-features.f-col", {disabled: !t}, [o("ol.features", c.features.map(l => o("li.feature", [o(".feature-title", l.title), o("small.feature-desc", l.desc)]))), o(".f-1"), o(".operations.f-center", [c.trial.enabled && o(Ge, {title: ne.queryStartTrial(q.productInfo) ?? "No credit card required"}, [o("button.secondary.large.f-1", {
                disabled: ne.queryStartTrial(q.productInfo) != null,
                async onclick() {
                    await a()
                }
            }, [`${c.trial.days}-Day Free Trial`])]), o(Ge, {title: ne.queryClaimPaid(q.productInfo)}, o("button.primary.large.f-1.f-center", {
                disabled: ne.queryClaimPaid(q.productInfo) != null,
                async onclick() {
                    const l = q.productInfo?.orderStatus;
                    if (!l) {
                        n();
                        return
                    }
                    switch (l) {
                        case"pending": {
                            if (await le({
                                title: "Continue with purchase?",
                                body: o("", [o("p", "If you have already paid, please do not make another payment."), o("p", "We will verify your payment within one business day. Thank you for your patience.")]),
                                cancelable: !0
                            }).result === be.cancel) return;
                            n();
                            break
                        }
                        case"rejected": {
                            n();
                            break
                        }
                        case"confirmed": {
                            await le({title: "You already own this product"}).result;
                            break
                        }
                        default:
                            return zt(l)
                    }
                    o.redraw()
                }
            }, ["Purchase", o(".icon.icon-arrow-right")]))])])
        }
    }), Yr = () => {
        const t = Date.now();
        let n = !1, a;
        return {
            view({attrs: {onCancel: c, onSuccess: l, method: p}}) {
                const m = q.productInfo.product, h = m.payment.paypal, u = q.productInfo.user;
                return o(".payment-mask.f-col.f-m-center.f-c-center", {class: p}, [o(".payment-content", {class: p === "paypal" ? "f-col" : "f-row"}, [p === "paypal" ? o(".payment-paypal", [o(".logo.logo-paypal"), o("a.link.f-center", {
                    href: h.url,
                    target: "_blank"
                }, h.url, o(".icon.icon-open"))]) : o("img.payment-qrcode", {src: m.payment[p].qrcode + `?t=${t}`}), o(".desc", [p === "paypal" ? [o("p", ["Please pay ", o("strong.price", "$" + q.productInfo.product?.price.USD), " using the link above."]), o("p", "In the purchase description, please include your account email address: "), o("p", [o(Ge, {title: n ? "Copied!" : "Click to copy to clipboard"}, o("strong.email", {
                    style: {cursor: "pointer"},
                    onclick() {
                        window.clearTimeout(a), Fr(u.email), n = !0, o.redraw(), a = window.setTimeout(function () {
                            n = !1, o.redraw()
                        }, 1e3)
                    }
                }, `${u.email}`))]), o("p", ["Thank you for choosing Smart TOC Pro."])] : [o("p", "Please scan the QR code and follow the instructions to complete the payment."), o("p", "In the purchase description, please include your account email address: "), o("p", o("strong.email", `${u.email}`)), o("p", ["Thank you for choosing Smart TOC Pro."])]])]), o(".payment-operations.f-center", [o("button.secondary.large.f-1", {
                    onclick() {
                        c()
                    }
                }, [o(".f-col.f-c-center.f-m-center", ["I Have Not Paid"])]), o("button.primary.large.f-1.f-center", {
                    onclick() {
                        l()
                    }
                }, ["I Have Paid"])])])
            }
        }
    }, Kr = async t => {
        const n = "payment-mask",
            a = document.getElementById(n) ?? document.body.appendChild(document.createElement("div"));
        return a.id = n, new Promise(c => {
            o.mount(a, {
                view() {
                    return o(Yr, {
                        method: t, onCancel() {
                            c(!1), o.mount(a, null)
                        }, onSuccess() {
                            c(!0), o.mount(a, null)
                        }
                    })
                }
            })
        })
    }, Vr = () => {
        let t;
        return {
            view({attrs: {isActive: n, onBack: a, onClaimPaid: c}}) {
                if (!q.productInfo) return "Loading...";
                const l = q.productInfo.user?.hasFailedPayment;
                return o(".product-slide.slide-purchase.f-col", {disabled: !n}, [o(".slide-content.f-row", [o("", [o("h3.step-title", "Please select your payment method:"), o(".payment-methods.f-center", [["paypal", "wechat", "alipay"].map(p => o("button.payment-method.f-1.f-col.f-m-center.f-c-center", {
                    async onclick() {
                        await Kr(p) && (t = p)
                    }
                }, [o(`.logo.logo-${p}`), o(".logo-text", Ur[p].title)]))]), o(".detail", [l ? o("p", "We will verify your payment and activate Smart TOC Pro for you within one business day. Thank you for your patience.") : [o("p", "Your payment will be verified within one business day."), o("p", "Before it is verified, your Smart TOC Pro will be pre-activated and you can start using it immediately.")]])])]), o(".f-1"), o(".operations.f-center", [o("button.secondary.large.f-1", {
                    onclick() {
                        a()
                    }
                }, [o(".f-col.f-c-center.f-m-center", ["Back"])]), o("button.primary.large.f-2.f-center", {
                    disabled: !t,
                    onclick() {
                        t && c(t)
                    }
                }, ["I Have Paid", o(".icon.icon-arrow-right")])])])
            }
        }
    }, Jr = () => ({
        view({attrs: {isActive: t, onBack: n, onNext: a}}) {
            return o(".product-slide.slide-success.f-col", {disabled: !t}, [q.productInfo.user?.hasFailedPayment ? o("h3.congratulations", "Thank you for your purchase! We are currently verifying your payment and will activate your product within one business day. Thank you for your patience.") : [o("h3.congratulations", "Thank you for your purchase of Smart TOC Pro! Your product is now pre-activated and ready for use. You can start using it immediately. Thank you for choosing Smart TOC Pro."), o(".detail", [o("p", "Your payment will be verified within one business day.")])], o(".f-1"), o(".operations.f-center", [o("button.primary.large.f-2.f-center", {
                onclick() {
                    a()
                }
            }, ["Got It"])])])
        }
    }), Qr = () => {
        let t = 0;
        return {
            view({attrs: {ctrl: n}}) {
                if (!!n.productInfo?.product) return o(".purchase-pane", [o(".product-card.f-col", [o(".product-header.f-col", [o("h2.product-title", n.productInfo.product.name), o(".product-subtitle", "For Chrome / Edge / Firefox"), o(".product-price", [o("span.price", "$" + n.productInfo.product.price.USD), " / lifetime / all supported browsers"])]), o(".product-body.f-1", [o(".product-slides.f-row.f-c-stretch", {class: `active-slide-${t}`}, [o(Hr, {
                    isActive: t === 0,
                    onTrial: async () => {
                        if (!n.productInfo || await le({
                            title: `Start ${n.productInfo.product.trial.days}-day free trial?`,
                            body: "No credit card required.",
                            cancelable: !0
                        }).result !== be.ok) return;
                        await n.startTrial();
                        const c = n.productInfo.trialExpireAt;
                        c ? await le({
                            title: "Your Smart TOC Pro trial has been activated. Enjoy!",
                            body: o("", [o("p", `Your trial will expire on ${new Date(c).toLocaleString()}. Make sure to try all of the Pro features before then!`)])
                        }).result : await le({title: "Something went wrong"}).result, o.redraw()
                    },
                    onStartPurchase: () => {
                        t++
                    }
                }), o(Vr, {
                    isActive: t === 1, onBack: () => {
                        t--
                    }, onClaimPaid: async a => {
                        await n.claimPaid(a), t++, o.redraw()
                    }
                }), o(Jr, {
                    isActive: t === 2, onBack: () => {
                        t--
                    }, onNext: () => {
                        t = 0
                    }
                })])])])])
            }
        }
    }, fn = "", Yt = () => ({
        oninit: Ke(async () => {
            await q.initialize(), o.redraw()
        }), view() {
            if (!q.fetched) return q.error ? o(".options-page.placeholder.f-center", q.error.errmsg ?? "Sorry, something went wrong.") : o(".options-page.placeholder.f-center", "Loading...");
            if (!!q.productInfo?.product) return o(".options-page", [o(_r, {ctrl: q}), o(Qr, {ctrl: q})])
        }
    });
    return o.mount(document.body, Yt), Ae.OptionsPage = Yt, Object.defineProperties(Ae, {
        __esModule: {value: !0},
        [Symbol.toStringTag]: {value: "Module"}
    }), Ae
}({});
