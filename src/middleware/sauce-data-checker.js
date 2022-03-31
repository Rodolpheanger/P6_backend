const Joi = require("joi");
const fs = require("fs");

// Retourne le massage d'erreur "Format des données non valide !" et un code HTTP 400
const errorMessage = (res) => {
  return res.status(400).json({ message: "Format des données non valide !" });
};

// Schéma Joi "sauce" pour vérification des données reçue pour une requête sur une sauce (PUT et DELETE)
const sauceJoiSchema = Joi.object({
  name: Joi.string().required(),
  manufacturer: Joi.string().required(),
  description: Joi.string().required(),
  mainPepper: Joi.string().required(),
  heat: Joi.number().required().min(1).max(10),
  userId: Joi.string().required().alphanum(),
}).options({ abortEarly: false });

// Vérifie que les données reçues dans la requête correspondent au schéma Joi "sauce" (si il y a une image mais que la vérification échoue, la nouvelle image crée par multer est supprimée du dossier "images")
exports.checkSauceData = (req, res, next) => {
  if (req.file) {
    const checkedData = sauceJoiSchema.validate(JSON.parse(req.body.sauce));
    if (checkedData.error) {
      const filename = req.file.filename;
      fs.unlinkSync(`images/${filename}`);
      return errorMessage(res);
    } else {
      next();
    }
  }
  if (!req.file) {
    const checkedData = sauceJoiSchema.validate(req.body);
    if (checkedData.error) {
      return errorMessage(res);
    } else {
      next();
    }
  }
};
