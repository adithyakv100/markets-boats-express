const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require("aws-sdk");
const request = require("request");
const jwkToPem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");
global.fetch = require("node-fetch");

const { MbError, MbErrorHandler } = require("../../errorHandler/MbError");

const { poolData, pool_region } = require("../../config/aws.cognito.config");

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const signupUser = userObj => {
  return new Promise(function(resolve, reject) {
    var attributeList = [];
    // attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:"sampleEmail@gmail.com"}));
    // attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:role",Value:"['admin','normal']"}));

    userPool.signUp(
      userObj.email,
      userObj.password,
      attributeList,
      null,
      function(err, result) {
        if (err) {
          reject(err);
        } else {
          cognitoUser = result.user;
          resolve(cognitoUser);
        }

        // console.log('user name is ' + cognitoUser.getUsername());
      }
    );
  });
};

function loginUser(userObj) {
  return new Promise(function(resolve, reject) {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      {
        Username: userObj.email,
        Password: userObj.password
      }
    );

    var userData = {
      Username: userObj.email,
      Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        // console.log('access token + ' + result.getAccessToken().getJwtToken());
        // console.log('id token + ' + result.getIdToken().getJwtToken());
        // console.log('refresh token + ' + result.getRefreshToken().getToken());

        const loginObject = {
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken()
        };

        console.dir(loginObject);

        resolve(loginObject);
      },
      onFailure: function(err) {
        console.log(err);

        reject(err);
      }
    });
  });
}

module.exports = {
  signupUser,
  loginUser
};
