var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var winston = require('winston');

var url = process.env.MONGODB_DB_URL;

if (!url) {
  winston.error('undefined mongodb url');
  process.exit(1);
}

var updateToken = function(db, chatId, token, callback) {
  var collection = db.collection('tokens');

  collection.updateOne({chatId: chatId}, {$set: {token:token}},
    {upsert:true}, function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
};

var saveToken = function(params, callback) {
  var chatId = params.chatId;
  var chatToken = params.chatToken;
  MongoClient.connect(url, function(err, db) {
    assert.equal(err, null);

    updateToken(db, chatId, chatToken, function(result) {
      callback(result);
      db.close();
    });
  });
};

var saveJson = function(db, json, coll) {
  var collection = db.collection(coll);

  collection.insertOne(json, function(err, result){
    assert.equal(err, null);
  });
};

var saveMessage = function(message) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(err, null);
    saveJson(db, message, 'messages');
    db.close();
  });
};

var getfromTokens = function(db, query, key, callback) {
  var collection = db.collection('tokens');

  collection.findOne(query, function(err, result) {
    assert.equal(err, null);
    if (result) {
      callback(result[key]);
    } else {
      callback(null);
    }
  });
};

var getTokenFromChatId = function(chatId, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(err, null);

    getfromTokens(db, {chatId:chatId}, 'token', function(result) {
      callback(result);
      db.close();
    });
  });
};

var getChatIdFromToken = function(token, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(err, null);

    getfromTokens(db, {token:token}, 'chatId', function(result) {
      callback(result);
      db.close();
    });
  });
};

module.exports.saveToken = saveToken;
module.exports.getTokenFromChatId = getTokenFromChatId;
module.exports.getChatIdFromToken = getChatIdFromToken;
module.exports.saveMessage = saveMessage;
