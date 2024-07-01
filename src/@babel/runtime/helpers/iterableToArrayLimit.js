module.exports = function(t, r) {
    if ("undefined" != typeof Symbol && Symbol.iterator in Object(t)) {
        var e = [], n = !0, o = !1, l = void 0;
        try {
            for (var i, u = t[Symbol.iterator](); !(n = (i = u.next()).done) && (e.push(i.value), 
            !r || e.length !== r); n = !0) ;
        } catch (t) {
            o = !0, l = t;
        } finally {
            try {
                n || null == u.return || u.return();
            } finally {
                if (o) throw l;
            }
        }
        return e;
    }
};