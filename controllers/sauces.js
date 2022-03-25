const fs = require("fs");
const Sauce = require("../models/Sauce");

const findSauce = (sauceId) => {
  return Sauce.findOne({ _id: sauceId });
};

const getSauceId = (req) => {
  return req.params.id;
};

const badRequestError = (res, err) => {
  return res.status(400).json({ err });
};

// Renvoi toutes les sauces
exports.getAllSauces = async (req, res, next) => {
  try {
    const sauces = await Sauce.find();
    const sortSauces = (a, b) => {
      return a.manufacturer.localeCompare(b.manufacturer);
    };
    res.status(200).json(sauces.sort(sortSauces));
  } catch (err) {
    badRequestError(res, err);
  }
};

// Renvoi une sauce
exports.getOneSauce = async (req, res, next) => {
  const sauceId = getSauceId(req);
  try {
    const sauce = await findSauce(sauceId);
    res.status(200).json(sauce);
  } catch (err) {
    badRequestError(res, err);
  }
};

// Création sauce
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

// Modification sauce
const modifySuccessResponse = (res) => {
  res.status(200).json({ message: "Sauce modifiée avec succès !" });
};

exports.modifySauce = async (req, res, next) => {
  const sauceId = getSauceId(req);
  if (req.file) {
    try {
      const sauce = await findSauce(sauceId);
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlinkSync(`images/${filename}`);
      await Sauce.updateOne({
        _id: sauceId,
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      });
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

// Suppression sauce
exports.deleteSauce = async (req, res, next) => {
  const sauceId = getSauceId(req);
  try {
    const sauce = await findSauce(sauceId);
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlinkSync(`images/${filename}`);
    await Sauce.deleteOne({ _id: sauceId });
    res.status(200).json({ message: "Sauce supprimée avec succès !" });
  } catch (err) {
    badRequestError(res, err);
  }
};

// Like sauce
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
