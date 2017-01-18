# FromCommandLineBot

A telegram bot to send messages to Telegram from the command line.

## Usage

Start a conversation with fromcommandlinebot

https://telegram.me/fromcommandlinebot

and generate a new chat token.

![Imgur](http://i.imgur.com/fRTDMRq.png)

Use this token to send messages from the command line to a telegram chat.

    curl -d "{\"token\":\"012xyz\",\"msg\":\"hello from curl $(date)\"}" \
    -H "Content-Type: application/json" https://fromcommandlinebot.now.sh

Get the message in the telegram chat.

![Imgur](http://i.imgur.com/uUf2WHn.png)

## To Run and Deploy your own version of the bot

This information is for developers, if you only need use the bot, with read the previous section is sufficient.

If you need run a own instance of the bot you need a nodejs/expressjs server and a mongodb database, with some environment variables defined

    TELEGRAM_TOKEN
    MONGODB_DB_URL
