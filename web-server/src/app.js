const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// creating express app
const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../src/templates/views");
const partialsPath = path.join(__dirname, "../src/templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Static Pages
// Setup static directory to serve
// First the app will look for the route match in the folder mentioned below which is 'public'
app.use(express.static(publicDirectoryPath));

// Dynamic pages
// If the route match is not found in 'public' then it looks for route matches here
app.get("", (req, res) => {
  res.render("index", { title: "Weather", name: "Atif Qayyum" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Me", name: "Atif Qayyum" });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    message: "This is a sample help message!",
    name: "Atif Qayyum"
  });
});

app.get("/weather", (req, res) => {
  const {
    query: { address }
  } = req;
  if (!address) return res.send({ error: "you must provide an address" });

  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) return res.send({ error });
    forecast(longitude, latitude, (err, forecastData) => {
      if (err) return res.send({ error: err });
      res.send({ forecast: forecastData, location, address });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Atif Qayyum",
    errorMessage: "Help article not found"
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Atif Qayyum",
    errorMessage: "Page not found"
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
