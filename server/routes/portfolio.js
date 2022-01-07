const express = require('express');
const router = express.Router();

const portfolioControllers = require('../controllers/portfolio');
const validateMiddleware = require('../middleware/validate');
const validateCreate = require('../validations/portfolio/create');

// @route   Post api/portfolio/create
// @Access  Private
router.post('/create',
    // validateMiddleware(validateCreate),
    portfolioControllers.create
);

router.post('/edit',
    // validateMiddleware(validateCreate),
    portfolioControllers.edit
);

router.get('/',
  portfolioControllers.all,
);

router.delete('/:_id',
  portfolioControllers.delete,
);

router.post('/photo',
  portfolioControllers.photoDelete,
);

router.get('/:_id',
  portfolioControllers.view,
);

router.get('/selected/:_id',
  portfolioControllers.selected,
);


module.exports = router;
