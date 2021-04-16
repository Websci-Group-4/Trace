
// Get required Node modules for this router.
const express = require('express');
const request = require('request');

const permissionRouter = express.Router();
const Permission = require('../models/Permission.Model');

// NOTE: JWT Auth required, attaches requesting user for EOU. -- Ask Ethan.

// ======================================================================
// ROUTES
// ======================================================================

// Retrieves all permissions associated with a given user reference id.
// Written by: Jacob Dyer
permissionRouter.get('/:id', (req, res) => {
  console.log(`\n[API] GET REQUEST at ${req.originalUrl}`);

  // Attempt to retrieve the Permission from the database.
  Permission.findOne({ _id: req.params.id })
  .populate('user')
  .populate('image')
  .exec((err, doc) => {
    // Case: Permission is not found.  Return error.
    if(!doc) {
      console.log("[API] Failed! Permission was not found in our database.");
      res.json({
        status: 404,
        message: "Not Found: Could not find that permission in our database."
      });
    }
    // Case: Permission is found.  Return Permission in JSON format.
    else {
      console.log("[API] Success! Permission found in our database.");
      console.log("[API] JSON-formatted version of the Permission sent back.");
      console.log(document);
      res.json(document);
    }
  });
});

// Written by: Jacob Dyer
permissionRouter.post('/create', (req, res) => {
  console.log(`\n[API] GET REQUEST at ${req.originalUrl}`);

  // Verify that all needed input is provided.
  if(!req.body.user || !req.body.can || !req.body.image) {
    console.log("[API] Failed.  Missing 'user', 'can', or 'image' fields in JSON body.");
    res.json({
      status: 400,
      message: "Bad Request: Missing 'user', 'can', or 'image' fields in JSON body."
    });
  }
  // Case: All needed input is provided.
  else {
    // Make the permission.
    permission = new Permission({
      user: req.body.user,
      can: req.body.can,
      req: req.body.image
    });

    // Save the permission.
    permission.save((saveError) => {
      // Case: Permission is not saved.  Return error.
      if(saveError) {
        console.log("[API] Failed! Could not store Permission in database.");
        res.json({
          status: 500,
          message: "Internal Server Error: Could not store Permission in our database at this time."
        });
      }
      // Case: Permission is saved.  Respond with formatted Permission document.
      else {
        console.log("[API] Success! Document stored to database.");
        console.log("[API] JSON version of the document sent back.");
        res.json(permission);
      }
    });
  }
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