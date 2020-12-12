const axios = require("axios");

const MAP_BOX_API_KEY =
  "pk.eyJ1IjoiYXFhcmFpbjkyIiwiYSI6ImNraWpiYzlxajAxMzgyeXAyZGd6dDFyNHkifQ.WannHpd1JXi8MVAUtABOcw";

const geocode = (address, cb) => {
  axios
    .get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${MAP_BOX_API_KEY}&limit=1`
    )
    .then(({ data }) => {
      if (data.features.length === 0) {
        cb("Unable to find location. Try another search.");
      } else {
        const {
          features: [
            {
              center: [longitude, latitude],
              place_name: location
            }
          ]
        } = data;
        cb(null, {
          latitude,
          longitude,
          location
        });
      }
    })
    .catch(error => {
      cb("Unable to connect to the location service");
    });
};

module.exports = geocode;
