var r = require("./arrayLikeToArray");

module.exports = function(t, e) {
    if (t) {
        if ("string" == typeof t) return r(t, e);
        var o = Object.prototype.toString.call(t).slice(8, -1);
        return "Object" === o && t.constructor && (o = t.constructor.name), "Map" === o || "Set" === o ? Array.from(t) : "Arguments" === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? r(t, e) : void 0;
    }
};