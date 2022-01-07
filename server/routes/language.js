const express = require('express');
const router = express.Router();

const languageControllers = require('../controllers/language');
const validateMiddleware = require('../middleware/validate');
const validateCreate = require('../validations/language/create.js');
const validateEdit = require('../validations/language/edit.js');


// @route   Post api/portfolio/create
// @Access  Private
router.post('/create',
    validateMiddleware(validateCreate),
    languageControllers.create
);

router.post('/edit',
    validateMiddleware(validateEdit),
    languageControllers.edit
);

router.get('/',
  languageControllers.current,
);

router.get('/:name',
  languageControllers.current,
);

router.delete('/:id',
  languageControllers.delete,
);

module.exports = router;
