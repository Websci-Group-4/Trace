
// Get required Node Modules.
const express = require('express');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
const cors = require('cors');

const mongoose = require('mongoose');

const nodeCleanup = require('node-cleanup');

// ======================================================================
// GET SEVER CONFIGURATION
// ======================================================================

const configPath = 'config.json';
const configEncoding = 'utf-8';

console.log(`\nRetrieving server configuration data from '${configPath}'...`);
var config = JSON.parse(fs.readFileSync(configPath, configEncoding));
console.log(`Retrieval of configuration data from '${configPath}' SUCCESS.`);

// ======================================================================
// SET UP STATIC DIRECTORIES
// ======================================================================

const DIRECTORIES = config.server.static_directories;

// Serve all listed static directories with Express.
console.log("");
for(var i = 0; i < DIRECTORIES.length; i++) {
  let path = DIRECTORIES[i].path;
  let mountPath = DIRECTORIES[i].mount_path;

  console.log(`Serving static directory '${path}' from mount '${mountPath}'`);
  app.use(mountPath, express.static(__dirname + path));
}
console.log("Serving static directories SUCCESS.");

// ======================================================================
// SET UP ROUTES
// ======================================================================

const ROUTERS = config.server.routers;

app.use(cors()); // Open CORS policy.
app.use(express.json()); // Ensures correct JSON input.

// Set up our landing page route.
app.get('/', function(req, res) {
  // Redirect to Angular's serving the site since that's
  // where we will use Angular's routing in our project.
  res.redirect(`http://localhost:${config.server.frontendPort}/`);
});

// Get all named routers and set them to their relevant paths.
console.log("");
for(var i = 0; i < ROUTERS.length; i++) {
  let path = ROUTERS[i].path;

  console.log(`Loading Router '${ROUTERS[i].name}' at route ${path}`);
  app.use(ROUTERS[i].route, require(path));
}
console.log("Loading routers SUCCESS.");

// ======================================================================
// CONNECT TO DATABASE
// ======================================================================

const DBURI = config.server.dbURI;
const DBNAME = config.server.dbName;

// Attempt to connect to the database.
console.log(`\nConnecting to database '${DBNAME}' with Mongoose...`);
mongoose.connect(DBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

// ======================================================================
// SET UP AND SERVE THE SERVER
// ======================================================================

const PORT = config.server.apiPort;

// Application starts if Node connects to our database successfully.
db.once('open', function() {
  console.log(`Mongoose connection to database '${DBNAME}' SUCCESS.`);

  // Start the server.
  var server = app.listen(PORT, function() {
    console.log("\nServer up on *:" + PORT.toString());
  });

  // Set up functionality to close the client connection when the server is stopped.
  nodeCleanup(function() {
    console.log("\nRunning shutdown process...");
    db.close(function(error) {
      if(error) {
        console.log(error);
      } else {
        console.log(`Closed Mongoose connection to '${DBNAME}'.`);
      }
    });
    server.close(function() {
      console.log("Server closed.");
    });
    nodeCleanup.uninstall(); // Cleanup function need only be run once.
    return false; // Allows time to perform asynchronous cleanup. 
  });
});

// Application fails if Node fails to connect to our database.
db.on('error', function() {
  console.log(`Mongoose connection to database '${DBNAME}' FAILED.`);
  throw new Error(`Unable to connect to MongoDB database '${DBNAME}'.`);
});