// this file will contain misc fuctions that we want to use in multiple templates

module.exports = {
  getError(errors, prop) {
    try {
      return errors.mapped()[prop].msg;
    } catch (err) {
      console.log(err);
      return "";
    }
  },
};
