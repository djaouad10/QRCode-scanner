const pool = require("../db/pool");
const { NotFoundErr, UnauthorizedErr } = require("../errors");

const classBelongsToTeacher = async (req, res, next) => {
  try {
    const { id: classId } = req.params;
    const { id: teacherId } = req.session.user;

    const classInDB = await pool.query(
      "SELECT teacherid FROM classes WHERE id = $1",
      [classId]
    );

    if (!classInDB.rows[0]) {
      throw new NotFoundErr("The class you're looking for doesn't exist");
    }

    if (teacherId != String(classInDB.rows[0].teacherid)) {
      throw new UnauthorizedErr("You're not authorized to preform this action");
    }

    next();
  } catch (error) {
    next(error);
  }
};

const scanAuth = async (req, res, next) => {
  //Class exists?
  //Student is already registered?
  //is the class valid?
  //If class.type !== Cours check if student.groupid = class.groupid?

  try {
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { classBelongsToTeacher, scanAuth };
