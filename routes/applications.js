const express = require('express');
const {
    createApplication,
    getApplications,
    updateApplicationStatus
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createApplication)
    .get(getApplications);

router.put('/:id/status', updateApplicationStatus);

module.exports = router;
