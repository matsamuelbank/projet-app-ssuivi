import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';

const Task = ({ task, toggleTaskCompletion }) => {
  return (
    <Paper
      sx={{
        padding: 2,
        margin: 1,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6">{task.nameTask}</Typography>
      <Typography variant="body2">{task.descriptionTask}</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Due Date"
          value={dayjs(task.dueDateTask)}
          readOnly
          slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
        />
      </LocalizationProvider>
      <Typography variant="body2">
        Assigné à : {task.assignedUsersTask.map(user => `${user.prenom} ${user.nom}`).join(', ')}
      </Typography>
      <Switch
        checked={task.isCompleted}
        onChange={() => toggleTaskCompletion(task._id)}
        inputProps={{ 'aria-label': 'controlled' }}
      />
    </Paper>
  );
};

export function Project() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((store) => store.USERINFO.userInfo);
  const token = userInfo?.token;
  const [nameProject, setProjectName] = useState('');
  const [descriptionProject, setDescription] = useState('');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [assignedUsersProject, setAssignedUsersProject] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [files, setFiles] = useState([]);
  const [idUserCreator, setIdUserCreator] = useState({});
  const [isCompletedProject, setCompletedProject] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [updatedTasks, SetupdatedTasks] = useState([])
 

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/project/infoproject/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const project = response.data;
        setProject(response.data);
        setDescription(project.descriptionProject);
        setProjectName(project.nameProject);
        setStartDate(dayjs(project.startDateProject));
        setEndDate(dayjs(project.endDateProject));
        setAssignedUsersProject(project.assignedUsersProject);
        setSelectedUserIds(project.assignedUsersProject.map(user => user._id));
        setFiles(project.files);
        setIdUserCreator(project.idUserCreator);
        setCompletedProject(project.isCompleted);
        setTasks(project.tasks);
        console.log(project)
        console.log(project.tasks)
      } catch (error) {
        console.error('Failed to fetch project details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectDetails();
    }
  }, [id, token]);

  async function updateProject() {
    const formData = new FormData();
    
    formData.append("nameProject", nameProject);
    formData.append("descriptionProject", descriptionProject);
    formData.append('startDateProject', startDate);
    formData.append('endDateProject', endDate);
    formData.append('idUserCreator', idUserCreator._id); 
    console.log(idUserCreator._id) // Send as a string
    formData.append('isCompleted', isCompletedProject);
    selectedUserIds.forEach(userId => formData.append("assignedUsersProject", userId));
    
    files.forEach(file => formData.append("files", file));
    
    const tasksToAppend = updatedTasks.length > 0 ? updatedTasks : tasks;
    tasksToAppend.forEach(task => {
      formData.append("tasks", JSON.stringify(task)); 
      console.log(tasksToAppend) 
    });
  
    try {
      const response = await axios.put(`http://localhost:3001/api/project/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log('Projet mis à jour avec succès', response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet', error);
    }
  }
  
  // Fonction de téléchargement des fichiers
  async function downloadFile(fileName) {
    try {
      const response = await axios.get(`http://localhost:3001/api/project/download/${fileName}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error('Échec du téléchargement du fichier');
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Nettoyage après le téléchargement
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  }


  const handleUserChange = (event) => {
    const value = event.target.value;
  
    // Met à jour selectedUserIds avec les nouvelles valeurs sélectionnées
    // si value est un tableau ? on remplace directement si non on cree un table avec split et separe les string par des virgules
    setSelectedUserIds(Array.isArray(value) ? value : value.split(','));
  
    console.log("Liste des utilisateurs sélectionnés:", value);
  };
  
  
  const handleSwitchChange = (e) => {
    const newValue = e.target.checked;
    setCompletedProject(newValue);
    console.log('Nouvelle valeur de isCompletedProject:', newValue);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task._id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      );
      SetupdatedTasks(updatedTasks)
      console.log(updatedTasks)
      return [...updatedTasks];
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }
  return (
    <Box component="form" sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant='h4' value={nameProject} onChange={(e) => setProjectName(e.target.value)}>
        {nameProject || 'Nom du projet'}
      </Typography>
    
      <TextField 
        label="Description" 
        value={descriptionProject} 
        onChange={(e) => setDescription(e.target.value)} 
        multiline 
        rows={4} 
        fullWidth 
        margin="normal"
      />
  
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date de Début"
          value={startDate}
          onChange={(date) => setStartDate(date)}
          slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
        />
        <DatePicker
          label="Date de Fin"
          value={endDate}
          onChange={(date) => setEndDate(date)}
          slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
        />
      </LocalizationProvider>
  
      <Select 
        multiple 
        value={selectedUserIds} 
        onChange={handleUserChange}
        fullWidth 
        margin="dense"
      >
        {assignedUsersProject && assignedUsersProject.map((user) => (
          <MenuItem key={user._id} value={user._id}>
            {user.prenom + " " + user.nom}
          </MenuItem>
        ))}
      </Select>
  
      <Box sx={{ mt: 4 }}>
        {tasks.map((task) => (
          <Task key={task._id} task={task} toggleTaskCompletion={toggleTaskCompletion} />
        ))}
      </Box>
  
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Fichiers du projet :</Typography>
        {files.map((file, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {file}
            </Typography>
            <Button variant="contained" onClick={() => downloadFile(file)}>Télécharger</Button>
          </Box>
        ))}
      </Box>

      <Box mt={2} display="flex" justifyContent="space-between">
        <Switch
          checked={isCompletedProject}
          onChange={handleSwitchChange}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        {isCompletedProject === false ? "Le projet n'est pas encore terminé." : "Le projet est terminé , vous pouvez valider l'ensemble des modifications."}
        <Button onClick={updateProject} variant="outlined">Enregistrer les modifications</Button> 
      </Box>
    </Box>
  );
  
}
