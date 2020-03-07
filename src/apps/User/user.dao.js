const knex = require("../../db/knex");
const Errors = require("../../errorHandler/MbError");
const dbSchema = require("../../db/schemaTables");

module.exports = {
  async getAllUsers() {
    try {
      return await knex("users").select(
        "id",
        "email",
        "displayname",
        "username",
        "isactive",
        "isverified",
        "joiningdate"
      );
    } catch (e) {
      console.error(`ERROR in dao-getAllUsers(): ${e}`);
      throw new Errors.GeneralError("Error in dao-getAllUsers DB call", e);
    }
  },

  async signUpUser(obj) {
    try {
      const user = await knex("users")
        .where("username", obj.username)
        .orWhere("email", obj.email);
      if (user.length) {
        throw new Errors.CustomValidationError(
          "User with this username or email already exists"
        );
      }

      return await knex("users")
        .returning(["id", "email", "displayname", "username"])
        .insert(obj);
    } catch (e) {
      console.error(`ERROR in dao-signUpUser: ${e}`);
      if (e instanceof Errors.CustomValidationError) {
        throw e;
      }
      throw new Errors.GeneralError("Error in dao-signUpUser DB call", e);
    }
  },

  async getUserByEmail(email) {
    try {
      const user = await knex("users")
        .where("email", email)
        .select(
          "id",
          "email",
          "displayname",
          "username",
          "isactive",
          "isverified",
          "joiningdate",
          "password"
        );

      if (!user.length) {
        throw new Errors.CustomValidationError(
          "No user with this email exists"
        );
      }

      return user[0];
    } catch (e) {
      console.error(`ERROR in dao-getUserByEmail: ${e}`);
      if (e instanceof Errors.CustomValidationError) {
        throw e;
      }
      throw new Errors.GeneralError("Error in dao-getUserByEmail DB call", e);
    }
  },

  async CreateUpdateEmailVerification(email, randomNumber) {
    try {
      let _emailVerifications = dbSchema.EmailVerifications._tableName;
      let _email = dbSchema.EmailVerifications.email;
      let _otp = dbSchema.EmailVerifications.otp;

      const emailVerification = await knex(_emailVerifications)
        .where(_email, email)
        .select(_otp, _otp);

      if (emailVerification.length) {
        await knex(_emailVerifications)
          .where(_email, email)
          .update({ Otp: randomNumber, createdat: new Date() });
      } else {
        let insertObj = {};
        insertObj[`${_email}`] = email;
        insertObj[`${_otp}`] = randomNumber;
        const emailVerification = await knex(_emailVerifications)
          .returning([_email, _otp])
          .insert(insertObj);
      }
    } catch (e) {
      console.error(`ERROR in dao-CreateEmailVerification: ${e}`);
      throw new Errors.GeneralError(
        "Something went wrong while creating the email verification",
        e
      );
    }
  },
  async getEmailVerificationObj(email) {
    try {
      let _emailVerifications = dbSchema.EmailVerifications._tableName;
      let _email = dbSchema.EmailVerifications.email;
      let _otp = dbSchema.EmailVerifications.otp;
      let _timeStamp = dbSchema.EmailVerifications.createdAt;

      const emailVerification = await knex(_emailVerifications)
        .where(_email, email)
        .select("*");

      if (!emailVerification.length) {
        throw new Errors.CustomValidationError(
          `No email verification entry with the email: ${email}`
        );
      }

      return emailVerification;
    } catch (e) {
      console.error(`ERROR in dao-getEmailVerificationObj: ${e}`);
      throw new Errors.GeneralError(
        "Something went wrong while getEmailVerificationObj",
        e
      );
    }
  },

  async verifyUser(email) {
    try {
      let _emailVerifications = dbSchema.EmailVerifications._tableName;
      let _email = dbSchema.EmailVerifications.email;
      let _otp = dbSchema.EmailVerifications.otp;
      let _timeStamp = dbSchema.EmailVerifications.createdAt;

      const verifyEmail = await knex("users")
        .where("email", email)
        .update({ isactive: true, isverified: true });

      return verifyEmail;
    } catch (e) {
      console.error(`ERROR in dao-verifyEmail: ${e}`);
      throw new Errors.GeneralError(
        "Something went wrong while verifyUser -- verifying the User",
        e
      );
    }
  }

  // async isEmailConfirmed(email) {
  //   try {

  //     const user

  //     let _emailVerifications = dbSchema.EmailVerifications._tableName;
  //     let _email = dbSchema.EmailVerifications.email;
  //     let _otp = dbSchema.EmailVerifications.otp;

  //     const emailVerification = await knex(_emailVerifications)
  //       .where(_email, email)
  //       .select(_otp, _otp);

  //     if (emailVerification.length) {
  //       await knex(_emailVerifications)
  //         .where(_email, email)
  //         .update({ _otp: randomNumber });
  //     } else {
  //       let insertObj = {};
  //       insertObj[`${_email}`] = email;
  //       insertObj[`${_otp}`] = randomNumber;
  //       const emailVerification = await knex(_emailVerifications)
  //         .returning([_email, _otp])
  //         .insert(insertObj);
  //     }
  //   } catch (e) {
  //     console.error(`ERROR in dao-CreateEmailVerification: ${e}`);
  //     throw new Errors.GeneralError(
  //       "Something went wrong while creating the email verification",
  //       e
  //     );
  //   }
  // }
};
