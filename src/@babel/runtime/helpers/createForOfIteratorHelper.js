var r = require("./unsupportedIterableToArray");

module.exports = function(n, t) {
    var e;
    if ("undefined" == typeof Symbol || null == n[Symbol.iterator]) {
        if (Array.isArray(n) || (e = r(n)) || t && n && "number" == typeof n.length) {
            e && (n = e);
            var o = 0, u = function() {};
            return {
                s: u,
                n: function() {
                    return o >= n.length ? {
                        done: !0
                    } : {
                        done: !1,
                        value: n[o++]
                    };
                },
                e: function(r) {
                    throw r;
                },
                f: u
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var a, i = !0, l = !1;
    return {
        s: function() {
            e = n[Symbol.iterator]();
        },
        n: function() {
            var r = e.next();
            return i = r.done, r;
        },
        e: function(r) {
            l = !0, a = r;
        },
        f: function() {
            try {
                i || null == e.return || e.return();
            } finally {
                if (l) throw a;
            }
        }
    };
};