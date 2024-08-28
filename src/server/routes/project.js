const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const projectController = require('../controllers/project');
const upload = require('../middleware/upload'); // Chemin vers votre middleware

// Route pour ajouter un projet avec des fichiers
router.post('/addProject', upload.array('files'), projectController.addProject);
// Route pour récupérer la liste des projets
router.get('/listproject', auth, projectController.getListProject);
// Route pour récupérer les détails d'un projet
router.get('/infoproject/:projectId', auth, projectController.getInfoProject);
router.get('/download/:fileName', auth, projectController.downloadFile);

module.exports = router;