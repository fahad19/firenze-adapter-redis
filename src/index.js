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
//   keyField: 'key',
//   valueField: 'value'
// });
// ```
//
export default class Redis extends Adapter {
  constructor(options = {}) {
    super(options);
    this.options = _.merge({
      keyField: 'key',
      valueField: 'value'
    }, options);

    this.client = redis.createClient();
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
        let key = row[this.options.keyField];
        let value = row[this.options.valueField];

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
      primaryKey: this.options.keyField,
      alias: model.alias,
      valueField: this.options.valueField
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

  create(q, obj) {
    return this.update(q, obj);
  }

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
