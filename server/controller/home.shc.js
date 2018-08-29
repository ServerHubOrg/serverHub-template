"use strict";
/**
 * This file is composed with module style controller syntax, which is avaliabe since ServerHub v1.0.3
 */
module.exports = {
    index: function (req, res, method) {
        return this.View();
    }
};