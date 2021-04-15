
// Get required Node modules for this router.
const express = require('express');
const request = require('request');

const authRouter = express.Router();

// ======================================================================
// ROUTES
// ======================================================================

// Input: Credentials
authRouter.post('/login', (req, res) => {
  // Do stuff.
  res.send("/auth/login");
});

// Input: Credentials
authRouter.post('/signup', (req, res) => {
  // Do stuff.
  res.send("/auth/signup");
});


// Export the routes.
module.exports = authRouter;