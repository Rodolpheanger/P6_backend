const Joi = require("joi");

// Retourne le message d'erreur "Format des données non valide !" et un code HTTP 400
const errorMessage = (res) => {
  return res.status(400).json({ message: "Format des données non valide !" });
};

// Schéma Joi "user" pour vérification des données reçue pour une requête sur un utilisateur (POST: sign up et login). Application d'une regex sur le password pour empêcher certains des caractères spécifiques du NoSQL
const userJoiSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[^'"\/$\[\]>=]+$/i)
    .required(),
}).options({ abortEarly: false });

// Vérifie que les données reçues dans la requête correspondent au schéma Joi "user"
exports.checkUserData = (req, res, next) => {
  const checkedData = userJoiSchema.validate(req.body);
  if (checkedData.error) {
    errorMessage(res);
  } else {
    next();
  }
};
