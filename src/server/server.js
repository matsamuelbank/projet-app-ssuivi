// Importation des modules nécessaires
const http = require('http'); // Module pour créer le serveur HTTP
const app = require('./app'); // Importation de l'application Express

// Fonction pour normaliser le port sur lequel le serveur va écouter
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // Si le port n'est pas un nombre, retourne la valeur brute
    return val;
  }
  if (port >= 0) {
    // Si le port est un nombre positif, retourne le port
    return port;
  }
  return false; // Si le port est négatif, retourne false
};

// Définition du port d'écoute du serveur
const port = normalizePort(process.env.PORT || '3001');
app.set('port', port); // Configuration du port de l'application Express

// Gestionnaire d'erreurs
const errorHandler = error => {  
  if (error.syscall !== 'listen') {
    throw error; // Si l'erreur ne concerne pas l'écoute du serveur, lance l'erreur
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      // Si l'erreur est due à des privilèges insuffisants, affiche un message d'erreur et termine le processus
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // Si l'erreur est due à un port déjà utilisé, affiche un message d'erreur et termine le processus
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error; // Si l'erreur est d'un autre type, lance l'erreur
  }
};

// Création du serveur HTTP
const server = http.createServer(app);

// Configuration des gestionnaires d'événements pour le serveur
server.on('error', errorHandler); // En cas d'erreur, appelle le gestionnaire d'erreurs
server.on('listening', () => {
  // Lorsque le serveur commence à écouter, affiche un message indiquant sur quel port il écoute
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Le serveur commence à écouter sur le port spécifié
server.listen(port);
