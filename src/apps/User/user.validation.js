const Joi = require("@hapi/joi");
const Error = require("../../errorHandler/MbError");

const val_method = (value, helpers) => {
  if (!value.includes("@")) {
    throw new Error();
  }

  if (value === "something") {
    throw new Error("Invalid");
  }

  // Return the value unchanged
  return value;
};

const signupSchema = Joi.object({
  displayname: Joi.string().required(),
  username: Joi.string()
    .min(2)
    .required()
    .messages({
      "string.base": `username should be a type of 'text'`,
      "string.min": `username should have a minimum length of {#limit}`,
      "string.empty": `username cannot be an empty`
    }),
  email: Joi.string()
    .email()
    .min(3)
    .required()
    .custom(val_method)
    .messages({
      "string.base": `email should be a type of 'text'`,
      "string.empty": `email cannot be an empty field`,
      "string.min": `email should have a minimum length of {#limit}`,
      "string.email": `Email entered is invalid`,
      "any.custom": "The email should include an '@' in it"
    }),

  password: Joi.string()
    .min(8)
    .required()
    .messages({
      "string.empty": `password cannot be empty`,
      "string.min": `password should have a minimum length of {#limit}`
    })
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": `email should be a type of 'text'`,
      "string.empty": `email cannot be an empty field`,
      "string.email": `Email entered is invalid`
    }),

  password: Joi.string()
    .required()
    .messages({
      "string.empty": `password cannot be empty`
    })
});

const verifyUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": `email should be a type of 'text'`,
      "string.empty": `email cannot be an empty field`,
      "string.email": `Email entered is invalid`
    }),

  otp: Joi.string()
    .required()
    .messages({
      "string.empty": `otp cannot be empty`
    })
});

const resendVerificationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": `email should be a type of 'text'`,
      "string.empty": `email cannot be an empty field`,
      "string.email": `Email entered is invalid`
    })
});

const validateSignup = async requestBody => {
  try {
    let signUpObject = {};
    signUpObject.displayname = requestBody.displayname;
    signUpObject.username = requestBody.username;
    signUpObject.email = requestBody.email;
    signUpObject.password = requestBody.password;

    const { error, value } = await signupSchema.validateAsync(signUpObject, {
      abortEarly: false
    });

    if (!error) {
      return signUpObject;
    }
  } catch (e) {
    throw new Error.MbJoiValidationError("While validating SignUp", e);
  }
};

const validateLogin = async requestBody => {
  try {
    let loginObject = {};
    loginObject.email = requestBody.email;
    loginObject.password = requestBody.password;

    const { error, value } = await loginSchema.validateAsync(loginObject, {
      abortEarly: false
    });

    if (!error) {
      return loginObject;
    }
  } catch (e) {
    throw new Error.MbJoiValidationError("While validating Login", e);
  }
};

const validateVerifyUser = async requestBody => {
  try {
    let verifyObject = {};
    verifyObject.email = requestBody.email;
    verifyObject.otp = requestBody.otp;

    const { error, value } = await verifyUserSchema.validateAsync(
      verifyObject,
      {
        abortEarly: false
      }
    );

    if (!error) {
      return verifyObject;
    }
  } catch (e) {
    throw new Error.MbJoiValidationError(
      "While validating verify User schema",
      e
    );
  }
};

const validateResendVerification = async requestBody => {
  try {
    let ResendVerificationObject = {};
    ResendVerificationObject.email = requestBody.email;

    const { error, value } = await resendVerificationSchema.validateAsync(
      ResendVerificationObject,
      {
        abortEarly: false
      }
    );

    if (!error) {
      return ResendVerificationObject;
    }
  } catch (e) {
    throw new Error.MbJoiValidationError(
      "While validating validateResendVerification schema",
      e
    );
  }
};

module.exports = {
  validateSignup,
  validateLogin,
  validateVerifyUser,
  validateResendVerification
};
