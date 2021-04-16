// Get required Node modules for this router.
const express = require("express");
const request = require("request");

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
  // Do stuff.
  res.send("/organizations/create");
});

// Input: Updates
orgRouter.post("/update/:id", (req, res) => {
  // Do stuff.
  res.send("/organizations/update/:id");
});

orgRouter.delete("/delete/:id", (req, res) => {
  // Do stuff.
  res.send("/organizations/delete/:id");
});

// Export the routes.
module.exports = orgRouter;
