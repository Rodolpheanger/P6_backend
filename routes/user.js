const express = require("express");
const router = express.Router();
const requestDataChecker = require("../middleware/data-checker");

const userCtrl = require("../controllers/user");

router.post("/signup", requestDataChecker.validUserData, userCtrl.signup);
router.post("/login", requestDataChecker.validUserData, userCtrl.login);

module.exports = router;
