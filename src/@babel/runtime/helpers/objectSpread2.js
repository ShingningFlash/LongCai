var e = require("./defineProperty");

function r(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        r && (n = n.filter(function(r) {
            return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, n);
    }
    return t;
}

module.exports = function(t) {
    for (var n = 1; n < arguments.length; n++) {
        var o = null != arguments[n] ? arguments[n] : {};
        n % 2 ? r(Object(o), !0).forEach(function(r) {
            e(t, r, o[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(o)) : r(Object(o)).forEach(function(e) {
            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(o, e));
        });
    }
    return t;
};