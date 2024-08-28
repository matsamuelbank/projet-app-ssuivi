const multer = require('multer');
const path = require('path');

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'files/'); // Dossier où les fichiers seront sauvegardés
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Application du middleware de gestion des fichiers
const upload = multer({ storage: storage });

module.exports = upload;
