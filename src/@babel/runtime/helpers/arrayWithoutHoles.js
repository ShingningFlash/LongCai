var r = require("./arrayLikeToArray");

module.exports = function(e) {
    if (Array.isArray(e)) return r(e);
};