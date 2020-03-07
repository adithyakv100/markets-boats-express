var express = require("express");
var port = process.env.PORT || 3000;
var app = express();
app.get("/", function(req, res) {
  res.send({
    Output: "Welcome to Markets-Boats. The server is up and running!"
  });
});
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
