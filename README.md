# express-metrics

Express middleware for collecting and reporting metrics about response times.

## Installation

Node.js, on project path:

```
npm install express-metrics
```

## Examples

Node projects:

```js
var express = require('express');
var metrics = require('express-metrics');
var app = express();

// add '/metrics' route to summary the response times
app.use(metrics(app));

app.get('/', function (req, res, next) {
  res.json({greet: 'Helo world!'});
}
```

## Contributions

Do you want to contribute?. Please, follow the below suggestions:
  - To add features, `pull requests` to `develop` branch.
  - To fix bugs in release version, `pull request` both `master` and `develop` branches.
  - Be consistent with style and design decisions.
  - Cover your implementation with tests, add it under `test/*-test.js`.

## Change history

To view change history, please visit: [history.md](https://github.com/dgaubert/venom/blob/master/docs/hystory.md)

Versioning strategy:

  - The major version will increase for any backward-incompatible changes.
  - The minor version will increase for added features.
  - The patch version will increase for bug-fixes.

## License

To view the MIT license, please visit: [The MIT License (MIT)](https://github.com/dgaubert/venom/blob/master/LICENSE)
