/**
 * Defines a Exception that is thrown when
 * Something happened in setting up the user
 */
class UserException {
  constructor(message, code = 400) {
      Object.assign(this, { message, code });
  }

  toString() {
      return 'User Exception';
  }
}

export { UserException };