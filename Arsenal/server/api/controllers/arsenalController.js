'use strict';

var mongoose = require('mongoose'),
  Comment = mongoose.model('Comments'),
  News = mongoose.model('News');


exports.list_all_comments = function(req, res) {
  Comment.find({}, function(err, comment) {
    if (err)
      res.send(err);
    res.json(comment);
  });
};


exports.create_a_comment = function(req, res) {
  var new_comment = new Comment(req.body);
  new_comment.save(function(err, comment) {
    if (err)
      res.send(err);
    res.json(comment);
  });
};

exports.read_a_comment = function(req, res) {
  Comment.findById(req.params.commentId, function(err, comment) {
    if (err)
      res.send(err);
    res.json(comment);
  });
};

exports.update_a_comment = function(req, res) {
  Comment.findOneAndUpdate({_id:req.params.commentId}, req.body, {new: true}, function(err, comment) {
    if (err)
      res.send(err);
    res.json(comment);
  });
};
// Comment.remove({}).exec(function(){});
exports.delete_a_comment = function(req, res) {

  Comment.remove({
    _id: req.params.commentId
  }, function(err, comment) {
    if (err)
      res.send(err);
    res.json({ message: 'Comment successfully deleted' });
  });
};


//-------------------------------------






//-------------------------------------

exports.list_all_news = function(req, res) {
  News.find({}, function(err, news) {
    if (err)
      res.send(err);
    res.json(news);
  });
};




exports.create_a_news = function(req, res) {
  var new_news = new News(req.body);
  new_news.save(function(err, news) {
    if (err)
      res.send(err);
    res.json(news);
  });
};


exports.read_a_news = function(req, res) {
  News.findById(req.params.newsId, function(err, news) {
    if (err)
      res.send(err);
    res.json(news);
  });
};


exports.update_a_news = function(req, res) {
  News.findOneAndUpdate({_id: req.params.newsId}, req.body, {new: true}, function(err, news) {
    if (err)
      res.send(err);
    res.json(news);
  });
};


exports.delete_a_news = function(req, res) {


  News.remove({
    _id: req.params.newsId
  }, function(err, news) {
    if (err)
      res.send(err);
    res.json({ message: 'News successfully deleted' });
  });
};
