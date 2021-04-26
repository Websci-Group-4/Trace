
// Get required Node modules for this router.
const express = require('express');
const request = require('request');


const authRouter = express.Router();

const authController = require('../controllers/AuthController')


// ======================================================================
// ROUTES
// ======================================================================

// Input: Credentials


// Input: Credentials
authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)


// Export the routes.
module.exports = authRouter;
