# metalsmith-cloudfront
Metalsmith plugin for invalidating files in Amazon CloudFront cache.
To be used in conjunction with [metalsmith-s3](https://github.com/mwishek/metalsmith-s3).

Details on CloudFront cache invalidation: http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html
*Note:* Invalidating the CloudFront cache can take a few minutes. CLoudFront limits also apply.


# Installation
```
$ npm install metalsmith-cloudfront
```

# Parameters
* `dist`: CloudFront Distribution ID
* `paths`: Array of paths to invalidate. All paths must start with `/`.

# Usage
```node
var Metalsmith = require('metalsmith');
var s3 = require('metalsmith-s3');
var cloudfront = require('metalsmith-cloudfront');

var metalsmith = new Metalsmith(__dirname)
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

#License

[The MIT License (MIT)](/LICENSE)

#Change Log

[Change Log](/CHANGELOG.md)
