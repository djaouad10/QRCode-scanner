const pool = require("../db/pool");

const logInStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Please provide all credentials" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const logInTeacher = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all credentials" });
    }
    const teachers = pool.query("SELECT * FROM teachers WHERE email = $1", [
      email,
    ]);
    if (!teachers[0]) {
      return res
        .staus(404)
        .json({ success: false, message: "No user found with this email" });
    }

    if (password !== teachers[0].hashedpaswword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    res.session.user = teachers[0];
    res
      .status(200)
      .json({ success: true, message: `$Welcom {teachers[0].firstname}` });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { logInStudent, logInTeacher };
