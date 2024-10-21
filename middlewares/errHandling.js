const CustomErr = require("../errors/CustomErr");

const errorHandlingMiddleware = (err, req, res, next) => {
  console.log(err);
  if (err instanceof CustomErr) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }
  return res
    .status(500)
    .json({ success: false, message: "Enternal server error" });
};

module.exports = errorHandlingMiddleware;
