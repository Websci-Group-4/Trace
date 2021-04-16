
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

//LAB 6 VISUALIZATION ROUTES

// for testing
// 60769e7fa2a1005304bbce4c USER
// 60769e85a2a1005304bbcea8 PERMISSION
// 60769e84a2a1005304bbce99 IMAGE
imageRouter.get('/deeptivis2/:id', function (req, res) {
  Image.find(
  { "_id": `${req.params.id.toString()}` },
  function(err, result) {
    if (err) {
      res.send(err);
    } else {      
      var responseJSON = JSON.parse(JSON.stringify(result));
      // console.log(responseJSON);
     
      var start = new Date();
      var viewsByDate = [];
      let csvContent = "Date,Viewers\r\n";
      for(var i = 0 ; i < 15; i++){
        let dateStr = start.getFullYear().toString() + "-";
        if((start.getMonth() + 1).toString().length < 2){
          dateStr = dateStr + "0" + (start.getMonth() + 1).toString() + "-";
        }else{
           dateStr = dateStr + (start.getMonth() + 1).toString() + "-";
        }
        if((start.getDate()).toString().length < 2){
          dateStr = dateStr + "0" + start.getDate().toString();
        }else{
          dateStr = dateStr + start.getDate().toString(); 
        }
        viewsByDate.push([dateStr , Math.floor(Math.random() * 10)]);
        let row = viewsByDate[i].join(",");
        csvContent += row + "\r\n";
        console.log(row);
        start.setTime(start.getTime() - 86400000);
      }
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'image-viewers-' + Date.now() + '.csv\"');
      res.send(csvContent);
    }
  }); 

});


// Export the routes.
module.exports = imageRouter;