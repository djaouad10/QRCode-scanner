const express = require("express");
const router = express.Router();
const {
  getStudentsOfaGroup,
  updateStudent,
  deleteStudent,
  createStudent,
} = require("../controllers/student");
const { adminAuth } = require("../middlewares/Auth");

router
  .route("/", adminAuth)
  .get(adminAuth, getStudentsOfaGroup)
  .post(adminAuth, createStudent);

router
  .route("/:id")
  .delete(adminAuth, deleteStudent)
  .put(adminAuth, updateStudent);

module.exports = router;
