const pool = require("../db/pool");
const bcrypt = require("bcryptjs");
const { NotFoundErr, InvalidCredentialsErr } = require("../errors");
const { query } = require("express");

//Teacher nd admin handlers
const getStudentsOfaClass = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

//admin handlers
const getStudentsOfaGroup = async (req, res, next) => {
  try {
    const { groupId } = req.query;

    let query =
      "SELECT s.id, s.firstname, s.lastname, s.email, g.section, g.number groupnum, g.level FROM students s JOIN groups g ON g.id = s.groupid";

    if (groupId) {
      query = `${query} WHERE s.groupid = '${groupId}'`;
    }

    query = `${query} ORDER BY firstname`;

    const { rows: students, rowCount } = await pool.query(query);

    res.status(200).json({ success: true, students: students, rowCount });
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password, groupid } = req.body;

    if (!firstname || !lastname || !email || !password || !groupid) {
      throw new InvalidCredentialsErr("Please provide all the required fields");
    }

    const emailInDB = await pool.query(
      "SELECT email FROM students WHERE email = $1",
      [email]
    );

    if (emailInDB.rows[0]) {
      return res.status(400).json({
        success: false,
        message: `Student already exists with an email: ${email}`,
      });
    }

    const groupIdInDB = await pool.query(
      "SELECT id FROM groups WHERE id = $1",
      [groupid]
    );

    if (!groupIdInDB.rows[0]) {
      throw new InvalidCredentialsErr(`No group was found with id: ${groupid}`);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    console.log(hashedpassword);
    const query =
      "INSERT INTO students(firstname, lastname, email, hashedpassword, groupid) VALUES($1, $2, $3, $4, $5::UUID)";
    const dbResponse = pool.query(query, [
      firstname,
      lastname,
      email,
      hashedpassword,
      groupid,
    ]);

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  //DOn't forget to hash the password here and use it in log in routes
  try {
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentsOfaClass,
  getStudentsOfaGroup,
  createStudent,
  updateStudent,
  deleteStudent,
};
