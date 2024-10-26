const { Pool } = require("pg");

const pool = new Pool({
  user: "scannerapp",
  password: "mypassword", // Make sure this is the correct password
  host: "localhost",
  database: "AlgoProject",
  port: 5432,
});

module.exports = pool;
