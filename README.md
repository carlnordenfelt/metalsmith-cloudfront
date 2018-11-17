# metalsmith-cloudfront
[Metalsmith](http://www.metalsmith.io/) plugin for invalidating files in
[Amazon CloudFront](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/) cache.
To be used in conjunction with [metalsmith-s3](https://github.com/mwishek/metalsmith-s3).

Details on CloudFront cache invalidation: http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html
*Note:* Invalidating the CloudFront cache can take a few minutes.

[![Build Status](https://travis-ci.org/carlnordenfelt/metalsmith-cloudfront.svg?branch=master)](https://travis-ci.org/carlnordenfelt/metalsmith-cloudfront)
[![npm version](https://badge.fury.io/js/metalsmith-cloudfront.svg)](https://badge.fury.io/js/metalsmith-cloudfront)

## Installation
```
$ npm i metalsmith-cloudfront
```

## Parameters
* `dist`: CloudFront Distribution ID
* `paths`: Array of paths to invalidate. All paths must start with `/`.

## Usage
```node
const Metalsmith = require('metalsmith');
const s3 = require('metalsmith-s3');
const cloudfront = require('metalsmith-cloudfront');

const metalsmith = new Metalsmith(__dirname)
  .use(s3({
    action: 'write',
    bucket: 's3-bucket-dest'
  }))
  .use(cloudfront({
      dist: 'cloudFrontDisributionId',
      paths: [
        '/*'
      ]
  }))
```

## License

[The MIT License (MIT)](/LICENSE)

## Change Log

[Change Log](/CHANGELOG.md)
