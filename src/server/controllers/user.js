const bcrypt = require('bcrypt'); //on importe le package de cryptage de mdp
const jwt  = require('jsonwebtoken')
const User = require('../models/User'); //ici on recupère notre modele ou table depuis le cluster de la bdd 

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.motDePasse, 10)
    .then(hash => {
      const user = new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        langue: req.body.langue,
        identifiant: req.body.identifiant,
        motDePasse: hash
      });

      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => {
          console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
          res.status(400).json({ error: 'Erreur lors de la sauvegarde de l\'utilisateur' });
        });
    })
    .catch(error => {
      console.error('Erreur lors du hashage du mot de passe:', error);
      res.status(500).json({ error: 'Erreur lors du hashage du mot de passe' });
    });
};


exports.login = async (req, res, next) => {
    try {
      const user = await User.findOne({ identifiant: req.body.identifiant });
      if (!user) {
        console.log('Utilisateur non trouvé');
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
  
      const valid = await bcrypt.compare(req.body.motDePasse, user.motDePasse);
      if (!valid) {
        console.log('Mot de passe incorrect');
        return res.status(401).json({ error: 'Mot de passe incorrect !' });
      }
  
      const token = jwt.sign(
        { userId: user._id },
        'RANDOM_TOKEN_SECRET',
        { expiresIn: '24h' }
      );
      
      res.cookie('token', token, {
        httpOnly: true,
        // secure: true,  // à décommenter en production
        // domain: 'your-domain.com',  // à décommenter en production
        maxAge: 3600000  // expire après 1 heure
      });
      console.log('Cookie envoyé:', res.get('Set-Cookie'));
      res.status(200).json({
        status: 200,
        userId: user._id,
        userName: user.nom,
        userFirstName: user.prenom,
        userLanguage: user.langue,
        userLogin: user.identifiant,
        token: token
      });
      
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  };

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Déconnecté' });
};

exports.userlist = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};


