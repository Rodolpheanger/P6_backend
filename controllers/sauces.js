const fs = require("fs");
const Sauce = require("../models/Sauce");

const findSauce = (sauceId) => {
  return Sauce.findOne({ _id: sauceId });
};

const getSauceId = (req) => {
  return req.params.id;
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
    res.status(400).json({ error });
  }
};

// Renvoi une sauce
exports.getOneSauce = async (req, res, next) => {
  const sauceId = getSauceId(req);
  try {
    const sauce = await findSauce(sauceId);
    res.status(200).json(sauce);
  } catch (err) {
    res.status(404).json({ err });
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
    res.status(400).json({ err });
  }
};

// Modification sauce
const modifySuccessResponse = (res) => {
  res.status(200).json({ message: "Sauce modifiée avec succès !" });
};

exports.modifySauce = async (req, res, next) => {
  const sauceId = getSauceId(req);
  const modifySuccess = modifySuccessResponse(res);
  if (req.file) {
    try {
      const sauce = await findSauce(sauceId);
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlinkSync(`images/${filename}`);
      await Sauce.updateOne(
        { _id: sauceId },
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      );
      modifySuccess;
    } catch (err) {
      res.status(404).json({ err });
    }
  } else {
    try {
      await Sauce.updateOne({ _id: sauceId }, { ...req.body });
      modifySuccess;
    } catch (err) {
      res.status(400).json({ err });
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
    res.status(400).json({ err });
  }
};

// Like sauce
exports.likeSauce = (req, res, next) => {
  const sauceId = getSauceId(req);
  findSauce(sauceId)
    .then((sauce) => {
      if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        Sauce.updateOne(
          { _id: sauceId },
          { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
        )
          .then(() =>
            res.status(201).json({ message: "Like ajouté avec succès !" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else if (
        !sauce.usersDisliked.includes(req.body.userId) &&
        req.body.like === -1
      ) {
        Sauce.updateOne(
          { _id: sauceId },
          { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
        )
          .then(() =>
            res.status(201).json({ message: "Dislike ajouté avec succès !" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else if (
        sauce.usersLiked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        Sauce.updateOne(
          { _id: sauceId },
          { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
        )
          .then(() =>
            res.status(200).json({ message: "Like retiré avec succès !" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else if (
        sauce.usersDisliked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        Sauce.updateOne(
          { _id: sauceId },
          { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
        )
          .then(() =>
            res.status(200).json({ message: "Dislike retiré avec succès !" })
          )
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ message: "KO !!!!" }));
};
