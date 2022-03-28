const express = require("express");
const router = express.Router();
const requestDataChecker = require("../middleware/data-checker");

const userCtrl = require("../controllers/user");

router.post("/signup", requestDataChecker.checkUserData, userCtrl.signup);
router.post("/login", requestDataChecker.checkUserData, userCtrl.login);

module.exports = router;
