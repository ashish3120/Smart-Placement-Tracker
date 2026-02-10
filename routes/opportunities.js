const express = require('express');
const {
    createOpportunity,
    getOpportunities,
    getOpportunity,
    updateOpportunity,
    deleteOpportunity
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getOpportunities)
    .post(createOpportunity);

router.route('/:id')
    .get(getOpportunity)
    .put(updateOpportunity)
    .delete(deleteOpportunity);

module.exports = router;
