const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const {
  argv: [, , address]
} = process;
if (!address) return console.log("Please enter a location");

geocode(address, (error, { longitude, latitude, location } = {}) => {
  if (error) return console.log(`Error: ${error}`);
  forecast(longitude, latitude, (error, forecastData) => {
    if (error) return console.log("Error", error);
    console.log(location);
    console.log(forecastData);
  });
});
