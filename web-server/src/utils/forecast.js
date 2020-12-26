const axios = require("axios");

const WEATHER_STACK_API_KEY = "368ac056bbe1cbd650c131592b509529";

const forecast = (lon, lat, cb) => {
  axios
    .get(
      `http://api.weatherstack.com/current?access_key=${WEATHER_STACK_API_KEY}&query=${lat},${lon}`
    )
    .then(({ data }) => {
      if ("error" in data) {
        cb(data.error.info);
      } else {
        const {
          current: { temperature, feelslike, weather_descriptions, humidity }
        } = data;
        cb(
          null,
          `${weather_descriptions}. It is currently ${temperature} degrees out. It feels like ${feelslike} degrees out. The humidity is ${humidity}%.`
        );
      }
    })
    .catch(error => {
      cb("Unable to connect to the Weather Stack service");
    });
};

module.exports = forecast;
