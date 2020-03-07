const { Router } = require("express");
const router = Router();

const userController = require("./user.controller");

router.post("/signup", userController.signUp);
router.post("/verifyUser", userController.verifyUser);
router.post("/resendOtp", userController.resendVerification);
router.post("/login", userController.login);
router.get("/allUsers", userController.getAllUsers);

module.exports = router;
