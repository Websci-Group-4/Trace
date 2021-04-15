
// Get required Node modules for this router.
const express = require('express');
const request = require('request');

const userRouter = express.Router();
const User = require('../models/User.Model');
// Null 'Organization' indicates a native Trace user.
// Permission wall for any image access.

// NOTE: JWT Auth required, attaches requesting user for EOU. -- Ask Ethan.

// ======================================================================
// ROUTES
// ======================================================================

userRouter.get('/:id', (req, res) => {
  // Do stuff.
  res.send("/users/:id");
});

userRouter.post('/create', (req, res) => {
  // Do stuff.
  res.send("/users/create");
});

userRouter.post('/update/:id', (req, res) => {
  // Do stuff.
  res.send("/users/update/:id");
});

userRouter.delete('/delete/:id', (req, res) => {
  // Do stuff.
  res.send("/users/delete/:id");
});


// Export the routes.
module.exports = userRouter;