const jwt = require("jsonwebtoken");

// Vérifie si l'utilisateur possède un token valide et si l'id contenu dans la partie charge utile (payload) correspond bien à l'id de l'utilisateur propriétaire de la sauce ciblée par la requête
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, `${process.env.TOKEN_SECRETKEY}`);
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "403 : Requête non autorisée !";
    } else {
      next();
    }
  } catch (err) {
    res.status(401).json({ err: err });
  }
};
