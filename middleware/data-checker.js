const { required } = require("joi");
const Joi = require("joi");
const fs = require("fs");

const errorMessage = (res) => {
  return res.status(400).json({ message: "Format des données non valide !" });
};
const userJoiSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).options({ abortEarly: false });

exports.checkUserData = (req, res, next) => {
  const checkedData = userJoiSchema.validate(req.body);
  if (checkedData.error) {
    errorMessage(res);
  } else {
    next();
  }
};

const sauceJoiSchema = Joi.object({
  name: Joi.string().required(),
  manufacturer: Joi.string().required(),
  description: Joi.string().required(),
  mainPepper: Joi.string().required(),
  heat: Joi.number().required().min(1).max(10),
  userId: Joi.string().required().alphanum(),
}).options({ abortEarly: false });

exports.checkSauceData = (req, res, next) => {
  if (req.file) {
    const checkedData = sauceJoiSchema.validate(JSON.parse(req.body.sauce));
    console.log(req.file.filename);
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
      console.log(checkedData.error);
      return errorMessage(res);
    } else {
      next();
    }
  }
};

const likeJoiSchema = Joi.object({
  like: Joi.number().min(-1).max(1).integer().required(),
  userId: Joi.string().required().alphanum(),
}).options({ abortEarly: false });

exports.checkLikeData = (req, res, next) => {
  const checkedData = likeJoiSchema.validate(req.body);
  if (checkedData.error) {
    errorMessage(res);
  } else {
    next();
  }
};
