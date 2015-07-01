# firenze-adapter-redis

[![Build Status](https://secure.travis-ci.org/fahad19/firenze-adapter-redis.png?branch=master)](http://travis-ci.org/fahad19/firenze-adapter-redis) [![Coverage Status](https://coveralls.io/repos/fahad19/firenze-adapter-redis/badge.svg?branch=master)](https://coveralls.io/r/fahad19/firenze-adapter-redis?branch=master) [![npm](https://img.shields.io/npm/v/firenze-adapter-redis.svg)](https://www.npmjs.com/package/firenze-adapter-redis) [![Join the chat at https://gitter.im/fahad19/firenze](https://img.shields.io/badge/gitter-join_chat_%E2%86%92-1dce73.svg)](https://gitter.im/fahad19/firenze)

Redis database adapter for [firenze.js](https://github.com/fahad19/firenze)

Install it with [npm](https://npmjs.com/):

```
$ npm install --save firenze-adapter-redis
```

The adapter currently supports only setting/getting/deleting a particular key at this moment.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# Contents

  - [Usage](#usage)
  - [Operations](#operations)
    - [Creating](#creating)
    - [Reading](#reading)
    - [Updating](#updating)
    - [Deleting](#deleting)
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
  port: 6379,
  host: '127.0.0.1'
  options: {} // passed to `redis.createClient(port, host, options)`
});
```

## Operations

Examples below assume you have an instance of a Post model already:

```js
var Post = db.createModelClass({
  primaryKey: 'key',
  displayField: 'value'
});
```

### Creating

```js
var post = new Post({
  key: 'myUniqueKey',
  value: 'some value here...'
});

post.save().then(function (model) {
  var value = model.get('value'); // some value here...
});
```

### Reading

```js
var post = new Post({
  key: 'myUniqueKey'
});

post.fetch().then(function (model) {
  var value = model.get('value');
});
```

### Updating

```js
var post = new Post({
  key: 'myUniqueKey'
});

post.set('value', 'some new value...');

post.save().then(function (model) {
  var value = model.get('value');
});
```

### Deleting

```js
var post = new Post({
  key: 'myUniqueKey'
});

post.delete().then(function () {
  // delete successful
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
