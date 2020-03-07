const Errors = require("../../errorHandler/MbError");

const userDao = require("./user.dao");

const bcrypt = require("bcrypt");

var moment = require("moment");

const getAllUsers = async () => {
  try {
    const allUsers = await userDao.getAllUsers();
    return allUsers;
  } catch (e) {
    console.error(`ERROR in service-getAllUsers(): ${e}`);
    throw e;
  }
};

const signUpUser = async userObj => {
  try {
    const identitymanagerid = 1,
      isactive = false,
      isverified = false,
      createdby = "SIGN_UP_EMAIL_PASSWORD_SELF_REGISTRATION",
      modifiedby = "SIGN_UP_EMAIL_PASSWORD_SELF_REGISTRATION",
      joiningdate = new Date(),
      lastlogin = new Date();

    userObj = {
      ...userObj,
      identitymanagerid,
      isactive,
      isverified,
      createdby,
      modifiedby,
      joiningdate
    };

    const hashedPassword = await getHashedPassword(userObj.password);
    userObj.password = hashedPassword;

    const randomInt = getRandomInteger();

    await userDao.CreateUpdateEmailVerification(userObj.email, randomInt);

    const user = await userDao.signUpUser(userObj);

    return user;
  } catch (e) {
    console.error(`ERROR in service-signUpUser: ${e}`);
    throw e;
  }
};

const loginUser = async userObj => {
  try {
    const email = userObj.email;
    const user = await userDao.getUserByEmail(email);

    const passwordMatch = await checkPasswordHash(
      userObj.password,
      user.password
    );

    if (passwordMatch) {
      const userReturn = {
        email: user.email,
        id: user.id,
        displayname: user.displayname,
        username: user.username,
        isactive: user.isactive,
        isverified: user.isverified,
        joiningdate: user.joiningdate
      };

      if (!userReturn.isverified) {
        throw new Errors.CustomValidationError("Email not verified!");
      } else if (!userReturn.isactive) {
        throw new Errors.CustomValidationError("Account is inactive");
      }

      return userReturn;
    }
  } catch (e) {
    console.error(`ERROR in service-loginUser: ${e}`);
    throw e;
  }
};

const verifyUser = async userObj => {
  try {
    const email = userObj.email;
    const otp = userObj.otp;
    let user = await userDao.getEmailVerificationObj(email);
    user = user[0];
    let currentTime = moment();
    let createdAtTime = moment(user.createdat);
    let delta = currentTime.diff(createdAtTime, "minutes");
    user.currentTime = currentTime;
    //user.createdAtTime = createdAtTime;
    user.delta = delta;
    //user.delta = (new Date() - user.createdat) / 1000;
    user.is_user_verified = false;
    let timeZoneDelta = 330; // 5.5 Hours
    let otpValidityTime = 5; //5 Mins

    if (otp != user.Otp) {
      throw new Errors.CustomValidationError("Entered OTP is invalid");
    }

    console.log(`delta: ${delta}`);
    console.log(`timeZoneDelta: ${timeZoneDelta}`);
    console.log(`otpValidityTime: ${otpValidityTime}`);

    const timeTotal = timeZoneDelta + otpValidityTime;
    if (delta > timeTotal) {
      throw new Errors.CustomValidationError("The OTP entered is expired");
    }

    const verifyEmail = await userDao.verifyUser(email);

    user.is_user_verified = true;

    return user;
  } catch (e) {
    console.error(`ERROR in service-verifyUser: ${e}`);
    throw e;
  }
};

const resendVerification = async userObj => {
  try {
    const email = userObj.email;

    const randomInt = getRandomInteger();
    let verificationObject = await userDao.CreateUpdateEmailVerification(
      email,
      randomInt
    );

    return verificationObject;
  } catch (e) {
    console.error(`ERROR in service-resendVerification: ${e}`);
    throw e;
  }
};

const getHashedPassword = rawPassword => {
  const saltRounds = 10;

  const hashed = bcrypt.hash(rawPassword, saltRounds);
  return hashed;
};

const checkPasswordHash = async (rawPassword, passwordHash) => {
  const match = await bcrypt.compare(rawPassword, passwordHash);

  if (match) {
    return true;
  } else {
    console.error("password hash match failed");
    throw new Errors.CustomValidationError("Incorrect Credentials");
    return false;
  }
};

const getRandomInteger = () => {
  return Math.floor(Math.random() * 100000 + 1);
};

module.exports = {
  getAllUsers,
  signUpUser,
  loginUser,
  verifyUser,
  resendVerification
};
