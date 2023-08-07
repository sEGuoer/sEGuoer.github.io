(function () {
    "use strict";

    function ye(t, e) {
        if (!t) throw new Error(e || "assertion failed")
    }

    const Vn = t => {
            throw new TypeError("Unexpected type:" + JSON.stringify(t))
        }, ee = typeof location < "u" && location.search.includes("st-debug=1"),
        Ve = typeof location < "u" && (location.origin === "http://localhost:3000" || location.origin === "http://localhost:5173"),
        jt = Ve && !(typeof chrome < "u" && chrome.storage), Jn = "https://smarttoc.cc/api", Je = t => {
            let e = 0;
            for (let n = 0; n < t.length; n++) e = t.charCodeAt(n) + ((e << 5) - e);
            return e
        }, Ge = (t, e, n) => typeof n == "number" ? n % (e - t + 1) + t : Math.floor(Math.random() * (e - t + 1)) + t,
        Ae = () => {
        }, Gn = t => {
            const e = Ge(0, 360, Je("r" + t)), n = Ge(50, 100, Je("g" + t)), r = Ge(60, 80, Je("b" + t));
            return `hsl(${e}deg ${n}% ${r}%)`
        }, ce = t => {
            if (!ee) return Ae;
            const e = Gn(t);
            return (...n) => {
                console.info("%c" + t, `color: ${e}`, ...n)
            }
        }, Kn = /^(R|on|off|is|get|query|has|should)/, Bt = t => {
            const e = Object.getPrototypeOf(t);
            return Object.getOwnPropertyNames(t).concat(e && e !== Object.prototype ? Bt(e) : [])
        }, Le = (t, e) => {
            if (!ee) return t;
            const n = ce(e), r = Bt(t).filter(s => typeof t[s] == "function");
            for (const s of r) {
                if (Kn.test(s)) continue;
                const l = t[s];
                t[s] = function (...a) {
                    return n(s, ...a), l.apply(t, a)
                }
            }
            return t
        }, Ie = t => [].slice.apply(t),
        zt = t => t === null ? "null" : t === void 0 ? "undefined" : Array.isArray(t) ? "array" : t instanceof Date ? "date" : typeof t,
        Ke = ce("equal"), se = (t, e, n) => {
            if (t === e) return !0;
            const {ignoreEmptyKey: r = !0} = n || {}, s = zt(t), l = zt(e);
            if (s !== l) return Ke("type change:", s, l), !1;
            if (s === "array") {
                const a = t.length === e.length && t.every((c, u) => se(c, e[u], n));
                return a || Ke("array length or item not equal", t, e), a
            }
            if (s === "object") {
                if (t instanceof Node && e instanceof Node) return t === e;
                const a = Object.keys(t).sort().filter(f => !(t[f] === void 0 && r)),
                    c = Object.keys(e).sort().filter(f => !(e[f] === void 0 && r)),
                    u = a.length === c.length && a.every((f, d) => {
                        const m = c[d];
                        return f === m && se(t[f], e[m], n)
                    });
                return u || Ke("object keys not equal", t, e), u
            }
            return s === "number" ? n?.numberTolerance ? Math.abs(t - e) < n.numberTolerance : t === e : s === "date" ? t.getTime() === e.getTime() : s === "function" && n?.ignoreFunction || t !== t && e !== e ? !0 : t === e
        }, Ye = t => {
            if (!t.length) return;
            const [e, ...n] = t;
            for (const r of n) if (!se(e, r)) return;
            return e
        }, Yn = t => t.filter(Boolean), Xe = ce("dom"), Fe = new Map;

    class T {
        static isDocumentRtl = () => document.dir === "rtl";
        static getOverlappedRect = (e, n) => {
            const r = Math.max(e.left, n.left), s = Math.min(e.right, n.right), l = Math.max(e.top, n.top),
                a = Math.min(e.bottom, n.bottom), c = s - r, u = a - l;
            if (!(c <= 0 || u <= 0)) return {left: r, right: s, top: l, bottom: a, width: c, height: u}
        };
        static isElemVisible = e => {
            if (e.offsetHeight === 0 || e.offsetWidth === 0) return !1;
            const n = window.getComputedStyle(e);
            return !(n.display === "none" || n.opacity === "0" || n.visibility === "hidden")
        };
        static getVisibleTextRect = e => {
            const n = [...T.walkTree(e, s => s.nodeType === Node.TEXT_NODE || s.nodeType === Node.ELEMENT_NODE && T.isElemVisible(s) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT, NodeFilter.SHOW_ALL)],
                r = Yn(n.map(s => {
                    const l = document.createRange();
                    return l.selectNodeContents(s), l.getClientRects()[0]
                })).filter(s => s.width && s.height);
            if (r.length !== 0) return {
                top: Math.min(...r.map(s => s.top)),
                left: Math.min(...r.map(s => s.left)),
                bottom: Math.max(...r.map(s => s.bottom)),
                right: Math.max(...r.map(s => s.right))
            }
        };

        static append(e, n, r) {
            return T.withEventMuted(() => {
                e.appendChild(n)
            }, r)(), T.withEventMuted(() => {
                e.contains(n) && e.removeChild(n)
            }, r)
        }

        static get = e => typeof e == "string" ? document.getElementById(e) ?? void 0 : e;

        static create(e, n, r) {
            let s = "";
            const l = [],
                a = e.replace(/(#|\.)[^#\.]+/gi, u => (u.startsWith("#") ? s = u.substr(1) : l.push(u.substr(1)), "")),
                c = document.createElement(a || "div");
            return n != null && Object.keys(n).forEach(u => {
                switch (u) {
                    case"dataset": {
                        const f = n[u];
                        Object.keys(f).forEach(d => {
                            c.dataset[d] = f[d]
                        })
                    }
                        break;
                    case"style": {
                        const f = n[u];
                        Object.keys(f).forEach(d => {
                            c.style[d] = f[d]
                        })
                    }
                        break;
                    default:
                        c.setAttribute(u, n[u]);
                        break
                }
            }), s && c.setAttribute("id", s), l.length && c.setAttribute("class", l.join(" ")), r && (typeof r == "string" ? c.innerText = String(r) : r.forEach(u => c.appendChild(u))), c
        }

        static listen(e, n, r, s) {
            if (ee || Ve) {
                const l = (Fe.get(e) ?? 0) + 1;
                Fe.set(e, l)
            }
            return e.addEventListener(n, r, s), () => {
                if (ee || Ve) {
                    const l = (Fe.get(e) ?? 0) - 1;
                    Fe.set(e, l)
                }
                e.removeEventListener(n, r, s)
            }
        }

        static addClass(e, n, r = !0) {
            return T.withEventMuted(() => {
                e.classList.add(n)
            }, r)(), T.withEventMuted(() => {
                e.classList.remove(n)
            }, r)
        }

        static setStyle = (e, n, r = !0, s = !0) => {
            T.withEventMuted(() => {
                if (n == null) {
                    e.removeAttribute("style");
                    return
                }
                if (typeof n == "string") {
                    e.setAttribute("style", n);
                    return
                }
                for (const l in n) e.style.setProperty(l.replace(/([A-Z])/g, (a, c) => "-" + c.toLowerCase()), n[l] ?? null, r ? "important" : void 0)
            }, s)()
        };
        static fromPx = e => +e.replace(/px/, "");
        static toPx = e => typeof e == "number" ? e + "px" : e;
        static muteCount = 0;

        static withEventMuted(e, n = !0) {
            if (!n) return e;
            const r = () => {
                setTimeout(function () {
                    T.muteCount--, !T.muteCount && ee && console.groupEnd()
                }, 16)
            };
            return (...l) => {
                try {
                    return T.muteCount++, T.muteCount === 1 && ee && console.group("muted:"), e(...l)
                } finally {
                    r()
                }
            }
        }

        static onResize(e, n) {
            const {offsetWidth: r, offsetHeight: s, scrollWidth: l, scrollHeight: a} = e;
            let c = {offsetWidth: r, offsetHeight: s, scrollWidth: l, scrollHeight: a}, u = new ResizeObserver(f => {
                const {offsetWidth: d, offsetHeight: m, scrollWidth: g, scrollHeight: E} = e,
                    b = {offsetWidth: d, offsetHeight: m, scrollWidth: g, scrollHeight: E};
                se(c, b) || (c = b, T.muteCount === 0 ? n(f) : Xe("resize event muted:", T.muteCount))
            });
            return u.observe(e), () => {
                u?.disconnect(), u = void 0
            }
        }

        static onMutate(e, n, r) {
            let s = new MutationObserver(l => {
                T.muteCount === 0 ? n(l) : Xe("mutate event muted:", T.muteCount)
            });
            return s.observe(e, r ?? {childList: !0, subtree: !0}), () => {
                s?.disconnect(), s = void 0
            }
        }

        static onRemoveByPoll(e, n, r) {
            let s;
            return s = setInterval(() => {
                document.documentElement.contains(e) || (T.muteCount === 0 ? n() : Xe("remove event muted:", T.muteCount), clearInterval(s), s = void 0)
            }, r.delay), () => {
                s != null && (clearInterval(s), s = void 0)
            }
        }

        static getContainer = (e, n = document.body) => {
            let r = document.getElementById(e);
            return r || (r = document.createElement("div"), r.id = e, n.append(r)), r
        };
        static walkTree = function* (e, n = () => !0, r = NodeFilter.SHOW_ELEMENT) {
            const s = document.createTreeWalker(e, r, {
                acceptNode(l) {
                    const a = n(l);
                    return typeof a == "boolean" ? a ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP : a
                }
            });
            for (; s.nextNode();) yield s.currentNode
        }
    }

    const Xn = T.create, $e = (t, e = "red") => {
            !ee || T.withEventMuted(() => {
                !t || (Array.isArray(t) ? t.forEach(n => {
                    n.style.outline = "2px solid " + e
                }) : t.style.outline = "2px solid " + e)
            })()
        },
        Qe = t => t === document.documentElement || t === document.body ? document.scrollingElement ? document.scrollingElement : document.documentElement : t,
        He = t => Qe(t).scrollTop, Ze = (t, e) => {
            const n = Qe(t);
            n.scrollTop = e
        }, _t = t => t === document.documentElement || t === document.body ? {
            top: 0,
            left: 0,
            right: window.innerWidth,
            bottom: window.innerHeight,
            width: window.innerWidth,
            height: window.innerHeight
        } : t.getBoundingClientRect(), Qn = ["auto", "scroll", "overlay"],
        Ut = t => Qn.includes(window.getComputedStyle(t).overflowY) && t.clientHeight + 1 < t.scrollHeight, et = t => {
            if(t === document.documentElement)
            return
            t;
            for(;
            t && t !== document.documentElement && !Ut(t);
        )
            t = t.parentElement;
            return
            ee && $e(t, "purple"), Qe(t)
        }, Zn = (t, e, n) => n * t * (2 - t) + e,
        er = async ({targetTop: t, scroller: e, spaceFromTop: n, maxDuration: r = 300}) => {
            const s = Zn, l = e === document.documentElement || e === document.body ? 0 : e.getBoundingClientRect().top,
                a = He(e), c = t - (l - a) - n, u = c - a, f = Math.min(1, Math.abs(u) / 1e4),
                d = Math.max(10, r * f * (2 - f));
            if (r === 0) return Ze(e, c), Promise.resolve();
            let m;
            return new Promise((g, E) => {
                const b = w => {
                    m == null && (m = w);
                    const v = (w - m) / d;
                    if (v < 1) {
                        const P = s(v, a, u);
                        Ze(e, P), window.requestAnimationFrame(b)
                    } else Ze(e, c), g()
                };
                window.requestAnimationFrame(b)
            })
        }, re = (t, e, n) => Math.max(t, Math.min(n, e)),
        De = (t, e, n) => ({value: t, parent: e, path: [e?.path, n].filter(r => r != null && r !== "").join(".")}),
        Wt = ({tree: t, value: e, level: n, defaultValue: r}) => {
            ye(n > 0, "cannot append to root level");
            let s = t;
            for (let a = 0; a < n - 1; a++) s.children || (s.children = []), s.children.length === 0 && s.children.push(De(r(s), s, s.children.length)), s = s.children[s.children.length - 1];
            s.children || (s.children = []);
            const l = De(e, s, s.children.length);
            return s.children.push(l), l
        };

    function* tt(t) {
        if (yield t, !!t.children) for (const e of t.children) yield* tt(e)
    }

    function* Vt(t) {
        let e = t.parent;
        for (; e;) yield e, e = e.parent
    }

    const tr = t => {
        const e = De(void 0);
        t.forEach(r => {
            Wt({
                tree: e, value: r, level: r.level + 1, defaultValue: s => {
                }
            })
        });
        const n = (r, s) => {
            r.value && (r.value.level = s, s += 1);
            const l = r.children;
            !l || l.forEach(a => {
                n(a, s)
            })
        };
        n(e, 0)
    }, Jt = (t, e = -1) => {
        const n = [];
        let r = t;
        for (; r && e--;) n.push(r), r = r.parentElement;
        return n
    }, nr = (t, e, n) => {
        const r = new Map;
        if (!t.length) return r;
        t.forEach(s => {
            const l = e(s);
            if (l != null) {
                const a = r.get(l) ?? [];
                a.push(s), r.set(l, a)
            }
        });
        for (const [s, l] of r.entries()) l.length < n && r.delete(s);
        return r
    }, rr = t => {
        if (!T.isElemVisible(t)) return !1;
        const e = window.getComputedStyle(t);
        if (["fixed", "sticky"].includes(e.position) && t.scrollHeight < 300) {
            const r = parseInt(e.top.replace("px", ""), 10);
            if (!Number.isNaN(r) && r < 100) return !0
        }
        return !1
    }, ir = ({elems: t, strict: e = !1, keepFirstOne: n = !1}) => {
        const r = [], s = (l, a) => {
            for (let c = 0; c < r.length; c++) {
                const u = r[c];
                if (e) {
                    if (l === u[0]) return c
                } else if (l > u[0] && l < u[1] || a > u[0] && a < u[1]) return c
            }
        };
        for (const l of t) {
            const {top: a, bottom: c} = l.getBoundingClientRect(), u = s(a, c);
            u == null ? r.push([a, c, l]) : n || r.splice(u, 1)
        }
        return r.sort((l, a) => l[0] - a[0]), r.map(l => l[2])
    }, Y = [0, 100, 60, 40, 30, 25, 22, 18, 18, 18, 18, 18, 18, 18], qe = [10], te = [-500, -10], sr = {
        h1: Y.map(t => t * .4),
        [".h1"]: Y.map(t => t * .4),
        h2: Y,
        [".h2"]: Y,
        h3: Y.map(t => t * .5),
        [".h3"]: Y.map(t => t * .5),
        h4: Y.map(t => t * .5 * .5),
        [".h4"]: Y.map(t => t * .5 * .5),
        h5: Y.map(t => t * .5 * .5 * .5),
        [".h5"]: Y.map(t => t * .5 * .5 * .5),
        h6: Y.map(t => t * .5 * .5 * .5 * .5),
        [".h6"]: Y.map(t => t * .5 * .5 * .5 * .5),
        strong: Y.map(t => t * .5 * .5 * .5),
        b: Y.map(t => t * .5 * .5 * .5),
        article: qe,
        ["[class^=article]"]: qe,
        ["[id^=article]"]: qe,
        ["[class^=content]"]: qe,
        sidebar: te,
        ["[class^=sidebar]"]: te,
        ["[id^=sidebar]"]: te,
        aside: te,
        ["[class^=aside]"]: te,
        ["[id^=aside]"]: te,
        nav: te,
        ["[class^=nav]"]: te,
        ["[class^=navigation]"]: te,
        ["[class^=toc]"]: te,
        ["[class^=table-of-contents]"]: te,
        ["[class^=comment]"]: te
    }, Gt = {
        h1: 4,
        [".h1"]: 4,
        h2: 9,
        [".h2"]: 9,
        h3: 9,
        [".h3"]: 9,
        h4: 10,
        [".h4"]: 10,
        h5: 10,
        [".h5"]: 10,
        h6: 10,
        [".h6"]: 10,
        strong: 5,
        b: 5
    }, Kt = t => !(t.toLowerCase() === "strong" || t.toLowerCase() === "b"), Yt = t => {
        if (!t) return [];
        let e = [];
        try {
            e = Ie(t.document.getElementsByTagName("iframe"))
        } catch {
        }
        const n = [];
        return e.forEach(r => {
            n.push(r, ...Yt(r.contentWindow))
        }), n
    }, we = ce("extractor"), or = t => {
        const e = a => {
            let c = "";
            for (const m of T.walkTree(a, g => g.nodeType === Node.ELEMENT_NODE && !T.isElemVisible(g) ? NodeFilter.FILTER_REJECT : (g.nodeType === Node.TEXT_NODE && (c += g.textContent), NodeFilter.FILTER_ACCEPT), NodeFilter.SHOW_ALL)) ;
            const u = a.id || a.querySelector("[id]")?.id;
            let f = u ? "#" + u : `#:~:text=${encodeURIComponent(c)}`;
            const d = a.querySelector("a");
            if (d) {
                f = f ?? d.getAttribute("href") ?? "";
                const m = d.textContent;
                return {text: c, anchor: f, aText: m}
            }
            return {text: c, anchor: f, aText: void 0}
        }, n = t.map(a => {
            const {dom: c} = a, {text: u, anchor: f, aText: d} = e(c), m = d && u.includes(d) ? u.indexOf(d) : -1,
                g = d && u.includes(d) ? u.length - u.lastIndexOf(d) : -1;
            return {...a, text: u, anchor: f, aText: d, aFromStart: m, aTilEnd: g}
        }), r = Ye(n.map(a => a.aText)), s = Ye(n.map(a => a.aFromStart)) ?? -1, l = Ye(n.map(a => a.aTilEnd)) ?? -1;
        return r && (s !== -1 ? n.forEach(a => {
            a.text = a.text.substring(0, s) + a.text.substring(s + r.length)
        }) : l !== -1 && n.forEach(a => {
            a.text = a.text.substring(0, a.text.length - l) + a.text.substring(a.text.length - l + r.length)
        })), n.map(a => {
            const {aText: c, aFromStart: u, aTilEnd: f, ...d} = a;
            return d
        })
    }, ar = ({headingSelectors: t, maxHeadingLevels: e} = {}) => {
        const n = Qt({headingSelectors: t});
        if (!n) return;
        const r = Zt({articleDom: n, headingSelectors: t, maxHeadingLevels: e}), s = r.headings;
        if (t = t ?? r.headingSelectors, !s.length) return;
        const l = et(n), a = Math.max(...s.map(c => c.level)) + 1;
        return {article: n, headings: s, maxLevel: a, headingSelectors: t, scroller: l}
    }, ve = -1, Xt = T.isDocumentRtl(), cr = t => {
        if (!Kt(t.tagName) && t.parentElement?.childNodes.length !== 1) return ve;
        const e = t.getBoundingClientRect();
        return Xt ? e.right : e.left
    }, lr = ({articleDom: t, headingSelectors: e, maxHeadingLevels: n = 6}) => {
        if (e) return e.map((c, u) => {
            const f = Ie(t.querySelectorAll(c));
            return {selector: c, selectorIndex: u, elems: f, boundary: ve}
        }).filter(c => c.elems.length > 0);
        const r = [];
        return Object.keys(Gt).forEach((c, u) => {
            const f = Ie(t.querySelectorAll(c));
            if (!f.length) return;
            const d = ir({elems: f, strict: !0, keepFirstOne: !1}), m = nr(d, cr, 2);
            for (const g of m.keys()) {
                if (!Kt(c) && g === ve) continue;
                const E = g === ve ? d : m.get(g) ?? [], b = Gt[c];
                !E.length || r.push({selector: c, selectorIndex: u, boundary: g, elems: E, score: E.length * b})
            }
            return r
        }), r.filter(c => c.score >= 10 && c.elems.length > 0).sort((c, u) => {
            if (c.boundary !== ve && u.boundary !== ve) {
                const f = Xt ? u.boundary - c.boundary : c.boundary - u.boundary;
                if (f) return f
            }
            return c.selectorIndex !== u.selectorIndex ? c.selectorIndex - u.selectorIndex : 0
        }).slice(0, n)
    }, ur = () => {
        const t = window.top || window, e = Yt(t);
        if (e.length === 0) return t;
        const r = e.map(a => ({iframe: a, area: a.offsetWidth * a.offsetHeight})).sort((a, c) => c.area - a.area)[0],
            s = t.document.documentElement, l = s.offsetWidth * s.offsetHeight;
        return r.area > l * .5 && r.iframe.contentWindow || t
    }, hr = (t, e) => {
        const n = new Map;
        e.forEach((l, a) => l.elems.forEach(c => n.set(c, a)));
        const r = [];
        let s = 0;
        for (const l of T.walkTree(t, a => n.has(a))) {
            const a = l, c = n.get(a), u = {dom: a, level: c, index: s};
            r.push(u), s++
        }
        return r
    }, Qt = ({headingSelectors: t}) => {
        const e = new Map;
        {
            const f = t ? Object.fromEntries(t.map((d, m) => [d, [0, 100, 60, 40, 30, 25, 22, 18].map(g => g * Math.pow(.5, m))])) : sr;
            Object.keys(f).forEach(d => {
                Ie(document.querySelectorAll(d)).forEach(g => {
                    const E = f[d];
                    Jt(g, E.length).forEach((w, v) => {
                        const P = e.get(w) ?? 0, M = E[v] ?? 0;
                        e.set(w, P + M)
                    })
                })
            })
        }
        const n = [...e].map(([f, d]) => ({
            elem: f,
            score: d
        })).sort((f, d) => d.score - f.score), {innerWidth: r} = window, s = f => {
            let {left: d, top: m, bottom: g, right: E} = _t(f);
            const b = et(f), w = He(b);
            m -= w, g -= w;
            const v = r / 2;
            let P = 1;
            return (d > v || E < v) && (P -= .5), m > 400 && (P -= (m - 400) / 1e3), re(0, P, 1)
        }, l = [], a = 5;
        for (const {elem: f, score: d} of n) {
            const m = f.scrollHeight, g = f.scrollWidth, E = re(0, f.querySelectorAll("a").length / ((m || 1) / 20), 1),
                b = s(f);
            if (!b) continue;
            const w = g < 400 ? 0 : 1;
            if (!w) continue;
            const v = re(0, Math.sqrt(m) / 100, 1);
            if (!v) continue;
            const P = Ut(f) && f !== document.documentElement ? 0 : 1;
            if (!P) continue;
            const M = re(.2, Math.pow(1 - E, 2), 1);
            if (!M) continue;
            const H = {width: w, height: v, position: b, widthFromChildren: 1, scroll: P, linkDensity: M};
            if (l.push({elem: f, score: d, factors: H}), l.length >= a) break
        }
        l.forEach(f => {
            l.forEach(d => {
                d.elem.contains(f.elem) && (d.factors.widthFromChildren *= f.factors.width)
            })
        });
        const c = l.map(f => {
            const d = f.factors,
                m = f.score * d.height * d.width * d.position * d.linkDensity * d.scroll * d.widthFromChildren;
            return {...f, finalScore: m}
        });
        c.sort((f, d) => d.finalScore - f.finalScore);
        const u = c[0]?.elem;
        return we("extractArticle", {scores: e, candidatesAll: n, finalCandidates: c}), $e(u, "red"), u
    }, fr = ({watcher: t, exclude: e}) => {
        const {measurements: n} = t;
        if (!n) return;
        const {scrollerRect: r} = n, s = window.innerWidth / 2, l = c => {
            const u = [{x: s, y: c}];
            for (const f of u) {
                const d = document.elementFromPoint(f.x, f.y);
                if (!d) continue;
                const m = Jt(d).reverse();
                we("header: parents", m);
                const g = m.find(ie => rr(ie));
                if (we("header: header", g), !g || e && (e.contains(g) || e === g)) continue;
                let {left: E, top: b, bottom: w, right: v, height: P, width: M} = g.getBoundingClientRect();
                P += b, b = 0;
                const H = T.getOverlappedRect({left: E, top: b, bottom: w, right: v, height: P, width: M}, r);
                if (!!H) return we("detected header:", g, H), ee && $e(g, "lightgreen"), H.height
            }
        };
        return l(60) || l(5) || 0
    }, Zt = ({articleDom: t, headingSelectors: e, maxHeadingLevels: n}) => {
        const r = lr({articleDom: t, headingSelectors: e, maxHeadingLevels: n});
        we("headingGroups", r);
        const s = hr(t, r), l = or(s);
        return tr(l), ee && (r.forEach((a, c) => {
            $e(a.elems, ["red", "green", "blue"][c])
        }), we("extractHeadings", {headingGroups: r, headings: s})), {
            headings: l,
            headingSelectors: r.map(a => a.selector)
        }
    };

    class xe {
        static detectMainWindow = ur;
        static extractContent = ar;
        static extractHeadings = Zt;
        static extractArticle = Qt;
        static detectHeaderHeight = fr
    }

    var be = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {},
        nt, en;

    function le() {
        if (en) return nt;
        en = 1;

        function t(e, n, r, s, l, a) {
            return {
                tag: e,
                key: n,
                attrs: r,
                children: s,
                text: l,
                dom: a,
                domSize: void 0,
                state: void 0,
                events: void 0,
                instance: void 0
            }
        }

        return t.normalize = function (e) {
            return Array.isArray(e) ? t("[", void 0, void 0, t.normalizeChildren(e), void 0, void 0) : e == null || typeof e == "boolean" ? null : typeof e == "object" ? e : t("#", void 0, void 0, String(e), void 0, void 0)
        }, t.normalizeChildren = function (e) {
            var n = [];
            if (e.length) {
                for (var r = e[0] != null && e[0].key != null, s = 1; s < e.length; s++) if ((e[s] != null && e[s].key != null) !== r) throw new TypeError(r && (e[s] != null || typeof e[s] == "boolean") ? "In fragments, vnodes must either all have keys or none have keys. You may wish to consider using an explicit keyed empty fragment, m.fragment({key: ...}), instead of a hole." : "In fragments, vnodes must either all have keys or none have keys.");
                for (var s = 0; s < e.length; s++) n[s] = t.normalize(e[s])
            }
            return n
        }, nt = t, nt
    }

    var dr = le(), tn = function () {
            var t = arguments[this], e = this + 1, n;
            if (t == null ? t = {} : (typeof t != "object" || t.tag != null || Array.isArray(t)) && (t = {}, e = this), arguments.length === e + 1) n = arguments[e], Array.isArray(n) || (n = [n]); else for (n = []; e < arguments.length;) n.push(arguments[e++]);
            return dr("", t.key, t, n)
        }, je = {}.hasOwnProperty, pr = le(), mr = tn, Ee = je,
        gr = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g, nn = {};

    function rn(t) {
        for (var e in t) if (Ee.call(t, e)) return !1;
        return !0
    }

    function yr(t) {
        for (var e, n = "div", r = [], s = {}; e = gr.exec(t);) {
            var l = e[1], a = e[2];
            if (l === "" && a !== "") n = a; else if (l === "#") s.id = a; else if (l === ".") r.push(a); else if (e[3][0] === "[") {
                var c = e[6];
                c && (c = c.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")), e[4] === "class" ? r.push(c) : s[e[4]] = c === "" ? c : c || !0
            }
        }
        return r.length > 0 && (s.className = r.join(" ")), nn[t] = {tag: n, attrs: s}
    }

    function wr(t, e) {
        var n = e.attrs, r = Ee.call(n, "class"), s = r ? n.class : n.className;
        if (e.tag = t.tag, e.attrs = {}, !rn(t.attrs) && !rn(n)) {
            var l = {};
            for (var a in n) Ee.call(n, a) && (l[a] = n[a]);
            n = l
        }
        for (var a in t.attrs) Ee.call(t.attrs, a) && a !== "className" && !Ee.call(n, a) && (n[a] = t.attrs[a]);
        (s != null || t.attrs.className != null) && (n.className = s != null ? t.attrs.className != null ? String(t.attrs.className) + " " + String(s) : s : t.attrs.className != null ? t.attrs.className : null), r && (n.class = null);
        for (var a in n) if (Ee.call(n, a) && a !== "key") {
            e.attrs = n;
            break
        }
        return e
    }

    function vr(t) {
        if (t == null || typeof t != "string" && typeof t != "function" && typeof t.view != "function") throw Error("The selector must be either a string or a component.");
        var e = mr.apply(1, arguments);
        return typeof t == "string" && (e.children = pr.normalizeChildren(e.children), t !== "[") ? wr(nn[t] || yr(t), e) : (e.tag = t, e)
    }

    var sn = vr, xr = le(), br = function (t) {
        return t == null && (t = ""), xr("<", void 0, void 0, t, void 0, void 0)
    }, Er = le(), Cr = tn, Tr = function () {
        var t = Cr.apply(0, arguments);
        return t.tag = "[", t.children = Er.normalizeChildren(t.children), t
    }, rt = sn;
    rt.trust = br, rt.fragment = Tr;
    var Sr = rt, Me = {exports: {}}, it, on;

    function an() {
        if (on) return it;
        on = 1;
        var t = function (e) {
            if (!(this instanceof t)) throw new Error("Promise must be called with 'new'.");
            if (typeof e != "function") throw new TypeError("executor must be a function.");
            var n = this, r = [], s = [], l = f(r, !0), a = f(s, !1), c = n._instance = {resolvers: r, rejectors: s},
                u = typeof setImmediate == "function" ? setImmediate : setTimeout;

            function f(m, g) {
                return function E(b) {
                    var w;
                    try {
                        if (g && b != null && (typeof b == "object" || typeof b == "function") && typeof (w = b.then) == "function") {
                            if (b === n) throw new TypeError("Promise can't be resolved with itself.");
                            d(w.bind(b))
                        } else u(function () {
                            !g && m.length === 0 && console.error("Possible unhandled promise rejection:", b);
                            for (var v = 0; v < m.length; v++) m[v](b);
                            r.length = 0, s.length = 0, c.state = g, c.retry = function () {
                                E(b)
                            }
                        })
                    } catch (v) {
                        a(v)
                    }
                }
            }

            function d(m) {
                var g = 0;

                function E(w) {
                    return function (v) {
                        g++ > 0 || w(v)
                    }
                }

                var b = E(a);
                try {
                    m(E(l), b)
                } catch (w) {
                    b(w)
                }
            }

            d(e)
        };
        return t.prototype.then = function (e, n) {
            var r = this, s = r._instance;

            function l(f, d, m, g) {
                d.push(function (E) {
                    if (typeof f != "function") m(E); else try {
                        a(f(E))
                    } catch (b) {
                        c && c(b)
                    }
                }), typeof s.retry == "function" && g === s.state && s.retry()
            }

            var a, c, u = new t(function (f, d) {
                a = f, c = d
            });
            return l(e, s.resolvers, a, !0), l(n, s.rejectors, c, !1), u
        }, t.prototype.catch = function (e) {
            return this.then(null, e)
        }, t.prototype.finally = function (e) {
            return this.then(function (n) {
                return t.resolve(e()).then(function () {
                    return n
                })
            }, function (n) {
                return t.resolve(e()).then(function () {
                    return t.reject(n)
                })
            })
        }, t.resolve = function (e) {
            return e instanceof t ? e : new t(function (n) {
                n(e)
            })
        }, t.reject = function (e) {
            return new t(function (n, r) {
                r(e)
            })
        }, t.all = function (e) {
            return new t(function (n, r) {
                var s = e.length, l = 0, a = [];
                if (e.length === 0) n([]); else for (var c = 0; c < e.length; c++) (function (u) {
                    function f(d) {
                        l++, a[u] = d, l === s && n(a)
                    }

                    e[u] != null && (typeof e[u] == "object" || typeof e[u] == "function") && typeof e[u].then == "function" ? e[u].then(f, r) : f(e[u])
                })(c)
            })
        }, t.race = function (e) {
            return new t(function (n, r) {
                for (var s = 0; s < e.length; s++) e[s].then(n, r)
            })
        }, it = t, it
    }

    var Oe = an();
    typeof window < "u" ? (typeof window.Promise > "u" ? window.Promise = Oe : window.Promise.prototype.finally || (window.Promise.prototype.finally = Oe.prototype.finally), Me.exports = window.Promise) : typeof be < "u" ? (typeof be.Promise > "u" ? be.Promise = Oe : be.Promise.prototype.finally || (be.Promise.prototype.finally = Oe.prototype.finally), Me.exports = be.Promise) : Me.exports = Oe;
    var st, cn;

    function Rr() {
        if (cn) return st;
        cn = 1;
        var t = le();
        return st = function (e) {
            var n = e && e.document, r,
                s = {svg: "http://www.w3.org/2000/svg", math: "http://www.w3.org/1998/Math/MathML"};

            function l(o) {
                return o.attrs && o.attrs.xmlns || s[o.tag]
            }

            function a(o, i) {
                if (o.state !== i) throw new Error("'vnode.state' must not be modified.")
            }

            function c(o) {
                var i = o.state;
                try {
                    return this.apply(i, arguments)
                } finally {
                    a(o, i)
                }
            }

            function u() {
                try {
                    return n.activeElement
                } catch {
                    return null
                }
            }

            function f(o, i, h, p, y, x, R) {
                for (var L = h; L < p; L++) {
                    var S = i[L];
                    S != null && d(o, S, y, R, x)
                }
            }

            function d(o, i, h, p, y) {
                var x = i.tag;
                if (typeof x == "string") switch (i.state = {}, i.attrs != null && Ot(i.attrs, i, h), x) {
                    case"#":
                        m(o, i, y);
                        break;
                    case"<":
                        E(o, i, p, y);
                        break;
                    case"[":
                        b(o, i, h, p, y);
                        break;
                    default:
                        w(o, i, h, p, y)
                } else P(o, i, h, p, y)
            }

            function m(o, i, h) {
                i.dom = n.createTextNode(i.children), N(o, i.dom, h)
            }

            var g = {
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

            function E(o, i, h, p) {
                var y = i.children.match(/^\s*?<(\w+)/im) || [], x = n.createElement(g[y[1]] || "div");
                h === "http://www.w3.org/2000/svg" ? (x.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + i.children + "</svg>", x = x.firstChild) : x.innerHTML = i.children, i.dom = x.firstChild, i.domSize = x.childNodes.length, i.instance = [];
                for (var R = n.createDocumentFragment(), L; L = x.firstChild;) i.instance.push(L), R.appendChild(L);
                N(o, R, p)
            }

            function b(o, i, h, p, y) {
                var x = n.createDocumentFragment();
                if (i.children != null) {
                    var R = i.children;
                    f(x, R, 0, R.length, h, null, p)
                }
                i.dom = x.firstChild, i.domSize = x.childNodes.length, N(o, x, y)
            }

            function w(o, i, h, p, y) {
                var x = i.tag, R = i.attrs, L = R && R.is;
                p = l(i) || p;
                var S = p ? L ? n.createElementNS(p, x, {is: L}) : n.createElementNS(p, x) : L ? n.createElement(x, {is: L}) : n.createElement(x);
                if (i.dom = S, R != null && Lt(i, R, p), N(o, S, y), !I(i) && i.children != null) {
                    var O = i.children;
                    f(S, O, 0, O.length, h, null, p), i.tag === "select" && R != null && Pi(i, R)
                }
            }

            function v(o, i) {
                var h;
                if (typeof o.tag.view == "function") {
                    if (o.state = Object.create(o.tag), h = o.state.view, h.$$reentrantLock$$ != null) return;
                    h.$$reentrantLock$$ = !0
                } else {
                    if (o.state = void 0, h = o.tag, h.$$reentrantLock$$ != null) return;
                    h.$$reentrantLock$$ = !0, o.state = o.tag.prototype != null && typeof o.tag.prototype.view == "function" ? new o.tag(o) : o.tag(o)
                }
                if (Ot(o.state, o, i), o.attrs != null && Ot(o.attrs, o, i), o.instance = t.normalize(c.call(o.state.view, o)), o.instance === o) throw Error("A view cannot return the vnode it received as argument");
                h.$$reentrantLock$$ = null
            }

            function P(o, i, h, p, y) {
                v(i, h), i.instance != null ? (d(o, i.instance, h, p, y), i.dom = i.instance.dom, i.domSize = i.dom != null ? i.instance.domSize : 0) : i.domSize = 0
            }

            function M(o, i, h, p, y, x) {
                if (!(i === h || i == null && h == null)) if (i == null || i.length === 0) f(o, h, 0, h.length, p, y, x); else if (h == null || h.length === 0) z(o, i, 0, i.length); else {
                    var R = i[0] != null && i[0].key != null, L = h[0] != null && h[0].key != null, S = 0, O = 0;
                    if (!R) for (; O < i.length && i[O] == null;) O++;
                    if (!L) for (; S < h.length && h[S] == null;) S++;
                    if (R !== L) z(o, i, O, i.length), f(o, h, S, h.length, p, y, x); else if (L) {
                        for (var G = i.length - 1, U = h.length - 1, We, K, j, V, F, It; G >= O && U >= S && (V = i[G], F = h[U], V.key === F.key);) V !== F && H(o, V, F, p, y, x), F.dom != null && (y = F.dom), G--, U--;
                        for (; G >= O && U >= S && (K = i[O], j = h[S], K.key === j.key);) O++, S++, K !== j && H(o, K, j, p, ae(i, O, y), x);
                        for (; G >= O && U >= S && !(S === U || K.key !== F.key || V.key !== j.key);) It = ae(i, O, y), B(o, V, It), V !== j && H(o, V, j, p, It, x), ++S <= --U && B(o, K, y), K !== F && H(o, K, F, p, y, x), F.dom != null && (y = F.dom), O++, G--, V = i[G], F = h[U], K = i[O], j = h[S];
                        for (; G >= O && U >= S && V.key === F.key;) V !== F && H(o, V, F, p, y, x), F.dom != null && (y = F.dom), G--, U--, V = i[G], F = h[U];
                        if (S > U) z(o, i, O, G + 1); else if (O > G) f(o, h, S, U + 1, p, y, x); else {
                            var Ni = y, Wn = U - S + 1, ke = new Array(Wn), Ft = 0, q = 0, $t = 2147483647, Dt = 0, We,
                                qt;
                            for (q = 0; q < Wn; q++) ke[q] = -1;
                            for (q = U; q >= S; q--) {
                                We == null && (We = me(i, O, G + 1)), F = h[q];
                                var Pe = We[F.key];
                                Pe != null && ($t = Pe < $t ? Pe : -1, ke[q - S] = Pe, V = i[Pe], i[Pe] = null, V !== F && H(o, V, F, p, y, x), F.dom != null && (y = F.dom), Dt++)
                            }
                            if (y = Ni, Dt !== G - O + 1 && z(o, i, O, G + 1), Dt === 0) f(o, h, S, U + 1, p, y, x); else if ($t === -1) for (qt = ne(ke), Ft = qt.length - 1, q = U; q >= S; q--) j = h[q], ke[q - S] === -1 ? d(o, j, p, x, y) : qt[Ft] === q - S ? Ft-- : B(o, j, y), j.dom != null && (y = h[q].dom); else for (q = U; q >= S; q--) j = h[q], ke[q - S] === -1 && d(o, j, p, x, y), j.dom != null && (y = h[q].dom)
                        }
                    } else {
                        var kt = i.length < h.length ? i.length : h.length;
                        for (S = S < O ? S : O; S < kt; S++) K = i[S], j = h[S], !(K === j || K == null && j == null) && (K == null ? d(o, j, p, x, ae(i, S + 1, y)) : j == null ? D(o, K) : H(o, K, j, p, ae(i, S + 1, y), x));
                        i.length > kt && z(o, i, S, i.length), h.length > kt && f(o, h, S, h.length, p, y, x)
                    }
                }
            }

            function H(o, i, h, p, y, x) {
                var R = i.tag, L = h.tag;
                if (R === L) {
                    if (h.state = i.state, h.events = i.events, Oi(h, i)) return;
                    if (typeof R == "string") switch (h.attrs != null && Nt(h.attrs, h, p), R) {
                        case"#":
                            ie(i, h);
                            break;
                        case"<":
                            X(o, i, h, x, y);
                            break;
                        case"[":
                            $(o, i, h, p, y, x);
                            break;
                        default:
                            Q(i, h, p, x)
                    } else W(o, i, h, p, y, x)
                } else D(o, i), d(o, h, p, x, y)
            }

            function ie(o, i) {
                o.children.toString() !== i.children.toString() && (o.dom.nodeValue = i.children), i.dom = o.dom
            }

            function X(o, i, h, p, y) {
                i.children !== h.children ? (k(o, i), E(o, h, p, y)) : (h.dom = i.dom, h.domSize = i.domSize, h.instance = i.instance)
            }

            function $(o, i, h, p, y, x) {
                M(o, i.children, h.children, p, y, x);
                var R = 0, L = h.children;
                if (h.dom = null, L != null) {
                    for (var S = 0; S < L.length; S++) {
                        var O = L[S];
                        O != null && O.dom != null && (h.dom == null && (h.dom = O.dom), R += O.domSize || 1)
                    }
                    R !== 1 && (h.domSize = R)
                }
            }

            function Q(o, i, h, p) {
                var y = i.dom = o.dom;
                p = l(i) || p, i.tag === "textarea" && i.attrs == null && (i.attrs = {}), Ai(i, o.attrs, i.attrs, p), I(i) || M(y, o.children, i.children, h, null, p)
            }

            function W(o, i, h, p, y, x) {
                if (h.instance = t.normalize(c.call(h.state.view, h)), h.instance === h) throw Error("A view cannot return the vnode it received as argument");
                Nt(h.state, h, p), h.attrs != null && Nt(h.attrs, h, p), h.instance != null ? (i.instance == null ? d(o, h.instance, p, x, y) : H(o, i.instance, h.instance, p, y, x), h.dom = h.instance.dom, h.domSize = h.instance.domSize) : i.instance != null ? (D(o, i.instance), h.dom = void 0, h.domSize = 0) : (h.dom = i.dom, h.domSize = i.domSize)
            }

            function me(o, i, h) {
                for (var p = Object.create(null); i < h; i++) {
                    var y = o[i];
                    if (y != null) {
                        var x = y.key;
                        x != null && (p[x] = i)
                    }
                }
                return p
            }

            var Z = [];

            function ne(o) {
                for (var i = [0], h = 0, p = 0, y = 0, x = Z.length = o.length, y = 0; y < x; y++) Z[y] = o[y];
                for (var y = 0; y < x; ++y) if (o[y] !== -1) {
                    var R = i[i.length - 1];
                    if (o[R] < o[y]) {
                        Z[y] = R, i.push(y);
                        continue
                    }
                    for (h = 0, p = i.length - 1; h < p;) {
                        var L = (h >>> 1) + (p >>> 1) + (h & p & 1);
                        o[i[L]] < o[y] ? h = L + 1 : p = L
                    }
                    o[y] < o[i[h]] && (h > 0 && (Z[y] = i[h - 1]), i[h] = y)
                }
                for (h = i.length, p = i[h - 1]; h-- > 0;) i[h] = p, p = Z[p];
                return Z.length = 0, i
            }

            function ae(o, i, h) {
                for (; i < o.length; i++) if (o[i] != null && o[i].dom != null) return o[i].dom;
                return h
            }

            function B(o, i, h) {
                var p = n.createDocumentFragment();
                A(o, p, i), N(o, p, h)
            }

            function A(o, i, h) {
                for (; h.dom != null && h.dom.parentNode === o;) {
                    if (typeof h.tag != "string") {
                        if (h = h.instance, h != null) continue
                    } else if (h.tag === "<") for (var p = 0; p < h.instance.length; p++) i.appendChild(h.instance[p]); else if (h.tag !== "[") i.appendChild(h.dom); else if (h.children.length === 1) {
                        if (h = h.children[0], h != null) continue
                    } else for (var p = 0; p < h.children.length; p++) {
                        var y = h.children[p];
                        y != null && A(o, i, y)
                    }
                    break
                }
            }

            function N(o, i, h) {
                h != null ? o.insertBefore(i, h) : o.appendChild(i)
            }

            function I(o) {
                if (o.attrs == null || o.attrs.contenteditable == null && o.attrs.contentEditable == null) return !1;
                var i = o.children;
                if (i != null && i.length === 1 && i[0].tag === "<") {
                    var h = i[0].children;
                    o.dom.innerHTML !== h && (o.dom.innerHTML = h)
                } else if (i != null && i.length !== 0) throw new Error("Child node of a contenteditable must be trusted.");
                return !0
            }

            function z(o, i, h, p) {
                for (var y = h; y < p; y++) {
                    var x = i[y];
                    x != null && D(o, x)
                }
            }

            function D(o, i) {
                var h = 0, p = i.state, y, x;
                if (typeof i.tag != "string" && typeof i.state.onbeforeremove == "function") {
                    var R = c.call(i.state.onbeforeremove, i);
                    R != null && typeof R.then == "function" && (h = 1, y = R)
                }
                if (i.attrs && typeof i.attrs.onbeforeremove == "function") {
                    var R = c.call(i.attrs.onbeforeremove, i);
                    R != null && typeof R.then == "function" && (h |= 2, x = R)
                }
                if (a(i, p), !h) Re(i), J(o, i); else {
                    if (y != null) {
                        var L = function () {
                            h & 1 && (h &= 2, h || S())
                        };
                        y.then(L, L)
                    }
                    if (x != null) {
                        var L = function () {
                            h & 2 && (h &= 1, h || S())
                        };
                        x.then(L, L)
                    }
                }

                function S() {
                    a(i, p), Re(i), J(o, i)
                }
            }

            function k(o, i) {
                for (var h = 0; h < i.instance.length; h++) o.removeChild(i.instance[h])
            }

            function J(o, i) {
                for (; i.dom != null && i.dom.parentNode === o;) {
                    if (typeof i.tag != "string") {
                        if (i = i.instance, i != null) continue
                    } else if (i.tag === "<") k(o, i); else {
                        if (i.tag !== "[" && (o.removeChild(i.dom), !Array.isArray(i.children))) break;
                        if (i.children.length === 1) {
                            if (i = i.children[0], i != null) continue
                        } else for (var h = 0; h < i.children.length; h++) {
                            var p = i.children[h];
                            p != null && J(o, p)
                        }
                    }
                    break
                }
            }

            function Re(o) {
                if (typeof o.tag != "string" && typeof o.state.onremove == "function" && c.call(o.state.onremove, o), o.attrs && typeof o.attrs.onremove == "function" && c.call(o.attrs.onremove, o), typeof o.tag != "string") o.instance != null && Re(o.instance); else {
                    var i = o.children;
                    if (Array.isArray(i)) for (var h = 0; h < i.length; h++) {
                        var p = i[h];
                        p != null && Re(p)
                    }
                }
            }

            function Lt(o, i, h) {
                o.tag === "input" && i.type != null && o.dom.setAttribute("type", i.type);
                var p = i != null && o.tag === "input" && i.type === "file";
                for (var y in i) ue(o, y, null, i[y], h, p)
            }

            function ue(o, i, h, p, y, x) {
                if (!(i === "key" || i === "is" || p == null || Bn(i) || h === p && !Li(o, i) && typeof p != "object" || i === "type" && o.tag === "input")) {
                    if (i[0] === "o" && i[1] === "n") return Un(o, i, p);
                    if (i.slice(0, 6) === "xlink:") o.dom.setAttributeNS("http://www.w3.org/1999/xlink", i.slice(6), p); else if (i === "style") _n(o.dom, h, p); else if (zn(o, i, y)) {
                        if (i === "value") {
                            if ((o.tag === "input" || o.tag === "textarea") && o.dom.value === "" + p && (x || o.dom === u()) || o.tag === "select" && h !== null && o.dom.value === "" + p || o.tag === "option" && h !== null && o.dom.value === "" + p) return;
                            if (x && "" + p != "") {
                                console.error("`value` is read-only on file inputs!");
                                return
                            }
                        }
                        o.dom[i] = p
                    } else typeof p == "boolean" ? p ? o.dom.setAttribute(i, "") : o.dom.removeAttribute(i) : o.dom.setAttribute(i === "className" ? "class" : i, p)
                }
            }

            function ge(o, i, h, p) {
                if (!(i === "key" || i === "is" || h == null || Bn(i))) if (i[0] === "o" && i[1] === "n") Un(o, i, void 0); else if (i === "style") _n(o.dom, h, null); else if (zn(o, i, p) && i !== "className" && i !== "title" && !(i === "value" && (o.tag === "option" || o.tag === "select" && o.dom.selectedIndex === -1 && o.dom === u())) && !(o.tag === "input" && i === "type")) o.dom[i] = null; else {
                    var y = i.indexOf(":");
                    y !== -1 && (i = i.slice(y + 1)), h !== !1 && o.dom.removeAttribute(i === "className" ? "class" : i)
                }
            }

            function Pi(o, i) {
                if ("value" in i) if (i.value === null) o.dom.selectedIndex !== -1 && (o.dom.value = null); else {
                    var h = "" + i.value;
                    (o.dom.value !== h || o.dom.selectedIndex === -1) && (o.dom.value = h)
                }
                "selectedIndex" in i && ue(o, "selectedIndex", null, i.selectedIndex, void 0)
            }

            function Ai(o, i, h, p) {
                if (i && i === h && console.warn("Don't reuse attrs object, use new object for every redraw, this will throw in next major"), h != null) {
                    o.tag === "input" && h.type != null && o.dom.setAttribute("type", h.type);
                    var y = o.tag === "input" && h.type === "file";
                    for (var x in h) ue(o, x, i && i[x], h[x], p, y)
                }
                var R;
                if (i != null) for (var x in i) (R = i[x]) != null && (h == null || h[x] == null) && ge(o, x, R, p)
            }

            function Li(o, i) {
                return i === "value" || i === "checked" || i === "selectedIndex" || i === "selected" && o.dom === u() || o.tag === "option" && o.dom.parentNode === n.activeElement
            }

            function Bn(o) {
                return o === "oninit" || o === "oncreate" || o === "onupdate" || o === "onremove" || o === "onbeforeremove" || o === "onbeforeupdate"
            }

            function zn(o, i, h) {
                return h === void 0 && (o.tag.indexOf("-") > -1 || o.attrs != null && o.attrs.is || i !== "href" && i !== "list" && i !== "form" && i !== "width" && i !== "height") && i in o.dom
            }

            var Hi = /[A-Z]/g;

            function Mi(o) {
                return "-" + o.toLowerCase()
            }

            function Ht(o) {
                return o[0] === "-" && o[1] === "-" ? o : o === "cssFloat" ? "float" : o.replace(Hi, Mi)
            }

            function _n(o, i, h) {
                if (i !== h) if (h == null) o.style.cssText = ""; else if (typeof h != "object") o.style.cssText = h; else if (i == null || typeof i != "object") {
                    o.style.cssText = "";
                    for (var p in h) {
                        var y = h[p];
                        y != null && o.style.setProperty(Ht(p), String(y))
                    }
                } else {
                    for (var p in h) {
                        var y = h[p];
                        y != null && (y = String(y)) !== String(i[p]) && o.style.setProperty(Ht(p), y)
                    }
                    for (var p in i) i[p] != null && h[p] == null && o.style.removeProperty(Ht(p))
                }
            }

            function Mt() {
                this._ = r
            }

            Mt.prototype = Object.create(null), Mt.prototype.handleEvent = function (o) {
                var i = this["on" + o.type], h;
                typeof i == "function" ? h = i.call(o.currentTarget, o) : typeof i.handleEvent == "function" && i.handleEvent(o), this._ && o.redraw !== !1 && (0, this._)(), h === !1 && (o.preventDefault(), o.stopPropagation())
            };

            function Un(o, i, h) {
                if (o.events != null) {
                    if (o.events._ = r, o.events[i] === h) return;
                    h != null && (typeof h == "function" || typeof h == "object") ? (o.events[i] == null && o.dom.addEventListener(i.slice(2), o.events, !1), o.events[i] = h) : (o.events[i] != null && o.dom.removeEventListener(i.slice(2), o.events, !1), o.events[i] = void 0)
                } else h != null && (typeof h == "function" || typeof h == "object") && (o.events = new Mt, o.dom.addEventListener(i.slice(2), o.events, !1), o.events[i] = h)
            }

            function Ot(o, i, h) {
                typeof o.oninit == "function" && c.call(o.oninit, i), typeof o.oncreate == "function" && h.push(c.bind(o.oncreate, i))
            }

            function Nt(o, i, h) {
                typeof o.onupdate == "function" && h.push(c.bind(o.onupdate, i))
            }

            function Oi(o, i) {
                do {
                    if (o.attrs != null && typeof o.attrs.onbeforeupdate == "function") {
                        var h = c.call(o.attrs.onbeforeupdate, o, i);
                        if (h !== void 0 && !h) break
                    }
                    if (typeof o.tag != "string" && typeof o.state.onbeforeupdate == "function") {
                        var h = c.call(o.state.onbeforeupdate, o, i);
                        if (h !== void 0 && !h) break
                    }
                    return !1
                } while (!1);
                return o.dom = i.dom, o.domSize = i.domSize, o.instance = i.instance, o.attrs = i.attrs, o.children = i.children, o.text = i.text, !0
            }

            var Ne;
            return function (o, i, h) {
                if (!o) throw new TypeError("DOM element being rendered to does not exist.");
                if (Ne != null && o.contains(Ne)) throw new TypeError("Node is currently being rendered to and thus is locked.");
                var p = r, y = Ne, x = [], R = u(), L = o.namespaceURI;
                Ne = o, r = typeof h == "function" ? h : void 0;
                try {
                    o.vnodes == null && (o.textContent = ""), i = t.normalizeChildren(Array.isArray(i) ? i : [i]), M(o, o.vnodes, i, x, null, L === "http://www.w3.org/1999/xhtml" ? void 0 : L), o.vnodes = i, R != null && u() !== R && typeof R.focus == "function" && R.focus();
                    for (var S = 0; S < x.length; S++) x[S]()
                } finally {
                    r = p, Ne = y
                }
            }
        }, st
    }

    var ot, ln;

    function un() {
        return ln || (ln = 1, ot = Rr()(typeof window < "u" ? window : null)), ot
    }

    var hn = le(), Pr = function (t, e, n) {
            var r = [], s = !1, l = -1;

            function a() {
                for (l = 0; l < r.length; l += 2) try {
                    t(r[l], hn(r[l + 1]), c)
                } catch (f) {
                    n.error(f)
                }
                l = -1
            }

            function c() {
                s || (s = !0, e(function () {
                    s = !1, a()
                }))
            }

            c.sync = a;

            function u(f, d) {
                if (d != null && d.view == null && typeof d != "function") throw new TypeError("m.mount expects a component, not a vnode.");
                var m = r.indexOf(f);
                m >= 0 && (r.splice(m, 2), m <= l && (l -= 2), t(f, [])), d != null && (r.push(f, d), t(f, hn(d), c))
            }

            return {mount: u, redraw: c}
        }, Ar = un(),
        at = Pr(Ar, typeof requestAnimationFrame < "u" ? requestAnimationFrame : null, typeof console < "u" ? console : null),
        ct, fn;

    function dn() {
        return fn || (fn = 1, ct = function (t) {
            if (Object.prototype.toString.call(t) !== "[object Object]") return "";
            var e = [];
            for (var n in t) r(n, t[n]);
            return e.join("&");

            function r(s, l) {
                if (Array.isArray(l)) for (var a = 0; a < l.length; a++) r(s + "[" + a + "]", l[a]); else if (Object.prototype.toString.call(l) === "[object Object]") for (var a in l) r(s + "[" + a + "]", l[a]); else e.push(encodeURIComponent(s) + (l != null && l !== "" ? "=" + encodeURIComponent(l) : ""))
            }
        }), ct
    }

    var lt, pn;

    function mn() {
        if (pn) return lt;
        pn = 1;
        var t = je;
        return lt = Object.assign || function (e, n) {
            for (var r in n) t.call(n, r) && (e[r] = n[r])
        }, lt
    }

    var ut, gn;

    function ht() {
        if (gn) return ut;
        gn = 1;
        var t = dn(), e = mn();
        return ut = function (n, r) {
            if (/:([^\/\.-]+)(\.{3})?:/.test(n)) throw new SyntaxError("Template parameter names must be separated by either a '/', '-', or '.'.");
            if (r == null) return n;
            var s = n.indexOf("?"), l = n.indexOf("#"), a = l < 0 ? n.length : l, c = s < 0 ? a : s, u = n.slice(0, c),
                f = {};
            e(f, r);
            var d = u.replace(/:([^\/\.-]+)(\.{3})?/g, function (P, M, H) {
                return delete f[M], r[M] == null ? P : H ? r[M] : encodeURIComponent(String(r[M]))
            }), m = d.indexOf("?"), g = d.indexOf("#"), E = g < 0 ? d.length : g, b = m < 0 ? E : m, w = d.slice(0, b);
            s >= 0 && (w += n.slice(s, a)), m >= 0 && (w += (s < 0 ? "?" : "&") + d.slice(m, E));
            var v = t(f);
            return v && (w += (s < 0 && m < 0 ? "?" : "&") + v), l >= 0 && (w += n.slice(l)), g >= 0 && (w += (l < 0 ? "" : "&") + d.slice(g)), w
        }, ut
    }

    var Lr = ht(), yn = je, Hr = function (t, e, n) {
        var r = 0;

        function s(c) {
            return new e(c)
        }

        s.prototype = e.prototype, s.__proto__ = e;

        function l(c) {
            return function (u, f) {
                typeof u != "string" ? (f = u, u = u.url) : f == null && (f = {});
                var d = new e(function (b, w) {
                    c(Lr(u, f.params), f, function (v) {
                        if (typeof f.type == "function") if (Array.isArray(v)) for (var P = 0; P < v.length; P++) v[P] = new f.type(v[P]); else v = new f.type(v);
                        b(v)
                    }, w)
                });
                if (f.background === !0) return d;
                var m = 0;

                function g() {
                    --m === 0 && typeof n == "function" && n()
                }

                return E(d);

                function E(b) {
                    var w = b.then;
                    return b.constructor = s, b.then = function () {
                        m++;
                        var v = w.apply(b, arguments);
                        return v.then(g, function (P) {
                            if (g(), m === 0) throw P
                        }), E(v)
                    }, b
                }
            }
        }

        function a(c, u) {
            for (var f in c.headers) if (yn.call(c.headers, f) && f.toLowerCase() === u) return !0;
            return !1
        }

        return {
            request: l(function (c, u, f, d) {
                var m = u.method != null ? u.method.toUpperCase() : "GET", g = u.body,
                    E = (u.serialize == null || u.serialize === JSON.serialize) && !(g instanceof t.FormData || g instanceof t.URLSearchParams),
                    b = u.responseType || (typeof u.extract == "function" ? "" : "json"), w = new t.XMLHttpRequest,
                    v = !1, P = !1, M = w, H, ie = w.abort;
                w.abort = function () {
                    v = !0, ie.call(this)
                }, w.open(m, c, u.async !== !1, typeof u.user == "string" ? u.user : void 0, typeof u.password == "string" ? u.password : void 0), E && g != null && !a(u, "content-type") && w.setRequestHeader("Content-Type", "application/json; charset=utf-8"), typeof u.deserialize != "function" && !a(u, "accept") && w.setRequestHeader("Accept", "application/json, text/*"), u.withCredentials && (w.withCredentials = u.withCredentials), u.timeout && (w.timeout = u.timeout), w.responseType = b;
                for (var X in u.headers) yn.call(u.headers, X) && w.setRequestHeader(X, u.headers[X]);
                w.onreadystatechange = function ($) {
                    if (!v && $.target.readyState === 4) try {
                        var Q = $.target.status >= 200 && $.target.status < 300 || $.target.status === 304 || /^file:\/\//i.test(c),
                            W = $.target.response, me;
                        if (b === "json") {
                            if (!$.target.responseType && typeof u.extract != "function") try {
                                W = JSON.parse($.target.responseText)
                            } catch {
                                W = null
                            }
                        } else (!b || b === "text") && W == null && (W = $.target.responseText);
                        if (typeof u.extract == "function" ? (W = u.extract($.target, u), Q = !0) : typeof u.deserialize == "function" && (W = u.deserialize(W)), Q) f(W); else {
                            var Z = function () {
                                try {
                                    me = $.target.responseText
                                } catch {
                                    me = W
                                }
                                var ne = new Error(me);
                                ne.code = $.target.status, ne.response = W, d(ne)
                            };
                            w.status === 0 ? setTimeout(function () {
                                P || Z()
                            }) : Z()
                        }
                    } catch (ne) {
                        d(ne)
                    }
                }, w.ontimeout = function ($) {
                    P = !0;
                    var Q = new Error("Request timed out");
                    Q.code = $.target.status, d(Q)
                }, typeof u.config == "function" && (w = u.config(w, u, c) || w, w !== M && (H = w.abort, w.abort = function () {
                    v = !0, H.call(this)
                })), g == null ? w.send() : typeof u.serialize == "function" ? w.send(u.serialize(g)) : g instanceof t.FormData || g instanceof t.URLSearchParams ? w.send(g) : w.send(JSON.stringify(g))
            }), jsonp: l(function (c, u, f, d) {
                var m = u.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + r++,
                    g = t.document.createElement("script");
                t[m] = function (E) {
                    delete t[m], g.parentNode.removeChild(g), f(E)
                }, g.onerror = function () {
                    delete t[m], g.parentNode.removeChild(g), d(new Error("JSONP request failed"))
                }, g.src = c + (c.indexOf("?") < 0 ? "?" : "&") + encodeURIComponent(u.callbackKey || "callback") + "=" + encodeURIComponent(m), t.document.documentElement.appendChild(g)
            })
        }
    }, Mr = Me.exports, Or = at, Nr = Hr(typeof window < "u" ? window : null, Mr, Or.redraw), ft, wn;

    function vn() {
        if (wn) return ft;
        wn = 1;

        function t(e) {
            try {
                return decodeURIComponent(e)
            } catch {
                return e
            }
        }

        return ft = function (e) {
            if (e === "" || e == null) return {};
            e.charAt(0) === "?" && (e = e.slice(1));
            for (var n = e.split("&"), r = {}, s = {}, l = 0; l < n.length; l++) {
                var a = n[l].split("="), c = t(a[0]), u = a.length === 2 ? t(a[1]) : "";
                u === "true" ? u = !0 : u === "false" && (u = !1);
                var f = c.split(/\]\[?|\[/), d = s;
                c.indexOf("[") > -1 && f.pop();
                for (var m = 0; m < f.length; m++) {
                    var g = f[m], E = f[m + 1], b = E == "" || !isNaN(parseInt(E, 10));
                    if (g === "") {
                        var c = f.slice(0, m).join();
                        r[c] == null && (r[c] = Array.isArray(d) ? d.length : 0), g = r[c]++
                    } else if (g === "__proto__") break;
                    if (m === f.length - 1) d[g] = u; else {
                        var w = Object.getOwnPropertyDescriptor(d, g);
                        w != null && (w = w.value), w == null && (d[g] = w = b ? [] : {}), d = w
                    }
                }
            }
            return s
        }, ft
    }

    var dt, xn;

    function pt() {
        if (xn) return dt;
        xn = 1;
        var t = vn();
        return dt = function (e) {
            var n = e.indexOf("?"), r = e.indexOf("#"), s = r < 0 ? e.length : r, l = n < 0 ? s : n,
                a = e.slice(0, l).replace(/\/{2,}/g, "/");
            return a ? (a[0] !== "/" && (a = "/" + a), a.length > 1 && a[a.length - 1] === "/" && (a = a.slice(0, -1))) : a = "/", {
                path: a,
                params: n < 0 ? {} : t(e.slice(n + 1, s))
            }
        }, dt
    }

    var mt, bn;

    function kr() {
        if (bn) return mt;
        bn = 1;
        var t = pt();
        return mt = function (e) {
            var n = t(e), r = Object.keys(n.params), s = [],
                l = new RegExp("^" + n.path.replace(/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g, function (a, c, u) {
                    return c == null ? "\\" + a : (s.push({
                        k: c,
                        r: u === "..."
                    }), u === "..." ? "(.*)" : u === "." ? "([^/]+)\\." : "([^/]+)" + (u || ""))
                }) + "$");
            return function (a) {
                for (var c = 0; c < r.length; c++) if (n.params[r[c]] !== a.params[r[c]]) return !1;
                if (!s.length) return l.test(a.path);
                var u = l.exec(a.path);
                if (u == null) return !1;
                for (var c = 0; c < s.length; c++) a.params[s[c].k] = s[c].r ? u[c + 1] : decodeURIComponent(u[c + 1]);
                return !0
            }
        }, mt
    }

    var gt, En;

    function Cn() {
        if (En) return gt;
        En = 1;
        var t = je, e = new RegExp("^(?:key|oninit|oncreate|onbeforeupdate|onupdate|onbeforeremove|onremove)$");
        return gt = function (n, r) {
            var s = {};
            if (r != null) for (var l in n) t.call(n, l) && !e.test(l) && r.indexOf(l) < 0 && (s[l] = n[l]); else for (var l in n) t.call(n, l) && !e.test(l) && (s[l] = n[l]);
            return s
        }, gt
    }

    var yt, Tn;

    function Ir() {
        if (Tn) return yt;
        Tn = 1;
        var t = le(), e = sn, n = Me.exports, r = ht(), s = pt(), l = kr(), a = mn(), c = Cn(), u = {};

        function f(d) {
            try {
                return decodeURIComponent(d)
            } catch {
                return d
            }
        }

        return yt = function (d, m) {
            var g = d == null ? null : typeof d.setImmediate == "function" ? d.setImmediate : d.setTimeout,
                E = n.resolve(), b = !1, w = !1, v = 0, P, M, H = u, ie, X, $, Q, W = {
                    onbeforeupdate: function () {
                        return v = v ? 2 : 1, !(!v || u === H)
                    }, onremove: function () {
                        d.removeEventListener("popstate", ne, !1), d.removeEventListener("hashchange", Z, !1)
                    }, view: function () {
                        if (!(!v || u === H)) {
                            var A = [t(ie, X.key, X)];
                            return H && (A = H.render(A[0])), A
                        }
                    }
                }, me = B.SKIP = {};

            function Z() {
                b = !1;
                var A = d.location.hash;
                B.prefix[0] !== "#" && (A = d.location.search + A, B.prefix[0] !== "?" && (A = d.location.pathname + A, A[0] !== "/" && (A = "/" + A)));
                var N = A.concat().replace(/(?:%[a-f89][a-f0-9])+/gim, f).slice(B.prefix.length), I = s(N);
                a(I.params, d.history.state);

                function z(k) {
                    console.error(k), ae(M, null, {replace: !0})
                }

                D(0);

                function D(k) {
                    for (; k < P.length; k++) if (P[k].check(I)) {
                        var J = P[k].component, Re = P[k].route, Lt = J, ue = Q = function (ge) {
                            if (ue === Q) {
                                if (ge === me) return D(k + 1);
                                ie = ge != null && (typeof ge.view == "function" || typeof ge == "function") ? ge : "div", X = I.params, $ = N, Q = null, H = J.render ? J : null, v === 2 ? m.redraw() : (v = 2, m.redraw.sync())
                            }
                        };
                        J.view || typeof J == "function" ? (J = {}, ue(Lt)) : J.onmatch ? E.then(function () {
                            return J.onmatch(I.params, N, Re)
                        }).then(ue, N === M ? null : z) : ue("div");
                        return
                    }
                    if (N === M) throw new Error("Could not resolve default route " + M + ".");
                    ae(M, null, {replace: !0})
                }
            }

            function ne() {
                b || (b = !0, g(Z))
            }

            function ae(A, N, I) {
                if (A = r(A, N), w) {
                    ne();
                    var z = I ? I.state : null, D = I ? I.title : null;
                    I && I.replace ? d.history.replaceState(z, D, B.prefix + A) : d.history.pushState(z, D, B.prefix + A)
                } else d.location.href = B.prefix + A
            }

            function B(A, N, I) {
                if (!A) throw new TypeError("DOM element being rendered to does not exist.");
                if (P = Object.keys(I).map(function (D) {
                    if (D[0] !== "/") throw new SyntaxError("Routes must start with a '/'.");
                    if (/:([^\/\.-]+)(\.{3})?:/.test(D)) throw new SyntaxError("Route parameter names must be separated with either '/', '.', or '-'.");
                    return {route: D, component: I[D], check: l(D)}
                }), M = N, N != null) {
                    var z = s(N);
                    if (!P.some(function (D) {
                        return D.check(z)
                    })) throw new ReferenceError("Default route doesn't match any known routes.")
                }
                typeof d.history.pushState == "function" ? d.addEventListener("popstate", ne, !1) : B.prefix[0] === "#" && d.addEventListener("hashchange", Z, !1), w = !0, m.mount(A, W), Z()
            }

            return B.set = function (A, N, I) {
                Q != null && (I = I || {}, I.replace = !0), Q = null, ae(A, N, I)
            }, B.get = function () {
                return $
            }, B.prefix = "#!", B.Link = {
                view: function (A) {
                    var N = e(A.attrs.selector || "a", c(A.attrs, ["options", "params", "selector", "onclick"]), A.children),
                        I, z, D;
                    return (N.attrs.disabled = Boolean(N.attrs.disabled)) ? (N.attrs.href = null, N.attrs["aria-disabled"] = "true") : (I = A.attrs.options, z = A.attrs.onclick, D = r(N.attrs.href, A.attrs.params), N.attrs.href = B.prefix + D, N.attrs.onclick = function (k) {
                        var J;
                        typeof z == "function" ? J = z.call(k.currentTarget, k) : z == null || typeof z != "object" || typeof z.handleEvent == "function" && z.handleEvent(k), J !== !1 && !k.defaultPrevented && (k.button === 0 || k.which === 0 || k.which === 1) && (!k.currentTarget.target || k.currentTarget.target === "_self") && !k.ctrlKey && !k.metaKey && !k.shiftKey && !k.altKey && (k.preventDefault(), k.redraw = !1, B.set(D, null, I))
                    }), N
                }
            }, B.param = function (A) {
                return X && A != null ? X[A] : X
            }, B
        }, yt
    }

    var wt, Sn;

    function Fr() {
        if (Sn) return wt;
        Sn = 1;
        var t = at;
        return wt = Ir()(typeof window < "u" ? window : null, t), wt
    }

    var Be = Sr, Rn = Nr, Pn = at, _ = function () {
        return Be.apply(this, arguments)
    };
    _.m = Be, _.trust = Be.trust, _.fragment = Be.fragment, _.Fragment = "[", _.mount = Pn.mount, _.route = Fr(), _.render = un(), _.redraw = Pn.redraw, _.request = Rn.request, _.jsonp = Rn.jsonp, _.parseQueryString = vn(), _.buildQueryString = dn(), _.parsePathname = pt(), _.buildPathname = ht(), _.vnode = le(), _.PromisePolyfill = an(), _.censor = Cn();
    var C = _;
    const he = async t => new Promise(e => setTimeout(e, t)), ki = "";

    class ze extends Error {
        errmsg;
        data;

        constructor(e, n) {
            super(e), Error.captureStackTrace ? Error.captureStackTrace(this, ze) : this.stack = new Error(e).stack, Object.setPrototypeOf ? Object.setPrototypeOf(this, ze.prototype) : this.__proto__ = new.target.prototype, this.errmsg = e, this.data = n
        }
    }

    const $r = ce("client");

    function Dr() {
        return new Proxy({}, {
            get: function (e, n, r) {
                return async (...s) => {
                    $r(n, ...s);
                    const l = new Promise((a, c) => {
                        try {
                            chrome.runtime.sendMessage({command: n, args: s}, u => {
                                if (!u) {
                                    c(new Error("Cannot connect to background service"));
                                    return
                                }
                                u.ok ? a(u.result) : c(u.error)
                            })
                        } catch (u) {
                            c(u)
                        }
                    });
                    return Promise.race([l, he(5e3).then(() => {
                        throw new ze("Unable to connect to the background script. Try quitting and restarting your browser to see if that fixes the problem.")
                    })])
                }
            }
        })
    }

    function qr() {
        let t = !1;
        const e = void 0;
        return {
            async hasIdentityPermission() {
                return t
            }, async requestIdentityPermission() {
                return t = !0, !0
            }, async requestScriptingPermission() {
                return !0
            }, async getIdentity() {
                if (!!t) return e
            }, async isIdentitySupported() {
                return !0
            }, async checkProductStatusIfNeeded() {
            }, async login(n) {
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

    const An = t => {
        const e = () => {
        };
        return e.basePath = t, new Proxy(e, {
            get(n, r) {
                if (typeof r != "string" && typeof r != "number") throw new TypeError("expects string or number");
                return An(`${n.basePath}/${r}`)
            }, apply(n, r, [s]) {
                return fetch(n.basePath, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(s)
                }).then(async l => {
                    if (!l.ok || l.status > 299) throw await l.json();
                    return await l.json()
                })
            }
        })
    }, vt = An(Jn), jr = "smart-toc-pro", Br = {
        queryStartTrial(t) {
            return t?.startTrialReason
        }, async startTrial(t) {
            const e = await this.fetchProductInfo(t);
            return ye(t), ye(e.product), await vt.customer.startTrial({email: t, productId: e.product.id})
        }, getPrivilegeType(t) {
            return t ? t.privilege : {type: "free"}
        }, queryClaimPaid(t) {
            return t?.claimPaidReason
        }, async claimPaid(t, e) {
            const n = await this.fetchProductInfo(t);
            return ye(n.product), await vt.customer.claimPaid({email: t, productId: n.product.id, method: e})
        }, async fetchProductInfo(t) {
            return await vt.customer.getProductInfo({email: t, productId: jr})
        }
    };

    class xt {
        disposers = [];
        isDisposed = !1;
        R = e => (ye(!this.isDisposed, "trying to R() after dispose"), this.disposers.push(e), e);
        dispose = () => {
            if (this.isDisposed) {
                ee && console.warn("[smarttoc] trying to dispose() after dispose");
                return
            }
            this.isDisposed = !0, this.disposers.reverse().forEach(e => {
                typeof e == "function" ? e() : e.dispose()
            }), this.disposers = []
        }
    }

    class fe extends xt {
        handlerMap = new Map;

        constructor() {
            super(), this.R(() => this.offAll())
        }

        on(e, n) {
            const r = this.handlerMap.get(e) || new Set;
            return r.add(n), this.handlerMap.set(e, r), () => this.off(e, n)
        }

        off(e, n) {
            const r = this.handlerMap.get(e) || new Set;
            r.delete(n), this.handlerMap.set(e, r)
        }

        emit(e, n) {
            const r = this.handlerMap.get(e);
            if (r) for (const s of r) s(n)
        }

        offAll() {
            this.handlerMap = new Map
        }
    }

    const zr = ce("storage");

    class _r extends fe {
        cached = {};
        storeArea;

        constructor(e) {
            super(), this.storeArea = e.storeArea ?? chrome.storage.sync, chrome.storage.onChanged.addListener(this.onChange), ee && typeof globalThis < "u" && (globalThis.__store = this), this.R(() => chrome.storage.onChanged.removeListener(this.onChange))
        }

        onChange = async () => {
            await this.get(), this.emit("changed", void 0)
        };

        async get() {
            const e = await new Promise((n, r) => {
                this.storeArea.get(n)
            });
            return zr(e), this.cached = e, e
        }

        getCached() {
            return this.cached
        }

        async patch(e) {
            const n = Object.keys(e).filter(r => e[r] == null);
            await new Promise((r, s) => {
                this.storeArea.set(e, r)
            }), n.length && await new Promise((r, s) => {
                this.storeArea.remove(n, r)
            }), await this.get()
        }

        async DEBUG_reset() {
            await new Promise((e, n) => {
                this.storeArea.clear(e)
            }), await this.get()
        }
    }

    class Ur extends fe {
        cached = {};

        constructor(e) {
            super()
        }

        async get() {
            return this.cached
        }

        getCached() {
            return this.cached
        }

        async patch(e) {
            const n = Object.keys(e).filter(r => e[r] == null);
            if (Object.assign(this.cached, e), n.length) for (const r of n) delete this.cached[r]
        }

        async DEBUG_reset() {
            this.cached = {}
        }
    }

    const Wr = jt ? new Ur({}) : new _r({}), Vr = () => new Promise(t => {
            if (document.readyState === "complete") t(); else {
                const e = () => {
                    document.readyState === "complete" && (t(), document.removeEventListener("readystatechange", e))
                };
                document.addEventListener("readystatechange", e)
            }
        }), Ii = "", bt = "smarttoc-base", Et = t => Object.keys(t).filter(e => t[e]).join(" "), Fi = "",
        Jr = (t, e) => t.path === e.path, Ln = () => ({
            view({attrs: {nodes: t, controller: e}}) {
                return t?.length ? t.filter(n => e.shouldShow(n)).map((n, r) => C(Kr, {
                    key: n.value.heading?.index ?? "id-" + r,
                    node: n,
                    controller: e
                })) : void 0
            }
        }), Gr = ({search: t, text: e}) => {
            let n;
            const r = t.toLowerCase(), s = e.toLowerCase();
            let l = 0;
            const a = [];
            for (; ;) {
                const c = s.indexOf(r, l);
                if (c === -1) break;
                const u = c + r.length;
                a.push({type: "other", text: e.substring(l, c)}), a.push({type: "match", text: e.substring(c, u)}), l = u
            }
            return a.push({
                type: "other",
                text: e.substring(l)
            }), n = a.filter(c => c.text).map(c => C("span.part", {class: c.type === "match" ? "match" : ""}, c.text)), n
        }, Kr = () => {
            let t = !0;
            return {
                view({attrs: {node: e, controller: n}}) {
                    const r = e.value, s = n.isExpanded(e), {search: l, isSearchActive: a} = n, c = r.heading, u = r.rect,
                        f = c?.text;
                    s != null && (t = s), ee && c && u && `${c.index}${Math.round(u.top)}`;
                    const {match: d} = e.value, m = l && f && e.value.match ? Gr({text: f, search: l}) : c?.text,
                        g = a && n.isSearchFocus(e), E = n.showExpandFeature(e), b = n.expandSetting;
                    return [c && C("a.heading", {
                        "data-index": c.index,
                        "data-level": r.level,
                        className: Et({
                            "is-active": r.active || r.containsActive,
                            "is-current": r.active,
                            "is-not-search-result": a && !d,
                            "is-search-result": a && d,
                            "is-search-focus": g,
                            "can-expand": E,
                            breadcrumb: n.shouldUseBreadcrumb(),
                            [`theme-${n.theme ?? "light"}`]: !0
                        }),
                        href: c.anchor,
                        title: c.text
                    }, [C("span.heading-text", [m]), b.type !== "auto" && E && C(".icon.icon-expand", {
                        class: Et({"is-expanded": t}),
                        onclick: w => {
                            t ? n.fold(e) : n.expand(e), w.stopPropagation(), w.preventDefault()
                        }
                    })]), c && (r.active || r.containsActive) && C(".heading-text-position-holder", {
                        "data-index": c.index,
                        "data-search-focus": g ? "1" : "0"
                    }), t && C(Ln, {nodes: e.children, controller: n})]
                }
            }
        };

    class Yr {
        record = new Set;

        reset() {
            this.record = new Set
        }

        expand(e) {
            this.record.add(e)
        }

        fold(e) {
            this.record.delete(e)
        }

        getMaxExpandedLevel() {
            const e = [...this.record.keys()].map(n => n.split(".").filter(Boolean).length + 1);
            return Math.max(1, ...e)
        }

        isExpanded(e) {
            return this.record.has(e)
        }

        toJSON() {
            return Array.from(this.record)
        }

        fromJSON(e) {
            this.record = new Set(e)
        }
    }

    const Xr = t => {
        if (!t.length) return;
        const [e, ...n] = t;
        let r = e.parentElement;
        if (!!r) {
            for (const s of n) {
                if (!document.documentElement.contains(s)) {
                    console.warn("[smarttoc] element not in document", s);
                    return
                }
                for (; !r.contains(s);) if (r = r.parentElement, !r) return
            }
            return r ?? void 0
        }
    };

    class Qr extends xt {
        $extender;
        options = {};

        constructor(e) {
            super(), Le(this, "extender"), this.setOptions(e, !0, !0), this.R(() => this.disposeExtender())
        }

        setOptions(e, n = !1, r = !1) {
            const s = n ? e : {...this.options, ...e};
            this.options = s, T.withEventMuted(() => {
                this.updateExtender()
            })()
        }

        disposeExtender = () => {
            this.$extender?.remove(), this.$extender = void 0
        };

        updateExtender() {
            this.options.content ? this.$extender && this.options.content.article.contains(this.$extender) || this.disposeExtender() : this.disposeExtender();
            const {content: e, measurements: n} = this.options;
            if (!(e && n)) return;
            if (!this.$extender) {
                this.$extender = Xn("div", {id: "smarttoc-extender"});
                const E = Xr(e.headings.map(b => b.dom).slice(0, 10)) || e.scroller;
                T.append(E, this.$extender, !0)
            }
            const {scroller: r} = e, {scrollerRect: s, headingRects: l} = n,
                a = l.slice().sort((E, b) => b.bottom - E.bottom)[0];
            if (a == null) {
                console.error("[smarttoc] failed to update extender: invalid headingRects");
                return
            }
            const c = s.height, u = a.height, f = s.bottom + r.scrollHeight - s.height - a.bottom,
                d = c - (this.options.spaceFromTop ?? 0) - u - f, m = T.fromPx(this.$extender.style.height),
                g = Math.max(0, m + d);
            this.$extender.style.height = String(g) + "px"
        }
    }

    const Hn = (t, e, n, r) => {
        const s = (e.left + e.right) / 2, l = t.x, a = t.x + (t.width ?? n), u = (l + a) / 2 > s ? "right" : "left",
            f = u === "right" ? l - e.right : a - e.left, d = t.y - r;
        return {placement: u, dx: f, dy: d}
    }, Zr = (t, e, n, r, s) => {
        const l = t.placement === "right" ? e.right + t.dx : e.left + t.dx - (s?.width ?? n), a = r + t.dy;
        return {x: l, y: a, width: s?.width, height: s?.height}
    }, Mn = (t, e, n) => {
        const [r, s] = n;
        let {x: l, y: a, width: c, height: u} = t;
        const {innerWidth: f, innerHeight: d} = window;
        return l = re(r, l, f - (c ?? e.width) - r), a = re(s, a, d - (u ?? e.height) - s), {
            x: l,
            y: a,
            width: c,
            height: u
        }
    }, On = (t, e) => {
        let {width: n, height: r, x: s, y: l} = t;
        n != null ? (n = Math.round(n), e.style.width = n + "px", e.style.minWidth = n + "px", e.style.maxWidth = n + "px") : (e.style.width = "", e.style.minWidth = "", e.style.maxWidth = ""), r != null ? (r = Math.round(r), e.style.height = r + "px", e.style.minHeight = r + "px", e.style.maxHeight = r + "px") : (e.style.height = "", e.style.minHeight = "", e.style.maxHeight = ""), s = Math.round(s), l = Math.round(l), e.style.transform = `translate(${s}px, ${l}px)`
    }, Nn = (() => ({
        top: 0,
        left: (window.innerWidth - 800) / 2,
        right: (window.innerWidth - 800) / 2 + 800,
        bottom: 2e3,
        width: 800,
        height: 2e3
    }))();

    class ei extends fe {
        panel;
        panelRect;
        article;
        articleRect;
        gapTop = window.innerHeight * .1;
        gapToViewport = [0, 0];
        absPos;
        relPos = {placement: "right", dx: 20, dy: 0};

        constructor(e) {
            super(), this.setSpaceFromTop(e.spaceFromTop), this.R(T.listen(window, "resize", () => this.adjustPosition())), Le(this, "positioner"), this.R(() => this.stopListenPanelResize())
        }

        toJSON() {
            const {relPos: e, absPos: n} = this;
            return {relPos: {...e, dx: e.placement === "left" ? Math.min(0, e.dx) : Math.max(0, e.dx)}, absPos: n}
        }

        fromJSON(e) {
            if (!e) return;
            const {absPos: n, relPos: r} = e;
            n && this.setAbsPos(n), r && this.setRelPos(r)
        }

        isPositioned() {
            return Boolean(this.panelRect && this.relPos && this.absPos)
        }

        setAbsPos(e, n = !1) {
            !this.panel || ((!this.panelRect || n) && (this.panelRect = this.panel.getBoundingClientRect()), (!this.articleRect || n) && (this.articleRect = this.article?.getBoundingClientRect() ?? Nn), this.absPos = Mn(e, this.panelRect, this.gapToViewport), this.relPos = Hn(this.absPos, this.articleRect, this.panelRect.width, this.gapTop), On(this.absPos, this.panel))
        }

        setPanel(e) {
            e !== this.panel && (this.stopListenPanelResize(), this.panel = e, this.adjustPosition(), this.stopListenPanelResize = T.onResize(e, () => this.onPanelResize()))
        }

        setSpaceFromTop(e) {
        }

        setArticle(e) {
            this.article !== e && (this.article = e, this.adjustPosition())
        }

        setRelPos(e, n = !1) {
            this.relPos = e, this.panel && ((!this.panelRect || n) && (this.panelRect = this.panel.getBoundingClientRect()), (!this.articleRect || n) && (this.articleRect = this.article?.getBoundingClientRect() ?? Nn), this.absPos = Mn(Zr(e, this.articleRect, this.panelRect.width, this.gapTop, this.absPos), this.panelRect, this.gapToViewport), this.relPos = Hn(this.absPos, this.articleRect, this.panelRect.width, this.gapTop), On(this.absPos, this.panel))
        }

        adjustPosition() {
            this.setRelPos(this.relPos, !0)
        }

        onPanelResize() {
            this.adjustPosition()
        }

        stopListenPanelResize = () => {
        }
    }

    const _e = "smarttocOriginalStyle";

    class ti extends fe {
        enabled = !1;
        content;

        constructor(e) {
            super(), Le(this, "readable"), this.R(() => {
                this.tryRestoreOriginalStyle()
            })
        }

        setEnabled(e) {
            this.enabled = e, this.apply()
        }

        update(e) {
            this.content?.article !== e?.article && (this.tryRestoreOriginalStyle(), this.content = e, this.apply())
        }

        tryRestoreOriginalStyle() {
            if (this.content) {
                const {article: e} = this.content, n = e.dataset[_e];
                n != null && (T.withEventMuted(() => {
                    T.setStyle(e, n), delete e.dataset[_e]
                })(), this.emit("articleStyleChanged", void 0))
            }
        }

        apply() {
            if (!this.enabled) {
                this.tryRestoreOriginalStyle();
                return
            }
            if (!this.content) return;
            const {article: e} = this.content;
            e.dataset[_e] == null && T.withEventMuted(() => {
                e.dataset[_e] = e.style.cssText || ""
            })();
            const n = window.getComputedStyle(e), r = e.getBoundingClientRect();
            let s = re(12, T.fromPx(n.fontSize), 16) * 66;
            n.boxSizing === "border-box" && (s += T.fromPx(n.paddingLeft) + T.fromPx(n.paddingRight));
            const l = {};
            s < r.width && (l.maxWidth = T.toPx(s), T.fromPx(n.marginLeft) || T.fromPx(n.marginRight) || (l.marginLeft = "auto", l.marginRight = "auto")), T.setStyle(e, l), this.emit("articleStyleChanged", void 0)
        }
    }

    const kn = t => {
            const e = t.replace(/^#/i, "");
            if (!/^\w{6,8}$/.test(e)) return;
            const [n, r, s, l] = [e.slice(0, 2), e.slice(2, 4), e.slice(4, 6), e.slice(6, 8)].map(a => {
                if (a == null) return a;
                if (a !== "") return Number.parseInt(a, 16)
            });
            if ([n, r, s].every(a => typeof a == "number" && a === a)) return {r: n, g: r, b: s, a: l}
        }, ni = t => {
            if (!/^rgba?/i.test(t)) return;
            const e = t.replace(/^rgba?/i, ""), [n, r, s, l] = e.slice(1, -1).split(/, ?/).map(a => Number(a));
            return {r: n, g: r, b: s, a: l}
        }, In = t => ("00" + t).slice(-2), ri = t => /^#/i.test(t) ? kn(t) : /^rgba?/i.test(t) ? ni(t) : kn("#" + t),
        ii = (t, {ignoreAlpha: e = !0} = {}) => {
            if (typeof t == "string") {
                const u = Ce.parse(t);
                return u ? Ce.toHex(u) : ""
            }
            const {r: n, g: r, b: s, a: l} = t,
                a = [n, r, s].map(u => In(Math.round(Number(u)).toString(16))).join("").toUpperCase(),
                c = e || l == null || l === 255 ? "" : In(Math.round(Number(l) * 255).toString(16)).toUpperCase();
            return "#" + a + c
        };

    class Ce {
        static parse = ri;
        static toHex = ii
    }

    const Fn = ({r: t, g: e, b: n, a: r}) => Math.sqrt(.299 * (t * t) + .587 * (e * e) + .114 * (n * n)), Ct = t => {
        if (!t) return Ce.parse("#000000");
        const e = Ce.parse(window.getComputedStyle(t).color);
        return !e || e.a === 0 ? Ct(t.parentElement) : e
    }, Tt = t => {
        if (!t) return Ce.parse("#ffffff");
        const e = Ce.parse(window.getComputedStyle(t).backgroundColor);
        return !e || e.a === 0 ? Tt(t.parentElement) : e
    };

    class si {
        static detectPageTheme(e) {
            let n = e, r = e.getBoundingClientRect();
            for (const u of T.walkTree(e)) {
                const f = u, d = f.getBoundingClientRect();
                d.width > r.width && d.height > r.height && (r = d, n = f)
            }
            const s = Ct(n), l = Tt(n), a = Fn(s), c = Fn(l);
            return a <= c ? "light" : "dark"
        }

        static detectSystemTheme() {
            const e = window.matchMedia("(prefers-color-scheme: dark)").matches,
                n = window.matchMedia("(prefers-color-scheme: light)").matches;
            if (e) return "dark";
            if (n) return "light"
        }
    }

    const $n = "smarttoc-transition", oi = t => {
        const e = document.querySelectorAll(`#${bt}`);
        e.forEach(n => {
            n.classList.add($n)
        }), t(), setTimeout(function () {
            e.forEach(n => {
                n.classList.remove($n)
            })
        }, 300)
    };

    class ai {
        static withCssTransition = oi
    }

    const Dn = (t, e) => {
        let n, r;
        const s = (...l) => {
            n && (clearTimeout(n), n = void 0, r = void 0), r = l, n = window.setTimeout(() => {
                t.apply(e.self || null, r), n = void 0, r = void 0
            }, e.delay)
        };
        return s.consume = () => {
            n && (clearTimeout(n), t.apply(e.self || null, r), n = void 0, r = void 0)
        }, s.drop = () => {
            n && (clearTimeout(n), n = void 0, r = void 0)
        }, s
    }, ci = ({article: t, headingSelectors: e, maxHeadingLevels: n}) => {
        if (t = t || xe.extractArticle({headingSelectors: e}), !t) return;
        const r = T.get(t);
        if (!(r && T.isElemVisible(r))) return;
        const s = xe.extractHeadings({articleDom: r, headingSelectors: e, maxHeadingLevels: n}), l = s.headings;
        if (e = s.headingSelectors, !l.length || !l.some(d => T.isElemVisible(d.dom))) return;
        const a = et(r);
        if (!a) return;
        const c = document.documentElement === a || document.documentElement.contains(a), u = a === t || a.contains(r),
            f = l.length && r.contains(l[0].dom) && r.contains(l[l.length - 1].dom);
        if (c && u && f) {
            const d = Math.max(...l.map(m => m.level)) + 1;
            return {article: r, headings: l, maxLevel: d, headingSelectors: e, scroller: a}
        } else {
            console.warn("[smarttoc] invalid content:", {
                articleElem: r,
                scroller: a,
                headings: l,
                isScrollerValid: c,
                isArticleValid: u,
                isHeadingsValid: f
            });
            return
        }
    }, li = (t, e, n) => {
        if (!t || !e) return -1;
        const {scroller: r} = t, s = e, l = n + s.scrollerRect.top, a = He(r), c = s.headingRects.length;
        if (c <= 1) return 0;
        let u = 0, f = c, d = Math.floor((u + f) / 2);
        for (; ;) {
            if (u >= f - 1) return s.headingSortedByY[u][1];
            const [m] = s.headingSortedByY[d];
            m - a >= l + 1 ? f = d : u = d, d = Math.floor((u + f) / 2)
        }
    }, ui = t => {
        if (!T.isElemVisible(t.article) || t.headings.every(c => !T.isElemVisible(c.dom))) return;
        const e = _t(t.scroller), n = He(t.scroller),
            r = ({top: c, left: u, right: f, bottom: d, height: m, width: g}) => ({
                top: c + n,
                bottom: d + n,
                left: u,
                right: f,
                height: m,
                width: g
            }), s = r(t.article.getBoundingClientRect()), l = t.headings.map((c, u) => {
                const f = T.getVisibleTextRect(c.dom), d = c.dom.getBoundingClientRect(),
                    m = {left: d.left, right: d.right, top: f ? f.top : d.top, bottom: f ? f.bottom : d.bottom};
                return {...m, height: m.bottom - m.top, width: m.right - m.left}
            }).map(r), a = l.map((c, u) => [c.top, u]).sort((c, u) => c[0] - u[0]);
        return {articleRect: s, scrollerRect: e, headingRects: l, headingSortedByY: a}
    };

    class hi extends fe {
        content;
        hadContent = !1;
        measurements;
        activeHeading;
        options = {};
        logger = ce("watcher");
        updateContentDebounced;
        updateMeasurementsDebounced;

        consumePendingTasks() {
            this.updateContentDebounced.consume(), this.updateMeasurementsDebounced.consume()
        }

        dropPendingTasks() {
            this.updateContentDebounced.drop(), this.updateMeasurementsDebounced.drop()
        }

        constructor(e) {
            super(), Le(this, "watcher"), this.setOptions(e, !0, !0), this.R(() => {
                this.unListen(), this.unListenUrlChange()
            }), this.updateContentDebounced = Dn(this.updateContent, {delay: this.options.detectDelay ?? 300}), this.updateMeasurementsDebounced = Dn(this.updateMeasurements, {delay: this.options.detectDelay ?? 300})
        }

        getHeadingRect(e) {
            if (!this.measurements || !this.content) return;
            const n = {...this.measurements.headingRects[e]}, r = He(this.content.scroller);
            return n.top -= r, n.bottom -= r, n
        }

        setOptions(e, n = !1, r = !1) {
            const s = this.options, l = n ? e : {...this.options, ...e};
            this.options = l;
            const a = c => !se(l[c], s[c]);
            r || a("article") || a("headingSelectors") ? this.updateContent() : a("spaceFromTop") && this.updateActiveHeading()
        }

        async scrollToHeading(e, n) {
            const r = async () => {
                if (!this.content) throw new Error("content not available");
                const {scroller: a, headings: c} = this.content, u = this.getHeadingRect(e);
                if (!u) throw new Error("headings not available");
                await er({
                    targetTop: u.top,
                    scroller: a,
                    spaceFromTop: this.options.spaceFromTop ?? 0,
                    maxDuration: n
                }), this.dropPendingTasks(), this.updateMeasurements(), this.updateActiveHeading()
            };
            let s = this.activeHeading, l = 0;
            for (; ;) {
                if (this.logger(`scrollToHeading ${e} pass ${l} start`), await r(), this.logger(`scrollToHeading ${e} pass ${l} end`), this.activeHeading === e) {
                    this.logger(`scrollToHeading ${e} reached after ${l} passes`);
                    break
                }
                if (this.activeHeading === s) {
                    this.logger(`scrollToHeading ${e} bailout: activeHeading not updated: ${this.activeHeading}`);
                    break
                }
                s = this.activeHeading, await he(0), l++
            }
            typeof this.activeHeading == "number" && this.emit("scrolledToHeading", this.activeHeading)
        }

        getNextHeadingIndex() {
            return !this.content || this.activeHeading == null ? void 0 : (this.activeHeading + 1) % this.content.headings.length
        }

        getPreviousHeadingIndex() {
            return !this.content || this.activeHeading == null ? void 0 : (this.activeHeading - 1 + this.content.headings.length) % this.content.headings.length
        }

        updateActiveHeading = () => {
            const e = this.content && this.measurements && li(this.content, this.measurements, this.options.spaceFromTop ?? 0);
            e !== this.activeHeading && (this.activeHeading = e, this.emit("activeHeadingChanged", this.activeHeading))
        };
        unListen = Ae;

        listenOnChange() {
            this.unListen();
            const e = new xt;
            if (this.content) {
                const n = () => this.content && T.isElemVisible(this.content.article);
                e.R(T.onResize(this.content.article, s => {
                    this.logger("[event] article resize"), this.updateContentDebounced()
                })), e.R(T.onRemoveByPoll(this.content.article, () => {
                    this.logger("[event] article removed"), this.updateContentDebounced()
                }, {delay: 1e3}));
                const r = this.content.scroller === document.documentElement || this.content.scroller === document.body ? window : this.content.scroller;
                e.R(T.listen(r, "scroll", () => {
                    n() ? this.updateActiveHeading() : this.updateContentDebounced()
                }))
            }
            this.unListen = () => {
                e.dispose(), this.unListen = Ae
            }
        }

        retryCount = 0;
        updateContent = () => {
            const e = this.content;
            this.content = ci({
                article: this.options.article ?? e?.article,
                headingSelectors: this.options.headingSelectors,
                maxHeadingLevels: this.options.maxHeadingLevels
            }), this.content && (this.hadContent = !0), this.content?.article !== e?.article && this.emit("articleChanged", this.content?.article), se(this.content?.headings, e?.headings) || this.emit("headingsChanged", this.content?.headings), this.updateMeasurements(), this.unListen(), this.unListenUrlChange(), this.content ? this.listenOnChange() : this.listenOnUrlChange(), !this.content && this.hadContent ? setTimeout(() => {
                !this.content && this.retryCount <= 3 && (this.logger(`retrying ${this.retryCount}`), this.retryCount++, this.updateContent())
            }, 1e3) : this.retryCount = 0
        };
        unListenUrlChange = Ae;

        listenOnUrlChange() {
            this.unListenUrlChange();
            const e = location.href, n = setInterval(() => {
                location.href !== e && (this.unListenUrlChange(), this.updateContent())
            }, 1e3);
            this.unListenUrlChange = () => {
                clearInterval(n), this.unListenUrlChange = Ae
            }
        }

        updateMeasurements = (e = !1) => {
            const n = this.measurements;
            if (this.measurements = this.content && ui(this.content), this.content && !this.measurements) {
                this.updateContent();
                return
            }
            const r = se(this.measurements?.articleRect, n?.articleRect, {numberTolerance: 1}) && se(this.measurements?.scrollerRect, n?.scrollerRect, {numberTolerance: 1}) && se(this.measurements?.headingRects.length, n?.headingRects.length);
            !e && !r && (this.emit("measurementsChanged", this.measurements), this.updateActiveHeading())
        }
    }

    const fi = async t => {
            const n = "smarttoc-heading", r = "smarttoc-heading--is-active";
            t.classList.add(n), await he(0), t.classList.add(r), await he(300), await he(100), t.classList.remove(r), await he(300), t.classList.remove(n)
        }, di = (t, e) => t.toLowerCase().includes(e),
        pi = ({headings: t, activeHeading: e, measurements: n, search: r}) => {
            const s = De({level: -1});
            if (t.forEach((a, c) => {
                Wt({
                    tree: s,
                    value: {heading: a, level: a.level, rect: n.headingRects[c]},
                    level: a.level + 1,
                    defaultValue: u => ({level: u.value.level + 1})
                })
            }), e != null) for (const a of tt(s)) {
                const c = a.value.heading;
                if (c && c.index === e) {
                    a.value.active = !0;
                    for (const u of Vt(a)) u.value.containsActive = !0;
                    break
                }
            }
            const l = [];
            if (r != null) {
                const a = r.toLowerCase();
                for (const c of tt(s)) {
                    const u = c.value.heading;
                    if (!u) continue;
                    if (di(u.text, a)) {
                        c.value.match = !0, l.push(c);
                        for (const d of Vt(c)) d.value.containsMatch = (d.value.containsMatch || 0) + 1
                    }
                }
            }
            return {tree: s, found: l}
        };
    let oe = 0, qn = !1;
    const de = 10;

    class Ue extends fe {
        static AUTO_HIDE_THRESHOLD = 50;
        features;
        $panel;
        watcher;
        extender;
        expandStore;
        positioner;
        isScrollingArticle = !1;
        isGlancing = !1;
        computedContent;
        theme;
        expandSetting = {type: "auto"};
        search = "";
        isSearchActive = !1;
        searchFocusIndex = 0;
        background;
        shortcuts;
        readable;

        constructor(e) {
            super(), this.watcher = e.watcher ?? new hi({
                spaceFromTop: de + oe,
                maxHeadingLevels: e.features.maxLevel()
            }), this.extender = new Qr({spaceFromTop: de + oe}), this.expandStore = new Yr, this.positioner = new ei({spaceFromTop: de + oe + (this.watcher.measurements?.scrollerRect.top ?? 0)}), this.readable = new ti({}), this.readable.on("articleStyleChanged", () => this.watcher.updateMeasurements()), this.watcher.on("activeHeadingChanged", () => {
                this.invalidateContent(), this.emit("activeHeadingChanged", void 0)
            }), this.watcher.on("articleChanged", this.update), this.watcher.on("headingsChanged", this.update), this.watcher.on("measurementsChanged", this.update), this.watcher.on("scrolledToHeading", this.updateHeaderHeight), this.features = e.features, this.background = e.background, this.shortcuts = e.shortcuts, this.update(), this.updateHeaderHeight(), this.R(() => {
                this.extender.dispose(), this.watcher.dispose(), this.readable.dispose(), this.positioner.dispose(), this.extender.dispose()
            })
        }

        triggerRerender() {
            this.emit("rerender", void 0)
        }

        mount(e) {
            this.$panel = e
        }

        exportConfig() {
            return {
                version: 1, ...this.features.customExpand() && {
                    expandStore: this.expandStore.toJSON(),
                    expandSetting: this.expandSetting
                }, ...this.features.search() && {
                    search: this.search,
                    isSearchActive: this.isSearchActive,
                    searchFocusIndex: this.searchFocusIndex
                }, position: this.positioner.toJSON(), ...this.features.readable() && {readable: this.readable.enabled}
            }
        }

        saveConfig(e) {
            const n = this.exportConfig();
            try {
                window.localStorage.setItem("smarttoc-config", JSON.stringify(n))
            } catch (r) {
                console.error(r)
            }
        }

        loadConfig(e) {
            try {
                const n = window.localStorage.getItem("smarttoc-config");
                if (!n) return;
                const r = JSON.parse(n);
                if (r.version === 1) {
                    const {
                        version: s,
                        expandStore: l,
                        expandSetting: a,
                        search: c,
                        isSearchActive: u,
                        searchFocusIndex: f,
                        position: d,
                        readable: m
                    } = r;
                    this.features.customExpand() && (l != null && this.expandStore.fromJSON(l), a != null && (this.expandSetting = a)), this.features.search() && (c != null && (this.search = c), u != null && (this.isSearchActive = u), f != null && (this.searchFocusIndex = f)), this.positioner.fromJSON(d), this.features.readable() && m != null && this.readable.setEnabled(m), this.invalidateContent()
                }
            } catch (n) {
                console.error(n)
            }
        }

        update = () => {
            const {content: e, measurements: n} = this.watcher;
            if (this.extender.setOptions({
                content: e,
                measurements: n,
                spaceFromTop: de + oe
            }), this.readable.update(e), this.features.darkMode() && !this.theme) {
                const r = this.watcher.content?.headings[0].dom;
                if (r) {
                    const s = si.detectPageTheme(r);
                    this.updateTheme(s)
                }
            }
            this.positioner.setArticle(this.watcher.content?.article), e || this.expandStore.reset(), this.invalidateContent()
        };
        updateHeaderHeight = e => {
            if (qn || !this.watcher.content) return;
            const n = xe.detectHeaderHeight({watcher: this.watcher, exclude: this.$panel}) ?? 0;
            this.setHeaderHeight(n), n && e != null && this.watcher.scrollToHeading(e)
        };

        setHeaderHeight(e) {
            e !== oe && (oe = e, qn = !0, this.extender.setOptions({spaceFromTop: de + oe}), this.watcher.setOptions({spaceFromTop: de + oe}), this.positioner.setSpaceFromTop(de + oe + (this.watcher.measurements?.scrollerRect.top ?? 0)))
        }

        invalidateContent() {
            this.computedContent = void 0, this.triggerRerender()
        }

        getComputedContent() {
            const {content: e, activeHeading: n, measurements: r} = this.watcher;
            return this.computedContent || (this.computedContent = e && r && pi({
                headings: e.headings,
                activeHeading: n,
                measurements: r,
                search: this.isSearchActive ? this.search : void 0
            })), this.computedContent
        }

        setSearch(e) {
            this.search = e, this.setSearchFocusIndex(0), this.invalidateContent()
        }

        toggleSearch(e) {
            !this.features.search() || (this.isSearchActive = e ?? !this.isSearchActive, this.setSearchFocusIndex(0), this.invalidateContent())
        }

        setSearchFocusIndex(e) {
            this.searchFocusIndex = e, this.triggerRerender(), this.emit("searchFocusChanged", void 0)
        }

        isSearchFocus(e) {
            const s = (this.computedContent?.found ?? [])[this.searchFocusIndex];
            return s && Jr(e, s)
        }

        shouldExpand(e) {
            const {features: n, watcher: r, isSearchActive: s, expandSetting: l, expandStore: a} = this,
                c = n.maxLevel(), u = r.content;
            if (e.value.level + 1 >= c) return !1;
            if (this.isScrollingArticle || this.isGlancing) return;
            if (!e.children?.length) return !1;
            if (s) return !0;
            const f = !0;
            switch (l.type) {
                case"fixed":
                    return e.value.level + 1 < l.level;
                case"auto":
                    return !u?.headings.length || u.headings.length <= Ue.AUTO_HIDE_THRESHOLD ? f : Boolean(e.value.level === -1 || e.value.active || e.value.containsActive);
                case"custom":
                    return a.isExpanded(e.path);
                default:
                    return Vn(l)
            }
        }

        showExpandFeature(e) {
            return this.features.customExpand() ? Boolean(e.children?.length) : !1
        }

        canExpandAuto() {
            return this.features.customExpand() ? !this.isSearchActive : !1
        }

        canExpandMore() {
            if (!this.features.customExpand()) return !1;
            const {isSearchActive: e, expandSetting: n} = this, r = this.watcher.content;
            return !(!r || e || n.type === "auto" && !this.hasAutoFoldedHeadings() || r.maxLevel <= 1 || n.type === "fixed" && n.level === r.maxLevel)
        }

        canExpandLess() {
            if (!this.features.customExpand()) return !1;
            const {isSearchActive: e, expandSetting: n} = this, r = this.watcher.content;
            return !(!r || e || r.maxLevel <= 1 || n.type === "fixed" && n.level === 1)
        }

        expandMore() {
            if (!this.canExpandMore()) return;
            const {isSearchActive: e, expandSetting: n} = this, r = this.watcher.content,
                s = this.expandStore.getMaxExpandedLevel(), l = n.type === "fixed" ? n.level : void 0,
                a = l == null ? s + 1 : l + 1;
            this.setExpandSetting({type: "fixed", level: Math.min(r.maxLevel, a)})
        }

        expandLess() {
            if (!this.canExpandLess()) return;
            const {expandSetting: e} = this, n = this.expandStore.getMaxExpandedLevel(),
                r = e.type === "fixed" ? e.level : void 0, s = r == null ? n - 1 : r - 1;
            this.setExpandSetting({type: "fixed", level: Math.max(1, s)})
        }

        expandAuto() {
            !this.canExpandAuto() || this.setExpandSetting({type: "auto"})
        }

        expand(e) {
            !this.features.customExpand() || (this.expandSetting.type !== "custom" && this.setExpandSetting({type: "custom"}), this.expandStore.expand(e.path), this.triggerRerender())
        }

        fold(e) {
            !this.features.customExpand() || (this.expandSetting.type !== "custom" && this.setExpandSetting({type: "custom"}), this.expandStore.fold(e.path), this.triggerRerender())
        }

        shouldShow(e) {
            return this.isSearchActive ? e.value.match || Boolean(e.value.containsMatch) : !0
        }

        setExpandSetting(e) {
            this.expandSetting = e, this.triggerRerender()
        }

        isExpanded(e) {
            const n = this.shouldExpand(e);
            return n != null && n !== this.expandStore.isExpanded(e.path) && (n ? this.expandStore.expand(e.path) : this.expandStore.fold(e.path)), n
        }

        hasAutoFoldedHeadings() {
            const e = this.watcher.content;
            return e ? e.headings.length > Ue.AUTO_HIDE_THRESHOLD : !1
        }

        updateTheme(e) {
            !this.features.darkMode() || this.theme !== e && ai.withCssTransition(() => {
                this.theme = e, window.smarttoc || (window.smarttoc = {}), window.smarttoc.theme = e, this.triggerRerender()
            })
        }

        toggleTheme() {
            if (!this.features.darkMode()) return;
            this.theme === "dark" ? this.updateTheme("light") : this.updateTheme("dark")
        }

        async jumpToHeading({headingIndex: e, highlight: n = !0, animation: r = !0}) {
            const {watcher: s} = this, l = s.content?.headings[e];
            l && (this.isScrollingArticle = !0, this.triggerRerender(), await s.scrollToHeading(e, r ? void 0 : 0), this.isScrollingArticle = !1, this.triggerRerender(), n && fi(l.dom))
        }

        async goToNextHeading() {
            const e = this.watcher.getNextHeadingIndex();
            e != null && await this.jumpToHeading({headingIndex: e, highlight: !0, animation: !1})
        }

        async goToPreviousHeading() {
            const e = this.watcher.getPreviousHeadingIndex();
            e != null && await this.jumpToHeading({headingIndex: e, highlight: !0, animation: !1})
        }

        toggleReadable() {
            !this.features.readable() || this.readable.setEnabled(!this.readable.enabled)
        }

        shouldUseBreadcrumb() {
            return !this.isSearchActive && this.features.breadcrumb()
        }
    }

    const $i = "", Di = "", mi = () => {
        let t, e, n;
        const r = a => {
            if (!n) {
                console.warn("move when not dragging");
                return
            }
            const {clientX: c, clientY: u} = a, {horizontal: f, vertical: d, start: m} = n, g = c - m.clientX,
                E = u - m.clientY;
            if (!e) return;
            const {onChange: b} = e.attrs, {
                    minHeight: w = 0,
                    maxHeight: v = 1 / 0,
                    minWidth: P = 0,
                    maxWidth: M = 1 / 0
                } = e.attrs, H = d.start, X = re(H + w, d.end + E, Math.min(window.innerHeight, H + v)) - H, $ = f.start,
                W = re($ + P, f.end + g, Math.min(window.innerWidth, $ + M)) - $;
            b({left: $, top: H, width: W, height: X}), a.preventDefault()
        }, s = a => {
            document.removeEventListener("mousemove", r), document.removeEventListener("mouseup", s), document.documentElement.classList.remove("smarttoc--is-resizing"), n = void 0, a.preventDefault()
        }, l = a => {
            if (n) return console.warn("is already resizing");
            if (!t) return console.warn("target not available");
            const c = t.getBoundingClientRect(), {clientX: u, clientY: f} = a;
            n = {
                horizontal: {start: c.left, end: c.right},
                vertical: {start: c.top, end: c.bottom},
                start: {clientX: u, clientY: f}
            }, document.documentElement.classList.add("smarttoc--is-resizing"), document.addEventListener("mousemove", r), document.addEventListener("mouseup", s), a.preventDefault()
        };
        return {
            oncreate(a) {
                e = a, t = a.dom.parentElement
            }, onbeforeupdate(a) {
                e = a
            }, view({attrs: a}) {
                return C(".resizer", {
                    ondblclick() {
                        if (!t) return console.warn("target not available");
                        const {left: c, top: u} = t.getBoundingClientRect();
                        a.onChange({left: c, top: u, width: void 0, height: void 0})
                    }, onmousedown: l
                })
            }
        }
    }, qi = "", gi = () => {
        let t, e;
        return {
            oncreate(n) {
                t = n.dom, e = t.querySelector("input")
            },
            onbeforeupdate(n, r) {
                const s = n.attrs.isActive && !r.attrs.isActive, l = !n.attrs.isActive && r.attrs.isActive;
                if (s) {
                    const a = t.querySelector(".search-input");
                    if (!a) return;
                    setTimeout(function () {
                        a.focus(), a.setSelectionRange(0, a.value.length)
                    }, 100)
                }
                l && e.blur()
            },
            view({
                     attrs: {
                         isActive: n,
                         search: r,
                         onChange: s,
                         onClose: l,
                         onFocusNext: a,
                         onFocusPrevious: c,
                         onJumpToFocus: u
                     }
                 }) {
                return [C(".searchbar", {class: Et({"is-active": n})}, [C(".icon.search-icon"), C("input.search-input", {
                    type: "search",
                    value: r,
                    placeholder: "Search",
                    disabled: !n,
                    oninput: f => {
                        s(f.target.value)
                    },
                    onkeydown(f) {
                        switch (f.key) {
                            case"Escape": {
                                l();
                                break
                            }
                            case"ArrowUp": {
                                c(), f.preventDefault();
                                break
                            }
                            case"p": {
                                f.ctrlKey && (c(), f.preventDefault());
                                break
                            }
                            case"ArrowDown": {
                                a(), f.preventDefault();
                                break
                            }
                            case"n": {
                                f.ctrlKey && (a(), f.preventDefault());
                                break
                            }
                            case"Enter": {
                                u(), f.preventDefault();
                                break
                            }
                        }
                    }
                }), Boolean(r) && C("button.icon.search-close", {
                    onclick: () => {
                        s(""), e.focus()
                    }
                })])]
            }
        }
    }, ji = "";
    let St = !1;
    document.addEventListener("mousedown", () => St = !0), document.addEventListener("mouseup", () => St = !1);
    let Te, Se;
    const yi = () => ({
        view() {
            const t = Te?.getBoundingClientRect();
            if (!t || !Se) return;
            const e = window.innerHeight - t.bottom > 60;
            return C(".smarttoc-tooltip", {
                role: "tooltip",
                id: bt,
                "data-theme": window.smarttoc?.theme ?? "light",
                style: {
                    ...e ? {
                        top: Math.round(t.bottom + 6) + "px",
                        transform: "translate(-50%, 0%)"
                    } : {top: Math.round(t.top - 6) + "px", transform: "translate(-50%, -100%)"},
                    left: Math.round(t.left + t.width / 2) + "px"
                }
            }, Se)
        }
    }), wi = (t, e = document.body) => {
        let n = document.getElementById(t);
        return n || (n = document.createElement("div"), n.id = t, e.append(n)), n
    }, pe = () => {
        let t, e, n, r = () => {
        };
        const s = () => {
            e || (e = wi("smarttoc-tooltip")), C.render(e, C(yi))
        }, l = () => {
            St || (Te = t, Se = n, s())
        }, a = () => {
            Te === t && (Te = void 0, Se = void 0), s()
        }, c = () => {
            if (!t) {
                console.warn("[smarttoc] cannot bind tooltip event for node");
                return
            }
            const u = t;
            u.addEventListener("pointerenter", l), u.addEventListener("pointerleave", a), u.addEventListener("focus", l), u.addEventListener("blur", a), r = () => {
                u.removeEventListener("pointerenter", l), u.removeEventListener("pointerleave", a), u.removeEventListener("focus", l), u.removeEventListener("blur", a)
            }
        };
        return {
            oncreate(u) {
                if (t = u.dom, !(t instanceof HTMLElement)) {
                    console.warn("[smarttoc] cannot display tooltip for node");
                    return
                }
                c()
            }, oninit(u) {
                n = u.attrs.title, Te === t && (Se = n)
            }, onupdate(u) {
                u.dom !== t && (r(), t = u.dom, c()), n = u.attrs.title, Te === t && (Se = n), s()
            }, onbeforeremove() {
                a(), r()
            }, view({attrs: u, children: f}) {
                return f
            }
        }
    }, Rt = t => {
        const e = document.createElement("textarea");
        e.style.position = "fixed", e.style.top = "0", e.style.opacity = "0", document.body.appendChild(e), e.value = t, e.select();
        const n = document.execCommand("copy");
        if (document.body.removeChild(e), !n) throw new Error("failed to copy")
    }, vi = t => {
        function e(n) {
            n.clipboardData.setData("text/html", t), n.preventDefault()
        }

        document.addEventListener("copy", e), document.execCommand("copy"), document.removeEventListener("copy", e)
    }, xi = t => t.replace(/\b\w/gi, e => e.toUpperCase()), Bi = "", bi = () => {
        let t, e, n, r;
        const s = document.createElement("div"), l = "smarttoc-dragmask";
        s.className = l;
        const a = f => {
            if (!e) return console.warn("target not ready");
            if (!t) return console.warn("handle not ready");
            if (r) return console.warn("already dragging?");
            const {clientX: d, clientY: m} = f;
            r = {
                startRect: e.getBoundingClientRect(),
                start: {clientX: d, clientY: m}
            }, document.addEventListener("mousemove", c), document.addEventListener("mouseup", u), t.style.cursor = "grabbing", f.preventDefault()
        }, c = f => {
            if (!r) return console.warn("not dragging");
            if (!n) return console.warn("no vnode");
            const {clientX: d, clientY: m} = f, {start: g, startRect: {left: E, top: b, width: w, height: v}} = r;
            let P = E + (d - g.clientX), M = b + (m - g.clientY);
            const {innerWidth: H, innerHeight: ie} = window;
            P = re(0, P, H - w), M = re(0, M, ie - v), n.attrs.onPositionChange(P, M), f.preventDefault()
        }, u = f => {
            document.removeEventListener("mousemove", c), document.removeEventListener("mouseup", u), r = void 0, f.preventDefault(), t && (t.style.cursor = "")
        };
        return {
            oncreate(f) {
                n = f, t = f.dom, e = f.attrs.target, t.addEventListener("mousedown", a)
            }, onbeforeupdate(f, d) {
                n = f, e = f.attrs.target
            }, onbeforeremove() {
                t?.removeEventListener("mousedown", a)
            }, view({attrs: f, children: d}) {
                return d
            }
        }
    }, jn = (t, e, n) => {
        const r = n && t.shortcuts[n];
        return C("", [e, r && C(".tool-shortcut", r)])
    }, Ei = () => ({
        view({attrs: {controller: t}}) {
            const {watcher: e} = t;
            if (e.content.maxLevel <= 1) return [];
            const {expandSetting: r} = t, s = jn.bind(null, t);
            return [r.type !== "auto" && C(pe, {title: s("Auto Expand", "expand:auto")}, C("button.icon.icon-auto", {
                type: "button",
                disabled: !t.canExpandAuto(),
                onclick: () => t.expandAuto()
            })), C(pe, {title: s("Collapse", "expand:less")}, [C("button.icon.icon-fold", {
                type: "button",
                disabled: !t.canExpandLess(),
                onclick: () => t.expandLess()
            })]), C(pe, {title: s("Expand", "expand:more")}, [C("button.icon.icon-expand", {
                type: "button",
                disabled: !t.canExpandMore(),
                onclick: () => t.expandMore()
            })])]
        }
    }), zi = "", Pt = () => ({
        view({attrs: t, children: e}) {
            if (t.enabled) return e;
            if (!!t.promoteProFeature) return C(".pro-feature", [C(".feature-hidden", e), C(pe, {
                title: C("", [C("p", `${t.name} (Pro feature)`), t.desc?.split(`
`).map(n => C("p", n))])
            }, [C(".feature-tip", {onclick: t.onClick})])])
        }
    }), Ci = () => ({
        view({attrs: {controller: t}}) {
            const e = t.theme ?? "light", n = () => {
                t.background.openOptionsPage()
            }, r = jn.bind(null, t), {content: s} = t.watcher, {features: l, watcher: a} = t;
            return C(".toolbar", {role: "toolbar"}, [C(bi, {
                target: t.$panel, onPositionChange(c, u) {
                    t.positioner.setAbsPos({
                        x: c,
                        y: u,
                        width: t.positioner.absPos?.width,
                        height: t.positioner.absPos?.height
                    })
                }
            }, [C(".drag-handle")]), s && [C(Pt, {
                enabled: l.customExpand(),
                name: "Custom Expand",
                promoteProFeature: l.shouldPromoteProFeature(),
                onClick: n
            }, [C(Ei, {controller: t})]), C(Pt, {
                enabled: l.search(),
                name: "Search",
                promoteProFeature: l.shouldPromoteProFeature(),
                onClick: n
            }, [C(pe, {title: r("Search", "search")}, [C("button.icon.icon-search", {
                type: "button",
                onclick: () => t.toggleSearch()
            })])]), C(Pt, {
                enabled: l.darkMode(),
                name: "Theme",
                promoteProFeature: l.shouldPromoteProFeature(),
                onClick: n
            }, [C(pe, {title: r(`Theme: ${xi(e)}`, "theme")}, C("button.icon.icon-theme", {
                type: "button",
                class: `icon-theme-${e}`,
                onclick: () => t.toggleTheme()
            }))]), C(pe, {title: "Menu"}, [C("select.icon.icon-menu", {
                name: "menu", value: "none", onchange(c) {
                    const u = c.target.value, f = t.getComputedContent()?.tree;
                    switch (u) {
                        case"openOptionsPage": {
                            t.background.openOptionsPage();
                            break
                        }
                        case"copyAsHtml":
                        case"copyAsText":
                        case"copyAsMarkdown":
                        case"copyAsJson": {
                            if (l.copyToClipboard()) switch (u) {
                                case"copyAsText": {
                                    const d = a.content;
                                    if (!d) return;
                                    const {headings: m} = d,
                                        g = m.map(E => "    ".repeat(E.level) + "- " + E.text).join(`
`);
                                    Rt(g);
                                    break
                                }
                                case"copyAsMarkdown": {
                                    const d = a.content;
                                    if (!d) return;
                                    const {headings: m} = d, g = new URL(location.href),
                                        E = v => v.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\[/g, "\\[").replace(/_/g, "\\_").replace(/\*/g, "\\*").replace(/`/g, "\\`").replace(/</g, "\\<").replace(/>/g, "\\>"),
                                        b = v => (g.hash = v.anchor, E(g.href)),
                                        w = m.map(v => "    ".repeat(v.level) + `- [${E(v.text)}](${b(v)})`).join(`
`);
                                    Rt(w);
                                    break
                                }
                                case"copyAsHtml": {
                                    if (!a.content || !f?.children) return;
                                    const m = document.createElement("div"),
                                        g = b => C("ol", b.children?.map(w => C("li", [w.value.heading?.text, ...w.children?.length ? [g(w)] : []])));
                                    C.render(m, g(f));
                                    const E = m.outerHTML;
                                    vi(E), C.render(m, null), m.remove();
                                    break
                                }
                                case"copyAsJson": {
                                    if (!f?.children) return;
                                    const d = E => ({
                                        text: E.value.heading?.text,
                                        anchor: E.value.heading?.anchor?.substring(1),
                                        children: E.children?.map(d)
                                    }), m = f.children.map(d), g = JSON.stringify(m, null, 2);
                                    Rt(g);
                                    break
                                }
                            } else l.shouldPromoteProFeature() && t.background.openOptionsPage();
                            break
                        }
                        case"toggleReadable": {
                            l.readable() ? t.toggleReadable() : l.shouldPromoteProFeature() && t.background.openOptionsPage();
                            break
                        }
                    }
                }
            }, [C("option", {
                value: "placeholder",
                disabled: !0
            }, ""), C("option", {value: "openOptionsPage"}, "Open Options Page"), (l.copyToClipboard() || l.shouldPromoteProFeature()) && C("optgroup", {label: l.copyToClipboard() ? "Copy..." : "Copy (Pro feature)"}, [{
                value: "copyAsText",
                text: "Copy as Plain Text"
            }, {value: "copyAsMarkdown", text: "Copy as Markdown"}, {
                value: "copyAsHtml",
                text: "Copy as Rich Text"
            }, {value: "copyAsJson", text: "Copy as JSON"}].map(c => C("option", {value: c.value}, c.text)))])])]])
        }
    }), Ti = t => {
        let e;
        const n = new Ue(t.attrs);
        n.on("rerender", () => C.redraw()), n.on("activeHeadingChanged", () => {
            if (!e) return;
            C.redraw.sync();
            const c = n.watcher.activeHeading;
            if (c == null) return;
            const u = e.querySelector(`.heading-text-position-holder[data-index="${c}"]`);
            !u || n.isSearchActive || n.isScrollingArticle || u.scrollIntoView({block: "center", inline: "center"})
        }), n.on("searchFocusChanged", () => {
            if (!e) return;
            C.redraw.sync();
            const c = e.querySelector('.heading-text-position-holder[data-search-focus="1"]') ?? e.querySelector(".is-search-focus");
            !c || c.scrollIntoView({block: "nearest", inline: "center"})
        });
        const r = async (c, u, f) => {
            const m = (E => {
                for (let b = 0; b < 3; b++) {
                    if (E.dataset.index != null) return E;
                    E = E.parentElement
                }
            })(c);
            if (!m) return;
            const g = Number(m.dataset.index);
            Number.isNaN(g) || await n.jumpToHeading({headingIndex: g, highlight: u, animation: f})
        }, s = c => {
            c.key === "Alt" && (n.isGlancing = !0)
        }, l = c => {
            c.key === "Alt" && (n.isGlancing = !1)
        }, a = () => {
            n.saveConfig(location.href)
        };
        return {
            oncreate(c) {
                e = c.dom, n.mount(e), n.loadConfig(location.href), n.watcher.updateMeasurements(!0), n.positioner.setPanel(e), n.positioner.setArticle(n.watcher.content?.article), c.attrs.onMount(n), n.features.glance() && (document.addEventListener("keydown", s), document.addEventListener("keyup", l)), C.redraw(), window.addEventListener("unload", a), document.documentElement.classList.add("smarttoc__is-active")
            }, onremove(c) {
                n.saveConfig(location.href), n.dispose(), c.attrs.onUnmount(), document.removeEventListener("keydown", s), document.removeEventListener("keyup", l), window.removeEventListener("unload", a), document.documentElement.classList.remove("smarttoc__is-active")
            }, view({attrs: {}}) {
                const {isSearchActive: c, search: u, searchFocusIndex: f, features: d, positioner: m} = n,
                    g = n.getComputedContent(), E = g?.tree, b = g?.found ?? [], w = b[f];
                return C("nav.smarttoc-panel", {
                    id: bt,
                    "aria-label": "smarttoc webpage outline",
                    "tab-index": 0,
                    "data-theme": n.theme,
                    style: {visibility: m.isPositioned() ? "visible" : "hidden"},
                    onmouseleave() {
                        const v = document.activeElement;
                        typeof v.dataset.index == "string" && v.blur()
                    }
                }, [C(Ci, {controller: n}), d.search() && C(gi, {
                    isActive: c, search: u, onChange(v) {
                        n.setSearch(v)
                    }, onClose() {
                        n.toggleSearch(!1)
                    }, onFocusNext() {
                        !c || n.setSearchFocusIndex(Math.max(0, Math.min(f + 1, b.length - 1)))
                    }, onFocusPrevious() {
                        !c || n.setSearchFocusIndex(Math.max(0, f - 1))
                    }, onJumpToFocus() {
                        if (!c || !w) return;
                        const v = w.value.heading?.index;
                        v != null && n.jumpToHeading({headingIndex: v})
                    }
                }), C(".contents-wrapper", [C(".contents", {
                    onclick: async v => {
                        v.preventDefault(), r(v.target), v.redraw = !1
                    }, ...d.glance() && {
                        onmouseover: v => {
                            v.altKey && r(v.target, !1, !1), v.redraw = !1
                        }
                    }
                }, [c && u && b.length === 0 ? C(".empty-placeholder", "No results found") : E?.children ? C(Ln, {
                    nodes: E.children,
                    controller: n
                }) : C(".empty-placeholder", "Can not locate article/headings")])]), d.resize() && g != null && C(mi, {
                    minWidth: 100,
                    minHeight: 100,
                    onChange(v) {
                        m.setAbsPos({x: v.left, y: v.top, width: v.width, height: v.height})
                    }
                })])
            }
        }
    };

    class Si {
        product;
        hideProFeature;

        constructor(e) {
            this.product = e.product, this.hideProFeature = e.hideProFeature
        }

        shouldPromoteProFeature() {
            return !this.hideProFeature
        }

        isPro() {
            return this.product === "pro"
        }

        breadcrumb() {
            return this.isPro()
        }

        search() {
            return this.isPro()
        }

        maxLevel() {
            return this.isPro() ? 6 : 2
        }

        darkMode() {
            return this.isPro()
        }

        readable() {
            return this.isPro()
        }

        copyToClipboard() {
            return this.isPro()
        }

        customExpand() {
            return this.isPro()
        }

        resize() {
            return this.isPro()
        }

        glance() {
            return this.isPro()
        }
    }

    const At = jt ? qr() : Dr();

    class Ri extends fe {
        ctrl;

        constructor({silent: e = !1} = {}) {
            super(), Le(this, "runner"), Promise.race([Vr(), he(3500)]).then(() => {
                this.isDisposed || this.start({silent: e}).catch(n => console.error(n))
            }).catch(n => console.error(n))
        }

        async start({silent: e = !1} = {}) {
            if (e) {
                const f = xe.extractArticle({});
                if (!(f && xe.extractHeadings({articleDom: f}))?.headings.length) return
            }
            const n = T.getContainer("smarttoc-container"), {productInfo: r, config: s} = await Wr.get();
            At.checkProductStatusIfNeeded().catch(f => {
                console.error("[smarttoc] check product status failed: ", f)
            });
            const l = Br.getPrivilegeType(r), a = s?.hideProFeatures ?? !1,
                c = new Si({product: l.type, hideProFeature: a});
            let u = {};
            try {
                u = await At.getShortcuts()
            } catch {
                console.error("[smarttoc] failed to get shortcuts")
            }
            C.mount(n, {
                view: () => C(Ti, {
                    shortcuts: u, features: c, onMount: f => {
                        this.ctrl = f
                    }, onUnmount: () => {
                        this.ctrl = void 0
                    }, background: At
                })
            }), this.R(() => C.mount(n, null))
        }
    }

    if (!window.smarttoc) {
        window.smarttoc = {};
        const t = "smarttoc-enabled", e = ce("boot");
        e("injected");
        const n = xe.detectMainWindow();
        if (window === n) {
            let r;
            const s = () => {
                r && (e("stop"), r.dispose(), r = void 0)
            }, l = ({silent: c = !1} = {}) => {
                e("start"), s(), r = new Ri({silent: c})
            }, a = () => (r || l(), ye(r, "runner should be running"), r);
            chrome.runtime.onMessage.addListener((c, u, f) => {
                e("request", c);
                try {
                    switch (c) {
                        case"ping":
                            break;
                        case"toggle": {
                            if (r != null) {
                                s();
                                try {
                                    window.localStorage.setItem(t, "0")
                                } catch {
                                }
                            } else {
                                l();
                                try {
                                    window.localStorage.setItem(t, "1")
                                } catch {
                                }
                            }
                            break
                        }
                        case"autoStart": {
                            try {
                                if (window.localStorage.getItem(t) === "0") return
                            } catch {
                            }
                            r != null || l({silent: !0});
                            break
                        }
                        case"prev": {
                            r = a(), r.ctrl?.goToPreviousHeading();
                            break
                        }
                        case"next": {
                            r = a(), r.ctrl?.goToNextHeading();
                            break
                        }
                        case"search": {
                            r = a(), r.ctrl?.toggleSearch();
                            break
                        }
                        case"theme": {
                            r = a(), r.ctrl?.toggleTheme();
                            break
                        }
                        case"expand:less": {
                            r = a(), r.ctrl?.expandLess();
                            break
                        }
                        case"expand:more": {
                            r = a(), r.ctrl?.expandMore();
                            break
                        }
                        case"expand:auto": {
                            r = a(), r.ctrl?.expandAuto();
                            break
                        }
                        default:
                            console.warn("unknown request", c);
                            break
                    }
                    f(!0)
                } catch (d) {
                    console.error("[smarttoc] failed to handle message: ", c, d), f(!1)
                }
            })
        }
    }
})();
