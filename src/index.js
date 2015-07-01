/* eslint-disable new-cap */

import _ from 'lodash';
import f from 'firenze';
import async from 'async';
import redis from 'redis';

let P = f.Promise;
let Adapter = f.Adapter;

// ## Usage
//
// ```js
// var f = require('firenze');
// var Database = f.Database;
// var RedisAdapter = require('firenze-adapter-redis');
//
// var db = new Database({
//   adapter: RedisAdapter,
//
//   // optional config
//   port: 6379,
//   host: '127.0.0.1'
//   options: {} // passed to `redis.createClient(port, host, options)`
// });
// ```
//
export default class Redis extends Adapter {
  constructor(options = {}) {
    super(options);
    this.options = _.merge({
      port: 6379,
      host: '127.0.0.1',
      options: {}
    }, options);

    this.client = redis.createClient(
      this.options.port,
      this.options.host,
      this.options.options
    );
  }

  getConnection() {
    return this.client;
  }

  closeConnection(cb = null) {
    if (!cb) {
      cb = function () { };
    }
    this.getConnection().end();
    return cb();
  }

  dropTable() {
    return new P.resolve(true);
  }

  createTable() {
    return new P.resolve(true);
  }

  populateTable(model, rows) {
    return new P((resolve, reject) => {
      return async.eachSeries(rows, (row, cb) => {
        let key = model.primaryKey;
        let value = row[model.displayField];

        this.getConnection().set(key, value, (err) => {
          if (err) {
            return cb(err);
          }

          return cb();
        });
      }, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }

  query(collection, options = {}) {
    let model = collection.model();
    return _.merge(options, {
      primaryKey: model.primaryKey,
      alias: model.alias,
      valueField: model.displayField
    });
  }

  getValueFromConditions(q, field) {
    let idField = field;
    let aliasedIdField = q.alias + '.' + field;

    let value = null;
    if (_.isObject(q.conditions)) {
      if (q.conditions[idField]) {
        value = q.conditions[idField];
      } else if (q.conditions[aliasedIdField]) {
        value = q.conditions[aliasedIdField];
      }
    }

    return value;
  }

// ## Operations
//
// Examples below assume you have an instance of a Post model already:
//
// ```js
// var Post = db.createModelClass({
//   primaryKey: 'key',
//   displayField: 'value'
// });
// ```
//
// ### Creating
//
// ```js
// var post = new Post({
//   key: 'myUniqueKey',
//   value: 'some value here...'
// });
//
// post.save().then(function (model) {
//   var value = model.get('value'); // some value here...
// });
// ```
//
  create(q, obj) {
    return this.update(q, obj);
  }

// ### Reading
//
// ```js
// var post = new Post({
//   key: 'myUniqueKey'
// });
//
// post.fetch().then(function (model) {
//   var value = model.get('value');
// });
// ```
//
  read(q) {
    return new P((resolve, reject) => {
      let key = this.getValueFromConditions(q, q.primaryKey);

      return this
        .getConnection()
        .get(key, (err, reply) => {
          if (err) {
            return reject(err);
          }

          return resolve([
            {
              [q.primaryKey]: key,
              [q.valueField]: reply
            }
          ]);
        });
    });
  }

// ### Updating
//
// ```js
// var post = new Post({
//   key: 'myUniqueKey'
// });
//
// post.set('value', 'some new value...');
//
// post.save().then(function (model) {
//   var value = model.get('value');
// });
// ```
//
  update(q, obj) {
    return new P((resolve, reject) => {
      let key = obj[q.primaryKey];
      let value = obj[q.valueField];

      return this
        .getConnection()
        .set(key, value, function (err, reply) {
          if (err) {
            return reject(err);
          }

          return resolve([
            {
              [q.primaryKey]: key,
              [q.valueField]: reply
            }
          ]);
        });
    });
  }

// ### Deleting
//
// ```js
// var post = new Post({
//   key: 'myUniqueKey'
// });
//
// post.delete().then(function () {
//   // delete successful
// });
// ```
//
  delete(q) {
    return new P((resolve, reject) => {
      let key = this.getValueFromConditions(q, q.primaryKey);

      return this
        .getConnection()
        .del(key, function (err, reply) {
          if (err) {
            return reject(err);
          }

          return resolve(reply);
        });
    });
  }
}
