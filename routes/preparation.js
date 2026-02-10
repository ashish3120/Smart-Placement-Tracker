const express = require('express');
const {
    getPreparation,
    updatePreparation
} = require('../controllers/preparationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/:opportunity_id')
    .get(getPreparation)
    .put(updatePreparation);

module.exports = router;
