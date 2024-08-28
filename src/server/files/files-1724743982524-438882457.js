const Thing = require('../models/Thing');
const fs = require('fs'); //package node file system(fs) il permet d'interragir avec le système de fichier du serveur

exports.createThing = (req, res, next) => {
   const thingObject = JSON.parse(req.body.thing);// on recupere ce que l'on envoie coté client (c'est un objet convertie en string et ici on utilse parse pour le remetre en json )
   delete thingObject._id;
   delete thingObject._userId;
   const thing = new Thing({
       ...thingObject,
       userId: req.auth.userId,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });
 
   thing.save()
   .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
   .catch(error => { res.status(400).json( { error })})
};

//Fonction pour recupérer un article précis grace a son _id recu de la requette( requette type get)
exports.getOneThing = (req, res, next) => {
    //on utilise la fonction findOne pour faire cette recherche 
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//fonction qui permet de modifier les information d'un article précis grace a son id (type de  requette put)
exports.modifyThing = (req, res, next) => {
   const thingObject = req.file ? {
       ...JSON.parse(req.body.thing),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
 
   delete thingObject._userId;
   Thing.findOne({_id: req.params.id})//on fait une recherche dans le model Thing en bdd
       .then((thing) => {
           if (thing.userId != req.auth.userId) {
               res.status(401).json({ message : 'Not authorized'});
           } else {
               Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
               .then(() => res.status(200).json({message : 'Objet modifié!'}))
               .catch(error => res.status(401).json({ error }));
           }
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
};

//fonction pour supprimer un article précis grace à son _id passé en paramètre  qu'on recupère dans le corps de la requette(type requette delete)
exports.deleteThing = (req, res, next) => {
   Thing.findOne({ _id: req.params.id}) //recupeère l'objet thing dans la bdd correspondant a cet id 
       .then(thing => {
          if (thing.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
          }
          else {
            const filename = thing.imageUrl.split('/images/')[1];//requpère le nom de l'img
            //supprésion du fichier grace a la fonction unlink du file system(fs) 
            //qui prend en params l'url du fichier a supprimer et une fonction callback qui va s'executer après suppression du fichier
            fs.unlink(`images/${filename}`, 
            //fonction callback qui va supprimer l'objet thing dans la bdd 
            () => {
                Thing.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
          }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

//fonction pour recupérer tous les articles (type de requette get)
exports.getAllStuff = (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};