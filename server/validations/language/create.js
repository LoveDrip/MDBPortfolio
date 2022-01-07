const Validator = require('validator');
const isEmpty = require('../is-empty');

module.exports = function validateLanguageInput(data) {
  let errors = {};
  let msg = "Error Creating Language";
  
  data.name = !isEmpty(data.name) ? data.name : "";
  data.parent = !isEmpty(data.parent) ? data.parent : "";
  

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  if (Validator.isEmpty(data.parent)) {
    errors.parent = "Not Selected language";
  }

  return {
    errors,
    isValid: isEmpty(errors),
    msg
  };
};