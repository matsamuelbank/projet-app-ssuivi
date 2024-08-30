const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware pour l'authentification

const projectController = require('../controllers/project'); // Contrôleur pour la logique liée aux projets
const upload = require('../middleware/upload'); // Middleware pour les téléchargements de fichiers

// Route pour ajouter un projet avec des fichiers
router.post('/addProject', upload.array('files'), projectController.addProject);

// Route pour mettre à jour un projet avec des fichiers
router.put('/update/:projectId', upload.array('files'), projectController.updateProject);

// Route pour récupérer la liste des projets
router.get('/listproject', auth, projectController.getListProject);

// Route pour récupérer les détails d'un projet
router.get('/infoproject/:projectId', auth, projectController.getInfoProject);

// Route pour télécharger un fichier
router.get('/download/:fileName', auth, projectController.downloadFile);

module.exports = router;