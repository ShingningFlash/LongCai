var r = require("./arrayWithHoles"), e = require("./iterableToArrayLimit"), t = require("./unsupportedIterableToArray"), i = require("./nonIterableRest");

module.exports = function(u, a) {
    return r(u) || e(u, a) || t(u, a) || i();
};