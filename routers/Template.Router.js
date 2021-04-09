
// Get required Node modules for this router.
const express = require('express');
const templateRouter = express.Router();

// ======================================================================
// ROUTES
// ======================================================================

templateRouter.get('/', (req, res) => {
  // Do stuff.
  res.send("Template works!");
});


// Export the routes.
module.exports = templateRouter;