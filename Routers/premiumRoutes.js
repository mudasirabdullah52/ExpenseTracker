const express = require('express');
const authnticateUser = require('../Middleware/auth');
const premiumController = require('../Controllers/premiumController');

const router = express.Router();

router.get("/leaderBoard", premiumController.getLeaderBoard);
router.get("/showLeaderBoard", authnticateUser.authenticate, premiumController.getLeaderBoardData);
module.exports = router;