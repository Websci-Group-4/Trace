// Get required Node modules for this router.
const express = require("express");
const request = require("request");

const viewRouter = express.Router();
const View = require("../models/View.Model");
const User = require("../models/User.Model");
const Permission = require("../models/Permission.Model");

const d3 = require("d3");
const jsdom = require("jsdom");

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

viewRouter.get("/visualization", (req, res) => {
  // Do stuff.
  return View.find({}).then((vws) => {
    return User.find({}).then((users) => {
      return Permission.find({}).then((permissions) => {
        let views = [];
        vws.forEach((vw) =>
          views.push(
            new Promise((resolve, reject) => {
              resolve({
                _id: vw._id,
                time: vw.time,
                image: vw.image,
                user: users.find((usr) => usr._id.equals(vw.user)),
                perm: permissions.find(
                  (prm) =>
                    prm.image.equals(vw.image) && prm.user.equals(vw.user)
                ),
              });
            })
          )
        );
        var height = 400;
        var width = 900;
        var margin = { top: 100, right: 100, bottom: 100, left: 100 };
        return Promise.all(views).then((vws2) => {
          const data = [
            {
              y: "OWN",
              x: "Belongs to Org",
              value: vws2.filter(
                (a) => a.user.organization && a.perm.can === "OWN"
              ).length,
            },
            {
              y: "EDIT",
              x: "Belongs to Org",
              value: vws2.filter(
                (a) => a.user.organization && a.perm.can === "EDIT"
              ).length,
            },
            {
              y: "VIEW",
              x: "Belongs to Org",
              value: vws2.filter(
                (a) => a.user.organization && a.perm.can === "VIEW"
              ).length,
            },
            {
              y: "OWN",
              x: "No Org",
              value: vws2.filter(
                (a) => !a.user.organization && a.perm.can === "OWN"
              ).length,
            },
            {
              y: "EDIT",
              x: "No Org",
              value: vws2.filter(
                (a) => !a.user.organization && a.perm.can === "EDIT"
              ).length,
            },
            {
              y: "VIEW",
              x: "No Org",
              value: vws2.filter(
                (a) => !a.user.organization && a.perm.can === "VIEW"
              ).length,
            },
          ];
          var color = d3
            .scaleOrdinal(d3.schemeCategory10)
            .domain(data.map((d) => d.y));
          treemap = (data) =>
            d3
              .treemap()
              .round(true)
              .tile(d3.treemapSliceDice)
              .size([
                width - margin.left - margin.right,
                height - margin.top - margin.bottom,
              ])(
                d3
                  .hierarchy(
                    d3.group(
                      data,
                      (d) => d.x,
                      (d) => d.y
                    )
                  )
                  .sum((d) => d.value)
              )
              .each((d) => {
                d.x0 += margin.left;
                d.x1 += margin.left;
                d.y0 += margin.top;
                d.y1 += margin.top;
              });
          setEnv().then((window) => {
            var body = d3.select(window.document).select("body");

            const root = treemap(data);

            let x0 = Infinity;
            let x1 = -x0;

            root.each((d) => {
              if (d.x > x1) x1 = d.x;
              if (d.x < x0) x0 = d.x;
            });

            var format = (d) => d.toLocaleString();

            var svg = body
              .append("svg")
              .attr("viewBox", [0, 0, width, height])
              .style("font", "8px sans-serif");

            const node = svg
              .selectAll("g")
              .data(root.descendants())
              .join("g")
              .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

            const column = node.filter((d) => d.depth === 1);

            column
              .append("text")
              .attr("x", 3)
              .attr("y", "-1.7em")
              .style("font-weight", "bold")
              .text((d) => d.data[0]);

            column
              .append("text")
              .attr("x", 3)
              .attr("y", "-0.5em")
              .attr("fill-opacity", 0.7)
              .text((d) => format(d.value));

            column
              .append("line")
              .attr("x1", -0.5)
              .attr("x2", -0.5)
              .attr("y1", -30)
              .attr("y2", (d) => d.y1 - d.y0)
              .attr("stroke", "#000");

            const cell = node.filter((d) => d.depth === 2);

            cell
              .append("rect")
              .attr("fill", (d) => color(d.data[0]))
              .attr("fill-opacity", (d, i) => d.value / d.parent.value)
              .attr("width", (d) => d.x1 - d.x0 - 1)
              .attr("height", (d) => d.y1 - d.y0 - 1);

            cell
              .append("text")
              .attr("x", 3)
              .attr("y", "1.1em")
              .text((d) => d.data[0]);

            cell
              .append("text")
              .attr("x", 3)
              .attr("y", "2.3em")
              .attr("fill-opacity", 0.7)
              .text((d) => format(d.value));

            res.send(body.html());
          });
        });
      });
    });
  });
});

// Export the routes.
module.exports = viewRouter;
