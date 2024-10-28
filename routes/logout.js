const express = require("express");
const { UnauthorizedErr } = require("../errors");
const router = express.Router();

router.route("/").get(
  (req, res, next) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedErr("You have to log in first");
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Logout failed please try again" });
      }
      res.clearCookie("connect.sid").status(200).json({
        success: true,
        message: "You've been logged out successfully",
      });
    });
  }
);

module.exports = router;
