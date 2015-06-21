module.exports = function (db) {
  return db.createCollectionClass({
    modelClass: function () {
      return require('../models/Post')(db);
    }
  });
};
