const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const taskSchema = new mongoose.Schema({
  nameTask: { type: String, required: true },
  descriptionTask: { type: String, required: true },
  dueDateTask: { type: Date, required: true },
  assignedUsersTask: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  isCompleted: { type: Boolean, default: false } 
});

taskSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Task', taskSchema);