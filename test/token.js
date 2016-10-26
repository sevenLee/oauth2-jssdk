"use strict";

var expect = require('expect');
var clientOauth2 = require('../src/ClientOauth2');
var Token = require('../src/Token');

beforeEach(function(){
    localStorage.clear();
    delete window.oauth2Callback;
});

describe('Token', function(){
        it('should stores token in localStorage', function(done){
            var accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3ZWIuZG9tYWluIiwic3ViIjoiMTIzNDU3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.XcAfM7Dw7c5n1_VnFQjFQGZ-B64tUIQAFvjbXe4uEEVrupm_lpIuUDR9d-zFb9N_CE2wHZ7Nyjhp5laJwM3pfTVHxAN1Vvy-XFPOaa3suvhGMIo_J7S45Fwrg2l_C0hxh8sh2m56WeNApmrMbV9-tBgnwOWLPcY6DvSulqdZHXlGOkEQWoSKGIpqfRi27uBosKGOsErSwGcLAajWi-jaypWW6iZwUtvxcKN0y9S6ZdTKGgKVXisQ_drUbXGvcVTQ6NRSfMNBEDNm3GGB4-hFV7qw83JuWWt3kSO5J6vVPl3_DtGeaMdVkafhK1lNXxIEp3u2AV0gyYv9q41YZyJRVA';
            var hash = '#access_token=' + accessToken + '&token_type=bearer' + '&state=' + 'fakeState';
            var accessTokenJSON = JSON.stringify(accessToken);

            expect.spyOn(clientOauth2.prototype, '_generateStateToken').andReturn('fakeState');
            expect.spyOn(clientOauth2.prototype, '_redirectHandler').andCallThrough();

            var service = new clientOauth2({
                clientId: '12345',
                redirectUri: 'http://localhost:9000/base/example/oauthRedirect.html',
                authEndpoint: 'http://localhost:9000/base/example/oauthAuth.html',
                scope: 'test_scope',
                connection: 'facebook'
            });

            service.authorize();
            window.oauth2Callback(hash);

            var store = localStorage.getItem('OM_ACCESS_TOKEN');
            done();
            expect(store).toBe(accessTokenJSON);
        });
});