const pool = require("../db/pool");
const bcrypt = require("bcryptjs");
const { InvalidCredentialsErr, NotFoundErr } = require("../errors");

const getTeacherByModule = async (req, res, next) => {
  try {
    const { module } = req.query;

    let query =
      "SELECT id, firstname, lastname, email, departement, ARRAY_TO_JSON(levels) levels FROM teachers WHERE role = 'teacher'";
    if (module) {
      query = `${query} AND '${module}' = ANY(teachers.modules)`;
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
    const {
      firstname,
      lastname,
      email,
      password,
      departement,
      modules,
      levels,
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !departement ||
      !modules ||
      !levels
    ) {
      throw new InvalidCredentialsErr("Please provide all the required fields");
    }

    const emailInDB = await pool.query(
      "SELECT email FROM teachers WHERE email = $1",
      [email]
    );

    if (emailInDB.rows[0]) {
      return res.status(400).json({
        success: false,
        message: `Teacher already exists with an email: ${email}`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const query =
      "INSERT INTO teachers(firstname, lastname, email, hashedpassword, departement, modules, levels) VALUES($1, $2, $3, $4, $5, $6, $7)";

    const dbResponse = await pool.query(query, [
      firstname,
      lastname,
      email,
      hashedpassword,
      departement,
      modules,
      levels,
    ]);

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const updateTeacher = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password, levels } = req.body;

    const { id: teacherId } = req.params;

    if (!firstname || !lastname || !email || !levels) {
      throw new InvalidCredentialsErr("Please provide all the required fields");
    }

    const teacherInDB = await pool.query(
      "SELECT id FROM teachers WHERE id = $1",
      [teacherId]
    );

    if (!teacherInDB.rows[0]) {
      throw new NotFoundErr(`No teachers was found with id: ${teacherId}`);
    }

    let query =
      "UPDATE teachers SET email = $1, firstname = $2, lastname = $3, levels = $4";

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);

      query = `${query}, hashedpassword = '${hashedpassword}'`;
    }

    query = `${query} WHERE id = $5`;

    const updateTeacher = await pool.query(query, [
      email,
      firstname,
      lastname,
      levels,
      teacherId,
    ]);

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const deleteTeacher = async (req, res, next) => {
  try {
    const { id: teacherId } = req.params;

    const teacherInDB = await pool.query(
      "SELECT id FROM teachers WHERE id = $1",
      [teacherId]
    );

    if (!teacherInDB.rows[0]) {
      throw new NotFoundErr(`No teacher was found with id: ${teacherId}`);
    }

    const deleteTeacher = await pool.query(
      "DELETE FROM teachers WHERE id = $1",
      [teacherId]
    );

    res.status(200).json({ success: true });
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
