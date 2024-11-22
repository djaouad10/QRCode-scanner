const express = require("express");

const {
  getAllModules,
  getTeacherModules,
  createModule,
  deleteModule,
  updateModule,
} = require("../controllers/module");
const {
  authMiddleware,
  teacherAuthMiddleware,
  adminAuthMiddleware,
} = require("../middlewares/Auth");
const router = express.Router();

router
  .route("/mymodules")
  .get(authMiddleware, teacherAuthMiddleware, getTeacherModules);
router
  .route("/")
  .get(authMiddleware, adminAuthMiddleware, getAllModules)
  .post(authMiddleware, adminAuthMiddleware, createModule);
router
  .route("/:id")
  .put(authMiddleware, adminAuthMiddleware, updateModule)
  .delete(authMiddleware, adminAuthMiddleware, deleteModule);

module.exports = router;
