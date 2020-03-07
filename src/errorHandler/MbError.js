const { errorCodes, errorTypes } = require("./errorCodes");

class MbError extends Error {
  constructor(
    message,
    errorObject = {},
    errorCode = "MB000",
    errorType = "T001",
    statusCode = 400
  ) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.errorObject = errorObject;
    this.errorCode = errorCode;
    (this.errorCodeDefinition = errorCodes[errorCode]
      ? errorCodes[errorCode]
      : "ERROR_CODE_NOT_DEFINED"),
      (this.errorType = errorType),
      (this.errorTypeDefinition = errorTypes[errorType]
        ? errorTypes[errorType]
        : "ERROR_TYPE_NOT_DEFINED");
  }
}

class MbJoiValidationError extends Error {
  constructor(message, joiObject = {}, statusCode = 422) {
    super();

    this.type = "JOI_VALIDATION_ERROR";
    this.statusCode = statusCode;
    this.message = message;
    this.joiObject = joiObject;
  }

  handleError(res) {
    const errorJson = {
      type: this.type,
      statusCode: this.statusCode,
      message: this.message,
      joiObject: this.joiObject
    };
    res.status(this.statusCode).json(errorJson);
  }
}

class CustomValidationError extends Error {
  constructor(message, errorObject = {}, statusCode = 422) {
    super();

    this.type = "CUSTOM_VALIDATION_ERROR";
    this.statusCode = statusCode;
    this.message = message;
    this.errorObject = errorObject;
  }

  handleError(res) {
    const errorJson = {
      type: this.type,
      statusCode: this.statusCode,
      message: this.message,
      errorObject: this.errorObject
    };
    res.status(this.statusCode).json(errorJson);
  }
}

class GeneralError extends Error {
  constructor(message, errorObject = {}, statusCode = 422) {
    super();

    this.type = "GENERAL_ERROR";
    this.statusCode = statusCode;
    this.message = message;
    this.errorObject = errorObject;
  }

  handleError(res) {
    const errorJson = {
      type: this.type,
      statusCode: this.statusCode,
      message: this.message,
      errorObject: this.errorObject
    };
    res.status(this.statusCode).json(errorJson);
  }
}

const MbErrorHandler = async (err, res) => {
  const {
    statusCode,
    message,
    errorObject,
    errorCode,
    errorCodeDefinition,
    errorType,
    errorTypeDefinition
  } = err;
  const errorJson = {
    status: "error",
    message,
    errorObject,
    errorCode,
    errorCodeDefinition,
    errorType,
    errorTypeDefinition
  };
  console.error(errorJson);
  res.status(400).json(errorJson);
};

// const MbErrorHandler = async (err, res) => {
//     const errorJson = {
//         status: "error",
//         message,
//         errorObject,
//         errorCode,
//         errorCodeDefinition,
//         errorType,
//         errorTypeDefinition
//     }
//     console.error(errorJson);
//     res.status(400).json(errorJson)

// }

module.exports = {
  MbError,
  MbErrorHandler,
  MbJoiValidationError,
  CustomValidationError,
  GeneralError
};
