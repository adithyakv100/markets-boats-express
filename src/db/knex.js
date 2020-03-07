const environment = process.env.DB || "awsDatabase";
const config = require("../../knexfile");
const environmentConfig = config[environment];
const knex = require("knex");
const connection = knex(environmentConfig);
console.log("Connected to DB");

module.exports = connection;
