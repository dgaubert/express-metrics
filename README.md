# express-metrics

[![Build Status](https://travis-ci.org/dgaubert/express-metrics.svg?branch=master)](https://travis-ci.org/dgaubert/express-metrics)

Express middleware for collecting and reporting metrics about response times.

## Installation

Node.js, on project path:

```
npm install express-metrics --save
```

## Examples

Node projects:

```js
var express = require('express');
var metrics = require('express-metrics');
var app = express();

app.use(metrics());

// it responds a JSON with a summary of metrics
app.get('/metrics', metrics.jsonSummary);

// every time this handler returns the greet, the middleware
// will update the metrics with the calculated response time
app.get('/', function (req, res, next) {
  res.json({ greet: 'Hello world!' });
});
```

In /metrics path, you  will see:
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
        count: 120,
        median: 0.8055000000000001,
        p75: 1.738,
        p95: 31.57105,
        p99: 107.1568799999999,
        p999: 109.713
      },
      rate: {
        type: "meter",
        count: 120,
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

If you want to do something with the collected data:

```js
app.get('/metrics', function (req, res, next) {
  var homeMetrics = metrics.getSummary()['/home']; // only home metrics
  res.render('path/to/template', { home: homeMetrics });
});
```
## Options

You can pass options to the middleware, like this:
```js
app.use(metrics({
  decimals: false,
  header: false
}));
```

### decimals: Boolean (default: false)

If decimals is __true__, times are measured in millisecond with three decimals. Otherwise, times are rounded to milliseconds.

### header: Boolean (deafult: false)

If header is true, "X-Response-Time" is added as HTTP header in the response.

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
