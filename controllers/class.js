const pool = require("../db/pool");
const { InvalidCredentialsErr } = require("../errors");
const { generateQRCode } = require("../utils");

const getClassesOfTeacher = async (req, res, next) => {
  try {
    const { id: teacherId } = req.session.user;
    const allClasses = await pool.query(
      "SELECT c.id, c.classdate, c.type , g.level grp_level , g.number grp_num, g.section grp_section, m.name module, t.firstname teacher_firstname, t.lastname teacher_lastname   FROM classes c JOIN groups g ON c.groupid = g.id JOIN teachers t ON c.teacherid = t.id JOIN modules m ON c.moduleid = m.id  WHERE teacherid = $1",
      [teacherId]
    );

    res.status(200).json({
      success: true,
      classes: allClasses.rows,
      rowCount: allClasses.rowCount,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentsOfClass = async (req, res, next) => {
  //use is in two end points, one for the teacher with the middleware and one for the admin
  try {
    const { id: classId } = req.params;

    //in the classBelongsToTeacher middleware we checked the existence of the class,
    //but this route handler is gonna be used in an admin endpoint too so we have to check
    //the existene of the class in the admin route too

    if (req.session.user.role == "admin") {
      const classInDB = await pool.query(
        "SELECT teacherid FROM classes WHERE id = $1",
        [classId]
      );

      if (!classInDB.rows[0]) {
        throw new NotFoundErr("The class you're looking for doesn't exist");
      }
    }

    const students = await pool.query(
      "SELECT s.firstname, s.lastname FROM students s JOIN registrations r ON r.studentid = s.id WHERE r.classid = $1",
      [classId]
    );

    res.status(200).json({
      success: true,
      students: students.rows,
      rowCount: students.rowCount,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleClass = async (req, res, next) => {
  //use is in two end points, one for the teacher with the middleware and one for the admin
  try {
    const { id: classId } = req.params;

    //in the classBelongsToTeacher middleware we checked the existence of the class,
    //but this route handler is gonna be used in an admin endpoint too so we have to check
    //the existene of the class in the admin route too

    if (req.session.user.role == "admin") {
      const classInDB = await pool.query(
        "SELECT teacherid FROM classes WHERE id = $1",
        [classId]
      );

      if (!classInDB.rows[0]) {
        throw new NotFoundErr("The class you're looking for doesn't exist");
      }
    }

    const singleClass = await pool.query(
      "SELECT c.id, c.classdate, c.type , c.dataurl, c.valid, c.starts_at, c.ends_at, c.semester, c.room, g.level grp_level , g.number grp_number, g.section grp_section, m.name module, t.firstname teacher_firstname, t.lastname teacher_lastname FROM classes c JOIN groups g ON c.groupid = g.id JOIN teachers t ON c.teacherid = t.id JOIN modules m ON c.moduleid = m.id WHERE c.id = $1",
      [classId]
    );

    res.status(200).json({ success: true, class: singleClass.rows[0] });
  } catch (error) {
    next(error);
  }
};

const getClassesOfGroup = async (req, res, next) => {
  //admin
  try {
    const { grpId } = req.params;

    const allClasses = await pool.query(
      "SELECT c.id, c.classdate, c.type , g.level grp_level , g.number grp_num, g.section grp_section, m.name module, t.firstname teacher_firstname, t.lastname teacher_lastname   FROM classes c JOIN groups g ON c.groupid = g.id JOIN teachers t ON c.teacherid = t.id JOIN modules m ON c.moduleid = m.id  WHERE g.id = $1",
      [grpId]
    );

    res.status(200).json({
      success: true,
      classes: allClasses.rows,
      rowCount: allClasses.rowCount,
    });
  } catch (error) {
    next(error);
  }
};

const createClass = async (req, res, next) => {
  try {
    //Validation
    const teacherId = req.session.user.id;
    const { groupId, moduleId, starts_at, ends_at, type, semester, room } =
      req.body;

    if (
      !groupId ||
      !moduleId ||
      !starts_at ||
      !ends_at ||
      !type ||
      !semester ||
      !room
    ) {
      throw new InvalidCredentialsErr("Please provide all the required fields");
    }
    //Create class and return it's id
    const query =
      "INSERT INTO classes(groupid, teacherid, moduleid, dataurl, starts_at, ends_at, type, semester, room) VALUES($1, $2, $3, NULL, $4, $5, $6, $7, $8) RETURNING id";

    const createClass = await pool.query(query, [
      groupId,
      teacherId,
      moduleId,
      starts_at,
      ends_at,
      type,
      semester,
      room,
    ]);

    //generate qrcode using class id
    const { id: classId } = createClass.rows[0];
    const qrcode = await generateQRCode(classId);

    if (!qrcode) {
      const deleteClass = await pool.query(
        "DELETE FROM classes WHERE id = $1",
        [classId]
      );

      throw new Error("Couldn't generate qr code");
    }

    //update the dataUrl to the qrcode
    const updateClass = await pool.query(
      "UPDATE classes SET dataUrl = $1 WHERE id = $2",
      [qrcode, classId]
    );

    res
      .status(201)
      .json({ success: true, message: "Class created successfully" });
  } catch (error) {
    next(error);
  }
};

const updateClass = async (req, res, next) => {
  try {
    //Check in a middleware or here if the class exists and belongs to that teacher
    const isValid = req.body.isValid ? true : false;
    const { id: classId } = req.params;

    const updateClass = await pool.query(
      "UPDATE classes SET valid = $1 WHERE id = $2",
      [isValid, classId]
    );

    res
      .status(200)
      .json({ success: true, message: "Class updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteClass = async (req, res, next) => {
  //Delete a class with all of it's registrations
  try {
    const { id: classId } = req.params;

    const deleteClass = await pool.query("DELETE FROM classes WHERE id = $1", [
      classId,
    ]);

    res.status(200).json({ success: true, message: "Class deleted" });
  } catch (error) {
    next(error);
  }
};

const registerToClass = async (req, res, next) => {
  //students
  try {
    const { classId } = req.body;
    const { id: studentId } = req.session.user;

    const registerToClass = await pool.query(
      "INSERT INTO registrations(studentid, classid) VALUES($1, $2)",
      [studentId, classId]
    );

    res
      .status(201)
      .json({ success: true, message: "Registration completed with success" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClassesOfGroup,
  getClassesOfTeacher,
  getSingleClass,
  getStudentsOfClass,
  updateClass,
  deleteClass,
  createClass,
  registerToClass,
};
