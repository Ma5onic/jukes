// init project
const express = require('express');
const bodyParser = require('body-parser');
const jukebox = require('./jukebox.js');
const app = express();

// for parsing application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended: true}));

app.post('/', function (request, response) {
  console.log(request.body);
  var requestText = request.body.text.split(' ');
  var command = requestText[0];
  var parameter = requestText[1];

  // Handle commands
  switch (command) {
    case 'create':
      jukebox.init()
        .then(function (roomUrl) {
          const message = {
            "response_type": "in_channel",
            "text": "Successfully started your jukes at " + roomUrl
          };

          response.send(message);
        });
      break;
    case 'play':
    case 'jam':
      jukebox.play()
        .then(function (message) {
          response.send(message);
        });
      break;
    case 'pause':
    case 'breakup':
      jukebox.pause()
        .then(function (message) {
          response.send(message);
        });
      break;
    case 'shuffle':
      jukebox.shuffle()
        .then(function (text) {
          const message = {
            "response_type": "in_channel",
            "text": text
          };

          console.log('shuffled', message);
          response.send(message);
        });
      break;
    case 'connect':
      jukebox.connect(parameter)
        .then(function (message) {
          response.send(message);
        });
      break;
    default:
      response.send('Want to `create` a room, `pause`, `play` a song or `shuffle`?');
  }
});

// listen for requests
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
