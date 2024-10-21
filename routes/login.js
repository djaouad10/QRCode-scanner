const express = require("express");
const { logInStudent, logInTeacher } = require("../controllers/login");
const router = express.Router();

router.post("/student", logInStudent);
router.post("/teacher", logInTeacher);

module.exports = router;
