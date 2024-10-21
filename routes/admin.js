const express = require("express");
const router = express.Router();
const { getAllGroups } = require("../controllers/admin");

router.route("/").get(getAllGroups);

module.exports = router;
