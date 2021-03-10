
const express = require('express');
const app = express();
const path = require('path');
const fs = require("fs");

const port = 3000;

// Bootstrap
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

// Load in external directories.
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/images'));

// ---- PREPARE API ----- //

// Load in our configuration data for anything that needs it.
var config_filesync = fs.readFileSync('config.json');
var config_json = JSON.parse(config_filesync);

// Get client_id for our Imgur Application.
const IMGUR_ID = config_json.imgur.clientid;

// ----- BEGIN API ------ //



// ------ END API ------- //

// Fundamental Route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Imgur Authorization Route handling.
app.get('/imgur', function(req, res){
  // Compose the Imgur authorization link and redirect the user to that instead.
  var auth_link = config_json.imgur.auth_endpoint;
    auth_link += "?client_id=" + IMGUR_ID;
    auth_link += "&response_type=" + config_json.imgur.response_type;
  res.redirect(auth_link);
});

// Listen at localhost:3000.
app.listen(port, () => {
  console.log('Listening on *:3000');

  // Run status checks.
  if(IMGUR_ID) console.log("Status - Imgur: Ready!");
});
