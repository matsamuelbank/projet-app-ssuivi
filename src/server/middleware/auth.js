const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //on décode le token grace au mot secret 
       const userId = decodedToken.userId; //on extrait l'id utilisateur present dans le token 
       //Si le token est valide, la requête est transmise au contrôleur de la route avec l’ID de l’utilisateur ajouté
       req.auth = {
           userId: userId //on crée un objet auth et on envoie le token dans la requette de ce middleware
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};
