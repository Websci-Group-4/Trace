
// Get required Node Modules.
const express = require('express');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
const cors = require('cors');

// ======================================================================
// GETTING SEVER CONFIGURATION
// ======================================================================

const configPath = 'config.json';
const configEncoding = 'utf-8';

console.log(`\nRetrieving configuration data from '${configPath}'...`);
var config = JSON.parse(fs.readFileSync(configPath, configEncoding));
console.log(`Retrieval of configuration data from '${configPath}' SUCCESS.`);

// Set up the server according to configuration data.
const PORT = config.server.port;
const DIRECTORIES = config.server.static_directories;
const ROUTERS = config.server.routers;

// ======================================================================
// STATIC DIRECTORY SETUP
// ======================================================================

// Serve all listed static directories with Express.
console.log("\nServing static directories...");
for(var i = 0; i < DIRECTORIES.length; i++) {
  let path = DIRECTORIES[i].path;
  let mountPath = DIRECTORIES[i].mount_path;

  app.use(mountPath, express.static(__dirname + path));
  console.log(`Serving static directory '${path}' from mount '${mountPath}'`);
}
console.log("Serving static directories SUCCESS.");

// ======================================================================
// ROUTING SETUP
// ======================================================================

app.use(cors()); // Open CORS policy.

// Set up our landing page route.
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// Get all named routers and set them to their relevant paths.
console.log("\nLoading routers...");
for(var i = 0; i < ROUTERS.length; i++) {
  let path = ROUTERS[i].path;

  app.use(ROUTERS[i].route, require(path));
  console.log(`Loading Router '${ROUTERS[i].name}' at route ${path}`);
}
console.log("Loading routers SUCCESS.");

// ======================================================================
// SERVER SETUP
// ======================================================================

// Start the server.
var server = app.listen(PORT, function() {
  console.log("\nServer up on *:" + PORT.toString());
});