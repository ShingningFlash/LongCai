module.exports = function(r, e) {
    (null == e || e > r.length) && (e = r.length);
    for (var n = 0, t = new Array(e); n < e; n++) t[n] = r[n];
    return t;
};