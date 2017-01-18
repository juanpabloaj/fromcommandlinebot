# FromCommandLineBot

A telegram bot to send messages to Telegram from command line.

## Usage

Start a conversation with the bot to get a new chat token.

Use this token to send messages from the command line to the telegram chat.

    curl -d "{\"token\":\"myChatToken\",\"msg\":\"hello from curl $(date)\"}" -H "Content-Type: application/json" localhost:8080

## Deploy

### Requirements

Environments variables

    TELEGRAM_TOKEN
    MONGODB_DB_URL
