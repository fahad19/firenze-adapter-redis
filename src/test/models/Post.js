/*eslint camelcase: [2, {properties: "never"}]*/
/* eslint-disable new-cap */

module.exports = function (db) {
  return db.createModelClass({
    alias: 'Post',

    primaryKey: 'key',

    displayField: 'value',

    collectionClass: function () {
      return require('../collections/Posts')(db);
    }
  });
};
