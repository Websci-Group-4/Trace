
// Get required Node modules for this router.
const express = require('express');
const request = require('request');

const orgRouter = express.Router();
const Organization = require('../models/Organization.Model');
// "Has to be created through payment." -- Ask Ethan.

// NOTE: JWT Auth required, attaches requesting user for EOU. -- Ask Ethan.

// ======================================================================
// ROUTES
// ======================================================================

orgRouter.get('/:id', (req, res) => {
  // Do stuff.
  res.send("/organizations/:id");
});

// Input: Organization, Pay_Info
orgRouter.post('/create', (req, res) => {
  // Do stuff.
  res.send("/organizations/create");
});

// Input: Updates
orgRouter.post('/update/:id', (req, res) => {
  // Do stuff.
  res.send("/organizations/update/:id");
});

orgRouter.delete('/delete/:id', (req, res) => {
  // Do stuff.
  res.send("/organizations/delete/:id");
});


// Export the routes.
module.exports = orgRouter;