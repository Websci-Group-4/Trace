
// Get required Node modules for this router.
const express = require('express');
const request = require('request');
const csvConverter = require('json-2-csv');

const userRouter = express.Router();
const User = require('../models/User.Model');
const Permission = require('../models/Permission.Model');
// Null 'Organization' indicates a native Trace user.
// Permission wall for any image access.

// NOTE: JWT Auth required, attaches requesting user for EOU. -- Ask Ethan.

// ROUTES

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

// for testing
// 60769e7fa2a1005304bbce4c USER
// 60769e85a2a1005304bbcea8 PERMISSION
// 60769e84a2a1005304bbce99 IMAGE
userRouter.get('/deeptivis1/:id', function (req, res) {
  var userid = `${req.params.id.toString()}`;
  User.find(
  { "_id": `${req.params.id.toString()}` },
  function(err, result) {
    if (err) {
      res.send(err);
    } else {
      console.log(result);
      var responseJSON = JSON.parse(JSON.stringify(result));
      var imagecsv = "id,";
      var testTags = ["sketch", "original", "patreon-only"];
      imagecsv += testTags.join(",") + "\r\n";

		Permission.find({ "_id": responseJSON[0].permissions },
		  function(err, result) {
		    if (err) {
		      res.send(err);
		    } else {
		      console.log(result);

		      for(var i = 0; i<result.length; i++){
		      	 let tags = [];
		      	 let imagearr = [];
		      	  imagearr.push(JSON.parse(JSON.stringify(result))[i].image);
				  for(var j = 0; j < 3; j++){
				    if( Math.floor(Math.random() * 2) == 1 ){
				      tags.push(1);
				    }else{
				      tags.push(0);
				    }
				  }

				  imagearr.push(tags.join(",") + "\r\n");
				  console.log(imagearr);
				  imagecsv += imagearr.join(",");
		      }
		      res.setHeader('Content-Type', 'text/csv');
		      res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'user-tags-' + Date.now() + '.csv\"');
		      res.send(imagecsv);
		    }
		});

    }
  });
});

//Written by Kenny Lee
userRouter.get('/kennyl', async (req, res) => {
  // Get the aggregated MongoDB data.
  let orgPeople = await Users.aggregate()
    .lookup({ from: 'users', localField: 'users', foreignField: '_id', as: 'users' })
    .unwind({ path: '$users', preserveNullAndEmptyArrays: false })
    .group({
      _id: "$organization",
      //countin the number of time each image appears
      numOfPeople: { $sum: { $cond: [ { $eq: ["$permissions.organisation", "$organization"] }, 1, 0 ] } },
     });

  csvConverter.json2csv(orgPeople, (error, csv) => {
    if(error) {
      console.log("Failed! Query is not valid.");
      res.json({
        status: 500,
        message: "Internal Server Error: Invalid Query"
      });
    } else {
      res.send(csv);
    }
  });
});

//Written by Kenny Lee
userRouter.get('/kennyl2', async (req, res) => {
  // Get the aggregated MongoDB data.
  let numImage = await Views.aggregate()
    .lookup({ from: 'views', localField: 'views', foreignField: '_id', as: 'views' })
    .unwind({ path: '$views', preserveNullAndEmptyArrays: false })
    .group({
      _id: "$image",
      //countin the number of time each image is viewed
      images1: { $sum: { $cond: [ { $eq: ["$permissions.image", "$image"] }, 1, 0 ] } },
     });

  csvConverter.json2csv(numUsers, (error, csv) => {
    if(error) {
      console.log("Failed! Query is not valid.");
      res.json({
        status: 500,
        message: "Internal Server Error: Invalid Query"
      });
    } else {
      res.send(csv);
    }
  });
});


// Export the routes.
module.exports = userRouter;
