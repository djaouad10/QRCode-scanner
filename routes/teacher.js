const express = require("express");
const { adminAuth } = require("../middlewares/Auth");
const router = express.Router();
const {
  getTeacherByModule,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacher");
const { UnauthorizedErr } = require("../errors");

router
  .route("/")
  .get((req, res, next) => {
    const { session } = req;
    if (
      session.user &&
      (session.user.role === "admin" || session.user.role === "student")
    ) {
      return next();
    }
    throw new UnauthorizedErr("You're unauthorizd to access this recource");
  }, getTeacherByModule)
  .post(adminAuth, createTeacher);

router
  .route("/:id")
  .put(adminAuth, updateTeacher)
  .delete(adminAuth, deleteTeacher);

module.exports = router;
