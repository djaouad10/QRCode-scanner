const pool = require("../db/pool");
const { InvalidCredentialsErr } = require("../errors");
const { generateQRCode } = require("../utils");

const getClassesOfTeacher = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const getSingleClassOfTeacher = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const getStudentsOfClassOfTeacher = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const getClassesOfGroup = async (req, res, next) => {
  //admin
  try {
  } catch (error) {
    next(error);
  }
};

const getSingleClass = async (req, res, next) => {
  //admin
  try {
  } catch (error) {
    next(error);
  }
};

const getStudentsOfClass = async (req, res, next) => {
  //admin
  try {
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
  try {
  } catch (error) {
    next(error);
  }
};

const registerToClass = async (req, res, next) => {
  //students
  try {
    const { id: classId } = req.body;
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClassesOfGroup,
  getClassesOfTeacher,
  getSingleClass,
  getSingleClassOfTeacher,
  getStudentsOfClass,
  getStudentsOfClassOfTeacher,
  updateClass,
  deleteClass,
  createClass,
  registerToClass,
};
