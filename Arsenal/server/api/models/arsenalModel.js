'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  comment: {
    type: String,
    Required: 'Kindly enter the data of the comment'
  }
});

var NewsSchema = new Schema({
  title: {
    type: String,
    Required: 'Kindly enter the data of the news'
  },
  body: {
    type: String,
    Required: 'Kindly enter the data of the news'
  }
});


module.exports = mongoose.model('Comments', CommentSchema);
module.exports = mongoose.model('News', NewsSchema);
