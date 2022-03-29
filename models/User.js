const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Schéma Mongoose pour un utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Vérifie que l'email n'est pas déjà utilisé dans la BDD par un autre utilisateur
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
