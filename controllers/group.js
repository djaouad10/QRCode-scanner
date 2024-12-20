const pool = require("../db/pool");
const { InvalidCredentialsErr, NotFoundErr } = require("../errors");

const getGroupsOfTeacher = async (req, res, next) => {
  try {
    //Groups in teacher.levels
    const { levels } = req.user;

    const query = "SELECT * FROM groups WHERE level = ANY($1)";
    const getGroups = await pool.query(query, [levels]);

    res.status(200).json({
      success: true,
      groups: getGroups.rows,
      rowCount: getGroups.rowCount,
    });
  } catch (error) {
    next(error);
  }
};

const getGroupsByLevel = async (req, res, next) => {
  try {
    const { level } = req.query;

    let query = "SELECT * FROM groups ";
    if (level) {
      query = `${query} WHERE level = '${level}'`;
    }
    query = `${query}  ORDER BY level`;

    const getGroups = await pool.query(query);

    res.status(200).json({
      success: true,
      groups: getGroups.rows,
      rowCount: getGroups.rowCount,
    });
  } catch (error) {
    next(error);
  }
};

const createGroup = async (req, res, next) => {
  try {
    const { level, section, number } = req.body;

    if (!level || !section || !number) {
      throw new InvalidCredentialsErr("Please provide all the required fields");
    }

    const groupInDB = await pool.query(
      "SELECT * FROM groups WHERE level = $1 AND section = $2 AND number = $3",
      [level, section, number]
    );
    console.log(groupInDB);
    if (groupInDB.rows[0]) {
      return res.status(400).json({
        success: false,
        message: `group already exists`,
      });
    }

    const createGroup = await pool.query(
      "INSERT INTO groups(level, section, number) VALUES($1, $2, $3)",
      [level, section, number]
    );

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const updateGroup = async (req, res, next) => {
  try {
    const { id: groupId } = req.params;
    const { level, section, number } = req.body;

    if (!level || !section || !number) {
      throw new InvalidCredentialsErr("Please provide all the required fields");
    }

    const groupInDB = await pool.query("SELECT id FROM groups WHERE id = $1", [
      groupId,
    ]);

    if (!groupInDB.rows[0]) {
      throw new NotFoundErr("Group doesn't exists");
    }

    const updateGroup = await pool.query(
      "UPDATE groups SET level = $1, section = $2, number = $3 WHERE id = $4",
      [level, section, number, groupId]
    );
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const deleteGroup = async (req, res, next) => {
  try {
    const { id: groupId } = req.params;

    const groupInDB = await pool.query("SELECT id FROM groups WHERE id = $1", [
      groupId,
    ]);

    if (!groupInDB.rows[0]) {
      throw new NotFoundErr("Group doesn't exists");
    }

    const deleteGroup = await pool.query("DELETE FROM groups WHERE id = $1", [
      groupId,
    ]);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGroupsByLevel,
  getGroupsOfTeacher,
  createGroup,
  deleteGroup,
  updateGroup,
};
