const CustomErr = require("./CustomErr");

class UnauthorizedErr extends CustomErr {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedErr;
