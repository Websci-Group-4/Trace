// Get required Node modules for this router.

const express = require("express");
const request = require("request");
const csvConverter = require("json-2-csv");

const orgRouter = express.Router();
const Organization = require("../models/Organization.Model");
const User = require("../models/User.Model");

const d3 = require("d3");
const jsdom = require("jsdom");
// "Has to be created through payment." -- Ask Ethan.

// NOTE: JWT Auth required, attaches requesting user for EOU. -- Ask Ethan.

// ======================================================================
// ROUTES
// ======================================================================

const setEnv = () =>
  new Promise((resolve, reject) =>
    jsdom.env({
      html: "<!DOCTYPE html><html><body></body></html>",
      features: { QuerySelector: true }, //you need query selector for D3 to work
      done: (errors, window) => (errors ? reject(errors) : resolve(window)),
    })
  );

orgRouter.get("/visualization", (req, res) => {
  // Do stuff.
  return Organization.find({}).then((orgs) => {
    return User.find({}).then((users) => {
      let organizations = [];
      orgs.forEach((org) =>
        organizations.push(
          new Promise((resolve, reject) => {
            resolve({
              name: org.name,
              children: users
                .filter((a) => org.users.includes(a._id))
                .map((usr) => ({
                  name: usr.firstName + " " + usr.lastName,
                  value: usr.permissions.length,
                })),
            });
          })
        )
      );
      var width = 975;
      var tree = (data) => {
        const root = d3.hierarchy(data);
        root.dx = 10;
        root.dy = width / (root.height + 1);
        return d3.tree().nodeSize([root.dx, root.dy])(root);
      };
      return Promise.all(organizations).then((resss) => {
        const data = {
          name: "Involvement",
          children: [
            ...resss,
            {
              name: "",
              children: users
                .filter((a) => !a.organization)
                .map((usr) => ({
                  name: usr.firstName + " " + usr.lastName,
                  value: usr.permissions.length,
                })),
            },
          ],
        };
        setEnv().then((window) => {
          var body = d3.select(window.document).select("body");

          const root = tree(data);

          let x0 = Infinity;
          let x1 = -x0;

          root.each((d) => {
            if (d.x > x1) x1 = d.x;
            if (d.x < x0) x0 = d.x;
          });

          var svg = body
            .append("div")
            .attr("class", "container")
            .append("svg")
            .attr("viewBox", [0, 0, width, x1 - x0 + root.dx * 2]);

          const g = svg
            .append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);

          const link = g
            .append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(root.links())
            .join("path")
            .attr(
              "d",
              d3
                .linkHorizontal()
                .x((d) => d.y)
                .y((d) => d.x)
            );

          const node = g
            .append("g")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .selectAll("g")
            .data(root.descendants())
            .join("g")
            .attr("transform", (d) => `translate(${d.y},${d.x})`);

          node
            .append("circle")
            .attr("fill", (d) => (d.children ? "#555" : "#999"))
            .attr("r", 2.5);

          node
            .append("text")
            .attr("dy", "0.31em")
            .attr("x", (d) => (d.children ? -6 : 6))
            .attr("text-anchor", (d) => (d.children ? "end" : "start"))
            .text((d) => d.data.name)
            .clone(true)
            .lower()
            .attr("stroke", "white");

          res.send(body.select(".container").html());
        });
      });
    });
  });
});

orgRouter.get("/:id", (req, res) => {
  // Do stuff.
  res.send("/organizations/:id");
});

// Input: Organization, Pay_Info
orgRouter.post("/create", (req, res) => {
  const { name, baseUrls } = req.body;
  Organization.create({ name, baseUrls }, function (err, org) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(org);
    }
  });
});

// Input: Updates
orgRouter.post("/update/:id", (req, res) => {
  const _id = req.params.id;
  const { name, baseUrls } = req.body;
  Organization.updateOne({ _id }, { name, baseUrls }, function (err, org) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(org);
    }
  });
});

orgRouter.delete("/delete/:id", (req, res) => {
  Organization.deleteOne({ _id: req.params.id }, function (err, org) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(org);
    }
  });
});

// ======================================================================
// LAB 6 ROUTES
// ======================================================================

// Returns a .csv file containing permission data at the organization level
// to help track and determine what organizations use Trace the most.
// By: Jacob Dyer
orgRouter.get("/power", async (req, res) => {
  // Get the aggregated MongoDB data.
  let organizationPower = await Organization.aggregate()
    .lookup({
      from: "users",
      localField: "users",
      foreignField: "_id",
      as: "users",
    })
    .lookup({
      from: "permissions",
      localField: "users.permissions",
      foreignField: "_id",
      as: "permissions",
    })
    .unwind({ path: "$permissions", preserveNullAndEmptyArrays: false })
    .group({
      _id: "$name",
      owned_images: {
        $sum: { $cond: [{ $eq: ["$permissions.can", "OWN"] }, 1, 0] },
      },
      editable_images: {
        $sum: { $cond: [{ $eq: ["$permissions.can", "EDIT"] }, 1, 0] },
      },
      viewable_images: {
        $sum: { $cond: [{ $eq: ["$permissions.can", "VIEW"] }, 1, 0] },
      },
    });

  // Convert the data to a .csv file and respond with it.
  csvConverter.json2csv(organizationPower, (error, csv) => {
    if (error) {
      console.log(
        "[API] Failed! Error running aggregate query on our database."
      );
      res.json({
        status: 500,
        message:
          "Internal Server Error: Error running aggregate query on our database.",
      });
    } else {
      res.send(csv);
    }
  });
});

// Export the routes.
module.exports = orgRouter;
