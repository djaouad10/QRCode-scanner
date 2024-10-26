const express = require("express");

const {
  getGroupsByLevel,
  getGroupsOfTeacher,
  createGroup,
  deleteGroup,
  updateGroup,
} = require("../controllers/group");
const { teacherAuth, adminAuth } = require("../middlewares/Auth");
const router = express.Router();

router.route("/mygroups").get(teacherAuth, getGroupsOfTeacher);
router.route("/").get(adminAuth, getGroupsByLevel).post(adminAuth, createGroup);
router.route("/:id").put(adminAuth, updateGroup).delete(adminAuth, deleteGroup);

module.exports = router;
