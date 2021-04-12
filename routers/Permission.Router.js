
// Get required Node modules for this router.
const express = require('express');
const request = require('request');

const permissionRouter = express.Router();
const Permission = require('../models/Permission.Model');
// Missing user indicates public permission.
// Field 'can' will be either "view," "edit," or "own."

// NOTE: JWT Auth required, attaches requesting user for EOU. -- Ask Ethan.

// ======================================================================
// ROUTES
// ======================================================================

permissionRouter.get('/:id', (req, res) => {
  // Do stuff.
  res.send("/permissions/:id");
});

permissionRouter.post('/create', (req, res) => {
  // Do stuff.
  res.send("/permissions/create");
});

permissionRouter.post('/update/:id', (req, res) => {
  // Do stuff.
  res.send("/permissions/update/:id");
});

permissionRouter.delete('/delete/:id', (req, res) => {
  // Do stuff.
  res.send("/permissions/delete/:id");
});


// Export the routes.
module.exports = permissionRouter;