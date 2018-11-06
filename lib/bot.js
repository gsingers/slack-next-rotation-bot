var _ = require('underscore');
var slack = require('./slacker');
var slackbot = require('node-slackbot');
var request = require('request');
var q = require('q');
var fs = require('fs');
var readline = require('readline');


/**
 * Slackbot to keep track of who's next.
 *
 *
 * See config-example.js for configuration
 *
 * To run:  node config-XXX.js   (where XXX is the name of your config
 *
 * See:
 * https://www.npmjs.com/package/node-slackbot
 * https://www.npmjs.com/package/jira
 */
var Bot = function (config) {
  this.config = _.defaults(config, {
    bot_name: "Who's Next",
    emoji: ":lucid:",
    order_file: "./example-order.txt",
    rotate_cmd: "rotate",
    current_cmd: "who's up?",
    next_cmd: "who's next?",
    post: true
  });
  this.slacker = new slack.Slacker(config);

  return this;
};


Bot.prototype.run = function () {
  var self = this,
      verbose = self.config.verbose,
      bot = new slackbot(this.config.token);

  function whos_next(msg, verbose) {
    var order_file = self.config.order_file;
    if (msg !== null && msg.text !== null && (msg.text.indexOf(self.config.current_cmd) !== -1 || msg.text.indexOf(self.config.next_cmd) !== -1 || msg.text.indexOf(self.config.rotate_cmd) !== -1)) {
      console.log(msg.text + " :: " + msg.text.indexOf(self.config.current_cmd) + " :: " + self.config.current_cmd + "::");
      console.log("Loading order from " + order_file);
      var i = 0;
      var first = "";
      var next = "";
      var new_text = "";
      //pop the first line out of the file that isn't a comment
      var lineReader = readline.createInterface({
        input: fs.createReadStream(order_file),
        crlfDelay: Infinity,
        terminal: false
      });
      lineReader.on('line', function (line) {
        if (verbose) {
          console.log('Line from file:', line);
        }
        if (i === 0) {
          first = line;
        } else if (i === 1) {
          next = line;
          new_text += line + "\n";//we still want this in the order it is, even if we rotate
        } else {
          new_text += line + "\n";
        }
        i++;
      });
      lineReader.on('close', function () {
        response = "";
        if (msg.text.indexOf(self.config.next_cmd) !== -1) {
          //get the next after the current item
          response = next + " is next in line after " + first;
        } else if (msg.text.indexOf(self.config.current_cmd) !== -1) {
          //get the current top of the list
          response = first + " is currently up."
        } else if (msg.text.indexOf(self.config.rotate_cmd) !== -1) {
          new_text += first;
          if (verbose) {
            console.log("Rotate:");
            console.log("first: " + first + " new: " + new_text);
            //append the first line to the end  and then write it back out
            console.log("writing out order to " + order_file);
          }
          fs.writeFile(order_file, new_text, function (err) {
            if (err) throw err;
            console.log('The file has been saved!');
          });
          response = "I've successfully rotated the list.";
        }
        //emit the response to the channel
        self.slacker.send('chat.postMessage', msg, {
          channel: msg.channel,
          parse: "all",
          text: response,
          username: self.config.bot_name,
          unfurl_links: false,
          link_names: 1,
          icon_emoji: self.config.emoji
        });
      })
    } else {
      self.slacker.send('chat.postMessage', msg, {
          channel: msg.channel,
          parse: "all",
          text: "I don't understand.  Please ask one of: " + self.config.current_cmd + ", " + self.config.next_cmd + ", or: " + self.config.rotate_cmd,
          username: self.config.bot_name,
          unfurl_links: false,
          link_names: 1,
          icon_emoji: self.config.emoji
        });
    }


  }

  bot.use(function (message, cb) {
    console.log(message);
    if ('message' === message.type && message.text != null
        && (message.text.indexOf("@" + self.config.bot_name) !== -1 || message.text.indexOf("@" + self.config.bot_id) !== -1 )) {
      whos_next(message, verbose);
      // @whosnext blah

      cb();
    }
  });
  bot.connect(self.config.verbose);

};

exports = module.exports.Bot = Bot;
