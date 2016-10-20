var jsrsasign = require('jsrsasign');
var config = require('./config');
var utils = require('./utils');
var Token = require('./Token');

'use strict';

function sanitizeScope (connection, scopes) {
    if(Array.isArray(scopes)) {
        switch(connection) {
            case 'facebook':
                return scopes.join(',');
            default:
                return scopes.join(' ');
        }
    }else if(typeof scopes === 'string'){
        return scopes;
    }else{
        return null;
    }
}

function objectToQueryString (obj) {
    var str = [];

    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
    }

    return str.join("&");
}

function generateStateToken() {
    return Math.random().toString(36).substr(2);
}

function parseHash(hash){
    var oauthObj = {};
    var queryString = hash.substring(1);
    var regex = /([^#?&=]+)=([^&]*)/g;
    var match;

    while ((match = regex.exec(queryString)) !== null) {
        oauthObj[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
    }
    return oauthObj;
}


/**
 * Create a new instance of ClientOauth2
 *
 * @namespace om.sdk
 * @param {object} config the configs for the ClientOauth2 instance
 *   The object includes the following properties:
 *
 *   - **clientId** - `{string}` - client id assigned to om.oauth2-provider
 *   - **redirectUri** - `{string}` - the url for the provider to redirect users back to your application
 *   - **authEndpoint** - `{string}` - the url for the provider redirect users to Authorization Server
 *   - **scope** - `{string|array}` - the scope specifies the level of access that the client application is requesting. you can use array for multi scopes.
 *   - **connection** - `{string}` - specifies which Authorization Server want to connect
 * @constructor
 */
var ClientOauth2 = function(config){
    this.options = config;
    this.tokenParams = {
        response_type: 'token',
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: sanitizeScope(config.connection, config.scope),
        state: generateStateToken(),
        connection: config.connection
    };
    this.accToken = null;
};

ClientOauth2.prototype = {
    /**
     * Open popup that use authorize uri, it will get access token from redirect Uri query string
     *
     * you can directly get accessToken string from success callback parameter:
     *
     *      service.authorize(function(accessToken){
     *          console.log(accessToken);
     *      })
     *
     * you can also get error message from error callback:
     *
     *      service.authorize(successCallback, function(error){
     *          new Error("get access token error: " + error);
     *      });
     *
     * @param {Function} success The callback function to handle success
     * @param {Function} error The callback function to handle error
     */
    authorize: function authorize (success, error) {
        var dialog = window.open(this._getUri(), "Authorize", "scrollbars=yes");
        var self   = this;
        var params = this.tokenParams;

        if (window.focus && dialog) {
            dialog.focus();
        }

        if (dialog) {
            window.oauth2Callback = function (hash) {
                dialog.close();
                self._redirectHandler(params.state, success, error).call(self, hash);
            };
        }
    },

    getAccessToken: function() {
        return this.accToken;
    },

    _createUri: function (authEndpoint, params) {
        return authEndpoint + '?' + objectToQueryString(params);
    },

    _getUri: function (options) {
        var params   = this.tokenParams;
        this.options = utils.assign(this.options, options);

        utils.expects(this.options, ['clientId', 'redirectUri', 'authEndpoint', 'scope', 'connection']);

        params = utils.assign(params, {
            response_type: 'token',
            client_id: this.options.clientId,
            redirect_uri: this.options.redirectUri,
            scope: sanitizeScope(this.options.connection, this.options.scope),
            connection: this.options.connection
        });

        return this._createUri(this.options.authEndpoint, params);
    },

    _redirectHandler: function(state, success, error) {
        return function (hash) {
            var oauthParams = parseHash(hash);
            var isValid = false;
            var segments = 0;

            if (oauthParams.state !== state) {
                var msg = "OAuth Error: csrf detected - state parameter mismatch";
                console.error(msg);

                if (typeof error === "function") { error(msg); }
                return;
            }

            //validation access token
            segments = oauthParams.access_token.split('.').length;
            if(segments !== 3){
                console.error('Invalid token.');
                return;
            }

            try{
                isValid = jsrsasign.jws.JWS.verifyJWT(oauthParams.access_token, config.jwt.verifyKey, {
                    alg: ['RS256'],
                    iss: [config.jwt.web.domain]
                });
            }catch(err){
                console.error(err);
            }

            if(isValid) {
                Token(this, oauthParams.access_token);
                this.accToken = oauthParams.access_token;

                if(success && typeof success === 'function') {
                    success(oauthParams.access_token);
                }
            }else{
                if(typeof error === "function") {error("Failed to verify token")}
            }
        };
    }
};

module.exports = ClientOauth2;