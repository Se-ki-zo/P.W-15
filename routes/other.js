const router = require('express').Router();
// const path = require('path');

router.get('/*', () => {
  throw new Error('NotFound');
});

module.exports = router;
