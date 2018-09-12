# Slack Next in Rotation bot 

A dumb little bot that simply keeps track of a list of things and optionally rotates things.  I use this to keep track of weekly presenters.
It probably already exists somewhere else in the Slackverse, but so what?

## Usage

```javascript
git clone https://github.com/gsingers/slack-next-rotation-bot.git
cd slack-next-rotation-bot
npm install
```

Write your own configuration file (`config-example.js`) is a good starting point for building your own.

```javascript
var slackbot = require('./lib/bot');

var config = {

  bot_name: "whosnext",//Provide the name to post under
  token: 'XXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXX', // https://api.slack.com/web
  order_file: "./example-order.txt", //line separated list of the order
  post: true,
  verbose: true,
  rotate_cmd: "rotate",
  current_cmd: "current",
  next_cmd: "next",
  emoji: ":lucid:" // be sure to upload your custom emoji in slack
};

//DO NOT EDIT BELOW HERE
var slackbot = new slackbot.Bot(config);
slackbot.run();

```

Save this to a file in the root of the project then run your bot with:

    node your-config-file, eg.: node config-gsingers

This will launch the bot in your terminal based on provided configuration.

## Configuration

- `token`: Your Slack API token, get your token at https://api.slack.com/web
- Everything else is pretty self explanatory and not worht a mention.

## TODO
