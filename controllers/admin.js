const pool = require("../db/pool");

const getAllGroups = async (req, res, next) => {
  try {
    const data = await pool.query("SELECT * FROM groups");
    console.log(data);
    res.send(data.rows);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { getAllGroups };
