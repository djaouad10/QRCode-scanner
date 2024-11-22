require("dotenv").config();
const { UnauthorizedErr } = require("../errors/index");
const jwt = require("jsonwebtoken");

// const studentAuth = (req, res, next) => {
//   const { user } = req;
//   if (user && user.role === "student") {
//     return next();
//   }
//   throw new UnauthorizedErr("You're unauthorizd to access this recource");
// };

// const teacherAuth = (req, res, next) => {
//   const { user } = req;
//   if (user && user.role === "teacher") {
//     return next();
//   }
//   throw new UnauthorizedErr("You're unauthorizd to access this recource");
// };

// const adminAuth = (req, res, next) => {
//   const { user } = req;
//   if (user && user.role === "admin") {
//     return next();
//   }
//   throw new UnauthorizedErr("You're unauthorizd to access this recource");
// };

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new UnauthorizedErr("You're not authorized to access this resource");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

//Always used after the authMiddleware
const adminAuthMiddleware = (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

const teacherAuthMiddleware = (req, re, next) => {
  const { role } = req.user;
  if (role !== "teacher") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

const studentAuthMiddleware = (req, re, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

module.exports = {
  authMiddleware,
  studentAuthMiddleware,
  teacherAuthMiddleware,
  adminAuthMiddleware,
};
