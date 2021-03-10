
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Bootstrap
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

// Load in external directories.
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/images'));

// Fundamental Route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log('Listening on *:3000');
});
