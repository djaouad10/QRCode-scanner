const pool = require("../db/pool");

const getTeacherByModule = async (req, res, next) => {
  try {
    const { module } = req.query;

    let query =
      "SELECT id, firstname, lastname, email, departement, levels FROM teachers";
    if (module) {
      query = `${query} WHERE '${module}' = ANY(teachers.modules)`;
    }

    query = `${query} ORDER BY firstname`;

    const teachers = await pool.query(query);

    res.status(200).json({
      success: true,
      teachers: teachers.rows,
      rowCount: teachers.rowCount,
    });
  } catch (error) {
    next(error);
  }
};

const createTeacher = async (req, res, next) => {
  try {
    res.send("admin Onlyyy");
  } catch (error) {
    next(error);
  }
};

const updateTeacher = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const deleteTeacher = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeacherByModule,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
