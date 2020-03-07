const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");

const { router } = require("./src/globalRouting");

var port = process.env.PORT || 3000;

const app = express();
console.log("created an express app");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.get("/", function(req, res) {
//   res.send({
//     Output: "Welcome to Markets-Boats. The server is up and running!"
//   });
// });

app.use("/api", router);

// app.post("/", function(req, res) {
//   res.send({
//     Output: "Welcome to Markets-Boats. The server is up and running!"
//   });
// });
//app.listen(port);

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
module.exports = app;
