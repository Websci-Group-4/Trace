
// Get required Node modules for this router.
const express = require('express');
const request = require('request');

const imageRouter = express.Router();
const Image = require('../models/Image.Model');
// Field 'views' inform the steganography layer.

// NOTE: JWT Auth required, attaches requesting user for EOU. -- Ask Ethan.

// ======================================================================
// ROUTES
// ======================================================================

imageRouter.get('/:id', (req, res) => {
  // Do stuff.
  res.send("/image/:id");

  // Note: Modifies views!
});

imageRouter.post('/create', (req, res) => {
  // Do stuff.
  res.send("/image/create");
});

imageRouter.post('/update/:id', (req, res) => {
  // Do stuff.
  res.send("/image/update/:id");
});

imageRouter.delete('/delete/:id', (req, res) => {
  // Do stuff.
  res.send("/image/delete/:id");
});

// Input: imgFile
imageRouter.post('/against/:id', (req, res) => {
  // Do stuff.
  res.send("/image/against/:id");
});

// Export the routes.
module.exports = imageRouter;