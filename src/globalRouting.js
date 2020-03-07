const { Router } = require("express");

const router = Router();

const userRouter = require("./apps/User/user.routes");

router.use("/auth", userRouter);

module.exports = {
  router
};
