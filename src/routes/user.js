const express = require("express");
const router = express.Router();
const requestUserDataChecker = require("../middleware/user-data-checker");
const userCtrl = require("../controllers/user");

//  Route pour l'enregistrement (signup) d'un nouvel utilisateur
router.post("/signup", requestUserDataChecker.checkUserData, userCtrl.signup);

//  Route pour la connexion (login) d'un utilisateur existant dans la BDD
router.post("/login", requestUserDataChecker.checkUserData, userCtrl.login);

module.exports = router;
