const express = require("express");
const { teacherAuth, studentAuth } = require("../middlewares/Auth");
const {
  createClass,
  updateClass,
  registerToClass,
} = require("../controllers/class");
const { classBelongsToTeacher, scanAuth } = require("../middlewares/classAuth");
const router = express.Router();

router.route("/").post(teacherAuth, createClass);
router.route("/register").post(studentAuth, scanAuth, registerToClass);
router.route("/:id").put(classBelongsToTeacher, updateClass);

module.exports = router;
