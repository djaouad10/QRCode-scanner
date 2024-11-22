const express = require("express");
const {
  teacherAuthMiddleware,
  studentAuthMiddleware,
  adminAuthMiddleware,
  authMiddleware,
} = require("../middlewares/Auth");
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
  .post(authMiddleware, teacherAuthMiddleware, createClass)
  .get(authMiddleware, teacherAuthMiddleware, getClassesOfTeacher);
router
  .route("/:id")
  .put(
    authMiddleware,
    teacherAuthMiddleware,
    classBelongsToTeacher,
    updateClass
  )
  .delete(
    authMiddleware,
    teacherAuthMiddleware,
    classBelongsToTeacher,
    deleteClass
  )
  .get(
    authMiddleware,
    teacherAuthMiddleware,
    classBelongsToTeacher,
    getSingleClass
  );
router
  .route("/:id/students")
  .get(
    authMiddleware,
    teacherAuthMiddleware,
    classBelongsToTeacher,
    getStudentsOfClass
  );

router
  .route("/register")
  .post(authMiddleware, studentAuthMiddleware, scanAuth, registerToClass);

router
  .route("/admin/groups/:grpId")
  .get(authMiddleware, adminAuthMiddleware, getClassesOfGroup);
router
  .route("/admin/:id")
  .get(authMiddleware, adminAuthMiddleware, getSingleClass);
router
  .route("/admin/:id/students")
  .get(authMiddleware, adminAuthMiddleware, getStudentsOfClass);

module.exports = router;
