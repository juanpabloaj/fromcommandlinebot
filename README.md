# FromCommandLineBot

A telegram bot to send messages to Telegram from command line.

## Usage

Start a conversation with the bot and generate a new chat token.

![Imgur](http://i.imgur.com/fRTDMRq.png)

Use this token to send messages from the command line to the telegram chat.

    curl -d "{\"token\":\"012xyz\",\"msg\":\"hello from curl $(date)\"}" \
    -H "Content-Type: application/json" https://fromcommandlinebot-jyisywyext.now.sh

Get the message in the telegram chat.

![Imgur](http://i.imgur.com/uUf2WHn.png)

## Deploy

### Requirements

Environments variables

    TELEGRAM_TOKEN
    MONGODB_DB_URL
