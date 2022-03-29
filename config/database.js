const mongoose = require("mongoose");

// Configuration pour connexion à la BDD MongoDB
(async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connexion MongoDb OK !");
  } catch {
    console.log("Connexion MongoDB KO !");
  }
})();
