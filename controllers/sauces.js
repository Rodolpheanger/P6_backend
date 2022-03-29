const fs = require("fs");
const Sauce = require("../models/Sauce");

// Retourne l'ID d'une sauce par le paramètre id de l'URL
const getSauceId = (req) => {
  return req.params.id;
};

// Retourne les données d'une sauce sous forme d'objet selon son id dans la BDD
const findSauce = (sauceId) => {
  return Sauce.findOne({ _id: sauceId });
};

// Retourne l'id de l'utilisateur contenu dans la partie charge utile (payload) du token
const getAuthUserId = (req) => {
  console.log(req.auth.userId);
  return req.auth.userId;
};

// Retourne le message d'erreur avec un code HTTP 400
const badRequestError = (res, err) => {
  return res.status(400).json({ err });
};

// Tri de toutes les sauces par orde de fabricant (a-z) puis de puissance (heat)
const sortByManufacturerAndHeat = (sauces) => {
  const sortSauces = (a, b) => {
    aLow = a.manufacturer.toLowerCase();
    bLow = b.manufacturer.toLowerCase();
    if (aLow < bLow) {
      return -1;
    }
    if (aLow > bLow) {
      return 1;
    }
    if (aLow === bLow) {
      return a.heat - b.heat;
    }
  };
  const sortedSauces = sauces.sort(sortSauces);
  return sortedSauces;
};

// Retourne toutes les sauces
exports.getAllSauces = async (req, res, next) => {
  try {
    const sauces = await Sauce.find();
    const sortedSauces = sortByManufacturerAndHeat(sauces);
    res.status(200).json(sortedSauces);
  } catch (err) {
    badRequestError(res, err);
  }
};

// Retourne une sauce selon son id en paramètre de l'url
exports.getOneSauce = async (req, res, next) => {
  const sauceId = getSauceId(req);
  try {
    const sauce = await findSauce(sauceId);
    res.status(200).json(sauce);
  } catch (err) {
    badRequestError(res, err);
  }
};

// Création d'une sauce
exports.createSauce = async (req, res, next) => {
  try {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });
    await sauce.save();
    res.status(201).json({ message: "Sauce créée avec succès!" });
  } catch (err) {
    badRequestError(res, err);
  }
};

// Retourne le message "Sauce modifiée avec succès !" avec code HTTP 200
const modifySuccessResponse = (res) => {
  return res.status(200).json({ message: "Sauce modifiée avec succès !" });
};

// Suppression de l'image d'une sauce u dossier "images"
const deleteSauceImage = (sauce) => {
  const filename = sauce.imageUrl.split("/images/")[1];
  fs.unlinkSync(`images/${filename}`);
};

// Modification d'une sauce avec ou sans modification de l'image (si modif image, l'ancienne est supprimée du dossier "images")
exports.modifySauce = async (req, res, next) => {
  const sauceId = getSauceId(req);
  if (req.file) {
    try {
      const sauce = await findSauce(sauceId);
      deleteSauceImage(sauce);
      await Sauce.updateOne(
        {
          _id: sauceId,
        },
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      );
      modifySuccessResponse(res);
    } catch (err) {
      res.status(404).json({ err });
    }
  } else {
    try {
      await Sauce.updateOne({ _id: sauceId }, { ...req.body });
      modifySuccessResponse(res);
    } catch (err) {
      badRequestError(res, err);
    }
  }
};

// Suppression d'une sauce et de son image du dossier "images"
exports.deleteSauce = async (req, res, next) => {
  const sauceId = getSauceId(req);
  const userId = getAuthUserId(req);
  try {
    const sauce = await findSauce(sauceId);
    if (!sauce) {
      return res.status(404).json({ error: new Error("Sauce non trouvée !") });
    }
    if (userId !== sauce.userId) {
      return res
        .status(401)
        .json({ error: new Error("Requête non autorisée !") });
    }
    deleteSauceImage(sauce);
    await Sauce.deleteOne({ _id: sauceId });
    res.status(200).json({ message: "Sauce supprimée avec succès !" });
  } catch (err) {
    badRequestError(res, err);
  }
};

// Ajoute un like sur une sauce
const addLike = async (sauceId, req, res) => {
  try {
    await Sauce.updateOne(
      { _id: sauceId },
      { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
    );
    res.status(201).json({ message: "Like ajouté avec succès !" });
  } catch (err) {
    badRequestError(res, err);
  }
};

// Ajoute un dislike sur une sauce
const addDislike = async (sauceId, req, res) => {
  try {
    await Sauce.updateOne(
      { _id: sauceId },
      { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
    );
    res.status(201).json({ message: "Dislike ajouté avec succès !" });
  } catch (err) {
    badRequestError(res, err);
  }
};

// Retire un like sur une sauce
const removeLike = async (sauceId, req, res) => {
  try {
    await Sauce.updateOne(
      { _id: sauceId },
      { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
    );
    res.status(200).json({ message: "Like retiré avec succès !" });
  } catch (err) {
    badRequestError(res, err);
  }
};

// Retire un dislike sur une sauce
const removeDislike = async (sauceId, req, res) => {
  try {
    await Sauce.updateOne(
      { _id: sauceId },
      { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
    );
    res.status(200).json({ message: "Dislike retiré avec succès !" });
  } catch (err) {
    badRequestError(res, err);
  }
};

// Ajoute ou retire un like ou un dislike selon le contenu de la requête
exports.likeOrDislikeSauce = async (req, res, next) => {
  const sauceId = getSauceId(req);
  try {
    const sauce = await findSauce(sauceId);
    if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
      addLike(sauceId, req, res);
    } else if (
      !sauce.usersDisliked.includes(req.body.userId) &&
      req.body.like === -1
    ) {
      addDislike(sauceId, req, res);
    } else if (
      sauce.usersLiked.includes(req.body.userId) &&
      req.body.like === 0
    ) {
      removeLike(sauceId, req, res);
    } else if (
      sauce.usersDisliked.includes(req.body.userId) &&
      req.body.like === 0
    ) {
      removeDislike(sauceId, req, res);
    }
  } catch (err) {
    badRequestError(res, err);
  }
};
