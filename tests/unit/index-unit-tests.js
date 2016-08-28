'use strict';

var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');
var subject;

describe('index unit tests', function () {
    var createInvalidationStub;
    after(function () {
        mockery.deregisterAll();
        mockery.disable();
    });
    before(function (done) {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });
        createInvalidationStub = sinon.stub();

        var awsMock = {
            CloudFront: function () {
                this.createInvalidation = createInvalidationStub;
            }
        };
        mockery.registerMock('aws-sdk', awsMock);
        subject = require('../../lib/index.js');
        done();
    });
    beforeEach(function () {
        createInvalidationStub.reset().resetBehavior();
        createInvalidationStub.yields(null, {});
    });
    describe('input validation', function () {
        it('should fail due to missing config', function (done) {
            function fn() {
                subject();
            }

            expect(fn).to.throw('Missing configuration');
            done();
        });
        it('should fail due to missing parameter dist', function (done) {
            var params = {};

            function fn() {
                subject(params);
            }

            expect(fn).to.throw('Missing property [dist]');
            done();
        });
        it('should fail due to missing parameter paths', function (done) {
            var params = { dist: 'dist' };

            function fn() {
                subject(params);
            }

            expect(fn).to.throw('Missing property [paths]');
            done();
        });
        it('should fail due to invalid parameter paths', function (done) {
            var params = { dist: 'dist', paths: 'string' };

            function fn() {
                subject(params);
            }

            expect(fn).to.throw('Property [paths] must be an array with at least one value');
            done();
        });
        it('should succeed', function (done) {
            var params = { dist: 'dist', paths: ['string'] };
            var fn = subject(params);
            expect(fn).to.be.a('function');
            done();
        });
    });
    describe('Calling AWS sdk', function () {
        it('should succeed', function (done) {
            var params = { dist: 'dist', paths: ['string'] };
            var pluginFn = subject(params);
            subject(params)({}, {}, function () {
                expect(true).to.equal(true);
                done();
            });

        });
        it('should fail due to AWS error', function (done) {
            var params = { dist: 'dist', paths: ['string'] };
            createInvalidationStub.yields('CreateInvalidationError');
            function fn() {
                subject(params)();
            }

            expect(fn).to.throw('Error: CreateInvalidationError');
            done();
        });
    });
});
