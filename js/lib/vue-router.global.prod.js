/*!
  * vue-router v4.0.16
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
var VueRouter = function (e, t) { "use strict"; const n = "function" == typeof Symbol && "symbol" == typeof Symbol.toStringTag, r = e => n ? Symbol(e) : "_vr_" + e, o = r("rvlm"), a = r("rvd"), c = r("r"), i = r("rl"), s = r("rvl"), l = "undefined" != typeof window; const u = Object.assign; function f(e, t) { const n = {}; for (const r in t) { const o = t[r]; n[r] = Array.isArray(o) ? o.map(e) : e(o) } return n } const p = () => { }, h = /\/$/; function d(e, t, n = "/") { let r, o = {}, a = "", c = ""; const i = t.indexOf("?"), s = t.indexOf("#", i > -1 ? i : 0); return i > -1 && (r = t.slice(0, i), a = t.slice(i + 1, s > -1 ? s : t.length), o = e(a)), s > -1 && (r = r || t.slice(0, s), c = t.slice(s, t.length)), r = function (e, t) { if (e.startsWith("/")) return e; if (!e) return t; const n = t.split("/"), r = e.split("/"); let o, a, c = n.length - 1; for (o = 0; o < r.length; o++)if (a = r[o], 1 !== c && "." !== a) { if (".." !== a) break; c-- } return n.slice(0, c).join("/") + "/" + r.slice(o - (o === r.length ? 1 : 0)).join("/") }(null != r ? r : t, n), { fullPath: r + (a && "?") + a + c, path: r, query: o, hash: c } } function m(e, t) { return t && e.toLowerCase().startsWith(t.toLowerCase()) ? e.slice(t.length) || "/" : e } function g(e, t) { return (e.aliasOf || e) === (t.aliasOf || t) } function v(e, t) { if (Object.keys(e).length !== Object.keys(t).length) return !1; for (const n in e) if (!y(e[n], t[n])) return !1; return !0 } function y(e, t) { return Array.isArray(e) ? b(e, t) : Array.isArray(t) ? b(t, e) : e === t } function b(e, t) { return Array.isArray(t) ? e.length === t.length && e.every(((e, n) => e === t[n])) : 1 === e.length && e[0] === t } var w, E; !function (e) { e.pop = "pop", e.push = "push" }(w || (w = {})), function (e) { e.back = "back", e.forward = "forward", e.unknown = "" }(E || (E = {})); function R(e) { if (!e) if (l) { const t = document.querySelector("base"); e = (e = t && t.getAttribute("href") || "/").replace(/^\w+:\/\/[^\/]+/, "") } else e = "/"; return "/" !== e[0] && "#" !== e[0] && (e = "/" + e), e.replace(h, "") } const O = /^[^#]+#/; function A(e, t) { return e.replace(O, "#") + t } const k = () => ({ left: window.pageXOffset, top: window.pageYOffset }); function P(e) { let t; if ("el" in e) { const n = e.el, r = "string" == typeof n && n.startsWith("#"), o = "string" == typeof n ? r ? document.getElementById(n.slice(1)) : document.querySelector(n) : n; if (!o) return; t = function (e, t) { const n = document.documentElement.getBoundingClientRect(), r = e.getBoundingClientRect(); return { behavior: t.behavior, left: r.left - n.left - (t.left || 0), top: r.top - n.top - (t.top || 0) } }(o, e) } else t = e; "scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(null != t.left ? t.left : window.pageXOffset, null != t.top ? t.top : window.pageYOffset) } function j(e, t) { return (history.state ? history.state.position - t : -1) + e } const C = new Map; let x = () => location.protocol + "//" + location.host; function $(e, t) { const { pathname: n, search: r, hash: o } = t, a = e.indexOf("#"); if (a > -1) { let t = o.includes(e.slice(a)) ? e.slice(a).length : 1, n = o.slice(t); return "/" !== n[0] && (n = "/" + n), m(n, "") } return m(n, e) + r + o } function S(e, t, n, r = !1, o = !1) { return { back: e, current: t, forward: n, replaced: r, position: window.history.length, scroll: o ? k() : null } } function L(e) { const t = function (e) { const { history: t, location: n } = window, r = { value: $(e, n) }, o = { value: t.state }; function a(r, a, c) { const i = e.indexOf("#"), s = i > -1 ? (n.host && document.querySelector("base") ? e : e.slice(i)) + r : x() + e + r; try { t[c ? "replaceState" : "pushState"](a, "", s), o.value = a } catch (e) { console.error(e), n[c ? "replace" : "assign"](s) } } return o.value || a(r.value, { back: null, current: r.value, forward: null, position: t.length - 1, replaced: !0, scroll: null }, !0), { location: r, state: o, push: function (e, n) { const c = u({}, o.value, t.state, { forward: e, scroll: k() }); a(c.current, c, !0), a(e, u({}, S(r.value, e, null), { position: c.position + 1 }, n), !1), r.value = e }, replace: function (e, n) { a(e, u({}, t.state, S(o.value.back, e, o.value.forward, !0), n, { position: o.value.position }), !0), r.value = e } } }(e = R(e)), n = function (e, t, n, r) { let o = [], a = [], c = null; const i = ({ state: a }) => { const i = $(e, location), s = n.value, l = t.value; let u = 0; if (a) { if (n.value = i, t.value = a, c && c === s) return void (c = null); u = l ? a.position - l.position : 0 } else r(i); o.forEach((e => { e(n.value, s, { delta: u, type: w.pop, direction: u ? u > 0 ? E.forward : E.back : E.unknown }) })) }; function s() { const { history: e } = window; e.state && e.replaceState(u({}, e.state, { scroll: k() }), "") } return window.addEventListener("popstate", i), window.addEventListener("beforeunload", s), { pauseListeners: function () { c = n.value }, listen: function (e) { o.push(e); const t = () => { const t = o.indexOf(e); t > -1 && o.splice(t, 1) }; return a.push(t), t }, destroy: function () { for (const e of a) e(); a = [], window.removeEventListener("popstate", i), window.removeEventListener("beforeunload", s) } } }(e, t.state, t.location, t.replace); const r = u({ location: "", base: e, go: function (e, t = !0) { t || n.pauseListeners(), history.go(e) }, createHref: A.bind(null, e) }, t, n); return Object.defineProperty(r, "location", { enumerable: !0, get: () => t.location.value }), Object.defineProperty(r, "state", { enumerable: !0, get: () => t.state.value }), r } function M(e) { return "string" == typeof e || "symbol" == typeof e } const q = { path: "/", name: void 0, params: {}, query: {}, hash: "", fullPath: "/", matched: [], meta: {}, redirectedFrom: void 0 }, _ = r("nf"); var T; function B(e, t) { return u(new Error, { type: e, [_]: !0 }, t) } function G(e, t) { return e instanceof Error && _ in e && (null == t || !!(e.type & t)) } e.NavigationFailureType = void 0, (T = e.NavigationFailureType || (e.NavigationFailureType = {}))[T.aborted = 4] = "aborted", T[T.cancelled = 8] = "cancelled", T[T.duplicated = 16] = "duplicated"; const F = "[^/]+?", D = { sensitive: !1, strict: !1, start: !0, end: !0 }, I = /[.+*?^${}()[\]/\\]/g; function K(e, t) { let n = 0; for (; n < e.length && n < t.length;) { const r = t[n] - e[n]; if (r) return r; n++ } return e.length < t.length ? 1 === e.length && 80 === e[0] ? -1 : 1 : e.length > t.length ? 1 === t.length && 80 === t[0] ? 1 : -1 : 0 } function U(e, t) { let n = 0; const r = e.score, o = t.score; for (; n < r.length && n < o.length;) { const e = K(r[n], o[n]); if (e) return e; n++ } if (1 === Math.abs(o.length - r.length)) { if (V(r)) return 1; if (V(o)) return -1 } return o.length - r.length } function V(e) { const t = e[e.length - 1]; return e.length > 0 && t[t.length - 1] < 0 } const H = { type: 0, value: "" }, W = /[a-zA-Z0-9_]/; function N(e, t, n) { const r = function (e, t) { const n = u({}, D, t), r = []; let o = n.start ? "^" : ""; const a = []; for (const t of e) { const e = t.length ? [] : [90]; n.strict && !t.length && (o += "/"); for (let r = 0; r < t.length; r++) { const c = t[r]; let i = 40 + (n.sensitive ? .25 : 0); if (0 === c.type) r || (o += "/"), o += c.value.replace(I, "\\$&"), i += 40; else if (1 === c.type) { const { value: e, repeatable: n, optional: s, regexp: l } = c; a.push({ name: e, repeatable: n, optional: s }); const u = l || F; if (u !== F) { i += 10; try { new RegExp(`(${u})`) } catch (t) { throw new Error(`Invalid custom RegExp for param "${e}" (${u}): ` + t.message) } } let f = n ? `((?:${u})(?:/(?:${u}))*)` : `(${u})`; r || (f = s && t.length < 2 ? `(?:/${f})` : "/" + f), s && (f += "?"), o += f, i += 20, s && (i += -8), n && (i += -20), ".*" === u && (i += -50) } e.push(i) } r.push(e) } if (n.strict && n.end) { const e = r.length - 1; r[e][r[e].length - 1] += .7000000000000001 } n.strict || (o += "/?"), n.end ? o += "$" : n.strict && (o += "(?:/|$)"); const c = new RegExp(o, n.sensitive ? "" : "i"); return { re: c, score: r, keys: a, parse: function (e) { const t = e.match(c), n = {}; if (!t) return null; for (let e = 1; e < t.length; e++) { const r = t[e] || "", o = a[e - 1]; n[o.name] = r && o.repeatable ? r.split("/") : r } return n }, stringify: function (t) { let n = "", r = !1; for (const o of e) { r && n.endsWith("/") || (n += "/"), r = !1; for (const a of o) if (0 === a.type) n += a.value; else if (1 === a.type) { const { value: c, repeatable: i, optional: s } = a, l = c in t ? t[c] : ""; if (Array.isArray(l) && !i) throw new Error(`Provided param "${c}" is an array but it is not repeatable (* or + modifiers)`); const u = Array.isArray(l) ? l.join("/") : l; if (!u) { if (!s) throw new Error(`Missing required param "${c}"`); o.length < 2 && e.length > 1 && (n.endsWith("/") ? n = n.slice(0, -1) : r = !0) } n += u } } return n } } }(function (e) { if (!e) return [[]]; if ("/" === e) return [[H]]; if (!e.startsWith("/")) throw new Error(`Invalid path "${e}"`); function t(e) { throw new Error(`ERR (${n})/"${l}": ${e}`) } let n = 0, r = n; const o = []; let a; function c() { a && o.push(a), a = [] } let i, s = 0, l = "", u = ""; function f() { l && (0 === n ? a.push({ type: 0, value: l }) : 1 === n || 2 === n || 3 === n ? (a.length > 1 && ("*" === i || "+" === i) && t(`A repeatable param (${l}) must be alone in its segment. eg: '/:ids+.`), a.push({ type: 1, value: l, regexp: u, repeatable: "*" === i || "+" === i, optional: "*" === i || "?" === i })) : t("Invalid state to consume buffer"), l = "") } function p() { l += i } for (; s < e.length;)if (i = e[s++], "\\" !== i || 2 === n) switch (n) { case 0: "/" === i ? (l && f(), c()) : ":" === i ? (f(), n = 1) : p(); break; case 4: p(), n = r; break; case 1: "(" === i ? n = 2 : W.test(i) ? p() : (f(), n = 0, "*" !== i && "?" !== i && "+" !== i && s--); break; case 2: ")" === i ? "\\" == u[u.length - 1] ? u = u.slice(0, -1) + i : n = 3 : u += i; break; case 3: f(), n = 0, "*" !== i && "?" !== i && "+" !== i && s--, u = ""; break; default: t("Unknown state") } else r = n, n = 4; return 2 === n && t(`Unfinished custom RegExp for param "${l}"`), f(), c(), o }(e.path), n), o = u(r, { record: e, parent: t, children: [], alias: [] }); return t && !o.record.aliasOf == !t.record.aliasOf && t.children.push(o), o } function z(e, t) { const n = [], r = new Map; function o(e, n, r) { const i = !r, s = function (e) { return { path: e.path, redirect: e.redirect, name: e.name, meta: e.meta || {}, aliasOf: void 0, beforeEnter: e.beforeEnter, props: Q(e), children: e.children || [], instances: {}, leaveGuards: new Set, updateGuards: new Set, enterCallbacks: {}, components: "components" in e ? e.components || {} : { default: e.component } } }(e); s.aliasOf = r && r.record; const l = Z(t, e), f = [s]; if ("alias" in e) { const t = "string" == typeof e.alias ? [e.alias] : e.alias; for (const e of t) f.push(u({}, s, { components: r ? r.record.components : s.components, path: e, aliasOf: r ? r.record : s })) } let h, d; for (const t of f) { const { path: u } = t; if (n && "/" !== u[0]) { const e = n.record.path, r = "/" === e[e.length - 1] ? "" : "/"; t.path = n.record.path + (u && r + u) } if (h = N(t, n, l), r ? r.alias.push(h) : (d = d || h, d !== h && d.alias.push(h), i && e.name && !X(h) && a(e.name)), "children" in s) { const e = s.children; for (let t = 0; t < e.length; t++)o(e[t], h, r && r.children[t]) } r = r || h, c(h) } return d ? () => { a(d) } : p } function a(e) { if (M(e)) { const t = r.get(e); t && (r.delete(e), n.splice(n.indexOf(t), 1), t.children.forEach(a), t.alias.forEach(a)) } else { const t = n.indexOf(e); t > -1 && (n.splice(t, 1), e.record.name && r.delete(e.record.name), e.children.forEach(a), e.alias.forEach(a)) } } function c(e) { let t = 0; for (; t < n.length && U(e, n[t]) >= 0 && (e.record.path !== n[t].record.path || !J(e, n[t]));)t++; n.splice(t, 0, e), e.record.name && !X(e) && r.set(e.record.name, e) } return t = Z({ strict: !1, end: !0, sensitive: !1 }, t), e.forEach((e => o(e))), { addRoute: o, resolve: function (e, t) { let o, a, c, i = {}; if ("name" in e && e.name) { if (o = r.get(e.name), !o) throw B(1, { location: e }); c = o.record.name, i = u(function (e, t) { const n = {}; for (const r of t) r in e && (n[r] = e[r]); return n }(t.params, o.keys.filter((e => !e.optional)).map((e => e.name))), e.params), a = o.stringify(i) } else if ("path" in e) a = e.path, o = n.find((e => e.re.test(a))), o && (i = o.parse(a), c = o.record.name); else { if (o = t.name ? r.get(t.name) : n.find((e => e.re.test(t.path))), !o) throw B(1, { location: e, currentLocation: t }); c = o.record.name, i = u({}, t.params, e.params), a = o.stringify(i) } const s = []; let l = o; for (; l;)s.unshift(l.record), l = l.parent; return { name: c, path: a, params: i, matched: s, meta: Y(s) } }, removeRoute: a, getRoutes: function () { return n }, getRecordMatcher: function (e) { return r.get(e) } } } function Q(e) { const t = {}, n = e.props || !1; if ("component" in e) t.default = n; else for (const r in e.components) t[r] = "boolean" == typeof n ? n : n[r]; return t } function X(e) { for (; e;) { if (e.record.aliasOf) return !0; e = e.parent } return !1 } function Y(e) { return e.reduce(((e, t) => u(e, t.meta)), {}) } function Z(e, t) { const n = {}; for (const r in e) n[r] = r in t ? t[r] : e[r]; return n } function J(e, t) { return t.children.some((t => t === e || J(e, t))) } const ee = /#/g, te = /&/g, ne = /\//g, re = /=/g, oe = /\?/g, ae = /\+/g, ce = /%5B/g, ie = /%5D/g, se = /%5E/g, le = /%60/g, ue = /%7B/g, fe = /%7C/g, pe = /%7D/g, he = /%20/g; function de(e) { return encodeURI("" + e).replace(fe, "|").replace(ce, "[").replace(ie, "]") } function me(e) { return de(e).replace(ae, "%2B").replace(he, "+").replace(ee, "%23").replace(te, "%26").replace(le, "`").replace(ue, "{").replace(pe, "}").replace(se, "^") } function ge(e) { return null == e ? "" : function (e) { return de(e).replace(ee, "%23").replace(oe, "%3F") }(e).replace(ne, "%2F") } function ve(e) { try { return decodeURIComponent("" + e) } catch (e) { } return "" + e } function ye(e) { const t = {}; if ("" === e || "?" === e) return t; const n = ("?" === e[0] ? e.slice(1) : e).split("&"); for (let e = 0; e < n.length; ++e) { const r = n[e].replace(ae, " "), o = r.indexOf("="), a = ve(o < 0 ? r : r.slice(0, o)), c = o < 0 ? null : ve(r.slice(o + 1)); if (a in t) { let e = t[a]; Array.isArray(e) || (e = t[a] = [e]), e.push(c) } else t[a] = c } return t } function be(e) { let t = ""; for (let n in e) { const r = e[n]; if (n = me(n).replace(re, "%3D"), null == r) { void 0 !== r && (t += (t.length ? "&" : "") + n); continue } (Array.isArray(r) ? r.map((e => e && me(e))) : [r && me(r)]).forEach((e => { void 0 !== e && (t += (t.length ? "&" : "") + n, null != e && (t += "=" + e)) })) } return t } function we(e) { const t = {}; for (const n in e) { const r = e[n]; void 0 !== r && (t[n] = Array.isArray(r) ? r.map((e => null == e ? null : "" + e)) : null == r ? r : "" + r) } return t } function Ee() { let e = []; return { add: function (t) { return e.push(t), () => { const n = e.indexOf(t); n > -1 && e.splice(n, 1) } }, list: () => e, reset: function () { e = [] } } } function Re(e, n, r) { const o = () => { e[n].delete(r) }; t.onUnmounted(o), t.onDeactivated(o), t.onActivated((() => { e[n].add(r) })), e[n].add(r) } function Oe(e, t, n, r, o) { const a = r && (r.enterCallbacks[o] = r.enterCallbacks[o] || []); return () => new Promise(((c, i) => { const s = e => { var s; !1 === e ? i(B(4, { from: n, to: t })) : e instanceof Error ? i(e) : "string" == typeof (s = e) || s && "object" == typeof s ? i(B(2, { from: t, to: e })) : (a && r.enterCallbacks[o] === a && "function" == typeof e && a.push(e), c()) }, l = e.call(r && r.instances[o], t, n, s); let u = Promise.resolve(l); e.length < 3 && (u = u.then(s)), u.catch((e => i(e))) })) } function Ae(e, t, r, o) { const a = []; for (const i of e) for (const e in i.components) { let s = i.components[e]; if ("beforeRouteEnter" === t || i.instances[e]) if ("object" == typeof (c = s) || "displayName" in c || "props" in c || "__vccOpts" in c) { const n = (s.__vccOpts || s)[t]; n && a.push(Oe(n, r, o, i, e)) } else { let c = s(); a.push((() => c.then((a => { if (!a) return Promise.reject(new Error(`Couldn't resolve component "${e}" at "${i.path}"`)); const c = (s = a).__esModule || n && "Module" === s[Symbol.toStringTag] ? a.default : a; var s; i.components[e] = c; const l = (c.__vccOpts || c)[t]; return l && Oe(l, r, o, i, e)() })))) } } var c; return a } function ke(e) { const n = t.inject(c), r = t.inject(i), o = t.computed((() => n.resolve(t.unref(e.to)))), a = t.computed((() => { const { matched: e } = o.value, { length: t } = e, n = e[t - 1], a = r.matched; if (!n || !a.length) return -1; const c = a.findIndex(g.bind(null, n)); if (c > -1) return c; const i = je(e[t - 2]); return t > 1 && je(n) === i && a[a.length - 1].path !== i ? a.findIndex(g.bind(null, e[t - 2])) : c })), s = t.computed((() => a.value > -1 && function (e, t) { for (const n in t) { const r = t[n], o = e[n]; if ("string" == typeof r) { if (r !== o) return !1 } else if (!Array.isArray(o) || o.length !== r.length || r.some(((e, t) => e !== o[t]))) return !1 } return !0 }(r.params, o.value.params))), l = t.computed((() => a.value > -1 && a.value === r.matched.length - 1 && v(r.params, o.value.params))); return { route: o, href: t.computed((() => o.value.href)), isActive: s, isExactActive: l, navigate: function (r = {}) { return function (e) { if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return; if (e.defaultPrevented) return; if (void 0 !== e.button && 0 !== e.button) return; if (e.currentTarget && e.currentTarget.getAttribute) { const t = e.currentTarget.getAttribute("target"); if (/\b_blank\b/i.test(t)) return } e.preventDefault && e.preventDefault(); return !0 }(r) ? n[t.unref(e.replace) ? "replace" : "push"](t.unref(e.to)).catch(p) : Promise.resolve() } } } const Pe = t.defineComponent({ name: "RouterLink", compatConfig: { MODE: 3 }, props: { to: { type: [String, Object], required: !0 }, replace: Boolean, activeClass: String, exactActiveClass: String, custom: Boolean, ariaCurrentValue: { type: String, default: "page" } }, useLink: ke, setup(e, { slots: n }) { const r = t.reactive(ke(e)), { options: o } = t.inject(c), a = t.computed((() => ({ [Ce(e.activeClass, o.linkActiveClass, "router-link-active")]: r.isActive, [Ce(e.exactActiveClass, o.linkExactActiveClass, "router-link-exact-active")]: r.isExactActive }))); return () => { const o = n.default && n.default(r); return e.custom ? o : t.h("a", { "aria-current": r.isExactActive ? e.ariaCurrentValue : null, href: r.href, onClick: r.navigate, class: a.value }, o) } } }); function je(e) { return e ? e.aliasOf ? e.aliasOf.path : e.path : "" } const Ce = (e, t, n) => null != e ? e : null != t ? t : n; function xe(e, t) { if (!e) return null; const n = e(t); return 1 === n.length ? n[0] : n } const $e = t.defineComponent({ name: "RouterView", inheritAttrs: !1, props: { name: { type: String, default: "default" }, route: Object }, compatConfig: { MODE: 3 }, setup(e, { attrs: n, slots: r }) { const c = t.inject(s), i = t.computed((() => e.route || c.value)), l = t.inject(a, 0), f = t.computed((() => i.value.matched[l])); t.provide(a, l + 1), t.provide(o, f), t.provide(s, i); const p = t.ref(); return t.watch((() => [p.value, f.value, e.name]), (([e, t, n], [r, o, a]) => { t && (t.instances[n] = e, o && o !== t && e && e === r && (t.leaveGuards.size || (t.leaveGuards = o.leaveGuards), t.updateGuards.size || (t.updateGuards = o.updateGuards))), !e || !t || o && g(t, o) && r || (t.enterCallbacks[n] || []).forEach((t => t(e))) }), { flush: "post" }), () => { const o = i.value, a = f.value, c = a && a.components[e.name], s = e.name; if (!c) return xe(r.default, { Component: c, route: o }); const l = a.props[e.name], h = l ? !0 === l ? o.params : "function" == typeof l ? l(o) : l : null, d = t.h(c, u({}, h, n, { onVnodeUnmounted: e => { e.component.isUnmounted && (a.instances[s] = null) }, ref: p })); return xe(r.default, { Component: d, route: o }) || d } } }); function Se(e) { return e.reduce(((e, t) => e.then((() => t()))), Promise.resolve()) } return e.RouterLink = Pe, e.RouterView = $e, e.START_LOCATION = q, e.createMemoryHistory = function (e = "") { let t = [], n = [""], r = 0; function o(e) { r++, r === n.length || n.splice(r), n.push(e) } const a = { location: "", state: {}, base: e = R(e), createHref: A.bind(null, e), replace(e) { n.splice(r--, 1), o(e) }, push(e, t) { o(e) }, listen: e => (t.push(e), () => { const n = t.indexOf(e); n > -1 && t.splice(n, 1) }), destroy() { t = [], n = [""], r = 0 }, go(e, o = !0) { const a = this.location, c = e < 0 ? E.back : E.forward; r = Math.max(0, Math.min(r + e, n.length - 1)), o && function (e, n, { direction: r, delta: o }) { const a = { direction: r, delta: o, type: w.pop }; for (const r of t) r(e, n, a) }(this.location, a, { direction: c, delta: e }) } }; return Object.defineProperty(a, "location", { enumerable: !0, get: () => n[r] }), a }, e.createRouter = function (e) { const n = z(e.routes, e), r = e.parseQuery || ye, o = e.stringifyQuery || be, a = e.history, h = Ee(), m = Ee(), y = Ee(), b = t.shallowRef(q); let E = q; l && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual"); const R = f.bind(null, (e => "" + e)), O = f.bind(null, ge), A = f.bind(null, ve); function x(e, t) { if (t = u({}, t || b.value), "string" == typeof e) { const o = d(r, e, t.path), c = n.resolve({ path: o.path }, t), i = a.createHref(o.fullPath); return u(o, c, { params: A(c.params), hash: ve(o.hash), redirectedFrom: void 0, href: i }) } let c; if ("path" in e) c = u({}, e, { path: d(r, e.path, t.path).path }); else { const n = u({}, e.params); for (const e in n) null == n[e] && delete n[e]; c = u({}, e, { params: O(e.params) }), t.params = O(t.params) } const i = n.resolve(c, t), s = e.hash || ""; i.params = R(A(i.params)); const l = function (e, t) { const n = t.query ? e(t.query) : ""; return t.path + (n && "?") + n + (t.hash || "") }(o, u({}, e, { hash: (f = s, de(f).replace(ue, "{").replace(pe, "}").replace(se, "^")), path: i.path })); var f; const p = a.createHref(l); return u({ fullPath: l, hash: s, query: o === be ? we(e.query) : e.query || {} }, i, { redirectedFrom: void 0, href: p }) } function $(e) { return "string" == typeof e ? d(r, e, b.value.path) : u({}, e) } function S(e, t) { if (E !== e) return B(8, { from: t, to: e }) } function L(e) { return T(e) } function _(e) { const t = e.matched[e.matched.length - 1]; if (t && t.redirect) { const { redirect: n } = t; let r = "function" == typeof n ? n(e) : n; return "string" == typeof r && (r = r.includes("?") || r.includes("#") ? r = $(r) : { path: r }, r.params = {}), u({ query: e.query, hash: e.hash, params: e.params }, r) } } function T(e, t) { const n = E = x(e), r = b.value, a = e.state, c = e.force, i = !0 === e.replace, s = _(n); if (s) return T(u($(s), { state: a, force: c, replace: i }), t || n); const l = n; let f; return l.redirectedFrom = t, !c && function (e, t, n) { const r = t.matched.length - 1, o = n.matched.length - 1; return r > -1 && r === o && g(t.matched[r], n.matched[o]) && v(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash }(o, r, n) && (f = B(16, { to: l, from: r }), Y(r, r, !0, !1)), (f ? Promise.resolve(f) : D(l, r)).catch((e => G(e) ? G(e, 2) ? e : X(e) : Q(e, l, r))).then((e => { if (e) { if (G(e, 2)) return T(u($(e.to), { state: a, force: c, replace: i }), t || l) } else e = K(l, r, !0, i, a); return I(l, r, e), e })) } function F(e, t) { const n = S(e, t); return n ? Promise.reject(n) : Promise.resolve() } function D(e, t) { let n; const [r, o, a] = function (e, t) { const n = [], r = [], o = [], a = Math.max(t.matched.length, e.matched.length); for (let c = 0; c < a; c++) { const a = t.matched[c]; a && (e.matched.find((e => g(e, a))) ? r.push(a) : n.push(a)); const i = e.matched[c]; i && (t.matched.find((e => g(e, i))) || o.push(i)) } return [n, r, o] }(e, t); n = Ae(r.reverse(), "beforeRouteLeave", e, t); for (const o of r) o.leaveGuards.forEach((r => { n.push(Oe(r, e, t)) })); const c = F.bind(null, e, t); return n.push(c), Se(n).then((() => { n = []; for (const r of h.list()) n.push(Oe(r, e, t)); return n.push(c), Se(n) })).then((() => { n = Ae(o, "beforeRouteUpdate", e, t); for (const r of o) r.updateGuards.forEach((r => { n.push(Oe(r, e, t)) })); return n.push(c), Se(n) })).then((() => { n = []; for (const r of e.matched) if (r.beforeEnter && !t.matched.includes(r)) if (Array.isArray(r.beforeEnter)) for (const o of r.beforeEnter) n.push(Oe(o, e, t)); else n.push(Oe(r.beforeEnter, e, t)); return n.push(c), Se(n) })).then((() => (e.matched.forEach((e => e.enterCallbacks = {})), n = Ae(a, "beforeRouteEnter", e, t), n.push(c), Se(n)))).then((() => { n = []; for (const r of m.list()) n.push(Oe(r, e, t)); return n.push(c), Se(n) })).catch((e => G(e, 8) ? e : Promise.reject(e))) } function I(e, t, n) { for (const r of y.list()) r(e, t, n) } function K(e, t, n, r, o) { const c = S(e, t); if (c) return c; const i = t === q, s = l ? history.state : {}; n && (r || i ? a.replace(e.fullPath, u({ scroll: i && s && s.scroll }, o)) : a.push(e.fullPath, o)), b.value = e, Y(e, t, n, i), X() } let U; function V() { U || (U = a.listen(((e, t, n) => { const r = x(e), o = _(r); if (o) return void T(u(o, { replace: !0 }), r).catch(p); E = r; const c = b.value; var i, s; l && (i = j(c.fullPath, n.delta), s = k(), C.set(i, s)), D(r, c).catch((e => G(e, 12) ? e : G(e, 2) ? (T(e.to, r).then((e => { G(e, 20) && !n.delta && n.type === w.pop && a.go(-1, !1) })).catch(p), Promise.reject()) : (n.delta && a.go(-n.delta, !1), Q(e, r, c)))).then((e => { (e = e || K(r, c, !1)) && (n.delta ? a.go(-n.delta, !1) : n.type === w.pop && G(e, 20) && a.go(-1, !1)), I(r, c, e) })).catch(p) }))) } let H, W = Ee(), N = Ee(); function Q(e, t, n) { X(e); const r = N.list(); return r.length ? r.forEach((r => r(e, t, n))) : console.error(e), Promise.reject(e) } function X(e) { return H || (H = !e, V(), W.list().forEach((([t, n]) => e ? n(e) : t())), W.reset()), e } function Y(n, r, o, a) { const { scrollBehavior: c } = e; if (!l || !c) return Promise.resolve(); const i = !o && function (e) { const t = C.get(e); return C.delete(e), t }(j(n.fullPath, 0)) || (a || !o) && history.state && history.state.scroll || null; return t.nextTick().then((() => c(n, r, i))).then((e => e && P(e))).catch((e => Q(e, n, r))) } const Z = e => a.go(e); let J; const ee = new Set, te = { currentRoute: b, addRoute: function (e, t) { let r, o; return M(e) ? (r = n.getRecordMatcher(e), o = t) : o = e, n.addRoute(o, r) }, removeRoute: function (e) { const t = n.getRecordMatcher(e); t && n.removeRoute(t) }, hasRoute: function (e) { return !!n.getRecordMatcher(e) }, getRoutes: function () { return n.getRoutes().map((e => e.record)) }, resolve: x, options: e, push: L, replace: function (e) { return L(u($(e), { replace: !0 })) }, go: Z, back: () => Z(-1), forward: () => Z(1), beforeEach: h.add, beforeResolve: m.add, afterEach: y.add, onError: N.add, isReady: function () { return H && b.value !== q ? Promise.resolve() : new Promise(((e, t) => { W.add([e, t]) })) }, install(e) { e.component("RouterLink", Pe), e.component("RouterView", $e), e.config.globalProperties.$router = this, Object.defineProperty(e.config.globalProperties, "$route", { enumerable: !0, get: () => t.unref(b) }), l && !J && b.value === q && (J = !0, L(a.location).catch((e => { }))); const n = {}; for (const e in q) n[e] = t.computed((() => b.value[e])); e.provide(c, this), e.provide(i, t.reactive(n)), e.provide(s, b); const r = e.unmount; ee.add(e), e.unmount = function () { ee.delete(e), ee.size < 1 && (E = q, U && U(), U = null, b.value = q, J = !1, H = !1), r() } } }; return te }, e.createRouterMatcher = z, e.createWebHashHistory = function (e) { return (e = location.host ? e || location.pathname + location.search : "").includes("#") || (e += "#"), L(e) }, e.createWebHistory = L, e.isNavigationFailure = G, e.matchedRouteKey = o, e.onBeforeRouteLeave = function (e) { const n = t.inject(o, {}).value; n && Re(n, "leaveGuards", e) }, e.onBeforeRouteUpdate = function (e) { const n = t.inject(o, {}).value; n && Re(n, "updateGuards", e) }, e.parseQuery = ye, e.routeLocationKey = i, e.routerKey = c, e.routerViewLocationKey = s, e.stringifyQuery = be, e.useLink = ke, e.useRoute = function () { return t.inject(i) }, e.useRouter = function () { return t.inject(c) }, e.viewDepthKey = a, Object.defineProperty(e, "__esModule", { value: !0 }), e }({}, Vue);