const path = require("path");
const express = require("express");

// creating express app
const app = express();

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

// it let us configure what the app should do when someone tries to get a resource at a specific URL.
// May be we sending back HTML or JSON

app.get("/weather", (req, res) => {
  res.send({ forecast: "It is raining", location: "Lahore" });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
