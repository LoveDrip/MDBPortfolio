const Validator = require("validator");
const isEmpty = require("../is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.userId = !isEmpty(data.userId) ? data.userId : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!Validator.isLength(data.userId, { min: 2, max: 40 })) {
    errors.userId = "userId needs to between 2 and 4 characters";
  }

  if (Validator.isEmpty(data.userId)) {
    errors.userId = "Profile userId is required";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Skills field is required";
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Not a valid URL";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
