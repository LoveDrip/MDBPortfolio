const Validator = require('validator');
const isEmpty = require('../is-empty');

module.exports = function validateLanguageInput(data) {
  let errors = {};
  let msg = "Error Editing Language";
  
  data.name = !isEmpty(data.name) ? data.name : "";
  data.id = !isEmpty(data.id) ? data.id : "";
  

  if (Validator.isEmpty(data.name)) {
    errors.editName = "Name field is required";
  }
  if (Validator.isEmpty(data.id)) {
    errors.id = "Not Selected language";
  }
  if (data.id == -1) {
    errors.editName = "Root name is not change";
  }

  return {
    errors,
    isValid: isEmpty(errors),
    msg
  };
};