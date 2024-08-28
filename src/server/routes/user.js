const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const auth = require('../middleware/auth');

router.get('/listuser', auth, userController.userlist); // Route pour récupérer tous les utilisateurs
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;
