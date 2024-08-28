const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    nom: { type: String, required: true },
    prenom: {type: String , required: true},
    langue: {type: String , required: true},
    identifiant: {type: String, required: true},
    motDePasse: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
