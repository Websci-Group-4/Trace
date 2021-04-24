// Get required Node modules for this router.
const express = require("express");
const request = require("request");

// Set up Python Shell.
var { PythonShell } = require("python-shell");
var pyOptions = {
  scriptPath: __dirname + "/../python",
};

// Create the router.
const imageRouter = express.Router();
const Image = require("../models/Image.Model");

// NOTE: JWT Auth required, attaches requesting user for EOU. -- Ask Ethan.

// ======================================================================
// ROUTES
// ======================================================================

// Retrieves an image by its ID.
imageRouter.get("/:id", (req, res) => {
  Image.findOne({ _id: `${req.params.id.toString()}` }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

// Creates an Image Document from the provided Base64 Data URL.
// By: Jacob Dyer
imageRouter.post("/create", (req, res) => {
  // 1. Convert the provided information into an Image Document.
  var newImage = new Image({
    url: req.body.image_url,
  });

  // 2. Verify that the Image is not in the database already.
  Image.findOne({ name: req.body.name }, (functionErr, document) => {
    if (document) {
      res.json({
        status: 400,
        message: "Bad Request: Image already exists in the database.",
      });
    } else {
      // 3. Send the Image document to the database.
      newImage.save((saveErr) => {
        if (saveErr) {
          res.json({
            status: 500,
            message:
              "Internal Error: Could not save the image to the database.",
          });
        } else {
          res.json(newFunction);
        }
      });
    }
  });
});

imageRouter.post("/update/:id", (req, res) => {
  const _id = req.params.id;
  const { url, title, description } = req.body;
  Image.updateOne({ _id }, { url, title, description }, function (err, img) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(img);
    }
  });
});

// Deletes the image from the database.  Returns the document one last time.
// By: Jacob Dyer
imageRouter.delete("/delete/:id", (req, res) => {
  Image.findOneAndDelete({ _id: req.params.id }, (err, document) => {
    if (document) {
      res.json(document);
    } else {
      res.json({
        status: 404,
        message: "Not Found: Could not find the Image in the database.",
      });
    }
  });
});

// Returns the message steganographically embedded -- whatever it may be.
// By: Jacob Dyer
imageRouter.post("/against", (req, res) => {
  // Create the Python Shell that will run this function.
  var pyShell = new PythonShell("decode.py", pyOptions);

  // Report the decoded result when done.
  pyShell.on("message", (result) => {
    res.json({
      payload: result.toString(),
    });
  });

  // Show errors on the server logs.
  pyShell.on("stderr", (result) => {
    console.log(result.toString());
    res.json({
      status: 400,
      message:
        "Malformed input: \
      Either the provided Base64 wasn't padded properly or the image wasn't fingerprinted by us.",
    });
  });

  // Close the shell when done.
  pyShell.on("close", (err) => {
    pyShell.end();
  });

  // Send the data to the program.
  pyShell.send(req.body.image);
});

// ======================================================================
// LAB 6 ROUTES
// ======================================================================

// Retrieves an image by its associated permission.
imageRouter.get("/permission/:perm", (req, res) => {
  Image.findOne(
    { permissions: { $all: [`${req.params.perm.toString()}`] } },
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        console.log(result);
        res.send(result);
      }
    }
  );
});

// By: Deepti Sachi
imageRouter.get("/deeptivis2/:id", function (req, res) {
  Image.find({ _id: `${req.params.id.toString()}` }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      var responseJSON = JSON.parse(JSON.stringify(result));
      // console.log(responseJSON);

      var start = new Date();
      var viewsByDate = [];
      let csvContent = "Date,Viewers\r\n";
      for (var i = 0; i < 15; i++) {
        let dateStr = start.getFullYear().toString() + "-";
        if ((start.getMonth() + 1).toString().length < 2) {
          dateStr = dateStr + "0" + (start.getMonth() + 1).toString() + "-";
        } else {
          dateStr = dateStr + (start.getMonth() + 1).toString() + "-";
        }
        if (start.getDate().toString().length < 2) {
          dateStr = dateStr + "0" + start.getDate().toString();
        } else {
          dateStr = dateStr + start.getDate().toString();
        }
        viewsByDate.push([dateStr, Math.floor(Math.random() * 10)]);
        let row = viewsByDate[i].join(",");
        csvContent += row + "\r\n";
        console.log(row);
        start.setTime(start.getTime() - 86400000);
      }
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + "image-viewers-" + Date.now() + '.csv"'
      );
      res.send(csvContent);
    }
  });
});

// ======================================================================

// Export the routes.
module.exports = imageRouter;
