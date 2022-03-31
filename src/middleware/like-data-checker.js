const Joi = require("joi");

// Retourne le massage d'erreur "Format des données non valide !" et un code HTTP 400
const errorMessage = (res) => {
  return res.status(400).json({ message: "Format des données non valide !" });
};

// Schéma Joi "like" pour vérification des données reçue pour une requête like ou dislike sur une sauce
const likeJoiSchema = Joi.object({
  like: Joi.number().min(-1).max(1).integer().required(),
  userId: Joi.string().required().alphanum(),
}).options({ abortEarly: false });

// Vérifie que les données reçues dans la requête correspondent au schéma Joi "like"
exports.checkLikeData = (req, res, next) => {
  const checkedData = likeJoiSchema.validate(req.body);
  if (checkedData.error) {
    errorMessage(res);
  } else {
    next();
  }
};
