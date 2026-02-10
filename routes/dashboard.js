const express = require('express');
const { getSummary, getToday } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/today', getToday);

module.exports = router;
