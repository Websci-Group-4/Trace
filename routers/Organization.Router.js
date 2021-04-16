
// Get required Node modules for this router.
const express = require('express');
const request = require('request');
const csvConverter = require('json-2-csv');

const orgRouter = express.Router();
const Organization = require('../models/Organization.Model');
// "Has to be created through payment." -- Ask Ethan.

// NOTE: JWT Auth required, attaches requesting user for EOU. -- Ask Ethan.

// ======================================================================
// ROUTES
// ======================================================================

orgRouter.get('/get/:id', (req, res) => {
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

// ======================================================================
// LAB 6 ROUTES
// ======================================================================

// Returns a .csv file containing permission data at the organization level
// to help track and determine what organizations use Trace the most.
// By: Jacob Dyer
orgRouter.get('/power', async (req, res) => {
  // Get the aggregated MongoDB data.
  let organizationPower = await Organization.aggregate()
    .lookup({ from: 'users', localField: 'users', foreignField: '_id', as: 'users' })
    .lookup({ from: 'permissions', localField: 'users.permissions', foreignField: '_id', as: 'permissions' })
    .unwind({ path: '$permissions', preserveNullAndEmptyArrays: false })
    .group({ _id: "$name",
       owned_images: { $sum: { $cond: [ { $eq: ["$permissions.can", "OWN"] }, 1, 0 ] } },
       editable_images: { $sum: { $cond: [ { $eq: ["$permissions.can", "EDIT"] }, 1, 0 ] } },
       viewable_images: { $sum: { $cond: [ { $eq: ["$permissions.can", "VIEW"] }, 1, 0 ] } }
     });

  // Convert the data to a .csv file and respond with it.
  csvConverter.json2csv(organizationPower, (error, csv) => {
    if(error) {
      console.log("[API] Failed! Error running aggregate query on our database.");
      res.json({
        status: 500,
        message: "Internal Server Error: Error running aggregate query on our database."
      });
    } else {
      res.send(csv);
    }
  });
});


// Export the routes.
module.exports = orgRouter;