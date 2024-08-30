

const express = require('express');
const app = express(); // Création de l'application express

const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000',  // Spécifie l'origine autorisée
  credentials: true,  // Autorise les cookies
};

app.use(cors(corsOptions)); // Utilisation du middleware CORS avec les options spécifiques

// Middleware pour traiter les données JSON
app.use(express.json());

const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');
const path = require('path');


mongoose.connect('ici il faut mettre votre chaine de connexion à votre cluster mongodb')

.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/api/project', projectRoutes);
app.use('/api/user', userRoutes); // Utilisation les routes définies dans userRoutes, /api/user sera l'url de base pour ces routes
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
