'use strict';

const expect  = require('chai').expect;
const mockery = require('mockery');
const sinon   = require('sinon');

let subject;

describe('index unit tests', function () {
    let createInvalidationStub;

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

        const awsMock = {
            CloudFront: function () {
                this.createInvalidation = createInvalidationStub;
            }
        };
        mockery.registerMock('aws-sdk', awsMock);
        subject = require('../../src/index.js');
        done();
    });

    beforeEach(function () {
        createInvalidationStub.reset();
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
            const params = {};

            function fn() {
                subject(params);
            }

            expect(fn).to.throw('Missing property [dist]');
            done();
        });
        it('should fail due to missing parameter paths', function (done) {
            const params = { dist: 'dist' };

            function fn() {
                subject(params);
            }

            expect(fn).to.throw('Missing property [paths]');
            done();
        });
        it('should fail due to invalid parameter paths', function (done) {
            const params = { dist: 'dist', paths: 'string' };

            function fn() {
                subject(params);
            }

            expect(fn).to.throw('Property [paths] must be an array with at least one value');
            done();
        });
        it('should succeed', function (done) {
            const params = { dist: 'dist', paths: ['string'] };
            const fn     = subject(params);
            expect(fn).to.be.a('function');
            done();
        });
    });
    describe('Calling AWS sdk', function () {
        it('should succeed', function (done) {
            const params   = { dist: 'dist', paths: ['string'] };
            const pluginFn = subject(params);
            subject(params)({}, {}, function (error, files) {
                expect(error).to.equal(null);
                expect(files).to.be.an('object');
                done();
            });

        });
        it('should fail due to AWS error', function (done) {
            const params = { dist: 'dist', paths: ['string'] };
            createInvalidationStub.yields('CreateInvalidationError');
            subject(params)({}, {}, function (error) {
                expect(error).to.equal('CreateInvalidationError');
                done();
            });
        });
    });
});
