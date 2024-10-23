const { UnauthorizedErr } = require("../errors/index");

const studentAuth = (req, res, next) => {
  const { session } = req;
  if (session.user && session.user.role === "student") {
    return next();
  }
  throw new UnauthorizedErr("You're unauthorizd to access this recource");
};

const teacherAuth = (req, res, next) => {
  const { session } = req;
  if (session.user && session.user.role === "teacher") {
    return next();
  }
  throw new UnauthorizedErr("You're unauthorizd to access this recource");
};

const adminAuth = (req, res, next) => {
  const { session } = req;
  if (session.user && session.user.role === "admin") {
    return next();
  }
  throw new UnauthorizedErr("You're unauthorizd to access this recource");
};

module.exports = { studentAuth, teacherAuth, adminAuth };
