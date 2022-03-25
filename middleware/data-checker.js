const Joi = require("joi");

const errorMessage = (res) => {
  return res.status(400).json({ message: "Format des données non valide !" });
};
const userJoiSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.validUserData = (req, res, next) => {
  const checkedData = userJoiSchema.validate(req.body);
  if (checkedData.error) {
    errorMessage(res);
  } else {
    next();
  }
};

const sauceJoiSchema = Joi.object({
  sauce: {
    name: Joi.string().required(),
    manufacturer: Joi.string().required(),
    description: Joi.string().required(),
    mainPepper: Joi.string().required(),
    imageUrl: Joi.string().required(),
    heat: Joi.number().required().min(1).max(10),
    userId: Joi.string().required().alphanum(),
  },
});

// const imageSauce = Joi.binary().required();

exports.checkSauceData = (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  const checkedData = sauceJoiSchema.validate(req.body);
  // const checkedImage = imageSauce.validate(req.file);
  if (checkedData.error /*|| checkedImage.error*/) {
    console.log(checkedData.error);
    return errorMessage(res);
  } else {
    next();
  }
};

// const likeJoiSchema = Joi.object({});
