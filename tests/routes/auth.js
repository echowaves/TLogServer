'use strict';

const supertest = require('co-supertest'); // SuperAgent-driven library for testing HTTP servers
const expect    = require('chai').expect;  // BDD/TDD assertion library
require('co-mocha');                     // enable support for generators in mocha tests using co

const app = require('../../app.js');

const request = supertest.agent(app.listen());

const headers = { Host: 'api.localhost' }; // set host header



describe('/auth', function() {
    it('validate user', function*() {
        const response =
          yield request.post('/auth')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({username: 'john.doe', password: 'foobar' })
            .end();
        expect(response.status).to.equal(200, response.text);
        expect(response.body).to.be.an('object');
    });
});
