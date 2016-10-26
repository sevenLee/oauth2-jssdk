"use strict";

var expect = require('expect');
var clientOauth2 = require('../src/ClientOauth2');

afterEach(function(){
    localStorage.clear();
    delete window.oauth2Callback;
});

describe('ClientOauth2', function(){
    describe('_getUri()', function(){
        it('point to a valid auth uri in open window', function(){
            var service = new clientOauth2({
                clientId: '12345',
                redirectUri: 'http://localhost:9000/base/example/oauthRedirect.html',
                authEndpoint: 'http://localhost:9000/base/example/oauthAuth.html',
                scope: 'test_scope',
                connection: 'facebook'
            });

            var url = service._getUri();
            var state = service.tokenParams.state;
            var expectUrl = 'http://localhost:9000/base/example/oauthAuth.html' + '?' + 'response_type=token&client_id=12345&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2Fbase%2Fexample%2FoauthRedirect.html&scope=test_scope&state=' + state + '&connection=facebook';
            expect(url).toBe(expectUrl);
        });
    });

    describe('authorize()', function(){
        it('should define global oauth2Callback function', function(){
            var service = new clientOauth2({
                clientId: '12345',
                redirectUri: 'http://localhost:9000/example/oauthRedirect.html',
                authEndpoint: 'http://localhost:9000/example/oauthAuth.html',
                scope: 'test_scope',
                connection: 'facebook'
            });

            service.authorize();
            expect(typeof window.oauth2Callback).toBe('function');
        });

        it('should call redirect handler', function(){
            var accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3ZWIuZG9tYWluIiwic3ViIjoiMTIzNDU3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.XcAfM7Dw7c5n1_VnFQjFQGZ-B64tUIQAFvjbXe4uEEVrupm_lpIuUDR9d-zFb9N_CE2wHZ7Nyjhp5laJwM3pfTVHxAN1Vvy-XFPOaa3suvhGMIo_J7S45Fwrg2l_C0hxh8sh2m56WeNApmrMbV9-tBgnwOWLPcY6DvSulqdZHXlGOkEQWoSKGIpqfRi27uBosKGOsErSwGcLAajWi-jaypWW6iZwUtvxcKN0y9S6ZdTKGgKVXisQ_drUbXGvcVTQ6NRSfMNBEDNm3GGB4-hFV7qw83JuWWt3kSO5J6vVPl3_DtGeaMdVkafhK1lNXxIEp3u2AV0gyYv9q41YZyJRVA';
            var hash = '#access_token=' + accessToken + '&token_type=bearer' + '&state=' + 'fakeState';


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

            expect(clientOauth2.prototype._redirectHandler).toHaveBeenCalled();

            expect(service.tokenParams.state).toBe('fakeState');

            expect(clientOauth2.prototype._redirectHandler).toHaveBeenCalledWith('fakeState', undefined, undefined);

        });

        it('should get access token in authorize() callback parameter', function(done){
            var accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3ZWIuZG9tYWluIiwic3ViIjoiMTIzNDU3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.XcAfM7Dw7c5n1_VnFQjFQGZ-B64tUIQAFvjbXe4uEEVrupm_lpIuUDR9d-zFb9N_CE2wHZ7Nyjhp5laJwM3pfTVHxAN1Vvy-XFPOaa3suvhGMIo_J7S45Fwrg2l_C0hxh8sh2m56WeNApmrMbV9-tBgnwOWLPcY6DvSulqdZHXlGOkEQWoSKGIpqfRi27uBosKGOsErSwGcLAajWi-jaypWW6iZwUtvxcKN0y9S6ZdTKGgKVXisQ_drUbXGvcVTQ6NRSfMNBEDNm3GGB4-hFV7qw83JuWWt3kSO5J6vVPl3_DtGeaMdVkafhK1lNXxIEp3u2AV0gyYv9q41YZyJRVA';
            var hash = '#access_token=' + accessToken + '&token_type=bearer' + '&state=' + 'fakeState';

            expect.spyOn(clientOauth2.prototype, '_generateStateToken').andReturn('fakeState');
            expect.spyOn(clientOauth2.prototype, '_redirectHandler').andCallThrough();

            var service = new clientOauth2({
                clientId: '12345',
                redirectUri: 'http://localhost:9000/base/example/oauthRedirect.html',
                authEndpoint: 'http://localhost:9000/base/example/oauthAuth.html',
                scope: 'test_scope',
                connection: 'facebook'
            });

            service.authorize(function(token){
                expect(token).toBe(accessToken);
                done();
            });

            window.oauth2Callback(hash);
        });
    });
});