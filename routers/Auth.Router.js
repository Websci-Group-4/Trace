
// Get required Node modules for this router.
const express = require('express');
const request = require('request');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = require('../models/User.Model');
const authRouter = express.Router();
const authenticate = require('../middleware/authenticate')
// ======================================================================
// ROUTES
// ======================================================================

// Written by: Quadir Russell.
authRouter.post('/register', (req, res) => {
  // 1. Hash the password.
  bcrypt.hash(req.body.password, 10, (err, hashedPass) => {
    if(err) {
      res.json({ error: err });
    }

    // 2. Create a new User document.
    let user = new User({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPass,
      organization: req.body.organization,
      role: req.body.role
    });

    // 3. Save the User document to the database.
    user.save((saveErr) => {
      if(saveErr) {
        res.json({
          message: saveErr.toString()
        });
      } else {
        res.json({
          message : 'User added successfully!'
        });
      }
    });
  })
});

// Written by: Quadir Russell.
authRouter.post('/login', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ email: email }, (userErr, user) => {
    // Case: There was an error.
    if(userErr || !user) {
      res.json({
        message: 'Email or password is incorrect.'
      });
    }
    // Case: User is found.
    else {
      // Check if the password matches.
      bcrypt.compare(password, user.password, (passErr, result) => {
        if(result) {
          let token = jwt.sign({ name: user.name }, ')Cactusman1220(', { expiresIn: '1h' });
          res.json({
            message: "Login Successful!",
            token: token
          });
        } else {
          res.json({
            message: 'Email or password is incorrect.'
          });
        }
      });
    }
  });
});


// Export the routes.
module.exports = authRouter;
