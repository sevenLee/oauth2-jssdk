"use strict";

var utils = require('./utils');
var Token;

// Class
var Constr = function(context, tokenParams){
    this.context = context;
    this.tokenParams = tokenParams;
};

// Public
Constr.prototype = {
    init: function(){
        this.setToken();
        return this;
    },
    getToken: function () {
        return JSON.parse(localStorage.getItem('OM_ACCESS_TOKEN'));
    },
    setToken: function(tokenParams) {
        this.tokenParams = utils.assign(this.tokenParams, tokenParams);
        localStorage.setItem('OM_ACCESS_TOKEN', JSON.stringify(this.tokenParams));
    }
};

Token = function(context, config) {
    return utils.assign(Token, new Constr(context, config).init());
};

module.exports =  Token;