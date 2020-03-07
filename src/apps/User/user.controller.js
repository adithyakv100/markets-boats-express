const requestValidators = require("./user.validation");
const { MbError, MbErrorHandler } = require("../../errorHandler/MbError");
const userService = require("./user.service");
const Error = require("../../errorHandler/MbError");
const jwtConfig = require("../../config/jwt.config");
var jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userService.getAllUsers();
    res.json(allUsers);
  } catch (e) {
    if (
      e instanceof Error.MbJoiValidationError ||
      e instanceof Error.CustomValidationError ||
      e instanceof Error.GeneralError
    ) {
      e.handleError(res);
    } else {
      res.status(400).json(e);
    }
  }
};

const signUp = async (req, res) => {
  try {
    let signUpObject = await requestValidators.validateSignup(req.body);

    let user = await userService.signUpUser(signUpObject);

    res.json(user);
  } catch (e) {
    if (
      e instanceof Error.MbJoiValidationError ||
      e instanceof Error.CustomValidationError ||
      e instanceof Error.GeneralError
    ) {
      e.handleError(res);
    } else {
      res.status(400).json(e);
    }
  }
};

const login = async (req, res) => {
  try {
    let loginObject = await requestValidators.validateLogin(req.body);

    let user = await userService.loginUser(loginObject);

    const jwtToken = signJwt(user);

    res.json({
      token: jwtToken
    });
  } catch (e) {
    if (
      e instanceof Error.MbJoiValidationError ||
      e instanceof Error.CustomValidationError ||
      e instanceof Error.GeneralError
    ) {
      e.handleError(res);
    } else {
      res.status(400).json(e);
    }
  }
};

const verifyUser = async (req, res) => {
  try {
    let verifyObject = await requestValidators.validateVerifyUser(req.body);

    let user = await userService.verifyUser(verifyObject);

    //const jwtToken = signJwt(user);

    res.json({
      emailVerification: user
    });
  } catch (e) {
    if (
      e instanceof Error.MbJoiValidationError ||
      e instanceof Error.CustomValidationError ||
      e instanceof Error.GeneralError
    ) {
      e.handleError(res);
    } else {
      res.status(400).json(e);
    }
  }
};

const resendVerification = async (req, res) => {
  try {
    let verifyObject = await requestValidators.validateResendVerification(
      req.body
    );

    let resendVerification = await userService.resendVerification(verifyObject);

    //const jwtToken = signJwt(user);

    res.json({
      message: resendVerification
    });
  } catch (e) {
    if (
      e instanceof Error.MbJoiValidationError ||
      e instanceof Error.CustomValidationError ||
      e instanceof Error.GeneralError
    ) {
      e.handleError(res);
    } else {
      res.status(400).json(e);
    }
  }
};

const signJwt = payload => {
  const jwtToken = jwt.sign(
    {
      ...payload
    },
    jwtConfig.jwtSecretKey,
    { expiresIn: jwtConfig.expiresAt }
  );

  return jwtToken;
};

const getUsers = () => {};

module.exports = {
  signUp,
  login,
  getAllUsers,
  verifyUser,
  resendVerification
};
