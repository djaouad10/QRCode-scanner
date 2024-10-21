const CustomErr = require("./CustomErr");

class NotFoundErr extends CustomErr {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundErr;
