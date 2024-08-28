const Project = require('../models/Project'); //ici on recupère notre modele ou table depuis le cluster de la bdd 
const Task = require('../models/Task');
const dayjs = require('dayjs'); // Importation de dayjs pour formater les dates
const path = require('path');
const fs = require('fs'); 

exports.addProject = async (req, res) => {
  try {
    // Création du projet
    const projectData = {
      nameProject: req.body.nameProject,
      descriptionProject: req.body.descriptionProject,
      startDateProject: req.body.startDateProject,
      endDateProject: req.body.endDateProject,
      assignedUsersProject: req.body.assignedUsersProject,
      files: req.files.map(file => file.filename),
      idUserCreator: req.body.idUserCreator,
      isCompleted: false // Le projet commence non terminé
    };

    const newProject = new Project(projectData);
    const savedProject = await newProject.save();

    // Création des tâches associées
    const tasks = req.body.tasks ? JSON.parse(req.body.tasks) : [];

    const taskPromises = tasks.map(task => {
      const taskData = {
        nameTask: task.nameTask,
        descriptionTask: task.descriptionTask,
        dueDateTask: task.dueDateTask,
        assignedUsersTask: task.assignedUsersTask ? task.assignedUsersTask : [],
        createdBy: req.body.idUserCreator,
        projectId: savedProject._id,
        isCompleted: false // Les tâches commencent non terminées
      };

      const newTask = new Task(taskData);
      return newTask.save();
    });

    //savedTasks contiendra toutes les taches qui seront sauvegardées
    const savedTasks = await Promise.all(taskPromises);

    // Mise à jour du projet avec les IDs des tâches associées(on parcours le models des taches qu'on vient de cree et recupere toutes ces taches pour les rajouter aux tableau Tasks du projet)
    savedProject.tasks = savedTasks.map(task => task._id);
    await savedProject.save();

    res.status(201).json({
      message: 'Projet et tâches créés avec succès',
      project: savedProject,
      tasks: savedTasks
    });
  } catch (error) {
    console.error('Erreur lors de la création du projet et des tâches:', error);
    res.status(500).json({ error: 'Erreur lors de la création du projet et des tâches' });
  }
};

exports.getListProject = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // Recherche des projets où l'utilisateur est soit le créateur, soit assigné
    const projectList = await Project.find({
      $or: [
        { idUserCreator: userId },
        { assignedUsersProject: userId }
      ]
    }) // Cette fonction populate ou transforme idUserCreator en un objet et rajoute les champs nom et prenom et leurs valeurs
    .populate('idUserCreator', 'nom prenom') // Popule le champ idUserCreator avec nom et prenom (cela transforme idUserCreator en objet complet User correspondant donc ca sera un utilisateur et on ne recupere que son nom et prenom)
    .populate('assignedUsersProject', 'nom prenom'); // Popule le champ assignedUsersProject avec nom et prenom

    if (!projectList || projectList.length === 0) {
      return res.status(404).json({ message: 'Aucun projet trouvé pour cet utilisateur.' });
    }

    // Formatage des dates et structuration des données
    const formattedProjectList = projectList.map(project => ({
      _id: project._id,
      nameProject: project.nameProject,
      descriptionProject: project.descriptionProject,
      startDateProject: dayjs(project.startDateProject).format('MM/DD/YYYY'),
      endDateProject: dayjs(project.endDateProject).format('MM/DD/YYYY'),
      idUserCreator: {
        _id: project.idUserCreator._id,
        nom: project.idUserCreator.nom,
        prenom: project.idUserCreator.prenom,
      },
      assignedUsersProject: project.assignedUsersProject.map(user => ({
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom
      })),
      isCompleted: project.isCompleted,
      tasks: project.tasks //formatage des tâches si nécessaire
    }));

    res.status(200).json(formattedProjectList);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des projets.' });
  }
};

exports.getInfoProject = async (req, res) => {
  try {
    const { projectId } = req.params; // Récupération de l'ID du projet à partir des paramètres de la requête
    const userId = req.auth.userId; // ID de l'utilisateur authentifié
    
    // Trouver le projet avec l'ID spécifié et inclure les informations des utilisateurs associés
    const project = await Project.findById(projectId)
      .populate('idUserCreator', 'nom prenom') // Populate pour obtenir les informations du créateur
      .populate('assignedUsersProject', 'nom prenom') // Populate pour obtenir les informations des utilisateurs assignés
      .populate({
        path: 'tasks',
        populate: {
          path: 'assignedUsersTask',
          select: 'nom prenom'
        }
      }) // Populate pour obtenir toutes les informations des tâches et des utilisateurs assignés
      .exec();

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé.' });
    }

    if (project.idUserCreator._id.toString() !== userId && !project.assignedUsersProject.some(user => user._id.toString() === userId)) {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du projet:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des détails du projet.' });
  }
};

exports.downloadFile = (req, res) => {
  const fileName = req.params.fileName; // recupère le nom du fichier transmis dans la requette
  const filePath = path.join(__dirname, '../files', fileName);// Construit le chemin absolu du fichier

  // Vérifie si le fichier existe avant de tenter de le télécharger
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Fichier non trouvé');
  }

  res.download(filePath, fileName, (err) => { // Envoie le fichier au client
    if (err) {
      console.error('Erreur lors du téléchargement du fichier:', err);
      return res.status(500).send('Erreur lors du téléchargement du fichier');
    }
  });
};