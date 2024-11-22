const express = require("express");
const { authMiddleware, adminAuthMiddleware } = require("../middlewares/Auth");
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
  .get(
    authMiddleware,
    (req, res, next) => {
      const { user } = req;

      if (user && (user.role === "admin" || user.role === "student")) {
        return next();
      }
      throw new UnauthorizedErr("You're unauthorizd to access this recource");
    },
    getTeacherByModule
  )
  .post(authMiddleware, adminAuthMiddleware, createTeacher);

router
  .route("/:id")
  .put(authMiddleware, adminAuthMiddleware, updateTeacher)
  .delete(authMiddleware, adminAuthMiddleware, deleteTeacher);

module.exports = router;
