'use strict';

var aws = require('aws-sdk');
var cloudfront = new aws.CloudFront({ apiVersion: '2016-08-01' });

module.exports = plugin;

/**
 * Metalsmith plugin to invalidate AWS CloudFront cache
 *
 * @param {Object} options
 *   @property {String} cloudFrontDist
 *   @property {String} invalidationRules
 * @return {Function}
 */

function plugin(config) {
    if (!config.dist) {
        throw new TypeError('Missing property [dist].');
    } else if (!config.paths) {
        throw new TypeError('Missing property [paths].');
    } else if (!config.paths instanceof Array || config.paths.length === 0) {
        throw new TypeError('Property [paths] must be an array with at least one value.');
    }

    return function (files, metalsmith, done) {
        var params = {
            DistributionId: config.dist,
            InvalidationBatch: {
                CallerReference: 'metalsmith-cloudfront-' + Date.now(),
                Paths: {
                    Quantity: config.paths.length,
                    Items: config.paths
                }
            }
        };
        cloudfront.createInvalidation(params, function (error) {
            if (error) {
                throw new TypeError('Error: ' + error);
            }
            done();
        });
    };
}
