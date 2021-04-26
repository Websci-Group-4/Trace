
// Get required Node modules for this router.
const express = require('express');
const request = require('request');


const authRouter = express.Router();

const authController = require('../controllers/AuthController')


// ======================================================================
// ROUTES
// ======================================================================

// Input: Credentials
authRouter.post('/login', (req, res) => {
  // Do stuff.
  res.send("/auth/login");
});

// Input: Credentials
authRouter.post('/register', authController.register)


// Export the routes.
module.exports = authRouter;
