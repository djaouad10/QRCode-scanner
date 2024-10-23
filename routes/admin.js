const express = require("express");
const router = express.Router();
const { getAllGroups } = require("../controllers/admin");
const { adminAuth } = require("../middlewares/Auth");

router.route("/").get(adminAuth, getAllGroups);

module.exports = router;
