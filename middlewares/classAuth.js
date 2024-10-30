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
    const { classId } = req.body;
    const { id: studentId, groupid: studentGroupId } = req.session.user;

    const classInDB = await pool.query(
      "SELECT valid, type, groupid FROM classes WHERE id = $1",
      [classId]
    );

    if (!classInDB.rows[0]) {
      throw new NotFoundErr("The class you're looking for doesn't exist");
    }

    if (
      classInDB.rows[0].type !== "Cours" &&
      studentGroupId !== classInDB.rows[0].groupid
    ) {
      throw new UnauthorizedErr(
        "You can't register in a class of a different group"
      );
    }

    if (!classInDB.rows[0].valid) {
      throw new UnauthorizedErr(
        "The class registrations are turned off by the teacher"
      );
    }

    const studentRegistred = await pool.query(
      "SELECT studentid FROM registrations WHERE studentid = $1 AND classid = $2",
      [studentId, classId]
    );

    if (studentRegistred.rows[0]) {
      throw new UnauthorizedErr("You have already registered in this class");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { classBelongsToTeacher, scanAuth };
