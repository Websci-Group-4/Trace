const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})
app.use(express.static(__dirname + '/public'));
app.listen(port, () => {
  console.log('Listening on *:3000');
})
