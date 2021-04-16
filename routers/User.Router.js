
// Get required Node modules for this router.
const express = require('express');
const request = require('request');

const userRouter = express.Router();
const User = require('../models/User.Model');
const Permission = require('../models/Permission.Model');
// Null 'Organization' indicates a native Trace user.
// Permission wall for any image access.

// NOTE: JWT Auth required, attaches requesting user for EOU. -- Ask Ethan.

// ROUTES

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

//LAB 6 VISUALIZATION ROUTES

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


// Export the routes.
module.exports = userRouter;
