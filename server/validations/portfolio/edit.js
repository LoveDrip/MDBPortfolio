const Validator = require("validator");
const isEmpty = require("../is-empty");


module.exports = function validatePortfolioInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.price = !isEmpty(data.price) ? data.price : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.detail = !isEmpty(data.detail) ? data.detail : "";
  data.language = !isEmpty(data.language) ? data.language : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Project name is required";
  }

  if (Validator.isEmpty(data.price)) {
    errors.price = "Price field is required";
  }

  if (Validator.isEmpty(data.price)) {
    errors.price = "Price field is only numbers";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  }

  if (Validator.isEmpty(data.language)) {
    errors.language = "Parent Node field is required";
  }

  if (Validator.isEmpty(data.detail)) {
    errors.detail = "detail field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
