const CustomErr = require("./CustomErr");

class InvalidCredentialsErr extends CustomErr {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = InvalidCredentialsErr;
