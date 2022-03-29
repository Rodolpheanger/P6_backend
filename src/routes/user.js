const express = require("express");
const router = express.Router();
const requestDataChecker = require("../middleware/data-checker");
const userCtrl = require("../controllers/user");

//  Route pour l'enregistrement (signup) d'un nouvel utilisateur
router.post("/signup", requestDataChecker.checkUserData, userCtrl.signup);

//  Route pour la connexion (login) d'un utilisateur existant dans la BDD
router.post("/login", requestDataChecker.checkUserData, userCtrl.login);

module.exports = router;
