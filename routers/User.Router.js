
// Get required Node modules for this router.
const express = require('express');
const request = require('request');
const csvConverter = require('json-2-csv');

const userRouter = express.Router();
const User = require('../models/User.Model');
// Null 'Organization' indicates a native Trace user.
// Permission wall for any image access.

// NOTE: JWT Auth required, attaches requesting user for EOU. -- Ask Ethan.

// ======================================================================
// ROUTES
// ======================================================================

userRouter.get('/get/:id', (req, res) => {
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

// ======================================================================
// LAB 6 ROUTES
// ======================================================================

// Returns a .csv file containing permission data at the organization level
// to help track and determine what organizations use Trace the most.
// By: Jacob Dyer
userRouter.get('/powerusers', async (req, res) => {
  // Get the aggregated MongoDB data.
  let powerusers = await User.aggregate()
    .lookup({ from: 'permissions', localField: 'permissions', foreignField: '_id', as: 'permissions' })
    .unwind({ path: '$permissions', preserveNullAndEmptyArrays: false })
    .group({
      _id: { $concat: ["$firstName", " ", "$lastName"] },
      total_permissions: { $sum: 1 }
     });

  // Convert the data to a .csv file and respond with it.
  csvConverter.json2csv(powerusers, (error, csv) => {
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
module.exports = userRouter;