# express-metrics

[![Build Status](https://travis-ci.org/dgaubert/express-metrics.svg?branch=master)](https://travis-ci.org/dgaubert/express-metrics)

Express middleware for collecting and reporting metrics about response times.

## Installation

On project path:

```
npm install express-metrics --save
```

## Example

Express projects:

```js
var express = require('express');
var expressMetrics = require('express-metrics');
var app = express();

// start a metrics server
app.use(expressMetrics({
  port: 8091
});

// every time this handler returns the greet, express-metrics
// will update the metrics with the calculated response time
app.get('/', function (req, res, next) {
  res.json({ greet: 'Hello world!' });
});
```

In _:8091/metrics_:
```js
{
  global: {
    all: {
      type: "timer",
      duration: {
        type: "histogram",
        min: 0,
        max: 109.713,
        sum: 674.927,
        variance: 239.8825911142156,
        mean: 5.624391666666665,
        std_dev: 15.488143565780103,
        count: 1,
        median: 0.8055000000000001,
        p75: 1.738,
        p95: 31.57105,
        p99: 107.1568799999999,
        p999: 109.713
      },
      rate: {
        type: "meter",
        count: 1,
        m1: 2.2284012252758894,
        m5: 4.550172188270242,
        m15: 5.220474962604762,
        mean: 1.3997597079168076,
        unit: "seconds"
      }
    },
    static: {
      type: "timer",
      duration: {
        ...
      },
      rate: {
        ...
      }
    }
  },
  status: {
    200: {
      ...
    },
    302: {
      ...
    },
  },
  method: {
    get: {
      ...
    },
    post: {
      ...
    },
    ...
  },
  '/blog': {
    get: {
      ...
    }
  },
  '/blog/:slug': {
    post: {
      ...
    }
  }
}
```
Metrics are grouped by:
  - global, all and statics (i.e. global: { all: {...}, static: {...} })
  - code status (i.e. status: { 200: {...} })
  - method (i.e. method: { get: {...} })
  - path and method (i.e. '/blog': { get: {...} })

## Options

Example using all options with its default values:
```js
app.use(expressMetrics({
  port: 8091,
  cluster: false,
  decimals: false,
  header: false
}));
```
### port: Number (default: undefined)

Only used when cluster option is false, start a metrics servers on the same process that the application is running.

### decimals: Boolean (default: false)

If decimals is __true__, times are measured in millisecond with three decimals. Otherwise, times are rounded to milliseconds.

### header: Boolean (default: false)

If header is __true__, "X-Response-Time" is added as HTTP header in the response.

### statsd: Object (default: undefined)

Optionally you can send the metrics to statsd. In order to do that you just need to provide the statsd config in the options.
Thanks to metrics you are able to explore at any time if there is something wierd in your application. And with statsd you are able to collect
stats for you more representative resources.

Example:

```js


  app.use(expressMetrics({
    statsd: {
      'host': 'localhost',
      'port': 8125,
      'prefix': require('os').hostname() + '.myService'
      'routes': {
        'showUserCampaigns': [{ path: '/campaigns/:userId/lite', methods: ['get']}],
        'showCampaign':  [{ path: '/campaign/:campaignId', methods: ['get']}],
        'showUserShops': { path: '/shop/:userId', method: 'get'}
      }
    }
  });


```

Just the routes that you indicate in the 'routes' option will be sent to statsd.


### cluster: Boolean (default: false)

If cluster is __true__, delegate the start of the metrics server to master process. Due to this, express-metrics provides one way to run a metrics server in master, i.e:

```js
var cluster = require('cluster');
var express = require('express');
var expressMetrics = require('express-metrics');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // start a metrics server on master process
  expressMetrics.listen(8091);
} else {
  var app = express();

  // with cluster option set to true says to the express-metrics that
  // it must send the measured times to master process
  app.use(expressMetrics({
    cluster: true
  });

  app.get('/', function (req, res, next) {
    res.json({ greet: 'Hello world!' });
  });

  app.listen(8090);
}
```

When one request is handled by one worker, express-metrics measures the response time and send it to the master. Then, master receives the data and updates the corresponding metrics. Furthermore, master exposes the metrics on port previously configured.

## Logging
Logs are sent to 'express-metrics' log4js logger.


## Contributions

Do you want to contribute?. Please, follow the below suggestions:
  - To add features, `pull requests` to `develop` branch.
  - To fix bugs in release version, `pull request` both `master` and `develop` branches.
  - Be consistent with style and design decisions.
  - Cover your implementation with tests, add it under `test/*.spec.js`.

## Change history

To view change history, please visit: [HISTORY.md](https://github.com/dgaubert/express-metrics/blob/master/HISTORY.md)

Versioning strategy:

  - The major version will increase for any backward-incompatible changes.
  - The minor version will increase for added features.
  - The patch version will increase for bug-fixes.

## License

To view the MIT license, please visit: [The MIT License (MIT)](https://github.com/dgaubert/express-metrics/blob/master/LICENSE)
