const { Router } = require("express");

const router = Router();

//const userRouter = require("./apps/User/user.routes");

//router.use("/auth", userRouter);

router.get("/", function(req, res) {
  res.send("abcd");
});

module.exports = {
  router
};
