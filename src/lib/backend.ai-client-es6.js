! function(e) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).ai = e() } }(function() { for (var define, module, exports, createModuleFactory = function(e) { var t; return function(r) { return t || e(t = { exports: {}, parent: r }, t.exports), t.exports } }, _$asn1_1 = createModuleFactory(function(e, t) { var r = t;
            r.bignum = _$bn_16, r.define = _$api_2({}).define, r.base = _$base_4({}), r.constants = _$constants_8({}), r.decoders = _$decoders_10({}), r.encoders = _$encoders_13({}) }), _$encoders_13 = createModuleFactory(function(e, t) { var r = t;
            r.der = _$der_12({}), r.pem = _$pem_14({}) }), _$pem_14 = createModuleFactory(function(e, t) { var r = _$der_12({});

            function i(e) { r.call(this, e), this.enc = "pem" }
            _$inherits_browser_99(i, r), e.exports = i, i.prototype.encode = function(e, t) { for (var i = r.prototype.encode.call(this, e).toString("base64"), n = ["-----BEGIN " + t.label + "-----"], s = 0; s < i.length; s += 64) n.push(i.slice(s, s + 64)); return n.push("-----END " + t.label + "-----"), n.join("\n") } }), _$der_12 = createModuleFactory(function(e, t) { var r = _$buffer_47({}).Buffer,
                i = _$asn1_1({}),
                n = i.base,
                s = i.constants.der;

            function a(e) { this.enc = "der", this.name = e.name, this.entity = e, this.tree = new o, this.tree._init(e.body) }

            function o(e) { n.Node.call(this, "der", e) }

            function f(e) { return e < 10 ? "0" + e : e }
            e.exports = a, a.prototype.encode = function(e, t) { return this.tree._encode(e, t).join() }, _$inherits_browser_99(o, n.Node), o.prototype._encodeComposite = function(e, t, i, n) { var a, o = function(e, t, r, i) { var n; if ("seqof" === e ? e = "seq" : "setof" === e && (e = "set"), s.tagByName.hasOwnProperty(e)) n = s.tagByName[e];
                    else { if ("number" != typeof e || (0 | e) !== e) return i.error("Unknown tag: " + e);
                        n = e } return n >= 31 ? i.error("Multi-octet tag encoding unsupported") : (t || (n |= 32), n | s.tagClassByName[r || "universal"] << 6) }(e, t, i, this.reporter); if (n.length < 128) return (a = new r(2))[0] = o, a[1] = n.length, this._createEncoderBuffer([a, n]); for (var f = 1, c = n.length; c >= 256; c >>= 8) f++;
                (a = new r(2 + f))[0] = o, a[1] = 128 | f, c = 1 + f; for (var u = n.length; u > 0; c--, u >>= 8) a[c] = 255 & u; return this._createEncoderBuffer([a, n]) }, o.prototype._encodeStr = function(e, t) { if ("bitstr" === t) return this._createEncoderBuffer([0 | e.unused, e.data]); if ("bmpstr" === t) { for (var i = new r(2 * e.length), n = 0; n < e.length; n++) i.writeUInt16BE(e.charCodeAt(n), 2 * n); return this._createEncoderBuffer(i) } return "numstr" === t ? this._isNumstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: numstr supports only digits and space") : "printstr" === t ? this._isPrintstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(t) ? this._createEncoderBuffer(e) : "objDesc" === t ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: " + t + " unsupported") }, o.prototype._encodeObjid = function(e, t, i) { if ("string" == typeof e) { if (!t) return this.reporter.error("string objid given, but no values map found"); if (!t.hasOwnProperty(e)) return this.reporter.error("objid not found in values map");
                    e = t[e].split(/[\s\.]+/g); for (var n = 0; n < e.length; n++) e[n] |= 0 } else if (Array.isArray(e))
                    for (e = e.slice(), n = 0; n < e.length; n++) e[n] |= 0; if (!Array.isArray(e)) return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(e)); if (!i) { if (e[1] >= 40) return this.reporter.error("Second objid identifier OOB");
                    e.splice(0, 2, 40 * e[0] + e[1]) } var s = 0; for (n = 0; n < e.length; n++) { var a = e[n]; for (s++; a >= 128; a >>= 7) s++ } var o = new r(s),
                    f = o.length - 1; for (n = e.length - 1; n >= 0; n--)
                    for (a = e[n], o[f--] = 127 & a;
                        (a >>= 7) > 0;) o[f--] = 128 | 127 & a; return this._createEncoderBuffer(o) }, o.prototype._encodeTime = function(e, t) { var r, i = new Date(e); return "gentime" === t ? r = [f(i.getFullYear()), f(i.getUTCMonth() + 1), f(i.getUTCDate()), f(i.getUTCHours()), f(i.getUTCMinutes()), f(i.getUTCSeconds()), "Z"].join("") : "utctime" === t ? r = [f(i.getFullYear() % 100), f(i.getUTCMonth() + 1), f(i.getUTCDate()), f(i.getUTCHours()), f(i.getUTCMinutes()), f(i.getUTCSeconds()), "Z"].join("") : this.reporter.error("Encoding " + t + " time is not supported yet"), this._encodeStr(r, "octstr") }, o.prototype._encodeNull = function() { return this._createEncoderBuffer("") }, o.prototype._encodeInt = function(e, t) { if ("string" == typeof e) { if (!t) return this.reporter.error("String int or enum given, but no values map"); if (!t.hasOwnProperty(e)) return this.reporter.error("Values map doesn't contain: " + JSON.stringify(e));
                    e = t[e] } if ("number" != typeof e && !r.isBuffer(e)) { var i = e.toArray();!e.sign && 128 & i[0] && i.unshift(0), e = new r(i) } if (r.isBuffer(e)) { var n = e.length;
                    0 === e.length && n++; var s = new r(n); return e.copy(s), 0 === e.length && (s[0] = 0), this._createEncoderBuffer(s) } if (e < 128) return this._createEncoderBuffer(e); if (e < 256) return this._createEncoderBuffer([0, e]);
                n = 1; for (var a = e; a >= 256; a >>= 8) n++; for (a = (s = new Array(n)).length - 1; a >= 0; a--) s[a] = 255 & e, e >>= 8; return 128 & s[0] && s.unshift(0), this._createEncoderBuffer(new r(s)) }, o.prototype._encodeBool = function(e) { return this._createEncoderBuffer(e ? 255 : 0) }, o.prototype._use = function(e, t) { return "function" == typeof e && (e = e(t)), e._getEncoder("der").tree }, o.prototype._skipDefault = function(e, t, r) { var i, n = this._baseState; if (null === n.default) return !1; var s = e.join(); if (void 0 === n.defaultBuffer && (n.defaultBuffer = this._encodeValue(n.default, t, r).join()), s.length !== n.defaultBuffer.length) return !1; for (i = 0; i < s.length; i++)
                    if (s[i] !== n.defaultBuffer[i]) return !1;
                return !0 } }), _$decoders_10 = createModuleFactory(function(e, t) { var r = t;
            r.der = _$der_9({}), r.pem = _$pem_11({}) }), _$pem_11 = createModuleFactory(function(e, t) { var r = _$buffer_47({}).Buffer,
                i = _$der_9({});

            function n(e) { i.call(this, e), this.enc = "pem" }
            _$inherits_browser_99(n, i), e.exports = n, n.prototype.decode = function(e, t) { for (var n = e.toString().split(/[\r\n]+/g), s = t.label.toUpperCase(), a = /^-----(BEGIN|END) ([^-]+)-----$/, o = -1, f = -1, c = 0; c < n.length; c++) { var u = n[c].match(a); if (null !== u && u[2] === s) { if (-1 !== o) { if ("END" !== u[1]) break;
                            f = c; break } if ("BEGIN" !== u[1]) break;
                        o = c } } if (-1 === o || -1 === f) throw new Error("PEM section not found for: " + s); var h = n.slice(o + 1, f).join("");
                h.replace(/[^a-z0-9\+\/=]+/gi, ""); var d = new r(h, "base64"); return i.prototype.decode.call(this, d, t) } }), _$der_9 = createModuleFactory(function(e, t) { var r = _$asn1_1({}),
                i = r.base,
                n = r.bignum,
                s = r.constants.der;

            function a(e) { this.enc = "der", this.name = e.name, this.entity = e, this.tree = new o, this.tree._init(e.body) }

            function o(e) { i.Node.call(this, "der", e) }

            function f(e, t) { var r = e.readUInt8(t); if (e.isError(r)) return r; var i = s.tagClass[r >> 6],
                    n = 0 == (32 & r); if (31 == (31 & r)) { var a = r; for (r = 0; 128 == (128 & a);) { if (a = e.readUInt8(t), e.isError(a)) return a;
                        r <<= 7, r |= 127 & a } } else r &= 31; return { cls: i, primitive: n, tag: r, tagStr: s.tag[r] } }

            function c(e, t, r) { var i = e.readUInt8(r); if (e.isError(i)) return i; if (!t && 128 === i) return null; if (0 == (128 & i)) return i; var n = 127 & i; if (n > 4) return e.error("length octect is too long");
                i = 0; for (var s = 0; s < n; s++) { i <<= 8; var a = e.readUInt8(r); if (e.isError(a)) return a;
                    i |= a } return i }
            e.exports = a, a.prototype.decode = function(e, t) { return e instanceof i.DecoderBuffer || (e = new i.DecoderBuffer(e, t)), this.tree._decode(e, t) }, _$inherits_browser_99(o, i.Node), o.prototype._peekTag = function(e, t, r) { if (e.isEmpty()) return !1; var i = e.save(),
                    n = f(e, 'Failed to peek tag: "' + t + '"'); return e.isError(n) ? n : (e.restore(i), n.tag === t || n.tagStr === t || n.tagStr + "of" === t || r) }, o.prototype._decodeTag = function(e, t, r) { var i = f(e, 'Failed to decode tag of "' + t + '"'); if (e.isError(i)) return i; var n = c(e, i.primitive, 'Failed to get length of "' + t + '"'); if (e.isError(n)) return n; if (!r && i.tag !== t && i.tagStr !== t && i.tagStr + "of" !== t) return e.error('Failed to match tag: "' + t + '"'); if (i.primitive || null !== n) return e.skip(n, 'Failed to match body of: "' + t + '"'); var s = e.save(),
                    a = this._skipUntilEnd(e, 'Failed to skip indefinite length body: "' + this.tag + '"'); return e.isError(a) ? a : (n = e.offset - s.offset, e.restore(s), e.skip(n, 'Failed to match body of: "' + t + '"')) }, o.prototype._skipUntilEnd = function(e, t) { for (;;) { var r = f(e, t); if (e.isError(r)) return r; var i, n = c(e, r.primitive, t); if (e.isError(n)) return n; if (i = r.primitive || null !== n ? e.skip(n) : this._skipUntilEnd(e, t), e.isError(i)) return i; if ("end" === r.tagStr) break } }, o.prototype._decodeList = function(e, t, r, i) { for (var n = []; !e.isEmpty();) { var s = this._peekTag(e, "end"); if (e.isError(s)) return s; var a = r.decode(e, "der", i); if (e.isError(a) && s) break;
                    n.push(a) } return n }, o.prototype._decodeStr = function(e, t) { if ("bitstr" === t) { var r = e.readUInt8(); return e.isError(r) ? r : { unused: r, data: e.raw() } } if ("bmpstr" === t) { var i = e.raw(); if (i.length % 2 == 1) return e.error("Decoding of string type: bmpstr length mismatch"); for (var n = "", s = 0; s < i.length / 2; s++) n += String.fromCharCode(i.readUInt16BE(2 * s)); return n } if ("numstr" === t) { var a = e.raw().toString("ascii"); return this._isNumstr(a) ? a : e.error("Decoding of string type: numstr unsupported characters") } if ("octstr" === t) return e.raw(); if ("objDesc" === t) return e.raw(); if ("printstr" === t) { var o = e.raw().toString("ascii"); return this._isPrintstr(o) ? o : e.error("Decoding of string type: printstr unsupported characters") } return /str$/.test(t) ? e.raw().toString() : e.error("Decoding of string type: " + t + " unsupported") }, o.prototype._decodeObjid = function(e, t, r) { for (var i, n = [], s = 0; !e.isEmpty();) { var a = e.readUInt8();
                    s <<= 7, s |= 127 & a, 0 == (128 & a) && (n.push(s), s = 0) }
                128 & a && n.push(s); var o = n[0] / 40 | 0,
                    f = n[0] % 40; if (i = r ? n : [o, f].concat(n.slice(1)), t) { var c = t[i.join(" ")];
                    void 0 === c && (c = t[i.join(".")]), void 0 !== c && (i = c) } return i }, o.prototype._decodeTime = function(e, t) { var r = e.raw().toString(); if ("gentime" === t) var i = 0 | r.slice(0, 4),
                    n = 0 | r.slice(4, 6),
                    s = 0 | r.slice(6, 8),
                    a = 0 | r.slice(8, 10),
                    o = 0 | r.slice(10, 12),
                    f = 0 | r.slice(12, 14);
                else { if ("utctime" !== t) return e.error("Decoding " + t + " time is not supported yet");
                    i = 0 | r.slice(0, 2), n = 0 | r.slice(2, 4), s = 0 | r.slice(4, 6), a = 0 | r.slice(6, 8), o = 0 | r.slice(8, 10), f = 0 | r.slice(10, 12), i = i < 70 ? 2e3 + i : 1900 + i } return Date.UTC(i, n - 1, s, a, o, f, 0) }, o.prototype._decodeNull = function(e) { return null }, o.prototype._decodeBool = function(e) { var t = e.readUInt8(); return e.isError(t) ? t : 0 !== t }, o.prototype._decodeInt = function(e, t) { var r = e.raw(),
                    i = new n(r); return t && (i = t[i.toString(10)] || i), i }, o.prototype._use = function(e, t) { return "function" == typeof e && (e = e(t)), e._getDecoder("der").tree } }), _$constants_8 = createModuleFactory(function(e, t) { var r = t;
            r._reverse = function(e) { var t = {}; return Object.keys(e).forEach(function(r) {
                    (0 | r) == r && (r |= 0); var i = e[r];
                    t[i] = r }), t }, r.der = _$der_7({}) }), _$der_7 = createModuleFactory(function(e, t) { var r = _$constants_8({});
            t.tagClass = { 0: "universal", 1: "application", 2: "context", 3: "private" }, t.tagClassByName = r._reverse(t.tagClass), t.tag = { 0: "end", 1: "bool", 2: "int", 3: "bitstr", 4: "octstr", 5: "null_", 6: "objid", 7: "objDesc", 8: "external", 9: "real", 10: "enum", 11: "embed", 12: "utf8str", 13: "relativeOid", 16: "seq", 17: "set", 18: "numstr", 19: "printstr", 20: "t61str", 21: "videostr", 22: "ia5str", 23: "utctime", 24: "gentime", 25: "graphstr", 26: "iso646str", 27: "genstr", 28: "unistr", 29: "charstr", 30: "bmpstr" }, t.tagByName = r._reverse(t.tag) }), _$base_4 = createModuleFactory(function(e, t) { var r = t;
            r.Reporter = _$reporter_6.Reporter, r.DecoderBuffer = _$buffer_3({}).DecoderBuffer, r.EncoderBuffer = _$buffer_3({}).EncoderBuffer, r.Node = _$Node_5({}) }), _$Node_5 = createModuleFactory(function(e, t) { var r = _$base_4({}).Reporter,
                i = _$base_4({}).EncoderBuffer,
                n = _$base_4({}).DecoderBuffer,
                s = ["seq", "seqof", "set", "setof", "objid", "bool", "gentime", "utctime", "null_", "enum", "int", "objDesc", "bitstr", "bmpstr", "charstr", "genstr", "graphstr", "ia5str", "iso646str", "numstr", "octstr", "printstr", "t61str", "unistr", "utf8str", "videostr"],
                a = ["key", "obj", "use", "optional", "explicit", "implicit", "def", "choice", "any", "contains"].concat(s);

            function o(e, t) { var r = {};
                this._baseState = r, r.enc = e, r.parent = t || null, r.children = null, r.tag = null, r.args = null, r.reverseArgs = null, r.choice = null, r.optional = !1, r.any = !1, r.obj = !1, r.use = null, r.useDecoder = null, r.key = null, r.default = null, r.explicit = null, r.implicit = null, r.contains = null, r.parent || (r.children = [], this._wrap()) }
            e.exports = o; var f = ["enc", "parent", "children", "tag", "args", "reverseArgs", "choice", "optional", "any", "obj", "use", "alteredUse", "key", "default", "explicit", "implicit", "contains"];
            o.prototype.clone = function() { var e = this._baseState,
                    t = {};
                f.forEach(function(r) { t[r] = e[r] }); var r = new this.constructor(t.parent); return r._baseState = t, r }, o.prototype._wrap = function() { var e = this._baseState;
                a.forEach(function(t) { this[t] = function() { var r = new this.constructor(this); return e.children.push(r), r[t].apply(r, arguments) } }, this) }, o.prototype._init = function(e) { var t = this._baseState;
                e.call(this), t.children = t.children.filter(function(e) { return e._baseState.parent === this }, this) }, o.prototype._useArgs = function(e) { var t = this._baseState,
                    r = e.filter(function(e) { return e instanceof this.constructor }, this);
                e = e.filter(function(e) { return !(e instanceof this.constructor) }, this), 0 !== r.length && (t.children = r, r.forEach(function(e) { e._baseState.parent = this }, this)), 0 !== e.length && (t.args = e, t.reverseArgs = e.map(function(e) { if ("object" != typeof e || e.constructor !== Object) return e; var t = {}; return Object.keys(e).forEach(function(r) { r == (0 | r) && (r |= 0); var i = e[r];
                        t[i] = r }), t })) }, ["_peekTag", "_decodeTag", "_use", "_decodeStr", "_decodeObjid", "_decodeTime", "_decodeNull", "_decodeInt", "_decodeBool", "_decodeList", "_encodeComposite", "_encodeStr", "_encodeObjid", "_encodeTime", "_encodeNull", "_encodeInt", "_encodeBool"].forEach(function(e) { o.prototype[e] = function() { var t = this._baseState; throw new Error(e + " not implemented for encoding: " + t.enc) } }), s.forEach(function(e) { o.prototype[e] = function() { var t = this._baseState,
                        r = Array.prototype.slice.call(arguments); return t.tag = e, this._useArgs(r), this } }), o.prototype.use = function(e) { return this._baseState.use = e, this }, o.prototype.optional = function() { return this._baseState.optional = !0, this }, o.prototype.def = function(e) { var t = this._baseState; return t.default = e, t.optional = !0, this }, o.prototype.explicit = function(e) { return this._baseState.explicit = e, this }, o.prototype.implicit = function(e) { return this._baseState.implicit = e, this }, o.prototype.obj = function() { var e = this._baseState,
                    t = Array.prototype.slice.call(arguments); return e.obj = !0, 0 !== t.length && this._useArgs(t), this }, o.prototype.key = function(e) { return this._baseState.key = e, this }, o.prototype.any = function() { return this._baseState.any = !0, this }, o.prototype.choice = function(e) { return this._baseState.choice = e, this._useArgs(Object.keys(e).map(function(t) { return e[t] })), this }, o.prototype.contains = function(e) { return this._baseState.contains = e, this }, o.prototype._decode = function(e, t) { var r = this._baseState; if (null === r.parent) return e.wrapResult(r.children[0]._decode(e, t)); var i, s = r.default,
                    a = !0,
                    o = null; if (null !== r.key && (o = e.enterKey(r.key)), r.optional) { var f = null; if (null !== r.explicit ? f = r.explicit : null !== r.implicit ? f = r.implicit : null !== r.tag && (f = r.tag), null !== f || r.any) { if (a = this._peekTag(e, f, r.any), e.isError(a)) return a } else { var c = e.save(); try { null === r.choice ? this._decodeGeneric(r.tag, e, t) : this._decodeChoice(e, t), a = !0 } catch (_) { a = !1 }
                        e.restore(c) } } if (r.obj && a && (i = e.enterObject()), a) { if (null !== r.explicit) { var u = this._decodeTag(e, r.explicit); if (e.isError(u)) return u;
                        e = u } var h = e.offset; if (null === r.use && null === r.choice) { r.any && (c = e.save()); var d = this._decodeTag(e, null !== r.implicit ? r.implicit : r.tag, r.any); if (e.isError(d)) return d;
                        r.any ? s = e.raw(c) : e = d } if (t && t.track && null !== r.tag && t.track(e.path(), h, e.length, "tagged"), t && t.track && null !== r.tag && t.track(e.path(), e.offset, e.length, "content"), s = r.any ? s : null === r.choice ? this._decodeGeneric(r.tag, e, t) : this._decodeChoice(e, t), e.isError(s)) return s; if (r.any || null !== r.choice || null === r.children || r.children.forEach(function(r) { r._decode(e, t) }), r.contains && ("octstr" === r.tag || "bitstr" === r.tag)) { var l = new n(s);
                        s = this._getUse(r.contains, e._reporterState.obj)._decode(l, t) } } return r.obj && a && (s = e.leaveObject(i)), null === r.key || null === s && !0 !== a ? null !== o && e.exitKey(o) : e.leaveKey(o, r.key, s), s }, o.prototype._decodeGeneric = function(e, t, r) { var i = this._baseState; return "seq" === e || "set" === e ? null : "seqof" === e || "setof" === e ? this._decodeList(t, e, i.args[0], r) : /str$/.test(e) ? this._decodeStr(t, e, r) : "objid" === e && i.args ? this._decodeObjid(t, i.args[0], i.args[1], r) : "objid" === e ? this._decodeObjid(t, null, null, r) : "gentime" === e || "utctime" === e ? this._decodeTime(t, e, r) : "null_" === e ? this._decodeNull(t, r) : "bool" === e ? this._decodeBool(t, r) : "objDesc" === e ? this._decodeStr(t, e, r) : "int" === e || "enum" === e ? this._decodeInt(t, i.args && i.args[0], r) : null !== i.use ? this._getUse(i.use, t._reporterState.obj)._decode(t, r) : t.error("unknown tag: " + e) }, o.prototype._getUse = function(e, t) { var r = this._baseState; return r.useDecoder = this._use(e, t), r.useDecoder = r.useDecoder._baseState.children[0], r.implicit !== r.useDecoder._baseState.implicit && (r.useDecoder = r.useDecoder.clone(), r.useDecoder._baseState.implicit = r.implicit), r.useDecoder }, o.prototype._decodeChoice = function(e, t) { var r = this._baseState,
                    i = null,
                    n = !1; return Object.keys(r.choice).some(function(s) { var a = e.save(),
                        o = r.choice[s]; try { var f = o._decode(e, t); if (e.isError(f)) return !1;
                        i = { type: s, value: f }, n = !0 } catch (c) { return e.restore(a), !1 } return !0 }, this), n ? i : e.error("Choice not matched") }, o.prototype._createEncoderBuffer = function(e) { return new i(e, this.reporter) }, o.prototype._encode = function(e, t, r) { var i = this._baseState; if (null === i.default || i.default !== e) { var n = this._encodeValue(e, t, r); if (void 0 !== n && !this._skipDefault(n, t, r)) return n } }, o.prototype._encodeValue = function(e, t, i) { var n = this._baseState; if (null === n.parent) return n.children[0]._encode(e, t || new r); var s = null; if (this.reporter = t, n.optional && void 0 === e) { if (null === n.default) return;
                    e = n.default } var a = null,
                    o = !1; if (n.any) s = this._createEncoderBuffer(e);
                else if (n.choice) s = this._encodeChoice(e, t);
                else if (n.contains) a = this._getUse(n.contains, i)._encode(e, t), o = !0;
                else if (n.children) a = n.children.map(function(r) { if ("null_" === r._baseState.tag) return r._encode(null, t, e); if (null === r._baseState.key) return t.error("Child should have a key"); var i = t.enterKey(r._baseState.key); if ("object" != typeof e) return t.error("Child expected, but input is not object"); var n = r._encode(e[r._baseState.key], t, e); return t.leaveKey(i), n }, this).filter(function(e) { return e }), a = this._createEncoderBuffer(a);
                else if ("seqof" === n.tag || "setof" === n.tag) { if (!n.args || 1 !== n.args.length) return t.error("Too many args for : " + n.tag); if (!Array.isArray(e)) return t.error("seqof/setof, but data is not Array"); var f = this.clone();
                    f._baseState.implicit = null, a = this._createEncoderBuffer(e.map(function(r) { var i = this._baseState; return this._getUse(i.args[0], e)._encode(r, t) }, f)) } else null !== n.use ? s = this._getUse(n.use, i)._encode(e, t) : (a = this._encodePrimitive(n.tag, e), o = !0); if (!n.any && null === n.choice) { var c = null !== n.implicit ? n.implicit : n.tag,
                        u = null === n.implicit ? "universal" : "context";
                    null === c ? null === n.use && t.error("Tag could be omitted only for .use()") : null === n.use && (s = this._encodeComposite(c, o, u, a)) } return null !== n.explicit && (s = this._encodeComposite(n.explicit, !1, "context", s)), s }, o.prototype._encodeChoice = function(e, t) { return this._baseState.choice[e.type]._encode(e.value, t) }, o.prototype._encodePrimitive = function(e, t) { var r = this._baseState; if (/str$/.test(e)) return this._encodeStr(t, e); if ("objid" === e && r.args) return this._encodeObjid(t, r.reverseArgs[0], r.args[1]); if ("objid" === e) return this._encodeObjid(t, null, null); if ("gentime" === e || "utctime" === e) return this._encodeTime(t, e); if ("null_" === e) return this._encodeNull(); if ("int" === e || "enum" === e) return this._encodeInt(t, r.args && r.reverseArgs[0]); if ("bool" === e) return this._encodeBool(t); if ("objDesc" === e) return this._encodeStr(t, e); throw new Error("Unsupported tag: " + e) }, o.prototype._isNumstr = function(e) { return /^[0-9 ]*$/.test(e) }, o.prototype._isPrintstr = function(e) { return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(e) } }), _$buffer_3 = createModuleFactory(function(e, t) { var r = _$base_4({}).Reporter,
                i = _$buffer_47({}).Buffer;

            function n(e, t) { r.call(this, t), i.isBuffer(e) ? (this.base = e, this.offset = 0, this.length = e.length) : this.error("Input not Buffer") }

            function s(e, t) { if (Array.isArray(e)) this.length = 0, this.value = e.map(function(e) { return e instanceof s || (e = new s(e, t)), this.length += e.length, e }, this);
                else if ("number" == typeof e) { if (!(0 <= e && e <= 255)) return t.error("non-byte EncoderBuffer value");
                    this.value = e, this.length = 1 } else if ("string" == typeof e) this.value = e, this.length = i.byteLength(e);
                else { if (!i.isBuffer(e)) return t.error("Unsupported type: " + typeof e);
                    this.value = e, this.length = e.length } }
            _$inherits_browser_99(n, r), t.DecoderBuffer = n, n.prototype.save = function() { return { offset: this.offset, reporter: r.prototype.save.call(this) } }, n.prototype.restore = function(e) { var t = new n(this.base); return t.offset = e.offset, t.length = this.offset, this.offset = e.offset, r.prototype.restore.call(this, e.reporter), t }, n.prototype.isEmpty = function() { return this.offset === this.length }, n.prototype.readUInt8 = function(e) { return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, !0) : this.error(e || "DecoderBuffer overrun") }, n.prototype.skip = function(e, t) { if (!(this.offset + e <= this.length)) return this.error(t || "DecoderBuffer overrun"); var r = new n(this.base); return r._reporterState = this._reporterState, r.offset = this.offset, r.length = this.offset + e, this.offset += e, r }, n.prototype.raw = function(e) { return this.base.slice(e ? e.offset : this.offset, this.length) }, t.EncoderBuffer = s, s.prototype.join = function(e, t) { return e || (e = new i(this.length)), t || (t = 0), 0 === this.length ? e : (Array.isArray(this.value) ? this.value.forEach(function(r) { r.join(e, t), t += r.length }) : ("number" == typeof this.value ? e[t] = this.value : "string" == typeof this.value ? e.write(this.value, t) : i.isBuffer(this.value) && this.value.copy(e, t), t += this.length), e) } }), _$api_2 = createModuleFactory(function(e, t) { var r = _$asn1_1({});

            function i(e, t) { this.name = e, this.body = t, this.decoders = {}, this.encoders = {} }
            t.define = function(e, t) { return new i(e, t) }, i.prototype._createNamed = function(e) { var t; try { t = _$vmBrowserify_158({}).runInThisContext("(function " + this.name + "(entity) {\n  this._initNamed(entity);\n})") } catch (r) { t = function(e) { this._initNamed(e) } } return _$inherits_browser_99(t, e), t.prototype._initNamed = function(t) { e.call(this, t) }, new t(this) }, i.prototype._getDecoder = function(e) { return e = e || "der", this.decoders.hasOwnProperty(e) || (this.decoders[e] = this._createNamed(r.decoders[e])), this.decoders[e] }, i.prototype.decode = function(e, t, r) { return this._getDecoder(t).decode(e, r) }, i.prototype._getEncoder = function(e) { return e = e || "der", this.encoders.hasOwnProperty(e) || (this.encoders[e] = this._createNamed(r.encoders[e])), this.encoders[e] }, i.prototype.encode = function(e, t, r) { return this._getEncoder(t).encode(e, r) } }), _$vmBrowserify_158 = createModuleFactory(function(module, exports) { var indexOf = function(e, t) { if (e.indexOf) return e.indexOf(t); for (var r = 0; r < e.length; r++)
                        if (e[r] === t) return r;
                    return -1 },
                Object_keys = function(e) { if (Object.keys) return Object.keys(e); var t = []; for (var r in e) t.push(r); return t },
                forEach = function(e, t) { if (e.forEach) return e.forEach(t); for (var r = 0; r < e.length; r++) t(e[r], r, e) },
                defineProp = function() { try { return Object.defineProperty({}, "_", {}),
                            function(e, t, r) { Object.defineProperty(e, t, { writable: !0, enumerable: !1, configurable: !0, value: r }) } } catch (e) { return function(e, t, r) { e[t] = r } } }(),
                globals = ["Array", "Boolean", "Date", "Error", "EvalError", "Function", "Infinity", "JSON", "Math", "NaN", "Number", "Object", "RangeError", "ReferenceError", "RegExp", "String", "SyntaxError", "TypeError", "URIError", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "undefined", "unescape"];

            function Context() {}
            Context.prototype = {}; var Script = exports.Script = function(e) { if (!(this instanceof Script)) return new Script(e);
                this.code = e };
            Script.prototype.runInContext = function(e) { if (!(e instanceof Context)) throw new TypeError("needs a 'context' argument."); var t = document.createElement("iframe");
                t.style || (t.style = {}), t.style.display = "none", document.body.appendChild(t); var r = t.contentWindow,
                    i = r.eval,
                    n = r.execScript;!i && n && (n.call(r, "null"), i = r.eval), forEach(Object_keys(e), function(t) { r[t] = e[t] }), forEach(globals, function(t) { e[t] && (r[t] = e[t]) }); var s = Object_keys(r),
                    a = i.call(r, this.code); return forEach(Object_keys(r), function(t) {
                    (t in e || -1 === indexOf(s, t)) && (e[t] = r[t]) }), forEach(globals, function(t) { t in e || defineProp(e, t, r[t]) }), document.body.removeChild(t), a }, Script.prototype.runInThisContext = function() { return eval(this.code) }, Script.prototype.runInNewContext = function(e) { var t = Script.createContext(e),
                    r = this.runInContext(t); return e && forEach(Object_keys(t), function(r) { e[r] = t[r] }), r }, forEach(Object_keys(Script.prototype), function(e) { exports[e] = Script[e] = function(t) { var r = Script(t); return r[e].apply(r, [].slice.call(arguments, 1)) } }), exports.isContext = function(e) { return e instanceof Context }, exports.createScript = function(e) { return exports.Script(e) }, exports.createContext = Script.createContext = function(e) { var t = new Context; return "object" == typeof e && forEach(Object_keys(e), function(r) { t[r] = e[r] }), t } }), _$des_56 = createModuleFactory(function(e, t) { "use strict";
            t.utils = _$utils_61, t.Cipher = _$cipher_58, t.DES = _$des_59({}), t.CBC = _$cbc_57, t.EDE = _$ede_60({}) }), _$ede_60 = createModuleFactory(function(e, t) { "use strict"; var r = _$des_56({}),
                i = r.Cipher,
                n = r.DES;

            function s(e, t) { var r = t.slice(0, 8),
                    i = t.slice(8, 16),
                    s = t.slice(16, 24);
                this.ciphers = "encrypt" === e ? [n.create({ type: "encrypt", key: r }), n.create({ type: "decrypt", key: i }), n.create({ type: "encrypt", key: s })] : [n.create({ type: "decrypt", key: s }), n.create({ type: "encrypt", key: i }), n.create({ type: "decrypt", key: r })] }

            function a(e) { i.call(this, e); var t = new s(this.type, this.options.key);
                this._edeState = t }
            _$inherits_browser_99(a, i), e.exports = a, a.create = function(e) { return new a(e) }, a.prototype._update = function(e, t, r, i) { var n = this._edeState;
                n.ciphers[0]._update(e, t, r, i), n.ciphers[1]._update(r, i, r, i), n.ciphers[2]._update(r, i, r, i) }, a.prototype._pad = n.prototype._pad, a.prototype._unpad = n.prototype._unpad }), _$des_59 = createModuleFactory(function(e, t) { "use strict"; var r = _$des_56({}),
                i = r.utils,
                n = r.Cipher;

            function s() { this.tmp = new Array(2), this.keys = null }

            function a(e) { n.call(this, e); var t = new s;
                this._desState = t, this.deriveKeys(t, e.key) }
            _$inherits_browser_99(a, n), e.exports = a, a.create = function(e) { return new a(e) }; var o = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
            a.prototype.deriveKeys = function(e, t) { e.keys = new Array(32); var r = i.readUInt32BE(t, 0),
                    n = i.readUInt32BE(t, 4);
                i.pc1(r, n, e.tmp, 0), r = e.tmp[0], n = e.tmp[1]; for (var s = 0; s < e.keys.length; s += 2) { var a = o[s >>> 1];
                    r = i.r28shl(r, a), n = i.r28shl(n, a), i.pc2(r, n, e.keys, s) } }, a.prototype._update = function(e, t, r, n) { var s = this._desState,
                    a = i.readUInt32BE(e, t),
                    o = i.readUInt32BE(e, t + 4);
                i.ip(a, o, s.tmp, 0), a = s.tmp[0], o = s.tmp[1], "encrypt" === this.type ? this._encrypt(s, a, o, s.tmp, 0) : this._decrypt(s, a, o, s.tmp, 0), a = s.tmp[0], o = s.tmp[1], i.writeUInt32BE(r, a, n), i.writeUInt32BE(r, o, n + 4) }, a.prototype._pad = function(e, t) { for (var r = e.length - t, i = t; i < e.length; i++) e[i] = r; return !0 }, a.prototype._unpad = function(e) { for (var t = e[e.length - 1], r = e.length - t; r < e.length; r++); return e.slice(0, e.length - t) }, a.prototype._encrypt = function(e, t, r, n, s) { for (var a = t, o = r, f = 0; f < e.keys.length; f += 2) { var c = e.keys[f],
                        u = e.keys[f + 1];
                    i.expand(o, e.tmp, 0), c ^= e.tmp[0], u ^= e.tmp[1]; var h = i.substitute(c, u),
                        d = o;
                    o = (a ^ i.permute(h)) >>> 0, a = d }
                i.rip(o, a, n, s) }, a.prototype._decrypt = function(e, t, r, n, s) { for (var a = r, o = t, f = e.keys.length - 2; f >= 0; f -= 2) { var c = e.keys[f],
                        u = e.keys[f + 1];
                    i.expand(a, e.tmp, 0), c ^= e.tmp[0], u ^= e.tmp[1]; var h = i.substitute(c, u),
                        d = a;
                    a = (o ^ i.permute(h)) >>> 0, o = d }
                i.rip(a, o, n, s) } }), _$Readable_132 = createModuleFactory(function(e, t) {
            (function(t, r) { "use strict"; var i;
                e.exports = d, d.ReadableState = h, _$events_82.EventEmitter; var n = function(e, t) { return e.listeners(t).length },
                    s = _$safeBuffer_144.Buffer,
                    a = r.Uint8Array || function() {};
                _$util_49.inherits = _$inherits_browser_99; var o, f = _$empty_18({}),
                    c = void 0;
                c = f && f.debuglog ? f.debuglog("stream") : function() {}, _$util_49.inherits(d, _$streamBrowser_137); var u = ["error", "close", "destroy", "pause", "resume"];

                function h(e, t) { e = e || {}; var r = t instanceof(i = i || _$Duplex_130({}));
                    this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.readableObjectMode); var n = e.highWaterMark,
                        s = e.readableHighWaterMark,
                        a = this.objectMode ? 16 : 16384;
                    this.highWaterMark = n || 0 === n ? n : r && (s || 0 === s) ? s : a, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new _$BufferList_135, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (o || (o = _$string_decoder_138({}).StringDecoder), this.decoder = new o(e.encoding), this.encoding = e.encoding) }

                function d(e) { if (i = i || _$Duplex_130({}), !(this instanceof d)) return new d(e);
                    this._readableState = new h(e, this), this.readable = !0, e && ("function" == typeof e.read && (this._read = e.read), "function" == typeof e.destroy && (this._destroy = e.destroy)), _$streamBrowser_137.call(this) }

                function l(e, t, r, i, n) { var o, f = e._readableState; return null === t ? (f.reading = !1, function(e, t) { if (!t.ended) { if (t.decoder) { var r = t.decoder.end();
                                    r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length) }
                                t.ended = !0, m(e) } }(e, f)) : (n || (o = function(e, t) { var r, i; return i = t, s.isBuffer(i) || i instanceof a || "string" == typeof t || void 0 === t || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk")), r }(f, t)), o ? e.emit("error", o) : f.objectMode || t && t.length > 0 ? ("string" == typeof t || f.objectMode || Object.getPrototypeOf(t) === s.prototype || (t = function(e) { return s.from(e) }(t)), i ? f.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : _(e, f, t, !0) : f.ended ? e.emit("error", new Error("stream.push() after EOF")) : (f.reading = !1, f.decoder && !r ? (t = f.decoder.write(t), f.objectMode || 0 !== t.length ? _(e, f, t, !1) : y(e, f)) : _(e, f, t, !1))) : i || (f.reading = !1)),
                        function(e) { return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length) }(f) }

                function _(e, t, r, i) { t.flowing && 0 === t.length && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && m(e)), y(e, t) }
                Object.defineProperty(d.prototype, "destroyed", { get: function() { return void 0 !== this._readableState && this._readableState.destroyed }, set: function(e) { this._readableState && (this._readableState.destroyed = e) } }), d.prototype.destroy = _$destroy_136.destroy, d.prototype._undestroy = _$destroy_136.undestroy, d.prototype._destroy = function(e, t) { this.push(null), t(e) }, d.prototype.push = function(e, t) { var r, i = this._readableState; return i.objectMode ? r = !0 : "string" == typeof e && ((t = t || i.defaultEncoding) !== i.encoding && (e = s.from(e, t), t = ""), r = !0), l(this, e, t, !1, r) }, d.prototype.unshift = function(e) { return l(this, e, null, !0, !1) }, d.prototype.isPaused = function() { return !1 === this._readableState.flowing }, d.prototype.setEncoding = function(e) { return o || (o = _$string_decoder_138({}).StringDecoder), this._readableState.decoder = new o(e), this._readableState.encoding = e, this }; var p = 8388608;

                function b(e, t) { return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function(e) { return e >= p ? e = p : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e }(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0)) }

                function m(e) { var t = e._readableState;
                    t.needReadable = !1, t.emittedReadable || (c("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? _$processNextickArgs_116.nextTick(g, e) : g(e)) }

                function g(e) { c("emit readable"), e.emit("readable"), S(e) }

                function y(e, t) { t.readingMore || (t.readingMore = !0, _$processNextickArgs_116.nextTick(v, e, t)) }

                function v(e, t) { for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (c("maybeReadMore read 0"), e.read(0), r !== t.length);) r = t.length;
                    t.readingMore = !1 }

                function w(e) { c("readable nexttick read 0"), e.read(0) }

                function $(e, t) { t.reading || (c("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), S(e), t.flowing && !t.reading && e.read(0) }

                function S(e) { var t = e._readableState; for (c("flow", t.flowing); t.flowing && null !== e.read();); }

                function B(e, t) { return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), t.buffer.clear()) : r = function(e, t, r) { var i; return e < t.head.data.length ? (i = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : i = e === t.head.data.length ? t.shift() : r ? function(e, t) { var r = t.head,
                                i = 1,
                                n = r.data; for (e -= n.length; r = r.next;) { var s = r.data,
                                    a = e > s.length ? s.length : e; if (a === s.length ? n += s : n += s.slice(0, e), 0 == (e -= a)) { a === s.length ? (++i, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, r.data = s.slice(a)); break }++i } return t.length -= i, n }(e, t) : function(e, t) { var r = s.allocUnsafe(e),
                                i = t.head,
                                n = 1; for (i.data.copy(r), e -= i.data.length; i = i.next;) { var a = i.data,
                                    o = e > a.length ? a.length : e; if (a.copy(r, r.length - e, 0, o), 0 == (e -= o)) { o === a.length ? (++n, i.next ? t.head = i.next : t.head = t.tail = null) : (t.head = i, i.data = a.slice(o)); break }++n } return t.length -= n, r }(e, t), i }(e, t.buffer, t.decoder), r); var r }

                function E(e) { var t = e._readableState; if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
                    t.endEmitted || (t.ended = !0, _$processNextickArgs_116.nextTick(M, t, e)) }

                function M(e, t) { e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end")) }

                function k(e, t) { for (var r = 0, i = e.length; r < i; r++)
                        if (e[r] === t) return r;
                    return -1 }
                d.prototype.read = function(e) { c("read", e), e = parseInt(e, 10); var t = this._readableState,
                        r = e; if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return c("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? E(this) : m(this), null; if (0 === (e = b(e, t)) && t.ended) return 0 === t.length && E(this), null; var i, n = t.needReadable; return c("need readable", n), (0 === t.length || t.length - e < t.highWaterMark) && c("length less than watermark", n = !0), t.ended || t.reading ? c("reading or ended", n = !1) : n && (c("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = b(r, t))), null === (i = e > 0 ? B(e, t) : null) ? (t.needReadable = !0, e = 0) : t.length -= e, 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && E(this)), null !== i && this.emit("data", i), i }, d.prototype._read = function(e) { this.emit("error", new Error("_read() is not implemented")) }, d.prototype.pipe = function(e, r) { var i = this,
                        s = this._readableState; switch (s.pipesCount) {
                        case 0:
                            s.pipes = e; break;
                        case 1:
                            s.pipes = [s.pipes, e]; break;
                        default:
                            s.pipes.push(e) }
                    s.pipesCount += 1, c("pipe count=%d opts=%j", s.pipesCount, r); var a = r && !1 === r.end || e === t.stdout || e === t.stderr ? b : o;

                    function o() { c("onend"), e.end() }
                    s.endEmitted ? _$processNextickArgs_116.nextTick(a) : i.once("end", a), e.on("unpipe", function t(r, n) { c("onunpipe"), r === i && n && !1 === n.hasUnpiped && (n.hasUnpiped = !0, c("cleanup"), e.removeListener("close", _), e.removeListener("finish", p), e.removeListener("drain", f), e.removeListener("error", l), e.removeListener("unpipe", t), i.removeListener("end", o), i.removeListener("end", b), i.removeListener("data", d), u = !0, !s.awaitDrain || e._writableState && !e._writableState.needDrain || f()) }); var f = function(e) { return function() { var t = e._readableState;
                            c("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && n(e, "data") && (t.flowing = !0, S(e)) } }(i);
                    e.on("drain", f); var u = !1,
                        h = !1;

                    function d(t) { c("ondata"), h = !1, !1 !== e.write(t) || h || ((1 === s.pipesCount && s.pipes === e || s.pipesCount > 1 && -1 !== k(s.pipes, e)) && !u && (c("false write response, pause", i._readableState.awaitDrain), i._readableState.awaitDrain++, h = !0), i.pause()) }

                    function l(t) { c("onerror", t), b(), e.removeListener("error", l), 0 === n(e, "error") && e.emit("error", t) }

                    function _() { e.removeListener("finish", p), b() }

                    function p() { c("onfinish"), e.removeListener("close", _), b() }

                    function b() { c("unpipe"), i.unpipe(e) } return i.on("data", d),
                        function(e, t, r) { if ("function" == typeof e.prependListener) return e.prependListener("error", r);
                            e._events && e._events.error ? _$isarray_101(e._events.error) ? e._events.error.unshift(r) : e._events.error = [r, e._events.error] : e.on("error", r) }(e, 0, l), e.once("close", _), e.once("finish", p), e.emit("pipe", i), s.flowing || (c("pipe resume"), i.resume()), e }, d.prototype.unpipe = function(e) { var t = this._readableState,
                        r = { hasUnpiped: !1 }; if (0 === t.pipesCount) return this; if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r), this); if (!e) { var i = t.pipes,
                            n = t.pipesCount;
                        t.pipes = null, t.pipesCount = 0, t.flowing = !1; for (var s = 0; s < n; s++) i[s].emit("unpipe", this, r); return this } var a = k(t.pipes, e); return -1 === a ? this : (t.pipes.splice(a, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r), this) }, d.prototype.on = function(e, t) { var r = _$streamBrowser_137.prototype.on.call(this, e, t); if ("data" === e) !1 !== this._readableState.flowing && this.resume();
                    else if ("readable" === e) { var i = this._readableState;
                        i.endEmitted || i.readableListening || (i.readableListening = i.needReadable = !0, i.emittedReadable = !1, i.reading ? i.length && m(this) : _$processNextickArgs_116.nextTick(w, this)) } return r }, d.prototype.addListener = d.prototype.on, d.prototype.resume = function() { var e = this._readableState; return e.flowing || (c("resume"), e.flowing = !0, function(e, t) { t.resumeScheduled || (t.resumeScheduled = !0, _$processNextickArgs_116.nextTick($, e, t)) }(this, e)), this }, d.prototype.pause = function() { return c("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (c("pause"), this._readableState.flowing = !1, this.emit("pause")), this }, d.prototype.wrap = function(e) { var t = this,
                        r = this._readableState,
                        i = !1; for (var n in e.on("end", function() { if (c("wrapped end"), r.decoder && !r.ended) { var e = r.decoder.end();
                                e && e.length && t.push(e) }
                            t.push(null) }), e.on("data", function(n) { c("wrapped data"), r.decoder && (n = r.decoder.write(n)), r.objectMode && null == n || (r.objectMode || n && n.length) && (t.push(n) || (i = !0, e.pause())) }), e) void 0 === this[n] && "function" == typeof e[n] && (this[n] = function(t) { return function() { return e[t].apply(e, arguments) } }(n)); for (var s = 0; s < u.length; s++) e.on(u[s], this.emit.bind(this, u[s])); return this._read = function(t) { c("wrapped _read", t), i && (i = !1, e.resume()) }, this }, Object.defineProperty(d.prototype, "readableHighWaterMark", { enumerable: !1, get: function() { return this._readableState.highWaterMark } }), d._fromList = B }).call(this, _$browser_117, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}) }), _$string_decoder_138 = createModuleFactory(function(e, t) { "use strict"; var r = _$safeBuffer_144.Buffer,
                i = r.isEncoding || function(e) { switch ((e = "" + e) && e.toLowerCase()) {
                        case "hex":
                        case "utf8":
                        case "utf-8":
                        case "ascii":
                        case "binary":
                        case "base64":
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                        case "raw":
                            return !0;
                        default:
                            return !1 } };

            function n(e) { var t; switch (this.encoding = function(e) { var t = function(e) { if (!e) return "utf8"; for (var t;;) switch (e) {
                            case "utf8":
                            case "utf-8":
                                return "utf8";
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return "utf16le";
                            case "latin1":
                            case "binary":
                                return "latin1";
                            case "base64":
                            case "ascii":
                            case "hex":
                                return e;
                            default:
                                if (t) return;
                                e = ("" + e).toLowerCase(), t = !0 } }(e); if ("string" != typeof t && (r.isEncoding === i || !i(e))) throw new Error("Unknown encoding: " + e); return t || e }(e), this.encoding) {
                    case "utf16le":
                        this.text = o, this.end = f, t = 4; break;
                    case "utf8":
                        this.fillLast = a, t = 4; break;
                    case "base64":
                        this.text = c, this.end = u, t = 3; break;
                    default:
                        return this.write = h, void(this.end = d) }
                this.lastNeed = 0, this.lastTotal = 0, this.lastChar = r.allocUnsafe(t) }

            function s(e) { return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2 }

            function a(e) { var t = this.lastTotal - this.lastNeed,
                    r = function(e, t, r) { if (128 != (192 & t[0])) return e.lastNeed = 0, "\ufffd"; if (e.lastNeed > 1 && t.length > 1) { if (128 != (192 & t[1])) return e.lastNeed = 1, "\ufffd"; if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2])) return e.lastNeed = 2, "\ufffd" } }(this, e); return void 0 !== r ? r : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length), void(this.lastNeed -= e.length)) }

            function o(e, t) { if ((e.length - t) % 2 == 0) { var r = e.toString("utf16le", t); if (r) { var i = r.charCodeAt(r.length - 1); if (i >= 55296 && i <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1], r.slice(0, -1) } return r } return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], e.toString("utf16le", t, e.length - 1) }

            function f(e) { var t = e && e.length ? this.write(e) : ""; if (this.lastNeed) { var r = this.lastTotal - this.lastNeed; return t + this.lastChar.toString("utf16le", 0, r) } return t }

            function c(e, t) { var r = (e.length - t) % 3; return 0 === r ? e.toString("base64", t) : (this.lastNeed = 3 - r, this.lastTotal = 3, 1 === r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - r)) }

            function u(e) { var t = e && e.length ? this.write(e) : ""; return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t }

            function h(e) { return e.toString(this.encoding) }

            function d(e) { return e && e.length ? this.write(e) : "" }
            t.StringDecoder = n, n.prototype.write = function(e) { if (0 === e.length) return ""; var t, r; if (this.lastNeed) { if (void 0 === (t = this.fillLast(e))) return "";
                    r = this.lastNeed, this.lastNeed = 0 } else r = 0; return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || "" }, n.prototype.end = function(e) { var t = e && e.length ? this.write(e) : ""; return this.lastNeed ? t + "\ufffd" : t }, n.prototype.text = function(e, t) { var r = function(e, t, r) { var i = t.length - 1; if (i < r) return 0; var n = s(t[i]); return n >= 0 ? (n > 0 && (e.lastNeed = n - 1), n) : --i < r || -2 === n ? 0 : (n = s(t[i])) >= 0 ? (n > 0 && (e.lastNeed = n - 2), n) : --i < r || -2 === n ? 0 : (n = s(t[i])) >= 0 ? (n > 0 && (2 === n ? n = 0 : e.lastNeed = n - 3), n) : 0 }(this, e, t); if (!this.lastNeed) return e.toString("utf8", t);
                this.lastTotal = r; var i = e.length - (r - this.lastNeed); return e.copy(this.lastChar, 0, i), e.toString("utf8", t, i) }, n.prototype.fillLast = function(e) { if (this.lastNeed <= e.length) return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
                e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length } }), _$Duplex_130 = createModuleFactory(function(e, t) { "use strict"; var r = Object.keys || function(e) { var t = []; for (var r in e) t.push(r); return t };
            e.exports = f, _$util_49.inherits = _$inherits_browser_99; var i = _$Readable_132({}),
                n = _$Writable_134({});
            _$util_49.inherits(f, i); for (var s = r(n.prototype), a = 0; a < s.length; a++) { var o = s[a];
                f.prototype[o] || (f.prototype[o] = n.prototype[o]) }

            function f(e) { if (!(this instanceof f)) return new f(e);
                i.call(this, e), n.call(this, e), e && !1 === e.readable && (this.readable = !1), e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), this.once("end", c) }

            function c() { this.allowHalfOpen || this._writableState.ended || _$processNextickArgs_116.nextTick(u, this) }

            function u(e) { e.end() }
            Object.defineProperty(f.prototype, "writableHighWaterMark", { enumerable: !1, get: function() { return this._writableState.highWaterMark } }), Object.defineProperty(f.prototype, "destroyed", { get: function() { return void 0 !== this._readableState && void 0 !== this._writableState && this._readableState.destroyed && this._writableState.destroyed }, set: function(e) { void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e) } }), f.prototype._destroy = function(e, t) { this.push(null), this.end(), _$processNextickArgs_116.nextTick(t, e) } }), _$Writable_134 = createModuleFactory(function(e, t) {
            (function(t, r, i) { "use strict";

                function n(e) { var t = this;
                    this.next = null, this.entry = null, this.finish = function() {! function(e, t, r) { var i = e.entry; for (e.entry = null; i;) { var n = i.callback;
                                t.pendingcb--, n(void 0), i = i.next }
                            t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e }(t, e) } }
                e.exports = l; var s, a = !t.browser && ["v0.10", "v0.9."].indexOf(t.version.slice(0, 5)) > -1 ? i : _$processNextickArgs_116.nextTick;
                l.WritableState = d, _$util_49.inherits = _$inherits_browser_99; var o, f = { deprecate: _$browser_157 },
                    c = _$safeBuffer_144.Buffer,
                    u = r.Uint8Array || function() {};

                function h() {}

                function d(e, t) { s = s || _$Duplex_130({}), e = e || {}; var r = t instanceof s;
                    this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.writableObjectMode); var i = e.highWaterMark,
                        o = e.writableHighWaterMark,
                        f = this.objectMode ? 16 : 16384;
                    this.highWaterMark = i || 0 === i ? i : r && (o || 0 === o) ? o : f, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1; var c = !1 === e.decodeStrings;
                    this.decodeStrings = !c, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(e) {! function(e, t) { var r = e._writableState,
                                i = r.sync,
                                n = r.writecb; if (function(e) { e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0 }(r), t) ! function(e, t, r, i, n) {--t.pendingcb, r ? (_$processNextickArgs_116.nextTick(n, i), _$processNextickArgs_116.nextTick(y, e, t), e._writableState.errorEmitted = !0, e.emit("error", i)) : (n(i), e._writableState.errorEmitted = !0, e.emit("error", i), y(e, t)) }(e, r, i, t, n);
                            else { var s = m(r);
                                s || r.corked || r.bufferProcessing || !r.bufferedRequest || b(e, r), i ? a(p, e, r, s, n) : p(e, r, s, n) } }(t, e) }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new n(this) }

                function l(e) { if (s = s || _$Duplex_130({}), !(o.call(l, this) || this instanceof s)) return new l(e);
                    this._writableState = new d(e, this), this.writable = !0, e && ("function" == typeof e.write && (this._write = e.write), "function" == typeof e.writev && (this._writev = e.writev), "function" == typeof e.destroy && (this._destroy = e.destroy), "function" == typeof e.final && (this._final = e.final)), _$streamBrowser_137.call(this) }

                function _(e, t, r, i, n, s, a) { t.writelen = i, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(n, t.onwrite) : e._write(n, s, t.onwrite), t.sync = !1 }

                function p(e, t, r, i) { r || function(e, t) { 0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain")) }(e, t), t.pendingcb--, i(), y(e, t) }

                function b(e, t) { t.bufferProcessing = !0; var r = t.bufferedRequest; if (e._writev && r && r.next) { var i = t.bufferedRequestCount,
                            s = new Array(i),
                            a = t.corkedRequestsFree;
                        a.entry = r; for (var o = 0, f = !0; r;) s[o] = r, r.isBuf || (f = !1), r = r.next, o += 1;
                        s.allBuffers = f, _(e, t, !0, t.length, s, "", a.finish), t.pendingcb++, t.lastBufferedRequest = null, a.next ? (t.corkedRequestsFree = a.next, a.next = null) : t.corkedRequestsFree = new n(t), t.bufferedRequestCount = 0 } else { for (; r;) { var c = r.chunk,
                                u = r.encoding,
                                h = r.callback; if (_(e, t, !1, t.objectMode ? 1 : c.length, c, u, h), r = r.next, t.bufferedRequestCount--, t.writing) break }
                        null === r && (t.lastBufferedRequest = null) }
                    t.bufferedRequest = r, t.bufferProcessing = !1 }

                function m(e) { return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing }

                function g(e, t) { e._final(function(r) { t.pendingcb--, r && e.emit("error", r), t.prefinished = !0, e.emit("prefinish"), y(e, t) }) }

                function y(e, t) { var r = m(t); return r && (function(e, t) { t.prefinished || t.finalCalled || ("function" == typeof e._final ? (t.pendingcb++, t.finalCalled = !0, _$processNextickArgs_116.nextTick(g, e, t)) : (t.prefinished = !0, e.emit("prefinish"))) }(e, t), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"))), r }
                _$util_49.inherits(l, _$streamBrowser_137), d.prototype.getBuffer = function() { for (var e = this.bufferedRequest, t = []; e;) t.push(e), e = e.next; return t },
                    function() { try { Object.defineProperty(d.prototype, "buffer", { get: f.deprecate(function() { return this.getBuffer() }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003") }) } catch (e) {} }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (o = Function.prototype[Symbol.hasInstance], Object.defineProperty(l, Symbol.hasInstance, { value: function(e) { return !!o.call(this, e) || this === l && e && e._writableState instanceof d } })) : o = function(e) { return e instanceof this }, l.prototype.pipe = function() { this.emit("error", new Error("Cannot pipe, not readable")) }, l.prototype.write = function(e, t, r) { var i, n = this._writableState,
                            s = !1,
                            a = !n.objectMode && (i = e, c.isBuffer(i) || i instanceof u); return a && !c.isBuffer(e) && (e = function(e) { return c.from(e) }(e)), "function" == typeof t && (r = t, t = null), a ? t = "buffer" : t || (t = n.defaultEncoding), "function" != typeof r && (r = h), n.ended ? function(e, t) { var r = new Error("write after end");
                            e.emit("error", r), _$processNextickArgs_116.nextTick(t, r) }(this, r) : (a || function(e, t, r, i) { var n = !0,
                                s = !1; return null === r ? s = new TypeError("May not write null values to stream") : "string" == typeof r || void 0 === r || t.objectMode || (s = new TypeError("Invalid non-string/buffer chunk")), s && (e.emit("error", s), _$processNextickArgs_116.nextTick(i, s), n = !1), n }(this, n, e, r)) && (n.pendingcb++, s = function(e, t, r, i, n, s) { if (!r) { var a = function(e, t, r) { return e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = c.from(t, r)), t }(t, i, n);
                                i !== a && (r = !0, n = "buffer", i = a) } var o = t.objectMode ? 1 : i.length;
                            t.length += o; var f = t.length < t.highWaterMark; if (f || (t.needDrain = !0), t.writing || t.corked) { var u = t.lastBufferedRequest;
                                t.lastBufferedRequest = { chunk: i, encoding: n, isBuf: r, callback: s, next: null }, u ? u.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1 } else _(e, t, !1, o, i, n, s); return f }(this, n, a, e, t, r)), s }, l.prototype.cork = function() { this._writableState.corked++ }, l.prototype.uncork = function() { var e = this._writableState;
                        e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || b(this, e)) }, l.prototype.setDefaultEncoding = function(e) { if ("string" == typeof e && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + e); return this._writableState.defaultEncoding = e, this }, Object.defineProperty(l.prototype, "writableHighWaterMark", { enumerable: !1, get: function() { return this._writableState.highWaterMark } }), l.prototype._write = function(e, t, r) { r(new Error("_write() is not implemented")) }, l.prototype._writev = null, l.prototype.end = function(e, t, r) { var i = this._writableState; "function" == typeof e ? (r = e, e = null, t = null) : "function" == typeof t && (r = t, t = null), null != e && this.write(e, t), i.corked && (i.corked = 1, this.uncork()), i.ending || i.finished || function(e, t, r) { t.ending = !0, y(e, t), r && (t.finished ? _$processNextickArgs_116.nextTick(r) : e.once("finish", r)), t.ended = !0, e.writable = !1 }(this, i, r) }, Object.defineProperty(l.prototype, "destroyed", { get: function() { return void 0 !== this._writableState && this._writableState.destroyed }, set: function(e) { this._writableState && (this._writableState.destroyed = e) } }), l.prototype.destroy = _$destroy_136.destroy, l.prototype._undestroy = _$destroy_136.undestroy, l.prototype._destroy = function(e, t) { this.end(), t(e) } }).call(this, _$browser_117, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, _$main_156({}).setImmediate) }), _$main_156 = createModuleFactory(function(e, t) {
            (function(e, r) { var i = _$browser_117.nextTick,
                    n = (Function.prototype.apply, Array.prototype.slice),
                    s = {},
                    a = 0;

                function o(e, t) { this._id = e, this._clearFn = t }
                o.prototype.unref = o.prototype.ref = function() {}, o.prototype.close = function() { this._clearFn.call(window, this._id) }, t.setImmediate = "function" == typeof e ? e : function(e) { var r = a++,
                        o = !(arguments.length < 2) && n.call(arguments, 1); return s[r] = !0, i(function() { s[r] && (o ? e.apply(null, o) : e.call(null), t.clearImmediate(r)) }), r }, t.clearImmediate = "function" == typeof r ? r : function(e) { delete s[e] } }).call(this, _$main_156({}).setImmediate, _$main_156({}).clearImmediate) }), _$empty_18 = createModuleFactory(function(e, t) {}), _$buffer_47 = createModuleFactory(function(e, t) {
            (function(e) { "use strict"; var r = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
                t.Buffer = e, t.SlowBuffer = function(t) { return +t != t && (t = 0), e.alloc(+t) }, t.INSPECT_MAX_BYTES = 50; var i = 2147483647;

                function n(t) { if (t > i) throw new RangeError('The value "' + t + '" is invalid for option "size"'); var r = new Uint8Array(t); return Object.setPrototypeOf(r, e.prototype), r }

                function e(e, t, r) { if ("number" == typeof e) { if ("string" == typeof t) throw new TypeError('The "string" argument must be of type string. Received type number'); return o(e) } return s(e, t, r) }

                function s(t, r, i) { if ("string" == typeof t) return function(t, r) { if ("string" == typeof r && "" !== r || (r = "utf8"), !e.isEncoding(r)) throw new TypeError("Unknown encoding: " + r); var i = 0 | u(t, r),
                            s = n(i),
                            a = s.write(t, r); return a !== i && (s = s.slice(0, a)), s }(t, r); if (ArrayBuffer.isView(t)) return f(t); if (null == t) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t); if (q(t, ArrayBuffer) || t && q(t.buffer, ArrayBuffer)) return function(t, r, i) { if (r < 0 || t.byteLength < r) throw new RangeError('"offset" is outside of buffer bounds'); if (t.byteLength < r + (i || 0)) throw new RangeError('"length" is outside of buffer bounds'); var n; return n = void 0 === r && void 0 === i ? new Uint8Array(t) : void 0 === i ? new Uint8Array(t, r) : new Uint8Array(t, r, i), Object.setPrototypeOf(n, e.prototype), n }(t, r, i); if ("number" == typeof t) throw new TypeError('The "value" argument must not be of type number. Received type number'); var s = t.valueOf && t.valueOf(); if (null != s && s !== t) return e.from(s, r, i); var a = function(t) { if (e.isBuffer(t)) { var r = 0 | c(t.length),
                                i = n(r); return 0 === i.length ? i : (t.copy(i, 0, 0, r), i) } return void 0 !== t.length ? "number" != typeof t.length || O(t.length) ? n(0) : f(t) : "Buffer" === t.type && Array.isArray(t.data) ? f(t.data) : void 0 }(t); if (a) return a; if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof t[Symbol.toPrimitive]) return e.from(t[Symbol.toPrimitive]("string"), r, i); throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t) }

                function a(e) { if ("number" != typeof e) throw new TypeError('"size" argument must be of type number'); if (e < 0) throw new RangeError('The value "' + e + '" is invalid for option "size"') }

                function o(e) { return a(e), n(e < 0 ? 0 : 0 | c(e)) }

                function f(e) { for (var t = e.length < 0 ? 0 : 0 | c(e.length), r = n(t), i = 0; i < t; i += 1) r[i] = 255 & e[i]; return r }

                function c(e) { if (e >= i) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes"); return 0 | e }

                function u(t, r) { if (e.isBuffer(t)) return t.length; if (ArrayBuffer.isView(t) || q(t, ArrayBuffer)) return t.byteLength; if ("string" != typeof t) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof t); var i = t.length,
                        n = arguments.length > 2 && !0 === arguments[2]; if (!n && 0 === i) return 0; for (var s = !1;;) switch (r) {
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return i;
                        case "utf8":
                        case "utf-8":
                            return R(t).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return 2 * i;
                        case "hex":
                            return i >>> 1;
                        case "base64":
                            return T(t).length;
                        default:
                            if (s) return n ? -1 : R(t).length;
                            r = ("" + r).toLowerCase(), s = !0 } }

                function h(e, t, r) { var i = e[t];
                    e[t] = e[r], e[r] = i }

                function d(t, r, i, n, s) { if (0 === t.length) return -1; if ("string" == typeof i ? (n = i, i = 0) : i > 2147483647 ? i = 2147483647 : i < -2147483648 && (i = -2147483648), O(i = +i) && (i = s ? 0 : t.length - 1), i < 0 && (i = t.length + i), i >= t.length) { if (s) return -1;
                        i = t.length - 1 } else if (i < 0) { if (!s) return -1;
                        i = 0 } if ("string" == typeof r && (r = e.from(r, n)), e.isBuffer(r)) return 0 === r.length ? -1 : l(t, r, i, n, s); if ("number" == typeof r) return r &= 255, "function" == typeof Uint8Array.prototype.indexOf ? s ? Uint8Array.prototype.indexOf.call(t, r, i) : Uint8Array.prototype.lastIndexOf.call(t, r, i) : l(t, [r], i, n, s); throw new TypeError("val must be string, number or Buffer") }

                function l(e, t, r, i, n) { var s, a = 1,
                        o = e.length,
                        f = t.length; if (void 0 !== i && ("ucs2" === (i = String(i).toLowerCase()) || "ucs-2" === i || "utf16le" === i || "utf-16le" === i)) { if (e.length < 2 || t.length < 2) return -1;
                        a = 2, o /= 2, f /= 2, r /= 2 }

                    function c(e, t) { return 1 === a ? e[t] : e.readUInt16BE(t * a) } if (n) { var u = -1; for (s = r; s < o; s++)
                            if (c(e, s) === c(t, -1 === u ? 0 : s - u)) { if (-1 === u && (u = s), s - u + 1 === f) return u * a } else -1 !== u && (s -= s - u), u = -1 } else
                        for (r + f > o && (r = o - f), s = r; s >= 0; s--) { for (var h = !0, d = 0; d < f; d++)
                                if (c(e, s + d) !== c(t, d)) { h = !1; break }
                            if (h) return s }
                    return -1 }

                function _(e, t, r, i) { r = Number(r) || 0; var n = e.length - r;
                    i ? (i = Number(i)) > n && (i = n) : i = n; var s = t.length;
                    i > s / 2 && (i = s / 2); for (var a = 0; a < i; ++a) { var o = parseInt(t.substr(2 * a, 2), 16); if (O(o)) return a;
                        e[r + a] = o } return a }

                function p(e, t, r, i) { return j(R(t, e.length - r), e, r, i) }

                function b(e, t, r, i) { return j(function(e) { for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r)); return t }(t), e, r, i) }

                function m(e, t, r, i) { return b(e, t, r, i) }

                function g(e, t, r, i) { return j(T(t), e, r, i) }

                function y(e, t, r, i) { return j(function(e, t) { for (var r, i, n, s = [], a = 0; a < e.length && !((t -= 2) < 0); ++a) i = (r = e.charCodeAt(a)) >> 8, n = r % 256, s.push(n), s.push(i); return s }(t, e.length - r), e, r, i) }

                function v(e, t, r) { return 0 === t && r === e.length ? _$base64Js_15.fromByteArray(e) : _$base64Js_15.fromByteArray(e.slice(t, r)) }

                function w(e, t, r) { r = Math.min(e.length, r); for (var i = [], n = t; n < r;) { var s, a, o, f, c = e[n],
                            u = null,
                            h = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1; if (n + h <= r) switch (h) {
                            case 1:
                                c < 128 && (u = c); break;
                            case 2:
                                128 == (192 & (s = e[n + 1])) && (f = (31 & c) << 6 | 63 & s) > 127 && (u = f); break;
                            case 3:
                                s = e[n + 1], a = e[n + 2], 128 == (192 & s) && 128 == (192 & a) && (f = (15 & c) << 12 | (63 & s) << 6 | 63 & a) > 2047 && (f < 55296 || f > 57343) && (u = f); break;
                            case 4:
                                s = e[n + 1], a = e[n + 2], o = e[n + 3], 128 == (192 & s) && 128 == (192 & a) && 128 == (192 & o) && (f = (15 & c) << 18 | (63 & s) << 12 | (63 & a) << 6 | 63 & o) > 65535 && f < 1114112 && (u = f) }
                        null === u ? (u = 65533, h = 1) : u > 65535 && (u -= 65536, i.push(u >>> 10 & 1023 | 55296), u = 56320 | 1023 & u), i.push(u), n += h } return function(e) { var t = e.length; if (t <= $) return String.fromCharCode.apply(String, e); for (var r = "", i = 0; i < t;) r += String.fromCharCode.apply(String, e.slice(i, i += $)); return r }(i) }
                t.kMaxLength = i, e.TYPED_ARRAY_SUPPORT = function() { try { var e = new Uint8Array(1),
                            t = { foo: function() { return 42 } }; return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(e, t), 42 === e.foo() } catch (r) { return !1 } }(), e.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(e.prototype, "parent", { enumerable: !0, get: function() { if (e.isBuffer(this)) return this.buffer } }), Object.defineProperty(e.prototype, "offset", { enumerable: !0, get: function() { if (e.isBuffer(this)) return this.byteOffset } }), "undefined" != typeof Symbol && null != Symbol.species && e[Symbol.species] === e && Object.defineProperty(e, Symbol.species, { value: null, configurable: !0, enumerable: !1, writable: !1 }), e.poolSize = 8192, e.from = function(e, t, r) { return s(e, t, r) }, Object.setPrototypeOf(e.prototype, Uint8Array.prototype), Object.setPrototypeOf(e, Uint8Array), e.alloc = function(e, t, r) { return function(e, t, r) { return a(e), e <= 0 ? n(e) : void 0 !== t ? "string" == typeof r ? n(e).fill(t, r) : n(e).fill(t) : n(e) }(e, t, r) }, e.allocUnsafe = function(e) { return o(e) }, e.allocUnsafeSlow = function(e) { return o(e) }, e.isBuffer = function(t) { return null != t && !0 === t._isBuffer && t !== e.prototype }, e.compare = function(t, r) { if (q(t, Uint8Array) && (t = e.from(t, t.offset, t.byteLength)), q(r, Uint8Array) && (r = e.from(r, r.offset, r.byteLength)), !e.isBuffer(t) || !e.isBuffer(r)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'); if (t === r) return 0; for (var i = t.length, n = r.length, s = 0, a = Math.min(i, n); s < a; ++s)
                        if (t[s] !== r[s]) { i = t[s], n = r[s]; break }
                    return i < n ? -1 : n < i ? 1 : 0 }, e.isEncoding = function(e) { switch (String(e).toLowerCase()) {
                        case "hex":
                        case "utf8":
                        case "utf-8":
                        case "ascii":
                        case "latin1":
                        case "binary":
                        case "base64":
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return !0;
                        default:
                            return !1 } }, e.concat = function(t, r) { if (!Array.isArray(t)) throw new TypeError('"list" argument must be an Array of Buffers'); if (0 === t.length) return e.alloc(0); var i; if (void 0 === r)
                        for (r = 0, i = 0; i < t.length; ++i) r += t[i].length; var n = e.allocUnsafe(r),
                        s = 0; for (i = 0; i < t.length; ++i) { var a = t[i]; if (q(a, Uint8Array) && (a = e.from(a)), !e.isBuffer(a)) throw new TypeError('"list" argument must be an Array of Buffers');
                        a.copy(n, s), s += a.length } return n }, e.byteLength = u, e.prototype._isBuffer = !0, e.prototype.swap16 = function() { var e = this.length; if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits"); for (var t = 0; t < e; t += 2) h(this, t, t + 1); return this }, e.prototype.swap32 = function() { var e = this.length; if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits"); for (var t = 0; t < e; t += 4) h(this, t, t + 3), h(this, t + 1, t + 2); return this }, e.prototype.swap64 = function() { var e = this.length; if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits"); for (var t = 0; t < e; t += 8) h(this, t, t + 7), h(this, t + 1, t + 6), h(this, t + 2, t + 5), h(this, t + 3, t + 4); return this }, e.prototype.toString = function() { var e = this.length; return 0 === e ? "" : 0 === arguments.length ? w(this, 0, e) : function(e, t, r) { var i = !1; if ((void 0 === t || t < 0) && (t = 0), t > this.length) return ""; if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return ""; if ((r >>>= 0) <= (t >>>= 0)) return ""; for (e || (e = "utf8");;) switch (e) {
                            case "hex":
                                return E(this, t, r);
                            case "utf8":
                            case "utf-8":
                                return w(this, t, r);
                            case "ascii":
                                return S(this, t, r);
                            case "latin1":
                            case "binary":
                                return B(this, t, r);
                            case "base64":
                                return v(this, t, r);
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return M(this, t, r);
                            default:
                                if (i) throw new TypeError("Unknown encoding: " + e);
                                e = (e + "").toLowerCase(), i = !0 } }.apply(this, arguments) }, e.prototype.toLocaleString = e.prototype.toString, e.prototype.equals = function(t) { if (!e.isBuffer(t)) throw new TypeError("Argument must be a Buffer"); return this === t || 0 === e.compare(this, t) }, e.prototype.inspect = function() { var e = "",
                        r = t.INSPECT_MAX_BYTES; return e = this.toString("hex", 0, r).replace(/(.{2})/g, "$1 ").trim(), this.length > r && (e += " ... "), "<Buffer " + e + ">" }, r && (e.prototype[r] = e.prototype.inspect), e.prototype.compare = function(t, r, i, n, s) { if (q(t, Uint8Array) && (t = e.from(t, t.offset, t.byteLength)), !e.isBuffer(t)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t); if (void 0 === r && (r = 0), void 0 === i && (i = t ? t.length : 0), void 0 === n && (n = 0), void 0 === s && (s = this.length), r < 0 || i > t.length || n < 0 || s > this.length) throw new RangeError("out of range index"); if (n >= s && r >= i) return 0; if (n >= s) return -1; if (r >= i) return 1; if (this === t) return 0; for (var a = (s >>>= 0) - (n >>>= 0), o = (i >>>= 0) - (r >>>= 0), f = Math.min(a, o), c = this.slice(n, s), u = t.slice(r, i), h = 0; h < f; ++h)
                        if (c[h] !== u[h]) { a = c[h], o = u[h]; break }
                    return a < o ? -1 : o < a ? 1 : 0 }, e.prototype.includes = function(e, t, r) { return -1 !== this.indexOf(e, t, r) }, e.prototype.indexOf = function(e, t, r) { return d(this, e, t, r, !0) }, e.prototype.lastIndexOf = function(e, t, r) { return d(this, e, t, r, !1) }, e.prototype.write = function(e, t, r, i) { if (void 0 === t) i = "utf8", r = this.length, t = 0;
                    else if (void 0 === r && "string" == typeof t) i = t, r = this.length, t = 0;
                    else { if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                        t >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === i && (i = "utf8")) : (i = r, r = void 0) } var n = this.length - t; if ((void 0 === r || r > n) && (r = n), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                    i || (i = "utf8"); for (var s = !1;;) switch (i) {
                        case "hex":
                            return _(this, e, t, r);
                        case "utf8":
                        case "utf-8":
                            return p(this, e, t, r);
                        case "ascii":
                            return b(this, e, t, r);
                        case "latin1":
                        case "binary":
                            return m(this, e, t, r);
                        case "base64":
                            return g(this, e, t, r);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return y(this, e, t, r);
                        default:
                            if (s) throw new TypeError("Unknown encoding: " + i);
                            i = ("" + i).toLowerCase(), s = !0 } }, e.prototype.toJSON = function() { return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) } }; var $ = 4096;

                function S(e, t, r) { var i = "";
                    r = Math.min(e.length, r); for (var n = t; n < r; ++n) i += String.fromCharCode(127 & e[n]); return i }

                function B(e, t, r) { var i = "";
                    r = Math.min(e.length, r); for (var n = t; n < r; ++n) i += String.fromCharCode(e[n]); return i }

                function E(e, t, r) { var i = e.length;
                    (!t || t < 0) && (t = 0), (!r || r < 0 || r > i) && (r = i); for (var n = "", s = t; s < r; ++s) n += D[e[s]]; return n }

                function M(e, t, r) { for (var i = e.slice(t, r), n = "", s = 0; s < i.length; s += 2) n += String.fromCharCode(i[s] + 256 * i[s + 1]); return n }

                function k(e, t, r) { if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint"); if (e + t > r) throw new RangeError("Trying to access beyond buffer length") }

                function A(t, r, i, n, s, a) { if (!e.isBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance'); if (r > s || r < a) throw new RangeError('"value" argument is out of bounds'); if (i + n > t.length) throw new RangeError("Index out of range") }

                function P(e, t, r, i, n, s) { if (r + i > e.length) throw new RangeError("Index out of range"); if (r < 0) throw new RangeError("Index out of range") }

                function x(e, t, r, i, n) { return t = +t, r >>>= 0, n || P(e, 0, r, 4), _$ieee754_98.write(e, t, r, i, 23, 4), r + 4 }

                function I(e, t, r, i, n) { return t = +t, r >>>= 0, n || P(e, 0, r, 8), _$ieee754_98.write(e, t, r, i, 52, 8), r + 8 }
                e.prototype.slice = function(t, r) { var i = this.length;
                    (t = ~~t) < 0 ? (t += i) < 0 && (t = 0) : t > i && (t = i), (r = void 0 === r ? i : ~~r) < 0 ? (r += i) < 0 && (r = 0) : r > i && (r = i), r < t && (r = t); var n = this.subarray(t, r); return Object.setPrototypeOf(n, e.prototype), n }, e.prototype.readUIntLE = function(e, t, r) { e >>>= 0, t >>>= 0, r || k(e, t, this.length); for (var i = this[e], n = 1, s = 0; ++s < t && (n *= 256);) i += this[e + s] * n; return i }, e.prototype.readUIntBE = function(e, t, r) { e >>>= 0, t >>>= 0, r || k(e, t, this.length); for (var i = this[e + --t], n = 1; t > 0 && (n *= 256);) i += this[e + --t] * n; return i }, e.prototype.readUInt8 = function(e, t) { return e >>>= 0, t || k(e, 1, this.length), this[e] }, e.prototype.readUInt16LE = function(e, t) { return e >>>= 0, t || k(e, 2, this.length), this[e] | this[e + 1] << 8 }, e.prototype.readUInt16BE = function(e, t) { return e >>>= 0, t || k(e, 2, this.length), this[e] << 8 | this[e + 1] }, e.prototype.readUInt32LE = function(e, t) { return e >>>= 0, t || k(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3] }, e.prototype.readUInt32BE = function(e, t) { return e >>>= 0, t || k(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]) }, e.prototype.readIntLE = function(e, t, r) { e >>>= 0, t >>>= 0, r || k(e, t, this.length); for (var i = this[e], n = 1, s = 0; ++s < t && (n *= 256);) i += this[e + s] * n; return i >= (n *= 128) && (i -= Math.pow(2, 8 * t)), i }, e.prototype.readIntBE = function(e, t, r) { e >>>= 0, t >>>= 0, r || k(e, t, this.length); for (var i = t, n = 1, s = this[e + --i]; i > 0 && (n *= 256);) s += this[e + --i] * n; return s >= (n *= 128) && (s -= Math.pow(2, 8 * t)), s }, e.prototype.readInt8 = function(e, t) { return e >>>= 0, t || k(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e] }, e.prototype.readInt16LE = function(e, t) { e >>>= 0, t || k(e, 2, this.length); var r = this[e] | this[e + 1] << 8; return 32768 & r ? 4294901760 | r : r }, e.prototype.readInt16BE = function(e, t) { e >>>= 0, t || k(e, 2, this.length); var r = this[e + 1] | this[e] << 8; return 32768 & r ? 4294901760 | r : r }, e.prototype.readInt32LE = function(e, t) { return e >>>= 0, t || k(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24 }, e.prototype.readInt32BE = function(e, t) { return e >>>= 0, t || k(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3] }, e.prototype.readFloatLE = function(e, t) { return e >>>= 0, t || k(e, 4, this.length), _$ieee754_98.read(this, e, !0, 23, 4) }, e.prototype.readFloatBE = function(e, t) { return e >>>= 0, t || k(e, 4, this.length), _$ieee754_98.read(this, e, !1, 23, 4) }, e.prototype.readDoubleLE = function(e, t) { return e >>>= 0, t || k(e, 8, this.length), _$ieee754_98.read(this, e, !0, 52, 8) }, e.prototype.readDoubleBE = function(e, t) { return e >>>= 0, t || k(e, 8, this.length), _$ieee754_98.read(this, e, !1, 52, 8) }, e.prototype.writeUIntLE = function(e, t, r, i) { e = +e, t >>>= 0, r >>>= 0, i || A(this, e, t, r, Math.pow(2, 8 * r) - 1, 0); var n = 1,
                        s = 0; for (this[t] = 255 & e; ++s < r && (n *= 256);) this[t + s] = e / n & 255; return t + r }, e.prototype.writeUIntBE = function(e, t, r, i) { e = +e, t >>>= 0, r >>>= 0, i || A(this, e, t, r, Math.pow(2, 8 * r) - 1, 0); var n = r - 1,
                        s = 1; for (this[t + n] = 255 & e; --n >= 0 && (s *= 256);) this[t + n] = e / s & 255; return t + r }, e.prototype.writeUInt8 = function(e, t, r) { return e = +e, t >>>= 0, r || A(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1 }, e.prototype.writeUInt16LE = function(e, t, r) { return e = +e, t >>>= 0, r || A(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2 }, e.prototype.writeUInt16BE = function(e, t, r) { return e = +e, t >>>= 0, r || A(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2 }, e.prototype.writeUInt32LE = function(e, t, r) { return e = +e, t >>>= 0, r || A(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4 }, e.prototype.writeUInt32BE = function(e, t, r) { return e = +e, t >>>= 0, r || A(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4 }, e.prototype.writeIntLE = function(e, t, r, i) { if (e = +e, t >>>= 0, !i) { var n = Math.pow(2, 8 * r - 1);
                        A(this, e, t, r, n - 1, -n) } var s = 0,
                        a = 1,
                        o = 0; for (this[t] = 255 & e; ++s < r && (a *= 256);) e < 0 && 0 === o && 0 !== this[t + s - 1] && (o = 1), this[t + s] = (e / a >> 0) - o & 255; return t + r }, e.prototype.writeIntBE = function(e, t, r, i) { if (e = +e, t >>>= 0, !i) { var n = Math.pow(2, 8 * r - 1);
                        A(this, e, t, r, n - 1, -n) } var s = r - 1,
                        a = 1,
                        o = 0; for (this[t + s] = 255 & e; --s >= 0 && (a *= 256);) e < 0 && 0 === o && 0 !== this[t + s + 1] && (o = 1), this[t + s] = (e / a >> 0) - o & 255; return t + r }, e.prototype.writeInt8 = function(e, t, r) { return e = +e, t >>>= 0, r || A(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1 }, e.prototype.writeInt16LE = function(e, t, r) { return e = +e, t >>>= 0, r || A(this, e, t, 2, 32767, -32768), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2 }, e.prototype.writeInt16BE = function(e, t, r) { return e = +e, t >>>= 0, r || A(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2 }, e.prototype.writeInt32LE = function(e, t, r) { return e = +e, t >>>= 0, r || A(this, e, t, 4, 2147483647, -2147483648), this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4 }, e.prototype.writeInt32BE = function(e, t, r) { return e = +e, t >>>= 0, r || A(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4 }, e.prototype.writeFloatLE = function(e, t, r) { return x(this, e, t, !0, r) }, e.prototype.writeFloatBE = function(e, t, r) { return x(this, e, t, !1, r) }, e.prototype.writeDoubleLE = function(e, t, r) { return I(this, e, t, !0, r) }, e.prototype.writeDoubleBE = function(e, t, r) { return I(this, e, t, !1, r) }, e.prototype.copy = function(t, r, i, n) { if (!e.isBuffer(t)) throw new TypeError("argument should be a Buffer"); if (i || (i = 0), n || 0 === n || (n = this.length), r >= t.length && (r = t.length), r || (r = 0), n > 0 && n < i && (n = i), n === i) return 0; if (0 === t.length || 0 === this.length) return 0; if (r < 0) throw new RangeError("targetStart out of bounds"); if (i < 0 || i >= this.length) throw new RangeError("Index out of range"); if (n < 0) throw new RangeError("sourceEnd out of bounds");
                    n > this.length && (n = this.length), t.length - r < n - i && (n = t.length - r + i); var s = n - i; if (this === t && "function" == typeof Uint8Array.prototype.copyWithin) this.copyWithin(r, i, n);
                    else if (this === t && i < r && r < n)
                        for (var a = s - 1; a >= 0; --a) t[a + r] = this[a + i];
                    else Uint8Array.prototype.set.call(t, this.subarray(i, n), r); return s }, e.prototype.fill = function(t, r, i, n) { if ("string" == typeof t) { if ("string" == typeof r ? (n = r, r = 0, i = this.length) : "string" == typeof i && (n = i, i = this.length), void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string"); if ("string" == typeof n && !e.isEncoding(n)) throw new TypeError("Unknown encoding: " + n); if (1 === t.length) { var s = t.charCodeAt(0);
                            ("utf8" === n && s < 128 || "latin1" === n) && (t = s) } } else "number" == typeof t ? t &= 255 : "boolean" == typeof t && (t = Number(t)); if (r < 0 || this.length < r || this.length < i) throw new RangeError("Out of range index"); if (i <= r) return this; var a; if (r >>>= 0, i = void 0 === i ? this.length : i >>> 0, t || (t = 0), "number" == typeof t)
                        for (a = r; a < i; ++a) this[a] = t;
                    else { var o = e.isBuffer(t) ? t : e.from(t, n),
                            f = o.length; if (0 === f) throw new TypeError('The value "' + t + '" is invalid for argument "value"'); for (a = 0; a < i - r; ++a) this[a + r] = o[a % f] } return this }; var C = /[^+/0-9A-Za-z-_]/g;

                function R(e, t) { var r;
                    t = t || 1 / 0; for (var i = e.length, n = null, s = [], a = 0; a < i; ++a) { if ((r = e.charCodeAt(a)) > 55295 && r < 57344) { if (!n) { if (r > 56319) {
                                    (t -= 3) > -1 && s.push(239, 191, 189); continue } if (a + 1 === i) {
                                    (t -= 3) > -1 && s.push(239, 191, 189); continue }
                                n = r; continue } if (r < 56320) {
                                (t -= 3) > -1 && s.push(239, 191, 189), n = r; continue }
                            r = 65536 + (n - 55296 << 10 | r - 56320) } else n && (t -= 3) > -1 && s.push(239, 191, 189); if (n = null, r < 128) { if ((t -= 1) < 0) break;
                            s.push(r) } else if (r < 2048) { if ((t -= 2) < 0) break;
                            s.push(r >> 6 | 192, 63 & r | 128) } else if (r < 65536) { if ((t -= 3) < 0) break;
                            s.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128) } else { if (!(r < 1114112)) throw new Error("Invalid code point"); if ((t -= 4) < 0) break;
                            s.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128) } } return s }

                function T(e) { return _$base64Js_15.toByteArray(function(e) { if ((e = (e = e.split("=")[0]).trim().replace(C, "")).length < 2) return ""; for (; e.length % 4 != 0;) e += "="; return e }(e)) }

                function j(e, t, r, i) { for (var n = 0; n < i && !(n + r >= t.length || n >= e.length); ++n) t[n + r] = e[n]; return n }

                function q(e, t) { return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name }

                function O(e) { return e != e } var D = function() { for (var e = new Array(256), t = 0; t < 16; ++t)
                        for (var r = 16 * t, i = 0; i < 16; ++i) e[r + i] = "0123456789abcdef" [t] + "0123456789abcdef" [i]; return e }() }).call(this, _$buffer_47({}).Buffer) }), _$base64Js_15 = { toByteArray: function(e) { var t, r, i = getLens(e),
                    n = i[0],
                    s = i[1],
                    a = new Arr(function(e, t, r) { return 3 * (t + r) / 4 - r }(0, n, s)),
                    o = 0,
                    f = s > 0 ? n - 4 : n; for (r = 0; r < f; r += 4) t = revLookup[e.charCodeAt(r)] << 18 | revLookup[e.charCodeAt(r + 1)] << 12 | revLookup[e.charCodeAt(r + 2)] << 6 | revLookup[e.charCodeAt(r + 3)], a[o++] = t >> 16 & 255, a[o++] = t >> 8 & 255, a[o++] = 255 & t; return 2 === s && (t = revLookup[e.charCodeAt(r)] << 2 | revLookup[e.charCodeAt(r + 1)] >> 4, a[o++] = 255 & t), 1 === s && (t = revLookup[e.charCodeAt(r)] << 10 | revLookup[e.charCodeAt(r + 1)] << 4 | revLookup[e.charCodeAt(r + 2)] >> 2, a[o++] = t >> 8 & 255, a[o++] = 255 & t), a }, fromByteArray: function(e) { for (var t, r = e.length, i = r % 3, n = [], s = 0, a = r - i; s < a; s += 16383) n.push(encodeChunk(e, s, s + 16383 > a ? a : s + 16383)); return 1 === i ? (t = e[r - 1], n.push(lookup[t >> 2] + lookup[t << 4 & 63] + "==")) : 2 === i && (t = (e[r - 2] << 8) + e[r - 1], n.push(lookup[t >> 10] + lookup[t >> 4 & 63] + lookup[t << 2 & 63] + "=")), n.join("") } }, lookup = [], revLookup = [], Arr = "undefined" != typeof Uint8Array ? Uint8Array : Array, code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = 0, len = code.length; i < len; ++i) lookup[i] = code[i], revLookup[code.charCodeAt(i)] = i;

    function getLens(e) { var t = e.length; if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4"); var r = e.indexOf("="); return -1 === r && (r = t), [r, r === t ? 0 : 4 - r % 4] }

    function encodeChunk(e, t, r) { for (var i, n, s = [], a = t; a < r; a += 3) i = (e[a] << 16 & 16711680) + (e[a + 1] << 8 & 65280) + (255 & e[a + 2]), s.push(lookup[(n = i) >> 18 & 63] + lookup[n >> 12 & 63] + lookup[n >> 6 & 63] + lookup[63 & n]); return s.join("") }
    revLookup["-".charCodeAt(0)] = 62, revLookup["_".charCodeAt(0)] = 63; var _$ieee754_98 = { read: function(e, t, r, i, n) { var s, a, o = 8 * n - i - 1,
                    f = (1 << o) - 1,
                    c = f >> 1,
                    u = -7,
                    h = r ? n - 1 : 0,
                    d = r ? -1 : 1,
                    l = e[t + h]; for (h += d, s = l & (1 << -u) - 1, l >>= -u, u += o; u > 0; s = 256 * s + e[t + h], h += d, u -= 8); for (a = s & (1 << -u) - 1, s >>= -u, u += i; u > 0; a = 256 * a + e[t + h], h += d, u -= 8); if (0 === s) s = 1 - c;
                else { if (s === f) return a ? NaN : 1 / 0 * (l ? -1 : 1);
                    a += Math.pow(2, i), s -= c } return (l ? -1 : 1) * a * Math.pow(2, s - i) }, write: function(e, t, r, i, n, s) { var a, o, f, c = 8 * s - n - 1,
                    u = (1 << c) - 1,
                    h = u >> 1,
                    d = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                    l = i ? 0 : s - 1,
                    _ = i ? 1 : -1,
                    p = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0; for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (o = isNaN(t) ? 1 : 0, a = u) : (a = Math.floor(Math.log(t) / Math.LN2), t * (f = Math.pow(2, -a)) < 1 && (a--, f *= 2), (t += a + h >= 1 ? d / f : d * Math.pow(2, 1 - h)) * f >= 2 && (a++, f /= 2), a + h >= u ? (o = 0, a = u) : a + h >= 1 ? (o = (t * f - 1) * Math.pow(2, n), a += h) : (o = t * Math.pow(2, h - 1) * Math.pow(2, n), a = 0)); n >= 8; e[r + l] = 255 & o, l += _, o /= 256, n -= 8); for (a = a << n | o, c += n; c > 0; e[r + l] = 255 & a, l += _, a /= 256, c -= 8);
                e[r + l - _] |= 128 * p } },
        _$safeBuffer_144 = {},
        buffer = _$buffer_47({}),
        Buffer = buffer.Buffer;

    function copyProps(e, t) { for (var r in e) t[r] = e[r] }

    function SafeBuffer(e, t, r) { return Buffer(e, t, r) }
    Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow ? _$safeBuffer_144 = buffer : (copyProps(buffer, _$safeBuffer_144), _$safeBuffer_144.Buffer = SafeBuffer), copyProps(Buffer, SafeBuffer), SafeBuffer.from = function(e, t, r) { if ("number" == typeof e) throw new TypeError("Argument must not be a number"); return Buffer(e, t, r) }, SafeBuffer.alloc = function(e, t, r) { if ("number" != typeof e) throw new TypeError("Argument must be a number"); var i = Buffer(e); return void 0 !== t ? "string" == typeof r ? i.fill(t, r) : i.fill(t) : i.fill(0), i }, SafeBuffer.allocUnsafe = function(e) { if ("number" != typeof e) throw new TypeError("Argument must be a number"); return Buffer(e) }, SafeBuffer.allocUnsafeSlow = function(e) { if ("number" != typeof e) throw new TypeError("Argument must be a number"); return buffer.SlowBuffer(e) }; var _$browser_117 = {},
        cachedSetTimeout, cachedClearTimeout, process = _$browser_117 = {};

    function defaultSetTimout() { throw new Error("setTimeout has not been defined") }

    function defaultClearTimeout() { throw new Error("clearTimeout has not been defined") }

    function runTimeout(e) { if (cachedSetTimeout === setTimeout) return setTimeout(e, 0); if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) return cachedSetTimeout = setTimeout, setTimeout(e, 0); try { return cachedSetTimeout(e, 0) } catch (t) { try { return cachedSetTimeout.call(null, e, 0) } catch (t) { return cachedSetTimeout.call(this, e, 0) } } }! function() { try { cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : defaultSetTimout } catch (e) { cachedSetTimeout = defaultSetTimout } try { cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout } catch (e) { cachedClearTimeout = defaultClearTimeout } }(); var currentQueue, queue = [],
        draining = !1,
        queueIndex = -1;

    function cleanUpNextTick() { draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, queue.length && drainQueue()) }

    function drainQueue() { if (!draining) { var e = runTimeout(cleanUpNextTick);
            draining = !0; for (var t = queue.length; t;) { for (currentQueue = queue, queue = []; ++queueIndex < t;) currentQueue && currentQueue[queueIndex].run();
                queueIndex = -1, t = queue.length }
            currentQueue = null, draining = !1,
                function(e) { if (cachedClearTimeout === clearTimeout) return clearTimeout(e); if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, clearTimeout(e); try { cachedClearTimeout(e) } catch (t) { try { return cachedClearTimeout.call(null, e) } catch (t) { return cachedClearTimeout.call(this, e) } } }(e) } }

    function Item(e, t) { this.fun = e, this.array = t }

    function noop() {}
    process.nextTick = function(e) { var t = new Array(arguments.length - 1); if (arguments.length > 1)
            for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
        queue.push(new Item(e, t)), 1 !== queue.length || draining || runTimeout(drainQueue) }, Item.prototype.run = function() { this.fun.apply(null, this.array) }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, process.emit = noop, process.prependListener = noop, process.prependOnceListener = noop, process.listeners = function(e) { return [] }, process.binding = function(e) { throw new Error("process.binding is not supported") }, process.cwd = function() { return "/" }, process.chdir = function(e) { throw new Error("process.chdir is not supported") }, process.umask = function() { return 0 }; var _$browser_127 = {};
    (function(e, t) { "use strict"; var r = _$safeBuffer_144.Buffer,
            i = t.crypto || t.msCrypto;
        _$browser_127 = i && i.getRandomValues ? function(t, n) { if (t > 4294967295) throw new RangeError("requested too many random bytes"); var s = r.allocUnsafe(t); if (t > 0)
                if (t > 65536)
                    for (var a = 0; a < t; a += 65536) i.getRandomValues(s.slice(a, a + 65536));
                else i.getRandomValues(s);
            return "function" == typeof n ? e.nextTick(function() { n(null, s) }) : s } : function() { throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11") } }).call(this, _$browser_117, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); var _$inherits_browser_99 = {};
    _$inherits_browser_99 = "function" == typeof Object.create ? function(e, t) { t && (e.super_ = t, e.prototype = Object.create(t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } })) } : function(e, t) { if (t) { e.super_ = t; var r = function() {};
            r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e } }; var _$events_82 = {},
        objectCreate = Object.create || function(e) { var t = function() {}; return t.prototype = e, new t },
        objectKeys = Object.keys || function(e) { var t = []; for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.push(r); return r },
        bind = Function.prototype.bind || function(e) { var t = this; return function() { return t.apply(e, arguments) } };

    function EventEmitter() { this._events && Object.prototype.hasOwnProperty.call(this, "_events") || (this._events = objectCreate(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0 }
    _$events_82 = EventEmitter, EventEmitter.EventEmitter = EventEmitter, EventEmitter.prototype._events = void 0, EventEmitter.prototype._maxListeners = void 0; var hasDefineProperty, defaultMaxListeners = 10; try { var o = {};
        Object.defineProperty && Object.defineProperty(o, "x", { value: 0 }), hasDefineProperty = 0 === o.x } catch (err) { hasDefineProperty = !1 }

    function $getMaxListeners(e) { return void 0 === e._maxListeners ? EventEmitter.defaultMaxListeners : e._maxListeners }

    function _addListener(e, t, r, i) { var n, s, a; if ("function" != typeof r) throw new TypeError('"listener" argument must be a function'); if ((s = e._events) ? (s.newListener && (e.emit("newListener", t, r.listener ? r.listener : r), s = e._events), a = s[t]) : (s = e._events = objectCreate(null), e._eventsCount = 0), a) { if ("function" == typeof a ? a = s[t] = i ? [r, a] : [a, r] : i ? a.unshift(r) : a.push(r), !a.warned && (n = $getMaxListeners(e)) && n > 0 && a.length > n) { a.warned = !0; var o = new Error("Possible EventEmitter memory leak detected. " + a.length + ' "' + String(t) + '" listeners added. Use emitter.setMaxListeners() to increase limit.');
                o.name = "MaxListenersExceededWarning", o.emitter = e, o.type = t, o.count = a.length, "object" == typeof console && console.warn && console.warn("%s: %s", o.name, o.message) } } else a = s[t] = r, ++e._eventsCount; return e }

    function onceWrapper() { if (!this.fired) switch (this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length) {
            case 0:
                return this.listener.call(this.target);
            case 1:
                return this.listener.call(this.target, arguments[0]);
            case 2:
                return this.listener.call(this.target, arguments[0], arguments[1]);
            case 3:
                return this.listener.call(this.target, arguments[0], arguments[1], arguments[2]);
            default:
                for (var e = new Array(arguments.length), t = 0; t < e.length; ++t) e[t] = arguments[t];
                this.listener.apply(this.target, e) } }

    function _onceWrap(e, t, r) { var i = { fired: !1, wrapFn: void 0, target: e, type: t, listener: r },
            n = bind.call(onceWrapper, i); return n.listener = r, i.wrapFn = n, n }

    function _listeners(e, t, r) { var i = e._events; if (!i) return []; var n = i[t]; return n ? "function" == typeof n ? r ? [n.listener || n] : [n] : r ? function(e) { for (var t = new Array(e.length), r = 0; r < t.length; ++r) t[r] = e[r].listener || e[r]; return t }(n) : arrayClone(n, n.length) : [] }

    function listenerCount(e) { var t = this._events; if (t) { var r = t[e]; if ("function" == typeof r) return 1; if (r) return r.length } return 0 }

    function arrayClone(e, t) { for (var r = new Array(t), i = 0; i < t; ++i) r[i] = e[i]; return r }
    hasDefineProperty ? Object.defineProperty(EventEmitter, "defaultMaxListeners", { enumerable: !0, get: function() { return defaultMaxListeners }, set: function(e) { if ("number" != typeof e || e < 0 || e != e) throw new TypeError('"defaultMaxListeners" must be a positive number');
            defaultMaxListeners = e } }) : EventEmitter.defaultMaxListeners = defaultMaxListeners, EventEmitter.prototype.setMaxListeners = function(e) { if ("number" != typeof e || e < 0 || isNaN(e)) throw new TypeError('"n" argument must be a positive number'); return this._maxListeners = e, this }, EventEmitter.prototype.getMaxListeners = function() { return $getMaxListeners(this) }, EventEmitter.prototype.emit = function(e) { var t, r, i, n, s, a, o = "error" === e; if (a = this._events) o = o && null == a.error;
        else if (!o) return !1; if (o) { if (arguments.length > 1 && (t = arguments[1]), t instanceof Error) throw t; var f = new Error('Unhandled "error" event. (' + t + ")"); throw f.context = t, f } if (!(r = a[e])) return !1; var c = "function" == typeof r; switch (i = arguments.length) {
            case 1:
                ! function(e, t, r) { if (t) e.call(r);
                    else
                        for (var i = e.length, n = arrayClone(e, i), s = 0; s < i; ++s) n[s].call(r) }(r, c, this); break;
            case 2:
                ! function(e, t, r, i) { if (t) e.call(r, i);
                    else
                        for (var n = e.length, s = arrayClone(e, n), a = 0; a < n; ++a) s[a].call(r, i) }(r, c, this, arguments[1]); break;
            case 3:
                ! function(e, t, r, i, n) { if (t) e.call(r, i, n);
                    else
                        for (var s = e.length, a = arrayClone(e, s), o = 0; o < s; ++o) a[o].call(r, i, n) }(r, c, this, arguments[1], arguments[2]); break;
            case 4:
                ! function(e, t, r, i, n, s) { if (t) e.call(r, i, n, s);
                    else
                        for (var a = e.length, o = arrayClone(e, a), f = 0; f < a; ++f) o[f].call(r, i, n, s) }(r, c, this, arguments[1], arguments[2], arguments[3]); break;
            default:
                for (n = new Array(i - 1), s = 1; s < i; s++) n[s - 1] = arguments[s];! function(e, t, r, i) { if (t) e.apply(r, i);
                    else
                        for (var n = e.length, s = arrayClone(e, n), a = 0; a < n; ++a) s[a].apply(r, i) }(r, c, this, n) } return !0 }, EventEmitter.prototype.addListener = function(e, t) { return _addListener(this, e, t, !1) }, EventEmitter.prototype.on = EventEmitter.prototype.addListener, EventEmitter.prototype.prependListener = function(e, t) { return _addListener(this, e, t, !0) }, EventEmitter.prototype.once = function(e, t) { if ("function" != typeof t) throw new TypeError('"listener" argument must be a function'); return this.on(e, _onceWrap(this, e, t)), this }, EventEmitter.prototype.prependOnceListener = function(e, t) { if ("function" != typeof t) throw new TypeError('"listener" argument must be a function'); return this.prependListener(e, _onceWrap(this, e, t)), this }, EventEmitter.prototype.removeListener = function(e, t) { var r, i, n, s, a; if ("function" != typeof t) throw new TypeError('"listener" argument must be a function'); if (!(i = this._events)) return this; if (!(r = i[e])) return this; if (r === t || r.listener === t) 0 == --this._eventsCount ? this._events = objectCreate(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, r.listener || t));
        else if ("function" != typeof r) { for (n = -1, s = r.length - 1; s >= 0; s--)
                if (r[s] === t || r[s].listener === t) { a = r[s].listener, n = s; break }
            if (n < 0) return this;
            0 === n ? r.shift() : function(e, t) { for (var r = n, i = r + 1, s = e.length; i < s; r += 1, i += 1) e[r] = e[i];
                e.pop() }(r), 1 === r.length && (i[e] = r[0]), i.removeListener && this.emit("removeListener", e, a || t) } return this }, EventEmitter.prototype.removeAllListeners = function(e) { var t, r, i; if (!(r = this._events)) return this; if (!r.removeListener) return 0 === arguments.length ? (this._events = objectCreate(null), this._eventsCount = 0) : r[e] && (0 == --this._eventsCount ? this._events = objectCreate(null) : delete r[e]), this; if (0 === arguments.length) { var n, s = objectKeys(r); for (i = 0; i < s.length; ++i) "removeListener" !== (n = s[i]) && this.removeAllListeners(n); return this.removeAllListeners("removeListener"), this._events = objectCreate(null), this._eventsCount = 0, this } if ("function" == typeof(t = r[e])) this.removeListener(e, t);
        else if (t)
            for (i = t.length - 1; i >= 0; i--) this.removeListener(e, t[i]); return this }, EventEmitter.prototype.listeners = function(e) { return _listeners(this, e, !0) }, EventEmitter.prototype.rawListeners = function(e) { return _listeners(this, e, !1) }, EventEmitter.listenerCount = function(e, t) { return "function" == typeof e.listenerCount ? e.listenerCount(t) : listenerCount.call(e, t) }, EventEmitter.prototype.listenerCount = listenerCount, EventEmitter.prototype.eventNames = function() { return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [] }; var _$processNextickArgs_116 = {};
    (function(e) { "use strict";
        _$processNextickArgs_116 = void 0 === e || !e.version || 0 === e.version.indexOf("v0.") || 0 === e.version.indexOf("v1.") && 0 !== e.version.indexOf("v1.8.") ? { nextTick: function(t, r, i, n) { if ("function" != typeof t) throw new TypeError('"callback" argument must be a function'); var s, a, o = arguments.length; switch (o) {
                    case 0:
                    case 1:
                        return e.nextTick(t);
                    case 2:
                        return e.nextTick(function() { t.call(null, r) });
                    case 3:
                        return e.nextTick(function() { t.call(null, r, i) });
                    case 4:
                        return e.nextTick(function() { t.call(null, r, i, n) });
                    default:
                        for (s = new Array(o - 1), a = 0; a < s.length;) s[a++] = arguments[a]; return e.nextTick(function() { t.apply(null, s) }) } } } : e }).call(this, _$browser_117); var toString = {}.toString,
        _$isarray_101 = Array.isArray || function(e) { return "[object Array]" == toString.call(e) },
        _$streamBrowser_137 = _$events_82.EventEmitter;

    function isBuffer(e) { return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e) } var _$isBuffer_100 = function(e) { return null != e && (isBuffer(e) || function(e) { return "function" == typeof e.readFloatLE && "function" == typeof e.slice && isBuffer(e.slice(0, 0)) }(e) || !!e._isBuffer) },
        _$util_49 = {};
    (function(e) {
        function t(e) { return Object.prototype.toString.call(e) }
        _$util_49.isArray = function(e) { return Array.isArray ? Array.isArray(e) : "[object Array]" === t(e) }, _$util_49.isBoolean = function(e) { return "boolean" == typeof e }, _$util_49.isNull = function(e) { return null === e }, _$util_49.isNullOrUndefined = function(e) { return null == e }, _$util_49.isNumber = function(e) { return "number" == typeof e }, _$util_49.isString = function(e) { return "string" == typeof e }, _$util_49.isSymbol = function(e) { return "symbol" == typeof e }, _$util_49.isUndefined = function(e) { return void 0 === e }, _$util_49.isRegExp = function(e) { return "[object RegExp]" === t(e) }, _$util_49.isObject = function(e) { return "object" == typeof e && null !== e }, _$util_49.isDate = function(e) { return "[object Date]" === t(e) }, _$util_49.isError = function(e) { return "[object Error]" === t(e) || e instanceof Error }, _$util_49.isFunction = function(e) { return "function" == typeof e }, _$util_49.isPrimitive = function(e) { return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e }, _$util_49.isBuffer = e.isBuffer }).call(this, { isBuffer: _$isBuffer_100 }); var _$BufferList_135 = {},
        __Buffer_135 = _$safeBuffer_144.Buffer,
        util = _$empty_18({});

    function emitErrorNT(e, t) { e.emit("error", t) }
    _$BufferList_135 = function() {
        function e() {! function(t, r) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") }(this), this.head = null, this.tail = null, this.length = 0 } return e.prototype.push = function(e) { var t = { data: e, next: null };
            this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length }, e.prototype.unshift = function(e) { var t = { data: e, next: this.head };
            0 === this.length && (this.tail = t), this.head = t, ++this.length }, e.prototype.shift = function() { if (0 !== this.length) { var e = this.head.data; return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e } }, e.prototype.clear = function() { this.head = this.tail = null, this.length = 0 }, e.prototype.join = function(e) { if (0 === this.length) return ""; for (var t = this.head, r = "" + t.data; t = t.next;) r += e + t.data; return r }, e.prototype.concat = function(e) { if (0 === this.length) return __Buffer_135.alloc(0); if (1 === this.length) return this.head.data; for (var t, r, i = __Buffer_135.allocUnsafe(e >>> 0), n = this.head, s = 0; n;) t = i, r = s, n.data.copy(t, r), s += n.data.length, n = n.next; return i }, e }(), util && util.inspect && util.inspect.custom && (_$BufferList_135.prototype[util.inspect.custom] = function() { var e = util.inspect({ length: this.length }); return this.constructor.name + " " + e }); var _$destroy_136 = { destroy: function(e, t) { var r = this,
                    i = this._readableState && this._readableState.destroyed,
                    n = this._writableState && this._writableState.destroyed; return i || n ? (t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || _$processNextickArgs_116.nextTick(emitErrorNT, this, e), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function(e) {!t && e ? (_$processNextickArgs_116.nextTick(emitErrorNT, r, e), r._writableState && (r._writableState.errorEmitted = !0)) : t && t(e) }), this) }, undestroy: function() { this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1) } },
        _$browser_157 = {};
    (function(e) {
        function t(t) { try { if (!e.localStorage) return !1 } catch (i) { return !1 } var r = e.localStorage[t]; return null != r && "true" === String(r).toLowerCase() }
        _$browser_157 = function(e, r) { if (t("noDeprecation")) return e; var i = !1; return function() { if (!i) { if (t("throwDeprecation")) throw new Error(r);
                    t("traceDeprecation") ? console.trace(r) : console.warn(r), i = !0 } return e.apply(this, arguments) } } }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); var _$Transform_133 = Transform,
        __Duplex_133 = _$Duplex_130({});

    function afterTransform(e, t) { var r = this._transformState;
        r.transforming = !1; var i = r.writecb; if (!i) return this.emit("error", new Error("write callback called multiple times"));
        r.writechunk = null, r.writecb = null, null != t && this.push(t), i(e); var n = this._readableState;
        n.reading = !1, (n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark) }

    function Transform(e) { if (!(this instanceof Transform)) return new Transform(e);
        __Duplex_133.call(this, e), this._transformState = { afterTransform: afterTransform.bind(this), needTransform: !1, transforming: !1, writecb: null, writechunk: null, writeencoding: null }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.on("prefinish", prefinish) }

    function prefinish() { var e = this; "function" == typeof this._flush ? this._flush(function(t, r) { done(e, t, r) }) : done(this, null, null) }

    function done(e, t, r) { if (t) return e.emit("error", t); if (null != r && e.push(r), e._writableState.length) throw new Error("Calling transform done when ws.length != 0"); if (e._transformState.transforming) throw new Error("Calling transform done when still transforming"); return e.push(null) }
    _$util_49.inherits = _$inherits_browser_99, _$util_49.inherits(Transform, __Duplex_133), Transform.prototype.push = function(e, t) { return this._transformState.needTransform = !1, __Duplex_133.prototype.push.call(this, e, t) }, Transform.prototype._transform = function(e, t, r) { throw new Error("_transform() is not implemented") }, Transform.prototype._write = function(e, t, r) { var i = this._transformState; if (i.writecb = r, i.writechunk = e, i.writeencoding = t, !i.transforming) { var n = this._readableState;
            (i.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark) } }, Transform.prototype._read = function(e) { var t = this._transformState;
        null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0 }, Transform.prototype._destroy = function(e, t) { var r = this;
        __Duplex_133.prototype._destroy.call(this, e, function(e) { t(e), r.emit("close") }) }; var _$PassThrough_131 = PassThrough;

    function PassThrough(e) { if (!(this instanceof PassThrough)) return new PassThrough(e);
        _$Transform_133.call(this, e) }
    _$util_49.inherits = _$inherits_browser_99, _$util_49.inherits(PassThrough, _$Transform_133), PassThrough.prototype._transform = function(e, t, r) { r(null, e) }; var _$readableBrowser_140 = {};
    _$readableBrowser_140 = _$readableBrowser_140 = _$Readable_132({}), _$readableBrowser_140.Stream = _$readableBrowser_140, _$readableBrowser_140.Readable = _$readableBrowser_140, _$readableBrowser_140.Writable = _$Writable_134({}), _$readableBrowser_140.Duplex = _$Duplex_130({}), _$readableBrowser_140.Transform = _$Transform_133, _$readableBrowser_140.PassThrough = _$PassThrough_131; var _$writableBrowser_142 = _$Writable_134({}),
        _$duplexBrowser_129 = _$Duplex_130({}),
        _$transform_141 = _$readableBrowser_140.Transform,
        _$passthrough_139 = _$readableBrowser_140.PassThrough,
        _$Stream_153 = Stream,
        EE = _$events_82.EventEmitter;

    function Stream() { EE.call(this) }
    _$inherits_browser_99(Stream, EE), Stream.Readable = _$readableBrowser_140, Stream.Writable = _$writableBrowser_142, Stream.Duplex = _$duplexBrowser_129, Stream.Transform = _$transform_141, Stream.PassThrough = _$passthrough_139, Stream.Stream = Stream, Stream.prototype.pipe = function(e, t) { var r = this;

        function i(t) { e.writable && !1 === e.write(t) && r.pause && r.pause() }

        function n() { r.readable && r.resume && r.resume() }
        r.on("data", i), e.on("drain", n), e._isStdio || t && !1 === t.end || (r.on("end", a), r.on("close", o)); var s = !1;

        function a() { s || (s = !0, e.end()) }

        function o() { s || (s = !0, "function" == typeof e.destroy && e.destroy()) }

        function f(e) { if (c(), 0 === EE.listenerCount(this, "error")) throw e }

        function c() { r.removeListener("data", i), e.removeListener("drain", n), r.removeListener("end", a), r.removeListener("close", o), r.removeListener("error", f), e.removeListener("error", f), r.removeListener("end", c), r.removeListener("close", c), e.removeListener("close", c) } return r.on("error", f), e.on("error", f), r.on("end", c), r.on("close", c), e.on("close", c), e.emit("pipe", r), e }; var _$hashBase_84 = {},
        __Buffer_84 = _$safeBuffer_144.Buffer,
        __Transform_84 = _$Stream_153.Transform;

    function HashBase(e) { __Transform_84.call(this), this._block = __Buffer_84.allocUnsafe(e), this._blockSize = e, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1 }
    _$inherits_browser_99(HashBase, __Transform_84), HashBase.prototype._transform = function(e, t, r) { var i = null; try { this.update(e, t) } catch (err) { i = err }
        r(i) }, HashBase.prototype._flush = function(e) { var t = null; try { this.push(this.digest()) } catch (err) { t = err }
        e(t) }, HashBase.prototype.update = function(e, t) { if (function(e, t) { if (!__Buffer_84.isBuffer(e) && "string" != typeof e) throw new TypeError("Data must be a string or a buffer") }(e), this._finalized) throw new Error("Digest already called");
        __Buffer_84.isBuffer(e) || (e = __Buffer_84.from(e, t)); for (var r = this._block, i = 0; this._blockOffset + e.length - i >= this._blockSize;) { for (var n = this._blockOffset; n < this._blockSize;) r[n++] = e[i++];
            this._update(), this._blockOffset = 0 } for (; i < e.length;) r[this._blockOffset++] = e[i++]; for (var s = 0, a = 8 * e.length; a > 0; ++s) this._length[s] += a, (a = this._length[s] / 4294967296 | 0) > 0 && (this._length[s] -= 4294967296 * a); return this }, HashBase.prototype._update = function() { throw new Error("_update is not implemented") }, HashBase.prototype.digest = function(e) { if (this._finalized) throw new Error("Digest already called");
        this._finalized = !0; var t = this._digest();
        void 0 !== e && (t = t.toString(e)), this._block.fill(0), this._blockOffset = 0; for (var r = 0; r < 4; ++r) this._length[r] = 0; return t }, HashBase.prototype._digest = function() { throw new Error("_digest is not implemented") }, _$hashBase_84 = HashBase; var _$md5Js_102 = {},
        __Buffer_102 = _$safeBuffer_144.Buffer,
        ARRAY16 = new Array(16);

    function MD5() { _$hashBase_84.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878 }

    function rotl(e, t) { return e << t | e >>> 32 - t }

    function fnF(e, t, r, i, n, s, a) { return rotl(e + (t & r | ~t & i) + n + s | 0, a) + t | 0 }

    function fnG(e, t, r, i, n, s, a) { return rotl(e + (t & i | r & ~i) + n + s | 0, a) + t | 0 }

    function fnH(e, t, r, i, n, s, a) { return rotl(e + (t ^ r ^ i) + n + s | 0, a) + t | 0 }

    function fnI(e, t, r, i, n, s, a) { return rotl(e + (r ^ (t | ~i)) + n + s | 0, a) + t | 0 }
    _$inherits_browser_99(MD5, _$hashBase_84), MD5.prototype._update = function() { for (var e = ARRAY16, t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t); var r = this._a,
            i = this._b,
            n = this._c,
            s = this._d;
        r = fnF(r, i, n, s, e[0], 3614090360, 7), s = fnF(s, r, i, n, e[1], 3905402710, 12), n = fnF(n, s, r, i, e[2], 606105819, 17), i = fnF(i, n, s, r, e[3], 3250441966, 22), r = fnF(r, i, n, s, e[4], 4118548399, 7), s = fnF(s, r, i, n, e[5], 1200080426, 12), n = fnF(n, s, r, i, e[6], 2821735955, 17), i = fnF(i, n, s, r, e[7], 4249261313, 22), r = fnF(r, i, n, s, e[8], 1770035416, 7), s = fnF(s, r, i, n, e[9], 2336552879, 12), n = fnF(n, s, r, i, e[10], 4294925233, 17), i = fnF(i, n, s, r, e[11], 2304563134, 22), r = fnF(r, i, n, s, e[12], 1804603682, 7), s = fnF(s, r, i, n, e[13], 4254626195, 12), n = fnF(n, s, r, i, e[14], 2792965006, 17), r = fnG(r, i = fnF(i, n, s, r, e[15], 1236535329, 22), n, s, e[1], 4129170786, 5), s = fnG(s, r, i, n, e[6], 3225465664, 9), n = fnG(n, s, r, i, e[11], 643717713, 14), i = fnG(i, n, s, r, e[0], 3921069994, 20), r = fnG(r, i, n, s, e[5], 3593408605, 5), s = fnG(s, r, i, n, e[10], 38016083, 9), n = fnG(n, s, r, i, e[15], 3634488961, 14), i = fnG(i, n, s, r, e[4], 3889429448, 20), r = fnG(r, i, n, s, e[9], 568446438, 5), s = fnG(s, r, i, n, e[14], 3275163606, 9), n = fnG(n, s, r, i, e[3], 4107603335, 14), i = fnG(i, n, s, r, e[8], 1163531501, 20), r = fnG(r, i, n, s, e[13], 2850285829, 5), s = fnG(s, r, i, n, e[2], 4243563512, 9), n = fnG(n, s, r, i, e[7], 1735328473, 14), r = fnH(r, i = fnG(i, n, s, r, e[12], 2368359562, 20), n, s, e[5], 4294588738, 4), s = fnH(s, r, i, n, e[8], 2272392833, 11), n = fnH(n, s, r, i, e[11], 1839030562, 16), i = fnH(i, n, s, r, e[14], 4259657740, 23), r = fnH(r, i, n, s, e[1], 2763975236, 4), s = fnH(s, r, i, n, e[4], 1272893353, 11), n = fnH(n, s, r, i, e[7], 4139469664, 16), i = fnH(i, n, s, r, e[10], 3200236656, 23), r = fnH(r, i, n, s, e[13], 681279174, 4), s = fnH(s, r, i, n, e[0], 3936430074, 11), n = fnH(n, s, r, i, e[3], 3572445317, 16), i = fnH(i, n, s, r, e[6], 76029189, 23), r = fnH(r, i, n, s, e[9], 3654602809, 4), s = fnH(s, r, i, n, e[12], 3873151461, 11), n = fnH(n, s, r, i, e[15], 530742520, 16), r = fnI(r, i = fnH(i, n, s, r, e[2], 3299628645, 23), n, s, e[0], 4096336452, 6), s = fnI(s, r, i, n, e[7], 1126891415, 10), n = fnI(n, s, r, i, e[14], 2878612391, 15), i = fnI(i, n, s, r, e[5], 4237533241, 21), r = fnI(r, i, n, s, e[12], 1700485571, 6), s = fnI(s, r, i, n, e[3], 2399980690, 10), n = fnI(n, s, r, i, e[10], 4293915773, 15), i = fnI(i, n, s, r, e[1], 2240044497, 21), r = fnI(r, i, n, s, e[8], 1873313359, 6), s = fnI(s, r, i, n, e[15], 4264355552, 10), n = fnI(n, s, r, i, e[6], 2734768916, 15), i = fnI(i, n, s, r, e[13], 1309151649, 21), r = fnI(r, i, n, s, e[4], 4149444226, 6), s = fnI(s, r, i, n, e[11], 3174756917, 10), n = fnI(n, s, r, i, e[2], 718787259, 15), i = fnI(i, n, s, r, e[9], 3951481745, 21), this._a = this._a + r | 0, this._b = this._b + i | 0, this._c = this._c + n | 0, this._d = this._d + s | 0 }, MD5.prototype._digest = function() { this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update(); var e = __Buffer_102.allocUnsafe(16); return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e }, _$md5Js_102 = MD5; var _$ripemd160_143 = {},
        __Buffer_143 = _$buffer_47({}).Buffer,
        __ARRAY16_143 = new Array(16),
        zl = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13],
        zr = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11],
        sl = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6],
        sr = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11],
        hl = [0, 1518500249, 1859775393, 2400959708, 2840853838],
        hr = [1352829926, 1548603684, 1836072691, 2053994217, 0];

    function RIPEMD160() { _$hashBase_84.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520 }

    function __rotl_143(e, t) { return e << t | e >>> 32 - t }

    function fn1(e, t, r, i, n, s, a, o) { return __rotl_143(e + (t ^ r ^ i) + s + a | 0, o) + n | 0 }

    function fn2(e, t, r, i, n, s, a, o) { return __rotl_143(e + (t & r | ~t & i) + s + a | 0, o) + n | 0 }

    function fn3(e, t, r, i, n, s, a, o) { return __rotl_143(e + ((t | ~r) ^ i) + s + a | 0, o) + n | 0 }

    function fn4(e, t, r, i, n, s, a, o) { return __rotl_143(e + (t & i | r & ~i) + s + a | 0, o) + n | 0 }

    function fn5(e, t, r, i, n, s, a, o) { return __rotl_143(e + (t ^ (r | ~i)) + s + a | 0, o) + n | 0 }
    _$inherits_browser_99(RIPEMD160, _$hashBase_84), RIPEMD160.prototype._update = function() { for (var e = __ARRAY16_143, t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t); for (var r = 0 | this._a, i = 0 | this._b, n = 0 | this._c, s = 0 | this._d, a = 0 | this._e, o = 0 | this._a, f = 0 | this._b, c = 0 | this._c, u = 0 | this._d, h = 0 | this._e, d = 0; d < 80; d += 1) { var l, _;
            d < 16 ? (l = fn1(r, i, n, s, a, e[zl[d]], hl[0], sl[d]), _ = fn5(o, f, c, u, h, e[zr[d]], hr[0], sr[d])) : d < 32 ? (l = fn2(r, i, n, s, a, e[zl[d]], hl[1], sl[d]), _ = fn4(o, f, c, u, h, e[zr[d]], hr[1], sr[d])) : d < 48 ? (l = fn3(r, i, n, s, a, e[zl[d]], hl[2], sl[d]), _ = fn3(o, f, c, u, h, e[zr[d]], hr[2], sr[d])) : d < 64 ? (l = fn4(r, i, n, s, a, e[zl[d]], hl[3], sl[d]), _ = fn2(o, f, c, u, h, e[zr[d]], hr[3], sr[d])) : (l = fn5(r, i, n, s, a, e[zl[d]], hl[4], sl[d]), _ = fn1(o, f, c, u, h, e[zr[d]], hr[4], sr[d])), r = a, a = s, s = __rotl_143(n, 10), n = i, i = l, o = h, h = u, u = __rotl_143(c, 10), c = f, f = _ } var p = this._b + n + u | 0;
        this._b = this._c + s + h | 0, this._c = this._d + a + o | 0, this._d = this._e + r + f | 0, this._e = this._a + i + c | 0, this._a = p }, RIPEMD160.prototype._digest = function() { this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update(); var e = __Buffer_143.alloc ? __Buffer_143.alloc(20) : new __Buffer_143(20); return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e.writeInt32LE(this._e, 16), e }, _$ripemd160_143 = RIPEMD160; var _$hash_145 = {},
        __Buffer_145 = _$safeBuffer_144.Buffer;

    function Hash(e, t) { this._block = __Buffer_145.alloc(e), this._finalSize = t, this._blockSize = e, this._len = 0 }
    Hash.prototype.update = function(e, t) { "string" == typeof e && (t = t || "utf8", e = __Buffer_145.from(e, t)); for (var r = this._block, i = this._blockSize, n = e.length, s = this._len, a = 0; a < n;) { for (var o = s % i, f = Math.min(n - a, i - o), c = 0; c < f; c++) r[o + c] = e[a + c];
            a += f, (s += f) % i == 0 && this._update(r) } return this._len += n, this }, Hash.prototype.digest = function(e) { var t = this._len % this._blockSize;
        this._block[t] = 128, this._block.fill(0, t + 1), t >= this._finalSize && (this._update(this._block), this._block.fill(0)); var r = 8 * this._len; if (r <= 4294967295) this._block.writeUInt32BE(r, this._blockSize - 4);
        else { var i = (4294967295 & r) >>> 0,
                n = (r - i) / 4294967296;
            this._block.writeUInt32BE(n, this._blockSize - 8), this._block.writeUInt32BE(i, this._blockSize - 4) }
        this._update(this._block); var s = this._hash(); return e ? s.toString(e) : s }, Hash.prototype._update = function() { throw new Error("_update must be implemented by subclass") }, _$hash_145 = Hash; var _$sha_147 = {},
        __Buffer_147 = _$safeBuffer_144.Buffer,
        K = [1518500249, 1859775393, -1894007588, -899497514],
        W = new Array(80);

    function Sha() { this.init(), this._w = W, _$hash_145.call(this, 64, 56) }

    function rotl30(e) { return e << 30 | e >>> 2 }

    function ft(e, t, r, i) { return 0 === e ? t & r | ~t & i : 2 === e ? t & r | t & i | r & i : t ^ r ^ i }
    _$inherits_browser_99(Sha, _$hash_145), Sha.prototype.init = function() { return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this }, Sha.prototype._update = function(e) { for (var t, r = this._w, i = 0 | this._a, n = 0 | this._b, s = 0 | this._c, a = 0 | this._d, o = 0 | this._e, f = 0; f < 16; ++f) r[f] = e.readInt32BE(4 * f); for (; f < 80; ++f) r[f] = r[f - 3] ^ r[f - 8] ^ r[f - 14] ^ r[f - 16]; for (var c = 0; c < 80; ++c) { var u = ~~(c / 20),
                h = 0 | ((t = i) << 5 | t >>> 27) + ft(u, n, s, a) + o + r[c] + K[u];
            o = a, a = s, s = rotl30(n), n = i, i = h }
        this._a = i + this._a | 0, this._b = n + this._b | 0, this._c = s + this._c | 0, this._d = a + this._d | 0, this._e = o + this._e | 0 }, Sha.prototype._hash = function() { var e = __Buffer_147.allocUnsafe(20); return e.writeInt32BE(0 | this._a, 0), e.writeInt32BE(0 | this._b, 4), e.writeInt32BE(0 | this._c, 8), e.writeInt32BE(0 | this._d, 12), e.writeInt32BE(0 | this._e, 16), e }, _$sha_147 = Sha; var _$sha1_148 = {},
        __Buffer_148 = _$safeBuffer_144.Buffer,
        __K_148 = [1518500249, 1859775393, -1894007588, -899497514],
        __W_148 = new Array(80);

    function Sha1() { this.init(), this._w = __W_148, _$hash_145.call(this, 64, 56) }

    function rotl5(e) { return e << 5 | e >>> 27 }

    function __rotl30_148(e) { return e << 30 | e >>> 2 }

    function __ft_148(e, t, r, i) { return 0 === e ? t & r | ~t & i : 2 === e ? t & r | t & i | r & i : t ^ r ^ i }
    _$inherits_browser_99(Sha1, _$hash_145), Sha1.prototype.init = function() { return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this }, Sha1.prototype._update = function(e) { for (var t, r = this._w, i = 0 | this._a, n = 0 | this._b, s = 0 | this._c, a = 0 | this._d, o = 0 | this._e, f = 0; f < 16; ++f) r[f] = e.readInt32BE(4 * f); for (; f < 80; ++f) r[f] = (t = r[f - 3] ^ r[f - 8] ^ r[f - 14] ^ r[f - 16]) << 1 | t >>> 31; for (var c = 0; c < 80; ++c) { var u = ~~(c / 20),
                h = rotl5(i) + __ft_148(u, n, s, a) + o + r[c] + __K_148[u] | 0;
            o = a, a = s, s = __rotl30_148(n), n = i, i = h }
        this._a = i + this._a | 0, this._b = n + this._b | 0, this._c = s + this._c | 0, this._d = a + this._d | 0, this._e = o + this._e | 0 }, Sha1.prototype._hash = function() { var e = __Buffer_148.allocUnsafe(20); return e.writeInt32BE(0 | this._a, 0), e.writeInt32BE(0 | this._b, 4), e.writeInt32BE(0 | this._c, 8), e.writeInt32BE(0 | this._d, 12), e.writeInt32BE(0 | this._e, 16), e }, _$sha1_148 = Sha1; var _$sha256_150 = {},
        __Buffer_150 = _$safeBuffer_144.Buffer,
        __K_150 = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
        __W_150 = new Array(64);

    function Sha256() { this.init(), this._w = __W_150, _$hash_145.call(this, 64, 56) }

    function ch(e, t, r) { return r ^ e & (t ^ r) }

    function maj(e, t, r) { return e & t | r & (e | t) }

    function sigma0(e) { return (e >>> 2 | e << 30) ^ (e >>> 13 | e << 19) ^ (e >>> 22 | e << 10) }

    function sigma1(e) { return (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7) }

    function gamma0(e) { return (e >>> 7 | e << 25) ^ (e >>> 18 | e << 14) ^ e >>> 3 }
    _$inherits_browser_99(Sha256, _$hash_145), Sha256.prototype.init = function() { return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this }, Sha256.prototype._update = function(e) { for (var t, r = this._w, i = 0 | this._a, n = 0 | this._b, s = 0 | this._c, a = 0 | this._d, o = 0 | this._e, f = 0 | this._f, c = 0 | this._g, u = 0 | this._h, h = 0; h < 16; ++h) r[h] = e.readInt32BE(4 * h); for (; h < 64; ++h) r[h] = 0 | (((t = r[h - 2]) >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10) + r[h - 7] + gamma0(r[h - 15]) + r[h - 16]; for (var d = 0; d < 64; ++d) { var l = u + sigma1(o) + ch(o, f, c) + __K_150[d] + r[d] | 0,
                _ = sigma0(i) + maj(i, n, s) | 0;
            u = c, c = f, f = o, o = a + l | 0, a = s, s = n, n = i, i = l + _ | 0 }
        this._a = i + this._a | 0, this._b = n + this._b | 0, this._c = s + this._c | 0, this._d = a + this._d | 0, this._e = o + this._e | 0, this._f = f + this._f | 0, this._g = c + this._g | 0, this._h = u + this._h | 0 }, Sha256.prototype._hash = function() { var e = __Buffer_150.allocUnsafe(32); return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e.writeInt32BE(this._h, 28), e }, _$sha256_150 = Sha256; var _$sha224_149 = {},
        __Buffer_149 = _$safeBuffer_144.Buffer,
        __W_149 = new Array(64);

    function Sha224() { this.init(), this._w = __W_149, _$hash_145.call(this, 64, 56) }
    _$inherits_browser_99(Sha224, _$sha256_150), Sha224.prototype.init = function() { return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this }, Sha224.prototype._hash = function() { var e = __Buffer_149.allocUnsafe(28); return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e }, _$sha224_149 = Sha224; var _$sha512_152 = {},
        __Buffer_152 = _$safeBuffer_144.Buffer,
        __K_152 = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591],
        __W_152 = new Array(160);

    function Sha512() { this.init(), this._w = __W_152, _$hash_145.call(this, 128, 112) }

    function Ch(e, t, r) { return r ^ e & (t ^ r) }

    function __maj_152(e, t, r) { return e & t | r & (e | t) }

    function __sigma0_152(e, t) { return (e >>> 28 | t << 4) ^ (t >>> 2 | e << 30) ^ (t >>> 7 | e << 25) }

    function __sigma1_152(e, t) { return (e >>> 14 | t << 18) ^ (e >>> 18 | t << 14) ^ (t >>> 9 | e << 23) }

    function Gamma0(e, t) { return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ e >>> 7 }

    function Gamma0l(e, t) { return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ (e >>> 7 | t << 25) }

    function Gamma1(e, t) { return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ e >>> 6 }

    function Gamma1l(e, t) { return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ (e >>> 6 | t << 26) }

    function getCarry(e, t) { return e >>> 0 < t >>> 0 ? 1 : 0 }
    _$inherits_browser_99(Sha512, _$hash_145), Sha512.prototype.init = function() { return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this }, Sha512.prototype._update = function(e) { for (var t = this._w, r = 0 | this._ah, i = 0 | this._bh, n = 0 | this._ch, s = 0 | this._dh, a = 0 | this._eh, o = 0 | this._fh, f = 0 | this._gh, c = 0 | this._hh, u = 0 | this._al, h = 0 | this._bl, d = 0 | this._cl, l = 0 | this._dl, _ = 0 | this._el, p = 0 | this._fl, b = 0 | this._gl, m = 0 | this._hl, g = 0; g < 32; g += 2) t[g] = e.readInt32BE(4 * g), t[g + 1] = e.readInt32BE(4 * g + 4); for (; g < 160; g += 2) { var y = t[g - 30],
                v = t[g - 30 + 1],
                w = Gamma0(y, v),
                $ = Gamma0l(v, y),
                S = Gamma1(y = t[g - 4], v = t[g - 4 + 1]),
                B = Gamma1l(v, y),
                E = t[g - 14],
                M = t[g - 14 + 1],
                k = t[g - 32],
                A = t[g - 32 + 1],
                P = $ + M | 0,
                x = w + E + getCarry(P, $) | 0;
            x = (x = x + S + getCarry(P = P + B | 0, B) | 0) + k + getCarry(P = P + A | 0, A) | 0, t[g] = x, t[g + 1] = P } for (var I = 0; I < 160; I += 2) { x = t[I], P = t[I + 1]; var C = __maj_152(r, i, n),
                R = __maj_152(u, h, d),
                T = __sigma0_152(r, u),
                j = __sigma0_152(u, r),
                q = __sigma1_152(a, _),
                O = __sigma1_152(_, a),
                D = __K_152[I],
                N = __K_152[I + 1],
                L = Ch(a, o, f),
                U = Ch(_, p, b),
                z = m + O | 0,
                H = c + q + getCarry(z, m) | 0;
            H = (H = (H = H + L + getCarry(z = z + U | 0, U) | 0) + D + getCarry(z = z + N | 0, N) | 0) + x + getCarry(z = z + P | 0, P) | 0; var K = j + R | 0,
                F = T + C + getCarry(K, j) | 0;
            c = f, m = b, f = o, b = p, o = a, p = _, a = s + H + getCarry(_ = l + z | 0, l) | 0, s = n, l = d, n = i, d = h, i = r, h = u, r = H + F + getCarry(u = z + K | 0, z) | 0 }
        this._al = this._al + u | 0, this._bl = this._bl + h | 0, this._cl = this._cl + d | 0, this._dl = this._dl + l | 0, this._el = this._el + _ | 0, this._fl = this._fl + p | 0, this._gl = this._gl + b | 0, this._hl = this._hl + m | 0, this._ah = this._ah + r + getCarry(this._al, u) | 0, this._bh = this._bh + i + getCarry(this._bl, h) | 0, this._ch = this._ch + n + getCarry(this._cl, d) | 0, this._dh = this._dh + s + getCarry(this._dl, l) | 0, this._eh = this._eh + a + getCarry(this._el, _) | 0, this._fh = this._fh + o + getCarry(this._fl, p) | 0, this._gh = this._gh + f + getCarry(this._gl, b) | 0, this._hh = this._hh + c + getCarry(this._hl, m) | 0 }, Sha512.prototype._hash = function() { var e = __Buffer_152.allocUnsafe(64);

        function t(t, r, i) { e.writeInt32BE(t, i), e.writeInt32BE(r, i + 4) } return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), t(this._gh, this._gl, 48), t(this._hh, this._hl, 56), e }, _$sha512_152 = Sha512; var _$sha384_151 = {},
        __Buffer_151 = _$safeBuffer_144.Buffer,
        __W_151 = new Array(160);

    function Sha384() { this.init(), this._w = __W_151, _$hash_145.call(this, 128, 112) }
    _$inherits_browser_99(Sha384, _$sha512_152), Sha384.prototype.init = function() { return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this }, Sha384.prototype._hash = function() { var e = __Buffer_151.allocUnsafe(48);

        function t(t, r, i) { e.writeInt32BE(t, i), e.writeInt32BE(r, i + 4) } return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), e }, _$sha384_151 = Sha384; var _$shaJs_146 = {},
        exports = _$shaJs_146 = function(e) { e = e.toLowerCase(); var t = exports[e]; if (!t) throw new Error(e + " is not supported (we accept pull requests)"); return new t };
    exports.sha = _$sha_147, exports.sha1 = _$sha1_148, exports.sha224 = _$sha224_149, exports.sha256 = _$sha256_150, exports.sha384 = _$sha384_151, exports.sha512 = _$sha512_152; var _$safeBuffer_155 = {},
        __buffer_155 = _$buffer_47({}),
        __Buffer_155 = __buffer_155.Buffer;

    function __copyProps_155(e, t) { for (var r in e) t[r] = e[r] }

    function __SafeBuffer_155(e, t, r) { return __Buffer_155(e, t, r) }
    __Buffer_155.from && __Buffer_155.alloc && __Buffer_155.allocUnsafe && __Buffer_155.allocUnsafeSlow ? _$safeBuffer_155 = __buffer_155 : (__copyProps_155(__buffer_155, _$safeBuffer_155), _$safeBuffer_155.Buffer = __SafeBuffer_155), __SafeBuffer_155.prototype = Object.create(__Buffer_155.prototype), __copyProps_155(__Buffer_155, __SafeBuffer_155), __SafeBuffer_155.from = function(e, t, r) { if ("number" == typeof e) throw new TypeError("Argument must not be a number"); return __Buffer_155(e, t, r) }, __SafeBuffer_155.alloc = function(e, t, r) { if ("number" != typeof e) throw new TypeError("Argument must be a number"); var i = __Buffer_155(e); return void 0 !== t ? "string" == typeof r ? i.fill(t, r) : i.fill(t) : i.fill(0), i }, __SafeBuffer_155.allocUnsafe = function(e) { if ("number" != typeof e) throw new TypeError("Argument must be a number"); return __Buffer_155(e) }, __SafeBuffer_155.allocUnsafeSlow = function(e) { if ("number" != typeof e) throw new TypeError("Argument must be a number"); return __buffer_155.SlowBuffer(e) }; var _$string_decoder_154 = {},
        __Buffer_154 = _$safeBuffer_155.Buffer,
        __isEncoding_154 = __Buffer_154.isEncoding || function(e) { switch ((e = "" + e) && e.toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                case "raw":
                    return !0;
                default:
                    return !1 } };

    function __StringDecoder_154(e) { var t; switch (this.encoding = function(e) { var t = function(e) { if (!e) return "utf8"; for (var t;;) switch (e) {
                    case "utf8":
                    case "utf-8":
                        return "utf8";
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return "utf16le";
                    case "latin1":
                    case "binary":
                        return "latin1";
                    case "base64":
                    case "ascii":
                    case "hex":
                        return e;
                    default:
                        if (t) return;
                        e = ("" + e).toLowerCase(), t = !0 } }(e); if ("string" != typeof t && (__Buffer_154.isEncoding === __isEncoding_154 || !__isEncoding_154(e))) throw new Error("Unknown encoding: " + e); return t || e }(e), this.encoding) {
            case "utf16le":
                this.text = __utf16Text_154, this.end = __utf16End_154, t = 4; break;
            case "utf8":
                this.fillLast = __utf8FillLast_154, t = 4; break;
            case "base64":
                this.text = __base64Text_154, this.end = __base64End_154, t = 3; break;
            default:
                return this.write = __simpleWrite_154, void(this.end = __simpleEnd_154) }
        this.lastNeed = 0, this.lastTotal = 0, this.lastChar = __Buffer_154.allocUnsafe(t) }

    function __utf8CheckByte_154(e) { return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2 }

    function __utf8FillLast_154(e) { var t = this.lastTotal - this.lastNeed,
            r = function(e, t, r) { if (128 != (192 & t[0])) return e.lastNeed = 0, "\ufffd"; if (e.lastNeed > 1 && t.length > 1) { if (128 != (192 & t[1])) return e.lastNeed = 1, "\ufffd"; if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2])) return e.lastNeed = 2, "\ufffd" } }(this, e); return void 0 !== r ? r : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length), void(this.lastNeed -= e.length)) }

    function __utf16Text_154(e, t) { if ((e.length - t) % 2 == 0) { var r = e.toString("utf16le", t); if (r) { var i = r.charCodeAt(r.length - 1); if (i >= 55296 && i <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1], r.slice(0, -1) } return r } return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], e.toString("utf16le", t, e.length - 1) }

    function __utf16End_154(e) { var t = e && e.length ? this.write(e) : ""; if (this.lastNeed) { var r = this.lastTotal - this.lastNeed; return t + this.lastChar.toString("utf16le", 0, r) } return t }

    function __base64Text_154(e, t) { var r = (e.length - t) % 3; return 0 === r ? e.toString("base64", t) : (this.lastNeed = 3 - r, this.lastTotal = 3, 1 === r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - r)) }

    function __base64End_154(e) { var t = e && e.length ? this.write(e) : ""; return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t }

    function __simpleWrite_154(e) { return e.toString(this.encoding) }

    function __simpleEnd_154(e) { return e && e.length ? this.write(e) : "" }
    _$string_decoder_154.StringDecoder = __StringDecoder_154, __StringDecoder_154.prototype.write = function(e) { if (0 === e.length) return ""; var t, r; if (this.lastNeed) { if (void 0 === (t = this.fillLast(e))) return "";
            r = this.lastNeed, this.lastNeed = 0 } else r = 0; return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || "" }, __StringDecoder_154.prototype.end = function(e) { var t = e && e.length ? this.write(e) : ""; return this.lastNeed ? t + "\ufffd" : t }, __StringDecoder_154.prototype.text = function(e, t) { var r = function(e, t, r) { var i = t.length - 1; if (i < r) return 0; var n = __utf8CheckByte_154(t[i]); return n >= 0 ? (n > 0 && (e.lastNeed = n - 1), n) : --i < r || -2 === n ? 0 : (n = __utf8CheckByte_154(t[i])) >= 0 ? (n > 0 && (e.lastNeed = n - 2), n) : --i < r || -2 === n ? 0 : (n = __utf8CheckByte_154(t[i])) >= 0 ? (n > 0 && (2 === n ? n = 0 : e.lastNeed = n - 3), n) : 0 }(this, e, t); if (!this.lastNeed) return e.toString("utf8", t);
        this.lastTotal = r; var i = e.length - (r - this.lastNeed); return e.copy(this.lastChar, 0, i), e.toString("utf8", t, i) }, __StringDecoder_154.prototype.fillLast = function(e) { if (this.lastNeed <= e.length) return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
        e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length }; var _$cipherBase_48 = {},
        __Buffer_48 = _$safeBuffer_144.Buffer,
        __Transform_48 = _$Stream_153.Transform,
        __StringDecoder_48 = _$string_decoder_154.StringDecoder;

    function CipherBase(e) { __Transform_48.call(this), this.hashMode = "string" == typeof e, this.hashMode ? this[e] = this._finalOrDigest : this.final = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null }
    _$inherits_browser_99(CipherBase, __Transform_48), CipherBase.prototype.update = function(e, t, r) { "string" == typeof e && (e = __Buffer_48.from(e, t)); var i = this._update(e); return this.hashMode ? this : (r && (i = this._toString(i, r)), i) }, CipherBase.prototype.setAutoPadding = function() {}, CipherBase.prototype.getAuthTag = function() { throw new Error("trying to get auth tag in unsupported state") }, CipherBase.prototype.setAuthTag = function() { throw new Error("trying to set auth tag in unsupported state") }, CipherBase.prototype.setAAD = function() { throw new Error("trying to set aad in unsupported state") }, CipherBase.prototype._transform = function(e, t, r) { var i; try { this.hashMode ? this._update(e) : this.push(this._update(e)) } catch (n) { i = n } finally { r(i) } }, CipherBase.prototype._flush = function(e) { var t; try { this.push(this.__final()) } catch (r) { t = r }
        e(t) }, CipherBase.prototype._finalOrDigest = function(e) { var t = this.__final() || __Buffer_48.alloc(0); return e && (t = this._toString(t, e, !0)), t }, CipherBase.prototype._toString = function(e, t, r) { if (this._decoder || (this._decoder = new __StringDecoder_48(t), this._encoding = t), this._encoding !== t) throw new Error("can't switch encodings"); var i = this._decoder.write(e); return r && (i += this._decoder.end()), i }, _$cipherBase_48 = CipherBase; var _$browser_51 = {};

    function __Hash_51(e) { _$cipherBase_48.call(this, "digest"), this._hash = e }
    _$inherits_browser_99(__Hash_51, _$cipherBase_48), __Hash_51.prototype._update = function(e) { this._hash.update(e) }, __Hash_51.prototype._final = function() { return this._hash.digest() }, _$browser_51 = function(e) { return "md5" === (e = e.toLowerCase()) ? new _$md5Js_102 : "rmd160" === e || "ripemd160" === e ? new _$ripemd160_143 : new __Hash_51(_$shaJs_146(e)) }; var _$legacy_54 = {},
        __Buffer_54 = _$safeBuffer_144.Buffer,
        ZEROS = __Buffer_54.alloc(128),
        blocksize = 64;

    function Hmac(e, t) { _$cipherBase_48.call(this, "digest"), "string" == typeof t && (t = __Buffer_54.from(t)), this._alg = e, this._key = t, t.length > blocksize ? t = e(t) : t.length < blocksize && (t = __Buffer_54.concat([t, ZEROS], blocksize)); for (var r = this._ipad = __Buffer_54.allocUnsafe(blocksize), i = this._opad = __Buffer_54.allocUnsafe(blocksize), n = 0; n < blocksize; n++) r[n] = 54 ^ t[n], i[n] = 92 ^ t[n];
        this._hash = [r] }
    _$inherits_browser_99(Hmac, _$cipherBase_48), Hmac.prototype._update = function(e) { this._hash.push(e) }, Hmac.prototype._final = function() { var e = this._alg(__Buffer_54.concat(this._hash)); return this._alg(__Buffer_54.concat([this._opad, e])) }, _$legacy_54 = Hmac; var _$md5_52 = function(e) { return (new _$md5Js_102).update(e).digest() },
        _$browser_53 = {},
        __Buffer_53 = _$safeBuffer_144.Buffer,
        __ZEROS_53 = __Buffer_53.alloc(128);

    function __Hmac_53(e, t) { _$cipherBase_48.call(this, "digest"), "string" == typeof t && (t = __Buffer_53.from(t)); var r = "sha512" === e || "sha384" === e ? 128 : 64;
        this._alg = e, this._key = t, t.length > r ? t = ("rmd160" === e ? new _$ripemd160_143 : _$shaJs_146(e)).update(t).digest() : t.length < r && (t = __Buffer_53.concat([t, __ZEROS_53], r)); for (var i = this._ipad = __Buffer_53.allocUnsafe(r), n = this._opad = __Buffer_53.allocUnsafe(r), s = 0; s < r; s++) i[s] = 54 ^ t[s], n[s] = 92 ^ t[s];
        this._hash = "rmd160" === e ? new _$ripemd160_143 : _$shaJs_146(e), this._hash.update(i) }
    _$inherits_browser_99(__Hmac_53, _$cipherBase_48), __Hmac_53.prototype._update = function(e) { this._hash.update(e) }, __Hmac_53.prototype._final = function() { var e = this._hash.digest(); return ("rmd160" === this._alg ? new _$ripemd160_143 : _$shaJs_146(this._alg)).update(this._opad).update(e).digest() }, _$browser_53 = function(e, t) { return "rmd160" === (e = e.toLowerCase()) || "ripemd160" === e ? new __Hmac_53("rmd160", t) : "md5" === e ? new _$legacy_54(_$md5_52, t) : new __Hmac_53(e, t) }; var _$algorithms_41 = { sha224WithRSAEncryption: { sign: "rsa", hash: "sha224", id: "302d300d06096086480165030402040500041c" }, "RSA-SHA224": { sign: "ecdsa/rsa", hash: "sha224", id: "302d300d06096086480165030402040500041c" }, sha256WithRSAEncryption: { sign: "rsa", hash: "sha256", id: "3031300d060960864801650304020105000420" }, "RSA-SHA256": { sign: "ecdsa/rsa", hash: "sha256", id: "3031300d060960864801650304020105000420" }, sha384WithRSAEncryption: { sign: "rsa", hash: "sha384", id: "3041300d060960864801650304020205000430" }, "RSA-SHA384": { sign: "ecdsa/rsa", hash: "sha384", id: "3041300d060960864801650304020205000430" }, sha512WithRSAEncryption: { sign: "rsa", hash: "sha512", id: "3051300d060960864801650304020305000440" }, "RSA-SHA512": { sign: "ecdsa/rsa", hash: "sha512", id: "3051300d060960864801650304020305000440" }, "RSA-SHA1": { sign: "rsa", hash: "sha1", id: "3021300906052b0e03021a05000414" }, "ecdsa-with-SHA1": { sign: "ecdsa", hash: "sha1", id: "" }, sha256: { sign: "ecdsa", hash: "sha256", id: "" }, sha224: { sign: "ecdsa", hash: "sha224", id: "" }, sha384: { sign: "ecdsa", hash: "sha384", id: "" }, sha512: { sign: "ecdsa", hash: "sha512", id: "" }, "DSA-SHA": { sign: "dsa", hash: "sha1", id: "" }, "DSA-SHA1": { sign: "dsa", hash: "sha1", id: "" }, DSA: { sign: "dsa", hash: "sha1", id: "" }, "DSA-WITH-SHA224": { sign: "dsa", hash: "sha224", id: "" }, "DSA-SHA224": { sign: "dsa", hash: "sha224", id: "" }, "DSA-WITH-SHA256": { sign: "dsa", hash: "sha256", id: "" }, "DSA-SHA256": { sign: "dsa", hash: "sha256", id: "" }, "DSA-WITH-SHA384": { sign: "dsa", hash: "sha384", id: "" }, "DSA-SHA384": { sign: "dsa", hash: "sha384", id: "" }, "DSA-WITH-SHA512": { sign: "dsa", hash: "sha512", id: "" }, "DSA-SHA512": { sign: "dsa", hash: "sha512", id: "" }, "DSA-RIPEMD160": { sign: "dsa", hash: "rmd160", id: "" }, ripemd160WithRSA: { sign: "rsa", hash: "rmd160", id: "3021300906052b2403020105000414" }, "RSA-RIPEMD160": { sign: "rsa", hash: "rmd160", id: "3021300906052b2403020105000414" }, md5WithRSAEncryption: { sign: "rsa", hash: "md5", id: "3020300c06082a864886f70d020505000410" }, "RSA-MD5": { sign: "rsa", hash: "md5", id: "3020300c06082a864886f70d020505000410" } },
        _$algos_40 = _$algorithms_41,
        _$precondition_114 = {};
    (function(e) { var t = Math.pow(2, 30) - 1;

        function r(t, r) { if ("string" != typeof t && !e.isBuffer(t)) throw new TypeError(r + " must be a buffer or string") }
        _$precondition_114 = function(e, i, n, s) { if (r(e, "Password"), r(i, "Salt"), "number" != typeof n) throw new TypeError("Iterations not a number"); if (n < 0) throw new TypeError("Bad iterations"); if ("number" != typeof s) throw new TypeError("Key length not a number"); if (s < 0 || s > t || s != s) throw new TypeError("Bad key length") } }).call(this, { isBuffer: _$isBuffer_100 }); var _$defaultEncoding_113 = {};
    (function(e) { var t;
        t = e.browser ? "utf-8" : parseInt(e.version.split(".")[0].slice(1), 10) >= 6 ? "utf-8" : "binary", _$defaultEncoding_113 = t }).call(this, _$browser_117); var _$syncBrowser_115 = {},
        __Buffer_115 = _$safeBuffer_144.Buffer,
        __ZEROS_115 = __Buffer_115.alloc(128),
        sizes = { md5: 16, sha1: 20, sha224: 28, sha256: 32, sha384: 48, sha512: 64, rmd160: 20, ripemd160: 20 };

    function __Hmac_115(e, t, r) { var i = function(e) { return "rmd160" === e || "ripemd160" === e ? function(e) { return (new _$ripemd160_143).update(e).digest() } : "md5" === e ? _$md5_52 : function(t) { return _$shaJs_146(e).update(t).digest() } }(e),
            n = "sha512" === e || "sha384" === e ? 128 : 64;
        t.length > n ? t = i(t) : t.length < n && (t = __Buffer_115.concat([t, __ZEROS_115], n)); for (var s = __Buffer_115.allocUnsafe(n + sizes[e]), a = __Buffer_115.allocUnsafe(n + sizes[e]), o = 0; o < n; o++) s[o] = 54 ^ t[o], a[o] = 92 ^ t[o]; var f = __Buffer_115.allocUnsafe(n + r + 4);
        s.copy(f, 0, 0, n), this.ipad1 = f, this.ipad2 = s, this.opad = a, this.alg = e, this.blocksize = n, this.hash = i, this.size = sizes[e] }
    __Hmac_115.prototype.run = function(e, t) { return e.copy(t, this.blocksize), this.hash(t).copy(this.opad, this.blocksize), this.hash(this.opad) }, _$syncBrowser_115 = function(e, t, r, i, n) { _$precondition_114(e, t, r, i), __Buffer_115.isBuffer(e) || (e = __Buffer_115.from(e, _$defaultEncoding_113)), __Buffer_115.isBuffer(t) || (t = __Buffer_115.from(t, _$defaultEncoding_113)); var s = new __Hmac_115(n = n || "sha1", e, t.length),
            a = __Buffer_115.allocUnsafe(i),
            o = __Buffer_115.allocUnsafe(t.length + 4);
        t.copy(o, 0, 0, t.length); for (var f = 0, c = sizes[n], u = Math.ceil(i / c), h = 1; h <= u; h++) { o.writeUInt32BE(h, t.length); for (var d = s.run(o, s.ipad1), l = d, _ = 1; _ < r; _++) { l = s.run(l, s.ipad2); for (var p = 0; p < c; p++) d[p] ^= l[p] }
            d.copy(a, f), f += c } return a }; var _$async_112 = {};
    (function(e, t) { var r, i = _$safeBuffer_144.Buffer,
            n = t.crypto && t.crypto.subtle,
            s = { sha: "SHA-1", "sha-1": "SHA-1", sha1: "SHA-1", sha256: "SHA-256", "sha-256": "SHA-256", sha384: "SHA-384", "sha-384": "SHA-384", "sha-512": "SHA-512", sha512: "SHA-512" },
            a = [];

        function o(e, t, r, s, a) { return n.importKey("raw", e, { name: "PBKDF2" }, !1, ["deriveBits"]).then(function(e) { return n.deriveBits({ name: "PBKDF2", salt: t, iterations: r, hash: { name: a } }, e, s << 3) }).then(function(e) { return i.from(e) }) }
        _$async_112 = function(f, c, u, h, d, l) { "function" == typeof d && (l = d, d = void 0); var _ = s[(d = d || "sha1").toLowerCase()]; if (!_ || "function" != typeof t.Promise) return e.nextTick(function() { var e; try { e = _$syncBrowser_115(f, c, u, h, d) } catch (t) { return l(t) }
                l(null, e) }); if (_$precondition_114(f, c, u, h), "function" != typeof l) throw new Error("No callback provided to pbkdf2");
            i.isBuffer(f) || (f = i.from(f, _$defaultEncoding_113)), i.isBuffer(c) || (c = i.from(c, _$defaultEncoding_113)),
                function(t, r) { t.then(function(t) { e.nextTick(function() { r(null, t) }) }, function(t) { e.nextTick(function() { r(t) }) }) }(function(e) { if (t.process && !t.process.browser) return Promise.resolve(!1); if (!n || !n.importKey || !n.deriveBits) return Promise.resolve(!1); if (void 0 !== a[e]) return a[e]; var s = o(r = r || i.alloc(8), r, 10, 128, e).then(function() { return !0 }).catch(function() { return !1 }); return a[e] = s, s }(_).then(function(e) { return e ? o(f, c, u, h, _) : _$syncBrowser_115(f, c, u, h, d) }), l) } }).call(this, _$browser_117, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); var _$browser_111 = {};
    _$browser_111.pbkdf2Sync = _$syncBrowser_115; var _$utils_61 = { readUInt32BE: function(e, t) { return (e[0 + t] << 24 | e[1 + t] << 16 | e[2 + t] << 8 | e[3 + t]) >>> 0 }, writeUInt32BE: function(e, t, r) { e[0 + r] = t >>> 24, e[1 + r] = t >>> 16 & 255, e[2 + r] = t >>> 8 & 255, e[3 + r] = 255 & t }, ip: function(e, t, r, i) { for (var n = 0, s = 0, a = 6; a >= 0; a -= 2) { for (var o = 0; o <= 24; o += 8) n <<= 1, n |= t >>> o + a & 1; for (o = 0; o <= 24; o += 8) n <<= 1, n |= e >>> o + a & 1 } for (a = 6; a >= 0; a -= 2) { for (o = 1; o <= 25; o += 8) s <<= 1, s |= t >>> o + a & 1; for (o = 1; o <= 25; o += 8) s <<= 1, s |= e >>> o + a & 1 }
                r[i + 0] = n >>> 0, r[i + 1] = s >>> 0 }, rip: function(e, t, r, i) { for (var n = 0, s = 0, a = 0; a < 4; a++)
                    for (var o = 24; o >= 0; o -= 8) n <<= 1, n |= t >>> o + a & 1, n <<= 1, n |= e >>> o + a & 1; for (a = 4; a < 8; a++)
                    for (o = 24; o >= 0; o -= 8) s <<= 1, s |= t >>> o + a & 1, s <<= 1, s |= e >>> o + a & 1;
                r[i + 0] = n >>> 0, r[i + 1] = s >>> 0 }, pc1: function(e, t, r, i) { for (var n = 0, s = 0, a = 7; a >= 5; a--) { for (var o = 0; o <= 24; o += 8) n <<= 1, n |= t >> o + a & 1; for (o = 0; o <= 24; o += 8) n <<= 1, n |= e >> o + a & 1 } for (o = 0; o <= 24; o += 8) n <<= 1, n |= t >> o + a & 1; for (a = 1; a <= 3; a++) { for (o = 0; o <= 24; o += 8) s <<= 1, s |= t >> o + a & 1; for (o = 0; o <= 24; o += 8) s <<= 1, s |= e >> o + a & 1 } for (o = 0; o <= 24; o += 8) s <<= 1, s |= e >> o + a & 1;
                r[i + 0] = n >>> 0, r[i + 1] = s >>> 0 }, r28shl: function(e, t) { return e << t & 268435455 | e >>> 28 - t } },
        pc2table = [14, 11, 17, 4, 27, 23, 25, 0, 13, 22, 7, 18, 5, 9, 16, 24, 2, 20, 12, 21, 1, 8, 15, 26, 15, 4, 25, 19, 9, 1, 26, 16, 5, 11, 23, 8, 12, 7, 17, 0, 22, 3, 10, 14, 6, 20, 27, 24];
    _$utils_61.pc2 = function(e, t, r, i) { for (var n = 0, s = 0, a = pc2table.length >>> 1, o = 0; o < a; o++) n <<= 1, n |= e >>> pc2table[o] & 1; for (o = a; o < pc2table.length; o++) s <<= 1, s |= t >>> pc2table[o] & 1;
        r[i + 0] = n >>> 0, r[i + 1] = s >>> 0 }, _$utils_61.expand = function(e, t, r) { var i = 0,
            n = 0;
        i = (1 & e) << 5 | e >>> 27; for (var s = 23; s >= 15; s -= 4) i <<= 6, i |= e >>> s & 63; for (s = 11; s >= 3; s -= 4) n |= e >>> s & 63, n <<= 6;
        n |= (31 & e) << 1 | e >>> 31, t[r + 0] = i >>> 0, t[r + 1] = n >>> 0 }; var sTable = [14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1, 3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8, 4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7, 15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13, 15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14, 9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5, 0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2, 5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9, 10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10, 1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1, 13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7, 11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12, 7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3, 1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9, 10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8, 15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14, 2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1, 8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6, 4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13, 15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3, 12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5, 0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8, 9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10, 7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13, 4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10, 3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6, 1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7, 10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12, 13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4, 10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2, 7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13, 0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11];
    _$utils_61.substitute = function(e, t) { for (var r = 0, i = 0; i < 4; i++) r <<= 4, r |= sTable[64 * i + (e >>> 18 - 6 * i & 63)]; for (i = 0; i < 4; i++) r <<= 4, r |= sTable[256 + 64 * i + (t >>> 18 - 6 * i & 63)]; return r >>> 0 }; var permuteTable = [16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22, 30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7];
    _$utils_61.permute = function(e) { for (var t = 0, r = 0; r < permuteTable.length; r++) t <<= 1, t |= e >>> permuteTable[r] & 1; return t >>> 0 }, _$utils_61.padSplit = function(e, t, r) { for (var i = e.toString(2); i.length < t;) i = "0" + i; for (var n = [], s = 0; s < t; s += r) n.push(i.slice(s, s + r)); return n.join(" ") }; var _$minimalisticAssert_104 = {};

    function assert(e, t) { if (!e) throw new Error(t || "Assertion failed") }
    _$minimalisticAssert_104 = assert, assert.equal = function(e, t, r) { if (e != t) throw new Error(r || "Assertion failed: " + e + " != " + t) }; var _$cipher_58 = {};

    function Cipher(e) { this.options = e, this.type = this.options.type, this.blockSize = 8, this._init(), this.buffer = new Array(this.blockSize), this.bufferOff = 0 }
    _$cipher_58 = Cipher, Cipher.prototype._init = function() {}, Cipher.prototype.update = function(e) { return 0 === e.length ? [] : "decrypt" === this.type ? this._updateDecrypt(e) : this._updateEncrypt(e) }, Cipher.prototype._buffer = function(e, t) { for (var r = Math.min(this.buffer.length - this.bufferOff, e.length - t), i = 0; i < r; i++) this.buffer[this.bufferOff + i] = e[t + i]; return this.bufferOff += r, r }, Cipher.prototype._flushBuffer = function(e, t) { return this._update(this.buffer, 0, e, t), this.bufferOff = 0, this.blockSize }, Cipher.prototype._updateEncrypt = function(e) { var t = 0,
            r = 0,
            i = (this.bufferOff + e.length) / this.blockSize | 0,
            n = new Array(i * this.blockSize);
        0 !== this.bufferOff && (t += this._buffer(e, t), this.bufferOff === this.buffer.length && (r += this._flushBuffer(n, r))); for (var s = e.length - (e.length - t) % this.blockSize; t < s; t += this.blockSize) this._update(e, t, n, r), r += this.blockSize; for (; t < e.length; t++, this.bufferOff++) this.buffer[this.bufferOff] = e[t]; return n }, Cipher.prototype._updateDecrypt = function(e) { for (var t = 0, r = 0, i = Math.ceil((this.bufferOff + e.length) / this.blockSize) - 1, n = new Array(i * this.blockSize); i > 0; i--) t += this._buffer(e, t), r += this._flushBuffer(n, r); return t += this._buffer(e, t), n }, Cipher.prototype.final = function(e) { var t, r; return e && (t = this.update(e)), r = "encrypt" === this.type ? this._finalEncrypt() : this._finalDecrypt(), t ? t.concat(r) : r }, Cipher.prototype._pad = function(e, t) { if (0 === t) return !1; for (; t < e.length;) e[t++] = 0; return !0 }, Cipher.prototype._finalEncrypt = function() { if (!this._pad(this.buffer, this.bufferOff)) return []; var e = new Array(this.blockSize); return this._update(this.buffer, 0, e, 0), e }, Cipher.prototype._unpad = function(e) { return e }, Cipher.prototype._finalDecrypt = function() { var e = new Array(this.blockSize); return this._flushBuffer(e, 0), this._unpad(e) }; var _$cbc_57 = {},
        proto = {};

    function CBCState(e) { this.iv = new Array(8); for (var t = 0; t < this.iv.length; t++) this.iv[t] = e[t] }
    _$cbc_57.instantiate = function(e) {
        function t(t) { e.call(this, t), this._cbcInit() }
        _$inherits_browser_99(t, e); for (var r = Object.keys(proto), i = 0; i < r.length; i++) { var n = r[i];
            t.prototype[n] = proto[n] } return t.create = function(e) { return new t(e) }, t }, proto._cbcInit = function() { var e = new CBCState(this.options.iv);
        this._cbcState = e }, proto._update = function(e, t, r, i) { var n = this._cbcState,
            s = this.constructor.super_.prototype,
            a = n.iv; if ("encrypt" === this.type) { for (var o = 0; o < this.blockSize; o++) a[o] ^= e[t + o]; for (s._update.call(this, a, 0, r, i), o = 0; o < this.blockSize; o++) a[o] = r[i + o] } else { for (s._update.call(this, e, t, r, i), o = 0; o < this.blockSize; o++) r[i + o] ^= a[o]; for (o = 0; o < this.blockSize; o++) a[o] = e[t + o] } }; var _$browserifyDes_37 = {},
        __des_37 = _$des_56({}),
        __Buffer_37 = _$safeBuffer_144.Buffer,
        modes = { "des-ede3-cbc": __des_37.CBC.instantiate(__des_37.EDE), "des-ede3": __des_37.EDE, "des-ede-cbc": __des_37.CBC.instantiate(__des_37.EDE), "des-ede": __des_37.EDE, "des-cbc": __des_37.CBC.instantiate(__des_37.DES), "des-ecb": __des_37.DES };

    function __DES_37(e) { _$cipherBase_48.call(this); var t, r = e.mode.toLowerCase(),
            i = modes[r];
        t = e.decrypt ? "decrypt" : "encrypt"; var n = e.key;
        __Buffer_37.isBuffer(n) || (n = __Buffer_37.from(n)), "des-ede" !== r && "des-ede-cbc" !== r || (n = __Buffer_37.concat([n, n.slice(0, 8)])); var s = e.iv;
        __Buffer_37.isBuffer(s) || (s = __Buffer_37.from(s)), this._des = i.create({ key: n, iv: s, type: t }) }
    modes.des = modes["des-cbc"], modes.des3 = modes["des-ede3-cbc"], _$browserifyDes_37 = __DES_37, _$inherits_browser_99(__DES_37, _$cipherBase_48), __DES_37.prototype._update = function(e) { return __Buffer_37.from(this._des.update(e)) }, __DES_37.prototype._final = function() { return __Buffer_37.from(this._des.final()) }; var _$ecb_31 = { encrypt: function(e, t) { return e._cipher.encryptBlock(t) }, decrypt: function(e, t) { return e._cipher.decryptBlock(t) } },
        _$bufferXor_46 = {};
    (function(e) { _$bufferXor_46 = function(t, r) { for (var i = Math.min(t.length, r.length), n = new e(i), s = 0; s < i; ++s) n[s] = t[s] ^ r[s]; return n } }).call(this, _$buffer_47({}).Buffer); var _$cbc_26 = { encrypt: function(e, t) { var r = _$bufferXor_46(t, e._prev); return e._prev = e._cipher.encryptBlock(r), e._prev }, decrypt: function(e, t) { var r = e._prev;
                e._prev = t; var i = e._cipher.decryptBlock(t); return _$bufferXor_46(i, r) } },
        _$cfb_27 = {},
        __Buffer_27 = _$safeBuffer_144.Buffer;

    function encryptStart(e, t, r) { var i = t.length,
            n = _$bufferXor_46(t, e._cache); return e._cache = e._cache.slice(i), e._prev = __Buffer_27.concat([e._prev, r ? t : n]), n }
    _$cfb_27.encrypt = function(e, t, r) { for (var i, n = __Buffer_27.allocUnsafe(0); t.length;) { if (0 === e._cache.length && (e._cache = e._cipher.encryptBlock(e._prev), e._prev = __Buffer_27.allocUnsafe(0)), !(e._cache.length <= t.length)) { n = __Buffer_27.concat([n, encryptStart(e, t, r)]); break }
            i = e._cache.length, n = __Buffer_27.concat([n, encryptStart(e, t.slice(0, i), r)]), t = t.slice(i) } return n }; var _$cfb8_29 = {},
        __Buffer_29 = _$safeBuffer_144.Buffer;

    function encryptByte(e, t, r) { var i = e._cipher.encryptBlock(e._prev)[0] ^ t; return e._prev = __Buffer_29.concat([e._prev.slice(1), __Buffer_29.from([r ? t : i])]), i }
    _$cfb8_29.encrypt = function(e, t, r) { for (var i = t.length, n = __Buffer_29.allocUnsafe(i), s = -1; ++s < i;) n[s] = encryptByte(e, t[s], r); return n }; var _$cfb1_28 = {},
        __Buffer_28 = _$safeBuffer_144.Buffer;

    function __encryptByte_28(e, t, r) { for (var i, n, s = -1, a = 0; ++s < 8;) i = t & 1 << 7 - s ? 128 : 0, a += (128 & (n = e._cipher.encryptBlock(e._prev)[0] ^ i)) >> s % 8, e._prev = shiftIn(e._prev, r ? i : n); return a }

    function shiftIn(e, t) { var r = e.length,
            i = -1,
            n = __Buffer_28.allocUnsafe(e.length); for (e = __Buffer_28.concat([e, __Buffer_28.from([t])]); ++i < r;) n[i] = e[i] << 1 | e[i + 1] >> 7; return n }
    _$cfb1_28.encrypt = function(e, t, r) { for (var i = t.length, n = __Buffer_28.allocUnsafe(i), s = -1; ++s < i;) n[s] = __encryptByte_28(e, t[s], r); return n }; var _$ofb_34 = {};
    (function(e) {
        function t(e) { return e._prev = e._cipher.encryptBlock(e._prev), e._prev }
        _$ofb_34.encrypt = function(r, i) { for (; r._cache.length < i.length;) r._cache = e.concat([r._cache, t(r)]); var n = r._cache.slice(0, i.length); return r._cache = r._cache.slice(i.length), _$bufferXor_46(i, n) } }).call(this, _$buffer_47({}).Buffer); var _$incr32_25 = function(e) { for (var t, r = e.length; r--;) { if (255 !== (t = e.readUInt8(r))) { t++, e.writeUInt8(t, r); break }
                e.writeUInt8(0, r) } },
        _$ctr_30 = {},
        __Buffer_30 = _$safeBuffer_144.Buffer;

    function getBlock(e) { var t = e._cipher.encryptBlockRaw(e._prev); return _$incr32_25(e._prev), t }
    _$ctr_30.encrypt = function(e, t) { var r = Math.ceil(t.length / 16),
            i = e._cache.length;
        e._cache = __Buffer_30.concat([e._cache, __Buffer_30.allocUnsafe(16 * r)]); for (var n = 0; n < r; n++) { var s = getBlock(e),
                a = i + 16 * n;
            e._cache.writeUInt32BE(s[0], a + 0), e._cache.writeUInt32BE(s[1], a + 4), e._cache.writeUInt32BE(s[2], a + 8), e._cache.writeUInt32BE(s[3], a + 12) } var o = e._cache.slice(0, t.length); return e._cache = e._cache.slice(t.length), _$bufferXor_46(t, o) }; var _$list_33 = { "aes-128-ecb": { cipher: "AES", key: 128, iv: 0, mode: "ECB", type: "block" }, "aes-192-ecb": { cipher: "AES", key: 192, iv: 0, mode: "ECB", type: "block" }, "aes-256-ecb": { cipher: "AES", key: 256, iv: 0, mode: "ECB", type: "block" }, "aes-128-cbc": { cipher: "AES", key: 128, iv: 16, mode: "CBC", type: "block" }, "aes-192-cbc": { cipher: "AES", key: 192, iv: 16, mode: "CBC", type: "block" }, "aes-256-cbc": { cipher: "AES", key: 256, iv: 16, mode: "CBC", type: "block" }, aes128: { cipher: "AES", key: 128, iv: 16, mode: "CBC", type: "block" }, aes192: { cipher: "AES", key: 192, iv: 16, mode: "CBC", type: "block" }, aes256: { cipher: "AES", key: 256, iv: 16, mode: "CBC", type: "block" }, "aes-128-cfb": { cipher: "AES", key: 128, iv: 16, mode: "CFB", type: "stream" }, "aes-192-cfb": { cipher: "AES", key: 192, iv: 16, mode: "CFB", type: "stream" }, "aes-256-cfb": { cipher: "AES", key: 256, iv: 16, mode: "CFB", type: "stream" }, "aes-128-cfb8": { cipher: "AES", key: 128, iv: 16, mode: "CFB8", type: "stream" }, "aes-192-cfb8": { cipher: "AES", key: 192, iv: 16, mode: "CFB8", type: "stream" }, "aes-256-cfb8": { cipher: "AES", key: 256, iv: 16, mode: "CFB8", type: "stream" }, "aes-128-cfb1": { cipher: "AES", key: 128, iv: 16, mode: "CFB1", type: "stream" }, "aes-192-cfb1": { cipher: "AES", key: 192, iv: 16, mode: "CFB1", type: "stream" }, "aes-256-cfb1": { cipher: "AES", key: 256, iv: 16, mode: "CFB1", type: "stream" }, "aes-128-ofb": { cipher: "AES", key: 128, iv: 16, mode: "OFB", type: "stream" }, "aes-192-ofb": { cipher: "AES", key: 192, iv: 16, mode: "OFB", type: "stream" }, "aes-256-ofb": { cipher: "AES", key: 256, iv: 16, mode: "OFB", type: "stream" }, "aes-128-ctr": { cipher: "AES", key: 128, iv: 16, mode: "CTR", type: "stream" }, "aes-192-ctr": { cipher: "AES", key: 192, iv: 16, mode: "CTR", type: "stream" }, "aes-256-ctr": { cipher: "AES", key: 256, iv: 16, mode: "CTR", type: "stream" }, "aes-128-gcm": { cipher: "AES", key: 128, iv: 12, mode: "GCM", type: "auth" }, "aes-192-gcm": { cipher: "AES", key: 192, iv: 12, mode: "GCM", type: "auth" }, "aes-256-gcm": { cipher: "AES", key: 256, iv: 12, mode: "GCM", type: "auth" } },
        modeModules = { ECB: _$ecb_31, CBC: _$cbc_26, CFB: _$cfb_27, CFB8: _$cfb8_29, CFB1: _$cfb1_28, OFB: _$ofb_34, CTR: _$ctr_30, GCM: _$ctr_30 }; for (var key in _$list_33) _$list_33[key].module = modeModules[_$list_33[key].mode]; var _$modes_32 = _$list_33,
        _$aes_19 = {},
        __Buffer_19 = _$safeBuffer_144.Buffer;

    function asUInt32Array(e) { __Buffer_19.isBuffer(e) || (e = __Buffer_19.from(e)); for (var t = e.length / 4 | 0, r = new Array(t), i = 0; i < t; i++) r[i] = e.readUInt32BE(4 * i); return r }

    function scrubVec(e) { for (; 0 < e.length; e++) e[0] = 0 }

    function cryptBlock(e, t, r, i, n) { for (var s, a, o, f, c = r[0], u = r[1], h = r[2], d = r[3], l = e[0] ^ t[0], _ = e[1] ^ t[1], p = e[2] ^ t[2], b = e[3] ^ t[3], m = 4, g = 1; g < n; g++) s = c[l >>> 24] ^ u[_ >>> 16 & 255] ^ h[p >>> 8 & 255] ^ d[255 & b] ^ t[m++], a = c[_ >>> 24] ^ u[p >>> 16 & 255] ^ h[b >>> 8 & 255] ^ d[255 & l] ^ t[m++], o = c[p >>> 24] ^ u[b >>> 16 & 255] ^ h[l >>> 8 & 255] ^ d[255 & _] ^ t[m++], f = c[b >>> 24] ^ u[l >>> 16 & 255] ^ h[_ >>> 8 & 255] ^ d[255 & p] ^ t[m++], l = s, _ = a, p = o, b = f; return s = (i[l >>> 24] << 24 | i[_ >>> 16 & 255] << 16 | i[p >>> 8 & 255] << 8 | i[255 & b]) ^ t[m++], a = (i[_ >>> 24] << 24 | i[p >>> 16 & 255] << 16 | i[b >>> 8 & 255] << 8 | i[255 & l]) ^ t[m++], o = (i[p >>> 24] << 24 | i[b >>> 16 & 255] << 16 | i[l >>> 8 & 255] << 8 | i[255 & _]) ^ t[m++], f = (i[b >>> 24] << 24 | i[l >>> 16 & 255] << 16 | i[_ >>> 8 & 255] << 8 | i[255 & p]) ^ t[m++], [s >>>= 0, a >>>= 0, o >>>= 0, f >>>= 0] } var RCON = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
        G = function() { for (var e = new Array(256), t = 0; t < 256; t++) e[t] = t < 128 ? t << 1 : t << 1 ^ 283; for (var r = [], i = [], n = [
                    [],
                    [],
                    [],
                    []
                ], s = [
                    [],
                    [],
                    [],
                    []
                ], a = 0, o = 0, f = 0; f < 256; ++f) { var c = o ^ o << 1 ^ o << 2 ^ o << 3 ^ o << 4;
                c = c >>> 8 ^ 255 & c ^ 99, r[a] = c, i[c] = a; var u = e[a],
                    h = e[u],
                    d = e[h],
                    l = 257 * e[c] ^ 16843008 * c;
                n[0][a] = l << 24 | l >>> 8, n[1][a] = l << 16 | l >>> 16, n[2][a] = l << 8 | l >>> 24, n[3][a] = l, l = 16843009 * d ^ 65537 * h ^ 257 * u ^ 16843008 * a, s[0][c] = l << 24 | l >>> 8, s[1][c] = l << 16 | l >>> 16, s[2][c] = l << 8 | l >>> 24, s[3][c] = l, 0 === a ? a = o = 1 : (a = u ^ e[e[e[d ^ u]]], o ^= e[e[o]]) } return { SBOX: r, INV_SBOX: i, SUB_MIX: n, INV_SUB_MIX: s } }();

    function AES(e) { this._key = asUInt32Array(e), this._reset() }
    AES.blockSize = 16, AES.keySize = 32, AES.prototype.blockSize = AES.blockSize, AES.prototype.keySize = AES.keySize, AES.prototype._reset = function() { for (var e = this._key, t = e.length, r = t + 6, i = 4 * (r + 1), n = [], s = 0; s < t; s++) n[s] = e[s]; for (s = t; s < i; s++) { var a = n[s - 1];
            s % t == 0 ? (a = a << 8 | a >>> 24, a = G.SBOX[a >>> 24] << 24 | G.SBOX[a >>> 16 & 255] << 16 | G.SBOX[a >>> 8 & 255] << 8 | G.SBOX[255 & a], a ^= RCON[s / t | 0] << 24) : t > 6 && s % t == 4 && (a = G.SBOX[a >>> 24] << 24 | G.SBOX[a >>> 16 & 255] << 16 | G.SBOX[a >>> 8 & 255] << 8 | G.SBOX[255 & a]), n[s] = n[s - t] ^ a } for (var o = [], f = 0; f < i; f++) { var c = i - f,
                u = n[c - (f % 4 ? 0 : 4)];
            o[f] = f < 4 || c <= 4 ? u : G.INV_SUB_MIX[0][G.SBOX[u >>> 24]] ^ G.INV_SUB_MIX[1][G.SBOX[u >>> 16 & 255]] ^ G.INV_SUB_MIX[2][G.SBOX[u >>> 8 & 255]] ^ G.INV_SUB_MIX[3][G.SBOX[255 & u]] }
        this._nRounds = r, this._keySchedule = n, this._invKeySchedule = o }, AES.prototype.encryptBlockRaw = function(e) { return cryptBlock(e = asUInt32Array(e), this._keySchedule, G.SUB_MIX, G.SBOX, this._nRounds) }, AES.prototype.encryptBlock = function(e) { var t = this.encryptBlockRaw(e),
            r = __Buffer_19.allocUnsafe(16); return r.writeUInt32BE(t[0], 0), r.writeUInt32BE(t[1], 4), r.writeUInt32BE(t[2], 8), r.writeUInt32BE(t[3], 12), r }, AES.prototype.decryptBlock = function(e) { var t = (e = asUInt32Array(e))[1];
        e[1] = e[3], e[3] = t; var r = cryptBlock(e, this._invKeySchedule, G.INV_SUB_MIX, G.INV_SBOX, this._nRounds),
            i = __Buffer_19.allocUnsafe(16); return i.writeUInt32BE(r[0], 0), i.writeUInt32BE(r[3], 4), i.writeUInt32BE(r[2], 8), i.writeUInt32BE(r[1], 12), i }, AES.prototype.scrub = function() { scrubVec(this._keySchedule), scrubVec(this._invKeySchedule), scrubVec(this._key) }, _$aes_19.AES = AES; var _$ghash_24 = {},
        __Buffer_24 = _$safeBuffer_144.Buffer,
        ZEROES = __Buffer_24.alloc(16, 0);

    function fromArray(e) { var t = __Buffer_24.allocUnsafe(16); return t.writeUInt32BE(e[0] >>> 0, 0), t.writeUInt32BE(e[1] >>> 0, 4), t.writeUInt32BE(e[2] >>> 0, 8), t.writeUInt32BE(e[3] >>> 0, 12), t }

    function GHASH(e) { this.h = e, this.state = __Buffer_24.alloc(16, 0), this.cache = __Buffer_24.allocUnsafe(0) }
    GHASH.prototype.ghash = function(e) { for (var t = -1; ++t < e.length;) this.state[t] ^= e[t];
        this._multiply() }, GHASH.prototype._multiply = function() { for (var e, t, r, i = [(e = this.h).readUInt32BE(0), e.readUInt32BE(4), e.readUInt32BE(8), e.readUInt32BE(12)], n = [0, 0, 0, 0], s = -1; ++s < 128;) { for (0 != (this.state[~~(s / 8)] & 1 << 7 - s % 8) && (n[0] ^= i[0], n[1] ^= i[1], n[2] ^= i[2], n[3] ^= i[3]), r = 0 != (1 & i[3]), t = 3; t > 0; t--) i[t] = i[t] >>> 1 | (1 & i[t - 1]) << 31;
            i[0] = i[0] >>> 1, r && (i[0] = i[0] ^ 225 << 24) }
        this.state = fromArray(n) }, GHASH.prototype.update = function(e) { var t; for (this.cache = __Buffer_24.concat([this.cache, e]); this.cache.length >= 16;) t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), this.ghash(t) }, GHASH.prototype.final = function(e, t) { return this.cache.length && this.ghash(__Buffer_24.concat([this.cache, ZEROES], 16)), this.ghash(fromArray([0, e, 0, t])), this.state }, _$ghash_24 = GHASH; var _$authCipher_20 = {},
        __Buffer_20 = _$safeBuffer_144.Buffer;

    function StreamCipher(e, t, r, i) { _$cipherBase_48.call(this); var n = __Buffer_20.alloc(4, 0);
        this._cipher = new _$aes_19.AES(t); var s = this._cipher.encryptBlock(n);
        this._ghash = new _$ghash_24(s), r = function(e, t, r) { if (12 === t.length) return e._finID = __Buffer_20.concat([t, __Buffer_20.from([0, 0, 0, 1])]), __Buffer_20.concat([t, __Buffer_20.from([0, 0, 0, 2])]); var i = new _$ghash_24(r),
                n = t.length,
                s = n % 16;
            i.update(t), s && (s = 16 - s, i.update(__Buffer_20.alloc(s, 0))), i.update(__Buffer_20.alloc(8, 0)); var a = 8 * n,
                o = __Buffer_20.alloc(8);
            o.writeUIntBE(a, 0, 8), i.update(o), e._finID = i.state; var f = __Buffer_20.from(e._finID); return _$incr32_25(f), f }(this, r, s), this._prev = __Buffer_20.from(r), this._cache = __Buffer_20.allocUnsafe(0), this._secCache = __Buffer_20.allocUnsafe(0), this._decrypt = i, this._alen = 0, this._len = 0, this._mode = e, this._authTag = null, this._called = !1 }
    _$inherits_browser_99(StreamCipher, _$cipherBase_48), StreamCipher.prototype._update = function(e) { if (!this._called && this._alen) { var t = 16 - this._alen % 16;
            t < 16 && (t = __Buffer_20.alloc(t, 0), this._ghash.update(t)) }
        this._called = !0; var r = this._mode.encrypt(this, e); return this._decrypt ? this._ghash.update(e) : this._ghash.update(r), this._len += e.length, r }, StreamCipher.prototype._final = function() { if (this._decrypt && !this._authTag) throw new Error("Unsupported state or unable to authenticate data"); var e = _$bufferXor_46(this._ghash.final(8 * this._alen, 8 * this._len), this._cipher.encryptBlock(this._finID)); if (this._decrypt && function(e, t) { var r = 0;
                e.length !== t.length && r++; for (var i = Math.min(e.length, t.length), n = 0; n < i; ++n) r += e[n] ^ t[n]; return r }(e, this._authTag)) throw new Error("Unsupported state or unable to authenticate data");
        this._authTag = e, this._cipher.scrub() }, StreamCipher.prototype.getAuthTag = function() { if (this._decrypt || !__Buffer_20.isBuffer(this._authTag)) throw new Error("Attempting to get auth tag in unsupported state"); return this._authTag }, StreamCipher.prototype.setAuthTag = function(e) { if (!this._decrypt) throw new Error("Attempting to set auth tag in unsupported state");
        this._authTag = e }, StreamCipher.prototype.setAAD = function(e) { if (this._called) throw new Error("Attempting to set AAD in unsupported state");
        this._ghash.update(e), this._alen += e.length }, _$authCipher_20 = StreamCipher; var _$streamCipher_35 = {},
        __Buffer_35 = _$safeBuffer_144.Buffer;

    function __StreamCipher_35(e, t, r, i) { _$cipherBase_48.call(this), this._cipher = new _$aes_19.AES(t), this._prev = __Buffer_35.from(r), this._cache = __Buffer_35.allocUnsafe(0), this._secCache = __Buffer_35.allocUnsafe(0), this._decrypt = i, this._mode = e }
    _$inherits_browser_99(__StreamCipher_35, _$cipherBase_48), __StreamCipher_35.prototype._update = function(e) { return this._mode.encrypt(this, e, this._decrypt) }, __StreamCipher_35.prototype._final = function() { this._cipher.scrub() }, _$streamCipher_35 = __StreamCipher_35; var __Buffer_83 = _$safeBuffer_144.Buffer,
        _$evp_bytestokey_83 = function(e, t, r, i) { if (__Buffer_83.isBuffer(e) || (e = __Buffer_83.from(e, "binary")), t && (__Buffer_83.isBuffer(t) || (t = __Buffer_83.from(t, "binary")), 8 !== t.length)) throw new RangeError("salt should be Buffer with 8 byte length"); for (var n = r / 8, s = __Buffer_83.alloc(n), a = __Buffer_83.alloc(i || 0), o = __Buffer_83.alloc(0); n > 0 || i > 0;) { var f = new _$md5Js_102;
                f.update(o), f.update(e), t && f.update(t), o = f.digest(); var c = 0; if (n > 0) { var u = s.length - n;
                    c = Math.min(n, o.length), o.copy(s, u, 0, c), n -= c } if (c < o.length && i > 0) { var h = a.length - i,
                        d = Math.min(i, o.length - c);
                    o.copy(a, h, c, c + d), i -= d } } return o.fill(0), { key: s, iv: a } },
        _$encrypter_23 = {},
        __Buffer_23 = _$safeBuffer_144.Buffer;

    function __Cipher_23(e, t, r) { _$cipherBase_48.call(this), this._cache = new Splitter, this._cipher = new _$aes_19.AES(t), this._prev = __Buffer_23.from(r), this._mode = e, this._autopadding = !0 }
    _$inherits_browser_99(__Cipher_23, _$cipherBase_48), __Cipher_23.prototype._update = function(e) { var t, r;
        this._cache.add(e); for (var i = []; t = this._cache.get();) r = this._mode.encrypt(this, t), i.push(r); return __Buffer_23.concat(i) }; var PADDING = __Buffer_23.alloc(16, 16);

    function Splitter() { this.cache = __Buffer_23.allocUnsafe(0) }

    function createCipheriv(e, t, r) { var i = _$modes_32[e.toLowerCase()]; if (!i) throw new TypeError("invalid suite type"); if ("string" == typeof t && (t = __Buffer_23.from(t)), t.length !== i.key / 8) throw new TypeError("invalid key length " + t.length); if ("string" == typeof r && (r = __Buffer_23.from(r)), "GCM" !== i.mode && r.length !== i.iv) throw new TypeError("invalid iv length " + r.length); return "stream" === i.type ? new _$streamCipher_35(i.module, t, r) : "auth" === i.type ? new _$authCipher_20(i.module, t, r) : new __Cipher_23(i.module, t, r) }
    __Cipher_23.prototype._final = function() { var e = this._cache.flush(); if (this._autopadding) return e = this._mode.encrypt(this, e), this._cipher.scrub(), e; if (!e.equals(PADDING)) throw this._cipher.scrub(), new Error("data not multiple of block length") }, __Cipher_23.prototype.setAutoPadding = function(e) { return this._autopadding = !!e, this }, Splitter.prototype.add = function(e) { this.cache = __Buffer_23.concat([this.cache, e]) }, Splitter.prototype.get = function() { if (this.cache.length > 15) { var e = this.cache.slice(0, 16); return this.cache = this.cache.slice(16), e } return null }, Splitter.prototype.flush = function() { for (var e = 16 - this.cache.length, t = __Buffer_23.allocUnsafe(e), r = -1; ++r < e;) t.writeUInt8(e, r); return __Buffer_23.concat([this.cache, t]) }; var _$decrypter_22 = {},
        __Buffer_22 = _$safeBuffer_144.Buffer;

    function Decipher(e, t, r) { _$cipherBase_48.call(this), this._cache = new __Splitter_22, this._last = void 0, this._cipher = new _$aes_19.AES(t), this._prev = __Buffer_22.from(r), this._mode = e, this._autopadding = !0 }

    function __Splitter_22() { this.cache = __Buffer_22.allocUnsafe(0) }

    function createDecipheriv(e, t, r) { var i = _$modes_32[e.toLowerCase()]; if (!i) throw new TypeError("invalid suite type"); if ("string" == typeof r && (r = __Buffer_22.from(r)), "GCM" !== i.mode && r.length !== i.iv) throw new TypeError("invalid iv length " + r.length); if ("string" == typeof t && (t = __Buffer_22.from(t)), t.length !== i.key / 8) throw new TypeError("invalid key length " + t.length); return "stream" === i.type ? new _$streamCipher_35(i.module, t, r, !0) : "auth" === i.type ? new _$authCipher_20(i.module, t, r, !0) : new Decipher(i.module, t, r) }
    _$inherits_browser_99(Decipher, _$cipherBase_48), Decipher.prototype._update = function(e) { var t, r;
        this._cache.add(e); for (var i = []; t = this._cache.get(this._autopadding);) r = this._mode.decrypt(this, t), i.push(r); return __Buffer_22.concat(i) }, Decipher.prototype._final = function() { var e = this._cache.flush(); if (this._autopadding) return function(e) { var t = e[15]; if (t < 1 || t > 16) throw new Error("unable to decrypt data"); for (var r = -1; ++r < t;)
                if (e[r + (16 - t)] !== t) throw new Error("unable to decrypt data");
            if (16 !== t) return e.slice(0, 16 - t) }(this._mode.decrypt(this, e)); if (e) throw new Error("data not multiple of block length") }, Decipher.prototype.setAutoPadding = function(e) { return this._autopadding = !!e, this }, __Splitter_22.prototype.add = function(e) { this.cache = __Buffer_22.concat([this.cache, e]) }, __Splitter_22.prototype.get = function(e) { var t; if (e) { if (this.cache.length > 16) return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), t } else if (this.cache.length >= 16) return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), t; return null }, __Splitter_22.prototype.flush = function() { if (this.cache.length) return this.cache }; var _$browser_21 = {};
    _$encrypter_23.createCipher, _$browser_21.createCipheriv = _$encrypter_23.createCipheriv, _$decrypter_22.createDecipher, _$browser_21.createDecipheriv = _$decrypter_22.createDecipheriv; var _$modes_38 = { "des-ecb": { key: 8, iv: 0 } };
    _$modes_38["des-cbc"] = _$modes_38.des = { key: 8, iv: 8 }, _$modes_38["des-ede3-cbc"] = _$modes_38.des3 = { key: 24, iv: 8 }, _$modes_38["des-ede3"] = { key: 24, iv: 0 }, _$modes_38["des-ede-cbc"] = { key: 16, iv: 8 }, _$modes_38["des-ede"] = { key: 16, iv: 0 }; var _$browser_36 = {};

    function __createCipheriv_36(e, t, r) { if (e = e.toLowerCase(), _$modes_32[e]) return _$browser_21.createCipheriv(e, t, r); if (_$modes_38[e]) return new _$browserifyDes_37({ key: t, iv: r, mode: e }); throw new TypeError("invalid suite type") }

    function __createDecipheriv_36(e, t, r) { if (e = e.toLowerCase(), _$modes_32[e]) return _$browser_21.createDecipheriv(e, t, r); if (_$modes_38[e]) return new _$browserifyDes_37({ key: t, iv: r, mode: e, decrypt: !0 }); throw new TypeError("invalid suite type") } var _$bn_16 = { exports: {} };! function(e, t) { "use strict";

        function r(e, t) { e.super_ = t; var r = function() {};
            r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e }

        function i(e, t, r) { if (i.isBN(e)) return e;
            this.negative = 0, this.words = null, this.length = 0, this.red = null, null !== e && ("le" !== t && "be" !== t || (r = t, t = 10), this._init(e || 0, t || 10, r || "be")) } var n; "object" == typeof e ? e.exports = i : t.BN = i, i.BN = i, i.wordSize = 26; try { n = _$empty_18({}).Buffer } catch ($) {}

        function s(e, t, r) { for (var i = 0, n = Math.min(e.length, r), s = t; s < n; s++) { var a = e.charCodeAt(s) - 48;
                i <<= 4, i |= a >= 49 && a <= 54 ? a - 49 + 10 : a >= 17 && a <= 22 ? a - 17 + 10 : 15 & a } return i }

        function a(e, t, r, i) { for (var n = 0, s = Math.min(e.length, r), a = t; a < s; a++) { var o = e.charCodeAt(a) - 48;
                n *= i, n += o >= 49 ? o - 49 + 10 : o >= 17 ? o - 17 + 10 : o } return n }
        i.isBN = function(e) { return e instanceof i || null !== e && "object" == typeof e && e.constructor.wordSize === i.wordSize && Array.isArray(e.words) }, i.max = function(e, t) { return e.cmp(t) > 0 ? e : t }, i.min = function(e, t) { return e.cmp(t) < 0 ? e : t }, i.prototype._init = function(e, t, r) { if ("number" == typeof e) return this._initNumber(e, t, r); if ("object" == typeof e) return this._initArray(e, t, r); "hex" === t && (t = 16); var i = 0; "-" === (e = e.toString().replace(/\s+/g, ""))[0] && i++, 16 === t ? this._parseHex(e, i) : this._parseBase(e, t, i), "-" === e[0] && (this.negative = 1), this.strip(), "le" === r && this._initArray(this.toArray(), t, r) }, i.prototype._initNumber = function(e, t, r) { e < 0 && (this.negative = 1, e = -e), e < 67108864 ? (this.words = [67108863 & e], this.length = 1) : e < 4503599627370496 ? (this.words = [67108863 & e, e / 67108864 & 67108863], this.length = 2) : (this.words = [67108863 & e, e / 67108864 & 67108863, 1], this.length = 3), "le" === r && this._initArray(this.toArray(), t, r) }, i.prototype._initArray = function(e, t, r) { if (e.length <= 0) return this.words = [0], this.length = 1, this;
            this.length = Math.ceil(e.length / 3), this.words = new Array(this.length); for (var i = 0; i < this.length; i++) this.words[i] = 0; var n, s, a = 0; if ("be" === r)
                for (i = e.length - 1, n = 0; i >= 0; i -= 3) s = e[i] | e[i - 1] << 8 | e[i - 2] << 16, this.words[n] |= s << a & 67108863, this.words[n + 1] = s >>> 26 - a & 67108863, (a += 24) >= 26 && (a -= 26, n++);
            else if ("le" === r)
                for (i = 0, n = 0; i < e.length; i += 3) s = e[i] | e[i + 1] << 8 | e[i + 2] << 16, this.words[n] |= s << a & 67108863, this.words[n + 1] = s >>> 26 - a & 67108863, (a += 24) >= 26 && (a -= 26, n++); return this.strip() }, i.prototype._parseHex = function(e, t) { this.length = Math.ceil((e.length - t) / 6), this.words = new Array(this.length); for (var r = 0; r < this.length; r++) this.words[r] = 0; var i, n, a = 0; for (r = e.length - 6, i = 0; r >= t; r -= 6) n = s(e, r, r + 6), this.words[i] |= n << a & 67108863, this.words[i + 1] |= n >>> 26 - a & 4194303, (a += 24) >= 26 && (a -= 26, i++);
            r + 6 !== t && (n = s(e, t, r + 6), this.words[i] |= n << a & 67108863, this.words[i + 1] |= n >>> 26 - a & 4194303), this.strip() }, i.prototype._parseBase = function(e, t, r) { this.words = [0], this.length = 1; for (var i = 0, n = 1; n <= 67108863; n *= t) i++;
            i--, n = n / t | 0; for (var s = e.length - r, o = s % i, f = Math.min(s, s - o) + r, c = 0, u = r; u < f; u += i) c = a(e, u, u + i, t), this.imuln(n), this.words[0] + c < 67108864 ? this.words[0] += c : this._iaddn(c); if (0 !== o) { var h = 1; for (c = a(e, u, e.length, t), u = 0; u < o; u++) h *= t;
                this.imuln(h), this.words[0] + c < 67108864 ? this.words[0] += c : this._iaddn(c) } }, i.prototype.copy = function(e) { e.words = new Array(this.length); for (var t = 0; t < this.length; t++) e.words[t] = this.words[t];
            e.length = this.length, e.negative = this.negative, e.red = this.red }, i.prototype.clone = function() { var e = new i(null); return this.copy(e), e }, i.prototype._expand = function(e) { for (; this.length < e;) this.words[this.length++] = 0; return this }, i.prototype.strip = function() { for (; this.length > 1 && 0 === this.words[this.length - 1];) this.length--; return this._normSign() }, i.prototype._normSign = function() { return 1 === this.length && 0 === this.words[0] && (this.negative = 0), this }, i.prototype.inspect = function() { return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">" }; var o = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"],
            f = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            c = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];

        function u(e, t, r) { r.negative = t.negative ^ e.negative; var i = e.length + t.length | 0;
            r.length = i, i = i - 1 | 0; var n = 0 | e.words[0],
                s = 0 | t.words[0],
                a = n * s,
                o = 67108863 & a,
                f = a / 67108864 | 0;
            r.words[0] = o; for (var c = 1; c < i; c++) { for (var u = f >>> 26, h = 67108863 & f, d = Math.min(c, t.length - 1), l = Math.max(0, c - e.length + 1); l <= d; l++) { var _ = c - l | 0;
                    u += (a = (n = 0 | e.words[_]) * (s = 0 | t.words[l]) + h) / 67108864 | 0, h = 67108863 & a }
                r.words[c] = 0 | h, f = 0 | u } return 0 !== f ? r.words[c] = 0 | f : r.length--, r.strip() }
        i.prototype.toString = function(e, t) { var r; if (t = 0 | t || 1, 16 === (e = e || 10) || "hex" === e) { r = ""; for (var i = 0, n = 0, s = 0; s < this.length; s++) { var a = this.words[s],
                        u = (16777215 & (a << i | n)).toString(16);
                    r = 0 != (n = a >>> 24 - i & 16777215) || s !== this.length - 1 ? o[6 - u.length] + u + r : u + r, (i += 2) >= 26 && (i -= 26, s--) } for (0 !== n && (r = n.toString(16) + r); r.length % t != 0;) r = "0" + r; return 0 !== this.negative && (r = "-" + r), r } if (e === (0 | e) && e >= 2 && e <= 36) { var h = f[e],
                    d = c[e];
                r = ""; var l = this.clone(); for (l.negative = 0; !l.isZero();) { var _ = l.modn(d).toString(e);
                    r = (l = l.idivn(d)).isZero() ? _ + r : o[h - _.length] + _ + r } for (this.isZero() && (r = "0" + r); r.length % t != 0;) r = "0" + r; return 0 !== this.negative && (r = "-" + r), r } }, i.prototype.toNumber = function() { var e = this.words[0]; return 2 === this.length ? e += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? e += 4503599627370496 + 67108864 * this.words[1] : this.length, 0 !== this.negative ? -e : e }, i.prototype.toJSON = function() { return this.toString(16) }, i.prototype.toBuffer = function(e, t) { return this.toArrayLike(n, e, t) }, i.prototype.toArray = function(e, t) { return this.toArrayLike(Array, e, t) }, i.prototype.toArrayLike = function(e, t, r) { var i = this.byteLength(),
                n = r || Math.max(1, i);
            this.strip(); var s, a, o = "le" === t,
                f = new e(n),
                c = this.clone(); if (o) { for (a = 0; !c.isZero(); a++) s = c.andln(255), c.iushrn(8), f[a] = s; for (; a < n; a++) f[a] = 0 } else { for (a = 0; a < n - i; a++) f[a] = 0; for (a = 0; !c.isZero(); a++) s = c.andln(255), c.iushrn(8), f[n - a - 1] = s } return f }, Math.clz32 ? i.prototype._countBits = function(e) { return 32 - Math.clz32(e) } : i.prototype._countBits = function(e) { var t = e,
                r = 0; return t >= 4096 && (r += 13, t >>>= 13), t >= 64 && (r += 7, t >>>= 7), t >= 8 && (r += 4, t >>>= 4), t >= 2 && (r += 2, t >>>= 2), r + t }, i.prototype._zeroBits = function(e) { if (0 === e) return 26; var t = e,
                r = 0; return 0 == (8191 & t) && (r += 13, t >>>= 13), 0 == (127 & t) && (r += 7, t >>>= 7), 0 == (15 & t) && (r += 4, t >>>= 4), 0 == (3 & t) && (r += 2, t >>>= 2), 0 == (1 & t) && r++, r }, i.prototype.bitLength = function() { var e = this.words[this.length - 1],
                t = this._countBits(e); return 26 * (this.length - 1) + t }, i.prototype.zeroBits = function() { if (this.isZero()) return 0; for (var e = 0, t = 0; t < this.length; t++) { var r = this._zeroBits(this.words[t]); if (e += r, 26 !== r) break } return e }, i.prototype.byteLength = function() { return Math.ceil(this.bitLength() / 8) }, i.prototype.toTwos = function(e) { return 0 !== this.negative ? this.abs().inotn(e).iaddn(1) : this.clone() }, i.prototype.fromTwos = function(e) { return this.testn(e - 1) ? this.notn(e).iaddn(1).ineg() : this.clone() }, i.prototype.isNeg = function() { return 0 !== this.negative }, i.prototype.neg = function() { return this.clone().ineg() }, i.prototype.ineg = function() { return this.isZero() || (this.negative ^= 1), this }, i.prototype.iuor = function(e) { for (; this.length < e.length;) this.words[this.length++] = 0; for (var t = 0; t < e.length; t++) this.words[t] = this.words[t] | e.words[t]; return this.strip() }, i.prototype.ior = function(e) { return this.iuor(e) }, i.prototype.or = function(e) { return this.length > e.length ? this.clone().ior(e) : e.clone().ior(this) }, i.prototype.uor = function(e) { return this.length > e.length ? this.clone().iuor(e) : e.clone().iuor(this) }, i.prototype.iuand = function(e) { var t;
            t = this.length > e.length ? e : this; for (var r = 0; r < t.length; r++) this.words[r] = this.words[r] & e.words[r]; return this.length = t.length, this.strip() }, i.prototype.iand = function(e) { return this.iuand(e) }, i.prototype.and = function(e) { return this.length > e.length ? this.clone().iand(e) : e.clone().iand(this) }, i.prototype.uand = function(e) { return this.length > e.length ? this.clone().iuand(e) : e.clone().iuand(this) }, i.prototype.iuxor = function(e) { var t, r;
            this.length > e.length ? (t = this, r = e) : (t = e, r = this); for (var i = 0; i < r.length; i++) this.words[i] = t.words[i] ^ r.words[i]; if (this !== t)
                for (; i < t.length; i++) this.words[i] = t.words[i]; return this.length = t.length, this.strip() }, i.prototype.ixor = function(e) { return this.iuxor(e) }, i.prototype.xor = function(e) { return this.length > e.length ? this.clone().ixor(e) : e.clone().ixor(this) }, i.prototype.uxor = function(e) { return this.length > e.length ? this.clone().iuxor(e) : e.clone().iuxor(this) }, i.prototype.inotn = function(e) { var t = 0 | Math.ceil(e / 26),
                r = e % 26;
            this._expand(t), r > 0 && t--; for (var i = 0; i < t; i++) this.words[i] = 67108863 & ~this.words[i]; return r > 0 && (this.words[i] = ~this.words[i] & 67108863 >> 26 - r), this.strip() }, i.prototype.notn = function(e) { return this.clone().inotn(e) }, i.prototype.setn = function(e, t) { var r = e / 26 | 0,
                i = e % 26; return this._expand(r + 1), this.words[r] = t ? this.words[r] | 1 << i : this.words[r] & ~(1 << i), this.strip() }, i.prototype.iadd = function(e) { var t, r, i; if (0 !== this.negative && 0 === e.negative) return this.negative = 0, t = this.isub(e), this.negative ^= 1, this._normSign(); if (0 === this.negative && 0 !== e.negative) return e.negative = 0, t = this.isub(e), e.negative = 1, t._normSign();
            this.length > e.length ? (r = this, i = e) : (r = e, i = this); for (var n = 0, s = 0; s < i.length; s++) t = (0 | r.words[s]) + (0 | i.words[s]) + n, this.words[s] = 67108863 & t, n = t >>> 26; for (; 0 !== n && s < r.length; s++) t = (0 | r.words[s]) + n, this.words[s] = 67108863 & t, n = t >>> 26; if (this.length = r.length, 0 !== n) this.words[this.length] = n, this.length++;
            else if (r !== this)
                for (; s < r.length; s++) this.words[s] = r.words[s]; return this }, i.prototype.add = function(e) { var t; return 0 !== e.negative && 0 === this.negative ? (e.negative = 0, t = this.sub(e), e.negative ^= 1, t) : 0 === e.negative && 0 !== this.negative ? (this.negative = 0, t = e.sub(this), this.negative = 1, t) : this.length > e.length ? this.clone().iadd(e) : e.clone().iadd(this) }, i.prototype.isub = function(e) { if (0 !== e.negative) { e.negative = 0; var t = this.iadd(e); return e.negative = 1, t._normSign() } if (0 !== this.negative) return this.negative = 0, this.iadd(e), this.negative = 1, this._normSign(); var r, i, n = this.cmp(e); if (0 === n) return this.negative = 0, this.length = 1, this.words[0] = 0, this;
            n > 0 ? (r = this, i = e) : (r = e, i = this); for (var s = 0, a = 0; a < i.length; a++) s = (t = (0 | r.words[a]) - (0 | i.words[a]) + s) >> 26, this.words[a] = 67108863 & t; for (; 0 !== s && a < r.length; a++) s = (t = (0 | r.words[a]) + s) >> 26, this.words[a] = 67108863 & t; if (0 === s && a < r.length && r !== this)
                for (; a < r.length; a++) this.words[a] = r.words[a]; return this.length = Math.max(this.length, a), r !== this && (this.negative = 1), this.strip() }, i.prototype.sub = function(e) { return this.clone().isub(e) }; var h = function(e, t, r) { var i, n, s, a = e.words,
                o = t.words,
                f = r.words,
                c = 0,
                u = 0 | a[0],
                h = 8191 & u,
                d = u >>> 13,
                l = 0 | a[1],
                _ = 8191 & l,
                p = l >>> 13,
                b = 0 | a[2],
                m = 8191 & b,
                g = b >>> 13,
                y = 0 | a[3],
                v = 8191 & y,
                w = y >>> 13,
                $ = 0 | a[4],
                S = 8191 & $,
                B = $ >>> 13,
                E = 0 | a[5],
                M = 8191 & E,
                k = E >>> 13,
                A = 0 | a[6],
                P = 8191 & A,
                x = A >>> 13,
                I = 0 | a[7],
                C = 8191 & I,
                R = I >>> 13,
                T = 0 | a[8],
                j = 8191 & T,
                q = T >>> 13,
                O = 0 | a[9],
                D = 8191 & O,
                N = O >>> 13,
                L = 0 | o[0],
                U = 8191 & L,
                z = L >>> 13,
                H = 0 | o[1],
                K = 8191 & H,
                F = H >>> 13,
                W = 0 | o[2],
                V = 8191 & W,
                G = W >>> 13,
                J = 0 | o[3],
                X = 8191 & J,
                Y = J >>> 13,
                Z = 0 | o[4],
                Q = 8191 & Z,
                ee = Z >>> 13,
                te = 0 | o[5],
                re = 8191 & te,
                ie = te >>> 13,
                ne = 0 | o[6],
                se = 8191 & ne,
                ae = ne >>> 13,
                oe = 0 | o[7],
                fe = 8191 & oe,
                ce = oe >>> 13,
                ue = 0 | o[8],
                he = 8191 & ue,
                de = ue >>> 13,
                le = 0 | o[9],
                _e = 8191 & le,
                pe = le >>> 13;
            r.negative = e.negative ^ t.negative, r.length = 19; var be = (c + (i = Math.imul(h, U)) | 0) + ((8191 & (n = (n = Math.imul(h, z)) + Math.imul(d, U) | 0)) << 13) | 0;
            c = ((s = Math.imul(d, z)) + (n >>> 13) | 0) + (be >>> 26) | 0, be &= 67108863, i = Math.imul(_, U), n = (n = Math.imul(_, z)) + Math.imul(p, U) | 0, s = Math.imul(p, z); var me = (c + (i = i + Math.imul(h, K) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, F) | 0) + Math.imul(d, K) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(d, F) | 0) + (n >>> 13) | 0) + (me >>> 26) | 0, me &= 67108863, i = Math.imul(m, U), n = (n = Math.imul(m, z)) + Math.imul(g, U) | 0, s = Math.imul(g, z), i = i + Math.imul(_, K) | 0, n = (n = n + Math.imul(_, F) | 0) + Math.imul(p, K) | 0, s = s + Math.imul(p, F) | 0; var ge = (c + (i = i + Math.imul(h, V) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, G) | 0) + Math.imul(d, V) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(d, G) | 0) + (n >>> 13) | 0) + (ge >>> 26) | 0, ge &= 67108863, i = Math.imul(v, U), n = (n = Math.imul(v, z)) + Math.imul(w, U) | 0, s = Math.imul(w, z), i = i + Math.imul(m, K) | 0, n = (n = n + Math.imul(m, F) | 0) + Math.imul(g, K) | 0, s = s + Math.imul(g, F) | 0, i = i + Math.imul(_, V) | 0, n = (n = n + Math.imul(_, G) | 0) + Math.imul(p, V) | 0, s = s + Math.imul(p, G) | 0; var ye = (c + (i = i + Math.imul(h, X) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, Y) | 0) + Math.imul(d, X) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(d, Y) | 0) + (n >>> 13) | 0) + (ye >>> 26) | 0, ye &= 67108863, i = Math.imul(S, U), n = (n = Math.imul(S, z)) + Math.imul(B, U) | 0, s = Math.imul(B, z), i = i + Math.imul(v, K) | 0, n = (n = n + Math.imul(v, F) | 0) + Math.imul(w, K) | 0, s = s + Math.imul(w, F) | 0, i = i + Math.imul(m, V) | 0, n = (n = n + Math.imul(m, G) | 0) + Math.imul(g, V) | 0, s = s + Math.imul(g, G) | 0, i = i + Math.imul(_, X) | 0, n = (n = n + Math.imul(_, Y) | 0) + Math.imul(p, X) | 0, s = s + Math.imul(p, Y) | 0; var ve = (c + (i = i + Math.imul(h, Q) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ee) | 0) + Math.imul(d, Q) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(d, ee) | 0) + (n >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, i = Math.imul(M, U), n = (n = Math.imul(M, z)) + Math.imul(k, U) | 0, s = Math.imul(k, z), i = i + Math.imul(S, K) | 0, n = (n = n + Math.imul(S, F) | 0) + Math.imul(B, K) | 0, s = s + Math.imul(B, F) | 0, i = i + Math.imul(v, V) | 0, n = (n = n + Math.imul(v, G) | 0) + Math.imul(w, V) | 0, s = s + Math.imul(w, G) | 0, i = i + Math.imul(m, X) | 0, n = (n = n + Math.imul(m, Y) | 0) + Math.imul(g, X) | 0, s = s + Math.imul(g, Y) | 0, i = i + Math.imul(_, Q) | 0, n = (n = n + Math.imul(_, ee) | 0) + Math.imul(p, Q) | 0, s = s + Math.imul(p, ee) | 0; var we = (c + (i = i + Math.imul(h, re) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ie) | 0) + Math.imul(d, re) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(d, ie) | 0) + (n >>> 13) | 0) + (we >>> 26) | 0, we &= 67108863, i = Math.imul(P, U), n = (n = Math.imul(P, z)) + Math.imul(x, U) | 0, s = Math.imul(x, z), i = i + Math.imul(M, K) | 0, n = (n = n + Math.imul(M, F) | 0) + Math.imul(k, K) | 0, s = s + Math.imul(k, F) | 0, i = i + Math.imul(S, V) | 0, n = (n = n + Math.imul(S, G) | 0) + Math.imul(B, V) | 0, s = s + Math.imul(B, G) | 0, i = i + Math.imul(v, X) | 0, n = (n = n + Math.imul(v, Y) | 0) + Math.imul(w, X) | 0, s = s + Math.imul(w, Y) | 0, i = i + Math.imul(m, Q) | 0, n = (n = n + Math.imul(m, ee) | 0) + Math.imul(g, Q) | 0, s = s + Math.imul(g, ee) | 0, i = i + Math.imul(_, re) | 0, n = (n = n + Math.imul(_, ie) | 0) + Math.imul(p, re) | 0, s = s + Math.imul(p, ie) | 0; var $e = (c + (i = i + Math.imul(h, se) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ae) | 0) + Math.imul(d, se) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(d, ae) | 0) + (n >>> 13) | 0) + ($e >>> 26) | 0, $e &= 67108863, i = Math.imul(C, U), n = (n = Math.imul(C, z)) + Math.imul(R, U) | 0, s = Math.imul(R, z), i = i + Math.imul(P, K) | 0, n = (n = n + Math.imul(P, F) | 0) + Math.imul(x, K) | 0, s = s + Math.imul(x, F) | 0, i = i + Math.imul(M, V) | 0, n = (n = n + Math.imul(M, G) | 0) + Math.imul(k, V) | 0, s = s + Math.imul(k, G) | 0, i = i + Math.imul(S, X) | 0, n = (n = n + Math.imul(S, Y) | 0) + Math.imul(B, X) | 0, s = s + Math.imul(B, Y) | 0, i = i + Math.imul(v, Q) | 0, n = (n = n + Math.imul(v, ee) | 0) + Math.imul(w, Q) | 0, s = s + Math.imul(w, ee) | 0, i = i + Math.imul(m, re) | 0, n = (n = n + Math.imul(m, ie) | 0) + Math.imul(g, re) | 0, s = s + Math.imul(g, ie) | 0, i = i + Math.imul(_, se) | 0, n = (n = n + Math.imul(_, ae) | 0) + Math.imul(p, se) | 0, s = s + Math.imul(p, ae) | 0; var Se = (c + (i = i + Math.imul(h, fe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ce) | 0) + Math.imul(d, fe) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(d, ce) | 0) + (n >>> 13) | 0) + (Se >>> 26) | 0, Se &= 67108863, i = Math.imul(j, U), n = (n = Math.imul(j, z)) + Math.imul(q, U) | 0, s = Math.imul(q, z), i = i + Math.imul(C, K) | 0, n = (n = n + Math.imul(C, F) | 0) + Math.imul(R, K) | 0, s = s + Math.imul(R, F) | 0, i = i + Math.imul(P, V) | 0, n = (n = n + Math.imul(P, G) | 0) + Math.imul(x, V) | 0, s = s + Math.imul(x, G) | 0, i = i + Math.imul(M, X) | 0, n = (n = n + Math.imul(M, Y) | 0) + Math.imul(k, X) | 0, s = s + Math.imul(k, Y) | 0, i = i + Math.imul(S, Q) | 0, n = (n = n + Math.imul(S, ee) | 0) + Math.imul(B, Q) | 0, s = s + Math.imul(B, ee) | 0, i = i + Math.imul(v, re) | 0, n = (n = n + Math.imul(v, ie) | 0) + Math.imul(w, re) | 0, s = s + Math.imul(w, ie) | 0, i = i + Math.imul(m, se) | 0, n = (n = n + Math.imul(m, ae) | 0) + Math.imul(g, se) | 0, s = s + Math.imul(g, ae) | 0, i = i + Math.imul(_, fe) | 0, n = (n = n + Math.imul(_, ce) | 0) + Math.imul(p, fe) | 0, s = s + Math.imul(p, ce) | 0; var Be = (c + (i = i + Math.imul(h, he) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, de) | 0) + Math.imul(d, he) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(d, de) | 0) + (n >>> 13) | 0) + (Be >>> 26) | 0, Be &= 67108863, i = Math.imul(D, U), n = (n = Math.imul(D, z)) + Math.imul(N, U) | 0, s = Math.imul(N, z), i = i + Math.imul(j, K) | 0, n = (n = n + Math.imul(j, F) | 0) + Math.imul(q, K) | 0, s = s + Math.imul(q, F) | 0, i = i + Math.imul(C, V) | 0, n = (n = n + Math.imul(C, G) | 0) + Math.imul(R, V) | 0, s = s + Math.imul(R, G) | 0, i = i + Math.imul(P, X) | 0, n = (n = n + Math.imul(P, Y) | 0) + Math.imul(x, X) | 0, s = s + Math.imul(x, Y) | 0, i = i + Math.imul(M, Q) | 0, n = (n = n + Math.imul(M, ee) | 0) + Math.imul(k, Q) | 0, s = s + Math.imul(k, ee) | 0, i = i + Math.imul(S, re) | 0, n = (n = n + Math.imul(S, ie) | 0) + Math.imul(B, re) | 0, s = s + Math.imul(B, ie) | 0, i = i + Math.imul(v, se) | 0, n = (n = n + Math.imul(v, ae) | 0) + Math.imul(w, se) | 0, s = s + Math.imul(w, ae) | 0, i = i + Math.imul(m, fe) | 0, n = (n = n + Math.imul(m, ce) | 0) + Math.imul(g, fe) | 0, s = s + Math.imul(g, ce) | 0, i = i + Math.imul(_, he) | 0, n = (n = n + Math.imul(_, de) | 0) + Math.imul(p, he) | 0, s = s + Math.imul(p, de) | 0; var Ee = (c + (i = i + Math.imul(h, _e) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, pe) | 0) + Math.imul(d, _e) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(d, pe) | 0) + (n >>> 13) | 0) + (Ee >>> 26) | 0, Ee &= 67108863, i = Math.imul(D, K), n = (n = Math.imul(D, F)) + Math.imul(N, K) | 0, s = Math.imul(N, F), i = i + Math.imul(j, V) | 0, n = (n = n + Math.imul(j, G) | 0) + Math.imul(q, V) | 0, s = s + Math.imul(q, G) | 0, i = i + Math.imul(C, X) | 0, n = (n = n + Math.imul(C, Y) | 0) + Math.imul(R, X) | 0, s = s + Math.imul(R, Y) | 0, i = i + Math.imul(P, Q) | 0, n = (n = n + Math.imul(P, ee) | 0) + Math.imul(x, Q) | 0, s = s + Math.imul(x, ee) | 0, i = i + Math.imul(M, re) | 0, n = (n = n + Math.imul(M, ie) | 0) + Math.imul(k, re) | 0, s = s + Math.imul(k, ie) | 0, i = i + Math.imul(S, se) | 0, n = (n = n + Math.imul(S, ae) | 0) + Math.imul(B, se) | 0, s = s + Math.imul(B, ae) | 0, i = i + Math.imul(v, fe) | 0, n = (n = n + Math.imul(v, ce) | 0) + Math.imul(w, fe) | 0, s = s + Math.imul(w, ce) | 0, i = i + Math.imul(m, he) | 0, n = (n = n + Math.imul(m, de) | 0) + Math.imul(g, he) | 0, s = s + Math.imul(g, de) | 0; var Me = (c + (i = i + Math.imul(_, _e) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(_, pe) | 0) + Math.imul(p, _e) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(p, pe) | 0) + (n >>> 13) | 0) + (Me >>> 26) | 0, Me &= 67108863, i = Math.imul(D, V), n = (n = Math.imul(D, G)) + Math.imul(N, V) | 0, s = Math.imul(N, G), i = i + Math.imul(j, X) | 0, n = (n = n + Math.imul(j, Y) | 0) + Math.imul(q, X) | 0, s = s + Math.imul(q, Y) | 0, i = i + Math.imul(C, Q) | 0, n = (n = n + Math.imul(C, ee) | 0) + Math.imul(R, Q) | 0, s = s + Math.imul(R, ee) | 0, i = i + Math.imul(P, re) | 0, n = (n = n + Math.imul(P, ie) | 0) + Math.imul(x, re) | 0, s = s + Math.imul(x, ie) | 0, i = i + Math.imul(M, se) | 0, n = (n = n + Math.imul(M, ae) | 0) + Math.imul(k, se) | 0, s = s + Math.imul(k, ae) | 0, i = i + Math.imul(S, fe) | 0, n = (n = n + Math.imul(S, ce) | 0) + Math.imul(B, fe) | 0, s = s + Math.imul(B, ce) | 0, i = i + Math.imul(v, he) | 0, n = (n = n + Math.imul(v, de) | 0) + Math.imul(w, he) | 0, s = s + Math.imul(w, de) | 0; var ke = (c + (i = i + Math.imul(m, _e) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(m, pe) | 0) + Math.imul(g, _e) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(g, pe) | 0) + (n >>> 13) | 0) + (ke >>> 26) | 0, ke &= 67108863, i = Math.imul(D, X), n = (n = Math.imul(D, Y)) + Math.imul(N, X) | 0, s = Math.imul(N, Y), i = i + Math.imul(j, Q) | 0, n = (n = n + Math.imul(j, ee) | 0) + Math.imul(q, Q) | 0, s = s + Math.imul(q, ee) | 0, i = i + Math.imul(C, re) | 0, n = (n = n + Math.imul(C, ie) | 0) + Math.imul(R, re) | 0, s = s + Math.imul(R, ie) | 0, i = i + Math.imul(P, se) | 0, n = (n = n + Math.imul(P, ae) | 0) + Math.imul(x, se) | 0, s = s + Math.imul(x, ae) | 0, i = i + Math.imul(M, fe) | 0, n = (n = n + Math.imul(M, ce) | 0) + Math.imul(k, fe) | 0, s = s + Math.imul(k, ce) | 0, i = i + Math.imul(S, he) | 0, n = (n = n + Math.imul(S, de) | 0) + Math.imul(B, he) | 0, s = s + Math.imul(B, de) | 0; var Ae = (c + (i = i + Math.imul(v, _e) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(v, pe) | 0) + Math.imul(w, _e) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(w, pe) | 0) + (n >>> 13) | 0) + (Ae >>> 26) | 0, Ae &= 67108863, i = Math.imul(D, Q), n = (n = Math.imul(D, ee)) + Math.imul(N, Q) | 0, s = Math.imul(N, ee), i = i + Math.imul(j, re) | 0, n = (n = n + Math.imul(j, ie) | 0) + Math.imul(q, re) | 0, s = s + Math.imul(q, ie) | 0, i = i + Math.imul(C, se) | 0, n = (n = n + Math.imul(C, ae) | 0) + Math.imul(R, se) | 0, s = s + Math.imul(R, ae) | 0, i = i + Math.imul(P, fe) | 0, n = (n = n + Math.imul(P, ce) | 0) + Math.imul(x, fe) | 0, s = s + Math.imul(x, ce) | 0, i = i + Math.imul(M, he) | 0, n = (n = n + Math.imul(M, de) | 0) + Math.imul(k, he) | 0, s = s + Math.imul(k, de) | 0; var Pe = (c + (i = i + Math.imul(S, _e) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(S, pe) | 0) + Math.imul(B, _e) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(B, pe) | 0) + (n >>> 13) | 0) + (Pe >>> 26) | 0, Pe &= 67108863, i = Math.imul(D, re), n = (n = Math.imul(D, ie)) + Math.imul(N, re) | 0, s = Math.imul(N, ie), i = i + Math.imul(j, se) | 0, n = (n = n + Math.imul(j, ae) | 0) + Math.imul(q, se) | 0, s = s + Math.imul(q, ae) | 0, i = i + Math.imul(C, fe) | 0, n = (n = n + Math.imul(C, ce) | 0) + Math.imul(R, fe) | 0, s = s + Math.imul(R, ce) | 0, i = i + Math.imul(P, he) | 0, n = (n = n + Math.imul(P, de) | 0) + Math.imul(x, he) | 0, s = s + Math.imul(x, de) | 0; var xe = (c + (i = i + Math.imul(M, _e) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(M, pe) | 0) + Math.imul(k, _e) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(k, pe) | 0) + (n >>> 13) | 0) + (xe >>> 26) | 0, xe &= 67108863, i = Math.imul(D, se), n = (n = Math.imul(D, ae)) + Math.imul(N, se) | 0, s = Math.imul(N, ae), i = i + Math.imul(j, fe) | 0, n = (n = n + Math.imul(j, ce) | 0) + Math.imul(q, fe) | 0, s = s + Math.imul(q, ce) | 0, i = i + Math.imul(C, he) | 0, n = (n = n + Math.imul(C, de) | 0) + Math.imul(R, he) | 0, s = s + Math.imul(R, de) | 0; var Ie = (c + (i = i + Math.imul(P, _e) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(P, pe) | 0) + Math.imul(x, _e) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(x, pe) | 0) + (n >>> 13) | 0) + (Ie >>> 26) | 0, Ie &= 67108863, i = Math.imul(D, fe), n = (n = Math.imul(D, ce)) + Math.imul(N, fe) | 0, s = Math.imul(N, ce), i = i + Math.imul(j, he) | 0, n = (n = n + Math.imul(j, de) | 0) + Math.imul(q, he) | 0, s = s + Math.imul(q, de) | 0; var Ce = (c + (i = i + Math.imul(C, _e) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(C, pe) | 0) + Math.imul(R, _e) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(R, pe) | 0) + (n >>> 13) | 0) + (Ce >>> 26) | 0, Ce &= 67108863, i = Math.imul(D, he), n = (n = Math.imul(D, de)) + Math.imul(N, he) | 0, s = Math.imul(N, de); var Re = (c + (i = i + Math.imul(j, _e) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(j, pe) | 0) + Math.imul(q, _e) | 0)) << 13) | 0;
            c = ((s = s + Math.imul(q, pe) | 0) + (n >>> 13) | 0) + (Re >>> 26) | 0, Re &= 67108863; var Te = (c + (i = Math.imul(D, _e)) | 0) + ((8191 & (n = (n = Math.imul(D, pe)) + Math.imul(N, _e) | 0)) << 13) | 0; return c = ((s = Math.imul(N, pe)) + (n >>> 13) | 0) + (Te >>> 26) | 0, Te &= 67108863, f[0] = be, f[1] = me, f[2] = ge, f[3] = ye, f[4] = ve, f[5] = we, f[6] = $e, f[7] = Se, f[8] = Be, f[9] = Ee, f[10] = Me, f[11] = ke, f[12] = Ae, f[13] = Pe, f[14] = xe, f[15] = Ie, f[16] = Ce, f[17] = Re, f[18] = Te, 0 !== c && (f[19] = c, r.length++), r };

        function d(e, t, r) { return (new l).mulp(e, t, r) }

        function l(e, t) { this.x = e, this.y = t }
        Math.imul || (h = u), i.prototype.mulTo = function(e, t) { var r = this.length + e.length; return 10 === this.length && 10 === e.length ? h(this, e, t) : r < 63 ? u(this, e, t) : r < 1024 ? function(e, t, r) { r.negative = t.negative ^ e.negative, r.length = e.length + t.length; for (var i = 0, n = 0, s = 0; s < r.length - 1; s++) { var a = n;
                    n = 0; for (var o = 67108863 & i, f = Math.min(s, t.length - 1), c = Math.max(0, s - e.length + 1); c <= f; c++) { var u = s - c,
                            h = (0 | e.words[u]) * (0 | t.words[c]),
                            d = 67108863 & h;
                        o = 67108863 & (d = d + o | 0), n += (a = (a = a + (h / 67108864 | 0) | 0) + (d >>> 26) | 0) >>> 26, a &= 67108863 }
                    r.words[s] = o, i = a, a = n } return 0 !== i ? r.words[s] = i : r.length--, r.strip() }(this, e, t) : d(this, e, t) }, l.prototype.makeRBT = function(e) { for (var t = new Array(e), r = i.prototype._countBits(e) - 1, n = 0; n < e; n++) t[n] = this.revBin(n, r, e); return t }, l.prototype.revBin = function(e, t, r) { if (0 === e || e === r - 1) return e; for (var i = 0, n = 0; n < t; n++) i |= (1 & e) << t - n - 1, e >>= 1; return i }, l.prototype.permute = function(e, t, r, i, n, s) { for (var a = 0; a < s; a++) i[a] = t[e[a]], n[a] = r[e[a]] }, l.prototype.transform = function(e, t, r, i, n, s) { this.permute(s, e, t, r, i, n); for (var a = 1; a < n; a <<= 1)
                for (var o = a << 1, f = Math.cos(2 * Math.PI / o), c = Math.sin(2 * Math.PI / o), u = 0; u < n; u += o)
                    for (var h = f, d = c, l = 0; l < a; l++) { var _ = r[u + l],
                            p = i[u + l],
                            b = r[u + l + a],
                            m = i[u + l + a],
                            g = h * b - d * m;
                        m = h * m + d * b, b = g, r[u + l] = _ + b, i[u + l] = p + m, r[u + l + a] = _ - b, i[u + l + a] = p - m, l !== o && (g = f * h - c * d, d = f * d + c * h, h = g) } }, l.prototype.guessLen13b = function(e, t) { var r = 1 | Math.max(t, e),
                i = 1 & r,
                n = 0; for (r = r / 2 | 0; r; r >>>= 1) n++; return 1 << n + 1 + i }, l.prototype.conjugate = function(e, t, r) { if (!(r <= 1))
                for (var i = 0; i < r / 2; i++) { var n = e[i];
                    e[i] = e[r - i - 1], e[r - i - 1] = n, n = t[i], t[i] = -t[r - i - 1], t[r - i - 1] = -n } }, l.prototype.normalize13b = function(e, t) { for (var r = 0, i = 0; i < t / 2; i++) { var n = 8192 * Math.round(e[2 * i + 1] / t) + Math.round(e[2 * i] / t) + r;
                e[i] = 67108863 & n, r = n < 67108864 ? 0 : n / 67108864 | 0 } return e }, l.prototype.convert13b = function(e, t, r, i) { for (var n = 0, s = 0; s < t; s++) n += 0 | e[s], r[2 * s] = 8191 & n, n >>>= 13, r[2 * s + 1] = 8191 & n, n >>>= 13; for (s = 2 * t; s < i; ++s) r[s] = 0 }, l.prototype.stub = function(e) { for (var t = new Array(e), r = 0; r < e; r++) t[r] = 0; return t }, l.prototype.mulp = function(e, t, r) { var i = 2 * this.guessLen13b(e.length, t.length),
                n = this.makeRBT(i),
                s = this.stub(i),
                a = new Array(i),
                o = new Array(i),
                f = new Array(i),
                c = new Array(i),
                u = new Array(i),
                h = new Array(i),
                d = r.words;
            d.length = i, this.convert13b(e.words, e.length, a, i), this.convert13b(t.words, t.length, c, i), this.transform(a, s, o, f, i, n), this.transform(c, s, u, h, i, n); for (var l = 0; l < i; l++) { var _ = o[l] * u[l] - f[l] * h[l];
                f[l] = o[l] * h[l] + f[l] * u[l], o[l] = _ } return this.conjugate(o, f, i), this.transform(o, f, d, s, i, n), this.conjugate(d, s, i), this.normalize13b(d, i), r.negative = e.negative ^ t.negative, r.length = e.length + t.length, r.strip() }, i.prototype.mul = function(e) { var t = new i(null); return t.words = new Array(this.length + e.length), this.mulTo(e, t) }, i.prototype.mulf = function(e) { var t = new i(null); return t.words = new Array(this.length + e.length), d(this, e, t) }, i.prototype.imul = function(e) { return this.clone().mulTo(e, this) }, i.prototype.imuln = function(e) { for (var t = 0, r = 0; r < this.length; r++) { var i = (0 | this.words[r]) * e,
                    n = (67108863 & i) + (67108863 & t);
                t >>= 26, t += i / 67108864 | 0, t += n >>> 26, this.words[r] = 67108863 & n } return 0 !== t && (this.words[r] = t, this.length++), this }, i.prototype.muln = function(e) { return this.clone().imuln(e) }, i.prototype.sqr = function() { return this.mul(this) }, i.prototype.isqr = function() { return this.imul(this.clone()) }, i.prototype.pow = function(e) { var t = function(e) { for (var t = new Array(e.bitLength()), r = 0; r < t.length; r++) { var i = r / 26 | 0,
                        n = r % 26;
                    t[r] = (e.words[i] & 1 << n) >>> n } return t }(e); if (0 === t.length) return new i(1); for (var r = this, n = 0; n < t.length && 0 === t[n]; n++, r = r.sqr()); if (++n < t.length)
                for (var s = r.sqr(); n < t.length; n++, s = s.sqr()) 0 !== t[n] && (r = r.mul(s)); return r }, i.prototype.iushln = function(e) { var t, r = e % 26,
                i = (e - r) / 26,
                n = 67108863 >>> 26 - r << 26 - r; if (0 !== r) { var s = 0; for (t = 0; t < this.length; t++) { var a = this.words[t] & n,
                        o = (0 | this.words[t]) - a << r;
                    this.words[t] = o | s, s = a >>> 26 - r }
                s && (this.words[t] = s, this.length++) } if (0 !== i) { for (t = this.length - 1; t >= 0; t--) this.words[t + i] = this.words[t]; for (t = 0; t < i; t++) this.words[t] = 0;
                this.length += i } return this.strip() }, i.prototype.ishln = function(e) { return this.iushln(e) }, i.prototype.iushrn = function(e, t, r) { var i;
            i = t ? (t - t % 26) / 26 : 0; var n = e % 26,
                s = Math.min((e - n) / 26, this.length),
                a = 67108863 ^ 67108863 >>> n << n,
                o = r; if (i -= s, i = Math.max(0, i), o) { for (var f = 0; f < s; f++) o.words[f] = this.words[f];
                o.length = s } if (0 === s);
            else if (this.length > s)
                for (this.length -= s, f = 0; f < this.length; f++) this.words[f] = this.words[f + s];
            else this.words[0] = 0, this.length = 1; var c = 0; for (f = this.length - 1; f >= 0 && (0 !== c || f >= i); f--) { var u = 0 | this.words[f];
                this.words[f] = c << 26 - n | u >>> n, c = u & a } return o && 0 !== c && (o.words[o.length++] = c), 0 === this.length && (this.words[0] = 0, this.length = 1), this.strip() }, i.prototype.ishrn = function(e, t, r) { return this.iushrn(e, t, r) }, i.prototype.shln = function(e) { return this.clone().ishln(e) }, i.prototype.ushln = function(e) { return this.clone().iushln(e) }, i.prototype.shrn = function(e) { return this.clone().ishrn(e) }, i.prototype.ushrn = function(e) { return this.clone().iushrn(e) }, i.prototype.testn = function(e) { var t = e % 26,
                r = (e - t) / 26,
                i = 1 << t; return !(this.length <= r || !(this.words[r] & i)) }, i.prototype.imaskn = function(e) { var t = e % 26,
                r = (e - t) / 26; if (this.length <= r) return this; if (0 !== t && r++, this.length = Math.min(r, this.length), 0 !== t) { var i = 67108863 ^ 67108863 >>> t << t;
                this.words[this.length - 1] &= i } return this.strip() }, i.prototype.maskn = function(e) { return this.clone().imaskn(e) }, i.prototype.iaddn = function(e) { return e < 0 ? this.isubn(-e) : 0 !== this.negative ? 1 === this.length && (0 | this.words[0]) < e ? (this.words[0] = e - (0 | this.words[0]), this.negative = 0, this) : (this.negative = 0, this.isubn(e), this.negative = 1, this) : this._iaddn(e) }, i.prototype._iaddn = function(e) { this.words[0] += e; for (var t = 0; t < this.length && this.words[t] >= 67108864; t++) this.words[t] -= 67108864, t === this.length - 1 ? this.words[t + 1] = 1 : this.words[t + 1]++; return this.length = Math.max(this.length, t + 1), this }, i.prototype.isubn = function(e) { if (e < 0) return this.iaddn(-e); if (0 !== this.negative) return this.negative = 0, this.iaddn(e), this.negative = 1, this; if (this.words[0] -= e, 1 === this.length && this.words[0] < 0) this.words[0] = -this.words[0], this.negative = 1;
            else
                for (var t = 0; t < this.length && this.words[t] < 0; t++) this.words[t] += 67108864, this.words[t + 1] -= 1; return this.strip() }, i.prototype.addn = function(e) { return this.clone().iaddn(e) }, i.prototype.subn = function(e) { return this.clone().isubn(e) }, i.prototype.iabs = function() { return this.negative = 0, this }, i.prototype.abs = function() { return this.clone().iabs() }, i.prototype._ishlnsubmul = function(e, t, r) { var i, n, s = e.length + r;
            this._expand(s); var a = 0; for (i = 0; i < e.length; i++) { n = (0 | this.words[i + r]) + a; var o = (0 | e.words[i]) * t;
                a = ((n -= 67108863 & o) >> 26) - (o / 67108864 | 0), this.words[i + r] = 67108863 & n } for (; i < this.length - r; i++) a = (n = (0 | this.words[i + r]) + a) >> 26, this.words[i + r] = 67108863 & n; if (0 === a) return this.strip(); for (a = 0, i = 0; i < this.length; i++) a = (n = -(0 | this.words[i]) + a) >> 26, this.words[i] = 67108863 & n; return this.negative = 1, this.strip() }, i.prototype._wordDiv = function(e, t) { var r = (this.length, e.length),
                n = this.clone(),
                s = e,
                a = 0 | s.words[s.length - 1];
            0 != (r = 26 - this._countBits(a)) && (s = s.ushln(r), n.iushln(r), a = 0 | s.words[s.length - 1]); var o, f = n.length - s.length; if ("mod" !== t) {
                (o = new i(null)).length = f + 1, o.words = new Array(o.length); for (var c = 0; c < o.length; c++) o.words[c] = 0 } var u = n.clone()._ishlnsubmul(s, 1, f);
            0 === u.negative && (n = u, o && (o.words[f] = 1)); for (var h = f - 1; h >= 0; h--) { var d = 67108864 * (0 | n.words[s.length + h]) + (0 | n.words[s.length + h - 1]); for (d = Math.min(d / a | 0, 67108863), n._ishlnsubmul(s, d, h); 0 !== n.negative;) d--, n.negative = 0, n._ishlnsubmul(s, 1, h), n.isZero() || (n.negative ^= 1);
                o && (o.words[h] = d) } return o && o.strip(), n.strip(), "div" !== t && 0 !== r && n.iushrn(r), { div: o || null, mod: n } }, i.prototype.divmod = function(e, t, r) { return this.isZero() ? { div: new i(0), mod: new i(0) } : 0 !== this.negative && 0 === e.negative ? (a = this.neg().divmod(e, t), "mod" !== t && (n = a.div.neg()), "div" !== t && (s = a.mod.neg(), r && 0 !== s.negative && s.iadd(e)), { div: n, mod: s }) : 0 === this.negative && 0 !== e.negative ? (a = this.divmod(e.neg(), t), "mod" !== t && (n = a.div.neg()), { div: n, mod: a.mod }) : 0 != (this.negative & e.negative) ? (a = this.neg().divmod(e.neg(), t), "div" !== t && (s = a.mod.neg(), r && 0 !== s.negative && s.isub(e)), { div: a.div, mod: s }) : e.length > this.length || this.cmp(e) < 0 ? { div: new i(0), mod: this } : 1 === e.length ? "div" === t ? { div: this.divn(e.words[0]), mod: null } : "mod" === t ? { div: null, mod: new i(this.modn(e.words[0])) } : { div: this.divn(e.words[0]), mod: new i(this.modn(e.words[0])) } : this._wordDiv(e, t); var n, s, a }, i.prototype.div = function(e) { return this.divmod(e, "div", !1).div }, i.prototype.mod = function(e) { return this.divmod(e, "mod", !1).mod }, i.prototype.umod = function(e) { return this.divmod(e, "mod", !0).mod }, i.prototype.divRound = function(e) { var t = this.divmod(e); if (t.mod.isZero()) return t.div; var r = 0 !== t.div.negative ? t.mod.isub(e) : t.mod,
                i = e.ushrn(1),
                n = e.andln(1),
                s = r.cmp(i); return s < 0 || 1 === n && 0 === s ? t.div : 0 !== t.div.negative ? t.div.isubn(1) : t.div.iaddn(1) }, i.prototype.modn = function(e) { for (var t = (1 << 26) % e, r = 0, i = this.length - 1; i >= 0; i--) r = (t * r + (0 | this.words[i])) % e; return r }, i.prototype.idivn = function(e) { for (var t = 0, r = this.length - 1; r >= 0; r--) { var i = (0 | this.words[r]) + 67108864 * t;
                this.words[r] = i / e | 0, t = i % e } return this.strip() }, i.prototype.divn = function(e) { return this.clone().idivn(e) }, i.prototype.egcd = function(e) { var t = this,
                r = e.clone();
            t = 0 !== t.negative ? t.umod(e) : t.clone(); for (var n = new i(1), s = new i(0), a = new i(0), o = new i(1), f = 0; t.isEven() && r.isEven();) t.iushrn(1), r.iushrn(1), ++f; for (var c = r.clone(), u = t.clone(); !t.isZero();) { for (var h = 0, d = 1; 0 == (t.words[0] & d) && h < 26; ++h, d <<= 1); if (h > 0)
                    for (t.iushrn(h); h-- > 0;)(n.isOdd() || s.isOdd()) && (n.iadd(c), s.isub(u)), n.iushrn(1), s.iushrn(1); for (var l = 0, _ = 1; 0 == (r.words[0] & _) && l < 26; ++l, _ <<= 1); if (l > 0)
                    for (r.iushrn(l); l-- > 0;)(a.isOdd() || o.isOdd()) && (a.iadd(c), o.isub(u)), a.iushrn(1), o.iushrn(1);
                t.cmp(r) >= 0 ? (t.isub(r), n.isub(a), s.isub(o)) : (r.isub(t), a.isub(n), o.isub(s)) } return { a: a, b: o, gcd: r.iushln(f) } }, i.prototype._invmp = function(e) { var t = this,
                r = e.clone();
            t = 0 !== t.negative ? t.umod(e) : t.clone(); for (var n, s = new i(1), a = new i(0), o = r.clone(); t.cmpn(1) > 0 && r.cmpn(1) > 0;) { for (var f = 0, c = 1; 0 == (t.words[0] & c) && f < 26; ++f, c <<= 1); if (f > 0)
                    for (t.iushrn(f); f-- > 0;) s.isOdd() && s.iadd(o), s.iushrn(1); for (var u = 0, h = 1; 0 == (r.words[0] & h) && u < 26; ++u, h <<= 1); if (u > 0)
                    for (r.iushrn(u); u-- > 0;) a.isOdd() && a.iadd(o), a.iushrn(1);
                t.cmp(r) >= 0 ? (t.isub(r), s.isub(a)) : (r.isub(t), a.isub(s)) } return (n = 0 === t.cmpn(1) ? s : a).cmpn(0) < 0 && n.iadd(e), n }, i.prototype.gcd = function(e) { if (this.isZero()) return e.abs(); if (e.isZero()) return this.abs(); var t = this.clone(),
                r = e.clone();
            t.negative = 0, r.negative = 0; for (var i = 0; t.isEven() && r.isEven(); i++) t.iushrn(1), r.iushrn(1); for (;;) { for (; t.isEven();) t.iushrn(1); for (; r.isEven();) r.iushrn(1); var n = t.cmp(r); if (n < 0) { var s = t;
                    t = r, r = s } else if (0 === n || 0 === r.cmpn(1)) break;
                t.isub(r) } return r.iushln(i) }, i.prototype.invm = function(e) { return this.egcd(e).a.umod(e) }, i.prototype.isEven = function() { return 0 == (1 & this.words[0]) }, i.prototype.isOdd = function() { return 1 == (1 & this.words[0]) }, i.prototype.andln = function(e) { return this.words[0] & e }, i.prototype.bincn = function(e) { var t = e % 26,
                r = (e - t) / 26,
                i = 1 << t; if (this.length <= r) return this._expand(r + 1), this.words[r] |= i, this; for (var n = i, s = r; 0 !== n && s < this.length; s++) { var a = 0 | this.words[s];
                n = (a += n) >>> 26, a &= 67108863, this.words[s] = a } return 0 !== n && (this.words[s] = n, this.length++), this }, i.prototype.isZero = function() { return 1 === this.length && 0 === this.words[0] }, i.prototype.cmpn = function(e) { var t, r = e < 0; if (0 !== this.negative && !r) return -1; if (0 === this.negative && r) return 1; if (this.strip(), this.length > 1) t = 1;
            else { r && (e = -e); var i = 0 | this.words[0];
                t = i === e ? 0 : i < e ? -1 : 1 } return 0 !== this.negative ? 0 | -t : t }, i.prototype.cmp = function(e) { if (0 !== this.negative && 0 === e.negative) return -1; if (0 === this.negative && 0 !== e.negative) return 1; var t = this.ucmp(e); return 0 !== this.negative ? 0 | -t : t }, i.prototype.ucmp = function(e) { if (this.length > e.length) return 1; if (this.length < e.length) return -1; for (var t = 0, r = this.length - 1; r >= 0; r--) { var i = 0 | this.words[r],
                    n = 0 | e.words[r]; if (i !== n) { i < n ? t = -1 : i > n && (t = 1); break } } return t }, i.prototype.gtn = function(e) { return 1 === this.cmpn(e) }, i.prototype.gt = function(e) { return 1 === this.cmp(e) }, i.prototype.gten = function(e) { return this.cmpn(e) >= 0 }, i.prototype.gte = function(e) { return this.cmp(e) >= 0 }, i.prototype.ltn = function(e) { return -1 === this.cmpn(e) }, i.prototype.lt = function(e) { return -1 === this.cmp(e) }, i.prototype.lten = function(e) { return this.cmpn(e) <= 0 }, i.prototype.lte = function(e) { return this.cmp(e) <= 0 }, i.prototype.eqn = function(e) { return 0 === this.cmpn(e) }, i.prototype.eq = function(e) { return 0 === this.cmp(e) }, i.red = function(e) { return new v(e) }, i.prototype.toRed = function(e) { return e.convertTo(this)._forceRed(e) }, i.prototype.fromRed = function() { return this.red.convertFrom(this) }, i.prototype._forceRed = function(e) { return this.red = e, this }, i.prototype.forceRed = function(e) { return this._forceRed(e) }, i.prototype.redAdd = function(e) { return this.red.add(this, e) }, i.prototype.redIAdd = function(e) { return this.red.iadd(this, e) }, i.prototype.redSub = function(e) { return this.red.sub(this, e) }, i.prototype.redISub = function(e) { return this.red.isub(this, e) }, i.prototype.redShl = function(e) { return this.red.shl(this, e) }, i.prototype.redMul = function(e) { return this.red._verify2(this, e), this.red.mul(this, e) }, i.prototype.redIMul = function(e) { return this.red._verify2(this, e), this.red.imul(this, e) }, i.prototype.redSqr = function() { return this.red._verify1(this), this.red.sqr(this) }, i.prototype.redISqr = function() { return this.red._verify1(this), this.red.isqr(this) }, i.prototype.redSqrt = function() { return this.red._verify1(this), this.red.sqrt(this) }, i.prototype.redInvm = function() { return this.red._verify1(this), this.red.invm(this) }, i.prototype.redNeg = function() { return this.red._verify1(this), this.red.neg(this) }, i.prototype.redPow = function(e) { return this.red._verify1(this), this.red.pow(this, e) }; var _ = { k256: null, p224: null, p192: null, p25519: null };

        function p(e, t) { this.name = e, this.p = new i(t, 16), this.n = this.p.bitLength(), this.k = new i(1).iushln(this.n).isub(this.p), this.tmp = this._tmp() }

        function b() { p.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f") }

        function m() { p.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001") }

        function g() { p.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff") }

        function y() { p.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed") }

        function v(e) { if ("string" == typeof e) { var t = i._prime(e);
                this.m = t.p, this.prime = t } else this.m = e, this.prime = null }

        function w(e) { v.call(this, e), this.shift = this.m.bitLength(), this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26), this.r = new i(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv) }
        p.prototype._tmp = function() { var e = new i(null); return e.words = new Array(Math.ceil(this.n / 13)), e }, p.prototype.ireduce = function(e) { var t, r = e;
            do { this.split(r, this.tmp), t = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength() } while (t > this.n); var i = t < this.n ? -1 : r.ucmp(this.p); return 0 === i ? (r.words[0] = 0, r.length = 1) : i > 0 ? r.isub(this.p) : r.strip(), r }, p.prototype.split = function(e, t) { e.iushrn(this.n, 0, t) }, p.prototype.imulK = function(e) { return e.imul(this.k) }, r(b, p), b.prototype.split = function(e, t) { for (var r = Math.min(e.length, 9), i = 0; i < r; i++) t.words[i] = e.words[i]; if (t.length = r, e.length <= 9) return e.words[0] = 0, void(e.length = 1); var n = e.words[9]; for (t.words[t.length++] = 4194303 & n, i = 10; i < e.length; i++) { var s = 0 | e.words[i];
                e.words[i - 10] = (4194303 & s) << 4 | n >>> 22, n = s }
            n >>>= 22, e.words[i - 10] = n, 0 === n && e.length > 10 ? e.length -= 10 : e.length -= 9 }, b.prototype.imulK = function(e) { e.words[e.length] = 0, e.words[e.length + 1] = 0, e.length += 2; for (var t = 0, r = 0; r < e.length; r++) { var i = 0 | e.words[r];
                t += 977 * i, e.words[r] = 67108863 & t, t = 64 * i + (t / 67108864 | 0) } return 0 === e.words[e.length - 1] && (e.length--, 0 === e.words[e.length - 1] && e.length--), e }, r(m, p), r(g, p), r(y, p), y.prototype.imulK = function(e) { for (var t = 0, r = 0; r < e.length; r++) { var i = 19 * (0 | e.words[r]) + t,
                    n = 67108863 & i;
                i >>>= 26, e.words[r] = n, t = i } return 0 !== t && (e.words[e.length++] = t), e }, i._prime = function(e) { if (_[e]) return _[e]; var t; if ("k256" === e) t = new b;
            else if ("p224" === e) t = new m;
            else if ("p192" === e) t = new g;
            else { if ("p25519" !== e) throw new Error("Unknown prime " + e);
                t = new y } return _[e] = t, t }, v.prototype._verify1 = function(e) {}, v.prototype._verify2 = function(e, t) {}, v.prototype.imod = function(e) { return this.prime ? this.prime.ireduce(e)._forceRed(this) : e.umod(this.m)._forceRed(this) }, v.prototype.neg = function(e) { return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this) }, v.prototype.add = function(e, t) { this._verify2(e, t); var r = e.add(t); return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this) }, v.prototype.iadd = function(e, t) { this._verify2(e, t); var r = e.iadd(t); return r.cmp(this.m) >= 0 && r.isub(this.m), r }, v.prototype.sub = function(e, t) { this._verify2(e, t); var r = e.sub(t); return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this) }, v.prototype.isub = function(e, t) { this._verify2(e, t); var r = e.isub(t); return r.cmpn(0) < 0 && r.iadd(this.m), r }, v.prototype.shl = function(e, t) { return this._verify1(e), this.imod(e.ushln(t)) }, v.prototype.imul = function(e, t) { return this._verify2(e, t), this.imod(e.imul(t)) }, v.prototype.mul = function(e, t) { return this._verify2(e, t), this.imod(e.mul(t)) }, v.prototype.isqr = function(e) { return this.imul(e, e.clone()) }, v.prototype.sqr = function(e) { return this.mul(e, e) }, v.prototype.sqrt = function(e) { if (e.isZero()) return e.clone(); if (3 === this.m.andln(3)) { var t = this.m.add(new i(1)).iushrn(2); return this.pow(e, t) } for (var r = this.m.subn(1), n = 0; !r.isZero() && 0 === r.andln(1);) n++, r.iushrn(1); var s = new i(1).toRed(this),
                a = s.redNeg(),
                o = this.m.subn(1).iushrn(1),
                f = this.m.bitLength(); for (f = new i(2 * f * f).toRed(this); 0 !== this.pow(f, o).cmp(a);) f.redIAdd(a); for (var c = this.pow(f, r), u = this.pow(e, r.addn(1).iushrn(1)), h = this.pow(e, r), d = n; 0 !== h.cmp(s);) { for (var l = h, _ = 0; 0 !== l.cmp(s); _++) l = l.redSqr(); var p = this.pow(c, new i(1).iushln(d - _ - 1));
                u = u.redMul(p), c = p.redSqr(), h = h.redMul(c), d = _ } return u }, v.prototype.invm = function(e) { var t = e._invmp(this.m); return 0 !== t.negative ? (t.negative = 0, this.imod(t).redNeg()) : this.imod(t) }, v.prototype.pow = function(e, t) { if (t.isZero()) return new i(1).toRed(this); if (0 === t.cmpn(1)) return e.clone(); var r = new Array(16);
            r[0] = new i(1).toRed(this), r[1] = e; for (var n = 2; n < r.length; n++) r[n] = this.mul(r[n - 1], e); var s = r[0],
                a = 0,
                o = 0,
                f = t.bitLength() % 26; for (0 === f && (f = 26), n = t.length - 1; n >= 0; n--) { for (var c = t.words[n], u = f - 1; u >= 0; u--) { var h = c >> u & 1;
                    s !== r[0] && (s = this.sqr(s)), 0 !== h || 0 !== a ? (a <<= 1, a |= h, (4 == ++o || 0 === n && 0 === u) && (s = this.mul(s, r[a]), o = 0, a = 0)) : o = 0 }
                f = 26 } return s }, v.prototype.convertTo = function(e) { var t = e.umod(this.m); return t === e ? t.clone() : t }, v.prototype.convertFrom = function(e) { var t = e.clone(); return t.red = null, t }, i.mont = function(e) { return new w(e) }, r(w, v), w.prototype.convertTo = function(e) { return this.imod(e.ushln(this.shift)) }, w.prototype.convertFrom = function(e) { var t = this.imod(e.mul(this.rinv)); return t.red = null, t }, w.prototype.imul = function(e, t) { if (e.isZero() || t.isZero()) return e.words[0] = 0, e.length = 1, e; var r = e.imul(t),
                i = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
                n = r.isub(i).iushrn(this.shift),
                s = n; return n.cmp(this.m) >= 0 ? s = n.isub(this.m) : n.cmpn(0) < 0 && (s = n.iadd(this.m)), s._forceRed(this) }, w.prototype.mul = function(e, t) { if (e.isZero() || t.isZero()) return new i(0)._forceRed(this); var r = e.mul(t),
                n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
                s = r.isub(n).iushrn(this.shift),
                a = s; return s.cmp(this.m) >= 0 ? a = s.isub(this.m) : s.cmpn(0) < 0 && (a = s.iadd(this.m)), a._forceRed(this) }, w.prototype.invm = function(e) { return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this) } }(_$bn_16, this), _$bn_16 = _$bn_16.exports; var _$brorand_17 = {},
        r;

    function Rand(e) { this.rand = e } if (_$brorand_17 = function(e) { return r || (r = new Rand(null)), r.generate(e) }, _$brorand_17.Rand = Rand, Rand.prototype.generate = function(e) { return this._rand(e) }, Rand.prototype._rand = function(e) { if (this.rand.getBytes) return this.rand.getBytes(e); for (var t = new Uint8Array(e), r = 0; r < t.length; r++) t[r] = this.rand.getByte(); return t }, "object" == typeof self) self.crypto && self.crypto.getRandomValues ? Rand.prototype._rand = function(e) { var t = new Uint8Array(e); return self.crypto.getRandomValues(t), t } : self.msCrypto && self.msCrypto.getRandomValues ? Rand.prototype._rand = function(e) { var t = new Uint8Array(e); return self.msCrypto.getRandomValues(t), t } : "object" == typeof window && (Rand.prototype._rand = function() { throw new Error("Not implemented yet") });
    else try { var crypto = _$empty_18({}); if ("function" != typeof crypto.randomBytes) throw new Error("Not supported");
        Rand.prototype._rand = function(e) { return crypto.randomBytes(e) } } catch (e) {}
    var _$mr_103 = {};

    function MillerRabin(e) { this.rand = e || new _$brorand_17.Rand }
    _$mr_103 = MillerRabin, MillerRabin.create = function(e) { return new MillerRabin(e) }, MillerRabin.prototype._randbelow = function(e) { var t = e.bitLength(),
            r = Math.ceil(t / 8);
        do { var i = new _$bn_16(this.rand.generate(r)) } while (i.cmp(e) >= 0); return i }, MillerRabin.prototype._randrange = function(e, t) { var r = t.sub(e); return e.add(this._randbelow(r)) }, MillerRabin.prototype.test = function(e, t, r) { var i = e.bitLength(),
            n = _$bn_16.mont(e),
            s = new _$bn_16(1).toRed(n);
        t || (t = Math.max(1, i / 48 | 0)); for (var a = e.subn(1), o = 0; !a.testn(o); o++); for (var f = e.shrn(o), c = a.toRed(n); t > 0; t--) { var u = this._randrange(new _$bn_16(2), a);
            r && r(u); var h = u.toRed(n).redPow(f); if (0 !== h.cmp(s) && 0 !== h.cmp(c)) { for (var d = 1; d < o; d++) { if (0 === (h = h.redSqr()).cmp(s)) return !1; if (0 === h.cmp(c)) break } if (d === o) return !1 } } return !0 }, MillerRabin.prototype.getDivisor = function(e, t) { var r = e.bitLength(),
            i = _$bn_16.mont(e),
            n = new _$bn_16(1).toRed(i);
        t || (t = Math.max(1, r / 48 | 0)); for (var s = e.subn(1), a = 0; !s.testn(a); a++); for (var o = e.shrn(a), f = s.toRed(i); t > 0; t--) { var c = this._randrange(new _$bn_16(2), s),
                u = e.gcd(c); if (0 !== u.cmpn(1)) return u; var h = c.toRed(i).redPow(o); if (0 !== h.cmp(n) && 0 !== h.cmp(f)) { for (var d = 1; d < a; d++) { if (0 === (h = h.redSqr()).cmp(n)) return h.fromRed().subn(1).gcd(e); if (0 === h.cmp(f)) break } if (d === a) return (h = h.redSqr()).fromRed().subn(1).gcd(e) } } return !1 }; var _$generatePrime_64 = {};
    _$generatePrime_64 = findPrime, findPrime.simpleSieve = simpleSieve, findPrime.fermatTest = fermatTest; var TWENTYFOUR = new _$bn_16(24),
        millerRabin = new _$mr_103,
        ONE = new _$bn_16(1),
        TWO = new _$bn_16(2),
        FIVE = new _$bn_16(5),
        TEN = (new _$bn_16(16), new _$bn_16(8), new _$bn_16(10)),
        THREE = new _$bn_16(3),
        ELEVEN = (new _$bn_16(7), new _$bn_16(11)),
        FOUR = new _$bn_16(4),
        primes = (new _$bn_16(12), null);

    function _getPrimes() { if (null !== primes) return primes; var e = [];
        e[0] = 2; for (var t = 1, r = 3; r < 1048576; r += 2) { for (var i = Math.ceil(Math.sqrt(r)), n = 0; n < t && e[n] <= i && r % e[n] != 0; n++);
            t !== n && e[n] <= i || (e[t++] = r) } return primes = e, e }

    function simpleSieve(e) { for (var t = _getPrimes(), r = 0; r < t.length; r++)
            if (0 === e.modn(t[r])) return 0 === e.cmpn(t[r]);
        return !0 }

    function fermatTest(e) { var t = _$bn_16.mont(e); return 0 === TWO.toRed(t).redPow(e.subn(1)).fromRed().cmpn(1) }

    function findPrime(e, t) { if (e < 16) return new _$bn_16(2 === t || 5 === t ? [140, 123] : [140, 39]); var r, i; for (t = new _$bn_16(t);;) { for (r = new _$bn_16(_$browser_127(Math.ceil(e / 8))); r.bitLength() > e;) r.ishrn(1); if (r.isEven() && r.iadd(ONE), r.testn(1) || r.iadd(TWO), t.cmp(TWO)) { if (!t.cmp(FIVE))
                    for (; r.mod(TEN).cmp(THREE);) r.iadd(FOUR) } else
                for (; r.mod(TWENTYFOUR).cmp(ELEVEN);) r.iadd(FOUR); if (simpleSieve(i = r.shrn(1)) && simpleSieve(r) && fermatTest(i) && fermatTest(r) && millerRabin.test(i) && millerRabin.test(r)) return r } } var _$primes_65 = { modp1: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff" }, modp2: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff" }, modp5: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff" }, modp14: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff" }, modp15: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff" }, modp16: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff" }, modp17: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff" }, modp18: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff" } },
        _$DH_63 = {};
    (function(e) { var t = new _$mr_103,
            r = new _$bn_16(24),
            i = new _$bn_16(11),
            n = new _$bn_16(10),
            s = new _$bn_16(3),
            a = new _$bn_16(7);

        function o(t, r) { return r = r || "utf8", e.isBuffer(t) || (t = new e(t, r)), this._pub = new _$bn_16(t), this }

        function f(t, r) { return r = r || "utf8", e.isBuffer(t) || (t = new e(t, r)), this._priv = new _$bn_16(t), this }
        _$DH_63 = u; var c = {};

        function u(e, t, r) { this.setGenerator(t), this.__prime = new _$bn_16(e), this._prime = _$bn_16.mont(this.__prime), this._primeLen = e.length, this._pub = void 0, this._priv = void 0, this._primeCode = void 0, r ? (this.setPublicKey = o, this.setPrivateKey = f) : this._primeCode = 8 }

        function h(t, r) { var i = new e(t.toArray()); return r ? i.toString(r) : i }
        Object.defineProperty(u.prototype, "verifyError", { enumerable: !0, get: function() { return "number" != typeof this._primeCode && (this._primeCode = function(e, o) { var f = o.toString("hex"),
                        u = [f, e.toString(16)].join("_"); if (u in c) return c[u]; var h, d = 0; if (e.isEven() || !_$generatePrime_64.simpleSieve || !_$generatePrime_64.fermatTest(e) || !t.test(e)) return d += 1, d += "02" === f || "05" === f ? 8 : 4, c[u] = d, d; switch (t.test(e.shrn(1)) || (d += 2), f) {
                        case "02":
                            e.mod(r).cmp(i) && (d += 8); break;
                        case "05":
                            (h = e.mod(n)).cmp(s) && h.cmp(a) && (d += 8); break;
                        default:
                            d += 4 } return c[u] = d, d }(this.__prime, this.__gen)), this._primeCode } }), u.prototype.generateKeys = function() { return this._priv || (this._priv = new _$bn_16(_$browser_127(this._primeLen))), this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed(), this.getPublicKey() }, u.prototype.computeSecret = function(t) { var r = (t = (t = new _$bn_16(t)).toRed(this._prime)).redPow(this._priv).fromRed(),
                i = new e(r.toArray()),
                n = this.getPrime(); if (i.length < n.length) { var s = new e(n.length - i.length);
                s.fill(0), i = e.concat([s, i]) } return i }, u.prototype.getPublicKey = function(e) { return h(this._pub, e) }, u.prototype.getPrivateKey = function(e) { return h(this._priv, e) }, u.prototype.getPrime = function(e) { return h(this.__prime, e) }, u.prototype.getGenerator = function(e) { return h(this._gen, e) }, u.prototype.setGenerator = function(t, r) { return r = r || "utf8", e.isBuffer(t) || (t = new e(t, r)), this.__gen = t, this._gen = new _$bn_16(t), this } }).call(this, _$buffer_47({}).Buffer); var _$browser_62 = {};
    (function(e) {}).call(this, _$buffer_47({}).Buffer); var _$browserifyRsa_39 = {};
    (function(e) {
        function t(t, i) { var n = function(e) { var t = r(e); return { blinder: t.toRed(_$bn_16.mont(e.modulus)).redPow(new _$bn_16(e.publicExponent)).fromRed(), unblinder: t.invm(e.modulus) } }(i),
                s = i.modulus.byteLength(),
                a = (_$bn_16.mont(i.modulus), new _$bn_16(t).mul(n.blinder).umod(i.modulus)),
                o = a.toRed(_$bn_16.mont(i.prime1)),
                f = a.toRed(_$bn_16.mont(i.prime2)),
                c = i.coefficient,
                u = i.prime1,
                h = i.prime2,
                d = o.redPow(i.exponent1),
                l = f.redPow(i.exponent2);
            d = d.fromRed(), l = l.fromRed(); var _ = d.isub(l).imul(c).umod(u); return _.imul(h), l.iadd(_), new e(l.imul(n.unblinder).umod(i.modulus).toArray(!1, s)) }

        function r(e) { for (var t = e.modulus.byteLength(), r = new _$bn_16(_$browser_127(t)); r.cmp(e.modulus) >= 0 || !r.umod(e.prime1) || !r.umod(e.prime2);) r = new _$bn_16(_$browser_127(t)); return r }
        _$browserifyRsa_39 = t, t.getr = r }).call(this, _$buffer_47({}).Buffer); var _$package_81 = { version: "6.5.1" },
        _$utils_105 = {},
        __utils_105 = _$utils_105;

    function zero2(e) { return 1 === e.length ? "0" + e : e }

    function toHex(e) { for (var t = "", r = 0; r < e.length; r++) t += zero2(e[r].toString(16)); return t }
    __utils_105.toArray = function(e, t) { if (Array.isArray(e)) return e.slice(); if (!e) return []; var r = []; if ("string" != typeof e) { for (var i = 0; i < e.length; i++) r[i] = 0 | e[i]; return r } if ("hex" === t)
            for ((e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e), i = 0; i < e.length; i += 2) r.push(parseInt(e[i] + e[i + 1], 16));
        else
            for (i = 0; i < e.length; i++) { var n = e.charCodeAt(i),
                    s = n >> 8,
                    a = 255 & n;
                s ? r.push(s, a) : r.push(a) }
        return r }, __utils_105.zero2 = zero2, __utils_105.toHex = toHex, __utils_105.encode = function(e, t) { return "hex" === t ? toHex(e) : e }; var _$utils_80 = {},
        __utils_80 = _$utils_80;
    __utils_80.assert = _$minimalisticAssert_104, __utils_80.toArray = _$utils_105.toArray, __utils_80.zero2 = _$utils_105.zero2, __utils_80.toHex = _$utils_105.toHex, __utils_80.encode = _$utils_105.encode, __utils_80.getNAF = function(e, t) { for (var r = [], i = 1 << t + 1, n = e.clone(); n.cmpn(1) >= 0;) { var s; if (n.isOdd()) { var a = n.andln(i - 1);
                s = a > (i >> 1) - 1 ? (i >> 1) - a : a, n.isubn(s) } else s = 0;
            r.push(s); for (var o = 0 !== n.cmpn(0) && 0 === n.andln(i - 1) ? t + 1 : 1, f = 1; f < o; f++) r.push(0);
            n.iushrn(o) } return r }, __utils_80.getJSF = function(e, t) { var r = [
            [],
            []
        ];
        e = e.clone(), t = t.clone(); for (var i = 0, n = 0; e.cmpn(-i) > 0 || t.cmpn(-n) > 0;) { var s, a, o, f = e.andln(3) + i & 3,
                c = t.andln(3) + n & 3;
            3 === f && (f = -1), 3 === c && (c = -1), s = 0 == (1 & f) ? 0 : 3 != (o = e.andln(7) + i & 7) && 5 !== o || 2 !== c ? f : -f, r[0].push(s), a = 0 == (1 & c) ? 0 : 3 != (o = t.andln(7) + n & 7) && 5 !== o || 2 !== f ? c : -c, r[1].push(a), 2 * i === s + 1 && (i = 1 - i), 2 * n === a + 1 && (n = 1 - n), e.iushrn(1), t.iushrn(1) } return r }, __utils_80.cachedProperty = function(e, t, r) { var i = "_" + t;
        e.prototype[t] = function() { return void 0 !== this[i] ? this[i] : this[i] = r.call(this) } }, __utils_80.parseBytes = function(e) { return "string" == typeof e ? __utils_80.toArray(e, "hex") : e }, __utils_80.intFromLE = function(e) { return new _$bn_16(e, "hex", "le") }; var _$base_67 = {},
        getNAF = _$utils_80.getNAF,
        getJSF = _$utils_80.getJSF;

    function BaseCurve(e, t) { this.type = e, this.p = new _$bn_16(t.p, 16), this.red = t.prime ? _$bn_16.red(t.prime) : _$bn_16.mont(this.p), this.zero = new _$bn_16(0).toRed(this.red), this.one = new _$bn_16(1).toRed(this.red), this.two = new _$bn_16(2).toRed(this.red), this.n = t.n && new _$bn_16(t.n, 16), this.g = t.g && this.pointFromJSON(t.g, t.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4); var r = this.n && this.p.div(this.n);!r || r.cmpn(100) > 0 ? this.redN = null : (this._maxwellTrick = !0, this.redN = this.n.toRed(this.red)) }

    function BasePoint(e, t) { this.curve = e, this.type = t, this.precomputed = null }
    _$utils_80.assert, _$base_67 = BaseCurve, BaseCurve.prototype.point = function() { throw new Error("Not implemented") }, BaseCurve.prototype.validate = function() { throw new Error("Not implemented") }, BaseCurve.prototype._fixedNafMul = function(e, t) { var r = e._getDoubles(),
            i = getNAF(t, 1),
            n = (1 << r.step + 1) - (r.step % 2 == 0 ? 2 : 1);
        n /= 3; for (var s = [], a = 0; a < i.length; a += r.step) { var o = 0; for (t = a + r.step - 1; t >= a; t--) o = (o << 1) + i[t];
            s.push(o) } for (var f = this.jpoint(null, null, null), c = this.jpoint(null, null, null), u = n; u > 0; u--) { for (a = 0; a < s.length; a++)(o = s[a]) === u ? c = c.mixedAdd(r.points[a]) : o === -u && (c = c.mixedAdd(r.points[a].neg()));
            f = f.add(c) } return f.toP() }, BaseCurve.prototype._wnafMul = function(e, t) { var r = 4,
            i = e._getNAFPoints(r);
        r = i.wnd; for (var n = i.points, s = getNAF(t, r), a = this.jpoint(null, null, null), o = s.length - 1; o >= 0; o--) { for (t = 0; o >= 0 && 0 === s[o]; o--) t++; if (o >= 0 && t++, a = a.dblp(t), o < 0) break; var f = s[o];
            a = "affine" === e.type ? f > 0 ? a.mixedAdd(n[f - 1 >> 1]) : a.mixedAdd(n[-f - 1 >> 1].neg()) : f > 0 ? a.add(n[f - 1 >> 1]) : a.add(n[-f - 1 >> 1].neg()) } return "affine" === e.type ? a.toP() : a }, BaseCurve.prototype._wnafMulAdd = function(e, t, r, i, n) { for (var s = this._wnafT1, a = this._wnafT2, o = this._wnafT3, f = 0, c = 0; c < i; c++) { var u = (S = t[c])._getNAFPoints(e);
            s[c] = u.wnd, a[c] = u.points } for (c = i - 1; c >= 1; c -= 2) { var h = c - 1,
                d = c; if (1 === s[h] && 1 === s[d]) { var l = [t[h], null, null, t[d]];
                0 === t[h].y.cmp(t[d].y) ? (l[1] = t[h].add(t[d]), l[2] = t[h].toJ().mixedAdd(t[d].neg())) : 0 === t[h].y.cmp(t[d].y.redNeg()) ? (l[1] = t[h].toJ().mixedAdd(t[d]), l[2] = t[h].add(t[d].neg())) : (l[1] = t[h].toJ().mixedAdd(t[d]), l[2] = t[h].toJ().mixedAdd(t[d].neg())); var _ = [-3, -1, -5, -7, 0, 7, 5, 1, 3],
                    p = getJSF(r[h], r[d]);
                f = Math.max(p[0].length, f), o[h] = new Array(f), o[d] = new Array(f); for (var b = 0; b < f; b++) { var m = 0 | p[0][b],
                        g = 0 | p[1][b];
                    o[h][b] = _[3 * (m + 1) + (g + 1)], o[d][b] = 0, a[h] = l } } else o[h] = getNAF(r[h], s[h]), o[d] = getNAF(r[d], s[d]), f = Math.max(o[h].length, f), f = Math.max(o[d].length, f) } var y = this.jpoint(null, null, null),
            v = this._wnafT4; for (c = f; c >= 0; c--) { for (var w = 0; c >= 0;) { var $ = !0; for (b = 0; b < i; b++) v[b] = 0 | o[b][c], 0 !== v[b] && ($ = !1); if (!$) break;
                w++, c-- } if (c >= 0 && w++, y = y.dblp(w), c < 0) break; for (b = 0; b < i; b++) { var S, B = v[b];
                0 !== B && (B > 0 ? S = a[b][B - 1 >> 1] : B < 0 && (S = a[b][-B - 1 >> 1].neg()), y = "affine" === S.type ? y.mixedAdd(S) : y.add(S)) } } for (c = 0; c < i; c++) a[c] = null; return n ? y : y.toP() }, BaseCurve.BasePoint = BasePoint, BasePoint.prototype.eq = function() { throw new Error("Not implemented") }, BasePoint.prototype.validate = function() { return this.curve.validate(this) }, BaseCurve.prototype.decodePoint = function(e, t) { e = _$utils_80.toArray(e, t); var r = this.p.byteLength(); if ((4 === e[0] || 6 === e[0] || 7 === e[0]) && e.length - 1 == 2 * r) return 6 === e[0] || e[0], this.point(e.slice(1, 1 + r), e.slice(1 + r, 1 + 2 * r)); if ((2 === e[0] || 3 === e[0]) && e.length - 1 === r) return this.pointFromX(e.slice(1, 1 + r), 3 === e[0]); throw new Error("Unknown point format") }, BasePoint.prototype.encodeCompressed = function(e) { return this.encode(e, !0) }, BasePoint.prototype._encode = function(e) { var t = this.curve.p.byteLength(),
            r = this.getX().toArray("be", t); return e ? [this.getY().isEven() ? 2 : 3].concat(r) : [4].concat(r, this.getY().toArray("be", t)) }, BasePoint.prototype.encode = function(e, t) { return _$utils_80.encode(this._encode(t), e) }, BasePoint.prototype.precompute = function(e) { if (this.precomputed) return this; var t = { doubles: null, naf: null, beta: null }; return t.naf = this._getNAFPoints(8), t.doubles = this._getDoubles(4, e), t.beta = this._getBeta(), this.precomputed = t, this }, BasePoint.prototype._hasDoubles = function(e) { if (!this.precomputed) return !1; var t = this.precomputed.doubles; return !!t && t.points.length >= Math.ceil((e.bitLength() + 1) / t.step) }, BasePoint.prototype._getDoubles = function(e, t) { if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles; for (var r = [this], i = this, n = 0; n < t; n += e) { for (var s = 0; s < e; s++) i = i.dbl();
            r.push(i) } return { step: e, points: r } }, BasePoint.prototype._getNAFPoints = function(e) { if (this.precomputed && this.precomputed.naf) return this.precomputed.naf; for (var t = [this], r = (1 << e) - 1, i = 1 === r ? null : this.dbl(), n = 1; n < r; n++) t[n] = t[n - 1].add(i); return { wnd: e, points: t } }, BasePoint.prototype._getBeta = function() { return null }, BasePoint.prototype.dblp = function(e) { for (var t = this, r = 0; r < e; r++) t = t.dbl(); return t }; var _$short_71 = {};

    function ShortCurve(e) { _$base_67.call(this, "short", e), this.a = new _$bn_16(e.a, 16).toRed(this.red), this.b = new _$bn_16(e.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = 0 === this.a.fromRed().cmpn(0), this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3), this.endo = this._getEndomorphism(e), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4) }

    function Point(e, t, r, i) { _$base_67.BasePoint.call(this, e, "affine"), null === t && null === r ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new _$bn_16(t, 16), this.y = new _$bn_16(r, 16), i && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1) }

    function JPoint(e, t, r, i) { _$base_67.BasePoint.call(this, e, "jacobian"), null === t && null === r && null === i ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new _$bn_16(0)) : (this.x = new _$bn_16(t, 16), this.y = new _$bn_16(r, 16), this.z = new _$bn_16(i, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one }
    _$utils_80.assert, _$inherits_browser_99(ShortCurve, _$base_67), _$short_71 = ShortCurve, ShortCurve.prototype._getEndomorphism = function(e) { if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) { var t, r; if (e.beta) t = new _$bn_16(e.beta, 16).toRed(this.red);
            else { var i = this._getEndoRoots(this.p);
                t = (t = i[0].cmp(i[1]) < 0 ? i[0] : i[1]).toRed(this.red) } if (e.lambda) r = new _$bn_16(e.lambda, 16);
            else { var n = this._getEndoRoots(this.n);
                r = 0 === this.g.mul(n[0]).x.cmp(this.g.x.redMul(t)) ? n[0] : n[1] } return { beta: t, lambda: r, basis: e.basis ? e.basis.map(function(e) { return { a: new _$bn_16(e.a, 16), b: new _$bn_16(e.b, 16) } }) : this._getEndoBasis(r) } } }, ShortCurve.prototype._getEndoRoots = function(e) { var t = e === this.p ? this.red : _$bn_16.mont(e),
            r = new _$bn_16(2).toRed(t).redInvm(),
            i = r.redNeg(),
            n = new _$bn_16(3).toRed(t).redNeg().redSqrt().redMul(r); return [i.redAdd(n).fromRed(), i.redSub(n).fromRed()] }, ShortCurve.prototype._getEndoBasis = function(e) { for (var t, r, i, n, s, a, o, f, c, u = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), h = e, d = this.n.clone(), l = new _$bn_16(1), _ = new _$bn_16(0), p = new _$bn_16(0), b = new _$bn_16(1), m = 0; 0 !== h.cmpn(0);) { var g = d.div(h);
            f = d.sub(g.mul(h)), c = p.sub(g.mul(l)); var y = b.sub(g.mul(_)); if (!i && f.cmp(u) < 0) t = o.neg(), r = l, i = f.neg(), n = c;
            else if (i && 2 == ++m) break;
            o = f, d = h, h = f, p = l, l = c, b = _, _ = y }
        s = f.neg(), a = c; var v = i.sqr().add(n.sqr()); return s.sqr().add(a.sqr()).cmp(v) >= 0 && (s = t, a = r), i.negative && (i = i.neg(), n = n.neg()), s.negative && (s = s.neg(), a = a.neg()), [{ a: i, b: n }, { a: s, b: a }] }, ShortCurve.prototype._endoSplit = function(e) { var t = this.endo.basis,
            r = t[0],
            i = t[1],
            n = i.b.mul(e).divRound(this.n),
            s = r.b.neg().mul(e).divRound(this.n),
            a = n.mul(r.a),
            o = s.mul(i.a),
            f = n.mul(r.b),
            c = s.mul(i.b); return { k1: e.sub(a).sub(o), k2: f.add(c).neg() } }, ShortCurve.prototype.pointFromX = function(e, t) {
        (e = new _$bn_16(e, 16)).red || (e = e.toRed(this.red)); var r = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b),
            i = r.redSqrt(); if (0 !== i.redSqr().redSub(r).cmp(this.zero)) throw new Error("invalid point"); var n = i.fromRed().isOdd(); return (t && !n || !t && n) && (i = i.redNeg()), this.point(e, i) }, ShortCurve.prototype.validate = function(e) { if (e.inf) return !0; var t = e.x,
            r = e.y,
            i = this.a.redMul(t),
            n = t.redSqr().redMul(t).redIAdd(i).redIAdd(this.b); return 0 === r.redSqr().redISub(n).cmpn(0) }, ShortCurve.prototype._endoWnafMulAdd = function(e, t, r) { for (var i = this._endoWnafT1, n = this._endoWnafT2, s = 0; s < e.length; s++) { var a = this._endoSplit(t[s]),
                o = e[s],
                f = o._getBeta();
            a.k1.negative && (a.k1.ineg(), o = o.neg(!0)), a.k2.negative && (a.k2.ineg(), f = f.neg(!0)), i[2 * s] = o, i[2 * s + 1] = f, n[2 * s] = a.k1, n[2 * s + 1] = a.k2 } for (var c = this._wnafMulAdd(1, i, n, 2 * s, r), u = 0; u < 2 * s; u++) i[u] = null, n[u] = null; return c }, _$inherits_browser_99(Point, _$base_67.BasePoint), ShortCurve.prototype.point = function(e, t, r) { return new Point(this, e, t, r) }, ShortCurve.prototype.pointFromJSON = function(e, t) { return Point.fromJSON(this, e, t) }, Point.prototype._getBeta = function() { if (this.curve.endo) { var e = this.precomputed; if (e && e.beta) return e.beta; var t = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y); if (e) { var r = this.curve,
                    i = function(e) { return r.point(e.x.redMul(r.endo.beta), e.y) };
                e.beta = t, t.precomputed = { beta: null, naf: e.naf && { wnd: e.naf.wnd, points: e.naf.points.map(i) }, doubles: e.doubles && { step: e.doubles.step, points: e.doubles.points.map(i) } } } return t } }, Point.prototype.toJSON = function() { return this.precomputed ? [this.x, this.y, this.precomputed && { doubles: this.precomputed.doubles && { step: this.precomputed.doubles.step, points: this.precomputed.doubles.points.slice(1) }, naf: this.precomputed.naf && { wnd: this.precomputed.naf.wnd, points: this.precomputed.naf.points.slice(1) } }] : [this.x, this.y] }, Point.fromJSON = function(e, t, r) { "string" == typeof t && (t = JSON.parse(t)); var i = e.point(t[0], t[1], r); if (!t[2]) return i;

        function n(t) { return e.point(t[0], t[1], r) } var s = t[2]; return i.precomputed = { beta: null, doubles: s.doubles && { step: s.doubles.step, points: [i].concat(s.doubles.points.map(n)) }, naf: s.naf && { wnd: s.naf.wnd, points: [i].concat(s.naf.points.map(n)) } }, i }, Point.prototype.inspect = function() { return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">" }, Point.prototype.isInfinity = function() { return this.inf }, Point.prototype.add = function(e) { if (this.inf) return e; if (e.inf) return this; if (this.eq(e)) return this.dbl(); if (this.neg().eq(e)) return this.curve.point(null, null); if (0 === this.x.cmp(e.x)) return this.curve.point(null, null); var t = this.y.redSub(e.y);
        0 !== t.cmpn(0) && (t = t.redMul(this.x.redSub(e.x).redInvm())); var r = t.redSqr().redISub(this.x).redISub(e.x),
            i = t.redMul(this.x.redSub(r)).redISub(this.y); return this.curve.point(r, i) }, Point.prototype.dbl = function() { if (this.inf) return this; var e = this.y.redAdd(this.y); if (0 === e.cmpn(0)) return this.curve.point(null, null); var t = this.curve.a,
            r = this.x.redSqr(),
            i = e.redInvm(),
            n = r.redAdd(r).redIAdd(r).redIAdd(t).redMul(i),
            s = n.redSqr().redISub(this.x.redAdd(this.x)),
            a = n.redMul(this.x.redSub(s)).redISub(this.y); return this.curve.point(s, a) }, Point.prototype.getX = function() { return this.x.fromRed() }, Point.prototype.getY = function() { return this.y.fromRed() }, Point.prototype.mul = function(e) { return e = new _$bn_16(e, 16), this.isInfinity() ? this : this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [e]) : this.curve._wnafMul(this, e) }, Point.prototype.mulAdd = function(e, t, r) { var i = [this, t],
            n = [e, r]; return this.curve.endo ? this.curve._endoWnafMulAdd(i, n) : this.curve._wnafMulAdd(1, i, n, 2) }, Point.prototype.jmulAdd = function(e, t, r) { var i = [this, t],
            n = [e, r]; return this.curve.endo ? this.curve._endoWnafMulAdd(i, n, !0) : this.curve._wnafMulAdd(1, i, n, 2, !0) }, Point.prototype.eq = function(e) { return this === e || this.inf === e.inf && (this.inf || 0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y)) }, Point.prototype.neg = function(e) { if (this.inf) return this; var t = this.curve.point(this.x, this.y.redNeg()); if (e && this.precomputed) { var r = this.precomputed,
                i = function(e) { return e.neg() };
            t.precomputed = { naf: r.naf && { wnd: r.naf.wnd, points: r.naf.points.map(i) }, doubles: r.doubles && { step: r.doubles.step, points: r.doubles.points.map(i) } } } return t }, Point.prototype.toJ = function() { return this.inf ? this.curve.jpoint(null, null, null) : this.curve.jpoint(this.x, this.y, this.curve.one) }, _$inherits_browser_99(JPoint, _$base_67.BasePoint), ShortCurve.prototype.jpoint = function(e, t, r) { return new JPoint(this, e, t, r) }, JPoint.prototype.toP = function() { if (this.isInfinity()) return this.curve.point(null, null); var e = this.z.redInvm(),
            t = e.redSqr(),
            r = this.x.redMul(t),
            i = this.y.redMul(t).redMul(e); return this.curve.point(r, i) }, JPoint.prototype.neg = function() { return this.curve.jpoint(this.x, this.y.redNeg(), this.z) }, JPoint.prototype.add = function(e) { if (this.isInfinity()) return e; if (e.isInfinity()) return this; var t = e.z.redSqr(),
            r = this.z.redSqr(),
            i = this.x.redMul(t),
            n = e.x.redMul(r),
            s = this.y.redMul(t.redMul(e.z)),
            a = e.y.redMul(r.redMul(this.z)),
            o = i.redSub(n),
            f = s.redSub(a); if (0 === o.cmpn(0)) return 0 !== f.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl(); var c = o.redSqr(),
            u = c.redMul(o),
            h = i.redMul(c),
            d = f.redSqr().redIAdd(u).redISub(h).redISub(h),
            l = f.redMul(h.redISub(d)).redISub(s.redMul(u)),
            _ = this.z.redMul(e.z).redMul(o); return this.curve.jpoint(d, l, _) }, JPoint.prototype.mixedAdd = function(e) { if (this.isInfinity()) return e.toJ(); if (e.isInfinity()) return this; var t = this.z.redSqr(),
            r = this.x,
            i = e.x.redMul(t),
            n = this.y,
            s = e.y.redMul(t).redMul(this.z),
            a = r.redSub(i),
            o = n.redSub(s); if (0 === a.cmpn(0)) return 0 !== o.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl(); var f = a.redSqr(),
            c = f.redMul(a),
            u = r.redMul(f),
            h = o.redSqr().redIAdd(c).redISub(u).redISub(u),
            d = o.redMul(u.redISub(h)).redISub(n.redMul(c)),
            l = this.z.redMul(a); return this.curve.jpoint(h, d, l) }, JPoint.prototype.dblp = function(e) { if (0 === e) return this; if (this.isInfinity()) return this; if (!e) return this.dbl(); if (this.curve.zeroA || this.curve.threeA) { for (var t = this, r = 0; r < e; r++) t = t.dbl(); return t } var i = this.curve.a,
            n = this.curve.tinv,
            s = this.x,
            a = this.y,
            o = this.z,
            f = o.redSqr().redSqr(),
            c = a.redAdd(a); for (r = 0; r < e; r++) { var u = s.redSqr(),
                h = c.redSqr(),
                d = h.redSqr(),
                l = u.redAdd(u).redIAdd(u).redIAdd(i.redMul(f)),
                _ = s.redMul(h),
                p = l.redSqr().redISub(_.redAdd(_)),
                b = _.redISub(p),
                m = l.redMul(b);
            m = m.redIAdd(m).redISub(d); var g = c.redMul(o);
            r + 1 < e && (f = f.redMul(d)), s = p, o = g, c = m } return this.curve.jpoint(s, c.redMul(n), o) }, JPoint.prototype.dbl = function() { return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl() }, JPoint.prototype._zeroDbl = function() { var e, t, r; if (this.zOne) { var i = this.x.redSqr(),
                n = this.y.redSqr(),
                s = n.redSqr(),
                a = this.x.redAdd(n).redSqr().redISub(i).redISub(s);
            a = a.redIAdd(a); var o = i.redAdd(i).redIAdd(i),
                f = o.redSqr().redISub(a).redISub(a),
                c = s.redIAdd(s);
            c = (c = c.redIAdd(c)).redIAdd(c), e = f, t = o.redMul(a.redISub(f)).redISub(c), r = this.y.redAdd(this.y) } else { var u = this.x.redSqr(),
                h = this.y.redSqr(),
                d = h.redSqr(),
                l = this.x.redAdd(h).redSqr().redISub(u).redISub(d);
            l = l.redIAdd(l); var _ = u.redAdd(u).redIAdd(u),
                p = _.redSqr(),
                b = d.redIAdd(d);
            b = (b = b.redIAdd(b)).redIAdd(b), e = p.redISub(l).redISub(l), t = _.redMul(l.redISub(e)).redISub(b), r = (r = this.y.redMul(this.z)).redIAdd(r) } return this.curve.jpoint(e, t, r) }, JPoint.prototype._threeDbl = function() { var e, t, r; if (this.zOne) { var i = this.x.redSqr(),
                n = this.y.redSqr(),
                s = n.redSqr(),
                a = this.x.redAdd(n).redSqr().redISub(i).redISub(s);
            a = a.redIAdd(a); var o = i.redAdd(i).redIAdd(i).redIAdd(this.curve.a),
                f = o.redSqr().redISub(a).redISub(a);
            e = f; var c = s.redIAdd(s);
            c = (c = c.redIAdd(c)).redIAdd(c), t = o.redMul(a.redISub(f)).redISub(c), r = this.y.redAdd(this.y) } else { var u = this.z.redSqr(),
                h = this.y.redSqr(),
                d = this.x.redMul(h),
                l = this.x.redSub(u).redMul(this.x.redAdd(u));
            l = l.redAdd(l).redIAdd(l); var _ = d.redIAdd(d),
                p = (_ = _.redIAdd(_)).redAdd(_);
            e = l.redSqr().redISub(p), r = this.y.redAdd(this.z).redSqr().redISub(h).redISub(u); var b = h.redSqr();
            b = (b = (b = b.redIAdd(b)).redIAdd(b)).redIAdd(b), t = l.redMul(_.redISub(e)).redISub(b) } return this.curve.jpoint(e, t, r) }, JPoint.prototype._dbl = function() { var e = this.curve.a,
            t = this.x,
            r = this.y,
            i = this.z,
            n = i.redSqr().redSqr(),
            s = t.redSqr(),
            a = r.redSqr(),
            o = s.redAdd(s).redIAdd(s).redIAdd(e.redMul(n)),
            f = t.redAdd(t),
            c = (f = f.redIAdd(f)).redMul(a),
            u = o.redSqr().redISub(c.redAdd(c)),
            h = c.redISub(u),
            d = a.redSqr();
        d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d); var l = o.redMul(h).redISub(d),
            _ = r.redAdd(r).redMul(i); return this.curve.jpoint(u, l, _) }, JPoint.prototype.trpl = function() { if (!this.curve.zeroA) return this.dbl().add(this); var e = this.x.redSqr(),
            t = this.y.redSqr(),
            r = this.z.redSqr(),
            i = t.redSqr(),
            n = e.redAdd(e).redIAdd(e),
            s = n.redSqr(),
            a = this.x.redAdd(t).redSqr().redISub(e).redISub(i),
            o = (a = (a = (a = a.redIAdd(a)).redAdd(a).redIAdd(a)).redISub(s)).redSqr(),
            f = i.redIAdd(i);
        f = (f = (f = f.redIAdd(f)).redIAdd(f)).redIAdd(f); var c = n.redIAdd(a).redSqr().redISub(s).redISub(o).redISub(f),
            u = t.redMul(c);
        u = (u = u.redIAdd(u)).redIAdd(u); var h = this.x.redMul(o).redISub(u);
        h = (h = h.redIAdd(h)).redIAdd(h); var d = this.y.redMul(c.redMul(f.redISub(c)).redISub(a.redMul(o)));
        d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d); var l = this.z.redAdd(a).redSqr().redISub(r).redISub(o); return this.curve.jpoint(h, d, l) }, JPoint.prototype.mul = function(e, t) { return e = new _$bn_16(e, t), this.curve._wnafMul(this, e) }, JPoint.prototype.eq = function(e) { if ("affine" === e.type) return this.eq(e.toJ()); if (this === e) return !0; var t = this.z.redSqr(),
            r = e.z.redSqr(); if (0 !== this.x.redMul(r).redISub(e.x.redMul(t)).cmpn(0)) return !1; var i = t.redMul(this.z),
            n = r.redMul(e.z); return 0 === this.y.redMul(n).redISub(e.y.redMul(i)).cmpn(0) }, JPoint.prototype.eqXToP = function(e) { var t = this.z.redSqr(),
            r = e.toRed(this.curve.red).redMul(t); if (0 === this.x.cmp(r)) return !0; for (var i = e.clone(), n = this.curve.redN.redMul(t);;) { if (i.iadd(this.curve.n), i.cmp(this.curve.p) >= 0) return !1; if (r.redIAdd(n), 0 === this.x.cmp(r)) return !0 } }, JPoint.prototype.inspect = function() { return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">" }, JPoint.prototype.isInfinity = function() { return 0 === this.z.cmpn(0) }; var _$mont_70 = {};

    function MontCurve(e) { _$base_67.call(this, "mont", e), this.a = new _$bn_16(e.a, 16).toRed(this.red), this.b = new _$bn_16(e.b, 16).toRed(this.red), this.i4 = new _$bn_16(4).toRed(this.red).redInvm(), this.two = new _$bn_16(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two)) }

    function __Point_70(e, t, r) { _$base_67.BasePoint.call(this, e, "projective"), null === t && null === r ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new _$bn_16(t, 16), this.z = new _$bn_16(r, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red))) }
    _$inherits_browser_99(MontCurve, _$base_67), _$mont_70 = MontCurve, MontCurve.prototype.validate = function(e) { var t = e.normalize().x,
            r = t.redSqr(),
            i = r.redMul(t).redAdd(r.redMul(this.a)).redAdd(t); return 0 === i.redSqrt().redSqr().cmp(i) }, _$inherits_browser_99(__Point_70, _$base_67.BasePoint), MontCurve.prototype.decodePoint = function(e, t) { return this.point(_$utils_80.toArray(e, t), 1) }, MontCurve.prototype.point = function(e, t) { return new __Point_70(this, e, t) }, MontCurve.prototype.pointFromJSON = function(e) { return __Point_70.fromJSON(this, e) }, __Point_70.prototype.precompute = function() {}, __Point_70.prototype._encode = function() { return this.getX().toArray("be", this.curve.p.byteLength()) }, __Point_70.fromJSON = function(e, t) { return new __Point_70(e, t[0], t[1] || e.one) }, __Point_70.prototype.inspect = function() { return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">" }, __Point_70.prototype.isInfinity = function() { return 0 === this.z.cmpn(0) }, __Point_70.prototype.dbl = function() { var e = this.x.redAdd(this.z).redSqr(),
            t = this.x.redSub(this.z).redSqr(),
            r = e.redSub(t),
            i = e.redMul(t),
            n = r.redMul(t.redAdd(this.curve.a24.redMul(r))); return this.curve.point(i, n) }, __Point_70.prototype.add = function() { throw new Error("Not supported on Montgomery curve") }, __Point_70.prototype.diffAdd = function(e, t) { var r = this.x.redAdd(this.z),
            i = this.x.redSub(this.z),
            n = e.x.redAdd(e.z),
            s = e.x.redSub(e.z).redMul(r),
            a = n.redMul(i),
            o = t.z.redMul(s.redAdd(a).redSqr()),
            f = t.x.redMul(s.redISub(a).redSqr()); return this.curve.point(o, f) }, __Point_70.prototype.mul = function(e) { for (var t = e.clone(), r = this, i = this.curve.point(null, null), n = []; 0 !== t.cmpn(0); t.iushrn(1)) n.push(t.andln(1)); for (var s = n.length - 1; s >= 0; s--) 0 === n[s] ? (r = r.diffAdd(i, this), i = i.dbl()) : (i = r.diffAdd(i, this), r = r.dbl()); return i }, __Point_70.prototype.mulAdd = function() { throw new Error("Not supported on Montgomery curve") }, __Point_70.prototype.jumlAdd = function() { throw new Error("Not supported on Montgomery curve") }, __Point_70.prototype.eq = function(e) { return 0 === this.getX().cmp(e.getX()) }, __Point_70.prototype.normalize = function() { return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this }, __Point_70.prototype.getX = function() { return this.normalize(), this.x.fromRed() }; var _$edwards_68 = {};

    function EdwardsCurve(e) { this.twisted = 1 != (0 | e.a), this.mOneA = this.twisted && -1 == (0 | e.a), this.extended = this.mOneA, _$base_67.call(this, "edwards", e), this.a = new _$bn_16(e.a, 16).umod(this.red.m), this.a = this.a.toRed(this.red), this.c = new _$bn_16(e.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new _$bn_16(e.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), this.oneC = 1 == (0 | e.c) }

    function __Point_68(e, t, r, i, n) { _$base_67.BasePoint.call(this, e, "projective"), null === t && null === r && null === i ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new _$bn_16(t, 16), this.y = new _$bn_16(r, 16), this.z = i ? new _$bn_16(i, 16) : this.curve.one, this.t = n && new _$bn_16(n, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm())))) }
    _$utils_80.assert, _$inherits_browser_99(EdwardsCurve, _$base_67), _$edwards_68 = EdwardsCurve, EdwardsCurve.prototype._mulA = function(e) { return this.mOneA ? e.redNeg() : this.a.redMul(e) }, EdwardsCurve.prototype._mulC = function(e) { return this.oneC ? e : this.c.redMul(e) }, EdwardsCurve.prototype.jpoint = function(e, t, r, i) { return this.point(e, t, r, i) }, EdwardsCurve.prototype.pointFromX = function(e, t) {
        (e = new _$bn_16(e, 16)).red || (e = e.toRed(this.red)); var r = e.redSqr(),
            i = this.c2.redSub(this.a.redMul(r)),
            n = this.one.redSub(this.c2.redMul(this.d).redMul(r)),
            s = i.redMul(n.redInvm()),
            a = s.redSqrt(); if (0 !== a.redSqr().redSub(s).cmp(this.zero)) throw new Error("invalid point"); var o = a.fromRed().isOdd(); return (t && !o || !t && o) && (a = a.redNeg()), this.point(e, a) }, EdwardsCurve.prototype.pointFromY = function(e, t) {
        (e = new _$bn_16(e, 16)).red || (e = e.toRed(this.red)); var r = e.redSqr(),
            i = r.redSub(this.c2),
            n = r.redMul(this.d).redMul(this.c2).redSub(this.a),
            s = i.redMul(n.redInvm()); if (0 === s.cmp(this.zero)) { if (t) throw new Error("invalid point"); return this.point(this.zero, e) } var a = s.redSqrt(); if (0 !== a.redSqr().redSub(s).cmp(this.zero)) throw new Error("invalid point"); return a.fromRed().isOdd() !== t && (a = a.redNeg()), this.point(a, e) }, EdwardsCurve.prototype.validate = function(e) { if (e.isInfinity()) return !0;
        e.normalize(); var t = e.x.redSqr(),
            r = e.y.redSqr(),
            i = t.redMul(this.a).redAdd(r),
            n = this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(r))); return 0 === i.cmp(n) }, _$inherits_browser_99(__Point_68, _$base_67.BasePoint), EdwardsCurve.prototype.pointFromJSON = function(e) { return __Point_68.fromJSON(this, e) }, EdwardsCurve.prototype.point = function(e, t, r, i) { return new __Point_68(this, e, t, r, i) }, __Point_68.fromJSON = function(e, t) { return new __Point_68(e, t[0], t[1], t[2]) }, __Point_68.prototype.inspect = function() { return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">" }, __Point_68.prototype.isInfinity = function() { return 0 === this.x.cmpn(0) && (0 === this.y.cmp(this.z) || this.zOne && 0 === this.y.cmp(this.curve.c)) }, __Point_68.prototype._extDbl = function() { var e = this.x.redSqr(),
            t = this.y.redSqr(),
            r = this.z.redSqr();
        r = r.redIAdd(r); var i = this.curve._mulA(e),
            n = this.x.redAdd(this.y).redSqr().redISub(e).redISub(t),
            s = i.redAdd(t),
            a = s.redSub(r),
            o = i.redSub(t),
            f = n.redMul(a),
            c = s.redMul(o),
            u = n.redMul(o),
            h = a.redMul(s); return this.curve.point(f, c, h, u) }, __Point_68.prototype._projDbl = function() { var e, t, r, i = this.x.redAdd(this.y).redSqr(),
            n = this.x.redSqr(),
            s = this.y.redSqr(); if (this.curve.twisted) { var a = (c = this.curve._mulA(n)).redAdd(s); if (this.zOne) e = i.redSub(n).redSub(s).redMul(a.redSub(this.curve.two)), t = a.redMul(c.redSub(s)), r = a.redSqr().redSub(a).redSub(a);
            else { var o = this.z.redSqr(),
                    f = a.redSub(o).redISub(o);
                e = i.redSub(n).redISub(s).redMul(f), t = a.redMul(c.redSub(s)), r = a.redMul(f) } } else { var c = n.redAdd(s);
            o = this.curve._mulC(this.z).redSqr(), f = c.redSub(o).redSub(o), e = this.curve._mulC(i.redISub(c)).redMul(f), t = this.curve._mulC(c).redMul(n.redISub(s)), r = c.redMul(f) } return this.curve.point(e, t, r) }, __Point_68.prototype.dbl = function() { return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl() }, __Point_68.prototype._extAdd = function(e) { var t = this.y.redSub(this.x).redMul(e.y.redSub(e.x)),
            r = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)),
            i = this.t.redMul(this.curve.dd).redMul(e.t),
            n = this.z.redMul(e.z.redAdd(e.z)),
            s = r.redSub(t),
            a = n.redSub(i),
            o = n.redAdd(i),
            f = r.redAdd(t),
            c = s.redMul(a),
            u = o.redMul(f),
            h = s.redMul(f),
            d = a.redMul(o); return this.curve.point(c, u, d, h) }, __Point_68.prototype._projAdd = function(e) { var t, r, i = this.z.redMul(e.z),
            n = i.redSqr(),
            s = this.x.redMul(e.x),
            a = this.y.redMul(e.y),
            o = this.curve.d.redMul(s).redMul(a),
            f = n.redSub(o),
            c = n.redAdd(o),
            u = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(s).redISub(a),
            h = i.redMul(f).redMul(u); return this.curve.twisted ? (t = i.redMul(c).redMul(a.redSub(this.curve._mulA(s))), r = f.redMul(c)) : (t = i.redMul(c).redMul(a.redSub(s)), r = this.curve._mulC(f).redMul(c)), this.curve.point(h, t, r) }, __Point_68.prototype.add = function(e) { return this.isInfinity() ? e : e.isInfinity() ? this : this.curve.extended ? this._extAdd(e) : this._projAdd(e) }, __Point_68.prototype.mul = function(e) { return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e) }, __Point_68.prototype.mulAdd = function(e, t, r) { return this.curve._wnafMulAdd(1, [this, t], [e, r], 2, !1) }, __Point_68.prototype.jmulAdd = function(e, t, r) { return this.curve._wnafMulAdd(1, [this, t], [e, r], 2, !0) }, __Point_68.prototype.normalize = function() { if (this.zOne) return this; var e = this.z.redInvm(); return this.x = this.x.redMul(e), this.y = this.y.redMul(e), this.t && (this.t = this.t.redMul(e)), this.z = this.curve.one, this.zOne = !0, this }, __Point_68.prototype.neg = function() { return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg()) }, __Point_68.prototype.getX = function() { return this.normalize(), this.x.fromRed() }, __Point_68.prototype.getY = function() { return this.normalize(), this.y.fromRed() }, __Point_68.prototype.eq = function(e) { return this === e || 0 === this.getX().cmp(e.getX()) && 0 === this.getY().cmp(e.getY()) }, __Point_68.prototype.eqXToP = function(e) { var t = e.toRed(this.curve.red).redMul(this.z); if (0 === this.x.cmp(t)) return !0; for (var r = e.clone(), i = this.curve.redN.redMul(this.z);;) { if (r.iadd(this.curve.n), r.cmp(this.curve.p) >= 0) return !1; if (t.redIAdd(i), 0 === this.x.cmp(t)) return !0 } }, __Point_68.prototype.toP = __Point_68.prototype.normalize, __Point_68.prototype.mixedAdd = __Point_68.prototype.add; var _$curve_69 = {},
        curve = _$curve_69;
    curve.base = _$base_67, curve.short = _$short_71, curve.mont = _$mont_70, curve.edwards = _$edwards_68; var _$utils_96 = {};

    function isSurrogatePair(e, t) { return 55296 == (64512 & e.charCodeAt(t)) && !(t < 0 || t + 1 >= e.length) && 56320 == (64512 & e.charCodeAt(t + 1)) }

    function htonl(e) { return (e >>> 24 | e >>> 8 & 65280 | e << 8 & 16711680 | (255 & e) << 24) >>> 0 }

    function __zero2_96(e) { return 1 === e.length ? "0" + e : e }

    function zero8(e) { return 7 === e.length ? "0" + e : 6 === e.length ? "00" + e : 5 === e.length ? "000" + e : 4 === e.length ? "0000" + e : 3 === e.length ? "00000" + e : 2 === e.length ? "000000" + e : 1 === e.length ? "0000000" + e : e }
    _$utils_96.inherits = _$inherits_browser_99, _$utils_96.toArray = function(e, t) { if (Array.isArray(e)) return e.slice(); if (!e) return []; var r = []; if ("string" == typeof e)
            if (t) { if ("hex" === t)
                    for ((e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e), n = 0; n < e.length; n += 2) r.push(parseInt(e[n] + e[n + 1], 16)) } else
                for (var i = 0, n = 0; n < e.length; n++) { var s = e.charCodeAt(n);
                    s < 128 ? r[i++] = s : s < 2048 ? (r[i++] = s >> 6 | 192, r[i++] = 63 & s | 128) : isSurrogatePair(e, n) ? (s = 65536 + ((1023 & s) << 10) + (1023 & e.charCodeAt(++n)), r[i++] = s >> 18 | 240, r[i++] = s >> 12 & 63 | 128, r[i++] = s >> 6 & 63 | 128, r[i++] = 63 & s | 128) : (r[i++] = s >> 12 | 224, r[i++] = s >> 6 & 63 | 128, r[i++] = 63 & s | 128) } else
                    for (n = 0; n < e.length; n++) r[n] = 0 | e[n];
        return r }, _$utils_96.toHex = function(e) { for (var t = "", r = 0; r < e.length; r++) t += __zero2_96(e[r].toString(16)); return t }, _$utils_96.htonl = htonl, _$utils_96.toHex32 = function(e, t) { for (var r = "", i = 0; i < e.length; i++) { var n = e[i]; "little" === t && (n = htonl(n)), r += zero8(n.toString(16)) } return r }, _$utils_96.zero2 = __zero2_96, _$utils_96.zero8 = zero8, _$utils_96.join32 = function(e, t, r, i) { for (var n = new Array((r - t) / 4), s = 0, a = t; s < n.length; s++, a += 4) { var o;
            o = "big" === i ? e[a] << 24 | e[a + 1] << 16 | e[a + 2] << 8 | e[a + 3] : e[a + 3] << 24 | e[a + 2] << 16 | e[a + 1] << 8 | e[a], n[s] = o >>> 0 } return n }, _$utils_96.split32 = function(e, t) { for (var r = new Array(4 * e.length), i = 0, n = 0; i < e.length; i++, n += 4) { var s = e[i]; "big" === t ? (r[n] = s >>> 24, r[n + 1] = s >>> 16 & 255, r[n + 2] = s >>> 8 & 255, r[n + 3] = 255 & s) : (r[n + 3] = s >>> 24, r[n + 2] = s >>> 16 & 255, r[n + 1] = s >>> 8 & 255, r[n] = 255 & s) } return r }, _$utils_96.rotr32 = function(e, t) { return e >>> t | e << 32 - t }, _$utils_96.rotl32 = function(e, t) { return e << t | e >>> 32 - t }, _$utils_96.sum32 = function(e, t) { return e + t >>> 0 }, _$utils_96.sum32_3 = function(e, t, r) { return e + t + r >>> 0 }, _$utils_96.sum32_4 = function(e, t, r, i) { return e + t + r + i >>> 0 }, _$utils_96.sum32_5 = function(e, t, r, i, n) { return e + t + r + i + n >>> 0 }, _$utils_96.sum64 = function(e, t, r, i) { var n = e[t],
            s = i + e[t + 1] >>> 0,
            a = (s < i ? 1 : 0) + r + n;
        e[t] = a >>> 0, e[t + 1] = s }, _$utils_96.sum64_hi = function(e, t, r, i) { return (t + i >>> 0 < t ? 1 : 0) + e + r >>> 0 }, _$utils_96.sum64_lo = function(e, t, r, i) { return t + i >>> 0 }, _$utils_96.sum64_4_hi = function(e, t, r, i, n, s, a, o) { var f = 0,
            c = t; return f += (c = c + i >>> 0) < t ? 1 : 0, f += (c = c + s >>> 0) < s ? 1 : 0, e + r + n + a + (f += (c = c + o >>> 0) < o ? 1 : 0) >>> 0 }, _$utils_96.sum64_4_lo = function(e, t, r, i, n, s, a, o) { return t + i + s + o >>> 0 }, _$utils_96.sum64_5_hi = function(e, t, r, i, n, s, a, o, f, c) { var u = 0,
            h = t; return u += (h = h + i >>> 0) < t ? 1 : 0, u += (h = h + s >>> 0) < s ? 1 : 0, u += (h = h + o >>> 0) < o ? 1 : 0, e + r + n + a + f + (u += (h = h + c >>> 0) < c ? 1 : 0) >>> 0 }, _$utils_96.sum64_5_lo = function(e, t, r, i, n, s, a, o, f, c) { return t + i + s + o + c >>> 0 }, _$utils_96.rotr64_hi = function(e, t, r) { return (t << 32 - r | e >>> r) >>> 0 }, _$utils_96.rotr64_lo = function(e, t, r) { return (e << 32 - r | t >>> r) >>> 0 }, _$utils_96.shr64_hi = function(e, t, r) { return e >>> r }, _$utils_96.shr64_lo = function(e, t, r) { return (e << 32 - r | t >>> r) >>> 0 }; var _$common_86 = {};

    function BlockHash() { this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32 }
    _$common_86.BlockHash = BlockHash, BlockHash.prototype.update = function(e, t) { if (e = _$utils_96.toArray(e, t), this.pending ? this.pending = this.pending.concat(e) : this.pending = e, this.pendingTotal += e.length, this.pending.length >= this._delta8) { var r = (e = this.pending).length % this._delta8;
            this.pending = e.slice(e.length - r, e.length), 0 === this.pending.length && (this.pending = null), e = _$utils_96.join32(e, 0, e.length - r, this.endian); for (var i = 0; i < e.length; i += this._delta32) this._update(e, i, i + this._delta32) } return this }, BlockHash.prototype.digest = function(e) { return this.update(this._pad()), this._digest(e) }, BlockHash.prototype._pad = function() { var e = this.pendingTotal,
            t = this._delta8,
            r = t - (e + this.padLength) % t,
            i = new Array(r + this.padLength);
        i[0] = 128; for (var n = 1; n < r; n++) i[n] = 0; if (e <<= 3, "big" === this.endian) { for (var s = 8; s < this.padLength; s++) i[n++] = 0;
            i[n++] = 0, i[n++] = 0, i[n++] = 0, i[n++] = 0, i[n++] = e >>> 24 & 255, i[n++] = e >>> 16 & 255, i[n++] = e >>> 8 & 255, i[n++] = 255 & e } else
            for (i[n++] = 255 & e, i[n++] = e >>> 8 & 255, i[n++] = e >>> 16 & 255, i[n++] = e >>> 24 & 255, i[n++] = 0, i[n++] = 0, i[n++] = 0, i[n++] = 0, s = 8; s < this.padLength; s++) i[n++] = 0; return i }; var _$common_95 = {},
        rotr32 = _$utils_96.rotr32;

    function ch32(e, t, r) { return e & t ^ ~e & r }

    function maj32(e, t, r) { return e & t ^ e & r ^ t & r }

    function p32(e, t, r) { return e ^ t ^ r }
    _$common_95.ft_1 = function(e, t, r, i) { return 0 === e ? ch32(t, r, i) : 1 === e || 3 === e ? p32(t, r, i) : 2 === e ? maj32(t, r, i) : void 0 }, _$common_95.ch32 = ch32, _$common_95.maj32 = maj32, _$common_95.s0_256 = function(e) { return rotr32(e, 2) ^ rotr32(e, 13) ^ rotr32(e, 22) }, _$common_95.s1_256 = function(e) { return rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25) }, _$common_95.g0_256 = function(e) { return rotr32(e, 7) ^ rotr32(e, 18) ^ e >>> 3 }, _$common_95.g1_256 = function(e) { return rotr32(e, 17) ^ rotr32(e, 19) ^ e >>> 10 }; var _$1_90 = {},
        rotl32 = _$utils_96.rotl32,
        sum32 = _$utils_96.sum32,
        sum32_5 = _$utils_96.sum32_5,
        ft_1 = _$common_95.ft_1,
        __BlockHash_90 = _$common_86.BlockHash,
        sha1_K = [1518500249, 1859775393, 2400959708, 3395469782];

    function SHA1() { if (!(this instanceof SHA1)) return new SHA1;
        __BlockHash_90.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.W = new Array(80) }
    _$utils_96.inherits(SHA1, __BlockHash_90), _$1_90 = SHA1, SHA1.blockSize = 512, SHA1.outSize = 160, SHA1.hmacStrength = 80, SHA1.padLength = 64, SHA1.prototype._update = function(e, t) { for (var r = this.W, i = 0; i < 16; i++) r[i] = e[t + i]; for (; i < r.length; i++) r[i] = rotl32(r[i - 3] ^ r[i - 8] ^ r[i - 14] ^ r[i - 16], 1); var n = this.h[0],
            s = this.h[1],
            a = this.h[2],
            o = this.h[3],
            f = this.h[4]; for (i = 0; i < r.length; i++) { var c = ~~(i / 20),
                u = sum32_5(rotl32(n, 5), ft_1(c, s, a, o), f, r[i], sha1_K[c]);
            f = o, o = a, a = rotl32(s, 30), s = n, n = u }
        this.h[0] = sum32(this.h[0], n), this.h[1] = sum32(this.h[1], s), this.h[2] = sum32(this.h[2], a), this.h[3] = sum32(this.h[3], o), this.h[4] = sum32(this.h[4], f) }, SHA1.prototype._digest = function(e) { return "hex" === e ? _$utils_96.toHex32(this.h, "big") : _$utils_96.split32(this.h, "big") }; var _$256_92 = {},
        __sum32_92 = _$utils_96.sum32,
        sum32_4 = _$utils_96.sum32_4,
        __sum32_5_92 = _$utils_96.sum32_5,
        __ch32_92 = _$common_95.ch32,
        __maj32_92 = _$common_95.maj32,
        s0_256 = _$common_95.s0_256,
        s1_256 = _$common_95.s1_256,
        g0_256 = _$common_95.g0_256,
        g1_256 = _$common_95.g1_256,
        __BlockHash_92 = _$common_86.BlockHash,
        sha256_K = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];

    function SHA256() { if (!(this instanceof SHA256)) return new SHA256;
        __BlockHash_92.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = sha256_K, this.W = new Array(64) }
    _$utils_96.inherits(SHA256, __BlockHash_92), _$256_92 = SHA256, SHA256.blockSize = 512, SHA256.outSize = 256, SHA256.hmacStrength = 192, SHA256.padLength = 64, SHA256.prototype._update = function(e, t) { for (var r = this.W, i = 0; i < 16; i++) r[i] = e[t + i]; for (; i < r.length; i++) r[i] = sum32_4(g1_256(r[i - 2]), r[i - 7], g0_256(r[i - 15]), r[i - 16]); var n = this.h[0],
            s = this.h[1],
            a = this.h[2],
            o = this.h[3],
            f = this.h[4],
            c = this.h[5],
            u = this.h[6],
            h = this.h[7]; for (i = 0; i < r.length; i++) { var d = __sum32_5_92(h, s1_256(f), __ch32_92(f, c, u), this.k[i], r[i]),
                l = __sum32_92(s0_256(n), __maj32_92(n, s, a));
            h = u, u = c, c = f, f = __sum32_92(o, d), o = a, a = s, s = n, n = __sum32_92(d, l) }
        this.h[0] = __sum32_92(this.h[0], n), this.h[1] = __sum32_92(this.h[1], s), this.h[2] = __sum32_92(this.h[2], a), this.h[3] = __sum32_92(this.h[3], o), this.h[4] = __sum32_92(this.h[4], f), this.h[5] = __sum32_92(this.h[5], c), this.h[6] = __sum32_92(this.h[6], u), this.h[7] = __sum32_92(this.h[7], h) }, SHA256.prototype._digest = function(e) { return "hex" === e ? _$utils_96.toHex32(this.h, "big") : _$utils_96.split32(this.h, "big") }; var _$224_91 = {};

    function SHA224() { if (!(this instanceof SHA224)) return new SHA224;
        _$256_92.call(this), this.h = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428] }
    _$utils_96.inherits(SHA224, _$256_92), _$224_91 = SHA224, SHA224.blockSize = 512, SHA224.outSize = 224, SHA224.hmacStrength = 192, SHA224.padLength = 64, SHA224.prototype._digest = function(e) { return "hex" === e ? _$utils_96.toHex32(this.h.slice(0, 7), "big") : _$utils_96.split32(this.h.slice(0, 7), "big") }; var _$512_94 = {},
        rotr64_hi = _$utils_96.rotr64_hi,
        rotr64_lo = _$utils_96.rotr64_lo,
        shr64_hi = _$utils_96.shr64_hi,
        shr64_lo = _$utils_96.shr64_lo,
        sum64 = _$utils_96.sum64,
        sum64_hi = _$utils_96.sum64_hi,
        sum64_lo = _$utils_96.sum64_lo,
        sum64_4_hi = _$utils_96.sum64_4_hi,
        sum64_4_lo = _$utils_96.sum64_4_lo,
        sum64_5_hi = _$utils_96.sum64_5_hi,
        sum64_5_lo = _$utils_96.sum64_5_lo,
        __BlockHash_94 = _$common_86.BlockHash,
        sha512_K = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];

    function __SHA512_94() { if (!(this instanceof __SHA512_94)) return new __SHA512_94;
        __BlockHash_94.call(this), this.h = [1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209], this.k = sha512_K, this.W = new Array(160) }

    function ch64_hi(e, t, r, i, n) { var s = e & r ^ ~e & n; return s < 0 && (s += 4294967296), s }

    function ch64_lo(e, t, r, i, n, s) { var a = t & i ^ ~t & s; return a < 0 && (a += 4294967296), a }

    function maj64_hi(e, t, r, i, n) { var s = e & r ^ e & n ^ r & n; return s < 0 && (s += 4294967296), s }

    function maj64_lo(e, t, r, i, n, s) { var a = t & i ^ t & s ^ i & s; return a < 0 && (a += 4294967296), a }

    function s0_512_hi(e, t) { var r = rotr64_hi(e, t, 28) ^ rotr64_hi(t, e, 2) ^ rotr64_hi(t, e, 7); return r < 0 && (r += 4294967296), r }

    function s0_512_lo(e, t) { var r = rotr64_lo(e, t, 28) ^ rotr64_lo(t, e, 2) ^ rotr64_lo(t, e, 7); return r < 0 && (r += 4294967296), r }

    function s1_512_hi(e, t) { var r = rotr64_hi(e, t, 14) ^ rotr64_hi(e, t, 18) ^ rotr64_hi(t, e, 9); return r < 0 && (r += 4294967296), r }

    function s1_512_lo(e, t) { var r = rotr64_lo(e, t, 14) ^ rotr64_lo(e, t, 18) ^ rotr64_lo(t, e, 9); return r < 0 && (r += 4294967296), r }

    function g0_512_hi(e, t) { var r = rotr64_hi(e, t, 1) ^ rotr64_hi(e, t, 8) ^ shr64_hi(e, t, 7); return r < 0 && (r += 4294967296), r }

    function g0_512_lo(e, t) { var r = rotr64_lo(e, t, 1) ^ rotr64_lo(e, t, 8) ^ shr64_lo(e, t, 7); return r < 0 && (r += 4294967296), r }

    function g1_512_hi(e, t) { var r = rotr64_hi(e, t, 19) ^ rotr64_hi(t, e, 29) ^ shr64_hi(e, t, 6); return r < 0 && (r += 4294967296), r }

    function g1_512_lo(e, t) { var r = rotr64_lo(e, t, 19) ^ rotr64_lo(t, e, 29) ^ shr64_lo(e, t, 6); return r < 0 && (r += 4294967296), r }
    _$utils_96.inherits(__SHA512_94, __BlockHash_94), _$512_94 = __SHA512_94, __SHA512_94.blockSize = 1024, __SHA512_94.outSize = 512, __SHA512_94.hmacStrength = 192, __SHA512_94.padLength = 128, __SHA512_94.prototype._prepareBlock = function(e, t) { for (var r = this.W, i = 0; i < 32; i++) r[i] = e[t + i]; for (; i < r.length; i += 2) { var n = g1_512_hi(r[i - 4], r[i - 3]),
                s = g1_512_lo(r[i - 4], r[i - 3]),
                a = r[i - 14],
                o = r[i - 13],
                f = g0_512_hi(r[i - 30], r[i - 29]),
                c = g0_512_lo(r[i - 30], r[i - 29]),
                u = r[i - 32],
                h = r[i - 31];
            r[i] = sum64_4_hi(n, s, a, o, f, c, u, h), r[i + 1] = sum64_4_lo(n, s, a, o, f, c, u, h) } }, __SHA512_94.prototype._update = function(e, t) { this._prepareBlock(e, t); for (var r = this.W, i = this.h[0], n = this.h[1], s = this.h[2], a = this.h[3], o = this.h[4], f = this.h[5], c = this.h[6], u = this.h[7], h = this.h[8], d = this.h[9], l = this.h[10], _ = this.h[11], p = this.h[12], b = this.h[13], m = this.h[14], g = this.h[15], y = 0; y < r.length; y += 2) { var v = m,
                w = g,
                $ = s1_512_hi(h, d),
                S = s1_512_lo(h, d),
                B = ch64_hi(h, d, l, _, p),
                E = ch64_lo(h, d, l, _, p, b),
                M = this.k[y],
                k = this.k[y + 1],
                A = r[y],
                P = r[y + 1],
                x = sum64_5_hi(v, w, $, S, B, E, M, k, A, P),
                I = sum64_5_lo(v, w, $, S, B, E, M, k, A, P);
            v = s0_512_hi(i, n), w = s0_512_lo(i, n), $ = maj64_hi(i, n, s, a, o), S = maj64_lo(i, n, s, a, o, f); var C = sum64_hi(v, w, $, S),
                R = sum64_lo(v, w, $, S);
            m = p, g = b, p = l, b = _, l = h, _ = d, h = sum64_hi(c, u, x, I), d = sum64_lo(u, u, x, I), c = o, u = f, o = s, f = a, s = i, a = n, i = sum64_hi(x, I, C, R), n = sum64_lo(x, I, C, R) }
        sum64(this.h, 0, i, n), sum64(this.h, 2, s, a), sum64(this.h, 4, o, f), sum64(this.h, 6, c, u), sum64(this.h, 8, h, d), sum64(this.h, 10, l, _), sum64(this.h, 12, p, b), sum64(this.h, 14, m, g) }, __SHA512_94.prototype._digest = function(e) { return "hex" === e ? _$utils_96.toHex32(this.h, "big") : _$utils_96.split32(this.h, "big") }; var _$384_93 = {};

    function SHA384() { if (!(this instanceof SHA384)) return new SHA384;
        _$512_94.call(this), this.h = [3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428] }
    _$utils_96.inherits(SHA384, _$512_94), _$384_93 = SHA384, SHA384.blockSize = 1024, SHA384.outSize = 384, SHA384.hmacStrength = 192, SHA384.padLength = 128, SHA384.prototype._digest = function(e) { return "hex" === e ? _$utils_96.toHex32(this.h.slice(0, 12), "big") : _$utils_96.split32(this.h.slice(0, 12), "big") }; var _$sha_89 = {};
    _$sha_89.sha1 = _$1_90, _$sha_89.sha224 = _$224_91, _$sha_89.sha256 = _$256_92, _$sha_89.sha384 = _$384_93, _$sha_89.sha512 = _$512_94; var _$ripemd_88 = {},
        __rotl32_88 = _$utils_96.rotl32,
        __sum32_88 = _$utils_96.sum32,
        sum32_3 = _$utils_96.sum32_3,
        __sum32_4_88 = _$utils_96.sum32_4,
        __BlockHash_88 = _$common_86.BlockHash;

    function __RIPEMD160_88() { if (!(this instanceof __RIPEMD160_88)) return new __RIPEMD160_88;
        __BlockHash_88.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little" }

    function f(e, t, r, i) { return e <= 15 ? t ^ r ^ i : e <= 31 ? t & r | ~t & i : e <= 47 ? (t | ~r) ^ i : e <= 63 ? t & i | r & ~i : t ^ (r | ~i) }

    function __K_88(e) { return e <= 15 ? 0 : e <= 31 ? 1518500249 : e <= 47 ? 1859775393 : e <= 63 ? 2400959708 : 2840853838 }

    function Kh(e) { return e <= 15 ? 1352829926 : e <= 31 ? 1548603684 : e <= 47 ? 1836072691 : e <= 63 ? 2053994217 : 0 }
    _$utils_96.inherits(__RIPEMD160_88, __BlockHash_88), _$ripemd_88.ripemd160 = __RIPEMD160_88, __RIPEMD160_88.blockSize = 512, __RIPEMD160_88.outSize = 160, __RIPEMD160_88.hmacStrength = 192, __RIPEMD160_88.padLength = 64, __RIPEMD160_88.prototype._update = function(e, t) { for (var r = this.h[0], i = this.h[1], n = this.h[2], a = this.h[3], o = this.h[4], c = r, u = i, h = n, d = a, l = o, _ = 0; _ < 80; _++) { var p = __sum32_88(__rotl32_88(__sum32_4_88(r, f(_, i, n, a), e[__r_88[_] + t], __K_88(_)), s[_]), o);
            r = o, o = a, a = __rotl32_88(n, 10), n = i, i = p, p = __sum32_88(__rotl32_88(__sum32_4_88(c, f(79 - _, u, h, d), e[rh[_] + t], Kh(_)), sh[_]), l), c = l, l = d, d = __rotl32_88(h, 10), h = u, u = p }
        p = sum32_3(this.h[1], n, d), this.h[1] = sum32_3(this.h[2], a, l), this.h[2] = sum32_3(this.h[3], o, c), this.h[3] = sum32_3(this.h[4], r, u), this.h[4] = sum32_3(this.h[0], i, h), this.h[0] = p }, __RIPEMD160_88.prototype._digest = function(e) { return "hex" === e ? _$utils_96.toHex32(this.h, "little") : _$utils_96.split32(this.h, "little") }; var __r_88 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13],
        rh = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11],
        s = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6],
        sh = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11],
        _$hmac_87 = {};

    function __Hmac_87(e, t, r) { if (!(this instanceof __Hmac_87)) return new __Hmac_87(e, t, r);
        this.Hash = e, this.blockSize = e.blockSize / 8, this.outSize = e.outSize / 8, this.inner = null, this.outer = null, this._init(_$utils_96.toArray(t, r)) }
    _$hmac_87 = __Hmac_87, __Hmac_87.prototype._init = function(e) { e.length > this.blockSize && (e = (new this.Hash).update(e).digest()); for (var t = e.length; t < this.blockSize; t++) e.push(0); for (t = 0; t < e.length; t++) e[t] ^= 54; for (this.inner = (new this.Hash).update(e), t = 0; t < e.length; t++) e[t] ^= 106;
        this.outer = (new this.Hash).update(e) }, __Hmac_87.prototype.update = function(e, t) { return this.inner.update(e, t), this }, __Hmac_87.prototype.digest = function(e) { return this.outer.update(this.inner.digest()), this.outer.digest(e) }; var _$hash_85 = {},
        hash = _$hash_85;
    hash.utils = _$utils_96, hash.common = _$common_86, hash.sha = _$sha_89, hash.ripemd = _$ripemd_88, hash.hmac = _$hmac_87, hash.sha1 = hash.sha.sha1, hash.sha256 = hash.sha.sha256, hash.sha224 = hash.sha.sha224, hash.sha384 = hash.sha.sha384, hash.sha512 = hash.sha.sha512, hash.ripemd160 = hash.ripemd.ripemd160; var _$secp256k1_79 = { doubles: { step: 4, points: [
                    ["e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a", "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"],
                    ["8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508", "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"],
                    ["175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739", "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"],
                    ["363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640", "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"],
                    ["8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c", "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"],
                    ["723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda", "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"],
                    ["eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa", "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"],
                    ["100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0", "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"],
                    ["e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d", "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"],
                    ["feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d", "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"],
                    ["da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1", "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"],
                    ["53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0", "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"],
                    ["8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047", "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"],
                    ["385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862", "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"],
                    ["6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7", "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"],
                    ["3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd", "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"],
                    ["85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83", "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"],
                    ["948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a", "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"],
                    ["6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8", "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"],
                    ["e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d", "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"],
                    ["e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725", "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"],
                    ["213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754", "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"],
                    ["4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c", "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"],
                    ["fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6", "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"],
                    ["76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39", "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"],
                    ["c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891", "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"],
                    ["d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b", "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"],
                    ["b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03", "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"],
                    ["e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d", "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"],
                    ["a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070", "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"],
                    ["90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4", "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"],
                    ["8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"],
                    ["e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11", "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"],
                    ["8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e", "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"],
                    ["e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41", "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"],
                    ["b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef", "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"],
                    ["d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8", "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"],
                    ["324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d", "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"],
                    ["4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96", "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"],
                    ["9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd", "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"],
                    ["6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5", "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"],
                    ["a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266", "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"],
                    ["7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71", "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"],
                    ["928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac", "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"],
                    ["85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751", "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"],
                    ["ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e", "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"],
                    ["827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241", "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"],
                    ["eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3", "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"],
                    ["e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f", "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"],
                    ["1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19", "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"],
                    ["146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be", "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"],
                    ["fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9", "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"],
                    ["da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2", "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"],
                    ["a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13", "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"],
                    ["174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c", "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"],
                    ["959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba", "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"],
                    ["d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151", "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"],
                    ["64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073", "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"],
                    ["8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458", "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"],
                    ["13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b", "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"],
                    ["bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366", "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"],
                    ["8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa", "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"],
                    ["8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0", "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"],
                    ["dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787", "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"],
                    ["f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e", "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"]
                ] }, naf: { wnd: 7, points: [
                    ["f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9", "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"],
                    ["2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4", "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"],
                    ["5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"],
                    ["acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe", "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"],
                    ["774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb", "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"],
                    ["f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8", "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"],
                    ["d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e", "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"],
                    ["defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34", "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"],
                    ["2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c", "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"],
                    ["352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5", "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"],
                    ["2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f", "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"],
                    ["9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714", "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"],
                    ["daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729", "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"],
                    ["c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db", "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"],
                    ["6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4", "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"],
                    ["1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5", "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"],
                    ["605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479", "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"],
                    ["62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d", "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"],
                    ["80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f", "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"],
                    ["7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb", "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"],
                    ["d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9", "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"],
                    ["49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963", "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"],
                    ["77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74", "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"],
                    ["f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530", "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"],
                    ["463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b", "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"],
                    ["f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247", "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"],
                    ["caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1", "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"],
                    ["2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120", "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"],
                    ["7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435", "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"],
                    ["754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18", "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"],
                    ["e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8", "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"],
                    ["186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb", "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"],
                    ["df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f", "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"],
                    ["5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143", "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"],
                    ["290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba", "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"],
                    ["af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45", "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"],
                    ["766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a", "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"],
                    ["59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e", "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"],
                    ["f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8", "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"],
                    ["7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c", "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"],
                    ["948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519", "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"],
                    ["7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab", "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"],
                    ["3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca", "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"],
                    ["d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf", "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"],
                    ["1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610", "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"],
                    ["733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4", "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"],
                    ["15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c", "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"],
                    ["a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940", "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"],
                    ["e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980", "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"],
                    ["311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3", "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"],
                    ["34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf", "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"],
                    ["f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63", "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"],
                    ["d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448", "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"],
                    ["32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf", "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"],
                    ["7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5", "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"],
                    ["ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6", "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"],
                    ["16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5", "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"],
                    ["eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99", "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"],
                    ["78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51", "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"],
                    ["494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5", "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"],
                    ["a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5", "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"],
                    ["c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997", "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"],
                    ["841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881", "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"],
                    ["5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5", "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"],
                    ["36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66", "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"],
                    ["336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726", "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"],
                    ["8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede", "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"],
                    ["1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94", "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"],
                    ["85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31", "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"],
                    ["29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51", "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"],
                    ["a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252", "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"],
                    ["4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5", "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"],
                    ["d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b", "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"],
                    ["ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4", "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"],
                    ["af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f", "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"],
                    ["e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889", "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"],
                    ["591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246", "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"],
                    ["11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984", "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"],
                    ["3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a", "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"],
                    ["cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030", "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"],
                    ["c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197", "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"],
                    ["c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593", "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"],
                    ["a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef", "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"],
                    ["347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38", "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"],
                    ["da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a", "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"],
                    ["c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111", "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"],
                    ["4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502", "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"],
                    ["3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea", "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"],
                    ["cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26", "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"],
                    ["b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986", "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"],
                    ["d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e", "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"],
                    ["48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4", "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"],
                    ["dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda", "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"],
                    ["6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859", "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"],
                    ["e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f", "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"],
                    ["eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c", "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"],
                    ["13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942", "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"],
                    ["ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a", "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"],
                    ["b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80", "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"],
                    ["ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d", "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"],
                    ["8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1", "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"],
                    ["52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63", "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"],
                    ["e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352", "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"],
                    ["7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193", "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"],
                    ["5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00", "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"],
                    ["32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58", "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"],
                    ["e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7", "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"],
                    ["8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8", "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"],
                    ["4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e", "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"],
                    ["3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d", "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"],
                    ["674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b", "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"],
                    ["d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f", "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"],
                    ["30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6", "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"],
                    ["be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297", "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"],
                    ["93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a", "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"],
                    ["b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c", "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"],
                    ["d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52", "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"],
                    ["d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb", "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"],
                    ["463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065", "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"],
                    ["7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917", "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"],
                    ["74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9", "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"],
                    ["30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3", "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"],
                    ["9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57", "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"],
                    ["176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66", "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"],
                    ["75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8", "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"],
                    ["809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721", "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"],
                    ["1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180", "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"]
                ] } },
        _$curves_72 = {},
        pre, curves = _$curves_72;

    function PresetCurve(e) { "short" === e.type ? this.curve = new _$curve_69.short(e) : "edwards" === e.type ? this.curve = new _$curve_69.edwards(e) : this.curve = new _$curve_69.mont(e), this.g = this.curve.g, this.n = this.curve.n, this.hash = e.hash }

    function defineCurve(e, t) { Object.defineProperty(curves, e, { configurable: !0, enumerable: !0, get: function() { var r = new PresetCurve(t); return Object.defineProperty(curves, e, { configurable: !0, enumerable: !0, value: r }), r } }) }
    _$utils_80.assert, curves.PresetCurve = PresetCurve, defineCurve("p192", { type: "short", prime: "p192", p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff", a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc", b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1", n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831", hash: _$hash_85.sha256, gRed: !1, g: ["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"] }), defineCurve("p224", { type: "short", prime: "p224", p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001", a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe", b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4", n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d", hash: _$hash_85.sha256, gRed: !1, g: ["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"] }), defineCurve("p256", { type: "short", prime: null, p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff", a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc", b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b", n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551", hash: _$hash_85.sha256, gRed: !1, g: ["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"] }), defineCurve("p384", { type: "short", prime: null, p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff", a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc", b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef", n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973", hash: _$hash_85.sha384, gRed: !1, g: ["aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"] }), defineCurve("p521", { type: "short", prime: null, p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff", a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc", b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00", n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409", hash: _$hash_85.sha512, gRed: !1, g: ["000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"] }), defineCurve("curve25519", { type: "mont", prime: "p25519", p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed", a: "76d06", b: "1", n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed", hash: _$hash_85.sha256, gRed: !1, g: ["9"] }), defineCurve("ed25519", { type: "edwards", prime: "p25519", p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed", a: "-1", c: "1", d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3", n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed", hash: _$hash_85.sha256, gRed: !1, g: ["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658"] }); try { pre = _$secp256k1_79 } catch (e) { pre = void 0 }
    defineCurve("secp256k1", { type: "short", prime: "k256", p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f", a: "0", b: "7", n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141", h: "1", hash: _$hash_85.sha256, beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee", lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72", basis: [{ a: "3086d221a7d46bcde86c90e49284eb15", b: "-e4437ed6010e88286f547fa90abfe4c3" }, { a: "114ca50f7a8e2f3f657c1108d9d44cfd8", b: "3086d221a7d46bcde86c90e49284eb15" }], gRed: !1, g: ["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", pre] }); var _$hmacDrbg_97 = {};

    function HmacDRBG(e) { if (!(this instanceof HmacDRBG)) return new HmacDRBG(e);
        this.hash = e.hash, this.predResist = !!e.predResist, this.outLen = this.hash.outSize, this.minEntropy = e.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null; var t = _$utils_105.toArray(e.entropy, e.entropyEnc || "hex"),
            r = _$utils_105.toArray(e.nonce, e.nonceEnc || "hex"),
            i = _$utils_105.toArray(e.pers, e.persEnc || "hex");
        this._init(t, r, i) }
    _$hmacDrbg_97 = HmacDRBG, HmacDRBG.prototype._init = function(e, t, r) { var i = e.concat(t).concat(r);
        this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8); for (var n = 0; n < this.V.length; n++) this.K[n] = 0, this.V[n] = 1;
        this._update(i), this._reseed = 1, this.reseedInterval = 281474976710656 }, HmacDRBG.prototype._hmac = function() { return new _$hash_85.hmac(this.hash, this.K) }, HmacDRBG.prototype._update = function(e) { var t = this._hmac().update(this.V).update([0]);
        e && (t = t.update(e)), this.K = t.digest(), this.V = this._hmac().update(this.V).digest(), e && (this.K = this._hmac().update(this.V).update([1]).update(e).digest(), this.V = this._hmac().update(this.V).digest()) }, HmacDRBG.prototype.reseed = function(e, t, r, i) { "string" != typeof t && (i = r, r = t, t = null), e = _$utils_105.toArray(e, t), r = _$utils_105.toArray(r, i), this._update(e.concat(r || [])), this._reseed = 1 }, HmacDRBG.prototype.generate = function(e, t, r, i) { if (this._reseed > this.reseedInterval) throw new Error("Reseed is required"); "string" != typeof t && (i = r, r = t, t = null), r && (r = _$utils_105.toArray(r, i || "hex"), this._update(r)); for (var n = []; n.length < e;) this.V = this._hmac().update(this.V).digest(), n = n.concat(this.V); var s = n.slice(0, e); return this._update(r), this._reseed++, _$utils_105.encode(s, t) }; var _$key_74 = {};

    function KeyPair(e, t) { this.ec = e, this.priv = null, this.pub = null, t.priv && this._importPrivate(t.priv, t.privEnc), t.pub && this._importPublic(t.pub, t.pubEnc) }
    _$utils_80.assert, _$key_74 = KeyPair, KeyPair.fromPublic = function(e, t, r) { return t instanceof KeyPair ? t : new KeyPair(e, { pub: t, pubEnc: r }) }, KeyPair.fromPrivate = function(e, t, r) { return t instanceof KeyPair ? t : new KeyPair(e, { priv: t, privEnc: r }) }, KeyPair.prototype.validate = function() { var e = this.getPublic(); return e.isInfinity() ? { result: !1, reason: "Invalid public key" } : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? { result: !0, reason: null } : { result: !1, reason: "Public key * N != O" } : { result: !1, reason: "Public key is not a point" } }, KeyPair.prototype.getPublic = function(e, t) { return "string" == typeof e && (t = e, e = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), t ? this.pub.encode(t, e) : this.pub }, KeyPair.prototype.getPrivate = function(e) { return "hex" === e ? this.priv.toString(16, 2) : this.priv }, KeyPair.prototype._importPrivate = function(e, t) { this.priv = new _$bn_16(e, t || 16), this.priv = this.priv.umod(this.ec.curve.n) }, KeyPair.prototype._importPublic = function(e, t) { if (e.x || e.y) return "mont" === this.ec.curve.type || "short" === this.ec.curve.type || this.ec.curve.type, void(this.pub = this.ec.curve.point(e.x, e.y));
        this.pub = this.ec.curve.decodePoint(e, t) }, KeyPair.prototype.derive = function(e) { return e.mul(this.priv).getX() }, KeyPair.prototype.sign = function(e, t, r) { return this.ec.sign(e, this, t, r) }, KeyPair.prototype.verify = function(e, t) { return this.ec.verify(e, t, this) }, KeyPair.prototype.inspect = function() { return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >" }; var _$signature_75 = {};

    function Signature(e, t) { if (e instanceof Signature) return e;
        this._importDER(e, t) || (this.r = new _$bn_16(e.r, 16), this.s = new _$bn_16(e.s, 16), void 0 === e.recoveryParam ? this.recoveryParam = null : this.recoveryParam = e.recoveryParam) }

    function Position() { this.place = 0 }

    function getLength(e, t) { var r = e[t.place++]; if (!(128 & r)) return r; for (var i = 15 & r, n = 0, s = 0, a = t.place; s < i; s++, a++) n <<= 8, n |= e[a]; return t.place = a, n }

    function rmPadding(e) { for (var t = 0, r = e.length - 1; !e[t] && !(128 & e[t + 1]) && t < r;) t++; return 0 === t ? e : e.slice(t) }

    function constructLength(e, t) { if (t < 128) e.push(t);
        else { var r = 1 + (Math.log(t) / Math.LN2 >>> 3); for (e.push(128 | r); --r;) e.push(t >>> (r << 3) & 255);
            e.push(t) } }
    _$utils_80.assert, _$signature_75 = Signature, Signature.prototype._importDER = function(e, t) { e = _$utils_80.toArray(e, t); var r = new Position; if (48 !== e[r.place++]) return !1; if (getLength(e, r) + r.place !== e.length) return !1; if (2 !== e[r.place++]) return !1; var i = getLength(e, r),
            n = e.slice(r.place, i + r.place); if (r.place += i, 2 !== e[r.place++]) return !1; var s = getLength(e, r); if (e.length !== s + r.place) return !1; var a = e.slice(r.place, s + r.place); return 0 === n[0] && 128 & n[1] && (n = n.slice(1)), 0 === a[0] && 128 & a[1] && (a = a.slice(1)), this.r = new _$bn_16(n), this.s = new _$bn_16(a), this.recoveryParam = null, !0 }, Signature.prototype.toDER = function(e) { var t = this.r.toArray(),
            r = this.s.toArray(); for (128 & t[0] && (t = [0].concat(t)), 128 & r[0] && (r = [0].concat(r)), t = rmPadding(t), r = rmPadding(r); !(r[0] || 128 & r[1]);) r = r.slice(1); var i = [2];
        constructLength(i, t.length), (i = i.concat(t)).push(2), constructLength(i, r.length); var n = i.concat(r),
            s = [48]; return constructLength(s, n.length), s = s.concat(n), _$utils_80.encode(s, e) }; var _$ec_73 = {},
        __KeyPair_73 = (_$utils_80.assert, _$key_74);

    function EC(e) { if (!(this instanceof EC)) return new EC(e); "string" == typeof e && (e = _$curves_72[e]), e instanceof _$curves_72.PresetCurve && (e = { curve: e }), this.curve = e.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = e.curve.g, this.g.precompute(e.curve.n.bitLength() + 1), this.hash = e.hash || e.curve.hash }
    _$ec_73 = EC, EC.prototype.keyPair = function(e) { return new __KeyPair_73(this, e) }, EC.prototype.keyFromPrivate = function(e, t) { return __KeyPair_73.fromPrivate(this, e, t) }, EC.prototype.keyFromPublic = function(e, t) { return __KeyPair_73.fromPublic(this, e, t) }, EC.prototype.genKeyPair = function(e) { e || (e = {}); for (var t = new _$hmacDrbg_97({ hash: this.hash, pers: e.pers, persEnc: e.persEnc || "utf8", entropy: e.entropy || _$brorand_17(this.hash.hmacStrength), entropyEnc: e.entropy && e.entropyEnc || "utf8", nonce: this.n.toArray() }), r = this.n.byteLength(), i = this.n.sub(new _$bn_16(2));;) { var n = new _$bn_16(t.generate(r)); if (!(n.cmp(i) > 0)) return n.iaddn(1), this.keyFromPrivate(n) } }, EC.prototype._truncateToN = function(e, t) { var r = 8 * e.byteLength() - this.n.bitLength(); return r > 0 && (e = e.ushrn(r)), !t && e.cmp(this.n) >= 0 ? e.sub(this.n) : e }, EC.prototype.sign = function(e, t, r, i) { "object" == typeof r && (i = r, r = null), i || (i = {}), t = this.keyFromPrivate(t, r), e = this._truncateToN(new _$bn_16(e, 16)); for (var n = this.n.byteLength(), s = t.getPrivate().toArray("be", n), a = e.toArray("be", n), o = new _$hmacDrbg_97({ hash: this.hash, entropy: s, nonce: a, pers: i.pers, persEnc: i.persEnc || "utf8" }), f = this.n.sub(new _$bn_16(1)), c = 0;; c++) { var u = i.k ? i.k(c) : new _$bn_16(o.generate(this.n.byteLength())); if (!((u = this._truncateToN(u, !0)).cmpn(1) <= 0 || u.cmp(f) >= 0)) { var h = this.g.mul(u); if (!h.isInfinity()) { var d = h.getX(),
                        l = d.umod(this.n); if (0 !== l.cmpn(0)) { var _ = u.invm(this.n).mul(l.mul(t.getPrivate()).iadd(e)); if (0 !== (_ = _.umod(this.n)).cmpn(0)) { var p = (h.getY().isOdd() ? 1 : 0) | (0 !== d.cmp(l) ? 2 : 0); return i.canonical && _.cmp(this.nh) > 0 && (_ = this.n.sub(_), p ^= 1), new _$signature_75({ r: l, s: _, recoveryParam: p }) } } } } } }, EC.prototype.verify = function(e, t, r, i) { e = this._truncateToN(new _$bn_16(e, 16)), r = this.keyFromPublic(r, i); var n = (t = new _$signature_75(t, "hex")).r,
            s = t.s; if (n.cmpn(1) < 0 || n.cmp(this.n) >= 0) return !1; if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0) return !1; var a, o = s.invm(this.n),
            f = o.mul(e).umod(this.n),
            c = o.mul(n).umod(this.n); return this.curve._maxwellTrick ? !(a = this.g.jmulAdd(f, r.getPublic(), c)).isInfinity() && a.eqXToP(n) : !(a = this.g.mulAdd(f, r.getPublic(), c)).isInfinity() && 0 === a.getX().umod(this.n).cmp(n) }, EC.prototype.recoverPubKey = function(e, t, r, i) { t = new _$signature_75(t, i); var n = this.n,
            s = new _$bn_16(e),
            a = t.r,
            o = t.s,
            f = 1 & r,
            c = r >> 1; if (a.cmp(this.curve.p.umod(this.curve.n)) >= 0 && c) throw new Error("Unable to find sencond key candinate");
        a = c ? this.curve.pointFromX(a.add(this.curve.n), f) : this.curve.pointFromX(a, f); var u = t.r.invm(n),
            h = n.sub(s).mul(u).umod(n),
            d = o.mul(u).umod(n); return this.g.mulAdd(h, a, d) }, EC.prototype.getKeyRecoveryParam = function(e, t, r, i) { if (null !== (t = new _$signature_75(t, i)).recoveryParam) return t.recoveryParam; for (var n = 0; n < 4; n++) { var s; try { s = this.recoverPubKey(e, t, n) } catch (e) { continue } if (s.eq(r)) return n } throw new Error("Unable to find valid recovery factor") }; var _$key_77 = {},
        parseBytes = (_$utils_80.assert, _$utils_80.parseBytes),
        cachedProperty = _$utils_80.cachedProperty;

    function __KeyPair_77(e, t) { this.eddsa = e, this._secret = parseBytes(t.secret), e.isPoint(t.pub) ? this._pub = t.pub : this._pubBytes = parseBytes(t.pub) }
    __KeyPair_77.fromPublic = function(e, t) { return t instanceof __KeyPair_77 ? t : new __KeyPair_77(e, { pub: t }) }, __KeyPair_77.fromSecret = function(e, t) { return t instanceof __KeyPair_77 ? t : new __KeyPair_77(e, { secret: t }) }, __KeyPair_77.prototype.secret = function() { return this._secret }, cachedProperty(__KeyPair_77, "pubBytes", function() { return this.eddsa.encodePoint(this.pub()) }), cachedProperty(__KeyPair_77, "pub", function() { return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv()) }), cachedProperty(__KeyPair_77, "privBytes", function() { var e = this.eddsa,
            t = this.hash(),
            r = e.encodingLength - 1,
            i = t.slice(0, e.encodingLength); return i[0] &= 248, i[r] &= 127, i[r] |= 64, i }), cachedProperty(__KeyPair_77, "priv", function() { return this.eddsa.decodeInt(this.privBytes()) }), cachedProperty(__KeyPair_77, "hash", function() { return this.eddsa.hash().update(this.secret()).digest() }), cachedProperty(__KeyPair_77, "messagePrefix", function() { return this.hash().slice(this.eddsa.encodingLength) }), __KeyPair_77.prototype.sign = function(e) { return this.eddsa.sign(e, this) }, __KeyPair_77.prototype.verify = function(e, t) { return this.eddsa.verify(e, t, this) }, __KeyPair_77.prototype.getSecret = function(e) { return _$utils_80.encode(this.secret(), e) }, __KeyPair_77.prototype.getPublic = function(e) { return _$utils_80.encode(this.pubBytes(), e) }, _$key_77 = __KeyPair_77; var _$signature_78 = {},
        __cachedProperty_78 = (_$utils_80.assert, _$utils_80.cachedProperty),
        __parseBytes_78 = _$utils_80.parseBytes;

    function __Signature_78(e, t) { this.eddsa = e, "object" != typeof t && (t = __parseBytes_78(t)), Array.isArray(t) && (t = { R: t.slice(0, e.encodingLength), S: t.slice(e.encodingLength) }), e.isPoint(t.R) && (this._R = t.R), t.S instanceof _$bn_16 && (this._S = t.S), this._Rencoded = Array.isArray(t.R) ? t.R : t.Rencoded, this._Sencoded = Array.isArray(t.S) ? t.S : t.Sencoded }
    __cachedProperty_78(__Signature_78, "S", function() { return this.eddsa.decodeInt(this.Sencoded()) }), __cachedProperty_78(__Signature_78, "R", function() { return this.eddsa.decodePoint(this.Rencoded()) }), __cachedProperty_78(__Signature_78, "Rencoded", function() { return this.eddsa.encodePoint(this.R()) }), __cachedProperty_78(__Signature_78, "Sencoded", function() { return this.eddsa.encodeInt(this.S()) }), __Signature_78.prototype.toBytes = function() { return this.Rencoded().concat(this.Sencoded()) }, __Signature_78.prototype.toHex = function() { return _$utils_80.encode(this.toBytes(), "hex").toUpperCase() }, _$signature_78 = __Signature_78; var _$eddsa_76 = {},
        __parseBytes_76 = (_$utils_80.assert, _$utils_80.parseBytes);

    function EDDSA(e) { if (!(this instanceof EDDSA)) return new EDDSA(e);
        e = _$curves_72[e].curve, this.curve = e, this.g = e.g, this.g.precompute(e.n.bitLength() + 1), this.pointClass = e.point().constructor, this.encodingLength = Math.ceil(e.n.bitLength() / 8), this.hash = _$hash_85.sha512 }
    _$eddsa_76 = EDDSA, EDDSA.prototype.sign = function(e, t) { e = __parseBytes_76(e); var r = this.keyFromSecret(t),
            i = this.hashInt(r.messagePrefix(), e),
            n = this.g.mul(i),
            s = this.encodePoint(n),
            a = this.hashInt(s, r.pubBytes(), e).mul(r.priv()),
            o = i.add(a).umod(this.curve.n); return this.makeSignature({ R: n, S: o, Rencoded: s }) }, EDDSA.prototype.verify = function(e, t, r) { e = __parseBytes_76(e), t = this.makeSignature(t); var i = this.keyFromPublic(r),
            n = this.hashInt(t.Rencoded(), i.pubBytes(), e),
            s = this.g.mul(t.S()); return t.R().add(i.pub().mul(n)).eq(s) }, EDDSA.prototype.hashInt = function() { for (var e = this.hash(), t = 0; t < arguments.length; t++) e.update(arguments[t]); return _$utils_80.intFromLE(e.digest()).umod(this.curve.n) }, EDDSA.prototype.keyFromPublic = function(e) { return _$key_77.fromPublic(this, e) }, EDDSA.prototype.keyFromSecret = function(e) { return _$key_77.fromSecret(this, e) }, EDDSA.prototype.makeSignature = function(e) { return e instanceof _$signature_78 ? e : new _$signature_78(this, e) }, EDDSA.prototype.encodePoint = function(e) { var t = e.getY().toArray("le", this.encodingLength); return t[this.encodingLength - 1] |= e.getX().isOdd() ? 128 : 0, t }, EDDSA.prototype.decodePoint = function(e) { var t = (e = _$utils_80.parseBytes(e)).length - 1,
            r = e.slice(0, t).concat(-129 & e[t]),
            i = 0 != (128 & e[t]),
            n = _$utils_80.intFromLE(r); return this.curve.pointFromY(n, i) }, EDDSA.prototype.encodeInt = function(e) { return e.toArray("le", this.encodingLength) }, EDDSA.prototype.decodeInt = function(e) { return _$utils_80.intFromLE(e) }, EDDSA.prototype.isPoint = function(e) { return e instanceof this.pointClass }; var _$elliptic_66 = {},
        elliptic = _$elliptic_66;
    elliptic.version = _$package_81.version, elliptic.utils = _$utils_80, elliptic.rand = _$brorand_17, elliptic.curve = _$curve_69, elliptic.curves = _$curves_72, elliptic.ec = _$ec_73, elliptic.eddsa = _$eddsa_76; var _$reporter_6 = {};

    function Reporter(e) { this._reporterState = { obj: null, path: [], options: e || {}, errors: [] } }

    function ReporterError(e, t) { this.path = e, this.rethrow(t) }
    _$reporter_6.Reporter = Reporter, Reporter.prototype.isError = function(e) { return e instanceof ReporterError }, Reporter.prototype.save = function() { var e = this._reporterState; return { obj: e.obj, pathLen: e.path.length } }, Reporter.prototype.restore = function(e) { var t = this._reporterState;
        t.obj = e.obj, t.path = t.path.slice(0, e.pathLen) }, Reporter.prototype.enterKey = function(e) { return this._reporterState.path.push(e) }, Reporter.prototype.exitKey = function(e) { var t = this._reporterState;
        t.path = t.path.slice(0, e - 1) }, Reporter.prototype.leaveKey = function(e, t, r) { var i = this._reporterState;
        this.exitKey(e), null !== i.obj && (i.obj[t] = r) }, Reporter.prototype.path = function() { return this._reporterState.path.join("/") }, Reporter.prototype.enterObject = function() { var e = this._reporterState,
            t = e.obj; return e.obj = {}, t }, Reporter.prototype.leaveObject = function(e) { var t = this._reporterState,
            r = t.obj; return t.obj = e, r }, Reporter.prototype.error = function(e) { var t, r = this._reporterState,
            i = e instanceof ReporterError; if (t = i ? e : new ReporterError(r.path.map(function(e) { return "[" + JSON.stringify(e) + "]" }).join(""), e.message || e, e.stack), !r.options.partial) throw t; return i || r.errors.push(t), t }, Reporter.prototype.wrapResult = function(e) { var t = this._reporterState; return t.options.partial ? { result: this.isError(e) ? null : e, errors: t.errors } : e }, _$inherits_browser_99(ReporterError, Error), ReporterError.prototype.rethrow = function(t) { if (this.message = t + " at: " + (this.path || "(shallow)"), Error.captureStackTrace && Error.captureStackTrace(this, ReporterError), !this.stack) try { throw new Error(this.message) } catch (e) { this.stack = e.stack }
        return this }; var asn = _$asn1_1({}),
        Time = asn.define("Time", function() { this.choice({ utcTime: this.utctime(), generalTime: this.gentime() }) }),
        AttributeTypeValue = asn.define("AttributeTypeValue", function() { this.seq().obj(this.key("type").objid(), this.key("value").any()) }),
        AlgorithmIdentifier = asn.define("AlgorithmIdentifier", function() { this.seq().obj(this.key("algorithm").objid(), this.key("parameters").optional(), this.key("curve").objid().optional()) }),
        SubjectPublicKeyInfo = asn.define("SubjectPublicKeyInfo", function() { this.seq().obj(this.key("algorithm").use(AlgorithmIdentifier), this.key("subjectPublicKey").bitstr()) }),
        RelativeDistinguishedName = asn.define("RelativeDistinguishedName", function() { this.setof(AttributeTypeValue) }),
        RDNSequence = asn.define("RDNSequence", function() { this.seqof(RelativeDistinguishedName) }),
        Name = asn.define("Name", function() { this.choice({ rdnSequence: this.use(RDNSequence) }) }),
        Validity = asn.define("Validity", function() { this.seq().obj(this.key("notBefore").use(Time), this.key("notAfter").use(Time)) }),
        Extension = asn.define("Extension", function() { this.seq().obj(this.key("extnID").objid(), this.key("critical").bool().def(!1), this.key("extnValue").octstr()) }),
        TBSCertificate = asn.define("TBSCertificate", function() { this.seq().obj(this.key("version").explicit(0).int().optional(), this.key("serialNumber").int(), this.key("signature").use(AlgorithmIdentifier), this.key("issuer").use(Name), this.key("validity").use(Validity), this.key("subject").use(Name), this.key("subjectPublicKeyInfo").use(SubjectPublicKeyInfo), this.key("issuerUniqueID").implicit(1).bitstr().optional(), this.key("subjectUniqueID").implicit(2).bitstr().optional(), this.key("extensions").explicit(3).seqof(Extension).optional()) }),
        X509Certificate = asn.define("X509Certificate", function() { this.seq().obj(this.key("tbsCertificate").use(TBSCertificate), this.key("signatureAlgorithm").use(AlgorithmIdentifier), this.key("signatureValue").bitstr()) }),
        _$X509Certificate_108 = X509Certificate,
        _$asn1_107 = {},
        __asn1_107 = _$asn1_1({});
    _$asn1_107.certificate = _$X509Certificate_108; var RSAPrivateKey = __asn1_107.define("RSAPrivateKey", function() { this.seq().obj(this.key("version").int(), this.key("modulus").int(), this.key("publicExponent").int(), this.key("privateExponent").int(), this.key("prime1").int(), this.key("prime2").int(), this.key("exponent1").int(), this.key("exponent2").int(), this.key("coefficient").int()) });
    _$asn1_107.RSAPrivateKey = RSAPrivateKey; var RSAPublicKey = __asn1_107.define("RSAPublicKey", function() { this.seq().obj(this.key("modulus").int(), this.key("publicExponent").int()) });
    _$asn1_107.RSAPublicKey = RSAPublicKey; var PublicKey = __asn1_107.define("SubjectPublicKeyInfo", function() { this.seq().obj(this.key("algorithm").use(__AlgorithmIdentifier_107), this.key("subjectPublicKey").bitstr()) });
    _$asn1_107.PublicKey = PublicKey; var __AlgorithmIdentifier_107 = __asn1_107.define("AlgorithmIdentifier", function() { this.seq().obj(this.key("algorithm").objid(), this.key("none").null_().optional(), this.key("curve").objid().optional(), this.key("params").seq().obj(this.key("p").int(), this.key("q").int(), this.key("g").int()).optional()) }),
        PrivateKeyInfo = __asn1_107.define("PrivateKeyInfo", function() { this.seq().obj(this.key("version").int(), this.key("algorithm").use(__AlgorithmIdentifier_107), this.key("subjectPrivateKey").octstr()) });
    _$asn1_107.PrivateKey = PrivateKeyInfo; var EncryptedPrivateKeyInfo = __asn1_107.define("EncryptedPrivateKeyInfo", function() { this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(), this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(), this.key("kdeparams").seq().obj(this.key("salt").octstr(), this.key("iters").int())), this.key("cipher").seq().obj(this.key("algo").objid(), this.key("iv").octstr()))), this.key("subjectPrivateKey").octstr()) });
    _$asn1_107.EncryptedPrivateKey = EncryptedPrivateKeyInfo; var DSAPrivateKey = __asn1_107.define("DSAPrivateKey", function() { this.seq().obj(this.key("version").int(), this.key("p").int(), this.key("q").int(), this.key("g").int(), this.key("pub_key").int(), this.key("priv_key").int()) });
    _$asn1_107.DSAPrivateKey = DSAPrivateKey, _$asn1_107.DSAparam = __asn1_107.define("DSAparam", function() { this.int() }); var ECPrivateKey = __asn1_107.define("ECPrivateKey", function() { this.seq().obj(this.key("version").int(), this.key("privateKey").octstr(), this.key("parameters").optional().explicit(0).use(ECParameters), this.key("publicKey").optional().explicit(1).bitstr()) });
    _$asn1_107.ECPrivateKey = ECPrivateKey; var ECParameters = __asn1_107.define("ECParameters", function() { this.choice({ namedCurve: this.objid() }) });
    _$asn1_107.signature = __asn1_107.define("signature", function() { this.seq().obj(this.key("r").int(), this.key("s").int()) }); var _$aesid_106 = { "2.16.840.1.101.3.4.1.1": "aes-128-ecb", "2.16.840.1.101.3.4.1.2": "aes-128-cbc", "2.16.840.1.101.3.4.1.3": "aes-128-ofb", "2.16.840.1.101.3.4.1.4": "aes-128-cfb", "2.16.840.1.101.3.4.1.21": "aes-192-ecb", "2.16.840.1.101.3.4.1.22": "aes-192-cbc", "2.16.840.1.101.3.4.1.23": "aes-192-ofb", "2.16.840.1.101.3.4.1.24": "aes-192-cfb", "2.16.840.1.101.3.4.1.41": "aes-256-ecb", "2.16.840.1.101.3.4.1.42": "aes-256-cbc", "2.16.840.1.101.3.4.1.43": "aes-256-ofb", "2.16.840.1.101.3.4.1.44": "aes-256-cfb" },
        findProc = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r\+\/\=]+)[\n\r]+/m,
        startRegex = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----/m,
        fullRegex = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----([0-9A-z\n\r\+\/\=]+)-----END \1-----$/m,
        __Buffer_109 = _$safeBuffer_144.Buffer,
        _$fixProc_109 = function(e, t) { var r, i = e.toString(),
                n = i.match(findProc); if (n) { var s = "aes" + n[1],
                    a = __Buffer_109.from(n[2], "hex"),
                    o = __Buffer_109.from(n[3].replace(/[\r\n]/g, ""), "base64"),
                    f = _$evp_bytestokey_83(t, a.slice(0, 8), parseInt(n[1], 10)).key,
                    c = [],
                    u = _$browser_21.createDecipheriv(s, f, a);
                c.push(u.update(o)), c.push(u.final()), r = __Buffer_109.concat(c) } else { var h = i.match(fullRegex);
                r = new __Buffer_109(h[2].replace(/[\r\n]/g, ""), "base64") } return { tag: i.match(startRegex)[1], data: r } },
        _$parseAsn1_110 = {},
        __Buffer_110 = _$safeBuffer_144.Buffer;

    function parseKeys(e) { var t; "object" != typeof e || __Buffer_110.isBuffer(e) || (t = e.passphrase, e = e.key), "string" == typeof e && (e = __Buffer_110.from(e)); var r, i, n = _$fixProc_109(e, t),
            s = n.tag,
            a = n.data; switch (s) {
            case "CERTIFICATE":
                i = _$asn1_107.certificate.decode(a, "der").tbsCertificate.subjectPublicKeyInfo;
            case "PUBLIC KEY":
                switch (i || (i = _$asn1_107.PublicKey.decode(a, "der")), r = i.algorithm.algorithm.join(".")) {
                    case "1.2.840.113549.1.1.1":
                        return _$asn1_107.RSAPublicKey.decode(i.subjectPublicKey.data, "der");
                    case "1.2.840.10045.2.1":
                        return i.subjectPrivateKey = i.subjectPublicKey, { type: "ec", data: i };
                    case "1.2.840.10040.4.1":
                        return i.algorithm.params.pub_key = _$asn1_107.DSAparam.decode(i.subjectPublicKey.data, "der"), { type: "dsa", data: i.algorithm.params };
                    default:
                        throw new Error("unknown key id " + r) } throw new Error("unknown key type " + s);
            case "ENCRYPTED PRIVATE KEY":
                a = function(e, t) { var r = e.algorithm.decrypt.kde.kdeparams.salt,
                        i = parseInt(e.algorithm.decrypt.kde.kdeparams.iters.toString(), 10),
                        n = _$aesid_106[e.algorithm.decrypt.cipher.algo.join(".")],
                        s = e.algorithm.decrypt.cipher.iv,
                        a = e.subjectPrivateKey,
                        o = parseInt(n.split("-")[1], 10) / 8,
                        f = _$browser_111.pbkdf2Sync(t, r, i, o, "sha1"),
                        c = _$browser_21.createDecipheriv(n, f, s),
                        u = []; return u.push(c.update(a)), u.push(c.final()), __Buffer_110.concat(u) }(a = _$asn1_107.EncryptedPrivateKey.decode(a, "der"), t);
            case "PRIVATE KEY":
                switch (r = (i = _$asn1_107.PrivateKey.decode(a, "der")).algorithm.algorithm.join(".")) {
                    case "1.2.840.113549.1.1.1":
                        return _$asn1_107.RSAPrivateKey.decode(i.subjectPrivateKey, "der");
                    case "1.2.840.10045.2.1":
                        return { curve: i.algorithm.curve, privateKey: _$asn1_107.ECPrivateKey.decode(i.subjectPrivateKey, "der").privateKey };
                    case "1.2.840.10040.4.1":
                        return i.algorithm.params.priv_key = _$asn1_107.DSAparam.decode(i.subjectPrivateKey, "der"), { type: "dsa", params: i.algorithm.params };
                    default:
                        throw new Error("unknown key id " + r) } throw new Error("unknown key type " + s);
            case "RSA PUBLIC KEY":
                return _$asn1_107.RSAPublicKey.decode(a, "der");
            case "RSA PRIVATE KEY":
                return _$asn1_107.RSAPrivateKey.decode(a, "der");
            case "DSA PRIVATE KEY":
                return { type: "dsa", params: _$asn1_107.DSAPrivateKey.decode(a, "der") };
            case "EC PRIVATE KEY":
                return { curve: (a = _$asn1_107.ECPrivateKey.decode(a, "der")).parameters.value, privateKey: a.privateKey };
            default:
                throw new Error("unknown key type " + s) } }
    _$parseAsn1_110 = parseKeys, parseKeys.signature = _$asn1_107.signature; var _$curves_42 = { "1.3.132.0.10": "secp256k1", "1.3.132.0.33": "p224", "1.2.840.10045.3.1.1": "p192", "1.2.840.10045.3.1.7": "p256", "1.3.132.0.34": "p384", "1.3.132.0.35": "p521" },
        _$sign_44 = {};
    (function(e) { var t = _$elliptic_66.ec;

        function r(t, r, n, s) { if ((t = new e(t.toArray())).length < r.byteLength()) { var a = new e(r.byteLength() - t.length);
                a.fill(0), t = e.concat([a, t]) } var o = n.length,
                f = function(t, r) { t = (t = i(t, r)).mod(r); var n = new e(t.toArray()); if (n.length < r.byteLength()) { var s = new e(r.byteLength() - n.length);
                        s.fill(0), n = e.concat([s, n]) } return n }(n, r),
                c = new e(o);
            c.fill(1); var u = new e(o); return u.fill(0), u = _$browser_53(s, u).update(c).update(new e([0])).update(t).update(f).digest(), c = _$browser_53(s, u).update(c).digest(), { k: u = _$browser_53(s, u).update(c).update(new e([1])).update(t).update(f).digest(), v: c = _$browser_53(s, u).update(c).digest() } }

        function i(e, t) { var r = new _$bn_16(e),
                i = (e.length << 3) - t.bitLength(); return i > 0 && r.ishrn(i), r }

        function n(t, r, n) { var s, a;
            do { for (s = new e(0); 8 * s.length < t.bitLength();) r.v = _$browser_53(n, r.k).update(r.v).digest(), s = e.concat([s, r.v]);
                a = i(s, t), r.k = _$browser_53(n, r.k).update(r.v).update(new e([0])).digest(), r.v = _$browser_53(n, r.k).update(r.v).digest() } while (-1 !== a.cmp(t)); return a }

        function s(e, t, r, i) { return e.toRed(_$bn_16.mont(r)).redPow(t).fromRed().mod(i) }(_$sign_44 = function(a, o, f, c, u) { var h = _$parseAsn1_110(o); if (h.curve) { if ("ecdsa" !== c && "ecdsa/rsa" !== c) throw new Error("wrong private key type"); return function(r, i) { var n = _$curves_42[i.curve.join(".")]; if (!n) throw new Error("unknown curve " + i.curve.join(".")); var s = new t(n).keyFromPrivate(i.privateKey).sign(r); return new e(s.toDER()) }(a, h) } if ("dsa" === h.type) { if ("dsa" !== c) throw new Error("wrong private key type"); return function(t, a, o) { for (var f, c = a.params.priv_key, u = a.params.p, h = a.params.q, d = a.params.g, l = new _$bn_16(0), _ = i(t, h).mod(h), p = !1, b = r(c, h, t, o); !1 === p;) l = s(d, f = n(h, b, o), u, h), 0 === (p = f.invm(h).imul(_.add(c.mul(l))).mod(h)).cmpn(0) && (p = !1, l = new _$bn_16(0)); return function(t, r) { t = t.toArray(), r = r.toArray(), 128 & t[0] && (t = [0].concat(t)), 128 & r[0] && (r = [0].concat(r)); var i = [48, t.length + r.length + 4, 2, t.length]; return i = i.concat(t, [2, r.length], r), new e(i) }(l, p) }(a, h, f) } if ("rsa" !== c && "ecdsa/rsa" !== c) throw new Error("wrong private key type");
            a = e.concat([u, a]); for (var d = h.modulus.byteLength(), l = [0, 1]; a.length + l.length + 1 < d;) l.push(255);
            l.push(0); for (var _ = -1; ++_ < a.length;) l.push(a[_]); return _$browserifyRsa_39(l, h) }).getKey = r, _$sign_44.makeKey = n }).call(this, _$buffer_47({}).Buffer); var _$verify_45 = {};
    (function(e) { var t = _$elliptic_66.ec;

        function r(e, t) { if (e.cmpn(0) <= 0) throw new Error("invalid sig"); if (e.cmp(t) >= t) throw new Error("invalid sig") }
        _$verify_45 = function(i, n, s, a, o) { var f = _$parseAsn1_110(s); if ("ec" === f.type) { if ("ecdsa" !== a && "ecdsa/rsa" !== a) throw new Error("wrong public key type"); return function(e, r, i) { var n = _$curves_42[i.data.algorithm.curve.join(".")]; if (!n) throw new Error("unknown curve " + i.data.algorithm.curve.join(".")); var s = new t(n),
                        a = i.data.subjectPrivateKey.data; return s.verify(r, e, a) }(i, n, f) } if ("dsa" === f.type) { if ("dsa" !== a) throw new Error("wrong public key type"); return function(e, t, i) { var n = i.data.p,
                        s = i.data.q,
                        a = i.data.g,
                        o = i.data.pub_key,
                        f = _$parseAsn1_110.signature.decode(e, "der"),
                        c = f.s,
                        u = f.r;
                    r(c, s), r(u, s); var h = _$bn_16.mont(n),
                        d = c.invm(s); return 0 === a.toRed(h).redPow(new _$bn_16(t).mul(d).mod(s)).fromRed().mul(o.toRed(h).redPow(u.mul(d).mod(s)).fromRed()).mod(n).mod(s).cmp(u) }(i, n, f) } if ("rsa" !== a && "ecdsa/rsa" !== a) throw new Error("wrong public key type");
            n = e.concat([o, n]); for (var c = f.modulus.byteLength(), u = [1], h = 0; n.length + u.length + 2 < c;) u.push(255), h++;
            u.push(0); for (var d = -1; ++d < n.length;) u.push(n[d]);
            u = new e(u); var l = _$bn_16.mont(f.modulus);
            i = (i = new _$bn_16(i).toRed(l)).redPow(new _$bn_16(f.publicExponent)), i = new e(i.fromRed().toArray()); var _ = h < 8 ? 1 : 0; for (c = Math.min(i.length, u.length), i.length !== u.length && (_ = 1), d = -1; ++d < c;) _ |= i[d] ^ u[d]; return 0 === _ } }).call(this, _$buffer_47({}).Buffer); var _$browser_43 = {};
    (function(e) {
        function t(e) { _$Stream_153.Writable.call(this); var t = _$algorithms_41[e]; if (!t) throw new Error("Unknown message digest");
            this._hashType = t.hash, this._hash = _$browser_51(t.hash), this._tag = t.id, this._signType = t.sign }

        function r(e) { _$Stream_153.Writable.call(this); var t = _$algorithms_41[e]; if (!t) throw new Error("Unknown message digest");
            this._hash = _$browser_51(t.hash), this._tag = t.id, this._signType = t.sign }
        Object.keys(_$algorithms_41).forEach(function(t) { _$algorithms_41[t].id = new e(_$algorithms_41[t].id, "hex"), _$algorithms_41[t.toLowerCase()] = _$algorithms_41[t] }), _$inherits_browser_99(t, _$Stream_153.Writable), t.prototype._write = function(e, t, r) { this._hash.update(e), r() }, t.prototype.update = function(t, r) { return "string" == typeof t && (t = new e(t, r)), this._hash.update(t), this }, t.prototype.sign = function(e, t) { this.end(); var r = this._hash.digest(),
                i = _$sign_44(r, e, this._hashType, this._signType, this._tag); return t ? i.toString(t) : i }, _$inherits_browser_99(r, _$Stream_153.Writable), r.prototype._write = function(e, t, r) { this._hash.update(e), r() }, r.prototype.update = function(t, r) { return "string" == typeof t && (t = new e(t, r)), this._hash.update(t), this }, r.prototype.verify = function(t, r, i) { "string" == typeof r && (r = new e(r, i)), this.end(); var n = this._hash.digest(); return _$verify_45(r, n, t, this._signType, this._tag) }, _$browser_43 = {} }).call(this, _$buffer_47({}).Buffer); var _$browser_50 = {};
    (function(e) { _$browser_50 = function(e) { return new r(e) }; var t = { secp256k1: { name: "secp256k1", byteLength: 32 }, secp224r1: { name: "p224", byteLength: 28 }, prime256v1: { name: "p256", byteLength: 32 }, prime192v1: { name: "p192", byteLength: 24 }, ed25519: { name: "ed25519", byteLength: 32 }, secp384r1: { name: "p384", byteLength: 48 }, secp521r1: { name: "p521", byteLength: 66 } };

        function r(e) { this.curveType = t[e], this.curveType || (this.curveType = { name: e }), this.curve = new _$elliptic_66.ec(this.curveType.name), this.keys = void 0 }

        function i(t, r, i) { Array.isArray(t) || (t = t.toArray()); var n = new e(t); if (i && n.length < i) { var s = new e(i - n.length);
                s.fill(0), n = e.concat([s, n]) } return r ? n.toString(r) : n }
        t.p224 = t.secp224r1, t.p256 = t.secp256r1 = t.prime256v1, t.p192 = t.secp192r1 = t.prime192v1, t.p384 = t.secp384r1, t.p521 = t.secp521r1, r.prototype.generateKeys = function(e, t) { return this.keys = this.curve.genKeyPair(), this.getPublicKey(e, t) }, r.prototype.computeSecret = function(t, r, n) { return r = r || "utf8", e.isBuffer(t) || (t = new e(t, r)), i(this.curve.keyFromPublic(t).getPublic().mul(this.keys.getPrivate()).getX(), n, this.curveType.byteLength) }, r.prototype.getPublicKey = function(e, t) { var r = this.keys.getPublic("compressed" === t, !0); return "hybrid" === t && (r[r.length - 1] % 2 ? r[0] = 7 : r[0] = 6), i(r, e) }, r.prototype.getPrivateKey = function(e) { return i(this.keys.getPrivate(), e) }, r.prototype.setPublicKey = function(t, r) { return r = r || "utf8", e.isBuffer(t) || (t = new e(t, r)), this.keys._importPublic(t), this }, r.prototype.setPrivateKey = function(t, r) { r = r || "utf8", e.isBuffer(t) || (t = new e(t, r)); var i = new _$bn_16(t); return i = i.toString(16), this.keys = this.curve.genKeyPair(), this.keys._importPrivate(i), this } }).call(this, _$buffer_47({}).Buffer); var __Buffer_119 = _$safeBuffer_144.Buffer;

    function i2ops(e) { var t = __Buffer_119.allocUnsafe(4); return t.writeUInt32BE(e, 0), t } var _$mgf_119 = function(e, t) { for (var r, i = __Buffer_119.alloc(0), n = 0; i.length < t;) r = i2ops(n++), i = __Buffer_119.concat([i, _$browser_51("sha1").update(e).update(r).digest()]); return i.slice(0, t) },
        _$xor_123 = function(e, t) { for (var r = e.length, i = -1; ++i < r;) e[i] ^= t[i]; return e },
        __Buffer_122 = _$safeBuffer_144.Buffer,
        _$withPublic_122 = function(e, t) { return __Buffer_122.from(e.toRed(_$bn_16.mont(t.modulus)).redPow(new _$bn_16(t.publicExponent)).fromRed().toArray()) },
        __Buffer_121 = _$safeBuffer_144.Buffer,
        _$publicEncrypt_121 = function(e, t, r) { var i;
            i = e.padding ? e.padding : r ? 1 : 4; var n, s = _$parseAsn1_110(e); if (4 === i) n = function(e, t) { var r = e.modulus.byteLength(),
                    i = t.length,
                    n = _$browser_51("sha1").update(__Buffer_121.alloc(0)).digest(),
                    s = n.length,
                    a = 2 * s; if (i > r - a - 2) throw new Error("message too long"); var o = __Buffer_121.alloc(r - i - a - 2),
                    f = r - s - 1,
                    c = _$browser_127(s),
                    u = _$xor_123(__Buffer_121.concat([n, o, __Buffer_121.alloc(1, 1), t], f), _$mgf_119(c, f)),
                    h = _$xor_123(c, _$mgf_119(u, s)); return new _$bn_16(__Buffer_121.concat([__Buffer_121.alloc(1), h, u], r)) }(s, t);
            else if (1 === i) n = function(e, t, r) { var i, n = t.length,
                    s = e.modulus.byteLength(); if (n > s - 11) throw new Error("message too long"); return i = r ? __Buffer_121.alloc(s - n - 3, 255) : function(e) { for (var t, r = __Buffer_121.allocUnsafe(e), i = 0, n = _$browser_127(2 * e), s = 0; i < e;) s === n.length && (n = _$browser_127(2 * e), s = 0), (t = n[s++]) && (r[i++] = t); return r }(s - n - 3), new _$bn_16(__Buffer_121.concat([__Buffer_121.from([0, r ? 1 : 2]), i, __Buffer_121.alloc(1), t], s)) }(s, t, r);
            else { if (3 !== i) throw new Error("unknown padding"); if ((n = new _$bn_16(t)).cmp(s.modulus) >= 0) throw new Error("data too long for modulus") } return r ? _$browserifyRsa_39(n, s) : _$withPublic_122(n, s) },
        __Buffer_120 = _$safeBuffer_144.Buffer,
        _$privateDecrypt_120 = function(e, t, r) { var i;
            i = e.padding ? e.padding : r ? 1 : 4; var n, s = _$parseAsn1_110(e),
                a = s.modulus.byteLength(); if (t.length > a || new _$bn_16(t).cmp(s.modulus) >= 0) throw new Error("decryption error");
            n = r ? _$withPublic_122(new _$bn_16(t), s) : _$browserifyRsa_39(t, s); var o = __Buffer_120.alloc(a - n.length); if (n = __Buffer_120.concat([o, n], a), 4 === i) return function(e, t) { var r = e.modulus.byteLength(),
                    i = _$browser_51("sha1").update(__Buffer_120.alloc(0)).digest(),
                    n = i.length; if (0 !== t[0]) throw new Error("decryption error"); var s = t.slice(1, n + 1),
                    a = t.slice(n + 1),
                    o = _$xor_123(s, _$mgf_119(a, n)),
                    f = _$xor_123(a, _$mgf_119(o, r - n - 1)); if (function(e, t) { e = __Buffer_120.from(e), t = __Buffer_120.from(t); var r = 0,
                            i = e.length;
                        e.length !== t.length && (r++, i = Math.min(e.length, t.length)); for (var n = -1; ++n < i;) r += e[n] ^ t[n]; return r }(i, f.slice(0, n))) throw new Error("decryption error"); for (var c = n; 0 === f[c];) c++; if (1 !== f[c++]) throw new Error("decryption error"); return f.slice(c) }(s, n); if (1 === i) return function(e, t, r) { for (var i = t.slice(0, 2), n = 2, s = 0; 0 !== t[n++];)
                    if (n >= t.length) { s++; break }
                var a = t.slice(2, n - 1); if (("0002" !== i.toString("hex") && !r || "0001" !== i.toString("hex") && r) && s++, a.length < 8 && s++, s) throw new Error("decryption error"); return t.slice(n) }(0, n, r); if (3 === i) return n; throw new Error("unknown padding") },
        _$browser_118 = {},
        _$browser_128 = {};
    (function(e, t) { "use strict";
        _$safeBuffer_144.Buffer, _$safeBuffer_144.kMaxLength; var r = t.crypto || t.msCrypto;
        Math.pow(2, 32);
        r && r.getRandomValues || e.browser }).call(this, _$browser_117, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); var _$cryptoBrowserify_55 = {};
    _$cryptoBrowserify_55.createHash = _$browser_51, _$cryptoBrowserify_55.createHmac = _$browser_53; var algoKeys = Object.keys(_$algos_40),
        hashes = ["sha1", "sha224", "sha256", "sha384", "sha512", "md5", "rmd160"].concat(algoKeys);

    function hasOwnProperty(e, t) { return Object.prototype.hasOwnProperty.call(e, t) }
    _$browser_111.pbkdf2, _$browser_111.pbkdf2Sync, _$browser_36.Cipher, _$browser_36.createCipher, _$browser_36.Cipheriv, _$browser_36.createCipheriv, _$browser_36.Decipher, _$browser_36.createDecipher, _$browser_36.Decipheriv, _$browser_36.createDecipheriv, _$browser_36.getCiphers, _$browser_36.listCiphers, _$browser_62.DiffieHellmanGroup, _$browser_62.createDiffieHellmanGroup, _$browser_62.getDiffieHellman, _$browser_62.createDiffieHellman, _$browser_62.DiffieHellman, _$browser_43.createSign, _$browser_43.Sign, _$browser_43.createVerify, _$browser_43.Verify, _$browser_118.publicEncrypt, _$browser_118.privateEncrypt, _$browser_118.publicDecrypt, _$browser_118.privateDecrypt, _$browser_128.randomFill, _$browser_128.randomFillSync; var _$decode_124 = function(e, t, r, i) { t = t || "&", r = r || "="; var n = {}; if ("string" != typeof e || 0 === e.length) return n; var s = /\+/g;
            e = e.split(t); var a = 1e3;
            i && "number" == typeof i.maxKeys && (a = i.maxKeys); var o = e.length;
            a > 0 && o > a && (o = a); for (var f = 0; f < o; ++f) { var c, u, h, d, l = e[f].replace(s, "%20"),
                    _ = l.indexOf(r);
                _ >= 0 ? (c = l.substr(0, _), u = l.substr(_ + 1)) : (c = l, u = ""), h = decodeURIComponent(c), d = decodeURIComponent(u), hasOwnProperty(n, h) ? isArray(n[h]) ? n[h].push(d) : n[h] = [n[h], d] : n[h] = d } return n },
        isArray = Array.isArray || function(e) { return "[object Array]" === Object.prototype.toString.call(e) },
        stringifyPrimitive = function(e) { switch (typeof e) {
                case "string":
                    return e;
                case "boolean":
                    return e ? "true" : "false";
                case "number":
                    return isFinite(e) ? e : "";
                default:
                    return "" } },
        _$encode_125 = function(e, t, r, i) { return t = t || "&", r = r || "=", null === e && (e = void 0), "object" == typeof e ? map(__objectKeys_125(e), function(i) { var n = encodeURIComponent(stringifyPrimitive(i)) + r; return __isArray_125(e[i]) ? map(e[i], function(e) { return n + encodeURIComponent(stringifyPrimitive(e)) }).join(t) : n + encodeURIComponent(stringifyPrimitive(e[i])) }).join(t) : i ? encodeURIComponent(stringifyPrimitive(i)) + r + encodeURIComponent(stringifyPrimitive(e)) : "" },
        __isArray_125 = Array.isArray || function(e) { return "[object Array]" === Object.prototype.toString.call(e) };

    function map(e, t) { if (e.map) return e.map(t); for (var r = [], i = 0; i < e.length; i++) r.push(t(e[i], i)); return r } var __objectKeys_125 = Object.keys || function(e) { var t = []; for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.push(r); return t },
        _$querystringEs3_126 = {};
    _$querystringEs3_126.stringify = _$encode_125; var _$backendAiClientNodeToEs6_159 = {}; return function(e, t) { class r { constructor(e, t, r, i = "API") { if (this._apiVersionMajor = "4", this._apiVersion = "v4.20190315", this._hashType = "sha256", null == r && (r = "https://api.backend.ai"), this._endpoint = r, this._endpointHost = r.replace(/^[^:]+:\/\//, ""), "API" === i) { if (null == e) throw "You must set accessKey! (either as argument or environment variable)"; if (null == t) throw "You must set secretKey! (either as argument or environment variable)";
                    this._accessKey = e, this._secretKey = t, this._userId = "", this._password = "" } else { if (null == e) throw "You must set user id! (either as argument or environment variable)"; if (null == t) throw "You must set password! (either as argument or environment variable)";
                    this._accessKey = "", this._secretKey = "", this._userId = e, this._password = t }
                this._proxyURL = null, this._connectionMode = i }
            get accessKey() { return this._accessKey }
            get secretKey() { return this._secretKey }
            get userId() { return this._userId }
            get password() { return this._password }
            get endpoint() { return this._endpoint }
            get proxyURL() { return this._proxyURL }
            get endpointHost() { return this._endpointHost }
            get apiVersion() { return this._apiVersion }
            get apiVersionMajor() { return this._apiVersionMajor }
            get hashType() { return this._hashType }
            get connectionMode() { return this._connectionMode }
            static createFromEnv() { return new this("AKIAKWI3KS3MBDRSWSDU", "lXOGPNRwv3-Toy9J8fseu7ISezbOuddbexecOWWh", e.env.BACKEND_ENDPOINT) } }
        class i { constructor(e, t) { this.ready = !1, this.code = null, this.sessionId = null, this.kernelType = null, this.clientVersion = "19.09.0", this.agentSignature = t, this._config = void 0 === e ? r.createFromEnv() : e, this._managerVersion = null, this._apiVersion = null, this._apiVersionMajor = null, this.is_admin = !1, this.is_superadmin = !1, this.kernelPrefix = "/kernel", this.resourcePreset = new n(this), this.vfolder = new s(this), this.agent = new a(this), this.keypair = new o(this), this.image = new c(this), this.utils = new v(this), this.computeSession = new u(this), this.resourcePolicy = new f(this), this.user = new p(this), this.group = new d(this), this.domain = new l(this), this.resources = new h(this), this.maintenance = new _(this), this.scalingGroup = new b(this), this.registry = new m(this), this.setting = new g(this), this.userConfig = new y(this), this.domain = new l(this), this._features = {} }
            get managerVersion() { return this._managerVersion }
            async _wrapWithPromise(e, t = !1) { let r, n, s, a = i.ERR_REQUEST,
                    o = ""; try { "GET" == e.method && (e.body = void 0), "SESSION" === this._config.connectionMode && (e.credentials = "include", e.mode = "cors"), n = await fetch(e.uri, e), a = i.ERR_RESPONSE; let f = n.headers.get("Content-Type"); if (!1 === t && null === f ? s = void 0 === n.blob ? await n.buffer() : await n.blob() : !1 === t && (f.startsWith("application/json") || f.startsWith("application/problem+json")) ? (a = (s = await n.json()).type, o = s.title) : s = !1 === t && f.startsWith("text/") ? await n.text() : void 0 === n.blob ? await n.buffer() : await n.blob(), a = i.ERR_SERVER, !n.ok) throw s } catch (err) { let f; switch (f = "object" == typeof err && err.constructor === Object && "title" in err ? err.title : err, a) {
                        case i.ERR_REQUEST:
                            a = "https://api.backend.ai/probs/client-request-error", o = f, r = `sending request has failed: ${f}`; break;
                        case i.ERR_RESPONSE:
                            a = "https://api.backend.ai/probs/client-response-error", o = f, r = `reading response has failed: ${f}`; break;
                        case i.ERR_SERVER:
                            a = "https://api.backend.ai/probs/server-error", o = `${n.status} ${n.statusText} - ${s.title}`, r = "server responded failure: " + `${n.status} ${n.statusText} - ${s.title}`; break;
                        default:
                            "" === a && (a = i.ERR_UNKNOWN), "" === o && (o = s.title), r = "server responded failure: " + `${n.status} ${n.statusText} - ${s.title}` } throw { isError: !0, timestamp: (new Date).toUTCString(), type: a, requestUrl: e.uri, requestMethod: e.method, requestParameters: e.body, statusCode: n.status, statusText: n.statusText, title: o, message: r } } let f = JSON.parse(localStorage.getItem("backendaiconsole.logs"));
                f && f.length > 5e3 && (f = f.slice(1, 5e3)); let c = Array(),
                    u = { isError: !1, timestamp: (new Date).toUTCString(), type: "", requestUrl: e.uri, requestMethod: e.method, requestParameters: e.body, statusCode: n.status, statusText: n.statusText, title: s.title, message: "" }; return c.push(u), f && (c = c.concat(f)), localStorage.setItem("backendaiconsole.logs", JSON.stringify(c)), s }
            getServerVersion() { let e = this.newPublicRequest("GET", "/", null, ""); return this._wrapWithPromise(e) }
            get APIMajorVersion() { return this._apiVersionMajor }
            set APIMajorVersion(e) { this._apiVersionMajor = e, this._config._apiVersionMajor = this._apiVersionMajor }
            async getManagerVersion() { if (null === this._managerVersion) { let e = await this.getServerVersion();
                    this._managerVersion = e.manager, this._apiVersion = e.version, this._config._apiVersion = this._apiVersion, this._apiVersionMajor = e.version.substr(1, 2), this._config._apiVersionMajor = this._apiVersionMajor, this._apiVersionMajor > 4 && (this.kernelPrefix = "/session") } return this._managerVersion }
            supports(e) { return 0 === Object.keys(this._features).length && this._updateSupportList(), e in this._features && this._features[e] }
            _updateFieldCompatibilityByAPIVersion(e) { const t = { session_name: "sess_id" }; return this._apiVersionMajor < 5 && Object.keys(t).forEach(r => { let i = e.indexOf(r); - 1 !== i && (e[i] = t[r]) }), e }
            _updateSupportList() { this.isAPIVersionCompatibleWith("v4.20190601") && (this._features["scaling-group"] = !0, this._features.group = !0, this._features["group-folder"] = !0, this._features["system-images"] = !0, this._features["detailed-session-states"] = !0) }
            isManagerVersionCompatibleWith(e) { let t = this._managerVersion; return t = t.split(".").map(e => e.padStart(10)).join("."), (e = e.split(".").map(e => e.padStart(10)).join(".")) <= t }
            isAPIVersionCompatibleWith(e) { let t = this._apiVersion; return null !== t && null !== e && (t = t.split(".").map(e => e.padStart(10)).join("."), e = e.split(".").map(e => e.padStart(10)).join(".")), e <= t }
            async check_login() { let e, t = this.newSignedRequest("POST", "/server/login-check", null); try {!0 === (e = await this._wrapWithPromise(t)).authenticated && (e.data, this._config._accessKey = e.data.access_key, this._config._session_id = e.session_id) } catch (err) { return Promise.resolve(!1) } return e.authenticated }
            async login() { let e, t = { username: this._config.userId, password: this._config.password },
                    r = this.newSignedRequest("POST", "/server/login", t); try { return !0 === (e = await this._wrapWithPromise(r)).authenticated ? this.check_login() : Promise.resolve(!1) } catch (err) { return !1 } }
            logout() { let e = this.newSignedRequest("POST", "/server/logout", {}); return this._wrapWithPromise(e) }
            async signout(e, t) { let r = { username: e, password: t },
                    i = this.newSignedRequest("POST", "/auth/signout", r); return this._wrapWithPromise(i) }
            async updatePassword(e, t, r) { let i = { old_password: e, new_password: t, new_password2: r },
                    n = this.newSignedRequest("POST", "/auth/update-password", i); return this._wrapWithPromise(n) }
            async getResourceSlots() { let e; return e = this.isAPIVersionCompatibleWith("v4.20190601") ? this.newPublicRequest("GET", "/config/resource-slots", null, "") : this.newPublicRequest("GET", "/etcd/resource-slots", null, ""), this._wrapWithPromise(e) }
            createIfNotExists(e, t, r = {}) { null == t && (t = this.generateSessionId()); let i = { lang: e, clientSessionToken: t }; if (r != {}) { let e = {};
                    r.cpu && (e.cpu = r.cpu), r.mem && (e.mem = r.mem), r.gpu && (e["cuda.device"] = parseFloat(r.gpu).toFixed(2)), r.vgpu ? e["cuda.shares"] = parseFloat(r.vgpu).toFixed(2) : r.fgpu && (e["cuda.shares"] = parseFloat(r.fgpu).toFixed(2)), r.tpu && (e["tpu.device"] = r.tpu), r.env && (e.environ = r.env), r.clustersize && (e.clusterSize = r.clustersize), r.group_name && (i.group_name = r.group_name), r.domain && (i.domain = r.domain), r.enqueueOnly && (i.enqueueOnly = r.enqueueOnly), r.maxWaitSeconds && (i.maxWaitSeconds = r.maxWaitSeconds), r.reuseIfExists && (i.reuseIfExists = r.reuseIfExists), r.startupCommand && (i.startupCommand = r.startupCommand), r.owner_access_key && (i.owner_access_key = r.owner_access_key), i.config = { resources: e }, r.mounts && (i.config.mounts = r.mounts), r.scaling_group && (i.config.scaling_group = r.scaling_group), r.shmem && (i.config.resource_opts = {}, i.config.resource_opts.shmem = r.shmem) } let n = this.newSignedRequest("POST", `${this.kernelPrefix}/create`, i); return this._wrapWithPromise(n) }
            getInformation(e, t = null) { let r = `${this.kernelPrefix}/${e}`;
                null != t && (r = `${r}?owner_access_key=${t}`); let i = this.newSignedRequest("GET", r, null); return this._wrapWithPromise(i) }
            getLogs(e, t = null) { let r = `${this.kernelPrefix}/${e}/logs`;
                null != t && (r = `${r}?owner_access_key=${t}`); let i = this.newSignedRequest("GET", r, null); return this._wrapWithPromise(i) }
            destroy(e, t = null) { let r = `${this.kernelPrefix}/${e}`;
                null != t && (r = `${r}?owner_access_key=${t}`); let i = this.newSignedRequest("DELETE", r, null); return this._wrapWithPromise(i) }
            restart(e, t = null) { let r = `${this.kernelPrefix}/${e}`;
                null != t && (r = `${r}?owner_access_key=${t}`); let i = this.newSignedRequest("PATCH", r, null); return this._wrapWithPromise(i) }
            execute(e, t, r, i, n) { let s = { mode: r, code: i, runId: t, options: n },
                    a = this.newSignedRequest("POST", `${this.kernelPrefix}/${e}`, s); return this._wrapWithPromise(a) }
            createKernel(e, t, r = {}) { return this.createIfNotExists(e, t, r) }
            destroyKernel(e, t = null) { return this.destroy(e, t) }
            refreshKernel(e, t = null) { return this.restart(e, t) }
            runCode(e, t, r, i) { return this.execute(t, r, i, e, {}) }
            upload(e, t, r) { const i = new FormData;
                i.append("src", r, t); let n = this.newSignedRequest("POST", `${this.kernelPrefix}/${e}/upload`, i); return this._wrapWithPromise(n) }
            download(e, t) { let r = { files: t }; const i = _$querystringEs3_126.stringify(r); let n = this.newSignedRequest("GET", `${this.kernelPrefix}/${e}/download?${i}`, null); return this._wrapWithPromise(n, !0) }
            download_single(e, t) { let r = { file: t }; const i = _$querystringEs3_126.stringify(r); let n = this.newSignedRequest("GET", `${this.kernelPrefix}/${e}/download_single?${i}`, null); return this._wrapWithPromise(n, !0) }
            mangleUserAgentSignature() { return this.clientVersion + (this.agentSignature ? "; " + this.agentSignature : "") }
            gql(e, t) { let r = { query: e, variables: t },
                    i = this.newSignedRequest("POST", "/admin/graphql", r); return this._wrapWithPromise(i) }
            newSignedRequest(e, r, i) { let n, s, a, o, f, c = "application/json",
                    u = new Date; if (null == i ? s = n = "" : "function" == typeof i.getBoundary || i instanceof FormData ? (n = i, s = "", c = "multipart/form-data") : s = n = JSON.stringify(i), f = "", "SESSION" === this._config.connectionMode) o = new Headers({ "User-Agent": `Backend.AI Client for Javascript ${this.mangleUserAgentSignature()}`, "X-BackendAI-Version": this._config.apiVersion, "X-BackendAI-Date": u.toISOString() }), f = !0 === r.startsWith("/server") ? this._config.endpoint + r : this._config.endpoint + "/func" + r;
                else { a = this._config._apiVersion[1] < 4 ? this.getAuthenticationString(e, r, u.toISOString(), s, c) : this.getAuthenticationString(e, r, u.toISOString(), "", c); let t = this.getSignKey(this._config.secretKey, u),
                        i = this.sign(t, "binary", a, "hex");
                    o = new Headers({ "User-Agent": `Backend.AI Client for Javascript ${this.mangleUserAgentSignature()}`, "X-BackendAI-Version": this._config.apiVersion, "X-BackendAI-Date": u.toISOString(), Authorization: `BackendAI signMethod=HMAC-SHA256, credential=${this._config.accessKey}:${i}` }), f = this._config.endpoint + r } return null != i ? ("function" == typeof i.getBoundary && o.set("Content-Type", i.getHeaders()["content-type"]), i instanceof FormData || (o.set("Content-Type", c), o.set("Content-Length", t.byteLength(s)))) : o.set("Content-Type", c), { method: e, headers: o, cache: "default", body: n, uri: f } }
            newUnsignedRequest(e, t, r) { return this.newPublicRequest(e, t, r, this._config.apiVersionMajor) }
            newPublicRequest(e, t, r, i) { let n = new Date,
                    s = { method: e, headers: new Headers({ "Content-Type": "application/json", "User-Agent": `Backend.AI Client for Javascript ${this.mangleUserAgentSignature()}`, "X-BackendAI-Version": this._config.apiVersion, "X-BackendAI-Date": n.toISOString(), credentials: "include", mode: "cors" }), mode: "cors", cache: "default", uri: "" }; return "SESSION" === this._config.connectionMode && !0 === t.startsWith("/server") ? s.uri = this._config.endpoint + t : "SESSION" === this._config.connectionMode && !1 === t.startsWith("/server") ? s.uri = this._config.endpoint + "/func" + t : s.uri = this._config.endpoint + t, s }
            getAuthenticationString(e, t, r, i, n = "application/json") { let s = _$cryptoBrowserify_55.createHash(this._config.hashType).update(i).digest("hex"); return e + "\n" + t + "\n" + r + "\nhost:" + this._config.endpointHost + "\ncontent-type:" + n + "\nx-backendai-version:" + this._config.apiVersion + "\n" + s }
            getCurrentDate(e) { return `0000${e.getUTCFullYear()}`.slice(-4) + `0${e.getUTCMonth()+1}`.slice(-2) + `0${e.getUTCDate()}`.slice(-2) }
            sign(e, r, i, n) { let s = new t(e, r),
                    a = _$cryptoBrowserify_55.createHmac(this._config.hashType, s); return a.update(i, "utf8"), a.digest(n) }
            getSignKey(e, t) { let r = this.sign(e, "utf8", this.getCurrentDate(t), "binary"); return this.sign(r, "binary", this._config.endpointHost, "binary") }
            generateSessionId() { for (var e = "", t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", r = 0; r < 8; r++) e += t.charAt(Math.floor(Math.random() * t.length)); return e + "-jsSDK" } }
        class n { constructor(e) { this.client = e, this.urlPrefix = "/resource" }
            list(e = null) { let t = this.client.newSignedRequest("GET", `${this.urlPrefix}/presets`, e); return this.client._wrapWithPromise(t) }
            check(e = null) { let t = this.client.newSignedRequest("POST", `${this.urlPrefix}/check-presets`, e); return this.client._wrapWithPromise(t) }
            add(e = null, t) { if (!0 === this.client.is_admin && null !== e) { let r = "mutation($name: String!, $input: CreateResourcePresetInput!) {  create_resource_preset(name: $name, props: $input) {    ok msg   }}",
                        i = { name: e, input: t }; return this.client.gql(r, i) } return Promise.resolve(!1) }
            mutate(e = null, t) { if (!0 === this.client.is_admin && null !== e) { let r = "mutation($name: String!, $input: ModifyResourcePresetInput!) {  modify_resource_preset(name: $name, props: $input) {    ok msg   }}",
                        i = { name: e, input: t }; return this.client.gql(r, i) } return Promise.resolve(!1) }
            delete(e = null) { if (!0 === this.client.is_admin && null !== e) { let t = "mutation($name: String!) {  delete_resource_preset(name: $name) {    ok msg   }}",
                        r = { name: e }; return this.client.gql(t, r) } return Promise.resolve(!1) } }
        class s { constructor(e, t = null) { this.client = e, this.name = t, this.urlPrefix = "/folders" }
            allowed_types() { let e = this.client.newSignedRequest("GET", `${this.urlPrefix}/_/allowed_types`, null); return this.client._wrapWithPromise(e) }
            create(e, t = "", r = "") { let i; "" !== t && (i = { name: e, host: t }), this.client.supports("group-folder") && "" !== r && (i = { name: e, host: t, group: r }); let n = this.client.newSignedRequest("POST", `${this.urlPrefix}`, i); return this.client._wrapWithPromise(n) }
            list(e = null) { let t = this.urlPrefix; if (e) { const r = { group_id: e };
                    t += `?${_$querystringEs3_126.stringify(r)}` } let r = this.client.newSignedRequest("GET", t, null); return this.client._wrapWithPromise(r) }
            list_hosts() { let e = this.client.newSignedRequest("GET", `${this.urlPrefix}/_/hosts`, null); return this.client._wrapWithPromise(e) }
            info(e = null) { null == e && (e = this.name); let t = this.client.newSignedRequest("GET", `${this.urlPrefix}/${e}`, null); return this.client._wrapWithPromise(t) }
            delete(e = null) { null == e && (e = this.name); let t = this.client.newSignedRequest("DELETE", `${this.urlPrefix}/${e}`, null); return this.client._wrapWithPromise(t) }
            upload(e, t, r = null) { null == r && (r = this.name); let i = new FormData;
                i.append("src", t, e); let n = this.client.newSignedRequest("POST", `${this.urlPrefix}/${r}/upload`, i); return this.client._wrapWithPromise(n) }
            uploadFormData(e, t = null) { let r = this.client.newSignedRequest("POST", `${this.urlPrefix}/${t}/upload`, e); return this.client._wrapWithPromise(r) }
            async create_upload_session(e, t, r = null) { null == r && (r = this.name); let i = { path: e, size: t.size },
                    n = this.client.newSignedRequest("POST", `${this.urlPrefix}/${r}/create_upload_session`, i); const s = (await this.client._wrapWithPromise(n)).token; let a = this.client._config.endpoint; return "SESSION" === this.client._config.connectionMode && (a += "/func"), a + `${this.urlPrefix}/_/tus/upload/${s}` }
            mkdir(e, t = null) { null == t && (t = this.name); let r = { path: e },
                    i = this.client.newSignedRequest("POST", `${this.urlPrefix}/${t}/mkdir`, r); return this.client._wrapWithPromise(i) }
            delete_files(e, t = null, r = null) { null == r && (r = this.name), null == t && (t = !1); let i = { files: e, recursive: t },
                    n = this.client.newSignedRequest("DELETE", `${this.urlPrefix}/${r}/delete_files`, i); return this.client._wrapWithPromise(n) }
            download(e, t = !1) { let r = { file: e },
                    i = _$querystringEs3_126.stringify(r),
                    n = this.client.newSignedRequest("GET", `${this.urlPrefix}/${t}/download_single?${i}`, null); return this.client._wrapWithPromise(n, !0) }
            request_download_token(e, t = !1) { let r = { file: e },
                    i = this.client.newSignedRequest("POST", `${this.urlPrefix}/${t}/request_download`, r); return this.client._wrapWithPromise(i) }
            download_with_token(e = "") { let t = { token: e },
                    r = _$querystringEs3_126.stringify(t),
                    i = this.client.newSignedRequest("GET", `${this.urlPrefix}/_/download_with_token?${r}`, null); return this.client._wrapWithPromise(i, !0) }
            get_download_url_with_token(e = "") { let t = { token: e },
                    r = _$querystringEs3_126.stringify(t); return "SESSION" === this.client._config.connectionMode ? `${this.client._config.endpoint}/func${this.urlPrefix}/_/download_with_token?${r}` : `${this.client._config.endpoint}${this.urlPrefix}/_/download_with_token?${r}` }
            list_files(e, t = null) { null == t && (t = this.name); let r = { path: e },
                    i = _$querystringEs3_126.stringify(r),
                    n = this.client.newSignedRequest("GET", `${this.urlPrefix}/${t}/files?${i}`, null); return this.client._wrapWithPromise(n) }
            invite(e, t, r = null) { null == r && (r = this.name); let i = { perm: e, user_ids: t },
                    n = this.client.newSignedRequest("POST", `${this.urlPrefix}/${r}/invite`, i); return this.client._wrapWithPromise(n) }
            invitations() { let e = this.client.newSignedRequest("GET", `${this.urlPrefix}/invitations/list`, null); return this.client._wrapWithPromise(e) }
            accept_invitation(e) { let t = { inv_id: e },
                    r = this.client.newSignedRequest("POST", `${this.urlPrefix}/invitations/accept`, t); return this.client._wrapWithPromise(r) }
            delete_invitation(e) { let t = { inv_id: e },
                    r = this.client.newSignedRequest("DELETE", `${this.urlPrefix}/invitations/delete`, t); return this.client._wrapWithPromise(r) }
            list_invitees(e = null) { let t = "/folders/_/shared";
                null !== e && (t = `${t}?vfolder_id=${e}`); let r = this.client.newSignedRequest("GET", t, null); return this.client._wrapWithPromise(r) }
            modify_invitee_permission(e) { let t = this.client.newSignedRequest("POST", "/folders/_/shared", e); return this.client._wrapWithPromise(t) } }
        class a { constructor(e) { this.client = e }
            list(e = "ALIVE", t = ["id", "status", "region", "first_contact", "cpu_cur_pct", "mem_cur_bytes", "available_slots", "occupied_slots"]) { if (!1 === ["ALIVE", "TERMINATED"].includes(e)) return Promise.resolve(!1); let r = "query($status: String) {  agents(status: $status) {" + `     ${t.join(" ")}` + "  }}",
                    i = { status: e }; return this.client.gql(r, i) } }
        class o { constructor(e, t = null) { this.client = e, this.name = t }
            info(e, t = ["access_key", "secret_key", "is_active", "is_admin", "user_id", "created_at", "last_used", "concurrency_limit", "concurrency_used", "rate_limit", "num_queries", "resource_policy"]) { let r, i; return this.client.is_admin ? (r = "query($access_key: String!) {  keypair(access_key: $access_key) {" + `    ${t.join(" ")}` + "  }}", i = { access_key: e }) : (r = "query {  keypair {" + `    ${t.join(" ")}` + "  }}", i = {}), this.client.gql(r, i) }
            list(e = null, t = ["access_key", "is_active", "is_admin", "user_id", "created_at", "last_used", "concurrency_used", "rate_limit", "num_queries", "resource_policy"], r = !0) { let i;
                i = this.client.is_admin && null == e ? "query($is_active: Boolean) {  keypairs(is_active: $is_active) {" + `    ${t.join(" ")}` + "  }}" : "query($email: String!, $is_active: Boolean) {  keypairs(email: $email, is_active: $is_active) {" + `    ${t.join(" ")}` + "  }}"; let n = { email: e || this.client.email, is_active: r }; return this.client.gql(i, n) }
            add(e = null, t = !0, r = !1, i = "default", n = 1e3, s = null, a = null) { let o = ["is_active", "is_admin", "resource_policy", "concurrency_limit", "rate_limit"];
                null !== s && "" !== s && (o = o.concat(["access_key", "secret_key"])); let f, c = "mutation($user_id: String!, $input: KeyPairInput!) {  create_keypair(user_id: $user_id, props: $input) {" + `    ok msg keypair { ${o.join(" ")} }` + "  }}"; return f = null !== s && "" !== s ? { user_id: e, input: { is_active: t, is_admin: r, resource_policy: i, rate_limit: n, access_key: s, secret_key: a } } : { user_id: e, input: { is_active: t, is_admin: r, resource_policy: i, rate_limit: n } }, this.client.gql(c, f) }
            mutate(e, t) { let r = { access_key: e, input: t }; return this.client.gql("mutation($access_key: String!, $input: ModifyKeyPairInput!) {  modify_keypair(access_key: $access_key, props: $input) {    ok msg  }}", r) }
            delete(e) { let t = { access_key: e }; return this.client.gql("mutation($access_key: String!) {  delete_keypair(access_key: $access_key) {    ok msg  }}", t) } }
        class f { constructor(e) { this.client = e }
            get(e = null, t = ["name", "created_at", "default_for_unspecified", "total_resource_slots", "max_concurrent_sessions", "max_containers_per_session", "max_vfolder_count", "max_vfolder_size", "allowed_vfolder_hosts", "idle_timeout"]) { let r, i; return null === e ? (r = "query {" + `  keypair_resource_policies { ${t.join(" ")} }` + "}", i = { n: e }) : (r = "query($n:String!) {" + `  keypair_resource_policy(name: $n) { ${t.join(" ")} }` + "}", i = { n: e }), this.client.gql(r, i) }
            add(e = null, t) { let r = ["name", "created_at", "default_for_unspecified", "total_resource_slots", "max_concurrent_sessions", "max_containers_per_session", "max_vfolder_count", "max_vfolder_size", "allowed_vfolder_hosts", "idle_timeout"]; if (!0 === this.client.is_admin && null !== e) { let i = "mutation($name: String!, $input: CreateKeyPairResourcePolicyInput!) {  create_keypair_resource_policy(name: $name, props: $input) {" + `    ok msg resource_policy { ${r.join(" ")} }` + "  }}",
                        n = { name: e, input: t }; return this.client.gql(i, n) } return Promise.resolve(!1) }
            mutate(e = null, t) { if (!0 === this.client.is_admin && null !== e) { let r = "mutation($name: String!, $input: ModifyKeyPairResourcePolicyInput!) {  modify_keypair_resource_policy(name: $name, props: $input) {    ok msg   }}",
                        i = { name: e, input: t }; return this.client.gql(r, i) } return Promise.resolve(!1) } }
        class c { constructor(e) { this.client = e }
            list(e = ["name", "tag", "registry", "digest", "installed", "labels { key value }", "resource_limits { key min max }"], t = !1, r = !1) { let i, n; return this.client.supports("system-images") ? !0 === t ? (i = "query($installed:Boolean) {" + `  images(is_installed:$installed) { ${e.join(" ")} }` + "}", n = { installed: t, is_operation: r }) : (i = "query {" + `  images { ${e.join(" ")} }` + "}", n = { is_operation: r }) : (i = "query {" + `  images { ${e.join(" ")} }` + "}", n = {}), this.client.gql(i, n) }
            modifyResource(e, t, r, i) { let n = []; return t = t.replace("/", "%2F"), Object.keys(i).forEach(s => { Object.keys(i[s]).forEach(a => { const o = this.client.newSignedRequest("POST", "/config/set", { key: `images/${e}/${t}/${r}/resource/${s}/${a}`, value: i[s][a] });
                        n.push(this.client._wrapWithPromise(o)) }) }), Promise.all(n) }
            modifyLabel(e, t, r, i, n) { t = t.replace("/", "%2F"), r = r.replace("/", "%2F"); const s = this.client.newSignedRequest("POST", "/config/set", { key: `images/${e}/${t}/${r}/labels/${i}`, value: n }); return this.client._wrapWithPromise(s) }
            install(e, t = {}, r = "index.docker.io") { "index.docker.io" != r ? r += "/" : r = ""; let i = this.client.generateSessionId(); return 0 === Object.keys(t).length && (t = { cpu: "1", mem: "512m" }), this.client.createIfNotExists(r + e, i, t).then(e => this.client.destroyKernel(i)).catch(e => { throw e }) }
            uninstall(e, t = "index.docker.io") { return !1 }
            get(e, t, r) { const i = this.client.newSignedRequest("POST", "/config/get", { key: `images/${e}/${t}/${r}/resource/`, prefix: !0 }); return this.client._wrapWithPromise(i) } }
        class u { constructor(e) { this.client = e }
            async list(e = ["session_name", "lang", "created_at", "terminated_at", "status", "status_info", "occupied_slots", "cpu_used", "io_read_bytes", "io_write_bytes"], t = "RUNNING", r = "", i = 30, n = 0, s = "") { let a, o; return "" === r && (r = null), "" === s && (s = null), a = `query($limit:Int!, $offset:Int!, $ak:String, $group_id:String, $status:String) {\n      compute_session_list(limit:$limit, offset:$offset, access_key:$ak, group_id:$group_id, status:$status) {\n        items { ${(e=this.client._updateFieldCompatibilityByAPIVersion(e)).join(" ")}}\n        total_count\n      }\n    }`, o = { limit: i, offset: n, status: t }, null != r && (o.ak = r), null != s && (o.group_id = s), this.client.gql(a, o) } }
        class h { constructor(e) { this.client = e, this.resources = {}, this._init_resource_values() }
            _init_resource_values() { this.resources.cpu = {}, this.resources.cpu.total = 0, this.resources.cpu.used = 0, this.resources.cpu.percent = 0, this.resources.mem = {}, this.resources.mem.total = 0, this.resources.mem.allocated = 0, this.resources.mem.used = 0, this.resources.gpu = {}, this.resources.gpu.total = 0, this.resources.gpu.used = 0, this.resources["cuda.device"] = {}, this.resources["cuda.device"].total = 0, this.resources["cuda.device"].used = 0, this.resources.fgpu = {}, this.resources.fgpu.total = 0, this.resources.fgpu.used = 0, this.resources["cuda.shares"] = {}, this.resources["cuda.shares"].total = 0, this.resources["cuda.shares"].used = 0, this.resources.agents = {}, this.resources.agents.total = 0, this.resources.agents.using = 0, this.agents = [] }
            totalResourceInformation(e = "ALIVE") { if (this.client.is_admin) { let t = ["id", "addr", "status", "first_contact", "cpu_cur_pct", "mem_cur_bytes", "occupied_slots", "available_slots"]; return this.client.agent.list(e, t).then(e => (this._init_resource_values(), this.agents = e.agents, Object.keys(this.agents).map((e, t) => { let r = this.agents[e],
                            i = JSON.parse(r.occupied_slots),
                            n = JSON.parse(r.available_slots);
                        this.resources.cpu.total = this.resources.cpu.total + Math.floor(Number(n.cpu)), this.resources.cpu.used = this.resources.cpu.used + Math.floor(Number(i.cpu)), this.resources.cpu.percent = this.resources.cpu.percent + parseFloat(r.cpu_cur_pct), void 0 === i.mem && (i.mem = 0), this.resources.mem.total = parseFloat(this.resources.mem.total) + parseInt(this.client.utils.changeBinaryUnit(n.mem, "b")), this.resources.mem.allocated = parseInt(this.resources.mem.allocated) + parseInt(this.client.utils.changeBinaryUnit(i.mem, "b")), this.resources.mem.used = parseInt(this.resources.mem.used) + parseInt(this.client.utils.changeBinaryUnit(r.mem_cur_bytes, "b")), this.resources.gpu.total = parseInt(this.resources.gpu.total) + Math.floor(Number(n["cuda.device"])), "cuda.device" in i && (this.resources.gpu.used = parseInt(this.resources.gpu.used) + Math.floor(Number(i["cuda.device"]))), this.resources.fgpu.total = parseFloat(this.resources.fgpu.total) + parseFloat(n["cuda.shares"]), "cuda.shares" in i && (this.resources.fgpu.used = parseFloat(this.resources.fgpu.used) + parseFloat(i["cuda.shares"])), isNaN(this.resources.cpu.used) && (this.resources.cpu.used = 0), isNaN(this.resources.mem.used) && (this.resources.mem.used = 0), isNaN(this.resources.gpu.used) && (this.resources.gpu.used = 0), isNaN(this.resources.fgpu.used) && (this.resources.fgpu.used = 0) }), this.resources.fgpu.used = this.resources.fgpu.used.toFixed(2), this.resources.fgpu.total = this.resources.fgpu.total.toFixed(2), this.resources.agents.total = Object.keys(this.agents).length, this.resources.agents.using = Object.keys(this.agents).length, this.resources["cuda.shares"].used = this.resources.fgpu.used, this.resources["cuda.device"].used = this.resources.gpu.used, this.resources["cuda.shares"].total = this.resources.fgpu.total, this.resources["cuda.device"].total = this.resources.gpu.total, this.resources)).catch(e => { throw e }) } return Promise.resolve(!1) }
            user_stats() { const e = this.client.newSignedRequest("GET", "/resource/stats/user/month", null); return this.client._wrapWithPromise(e) } }
        class d { constructor(e) { this.client = e }
            list(e = !0, t = !1, r = ["id", "name", "description", "is_active", "created_at", "modified_at", "domain_name"]) { let i, n; return !0 === this.client.is_admin ? (i = "query($is_active:Boolean) {" + `  groups(is_active:$is_active) { ${r.join(" ")} }` + "}", n = { is_active: e }, !1 !== t && (i = "query($domain_name: String, $is_active:Boolean) {" + `  groups(domain_name: $domain_name, is_active:$is_active) { ${r.join(" ")} }` + "}", n = { is_active: e, domain_name: t })) : (i = "query($is_active:Boolean) {" + `  groups(is_active:$is_active) { ${r.join(" ")} }` + "}", n = { is_active: e }), this.client.gql(i, n) } }
        class l { constructor(e) { this.client = e }
            get(e = !1, t = ["name", "description", "is_active", "created_at", "modified_at", "total_resource_slots", "allowed_vfolder_hosts", "allowed_docker_registries", "integration_id", "scaling_groups"]) { let r, i; if (!1 !== e) return r = "query($name: String) {" + `  domain(name: $name) { ${t.join(" ")} }` + "}", i = { name: e }, this.client.gql(r, i) }
            list(e = ["name", "description", "is_active", "created_at", "total_resource_slots", "allowed_vfolder_hosts", "allowed_docker_registries", "integration_id"]) { let t = "query {" + ` domains { ${e.join(" ")} }` + "}"; return this.client.gql(t, {}) } }
        class _ { constructor(e) { this.client = e, this.urlPrefix = "/resource" }
            rescan_images(e = "") { if (!0 === this.client.is_admin) { let t, r; return "" !== e ? (e = decodeURIComponent(e), t = "mutation($registry: String) {  rescan_images(registry: $registry) {    ok msg   }}", r = { registry: e }) : (t = "mutation {  rescan_images {    ok msg   }}", r = {}), this.client.gql(t, r) } return Promise.resolve(!1) }
            recalculate_usage() { if (!0 === this.client.is_superadmin) { let e = this.client.newSignedRequest("POST", `${this.urlPrefix}/recalculate-usage`, null); return this.client._wrapWithPromise(e) } } }
        class p { constructor(e) { this.client = e }
            list(e = !0, t = ["username", "password", "need_password_change", "full_name", "description", "is_active", "domain_name", "role", "groups {id name}"]) { let r, i; return !0 === this.client.is_admin ? (r = "query($is_active:Boolean) {" + `  users(is_active:$is_active) { ${t.join(" ")} }` + "}", i = { is_active: e }) : (r = "query {" + `  user { ${t.join(" ")} }` + "}", i = {}), this.client.gql(r, i) }
            get(e, t = ["email", "username", "password", "need_password_change", "full_name", "description", "is_active", "domain_name", "role", "groups {id name}"]) { let r, i; return !0 === this.client.is_admin ? (r = "query($email:String) {" + `  user (email:$email) { ${t.join(" ")} }` + "}", i = { email: e }) : (r = "query {" + `  user { ${t.join(" ")} }` + "}", i = {}), this.client.gql(r, i) }
            add(e = null, t) { let r = ["username", "password", "need_password_change", "full_name", "description", "is_active", "domain_name", "role", "groups{id, name}"]; if (!0 === this.client.is_admin) { let i = "mutation($email: String!, $input: UserInput!) {  create_user(email: $email, props: $input) {" + `    ok msg user { ${r.join(" ")} }` + "  }}",
                        n = { email: e, input: t }; return this.client.gql(i, n) } return Promise.resolve(!1) }
            modify(e = null, t) { if (!0 === this.client.is_superadmin) { let r = "mutation($email: String!, $input: ModifyUserInput!) {  modify_user(email: $email, props: $input) {    ok msg  }}",
                        i = { email: e, input: t }; return this.client.gql(r, i) } return Promise.resolve(!1) }
            delete(e) { if (!0 === this.client.is_superadmin) { let t = "mutation($email: String!) {  delete_user(email: $email) {    ok msg  }}",
                        r = { email: e }; return this.client.gql(t, r) } return Promise.resolve(!1) } }
        class b { constructor(e) { this.client = e }
            list_all() { if (!0 === this.client.is_superadmin) { const e = "query {" + `  scaling_groups { ${["name","description","is_active","created_at","driver","driver_opts","scheduler","scheduler_opts"].join(" ")} }` + "}",
                        t = {}; return this.client.gql(e, t) } return Promise.resolve(!1) }
            list(e = "default") { const t = `/scaling-groups?group=${e}`,
                    r = this.client.newSignedRequest("GET", t, null); return this.client._wrapWithPromise(r) }
            create(e, t = "") { let r = { name: e, input: { description: t, is_active: !0, driver: "static", scheduler: "fifo", driver_opts: "{}", scheduler_opts: "{}" } }; return this.client.gql("mutation($name: String!, $input: ScalingGroupInput!) {  create_scaling_group(name: $name, props: $input) {    ok msg  }}", r) }
            associateWithDomain(e, t) { let r = { domain: e, scaling_group: t }; return this.client.gql("mutation($domain: String!, $scaling_group: String!) {  associate_scaling_group_with_domain(domain: $domain, scaling_group: $scaling_group) {    ok msg  }}", r) }
            modify(e, t) { let r = { name: e, input: t }; return this.client.gql("mutation($name: String!, $input: ModifyScalingGroupInput!) {  modify_scaling_group(name: $name, props: $input) {    ok msg  }}", r) }
            delete(e) { let t = { name: e }; return this.client.gql("mutation($name: String!) {  delete_scaling_group(name: $name) {    ok msg  }}", t) } }
        class m { constructor(e) { this.client = e }
            list() { const e = this.client.newSignedRequest("POST", "/config/get", { key: "config/docker/registry", prefix: !0 }); return this.client._wrapWithPromise(e) }
            add(e, t) { let r = `config/docker/registry/${e=encodeURIComponent(e)}`; const i = this.client.newSignedRequest("POST", "/config/set", { key: r, value: t }); return this.client._wrapWithPromise(i) }
            delete(e) { e = encodeURIComponent(e); const t = this.client.newSignedRequest("POST", "/config/delete", { key: `config/docker/registry/${e}`, prefix: !0 }); return this.client._wrapWithPromise(t) } }
        class g { constructor(e) { this.client = e, this.config = null }
            list(e = "") { e = `config/${e}`; const t = this.client.newSignedRequest("POST", "/config/get", { key: e, prefix: !0 }); return this.client._wrapWithPromise(t) }
            get(e) { e = `config/${e}`; const t = this.client.newSignedRequest("POST", "/config/get", { key: e, prefix: !1 }); return this.client._wrapWithPromise(t) }
            set(e, t) { e = `config/${e}`; const r = this.client.newSignedRequest("POST", "/config/set", { key: e, value: t }); return this.client._wrapWithPromise(r) }
            delete(e, t = !1) { e = `config/${e}`; const r = this.client.newSignedRequest("POST", "/config/delete", { key: `${e}`, prefix: t }); return this.client._wrapWithPromise(r) } }
        class y { constructor(e) { this.client = e, this.config = null }
            get_bootstrap_script() { if (!this.client._config.accessKey) throw "Your access key is not set"; const e = this.client.newSignedRequest("GET", "/user-config/bootstrap-script"); return this.client._wrapWithPromise(e) }
            update_bootstrap_script(e) { const t = this.client.newSignedRequest("POST", "/user-config/bootstrap-script", { data: e }); return this.client._wrapWithPromise(t) } }
        class v { constructor(e) { this.client = e }
            changeBinaryUnit(e, t = "g", r = "b") { if (void 0 === e) return e; let i; const n = ["b", "k", "m", "g", "t", "p", "auto"],
                    s = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"]; if (!n.includes(t)) return !1; if ((e = e.toString()).indexOf(" ") >= 0) { let t = e.split(/(\s+)/);
                    e = s.includes(t[2]) ? t[0] + n[s.indexOf(t[2])] : t[0] } return n.includes(e.substr(-1)) ? (i = e.substr(-1), e = e.slice(0, -1)) : i = r, e * Math.pow(1024, Math.floor(n.indexOf(i) - n.indexOf(t))) }
            elapsedTime(e, t) { var r = new Date(e); if (null === t) var i = new Date;
                else i = new Date(t); var n = Math.floor((i.getTime() - r.getTime()) / 1e3),
                    s = Math.floor(n / 86400);
                n -= 86400 * s; var a = Math.floor(n / 3600);
                n -= 3600 * a; var o = Math.floor(n / 60),
                    f = n -= 60 * o,
                    c = ""; return void 0 !== s && s > 0 && (c = c + String(s) + " Day "), void 0 !== a && (c = c + this._padding_zeros(a, 2) + ":"), void 0 !== o && (c = c + this._padding_zeros(o, 2) + ":"), c + this._padding_zeros(f, 2) + "" }
            _padding_zeros(e, t) { return (e += "").length >= t ? e : new Array(t - e.length + 1).join("0") + e }
            gqlToObject(e, t) { let r = {}; return e.forEach(function(e) { r[e[t]] = e }), r }
            gqlToList(e, t) { let r = []; return e.forEach(function(e) { r.push(e[t]) }), r } }
        Object.defineProperty(i, "ERR_SERVER", { value: 0, writable: !1, enumerable: !0, configurable: !1 }), Object.defineProperty(i, "ERR_RESPONSE", { value: 1, writable: !1, enumerable: !0, configurable: !1 }), Object.defineProperty(i, "ERR_REQUEST", { value: 2, writable: !1, enumerable: !0, configurable: !1 }), Object.defineProperty(i, "ERR_UNKNOWN", { value: 99, writable: !1, enumerable: !0, configurable: !1 }); const w = { Client: i, ClientConfig: r };
        _$backendAiClientNodeToEs6_159.backend = w, _$backendAiClientNodeToEs6_159.Client = i, _$backendAiClientNodeToEs6_159.ClientConfig = r, _$backendAiClientNodeToEs6_159.BackendAIClient = i, _$backendAiClientNodeToEs6_159.BackendAIClientConfig = r }.call(this, _$browser_117, _$buffer_47({}).Buffer), _$backendAiClientNodeToEs6_159 });