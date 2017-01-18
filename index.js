var TelegramBot = require('node-telegram-bot-api');
var utils = require('./lib/utils');
var storage = require('./lib/storage');

var winston = require('winston');

var port = process.env.EXPRESS_PORT || 80;

var app = require('express')();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

var telegramToken = process.env.TELEGRAM_TOKEN;

if (!telegramToken) {
  winston.error('undefined Telegram token');
  process.exit(1);
}

var bot = new TelegramBot(telegramToken, {polling: true});

winston.info('Starting telegram bot');

function genNewToken(telegramMsg) {
  var chatId = telegramMsg.chat.id;
  var chatToken = utils.genToken();
  var response = 'Your new token is: ' + chatToken;
  var toSave = {chatId:chatId, chatToken: chatToken};

  storage.saveToken(toSave, function() {
    bot.sendMessage(chatId, response);
  });
}

bot.onText(/\/start (.+)/, function (msg, match) {
  genNewToken(msg);
});

bot.onText(/\/showtoken/, function (msg, match) {
  var chatId = msg.chat.id;
  storage.getTokenFromChatId(chatId, function(chatToken){
    var response = 'Sorry, I can\'t find your token.';

    if (chatToken) {
      response = 'Your Token is: ' + chatToken;
    }

    bot.sendMessage(chatId, response);
  });
});

bot.onText(/\/newtoken/, function (msg, match) {
  genNewToken(msg);
});

bot.onText(/\/help/, function(msg, match) {
  var chatId = msg.chat.id;
  var response = 'Usage:\n\n';
  response += 'Get a token of this chat with the command \n/newtoken\n\n';
  response += 'With the token send a message from the command line, ';
  response += ' similar to this example:\n\n';
  response += 'curl -d "{\\"token\\":\\"myChatToken\\",\\"msg\\":\\"hello from curl $(date)\\"}" -H "Content-Type: application/json" https://fromcommandlinebot-jyisywyext.now.sh';
  response += '\n\nCommands:\n';
  response += '/newtoken : generate a new token\n';
  response += '/showtoken : show the current token\n';
  response += '/help : show this message\n';
  response += '/about';

  bot.sendMessage(chatId, response);
});

bot.onText(/\/about/, function (msg, match) {
  var chatId = msg.chat.id;
  var url = 'https://github.com/juanpabloaj/fromcommandlinebot';
  var response = '@fromcommandlinebot\n\nGet more info in the github repository ' + url;
  bot.sendMessage(chatId, response);
});

bot.on('message', function(msg) {
  storage.saveMessage(msg);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var loggerMiddleware = function(req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  winston.info('Connection from ' + ip);
  next();
};

app.use(loggerMiddleware);

app.post('/', upload.array(), function(req, res, next) {
  var token = req.body.token;
  var msg = req.body.msg;
  if ( token && msg ) {
    storage.getChatIdFromToken(token, function(chatId) {
      if (chatId) {
        winston.info('Send message to %s', chatId);
        bot.sendMessage(chatId, msg);
        res.end();
      } else {
        res.json({msg:'Sorry, I can\'t find your token ' + token});
      }
    });
  } else {
    res.json({msg:'token and msg fields are required.'});
  }
});

app.get('/', function(req, res) {
  res.json({msg:'Hello, I\'m the telegram bot @fromcommandlinebot'});
});

app.route('*')
  .get(function(req, res) {
    res.redirect('/');
  })
  .post(function(req, res) {
    res.redirect('/');
  });

app.listen(port, function() {
  winston.info('Running express in port %s', port);
});
