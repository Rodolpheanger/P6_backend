const express = require("express");
const router = express.Router();
const requestSauceDataChecker = require("../middleware/sauce-data-checker");
const requestLikeDataChecker = require("../middleware/like-data-checker");
const sauceCtrl = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Route pour retourner toutes les sauces de la BDD
router.get("/", auth, sauceCtrl.getAllSauces);

// Route pour retourner une sauce de la BDD selon son id MongoDB
router.get("/:id", auth, sauceCtrl.getOneSauce);

// Route pour créer une sauce et l'ajouter à la BDD
router.post(
  "/",
  auth,
  multer,
  requestSauceDataChecker.checkSauceData,
  sauceCtrl.createSauce
);

// Route pour modifier une sauce
router.put(
  "/:id",
  auth,
  multer,
  requestSauceDataChecker.checkSauceData,
  sauceCtrl.modifySauce
);

// Route pour supprimer un sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);

// Route pour ajouter ou retirer un like ou un dislike
router.post(
  "/:id/like",
  auth,
  requestLikeDataChecker.checkLikeData,
  sauceCtrl.likeOrDislikeSauce
);

module.exports = router;
