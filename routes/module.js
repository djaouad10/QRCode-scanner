const express = require("express");

const {
  getAllModules,
  getTeacherModules,
  createModule,
  deleteModule,
  updateModule,
} = require("../controllers/module");
const { teacherAuth, adminAuth } = require("../middlewares/Auth");
const router = express.Router();

router.route("/mymodules").get(teacherAuth, getTeacherModules);
router.route("/").get(adminAuth, getAllModules).post(adminAuth, createModule);
router
  .route("/:id")
  .put(adminAuth, updateModule)
  .delete(adminAuth, deleteModule);

module.exports = router;
