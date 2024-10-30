const express = require("express");
const { teacherAuth, studentAuth, adminAuth } = require("../middlewares/Auth");
const {
  createClass,
  updateClass,
  registerToClass,
  deleteClass,
  getClassesOfTeacher,
  getSingleClass,
  getClassesOfGroup,
  getStudentsOfClass,
} = require("../controllers/class");
const { classBelongsToTeacher, scanAuth } = require("../middlewares/classAuth");
const router = express.Router();

router
  .route("/")
  .post(teacherAuth, createClass)
  .get(teacherAuth, getClassesOfTeacher);
router
  .route("/:id")
  .put(teacherAuth, classBelongsToTeacher, updateClass)
  .delete(teacherAuth, classBelongsToTeacher, deleteClass)
  .get(teacherAuth, classBelongsToTeacher, getSingleClass);
router
  .route("/:id/students")
  .get(teacherAuth, classBelongsToTeacher, getStudentsOfClass);

router.route("/register").post(studentAuth, scanAuth, registerToClass);

router.route("/admin/groups/:grpId").get(adminAuth, getClassesOfGroup);
router.route("/admin/:id").get(adminAuth, getSingleClass);
router.route("/admin/:id/students").get(adminAuth, getStudentsOfClass);

module.exports = router;
