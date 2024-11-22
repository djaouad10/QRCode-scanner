const express = require("express");
const router = express.Router();
const {
  getStudentsOfaGroup,
  updateStudent,
  deleteStudent,
  createStudent,
} = require("../controllers/student");
const { authMiddleware, adminAuthMiddleware } = require("../middlewares/Auth");

router
  .route("/")
  .get(authMiddleware, adminAuthMiddleware, getStudentsOfaGroup)
  .post(authMiddleware, adminAuthMiddleware, createStudent);

router
  .route("/:id")
  .delete(authMiddleware, adminAuthMiddleware, deleteStudent)
  .put(authMiddleware, adminAuthMiddleware, updateStudent);

module.exports = router;
