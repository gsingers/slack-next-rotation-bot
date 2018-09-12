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
