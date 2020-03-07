const { dbCredentials } = require("./src/config/db.config");

module.exports = {
  awsDatabase: {
    client: "pg",
    connection: {
      host: dbCredentials.host,
      database: dbCredentials.database,
      user: dbCredentials.user,
      password: dbCredentials.password
    },
    pool: { min: 2, max: 12 }
  },

  development: {
    client: "sqlite3",
    connection: {
      filename: "./dev.sqlite3"
    }
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};
