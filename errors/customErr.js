class CustomErr extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = CustomErr;
