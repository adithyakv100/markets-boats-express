const express = require("express");

const router = express.Router();

const userRouter = require("./apps/User/user.routes");

router.use("/auth", userRouter);

// router.get("/", (req, res) => {
//   res.send("abcd");
// });

module.exports = {
  router
};
