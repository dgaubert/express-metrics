## 1.0.0
  - __Cluster mode available!__. Now, application that uses more than one process can be monitored as a single application.
  - Removed __.jsonSummary__ and __.getSummary__ methods. Now, express-metrics launches a new server that exposes the metrics on another port. The metrics can be reached on _/metrics_ path.

## 0.5.3
  - Now test are launched by the runner installed locally

## 0.5.2
  - Integrated Travis CI

## 0.5.0
  - Improved metrics report.

## 0.4.0
  - Added header "X-Response-Time" with the response time in ms.

## 0.3.0
  - Now options can be passed for customization.

## 0.2.0
  - new API:
    - summary -> jsonSummary
    - getData -> getSummary

## 0.1.0
  - Initial version
