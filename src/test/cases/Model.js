/* global describe, before, after, it */
/* eslint-disable no-unused-expressions */

var should = require('should-promised'); //eslint-disable-line
var lib = require('firenze');
var config = require('../config');

describe('Model', function () {
  before(function (done) {
    this.db = new lib.Database(config);

    this.Post = require('../models/Post')(this.db);
    this.postsData = require('../fixtures/posts');

    this.db.getAdapter().loadAllFixtures([
      {
        model: new this.Post(),
        rows: this.postsData
      }
    ]).then(function () {
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should have an instance', function () {
    var post = new this.Post();
    post.should.have.property('alias').which.is.exactly('Post');
  });

  it('should have a collection', function () {
    var post = new this.Post();
    post.should.have.property('collection');
    console.log('post', post);

    var posts = post.collection();
    // console.log('posts', posts);
    // posts.should.have.property('modelClass');
  });

  // it('should fetch itself', function (done) {
  //   var post = new this.Post({
  //     key: 'hello'
  //   });
  //   post.fetch().then(function (model) {
  //     model.get('value').should.be.exactly('Hello World');
  //     done();
  //   }).catch(function (error) {
  //     throw error;
  //   });
  // });

  after(function (done) {
    this.db.close(done);
  });
});
