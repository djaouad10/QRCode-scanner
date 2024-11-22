const express = require("express");

const {
  getGroupsByLevel,
  getGroupsOfTeacher,
  createGroup,
  deleteGroup,
  updateGroup,
} = require("../controllers/group");
const {
  authMiddleware,
  teacherAuthMiddleware,
  adminAuthMiddleware,
} = require("../middlewares/Auth");
const router = express.Router();

router
  .route("/mygroups")
  .get(authMiddleware, teacherAuthMiddleware, getGroupsOfTeacher);
router
  .route("/")
  .get(authMiddleware, adminAuthMiddleware, getGroupsByLevel)
  .post(authMiddleware, adminAuthMiddleware, createGroup);
router
  .route("/:id")
  .put(authMiddleware, adminAuthMiddleware, updateGroup)
  .delete(authMiddleware, adminAuthMiddleware, deleteGroup);

module.exports = router;
