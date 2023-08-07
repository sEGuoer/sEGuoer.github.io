var et = Object.defineProperty;
var rt = (i, h, d) => h in i ? et(i, h, {enumerable: !0, configurable: !0, writable: !0, value: d}) : i[h] = d;
var u = (i, h, d) => (rt(i, typeof h != "symbol" ? h + "" : h, d), d);
(function () {
    "use strict";

    function i(t, e) {
        if (!t) throw new Error(e || "assertion failed")
    }

    const h = t => {
            throw new TypeError("Unexpected type:" + JSON.stringify(t))
        }, d = typeof location < "u" && location.search.includes("st-debug=1"),
        D = typeof location < "u" && (location.origin === "http://localhost:3000" || location.origin === "http://localhost:5173") && !(typeof chrome < "u" && chrome.storage),
        M = "https://smarttoc.cc/api";

    class j {
        constructor() {
            u(this, "disposers", []);
            u(this, "isDisposed", !1);
            u(this, "R", e => (i(!this.isDisposed, "trying to R() after dispose"), this.disposers.push(e), e));
            u(this, "dispose", () => {
                if (this.isDisposed) {
                    d && console.warn("[smarttoc] trying to dispose() after dispose");
                    return
                }
                this.isDisposed = !0, this.disposers.reverse().forEach(e => {
                    typeof e == "function" ? e() : e.dispose()
                }), this.disposers = []
            })
        }
    }

    class C extends j {
        constructor() {
            super();
            u(this, "handlerMap", new Map);
            this.R(() => this.offAll())
        }

        on(r, s) {
            const o = this.handlerMap.get(r) || new Set;
            return o.add(s), this.handlerMap.set(r, o), () => this.off(r, s)
        }

        off(r, s) {
            const o = this.handlerMap.get(r) || new Set;
            o.delete(s), this.handlerMap.set(r, o)
        }

        emit(r, s) {
            const o = this.handlerMap.get(r);
            if (o) for (const n of o) n(s)
        }

        offAll() {
            this.handlerMap = new Map
        }
    }

    const g = t => {
            let e = 0;
            for (let r = 0; r < t.length; r++) e = t.charCodeAt(r) + ((e << 5) - e);
            return e
        }, p = (t, e, r) => typeof r == "number" ? r % (e - t + 1) + t : Math.floor(Math.random() * (e - t + 1)) + t,
        x = () => {
        }, O = t => {
            const e = p(0, 360, g("r" + t)), r = p(50, 100, g("g" + t)), s = p(60, 80, g("b" + t));
            return `hsl(${e}deg ${r}% ${s}%)`
        }, m = t => {
            if (!d) return x;
            const e = O(t);
            return (...r) => {
                console.info("%c" + t, `color: ${e}`, ...r)
            }
        }, R = m("storage");

    class _ extends C {
        constructor(r) {
            var s;
            super();
            u(this, "cached", {});
            u(this, "storeArea");
            u(this, "onChange", async () => {
                await this.get(), this.emit("changed", void 0)
            });
            this.storeArea = (s = r.storeArea) != null ? s : chrome.storage.sync, chrome.storage.onChanged.addListener(this.onChange), d && typeof globalThis < "u" && (globalThis.__store = this), this.R(() => chrome.storage.onChanged.removeListener(this.onChange))
        }

        async get() {
            const r = await new Promise((s, o) => {
                this.storeArea.get(s)
            });
            return R(r), this.cached = r, r
        }

        getCached() {
            return this.cached
        }

        async patch(r) {
            const s = Object.keys(r).filter(o => r[o] == null);
            await new Promise((o, n) => {
                this.storeArea.set(r, o)
            }), s.length && await new Promise((o, n) => {
                this.storeArea.remove(s, o)
            }), await this.get()
        }

        async DEBUG_reset() {
            await new Promise((r, s) => {
                this.storeArea.clear(r)
            }), await this.get()
        }
    }

    class U extends C {
        constructor(r) {
            super();
            u(this, "cached", {})
        }

        async get() {
            return this.cached
        }

        getCached() {
            return this.cached
        }

        async patch(r) {
            const s = Object.keys(r).filter(o => r[o] == null);
            if (Object.assign(this.cached, r), s.length) for (const o of s) delete this.cached[o]
        }

        async DEBUG_reset() {
            this.cached = {}
        }
    }

    const c = D ? new U({}) : new _({}), q = "browser", S = t => {
            const e = () => {
            };
            return e.basePath = t, new Proxy(e, {
                get(r, s) {
                    if (typeof s != "string" && typeof s != "number") throw new TypeError("expects string or number");
                    return S(`${r.basePath}/${s}`)
                }, apply(r, s, [o]) {
                    return fetch(r.basePath, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(o)
                    }).then(async n => {
                        if (!n.ok || n.status > 299) throw await n.json();
                        return await n.json()
                    })
                }
            })
        }, l = S(M), F = {
            async sendLoginCode(t) {
                await l.account.sendLoginCode({email: t})
            }, async validateLogin(t, e) {
                return await l.account.validateLogin({email: t, loginCode: e})
            }
        }, $ = "smart-toc-pro", N = {
            queryStartTrial(t) {
                return t == null ? void 0 : t.startTrialReason
            }, async startTrial(t) {
                const e = await this.fetchProductInfo(t);
                return i(t), i(e.product), await l.customer.startTrial({email: t, productId: e.product.id})
            }, getPrivilegeType(t) {
                return t ? t.privilege : {type: "free"}
            }, queryClaimPaid(t) {
                return t == null ? void 0 : t.claimPaidReason
            }, async claimPaid(t, e) {
                const r = await this.fetchProductInfo(t);
                return i(r.product), await l.customer.claimPaid({email: t, productId: r.product.id, method: e})
            }, async fetchProductInfo(t) {
                return await l.customer.getProductInfo({email: t, productId: $})
            }
        }, f = m("check"), P = {permissions: ["identity", "identity.email"]},
        w = async () => await new Promise(t => chrome.permissions.contains(P, t)),
        B = async () => await new Promise(t => chrome.permissions.request(P, e => {
            t(e)
        })), J = async () => await new Promise(e => chrome.permissions.request({
            permissions: ["scripting", "tabs"],
            origins: ["*://*/*"]
        }, e)), b = async () => {
            if (!!await w()) return new Promise((e, r) => {
                chrome.identity.getProfileUserInfo(s => {
                    s.email ? e(s) : e(void 0)
                })
            })
        }, G = async () => {
            try {
                return await w(), !0
            } catch {
                return !1
            }
        }, k = async () => {
            try {
                const t = await c.get(), {email: e, loginCode: r, authType: s = q} = t || {};
                if (!e) return;
                if (s === "browser") {
                    const o = await b();
                    return !o || o.email !== e ? void 0 : {email: e, authType: "browser"}
                }
                if (s === "email") return r ? (await F.validateLogin(e, r), {email: e, authType: "email"}) : void 0;
                h(s)
            } catch (t) {
                console.error(t);
                return
            }
        }, H = async t => {
            await c.patch({loginCode: t.loginCode, authType: t.authType, email: t.email}), await y()
        }, K = async () => {
            await c.patch({loginCode: void 0, authType: void 0, productInfo: void 0, email: void 0}), await y()
        }, y = async () => {
            var e;
            const t = (await c.get()).startCheck;
            try {
                const r = await k(), s = await N.fetchProductInfo(r == null ? void 0 : r.email);
                await c.patch({productInfo: s}), await c.patch({
                    startCheck: {
                        lastCheckAt: Date.now(),
                        lastCheckSuccess: !0,
                        lastSuccessAt: Date.now(),
                        failedCount: 0
                    }
                }), f("check success")
            } catch (r) {
                f("check failed", r);
                const s = (e = t == null ? void 0 : t.failedCount) != null ? e : 0;
                await c.patch({
                    startCheck: {
                        lastCheckAt: Date.now(),
                        lastCheckSuccess: !1,
                        lastSuccessAt: t == null ? void 0 : t.lastSuccessAt,
                        failedCount: s + 1
                    }
                })
            }
        }, A = 1e3 * 60 * 60 * 24, Y = async () => {
            var n;
            const t = await c.get();
            let e = 5;
            {
                const {productInfo: a} = t;
                if (a) if (a.orderStatus) switch (a.orderStatus) {
                    case"pending":
                        e = .5 / 24;
                        break;
                    case"confirmed":
                        e = 5;
                        break;
                    case"rejected":
                        e = 5;
                        break;
                    default:
                        h(a.orderStatus);
                        break
                } else a.trialExpireAt && (a.trialExpireAt >= Date.now() ? e = .5 / 24 : e = 5)
            }
            const {startCheck: r} = t,
                s = (Date.now() - ((n = r == null ? void 0 : r.lastCheckAt) != null ? n : -1 / 0)) / A;
            return r != null && r.lastCheckSuccess || (e = Math.min(1, e)), s > e
        }, v = async () => {
            var t;
            await Y() ? (f("checking..."), await y()) : f("skip checking");
            {
                const e = await c.get();
                if (e.startCheck) {
                    const r = Date.now() - ((t = e.startCheck.lastSuccessAt) != null ? t : -1 / 0);
                    e.startCheck.failedCount >= 3 && r > A * 3 && (f("reseting state"), await c.patch({productInfo: void 0}))
                }
            }
        }, T = "content/style.css", E = "content/content.js", W = async t => {
            try {
                return await chrome.tabs.sendMessage(t, "ping") != null
            } catch {
                return !1
            }
        }, I = async (t, e = "toggle") => {
            await W(t) || (chrome.scripting.insertCSS ? await chrome.scripting.insertCSS({
                target: {tabId: t, allFrames: !0},
                files: [T]
            }) : await chrome.tabs.insertCSS(t, {
                file: T,
                allFrames: !0
            }), chrome.scripting.executeScript ? await chrome.scripting.executeScript({
                target: {tabId: t, allFrames: !0},
                files: [E]
            }) : await chrome.tabs.executeScript(t, {file: E, allFrames: !0})), await chrome.tabs.sendMessage(t, e)
        }, z = async () => {
            const [t] = await new Promise(e => chrome.tabs.query({active: !0, currentWindow: !0}, e));
            return t.id
        }, L = async t => {
            const e = await z();
            !e || await I(e, t)
        };

    function Q(t) {
        return chrome.runtime.onMessage.addListener((e, r, s) => ((async () => {
            const {command: o, args: n} = e || {};
            try {
                const a = t[o];
                if (typeof a != "function") throw new Error("handler not found for command: " + o);
                const tt = await a(...n);
                s({ok: !0, result: tt})
            } catch (a) {
                s({ok: !1, error: a})
            }
        })(), !0)), t
    }

    const V = ["http:", "https:", "file:"], X = t => {
        if (!t) return !1;
        try {
            const e = new URL(t);
            return !!V.includes(e.protocol)
        } catch (e) {
            return console.error("failed to parse url", t, e), !1
        }
    }, Z = async () => {
        try {
            console.info("background starting..."), (chrome.action || chrome.browserAction).onClicked.addListener(() => L("toggle")), chrome.commands.onCommand.addListener(e => L(e));
            {
                const t = m("tab");
                chrome.tabs.onUpdated.addListener(async (e, r, s) => {
                    const o = c.getCached().config;
                    if (o != null && o.autoRun && (r == null ? void 0 : r.status) === "complete") {
                        const n = X(s.url);
                        t(s.url, n), n && await I(e, "autoStart")
                    }
                })
            }
            await v(), console.info("background start ok")
        } catch (t) {
            console.info("background start failed", t)
        }
    };
    Q({
        hasIdentityPermission: w,
        requestIdentityPermission: B,
        requestScriptingPermission: J,
        getIdentity: b,
        isIdentitySupported: G,
        getAccountInfo: k,
        login: H,
        logout: K,
        checkProductStatusIfNeeded: v,
        async getShortcuts() {
            return new Promise((t, e) => {
                chrome.commands.getAll(r => {
                    chrome.runtime.lastError ? e(chrome.runtime.lastError) : t(r)
                })
            }).then(t => {
                const e = {};
                return t.forEach(r => {
                    e[r.name] = r.shortcut
                }), e
            })
        },
        async openOptionsPage() {
            return new Promise((t, e) => {
                chrome.runtime.openOptionsPage(() => {
                    chrome.runtime.lastError ? e(chrome.runtime.lastError) : t()
                })
            })
        }
    }), Z().catch(t => {
        console.error(t)
    })
})();
