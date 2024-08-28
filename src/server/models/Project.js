
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const projectSchema = new mongoose.Schema({
  nameProject: { type: String, required: true },
  descriptionProject: { type: String, required: true },
  startDateProject: { type: Date, required: true },
  endDateProject: { type: Date, required: true },
  assignedUsersProject: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  files: [String],
  idUserCreator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isCompleted: { type: Boolean, default: false }, // Nouveau champ pour indiquer si le projet est terminé
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] // Liste des IDs des tâches associées
});

  projectSchema.plugin(uniqueValidator);

  module.exports = mongoose.model('Project', projectSchema);
  
