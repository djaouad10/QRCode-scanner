require("dotenv").config();
const pool = require("../db/pool");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { NotFoundErr, InvalidCredentialsErr } = require("../errors");

const logInStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new InvalidCredentialsErr("Please provide all credentials");
    }
    const students = await pool.query(
      "SELECT * FROM students WHERE email = $1",
      [email]
    );

    if (!students.rows[0]) {
      throw new NotFoundErr("No student was found with this email");
    }

    const isMatch = await bcrypt.compare(
      password,
      students.rows[0].hashedpassword
    );

    if (!isMatch) {
      throw new InvalidCredentialsErr("Invalid password");
    }

    const { id, role, groupid, firstname } = students.rows[0];
    const token = jwt.sign(
      { id, role, groupid, firstname },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );

    res.status(200).json({
      success: true,
      message: `Welcom ${students.rows[0].firstname}`,
      token,
      url: `/${role}`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const logInTeacher = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new InvalidCredentialsErr("Please provide all credentials");
    }
    const teachers = await pool.query(
      "SELECT id, firstname, lastname, email, hashedpassword, role ,departement, ARRAY_TO_JSON(levels) levels,  ARRAY_TO_JSON(modules) modules FROM teachers WHERE email = $1",
      [email]
    );
    if (!teachers.rows[0]) {
      throw new NotFoundErr("No teahcer was found with this email");
    }

    const isMatch = await bcrypt.compare(
      password,
      teachers.rows[0].hashedpassword
    );

    if (!isMatch) {
      throw new InvalidCredentialsErr("Invalid password");
    }

    const { id, role, levels, modules, firstname } = teachers.rows[0];
    const token = jwt.sign(
      { id, role, levels, modules, firstname },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );

    res.status(200).json({
      success: true,
      message: `Welcom ${teachers.rows[0].firstname}`,
      token,
      url: `/${role}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { logInStudent, logInTeacher };
