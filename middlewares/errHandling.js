const errorHandlingMiddleware = (err, req, res, next) => {
  console.log(err);
  res.status(200).json({ success: false, message: err.message });
};

module.exports = errorHandlingMiddleware;
