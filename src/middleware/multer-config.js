const multer = require("multer");

// Définie les types mimes possibles des images dans la requête pour générer l'extension du fichier
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Filtre des types de fichiers accéptés (jpg, jpeg, png)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(
      new Error(
        "Le type de fichier est invalide (fichiers jpg, jpeg ou png uniquement)"
      )
    );
  }
};

// Configuration de multer avec définition du dossier de stockage ("images") et du nom de l'image contenu dans la requête (nom d'origine avec remplacement des éventuels espaces par des underscores + timestamp de la création + extension selon le type mime)
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name}${Date.now()}.${extension}`);
  },
});

module.exports = multer({ fileFilter, storage }).single("image");
