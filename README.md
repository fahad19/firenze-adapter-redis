# firenze-adapter-redis

[![Build Status](https://secure.travis-ci.org/fahad19/firenze-adapter-redis.png?branch=master)](http://travis-ci.org/fahad19/firenze-adapter-redis) [![Coverage Status](https://coveralls.io/repos/fahad19/firenze-adapter-redis/badge.svg?branch=master)](https://coveralls.io/r/fahad19/firenze-adapter-redis?branch=master) [![npm](https://img.shields.io/npm/v/firenze-adapter-redis.svg)](https://www.npmjs.com/package/firenze-adapter-redis)

Redis database adapter for [firenze.js](https://github.com/fahad19/firenze)

Install it with [npm](https://npmjs.com) or [Bower](http://bower.io):

```
$ npm install --save firenze-adapter-redis

$ bower install --save firenze-adapter-redis
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# Contents

  - [Usage](#usage)
- [Testing](#testing)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!--docume:src/index.js-->
## Usage

```js
var f = require('firenze');
var Database = f.Database;
var RedisAdapter = require('firenze-adapter-redis');

var db = new Database({
  adapter: RedisAdapter,

  // optional config
  keyField: 'key',
  valueField: 'value'
});
```

<!--/docume:src/index.js-->

# Testing

Tests are written with [mocha](http://mochajs.org/), and can be run via npm:

```
$ npm test
```

# License

MIT © [Fahad Ibnay Heylaal](http://fahad19.com)
