"use strict";
/**
 * This file is composed with module style controller syntax, which is avaliabe since ServerHub v1.0.3
 */
module.exports = {
    index: function (req, res, method) {
        this.Console.log('Hello, I\'m from Home controller and index action');
        return this.View();
    },
    primary: function (req, res, method) {
        var context = this.View();
        context.name = 'System.version -> ' + this.System.Version;
        return context;
    }
};