var r = require("./arrayWithoutHoles"), e = require("./iterableToArray"), t = require("./unsupportedIterableToArray"), u = require("./nonIterableSpread");

module.exports = function(a) {
    return r(a) || e(a) || t(a) || u();
};