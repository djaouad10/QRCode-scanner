const express = require("express");
const { logInStudent, logInTeacher } = require("../controllers/login");
const { authMiddleware } = require("../middlewares/Auth");
const router = express.Router();

router.post("/student", logInStudent);
router.post("/teacher", logInTeacher);

module.exports = router;
